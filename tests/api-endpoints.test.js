import { describe, it } from 'node:test';
import assert from 'node:assert';
import { app } from '../backend/dist/server.js';
import * as http from 'node:http';

// Helper to make HTTP requests to the Express app
function request(method, path) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      
      const req = http.request({
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: { 'Accept': 'application/json' }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          server.close();
          try {
            const body = data ? JSON.parse(data) : {};
            resolve({ status: res.statusCode || 0, body });
          } catch {
            resolve({ status: res.statusCode || 0, body: data });
          }
        });
      });
      
      req.on('error', (err) => {
        server.close();
        reject(err);
      });
      
      req.end();
    });
  });
}

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return status ok', async () => {
      const { status, body } = await request('GET', '/health');
      
      assert.strictEqual(status, 200);
      assert.strictEqual(body.status, 'ok');
      assert.strictEqual(body.service, 'clawdocs');
    });
  });

  describe('GET /api/agents', () => {
    it('should return array of agents', async () => {
      const { status, body } = await request('GET', '/api/agents');
      
      assert.strictEqual(status, 200);
      assert.ok(Array.isArray(body), 'Response should be an array');
      // Agents array might be empty if no agents found, but it should be an array
    });

    it('should return agents with correct structure', async () => {
      const { status, body } = await request('GET', '/api/agents');
      
      assert.strictEqual(status, 200);
      assert.ok(Array.isArray(body), 'Response should be an array');
      
      // If agents exist, verify structure
      if (body.length > 0) {
        const agent = body[0];
        assert.ok(typeof agent.id === 'string', 'Agent should have id');
        assert.ok(typeof agent.name === 'string', 'Agent should have name');
        assert.ok(typeof agent.role === 'string', 'Agent should have role');
        assert.ok(typeof agent.model === 'string', 'Agent should have model');
        assert.ok(typeof agent.description === 'string', 'Agent should have description');
      }
    });
  });

  describe('GET /api/agents/:id', () => {
    it('should return 404 for non-existent agent', async () => {
      const { status, body } = await request('GET', '/api/agents/non-existent-agent-12345');
      
      assert.strictEqual(status, 404);
      assert.ok(body.error, 'Should have error field');
      assert.ok(body.message, 'Should have message field');
    });
  });

  describe('GET /api/skills', () => {
    it('should return array of skills', async () => {
      const { status, body } = await request('GET', '/api/skills');
      
      assert.strictEqual(status, 200);
      assert.ok(Array.isArray(body), 'Response should be an array');
    });

    it('should return skills with correct structure', async () => {
      const { status, body } = await request('GET', '/api/skills');
      
      assert.strictEqual(status, 200);
      assert.ok(Array.isArray(body), 'Response should be an array');
      
      // If skills exist, verify structure
      if (body.length > 0) {
        const skill = body[0];
        assert.ok(typeof skill.name === 'string', 'Skill should have name');
        assert.ok(typeof skill.description === 'string', 'Skill should have description');
        assert.ok(typeof skill.location === 'string', 'Skill should have location');
      }
    });
  });

  describe('GET /api/skills/:name', () => {
    it('should return 404 for non-existent skill', async () => {
      const { status, body } = await request('GET', '/api/skills/non-existent-skill-12345');
      
      assert.strictEqual(status, 404);
      assert.ok(body.error, 'Should have error field');
      assert.ok(body.message, 'Should have message field');
    });
  });

  describe('GET /api', () => {
    it('should return API info', async () => {
      const { status, body } = await request('GET', '/api');
      
      assert.strictEqual(status, 200);
      assert.ok(body.message, 'Should have message field');
      assert.ok(body.version, 'Should have version field');
    });
  });

  describe('404 handler', () => {
    it('should return JSON error for unknown routes', async () => {
      const { status, body } = await request('GET', '/api/unknown-route-that-does-not-exist');
      
      assert.strictEqual(status, 404);
      assert.ok(body.error, 'Should have error field');
      assert.ok(body.message, 'Should have message field');
    });

    it('should return JSON error for completely unknown paths', async () => {
      const { status, body } = await request('GET', '/totally-unknown-path');
      
      assert.strictEqual(status, 404);
      assert.ok(body.error, 'Should have error field');
      assert.ok(body.message, 'Should have message field');
    });
  });
});
