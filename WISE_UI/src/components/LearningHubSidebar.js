import React, { useState } from 'react';

// Tactics list extracted from taxonomy_kb copy.json
const tactics = [
  { id: 1, name: 'Appeal to Hope/Belonging (Solution Framing)' },
  { id: 2, name: 'Appeal to Anger/Grievance' },
  { id: 3, name: 'Appeal to Fear' },
  { id: 4, name: 'Argument by Assertion' },
  { id: 5, name: 'Tribal Framing / In-group Out-group' },
  { id: 6, name: 'Straw Man' },
  { id: 7, name: 'Scapegoating' },
  { id: 8, name: 'Loaded Language' },
  { id: 9, name: 'Omission of Key Information' },
  { id: 10, name: 'Framing by Association' },
  { id: 11, name: 'Gaslighting' },
  { id: 12, name: 'Sealioning' },
  { id: 13, name: 'Moral Superiority Framing' },
  { id: 14, name: 'Cherry Picking' },
  { id: 15, name: 'False Dilemma' },
  { id: 16, name: 'Bandwagon Effect' },
  { id: 17, name: 'Ad Hominem' },
  { id: 18, name: 'Appeal to Authority' },
  { id: 19, name: 'Red Herring' },
  { id: 20, name: 'Appeal to Tradition' },
  { id: 21, name: 'Affirmation' },
];

const LearningHubSidebar = ({ activeHubItem, onSelectItem }) => {
  const [tacticsOpen, setTacticsOpen] = useState(true);

  return (
    <nav className="p-4 space-y-4">
      {/* Tactic Library Section */}
      <div>
        <button
          className="block w-full text-left px-3 py-2 rounded font-bold bg-base-200 hover:bg-base-300"
          onClick={() => setTacticsOpen((open) => !open)}
        >
          Tactic Library
          <span className="float-right">{tacticsOpen ? '▾' : '▸'}</span>
        </button>
        {tacticsOpen && (
          <ul className="mt-2 ml-2 space-y-1">
            {tactics.map((tactic) => (
              <li key={tactic.id}>
                <button
                  className={`block w-full text-left px-3 py-1 rounded ${activeHubItem.type === 'tactic' && activeHubItem.id === tactic.id ? 'bg-primary/10 font-semibold text-primary' : 'hover:bg-base-300'}`}
                  onClick={() => onSelectItem({ type: 'tactic', id: tactic.id })}
                >
                  {tactic.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Simulation Hub Section */}
      <div>
        <button
          className={`block w-full text-left px-3 py-2 rounded ${activeHubItem.type === 'simulation' ? 'bg-primary/10 font-bold' : 'hover:bg-base-300'}`}
          onClick={() => onSelectItem({ type: 'simulation', id: null })}
        >
          Simulation Hub
        </button>
      </div>
      {/* Add more sidebar items as needed */}
    </nav>
  );
};

export default LearningHubSidebar; 