import React from 'react';
import { Trophy, Award, Flame, Target, Zap, ShieldCheck, Sparkles, Brain } from 'lucide-react';

const mockRankings = [
  { rank: 1, name: 'Siddharth M.', points: '14,850 XP', mocks: 48, streak: 35, company: 'Google L6', avatar: 'SM', type: 'user' },
  { rank: 2, name: 'Google L6 Bot', points: '13,500 XP', mocks: 99, streak: 100, company: 'AI Benchmark', avatar: '🤖', type: 'bot' },
  { rank: 3, name: 'Jessica K.', points: '12,900 XP', mocks: 39, streak: 21, company: 'Meta E5', avatar: 'JK', type: 'user' },
  { rank: 4, name: 'Chen W.', points: '11,400 XP', mocks: 32, streak: 18, company: 'Netflix Senior', avatar: 'CW', type: 'user' },
  { rank: 5, name: 'Stripe Staff Bot', points: '10,200 XP', mocks: 99, streak: 100, company: 'AI Benchmark', avatar: '🤖', type: 'bot' },
  { rank: 6, name: 'Emily L.', points: '9,800 XP', mocks: 28, streak: 12, company: 'Stripe Staff', avatar: 'EL', type: 'user' },
  { rank: 7, name: 'Alex S.', points: '9,250 XP', mocks: 27, streak: 14, company: 'Amazon L5', avatar: 'AS', type: 'user' },
  { rank: 8, name: 'Meta E5 Bot', points: '8,900 XP', mocks: 99, streak: 100, company: 'AI Benchmark', avatar: '🤖', type: 'bot' }
];

export default function Leaderboard({ sidebarComponent }) {
  const currentUser = {
    rank: 42,
    name: 'Varshi (You)',
    points: '1,420 XP',
    mocks: 3,
    streak: 5,
    company: 'Preparing',
    avatar: 'V',
    type: 'user'
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      
      {/* Sidebar navigation */}
      {sidebarComponent}

      {/* Main viewport */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 max-w-7xl mx-auto w-full lg:pl-20">
        
        <div className="text-left space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
              <span>Global Rankings</span>
              <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
            </h1>
            <p className="text-slate-400 text-xs mt-1">Compare your AI Coach scoring metrics and preparation streak against peers and benchmark bots.</p>
          </div>

          {/* Top 3 Podiums visual grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl">
            
            {/* 2nd place */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center justify-between min-h-[160px] order-2 md:order-1 relative overflow-hidden">
              <span className="absolute top-2 left-2 text-[10px] text-slate-500 font-mono">#2</span>
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-400 font-bold text-white text-sm">JK</div>
              <div>
                <div className="text-xs font-bold text-slate-200 mt-2">Jessica K.</div>
                <div className="text-[10px] text-slate-500">{mockRankings[1].company}</div>
              </div>
              <span className="mt-3 px-3 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-violet-400 font-bold">{mockRankings[1].points}</span>
            </div>

            {/* 1st place */}
            <div className="p-6 rounded-2xl bg-slate-900 border-2 border-violet-500 text-center flex flex-col items-center justify-between min-h-[190px] order-1 md:order-2 relative overflow-hidden shadow-lg shadow-violet-500/5">
              <span className="absolute top-2 left-2 text-[10px] text-violet-400 font-mono font-bold">#1</span>
              <Trophy className="w-5 h-5 text-amber-500 absolute top-2 right-2 animate-bounce" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center border-2 border-amber-500 font-bold text-white text-base">SM</div>
              <div>
                <div className="text-sm font-bold text-slate-100 mt-2">Siddharth M.</div>
                <div className="text-[10px] text-slate-500">{mockRankings[0].company}</div>
              </div>
              <span className="mt-3 px-4 py-1.5 rounded bg-slate-950 border border-violet-500/40 text-sm text-violet-400 font-black">{mockRankings[0].points}</span>
            </div>

            {/* 3rd place */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center justify-between min-h-[160px] order-3 md:order-3 relative overflow-hidden">
              <span className="absolute top-2 left-2 text-[10px] text-slate-500 font-mono">#3</span>
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border-2 border-amber-800 font-bold text-white text-sm">CW</div>
              <div>
                <div className="text-xs font-bold text-slate-200 mt-2">Chen W.</div>
                <div className="text-[10px] text-slate-500">{mockRankings[2].company}</div>
              </div>
              <span className="mt-3 px-3 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-violet-400 font-bold">{mockRankings[2].points}</span>
            </div>
          </div>

                   {/* Rankings grid + AI weights columns */}
          <div className="flex flex-col lg:flex-row gap-6 items-start max-w-7xl">
            
            {/* Rankings list table (70%) */}
            <div className="w-full lg:w-2/3 bg-slate-900/20 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
                      <th className="py-4 px-6 text-center w-16">Rank</th>
                      <th className="py-4 px-4">User / Bot</th>
                      <th className="py-4 px-4">Points</th>
                      <th className="py-4 px-4 text-center">Mocks Done</th>
                      <th className="py-4 px-4 text-center">Streak</th>
                      <th className="py-4 px-6 text-right">Badges</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {/* Map ranking lists */}
                    {mockRankings.map((user) => (
                      <tr key={user.rank} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-4 px-6 text-center text-slate-400 font-bold font-mono">
                          {user.rank}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              user.type === 'bot' ? 'bg-violet-950 border border-violet-500 text-violet-400 animate-pulse' : 'bg-slate-800 text-slate-350'
                            }`}>
                              {user.avatar}
                            </div>
                            <div>
                              <span className="text-slate-200 font-bold text-sm flex items-center space-x-1.5">
                                <span>{user.name}</span>
                                {user.type === 'bot' && (
                                  <span className="text-[8px] bg-violet-500/20 text-violet-400 font-bold font-mono uppercase px-1.5 py-0.5 rounded tracking-wide border border-violet-500/20">Benchmark</span>
                                )}
                              </span>
                              <div className="text-[10px] text-slate-500">{user.company}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-violet-400 text-xs font-bold font-mono">
                          {user.points}
                        </td>
                        <td className="py-4 px-4 text-center text-slate-400 text-xs font-mono">
                          {user.mocks}
                        </td>
                        <td className="py-4 px-4 text-center text-amber-500 text-xs font-mono">
                          <div className="flex items-center justify-center space-x-1">
                            <Flame className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{user.streak}d</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {user.type === 'bot' ? (
                              <ShieldCheck className="w-4 h-4 text-violet-400" title="Reference Grading Bot" />
                            ) : (
                              <>
                                <Award className="w-4 h-4 text-violet-400" title="Architect Master" />
                                <ShieldCheck className="w-4 h-4 text-emerald-400" title="Verified Pro" />
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Divider line for user rank */}
                    <tr className="bg-slate-950">
                      <td colSpan="6" className="py-2 px-6 text-center text-[10px] text-slate-600 font-mono">
                        •••••• SPANNING DOWN TO YOUR RANKING ••••••
                      </td>
                    </tr>

                    {/* Current User Row highlighted */}
                    <tr className="bg-violet-950/20 border-2 border-violet-500/40">
                      <td className="py-4 px-6 text-center text-violet-400 font-bold font-mono">
                        {currentUser.rank}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center font-bold text-xs text-white">
                            {currentUser.avatar}
                          </div>
                          <div>
                            <span className="text-violet-400 font-black text-sm">{currentUser.name}</span>
                            <div className="text-[10px] text-slate-500">{currentUser.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-violet-400 text-xs font-extrabold font-mono">
                        {currentUser.points}
                      </td>
                      <td className="py-4 px-4 text-center text-slate-300 text-xs font-mono">
                        {currentUser.mocks}
                      </td>
                      <td className="py-4 px-4 text-center text-amber-500 text-xs font-mono">
                        <div className="flex items-center justify-center space-x-1">
                          <Flame className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{currentUser.streak}d</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Award className="w-4 h-4 text-violet-400/80" title="Level 4 Practitioner" />
                        </div>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Grading Criteria Panel (30%) */}
            <div className="w-full lg:w-1/3 space-y-4">
              
              <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-850 space-y-4 shadow-xl">
                <div className="flex items-center space-x-2 text-violet-400 font-bold">
                  <Brain className="w-5 h-5 animate-pulse" />
                  <h4 className="text-xs uppercase tracking-wider font-mono">AI Coach Grading Rules</h4>
                </div>
                
                <p className="text-[11px] text-slate-400 leading-relaxed text-left">
                  Your rank points (XP) are evaluated directly by the AI Coach upon grading challenges and mock interviews.
                </p>

                <div className="space-y-2 border-t border-slate-900 pt-3">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Weight Distributions:</span>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>System Scalability</span>
                        <span>30%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500" style={{ width: '30%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Complexity & DSA optimization</span>
                        <span>30%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '30%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>OO Abstractions & SOLID</span>
                        <span>20%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: '20%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>AI explanation quality</span>
                        <span>20%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-855 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '20%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bot status alert */}
              <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10 text-[10.5px] text-slate-400 leading-relaxed text-left flex items-start space-x-2">
                <span className="text-base leading-none">💡</span>
                <p>
                  Rank XP scales up linearly with AI Coach goals achieved. Beat the <strong>Google L6 Bot</strong> benchmark to secure your system design mastery badge!
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
