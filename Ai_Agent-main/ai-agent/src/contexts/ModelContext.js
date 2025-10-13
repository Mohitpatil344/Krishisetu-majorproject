import React, { createContext, useContext, useState, useEffect } from 'react';

const ModelContext = createContext(null);

export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) {
    console.error('useModel must be used within a ModelProvider');
    return {
      currentModel: 'gemini-2.0-flash-exp',
      setModel: () => {},
      availableModels: [],
      modelInfo: {}
    };
  }
  return context;
};

export const AVAILABLE_MODELS = {
  'gemini-2.0-flash-exp': {
    name: 'Gemini 2.0 Flash (Experimental)',
    description: 'Latest experimental model with enhanced capabilities',
    speed: 'Fast',
    capabilities: ['Text', 'Function Calling', 'Multimodal'],
    recommended: true
  },
  'gemini-1.5-pro': {
    name: 'Gemini 1.5 Pro',
    description: 'Most capable model for complex reasoning',
    speed: 'Medium',
    capabilities: ['Text', 'Function Calling', 'Multimodal', 'Long Context'],
    recommended: false
  },
  'gemini-1.5-flash': {
    name: 'Gemini 1.5 Flash',
    description: 'Fast and efficient for most tasks',
    speed: 'Very Fast',
    capabilities: ['Text', 'Function Calling', 'Multimodal'],
    recommended: false
  },
  'gemini-1.0-pro': {
    name: 'Gemini 1.0 Pro',
    description: 'Stable model for production use',
    speed: 'Medium',
    capabilities: ['Text', 'Function Calling'],
    recommended: false
  }
};

export const ModelProvider = ({ children }) => {
  const [currentModel, setCurrentModel] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedModel');
      if (saved && AVAILABLE_MODELS[saved]) {
        return saved;
      }
      return 'gemini-2.0-flash-exp'; // Default model
    } catch (error) {
      console.warn('Error reading model preference:', error);
      return 'gemini-2.0-flash-exp';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('selectedModel', currentModel);
    } catch (error) {
      console.warn('Error saving model preference:', error);
    }
  }, [currentModel]);

  const setModel = (modelId) => {
    if (AVAILABLE_MODELS[modelId]) {
      setCurrentModel(modelId);
    } else {
      console.warn(`Invalid model ID: ${modelId}`);
    }
  };

  const value = {
    currentModel,
    setModel,
    availableModels: Object.keys(AVAILABLE_MODELS),
    modelInfo: AVAILABLE_MODELS[currentModel],
    allModels: AVAILABLE_MODELS
  };

  return (
    <ModelContext.Provider value={value}>
      {children}
    </ModelContext.Provider>
  );
};