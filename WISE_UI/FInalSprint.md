1. Landing Page Modifications:

- Emphasize that the site is free.
- Change the "Start Here" button to navigate directly to the main site's overview tab view, bypassing the analysis modal.
- Remove the login button.

2. Backend API Key Handling:

- Remove the server-side API key.
- Modify the backend to accept the AI API key from the frontend (user's key).

3. Frontend API Key Management (Main Site):

- Replace the login button with an "API KEY" button.
- Create an API modal with two options for users to manage their API key:
- "Save my key insecurely (not recommended)" as a fallback.
- A passphrase-protected option.

4. Secure API Key Storage (Frontend):

- Implement client-side encryption/decryption using CryptoJS or Web Crypto API.
- Store the encrypted API key in localStorage (e.g., keyed by wiseUserAPIKey).
- Use AES encryption with the user's passphrase.
- The process will involve:
* Prompting for a passphrase.
* Allowing API key input.
* Encrypting the key with the passphrase.
* Storing the encrypted key locally.
* Prompting for the passphrase on future visits to decrypt.
* Using the decrypted key temporarily in the session.
* Ensuring the key and passphrase are never sent to the server.
* Providing a reset option.
* Offering transparent user guidance on storage, encryption, and recovery.