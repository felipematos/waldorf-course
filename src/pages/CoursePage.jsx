import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, BookOpen, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { courseContent } from '../data/courseContentEnhanced';
import { getTranslatedContent } from '../data/courseContentTranslated';
import { translateContent } from '../utils/contentTranslator';
import './CoursePage.scss';

function CoursePage({ progress, updateProgress }) {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [translatedContent, setTranslatedContent] = useState(courseContent);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Load translated content when language changes
    const loadTranslatedContent = async () => {
      setIsTranslating(true);
      try {
        // First check if we have pre-translated content
        const preTranslated = getTranslatedContent(i18n.language);
        if (preTranslated && preTranslated.chapters) {
          // Merge pre-translated content with original structure
          const merged = {
            ...courseContent,
            introduction: preTranslated.introduction || courseContent.introduction
          };
          setTranslatedContent(merged);
        } else if (i18n.language !== 'pt') {
          // Use dynamic translation for other content
          const translated = await translateContent(courseContent, i18n.language);
          setTranslatedContent(translated);
        } else {
          setTranslatedContent(courseContent);
        }
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedContent(courseContent);
      }
      setIsTranslating(false);
    };
    
    loadTranslatedContent();
  }, [i18n.language]);
  
  useEffect(() => {
    if (chapterId && translatedContent.chapters) {
      const chapter = translatedContent.chapters.find(ch => ch.id === chapterId);
      setCurrentChapter(chapter);
      setCurrentSection(0);
    } else {
      setCurrentChapter(null);
    }
  }, [chapterId, translatedContent]);

  const handleChapterSelect = (chapter) => {
    navigate(`/curso/${chapter.id}`);
  };

  const handleComplete = () => {
    if (currentChapter) {
      updateProgress(currentChapter.id, true);
    }
  };

  const nextSection = () => {
    if (currentChapter && currentSection < currentChapter.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      handleNextChapter();
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      handlePrevChapter();
    }
  };

  const handleNextChapter = () => {
    if (currentChapter) {
      handleComplete();
      const currentIndex = translatedContent.chapters.findIndex(ch => ch.id === currentChapter.id);
      if (currentIndex < translatedContent.chapters.length - 1) {
        const nextChapter = translatedContent.chapters[currentIndex + 1];
        navigate(`/curso/${nextChapter.id}`);
      }
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter) {
      const currentIndex = translatedContent.chapters.findIndex(ch => ch.id === currentChapter.id);
      if (currentIndex > 0) {
        const prevChapter = translatedContent.chapters[currentIndex - 1];
        navigate(`/curso/${prevChapter.id}`);
      }
    }
  };

  const renderIntroduction = () => (
    <motion.div 
      className="course-introduction"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="intro-header">
        <Star className="intro-icon" />
        <h1>{translatedContent.introduction.title}</h1>
      </div>

      <div className="quote-waldorf intro-quote">
        <p>{translatedContent.introduction.poem}</p>
        <span className="author">{translatedContent.introduction.author}</span>
      </div>

      <div className="intro-content">
        {translatedContent.introduction.content.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
          <p key={idx}>{paragraph.trim()}</p>
        ))}
      </div>

      <div className="chapters-grid">
        <h2>Escolha um Capítulo para Começar</h2>
        <div className="chapters-list">
          {translatedContent.chapters.map((chapter) => (
            <motion.div
              key={chapter.id}
              className={`chapter-card ${progress[chapter.id] ? 'completed' : ''}`}
              onClick={() => handleChapterSelect(chapter)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="chapter-header">
                <span className="chapter-number">
                  {chapter.id.replace('chapter', '')}
                </span>
                <h3>{chapter.title}</h3>
                {progress[chapter.id] && <Check className="check-icon" />}
              </div>
              <p className="chapter-subtitle">{chapter.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderChapterContent = () => {
    if (!currentChapter) return null;

    const section = currentChapter.sections[currentSection];

    return (
      <motion.div 
        className="chapter-content"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="chapter-header">
          <button 
            className="back-button"
            onClick={() => navigate('/curso')}
          >
            <ChevronLeft /> Voltar aos Capítulos
          </button>
          
          <div className="progress-indicator">
            Seção {currentSection + 1} de {currentChapter.sections.length}
          </div>
        </div>

        <div className="chapter-title-section">
          <h1>{currentChapter.title}</h1>
          <p className="chapter-subtitle">{currentChapter.subtitle}</p>
        </div>

        {currentSection === 0 && currentChapter.poem && (
          <div className="quote-waldorf chapter-poem">
            <p>{currentChapter.poem}</p>
            <span className="author">{currentChapter.author}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSection}
            className="section-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2>{section.title}</h2>
            
            <div className="section-text">
              {section.content.split('\n').filter(p => p.trim()).map((paragraph, idx) => {
                // Check for bold text markers
                if (paragraph.includes('**')) {
                  const parts = paragraph.split('**');
                  return (
                    <p key={idx}>
                      {parts.map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </p>
                  );
                }
                
                // Check for list items
                if (paragraph.trim().startsWith('-')) {
                  return (
                    <ul key={idx}>
                      <li>{paragraph.trim().substring(1).trim()}</li>
                    </ul>
                  );
                }
                
                return <p key={idx}>{paragraph.trim()}</p>;
              })}
            </div>

            {section.exercise && (
              <div className="exercise-box">
                <h3>{section.exercise.title}</h3>
                <p>{section.exercise.description}</p>
              </div>
            )}

            {section.practices && (
              <div className="practices-box">
                <h3>Práticas Sugeridas</h3>
                <ul>
                  {section.practices.map((practice, idx) => (
                    <li key={idx}>{practice}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="navigation-buttons">
          <button 
            className="nav-btn prev"
            onClick={prevSection}
            disabled={currentSection === 0 && courseContent.chapters.findIndex(ch => ch.id === currentChapter.id) === 0}
          >
            <ChevronLeft /> Anterior
          </button>

          {currentSection === currentChapter.sections.length - 1 && (
            <button 
              className="complete-btn"
              onClick={handleComplete}
              disabled={progress[currentChapter.id]}
            >
              {progress[currentChapter.id] ? (
                <>
                  <Check /> Concluído
                </>
              ) : (
                <>
                  <BookOpen /> Marcar como Concluído
                </>
              )}
            </button>
          )}

          <button 
            className="nav-btn next"
            onClick={nextSection}
            disabled={currentSection === currentChapter.sections.length - 1 && 
                     courseContent.chapters.findIndex(ch => ch.id === currentChapter.id) === courseContent.chapters.length - 1}
          >
            Próximo <ChevronRight />
          </button>
        </div>

        {currentChapter.activities && currentSection === currentChapter.sections.length - 1 && (
          <div className="activities-section">
            <h3>Atividades do Capítulo</h3>
            <ul>
              {currentChapter.activities.map((activity, idx) => (
                <li key={idx}>{activity}</li>
              ))}
            </ul>
          </div>
        )}

        {currentChapter.finalReflection && currentSection === currentChapter.sections.length - 1 && (
          <div className="final-reflection">
            <h2>{currentChapter.finalReflection.title}</h2>
            <div className="reflection-content">
              {currentChapter.finalReflection.content.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                <p key={idx}>{paragraph.trim()}</p>
              ))}
            </div>
            {currentChapter.finalReflection.poem && (
              <div className="quote-waldorf">
                <p>{currentChapter.finalReflection.poem}</p>
                <span className="author">{currentChapter.finalReflection.author}</span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="course-page">
      <div className="container">
        {!currentChapter ? renderIntroduction() : renderChapterContent()}
      </div>
    </div>
  );
}

export default CoursePage;