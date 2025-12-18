import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Trash2, X } from 'lucide-react';

const ChatInterface = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [voiceReadingEnabled, setVoiceReadingEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');



        try {
            const response = await fetch('http://localhost:5001/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'messageText': inputText
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            const botMessage = {
                id: (Date.now() + 1).toString(),
                text: data.answer || "I'm sorry, I couldn't understand that.",
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);

            if (voiceReadingEnabled && 'speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(botMessage.text);
                window.speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error('Error fetching chat response:', error);
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting to the server. Please ensure the backend is running.",
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputText(transcript);
            setIsListening(false);
        };

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleClearChat = () => {
        setMessages([]);
    };

    return (
        <div className="fixed bottom-24 right-4 w-full md:w-96 h-[80vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 border border-green-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-xl">🌾</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">AgriGenius</h3>
                        <p className="text-xs text-green-100 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                            Online
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                        <span className="text-4xl opacity-50">👋</span>
                        <p className="text-sm">Start a conversation with AgriGenius</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${message.sender === 'user'
                                    ? 'bg-green-600 text-white rounded-br-sm'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{message.text}</p>
                                <p
                                    className={`text-[10px] mt-1 text-right ${message.sender === 'user' ? 'text-green-100' : 'text-gray-400'
                                        }`}
                                >
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-3 border-t border-gray-100">
                <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-gray-400"
                    />
                    <button
                        type="button"
                        onClick={handleVoiceInput}
                        className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all ${isListening
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        title="Voice Input"
                    >
                        <Mic size={18} />
                    </button>
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="w-10 h-10 flex-shrink-0 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        <Send size={18} />
                    </button>
                </form>

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={voiceReadingEnabled}
                                onChange={(e) => setVoiceReadingEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                        </div>
                        <span className="text-xs text-gray-500 group-hover:text-gray-700">Voice Read</span>
                    </label>

                    <button
                        onClick={handleClearChat}
                        className="flex items-center gap-1.5 px-2 py-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors text-xs"
                    >
                        <Trash2 size={14} />
                        <span>Clear</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
