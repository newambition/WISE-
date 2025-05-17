import React from 'react';
import PropTypes from 'prop-types';

const TABS = [
  { key: 'overview', label: 'Analysis Dashboard' },
  { key: 'learningHub', label: 'Learning Hub' },
  { key: 'resources', label: 'Resources' },
];

const NavigationBar = ({ activeTab, onTabChange, displayTitle}) => {
  

  return (
    <nav className="border-b border-base-300 bg-base-100 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 border-b border-base-300">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`py-4 px-1 ${
                activeTab === tab.key
                  ? 'text-primary border-b-2 border-primary font-medium'
                  : 'text-base-content opacity-70 hover:opacity-100'
              }`}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

NavigationBar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  displayTitle: PropTypes.string,
};

NavigationBar.defaultProps = {
  displayTitle: '',
};

export default NavigationBar; 