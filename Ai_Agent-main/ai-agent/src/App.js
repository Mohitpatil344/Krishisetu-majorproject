import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModelProvider } from './contexts/ModelContext';
import Header from './components/Header';
import Chat from './components/Chat';
import './App.css';

function AppContent() {
  return (
    <div className="App">
      <div className="app-header header">
        <Header />
      </div>
      <div className="app-content">
        <Chat />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ModelProvider>
        <AppContent />
      </ModelProvider>
    </ThemeProvider>
  );
}

export default App;
