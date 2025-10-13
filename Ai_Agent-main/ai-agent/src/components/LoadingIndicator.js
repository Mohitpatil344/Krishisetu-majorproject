import React from 'react';
import { FaRobot } from 'react-icons/fa';
import { useModel } from '../contexts/ModelContext';

const LoadingIndicator = () => {
  const { modelInfo } = useModel();

  return (
    <div className="flex animate-fade-in">
      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5 bg-background-medium text-white flex-shrink-0">
        <FaRobot size={14} />
      </div>
      <div className="flex-1 p-3 rounded-lg max-w-[85%] bg-black/20 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="ml-2 text-sm text-white/70">Thinking...</span>
          </div>
          <span className="text-xs text-white/50 hidden sm:inline">{modelInfo.name}</span>
        </div>
        <div className="text-xs text-white/50">
          Processing your request using {modelInfo.name}
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;