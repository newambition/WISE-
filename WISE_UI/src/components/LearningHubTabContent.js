import React, { useState } from 'react';
import LearningHubSidebar from './LearningHubSidebar';
import TacticDetailViewer from './TacticDetailViewer';
import SimulationHub from './SimulationHub';

const LearningHubTabContent = () => {
  // Placeholder state for selected sidebar item
  const [activeHubItem, setActiveHubItem] = useState({ type: 'tactic', id: 1 });

  // Minimal conditional rendering for demonstration
  let MainContent = null;
  if (activeHubItem.type === 'tactic') {
    MainContent = <TacticDetailViewer tacticId={activeHubItem.id} />;
  } else if (activeHubItem.type === 'simulation') {
    MainContent = <SimulationHub />;
  } else {
    MainContent = <div className="p-8 text-base-content/80">Select an item from the sidebar.</div>;
  }

  return (
    <div className="flex min-h-[60vh] h-full">
      <div className="w-64 h-full overflow-y-auto border-r border-base-300 bg-base-100">
        <LearningHubSidebar activeHubItem={activeHubItem} onSelectItem={setActiveHubItem} />
      </div>
      <div className="flex-1 bg-base-50 p-8">
        {MainContent}
      </div>
    </div>
  );
};

export default LearningHubTabContent; 