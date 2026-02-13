/**
 * AgentsPage - Page component for displaying the list of agents
 */

import { useState, useMemo } from 'react';
import { useAgents } from '../hooks/useAgents.js';
import { AgentCard } from '../components/AgentCard.js';
import { SearchBar } from '../components/SearchBar.js';
import type { Agent } from '@clawdocs/shared';
import './AgentsPage.css';

interface AgentsPageProps {
  /** Optional callback when an agent card is clicked */
  onAgentClick?: (agent: Agent) => void;
}

/**
 * AgentsPage displays a grid of agent cards with search functionality
 */
export function AgentsPage({ onAgentClick }: AgentsPageProps) {
  const { data: agents, loading, error, refetch } = useAgents();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter agents based on search query (name, role, description)
  const filteredAgents = useMemo(() => {
    if (!agents) return [];
    if (!searchQuery.trim()) return agents;

    const query = searchQuery.toLowerCase().trim();
    return agents.filter((agent) => {
      const nameMatch = agent.name.toLowerCase().includes(query);
      const roleMatch = agent.role.toLowerCase().includes(query);
      const descMatch = agent.description?.toLowerCase().includes(query);
      return nameMatch || roleMatch || descMatch;
    });
  }, [agents, searchQuery]);

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

  const totalCount = agents.length;
  const filteredCount = filteredAgents.length;

  return (
    <div className="agents-page">
      <div className="agents-page-header">
        <h1>Agents</h1>
        <p>Browse all available OpenClaw agents</p>
      </div>

      <div className="agents-search-section">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search agents by name, role, or description..."
          ariaLabel="Search agents"
        />
        <span className="agents-count">
          Showing {filteredCount} of {totalCount}
        </span>
      </div>

      {filteredAgents.length === 0 ? (
        <div className="agents-no-results">
          <p>No agents match your search.</p>
          <button 
            className="retry-button" 
            onClick={() => setSearchQuery('')}
            type="button"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="agents-grid" role="list" aria-label="Agent list">
          {filteredAgents.map((agent) => (
            <div key={agent.id} role="listitem">
              <AgentCard 
                agent={agent} 
                onClick={onAgentClick}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentsPage;
