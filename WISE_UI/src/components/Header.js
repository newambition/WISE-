import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AuthModal from './AuthModal';

// Accept only necessary props now
const Header = ({ analysisData, onReanalyzeClick }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  // Updated button styling to match landing page primary CTA
  const primaryButtonClass = "font-semibold text-md px-8 py-3 rounded-2xl shadow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:ring-accent bg-primary text-primary-content hover:brightness-110";
  
  // Secondary button (Login) - more subtle but still visible
  const secondaryButtonClass = "font-semibold text-md px-6 py-2 rounded-xl shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:ring-accent bg-base-200 text-base-content hover:bg-base-300";

  return (
    // Use theme colors: bg-primary, text-primary-content
    // Use font-sans as the base font for the header scope
    <header className="bg-base-100 text-primary font-sans py-4">
      <div className="px-16 flex justify-between items-center">
        {/* Left side: Logo and Title */}
        <div>
          <div className="flex items-center gap-3">
            {/* Apply heading font and styling, use primary-content color */}
            <h1 className="font-title text-6xl font-extrabold tracking-tight text-primary">WISE</h1>
          </div>
        </div>
        {/* Right side: Login button + Conditional New Analysis button */}
        <div className="flex items-center gap-4">
          {analysisData && (
            <button
              onClick={onReanalyzeClick}
              className={primaryButtonClass}
            >
              New Analysis
            </button>
          )}
          <button
            onClick={() => setAuthModalOpen(true)}
            className={secondaryButtonClass}
          >
            Login
          </button>
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
      </div>
    </header>
  );
};

// Update PropTypes to reflect changes
Header.propTypes = {
  analysisData: PropTypes.shape({
    metadata: PropTypes.shape({
      confidenceScore: PropTypes.number
    })
  }),
  onReanalyzeClick: PropTypes.func.isRequired
};

Header.defaultProps = {
  analysisData: null
};

export default Header;