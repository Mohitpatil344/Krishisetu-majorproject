import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, ArrowUp, Sparkles, Volume2, VolumeX } from 'lucide-react';

const Schemes = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [lang] = useState('en');
    const [speakingIndex, setSpeakingIndex] = useState(null);
    const [apiKey, setApiKey] = useState('');
    const [showApiInput, setShowApiInput] = useState(true);
    const chatRef = useRef(null);
    const inputRef = useRef(null);

    /* ---------------- Greeting ---------------- */
    useEffect(() => {
        const savedKey = localStorage.getItem('groq_api_key');
        if (savedKey) {
            setApiKey(savedKey);
            setShowApiInput(false);
            setMessages([
                {
                    from: 'bot',
                    text: 'Hello! I am your Government Schemes Assistant. Ask me about any central or state scheme, eligibility, benefits, or application process.',
                },
            ]);
        }
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
        const currentInput = input;
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant specializing in Indian government schemes. Provide accurate, detailed information about central and state government schemes, eligibility criteria, benefits, and application processes. Be concise but informative.'
                        },
                        ...messages.map(msg => ({
                            role: msg.from === 'user' ? 'user' : 'assistant',
                            content: msg.text
                        })),
                        {
                            role: 'user',
                            content: currentInput
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const botResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

            setMessages(prev => [
                ...prev,
                {
                    from: 'bot',
                    text: botResponse,
                    fromBackend: true,
                },
            ]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [
                ...prev,
                {
                    from: 'bot',
                    text: 'Sorry, there was an error processing your request. Please check your API key and try again.',
                    fromBackend: false,
                },
            ]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const saveApiKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem('groq_api_key', apiKey);
            setShowApiInput(false);
            setMessages([
                {
                    from: 'bot',
                    text: 'Hello! I am your Government Schemes Assistant. Ask me about any central or state scheme, eligibility, benefits, or application process.',
                },
            ]);
        }
    };

    const resetApiKey = () => {
        localStorage.removeItem('groq_api_key');
        setApiKey('');
        setShowApiInput(true);
        setMessages([]);
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
                    {!showApiInput && (
                        <button
                            onClick={resetApiKey}
                            className="ml-auto px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                            Change API Key
                        </button>
                    )}
                </div>
            </header>

            {/* ================= API KEY INPUT ================= */}
            {showApiInput && (
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-green-200 p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-800 mb-2">Welcome!</h2>
                            <p className="text-gray-600">Enter your Groq API key to get started</p>
                        </div>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && saveApiKey()}
                            placeholder="Enter your Groq API key..."
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800 outline-none border border-green-200 focus:border-green-400 transition-colors mb-4"
                        />
                        <button
                            onClick={saveApiKey}
                            disabled={!apiKey.trim()}
                            className="w-full py-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium transition-all shadow-lg disabled:shadow-none"
                        >
                            Start Chatting
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-4">
                            Get your free API key at{' '}
                            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                                console.groq.com
                            </a>
                        </p>
                    </div>
                </div>
            )}

            {/* ================= CHAT ================= */}
            {!showApiInput && (
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
                                <div className="prose prose-sm max-w-none whitespace-pre-wrap">{msg.text}</div>
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
            )}

            {/* ================= INPUT ================= */}
            {!showApiInput && (
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
            )}
        </div>
    );
};

export default Schemes;