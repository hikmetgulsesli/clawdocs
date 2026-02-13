/**
 * SkillCard component - displays skill information in a card format
 */

import type { Skill } from '@clawdocs/shared';
import './SkillCard.css';

interface SkillCardProps {
  /** The skill to display */
  skill: Skill;
  /** Optional click handler for skill detail view */
  onClick?: (skill: Skill) => void;
}

/**
 * Check if a skill is a user skill based on its location
 * User skills have location prefixed with "user:"
 */
function isUserSkill(skill: Skill): boolean {
  return skill.location.startsWith('user:');
}

/**
 * Get the display location (remove "user:" prefix if present)
 */
function getDisplayLocation(location: string): string {
  return location.startsWith('user:') ? location.slice(5) : location;
}

/**
 * Truncate description to a maximum length
 */
function truncateDescription(description: string, maxLength: number = 150): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength).trim() + '...';
}

/**
 * SkillCard component displays skill information in a card format
 */
export function SkillCard({ skill, onClick }: SkillCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(skill);
    }
  };

  const userSkill = isUserSkill(skill);
  const displayLocation = getDisplayLocation(skill.location);

  return (
    <div 
      className="skill-card" 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label={`View details for ${skill.name}`}
    >
      <div className="skill-card-header">
        <h3 className="skill-name">{skill.name}</h3>
        <span className={`skill-badge ${userSkill ? 'user-badge' : 'system-badge'}`}>
          {userSkill ? 'User' : 'System'}
        </span>
      </div>
      
      <div className="skill-card-body">
        <p className="skill-description">
          {truncateDescription(skill.description || 'No description available')}
        </p>
      </div>
      
      <div className="skill-card-footer">
        <span className="skill-location" title={displayLocation}>
          <span className="location-icon">📁</span>
          <span className="location-path">{displayLocation}</span>
        </span>
      </div>
    </div>
  );
}

export default SkillCard;
