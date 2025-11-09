'use client';

import { useState, useEffect, useRef } from 'react';

export default function SoundWaveAnimation() {
  const [isActive, setIsActive] = useState(false);
  const [wavePattern, setWavePattern] = useState<number[]>(Array(20).fill(0));
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [gainNode, setGainNode] = useState<GainNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
    }

    return () => {
      // Clean up audio resources
      if (oscillator) {
        oscillator.stop();
      }
      if (audioContext) {
        audioContext.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Generate random wave heights for animation and sound
  useEffect(() => {
    if (!isActive) {
      // Stop sound when inactive
      if (oscillator) {
        oscillator.stop();
        setOscillator(null);
      }
      return;
    }

    // Start sound when active
    if (audioContext) {
      playSound();
    }

    // Animation loop for wave pattern
    const animate = () => {
      setWavePattern(prev => 
        prev.map(() => Math.floor(Math.random() * 80) + 10)
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, audioContext]);

  // Play sound using Web Audio API
  const playSound = () => {
    if (!audioContext) return;

    // Create oscillator and gain node
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    // Configure oscillator
    osc.type = 'sine';
    osc.frequency.value = 220; // A3 note (lower frequency for deeper sound)

    // Configure gain (volume)
    gain.gain.value = 0.3;

    // Connect nodes
    osc.connect(gain);
    gain.connect(audioContext.destination);

    // Start oscillator
    osc.start();

    // Store references
    setOscillator(osc);
    setGainNode(gain);

    // Create a subtle frequency modulation for more interesting sound
    const modulationOsc = audioContext.createOscillator();
    const modulationGain = audioContext.createGain();
    
    modulationOsc.type = 'sine';
    modulationOsc.frequency.value = 0.5; // Slow modulation
    modulationGain.gain.value = 10; // Amount of modulation
    
    modulationOsc.connect(modulationGain);
    modulationGain.connect(osc.frequency);
    
    modulationOsc.start();
    
    // Stop modulation after some time
    setTimeout(() => {
      modulationOsc.stop();
    }, 1000);
  };

  // Update sound based on wave pattern for dynamic audio
  useEffect(() => {
    if (!isActive || !oscillator || !gainNode) return;

    // Calculate average height for sound modulation
    const avgHeight = wavePattern.reduce((sum, height) => sum + height, 0) / wavePattern.length;
    
    // Modulate frequency based on wave height
    oscillator.frequency.linearRampToValueAtTime(
      100 + (avgHeight / 100) * 200, // Frequency between 100-300 Hz
      audioContext!.currentTime + 0.1
    );
    
    // Modulate gain based on wave intensity
    gainNode.gain.linearRampToValueAtTime(
      0.1 + (avgHeight / 100) * 0.4, // Volume between 0.1-0.5
      audioContext!.currentTime + 0.1
    );
  }, [wavePattern, isActive, oscillator, gainNode, audioContext]);

  const toggleAnimation = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 shadow-xl border border-cyan-200">
      <div className="text-center mb-6">
        <h3 className="font-bold text-cyan-900 text-xl mb-2">Sound Wave Visualizer</h3>
        <p className="text-cyan-700">See sound come to life with animated waves</p>
      </div>

      {/* Wave Visualization */}
      <div className="flex items-end justify-center gap-1 h-32 mb-6">
        {wavePattern.map((height, index) => (
          <div
            key={index}
            className={`bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm transition-all duration-200 ${
              isActive ? 'animate-pulse' : ''
            }`}
            style={{
              height: `${height}%`,
              width: '4%',
              boxShadow: '0 -2px 4px rgba(6, 182, 212, 0.3)',
              opacity: 0.7 + (height/100) * 0.3
            }}
          />
        ))}
      </div>

      {/* Control Button */}
      <div className="flex justify-center">
        <button
          onClick={toggleAnimation}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all transform hover:scale-105 ${
            isActive 
              ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-lg' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg'
          }`}
        >
          {isActive ? (
            <span>⏹ Stop Animation</span>
          ) : (
            <span>▶ Start Animation</span>
          )}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-cyan-600">
          {isActive 
            ? '🎵 Watch the sound waves dance! 🎵' 
            : 'Click to visualize sound waves'}
        </p>
      </div>
    </div>
  );
}