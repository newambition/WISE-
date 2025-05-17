# app/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException, Form # Ensure Form is imported if you're on the version that uses it
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi.staticfiles import StaticFiles

try:
    from docx import Document
    DOCX_SUPPORTED = True
except ImportError:
    DOCX_SUPPORTED = False
    print("WARNING: python-docx not installed. .docx file support is disabled.")
    print("Install it with: pip install python-docx")

# Import the analysis function and custom error from our module
# Assuming the version where run_wise is updated to take user_api_key
from app.analysis_module import run_wise, AnalysisError 

# Create the FastAPI application instance
app = FastAPI(title="GenAI Analysis API")

# --- CORS Configuration ---
# Define the list of origins that are allowed to make requests.
origins = [
    "http://localhost:3000",  # For local React dev server
    "https://api.render.com/deploy/srv-d0k0pod6ubrc73as2irg?key=5j6qVtDhUZM",  # <<< REPLACE THIS WITH YOUR ACTUAL DEPLOYED FRONTEND URL
    # e.g., "https://wise-app.netlify.app" or "https://my-wise-instance.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # List of allowed origins
    allow_credentials=True, # Allow cookies/authorization headers
    allow_methods=["*"],    # Allow all HTTP methods
    allow_headers=["*"],    # Allow all headers
)

static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
# --- End CORS Configuration ---

@app.get("/health")
async def health_check():
    return {"message": "API is running"}

# Ensure this endpoint matches the version that accepts 'user_api_key'
@app.post("/api/analyze")
async def analyze_text(
    file: UploadFile = File(...),
    user_api_key: str = Form(...) # This line was added in Step 2
):
    content_str = ""
    filename = file.filename or ""
    content_type = file.content_type or ""

    print(f"Received file: {filename}, Content-Type: {content_type}")
    if not user_api_key or user_api_key.strip() == "":
        raise HTTPException(status_code=400, detail="API key is missing or empty.")
    # print(f"Received User API Key (first 5 chars): {user_api_key[:5]}...") # Already in your Step 2 version

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
            try:
                content_str = content_bytes.decode('utf-8')
            except UnicodeDecodeError:
                raise HTTPException(status_code=415, detail=f"Unsupported file type: {filename} ({content_type}). Please upload .txt, .md, or .docx.")

        if not content_str.strip():
             raise HTTPException(status_code=422, detail="Extracted text content is empty.")

        # Pass the user_api_key to run_wise (as per Step 2 changes)
        analysis_result = await run_wise(content_str, user_api_key) 
        return analysis_result

    except AnalysisError as ae:
        # Specific error handling for API key issues from analysis_module
        if "API key is invalid" in str(ae) or "Failed to initialize GenAI client with the provided API key" in str(ae):
            raise HTTPException(status_code=401, detail=f"Analysis failed due to an API key issue: {ae}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {ae}")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error processing file: {e}")
    finally:
        await file.close()