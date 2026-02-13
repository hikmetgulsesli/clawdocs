/**
 * AgentDetail component - modal displaying full agent information
 */

import { useEffect, useCallback } from 'react';
import type { Agent, Skill, Tool } from '@clawdocs/shared';
import './AgentDetail.css';

interface AgentDetailProps {
  /** The agent to display */
  agent: Agent;
  /** Callback when modal should be closed */
  onClose: () => void;
}

/**
 * Get the first letter of the agent name for the avatar
 */
function getAvatarLetter(name: string): string {
  return name.charAt(0).toUpperCase();
}

/**
 * AgentDetail modal component displays full agent information
 */
export function AgentDetail({ agent, onClose }: AgentDetailProps) {
  // Handle ESC key press
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Add/remove ESC key listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const skillCount = agent.skills?.length ?? 0;
  const toolCount = agent.tools?.length ?? 0;

  return (
    <div 
      className="agent-detail-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-detail-title"
      data-testid="agent-detail-backdrop"
    >
      <div className="agent-detail-modal">
        {/* Close button */}
        <button
          className="agent-detail-close"
          onClick={onClose}
          aria-label="Close agent details"
          type="button"
        >
          ×
        </button>

        {/* Header with avatar, name, role, and model */}
        <div className="agent-detail-header">
          <div className="agent-detail-avatar">
            {getAvatarLetter(agent.name)}
          </div>
          <div className="agent-detail-info">
            <h2 id="agent-detail-title" className="agent-detail-name">
              {agent.name}
            </h2>
            <span className="agent-detail-role">{agent.role}</span>
            <span className="agent-detail-model-badge" title={`Model: ${agent.model}`}>
              {agent.model}
            </span>
          </div>
        </div>

        {/* Description section */}
        <div className="agent-detail-section">
          <h3 className="agent-detail-section-title">Description</h3>
          <p className="agent-detail-description">{agent.description}</p>
        </div>

        {/* Stats section */}
        <div className="agent-detail-stats">
          <div className="agent-detail-stat">
            <span className="agent-detail-stat-value">{skillCount}</span>
            <span className="agent-detail-stat-label">Skills</span>
          </div>
          <div className="agent-detail-stat">
            <span className="agent-detail-stat-value">{toolCount}</span>
            <span className="agent-detail-stat-label">Tools</span>
          </div>
        </div>

        {/* Skills section */}
        {agent.skills && agent.skills.length > 0 && (
          <div className="agent-detail-section">
            <h3 className="agent-detail-section-title">
              Skills ({agent.skills.length})
            </h3>
            <ul className="agent-detail-skills-list">
              {agent.skills.map((skill) => (
                <SkillItem key={skill.id} skill={skill} />
              ))}
            </ul>
          </div>
        )}

        {/* Tools section */}
        {agent.tools && agent.tools.length > 0 && (
          <div className="agent-detail-section">
            <h3 className="agent-detail-section-title">
              Tools ({agent.tools.length})
            </h3>
            <ul className="agent-detail-tools-list">
              {agent.tools.map((tool) => (
                <ToolItem key={tool.id} tool={tool} />
              ))}
            </ul>
          </div>
        )}

        {/* Empty state if no skills or tools */}
        {(!agent.skills || agent.skills.length === 0) && 
         (!agent.tools || agent.tools.length === 0) && (
          <div className="agent-detail-empty">
            <p>No skills or tools configured for this agent.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SkillItem sub-component for displaying a single skill
 */
function SkillItem({ skill }: { skill: Skill }) {
  return (
    <li className="agent-detail-skill-item">
      <div className="agent-detail-skill-header">
        <span className="agent-detail-skill-name">{skill.name}</span>
        {skill.metadata?.version && (
          <span className="agent-detail-skill-version">
            v{skill.metadata.version}
          </span>
        )}
      </div>
      <p className="agent-detail-skill-description">{skill.description}</p>
      {skill.location && (
        <span className="agent-detail-skill-location">{skill.location}</span>
      )}
    </li>
  );
}

/**
 * ToolItem sub-component for displaying a single tool
 */
function ToolItem({ tool }: { tool: Tool }) {
  return (
    <li className="agent-detail-tool-item">
      <span className="agent-detail-tool-name">{tool.name}</span>
      <p className="agent-detail-tool-description">{tool.description}</p>
    </li>
  );
}

export default AgentDetail;
