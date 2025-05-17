import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content py-6 mt-auto"> {/* Added mt-auto for sticky footer effect if needed */}
      <div className="container mx-auto px-4">
        <p className="mb-2">WISE: Wisdom in Identifying and Stopping Exploitation</p>
        <p className="text-sm opacity-80">Understanding persuasion is the only real inoculation against it.</p>
      </div>
    </footer>
  );
};

export default Footer; 