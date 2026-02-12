/**
 * Shared types for ClawDocs - used by both backend and frontend
 */

/**
 * Represents an OpenClaw agent with its metadata, skills, and tools
 */
export interface Agent {
  /** Unique identifier for the agent */
  id: string;
  /** Display name of the agent */
  name: string;
  /** Role/purpose of the agent */
  role: string;
  /** Model used by the agent (e.g., kimi-coding/k2p5) */
  model: string;
  /** Description of the agent's capabilities */
  description: string;
  /** Skills available to this agent */
  skills: Skill[];
  /** Tools available to this agent */
  tools: Tool[];
  /** Last updated timestamp */
  lastUpdated: Date;
}

/**
 * Represents a skill that can be used by agents
 */
export interface Skill {
  /** Unique identifier for the skill */
  id: string;
  /** Display name of the skill */
  name: string;
  /** Description of what the skill does */
  description: string;
  /** File system location of the skill */
  location: string;
  /** Additional metadata about the skill */
  metadata?: {
    /** Version of the skill */
    version?: string;
    /** Author of the skill */
    author?: string;
    /** Keywords/tags for the skill */
    tags?: string[];
  };
}

/**
 * Represents a tool that agents can use
 */
export interface Tool {
  /** Unique identifier for the tool */
  id: string;
  /** Display name of the tool */
  name: string;
  /** Description of what the tool does */
  description: string;
  /** Parameters the tool accepts */
  parameters?: Record<string, unknown>;
}
