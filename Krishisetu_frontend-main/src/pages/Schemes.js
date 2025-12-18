import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, ArrowUp, MessageSquare, Sparkles, Volume2, VolumeX } from 'lucide-react';

const Schemes = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [lang, setLang] = useState('en');
    const [speakingIndex, setSpeakingIndex] = useState(null);
    const chatRef = useRef(null);
    const inputRef = useRef(null);

    /* ---------------- Greeting ---------------- */
    useEffect(() => {
        setMessages([
            {
                from: 'bot',
                text: 'Hello! I am your Government Schemes Assistant. Ask me about any central or state scheme, eligibility, benefits, or application process.',
            },
        ]);
    }, []);

    /* ---------------- Auto Scroll ---------------- */
    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages, loading]);

    /* ---------------- Voice Player ---------------- */
    const toggleVoice = (text, index) => {
        if (!('speechSynthesis' in window)) return;
        if (speakingIndex === index) {
            window.speechSynthesis.cancel();
            setSpeakingIndex(null);
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.9;
        utterance.onend = () => setSpeakingIndex(null);
        utterance.onerror = () => setSpeakingIndex(null);
        setSpeakingIndex(index);
        window.speechSynthesis.speak(utterance);
    };

    /* ---------------- Send Message ---------------- */
    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { from: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    from: 'bot',
                    text: 'Backend is currently disabled. This is a temporary response so the UI remains visible and usable.',
                    fromBackend: false,
                },
            ]);
            setLoading(false);
            inputRef.current?.focus();
        }, 800);
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
            {/* ================= HEADER ================= */}
            <header className="bg-white border-b border-green-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-green-800">Government Schemes</h1>
                        <p className="text-sm text-green-600">AI-Powered Government Schemes Assistant</p>
                    </div>
                </div>
            </header>

            {/* ================= CHAT ================= */}
            <div
                ref={chatRef}
                className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl w-full mx-auto space-y-6"
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.from === 'bot' && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                        )}

                        <div
                            className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-md ${msg.from === 'user'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-800 border border-green-100'
                                }`}
                        >
                            {msg.from === 'bot' && msg.fromBackend && (
                                <button
                                    onClick={() => toggleVoice(msg.text, idx)}
                                    className={`mb-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${speakingIndex === idx
                                            ? 'bg-red-500 text-white'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                >
                                    {speakingIndex === idx ? (
                                        <>
                                            <VolumeX className="w-4 h-4" />
                                            Playing...
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="w-4 h-4" />
                                            Listen
                                        </>
                                    )}
                                </button>
                            )}
                            <div className="prose prose-sm max-w-none">{msg.text}</div>
                        </div>

                        {msg.from === 'user' && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-700 to-green-800 flex items-center justify-center flex-shrink-0 shadow-md">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white border border-green-100 rounded-2xl px-5 py-3 shadow-md">
                            <div className="flex gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                            <p className="text-sm text-green-600 mt-1">Typing...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ================= INPUT ================= */}
            <div className="border-t border-green-200 bg-white/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-end gap-3 bg-white rounded-2xl shadow-lg border border-green-200 p-2">
                        <textarea
                            ref={inputRef}
                            rows={1}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask about government schemes, subsidies or farmer benefits..."
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-50 text-gray-800 outline-none resize-none border border-green-100 focus:border-green-300 transition-colors"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 flex items-center justify-center transition-all shadow-md disabled:shadow-none"
                        >
                            <ArrowUp className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <p className="text-xs text-green-600 text-center mt-2">
                        Press Enter to send • Shift + Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Schemes;