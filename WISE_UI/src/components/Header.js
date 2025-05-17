import React from 'react';
import PropTypes from 'prop-types';
import { KeyRound, FilePlus2 } from 'lucide-react'; // Added FilePlus2 for New Analysis icon

const Header = ({ analysisData, onReanalyzeClick, onOpenApiKeyModal }) => { // analysisData prop is kept for now, might be useful for other things or can be removed if truly not needed by Header
  const primaryButtonClass = "font-semibold text-md px-8 py-3 rounded-2xl shadow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:ring-accent bg-primary text-primary-content hover:brightness-110 flex items-center gap-2";
  const apiKeyButtonClass = "font-semibold text-md px-6 py-2 rounded-xl shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:ring-accent bg-info text-info-content hover:bg-info/90 flex items-center gap-2";

  return (
    <header className="bg-base-100 text-primary font-sans py-4">
      <div className="px-16 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-title text-6xl font-extrabold tracking-tight text-primary">WISE</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* "New Analysis" button is now always visible in the header.
              The onReanalyzeClick (handleOpenAnalysisModal) will handle API key checks.
              The 'analysisData' prop check is removed for its visibility.
          */}
          <button
            onClick={onReanalyzeClick} // This prop is handleOpenAnalysisModal from WISEDashboard
            className={primaryButtonClass}
            title="Start a new content analysis"
          >
            <FilePlus2 size={20} /> New Analysis
          </button>
          
          <button
            onClick={onOpenApiKeyModal}
            className={apiKeyButtonClass}
            title="Manage your API Key"
          >
            <KeyRound size={18} /> API Key
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  // analysisData can remain, might be used for other indicators in header later, or can be removed if fully unused.
  // For now, keeping it doesn't hurt, but its role in button visibility is gone.
  analysisData: PropTypes.shape({
    metadata: PropTypes.shape({
      confidenceScore: PropTypes.number,
      overallIntent: PropTypes.string
    })
  }),
  onReanalyzeClick: PropTypes.func.isRequired, // Renamed for clarity, was for "New Analysis"
  onOpenApiKeyModal: PropTypes.func.isRequired,
};

Header.defaultProps = {
  analysisData: null,
};

export default Header;