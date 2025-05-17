## Phase 2: Core Logic Adaptation & Integration

* [x] Step 2.1: Create `analysis_module.py` for Refactored Logic
* [x] Step 2.2: Identify Core Analysis Function(s) in `core.py` (e.g., `run_dae`, `run_cne`, `run_dae_cne`)
* [x] Step 2.3: Refactor Core Function(s) Signature:
    * [x] Accept input content (`bytes` or `str`) as argument.
    * [x] Make functions `async def`.
* [x] Step 2.4: Refactor Core Function(s) Output:
    * [x] Modify return value to be a Python `dict` matching the frontend's required JSON structure.
    * [x] Remove XML generation/handling if not needed for the final JSON.
* [x] Step 2.5: Integrate GenAI API Call (`google.genai`):
    * [x] Ensure API key handling (using environment variables) is present.
    * [x] Adapt API call within `async` functions (use `await` if library supports it, or run synchronously if not).
* [x] Step 2.6: Handle Dependencies:
    * [x] Ensure `taxonomy_kb.json` is accessible by the backend.
    * [x] Add GenAI library (e.g., `google-generativeai`) and other necessary libraries to `requirements.txt` and install.
* [x] Step 2.7: Address Telemetry/Logging:
    * [x] Decide fate of SQLite logging (`init_telemetry_db`, `@log_telemetry`, `log_feedback`).
    * [x] Remove or adapt logging for the FastAPI context (e.g., use standard Python logging).
* [x] Step 2.8: Implement Basic Error Handling within `analysis_module.py` (e.g., `try...except` around API calls, raise custom exceptions).

## Phase 3: API Endpoint Implementation (`/api/analyze`)

* [x] Step 3.1: Define `POST /api/analyze` Endpoint in `main.py`.
* [x] Step 3.2: Use `async def` for the endpoint function.
* [x] Step 3.3: Define `UploadFile` Parameter to Accept `FormData`.
* [x] Step 3.4: Read Content from `UploadFile` (`await file.read()`).
* [x] Step 3.5: Call Refactored Analysis Function from `analysis_module.py`.
* [x] Step 3.6: Return the Resulting Dictionary (FastAPI handles JSON conversion).

## Phase 4: Error Handling & Refinement

* [x] Step 4.1: Implement `try...except` Block in `/api/analyze` Endpoint.
* [x] Step 4.2: Catch Custom Exceptions from `analysis_module.py`.
* [x] Step 4.3: Raise `HTTPException` from FastAPI for API Errors (e.g., 400, 422, 500) with appropriate details.
* [x] Step 4.4: Handle Potential File Read/Decode Errors.
* [ ] Step 4.5: Add Input Validation (Optional but Recommended, e.g., file size, content type).

## Phase 5: Testing

* [ ] Step 5.1: Unit Test Refactored Analysis Functions (Optional but Recommended).
* [ ] Step 5.2: Test API Endpoint with `curl` or API Client (e.g., Postman, Insomnia):
    * [ ] Test with File Upload.
    * [ ] Test with Text-as-Blob Upload.
    * [ ] Test Expected Success Response (JSON structure).
    * [ ] Test Error Responses (e.g., invalid input, analysis failure).
* [ ] Step 5.3: Integrate and Test with React Frontend.
* [ ] Step 5.4: Verify CORS is working correctly (check browser console).