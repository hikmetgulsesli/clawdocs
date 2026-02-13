/**
 * SkillsPage - Page component for displaying the list of skills
 */

import { useState, useMemo } from 'react';
import { useSkills } from '../hooks/useSkills.js';
import { SkillCard } from '../components/SkillCard.js';
import type { Skill } from '@clawdocs/shared';
import './SkillsPage.css';

interface SkillsPageProps {
  /** Optional callback when a skill card is clicked */
  onSkillClick?: (skill: Skill) => void;
}

/**
 * SkillsPage displays a grid of skill cards with search/filter functionality
 */
export function SkillsPage({ onSkillClick }: SkillsPageProps) {
  const { data: skills, loading, error, refetch } = useSkills();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter skills based on search query
  const filteredSkills = useMemo(() => {
    if (!skills) return [];
    if (!searchQuery.trim()) return skills;

    const query = searchQuery.toLowerCase().trim();
    return skills.filter((skill) => {
      const nameMatch = skill.name.toLowerCase().includes(query);
      const descMatch = skill.description?.toLowerCase().includes(query);
      return nameMatch || descMatch;
    });
  }, [skills, searchQuery]);

  // Count system vs user skills
  const { systemCount, userCount } = useMemo(() => {
    if (!skills) return { systemCount: 0, userCount: 0 };
    return skills.reduce(
      (acc, skill) => {
        if (skill.location.startsWith('user:')) {
          acc.userCount++;
        } else {
          acc.systemCount++;
        }
        return acc;
      },
      { systemCount: 0, userCount: 0 }
    );
  }, [skills]);

  if (loading) {
    return (
      <div className="skills-page">
        <div className="skills-page-header">
          <h1>Skills</h1>
          <p>Browse all available OpenClaw skills</p>
        </div>
        <div className="skills-loading">
          <div className="loading-spinner"></div>
          <p>Loading skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="skills-page">
        <div className="skills-page-header">
          <h1>Skills</h1>
          <p>Browse all available OpenClaw skills</p>
        </div>
        <div className="skills-error">
          <p className="error-message">Failed to load skills: {error.message}</p>
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

  if (!skills || skills.length === 0) {
    return (
      <div className="skills-page">
        <div className="skills-page-header">
          <h1>Skills</h1>
          <p>Browse all available OpenClaw skills</p>
        </div>
        <div className="skills-empty">
          <p>No skills found.</p>
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

  const totalCount = skills.length;
  const filteredCount = filteredSkills.length;

  return (
    <div className="skills-page">
      <div className="skills-page-header">
        <h1>Skills</h1>
        <p>
          Browse all available OpenClaw skills ({totalCount} total: {systemCount} system, {userCount} user)
        </p>
      </div>

      <div className="skills-search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search skills by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search skills"
          />
          {searchQuery && (
            <button
              className="clear-search-button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
        <span className="skills-count">
          Showing {filteredCount} of {totalCount}
        </span>
      </div>
      
      {filteredSkills.length === 0 ? (
        <div className="skills-no-results">
          <p>No skills match your search.</p>
          <button 
            className="retry-button" 
            onClick={() => setSearchQuery('')}
            type="button"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="skills-grid" role="list" aria-label="Skill list">
          {filteredSkills.map((skill) => (
            <div key={skill.id} role="listitem">
              <SkillCard 
                skill={skill} 
                onClick={onSkillClick}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SkillsPage;
