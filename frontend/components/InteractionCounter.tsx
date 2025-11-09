'use client';

import { useState, useEffect } from 'react';
import { Heart, Star, Music } from 'lucide-react';

export default function InteractionCounter() {
  const [interactions, setInteractions] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [milestone, setMilestone] = useState(0);

  // Load interaction count from localStorage
  useEffect(() => {
    const savedInteractions = localStorage.getItem('musicHavenInteractions');
    if (savedInteractions) {
      const count = parseInt(savedInteractions, 10);
      setInteractions(count);
      checkMilestone(count);
    }
  }, []);

  // Save interaction count to localStorage
  useEffect(() => {
    localStorage.setItem('musicHavenInteractions', interactions.toString());
    checkMilestone(interactions);
  }, [interactions]);

  const checkMilestone = (count: number) => {
    const milestones = [10, 25, 50, 100];
    const newMilestone = milestones.find(m => count === m && count > milestone);
    
    if (newMilestone) {
      setMilestone(newMilestone);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const incrementInteraction = () => {
    setInteractions(prev => prev + 1);
  };

  // Expose function globally for other components to call
  useEffect(() => {
    (window as any).incrementInteraction = incrementInteraction;
    
    return () => {
      delete (window as any).incrementInteraction;
    };
  }, []);

  return (
    <div className="fixed top-24 right-6 z-30">
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-3 shadow-lg border border-pink-200">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full p-2">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="text-xs text-pink-600 font-medium">Your Interactions</div>
            <div className="text-lg font-bold text-pink-800">{interactions}</div>
          </div>
        </div>
        
        {showMessage && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-bounce-slow flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Milestone!
          </div>
        )}
      </div>
      
      {showMessage && (
        <div className="absolute top-16 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold px-3 py-2 rounded-lg shadow-lg animate-fadeIn whitespace-nowrap">
          🎉 {milestone} interactions! You're a Music Haven superstar! 🎉
        </div>
      )}
    </div>
  );
}