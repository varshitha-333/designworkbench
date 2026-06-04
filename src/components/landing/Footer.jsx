import React from 'react';
import { Database } from 'lucide-react';

export default function Footer({ setCurrentTab }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* Brand column */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentTab('landing')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">DesignWorkBench</span>
          </div>
          <p className="text-slate-400 max-w-xs leading-relaxed">
            The active learning sandbox for mastering system design architecture, algorithms visualizations, and mock interviews.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="hover:text-white transition-colors" title="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" title="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" title="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Product */}
        <div className="space-y-3 text-left">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Product</h4>
          <ul className="space-y-2">
            <li><button onClick={() => setCurrentTab('dashboard')} className="hover:text-white transition-colors">Problems List</button></li>
            <li><button onClick={() => setCurrentTab('mock_interviews')} className="hover:text-white transition-colors">Mock Pairing</button></li>
            <li><button onClick={() => setCurrentTab('knowledge_hub')} className="hover:text-white transition-colors">Knowledge Articles</button></li>
            <li><a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div className="space-y-3 text-left">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">System Design Guide</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Database Tuning</a></li>
            <li><a href="#" className="hover:text-white transition-colors">SQL Optimization</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog Hub</a></li>
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div className="space-y-3 text-left">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Security Details</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 mt-10 pt-6 text-center text-slate-600 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div>© {new Date().getFullYear()} DesignWorkBench. Built with React and Tailwind CSS. All rights reserved.</div>
        <div className="flex space-x-6 text-[11px]">
          <span>Made for technical preparation study</span>
        </div>
      </div>
    </footer>
  );
}
