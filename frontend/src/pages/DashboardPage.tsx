/**
 * DashboardPage - Main dashboard overview page with statistics
 */

import { useAgents } from '../hooks/useAgents.js';
import { useSkills } from '../hooks/useSkills.js';
import { StatCard } from '../components/StatCard.js';
import type { Agent } from '@clawdocs/shared';
import './DashboardPage.css';

interface DashboardPageProps {
  /** Optional callback for navigation */
  onNavigate?: (page: 'agents' | 'skills') => void;
}

/**
 * Calculate total tools across all agents
 */
function calculateTotalTools(agents: Agent[] | null): number {
  if (!agents) return 0;
  return agents.reduce((total, agent) => total + (agent.tools?.length ?? 0), 0);
}

/**
 * Format date for display
 */
function formatLastScan(date: Date | null): string {
  if (!date) return 'Never';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/**
 * DashboardPage displays an overview of the ClawDocs system
 */
export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { data: agents, loading: agentsLoading, error: agentsError } = useAgents();
  const { data: skills, loading: skillsLoading, error: skillsError } = useSkills();

  const totalAgents = agents?.length ?? 0;
  const totalSkills = skills?.length ?? 0;
  const totalTools = calculateTotalTools(agents);
  
  // Use current time as last scan timestamp (in a real app, this would come from the backend)
  const lastScanDate = new Date();

  const isLoading = agentsLoading || skillsLoading;
  const hasError = agentsError || skillsError;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome to ClawDocs</h1>
        <p className="dashboard-subtitle">
          Your central hub for OpenClaw agent documentation
        </p>
      </div>

      {isLoading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : hasError ? (
        <div className="dashboard-error">
          <p>Failed to load dashboard data. Please try again later.</p>
        </div>
      ) : (
        <>
          <div className="stats-grid" role="region" aria-label="Dashboard statistics">
            <StatCard
              value={totalAgents}
              label="Total Agents"
              icon="🤖"
              className="stat-agents"
            />
            <StatCard
              value={totalSkills}
              label="Total Skills"
              icon="🛠️"
              className="stat-skills"
            />
            <StatCard
              value={totalTools}
              label="Total Tools"
              icon="🔧"
              className="stat-tools"
            />
          </div>

          <div className="last-scan-info" role="status" aria-label="Last scan timestamp">
            <span className="last-scan-label">Last scan:</span>
            <span className="last-scan-value" data-testid="last-scan-timestamp">
              {formatLastScan(lastScanDate)}
            </span>
          </div>

          <div className="quick-links" role="navigation" aria-label="Quick navigation">
            <h2>Quick Links</h2>
            <div className="quick-links-grid">
              <button
                className="quick-link-card"
                onClick={() => onNavigate?.('agents')}
                type="button"
                aria-label="View all agents"
              >
                <span className="quick-link-icon">🤖</span>
                <span className="quick-link-text">View Agents</span>
                <span className="quick-link-count">{totalAgents} agents</span>
              </button>

              <button
                className="quick-link-card"
                onClick={() => onNavigate?.('skills')}
                type="button"
                aria-label="View all skills"
              >
                <span className="quick-link-icon">🛠️</span>
                <span className="quick-link-text">View Skills</span>
                <span className="quick-link-count">{totalSkills} skills</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
