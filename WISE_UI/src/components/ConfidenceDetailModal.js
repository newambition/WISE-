import React from 'react';
import PropTypes from 'prop-types';

const ConfidenceDetailModal = ({ isOpen, onClose, justification }) => {
  if (!isOpen) {
    return null;
  }

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Use themed overlay
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out" // Increased z-index slightly
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confidence-modal-title"
    >
      {/* Modal Content Box - Re-add animation classes */}
      <div
        className="bg-base-100 rounded-lg shadow-xl max-w-xl w-full overflow-hidden transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-appear" // Re-added scale-95 opacity-0 animate-modal-appear
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className="bg-base-200 p-4 border-b border-base-300 flex justify-between items-center">
          <h2 id="confidence-modal-title" className="text-lg font-semibold text-base-content">
            Confidence Score Justification
          </h2>
          {/* Use themed close button */}
          <button 
            onClick={onClose} 
            className="text-base-content opacity-70 hover:opacity-100 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body - Display Justification */}
        <div className="p-6">
          <p className="text-base-content whitespace-pre-wrap"> {/* Use pre-wrap to respect newlines in justification text */}
            {justification || 'No justification provided.'}
          </p>
        </div>

        {/* Footer - Use theme bg/border */}
        <div className="px-6 py-3 bg-base-200 border-t border-base-300 text-right">
          {/* Use standard themed button */}
          <button
            className="px-4 py-2 rounded-lg bg-primary text-primary-content hover:brightness-95 active:brightness-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ConfidenceDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  justification: PropTypes.string, 
};

ConfidenceDetailModal.defaultProps = {
  justification: 'No justification provided.',
};

export default ConfidenceDetailModal; 