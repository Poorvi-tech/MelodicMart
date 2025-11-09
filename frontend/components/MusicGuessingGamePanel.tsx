'use client';

import React, { useState, useEffect } from 'react';

const MusicGuessingGamePanel = () => {
  const [instruments] = useState([
    {
      id: 1,
      name: 'Piano',
      clues: [
        'I have 88 keys but can\'t open any doors',
        'I can play both softly and loudly',
        'I\'m found in concert halls and homes',
        'I use hammers to create sound'
      ],
      funFact: 'The piano was invented in Italy around 1700!',
      image: '🎹'
    },
    {
      id: 2,
      name: 'Guitar',
      clues: [
        'I have six strings that can be strummed or plucked',
        'I\'m popular in rock and folk music',
        'I can be acoustic or electric',
        'I have a hollow body that amplifies sound'
      ],
      funFact: 'The guitar is one of the most popular instruments worldwide!',
      image: '🎸'
    },
    {
      id: 3,
      name: 'Violin',
      clues: [
        'I\'m played with a bow made of horsehair',
        'I have four strings and a curved body',
        'I\'m part of the string family',
        'I\'m often used in orchestras'
      ],
      funFact: 'The violin is the smallest and highest-pitched instrument in the string family!',
      image: '🎻'
    },
    {
      id: 4,
      name: 'Drums',
      clues: [
        'I\'m all about rhythm and beats',
        'I\'m played by hitting with sticks or hands',
        'I come in many sizes and shapes',
        'I\'m the backbone of most music bands'
      ],
      funFact: 'Drums are one of the oldest musical instruments, dating back thousands of years!',
      image: '🥁'
    },
    {
      id: 5,
      name: 'Flute',
      clues: [
        'I produce sound when you blow air across my opening',
        'I\'m made of metal or wood',
        'I don\'t have any strings or keys',
        'I\'m held horizontally to play'
      ],
      funFact: 'The flute is one of the oldest known musical instruments, with some dating back over 40,000 years!',
      image: '🪈'
    }
  ]);

  const [currentInstrumentIndex, setCurrentInstrumentIndex] = useState(0);
  const [showClue, setShowClue] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showFunFact, setShowFunFact] = useState(false);

  const currentInstrument = instruments[currentInstrumentIndex];

  const handleGuess = () => {
    if (!userGuess.trim()) return;

    setAttempts(prev => prev + 1);
    
    if (userGuess.toLowerCase() === currentInstrument.name.toLowerCase()) {
      setScore(prev => prev + (3 - showClue) * 10); // More points for fewer clues
      setFeedback(`🎉 Correct! It's a ${currentInstrument.name}!`);
      setGameStatus('won');
      setShowFunFact(true);
    } else {
      if (showClue < currentInstrument.clues.length - 1) {
        setShowClue(prev => prev + 1);
        setFeedback('❌ Not quite! Here\'s another clue:');
      } else {
        setFeedback(`❌ Game over! The answer was ${currentInstrument.name}.`);
        setGameStatus('lost');
        setShowFunFact(true);
      }
    }
    setUserGuess('');
  };

  const nextInstrument = () => {
    setCurrentInstrumentIndex((prev) => (prev + 1) % instruments.length);
    setShowClue(0);
    setUserGuess('');
    setFeedback('');
    setGameStatus('playing');
    setShowFunFact(false);
  };

  const useHint = () => {
    if (showClue < currentInstrument.clues.length - 1) {
      setShowClue(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setCurrentInstrumentIndex(0);
    setShowClue(0);
    setUserGuess('');
    setScore(0);
    setAttempts(0);
    setFeedback('');
    setGameStatus('playing');
    setShowFunFact(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-2xl backdrop-blur-sm bg-opacity-90 w-full max-w-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🎵 Guess the Instrument 🎵</h2>
        <div className="flex justify-center gap-6 text-white">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="text-sm">Score</div>
            <div className="text-xl font-bold">{score}</div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <div className="text-sm">Clues</div>
            <div className="text-xl font-bold">{showClue + 1}/4</div>
          </div>
        </div>
      </div>

      <div className="bg-white/20 rounded-xl p-6 mb-6">
        <div className="text-8xl text-center mb-6">{currentInstrument.image}</div>
        
        <div className="bg-white/30 rounded-lg p-4 mb-4 min-h-[80px] flex items-center justify-center">
          <p className="text-white text-lg text-center">
            {currentInstrument.clues[showClue]}
          </p>
        </div>

        {feedback && (
          <div className={`text-center p-3 rounded-lg mb-4 ${
            gameStatus === 'won' ? 'bg-green-500/30 text-white' : 
            gameStatus === 'lost' ? 'bg-red-500/30 text-white' : 'bg-blue-500/30 text-white'
          }`}>
            {feedback}
          </div>
        )}

        {showFunFact && (
          <div className="bg-yellow-500/30 text-white p-3 rounded-lg mb-4">
            <p className="font-semibold">💡 Fun Fact:</p>
            <p>{currentInstrument.funFact}</p>
          </div>
        )}

        {gameStatus === 'playing' && (
          <div className="space-y-4">
            <input
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              placeholder="Type your guess here..."
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-white"
              onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
            />
            <div className="flex gap-3">
              <button
                onClick={handleGuess}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Submit Guess
              </button>
              <button
                onClick={useHint}
                disabled={showClue >= currentInstrument.clues.length - 1}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  showClue >= currentInstrument.clues.length - 1
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:scale-105'
                }`}
              >
                💡 Hint
              </button>
            </div>
          </div>
        )}

        {(gameStatus === 'won' || gameStatus === 'lost') && (
          <button
            onClick={nextInstrument}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Next Instrument →
          </button>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={resetGame}
          className="text-white/80 hover:text-white underline text-sm"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default MusicGuessingGamePanel;