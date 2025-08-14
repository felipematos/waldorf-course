import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, BookOpen, Sun, Flower2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MusicPlayer from '../components/MusicPlayer';
import { getTranslatedContent } from '../data/courseContentTranslated';
import './HomePage.scss';

function HomePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const translatedContent = getTranslatedContent(i18n.language);

  const features = [
    {
      icon: <Heart className="feature-icon" />,
      key: 'anthroposophy'
    },
    {
      icon: <BookOpen className="feature-icon" />,
      key: 'development'
    },
    {
      icon: <Sun className="feature-icon" />,
      key: 'practical'
    },
    {
      icon: <Sparkles className="feature-icon" />,
      key: 'community'
    }
  ];

  return (
    <div className="home-page">
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="hero-background">
          <div className="watercolor-blob blob-1" />
          <div className="watercolor-blob blob-2" />
          <div className="watercolor-blob blob-3" />
        </div>

        <motion.div 
          className="hero-content"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <Flower2 className="hero-icon" />
          
          <h1 className="hero-title">
            {t('home.hero.title')}
          </h1>
          
          <p className="hero-subtitle">
            {t('home.hero.subtitle')}
          </p>

          <div className="quote-waldorf hero-quote">
            <p>{translatedContent.introduction.quote.text}</p>
            <span className="author">{translatedContent.introduction.quote.author}</span>
          </div>

          <motion.button 
            className="btn-waldorf btn-start"
            onClick={() => navigate('/curso')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('home.hero.startButton')}
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.section 
        className="intro-section container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <div className="introduction-cards">
          {translatedContent.introduction.sections.map((section, index) => (
            <motion.div
              key={index}
              className="card-waldorf intro-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
            >
              <h3>{section.title}</h3>
              <div className="section-content">
                {section.content.split('\n').map((paragraph, pIdx) => {
                  if (paragraph.trim().startsWith('•')) {
                    return (
                      <ul key={pIdx}>
                        <li>{paragraph.trim().substring(1).trim()}</li>
                      </ul>
                    );
                  }
                  return paragraph.trim() && <p key={pIdx}>{paragraph.trim()}</p>;
                })}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="card-waldorf quote-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <blockquote className="quote-waldorf">
            <p>{translatedContent.introduction.quote.text}</p>
            <cite>— {translatedContent.introduction.quote.author}</cite>
          </blockquote>
        </motion.div>
      </motion.section>

      <motion.section 
        className="features-section container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
      >
        <h2>{t('home.features.title')}</h2>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              {feature.icon}
              <h3>{t(`home.features.items.${feature.key}.title`)}</h3>
              <p>{t(`home.features.items.${feature.key}.description`)}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section 
        className="journey-section container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <div className="card-waldorf journey-card">
          <h2>Sua Jornada de Descobertas</h2>
          
          <div className="chapters-preview">
            <div className="chapter-item">
              <span className="chapter-number">1</span>
              <span className="chapter-title">A Observação Goetheanística e os Arquétipos</span>
            </div>
            <div className="chapter-item">
              <span className="chapter-number">2</span>
              <span className="chapter-title">Do Um ao Muitos - A Evolução Cósmica</span>
            </div>
            <div className="chapter-item">
              <span className="chapter-number">3</span>
              <span className="chapter-title">Os Setênios - A Biografia Humana</span>
            </div>
            <div className="chapter-item">
              <span className="chapter-number">4</span>
              <span className="chapter-title">Os Quatro Corpos do Ser Humano</span>
            </div>
            <div className="chapter-item">
              <span className="chapter-number">5</span>
              <span className="chapter-title">A Espiritualidade na Antroposofia</span>
            </div>
            <div className="chapter-item">
              <span className="chapter-number">6</span>
              <span className="chapter-title">A Escola Como Ser Vivo</span>
            </div>
            <div className="chapter-item">
              <span className="chapter-number">7</span>
              <span className="chapter-title">Boas Práticas para Pais Waldorf</span>
            </div>
          </div>

          <motion.button 
            className="btn-waldorf btn-begin"
            onClick={() => navigate('/curso')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Começar Agora
          </motion.button>
        </div>
      </motion.section>

      <motion.footer 
        className="home-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
      >
        <div className="container">
          <p className="footer-quote">
            "Receber a criança em reverência, educá-la com amor, deixá-la partir em liberdade."
          </p>
          <span className="author">Rudolf Steiner</span>
        </div>
      </motion.footer>
      
      <MusicPlayer chapter="home" />
    </div>
  );
}

export default HomePage;