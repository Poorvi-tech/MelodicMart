'use client';

import React, { useState, useEffect, useRef } from 'react';

const SoundVisualizerPanel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize audio context and analyser
  const initAudio = () => {
    if (typeof window !== 'undefined') {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
      }
    }
  };

  // Play tone at specific frequency
  const playTone = (frequency: number) => {
    // Initialize audio context if not already done
    initAudio();
    
    if (!audioContextRef.current || !analyserRef.current) return;
    
    // Resume audio context if suspended (required for modern browsers)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Stop any currently playing tone
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }
    
    // Create new oscillator and gain node
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume / 100 * 0.3; // Scale volume to a reasonable level
    
    oscillator.start();
    
    // Store references
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    setCurrentFrequency(frequency);
  };

  // Stop currently playing tone
  const stopTone = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    setCurrentFrequency(null);
  };

  // Animation loop
  const drawWave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if ((isPlaying || currentFrequency) && analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      // Draw wave
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#8B5CF6'; // Purple color
      
      const sliceWidth = width / dataArrayRef.current.length;
      let x = 0;
      
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const v = dataArrayRef.current[i] / 128.0;
        const y = v * height / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      
      // Draw particles
      for (let i = 0; i < dataArrayRef.current.length; i += 4) {
        const value = dataArrayRef.current[i];
        const x = (i / dataArrayRef.current.length) * width;
        const y = (value / 256) * height;
        const size = value / 20;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${value / 256})`;
        ctx.fill();
      }
    }
    
    animationRef.current = requestAnimationFrame(drawWave);
  };

  // Start animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(drawWave);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      // If playing but no frequency is set, play a default tone
      if (!currentFrequency) {
        playTone(440); // A note (440Hz) as default
      }
    } else {
      stopTone();
    }
  }, [isPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100 * 0.3;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopTone();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm bg-opacity-90 w-full max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-xl">Sound Visualizer</h3>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`
            px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-105
            ${isPlaying 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-green-500 text-white'
            }
          `}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      </div>
      
      <div className="relative h-40 bg-black bg-opacity-30 rounded-xl overflow-hidden mb-4">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={160}
          className="w-full h-full"
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-opacity-50 text-sm">
              Click Play to visualize sound waves
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-white text-sm mb-1">
          <span>Volume</span>
          <span>{volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>
      
      <div className="flex space-x-2">
        {[125, 250, 500, 1000, 2000].map((freq) => (
          <button
            key={freq}
            onClick={() => {
              setIsPlaying(true);
              playTone(freq);
            }}
            className="flex-1 py-2 text-sm bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            {freq}Hz
          </button>
        ))}
      </div>
      
      {currentFrequency && (
        <div className="mt-3 text-center text-white text-sm">
          Playing: {currentFrequency}Hz
        </div>
      )}
    </div>
  );
};

export default SoundVisualizerPanel;