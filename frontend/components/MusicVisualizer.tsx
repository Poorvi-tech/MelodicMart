'use client';

import { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2 } from 'lucide-react';

export default function MusicVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(20).fill(0));
  const [notes, setNotes] = useState<{id: number, left: number, top: number, symbol: string}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const noteIdCounter = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  const initAudio = () => {
    if (typeof window !== 'undefined') {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    }
  };

  // Play a pleasant chord progression
  const playMusic = () => {
    initAudio();
    
    if (!audioContextRef.current) return;
    
    // Resume audio context if suspended (required for modern browsers)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Set up a pleasant chord progression
    const chords = [
      [261.63, 329.63, 392.00], // C Major
      [293.66, 349.23, 440.00], // D Minor
      [329.63, 392.00, 493.88], // E Minor
      [261.63, 329.63, 392.00], // C Major
      [349.23, 440.00, 523.25], // F Major
      [392.00, 493.88, 587.33], // G Major
      [329.63, 392.00, 493.88], // E Minor
      [261.63, 329.63, 392.00], // C Major
    ];
    
    // Create a simple melody using the Web Audio API
    let time = audioContextRef.current.currentTime;
    const noteDuration = 0.5; // 0.5 seconds per note
    
    chords.forEach((chord, chordIndex) => {
      chord.forEach((frequency, noteIndex) => {
        const noteTime = time + chordIndex * noteDuration;
        
        // Create oscillators for each note in the chord
        const noteOscillator = audioContextRef.current!.createOscillator();
        const noteGain = audioContextRef.current!.createGain();
        
        noteOscillator.connect(noteGain);
        noteGain.connect(audioContextRef.current!.destination);
        
        noteOscillator.type = 'sine';
        noteOscillator.frequency.value = frequency;
        
        // Apply envelope to avoid clicks
        noteGain.gain.setValueAtTime(0, noteTime);
        noteGain.gain.linearRampToValueAtTime(0.1, noteTime + 0.01);
        noteGain.gain.linearRampToValueAtTime(0, noteTime + noteDuration - 0.01);
        
        noteOscillator.start(noteTime);
        noteOscillator.stop(noteTime + noteDuration);
      });
    });
  };

  // Generate random bar heights for visualization
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setBars(prev => 
        prev.map(() => Math.floor(Math.random() * 80) + 10)
      );
    }, 200);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Create floating musical notes
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      if (containerRef.current) {
        const newNote = {
          id: noteIdCounter.current++,
          left: Math.random() * 100,
          top: 100,
          symbol: ['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)]
        };
        
        setNotes(prev => [...prev, newNote]);
        
        // Remove note after animation
        setTimeout(() => {
          setNotes(prev => prev.filter(note => note.id !== newNote.id));
        }, 3000);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Animate notes upward
  useEffect(() => {
    if (!isPlaying || notes.length === 0) return;
    
    const interval = setInterval(() => {
      setNotes(prev => 
        prev.map(note => ({
          ...note,
          top: note.top - 1
        })).filter(note => note.top > -10)
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [isPlaying, notes.length]);

  // Handle play/pause with actual music
  useEffect(() => {
    let musicInterval: NodeJS.Timeout;
    
    if (isPlaying) {
      playMusic();
      // Restart music every 4 seconds (length of our chord progression)
      musicInterval = setInterval(playMusic, 4000);
    }
    
    return () => {
      if (musicInterval) {
        clearInterval(musicInterval);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-24 right-6 z-30">
      <div 
        ref={containerRef}
        className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-indigo-200 relative overflow-hidden"
        style={{ width: '300px' }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-4">
          <h3 className="font-bold text-indigo-900 flex items-center gap-2">
            <Music className="w-5 h-5 text-indigo-600" />
            Music Visualizer
          </h3>
          <button 
            onClick={togglePlay}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full p-2 hover:scale-110 transition-all shadow-lg"
          >
            {isPlaying ? 
              <Pause className="w-5 h-5" /> : 
              <Play className="w-5 h-5" />
            }
          </button>
        </div>
        
        {/* Visualizer bars */}
        <div className="relative h-24 flex items-end justify-between gap-1 mb-4">
          {bars.map((height, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-sm w-3 transition-all duration-200"
              style={{ 
                height: `${height}%`,
                boxShadow: '0 -2px 4px rgba(99, 102, 241, 0.3)'
              }}
            />
          ))}
        </div>
        
        {/* Floating notes container */}
        <div className="relative h-16 overflow-hidden">
          {notes.map(note => (
            <div
              key={note.id}
              className="absolute text-2xl text-indigo-600 opacity-70 animate-pulse"
              style={{
                left: `${note.left}%`,
                top: `${note.top}%`,
                transform: 'translateY(0)',
                transition: 'top 0.05s linear'
              }}
            >
              {note.symbol}
            </div>
          ))}
        </div>
        
        {/* Volume indicator */}
        <div className="relative flex items-center gap-2 mt-2">
          <Volume2 className="w-4 h-4 text-indigo-600" />
          <div className="flex-1 bg-indigo-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
              style={{ width: isPlaying ? '70%' : '30%' }}
            ></div>
          </div>
        </div>
        
        {/* Fun message */}
        <div className="relative mt-3 text-center">
          <p className="text-xs text-indigo-600 font-medium">
            {isPlaying ? '🎶 Feel the rhythm! 🎶' : 'Click play to start the music!'}
          </p>
        </div>
      </div>
    </div>
  );
}