// Backend type definitions - re-export from shared package
// and add any backend-specific types

export type { Agent, Skill, Tool } from '@clawdocs/shared';

/**
 * Result of a scan operation
 */
export interface ScanResult {
  timestamp: Date;
  agents: import('@clawdocs/shared').Agent[];
  totalAgents: number;
  totalSkills: number;
  totalTools: number;
}

/**
 * Agent with additional emoji field (from IDENTITY.md)
 * This extends the shared Agent with presentation fields
 */
export interface AgentWithEmoji {
  id: string;
  name: string;
  role: string;
  emoji: string;
  model: string;
  description: string;
  skills: import('@clawdocs/shared').Skill[];
  tools: import('@clawdocs/shared').Tool[];
  lastUpdated: Date;
}

/**
 * Skill with additional metadata from SKILL.md parsing
 */
export interface SkillWithMetadata {
  id: string;
  name: string;
  description: string;
  location: string;
  metadata?: {
    version?: string;
    author?: string;
    tags?: string[];
  };
}
