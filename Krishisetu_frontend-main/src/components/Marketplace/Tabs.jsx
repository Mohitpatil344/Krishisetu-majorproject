import React from 'react';

const Tabs = ({ activeTab, setActiveTab, userType, setUserType }) => {
  const tabs = ['marketplace', 'orders', 'buyers', 'analytics'];
  
  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex space-x-4">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 font-medium rounded-md ${
                  activeTab === tab ? 'bg-green-500 text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1"
            >
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
