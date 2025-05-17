import os
import json
import asyncio
from google import genai
# import genai.types # <-- Removed import
import xml.etree.ElementTree as ET # Keep just in case, though aiming for JSON
from pydantic import BaseModel, Field
from typing import List, Optional, Union
from collections import defaultdict

# --- Custom Exception ---
class AnalysisError(Exception):
    """Custom exception for errors during the analysis process."""
    pass
# ----------------------

# Load the taxonomy from the JSON file
# Consider making the path relative to this file or using absolute paths
try:
    # Adjusted path assuming analysis_module.py is in app/ and taxonomy_kb.json is in the root
    taxonomy_path = os.path.join(os.path.dirname(__file__), '..', 'taxonomy_kb.json')
    with open(taxonomy_path, 'r') as f:
        taxonomy_kb = json.load(f)
    taxonomy = taxonomy_kb.get('taxonomy', {}) # Use .get for safety
except FileNotFoundError:
    print(f"Warning: taxonomy_kb.json not found at expected path {taxonomy_path}. Tactic information might be limited.")
    taxonomy = {}
except json.JSONDecodeError:
    print(f"Warning: Could not decode taxonomy_kb.json at {taxonomy_path}. File might be corrupted.")
    taxonomy = {}

# Load API key securely from environment variable
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # In a real app, might raise error or use a config system
    raise ValueError("GEMINI_API_KEY environment variable not set.")

# Initialize the client (consider if initialization should happen elsewhere, e.g., on app startup)
# For simplicity, keeping it here for now.
try:
    client = genai.Client(api_key=api_key)
except Exception as e:
    print(f"Error initializing GenAI client: {e}")
    # Depending on desired behavior, might raise the exception or handle it
    client = None # Ensure client is None if init fails
    # Reraise as AnalysisError for clarity
    raise AnalysisError(f"Failed to initialize GenAI client: {e}") from e


# Removed _extract_prompt_id function


# --- Pydantic Models for Structured Output (aligned with UI_jsonExpectation.md) ---
class Metadata(BaseModel):
    author: Optional[str] = Field(description="Author of the text, null if not determined")
    date: str = Field(description="Date of analysis in YYYY-MM-DD format")
    overallIntent: str = Field(description="Overall assessed intent, e.g., 'Primarily Manipulation'")
    confidenceScore: Optional[int] = Field(default=None, description="Confidence score (0-100) as a number") # Changed name and type
    tacticDensity: Optional[str] = Field(default=None, description="Density of tactics, e.g., 'High', 'Medium', 'Low'") # Keep optional
    input_data_description: Optional[str] = Field(default=None, description="Description of the input source") # Keep optional

class ExecutiveSummary(BaseModel): # Keep this as backend might use it, UI ignores if not needed
    primary_intent: str = Field(description="Overall assessed intent")
    confidence_score: str # Keeping as string here as it aligns with backend example for this specific section
    tactic_density: str = Field(description="Density of tactics")
    dominant_tactics: str = Field(description="Most prominent tactics used")
    structural_bias: str = Field(description="Underlying biases in the text's structure")

# --- New structure for intentBreakdown to match UI --- 
class IntentBreakdownItem(BaseModel):
    name: str = Field(description="Intent classification name (e.g., 'Blatant Manipulation')")
    value: int = Field(description="Count of tactics with this intent")
# -----------------------------------------------------

# --- New structure for manipulationByCategory to match UI (will be calculated post-API call) --- 
class ManipulationCategory(BaseModel):
    name: str = Field(description="Category name")
    blatant: int = Field(description="Count of blatant tactics in this category")
    borderline: int = Field(description="Count of borderline tactics in this category")
# -----------------------------------------------------

class OverallAssessment(BaseModel): # Keep this as backend might use it, UI ignores if not needed
    summary_text: str = Field(description="Full text summary of the overall assessment")
    confidence_score_note: str = Field(description="Note explaining the confidence score")

class Tactic(BaseModel):
    id: int
    name: str = Field(description="Name of the tactic from the taxonomy")
    category: str = Field(description="Category of the tactic")
    intent: str = Field(description="Classification: 'Legitimate Use', 'Borderline Manipulation', or 'Blatant Manipulation'") # Renamed from intent_qualifier
    quote: str = Field(description="Specific text excerpt where the tactic is used")
    explanation: str = Field(description="Explanation of how the tactic is used and classified")
    resistanceStrategy: str = Field(description="How to recognize and resist the tactic") # Renamed from resistance_strategy
    sources: str = Field(description="Shortened URL's of sources used to justify the tactic")

class DetailedReportSections(BaseModel): # Keep this as backend might use it, UI ignores if not needed
    confidence_levels_discussion: str
    context_handling: str
    persuasion_vs_manipulation_distinction: str
    manipulative_elements_summary: str

# Main structure requested from the API (manipulationByCategory added later)
class AnalysisResultFromAPI(BaseModel):
    metadata: Metadata
    executive_summary: ExecutiveSummary
    intentBreakdown: List[IntentBreakdownItem] # Changed structure
    overall_assessment: OverallAssessment
    tactics: List[Tactic]
    detailed_report_sections: DetailedReportSections

# Final structure returned by the endpoint (includes calculated fields)
class FinalAnalysisResult(AnalysisResultFromAPI):
    manipulationByCategory: List[ManipulationCategory]
# --------------------------------------------


# Renamed from run_dae, removed @log_telemetry decorator
async def run_wise(file_content: str) -> dict:
    """Runs WISE analysis, gets structured JSON, adds icons & category counts, returns dict or raises error."""
    if not client:
        raise AnalysisError("GenAI client is not initialized.")

    print("Running WISE analysis (async)... requesting structured JSON...")
    model_name = "models/gemini-2.0-flash" 
    contents = [ "Persona: Informed Persuasion Analyst",

        # Objective and text remain the same
        f"Objective: Deconstruct and analyse the following text to detect and distinguish between legitimate persuasion vs purposeful manipulation:\n--- START TEXT ---\n{file_content}\n--- END TEXT ---",

        # Process instructions remain mostly the same
        "Process (Chain-of-Thought):",
        "1.  Identify author's Stated Goal: What does the author explicitly say they want to achieve with this communication?",
        "2.  List Persuasive Tactics Used: Identify all manipulative tactics present in the text using the provided taxonomy (taxonomy_kb.json).",
        "3.  Assess Necessity of Tactics: Are these tactics necessary to achieve the stated goal, or are they excessive and primarily intended to manipulate the audience's emotions or beliefs?",
        "4.  Infer Author's Intent: Based on the above factors, determine the author's likely intent: Primarily to inform/persuade rationally, or primarily to manipulate/deceive? Provide a confidence score (as a number 0-100) for this assessment.", # Specify number type for confidence
        "5. Identify Factual Claims: Scrutinise the text for specific, verifiable factual claims (e.g., statistics, dates, events). Prioritise claims that are central to the speaker's argument or that seem questionable.",
        "6. Identify grounded and ethical resistance strategies for each identified tactic.",
        "7. If the text is making unsubstantiated claims of fact, or twisting facts to strengthen an identified tactic:  use web search to source evidence that either directly disproves or challenges such claims, choose the (maximum) 3 most relevant and trustworthy sources to provide the URL of in the output, use shortened Bit.ly style URL's"

        # Implementation instructions updated
        "Implementation (Directional-Stimulus Prompting):",
        "Intent Qualifiers: Classify the severity of each tactic as:",
        "Legitimate Use: Justifiable in context.",
        "Borderline Manipulation: Potentially misleading.",
        "Blatant Manipulation: Clearly intended to deceive."
        "Fact-Checking Priority: Prioritise fact-checking claims that are used to support manipulative tactics or that appear to be misleading or unsubstantiated. If a claim is easily verifiable and directly relevant to assessing the speaker's intent, include a fact-checking source.",

        "Tactic Analysis: For each tactic, provide the following:",
        "Example Quote: The specific text excerpt where the tactic is used.",
        "Tactic Name: The name of the tactic from the taxonomy.",
        "Intent: 'Legitimate Use,' 'Borderline Manipulation,' or 'Blatant Manipulation.' Justify this classification.", # Renamed field
        "Explanation: Explain how the tactic is being used and why it falls into the chosen Intent category.",
        "resistanceStrategy: How to recognize and resist the tactic.", # Renamed field
        "If Applicable Fact checking sources: Up to 3 URLs for sources that directly disprove or challenge claims. Only include URLs from highly reputable sources (e.g., government agencies, academic institutions, established news organisations with strong fact-checking policies). Provide a very short description of what each source says."

        # Output Format Instructions Updated
        "Output Format: IMPORTANT - Adhere strictly to the requested JSON schema.",
        "Specifically, provide the results for 'metadata', 'executive_summary', 'intentBreakdown', 'overall_assessment', 'tactics', and 'detailed_report_sections'.",
        "For 'metadata.confidenceScore', provide a single number between 0 and 100.",
        "For 'intentBreakdown', provide a list of objects, where each object has a 'name' (string, e.g., 'Blatant Manipulation') and a 'value' (number, the count of tactics matching that intent).",
        "Do NOT include the 'manipulationByCategory' field in your response."
    ]


    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=model_name,
            contents=contents,
            config={ 
                'response_mime_type': "application/json",
                'response_schema': AnalysisResultFromAPI # Requesting the structure *before* backend processing
            }
        )

        if hasattr(response, 'text'):
            print("WISE analysis API call successful. Processing response...")
            prompt_id = "wise_analysis"

            try:
                result_data = json.loads(response.text)
                
                # --- Backend Processing: Add Icons and Calculate Category Counts --- 
                processed_tactics = []
                category_counts = defaultdict(lambda: {'blatant': 0, 'borderline': 0})
                
                if 'tactics' in result_data and isinstance(result_data['tactics'], list):
                    for tactic in result_data['tactics']:
                        # Aggregate counts for manipulationByCategory
                        category = tactic.get('category')
                        intent = tactic.get('intent')
                        if category:
                            if intent == 'Blatant Manipulation':
                                category_counts[category]['blatant'] += 1
                            elif intent == 'Borderline Manipulation':
                                category_counts[category]['borderline'] += 1
                        
                        processed_tactics.append(tactic) # Add potentially modified tactic
                    
                    result_data['tactics'] = processed_tactics # Update tactics list in result
                
                # Construct manipulationByCategory list
                manipulation_by_category_list = []
                for category_name, counts in category_counts.items():
                    manipulation_by_category_list.append({
                        'name': category_name,
                        'blatant': counts['blatant'],
                        'borderline': counts['borderline']
                    })
                
                # Add the calculated list to the final result
                result_data['manipulationByCategory'] = manipulation_by_category_list
                # -----------------------------------------------------------------
                
                # TODO: Optionally validate the final result_data against FinalAnalysisResult model
                # try:
                #     validated_result = FinalAnalysisResult.model_validate(result_data)
                #     return {"result": validated_result.model_dump(), "prompt_id": prompt_id}
                # except ValidationError as val_e:
                #      print(f"ERROR: Final data failed Pydantic validation: {val_e}")
                #      # Decide how to handle validation failure: return partial, error, etc.
                #      return {"result": result_data, "prompt_id": prompt_id, "error": "PostProcessingValidationError"}

                print("Backend processing complete.")
                return result_data # <<< Return the processed data directly
            
            except json.JSONDecodeError as json_e:
                print(f"ERROR: Failed to parse GenAI response as JSON: {json_e}")
                # Re-raise as AnalysisError for consistent handling in main.py
                raise AnalysisError(f"Failed to parse GenAI JSON response: {json_e}") from json_e 
            
            except Exception as proc_e: # Catch errors during backend processing
                print(f"ERROR: Failed during backend processing of API response: {proc_e}")
                # Re-raise as AnalysisError
                raise AnalysisError(f"Backend processing failed: {proc_e}") from proc_e

        else:
             print(f"Warning: GenAI response did not contain expected text. Response: {response}")
             raise AnalysisError("GenAI Error: Response structure invalid.")

    except Exception as e:
        print(f"ERROR: GenAI API call failed: {e}")
        raise AnalysisError(f"GenAI API Call Error: {e}") from e

# --- Pydantic Models Definitions (moved to top for clarity) --- 

# (Models defined earlier in this edit block)

# Note: The example 'intentBreakdown' in the prompt looks malformed.
# It shows repeated 'name' keys, which is invalid JSON.
# Assuming it should be a list of objects or a dict mapping names to values.
# Let's model it as a dictionary for now, but this might need adjustment.
class IntentBreakdown(BaseModel):
    blatant_manipulation: Optional[str] = Field(alias="Blatant Manipulation", default=None, description="Count or indicator of blatant manipulation tactics")
    borderline_manipulation: Optional[str] = Field(alias="Borderline Manipulation", default=None, description="Count or indicator of borderline manipulation tactics")
    legitimate_use: Optional[str] = Field(alias="Legitimate Use", default=None, description="Count or indicator of legitimate persuasion tactics")
    # Simplified to Optional[str] to avoid 'anyOf' schema issues.

class AnalysisResult(BaseModel):
    metadata: Metadata
    executive_summary: ExecutiveSummary
    intentBreakdown: IntentBreakdown # Adjusted structure based on assumption
    overall_assessment: OverallAssessment
    tactics: List[Tactic]
    detailed_report_sections: DetailedReportSections
# -------------------------------------------- 