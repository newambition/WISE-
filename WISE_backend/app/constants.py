# WISE_backend/app/constants.py

"""
Constants used across the backend application.
"""

# File Paths
TAXONOMY_FILE_NAME = "taxonomy_kb.json"

# API Configuration
GEMINI_API_KEY_ENV_VAR = "GEMINI_API_KEY"
GEMINI_MODEL_NAME = "models/gemini-2.0-flash"
GEMINI_RESPONSE_MIME_TYPE = "application/json"

# Taxonomy and Analysis Constants
TAXONOMY_ROOT_KEY = "taxonomy"
TACTICS_KEY = "tactics"
CATEGORY_KEY = "category"
INTENT_KEY = "intent"
INTENT_LEGITIMATE = "Legitimate Use"
INTENT_BORDERLINE = "Borderline Manipulation"
INTENT_BLATANT = "Blatant Manipulation"
METADATA_KEY = "metadata"
EXECUTIVE_SUMMARY_KEY = "executive_summary"
INTENT_BREAKDOWN_KEY = "intentBreakdown"
OVERALL_ASSESSMENT_KEY = "overall_assessment"
DETAILED_REPORT_SECTIONS_KEY = "detailed_report_sections"
MANIPULATION_BY_CATEGORY_KEY = "manipulationByCategory"
CONFIDENCE_SCORE_KEY = "confidenceScore"
INTENT_BREAKDOWN_NAME_KEY = "name"
INTENT_BREAKDOWN_VALUE_KEY = "value"
CATEGORY_NAME_KEY = "name"
CATEGORY_BLATANT_KEY = "blatant"
CATEGORY_BORDERLINE_KEY = "borderline"

# Prompt Content
PROMPT_PERSONA = "Persona: Informed Persuasion Analyst"
PROMPT_OBJECTIVE_PREFIX = "Objective: Deconstruct and analyse the following text to detect and distinguish between legitimate persuasion vs purposeful manipulation:\n--- START TEXT ---\n"
PROMPT_OBJECTIVE_SUFFIX = "\n--- END TEXT ---"
PROMPT_PROCESS_HEADER = "Process (Chain-of-Thought):"
PROMPT_PROCESS_STEPS = [
    "1.  Identify author's Stated Goal: What does the author explicitly say they want to achieve with this communication?",
    "2.  List Persuasive Tactics Used: Identify all manipulative tactics present in the text using the provided taxonomy (taxonomy_kb.json).",
    "3.  Assess Necessity of Tactics: Are these tactics necessary to achieve the stated goal, or are they excessive and primarily intended to manipulate the audience's emotions or beliefs?",
    "4.  Infer Author's Intent: Based on the above factors, determine the author's likely intent: Primarily to inform/persuade rationally, or primarily to manipulate/deceive? Provide a confidence score (as a number 0-100) for this assessment.",
    "5. Identify Factual Claims: Scrutinise the text for specific, verifiable factual claims (e.g., statistics, dates, events). Prioritise claims that are central to the speaker's argument or that seem questionable.",
    "6. Identify grounded and ethical resistance strategies for each identified tactic.",
    "7. If the text is making unsubstantiated claims of fact, or twisting facts to strengthen an identified tactic:  use web search to source evidence that either directly disproves or challenges such claims, choose the (maximum) 3 most relevant and trustworthy sources to provide the URL of in the output, use shortened Bit.ly style URL's"
]
PROMPT_IMPLEMENTATION_HEADER = "Implementation (Directional-Stimulus Prompting):"
PROMPT_IMPLEMENTATION_DETAILS = [
    "Intent Qualifiers: Classify the severity of each tactic as:",
    f"{INTENT_LEGITIMATE}: Justifiable in context.",
    f"{INTENT_BORDERLINE}: Potentially misleading.",
    f"{INTENT_BLATANT}: Clearly intended to deceive.",
    "Fact-Checking Priority: Prioritise fact-checking claims that are used to support manipulative tactics or that appear to be misleading or unsubstantiated. If a claim is easily verifiable and directly relevant to assessing the speaker's intent, include a fact-checking source.",
    "Tactic Analysis: For each tactic, provide the following:",
    "Example Quote: The specific text excerpt where the tactic is used.",
    "Tactic Name: The name of the tactic from the taxonomy.",
    f"Intent: '{INTENT_LEGITIMATE},' '{INTENT_BORDERLINE},' or '{INTENT_BLATANT}.' Justify this classification.", # Note: Intent field renamed in models
    "Explanation: Explain how the tactic is being used and why it falls into the chosen Intent category.",
    "resistanceStrategy: How to recognize and resist the tactic.", # Note: resistanceStrategy field renamed in models
    "If Applicable Fact checking sources: Up to 3 URLs for sources that directly disprove or challenge claims. Only include URLs from highly reputable sources (e.g., government agencies, academic institutions, established news organisations with strong fact-checking policies). Provide a very short description of what each source says."
]
PROMPT_OUTPUT_HEADER = "Output Format: IMPORTANT - Adhere strictly to the requested JSON schema."
PROMPT_OUTPUT_DETAILS = [
    f"Specifically, provide the results for '{METADATA_KEY}', '{EXECUTIVE_SUMMARY_KEY}', '{INTENT_BREAKDOWN_KEY}', '{OVERALL_ASSESSMENT_KEY}', '{TACTICS_KEY}', and '{DETAILED_REPORT_SECTIONS_KEY}'.",
    f"For '{METADATA_KEY}.{CONFIDENCE_SCORE_KEY}', provide a single number between 0 and 100.",
    f"For '{INTENT_BREAKDOWN_KEY}', provide a list of objects, where each object has a '{INTENT_BREAKDOWN_NAME_KEY}' (string, e.g., '{INTENT_BLATANT}') and a '{INTENT_BREAKDOWN_VALUE_KEY}' (number, the count of tactics matching that intent).",
    f"Do NOT include the '{MANIPULATION_BY_CATEGORY_KEY}' field in your response."
]

# API Endpoint Configuration
API_TITLE = "GenAI Analysis API"
API_ANALYZE_ENDPOINT = "/api/analyze"
API_ROOT_ENDPOINT = "/"
API_ROOT_MESSAGE = "API is running"

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000", # Default React dev server
    # Add deployed frontend URL here if needed
    # "https://your-frontend-domain.com",
]

# File Handling Constants
CONTENT_TYPE_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
CONTENT_TYPE_TEXT_PREFIX = "text/"
FILE_EXTENSION_DOCX = ".docx"
FILE_EXTENSION_TXT = ".txt"
FILE_EXTENSION_MD = ".md"
DEFAULT_ENCODING = 'utf-8'

# Error Messages
ERROR_GENAI_CLIENT_INIT = "Failed to initialize GenAI client"
ERROR_GENAI_CLIENT_NOT_INITIALIZED = "GenAI client is not initialized."
ERROR_GENAI_API_CALL_FAILED = "GenAI API Call Error"
ERROR_GENAI_INVALID_RESPONSE = "GenAI Error: Response structure invalid."
ERROR_GENAI_JSON_PARSE = "Failed to parse GenAI JSON response"
ERROR_BACKEND_PROCESSING_FAILED = "Backend processing failed"
ERROR_DOCX_SUPPORT_DISABLED = ".docx processing is not enabled (python-docx library missing)"
ERROR_DOCX_PARSE_FAILED = "Failed to parse .docx file"
ERROR_FILE_DECODE_FAILED = "Failed to decode file as UTF-8"
ERROR_UNSUPPORTED_FILE_TYPE = "Unsupported file type. Please upload .txt, .md, or .docx."
ERROR_EMPTY_CONTENT = "Extracted text content is empty."
ERROR_ANALYSIS_FAILED = "Analysis failed"
ERROR_UNEXPECTED_FILE_PROCESSING = "Internal server error processing file"

# Logging Messages
LOG_WARN_TAXONOMY_NOT_FOUND = "Warning: {} not found at expected path {}. Tactic information might be limited."
LOG_WARN_TAXONOMY_DECODE_ERROR = "Warning: Could not decode {} at {}. File might be corrupted."
LOG_WARN_EMPTY_DOCX_EXTRACTION = "Warning: Extracted empty string from .docx file."
LOG_INFO_RUNNING_WISE = "Running WISE analysis (async)... requesting structured JSON..."
LOG_INFO_API_CALL_SUCCESS = "WISE analysis API call successful. Processing response..."
LOG_INFO_BACKEND_PROCESSING_COMPLETE = "Backend processing complete."
LOG_ERROR_GENAI_CLIENT_INIT = "Error initializing GenAI client: {}"
LOG_ERROR_JSON_PARSE = "ERROR: Failed to parse GenAI response as JSON: {}"
LOG_ERROR_BACKEND_PROCESSING = "ERROR: Failed during backend processing of API response: {}"
LOG_WARN_GENAI_INVALID_RESPONSE = "Warning: GenAI response did not contain expected text. Response: {}"
LOG_ERROR_GENAI_API_CALL = "ERROR: GenAI API call failed: {}"
LOG_INFO_RECEIVED_FILE = "Received file: {}, Content-Type: {}"
LOG_INFO_PROCESSING_DOCX = "Processing as .docx file..."
LOG_ERROR_DOCX_PARSE = "Error parsing .docx file: {}"
LOG_INFO_PROCESSING_TEXT = "Processing as text file (txt, md, text/*)..."
LOG_ERROR_DECODE_FAILED = "Error decoding file as UTF-8: {}"
LOG_INFO_PROCESSING_UNKNOWN_TYPE = "Attempting to process unknown/generic file type ({}) as text..."
LOG_ERROR_UNSUPPORTED_FILE_TYPE = "Unsupported file type: {} ({})"
LOG_INFO_CALLING_RUN_WISE = "Calling run_wise analysis..."
LOG_INFO_ANALYSIS_COMPLETE = "Analysis complete."
LOG_ERROR_ANALYSIS = "Analysis Error: {}"
LOG_ERROR_UNEXPECTED = "Unexpected error processing file: {}"
LOG_INFO_FILE_CLOSED = "File closed."