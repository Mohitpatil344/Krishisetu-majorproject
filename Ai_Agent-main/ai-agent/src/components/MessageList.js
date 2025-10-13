import React, { forwardRef } from 'react';
import MessageBubble from './MessageBubble';
import { FaPaperPlane, FaRobot, FaUser, FaTools, FaExclamationTriangle, FaBrain } from 'react-icons/fa';

import LoadingIndicator from './LoadingIndicator';
import { useModel } from '../contexts/ModelContext';
import EmptyState from './EmptyState';

const MessageList = forwardRef(({ isConnected,geminiAI,isDarkMode, messages,messagesEndRef, isLoading }, ref) => {
    const { modelInfo } = useModel();
    return (
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
            {messages.length === 0 ? (
                <EmptyState isConnected={isConnected} geminiAI={geminiAI} />
            ) : (
                <div className="space-y-4 pb-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex animate-fade-in message-${message.role}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-colors duration-300 flex-shrink-0
                        ${message.role === 'user' ? 'bg-primary text-white' :
                                    message.role === 'assistant' ? isDarkMode ? 'bg-background-medium text-white' : 'bg-blue-500 text-white' :
                                        message.role === 'tool' ? 'bg-secondary text-white' :
                                            message.role === 'system' ? 'bg-warning text-white' :
                                                'bg-error text-white'}`}
                            >
                                {message.role === 'user' ? <FaUser size={14} /> :
                                    message.role === 'assistant' ? <FaRobot size={14} /> :
                                        message.role === 'tool' ? <FaTools size={14} /> :
                                            message.role === 'system' ? <FaBrain size={14} /> :
                                                <FaExclamationTriangle size={14} />}
                            </div>

                            <div className={`flex-1 p-3 rounded-lg max-w-[85%] transition-colors duration-300 min-w-0
                        ${message.role === 'user' ? 'bg-background-medium text-text-primary' :
                                    message.role === 'assistant' ? isDarkMode ? 'bg-black/20 text-white' : 'bg-light-bg-secondary text-light-text-primary' :
                                        message.role === 'tool' ? 'bg-secondary/10 text-text-primary' :
                                            message.role === 'system' ? 'bg-warning/10 text-text-primary' :
                                                'bg-error/10 text-text-primary'}`}
                            >
                                {message.tool && (
                                    <div className="mb-1.5">
                                        <span className="inline-block px-2 py-0.5 bg-secondary/20 text-secondary text-xs rounded-full">
                                            {message.tool}
                                        </span>
                                    </div>
                                )}

                                {message.model && message.role === 'assistant' && (
                                    <div className="mb-1.5">
                                        <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                                            {modelInfo.name}
                                        </span>
                                    </div>
                                )}

                                <p className="m-0 whitespace-pre-wrap text-sm break-words">{message.content}</p>

                                {message.timestamp && (
                                    <div className="mt-1.5 text-xs text-text-muted opacity-70">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex animate-fade-in">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5 bg-background-medium text-white flex-shrink-0">
                                <FaRobot size={14} />
                            </div>
                            <div className="flex-1 p-3 rounded-lg max-w-[85%] bg-black/20 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div className="animate-pulse flex space-x-1">
                                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <span className="ml-2 text-sm text-white/70">Thinking...</span>
                                    </div>
                                    <span className="text-xs text-white/50 hidden sm:inline">{modelInfo.name}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
});


export default MessageList;