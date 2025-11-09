'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface Instrument {
  id: number;
  name: string;
  emoji: string;
  description: string;
  sound: string;
  category: string;
}

export default function InstrumentShowcase() {
  const [instruments] = useState<Instrument[]>([
    {
      id: 1,
      name: 'Acoustic Guitar',
      emoji: '🎸',
      description: 'A classic 6-string instrument with warm, resonant tones perfect for folk and classical music.',
      sound: 'Strumming',
      category: 'String'
    },
    {
      id: 2,
      name: 'Grand Piano',
      emoji: '🎹',
      description: 'An elegant 88-key instrument with rich harmonics and dynamic range for all musical genres.',
      sound: 'Melodious',
      category: 'Keyboard'
    },
    {
      id: 3,
      name: 'Drum Set',
      emoji: '🥁',
      description: 'A complete percussion setup with snare, toms, cymbals and bass drum for rhythmic expression.',
      sound: 'Percussion',
      category: 'Percussion'
    },
    {
      id: 4,
      name: 'Violin',
      emoji: '🎻',
      description: 'A 4-string bowed instrument known for its expressive and versatile sound in classical music.',
      sound: 'Classical',
      category: 'String'
    },
    {
      id: 5,
      name: 'Flute',
      emoji: '🪈',
      description: 'A woodwind instrument that produces clear, bright tones through breath control.',
      sound: 'Whistling',
      category: 'Wind'
    },
    {
      id: 6,
      name: 'Saxophone',
      emoji: '🎷',
      description: 'A curved brass instrument with a reed, known for its smooth jazz and blues sound.',
      sound: 'Jazzy',
      category: 'Wind'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [scale, setScale] = useState(1);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentInstrument = instruments[currentIndex];

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // Auto-rotate feature with more dynamic 3D effect
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setRotation(prev => ({
        x: (prev.x + 0.5) % 360,
        y: (prev.y + 1) % 360
      }));
      
      // Add subtle scaling for more dynamic effect
      setScale(1 + Math.sin(Date.now() / 1000) * 0.05);
    }, 50);

    return () => clearInterval(interval);
  }, [autoRotate]);

  // Play sound when isPlaying is true
  useEffect(() => {
    if (isPlaying && audioContext) {
      playInstrumentSound(currentInstrument.name);
      
      // Stop playing after 2 seconds
      const timeout = setTimeout(() => {
        setIsPlaying(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [isPlaying, audioContext, currentInstrument.name]);

  // Play sound for specific instrument
  const playInstrumentSound = (instrumentName: string) => {
    if (!audioContext) return;

    switch (instrumentName) {
      case 'Acoustic Guitar':
        playGuitarSound();
        break;
      case 'Grand Piano':
        playPianoSound();
        break;
      case 'Drum Set':
        playDrumSound();
        break;
      case 'Violin':
        playViolinSound();
        break;
      case 'Flute':
        playFluteSound();
        break;
      case 'Saxophone':
        playSaxophoneSound();
        break;
      default:
        playDefaultSound();
    }
  };

  // Guitar sound - strumming chords
  const playGuitarSound = () => {
    if (!audioContext) return;
    
    // Create a chord (G major)
    const frequencies = [392.00, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
    
    frequencies.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      
      // Create a strumming effect with slight delays
      const startTime = audioContext.currentTime + i * 0.02;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 1.5);
    });
  };

  // Piano sound - single note
  const playPianoSound = () => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 523.25; // C5
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.0);
  };

  // Drum sound - snare drum
  const playDrumSound = () => {
    if (!audioContext) return;
    
    // Create noise for snare drum
    const bufferSize = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();
    
    source.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    source.start(audioContext.currentTime);
  };

  // Violin sound - sustained note
  const playViolinSound = () => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 659.25; // E5
    
    // Vibrato effect
    const vibratoGain = audioContext.createGain();
    const vibratoOsc = audioContext.createOscillator();
    
    vibratoOsc.frequency.value = 5; // 5 Hz vibrato
    vibratoGain.gain.value = 5; // +/- 5 cents
    
    vibratoOsc.connect(vibratoGain);
    vibratoGain.connect(oscillator.frequency);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.0);
    
    oscillator.start(audioContext.currentTime);
    vibratoOsc.start(audioContext.currentTime);
    
    oscillator.stop(audioContext.currentTime + 2.0);
    vibratoOsc.stop(audioContext.currentTime + 2.0);
  };

  // Flute sound - breathy tone
  const playFluteSound = () => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 349.23; // F4
    
    // Add some noise for breathiness
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.1;
    }
    
    const noiseSource = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    const noiseFilter = audioContext.createBiquadFilter();
    
    noiseSource.buffer = noiseBuffer;
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 8000;
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    noiseGain.gain.setValueAtTime(0, audioContext.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    oscillator.start(audioContext.currentTime);
    noiseSource.start(audioContext.currentTime);
    
    oscillator.stop(audioContext.currentTime + 1.5);
    noiseSource.stop(audioContext.currentTime + 1.5);
  };

  // Saxophone sound - brassy tone
  const playSaxophoneSound = () => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.value = 466.16; // Bb4
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.8);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.8);
  };

  // Default sound
  const playDefaultSound = () => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.0);
  };

  const nextInstrument = () => {
    setCurrentIndex((prev) => (prev + 1) % instruments.length);
    setRotation({ x: 0, y: 0 });
  };

  const prevInstrument = () => {
    setCurrentIndex((prev) => (prev - 1 + instruments.length) % instruments.length);
    setRotation({ x: 0, y: 0 });
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetShowcase = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setRotation({ x: 0, y: 0 });
    setAutoRotate(true);
    setScale(1);
  };

  // Handle mouse move for interactive 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || autoRotate) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation based on mouse position
    const rotateY = (mouseX / rect.width) * 60; // Max 60 degrees
    const rotateX = -(mouseY / rect.height) * 60; // Max 60 degrees
    
    setRotation({ x: rotateX, y: rotateY });
  };

  // Handle mouse leave to reset rotation
  const handleMouseLeave = () => {
    if (autoRotate) return;
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-xl border border-amber-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-amber-900 text-xl">3D Instrument Showcase</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={resetShowcase}
            className="text-amber-600 hover:text-amber-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-amber-700">Explore our featured instruments in 3D</p>
        {!autoRotate && (
          <p className="text-xs text-amber-600 mt-1">Move your mouse over the instrument to rotate it</p>
        )}
      </div>

      {/* Instrument Display with enhanced 3D effect */}
      <div className="flex flex-col items-center mb-6">
        <div 
          ref={containerRef}
          className="relative w-48 h-48 flex items-center justify-center mb-6 transition-transform duration-300 perspective-1000"
          style={{ 
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`,
            transformStyle: 'preserve-3d',
            cursor: autoRotate ? 'default' : 'grab'
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* 3D effect layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full opacity-30 blur-xl transform translate-z-[-20px]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full opacity-20 blur-lg transform translate-z-[-10px]"></div>
          
          {/* Main instrument */}
          <div 
            className="text-[120px] transition-all duration-300 hover:scale-110 transform translate-z-[20px]"
            style={{ 
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
              textShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }}
          >
            {currentInstrument.emoji}
          </div>
          
          {/* Reflection effect */}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-[90%] text-[120px] opacity-20 blur-[2px]"
            style={{ 
              transform: 'translateX(-50%) translateY(-90%) scaleY(-1)',
              zIndex: -1
            }}
          >
            {currentInstrument.emoji}
          </div>
        </div>

        <h4 className="text-2xl font-bold text-amber-900 mb-2">{currentInstrument.name}</h4>
        <div className="inline-block bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
          {currentInstrument.category}
        </div>
        <p className="text-amber-700 text-center mb-4">{currentInstrument.description}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-amber-600 font-medium">Sound:</span>
          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm">
            {currentInstrument.sound}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={prevInstrument}
          className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full transition-all transform hover:scale-110 shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={toggleAutoRotate}
          className={`p-3 rounded-full transition-all transform hover:scale-110 shadow-md flex items-center justify-center ${
            autoRotate 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
          }`}
        >
          {autoRotate ? (
            <span className="text-lg">⏸</span>
          ) : (
            <span className="text-lg">▶</span>
          )}
        </button>
        
        <button
          onClick={nextInstrument}
          className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full transition-all transform hover:scale-110 shadow-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Play Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={togglePlay}
          disabled={!audioContext}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all transform hover:scale-105 ${
            isPlaying 
              ? 'bg-gradient-to-r from-red-500 to-orange-500' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg'
          } ${!audioContext ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              Stop Sound
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Play Sound
            </>
          )}
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {instruments.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-amber-500 w-6' : 'bg-amber-200'
            }`}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-amber-600">
          {autoRotate ? '🔄 Auto-rotating 3D showcase' : '🖱️ Move mouse to rotate instrument'}
        </p>
      </div>
    </div>
  );
}