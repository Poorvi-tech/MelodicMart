'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import PianoKeyboard from '@/components/PianoKeyboard';
import SoundVisualizerPanel from '@/components/SoundVisualizerPanel';
import InstrumentShowcasePanel from '@/components/InstrumentShowcasePanel';
import MusicVisualizerPanel from '@/components/MusicVisualizerPanel';
import MusicGuessingGamePanel from '@/components/MusicGuessingGamePanel';
import RhythmBuilder from '@/components/RhythmBuilder';
import InstrumentShowcase from '@/components/InstrumentShowcase';
import SoundWaveAnimation from '@/components/SoundWaveAnimation';
import MusicalQuiz from '@/components/MusicalQuiz';
import MusicGuessingGame from '@/components/MusicGuessingGame';

export default function ExplorePage() {
  const [activeComponent, setActiveComponent] = useState<'keyboard' | 'sound' | 'showcase' | 'visualizer' | 'guessing' | 'rhythm' | 'instrument' | 'wave' | 'quiz' | 'game' | null>(null);

  const closeComponent = () => {
    setActiveComponent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">Interactive Music Experience</h1>
          <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
            Explore our interactive music tools. Play with the piano, visualize sound waves, 
            discover featured instruments, enjoy the music visualizer, and play guessing games.
          </p>
        </div>

        {/* Component Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-indigo-200">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">Choose an Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <button
              onClick={() => setActiveComponent('keyboard')}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                activeComponent === 'keyboard'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <div className="text-4xl mb-3">🎹</div>
              <h3 className="font-bold text-lg">Play Piano</h3>
              <p className="text-sm mt-1">Interactive keyboard</p>
            </button>

            <button
              onClick={() => setActiveComponent('sound')}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                activeComponent === 'sound'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-800 text-white shadow-lg'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <div className="text-4xl mb-3">🎵</div>
              <h3 className="font-bold text-lg">Sound Visualizer</h3>
              <p className="text-sm mt-1">Visualize audio waves</p>
            </button>

            <button
              onClick={() => setActiveComponent('showcase')}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                activeComponent === 'showcase'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <div className="text-4xl mb-3">🎸</div>
              <h3 className="font-bold text-lg">Instrument Showcase</h3>
              <p className="text-sm mt-1">Featured instruments</p>
            </button>

            <button
              onClick={() => setActiveComponent('visualizer')}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                activeComponent === 'visualizer'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <div className="text-4xl mb-3">🎼</div>
              <h3 className="font-bold text-lg">Music Visualizer</h3>
              <p className="text-sm mt-1">Animated music display</p>
            </button>
            
            <button
              onClick={() => setActiveComponent('guessing')}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                activeComponent === 'guessing'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <div className="text-4xl mb-3">🎲</div>
              <h3 className="font-bold text-lg">Guess the Instrument</h3>
              <p className="text-sm mt-1">Fun guessing game</p>
            </button>
            
            <button
              onClick={() => setActiveComponent('rhythm')}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                activeComponent === 'rhythm'
                  ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <div className="text-4xl mb-3">🥁</div>
              <h3 className="font-bold text-lg">Rhythm Builder</h3>
              <p className="text-sm mt-1">Create your own beats</p>
            </button>
            
            <button
              onClick={() => setActiveComponent('instrument')}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                activeComponent === 'instrument'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-lg">3D Showcase</h3>
              <p className="text-sm mt-1">Interactive display</p>
            </button>
            
            <button
              onClick={() => setActiveComponent('wave')}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                activeComponent === 'wave'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <div className="text-4xl mb-3">🌊</div>
              <h3 className="font-bold text-lg">Sound Waves</h3>
              <p className="text-sm mt-1">Animated visualization</p>
            </button>
            
            <button
              onClick={() => setActiveComponent('quiz')}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                activeComponent === 'quiz'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-bold text-lg">Music Quiz</h3>
              <p className="text-sm mt-1">Test your knowledge</p>
            </button>
            
            <button
              onClick={() => setActiveComponent('game')}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                activeComponent === 'game'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-lg">Guessing Game</h3>
              <p className="text-sm mt-1">Challenge yourself</p>
            </button>
          </div>
        </div>

        {/* Active Component Display - Larger and with Close Button */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-200 min-h-[500px] flex items-center justify-center relative">
          {/* Close Button */}
          {activeComponent && (
            <button
              onClick={closeComponent}
              className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {activeComponent === 'keyboard' && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Play Piano</h3>
              <div className="flex justify-center w-full max-w-4xl">
                <PianoKeyboard />
              </div>
              <div className="mt-10 text-center text-indigo-700 max-w-3xl">
                <p className="mb-3 text-lg">Use your keyboard keys (A-K) or click on the piano keys to play notes</p>
                <p className="text-lg">Each key produces a different musical note</p>
              </div>
            </div>
          )}

          {activeComponent === 'sound' && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Sound Visualizer</h3>
              <div className="flex justify-center w-full">
                <SoundVisualizerPanel />
              </div>
              <div className="mt-10 text-center text-indigo-700 max-w-3xl">
                <p className="mb-3 text-lg">Click the Play button or frequency buttons to generate sound</p>
                <p className="text-lg">Adjust the volume slider to control the sound intensity</p>
              </div>
            </div>
          )}

          {activeComponent === 'showcase' && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Instrument Showcase</h3>
              <div className="flex justify-center w-full">
                <InstrumentShowcasePanel />
              </div>
              <div className="mt-10 text-center text-indigo-700 max-w-3xl">
                <p className="mb-3 text-lg">Click the Play/Pause button to control the rotation</p>
                <p className="text-lg">Use the navigation buttons to browse featured instruments</p>
              </div>
            </div>
          )}

          {activeComponent === 'visualizer' && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Music Visualizer</h3>
              <div className="flex justify-center w-full">
                <MusicVisualizerPanel />
              </div>
              <div className="mt-10 text-center text-indigo-700 max-w-3xl">
                <p className="mb-3 text-lg">Click the Play button to start the music visualization</p>
                <p className="text-lg">Watch the animated bars and floating notes respond to the music</p>
              </div>
            </div>
          )}
          
          {activeComponent === 'guessing' && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Guess the Instrument</h3>
              <div className="flex justify-center w-full">
                <MusicGuessingGamePanel />
              </div>
              <div className="mt-10 text-center text-indigo-700 max-w-3xl">
                <p className="mb-3 text-lg">Read the description and guess which musical instrument it is</p>
                <p className="text-lg">Use the hint button if you need help, and try to get the highest score!</p>
              </div>
            </div>
          )}
          
          {activeComponent === 'rhythm' && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Rhythm Builder</h3>
              <div className="flex justify-center w-full max-w-2xl">
                <RhythmBuilder />
              </div>
              <div className="mt-10 text-center text-indigo-700 max-w-3xl">
                <p className="mb-3 text-lg">Create your own rhythm by adding beats with different instruments</p>
                <p className="text-lg">Adjust the tempo and play your custom rhythm!</p>
              </div>
            </div>
          )}
          
          {activeComponent === 'instrument' && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-3xl font-bold text-indigo-900 mb-8 text-center">3D Instrument Showcase</h3>
              <div className="flex justify-center w-full max-w-md">
                <InstrumentShowcase />
              </div>
              <div className="mt-10 text-center text-indigo-700 max-w-3xl">
                <p className="mb-3 text-lg">Explore featured instruments in our interactive 3D showcase</p>
                <p className="text-lg">Use the controls to rotate and explore different instruments</p>
              </div>
            </div>
          )}
          
          {activeComponent === 'wave' && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Sound Wave Animation</h3>
              <div className="flex justify-center w-full max-w-md">
                <SoundWaveAnimation />
              </div>
              <div className="mt-10 text-center text-indigo-700 max-w-3xl">
                <p className="mb-3 text-lg">See sound come to life with animated waves</p>
                <p className="text-lg">Click start to visualize sound waves in motion</p>
              </div>
            </div>
          )}
          
          {activeComponent === 'quiz' && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Musical Knowledge Quiz</h3>
              <div className="flex justify-center w-full max-w-md">
                <MusicalQuiz />
              </div>
              <div className="mt-10 text-center text-indigo-700 max-w-3xl">
                <p className="mb-3 text-lg">Test your musical knowledge with our fun quiz</p>
                <p className="text-lg">Answer questions about instruments and music theory</p>
              </div>
            </div>
          )}
          
          {activeComponent === 'game' && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Music Guessing Game</h3>
              <div className="flex justify-center w-full max-w-md">
                <MusicGuessingGame />
              </div>
              <div className="mt-10 text-center text-indigo-700 max-w-3xl">
                <p className="mb-3 text-lg">Guess instruments based on their sounds and descriptions</p>
                <p className="text-lg">Build your streak and earn bonus points!</p>
              </div>
            </div>
          )}

          {!activeComponent && (
            <div className="text-center py-16">
              <div className="text-7xl mb-8">🎵</div>
              <h3 className="text-3xl font-bold text-indigo-900 mb-6">Welcome to the Music Experience</h3>
              <p className="text-indigo-700 max-w-3xl mx-auto text-lg">
                Select an interactive experience from above to get started. 
                Play with our piano, visualize sound waves, explore featured instruments, 
                enjoy animated music visualizations, and play fun guessing games.
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">How to Use</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Select an experience from the options above</li>
            <li>Click the Play button to start the interactive experience</li>
            <li>Use controls to adjust volume, change instruments, or navigate</li>
            <li>Click the X button to close the active component and return to the selection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}