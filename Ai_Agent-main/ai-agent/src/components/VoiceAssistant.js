import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaPause, FaTwitter } from 'react-icons/fa';
import { MdClose, MdSettings } from 'react-icons/md';
import { useSpring, animated } from 'react-spring';
import Ripples from 'react-ripples';
import Lottie from 'react-lottie-player';
import Swal from 'sweetalert2';
import annyang from 'annyang';

import voiceWaveAnimation from '../assets/voice.json';
import TwitterPostForm from './TwitterPostForm';

const VoiceAssistant = ({ 
  isConnected, 
  onVoiceCommand, 
  onPostToTwitter,
  tools = []
}) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [recentCommands, setRecentCommands] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    wakeWord: 'assistant',
    twitterCommands: ['post to twitter', 'tweet this', 'post on x'],
    sensitivity: 0.7,
    language: 'en-US'
  });
  const [showTwitterForm, setShowTwitterForm] = useState(false);
  const [twitterFormText, setTwitterFormText] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  
  const recognitionRef = useRef(null);
  const annyangRef = useRef(null);
  
  const micAnimation = useSpring({
    transform: isListening ? 'scale(1.1)' : 'scale(1)',
    boxShadow: isListening 
      ? '0 0 25px rgba(255, 59, 48, 0.7)' 
      : '0 0 5px rgba(0, 0, 0, 0.2)',
    config: { tension: 300, friction: 20 }
  });

  const panelAnimation = useSpring({
    height: isExpanded ? '300px' : '60px',
    opacity: 1,
    from: { opacity: 0, height: '60px' }
  });
  
  const contentAnimation = useSpring({
    opacity: isExpanded ? 1 : 0,
    transform: isExpanded ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 280, friction: 20 }
  });

  useEffect(() => {
    // Check if annyang is available
    if (annyang) {
      annyangRef.current = annyang;
      setSpeechSupported(true);
      
      const commands = {
        'assistant *command': handleWakeWord,
        'create a post on twitter with topic *text': text => handleTwitterPost(text),
        'tweet this *text': text => handleTwitterPost(text),
        'post on x *text': text => handleTwitterPost(text)
      };
      
      annyangRef.current.addCommands(commands);
      annyangRef.current.setLanguage(voiceSettings.language);
      
      annyangRef.current.addCallback('result', handleResult);
      annyangRef.current.addCallback('soundstart', () => setIsListening(true));
      annyangRef.current.addCallback('end', () => {
        if (voiceMode) {
          // Auto restart if in voice mode
          annyangRef.current.start({ autoRestart: true });
        } else {
          setIsListening(false);
        }
      });
    } else {
      console.log('Annyang not available, trying native SpeechRecognition');
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = voiceSettings.language;
          
          recognitionRef.current.onstart = () => setIsListening(true);
          recognitionRef.current.onend = () => {
            if (voiceMode) {
              recognitionRef.current.start();
            } else {
              setIsListening(false);
            }
          };
          
          recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
              .map(result => result[0].transcript)
              .join('');
            
            setTranscript(transcript);
            
            const lowerTranscript = transcript.toLowerCase();
            
            if (lowerTranscript.includes(voiceSettings.wakeWord.toLowerCase())) {
              const commandPart = lowerTranscript.split(voiceSettings.wakeWord.toLowerCase())[1].trim();
              if (commandPart) {
                handleWakeWord(commandPart);
              }
            }
            
            voiceSettings.twitterCommands.forEach(cmd => {
              if (lowerTranscript.includes(cmd)) {
                const textPart = lowerTranscript.split(cmd)[1].trim();
                if (textPart) {
                  handleTwitterPost(textPart);
                }
              }
            });
            
            const confidence = event.results[0][0].confidence;
            setConfidence(confidence);
          };
          
          setSpeechSupported(true);
        } else {
          setSpeechSupported(false);
          console.log('Speech recognition not supported in this browser');
        }
      } catch (error) {
        setSpeechSupported(false);
        console.error('Speech recognition error:', error);
      }
    }
    
    return () => {
      if (annyangRef.current) {
        try {
          annyangRef.current.abort();
          
          annyangRef.current.removeCallback('result');
          annyangRef.current.removeCallback('soundstart');
          annyangRef.current.removeCallback('end');
          
          annyangRef.current.removeCommands();
        } catch (error) {
          console.error('Error cleaning up annyang:', error);
        }
      }
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort?.();
          recognitionRef.current.stop?.();
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
    };
  }, [voiceMode, voiceSettings]);
  
  const handleWakeWord = (command) => {
    console.log('Wake word detected, command:', command);
    
    setRecentCommands(prev => {
      const updated = [{ text: `${voiceSettings.wakeWord} ${command}`, timestamp: new Date() }, ...prev];
      return updated.slice(0, 5); // Keep only the 5 most recent
    });
    
    // Process the command
    onVoiceCommand(command);
  };
  
  const handleTwitterPost = (text) => {
    if (!text) return;
    
    setRecentCommands(prev => {
      const updated = [{ text: `Post to Twitter: ${text}`, timestamp: new Date() }, ...prev];
      return updated.slice(0, 5);
    });
    
    setTwitterFormText(text);
    setShowTwitterForm(true);
  };
  
  const handleTwitterFormSubmit = (content, image) => {
    onPostToTwitter(content);
    setShowTwitterForm(false);
    
    // Show success message
    Swal.fire({
      title: 'Posted!',
      text: 'Your message has been posted to Twitter.',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  };
    const handleResult = (phrases) => {
    if (phrases && phrases.length > 0) {
      setTranscript(phrases[0]);
      
      // Update confidence level (for UI purposes)
      const randomConfidence = Math.random() * 0.3 + 0.7; // Between 0.7 and 1.0
      setConfidence(randomConfidence);
    }
  };
  
  const toggleListening = () => {
    if (!speechSupported) {
      Swal.fire({
        title: 'Speech Recognition Not Available',
        text: 'Your browser does not support speech recognition or the annyang library could not be loaded.',
        icon: 'error',
        confirmButtonColor: '#007aff',
      });
      return;
    }
    
    if (isListening) {
      if (annyangRef.current) {
        annyangRef.current.abort();
      } else if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (annyangRef.current) {
        annyangRef.current.start({ autoRestart: false });
      } else if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsListening(true);
      setTranscript('Listening...');
    }
  };
  
  const toggleVoiceMode = () => {
    if (!speechSupported) {
      Swal.fire({
        title: 'Speech Recognition Not Available',
        text: 'Your browser does not support speech recognition or the annyang library could not be loaded.',
        icon: 'error',
        confirmButtonColor: '#007aff',
      });
      return;
    }
    
    const newVoiceMode = !voiceMode;
    setVoiceMode(newVoiceMode);
    
    if (newVoiceMode) {
      if (annyangRef.current) {
        annyangRef.current.start({ autoRestart: true });
      } else if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsListening(true);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Voice assistant activated');
        window.speechSynthesis.speak(utterance);
      }
    } else {
      if (annyangRef.current) {
        annyangRef.current.abort();
      } else if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Voice assistant deactivated');
        window.speechSynthesis.speak(utterance);
      }
    }
  };
  
  const updateSettings = (newSettings) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }));
    
    if (annyangRef.current) {
      annyangRef.current.setLanguage(newSettings.language || voiceSettings.language);
      
      if (newSettings.wakeWord && newSettings.wakeWord !== voiceSettings.wakeWord) {
        annyangRef.current.removeCommands();
        const commands = {
          [`${newSettings.wakeWord} *command`]: handleWakeWord,
        };
        
        (newSettings.twitterCommands || voiceSettings.twitterCommands).forEach(cmd => {
          commands[`${cmd} *text`] = text => handleTwitterPost(text);
        });
        
        annyangRef.current.addCommands(commands);
      }
    } else if (recognitionRef.current) {
      recognitionRef.current.lang = newSettings.language || voiceSettings.language;
    }
    
    setShowSettings(false);
  };
  
  const openSettings = () => {
    setShowSettings(true);
  };
  
  // Settings form
  const SettingsPanel = () => (
    <div className="voice-settings-panel">
      <div className="settings-header">
        <h3>Voice Assistant Settings</h3>
        <button onClick={() => setShowSettings(false)} className="close-btn">
          <MdClose />
        </button>
      </div>
      
      <div className="settings-form">
        <div className="form-group">
          <label>Wake Word</label>
          <input 
            type="text" 
            value={voiceSettings.wakeWord} 
            onChange={e => setVoiceSettings(prev => ({ ...prev, wakeWord: e.target.value }))}
            placeholder="e.g. assistant, hey siri, etc."
          />
        </div>
        
        <div className="form-group">
          <label>Language</label>
          <select 
            value={voiceSettings.language}
            onChange={e => setVoiceSettings(prev => ({ ...prev, language: e.target.value }))}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="ja-JP">Japanese</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Microphone Sensitivity</label>
          <input 
            type="range" 
            min="0.1" 
            max="1" 
            step="0.1"
            value={voiceSettings.sensitivity}
            onChange={e => setVoiceSettings(prev => ({ ...prev, sensitivity: parseFloat(e.target.value) }))}
          />
          <div className="range-labels">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            onClick={() => updateSettings(voiceSettings)} 
            className="save-btn"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const twitterToolAvailable = tools.some(tool => 
    tool.name === 'createPost' && tool.description?.toLowerCase().includes('twitter')
  );
  
  const speechNotSupportedMessage = !speechSupported && (
    <div className="speech-not-supported">
      <p>Speech recognition is not supported in your browser or the annyang library failed to load.</p>
      <button 
        onClick={() => {
          Swal.fire({
            title: 'Speech Recognition Not Available',
            html: `Your browser doesn't support speech recognition.<br><br>
                  Please try using Chrome, Edge, or Safari for the best experience.`,
            icon: 'info',
            confirmButtonColor: '#007aff',
          });
        }}
        className="info-button"
      >
        More Info
      </button>
    </div>
  );
  
  return (
    <>
      {showTwitterForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1002] animate-fade-in">
          <TwitterPostForm 
            initialText={twitterFormText}
            onSubmit={handleTwitterFormSubmit}
            onCancel={() => setShowTwitterForm(false)}
          />
        </div>
      )}
      
      {showSettings && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] max-w-[calc(100%-40px)] bg-background-dark rounded-xl shadow-dropdown z-[1001] animate-fade-in">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h3 className="m-0 text-white text-base font-medium">Voice Assistant Settings</h3>
            <button 
              onClick={() => setShowSettings(false)} 
              className="bg-transparent border-0 text-text-muted text-xl cursor-pointer flex items-center justify-center"
            >
              <MdClose />
            </button>
          </div>
          
          <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium">Wake Word</label>
              <input 
                type="text" 
                value={voiceSettings.wakeWord} 
                onChange={e => setVoiceSettings(prev => ({ ...prev, wakeWord: e.target.value }))}
                placeholder="e.g. assistant, hey siri, etc."
                className="bg-background-medium border border-[#3a3a3c] rounded-lg p-2.5 px-3 text-white text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium">Language</label>
              <select 
                value={voiceSettings.language}
                onChange={e => setVoiceSettings(prev => ({ ...prev, language: e.target.value }))}
                className="bg-background-medium border border-[#3a3a3c] rounded-lg p-2.5 px-3 text-white text-sm outline-none transition-colors focus:border-primary"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
                <option value="ja-JP">Japanese</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium">Microphone Sensitivity</label>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.1"
                value={voiceSettings.sensitivity}
                onChange={e => setVoiceSettings(prev => ({ ...prev, sensitivity: parseFloat(e.target.value) }))}
                className="bg-background-medium accent-primary rounded-lg h-2.5 outline-none"
              />
              <div className="flex justify-between text-xs text-text-muted">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <button 
                onClick={() => updateSettings(voiceSettings)} 
                className="py-2 px-4 bg-primary text-white border-0 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-primary-dark"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      <animated.div className="fixed bottom-5 right-5 w-[350px] bg-background-dark rounded-xl shadow-dropdown overflow-hidden z-[1000] flex flex-col will-change-[height]" style={panelAnimation}>
        <div className="flex items-center justify-between p-4 py-2.5 cursor-pointer h-[60px] border-b border-white/5" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-primary-light' : 'bg-error'}`}></div>
            <h3 className="m-0 text-white text-base font-medium ml-2">Voice Assistant {voiceMode ? '(Active)' : ''}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className="bg-transparent border-0 text-text-muted text-lg cursor-pointer p-2 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 hover:text-white"
              onClick={(e) => { e.stopPropagation(); openSettings(); }}
              title="Voice Assistant Settings"
            >
              <MdSettings />
            </button>
            
            <Ripples 
              className="rounded-full"
              color="rgba(255, 59, 48, 0.2)"
              during={800}
            >
              <animated.button 
                className={`w-9 h-9 rounded-full border-0 bg-background-medium text-white flex items-center justify-center cursor-pointer text-base transition-all ${isListening ? 'bg-error animate-pulse-mic' : ''} disabled:bg-[#1c1e28] disabled:text-[#3a3a3c] disabled:cursor-not-allowed disabled:opacity-60`}
                style={micAnimation}
                onClick={(e) => { e.stopPropagation(); toggleListening(); }}
                disabled={!isConnected || !speechSupported}
                title={!speechSupported ? "Speech recognition not supported" : 
                      isListening ? "Stop listening" : "Start listening"}
              >
                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </animated.button>
            </Ripples>
            
            <button 
              className={`py-1.5 px-3 rounded-full border border-[#3a3a3c] bg-transparent text-text-muted text-xs font-medium cursor-pointer transition-all ${voiceMode ? 'bg-primary border-primary text-white' : ''} hover:bg-white/5 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:border-[#1c1e28] disabled:text-[#3a3a3c]`}
              onClick={(e) => { e.stopPropagation(); toggleVoiceMode(); }}
              disabled={!isConnected || !speechSupported}
              title={!speechSupported ? "Speech recognition not supported" :
                    voiceMode ? "Disable continuous listening" : "Enable continuous listening"}
            >
              {voiceMode ? "Voice ON" : "Voice OFF"}
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <animated.div className="p-4 flex flex-col gap-4" style={contentAnimation}>
            {speechNotSupportedMessage}
            
            {speechSupported && isListening && (
              <div className="voice-animation">
                <Lottie
                  loop
                  animationData={voiceWaveAnimation}
                  play={isListening}
                  style={{ width: 150, height: 80 }}
                />
                <div className="confidence-meter">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="transcript-container">
              <p className="transcript">
                {!speechSupported ? 
                  "Speech recognition not available in your browser" : 
                  transcript || "Say something..."}
              </p>
            </div>
            
            {twitterToolAvailable && (
              <div className="twitter-quickpost">
                <div className="twitter-header">
                  <FaTwitter className="twitter-icon" />
                  <h4>Quick Twitter Post</h4>
                </div>
                <div className="twitter-instructions">
                  <p>Say "<strong>post to Twitter</strong>" followed by your message, or use the button below:</p>
                </div>
                <button 
                  
                  onClick={() => {
                    Swal.fire({
                      title: 'Create Twitter Post',
                      input: 'textarea',
                      inputPlaceholder: 'What\'s happening?',
                      inputAttributes: {
                        maxlength: 280
                      },
                      showCancelButton: true,
                      confirmButtonColor: '#1DA1F2',
                      confirmButtonText: 'Post',
                      showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                      },
                      preConfirm: (text) => {
                        if (!text.trim()) {
                          Swal.showValidationMessage('Please enter a message');
                          return false;
                        }
                        return text;
                      }
                    }).then((result) => {
                      if (result.isConfirmed && result.value) {
                        onPostToTwitter(result.value);
                      }
                    });
                  }}
                  className="py-2 px-4 bg-twitter-blue text-white rounded-lg flex items-center gap-2 transition-all hover:bg-twitter-dark"
                >
                  <FaTwitter /> Create Post
                </button>
              </div>
            )}
            
            <div className="voice-recent-commands">
              <h4>Recent Commands</h4>
              {recentCommands.length > 0 ? (
                <ul>
                  {recentCommands.map((cmd, index) => (
                    <li key={index}>
                      <span className="command-text">{cmd.text}</span>
                      <span className="command-time">
                        {cmd.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-commands">No recent commands</p>
              )}
            </div>
          </animated.div>
        )}
      </animated.div>
    </>
  );
};

export default VoiceAssistant;