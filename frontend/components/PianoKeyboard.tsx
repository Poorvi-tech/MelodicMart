'use client';

import React, { useState, useEffect, useCallback } from 'react';

const PianoKeyboard = () => {
  const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

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

  // Play note function
  const playNote = useCallback((frequency: number) => {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    
    // Fade out
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
    
    setTimeout(() => {
      oscillator.stop();
    }, 1000);
  }, [audioContext]);

  // Handle key press
  const handleKeyPress = (key: string, frequency: number) => {
    setActiveKeys(prev => ({ ...prev, [key]: true }));
    playNote(frequency);
    
    // Reset key after animation
    setTimeout(() => {
      setActiveKeys(prev => ({ ...prev, [key]: false }));
    }, 300);
  };

  // Keyboard keys with frequencies
  const keys = [
    { note: 'C', key: 'a', frequency: 261.63 },
    { note: 'D', key: 's', frequency: 293.66 },
    { note: 'E', key: 'd', frequency: 329.63 },
    { note: 'F', key: 'f', frequency: 349.23 },
    { note: 'G', key: 'g', frequency: 392.00 },
    { note: 'A', key: 'h', frequency: 440.00 },
    { note: 'B', key: 'j', frequency: 493.88 },
    { note: 'C5', key: 'k', frequency: 523.25 },
  ];

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const keyData = keys.find(k => k.key === key);
      
      if (keyData && !activeKeys[keyData.key]) {
        handleKeyPress(keyData.key, keyData.frequency);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeKeys, keys]);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 shadow-2xl backdrop-blur-sm bg-opacity-90">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold text-lg">Play Piano</h3>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
            isPlaying 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          }`}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      </div>
      
      <div className="flex space-x-1">
        {keys.map((keyData) => (
          <button
            key={keyData.note}
            onClick={() => handleKeyPress(keyData.key, keyData.frequency)}
            className={`
              w-10 h-24 rounded-lg flex flex-col items-center justify-end pb-2
              transition-all duration-150 transform
              ${activeKeys[keyData.key] 
                ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 scale-95 shadow-inner' 
                : 'bg-gradient-to-b from-white to-gray-200 shadow-lg'
              }
              hover:brightness-110
            `}
          >
            <span className={`text-xs font-bold ${activeKeys[keyData.key] ? 'text-gray-800' : 'text-gray-600'}`}>
              {keyData.note}
            </span>
            <span className={`text-[10px] ${activeKeys[keyData.key] ? 'text-gray-700' : 'text-gray-500'}`}>
              {keyData.key.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-2 text-center text-xs text-white opacity-80">
        Press keys A-K or click keys to play
      </div>
    </div>
  );
};

export default PianoKeyboard;