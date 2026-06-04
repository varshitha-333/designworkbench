import React, { useState } from 'react';
import { Sparkles, Network, Database as DbIcon, Server, Layers, HelpCircle } from 'lucide-react';

export default function LandingInteractiveDemo() {
  const [evaluating, setEvaluating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const runMockEval = () => {
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setShowFeedback(true);
    }, 1000);
  };

  return (
    <section className="py-12 bg-slate-950 flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Browser Mockup Shell (Screenshot 2) */}
        <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/5 max-w-6xl mx-auto w-full">
          
          {/* Top Browser Bar */}
          <div className="bg-[#080c14] border-b border-slate-900 px-4 py-3 flex items-center justify-between">
            {/* Window control dots */}
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Top center buttons */}
            <div className="flex items-center space-x-2.5">
              <button 
                onClick={runMockEval}
                disabled={evaluating}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-[11px] font-bold flex items-center space-x-1 shadow shadow-violet-500/10 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{evaluating ? 'Evaluating...' : 'Evaluate'}</span>
              </button>
              <button 
                onClick={() => setShowFeedback(!showFeedback)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
              >
                View Feedback
              </button>
            </div>
            
            {/* Empty space to align */}
            <div className="w-14" />
          </div>

          {/* Core Browser Panel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px] text-left">
            
            {/* 1. Left Nav Tabs inside browser (Col: 2/12) */}
            <div className="md:col-span-2 border-r border-slate-900/60 bg-[#090d16] p-3 flex flex-col space-y-2.5">
              {/* Logo icon inside tab */}
              <div className="text-blue-500 font-mono text-base font-extrabold px-3 py-1 mb-2">{"</>"}</div>
              
              {[
                { name: 'System Design', active: true },
                { name: 'Object Oriented Design', active: false },
                { name: 'DSA', active: false },
                { name: 'Agentic AI', active: false, badge: 'NEW' },
                { name: 'Mock Interview', active: false },
                { name: 'Courses', active: false }
              ].map((tab, idx) => (
                <div
                  key={idx}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-semibold transition-all relative ${
                    tab.active 
                      ? 'bg-violet-950/20 text-violet-400 border border-violet-500/20' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{tab.name}</span>
                  {tab.badge && (
                    <span className="text-[7px] font-bold bg-rose-600 text-white px-1 py-0.5 rounded leading-none">
                      {tab.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* 2. Chat Conversation (Col: 3/12) */}
            <div className="md:col-span-3 border-r border-slate-900/60 p-4 flex flex-col justify-between bg-[#0b0f19] space-y-4">
              <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[420px] pr-1">
                {/* Interviewer message */}
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-3 text-[10px] text-slate-300 leading-normal max-w-[90%] text-left">
                  <div className="font-bold text-slate-400 text-[9px] mb-1">Interviewer</div>
                  Welcome to the Interview. Can you design a file-sharing service like Dropbox?
                </div>

                {/* Candidate reply */}
                <div className="bg-blue-600/90 text-white rounded-2xl p-3 text-[10px] leading-normal max-w-[90%] text-left self-end ml-auto">
                  So what are the requirements?
                </div>

                {/* Interviewer requirements list */}
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-3 text-[10px] text-slate-300 leading-normal max-w-[90%] text-left">
                  <div className="font-bold text-slate-400 text-[9px] mb-1">Interviewer</div>
                  Sure, let's begin with a few requirements:
                  <ul className="mt-1 space-y-1 pl-2 text-slate-400">
                    <li>• Upload files from any device</li>
                    <li>• Auto-sync between devices</li>
                    <li>• Store files up to 1GB</li>
                    <li>• Share via public links</li>
                  </ul>
                </div>
              </div>

              {/* Chat Input stub */}
              <div className="border-t border-slate-900/60 pt-3 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono">Typing...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              </div>
            </div>

            {/* 3. Your Design Markdown Specs (Col: 3/12) */}
            <div className="md:col-span-3 border-r border-slate-900/60 p-4 bg-[#0b0f19] overflow-y-auto max-h-[460px] text-[10px] space-y-4">
              
              {/* Heading */}
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-bold text-slate-100 uppercase tracking-wide">Your Design</h4>
              </div>

              {/* Functional Requirements */}
              <div className="space-y-1 text-left">
                <h5 className="font-bold text-blue-400 uppercase tracking-wider text-[9px]">Functional Requirements</h5>
                <ul className="pl-2 space-y-0.5 text-slate-300 leading-relaxed">
                  <li>• Upload files up to 1GB</li>
                  <li>• Sync across devices</li>
                  <li>• Share via public links</li>
                </ul>
              </div>

              {/* Scale Estimates */}
              <div className="space-y-1 text-left">
                <h5 className="font-bold text-amber-500 uppercase tracking-wider text-[9px]">Scale Estimates</h5>
                <ul className="pl-2 space-y-0.5 text-slate-300 leading-relaxed font-mono">
                  <li>• 500M users, 100M DAU</li>
                  <li>• 10 files/user/day</li>
                  <li>• 5 PB storage</li>
                </ul>
              </div>

              {/* High-Level Design */}
              <div className="space-y-1 text-left">
                <h5 className="font-bold text-emerald-400 uppercase tracking-wider text-[9px]">High-Level Design</h5>
                <ul className="pl-2 space-y-0.5 text-slate-300 leading-relaxed">
                  <li>• CDN for static assets</li>
                  <li>• Chunked uploads</li>
                  <li>• Event-driven sync</li>
                </ul>
              </div>
            </div>

            {/* 4. Whiteboard Visual Diagram (Col: 4/12) */}
            <div className="md:col-span-4 p-4 bg-[#090d16] bg-dot-pattern flex flex-col justify-between relative overflow-hidden">
              
              {/* Optional Feedback overlay modal */}
              {showFeedback && (
                <div className="absolute inset-0 bg-slate-950/90 z-20 p-4 flex flex-col justify-between animate-fade-in text-[10px]">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <span className="font-bold text-slate-100">AI Evaluation Feedback</span>
                      <span className="font-extrabold text-emerald-400 text-sm">92/100</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      Excellent implementation! The integration of the **CDN** handles static file fetches effectively. Your **Message Queue** layer buffers database write traffic.
                    </p>
                    <ul className="text-slate-400 space-y-1 pl-2">
                      <li>✔ Caching layer shields database</li>
                      <li>✔ Decoupled writes using Kafka</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setShowFeedback(false)}
                    className="w-full py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all font-semibold"
                  >
                    Return to Canvas
                  </button>
                </div>
              )}

              {/* Diagram Node elements mapping layout */}
              <div className="flex-1 relative w-full h-[280px]">
                
                {/* SVG connection path lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Clients -> CDN */}
                  <line x1="50" y1="90" x2="110" y2="40" stroke="#22d3ee" strokeWidth="1.5" />
                  {/* Clients -> Load Balancer */}
                  <line x1="50" y1="90" x2="110" y2="120" stroke="#22d3ee" strokeWidth="1.5" />
                  {/* CDN -> S3 */}
                  <line x1="110" y1="40" x2="250" y2="40" stroke="#8b5cf6" strokeWidth="1.5" />
                  {/* Load Balancer -> API */}
                  <line x1="110" y1="120" x2="180" y2="120" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                  {/* API -> Cache */}
                  <line x1="180" y1="120" x2="250" y2="90" stroke="#3b82f6" strokeWidth="1.5" />
                  {/* API -> Message Queue */}
                  <line x1="180" y1="120" x2="110" y2="200" stroke="#8b5cf6" strokeWidth="1.5" />
                  {/* Message Queue -> Database */}
                  <line x1="110" y1="200" x2="180" y2="220" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
                  {/* API -> Database */}
                  <line x1="180" y1="120" x2="180" y2="220" stroke="#a78bfa" strokeWidth="1.5" />
                  {/* Database -> S3 */}
                  <line x1="180" y1="220" x2="250" y2="200" stroke="#ef4444" strokeWidth="1.5" />
                </svg>

                {/* Clients Node */}
                <div className="absolute top-[80px] left-[10px] flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Network className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 font-mono">Clients</span>
                </div>

                {/* CDN Node */}
                <div className="absolute top-[20px] left-[90px] flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 font-mono">CDN</span>
                </div>

                {/* Load Balancer Node */}
                <div className="absolute top-[100px] left-[90px] flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-violet-500/40 flex items-center justify-center text-violet-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 font-mono">LB</span>
                </div>

                {/* API Gateway Server */}
                <div className="absolute top-[100px] left-[165px] flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-indigo-400/40 flex items-center justify-center text-indigo-400 animate-pulse">
                    <Server className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 font-mono">API</span>
                </div>

                {/* Message Queue */}
                <div className="absolute top-[180px] left-[90px] flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-amber-500/40 flex items-center justify-center text-amber-500">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 font-mono">MQ</span>
                </div>

                {/* PostgreSQL Database */}
                <div className="absolute top-[200px] left-[165px] flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold font-mono text-[9px]">
                    DB
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 font-mono">Database</span>
                </div>

                {/* Redis Caching */}
                <div className="absolute top-[70px] left-[240px] flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <DbIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 font-mono">Cache</span>
                </div>

                {/* Object S3 Storage */}
                <div className="absolute top-[170px] left-[240px] flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <DbIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 font-mono">S3</span>
                </div>

              </div>

              {/* Bottom tag indicator */}
              <div className="flex justify-between items-center text-[8px] text-slate-600 border-t border-slate-900/60 pt-2 font-mono">
                <span>CANVAS GRID SIZE: 20x20</span>
                <span>STATUS: DRAFT</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

// Sliders icon placeholder since it wasn't imported from lucide
function Sliders(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}
