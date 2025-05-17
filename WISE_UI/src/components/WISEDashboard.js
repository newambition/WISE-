import React, { useState, useCallback, useEffect } from 'react';
import LandingPageContent from './LandingPageContent';
import useAnalysisApi from '../hooks/useAnalysisApi';
import Header from './Header';
import Footer from './Footer';
import NavigationBar from './NavigationBar';
import OverviewTabContent from './OverviewTabContent';
import OverviewModal from './OverviewModal';
import AnalysisModal from './AnalysisModal';
import ApiKeyModal from './ApiKeyModal';
import testAnalysisData from '../testAnalysisData';
import ResourcesTabContent from './ResourcesTabContent';
import LearningHubTabContent from './LearningHubTabContent';
import { encryptApiKey, decryptApiKey } from '../utils/cryptoUtils'; // Import crypto functions

const ENCRYPTED_API_KEY_LOCALSTORAGE_KEY = 'wiseUserEncryptedAPIKey';
const INSECURE_API_KEY_SESSIONSTORAGE_KEY = 'wiseUserApiKey_insecure';

const WISEDashboard = () => {
  console.log('[WISEDashboard] Component rendering or re-rendering.');

  const { 
    isLoading: apiIsLoading, 
    error: apiErrorHook, 
    triggerAnalysis, 
    setError: setApiErrorHook 
  } = useAnalysisApi();
  
  const isDevMode = typeof window !== 'undefined' && window.location.search.includes('dev=1');
  
  const [currentAnalysisDataState, setCurrentAnalysisDataState] = useState(null);
  const [currentUserApiKey, setCurrentUserApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [apiKeySource, setApiKeySource] = useState(null); // 'session', 'encrypted', or null

  // States for Modals
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyModalMode, setApiKeyModalMode] = useState('default'); // 'default', 'decryptPrompt'
  const [apiKeyError, setApiKeyError] = useState(''); // For errors within ApiKeyModal

  const [showLandingPage, setShowLandingPage] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTactic, setSelectedTactic] = useState(null);
  const [displayTitle, setDisplayTitle] = useState('');

  // --- Load API Key on Mount ---
  useEffect(() => {
    console.log('[WISEDashboard] Initializing API key...');
    const insecureKey = sessionStorage.getItem(INSECURE_API_KEY_SESSIONSTORAGE_KEY);
    if (insecureKey) {
      console.log('[WISEDashboard] Found insecure key in session storage.');
      setCurrentUserApiKey(insecureKey);
      setIsApiKeySet(true);
      setApiKeySource('session');
      return;
    }

    const encryptedKeyData = localStorage.getItem(ENCRYPTED_API_KEY_LOCALSTORAGE_KEY);
    if (encryptedKeyData) {
      console.log('[WISEDashboard] Found encrypted key in local storage. Prompting for passphrase.');
      setApiKeyModalMode('decryptPrompt'); // Set mode to prompt for passphrase
      setIsApiKeyModalOpen(true); // Open modal to ask for passphrase
      // The actual decryption will happen when the user submits passphrase in the modal
    } else {
      console.log('[WISEDashboard] No API key found in session or local storage.');
    }
  }, []);
  
  const analysisDataToDisplay = isDevMode ? testAnalysisData : currentAnalysisDataState;
  const isLoading = isDevMode ? false : apiIsLoading;
  const displayError = isDevMode ? null : apiErrorHook;

  // --- Logging Effects for Debugging ---
  useEffect(() => { console.log('[WISEDashboard] currentAnalysisDataState changed:', currentAnalysisDataState); }, [currentAnalysisDataState]);
  useEffect(() => { console.log('[WISEDashboard] isLoading changed:', isLoading); }, [isLoading]);
  useEffect(() => { console.log('[WISEDashboard] displayError changed:', displayError); }, [displayError]);
  useEffect(() => { console.log('[WISEDashboard] isApiKeySet changed:', isApiKeySet, 'Key:', currentUserApiKey ? 'Exists' : 'Empty', 'Source:', apiKeySource); }, [isApiKeySet, currentUserApiKey, apiKeySource]);
  useEffect(() => { console.log('[WISEDashboard] apiKeyModalMode changed:', apiKeyModalMode); }, [apiKeyModalMode]);

  // --- Modal Handlers ---
  const handleOpenAnalysisModal = useCallback(() => {
    console.log('[WISEDashboard] handleOpenAnalysisModal called. isApiKeySet:', isApiKeySet, 'isDevMode:', isDevMode);
    if (!isApiKeySet && !isDevMode) {
      alert("Please set your API Key first by clicking the 'API Key' button in the header.");
      setApiKeyModalMode('default'); // Ensure it's in default mode for setting a new key
      setIsApiKeyModalOpen(true);
      return;
    }
    setIsAnalysisModalOpen(true);
  }, [isApiKeySet, isDevMode]);

  const handleCloseAnalysisModal = useCallback(() => {
    setIsAnalysisModalOpen(false);
  }, []);

  const handleOpenApiKeyModal = useCallback(() => {
    setApiKeyError(''); // Clear previous errors
    // If an encrypted key exists but no current API key, assume we need to decrypt
    if (localStorage.getItem(ENCRYPTED_API_KEY_LOCALSTORAGE_KEY) && !currentUserApiKey) {
      setApiKeyModalMode('decryptPrompt');
    } else {
      setApiKeyModalMode('default');
    }
    setIsApiKeyModalOpen(true);
  }, [currentUserApiKey]);

  const handleCloseApiKeyModal = useCallback(() => {
    setIsApiKeyModalOpen(false);
    setApiKeyError(''); // Clear errors on close
    // If closing decrypt prompt without success, reset mode
    if (apiKeyModalMode === 'decryptPrompt' && !currentUserApiKey) {
        setApiKeyModalMode('default');
    }
  }, [apiKeyModalMode, currentUserApiKey]);

  // --- API Key Management ---
  const handleSaveApiKey = useCallback(async (key, saveOption, passphrase) => {
    console.log('[WISEDashboard] handleSaveApiKey called. Option:', saveOption, 'Mode:', apiKeyModalMode);
    setApiKeyError(''); // Clear previous errors

    if (apiKeyModalMode === 'decryptPrompt') {
        const encryptedKeyData = localStorage.getItem(ENCRYPTED_API_KEY_LOCALSTORAGE_KEY);
        if (!encryptedKeyData) {
            setApiKeyError("No encrypted key found to decrypt.");
            setApiKeyModalMode('default'); // Should not happen if UI is correct
            return;
        }
        if (!passphrase) {
            setApiKeyError("Passphrase is required to decrypt.");
            return;
        }
        try {
            console.log('[WISEDashboard] Attempting to decrypt API key...');
            const decryptedKey = await decryptApiKey(encryptedKeyData, passphrase);
            setCurrentUserApiKey(decryptedKey);
            setIsApiKeySet(true);
            setApiKeySource('encrypted');
            // Also store it in session for this session's direct use after successful decrypt
            sessionStorage.setItem(INSECURE_API_KEY_SESSIONSTORAGE_KEY, decryptedKey); 
            console.log('[WISEDashboard] API Key decrypted and set for session.');
            alert('API Key decrypted successfully and is ready for use this session!');
            handleCloseApiKeyModal();
        } catch (error) {
            console.error('[WISEDashboard] Decryption failed:', error);
            setApiKeyError(error.message || "Decryption failed. Incorrect passphrase or corrupted data.");
            // Do not close modal, let user retry passphrase or reset.
        }
        return;
    }

    // Default mode: Save/Update key
    if (!key.trim()) {
        setApiKeyError("API Key cannot be empty.");
        return;
    }

    if (saveOption === 'secure') {
      if (!passphrase.trim()) {
        setApiKeyError('Passphrase cannot be empty for secure save.');
        return;
      }
      try {
        console.log('[WISEDashboard] Encrypting API key...');
        const encryptedKeyString = await encryptApiKey(key, passphrase);
        localStorage.setItem(ENCRYPTED_API_KEY_LOCALSTORAGE_KEY, encryptedKeyString);
        sessionStorage.removeItem(INSECURE_API_KEY_SESSIONSTORAGE_KEY); // Remove insecure version
        setCurrentUserApiKey(key); // Use for current session
        setIsApiKeySet(true);
        setApiKeySource('encrypted');
        console.log('[WISEDashboard] API Key encrypted and stored in localStorage.');
        alert('API Key saved securely!');
        handleCloseApiKeyModal();
      } catch (error) {
        console.error('[WISEDashboard] Encryption failed:', error);
        setApiKeyError(error.message || 'Encryption failed. Please try again.');
      }
    } else { // session save
      sessionStorage.setItem(INSECURE_API_KEY_SESSIONSTORAGE_KEY, key);
      localStorage.removeItem(ENCRYPTED_API_KEY_LOCALSTORAGE_KEY); // Remove secure version
      setCurrentUserApiKey(key);
      setIsApiKeySet(true);
      setApiKeySource('session');
      console.log('[WISEDashboard] API Key stored for session in sessionStorage.');
      alert('API Key will be used for this session only.');
      handleCloseApiKeyModal();
    }
  }, [handleCloseApiKeyModal, apiKeyModalMode]);

  const handleForgetKey = useCallback(() => {
    console.log('[WISEDashboard] handleForgetKey called.');
    sessionStorage.removeItem(INSECURE_API_KEY_SESSIONSTORAGE_KEY);
    localStorage.removeItem(ENCRYPTED_API_KEY_LOCALSTORAGE_KEY);
    setCurrentUserApiKey('');
    setIsApiKeySet(false);
    setApiKeySource(null);
    setApiKeyError(''); // Clear any errors in modal
    setApiKeyModalMode('default'); // Reset modal mode
    alert('Stored API key has been forgotten.');
    // Keep modal open for user to enter new key or close, or close it:
    // handleCloseApiKeyModal(); 
  }, []);


  // --- Navigation & Analysis ---
  const handleGoToDashboard = useCallback(() => {
    setShowLandingPage(false);
    setActiveTab('overview');
  }, []);

  const handleAnalysisSubmit = useCallback(async (options = {}) => {
    const { file, text } = options;
    console.log('[WISEDashboard] handleAnalysisSubmit called. API Key Set:', isApiKeySet, 'Key:', currentUserApiKey ? 'Exists' : 'MISSING');

    if (!isApiKeySet || !currentUserApiKey) { // Check both isApiKeySet and actual key
      setApiErrorHook('API Key is not set or not loaded. Please configure it first.');
      setApiKeyModalMode(localStorage.getItem(ENCRYPTED_API_KEY_LOCALSTORAGE_KEY) ? 'decryptPrompt' : 'default');
      setIsApiKeyModalOpen(true);
      return;
    }

    let currentDisplayTitle = "Analysis";
    if (file) currentDisplayTitle = file.name;
    else if (text) currentDisplayTitle = "Text Input Analysis";
    else { setApiErrorHook('No input provided.'); return; }
    setDisplayTitle(currentDisplayTitle);

    setApiErrorHook(null); 
    setCurrentAnalysisDataState(null); 

    try {
      handleCloseAnalysisModal();
      console.log('[WISEDashboard] Calling triggerAnalysis from hook...');
      const result = await triggerAnalysis({ file, text, apiKey: currentUserApiKey });
      console.log('[WISEDashboard] Result received from triggerAnalysis hook:', result);
      
      if (result && result.metadata) {
        setCurrentAnalysisDataState(result);
        setShowLandingPage(false); 
        setActiveTab('overview'); 
      } else {
        console.error('[WISEDashboard] Result from triggerAnalysis was null or invalid.');
        if (!apiErrorHook) { 
            setApiErrorHook("Received invalid data from analysis, please try again.");
        }
        setCurrentAnalysisDataState(null);
      }
    } catch (error) {
      console.error("[WISEDashboard] Error during handleAnalysisSubmit's try/catch:", error.message);
      if (!apiErrorHook) {
          setApiErrorHook(error.message || "An unexpected error occurred during analysis submission.");
      }
      setCurrentAnalysisDataState(null);
    }
  }, [
    triggerAnalysis, setApiErrorHook, apiErrorHook, handleCloseAnalysisModal, 
    currentUserApiKey, isApiKeySet, // Added isApiKeySet
    setCurrentAnalysisDataState, setShowLandingPage, setActiveTab, setDisplayTitle
  ]);

  const radarData = analysisDataToDisplay?.manipulationByCategory?.length ? analysisDataToDisplay.manipulationByCategory.map(category => ({
    subject: category.name,
    A: (category.blatant || 0) + (category.borderline || 0),
    // fullMark: some_max_value // If you want a consistent scale for radar
  })) : [];

  const headerAnalysisData = showLandingPage ? null : analysisDataToDisplay;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        analysisData={headerAnalysisData}
        onReanalyzeClick={handleOpenAnalysisModal}
        onOpenApiKeyModal={handleOpenApiKeyModal}
      />

      <div className="flex-grow px-4 py-6">
        {showLandingPage && (
          <LandingPageContent
            onGetStartedClick={handleGoToDashboard}
            analysisData={null}
            isLoading={isLoading && !isDevMode}
          />
        )}

        {!showLandingPage && (
          <>
            <NavigationBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              displayTitle={analysisDataToDisplay ? displayTitle : "WISE Dashboard"}
              overallIntent={analysisDataToDisplay?.metadata?.overallIntent}
            />
            <main className="pt-4">
              {displayError && !isLoading && ( 
                <div className="mb-4 text-error bg-error/10 p-4 rounded border border-error/30" role="alert">
                  <strong>Error:</strong> {displayError}
                </div>
              )}
              {isLoading && (
                  <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      <p className="ml-3 text-primary">Loading analysis...</p>
                  </div>
              )}
              {!isLoading && activeTab === 'overview' && (
                <OverviewTabContent analysisData={analysisDataToDisplay} />
              )}
              {!isLoading && activeTab === 'learningHub' && (
                <LearningHubTabContent radarData={radarData} analysisData={analysisDataToDisplay} />
              )}
              {!isLoading && activeTab === 'resources' && (
                <ResourcesTabContent />
              )}
              {!isLoading && !analysisDataToDisplay && !displayError && (
                 <div className="text-center py-10">
                    <h3 className="text-xl font-semibold text-gray-700">Welcome to WISE</h3>
                    <p className="text-gray-500 mt-2">
                        {isApiKeySet ? "Click 'New Analysis' in the header to begin." : "Please set your API Key using the 'API Key' button in the header to start."}
                    </p>
                 </div>
              )}
            </main>
          </>
        )}
      </div>

      <OverviewModal tactic={selectedTactic} onClose={() => setSelectedTactic(null)} />
      <Footer />
      <AnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={handleCloseAnalysisModal}
        onAnalyze={handleAnalysisSubmit}
        isLoading={isLoading}
      />
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={handleCloseApiKeyModal}
        onSaveApiKey={handleSaveApiKey}
        onForgetKey={handleForgetKey} // Pass forget key handler
        currentApiKey={currentUserApiKey}
        error={apiKeyError} // Pass error message to modal
        mode={apiKeyModalMode} // Pass mode to modal
        hasEncryptedKeyStored={!!localStorage.getItem(ENCRYPTED_API_KEY_LOCALSTORAGE_KEY)} // Let modal know if encrypted key exists
      />
    </div>
  );
};

export default WISEDashboard;