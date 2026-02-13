/**
 * AgentCard component - displays agent information in a card format
 */

import type { Agent } from '@clawdocs/shared';
import './AgentCard.css';

interface AgentCardProps {
  /** The agent to display */
  agent: Agent;
  /** Optional click handler for agent detail view */
  onClick?: (agent: Agent) => void;
}

/**
 * Get the first letter of the agent name for the avatar
 */
function getAvatarLetter(name: string): string {
  return name.charAt(0).toUpperCase();
}

/**
 * Truncate description to a maximum length
 */
function truncateDescription(description: string, maxLength: number = 120): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength).trim() + '...';
}

/**
 * AgentCard component displays agent information in a card format
 */
export function AgentCard({ agent, onClick }: AgentCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(agent);
    }
  };

  const skillCount = agent.skills?.length ?? 0;
  const toolCount = agent.tools?.length ?? 0;

  return (
    <div 
      className="agent-card" 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label={`View details for ${agent.name}`}
    >
      <div className="agent-card-header">
        <div className="agent-avatar">
          {getAvatarLetter(agent.name)}
        </div>
        <div className="agent-info">
          <h3 className="agent-name">{agent.name}</h3>
          <span className="agent-role">{agent.role}</span>
        </div>
      </div>
      
      <div className="agent-card-body">
        <p className="agent-description">
          {truncateDescription(agent.description)}
        </p>
      </div>
      
      <div className="agent-card-footer">
        <span className="model-badge" title={`Model: ${agent.model}`}>
          {agent.model}
        </span>
        <div className="agent-stats">
          <span className="stat-badge" title={`${skillCount} skills`}>
            <span className="stat-icon">🛠️</span>
            <span className="stat-count">{skillCount}</span>
          </span>
          <span className="stat-badge" title={`${toolCount} tools`}>
            <span className="stat-icon">🔧</span>
            <span className="stat-count">{toolCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default AgentCard;
