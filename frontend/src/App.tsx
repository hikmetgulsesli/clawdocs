import { useState } from 'react';
import { DashboardPage } from './pages/DashboardPage.js';
import { AgentsPage } from './pages/AgentsPage.js';
import { SkillsPage } from './pages/SkillsPage.js';
import './App.css';

type Page = 'dashboard' | 'agents' | 'skills';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'agents':
        return <AgentsPage />;
      case 'skills':
        return <SkillsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>ClawDocs</h1>
        <p>OpenClaw Agent Documentation System</p>
      </header>
      <nav className="app-nav">
        <button
          className={currentPage === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentPage('dashboard')}
          type="button"
        >
          Dashboard
        </button>
        <button
          className={currentPage === 'agents' ? 'active' : ''}
          onClick={() => setCurrentPage('agents')}
          type="button"
        >
          Agents
        </button>
        <button
          className={currentPage === 'skills' ? 'active' : ''}
          onClick={() => setCurrentPage('skills')}
          type="button"
        >
          Skills
        </button>
      </nav>
      <main className="app-main">
        {renderPage()}
      </main>
      <footer className="app-footer">
        <p>© 2026 ClawDocs</p>
      </footer>
    </div>
  );
}

export default App;
