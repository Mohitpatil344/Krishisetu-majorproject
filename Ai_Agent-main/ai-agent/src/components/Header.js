import React from 'react';
import { FaRobot, FaCog } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import ModelToggle from './ModelToggle';

const Header = () => {
  return (
    <header className="w-full h-full bg-background-medium border-b border-white/5 px-6 py-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <FaRobot className="text-white text-lg" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-text-primary truncate">AI Agent</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 flex-shrink-0">
        <ModelToggle variant="compact" />
        <ThemeToggle variant="dropdown" />
        
        <button className="p-2.5 rounded-lg bg-background-light hover:bg-background-dark transition-colors duration-200 border border-white/10">
          <FaCog className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
    </header>
  );
};

export default Header;