'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Music } from 'lucide-react';

interface Beat {
  id: string;
  time: number;
  instrument: string;
}

export default function RhythmBuilder() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [currentBeat, setCurrentBeat] = useState<number | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepCount = 16; // 16 steps in our rhythm grid

  // Instruments with their sounds
  const instruments = [
    { name: 'Kick', color: 'bg-red-500' },
    { name: 'Snare', color: 'bg-blue-500' },
    { name: 'Hi-Hat', color: 'bg-yellow-500' },
    { name: 'Clap', color: 'bg-green-500' },
  ];

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

  // Play a sound based on instrument
  const playSound = (instrument: string) => {
    if (!audioContext) return;

    switch (instrument) {
      case 'Kick':
        // Kick drum sound - low frequency sine wave with quick decay
        const kickOsc = audioContext.createOscillator();
        const kickGain = audioContext.createGain();
        
        kickOsc.connect(kickGain);
        kickGain.connect(audioContext.destination);
        
        kickOsc.frequency.setValueAtTime(150, audioContext.currentTime);
        kickOsc.frequency.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        kickGain.gain.setValueAtTime(1, audioContext.currentTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        kickOsc.start(audioContext.currentTime);
        kickOsc.stop(audioContext.currentTime + 0.5);
        break;

      case 'Snare':
        // Snare drum sound - noise with filter
        const snareBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
        const snareData = snareBuffer.getChannelData(0);
        
        for (let i = 0; i < snareData.length; i++) {
          snareData[i] = Math.random() * 2 - 1;
        }
        
        const snareSource = audioContext.createBufferSource();
        const snareFilter = audioContext.createBiquadFilter();
        const snareGain = audioContext.createGain();
        
        snareSource.buffer = snareBuffer;
        snareFilter.type = 'highpass';
        snareFilter.frequency.value = 1000;
        
        snareSource.connect(snareFilter);
        snareFilter.connect(snareGain);
        snareGain.connect(audioContext.destination);
        
        snareGain.gain.setValueAtTime(1, audioContext.currentTime);
        snareGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        snareSource.start(audioContext.currentTime);
        break;

      case 'Hi-Hat':
        // Hi-hat sound - high frequency noise with quick decay
        const hatBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
        const hatData = hatBuffer.getChannelData(0);
        
        for (let i = 0; i < hatData.length; i++) {
          hatData[i] = Math.random() * 2 - 1;
        }
        
        const hatSource = audioContext.createBufferSource();
        const hatFilter = audioContext.createBiquadFilter();
        const hatGain = audioContext.createGain();
        
        hatSource.buffer = hatBuffer;
        hatFilter.type = 'highpass';
        hatFilter.frequency.value = 5000;
        
        hatSource.connect(hatFilter);
        hatFilter.connect(hatGain);
        hatGain.connect(audioContext.destination);
        
        hatGain.gain.setValueAtTime(0.7, audioContext.currentTime);
        hatGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        hatSource.start(audioContext.currentTime);
        break;

      case 'Clap':
        // Clap sound - two quick noise bursts
        for (let i = 0; i < 2; i++) {
          const clapBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.05, audioContext.sampleRate);
          const clapData = clapBuffer.getChannelData(0);
          
          for (let j = 0; j < clapData.length; j++) {
            clapData[j] = Math.random() * 2 - 1;
          }
          
          const clapSource = audioContext.createBufferSource();
          const clapFilter = audioContext.createBiquadFilter();
          const clapGain = audioContext.createGain();
          
          clapSource.buffer = clapBuffer;
          clapFilter.type = 'bandpass';
          clapFilter.frequency.value = 1200;
          
          clapSource.connect(clapFilter);
          clapFilter.connect(clapGain);
          clapGain.connect(audioContext.destination);
          
          clapGain.gain.setValueAtTime(0, audioContext.currentTime);
          clapGain.gain.setValueAtTime(0.5, audioContext.currentTime + i * 0.02);
          clapGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.02 + 0.1);
          
          clapSource.start(audioContext.currentTime + i * 0.02);
        }
        break;
    }
  };

  // Add a beat at a specific time
  const addBeat = (time: number, instrument: string) => {
    // Check if a beat already exists at this time and instrument
    const existingBeatIndex = beats.findIndex(beat => beat.time === time && beat.instrument === instrument);
    
    if (existingBeatIndex !== -1) {
      // Remove the beat if it already exists
      const newBeats = [...beats];
      newBeats.splice(existingBeatIndex, 1);
      setBeats(newBeats);
    } else {
      // Add new beat
      const newBeat: Beat = {
        id: `${time}-${instrument}-${Date.now()}`,
        time,
        instrument,
      };
      setBeats([...beats, newBeat]);
    }
  };

  // Clear all beats
  const clearBeats = () => {
    setBeats([]);
    setCurrentBeat(null);
  };

  // Play the rhythm
  const playRhythm = () => {
    if (beats.length === 0) return;

    setIsPlaying(true);
    setCurrentBeat(0);
    let step = 0;

    const beatInterval = (60 / bpm) * 1000 / 4; // 16th notes

    intervalRef.current = setInterval(() => {
      setCurrentBeat(step);
      
      // Play sounds for this step
      const soundsToPlay = beats.filter(beat => beat.time === step);
      soundsToPlay.forEach(beat => {
        playSound(beat.instrument);
      });

      step = (step + 1) % stepCount;
      
      // Stop after one full cycle if not looping
      if (step === 0) {
        // For now, we'll loop continuously
      }
    }, beatInterval);
  };

  // Stop playing
  const stopPlaying = () => {
    setIsPlaying(false);
    setCurrentBeat(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      stopPlaying();
    } else {
      playRhythm();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-xl border border-indigo-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-indigo-900 flex items-center gap-2 text-xl">
          <Music className="w-6 h-6 text-indigo-600" />
          Rhythm Builder
        </h3>
        <div className="flex items-center gap-3">
          <button 
            onClick={clearBeats}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      <p className="text-indigo-700 mb-6">
        Create your own rhythm by adding beats. Adjust tempo and play your creation!
      </p>

      {/* BPM Control */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-medium text-indigo-900">Tempo</span>
          <span className="text-indigo-600 font-mono">{bpm} BPM</span>
        </div>
        <input
          type="range"
          min="60"
          max="200"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
          className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-indigo-500 mt-1">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Rhythm Grid */}
      <div className="mb-6">
        <h4 className="font-semibold text-indigo-900 mb-3">Your Rhythm</h4>
        <div className="bg-white rounded-xl p-4 border border-indigo-100">
          {instruments.map((instrument) => (
            <div key={instrument.name} className="flex items-center mb-2 last:mb-0">
              <div className={`w-20 py-2 rounded-lg text-white text-sm font-medium ${instrument.color} flex items-center justify-center`}>
                {instrument.name}
              </div>
              <div className="flex flex-1 gap-1 ml-2">
                {Array.from({ length: stepCount }).map((_, time) => {
                  const hasBeat = beats.some(beat => beat.time === time && beat.instrument === instrument.name);
                  return (
                    <button
                      key={`${instrument.name}-${time}`}
                      onClick={() => addBeat(time, instrument.name)}
                      className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                        hasBeat 
                          ? `${instrument.color} text-white ring-2 ring-indigo-300` 
                          : 'bg-indigo-100 hover:bg-indigo-200'
                      } ${
                        currentBeat === time 
                          ? 'ring-4 ring-indigo-500 scale-110' 
                          : ''
                      }`}
                    >
                      {hasBeat ? '●' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Play Controls */}
      <div className="flex justify-center">
        <button
          onClick={togglePlay}
          disabled={beats.length === 0}
          className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 ${
            isPlaying 
              ? 'bg-gradient-to-r from-red-500 to-orange-500' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-lg'
          } ${beats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-6 h-6" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              Play Rhythm
            </>
          )}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-indigo-600">
          Create a rhythm by clicking on the grid, then press play to hear your creation!
        </p>
      </div>
    </div>
  );
}