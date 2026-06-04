import React from 'react';

export default function FeaturesGrid({ setCurrentTab }) {
  const cards = [
    {
      title: "System Design",
      subtitle: "Design scalable systems like the pros",
      pill: "120+ Problems",
      pillClass: "bg-violet-950/40 text-violet-400 border border-violet-500/20",
      list: [
        "Interactive Whiteboard",
        "AI-Powered Evaluation",
        "High Quality Editorial Solutions",
        "AI Coaching"
      ],
      iconBg: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      topBorder: "border-t-2 border-t-violet-500",
      buttonText: "Start Designing",
      buttonClass: "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800",
      iconSvg: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      )
    },
    {
      title: "DS & Algorithms",
      subtitle: "Master coding with visual learning",
      pill: "300+ Problems",
      pillClass: "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20",
      list: [
        "Step-by-step Visualizations",
        "8 Programming Languages",
        "Real-time Test Cases",
        "Complexity Analysis"
      ],
      iconBg: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
      topBorder: "border-t-2 border-t-emerald-500",
      buttonText: "Start Coding",
      buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white shadow shadow-emerald-500/20",
      iconSvg: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-6v8m-4-8v8m8-8v8" />
        </svg>
      )
    },
    {
      title: "Object-Oriented Design",
      subtitle: "Design elegant class structures",
      pill: "70+ Problems",
      pillClass: "bg-amber-950/40 text-amber-500 border border-amber-500/20",
      list: [
        "UML Class Diagrams",
        "Design Pattern Practice",
        "AI Design Review",
        "Real-world Scenarios"
      ],
      iconBg: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      topBorder: "border-t-2 border-t-amber-500",
      buttonText: "Start Designing",
      buttonClass: "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800",
      iconSvg: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    {
      title: "Agentic AI",
      subtitle: "Design autonomous AI agents",
      pill: "18 Problems",
      pillClass: "bg-purple-950/40 text-purple-400 border border-purple-500/20",
      isNew: true,
      list: [
        "Agent Architecture Design",
        "Safety & Guardrails",
        "AI-Powered Evaluation",
        "Editorial Solutions"
      ],
      iconBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      topBorder: "border-t-2 border-t-purple-500",
      buttonText: "Start Designing",
      buttonClass: "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800",
      iconSvg: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Mock Interview",
      subtitle: "Practice with real engineers",
      pill: "Live Sessions",
      pillClass: "bg-pink-950/40 text-pink-400 border border-pink-500/20",
      isNew: true,
      list: [
        "Peer Matching System",
        "HD Video Calls",
        "Collaborative Whiteboard",
        "Instant Peer Feedback"
      ],
      iconBg: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
      topBorder: "border-t-2 border-t-pink-500",
      buttonText: "Find a Partner",
      buttonClass: "bg-pink-600 hover:bg-pink-500 text-white shadow shadow-pink-500/20",
      iconSvg: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 border-t border-slate-900 bg-slate-950 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper title indicator */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] sm:text-xs font-bold text-blue-500 uppercase tracking-widest block font-mono">
            EVERYTHING YOU NEED
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Everything You Need to Ace Your Interview
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            From system design to algorithms, we've got you covered with interactive practice and real-time feedback
          </p>
        </div>

        {/* 3-Column Grid for main tiers (System Design, DSA, OOD) */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-6">
          {cards.slice(0, 3).map((card, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl p-6 bg-[#0b0f19] border border-slate-900 relative flex flex-col justify-between min-h-[380px] shadow-lg ${card.topBorder}`}
            >
              <div className="space-y-4">
                {/* Icon Circle */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  {card.iconSvg}
                </div>
                {/* Headings */}
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-slate-400 text-[11px] font-medium leading-tight min-h-[24px]">{card.subtitle}</p>
                </div>
                {/* Pill count */}
                <div className="inline-block">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${card.pillClass}`}>
                    {card.pill}
                  </span>
                </div>
                {/* Feature checklist */}
                <ul className="space-y-2 pt-2 text-[10px] text-slate-300">
                  {card.list.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full bg-slate-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-98 cursor-pointer ${card.buttonClass}`}
              >
                <span>{card.buttonText}</span>
                <span className="font-mono text-sm leading-none">→</span>
              </button>
            </div>
          ))}
        </div>

        {/* 2-Column Centered Grid for new features (Agentic AI, Mock Interview) */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {cards.slice(3).map((card, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl p-6 bg-[#0b0f19] border border-slate-900 relative flex flex-col justify-between min-h-[380px] shadow-lg ${card.topBorder}`}
            >
              {/* New red indicator tag (Screenshot 5) */}
              {card.isNew && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-rose-600 text-white text-[7px] font-extrabold uppercase tracking-wide">
                  NEW
                </span>
              )}

              <div className="space-y-4">
                {/* Icon Circle */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  {card.iconSvg}
                </div>
                {/* Headings */}
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-slate-400 text-[11px] font-medium leading-tight min-h-[24px]">{card.subtitle}</p>
                </div>
                {/* Pill count */}
                <div className="inline-block">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${card.pillClass}`}>
                    {card.pill}
                  </span>
                </div>
                {/* Feature checklist */}
                <ul className="space-y-2 pt-2 text-[10px] text-slate-300">
                  {card.list.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full bg-slate-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-98 cursor-pointer ${card.buttonClass}`}
              >
                <span>{card.buttonText}</span>
                <span className="font-mono text-sm leading-none">→</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
