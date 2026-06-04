import React from 'react';

export default function SidebarNavigation({ activeCategory, setActiveCategory, currentTab, setCurrentTab }) {
  const menuItems = [
    {
      id: 'system_design',
      name: 'System Design',
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Hierarchy chart: 1 box top, 2 boxes bottom */}
          <rect x="9" y="3" width="6" height="5" rx="1" />
          <rect x="3" y="15" width="6" height="5" rx="1" />
          <rect x="15" y="15" width="6" height="5" rx="1" />
          <path d="M12 8v4M6 12h12M6 12v3M18 12v3" />
        </svg>
      )
    },
    {
      id: 'ood',
      name: 'Object Oriented Design',
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Grid layout with diamond at top right */}
          <rect x="4" y="12" width="6" height="6" rx="1" />
          <rect x="12" y="12" width="6" height="6" rx="1" />
          <rect x="4" y="4" width="6" height="6" rx="1" />
          {/* Rotated diamond box top-right */}
          <rect x="14" y="4" width="4" height="4" rx="0.5" transform="rotate(45 16 6)" />
        </svg>
      )
    },
    {
      id: 'dsa',
      name: 'DS & Algorithms',
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      )
    },
    {
      id: 'agentic_ai',
      name: 'Agentic AI',
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Robot face icon */}
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="8" cy="16" r="1.5" />
          <circle cx="16" cy="16" r="1.5" />
          <path d="M9 7h6M12 3v4M8 7V5M16 7V5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'mock',
      name: 'Mock Interview',
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Peer group icon */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 21c-2.913 0-5.585-.849-7.833-2.316a4.125 4.125 0 017.533-2.493M15 9a3 3 0 11-6 0 3 3 0 016 0zm6 2.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      )
    },
    {
      id: 'courses',
      name: 'Courses & Hub',
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {/* Graduation cap */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147L12 4.26l7.74 5.887M12 4.26v15M4.26 10.147a60.436 60.436 0 000 3.706c0 1.954 1.343 3.655 3.238 4.025a59.68 59.68 0 008.004 0c1.895-.37 3.238-2.071 3.238-4.025a60.436 60.436 0 000-3.706m-15.48 0L12 14.26l7.74-4.113" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-16 bg-[#090D16] border-r border-slate-900/60 h-screen fixed top-0 left-0 z-30 flex flex-col justify-between items-center pb-6">
      
      {/* Top Brand Logo with solid purple background block */}
      <div className="w-full flex flex-col items-center">
        <div 
          onClick={() => setCurrentTab('landing')}
          className="w-full h-16 bg-fuchsia-600/90 flex items-center justify-center cursor-pointer hover:bg-fuchsia-500 transition-colors select-none"
        >
          <span className="text-xl font-extrabold text-blue-400 font-mono tracking-tighter">{"</>"}</span>
        </div>

        {/* Collapsed Menu Icon list */}
        <div className="flex flex-col space-y-4 mt-8 w-full px-2">
          {menuItems.map((item) => {
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveCategory(item.id);
                  setCurrentTab('workspace'); // Send them directly to workspace on tab change
                }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-slate-900 text-blue-500 border border-slate-800' 
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
                title={item.name}
              >
                {item.svg}
              </button>
            );
          })}
        </div>
      </div>

      {/* User profile avatar initials badge at bottom */}
      <div 
        onClick={() => setCurrentTab('dashboard')}
        className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md cursor-pointer hover:scale-105 transition-all"
        title="Explore dashboard"
      >
        V
      </div>

    </aside>
  );
}
