// Waldorf Music Generator using Web Audio API
// Creates gentle, pentatonic melodies appropriate for Waldorf pedagogy

class WaldorfMusicGenerator {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.currentNodes = [];
    this.volume = 0.15; // Keep very soft
    this.masterGainNode = null;
    this.isMuted = false;
    this.currentChapter = null;
    
    // Pentatonic scales for different moods
    this.scales = {
      // C Major Pentatonic (peaceful, home)
      home: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
      
      // D Minor Pentatonic (contemplative, observation)
      observation: [293.66, 349.23, 392.00, 440.00, 523.25, 587.33],
      
      // A Minor Pentatonic (ethereal, cosmic)
      cosmic: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00],
      
      // G Major Pentatonic (growth, setenios)
      setenios: [392.00, 440.00, 493.88, 587.33, 659.25, 783.99],
      
      // Different temperament scales
      temperaments: {
        sanguine: [329.63, 392.00, 440.00, 523.25, 587.33], // E Major Pentatonic
        choleric: [293.66, 349.23, 392.00, 466.16, 523.25], // D Dorian
        melancholic: [220.00, 246.94, 293.66, 329.63, 392.00], // A Natural Minor
        phlegmatic: [261.63, 293.66, 329.63, 392.00, 440.00], // C Major Pentatonic
      },
      
      // F Major Pentatonic (rhythmic, but gentle)
      rhythm: [349.23, 392.00, 440.00, 523.25, 587.33, 698.46],
      
      // Bb Major Pentatonic (artistic, creative)
      art: [466.16, 523.25, 587.33, 698.46, 783.99, 932.33],
      
      // Eb Major Pentatonic (practical, grounded)
      practical: [311.13, 349.23, 392.00, 466.16, 523.25, 622.25],
      
      // Ambient nature sounds simulation
      ambient: [174.61, 196.00, 220.00, 261.63, 293.66, 329.63], // Low, peaceful tones
    };
    
    // Rhythm patterns (very gentle)
    this.patterns = {
      home: [1, 0.5, 0.5, 1, 2], // Slow, welcoming
      observation: [2, 1, 1, 2], // Contemplative
      cosmic: [3, 2, 1, 2, 3], // Floating, ethereal
      setenios: [1, 1, 1, 1, 2], // Seven-year rhythm hint
      temperaments: [1, 0.75, 0.75, 1.5], // Varied for each
      rhythm: [0.5, 0.5, 1, 0.5, 0.5, 1], // Gentle rhythm
      art: [2, 1, 0.5, 0.5, 2], // Creative flow
      practical: [1, 1, 1, 1], // Steady, grounded
      ambient: [4, 3, 5, 4], // Very slow, meditative
    };
  }
  
  async init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // Create master gain node for mute/unmute functionality
      this.masterGainNode = this.audioContext.createGain();
      this.masterGainNode.connect(this.audioContext.destination);
      this.masterGainNode.gain.value = 1;
      
      // Ensure context is running (for Chrome autoplay policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    }
  }
  
  createEnvelope(gainNode, startTime, duration, peakGain = 0.1) {
    const attackTime = duration * 0.2;
    const decayTime = duration * 0.3;
    const releaseTime = duration * 0.3;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(peakGain * 0.7, startTime + attackTime + decayTime);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
  }
  
  playNote(frequency, startTime, duration, instrument = 'lyre') {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    // Different timbres for different "instruments"
    switch(instrument) {
      case 'lyre':
        oscillator.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.value = frequency * 3;
        break;
      case 'flute':
        oscillator.type = 'triangle';
        filter.type = 'bandpass';
        filter.frequency.value = frequency * 2;
        filter.Q.value = 5;
        break;
      case 'bells':
        oscillator.type = 'sine';
        // Add slight detuning for bell-like quality
        const oscillator2 = this.audioContext.createOscillator();
        oscillator2.type = 'sine';
        oscillator2.frequency.value = frequency * 2.01;
        oscillator2.connect(gainNode);
        oscillator2.start(startTime);
        oscillator2.stop(startTime + duration);
        this.currentNodes.push(oscillator2);
        break;
      case 'violin':
        oscillator.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.value = frequency * 2;
        filter.Q.value = 1;
        break;
      default:
        oscillator.type = 'sine';
    }
    
    oscillator.frequency.value = frequency;
    
    // Create gentle envelope
    this.createEnvelope(gainNode, startTime, duration, this.volume);
    
    // Connect nodes through master gain
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGainNode);
    
    // Start and stop
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
    
    // Store reference for cleanup
    this.currentNodes.push(oscillator);
    
    return oscillator;
  }
  
  async playMelody(chapter = 'home', loops = true) {
    await this.init();
    
    // Don't restart if already playing the same chapter
    if (this.isPlaying && this.currentChapter === chapter) {
      return;
    }
    
    if (this.isPlaying) {
      this.stop();
    }
    
    this.isPlaying = true;
    this.currentChapter = chapter;
    
    const scale = this.scales[chapter] || this.scales.home;
    const pattern = this.patterns[chapter] || this.patterns.home;
    const tempo = 40; // Very slow BPM for calm effect
    const beatDuration = 60 / tempo;
    
    // Choose instrument based on chapter
    const instruments = {
      home: 'lyre',
      observation: 'flute',
      cosmic: 'bells',
      setenios: 'violin',
      temperaments: 'lyre',
      rhythm: 'lyre',
      art: 'bells',
      practical: 'flute',
      ambient: 'bells'
    };
    
    const instrument = instruments[chapter] || 'lyre';
    
    const playSequence = () => {
      if (!this.isPlaying) return;
      
      let currentTime = this.audioContext.currentTime;
      
      // Play a simple, gentle melody
      pattern.forEach((duration, i) => {
        // Pick notes from scale in a pleasing pattern
        const noteIndex = Math.floor(Math.random() * scale.length);
        const frequency = scale[noteIndex];
        
        // Occasionally play harmonious intervals
        if (Math.random() > 0.7 && i > 0) {
          const harmonyIndex = (noteIndex + 2) % scale.length;
          this.playNote(scale[harmonyIndex], currentTime, duration * beatDuration, instrument);
        }
        
        this.playNote(frequency, currentTime, duration * beatDuration, instrument);
        currentTime += duration * beatDuration;
      });
      
      // Add some silence between phrases
      currentTime += beatDuration * 2;
      
      // Loop if requested
      if (loops && this.isPlaying) {
        setTimeout(() => playSequence(), (currentTime - this.audioContext.currentTime) * 1000);
      }
    };
    
    playSequence();
  }
  
  // Special method for temperaments - plays different melody for each
  async playTemperament(temperament = 'sanguine', loops = true) {
    await this.init();
    
    if (this.isPlaying) {
      this.stop();
    }
    
    this.isPlaying = true;
    
    const scale = this.scales.temperaments[temperament] || this.scales.temperaments.sanguine;
    const pattern = this.patterns.temperaments;
    const tempo = temperament === 'sanguine' ? 50 : 
                  temperament === 'choleric' ? 45 :
                  temperament === 'melancholic' ? 35 :
                  40; // phlegmatic
    
    const beatDuration = 60 / tempo;
    const instrument = temperament === 'sanguine' ? 'flute' :
                      temperament === 'choleric' ? 'violin' :
                      temperament === 'melancholic' ? 'lyre' :
                      'bells'; // phlegmatic
    
    const playSequence = () => {
      if (!this.isPlaying) return;
      
      let currentTime = this.audioContext.currentTime;
      
      pattern.forEach((duration, i) => {
        const noteIndex = i % scale.length;
        const frequency = scale[noteIndex];
        this.playNote(frequency, currentTime, duration * beatDuration, instrument);
        currentTime += duration * beatDuration;
      });
      
      currentTime += beatDuration * 3;
      
      if (loops && this.isPlaying) {
        setTimeout(() => playSequence(), (currentTime - this.audioContext.currentTime) * 1000);
      }
    };
    
    playSequence();
  }
  
  stop() {
    this.isPlaying = false;
    this.currentNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {
        // Node might have already stopped
      }
    });
    this.currentNodes = [];
  }
  
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }
  
  async fadeIn(duration = 2000) {
    const steps = 20;
    const stepDuration = duration / steps;
    const stepSize = this.volume / steps;
    
    const originalVolume = this.volume;
    this.volume = 0;
    
    for (let i = 0; i <= steps; i++) {
      this.volume = (originalVolume / steps) * i;
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }
  
  async fadeOut(duration = 2000) {
    if (!this.masterGainNode) return;
    
    const steps = 20;
    const stepDuration = duration / steps;
    
    for (let i = steps; i >= 0; i--) {
      this.masterGainNode.gain.value = i / steps;
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
    
    this.stop();
    this.masterGainNode.gain.value = 1; // Reset for next play
  }
  
  mute() {
    if (this.masterGainNode && !this.isMuted) {
      this.isMuted = true;
      // Smooth transition to mute
      this.masterGainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
    }
  }
  
  unmute() {
    if (this.masterGainNode && this.isMuted) {
      this.isMuted = false;
      // Smooth transition to unmute
      this.masterGainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.1);
    }
  }
  
  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
    return !this.isMuted;
  }
}

export default WaldorfMusicGenerator;