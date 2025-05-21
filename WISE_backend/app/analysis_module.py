import os
import json
import asyncio
from google import genai
import xml.etree.ElementTree as ET #
from pydantic import BaseModel, Field, ValidationError 
from typing import List, Optional, Union
from collections import defaultdict

# Import models from app.models to avoid duplication
from app.models import (
    Metadata,
    ExecutiveSummary,
    IntentBreakdownItem,
    ManipulationCategory,
    OverallAssessment,
    Tactic,
    DetailedReportSections,
    AnalysisResultFromAPI, # This is the structure expected from GenAI
    FinalAnalysisResult # This is the final structure the endpoint will return
)

# --- Custom Exception ---
class AnalysisError(Exception):
    """Custom exception for errors during the analysis process."""
    pass
# ----------------------

# Load the taxonomy from the JSON file
try:
    taxonomy_path = os.path.join(os.path.dirname(__file__), '..', 'taxonomy_kb.json')
    with open(taxonomy_path, 'r') as f:
        taxonomy_kb = json.load(f)
    taxonomy = taxonomy_kb.get('taxonomy', {})
except FileNotFoundError:
    print(f"Warning: taxonomy_kb.json not found at expected path {taxonomy_path}. Tactic information might be limited.")
    taxonomy = {}
except json.JSONDecodeError:
    print(f"Warning: Could not decode taxonomy_kb.json at {taxonomy_path}. File might be corrupted.")
    taxonomy = {}


async def run_wise(file_content: str, user_api_key: str) -> dict:
    """
    Runs WISE analysis using the provided user_api_key,
    gets structured JSON, adds icons & category counts,
    returns dict or raises AnalysisError.
    """
    if not user_api_key:
        raise AnalysisError("API key was not provided for GenAI client initialization.")

    try:
        current_request_client = genai.Client(api_key=user_api_key)
        print("GenAI client initialized successfully with user-provided key for this request.")
    except Exception as e:
        print(f"Error initializing GenAI client with user-provided key: {e}")
        raise AnalysisError(f"Failed to initialize GenAI client with the provided API key. Please check the key. Original error: {e}") from e

    print("Running WISE analysis (async)... requesting structured JSON...")
    model_name = "models/gemini-2.0-flash" 

    # Prompt content (ensure constants are loaded if these strings are moved to constants.py)
    contents = [ "Persona: Informed Persuasion Analyst",
        f"Objective: Deconstruct and analyse the following text to detect and distinguish between legitimate persuasion vs purposeful manipulation:\n--- START TEXT ---\n{file_content}\n--- END TEXT ---",
        "Process (Chain-of-Thought):",
        "1.  Identify author's Stated Goal: What does the author explicitly say they want to achieve with this communication?",
        "2.  List Persuasive Tactics Used: Identify all manipulative tactics present in the text using the provided taxonomy (taxonomy_kb.json).",
        "3.  Assess Necessity of Tactics: Are these tactics necessary to achieve the stated goal, or are they excessive and primarily intended to manipulate the audience's emotions or beliefs?",
        "4.  Infer Author's Intent: Based on the above factors, determine the author's likely intent: Primarily to inform/persuade rationally, or primarily to manipulate/deceive? Provide a confidence score (as a number 0-100) for this assessment.",
        "5. Identify Factual Claims: Scrutinise the text for specific, verifiable factual claims (e.g., statistics, dates, events). Prioritise claims that are central to the speaker's argument or that seem questionable.",
        "6. Identify grounded and ethical resistance strategies for each identified tactic.",
        "7. If the text is making unsubstantiated claims of fact, or twisting facts to strengthen an identified tactic:  use web search to source evidence that either directly disproves or challenges such claims, choose the (maximum) 3 most relevant and trustworthy sources to provide the URL of in the output, use shortened Bit.ly style URL's",
        "Implementation (Directional-Stimulus Prompting):",
        "Intent Qualifiers: Classify the severity of each tactic as:",
        "Legitimate Use: Justifiable in context.",
        "Borderline Manipulation: Potentially misleading.",
        "Blatant Manipulation: Clearly intended to deceive.",
        "Fact-Checking Priority: Prioritise fact-checking claims that are used to support manipulative tactics or that appear to be misleading or unsubstantiated. If a claim is easily verifiable and directly relevant to assessing the speaker's intent, include a fact-checking source.",
        "Tactic Analysis: For each tactic, provide the following:",
        "Example Quote: The specific text excerpt where the tactic is used.",
        "Tactic Name: The name of the tactic from the taxonomy.",
        "Intent: 'Legitimate Use,' 'Borderline Manipulation,' or 'Blatant Manipulation.' Justify this classification.",
        "Explanation: Explain how the tactic is being used and why it falls into the chosen Intent category.",
        "resistanceStrategy: How to recognize and resist the tactic.",
        "Output Format: IMPORTANT - Adhere strictly to the requested JSON schema.",
        "Specifically, provide the results for 'metadata', 'executive_summary', 'intentBreakdown', 'overall_assessment', 'tactics', and 'detailed_report_sections'.",
        "For 'metadata.confidenceScore', provide a single number between 0 and 100.",
        "For 'intentBreakdown', provide a list of objects, where each object has a 'name' (string, e.g., 'Blatant Manipulation') and a 'value' (number, the count of tactics matching that intent).",
        "Do NOT include the 'manipulationByCategory' field in your response."
    ]

    try:
        # Use the request-specific client
        response = await asyncio.to_thread(
            current_request_client.models.generate_content, # Use the request-specific client
            model=model_name,
            contents=contents,
            config={
                'response_mime_type': "application/json",
                # Requesting the structure *before* backend processing
                # Ensure AnalysisResultFromAPI is correctly defined in app.models
                'response_schema': AnalysisResultFromAPI
            }
        )

        if hasattr(response, 'text') and response.text:
            print("WISE analysis API call successful. Processing response...")
            try:
                # Validate and parse with Pydantic model AnalysisResultFromAPI
                api_result = AnalysisResultFromAPI.model_validate_json(response.text)
                result_data = api_result.model_dump() # Convert Pydantic model to dict

                # --- Backend Processing: Calculate Category Counts ---
                category_counts = defaultdict(lambda: {'blatant': 0, 'borderline': 0})
                
                if result_data.get('tactics') and isinstance(result_data['tactics'], list):
                    for tactic_item in result_data['tactics']: # tactic_item is already a dict here
                        category = tactic_item.get('category')
                        intent = tactic_item.get('intent')
                        if category:
                            if intent == 'Blatant Manipulation':
                                category_counts[category]['blatant'] += 1
                            elif intent == 'Borderline Manipulation':
                                category_counts[category]['borderline'] += 1
                
                manipulation_by_category_list = []
                for category_name, counts in category_counts.items():
                    manipulation_by_category_list.append({
                        'name': category_name,
                        'blatant': counts['blatant'],
                        'borderline': counts['borderline']
                    })
                
                result_data['manipulationByCategory'] = manipulation_by_category_list
                # -----------------------------------------------------------------

                # --- Only keep confidenceScore in metadata as string ---
                meta = result_data.get('metadata', {})
                score = meta.get('confidenceScore')
                if score is not None:
                    result_data['metadata']['confidenceScore'] = str(score)
                else:
                    result_data['metadata']['confidenceScore'] = ""
                # -----------------------------------------------------------------

                print("Backend processing complete.")
                return result_data # Return the dict

            except ValidationError as val_e:
                print(f"ERROR: GenAI response failed Pydantic validation: {val_e}")
                print(f"Raw GenAI response text: {response.text[:500]}...") # Log part of the raw response
                raise AnalysisError(f"GenAI response structure invalid or failed validation: {val_e}") from val_e
            except json.JSONDecodeError as json_e: # Should be caught by ValidationError if response_schema works
                print(f"ERROR: Failed to parse GenAI response as JSON: {json_e}")
                raise AnalysisError(f"Failed to parse GenAI JSON response: {json_e}") from json_e
            except Exception as proc_e:
                print(f"ERROR: Failed during backend processing of API response: {proc_e}")
                raise AnalysisError(f"Backend processing failed: {proc_e}") from proc_e
        elif hasattr(response, 'prompt_feedback') and response.prompt_feedback.block_reason:
            block_reason = response.prompt_feedback.block_reason
            block_message = response.prompt_feedback.block_message if hasattr(response.prompt_feedback, 'block_message') else "No specific message."
            print(f"Warning: GenAI content generation blocked. Reason: {block_reason}, Message: {block_message}")
            raise AnalysisError(f"GenAI content generation blocked: {block_reason}. {block_message}")
        else:
            print(f"Warning: GenAI response did not contain expected text or was empty. Response: {response}")
            raise AnalysisError("GenAI Error: Response structure invalid or empty.")

    except AnalysisError: # Re-raise known AnalysisErrors
        raise
    except Exception as e: # Catch other GenAI call errors
        print(f"ERROR: GenAI API call failed: {e}")
        # Check for specific API key errors if possible from 'e'
        if "API_KEY_INVALID" in str(e) or "API key not valid" in str(e): # Example error messages
            raise AnalysisError(f"GenAI API Call Error: The provided API key is invalid. Original error: {e}") from e
        raise AnalysisError(f"GenAI API Call Error: {e}") from e


# Removed the old IntentBreakdown and AnalysisResult Pydantic models from the end of this file
# as they were superseded by the ones at the top (now imported from app.models).