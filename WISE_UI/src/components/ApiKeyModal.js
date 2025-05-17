import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff, KeyRound, ShieldCheck, AlertTriangle, Trash2, Unlock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'; // Added ChevronDown, ChevronUp, ExternalLink

const INSECURE_API_KEY_SESSIONSTORAGE_KEY = 'wiseUserApiKey_insecure';

const ApiKeyModal = ({ 
    isOpen, 
    onClose, 
    onSaveApiKey, 
    onForgetKey, 
    currentApiKey, 
    error: externalError,
    mode = 'default',
    hasEncryptedKeyStored 
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saveOption, setSaveOption] = useState('session');
  const [passphraseInput, setPassphraseInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [internalError, setInternalError] = useState('');
  const [showApiKeyInstructions, setShowApiKeyInstructions] = useState(false); // State for instructions visibility

  const displayError = externalError || internalError;

  useEffect(() => {
    if (isOpen) {
      setInternalError(''); 
      setShowApiKeyInstructions(false); // Collapse instructions when modal reopens
      if (mode === 'decryptPrompt') {
        setApiKeyInput(''); 
        setPassphraseInput('');
        setSaveOption('secure'); 
      } else { 
        setApiKeyInput(currentApiKey || '');
        setPassphraseInput('');
        setSaveOption(hasEncryptedKeyStored && !sessionStorage.getItem(INSECURE_API_KEY_SESSIONSTORAGE_KEY) ? 'secure' : 'session');
      }
    }
  }, [isOpen, mode, currentApiKey, hasEncryptedKeyStored]);

  if (!isOpen) return null;

  const handleSave = () => {
    setInternalError(''); 
    if (mode === 'decryptPrompt') {
      if (!passphraseInput.trim()) {
        setInternalError('Passphrase is required to decrypt your stored API key.');
        return;
      }
      onSaveApiKey('', 'decrypt', passphraseInput); 
    } else { 
      if (!apiKeyInput.trim()) {
        setInternalError('API Key cannot be empty.');
        return;
      }
      if (saveOption === 'secure' && !passphraseInput.trim()) {
        setInternalError('Passphrase cannot be empty for secure save.');
        return;
      }
      onSaveApiKey(apiKeyInput, saveOption, passphraseInput);
    }
  };

  const handleForget = () => {
    if (window.confirm("Are you sure you want to forget your stored API key? This action cannot be undone.")) {
        onForgetKey();
    }
  }

  const isDecrypting = mode === 'decryptPrompt';
  const buttonBaseClass = "px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-50 flex items-center justify-center p-4 overflow-y-auto" // Added overflow-y-auto
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-lg relative my-8" // Added my-8 for vertical margin if content overflows
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-base-content opacity-50 hover:opacity-100 text-2xl">&times;</button>
        <h2 className="text-xl font-bold mb-5 text-center text-secondary">
            {isDecrypting ? 'Unlock Your API Key' : 'Manage Your API Key'}
        </h2>

        {/* Main form content */}
        {!isDecrypting && (
            <div className="mb-4">
            <label htmlFor="api-key-input" className="block text-sm font-medium text-base-content mb-1">Gemini API Key</label>
            <div className="relative">
                <input id="api-key-input" type={showApiKey ? 'text' : 'password'} value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)} placeholder="Enter your Gemini API Key" className="input input-bordered w-full pr-10"/>
                <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute inset-y-0 right-0 px-3 flex items-center text-base-content opacity-70 hover:opacity-100">
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            </div>
        )}

        {isDecrypting && (
            <div className="mb-4 p-3 bg-info/10 rounded-md text-sm text-info-content">
                <p>An encrypted API key is stored in your browser. Enter your passphrase to decrypt and use it for this session.</p>
            </div>
        )}

        {!isDecrypting && (
            <div className="mb-6">
            <p className="text-sm text-base-content mb-4">How would you like to manage this key?</p>
            <div className="space-y-3">
                <label className="flex items-center p-3 border border-base-300 rounded-md hover:bg-base-200 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                <input type="radio" name="saveOption" value="session" checked={saveOption === 'session'} onChange={() => setSaveOption('session')} className="radio radio-primary mr-3"/>
                <div>
                    <span className="font-medium text-base-content">Use for this session only</span>
                    <p className="text-xs text-base-content opacity-70">Active until you close browser tab/window. (Recommended for shared computers)</p>
                </div>
                </label>
                <label className="flex items-center p-3 mb-4 border border-base-300 rounded-md hover:bg-base-200 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                <input type="radio" name="saveOption" value="secure" checked={saveOption === 'secure'} onChange={() => setSaveOption('secure')} className="radio radio-primary mr-3"/>
                <div>
                    <span className="font-medium text-base-content">Save securely with a passphrase</span>
                    <p className="text-xs text-base-content opacity-70">Encrypts and stores in your browser. Needs passphrase each visit.</p>
                </div>
                </label>
            </div>
            </div>
        )}
        
        {(saveOption === 'secure' || isDecrypting) && (
          <div className="mb-4">
            <label htmlFor="passphrase-input" className="block text-sm font-medium text-base-content mb-1">
              Passphrase {isDecrypting ? '' : <span className="text-xs">(minimum 8 characters)</span>}
            </label>
            <div className="relative">
              <input id="passphrase-input" type={showPassphrase ? 'text' : 'password'} value={passphraseInput} onChange={(e) => setPassphraseInput(e.target.value)} placeholder={isDecrypting ? "Enter your passphrase" : "Create or enter passphrase"} className="input input-bordered w-full pr-10"/>
              <button type="button" onClick={() => setShowPassphrase(!showPassphrase)} className="absolute inset-y-0 right-0 px-3 flex items-center text-base-content opacity-70 hover:opacity-100">
                {showPassphrase ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!isDecrypting && <p className="text-xs text-base-content opacity-70 mt-1">This encrypts your API key. <strong className="text-warning">If you forget it, it's unrecoverable.</strong></p>}
          </div>
        )}
        
        {displayError && (
          <div className="text-error bg-error/10 border border-error/20 p-3 rounded my-4 text-sm flex items-center" role="alert">
            <AlertTriangle size={18} className="mr-2 flex-shrink-0" />{displayError}
          </div>
        )}

        {/* Action Buttons and Forget Key */}
        <div className="mt-6">
          <div className="flex justify-center items-center space-x-3">
            <button type="button" onClick={handleSave} className={`${buttonBaseClass} bg-primary text-primary-content hover:brightness-95`}>
              {isDecrypting ? <Unlock size={18} className="mr-2"/> : <KeyRound size={18} className="mr-2"/>}
              {isDecrypting ? 'Decrypt & Use' : 'Save & Use Key'}
            </button>
            <button type="button" onClick={onClose} className={`${buttonBaseClass} bg-base-300 text-base-content hover:brightness-95`}>Cancel</button>
          </div>
          {(hasEncryptedKeyStored || sessionStorage.getItem(INSECURE_API_KEY_SESSIONSTORAGE_KEY)) && !isDecrypting && (
            <div className="flex justify-center mt-3">
              <button type="button" onClick={handleForget} className={`${buttonBaseClass} bg-error/80 text-error-content hover:bg-error flex items-center gap-1 text-sm`}>
                <Trash2 size={16} /> Forget My Key
              </button>
            </div>
          )}
        </div>
        
        {/* Security Disclaimer */}
        {!isDecrypting && (
            <div className="mt-6 p-3 bg-base-200 rounded-md text-xs text-base-content opacity-80">
                <div className="flex flex-col items-center"> 
                    <ShieldCheck size={32} className="text-info mb-3" /> 
                    <div className="text-center"> 
                        <strong className="block text-sm mb-1">Your API Key's Security:</strong>
                        <ul className="list-disc list-inside text-left space-y-2">
                            <li>WISE processes your API key entirely within your browser for analysis.</li>
                            <li>If you choose to save it securely, it's encrypted with your passphrase and stored <strong className="font-semibold">only in your browser's local storage</strong>.</li>
                            <li>We <strong className="font-semibold">never</strong> send your passphrase to our servers, and we <strong className="font-semibold">never</strong> store your unencrypted API key on our servers.</li>
                            <li>If you forget your passphrase, <strong className="font-semibold">it's unrecoverable.</strong> but, <strong className="font-semibold">don't panic,</strong> grab a new key, click "Forget My Key", and start fresh, we won't tell.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {/* How to get API Key Section - NEW */}
        <div className="mt-6 pt-4 border-t border-base-300 text-center">
            <button
                onClick={() => setShowApiKeyInstructions(!showApiKeyInstructions)}
                className="text-sm text-primary hover:text-primary-focus font-medium inline-flex items-center gap-1"
            >
                How to get a Gemini API Key
                {showApiKeyInstructions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${showApiKeyInstructions ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-4 bg-base-200 rounded-md text-left text-sm mt-2 space-y-2">
                    <p className="font-semibold text-base-content">To get your free Gemini API key for use with WISE:</p>
                    <ol className="list-decimal list-inside space-y-1 text-base-content/90">
                        <li>Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Google AI Studio <ExternalLink size={12}/></a>.</li>
                        <li>Sign in with your Google account.</li>
                        <li>On the Google AI Studio homepage, click on <strong className="font-semibold">"Get API key"</strong> in the top menu or left sidebar.</li>
                        <li>If you don't have a project, you might be prompted to create one or agree to terms. Follow the on-screen instructions.</li>
                        <li>Click on <strong className="font-semibold">"Create API key"</strong> (you might need to select a project if you have multiple).</li>
                        <li>Your new API key will be generated. Copy this key.</li>
                        <li>Paste the copied key into the "Gemini API Key" field above in this modal.</li>
                    </ol>
                    <p className="text-xs text-base-content/70 mt-2">
                        Note: Google offers a free tier for Gemini API keys with certain usage limits, which is usually sufficient for individual use.
                        Always keep your API key secure and do not share it publicly.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

ApiKeyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaveApiKey: PropTypes.func.isRequired,
  onForgetKey: PropTypes.func.isRequired,
  currentApiKey: PropTypes.string,
  error: PropTypes.string,
  mode: PropTypes.oneOf(['default', 'decryptPrompt']),
  hasEncryptedKeyStored: PropTypes.bool,
};

ApiKeyModal.defaultProps = {
    currentApiKey: '',
    error: '',
    mode: 'default',
    hasEncryptedKeyStored: false,
};

export default ApiKeyModal;