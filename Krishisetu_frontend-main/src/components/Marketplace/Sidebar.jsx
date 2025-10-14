// src/components/Marketplace/Sidebar.jsx
import React from 'react';

const Sidebar = ({ sections, activeSection, setActiveSection }) => {
  return (
    <div className="w-60 h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Marketplace</h2>
      <ul>
        {sections.map((section) => (
          <li
            key={section}
            onClick={() => setActiveSection(section)}
            className={`cursor-pointer p-2 mb-2 rounded ${
              activeSection === section
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {section}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
