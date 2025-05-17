import React from 'react';
import PropTypes from 'prop-types';
// Import Loader2 icon
import { Loader2 } from 'lucide-react';

const LoadingIndicator = ({ message = "Processing your content..." }) => {
  return (
    // Container to center the indicator
    <div className="flex flex-col items-center justify-center p-10 text-center">
      {/* Use Loader2 icon with theme primary color and spin animation */}
      <Loader2 
        className="animate-spin h-12 w-12 text-primary mb-4" 
        aria-hidden="true" // Still hide decorative icon
        role="status" // Keep role
      />
      {/* Loading Message using theme base text color */}
      <p className="text-lg text-base-content font-medium">
        {message}
      </p>
    </div>
  );
};

LoadingIndicator.propTypes = {
  /**
   * Optional message to display below the spinner.
   */
  message: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  message: "Processing your content...",
};

export default LoadingIndicator; 