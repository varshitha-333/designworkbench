import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function Header({ currentTab, setCurrentTab }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Code logo & Title */}
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer group select-none"
              onClick={() => setCurrentTab('landing')}
            >
              <span className="text-lg font-bold text-blue-500 font-mono tracking-tighter group-hover:text-blue-400 transition-colors">{"</>"}</span>
              <span className="text-lg font-extrabold text-white tracking-tight group-hover:text-slate-200 transition-colors">
                DesignWorkBench
              </span>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setCurrentTab('dashboard')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                System Design
              </button>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  <span>Resources</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all shadow-md shadow-blue-500/10 active:scale-95 cursor-pointer"
            >
              Practice Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-4 space-y-1 bg-slate-950 border-b border-slate-900">
          <button
            onClick={() => {
              setCurrentTab('dashboard');
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900"
          >
            System Design
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900"
          >
            Resources
          </button>
          <div className="pt-4 border-t border-slate-900 px-4">
            <button
              onClick={() => {
                setCurrentTab('dashboard');
                setIsOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/10"
            >
              Practice Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
