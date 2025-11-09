'use client';

import React, { useState, useEffect } from 'react';

const InstrumentShowcasePanel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [scale, setScale] = useState(1);

  // Sample instrument data with emojis
  const instruments = [
    {
      id: 1,
      name: 'Grand Piano',
      category: 'Keyboard',
      description: 'Classic acoustic piano with rich sound',
      price: '$2,499',
      image: '🎹'
    },
    {
      id: 2,
      name: 'Electric Guitar',
      category: 'Strings',
      description: 'Professional electric guitar with premium pickups',
      price: '$899',
      image: '🎸'
    },
    {
      id: 3,
      name: 'Drum Set',
      category: 'Percussion',
      description: 'Complete drum kit with cymbals',
      price: '$1,299',
      image: '🥁'
    },
    {
      id: 4,
      name: 'Violin',
      category: 'Strings',
      description: 'Handcrafted violin with beautiful tone',
      price: '$599',
      image: '🎻'
    },
    {
      id: 5,
      name: 'Saxophone',
      category: 'Wind',
      description: 'Professional alto saxophone',
      price: '$1,199',
      image: '🎷'
    }
  ];

  // Auto-rotate instruments
  useEffect(() => {
    if (!isRotating) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % instruments.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isRotating, instruments.length]);

  // Handle manual navigation
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % instruments.length);
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + instruments.length) % instruments.length);
  };

  // Get current instrument
  const currentInstrument = instruments[currentIndex];

  return (
    <div className="bg-gradient-to-br from-amber-900 to-orange-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm bg-opacity-90 w-full max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-xl">Featured Instruments</h3>
        <button 
          onClick={() => setIsRotating(!isRotating)}
          className={`
            px-3 py-1 rounded-full text-sm font-semibold transition-all
            ${isRotating 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
            }
          `}
        >
          {isRotating ? 'Pause' : 'Play'}
        </button>
      </div>
      
      <div 
        className="relative h-56 rounded-xl bg-gradient-to-br from-amber-700 to-orange-600 mb-5 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => setScale(scale === 1 ? 1.1 : 1)}
      >
        <div 
          className="text-8xl transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `scale(${scale}) rotateY(${isRotating ? currentIndex * 72 : 0}deg)`,
            transition: 'transform 1s ease-in-out'
          }}
        >
          {currentInstrument.image}
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-shine"></div>
      </div>
      
      <div className="text-center mb-4">
        <h4 className="text-white font-bold text-2xl mb-2">{currentInstrument.name}</h4>
        <p className="text-amber-200 text-lg mb-2">{currentInstrument.category}</p>
        <p className="text-white text-opacity-80 text-base mb-3">{currentInstrument.description}</p>
        <p className="text-yellow-300 font-bold text-xl">{currentInstrument.price}</p>
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          onClick={goToPrev}
          className="px-5 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium"
        >
          ← Prev
        </button>
        
        <div className="flex space-x-2">
          {instruments.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-yellow-400' : 'bg-amber-700'
              }`}
            ></div>
          ))}
        </div>
        
        <button 
          onClick={goToNext}
          className="px-5 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium"
        >
          Next →
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
          View Details
        </button>
      </div>
    </div>
  );
};

export default InstrumentShowcasePanel;