import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import ChatBot from './components/ChatBot';
import ProgressTracker from './components/ProgressTracker';
import MusicPlayer from './components/MusicPlayer';
import './styles/app.scss';

function App() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('courseProgress');
    return saved ? JSON.parse(saved) : {};
  });

  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    localStorage.setItem('courseProgress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (chapterId, completed) => {
    setProgress(prev => ({
      ...prev,
      [chapterId]: completed
    }));
  };

  return (
    <Router>
      <div className="app-container">
        <Navigation />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/curso/:chapterId?" 
              element={
                <CoursePage 
                  progress={progress}
                  updateProgress={updateProgress}
                />
              } 
            />
          </Routes>
        </AnimatePresence>

        <ProgressTracker progress={progress} />
        
        <MusicPlayer />
        
        <button 
          className="chat-toggle"
          onClick={() => setShowChat(!showChat)}
          aria-label="Conversar com Rudolf Steiner"
        >
          <span className="chat-icon">💬</span>
          <span className="chat-text">Conversar com Rudolf Steiner</span>
        </button>

        {showChat && (
          <ChatBot onClose={() => setShowChat(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;