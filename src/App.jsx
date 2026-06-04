import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import MockRoom from './pages/MockRoom';
import KnowledgeHub from './pages/KnowledgeHub';
import Leaderboard from './pages/Leaderboard';
import SidebarNavigation from './components/SidebarNavigation';

export default function App() {
  const [currentTab, setCurrentTab] = useState('workspace');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('system_design');

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    if (problem) {
      if (problem.category === 'System Design') {
        setActiveCategory('system_design');
      } else if (problem.category === 'Algorithms') {
        setActiveCategory('dsa');
      } else if (problem.category === 'Object-Oriented Design') {
        setActiveCategory('ood');
      } else if (problem.category === 'Agentic AI') {
        setActiveCategory('agentic_ai');
      }
    }
  };

  // Shared sidebar component passed to dashboards and workrooms
  const sidebarComponent = (
    <SidebarNavigation 
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      currentTab={currentTab} 
      setCurrentTab={setCurrentTab} 
    />
  );

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 antialiased selection:bg-violet-500/30">
      
      {/* Route Views Switcher */}
      {currentTab === 'landing' && (
        <LandingPage 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
        />
      )}

      {currentTab === 'dashboard' && (
        <Dashboard 
          setCurrentTab={setCurrentTab}
          onSelectProblem={handleSelectProblem}
          sidebarComponent={sidebarComponent}
        />
      )}

      {currentTab === 'workspace' && (
        <Workspace 
          currentProblem={selectedProblem}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          setCurrentTab={setCurrentTab}
          sidebarComponent={sidebarComponent}
        />
      )}

      {currentTab === 'mock_interviews' && (
        <MockRoom 
          setCurrentTab={setCurrentTab}
          sidebarComponent={sidebarComponent}
        />
      )}

      {currentTab === 'knowledge_hub' && (
        <KnowledgeHub 
          setCurrentTab={setCurrentTab}
          sidebarComponent={sidebarComponent}
        />
      )}

      {currentTab === 'leaderboard' && (
        <Leaderboard 
          sidebarComponent={sidebarComponent}
        />
      )}

    </div>
  );
}
