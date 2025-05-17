# app/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware # <--- Import CORS Middleware
import io

try:
    from docx import Document
    DOCX_SUPPORTED = True
except ImportError:
    DOCX_SUPPORTED = False
    print("WARNING: python-docx not installed. .docx file support is disabled.")
    print("Install it with: pip install python-docx")

# --- Custom Exception ---
class AnalysisError(Exception):
    """Custom exception for errors during the analysis process."""
    pass
# ----------------------

# Import the analysis function from our module
from app.analysis_module import run_wise, AnalysisError

# Create the FastAPI application instance
app = FastAPI(title="GenAI Analysis API")

# --- CORS Configuration ---
# Define the list of origins that are allowed to make requests.
# IMPORTANT: Change 'http://localhost:3000' if your React app runs on a different port.
origins = [
    "http://localhost:3000", # Default React dev server
    # You could add your deployed frontend URL here later
    # "https://your-frontend-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # List of allowed origins
    allow_credentials=True, # Allow cookies/authorization headers
    allow_methods=["*"],    # Allow all HTTP methods (GET, POST, PUT, etc.)
    allow_headers=["*"],    # Allow all headers
)
# --- End CORS Configuration ---

# --- Root Endpoint for Basic Testing ---
@app.get("/")
async def read_root():
    """Returns a simple greeting."""
    return {"message": "API is running"}
# --- End Root Endpoint ---

# --- Analysis Endpoint --- #
@app.post("/api/analyze")
async def analyze_text(file: UploadFile = File(...)):
    """Receives a file (txt, md, docx) or text blob, extracts text, 
       runs analysis, and returns JSON result.
    """
    content_str = ""
    filename = file.filename or ""
    content_type = file.content_type or ""

    print(f"Received file: {filename}, Content-Type: {content_type}")

    try:
        content_bytes = await file.read()

        # Determine content type and extract text
        if content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" or filename.endswith(".docx"):
            if not DOCX_SUPPORTED:
                raise HTTPException(status_code=501, detail=".docx processing is not enabled (python-docx library missing)")
            try:
                print("Processing as .docx file...")
                document = Document(io.BytesIO(content_bytes))
                content_str = "\n".join([para.text for para in document.paragraphs])
                if not content_str:
                    print("Warning: Extracted empty string from .docx file.")
            except Exception as e:
                print(f"Error parsing .docx file: {e}")
                # More specific error handling in Phase 4
                raise HTTPException(status_code=422, detail=f"Failed to parse .docx file: {e}")
        elif content_type.startswith("text/") or filename.endswith(".txt") or filename.endswith(".md"):
            try:
                print("Processing as text file (txt, md, text/*)...")
                content_str = content_bytes.decode('utf-8')
            except UnicodeDecodeError as e:
                print(f"Error decoding file as UTF-8: {e}")
                # More specific error handling in Phase 4
                raise HTTPException(status_code=422, detail=f"Failed to decode file as UTF-8: {e}")
        else:
            # Treat as plain text by default if type is unknown but potentially text-like
            # This handles cases where browser might send blob as application/octet-stream
            print(f"Attempting to process unknown/generic file type ({content_type}) as text...")
            try:
                content_str = content_bytes.decode('utf-8')
            except UnicodeDecodeError:
                # If decoding fails here, it's likely not a supported text format
                print(f"Unsupported file type: {filename} ({content_type})")
                raise HTTPException(status_code=415, detail=f"Unsupported file type: {filename} ({content_type}). Please upload .txt, .md, or .docx.")

        # Check if content is empty after processing
        if not content_str.strip():
             raise HTTPException(status_code=422, detail="Extracted text content is empty.")

        # Call the analysis function
        print("Calling run_wise analysis...")
        analysis_result = await run_wise(content_str)
        print("Analysis complete.")
        return analysis_result

    except AnalysisError as ae: # Catch specific analysis errors first
        print(f"Analysis Error: {ae}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {ae}")
    except HTTPException as http_exc: # Re-raise HTTPExceptions
        raise http_exc
    except Exception as e:
        # Catch-all for other unexpected errors during processing
        print(f"Unexpected error processing file: {e}")
        # Generic server error for Phase 3, refine in Phase 4
        raise HTTPException(status_code=500, detail=f"Internal server error processing file: {e}")
    finally:
        # Ensure the file is closed, although UploadFile handles this
        await file.close()
        print("File closed.")

# --- End Analysis Endpoint ---

# We will add endpoints later