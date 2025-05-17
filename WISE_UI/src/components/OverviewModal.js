// OverviewModal: For Overview tab only. Renders tactic details from FastAPI JSON (not tacticsData.json). Do not import or use TacticDetailViewer.
import React from 'react';
import PropTypes from 'prop-types';

const OverviewModal = ({ tactic, onClose }) => {
  if (!tactic) {
    return null;
  }

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out overflow-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tactic-modal-title"
    >
      <div
        className="bg-base-100 rounded-2xl shadow-md hover:shadow-xl hover:shadow-info/20 border border-base-300 max-w-4xl w-full overflow-hidden transform transition-all duration-300 ease-in-out animate-modal-appear my-8"
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-2 flex items-center gap-3">
          <span className="text-2xl mr-2">❓</span>
          <div>
            <h2 className="text-2xl font-bold text-base-content mb-1">{tactic.name}</h2>
            <p className="text-base-content/70 text-md">{tactic.category}</p>
          </div>
        </div>

        {/* Example from Text */}
        {tactic.quote && (
          <div className="mt-8 mb-6 px-8">
            <h3 className="text-md font-semibold text-center mb-2 tracking-wide text-tactic-muted-strong">EXAMPLE FROM TEXT</h3>
            <div className="bg-tactic-primary-10 border-l-4 border-tactic-primary-10 rounded-r-lg px-6 py-4 italic text-lg text-tactic-muted-strong">
              "{tactic.quote}"
            </div>
          </div>
        )}

        {/* Why This Might Be Used */}
        {tactic.intent && (
          <div className="mt-8 mb-6 px-8">
            <h3 className="text-md font-semibold text-center mb-2 tracking-wide text-tactic-muted-strong">WHY THIS MIGHT BE USED</h3>
            <div className="text-base-content/90 text-center text-lg">
              {tactic.intent}
            </div>
          </div>
        )}

        {/* How to Resist This Tactic */}
        {tactic.resistanceStrategy && (
          <div className="mt-8 mb-6 px-8">
            <h3 className="text-md font-semibold text-center mb-2 tracking-wide text-tactic-muted-strong flex items-center gap-2 justify-center">
              <span className="text-lg">🛡️</span> HOW TO RESIST THIS TACTIC
            </h3>
            <div className="bg-tactic-header-fade border-l-4 border-tactic-primary-10 rounded-r-lg px-6 py-4 text-base-content/90 text-lg">
              {tactic.resistanceStrategy}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-base-200 border-t border-base-300 text-right">
          <button
            className="px-4 py-2 rounded-lg bg-primary text-primary-content hover:brightness-95 active:brightness-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modal-appear {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-modal-appear {
          animation: modal-appear 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

OverviewModal.propTypes = {
  tactic: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    category: PropTypes.string,
    intent: PropTypes.string,
    quote: PropTypes.string,
    resistanceStrategy: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default OverviewModal;