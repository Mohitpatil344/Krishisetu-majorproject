import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaTools, FaExclamationTriangle, FaBrain, FaImage, FaTimes } from 'react-icons/fa';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { GoogleGenAI } from "@google/genai";
import { useTheme } from '../contexts/ThemeContext';
import { useModel } from '../contexts/ModelContext';
import Swal from 'sweetalert2';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
// import VoiceAssistant from './VoiceAssistant';

const debug = (area, message, data = null) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${area}]`;

  if (data) {
    console.log(prefix, message, data);
  } else {
    console.log(prefix, message);
  }
};

const Chat = () => {
  const { isDarkMode, theme } = useTheme();
  const { currentModel, modelInfo } = useModel();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [tools, setTools] = useState([]);
  const [mcpClient, setMcpClient] = useState(null);
  const [transport, setTransport] = useState(null);
  const [geminiAI, setGeminiAI] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [geminiTools, setGeminiTools] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (process.env.REACT_APP_GEMINI_API) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API });
        setGeminiAI(ai);
        debug('Gemini', `Google Gemini AI initialized with model: ${currentModel}`);
      } catch (error) {
        debug('Gemini', 'Error initializing Gemini AI:', error);
      }
    } else {
      debug('Gemini', 'No Gemini API key found in environment variables');
    }
  }, [currentModel]);

  useEffect(() => {
    if (messages.length > 0) {
      const modelChangeMessage = {
        role: 'system',
        content: `🔄 Switched to ${modelInfo.name}. Previous conversation context has been reset.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, modelChangeMessage]);
      setChatHistory([]);
      debug('Model', `Model changed to: ${currentModel}`);
    }
  }, [currentModel]);

  useEffect(() => {
    const client = new Client({
      name: 'ai-agent-client',
      version: '1.0.0'
    });
    setMcpClient(client);
  }, []);

  const connectToMCP = useCallback(async (client) => {
    const maxRetries = 3;
    const baseDelay = 1000;

    for (let retries = 0; retries < maxRetries; retries++) {
      try {
        const newTransport = new SSEClientTransport(new URL('http://localhost:9999/sse'));
        await client.connect(newTransport);

        setTransport(newTransport);
        setIsConnected(true);
        debug('MCP', 'Connected to Model Context Protocol server');

        // List available tools
        const response = await client.listTools();
        const mcpTools = response.tools || [];
        setTools(mcpTools);

        const geminiFormattedTools = mcpTools.map(tool => ({
          name: tool.name,
          description: tool.description,
          parameters: {
            type: tool.inputSchema?.type || 'object',
            properties: tool.inputSchema?.properties || {},
            required: tool.inputSchema?.required || []
          }
        }));

        setGeminiTools(geminiFormattedTools);
        debug('MCP', 'Available tools:', mcpTools);
        return true;

      } catch (error) {
        const delay = baseDelay * Math.pow(2, retries);
        debug('MCP', `Connection failed (attempt ${retries + 1}/${maxRetries}). ${retries < maxRetries - 1 ? `Retrying in ${delay}ms...` : 'Max retries reached.'}`, error);

        if (retries < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    setIsConnected(false);
    Swal.fire({
      title: 'Connection Failed',
      text: 'Could not connect to the MCP server. Please make sure the server is running on localhost:9999.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return false;
  }, []);

  // Connect to MCP server
  useEffect(() => {
    if (mcpClient) {
      connectToMCP(mcpClient);
    }

    return () => {
      if (transport?.close) {
        debug('MCP', 'Closing transport connection');
        transport.close();
      }
    };
  }, [mcpClient, connectToMCP]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);


  const handleToolCall = useCallback(async (functionCall) => {
    debug('Tool', 'Executing tool:', functionCall);

    addMessage({
      role: 'tool',
      content: `Using tool: ${functionCall.name}`,
      tool: functionCall.name,
      args: functionCall.args
    });

    try {
      const toolResult = await mcpClient.callTool({
        name: functionCall.name,
        arguments: functionCall.args
      });

      const resultContent = toolResult.content?.[0]?.text || JSON.stringify(toolResult);

      addMessage({
        role: 'tool',
        content: resultContent,
        tool: functionCall.name
      });

      const updatedHistory = [...chatHistory,
      {
        role: 'model',
        parts: [{ text: `Calling tool ${functionCall.name}`, type: 'text' }]
      },
      {
        role: 'user',
        parts: [{ text: `Tool Results: ${resultContent}`, type: 'text' }]
      }
      ];

      setChatHistory(updatedHistory);

      return await generateGeminiResponse(updatedHistory);

    } catch (toolError) {
      debug('Tool', 'Tool execution error:', toolError);
      addMessage({
        role: 'error',
        content: `Error running tool ${functionCall.name}: ${toolError.message}`
      });
      throw toolError;
    }
  }, [mcpClient, chatHistory, addMessage]);

  const generateGeminiResponse = useCallback(async (history = null) => {
    if (!geminiAI) {
      throw new Error('Gemini AI not initialized');
    }

    const currentHistory = history || chatHistory;

    try {
      debug('Gemini', `Generating response using model: ${currentModel}`);

      const response = await geminiAI.models.generateContent({
        model: currentModel, // Use the selected model
        contents: currentHistory,
        config: geminiTools.length > 0 ? {
          tools: [{ functionDeclarations: geminiTools }]
        } : undefined
      });

      debug('Gemini', `Response received from ${currentModel}:`, response);

      const candidate = response.candidates?.[0];
      if (!candidate) {
        throw new Error(`No response candidate received from ${currentModel}`);
      }

      const part = candidate.content?.parts?.[0];
      if (!part) {
        throw new Error('No content parts in response');
      }

      const { functionCall, text: responseText } = part;

      if (functionCall) {
        debug('Gemini', 'Function call detected:', functionCall);
        return await handleToolCall(functionCall);
      } else if (responseText) {
        addMessage({
          role: 'assistant',
          content: responseText,
          model: currentModel,
          timestamp: new Date().toISOString()
        });

        const updatedHistory = [...currentHistory, {
          role: 'model',
          parts: [{ text: responseText, type: 'text' }]
        }];
        setChatHistory(updatedHistory);

        return responseText;
      } else {
        throw new Error('No text or function call in response');
      }

    } catch (error) {
      debug('Gemini', `Error generating response with ${currentModel}:`, error);
      throw error;
    }
  }, [geminiAI, currentModel, chatHistory, geminiTools, handleToolCall, addMessage]);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();

    if (!input.trim() || isLoading || !isConnected) return;

    const userInput = input.trim();
    const imageFile = selectedImage;
    addMessage({ role: 'user', content: userInput });
    setInput('');
    setIsLoading(true);

    try {
      if (imageFile) {
        const base64Image = await convertImageToBase64(imageFile);
        
        addMessage({
          role: 'user',
          content: `Image uploaded: ${imageFile.name}`,
          image: base64Image
        });

        addMessage({
          role: 'tool',
          content: `Creating post with image and text: "${userInput}"`,
          tool: 'createPost'
        });

        const updatedHistory = [...chatHistory, {
          role: 'user',
          parts: [{ text: userInput, type: 'text' }]
        }];
        setChatHistory(updatedHistory);

        const toolResult = await mcpClient.callTool({
          name: 'createPost',
          arguments: {
            status: userInput,
            imageData: base64Image
          }
        });

        const resultContent = toolResult?.content?.[0]?.text || JSON.stringify(toolResult);
        addMessage({
          role: 'tool',
          content: `Post created successfully: ${resultContent}`,
          tool: 'createPost'
        });
        
        clearSelectedImage();
      }

      const updatedHistory = [...chatHistory, {
        role: 'user',
        parts: [{ text: userInput, type: 'text' }]
      }];
      setChatHistory(updatedHistory);

      if (geminiAI) {
        await generateGeminiResponse(updatedHistory);
      } else {
        throw new Error('Gemini AI not available');
      }

    } catch (error) {
      debug('Chat', 'Error in handleSubmit:', error);

      addMessage({
        role: 'error',
        content: `Unable to get response: ${error.message}`
      });

      Swal.fire({
        title: 'Error',
        text: `Failed to get a response: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
      if (selectedImage) {
        clearSelectedImage();
      }
    }
  }, [input, isLoading, isConnected, chatHistory, geminiAI, generateGeminiResponse, addMessage]);



  const handleVoiceCommand = useCallback(async (transcript) => {
    if (!transcript.trim() || !isConnected) return;

    setInput(transcript);
    setTimeout(() => {
      handleSubmit();
    }, 500);
  }, [isConnected, handleSubmit]);

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: 'Invalid File',
          text: 'Please select a valid image file (JPG, PNG, GIF, WebP)',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          title: 'File Too Large',
          text: 'Please select an image smaller than 10MB',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const clearSelectedImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  }, []);

  const convertImageToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handlePostToTwitter = useCallback(async (content) => {
    if (!isConnected) return;

    setIsLoading(true);

    try {
      const toolName = "createPost";
      const tool = tools.find(t => t.name === toolName);

      if (!tool) {
        throw new Error("Twitter posting tool not available");
      }

      addMessage({
        role: 'tool',
        content: `Posting to Twitter: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
        tool: toolName,
        args: { status: content }
      });

      const result = await mcpClient.callTool({
        name: toolName,
        arguments: { status: content }
      });

      addMessage({
        role: 'tool',
        content: `Successfully posted to Twitter: ${result.content?.[0]?.text || JSON.stringify(result)}`
      });

      Swal.fire({
        title: 'Success!',
        text: 'Your message was posted to Twitter',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      debug('Twitter', 'Error posting to Twitter', error);

      addMessage({
        role: 'error',
        content: `Error posting to Twitter: ${error.message}`
      });

      Swal.fire({
        title: 'Error',
        text: `Failed to post to Twitter: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, tools, mcpClient, addMessage]);

  useEffect(() => {
    const swalTheme = {
      background: isDarkMode ? '#1e293b' : '#ffffff',
      color: isDarkMode ? '#f8fafc' : '#1e293b',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
    };

    Swal.mixin(swalTheme);
  }, [isDarkMode]);


  return (
    <div className="flex flex-1 overflow-hidden chat-container">
      <div className="hidden md:flex flex-shrink-0">
        <ChatSidebar isConnected={isConnected} geminiAI={geminiAI} tools={tools} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-background-dark transition-colors duration-300">
        <MessageList isConnected={isConnected} geminiAI={geminiAI} isDarkMode={isDarkMode} messages={messages} messagesEndRef={messagesEndRef} isLoading={isLoading} />

        <div className="border-t border-white/5 p-4 bg-background-medium transition-colors duration-300 flex-shrink-0">
          {imagePreview && (
            <div className="mb-4 relative inline-block">
              <img
                src={imagePreview}
                alt="Selected"
                className="w-20 h-20 object-cover rounded-lg border border-white/10"
              />
              <button
                onClick={clearSelectedImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isConnected ? `Ask ${modelInfo.name} or upload an image to post...` : "Connecting to server..."}
                disabled={!isConnected || isLoading}
                className="flex-1 p-2.5 bg-background-dark border border-white/10 rounded-lg text-text-primary text-sm outline-none transition-all duration-200 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed min-w-0"
              />

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={!isConnected || isLoading}
                className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white transition-all duration-200 hover:bg-gray-500 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
                title="Upload Image"
              >
                <FaImage size={14} />
              </button>

              <button
                type="submit"
                disabled={(!input.trim() && !selectedImage) || !isConnected || isLoading}
                className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white transition-all duration-200 hover:bg-primary-dark disabled:opacity-60 disabled:bg-primary/50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <FaPaperPlane size={14} />
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
              <span className="truncate">
                Model: {modelInfo.name}
                {selectedImage && (
                  <span className="ml-2 text-blue-400">
                    • Image selected: {selectedImage.name}
                  </span>
                )}
              </span>
              <span className="flex-shrink-0 ml-2">Speed: {modelInfo.speed}</span>
            </div>
          </form>
        </div>
      </div>
      {/*       
      <VoiceAssistant 
        isConnected={isConnected}
        onVoiceCommand={handleVoiceCommand}
        onPostToTwitter={handlePostToTwitter}
        tools={tools}
      /> */}
    </div>
  );
};

export default Chat;