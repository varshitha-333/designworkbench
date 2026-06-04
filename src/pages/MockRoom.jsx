import React, { useState, useEffect } from 'react';
import { Calendar, Users, Zap, Clock, ShieldAlert, CheckSquare, Plus, Video, Play, MessageSquare, Code, Layout, Trash2, ArrowRight, Sparkles, Brain, Award } from 'lucide-react';

export default function MockRoom({ setCurrentTab, sidebarComponent }) {
  const [inRoom, setInRoom] = useState(false);
  const [matching, setMatching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  
  // AI Simulator states
  const [isAIMode, setIsAIMode] = useState(false);
  const [selectedAI, setSelectedAI] = useState('socrates');
  const [showAIScorecard, setShowAIScorecard] = useState(false);

  // Timer count states
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes
  
  // Collaborative Room Tab state
  const [collabTab, setCollabTab] = useState('board'); // board, code
  
  // Interactive mock interview nodes state
  const [nodes, setNodes] = useState([
    { id: 1, type: 'LB', x: 120, y: 40 },
    { id: 2, type: 'WebServer', x: 120, y: 150 },
    { id: 3, type: 'Database', x: 120, y: 260 }
  ]);

  // Rubric Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Functional Requirements defined", checked: true },
    { id: 2, text: "Throughput / Storage Estimates calculated", checked: false },
    { id: 3, text: "Read Caching layers designed", checked: true },
    { id: 4, text: "SQL Database Schema structured", checked: false },
    { id: 5, text: "System Bottlenecks discussed", checked: false }
  ]);

  // Collaborative Code content
  const [sharedCode, setSharedCode] = useState(`// Collaborative Draft Workspace
// Candidate: Varshi
// Interviewer: Alex S. (Amazon)

class ConsistentHashRing {
  constructor(replicas = 3) {
    this.replicas = replicas;
    this.ring = new Map(); // Hash -> Node
    this.sortedKeys = [];
  }

  addNode(node) {
    // Generate virtual replica tokens
  }
}`);

  // Simulating countdown timer in mock room
  useEffect(() => {
    if (!inRoom) return;
    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [inRoom]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMatchSearch = () => {
    setMatching(true);
    setMatchFound(false);
    setTimeout(() => {
      setMatching(false);
      setMatchFound(true);
    }, 2000);
  };

  const enterRoom = () => {
    setInRoom(true);
  };

  const exitRoom = () => {
    setInRoom(false);
    setMatchFound(false);
    setTimeLeft(2700);
  };

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const addWhiteboardNode = (type) => {
    setNodes(prev => [...prev, {
      id: Date.now(),
      type,
      x: 60 + Math.random() * 120,
      y: 60 + Math.random() * 180
    }]);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      
      {/* Sidebar navigation */}
      {!inRoom && sidebarComponent}

      {/* Main viewport */}
      <div className={`flex-1 flex flex-col ${inRoom ? 'h-screen overflow-hidden' : 'px-4 py-8 md:px-8 max-w-7xl mx-auto w-full lg:pl-20 overflow-y-auto'}`}>
        
        {/* LOBBY VIEW MODE */}
        {!inRoom && (
          <div className="text-left space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
                <span>Mock Interview Lobby</span>
                <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
              </h1>
              <p className="text-slate-400 text-xs mt-1">Practice mock system design scenarios under timed pressure with other engineers or live AI persona coaches.</p>
            </div>

            {/* Matchmaker Panel widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
              
              {/* Card 1: AI Mock Interview Simulator (Featured) */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-violet-500/30 flex flex-col justify-between space-y-6 lg:col-span-2 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl pointer-events-none rounded-full" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="text-[9px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded font-black font-mono uppercase tracking-wider">Recommended</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">AI Mock Interview Simulator</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Practice structured technical evaluation runs with specialized AI Coach bots. Choose a focus area and receive live audio-visual simulations, dynamic rubric checks, and an automated grading report.
                  </p>

                  {/* AI Persona Selection grid */}
                  <div className="space-y-2 pt-2">
                    <label className="font-bold text-slate-500 uppercase font-mono text-[9px] tracking-wider">Select AI Interviewer Bot:</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {[
                        { id: 'socrates', name: 'Socrates', role: 'System Design Coach', details: 'Drills daily write metrics, scale bottlenecks, key lookups', avatar: '🏛️' },
                        { id: 'ada', name: 'Ada Lovelace', role: 'Data Structures Critic', details: 'Drills Big O targets, hash map index, doubly-linked nodes', avatar: '💻' },
                        { id: 'turing', name: 'Alan Turing', role: 'Agentic AI specialist', details: 'Drills ReAct loops, safety timeouts, tool registry syntax', avatar: '🤖' },
                        { id: 'liskov', name: 'Barbara Liskov', role: 'OOP SOLID Mentor', details: 'Drills inheritance interfaces, open-closed design patterns', avatar: '📐' }
                      ].map(bot => (
                        <button
                          key={bot.id}
                          onClick={() => setSelectedAI(bot.id)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-3 ${
                            selectedAI === bot.id 
                              ? 'bg-violet-600/10 border-violet-500 text-white font-bold ring-1 ring-violet-500/30' 
                              : 'bg-slate-950/60 border-slate-900 hover:border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-2xl mt-0.5">{bot.avatar}</span>
                          <div>
                            <div className="text-xs leading-tight text-slate-200">{bot.name}</div>
                            <div className="text-[9px] text-violet-400 font-mono font-bold uppercase mt-0.5">{bot.role}</div>
                            <p className="text-[9.5px] text-slate-500 mt-1 font-normal leading-normal">{bot.details}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsAIMode(true);
                    setInRoom(true);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-900/25 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Mock Session with {selectedAI === 'socrates' ? 'Socrates' : selectedAI === 'ada' ? 'Ada Lovelace' : selectedAI === 'turing' ? 'Alan Turing' : 'Barbara Liskov'}</span>
                </button>
              </div>

              {/* Lobby Side column: Peer mocks matching */}
              <div className="space-y-6">
                
                {/* Peer Matching Card */}
                <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-850 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Peer Matchmaking Lobby</h3>
                    <p className="text-slate-400 text-[10.5px] leading-relaxed">
                      Instant pairing with peer software engineers online. Take turns conducting mutual system design interviews.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-900">
                    {matching ? (
                      <div className="flex items-center space-x-2 text-[10.5px] text-slate-400 font-mono py-2">
                        <Clock className="w-4 h-4 text-violet-400 animate-spin" />
                        <span>Searching active queue...</span>
                      </div>
                    ) : matchFound ? (
                      <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3 space-y-2">
                        <div className="flex items-center space-x-2 text-[10.5px]">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">AS</div>
                          <div>
                            <div className="font-bold text-slate-200">Alex S. (Amazon L5)</div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIsAIMode(false);
                            enterRoom();
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Join Match Room
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleMatchSearch}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-white text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Find Peer Match
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Coach practice recommendation */}
                <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-850 space-y-3 text-left">
                  <div className="flex items-center space-x-2 text-violet-400">
                    <Brain className="w-4 h-4" />
                    <h4 className="text-xs font-bold text-white">AI Coach Recommendation</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Improve OOD structures before Jane D.'s session: Practice interface modeling in the <strong className="text-cyan-400">Design a Parking Lot</strong> workspace.
                  </p>
                  <button 
                    onClick={() => setCurrentTab('workspace')} 
                    className="w-full py-1.5 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 border border-violet-500/20 rounded-lg text-[9px] font-bold transition-all cursor-pointer text-center"
                  >
                    Launch Recommend Practice
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ACTIVE MOCK INTERVIEW COLLABORATIVE ROOM VIEW */}
        {inRoom && (
          <div className="flex-1 flex flex-col h-full overflow-hidden text-left bg-slate-950">
            
            {/* Header toolbar */}
            <header className="h-14 border-b border-slate-900 px-4 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-3">
                {isAIMode ? (
                  <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded border border-violet-500/20 animate-pulse">
                    AI INTERVIEW SIMULATOR
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20 animate-pulse">
                    LIVE INTERVIEW SESSION
                  </span>
                )}
                <span className="text-slate-600">|</span>
                <div className="text-xs font-semibold text-slate-300">
                  {isAIMode ? (
                    <span>Interviewer Bot: <span className="text-violet-400 font-bold uppercase font-mono">{selectedAI === 'socrates' ? 'Socrates' : selectedAI === 'ada' ? 'Ada Lovelace' : selectedAI === 'turing' ? 'Alan Turing' : 'Barbara Liskov'}</span></span>
                  ) : (
                    <span>Partner: <span className="text-white">Alex S. (Amazon)</span></span>
                  )}
                </div>
              </div>

              {/* Central Clock */}
              <div className="flex items-center space-x-2 text-sm font-mono text-white bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-xl">
                <Clock className="w-4 h-4 text-violet-400 animate-pulse" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {/* End button */}
              <button
                onClick={() => {
                  if (isAIMode) {
                    setShowAIScorecard(true);
                  } else {
                    exitRoom();
                  }
                }}
                className="py-1.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer shadow shadow-rose-500/10"
              >
                {isAIMode ? 'Finish & Grade' : 'End Session'}
              </button>
            </header>

            {/* Split Board Room content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              
              {/* Left Column (lg: 60%): Collaborative Editor Canvas board */}
              <div className="w-full lg:w-3/5 border-b lg:border-b-0 lg:border-r border-slate-900 flex flex-col overflow-hidden bg-slate-950">
                {/* Board navigation tabs */}
                <div className="flex border-b border-slate-900 text-xs">
                  <button 
                    onClick={() => setCollabTab('board')}
                    className={`flex-1 py-3 text-center border-b font-semibold transition-colors ${collabTab === 'board' ? 'border-violet-500 text-violet-400 bg-slate-900/20' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                  >
                    Shared Whiteboard
                  </button>
                  <button 
                    onClick={() => setCollabTab('code')}
                    className={`flex-1 py-3 text-center border-b font-semibold transition-colors ${collabTab === 'code' ? 'border-violet-500 text-violet-400 bg-slate-900/20' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                  >
                    Collaborative Code pad
                  </button>
                </div>

                <div className="flex-grow relative overflow-hidden flex flex-col">
                  {collabTab === 'board' ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* Canvas tools */}
                      <div className="p-2 border-b border-slate-900/60 bg-slate-950 flex space-x-2">
                        <button onClick={() => addWhiteboardNode('Client')} className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-[10px] font-mono text-slate-300">
                          + Client Node
                        </button>
                        <button onClick={() => addWhiteboardNode('LoadBalancer')} className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-[10px] font-mono text-slate-300">
                          + LB Node
                        </button>
                        <button onClick={() => addWhiteboardNode('AppServer')} className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-[10px] font-mono text-slate-300">
                          + AppServer Node
                        </button>
                        <button onClick={() => addWhiteboardNode('Database')} className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded text-[10px] font-mono text-slate-300">
                          + Database Node
                        </button>
                      </div>

                      {/* Board canvas dot grid */}
                      <div className="flex-1 bg-slate-950 p-4 relative">
                        {nodes.map(node => (
                          <div
                            key={node.id}
                            style={{ left: node.x, top: node.y }}
                            className="absolute w-28 p-2 rounded-lg border border-violet-500/40 bg-slate-900/90 text-center text-[10px] font-mono shadow text-violet-300 flex justify-between items-center group cursor-pointer"
                          >
                            <span>{node.type}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Synchronized" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col p-4">
                      <textarea
                        value={sharedCode}
                        onChange={(e) => setSharedCode(e.target.value)}
                        className="flex-grow bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (lg: 40%): Video feeds & interview rubrics */}
              <div className="w-full lg:w-2/5 flex flex-col overflow-y-auto p-4 space-y-4 bg-slate-950/40">
                
                {/* 1. Simulated Web Cameras */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Camera 1: Candidate (User) */}
                  <div className="aspect-video rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative shadow">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-sm text-white">V</div>
                    </div>
                    {/* Glowing audio waveform indicator */}
                    <div className="absolute bottom-2 left-2 flex items-end space-x-0.5">
                      <span className="w-1 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="w-1 h-4 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-950/80">
                      Varshi (You)
                    </span>
                  </div>

                  {/* Camera 2: Interviewer (Partner or AI Bot) */}
                  <div className="aspect-video rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative shadow">
                    {isAIMode ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1.5">
                        <div className="w-11 h-11 rounded-full bg-violet-950 border border-violet-500/60 flex items-center justify-center text-xl animate-pulse shadow-md shadow-violet-500/10">
                          {selectedAI === 'socrates' ? '🏛️' : selectedAI === 'ada' ? '💻' : selectedAI === 'turing' ? '🤖' : '📐'}
                        </div>
                        <span className="text-[8px] text-violet-400 font-bold uppercase font-mono tracking-widest animate-pulse">Analyzing Canvas/Code</span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">AS</div>
                      </div>
                    )}
                    
                    {/* Waveform indicator */}
                    <div className="absolute bottom-2 left-2 flex items-end space-x-0.5">
                      {isAIMode ? (
                        <>
                          <span className="w-1 h-2.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDuration: '0.6s' }} />
                          <span className="w-1 h-4 rounded-full bg-violet-400 animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
                          <span className="w-1 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }} />
                          <span className="w-1 h-3 rounded-full bg-violet-400 animate-bounce" style={{ animationDuration: '0.7s', animationDelay: '0.3s' }} />
                        </>
                      ) : (
                        <>
                          <span className="w-1 h-2 rounded-full bg-slate-500" />
                          <span className="w-1 h-2 rounded-full bg-slate-500" />
                          <span className="w-1 h-2 rounded-full bg-slate-500" />
                        </>
                      )}
                    </div>

                    <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-950/80">
                      {isAIMode ? (selectedAI === 'socrates' ? 'Socrates (AI)' : selectedAI === 'ada' ? 'Ada (AI)' : selectedAI === 'turing' ? 'Turing (AI)' : 'Liskov (AI)') : 'Alex S.'}
                    </span>
                  </div>

                </div>

                {/* 2. Interviewer Private Checklist (Rubric) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Evaluation Rubric Checklist
                  </h4>
                  
                  <div className="space-y-2">
                    {checklist.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => toggleCheck(c.id)}
                        className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 transition-colors cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={c.checked}
                          onChange={() => {}} // React state handled by parent div click
                          className="w-3.5 h-3.5 accent-violet-500"
                        />
                        <span className={`transition-colors ${c.checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                          {c.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Scratchpad notepad */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left space-y-2 flex-grow flex flex-col justify-between min-h-[160px]">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    My Private Interview Notes
                  </h4>
                  <textarea
                    placeholder="Jot down notes, equations, or estimates during the mock interview. These are visible only to you..."
                    className="flex-grow w-full bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-500 resize-none font-mono mt-2"
                  />
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* AI Scorecard Modal Overlay */}
      {showAIScorecard && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-805 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 text-left shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl pointer-events-none rounded-full" />
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Interview Evaluation Report</h3>
                <p className="text-[10px] text-slate-400 font-mono">GRADED BY AI INTERVIEWER: {selectedAI.toUpperCase()}</p>
              </div>
            </div>

            {/* Matrix of Grades */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl text-center">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Overall Grade</div>
                <div className="text-3xl font-black text-violet-400 mt-1">A-</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl text-center">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">System Design</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">88%</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl text-center">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">OOP Patterns</div>
                <div className="text-3xl font-black text-cyan-400 mt-1">78%</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl text-center">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">DSA Logic</div>
                <div className="text-3xl font-black text-amber-500 mt-1">65%</div>
              </div>
            </div>

            {/* Critique Feedback */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Interviewer Critique Logs</span>
              <div className="p-4 bg-slate-950/60 border border-slate-855 rounded-2xl space-y-2 text-xs leading-relaxed text-slate-300">
                <p>
                  <strong>🤖 {selectedAI === 'socrates' ? 'Socrates' : selectedAI === 'ada' ? 'Ada Lovelace' : selectedAI === 'turing' ? 'Alan Turing' : 'Barbara Liskov'}:</strong>
                  {selectedAI === 'socrates' && " \"Candidate structured the URL shortener scaling layers correctly. Using Redis cache evicted with LRU protects reads under 100K TPS, while Kafka decoupled writes. Next time, analyze database partition keys in depth to prevent node hotspots.\""}
                  {selectedAI === 'ada' && " \"Good implementation of Map indexing for key fetches. However, make sure that double linked nodes are correctly rewired during deletions to avoid memory leaks. Big O constant targets were satisfied.\""}
                  {selectedAI === 'turing' && " \"Agent ReAct routing pipeline is solid. The tool json parsing schema matches standard python specifications. Adding max iteration loops correctly halts execution loops. Good sandbox coverage.\""}
                  {selectedAI === 'liskov' && " \"SOLID single responsibility was clean. Separation of Vehicle interface structures from ParkingSpot array lists is compliant. Suggest introducing parking ticket factory structures to clean up Gate instantiation loops.\""}
                </p>
              </div>
            </div>

            {/* Scorecard recommendation */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-950/20 p-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-violet-300">
                <Brain className="w-4 h-4 text-violet-400" />
                <span>Interviewer Next-Step Recommendation:</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-normal">
                {selectedAI === 'socrates' && "Review article 'SQL vs NoSQL: A Data Modeling Playbook' in the Knowledge Hub to master write throughput limits."}
                {selectedAI === 'ada' && "Read article 'Database Indexing under the Hood: B-Trees Explained' in the Knowledge Hub to master B-Tree random disk write penalties."}
                {selectedAI === 'turing' && "Check out 'Design a ReAct Agent Router (Agentic AI)' to practice loop timeout boundary configurations."}
                {selectedAI === 'liskov' && "Review 'Design a Parking Lot System (OOD)' code drafts to verify multi-threading synchronization patterns."}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setShowAIScorecard(false);
                  exitRoom();
                }}
                className="py-3 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-900/20 cursor-pointer"
              >
                Return to Interview Lobby
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
