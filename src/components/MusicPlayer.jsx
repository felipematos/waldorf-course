import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, Volume2, VolumeX } from 'lucide-react';
import WaldorfMusicGenerator from '../utils/waldorfMusicGenerator';
import './MusicPlayer.scss';

function MusicPlayer({ musicUrl, chapter = 'home' }) {
  const [isMusicOn, setIsMusicOn] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== 'false'; // Default to true if not set
  });
  
  const musicGeneratorRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Map chapters to music themes
  const chapterThemes = {
    home: 'home',
    chapter1: 'observation',
    chapter2: 'cosmic',
    chapter3: 'setenios',
    chapter4: 'temperaments',
    chapter5: 'rhythm',
    chapter6: 'art',
    chapter7: 'practical',
    default: 'ambient'
  };

  const currentTheme = chapterThemes[chapter] || chapterThemes.default;

  useEffect(() => {
    // Initialize music generator
    if (!musicGeneratorRef.current) {
      musicGeneratorRef.current = new WaldorfMusicGenerator();
      // Initialize the audio context immediately
      musicGeneratorRef.current.init().then(() => {
        setIsLoaded(true);
      });
    }
    
    return () => {
      // Cleanup
      if (musicGeneratorRef.current) {
        musicGeneratorRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    // Start playing music when component loads if enabled
    if (musicGeneratorRef.current && isLoaded) {
      if (isMusicOn && !musicGeneratorRef.current.isPlaying) {
        musicGeneratorRef.current.playMelody(currentTheme, true).catch(err => {
          console.log('Audio context needs user interaction:', err);
        });
      }
    }
  }, [isLoaded, currentTheme, isMusicOn]);
  
  const toggleMusic = () => {
    const newState = !isMusicOn;
    setIsMusicOn(newState);
    localStorage.setItem('musicEnabled', newState);
    
    if (musicGeneratorRef.current && isLoaded) {
      if (newState) {
        if (musicGeneratorRef.current.isPlaying) {
          // If music is playing, just unmute
          musicGeneratorRef.current.unmute();
        } else {
          // If music is not playing, start it
          musicGeneratorRef.current.playMelody(currentTheme, true).catch(err => {
            console.log('Audio context needs user interaction:', err);
          });
        }
      } else {
        // Mute the music (keep playing but silent)
        musicGeneratorRef.current.mute();
      }
    }
  };

  return (
    <>
      
      <motion.button
        className={`music-toggle ${isMusicOn ? 'on' : 'off'}`}
        onClick={toggleMusic}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        aria-label={isMusicOn ? 'Desligar música suave' : 'Ligar música suave'}
        title={`Música Waldorf: ${currentTheme === 'home' ? 'Lira suave' : 
                currentTheme === 'observation' ? 'Flauta contemplativa' :
                currentTheme === 'cosmic' ? 'Sinos etéreos' :
                currentTheme === 'setenios' ? 'Violino gentil' :
                currentTheme === 'temperaments' ? 'Instrumentos variados' :
                currentTheme === 'rhythm' ? 'Ritmo suave' :
                currentTheme === 'art' ? 'Harpa criativa' :
                currentTheme === 'practical' ? 'Melodias simples' :
                'Ambiente natural'}`}
      >
        <motion.div
          animate={{ rotate: isMusicOn ? 360 : 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {isMusicOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </motion.div>
        
        {isMusicOn && (
          <motion.div className="music-waves">
            <motion.span
              animate={{ 
                scaleY: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.span
              animate={{ 
                scaleY: [1, 1.8, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: 0.2
              }}
            />
            <motion.span
              animate={{ 
                scaleY: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: 0.4
              }}
            />
          </motion.div>
        )}
      </motion.button>
    </>
  );
}

export default MusicPlayer;