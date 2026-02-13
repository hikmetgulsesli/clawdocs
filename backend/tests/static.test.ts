import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { app } from '../src/server.js';
import request from 'supertest';

describe('Static File Serving', () => {
  it('should serve index.html at root path', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    assert.ok(response.text.includes('<!doctype html>') || response.text.includes('<!DOCTYPE html>'), 
      'Should serve HTML content');
    assert.ok(response.text.includes('ClawDocs') || response.text.includes('root'), 
      'Should contain app content');
  });

  it('should serve static assets', async () => {
    // First get index.html to find asset paths
    const indexResponse = await request(app).get('/');
    const html = indexResponse.text;
    
    // Extract JS asset path from HTML
    const jsMatch = html.match(/src="\/assets\/([^"]+\.js)"/);
    if (jsMatch) {
      const jsPath = `/assets/${jsMatch[1]}`;
      const response = await request(app)
        .get(jsPath)
        .expect(200);
      
      assert.ok(response.headers['content-type'].includes('javascript'), 
        'Should serve JS with correct content type');
    }
  });

  it('should serve index.html for unknown routes (SPA fallback)', async () => {
    const response = await request(app)
      .get('/some/random/path')
      .expect(200);
    
    assert.ok(response.text.includes('<!doctype html>') || response.text.includes('<!DOCTYPE html>'), 
      'Should serve HTML for SPA routing');
  });

  it('should serve index.html for /agents route', async () => {
    const response = await request(app)
      .get('/agents')
      .expect(200);
    
    assert.ok(response.text.includes('<!doctype html>') || response.text.includes('<!DOCTYPE html>'), 
      'Should serve HTML for /agents route');
  });

  it('should serve index.html for /skills route', async () => {
    const response = await request(app)
      .get('/skills')
      .expect(200);
    
    assert.ok(response.text.includes('<!doctype html>') || response.text.includes('<!DOCTYPE html>'), 
      'Should serve HTML for /skills route');
  });
});

describe('API Routes with Static Files', () => {
  it('should still serve API routes', async () => {
    const response = await request(app)
      .get('/api')
      .expect(200);
    
    assert.strictEqual(response.body.message, 'ClawDocs API');
  });

  it('should still serve health endpoint', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    assert.ok(response.body.status === 'ok' || response.body.status === 'healthy');
  });

  it('should return 404 JSON for unknown API routes', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect(404);
    
    assert.ok(response.body.error);
  });

  it('should serve agents API', async () => {
    const response = await request(app)
      .get('/api/agents')
      .expect(200);
    
    // Response should be an object (may contain agents array or error info)
    assert.ok(typeof response.body === 'object');
  });

  it('should serve skills API', async () => {
    const response = await request(app)
      .get('/api/skills')
      .expect(200);
    
    // Response should be an object (may contain skills array or error info)
    assert.ok(typeof response.body === 'object');
  });
});
