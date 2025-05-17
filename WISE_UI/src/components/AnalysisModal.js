import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const AnalysisModal = ({ isOpen, onClose, onAnalyze, isLoading }) => {
  // Internal state for the modal's inputs
  const [localFile, setLocalFile] = useState(null);
  const [localInputText, setLocalInputText] = useState('');
  const [localError, setLocalError] = useState(null);

  // Reset internal state when the modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setLocalFile(null);
      setLocalInputText('');
      setLocalError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation (can be expanded)
      const allowedTypes = [
        'text/plain',
        'text/markdown',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      const allowedExtensions = ['.txt', '.md', '.docx'];
      const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

      if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        setLocalFile(file);
        setLocalInputText(''); // Clear text if file is selected
        setLocalError(null);
      } else {
        setLocalFile(null);
        setLocalError('Invalid file type. Please select .txt, .md, or .docx');
      }
    } else {
      setLocalFile(null); // Clear if selection is cancelled
    }
  };

  const handleTextChange = (e) => {
    setLocalInputText(e.target.value);
    setLocalFile(null); // Clear file if text is entered
    setLocalError(null);
  };

  const handleSubmit = () => {
    // Prioritize file if both somehow exist
    if (localFile) {
      setLocalError(null);
      onAnalyze({ file: localFile }); // Pass file object
    } else if (localInputText.trim()) {
      setLocalError(null);
      onAnalyze({ text: localInputText }); // Pass text content
    } else {
      setLocalError('Please select a file or enter text.');
    }
    // Parent's handleAnalysis will call onClose if successful
  };

  // Determine if the analyze button should be disabled
  const isAnalyzeDisabled = isLoading || (!localFile && !localInputText.trim());

  return (
    // Modal Overlay - Using RGBA arbitrary value for background
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Modal Content Card - Use theme background */}
      <div
        className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-2xl h-auto relative transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Use theme text color/opacity */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-base-content opacity-50 hover:opacity-100 text-2xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Title - Use theme text color */}
        <h2 className="text-xl font-semibold mb-5 text-center text-base-content">Upload New Content</h2>

        {/* File Input Zone - Themed like main form */}
        <div className="mb-4">
           <label
            htmlFor="modal-file-upload"
            className="block w-full border-2 border-dashed border-base-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-base-200 transition-colors"
          >
            <span className="text-primary font-medium">Select file</span> or drag & drop
            <p className="text-xs text-base-content opacity-80 mt-1">Supports: .txt, .md, .docx</p>
            <input
              id="modal-file-upload"
              name="modal-file-upload"
              type="file"
              className="sr-only"
              accept=".txt,.md,.docx,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </label>
          {localFile && (
            <p className="text-sm text-base-content opacity-90 mt-2 text-center">Selected: {localFile.name}</p>
          )}
        </div>

        {/* OR Separator - Use theme border/text */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-base-300"></div>
          <span className="flex-shrink mx-4 text-base-content opacity-80 text-sm">OR</span>
          <div className="flex-grow border-t border-base-300"></div>
        </div>

        {/* Text Input Area - Use theme border/focus/disabled */}
        <div className="mb-4">
          <label htmlFor="modal-text-input" className="sr-only">Type or paste text here</label>
          <textarea
            id="modal-text-input"
            rows="5"
            className="block w-full p-3 border border-base-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm disabled:bg-base-200"
            placeholder="Type or paste text here..."
            value={localInputText}
            onChange={handleTextChange}
            disabled={isLoading}
          />
        </div>

         {/* Error Display - Use theme error colors */}
        {localError && (
          <div
            className="text-error bg-error/10 border border-error/20 p-3 rounded my-4 text-sm"
            role="alert"
            aria-live="assertive"
          >
            {localError}
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          {/* Cancel Button - Themed */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-base-300 text-base-content hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-base-content/50 disabled:opacity-50"
          >
            Cancel
          </button>
          {/* Analyze Button - Themed with loader */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isAnalyzeDisabled}
            className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center ${
              isAnalyzeDisabled && !isLoading
                ? 'bg-neutral text-neutral-content'
                : isLoading
                ? 'bg-primary text-primary-content opacity-75'
                : 'bg-primary text-primary-content hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Analyzing...
              </>
            ) : (
              'Run Analysis'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

AnalysisModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  /** Function to call when analysis is triggered. Receives an object: { file: File } or { text: string } */
  onAnalyze: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default AnalysisModal; 