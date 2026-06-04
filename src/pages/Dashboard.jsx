import React, { useState } from 'react';
import { Search, Flame, Award, BookOpen, Clock, Calendar, CheckCircle2, ChevronRight, Zap, Target, Lock, Sparkles, Brain, Compass, TrendingUp } from 'lucide-react';

const mockProblems = [
  {
    id: 1,
    title: 'Design a URL Shortener (TinyURL)',
    category: 'System Design',
    difficulty: 'Easy',
    acceptance: '82%',
    status: 'Solved',
    topics: ['Caching', 'Databases', 'UUID']
  },
  {
    id: 2,
    title: 'Design a Real-time Chat App (WhatsApp)',
    category: 'System Design',
    difficulty: 'Medium',
    acceptance: '64%',
    status: 'In Progress',
    topics: ['WebSockets', 'Message Queue', 'NoSQL']
  },
  {
    id: 3,
    title: 'Design Netflix Video Streaming System',
    category: 'System Design',
    difficulty: 'Hard',
    acceptance: '41%',
    status: 'Todo',
    topics: ['CDN', 'Blob Storage', 'Encoding']
  },
  {
    id: 4,
    title: 'Design a Distributed Rate Limiter',
    category: 'System Design',
    difficulty: 'Medium',
    acceptance: '71%',
    status: 'Solved',
    topics: ['Redis', 'Algorithms', 'API Gateway']
  },
  {
    id: 5,
    title: 'Design a Parking Lot System (OOD)',
    category: 'Object-Oriented Design',
    difficulty: 'Easy',
    acceptance: '79%',
    status: 'Todo',
    topics: ['OOP Principles', 'State Pattern']
  },
  {
    id: 6,
    title: 'LRU Cache Design & Simulation',
    category: 'Algorithms',
    difficulty: 'Medium',
    acceptance: '53%',
    status: 'Todo',
    topics: ['Double Linked List', 'Hash Map']
  },
  {
    id: 7,
    title: 'Consistent Hashing Load Distributor',
    category: 'Algorithms',
    difficulty: 'Hard',
    acceptance: '38%',
    status: 'Todo',
    topics: ['Hashing', 'Ring Mapping']
  },
  {
    id: 8,
    title: 'Design a Movie Ticket Booking System (BookMyShow)',
    category: 'System Design',
    difficulty: 'Medium',
    acceptance: '58%',
    status: 'Todo',
    topics: ['SQL Concurrency', 'Redis Locks']
  },
  {
    id: 9,
    title: 'Design a Web Crawler',
    category: 'System Design',
    difficulty: 'Medium',
    acceptance: '67%',
    status: 'In Progress',
    topics: ['DFS/BFS', 'DNS Cache', 'Queue']
  },
  {
    id: 10,
    title: 'Design a ReAct Agent Router (Agentic AI)',
    category: 'Agentic AI',
    difficulty: 'Medium',
    acceptance: '54%',
    status: 'Todo',
    topics: ['ReAct Loop', 'LLM Routing', 'Tool Registry']
  }
];

export default function Dashboard({ setCurrentTab, onSelectProblem, sidebarComponent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filter problems
  const filteredProblems = mockProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          problem.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus === 'Solved') matchesStatus = problem.status === 'Solved';
    if (selectedStatus === 'In Progress') matchesStatus = problem.status === 'In Progress';
    if (selectedStatus === 'Todo') matchesStatus = problem.status === 'Todo';

    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus;
  });

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy': return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved': return 'text-emerald-400 bg-emerald-500/10';
      case 'In Progress': return 'text-amber-400 bg-amber-500/10';
      default: return 'text-slate-500 bg-slate-800/40';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      {sidebarComponent}

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 max-w-7xl mx-auto w-full lg:pl-20">
        
        {/* Header Title with stats summaries */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
              <span>Explore Challenges</span>
              <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
            </h1>
            <p className="text-slate-400 text-xs mt-1">Practice and improve your system design, algorithms, OOD, and agentic AI architectures with an AI coach.</p>
          </div>
          
          {/* Quick Stats Grid */}
          <div className="flex flex-wrap gap-3">
            {/* Streak card */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-white leading-none">5 Days</div>
                <span className="text-[10px] text-slate-500">Active Streak</span>
              </div>
            </div>
            {/* Solve Count card */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
              <Target className="w-5 h-5 text-violet-400" />
              <div>
                <div className="text-xs font-bold text-white leading-none">3 / 10 Solved</div>
                <span className="text-[10px] text-slate-500">Total Progress</span>
              </div>
            </div>
            {/* Mock Interview calendar summary */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors" onClick={() => setCurrentTab('mock_interviews')}>
              <Calendar className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white leading-none">1 Scheduled</div>
                <span className="text-[10px] text-slate-500">Mock Session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted AI Coach Hub Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-left">
          
          {/* AI Skill Profile Matrix */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 blur-2xl pointer-events-none rounded-full" />
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <span>AI Skill Assessment</span>
                <span className="text-[9px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded font-sans font-bold">Grades: Live</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Skill 1: System Design */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-350">System Design</span>
                  <span className="text-violet-400">88% (Advanced)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: '88%' }} />
                </div>
                <p className="text-[10px] text-slate-500 italic">"Strong daily storage estimates; needs caching validation depth."</p>
              </div>

              {/* Skill 2: Data Structures */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-350">Data Structures & Algo</span>
                  <span className="text-amber-400">65% (Intermediate)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }} />
                </div>
                <p className="text-[10px] text-slate-500 italic">"Good Map lookups; focus on doubly linked lists pointer rewiring."</p>
              </div>

              {/* Skill 3: Agentic AI */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-350">Agentic AI Design</span>
                  <span className="text-emerald-400">92% (Expert)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                </div>
                <p className="text-[10px] text-slate-500 italic">"Excellent ReAct execution loops & timeout parameters definitions."</p>
              </div>

              {/* Skill 4: OOPS / OOD */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-350">Object-Oriented Design</span>
                  <span className="text-cyan-400">78% (Proficient)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '78%' }} />
                </div>
                <p className="text-[10px] text-slate-500 italic">"Nice interface abstraction decoupling; check concurrent spot locks."</p>
              </div>
            </div>
          </div>

          {/* AI Adaptive Recommendations */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/5 blur-2xl pointer-events-none rounded-full" />
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-amber-500 animate-spin-slow" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                  AI Path Recommendation
                </h3>
              </div>

              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1.5">
                <div className="text-[10px] font-bold text-amber-400 flex items-center space-x-1 uppercase tracking-wider font-mono">
                  <span>Priority Area: Algorithms (DSA)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your Doubly Linked List eviction logic needs reinforcement to pass L5 benchmarks. Let's drill down.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectProblem({
                  id: 6,
                  title: 'LRU Cache Design & Simulation',
                  category: 'Algorithms',
                  difficulty: 'Medium',
                  acceptance: '53%',
                  status: 'Todo',
                  topics: ['Double Linked List', 'Hash Map']
                });
                setCurrentTab('workspace');
              }}
              className="mt-4 w-full py-2 px-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-900/20 cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Solve Cache Simulator</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Filters Panel Card */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search topics, problems (e.g. TinyURL, redis)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="All">All Categories</option>
                <option value="System Design">System Design</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Object-Oriented Design">OOD</option>
                <option value="Agentic AI">Agentic AI</option>
              </select>
            </div>

            {/* Difficulty Select */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Quick filter tabs */}
          <div className="flex flex-wrap gap-2 border-t border-slate-800/60 pt-3">
            {['All', 'Todo', 'In Progress', 'Solved'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedStatus === status 
                    ? 'bg-violet-600/20 border-violet-500/50 text-violet-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {status === 'All' ? 'All Status' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Problems List Table Grid */}
        <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-900/40">
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-4">Title</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Difficulty</th>
                  <th className="py-4 px-4">Acceptance</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem) => (
                    <tr key={problem.id} className="hover:bg-slate-900/30 transition-colors group">
                      {/* Status checkbox */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(problem.status)}`}>
                          {problem.status === 'Solved' ? 'Solved' : problem.status === 'In Progress' ? 'Drafting' : 'Todo'}
                        </span>
                      </td>

                      {/* Title & Tags */}
                      <td className="py-4 px-4">
                        <div>
                          <span 
                            onClick={() => {
                              onSelectProblem(problem);
                              setCurrentTab('workspace');
                            }}
                            className="text-slate-200 font-bold hover:text-violet-400 cursor-pointer text-sm sm:text-base transition-colors"
                          >
                            {problem.title}
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {problem.topics.map((tag, i) => (
                              <span key={i} className="text-[10px] text-slate-500 font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/60">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Category label */}
                      <td className="py-4 px-4 text-slate-400 text-xs sm:text-sm font-medium">
                        {problem.category}
                      </td>

                      {/* Difficulty Badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>

                      {/* Acceptance rate */}
                      <td className="py-4 px-4 text-slate-400 text-xs font-mono">
                        {problem.acceptance}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            onSelectProblem(problem);
                            setCurrentTab('workspace');
                          }}
                          className="inline-flex items-center space-x-1.5 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-violet-600 border border-slate-800 hover:border-violet-500 text-slate-200 hover:text-white text-xs font-bold transition-all"
                        >
                          <span>Solve</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-500 text-sm">
                      No problems found matching filters. Clear search or filters to reset.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
