import React from 'react';
import { MessageSquare, Sliders } from 'lucide-react';

export default function HeroSection({ setCurrentTab }) {
  return (
    <div className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-16 text-left">
      {/* Background neon light glow on the top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-900/5 blur-[120px] pointer-events-none animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Main Hero Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Master System <br />
            Design Interviews <br />
            Through Active <br />
            Practice
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-400 mb-8 leading-relaxed max-w-xl">
            Passively learning system design does not work. Now you can practice system design problems like the way you practice data structure and algorithms on Leetcode.
          </p>

          {/* Button */}
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-lg text-xs sm:text-sm tracking-wide transition-all active:scale-95 shadow-md shadow-white/5 cursor-pointer"
          >
            Get Started Now
          </button>
        </div>
      </div>

      {/* Floating Sticky Indicator widgets on bottom-left (Screenshot 1) */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col space-y-3">
        <button 
          onClick={() => setCurrentTab('dashboard')}
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 hover:scale-105 cursor-pointer"
          title="Tuning Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setCurrentTab('dashboard')}
          className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 hover:scale-105 cursor-pointer"
          title="Chat Helper"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
