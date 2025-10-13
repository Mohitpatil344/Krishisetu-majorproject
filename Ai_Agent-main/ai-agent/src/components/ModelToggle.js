import React, { useState } from 'react';
import { FaBrain, FaCheck, FaChevronDown, FaStar, FaChrome, FaCog } from 'react-icons/fa';
import { useModel } from '../contexts/ModelContext';

const ModelToggle = ({ variant = 'dropdown' }) => {
  const { currentModel, setModel, modelInfo, allModels } = useModel();
  const [isOpen, setIsOpen] = useState(false);

  const handleModelChange = (modelId) => {
    setModel(modelId);
    setIsOpen(false);
  };

  const getSpeedIcon = (speed) => {
    switch (speed) {
      case 'Very Fast':
        return <FaChrome className="w-3 h-3 text-success" />;
      case 'Fast':
        return <FaChrome className="w-3 h-3 text-warning" />;
      case 'Medium':
        return <FaCog className="w-3 h-3 text-text-muted" />;
      default:
        return <FaCog className="w-3 h-3 text-text-muted" />;
    }
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-background-medium hover:bg-background-light transition-colors duration-200 border border-white/10 flex items-center gap-2"
          title={`Current model: ${modelInfo.name}`}
        >
          <FaBrain className="w-4 h-4 text-primary" />
          <span className="text-xs text-text-secondary hidden sm:inline">
            {currentModel.split('-')[1]}
          </span>
          <FaChevronDown className={`w-3 h-3 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[9998]" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 py-2 w-80 bg-background-medium border border-white/10 rounded-lg shadow-xl z-[9999] dropdown-menu">
              <div className="px-3 py-2 border-b border-white/10">
                <h3 className="text-sm font-medium text-text-primary">Select Gemini Model</h3>
                <p className="text-xs text-text-muted mt-1">Choose the model that best fits your needs</p>
              </div>
              
              <div className="max-h-64 overflow-y-auto scrollbar-thin">
                {Object.entries(allModels).map(([modelId, model]) => (
                  <button
                    key={modelId}
                    onClick={() => handleModelChange(modelId)}
                    className={`w-full px-3 py-3 text-left hover:bg-background-light transition-colors flex items-start gap-3 ${
                      currentModel === modelId ? 'bg-background-light border-r-2 border-primary' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {currentModel === modelId ? (
                        <FaCheck className="w-4 h-4 text-primary" />
                      ) : (
                        <FaBrain className="w-4 h-4 text-text-muted" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-text-primary truncate">
                          {model.name}
                        </span>
                        {model.recommended && (
                          <FaStar className="w-3 h-3 text-warning flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-xs text-text-muted mb-2 line-clamp-2">{model.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {getSpeedIcon(model.speed)}
                          <span className="text-xs text-text-secondary">{model.speed}</span>
                        </div>
                        
                        <div className="flex gap-1 flex-wrap">
                          {model.capabilities.slice(0, 2).map((cap, index) => (
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
                  </button>
                ))}
              </div>
              
              <div className="px-3 py-2 border-t border-white/10">
                <p className="text-xs text-text-muted">
                  Model changes take effect immediately for new conversations
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <button className="p-2 rounded-lg bg-background-medium hover:bg-background-light transition-colors duration-200 border border-white/10">
        <FaBrain className="w-4 h-4 text-primary" />
      </button>
      
      <div className="absolute right-0 top-full mt-2 py-2 w-64 bg-background-medium border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] dropdown-menu">
        <div className="px-3 py-2 border-b border-white/10">
          <h3 className="text-sm font-medium text-text-primary">Current Model</h3>
          <p className="text-xs text-text-muted">{modelInfo.name}</p>
        </div>
        
        {Object.entries(allModels).map(([modelId, model]) => (
          <button
            key={modelId}
            onClick={() => handleModelChange(modelId)}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-background-light transition-colors flex items-center gap-3 ${
              currentModel === modelId ? 'text-primary bg-background-light' : 'text-text-primary'
            }`}
          >
            {currentModel === modelId ? (
              <FaCheck className="w-3 h-3" />
            ) : (
              <FaBrain className="w-3 h-3" />
            )}
            <span className="truncate">{model.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelToggle;