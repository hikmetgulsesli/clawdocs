import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { scanAgents, getAgent } from '../backend/dist/scanner/agentScanner.js';

const TEST_DIR = '/tmp/clawdocs-test-agents';

describe('agentScanner', () => {
  before(() => {
    // Create test directory structure
    fs.mkdirSync(TEST_DIR, { recursive: true });
    
    // Create test agent 1: Complete agent with frontmatter
    const agent1Dir = path.join(TEST_DIR, 'workspace-test-agent-1');
    fs.mkdirSync(agent1Dir, { recursive: true });
    fs.writeFileSync(path.join(agent1Dir, 'IDENTITY.md'), `---
name: TestAgent1
role: Developer
emoji: 🤖
---

# Test Agent 1
`);
    fs.writeFileSync(path.join(agent1Dir, 'SOUL.md'), `---
model: gpt-4
description: A test agent for unit testing
---

# SOUL.md

Primary: gpt-4

This is a test agent description.
`);
    
    // Create test agent 2: Agent with inline markdown format (no frontmatter)
    const agent2Dir = path.join(TEST_DIR, 'workspace-test-agent-2');
    fs.mkdirSync(agent2Dir, { recursive: true });
    fs.writeFileSync(path.join(agent2Dir, 'IDENTITY.md'), `# IDENTITY.md

- **Name:** TestAgent2
- **Creature:** AI Agent — Reviewer
- **Vibe:** Professional
- **Emoji:** 🔍
`);
    fs.writeFileSync(path.join(agent2Dir, 'SOUL.md'), `# SOUL.md — TestAgent2

Primary: claude-3-opus

Reviewer agent that checks code quality.
`);
    
    // Create test agent 3: Missing SOUL.md (should handle gracefully)
    const agent3Dir = path.join(TEST_DIR, 'workspace-test-agent-3');
    fs.mkdirSync(agent3Dir, { recursive: true });
    fs.writeFileSync(path.join(agent3Dir, 'IDENTITY.md'), `---
name: TestAgent3
role: Minimal Agent
emoji: ⚡
---
`);
    // No SOUL.md for this agent
    
    // Create non-agent directory (should be ignored)
    const notAgentDir = path.join(TEST_DIR, 'not-an-agent');
    fs.mkdirSync(notAgentDir, { recursive: true });
    fs.writeFileSync(path.join(notAgentDir, 'some-file.txt'), 'not an agent');
  });
  
  after(() => {
    // Clean up test directory
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });
  
  describe('scanAgents()', () => {
    it('should scan and return all valid agents', () => {
      const agents = scanAgents(TEST_DIR);
      
      assert.strictEqual(agents.length, 3, 'Should find 3 test agents');
      
      // Check agent 1 (frontmatter format)
      const agent1 = agents.find(a => a.id === 'workspace-test-agent-1');
      assert.ok(agent1, 'Should find agent 1');
      assert.strictEqual(agent1.name, 'TestAgent1');
      assert.strictEqual(agent1.role, 'Developer');
      assert.strictEqual(agent1.model, 'gpt-4');
      assert.ok(agent1.description.includes('test agent'));
    });
    
    it('should parse inline markdown format correctly', () => {
      const agents = scanAgents(TEST_DIR);
      
      const agent2 = agents.find(a => a.id === 'workspace-test-agent-2');
      assert.ok(agent2, 'Should find agent 2');
      assert.strictEqual(agent2.name, 'TestAgent2');
      assert.ok(agent2.role.includes('Reviewer'), 'Role should contain Reviewer');
      assert.strictEqual(agent2.model, 'claude-3-opus');
    });
    
    it('should handle missing SOUL.md gracefully', () => {
      const agents = scanAgents(TEST_DIR);
      
      const agent3 = agents.find(a => a.id === 'workspace-test-agent-3');
      assert.ok(agent3, 'Should find agent 3 even without SOUL.md');
      assert.strictEqual(agent3.name, 'TestAgent3');
      assert.strictEqual(agent3.model, '');
      assert.strictEqual(agent3.description, '');
    });
    
    it('should return empty array for non-existent base path', () => {
      const agents = scanAgents('/non-existent-path');
      assert.strictEqual(agents.length, 0);
    });
    
    it('should ignore directories without IDENTITY.md', () => {
      const agents = scanAgents(TEST_DIR);
      
      const notAgent = agents.find(a => a.id === 'not-an-agent');
      assert.strictEqual(notAgent, undefined, 'Should not include directories without IDENTITY.md');
    });
  });
  
  describe('getAgent()', () => {
    it('should return a single agent by ID', () => {
      const agent = getAgent('workspace-test-agent-1', TEST_DIR);
      
      assert.ok(agent, 'Should find agent');
      assert.strictEqual(agent.id, 'workspace-test-agent-1');
      assert.strictEqual(agent.name, 'TestAgent1');
    });
    
    it('should return null for non-existent agent', () => {
      const agent = getAgent('non-existent-agent', TEST_DIR);
      assert.strictEqual(agent, null);
    });
  });
});