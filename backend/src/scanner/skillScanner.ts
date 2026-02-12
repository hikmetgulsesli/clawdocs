import * as fs from 'node:fs';
import * as path from 'node:path';
import matter from 'gray-matter';
import type { SkillWithMetadata } from '../types/index.js';

export interface ScannedSkill extends SkillWithMetadata {}

/**
 * Parse a SKILL.md file and extract skill information
 */
function parseSkillFile(skillPath: string): ScannedSkill | null {
  const skillId = path.basename(path.dirname(skillPath));
  
  try {
    const content = fs.readFileSync(skillPath, 'utf-8');
    const { data, content: body } = matter(content);
    
    // Extract name from frontmatter or use directory name
    const name = data.name || skillId;
    
    // Extract description from frontmatter or first paragraph
    let description = data.description || '';
    if (!description && body) {
      // Try to extract first non-heading paragraph (skip heading lines starting with #)
      const lines = body.split('\n');
      let foundHeading = false;
      let descLines: string[] = [];
      
      for (const line of lines) {
        const trimmed = line.trim();
        // Skip empty lines and heading lines
        if (!trimmed || trimmed.startsWith('#')) {
          if (foundHeading && descLines.length > 0) {
            // We've collected some description after a heading, stop here
            break;
          }
          continue;
        }
        foundHeading = true;
        descLines.push(trimmed);
        if (descLines.length >= 2) break; // Take first 2 lines max
      }
      
      description = descLines.join(' ').slice(0, 300);
    }
    
    return {
      id: skillId,
      name,
      description,
      location: path.dirname(skillPath),
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error(`Error parsing skill file ${skillPath}:`, error);
    return null;
  }
}

/**
 * Scan a skills directory for all skill subdirectories
 */
function scanSkillsDirectory(skillsPath: string): ScannedSkill[] {
  const skills: ScannedSkill[] = [];
  
  if (!fs.existsSync(skillsPath)) {
    console.warn(`Skills path does not exist: ${skillsPath}`);
    return skills;
  }
  
  try {
    const entries = fs.readdirSync(skillsPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillDir = path.join(skillsPath, entry.name);
        const skillFile = path.join(skillDir, 'SKILL.md');
        
        // Check if SKILL.md exists in this directory
        if (fs.existsSync(skillFile)) {
          const skill = parseSkillFile(skillFile);
          if (skill) {
            skills.push(skill);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning skills directory ${skillsPath}:`, error);
  }
  
  return skills;
}

/**
 * Scan all skill directories (system and user)
 * @param systemPath Path to system skills directory
 * @param userPath Path to user skills directory
 * @returns Array of all scanned skills
 */
export function scanSkills(
  systemPath: string = '/usr/lib/node_modules/openclaw/skills',
  userPath: string = '/home/setrox/.openclaw/skills'
): ScannedSkill[] {
  const systemSkills = scanSkillsDirectory(systemPath);
  const userSkills = scanSkillsDirectory(userPath);
  
  // Combine and deduplicate by name (user skills take precedence)
  const skillMap = new Map<string, ScannedSkill>();
  
  for (const skill of systemSkills) {
    skillMap.set(skill.name, skill);
  }
  
  for (const skill of userSkills) {
    skillMap.set(skill.name, { ...skill, location: `user:${skill.location}` });
  }
  
  return Array.from(skillMap.values());
}

/**
 * Get a single skill by name
 * @param name The skill name to look up
 * @param systemPath Path to system skills directory
 * @param userPath Path to user skills directory
 * @returns The skill if found, null otherwise
 */
export function getSkill(
  name: string,
  systemPath: string = '/usr/lib/node_modules/openclaw/skills',
  userPath: string = '/home/setrox/.openclaw/skills'
): ScannedSkill | null {
  // Check user path first (takes precedence)
  const userSkillPath = path.join(userPath, name, 'SKILL.md');
  if (fs.existsSync(userSkillPath)) {
    const skill = parseSkillFile(userSkillPath);
    if (skill) {
      return { ...skill, location: `user:${skill.location}` };
    }
  }
  
  // Check system path
  const systemSkillPath = path.join(systemPath, name, 'SKILL.md');
  if (fs.existsSync(systemSkillPath)) {
    return parseSkillFile(systemSkillPath);
  }
  
  return null;
}
