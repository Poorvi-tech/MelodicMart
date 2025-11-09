'use client';

import { useState, useEffect, useRef } from 'react';

export default function MusicVisualizerPanel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(20).fill(0));
  const [notes, setNotes] = useState<{id: number, left: number, top: number, symbol: string}[]>([]);
  const [musicType, setMusicType] = useState<'classical' | 'jazz' | 'rock' | 'electronic' | 'ambient'>('classical');
  const [volume, setVolume] = useState(70);
  const containerRef = useRef<HTMLDivElement>(null);
  const noteIdCounter = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context
  const initAudio = () => {
    if (typeof window !== 'undefined') {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    }
  };

  // Different music patterns
  const playClassical = () => {
    initAudio();
    if (!audioContextRef.current) return;
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Classical chord progression
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
    
    let time = audioContextRef.current.currentTime;
    const noteDuration = 0.5;
    
    chords.forEach((chord, chordIndex) => {
      chord.forEach((frequency, noteIndex) => {
        const noteTime = time + chordIndex * noteDuration;
        
        const noteOscillator = audioContextRef.current!.createOscillator();
        const noteGain = audioContextRef.current!.createGain();
        
        noteOscillator.connect(noteGain);
        noteGain.connect(audioContextRef.current!.destination);
        
        noteOscillator.type = 'sine';
        noteOscillator.frequency.value = frequency;
        
        noteGain.gain.setValueAtTime(0, noteTime);
        noteGain.gain.linearRampToValueAtTime(0.1 * (volume / 100), noteTime + 0.01);
        noteGain.gain.linearRampToValueAtTime(0, noteTime + noteDuration - 0.01);
        
        noteOscillator.start(noteTime);
        noteOscillator.stop(noteTime + noteDuration);
      });
    });
  };

  const playJazz = () => {
    initAudio();
    if (!audioContextRef.current) return;
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Jazz chord progression with swung rhythm
    const chords = [
      [220.00, 277.18, 329.63], // A Minor 7
      [246.94, 311.13, 369.99], // B Diminished 7
      [261.63, 329.63, 392.00], // C Major 7
      [293.66, 349.23, 440.00], // D Minor 7
      [329.63, 392.00, 493.88], // E Minor 7
      [349.23, 440.00, 523.25], // F Major 7
      [392.00, 493.88, 587.33], // G Dominant 7
      [329.63, 392.00, 493.88], // E Minor 7
    ];
    
    let time = audioContextRef.current.currentTime;
    const noteDuration = 0.4;
    
    chords.forEach((chord, chordIndex) => {
      chord.forEach((frequency, noteIndex) => {
        const noteTime = time + chordIndex * noteDuration;
        
        const noteOscillator = audioContextRef.current!.createOscillator();
        const noteGain = audioContextRef.current!.createGain();
        
        noteOscillator.connect(noteGain);
        noteGain.connect(audioContextRef.current!.destination);
        
        noteOscillator.type = 'triangle';
        noteOscillator.frequency.value = frequency;
        
        noteGain.gain.setValueAtTime(0, noteTime);
        noteGain.gain.linearRampToValueAtTime(0.08 * (volume / 100), noteTime + 0.01);
        noteGain.gain.linearRampToValueAtTime(0, noteTime + noteDuration - 0.01);
        
        noteOscillator.start(noteTime);
        noteOscillator.stop(noteTime + noteDuration);
      });
    });
  };

  const playRock = () => {
    initAudio();
    if (!audioContextRef.current) return;
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Rock power chord progression
    const chords = [
      [110.00, 146.83], // Low E5
      [146.83, 196.00], // A5
      [130.81, 174.61], // G5
      [110.00, 146.83], // Low E5
      [164.81, 220.00], // D5
      [146.83, 196.00], // A5
      [130.81, 174.61], // G5
      [110.00, 146.83], // Low E5
    ];
    
    let time = audioContextRef.current.currentTime;
    const noteDuration = 0.6;
    
    chords.forEach((chord, chordIndex) => {
      chord.forEach((frequency, noteIndex) => {
        const noteTime = time + chordIndex * noteDuration;
        
        const noteOscillator = audioContextRef.current!.createOscillator();
        const noteGain = audioContextRef.current!.createGain();
        
        noteOscillator.connect(noteGain);
        noteGain.connect(audioContextRef.current!.destination);
        
        noteOscillator.type = 'sawtooth';
        noteOscillator.frequency.value = frequency;
        
        noteGain.gain.setValueAtTime(0, noteTime);
        noteGain.gain.linearRampToValueAtTime(0.15 * (volume / 100), noteTime + 0.01);
        noteGain.gain.linearRampToValueAtTime(0, noteTime + noteDuration - 0.01);
        
        noteOscillator.start(noteTime);
        noteOscillator.stop(noteTime + noteDuration);
      });
    });
  };

  const playElectronic = () => {
    initAudio();
    if (!audioContextRef.current) return;
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Electronic arpeggiated pattern
    const notes = [
      130.81, 164.81, 196.00, 220.00, 261.63, 329.63, 392.00, 440.00,
      493.88, 523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 1046.50
    ];
    
    let time = audioContextRef.current.currentTime;
    const noteDuration = 0.15;
    
    notes.forEach((frequency, index) => {
      const noteTime = time + index * noteDuration;
      
      const noteOscillator = audioContextRef.current!.createOscillator();
      const noteGain = audioContextRef.current!.createGain();
      
      noteOscillator.connect(noteGain);
      noteGain.connect(audioContextRef.current!.destination);
      
      noteOscillator.type = 'square';
      noteOscillator.frequency.value = frequency;
      
      noteGain.gain.setValueAtTime(0, noteTime);
      noteGain.gain.linearRampToValueAtTime(0.05 * (volume / 100), noteTime + 0.01);
      noteGain.gain.linearRampToValueAtTime(0, noteTime + noteDuration - 0.01);
      
      noteOscillator.start(noteTime);
      noteOscillator.stop(noteTime + noteDuration);
    });
  };

  const playAmbient = () => {
    initAudio();
    if (!audioContextRef.current) return;
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Ambient drone chords
    const chords = [
      [65.41, 82.41, 98.00],  // Low C Major
      [98.00, 123.47, 146.83], // E Minor
      [130.81, 164.81, 196.00], // G Major
      [65.41, 82.41, 98.00],  // Low C Major
    ];
    
    let time = audioContextRef.current.currentTime;
    const noteDuration = 2.0;
    
    chords.forEach((chord, chordIndex) => {
      chord.forEach((frequency, noteIndex) => {
        const noteTime = time + chordIndex * noteDuration;
        
        const noteOscillator = audioContextRef.current!.createOscillator();
        const noteGain = audioContextRef.current!.createGain();
        
        noteOscillator.connect(noteGain);
        noteGain.connect(audioContextRef.current!.destination);
        
        noteOscillator.type = 'sine';
        noteOscillator.frequency.value = frequency;
        
        noteGain.gain.setValueAtTime(0, noteTime);
        noteGain.gain.linearRampToValueAtTime(0.05 * (volume / 100), noteTime + 0.5);
        noteGain.gain.setValueAtTime(0.05 * (volume / 100), noteTime + noteDuration - 0.5);
        noteGain.gain.linearRampToValueAtTime(0, noteTime + noteDuration);
        
        noteOscillator.start(noteTime);
        noteOscillator.stop(noteTime + noteDuration);
      });
    });
  };

  // Play selected music type
  const playSelectedMusic = () => {
    switch (musicType) {
      case 'classical':
        playClassical();
        break;
      case 'jazz':
        playJazz();
        break;
      case 'rock':
        playRock();
        break;
      case 'electronic':
        playElectronic();
        break;
      case 'ambient':
        playAmbient();
        break;
      default:
        playClassical();
    }
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
    if (isPlaying) {
      playSelectedMusic();
      // Set up interval based on music type
      const intervalTime = musicType === 'electronic' ? 2000 : musicType === 'ambient' ? 8000 : 4000;
      intervalRef.current = setInterval(playSelectedMusic, intervalTime);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, musicType, volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  // Handle music type change with immediate playback
  const handleMusicTypeChange = (type: 'classical' | 'jazz' | 'rock' | 'electronic' | 'ambient') => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Set new music type
    setMusicType(type);
    
    // If already playing, play the new music type immediately and set up new interval
    if (isPlaying) {
      // Play the new music type immediately
      setTimeout(() => {
        switch (type) {
          case 'classical':
            playClassical();
            break;
          case 'jazz':
            playJazz();
            break;
          case 'rock':
            playRock();
            break;
          case 'electronic':
            playElectronic();
            break;
          case 'ambient':
            playAmbient();
            break;
          default:
            playClassical();
        }
      }, 10);
      
      // Set up new interval for the selected music type
      const intervalTime = type === 'electronic' ? 2000 : type === 'ambient' ? 8000 : 4000;
      intervalRef.current = setInterval(() => {
        switch (type) {
          case 'classical':
            playClassical();
            break;
          case 'jazz':
            playJazz();
            break;
          case 'rock':
            playRock();
            break;
          case 'electronic':
            playElectronic();
            break;
          case 'ambient':
            playAmbient();
            break;
          default:
            playClassical();
        }
      }, intervalTime);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-indigo-200 w-full max-w-2xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70 rounded-2xl"></div>
      
      {/* Header */}
      <div className="relative flex items-center justify-between mb-5">
        <h3 className="font-bold text-indigo-900 text-xl flex items-center gap-2">
          Music Visualizer
        </h3>
        <button 
          onClick={togglePlay}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full p-3 hover:scale-110 transition-all shadow-lg"
        >
          {isPlaying ? 
            <div className="w-6 h-6">⏸</div> : 
            <div className="w-6 h-6">▶</div>
          }
        </button>
      </div>
      
      {/* Music Type Selector */}
      <div className="mb-5">
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: 'classical', label: 'Classical', color: 'from-blue-500 to-indigo-500' },
            { id: 'jazz', label: 'Jazz', color: 'from-purple-500 to-pink-500' },
            { id: 'rock', label: 'Rock', color: 'from-red-500 to-orange-500' },
            { id: 'electronic', label: 'Electronic', color: 'from-green-500 to-teal-500' },
            { id: 'ambient', label: 'Ambient', color: 'from-indigo-500 to-purple-500' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => handleMusicTypeChange(type.id as any)}
              className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                musicType === type.id
                  ? `bg-gradient-to-r ${type.color} text-white shadow-md`
                  : 'bg-white/80 text-indigo-700 hover:bg-white/90'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Visualizer bars */}
      <div className="relative h-32 flex items-end justify-between gap-2 mb-5">
        {bars.map((height, index) => (
          <div
            key={index}
            className="bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-sm w-4 transition-all duration-200"
            style={{ 
              height: `${height}%`,
              boxShadow: '0 -2px 4px rgba(99, 102, 241, 0.3)'
            }}
          />
        ))}
      </div>
      
      {/* Floating notes container */}
      <div className="relative h-20 overflow-hidden mb-4">
        {notes.map(note => (
          <div
            key={note.id}
            className="absolute text-3xl text-indigo-600 opacity-70 animate-pulse"
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
      
      {/* Volume control */}
      <div className="relative flex items-center gap-3 mb-3">
        <div className="text-indigo-600">🔈</div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="text-indigo-600">🔊</div>
      </div>
      
      {/* Volume display */}
      <div className="text-center text-indigo-600 font-medium mb-2">
        Volume: {volume}%
      </div>
      
      {/* Fun message */}
      <div className="relative mt-4 text-center">
        <p className="text-indigo-600 font-medium">
          {isPlaying ? `🎶 Enjoy ${musicType} music! 🎶` : 'Click play to start the music!'}
        </p>
      </div>
    </div>
  );
}