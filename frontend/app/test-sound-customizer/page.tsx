'use client';

import RhythmBuilder from '@/components/RhythmBuilder';

export default function TestSoundCustomizer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-8">
          Interactive Music Tools
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <RhythmBuilder />
        </div>
      </div>
    </div>
  );
}