/**
 * API client for ClawDocs frontend
 * Provides fetch wrapper and typed API methods
 */

import type { Agent, Skill } from '@clawdocs/shared';

// API base URL from environment variable or default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4504';

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    let errorMessage: string;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
    } catch {
      errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
    }
    
    throw new APIError(errorMessage, response.status, response.statusText);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetch all agents from the API
 */
export async function getAgents(): Promise<Agent[]> {
  return fetchJSON<Agent[]>(`${API_BASE_URL}/api/agents`);
}

/**
 * Fetch a single agent by ID
 */
export async function getAgent(id: string): Promise<Agent> {
  return fetchJSON<Agent>(`${API_BASE_URL}/api/agents/${encodeURIComponent(id)}`);
}

/**
 * Fetch all skills from the API
 */
export async function getSkills(): Promise<Skill[]> {
  return fetchJSON<Skill[]>(`${API_BASE_URL}/api/skills`);
}

/**
 * Fetch a single skill by name
 */
export async function getSkill(name: string): Promise<Skill> {
  return fetchJSON<Skill>(`${API_BASE_URL}/api/skills/${encodeURIComponent(name)}`);
}

/**
 * Health check - verify API is available
 */
export async function checkHealth(): Promise<{ status: string; service: string }> {
  return fetchJSON<{ status: string; service: string }>(`${API_BASE_URL}/health`);
}
