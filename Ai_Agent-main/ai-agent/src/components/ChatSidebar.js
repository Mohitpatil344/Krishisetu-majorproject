import React from 'react';
import { FaBrain, FaTools, FaCircle } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useModel } from '../contexts/ModelContext';

const ChatSidebar = ({ isConnected, geminiAI, tools }) => {
  const { theme } = useTheme();
  const { modelInfo } = useModel();

  return (
        <div className="w-64 bg-background-medium border-r border-white/5 p-4 flex flex-col transition-colors duration-300 sidebar">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-success' : 'bg-error'} transition-colors duration-300`}></div>
              <span className="ml-2 text-sm text-text-secondary">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          {/* Current Model Display */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-text-primary mb-3">Current Model</h3>
            <div className="p-2.5 bg-background-dark rounded-lg mb-3 transition-colors duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FaBrain className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-text-primary truncate">{modelInfo.name}</span>
                </div>
                {modelInfo.recommended && (
                  <span className="px-1.5 py-0.5 bg-warning/20 text-warning text-xs rounded flex-shrink-0">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mb-2">{modelInfo.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Speed: {modelInfo.speed}</span>
                <div className="flex gap-1 flex-wrap">
                  {modelInfo.capabilities.slice(0, 2).map((cap, index) => (
                    <span 
                      key={index}
                      className="px-1.5 py-0.5 bg-secondary/10 text-secondary text-xs rounded"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-text-primary mb-3">AI Status</h3>
            <div className="p-2.5 bg-background-dark rounded-lg mb-3 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text-primary">Google Gemini</div>
                  <div className="text-xs text-text-muted mt-1">
                    {geminiAI ? 'Ready' : 'Not configured'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tools Section */}
          <div className="mb-6 flex-1 min-h-0">
            <h3 className="text-sm font-medium text-text-primary mb-3">Available Tools</h3>
            <div className="space-y-2 h-full max-h-64 overflow-y-auto scrollbar-thin">
              {tools.length > 0 ? (
                tools.map((tool, index) => (
                  <div key={index} className="p-2.5 bg-background-dark rounded-lg hover:bg-background-light transition-colors duration-200 cursor-default">
                    <div className="text-sm font-medium text-text-primary truncate">{tool.name}</div>
                    <div className="text-xs text-text-muted mt-1 line-clamp-2">{tool.description}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-text-muted italic">No tools available</div>
              )}
            </div>
          </div>
          
          {/* Theme indicator */}
          <div className="mt-auto flex-shrink-0">
            <div className="p-2.5 bg-background-dark rounded-lg transition-colors duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Theme</span>
                <span className="text-xs text-text-secondary capitalize">{theme}</span>
              </div>
            </div>
          </div>
        </div>
    );
};

export default ChatSidebar;