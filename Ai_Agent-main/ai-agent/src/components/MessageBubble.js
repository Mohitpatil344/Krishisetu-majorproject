import React from 'react';
import { FaUser, FaRobot, FaTools, FaExclamationTriangle, FaBrain } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useModel } from '../contexts/ModelContext';

const MessageBubble = ({ message, index }) => {
  const { isDarkMode } = useTheme();
  const { modelInfo } = useModel();

  const getRoleIcon = (role) => {
    switch (role) {
      case 'user':
        return <FaUser size={14} />;
      case 'assistant':
        return <FaRobot size={14} />;
      case 'tool':
        return <FaTools size={14} />;
      case 'system':
        return <FaBrain size={14} />;
      default:
        return <FaExclamationTriangle size={14} />;
    }
  };

  const getRoleStyles = (role) => {
    switch (role) {
      case 'user':
        return 'bg-primary text-white';
      case 'assistant':
        return 'bg-background-medium text-white';
      case 'tool':
        return 'bg-secondary text-white';
      case 'system':
        return 'bg-warning text-white';
      default:
        return 'bg-error text-white';
    }
  };

  const getMessageStyles = (role) => {
    switch (role) {
      case 'user':
        return 'bg-background-medium text-text-primary';
      case 'assistant':
        return isDarkMode ? 'bg-black/20 text-white' : 'bg-light-bg-secondary text-light-text-primary';
      case 'tool':
        return 'bg-secondary/10 text-text-primary';
      case 'system':
        return 'bg-warning/10 text-text-primary';
      default:
        return 'bg-error/10 text-text-primary';
    }
  };

  return (
    <div className={`flex animate-fade-in message-${message.role}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-colors duration-300 flex-shrink-0 ${getRoleStyles(message.role)}`}>
        {getRoleIcon(message.role)}
      </div>
      
      <div className={`flex-1 p-3 rounded-lg max-w-[85%] transition-colors duration-300 min-w-0 ${getMessageStyles(message.role)}`}>
        {/* Tool Badge */}
        {message.tool && (
          <div className="mb-1.5">
            <span className="inline-block px-2 py-0.5 bg-secondary/20 text-secondary text-xs rounded-full">
              🔧 {message.tool}
            </span>
          </div>
        )}
        
        {/* Model Badge */}
        {message.model && message.role === 'assistant' && (
          <div className="mb-1.5">
            <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
              🤖 {modelInfo.name}
            </span>
          </div>
        )}
        
        {/* Message Content */}
        <p className="m-0 whitespace-pre-wrap text-sm break-words leading-relaxed">
          {message.content}
        </p>
        
        {/* Timestamp */}
        {message.timestamp && (
          <div className="mt-1.5 text-xs text-text-muted opacity-70">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;