'use client';

import { useEffect, useRef } from 'react';

interface CelebrationEffectProps {
  trigger: boolean;
}

export default function CelebrationEffect({ trigger }: CelebrationEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !containerRef.current) return;

    const container = containerRef.current;
    const elements: HTMLDivElement[] = [];

    // Create confetti
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'absolute rounded-sm';
      
      // Random properties
      const size = Math.random() * 10 + 5;
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = Math.random() * 3 + 2;
      const colors = [
        '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', 
        '#f43f5e', '#f59e0b', '#10b981', '#0ea5e9'
      ];
      
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.left = `${left}%`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.opacity = '0.8';
      confetti.style.animation = `confettiFall ${duration}s linear forwards`;
      confetti.style.animationDelay = `${delay}s`;
      confetti.style.top = '-20px';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      container.appendChild(confetti);
      elements.push(confetti);
    }

    // Create musical notes
    for (let i = 0; i < 20; i++) {
      const note = document.createElement('div');
      note.className = 'absolute text-2xl';
      note.innerHTML = ['♪', '♫', '♬'][Math.floor(Math.random() * 3)];
      
      // Random properties
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = Math.random() * 3 + 2;
      const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];
      
      note.style.left = `${left}%`;
      note.style.color = colors[Math.floor(Math.random() * colors.length)];
      note.style.opacity = '0.9';
      note.style.animation = `noteFloat ${duration}s ease-out forwards`;
      note.style.animationDelay = `${delay}s`;
      note.style.top = '-20px';
      
      container.appendChild(note);
      elements.push(note);
    }

    // Clean up after animation completes
    const cleanupTimer = setTimeout(() => {
      elements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    }, 5000);

    return () => {
      clearTimeout(cleanupTimer);
      elements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, [trigger]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{ animation: 'none' }}
    />
  );
}
