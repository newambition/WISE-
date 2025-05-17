# Backend Implementation Tracker: User Authentication, API Limiting & Tokens

This tracker outlines the phases and steps required to implement user accounts, security measures, API call limits, and a token purchase system for the backend.

## Phase 1: User Account Foundation

* [ ] **Step 1.1:** Design Database Schema: Define tables for `Users` (including `id`, `username`, `email`, `password_hash`, `salt`).
* [ ] **Step 1.2:** Setup Database Connection: Configure the application to connect to the chosen database (e.g., PostgreSQL, MySQL, SQLite).
* [ ] **Step 1.3:** Implement Hashing Logic: Choose and implement a secure password hashing library (e.g., `passlib` with bcrypt or Argon2).
* [ ] **Step 1.4:** Create Registration Endpoint (`/register`):
    * [ ] Accept user details (username, email, password).
    * [ ] Implement input validation (format, strength).
    * [ ] Check for unique username/email.
    * [ ] Hash the password using the chosen library.
    * [ ] Store user data (including hash and salt) in the database.
* [ ] **Step 1.5:** Create Login Endpoint (`/login`):
    * [ ] Accept username/email and password.
    * [ ] Retrieve user record by username/email.
    * [ ] Verify provided password against the stored hash.
    * [ ] If valid, proceed to JWT generation (Phase 2).
    * [ ] If invalid, return appropriate error.

## Phase 2: Security & Authentication Basics

* [ ] **Step 2.1:** Implement JWT Generation: Upon successful login, generate a secure JWT containing user identifiers (e.g., `user_id`) and an expiry time.
* [ ] **Step 2.2:** Implement JWT Verification Middleware/Dependency: Create FastAPI middleware or a dependency function to:
    * [ ] Extract JWT from request headers (`Authorization: Bearer <token>`).
    * [ ] Verify the token's signature and expiry using the secret key.
    * [ ] Decode the token to retrieve user information.
    * [ ] Make user information available to protected endpoints (e.g., via request state or dependency injection).
    * [ ] Raise `HTTPException` (e.g., 401 Unauthorized) if the token is invalid or missing.
* [ ] **Step 2.3:** Protect Endpoints: Apply the JWT verification dependency to endpoints requiring authentication (e.g., `/api/analyze`, `/user/me`).
* [ ] **Step 2.4:** Configure HTTPS: Ensure the deployment environment enforces HTTPS for all traffic.
* [ ] **Step 2.5:** Implement Basic Input Validation: Review existing endpoints (`/api/analyze`) and add robust validation for all inputs using Pydantic models.

## Phase 3: Weekly API Call Limiting

* [ ] **Step 3.1:** Update Database Schema: Add columns to `Users` table for `api_calls_this_week` (integer, default 0) and `last_api_reset_date` (date/timestamp).
* [ ] **Step 3.2:** Implement Limit Checking Logic: Create a function or dependency that:
    * [ ] Gets the current user ID (from JWT).
    * [ ] Retrieves the user's `api_calls_this_week` and `last_api_reset_date`.
    * [ ] Checks if the current date is in a new week compared to `last_api_reset_date`. If yes, reset `api_calls_this_week` to 0 and update `last_api_reset_date`.
    * [ ] Compares `api_calls_this_week` against the limit (3).
* [ ] **Step 3.3:** Integrate Limit Check into `/api/analyze`: Before calling the core analysis function:
    * [ ] Run the limit checking logic.
    * [ ] If the limit is reached (and no tokens are available - see Phase 4), return a 429 Too Many Requests error.
    * [ ] If within the limit, proceed with the analysis.
* [ ] **Step 3.4:** Implement Usage Increment: If the API call is allowed (within the free limit), increment the user's `api_calls_this_week` count in the database after a successful analysis call.

## Phase 4: Token Purchase & Usage System

* [ ] **Step 4.1:** Update Database Schema: Add `token_balance` (integer, default 0) column to the `Users` table.
* [ ] **Step 4.2:** Create Token Purchase Endpoint (`/purchase-tokens` - Placeholder):
    * [ ] Define the endpoint structure.
    * [ ] Implement logic to receive purchase details (e.g., token amount).
    * [ ] Add placeholder for payment gateway integration (actual integration is complex and might be a separate sub-project).
    * [ ] Implement logic to update the user's `token_balance` upon *simulated* successful payment.
* [ ] **Step 4.3:** Modify Limit Checking Logic (from Phase 3):
    * [ ] If the weekly limit is reached, check the user's `token_balance`.
    * [ ] If `token_balance` > 0, allow the API call.
    * [ ] If `token_balance` <= 0, deny the call (429 error).
* [ ] **Step 4.4:** Implement Token Decrement: If an API call is allowed using a token (i.e., weekly limit exceeded but tokens available), decrement the user's `token_balance` in the database after a successful analysis call.

## Phase 5: API Endpoints & UI Integration Preparation

* [ ] **Step 5.1:** Create User Info Endpoint (`/user/me`):
    * [ ] Protect with JWT authentication.
    * [ ] Retrieve and return relevant user data (e.g., username, email, `api_calls_this_week`, `token_balance`).
* [ ] **Step 5.2:** Implement Password Reset Flow:
    * [ ] Create endpoint (`/password-reset-request`) to initiate reset (generates token, sends email - requires email service integration).
    * [ ] Create endpoint (`/password-reset-confirm`) to validate token and update password.
* [ ] **Step 5.3:** Review API Responses: Ensure all endpoints return consistent JSON structures and appropriate HTTP status codes for success and errors, aligning with frontend expectations (`UI_jsonExpectation.md`).
* [ ] **Step 5.4:** API Documentation: Update or generate API documentation (e.g., using FastAPI's automatic Swagger/ReDoc) for frontend developers.

## Phase 6: Testing & Refinement

* [ ] **Step 6.1:** Unit Testing: Write unit tests for critical logic (hashing, JWT handling, limit checking, token logic).
* [ ] **Step 6.2:** Integration Testing: Test the interaction between different components (API endpoints, database, authentication).
* [ ] **Step 6.3:** API Endpoint Testing: Use tools like `curl`, Postman, or FastAPI's test client to test all new endpoints:
    * [ ] Registration (success, duplicate user).
    * [ ] Login (success, wrong password, user not found).
    * [ ] Protected endpoints (valid token, invalid/expired token, no token).
    * [ ] API limiting (within limit, limit reached, using tokens, no tokens).
    * [ ] Token purchase (simulated).
    * [ ] Password reset flow (simulated).
* [ ] **Step 6.4:** Security Review: Perform a basic security check (e.g., check for common vulnerabilities like insecure direct object references, ensure proper error handling doesn't leak sensitive info).
* [ ] **Step 6.5:** Performance Review: Identify potential bottlenecks, especially in database queries related to user lookup and limit checking. Add necessary database indexes.
