import * as fs from 'node:fs';
import * as path from 'node:path';
import matter from 'gray-matter';
import type { Agent } from '../types/index.js';

export interface ScannedAgent {
  id: string;
  name: string;
  role: string;
  model: string;
  description: string;
}

/**
 * Extract agent info from IDENTITY.md frontmatter or content
 */
function parseIdentity(content: string): { name: string; role: string; emoji: string } {
  const { data, content: body } = matter(content);
  
  // Try frontmatter first
  if (data.name) {
    return {
      name: data.name,
      role: data.role || data.creature || '',
      emoji: data.emoji || ''
    };
  }
  
  // Parse from markdown content (fallback)
  const nameMatch = body.match(/\*\*Name:\*\*\s*(.+)/);
  const creatureMatch = body.match(/\*\*Creature:\*\*\s*(.+)/);
  const emojiMatch = body.match(/\*\*Emoji:\*\*\s*(.+)/);
  
  return {
    name: nameMatch?.[1]?.trim() || 'Unknown',
    role: creatureMatch?.[1]?.trim() || '',
    emoji: emojiMatch?.[1]?.trim() || ''
  };
}

/**
 * Extract model and description from SOUL.md
 */
function parseSoul(content: string): { model: string; description: string } {
  const { data, content: body } = matter(content);
  
  // Try frontmatter first
  let model = data.model || '';
  
  // Parse model from content if not in frontmatter
  if (!model) {
    const modelMatch = body.match(/Primary:\s*(.+)/i) || 
                       body.match(/Model:\s*(.+)/i) ||
                       body.match(/\*\*Model:\*\*\s*(.+)/i);
    model = modelMatch?.[1]?.trim() || '';
  }
  
  // Extract description - first paragraph after title or from frontmatter
  let description = data.description || '';
  if (!description) {
    // Try to find a description paragraph
    const descMatch = body.match(/^\s*\n([^#\n].*?)(?=\n\n|\n##|$)/s);
    if (descMatch) {
      description = descMatch[1].trim().split('\n')[0].slice(0, 200);
    }
  }
  
  return { model, description };
}

/**
 * Scan a single agent directory
 */
function scanAgentDirectory(agentPath: string): ScannedAgent | null {
  const id = path.basename(agentPath);
  
  // Skip non-agent directories
  if (!id.startsWith('workspace-') && !id.includes('feature-dev') && !id.includes('reviewer')) {
    return null;
  }
  
  const identityPath = path.join(agentPath, 'IDENTITY.md');
  const soulPath = path.join(agentPath, 'SOUL.md');
  
  // Must have at least IDENTITY.md
  if (!fs.existsSync(identityPath)) {
    return null;
  }
  
  try {
    const identityContent = fs.readFileSync(identityPath, 'utf-8');
    const identity = parseIdentity(identityContent);
    
    let model = '';
    let description = '';
    
    // Try to read SOUL.md if it exists
    if (fs.existsSync(soulPath)) {
      const soulContent = fs.readFileSync(soulPath, 'utf-8');
      const soul = parseSoul(soulContent);
      model = soul.model;
      description = soul.description;
    }
    
    return {
      id,
      name: identity.name,
      role: identity.role,
      model,
      description
    };
  } catch (error) {
    console.error(`Error scanning agent ${id}:`, error);
    return null;
  }
}

/**
 * Scan all agent directories in the OpenClaw workspaces
 */
export function scanAgents(basePath: string = '/home/setrox/.openclaw'): ScannedAgent[] {
  const agents: ScannedAgent[] = [];
  
  if (!fs.existsSync(basePath)) {
    console.warn(`Base path does not exist: ${basePath}`);
    return agents;
  }
  
  // Scan workspace-* directories directly
  try {
    const entries = fs.readdirSync(basePath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(basePath, entry.name);
        
        // Check if it's a workspace directory
        if (entry.name.startsWith('workspace-')) {
          const agent = scanAgentDirectory(fullPath);
          if (agent) {
            agents.push(agent);
          }
        }
        
        // Also scan workflows directories
        if (entry.name === 'workspaces' || entry.name === 'workspace') {
          try {
            const workflowEntries = fs.readdirSync(fullPath, { withFileTypes: true });
            for (const wfEntry of workflowEntries) {
              if (wfEntry.isDirectory()) {
                const wfPath = path.join(fullPath, wfEntry.name);
                // Look for agent directories within workflows
                const agentEntries = fs.readdirSync(wfPath, { withFileTypes: true });
                for (const agentEntry of agentEntries) {
                  if (agentEntry.isDirectory()) {
                    const agentPath = path.join(wfPath, agentEntry.name);
                    // Check if it has IDENTITY.md
                    if (fs.existsSync(path.join(agentPath, 'IDENTITY.md'))) {
                      const agent = scanAgentDirectory(agentPath);
                      if (agent) {
                        agents.push(agent);
                      }
                    }
                  }
                }
              }
            }
          } catch (err) {
            // Ignore errors scanning subdirectories
          }
        }
      }
    }
  } catch (error) {
    console.error('Error scanning agents:', error);
  }
  
  return agents;
}

/**
 * Get a single agent by ID
 */
export function getAgent(agentId: string, basePath: string = '/home/setrox/.openclaw'): ScannedAgent | null {
  const agentPath = path.join(basePath, agentId);
  
  if (!fs.existsSync(agentPath)) {
    // Try finding in workflows
    const workflowsPath = path.join(basePath, 'workspaces');
    if (fs.existsSync(workflowsPath)) {
      const entries = fs.readdirSync(workflowsPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const potentialPath = path.join(workflowsPath, entry.name, agentId);
          if (fs.existsSync(potentialPath)) {
            return scanAgentDirectory(potentialPath);
          }
        }
      }
    }
    return null;
  }
  
  return scanAgentDirectory(agentPath);
}