import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, Target, ChevronUp, ChevronDown } from 'lucide-react';
import { courseContent } from '../data/courseContentEnhanced';
import './ProgressTracker.scss';

function ProgressTracker({ progress }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('progressTrackerCollapsed');
    return saved === 'true';
  });

  const totalChapters = courseContent.chapters.length;
  const completedChapters = Object.values(progress).filter(Boolean).length;
  const progressPercentage = (completedChapters / totalChapters) * 100;

  useEffect(() => {
    localStorage.setItem('progressTrackerCollapsed', isCollapsed);
  }, [isCollapsed]);

  const getMilestone = () => {
    if (progressPercentage === 0) return { icon: <BookOpen />, text: 'Pronto para começar!' };
    if (progressPercentage < 30) return { icon: <Target />, text: 'Primeiros passos!' };
    if (progressPercentage < 60) return { icon: <Target />, text: 'Progresso notável!' };
    if (progressPercentage < 100) return { icon: <Award />, text: 'Quase lá!' };
    return { icon: <Award />, text: 'Jornada completa!' };
  };

  const milestone = getMilestone();

  return (
    <motion.div 
      className={`progress-tracker ${isCollapsed ? 'collapsed' : ''}`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="progress-header">
        <h3>Seu Progresso</h3>
        <button 
          className="collapse-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expandir' : 'Recolher'}
        >
          {isCollapsed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        {!isCollapsed && (
          <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
        )}
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="progress-text">
              {completedChapters} de {totalChapters} capítulos
            </div>

            <div className="milestone">
              {milestone.icon}
              <span>{milestone.text}</span>
            </div>

            <div className="chapter-dots">
              {courseContent.chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className={`dot ${progress[chapter.id] ? 'completed' : ''}`}
                  title={chapter.title}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ProgressTracker;