'use client';

import { useState, useEffect } from 'react';
import { Trophy, Music, RotateCcw, Star, CheckCircle, XCircle } from 'lucide-react';

interface Instrument {
  id: number;
  name: string;
  emoji: string;
  sound: string;
  hint: string;
}

export default function MusicGuessingGame() {
  const [instruments] = useState<Instrument[]>([
    { id: 1, name: 'Guitar', emoji: '🎸', sound: 'Strumming', hint: 'Has 6 strings and is played with fingers or a pick' },
    { id: 2, name: 'Piano', emoji: '🎹', sound: 'Melodious', hint: 'Has 88 keys and is played with both hands' },
    { id: 3, name: 'Drum', emoji: '🥁', sound: 'Percussion', hint: 'Played with sticks and has a deep bass sound' },
    { id: 4, name: 'Flute', emoji: '🪈', sound: 'Whistling', hint: 'A woodwind instrument played by blowing air' },
    { id: 5, name: 'Violin', emoji: '🎻', sound: 'Classical', hint: 'Has 4 strings and is played with a bow' },
    { id: 6, name: 'Trumpet', emoji: '🎺', sound: 'Brass', hint: 'A brass instrument that is played by buzzing lips' },
    { id: 7, name: 'Saxophone', emoji: '🎷', sound: 'Jazzy', hint: 'A curved brass instrument with a reed' },
    { id: 8, name: 'Harmonica', emoji: 'GLIGENCE', sound: 'Bluesy', hint: 'A small instrument played by blowing air through holes' }
  ]);

  const [currentInstrument, setCurrentInstrument] = useState<Instrument | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{message: string, correct: boolean} | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Initialize game
  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    setFeedback(null);
    setShowHint(false);
    
    // Select random instrument
    const randomIndex = Math.floor(Math.random() * instruments.length);
    const selectedInstrument = instruments[randomIndex];
    setCurrentInstrument(selectedInstrument);
    
    // Create options (1 correct + 3 random incorrect)
    const correctAnswer = selectedInstrument.name;
    const otherInstruments = instruments.filter(inst => inst.id !== selectedInstrument.id);
    
    // Shuffle and pick 3 random incorrect options
    const shuffled = [...otherInstruments].sort(() => 0.5 - Math.random());
    const incorrectOptions = shuffled.slice(0, 3).map(inst => inst.name);
    
    // Combine and shuffle all options
    const allOptions = [correctAnswer, ...incorrectOptions].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const handleAnswer = (answer: string) => {
    if (!currentInstrument || feedback) return;
    
    const isCorrect = answer === currentInstrument.name;
    
    if (isCorrect) {
      setScore(prev => prev + 10 + streak); // Bonus points for streak
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
        return newStreak;
      });
      setFeedback({ message: '🎉 Correct! Well done!', correct: true });
    } else {
      setStreak(0);
      setFeedback({ message: `Oops! It was ${currentInstrument.name}`, correct: false });
    }
    
    // Move to next round after delay
    setTimeout(() => {
      startNewRound();
    }, 2000);
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setShowHint(false);
    startNewRound();
  };

  if (!currentInstrument) return null;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-xl border border-yellow-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-orange-800 flex items-center gap-2 text-xl">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Guess the Instrument!
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-bold text-orange-700">{score}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">🔥 {streak}</span>
          </div>
          <button 
            onClick={resetGame}
            className="text-orange-600 hover:text-orange-800 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <p className="text-orange-700 mb-6 text-center">
        Test your musical knowledge! Guess which instrument makes each sound.
      </p>
      
      {/* Instrument display */}
      <div className="text-center mb-8">
        <div className="text-8xl mb-4 animate-bounce-slow">
          {currentInstrument.emoji}
        </div>
        <p className="text-orange-700 font-medium text-lg">
          What instrument makes this sound?
        </p>
        <p className="text-2xl font-bold text-orange-900 mt-2">
          "{currentInstrument.sound}"
        </p>
      </div>
      
      {/* Options */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={!!feedback}
            className={`py-4 px-3 rounded-xl font-bold transition-all transform hover:scale-105 disabled:cursor-not-allowed ${
              feedback 
                ? option === currentInstrument.name
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
                : 'bg-white text-orange-800 border-2 border-orange-200 hover:border-orange-400 hover:shadow-md'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {/* Hint button */}
      <div className="mb-6">
        <button
          onClick={() => setShowHint(!showHint)}
          disabled={!!feedback}
          className="w-full py-3 text-orange-700 font-bold rounded-lg bg-orange-100 hover:bg-orange-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {showHint ? 'Hide Hint' : 'Show Hint'} 🤔
        </button>
        
        {showHint && (
          <div className="mt-3 p-4 bg-yellow-100 rounded-lg border border-yellow-200 animate-fadeIn">
            <p className="text-yellow-800">{currentInstrument.hint}</p>
          </div>
        )}
      </div>
      
      {/* Feedback */}
      {feedback && (
        <div className={`p-4 rounded-lg text-center font-bold animate-fadeIn mb-4 ${
          feedback.correct 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            {feedback.correct ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          {feedback.correct && streak > 1 && (
            <p className="text-sm mt-1">🔥 {streak} in a row! +{streak} bonus points</p>
          )}
        </div>
      )}
      
      {/* Stats */}
      <div className="flex justify-between text-sm text-orange-600">
        <div>
          Best Streak: <span className="font-bold">{bestStreak}</span>
        </div>
        <div>
          Questions: <span className="font-bold">{Math.floor(score / 10) + (streak > 0 ? 1 : 0)}</span>
        </div>
      </div>
      
      {/* Fun message */}
      <div className="mt-4 text-center">
        <p className="text-xs text-orange-600">
          🎵 Test your musical knowledge! 🎵
        </p>
      </div>
    </div>
  );
}