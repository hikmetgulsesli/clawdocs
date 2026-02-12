// Shared type definitions for ClawDocs backend

export interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  model: string;
  capabilities: string[];
  skills: Skill[];
  tools: Tool[];
  lastSeen?: Date;
}

export interface Skill {
  name: string;
  description: string;
  location: string;
}

export interface Tool {
  name: string;
  description: string;
  parameters?: Record<string, any>;
}

export interface ScanResult {
  timestamp: Date;
  agents: Agent[];
  totalAgents: number;
  totalSkills: number;
  totalTools: number;
}
