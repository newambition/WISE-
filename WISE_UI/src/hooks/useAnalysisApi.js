import { useState, useCallback } from 'react';

// Define API URL (Consider moving to a config file or env var if used elsewhere)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function useAnalysisApi(initialData = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(initialData);

  const triggerAnalysis = useCallback(async (options = {}) => {
    const { file, text } = options;

    if (!file && !text) {
      setError('Please select a file or enter text to analyze.');
      // Indicate failure to the caller
      throw new Error('Input validation failed: No file or text provided.');
    }

    setIsLoading(true);
    setError(null); // Clear previous errors before new request

    const formData = new FormData();
    let inputDescription = '';

    if (file) {
      formData.append('file', file);
      inputDescription = `file: ${file.name}`;
    } else if (text) {
      const textBlob = new Blob([text], { type: 'text/plain' });
      formData.append('file', textBlob, 'input.txt'); // Backend expects a file
      inputDescription = 'text input';
    }
    console.log(`Triggering analysis with ${inputDescription}`);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || JSON.stringify(errorData) || errorMsg;
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      // Basic validation of response structure
      if (!data.metadata || !data.tactics) {
        throw new Error('Invalid response format from server');
      }

      console.log('Analysis successful (hook):', data);
      setAnalysisData(data);
      return data; // Return data on success

    } catch (err) {
      console.error('Analysis API call failed (hook):', err);
      setError(err.message || 'An unknown error occurred during analysis.');
      setAnalysisData(null); // Clear data on failure
      throw err; // Re-throw the error so the calling component knows it failed
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed as API_URL is constant and setters are stable

  // Return state, trigger function, and potentially the raw setError if needed elsewhere
  return { isLoading, error, analysisData, triggerAnalysis, setError };
}