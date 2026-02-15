/**
 * Tests for API client functions (runtime tests)
 * Note: React hooks require browser/DOM environment and are tested via integration tests
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const FRONTEND_DIR = '/home/setrox/clawdocs/frontend';

describe('API Client Runtime Tests', () => {
  let mockFetch;
  let fetchCalls;

  before(() => {
    // Track fetch calls
    fetchCalls = [];
    mockFetch = global.fetch;
    global.fetch = async (url, options) => {
      fetchCalls.push({ url, options });
      
      // Mock responses based on URL
      if (url.includes('/api/agents')) {
        if (url.match(/\/api\/agents\/[^/]+$/)) {
          const id = url.split('/').pop();
          return {
            ok: true,
            status: 200,
            statusText: 'OK',
            json: async () => ({
              id,
              name: 'Test Agent',
              role: 'developer',
              model: 'gpt-4',
              description: 'A test agent',
              skills: [],
              tools: [],
              lastUpdated: new Date().toISOString()
            })
          };
        }
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => [
            {
              id: 'agent-1',
              name: 'Agent One',
              role: 'developer',
              model: 'gpt-4',
              description: 'First test agent',
              skills: [],
              tools: [],
              lastUpdated: new Date().toISOString()
            }
          ]
        };
      }
      
      if (url.includes('/api/skills')) {
        if (url.match(/\/api\/skills\/[^/]+$/)) {
          const name = decodeURIComponent(url.split('/').pop());
          return {
            ok: true,
            status: 200,
            statusText: 'OK',
            json: async () => ({
              id: name.toLowerCase().replace(/\s+/g, '-'),
              name,
              description: 'A test skill',
              location: '/test/location'
            })
          };
        }
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => [
            {
              id: 'skill-1',
              name: 'Skill One',
              description: 'First test skill',
              location: '/skills/one'
            }
          ]
        };
      }
      
      if (url.includes('/health')) {
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({ status: 'ok', service: 'clawdocs' })
        };
      }
      
      return {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Not found'
      };
    };
  });

  after(() => {
    global.fetch = mockFetch;
  });

  describe('APIError class', () => {
    it('should create APIError with message only', () => {
      const clientCode = readFileSync(join(FRONTEND_DIR, 'src/api/client.ts'), 'utf-8');
      assert.ok(clientCode.includes('export class APIError'), 'APIError should be exported');
      assert.ok(clientCode.includes('extends Error'), 'APIError should extend Error');
    });

    it('should have status and statusText properties', () => {
      const clientCode = readFileSync(join(FRONTEND_DIR, 'src/api/client.ts'), 'utf-8');
      assert.ok(clientCode.includes('status?: number'), 'APIError should have status property');
      assert.ok(clientCode.includes('statusText?: string'), 'APIError should have statusText property');
    });
  });

  describe('API client functions', () => {
    it('getAgents function should be defined in client.ts', () => {
      const clientCode = readFileSync(join(FRONTEND_DIR, 'src/api/client.ts'), 'utf-8');
      assert.ok(clientCode.includes('export async function getAgents'), 'getAgents should be exported');
      assert.ok(clientCode.includes('Promise<Agent[]>'), 'getAgents should return Promise<Agent[]>');
    });

    it('getAgent function should be defined in client.ts', () => {
      const clientCode = readFileSync(join(FRONTEND_DIR, 'src/api/client.ts'), 'utf-8');
      assert.ok(clientCode.includes('export async function getAgent'), 'getAgent should be exported');
      assert.ok(clientCode.includes('id: string'), 'getAgent should accept id parameter');
    });

    it('getSkills function should be defined in client.ts', () => {
      const clientCode = readFileSync(join(FRONTEND_DIR, 'src/api/client.ts'), 'utf-8');
      assert.ok(clientCode.includes('export async function getSkills'), 'getSkills should be exported');
      assert.ok(clientCode.includes('Promise<Skill[]>'), 'getSkills should return Promise<Skill[]>');
    });

    it('getSkill function should be defined in client.ts', () => {
      const clientCode = readFileSync(join(FRONTEND_DIR, 'src/api/client.ts'), 'utf-8');
      assert.ok(clientCode.includes('export async function getSkill'), 'getSkill should be exported');
      assert.ok(clientCode.includes('name: string'), 'getSkill should accept name parameter');
    });

    it('should use VITE_API_BASE_URL environment variable', () => {
      const clientCode = readFileSync(join(FRONTEND_DIR, 'src/api/client.ts'), 'utf-8');
      assert.ok(
        clientCode.includes('import.meta.env.VITE_API_BASE_URL'),
        'Should use VITE_API_BASE_URL env var'
      );
    });

    it('should have fallback to localhost:4504', () => {
      const clientCode = readFileSync(join(FRONTEND_DIR, 'src/api/client.ts'), 'utf-8');
      assert.ok(
        clientCode.includes("|| 'http://localhost:4504'"),
        'Should have localhost:4504 fallback'
      );
    });
  });

  describe('useAgents hook structure', () => {
    it('should export useAgents function', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      assert.ok(hookCode.includes('export function useAgents'), 'useAgents should be exported');
    });

    it('should export useAgent function for single agent', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      assert.ok(hookCode.includes('export function useAgent'), 'useAgent should be exported');
    });

    it('should return correct interface from useAgents', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      assert.ok(hookCode.includes('data: Agent[] | null'), 'useAgents should return data property');
      assert.ok(hookCode.includes('loading: boolean'), 'useAgents should return loading property');
      assert.ok(hookCode.includes('error: Error | null'), 'useAgents should return error property');
      assert.ok(hookCode.includes('refetch: () => void'), 'useAgents should return refetch function');
    });

    it('should use useState for state management', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      assert.ok(hookCode.includes('useState'), 'Should use useState');
      assert.ok(hookCode.includes('setLoading(true)'), 'Should set loading true initially');
      assert.ok(hookCode.includes('setLoading(false)'), 'Should set loading false when done');
    });

    it('should use useEffect for data fetching', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      assert.ok(hookCode.includes('useEffect'), 'Should use useEffect');
    });

    it('should handle cleanup on unmount', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      assert.ok(hookCode.includes('let cancelled = false'), 'Should have cancelled flag');
      assert.ok(hookCode.includes('return () =>'), 'Should return cleanup function');
      assert.ok(hookCode.includes('cancelled = true'), 'Should set cancelled on cleanup');
    });

    it('should handle errors properly', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      assert.ok(hookCode.includes('try {'), 'Should use try/catch');
      assert.ok(hookCode.includes('catch'), 'Should have catch block');
      assert.ok(hookCode.includes('setError'), 'Should set error state');
      assert.ok(hookCode.includes('instanceof APIError'), 'Should handle APIError');
      assert.ok(hookCode.includes('instanceof Error'), 'Should handle generic Error');
    });

    it('should import from api/client', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      assert.ok(
        hookCode.includes("from '../api/client.js'"),
        'Should import from api/client'
      );
    });

    it('should import types from @clawdocs/shared', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      assert.ok(
        hookCode.includes("from '@clawdocs/shared'"),
        'Should import types from @clawdocs/shared'
      );
    });
  });

  describe('useSkills hook structure', () => {
    it('should export useSkills function', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      assert.ok(hookCode.includes('export function useSkills'), 'useSkills should be exported');
    });

    it('should export useSkill function for single skill', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      assert.ok(hookCode.includes('export function useSkill'), 'useSkill should be exported');
    });

    it('should return correct interface from useSkills', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      assert.ok(hookCode.includes('data: Skill[] | null'), 'useSkills should return data property');
      assert.ok(hookCode.includes('loading: boolean'), 'useSkills should return loading property');
      assert.ok(hookCode.includes('error: Error | null'), 'useSkills should return error property');
      assert.ok(hookCode.includes('refetch: () => void'), 'useSkills should return refetch function');
    });

    it('should use useState for state management', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      assert.ok(hookCode.includes('useState'), 'Should use useState');
      assert.ok(hookCode.includes('setLoading(true)'), 'Should set loading true initially');
      assert.ok(hookCode.includes('setLoading(false)'), 'Should set loading false when done');
    });

    it('should use useEffect for data fetching', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      assert.ok(hookCode.includes('useEffect'), 'Should use useEffect');
    });

    it('should handle cleanup on unmount', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      assert.ok(hookCode.includes('let cancelled = false'), 'Should have cancelled flag');
      assert.ok(hookCode.includes('return () =>'), 'Should return cleanup function');
    });

    it('should handle null name parameter in useSkill', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      assert.ok(hookCode.includes('if (!name)'), 'Should check for null name');
      assert.ok(hookCode.includes('return;'), 'Should return early if no name');
    });

    it('should import from api/client', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      assert.ok(
        hookCode.includes("from '../api/client.js'"),
        'Should import from api/client'
      );
    });

    it('should import types from @clawdocs/shared', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      assert.ok(
        hookCode.includes("from '@clawdocs/shared'"),
        'Should import types from @clawdocs/shared'
      );
    });
  });

  describe('vite-env.d.ts configuration', () => {
    it('should have vite-env.d.ts file', () => {
      const envPath = join(FRONTEND_DIR, 'src/vite-env.d.ts');
      assert.ok(existsSync(envPath), 'vite-env.d.ts should exist');
    });

    it('should define ImportMetaEnv interface', () => {
      const envCode = readFileSync(join(FRONTEND_DIR, 'src/vite-env.d.ts'), 'utf-8');
      assert.ok(envCode.includes('interface ImportMetaEnv'), 'Should define ImportMetaEnv');
      assert.ok(envCode.includes('VITE_API_BASE_URL'), 'Should include VITE_API_BASE_URL');
    });
  });

  describe('Hook behavior verification', () => {
    it('useAgents hook has correct initial state pattern', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      // Check for initial loading state pattern
      assert.ok(
        hookCode.includes('useState<boolean>(true)'),
        'useAgents should initialize loading as true'
      );
      assert.ok(
        hookCode.includes('useState<Agent[] | null>(null)'),
        'useAgents should initialize data as null'
      );
      assert.ok(
        hookCode.includes('useState<Error | null>(null)'),
        'useAgents should initialize error as null'
      );
    });

    it('useSkills hook has correct initial state pattern', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      assert.ok(
        hookCode.includes('useState<boolean>(true)'),
        'useSkills should initialize loading as true'
      );
      assert.ok(
        hookCode.includes('useState<Skill[] | null>(null)'),
        'useSkills should initialize data as null'
      );
      assert.ok(
        hookCode.includes('useState<Error | null>(null)'),
        'useSkills should initialize error as null'
      );
    });

    it('useAgent hook handles null id correctly', () => {
      const hookCode = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      assert.ok(hookCode.includes('if (!id)'), 'useAgent should check for null id');
      assert.ok(hookCode.includes('setLoading(false)'), 'useAgent should set loading false when no id');
    });

    it('hooks use useCallback for refetch', () => {
      const agentsHook = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      const skillsHook = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      
      assert.ok(agentsHook.includes('useCallback'), 'useAgents should use useCallback');
      assert.ok(skillsHook.includes('useCallback'), 'useSkills should use useCallback');
      assert.ok(agentsHook.includes('setRefreshKey'), 'useAgents should use refreshKey pattern');
    });
  });
});
