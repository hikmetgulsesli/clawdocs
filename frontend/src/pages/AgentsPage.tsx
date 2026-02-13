/**
 * AgentsPage - Page component for displaying the list of agents
 */

import { useAgents } from '../hooks/useAgents.js';
import { AgentCard } from '../components/AgentCard.js';
import type { Agent } from '@clawdocs/shared';
import './AgentsPage.css';

interface AgentsPageProps {
  /** Optional callback when an agent card is clicked */
  onAgentClick?: (agent: Agent) => void;
}

/**
 * AgentsPage displays a grid of agent cards
 */
export function AgentsPage({ onAgentClick }: AgentsPageProps) {
  const { data: agents, loading, error, refetch } = useAgents();

  if (loading) {
    return (
      <div className="agents-page">
        <div className="agents-page-header">
          <h1>Agents</h1>
          <p>Browse all available OpenClaw agents</p>
        </div>
        <div className="agents-loading">
          <div className="loading-spinner"></div>
          <p>Loading agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agents-page">
        <div className="agents-page-header">
          <h1>Agents</h1>
          <p>Browse all available OpenClaw agents</p>
        </div>
        <div className="agents-error">
          <p className="error-message">Failed to load agents: {error.message}</p>
          <button 
            className="retry-button" 
            onClick={refetch}
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <div className="agents-page">
        <div className="agents-page-header">
          <h1>Agents</h1>
          <p>Browse all available OpenClaw agents</p>
        </div>
        <div className="agents-empty">
          <p>No agents found.</p>
          <button 
            className="retry-button" 
            onClick={refetch}
            type="button"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="agents-page">
      <div className="agents-page-header">
        <h1>Agents</h1>
        <p>Browse all available OpenClaw agents ({agents.length} total)</p>
      </div>
      
      <div className="agents-grid" role="list" aria-label="Agent list">
        {agents.map((agent) => (
          <div key={agent.id} role="listitem">
            <AgentCard 
              agent={agent} 
              onClick={onAgentClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentsPage;
