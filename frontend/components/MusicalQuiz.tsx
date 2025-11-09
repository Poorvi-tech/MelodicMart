'use client';

import { useState, useEffect } from 'react';
import { Trophy, Music, RotateCcw, Star, CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  emoji: string;
  funFact: string;
}

export default function MusicalQuiz() {
  const [questions] = useState<Question[]>([
    {
      id: 1,
      question: "Which instrument has 88 keys?",
      options: ["Guitar", "Piano", "Violin", "Flute"],
      correctAnswer: "Piano",
      emoji: "🎹",
      funFact: "A standard piano has 52 white keys and 36 black keys, totaling 88 keys!"
    },
    {
      id: 2,
      question: "Which instrument do you blow into to play?",
      options: ["Drum", "Guitar", "Trumpet", "Violin"],
      correctAnswer: "Trumpet",
      emoji: "🎺",
      funFact: "Brass instruments like trumpets make sound when you buzz your lips into a mouthpiece!"
    },
    {
      id: 3,
      question: "Which instrument is played with drumsticks?",
      options: ["Piano", "Guitar", "Drum Set", "Flute"],
      correctAnswer: "Drum Set",
      emoji: "🥁",
      funFact: "The snare drum gets its name from the snares (wires) stretched across the bottom head!"
    },
    {
      id: 4,
      question: "Which instrument is known as the 'King of Instruments'?",
      options: ["Violin", "Organ", "Piano", "Guitar"],
      correctAnswer: "Organ",
      emoji: "🎼",
      funFact: "The pipe organ is called the 'King of Instruments' because of its large size and ability to produce a wide range of sounds!"
    },
    {
      id: 5,
      question: "Which instrument has 6 strings?",
      options: ["Violin", "Guitar", "Cello", "Banjo"],
      correctAnswer: "Guitar",
      emoji: "🎸",
      funFact: "The guitar is one of the most popular instruments in the world, with over 50 million players!"
    }
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent changing answer after selection
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    // Show fun fact after 1.5 seconds
    setTimeout(() => {
      setShowFunFact(true);
    }, 1500);
    
    // Move to next question or finish quiz
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        moveToNextQuestion();
      } else {
        setQuizCompleted(true);
      }
    }, 4000);
  };

  const moveToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowFunFact(false);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setQuizCompleted(false);
    setShowFunFact(false);
  };

  if (quizCompleted) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-xl border border-purple-200 max-w-md mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="font-bold text-purple-900 text-2xl mb-2">Quiz Completed!</h3>
          <p className="text-purple-700 mb-4">Great job! You've finished the musical quiz.</p>
          
          <div className="bg-white rounded-xl p-4 mb-6 border border-purple-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold text-purple-900">Your Score</span>
            </div>
            <div className="text-3xl font-bold text-purple-700">
              {score}<span className="text-lg">/{questions.length}</span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-purple-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full" 
                  style={{ width: `${(score / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <button
            onClick={resetQuiz}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-xl border border-purple-200 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-purple-900 flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-600" />
          Musical Quiz
        </h3>
        <div className="flex items-center gap-2">
          <span className="bg-purple-500 text-white text-sm font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            {score}
          </span>
          <button 
            onClick={resetQuiz}
            className="text-purple-600 hover:text-purple-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-purple-700 mb-1">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(((currentQuestionIndex) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-purple-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Question */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-3 animate-bounce">
          {currentQuestion.emoji}
        </div>
        <h4 className="text-lg font-bold text-purple-900 mb-4">
          {currentQuestion.question}
        </h4>
      </div>
      
      {/* Options */}
      <div className="space-y-3 mb-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
            className={`w-full py-3 px-4 rounded-xl font-medium text-left transition-all ${
              selectedAnswer === option
                ? isCorrect
                  ? 'bg-green-100 border-2 border-green-500 text-green-800'
                  : 'bg-red-100 border-2 border-red-500 text-red-800'
                : !selectedAnswer
                  ? 'bg-white text-purple-800 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md'
                  : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
            } ${selectedAnswer === option && isCorrect ? 'animate-pulse' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {/* Result */}
      {showResult && (
        <div className={`p-4 rounded-xl mb-4 text-center animate-fadeIn ${
          isCorrect 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            {isCorrect ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="font-bold">Correct! 🎉</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="font-bold">Oops! 😅</span>
              </>
            )}
          </div>
          {!isCorrect && (
            <p className="text-sm">
              The correct answer is: <span className="font-bold">{currentQuestion.correctAnswer}</span>
            </p>
          )}
        </div>
      )}
      
      {/* Fun Fact */}
      {showFunFact && (
        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 animate-fadeIn">
          <p className="text-yellow-800 text-sm">
            <span className="font-bold">Fun Fact: </span>
            {currentQuestion.funFact}
          </p>
        </div>
      )}
      
      {/* Fun message */}
      <div className="mt-4 text-center">
        <p className="text-xs text-purple-600">
          🎵 Test your musical knowledge! 🎵
        </p>
      </div>
    </div>
  );
}