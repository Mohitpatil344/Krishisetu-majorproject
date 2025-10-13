import React from 'react';
import { FaRobot, FaBrain } from 'react-icons/fa';
import { useModel } from '../contexts/ModelContext';

const EmptyState = ({ isConnected, geminiAI }) => {
    const { modelInfo } = useModel();

    return (
        <div className="h-full flex flex-col items-center justify-center text-text-muted px-4">
            <FaRobot className="text-4xl mb-4 opacity-50" />
            <p className="text-center max-w-md mb-4">
                Start a conversation with the AI assistant powered by Google Gemini.
                You can ask questions, request information, or try using available tools.
            </p>
            <div className="w-full max-w-sm p-3 bg-background-medium rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                    <FaBrain className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-text-primary">Current Model</span>
                </div>
                <p className="text-sm text-text-secondary">{modelInfo.name}</p>
                <p className="text-xs text-text-muted mt-1">{modelInfo.description}</p>
            </div>
            {!isConnected && (
                <p className="text-center max-w-md mt-4 text-error text-sm">
                    Make sure the MCP server is running on localhost:9999
                </p>
            )}
            {!geminiAI && (
                <p className="text-center max-w-md mt-2 text-warning text-sm">
                    Add REACT_APP_GEMINI_API to your .env file for AI responses
                </p>
            )}
        </div>
    );
};

export default EmptyState;