# app/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException, Form, APIRouter # Added APIRouter
from fastapi.middleware.cors import CORSMiddleware
import os
import io # Required for io.BytesIO with docx
from fastapi.staticfiles import StaticFiles

try:
    from docx import Document
    DOCX_SUPPORTED = True
except ImportError:
    DOCX_SUPPORTED = False
    print("WARNING: python-docx not installed. .docx file support is disabled.")
    print("Install it with: pip install python-docx")

# Import the analysis function and custom error from our module
from app.analysis_module import run_wise, AnalysisError 

# Create the FastAPI application instance
app = FastAPI(title="GenAI Analysis API")

# --- CORS Configuration ---
# Define the list of origins that are allowed to make requests.
# IMPORTANT: Ensure your deployed frontend URL (e.g., "https://get-wise.life") is in this list.
origins = [
    "http://localhost:3000",  # For local React dev server
    "https://wise-ga5e.onrender.com",  # <<< REPLACE THIS WITH YOUR ACTUAL DEPLOYED FRONTEND URL
    # e.g., "https://get-wise.life" if that's your frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # List of allowed origins
    allow_credentials=True, # Allow cookies/authorization headers
    allow_methods=["*"],    # Allow all HTTP methods
    allow_headers=["*"],    # Allow all headers
)
# --- End CORS Configuration ---

# --- API Router Setup ---
api_router = APIRouter()

@api_router.get("/health", tags=["API Health"]) # Added to router
async def health_check():
    return {"message": "API is running"}

@api_router.post("/api/analyze", tags=["Analysis"]) # Added to router
async def analyze_text(
    file: UploadFile = File(...),
    user_api_key: str = Form(...)
):
    content_str = ""
    filename = file.filename or ""
    content_type = file.content_type or ""

    print(f"Received file: {filename}, Content-Type: {content_type}")
    if not user_api_key or user_api_key.strip() == "":
        raise HTTPException(status_code=400, detail="API key is missing or empty.")
    
    try:
        content_bytes = await file.read()

        if content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" or filename.endswith(".docx"):
            if not DOCX_SUPPORTED:
                raise HTTPException(status_code=501, detail=".docx processing is not enabled (python-docx library missing)")
            try:
                document = Document(io.BytesIO(content_bytes))
                content_str = "\n".join([para.text for para in document.paragraphs])
            except Exception as e:
                raise HTTPException(status_code=422, detail=f"Failed to parse .docx file: {e}")
        elif content_type.startswith("text/") or filename.endswith(".txt") or filename.endswith(".md"):
            try:
                content_str = content_bytes.decode('utf-8')
            except UnicodeDecodeError as e:
                raise HTTPException(status_code=422, detail=f"Failed to decode file as UTF-8: {e}")
        else:
            # Fallback attempt to decode as UTF-8 for unspecified text types
            try:
                content_str = content_bytes.decode('utf-8')
            except UnicodeDecodeError: # Keep original error for truly unsupported
                raise HTTPException(status_code=415, detail=f"Unsupported file type: {filename} ({content_type}). Please upload .txt, .md, or .docx.")

        if not content_str.strip():
             raise HTTPException(status_code=422, detail="Extracted text content is empty.")

        analysis_result = await run_wise(content_str, user_api_key) 
        return analysis_result

    except AnalysisError as ae:
        if "API key is invalid" in str(ae) or "Failed to initialize GenAI client with the provided API key" in str(ae):
            raise HTTPException(status_code=401, detail=f"Analysis failed due to an API key issue: {ae}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {ae}")
    except HTTPException as http_exc:
        # Re-raise HTTPException directly to preserve status code and detail
        raise http_exc
    except Exception as e:
        # Generic catch-all for other unexpected errors
        print(f"Unexpected server error: {e}") # Log the error server-side
        raise HTTPException(status_code=500, detail=f"Internal server error processing file: {e}")
    finally:
        await file.close()

# Include the API router in the main application
app.include_router(api_router)
# --- End API Router Setup ---

# --- Static Files Mounting (after API router) ---
# This serves your React frontend.
# Ensure 'static_dir' points to your React app's build folder (e.g., 'build' or 'dist')
# The user prompt specified "/static inside WISE_backend"
static_dir_name = "static" 
static_dir_path = os.path.join(os.path.dirname(__file__), static_dir_name)

if os.path.exists(static_dir_path):
    app.mount("/", StaticFiles(directory=static_dir_path, html=True), name="static_frontend")
else:
    print(f"Warning: Static directory '{static_dir_path}' not found. Frontend will not be served by FastAPI.")
# --- End Static Files Mounting ---