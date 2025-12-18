import React, { useState } from 'react';
import { MessageCircle } from "lucide-react";
import ChatInterface from './ChatInterface';

const ChatbotIcon = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {isOpen && <ChatInterface onClose={() => setIsOpen(false)} />}

            {!isOpen && (
                <div className="relative group">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-green-600 rounded-full blur-xl opacity-50 animate-pulse group-hover:opacity-75 transition-opacity duration-300"></div>

                    <button
                        className="relative bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white p-4 md:p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
                        aria-label="Chat with Farm Assistant"
                        onClick={() => setIsOpen(true)}
                    >
                        <MessageCircle
                            size={32}
                            strokeWidth={2.5}
                            className="transition-transform duration-300 group-hover:rotate-12"
                        />

                        {/* Notification Dot */}
                        <span className="absolute top-0 right-0 w-4 h-4 bg-amber-400 rounded-full border-2 border-white animate-pulse"></span>
                    </button>

                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl shadow-xl text-green-800 text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block border border-green-100">
                        Ask Krishi Sahayak 🌿
                        <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-8 border-transparent border-l-white"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotIcon;
