import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { scanSkills, getSkill } from '../backend/dist/scanner/skillScanner.js';

const TEST_DIR = '/tmp/clawdocs-skill-scanner-test';

describe('skillScanner', () => {
  before(() => {
    // Create test directory structure
    fs.mkdirSync(TEST_DIR, { recursive: true });
    
    // Create a system skill with frontmatter
    const systemSkillDir = path.join(TEST_DIR, 'system', 'test-skill');
    fs.mkdirSync(systemSkillDir, { recursive: true });
    fs.writeFileSync(
      path.join(systemSkillDir, 'SKILL.md'),
      `---
name: test-skill
description: A test skill for unit testing
metadata:
  emoji: 🧪
---

# Test Skill

This is a test skill used for unit testing the scanner.
`
    );
    
    // Create a system skill without frontmatter (inline format)
    const inlineSkillDir = path.join(TEST_DIR, 'system', 'inline-skill');
    fs.mkdirSync(inlineSkillDir, { recursive: true });
    fs.writeFileSync(
      path.join(inlineSkillDir, 'SKILL.md'),
      `# Inline Skill

This skill has no frontmatter, just content.

## Usage

Some usage instructions here.
`
    );
    
    // Create a user skill that overrides a system skill
    const userSkillDir = path.join(TEST_DIR, 'user', 'test-skill');
    fs.mkdirSync(userSkillDir, { recursive: true });
    fs.writeFileSync(
      path.join(userSkillDir, 'SKILL.md'),
      `---
name: test-skill
description: User override of test skill
---

# User Test Skill

This is the user version.
`
    );
    
    // Create another user skill
    const userSkill2Dir = path.join(TEST_DIR, 'user', 'user-only-skill');
    fs.mkdirSync(userSkill2Dir, { recursive: true });
    fs.writeFileSync(
      path.join(userSkill2Dir, 'SKILL.md'),
      `---
name: user-only-skill
description: Only exists in user directory
metadata:
  openclaw:
    emoji: 🎉
---

# User Only Skill

This skill only exists in the user directory.
`
    );
  });
  
  after(() => {
    // Clean up test directory
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });
  
  describe('scanSkills', () => {
    it('should scan system skills directory', () => {
      const systemPath = path.join(TEST_DIR, 'system');
      const skills = scanSkills(systemPath, '/nonexistent');
      
      assert.strictEqual(skills.length, 2);
      assert.ok(skills.some(s => s.name === 'test-skill'));
      assert.ok(skills.some(s => s.name === 'inline-skill'));
    });
    
    it('should scan user skills directory', () => {
      const userPath = path.join(TEST_DIR, 'user');
      const skills = scanSkills('/nonexistent', userPath);
      
      assert.strictEqual(skills.length, 2);
      assert.ok(skills.some(s => s.name === 'test-skill'));
      assert.ok(skills.some(s => s.name === 'user-only-skill'));
    });
    
    it('should combine system and user skills', () => {
      const systemPath = path.join(TEST_DIR, 'system');
      const userPath = path.join(TEST_DIR, 'user');
      const skills = scanSkills(systemPath, userPath);
      
      // Should have 3 unique skills (test-skill appears in both)
      assert.strictEqual(skills.length, 3);
    });
    
    it('should extract name from frontmatter', () => {
      const systemPath = path.join(TEST_DIR, 'system');
      const skills = scanSkills(systemPath, '/nonexistent');
      
      const testSkill = skills.find(s => s.name === 'test-skill');
      assert.ok(testSkill);
      assert.strictEqual(testSkill.name, 'test-skill');
    });
    
    it('should extract description from frontmatter', () => {
      const systemPath = path.join(TEST_DIR, 'system');
      const skills = scanSkills(systemPath, '/nonexistent');
      
      const testSkill = skills.find(s => s.name === 'test-skill');
      assert.ok(testSkill);
      assert.strictEqual(testSkill.description, 'A test skill for unit testing');
    });
    
    it('should extract description from content when no frontmatter', () => {
      const systemPath = path.join(TEST_DIR, 'system');
      const skills = scanSkills(systemPath, '/nonexistent');
      
      const inlineSkill = skills.find(s => s.name === 'inline-skill');
      assert.ok(inlineSkill);
      // The description should be extracted from the first paragraph
      assert.ok(inlineSkill.description.length > 0);
    });
    
    it('should extract metadata from frontmatter', () => {
      const systemPath = path.join(TEST_DIR, 'system');
      const skills = scanSkills(systemPath, '/nonexistent');
      
      const testSkill = skills.find(s => s.name === 'test-skill');
      assert.ok(testSkill);
      assert.ok(testSkill.metadata);
      assert.strictEqual(testSkill.metadata.emoji, '🧪');
    });
    
    it('should mark user skills with user: prefix in location', () => {
      const systemPath = path.join(TEST_DIR, 'system');
      const userPath = path.join(TEST_DIR, 'user');
      const skills = scanSkills(systemPath, userPath);
      
      const userOnlySkill = skills.find(s => s.name === 'user-only-skill');
      assert.ok(userOnlySkill);
      assert.ok(userOnlySkill.location.startsWith('user:'));
    });
    
    it('should give user skills precedence over system skills', () => {
      const systemPath = path.join(TEST_DIR, 'system');
      const userPath = path.join(TEST_DIR, 'user');
      const skills = scanSkills(systemPath, userPath);
      
      const testSkill = skills.find(s => s.name === 'test-skill');
      assert.ok(testSkill);
      assert.strictEqual(testSkill.description, 'User override of test skill');
      assert.ok(testSkill.location.startsWith('user:'));
    });
    
    it('should handle non-existent directories gracefully', () => {
      const skills = scanSkills('/nonexistent/path', '/another/nonexistent');
      assert.strictEqual(skills.length, 0);
    });
    
    it('should ignore directories without SKILL.md', () => {
      // Create a directory without SKILL.md
      const noSkillDir = path.join(TEST_DIR, 'system', 'no-skill-here');
      fs.mkdirSync(noSkillDir, { recursive: true });
      fs.writeFileSync(path.join(noSkillDir, 'README.md'), '# Not a skill');
      
      const systemPath = path.join(TEST_DIR, 'system');
      const skills = scanSkills(systemPath, '/nonexistent');
      
      assert.ok(!skills.some(s => s.name === 'no-skill-here'));
    });
  });
  
  describe('getSkill', () => {
    it('should return a skill by name from system directory', () => {
      const systemPath = path.join(TEST_DIR, 'system');
      const skill = getSkill('test-skill', systemPath, '/nonexistent');
      
      assert.ok(skill);
      assert.strictEqual(skill.name, 'test-skill');
    });
    
    it('should return a skill by name from user directory', () => {
      const userPath = path.join(TEST_DIR, 'user');
      const skill = getSkill('user-only-skill', '/nonexistent', userPath);
      
      assert.ok(skill);
      assert.strictEqual(skill.name, 'user-only-skill');
    });
    
    it('should prefer user skills over system skills', () => {
      const systemPath = path.join(TEST_DIR, 'system');
      const userPath = path.join(TEST_DIR, 'user');
      const skill = getSkill('test-skill', systemPath, userPath);
      
      assert.ok(skill);
      assert.strictEqual(skill.description, 'User override of test skill');
      assert.ok(skill.location.startsWith('user:'));
    });
    
    it('should return null for non-existent skill', () => {
      const skill = getSkill('non-existent-skill', '/nonexistent');
      assert.strictEqual(skill, null);
    });
  });
});
