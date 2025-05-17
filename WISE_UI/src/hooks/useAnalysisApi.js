import { useState, useCallback, useEffect } from 'react'; // Added useEffect

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function useAnalysisApi(initialData = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(initialData); // Hook's internal state

  const triggerAnalysis = useCallback(async (options = {}) => {
    const { file, text, apiKey } = options;
    console.log('[useAnalysisApi] triggerAnalysis called with options:', { fileExists: !!file, textExists: !!text, apiKeyExists: !!apiKey });

    if (!file && !text) {
      console.error('[useAnalysisApi] Validation Error: No file or text provided.');
      setError('Please select a file or enter text to analyze.');
      throw new Error('Input validation failed: No file or text provided.');
    }

    if (!apiKey) {
      console.error('[useAnalysisApi] Validation Error: API Key is required.');
      setError('API Key is required for analysis.');
      throw new Error('API Key is required for analysis.');
    }

    setIsLoading(true);
    setError(null);
    // setAnalysisData(null); // Clear previous data immediately if desired, or wait for new data/error

    const formData = new FormData();
    let inputDescription = '';

    if (file) {
      formData.append('file', file);
      inputDescription = `file: ${file.name}`;
    } else if (text) {
      const textBlob = new Blob([text], { type: 'text/plain' });
      formData.append('file', textBlob, 'input.txt');
      inputDescription = 'text input';
    }
    
    formData.append('user_api_key', apiKey);

    console.log(`[useAnalysisApi] Starting fetch to ${API_URL}/api/analyze with ${inputDescription}.`);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      console.log('[useAnalysisApi] Fetch response received:', response);

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        let errorDataDetails = null;
        try {
          const errorData = await response.json();
          errorDataDetails = errorData.detail || JSON.stringify(errorData);
          errorMsg = `${errorMsg} - ${errorDataDetails}`;
          console.error('[useAnalysisApi] Non-OK response JSON:', errorData);
        } catch (e) {
          errorMsg = `${errorMsg} - ${response.statusText || "Could not parse error body."}`;
          console.error('[useAnalysisApi] Could not parse error response as JSON:', e);
        }
        
        if (response.status === 401) {
            errorMsg = `API Key Error (401): ${errorDataDetails || response.statusText}. Please check your API key.`;
        }
        console.error(`[useAnalysisApi] Fetch error: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('[useAnalysisApi] Successfully parsed JSON response:', data);

      if (!data || typeof data !== 'object' || !data.metadata || !data.tactics) {
        console.error("[useAnalysisApi] Invalid response format from server. Data:", data);
        throw new Error('Invalid response format from server. Expected metadata and tactics.');
      }

      console.log('[useAnalysisApi] Analysis successful. Setting analysisData in hook.');
      setAnalysisData(data); // Update hook's internal state
      return data; // Return data to the calling component

    } catch (err) {
      console.error('[useAnalysisApi] Catch block error:', err, err.message);
      setError(err.message || 'An unknown error occurred during analysis.');
      setAnalysisData(null); // Clear data on failure
      throw err; // Re-throw to be caught by WISEDashboard
    } finally {
      setIsLoading(false);
      console.log('[useAnalysisApi] triggerAnalysis finished.');
    }
  }, []); // Dependencies are stable

  // Log when the hook's internal analysisData changes
  useEffect(() => {
    console.log('[useAnalysisApi] Internal analysisData state changed:', analysisData);
  }, [analysisData]);

  // The hook still returns its own analysisData state, isLoading, error, and the trigger function
  return { isLoading, error, analysisData, triggerAnalysis, setError };
}