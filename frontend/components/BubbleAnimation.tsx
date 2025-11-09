'use client';

import { useEffect, useRef } from 'react';

export default function BubbleAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements: HTMLDivElement[] = [];

    // Create bubbles with different animations
    for (let i = 0; i < 20; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'absolute rounded-full opacity-20';
      
      // Random properties
      const size = Math.random() * 60 + 20;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 15 + 10;
      const animationType = Math.floor(Math.random() * 3);
      
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${left}%`;
      bubble.style.backgroundColor = getRandomBubbleColor();
      
      // Apply different animations
      if (animationType === 0) {
        bubble.style.animation = `bubbleFloat ${duration}s linear infinite`;
      } else if (animationType === 1) {
        bubble.style.animation = `bubbleFloatDiagonal ${duration}s linear infinite`;
      } else {
        bubble.style.animation = `bubbleFloatWavy ${duration}s linear infinite`;
      }
      
      bubble.style.animationDelay = `${delay}s`;
      bubble.style.bottom = `-${size}px`;
      
      container.appendChild(bubble);
      elements.push(bubble);
    }

    // Create floating musical notes
    for (let i = 0; i < 10; i++) {
      const note = document.createElement('div');
      note.className = 'absolute opacity-30';
      note.innerHTML = getRandomMusicSymbol();
      
      // Random properties
      const size = Math.random() * 30 + 15;
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 20 + 15;
      const animationType = Math.floor(Math.random() * 3);
      
      note.style.fontSize = `${size}px`;
      note.style.left = `${left}%`;
      note.style.color = getRandomNoteColor();
      
      // Apply different animations
      if (animationType === 0) {
        note.style.animation = `bubbleFloat ${duration}s linear infinite`;
      } else if (animationType === 1) {
        note.style.animation = `bubbleFloatDiagonal ${duration}s linear infinite`;
      } else {
        note.style.animation = `bubbleFloatWavy ${duration}s linear infinite`;
      }
      
      note.style.animationDelay = `${delay}s`;
      note.style.bottom = `-${size}px`;
      
      container.appendChild(note);
      elements.push(note);
    }

    return () => {
      elements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, []);

  const getRandomBubbleColor = () => {
    const colors = [
      'rgba(59, 130, 246, 0.8)',   // blue-500
      'rgba(99, 102, 241, 0.8)',   // indigo-500
      'rgba(139, 92, 246, 0.8)',   // violet-500
      'rgba(168, 85, 247, 0.8)',   // purple-500
      'rgba(147, 197, 253, 0.8)',  // blue-300
      'rgba(199, 210, 254, 0.8)',  // indigo-300
      'rgba(221, 214, 254, 0.8)',  // violet-200
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomNoteColor = () => {
    const colors = [
      '#3b82f6',  // blue-500
      '#6366f1',  // indigo-500
      '#8b5cf6',  // violet-500
      '#a78bfa',  // violet-300
      '#93c5fd',  // blue-300
      '#c7d2fe',  // indigo-200
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomMusicSymbol = () => {
    const symbols = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none overflow-hidden z-40"
      style={{ 
        background: 'transparent',
        animation: 'none'
      }}
    />
  );
}