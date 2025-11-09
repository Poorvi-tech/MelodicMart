'use client';

import { useState } from 'react';
import { Music, X } from 'lucide-react';
import Link from 'next/link';

export default function FloatingInteractiveButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 flex flex-col items-end gap-3">
          <Link 
            href="/explore" 
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>🎹</span>
            <span>Play Piano</span>
          </Link>
          <Link 
            href="/explore" 
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>🥁</span>
            <span>Rhythm Builder</span>
          </Link>
          <Link 
            href="/explore" 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>🎵</span>
            <span>Sound Visualizer</span>
          </Link>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all transform"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Music className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}