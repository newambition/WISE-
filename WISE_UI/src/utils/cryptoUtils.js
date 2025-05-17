// WISE_UI/src/utils/cryptoUtils.js

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Derives a key from a passphrase and salt using PBKDF2.
 * @param {string} passphrase - The user's passphrase.
 * @param {Uint8Array} salt - The salt.
 * @returns {Promise<CryptoKey>} The derived cryptographic key.
 */
async function deriveKey(passphrase, salt) {
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 250000, // Number of iterations - higher is more secure but slower
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 }, // Key algorithm and length for AES-256-GCM
    true, // Exportable
    ['encrypt', 'decrypt'] // Key usages
  );
}

/**
 * Encrypts an API key using AES-GCM with a passphrase.
 * @param {string} apiKeyString - The API key to encrypt.
 * @param {string} passphraseString - The passphrase to use for encryption.
 * @returns {Promise<string>} A JSON string containing base64 encoded salt, iv, and ciphertext.
 * @throws {Error} If encryption fails.
 */
export async function encryptApiKey(apiKeyString, passphraseString) {
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16)); // 16-byte salt
    const iv = crypto.getRandomValues(new Uint8Array(12));   // 12-byte IV for AES-GCM is recommended

    const key = await deriveKey(passphraseString, salt);

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encoder.encode(apiKeyString)
    );

    // Return as a JSON string of base64 encoded parts for easy storage
    return JSON.stringify({
      salt: bufferToBase64(salt),
      iv: bufferToBase64(iv),
      ciphertext: bufferToBase64(encryptedData),
    });
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Could not encrypt API key. Please try again.');
  }
}

/**
 * Decrypts an API key using AES-GCM with a passphrase.
 * @param {string} encryptedDataJsonString - JSON string containing base64 encoded salt, iv, and ciphertext.
 * @param {string} passphraseString - The passphrase to use for decryption.
 * @returns {Promise<string>} The decrypted API key string.
 * @throws {Error} If decryption fails (e.g., wrong passphrase, corrupted data).
 */
export async function decryptApiKey(encryptedDataJsonString, passphraseString) {
  try {
    const { salt, iv, ciphertext } = JSON.parse(encryptedDataJsonString);

    if (!salt || !iv || !ciphertext) {
        throw new Error('Invalid encrypted data format.');
    }

    const saltBuffer = base64ToBuffer(salt);
    const ivBuffer = base64ToBuffer(iv);
    const ciphertextBuffer = base64ToBuffer(ciphertext);

    const key = await deriveKey(passphraseString, saltBuffer);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer,
      },
      key,
      ciphertextBuffer
    );

    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    // Common error is "CipherFinalOperation failed" or similar for wrong passphrase
    if (error.name === 'OperationError' || error.message.includes('CipherFinalOperation failed')) {
        throw new Error('Decryption failed. The passphrase may be incorrect or the data corrupted.');
    }
    throw new Error('Could not decrypt API key. Ensure the passphrase is correct.');
  }
}

// Helper functions for Base64 encoding/decoding ArrayBuffers
function bufferToBase64(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}

function base64ToBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}