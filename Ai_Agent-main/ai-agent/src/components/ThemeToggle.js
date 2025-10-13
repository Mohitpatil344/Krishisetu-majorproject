import React from 'react';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ variant = 'default' }) => {
  const { isDarkMode, toggleTheme, setTheme } = useTheme();

  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button className="p-2 rounded-lg bg-background-medium hover:bg-background-light transition-colors duration-200 border border-white/10">
          {isDarkMode ? (
            <FaMoon className="w-4 h-4 text-primary" />
          ) : (
            <FaSun className="w-4 h-4 text-warning" />
          )}
        </button>
        
        <div className="absolute right-0 top-full mt-2 py-2 w-48 bg-background-medium border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <button
            onClick={() => setTheme('light')}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-background-light transition-colors flex items-center gap-3 ${
              !isDarkMode ? 'text-primary bg-background-light' : 'text-text-primary'
            }`}
          >
            <FaSun className="w-4 h-4" />
            Light Mode
          </button>
          
          <button
            onClick={() => setTheme('dark')}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-background-light transition-colors flex items-center gap-3 ${
              isDarkMode ? 'text-primary bg-background-light' : 'text-text-primary'
            }`}
          >
            <FaMoon className="w-4 h-4" />
            Dark Mode
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem('theme');
              const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              setTheme(systemPrefersDark ? 'dark' : 'light');
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-background-light transition-colors flex items-center gap-3 text-text-primary"
          >
            <FaDesktop className="w-4 h-4" />
            System Default
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-lg bg-background-medium hover:bg-background-light transition-all duration-200 border border-white/10 group"
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        <FaSun 
          className={`absolute inset-0 w-5 h-5 text-warning transform transition-all duration-300 ${
            isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`} 
        />
        <FaMoon 
          className={`absolute inset-0 w-5 h-5 text-primary transform transition-all duration-300 ${
            isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;