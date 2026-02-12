/**
 * Tests for API client and React hooks
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const FRONTEND_DIR = '/home/setrox/clawdocs/frontend';
const TESTS_DIR = '/home/setrox/clawdocs/tests';

describe('API Client and Hooks', () => {
  describe('API Client (frontend/src/api/client.ts)', () => {
    const clientPath = join(FRONTEND_DIR, 'src/api/client.ts');
    
    it('should exist', () => {
      assert.ok(existsSync(clientPath), 'client.ts should exist');
    });

    it('should export getAgents function', () => {
      const content = readFileSync(clientPath, 'utf-8');
      assert.ok(content.includes('export async function getAgents'), 'Should export getAgents');
    });

    it('should export getSkills function', () => {
      const content = readFileSync(clientPath, 'utf-8');
      assert.ok(content.includes('export async function getSkills'), 'Should export getSkills');
    });

    it('should export getAgent function for single agent', () => {
      const content = readFileSync(clientPath, 'utf-8');
      assert.ok(content.includes('export async function getAgent'), 'Should export getAgent');
    });

    it('should export getSkill function for single skill', () => {
      const content = readFileSync(clientPath, 'utf-8');
      assert.ok(content.includes('export async function getSkill'), 'Should export getSkill');
    });

    it('should export APIError class', () => {
      const content = readFileSync(clientPath, 'utf-8');
      assert.ok(content.includes('export class APIError'), 'Should export APIError class');
    });

    it('should use environment variable for API base URL', () => {
      const content = readFileSync(clientPath, 'utf-8');
      assert.ok(
        content.includes('import.meta.env.VITE_API_BASE_URL') || 
        content.includes('VITE_API_BASE_URL'),
        'Should use VITE_API_BASE_URL environment variable'
      );
    });

    it('should have fallback API URL', () => {
      const content = readFileSync(clientPath, 'utf-8');
      assert.ok(
        content.includes('localhost:4504') || content.includes('||'),
        'Should have fallback URL for API'
      );
    });

    it('should import types from @clawdocs/shared', () => {
      const content = readFileSync(clientPath, 'utf-8');
      assert.ok(
        content.includes("from '@clawdocs/shared'"),
        'Should import types from @clawdocs/shared'
      );
    });

    it('should have proper error handling with status codes', () => {
      const content = readFileSync(clientPath, 'utf-8');
      assert.ok(content.includes('status?: number'), 'Should include status in APIError');
      assert.ok(content.includes('statusText?: string'), 'Should include statusText in APIError');
    });

    it('should handle non-OK responses', () => {
      const content = readFileSync(clientPath, 'utf-8');
      assert.ok(content.includes('response.ok'), 'Should check response.ok');
      assert.ok(content.includes('throw new APIError'), 'Should throw APIError on failure');
    });
  });

  describe('useAgents Hook (frontend/src/hooks/useAgents.ts)', () => {
    const hookPath = join(FRONTEND_DIR, 'src/hooks/useAgents.ts');
    
    it('should exist', () => {
      assert.ok(existsSync(hookPath), 'useAgents.ts should exist');
    });

    it('should export useAgents function', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('export function useAgents'), 'Should export useAgents');
    });

    it('should export useAgent function for single agent', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('export function useAgent'), 'Should export useAgent');
    });

    it('should return data property', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('data:'), 'Should have data property');
    });

    it('should return loading property', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('loading:'), 'Should have loading property');
    });

    it('should return error property', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('error:'), 'Should have error property');
    });

    it('should return refetch function', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('refetch:'), 'Should have refetch function');
    });

    it('should use useState for loading state', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('useState'), 'Should use useState');
      assert.ok(content.includes('setLoading'), 'Should have setLoading');
    });

    it('should use useEffect for data fetching', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('useEffect'), 'Should use useEffect');
    });

    it('should handle loading state properly', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('setLoading(true)'), 'Should set loading true at start');
      assert.ok(content.includes('setLoading(false)'), 'Should set loading false when done');
    });

    it('should handle errors and return Error object', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('setError'), 'Should set error state');
      assert.ok(
        content.includes('Error') || content.includes('APIError'),
        'Should work with Error objects'
      );
    });

    it('should import from api/client', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(
        content.includes("from '../api/client.js'"),
        'Should import from api/client'
      );
    });

    it('should import types from @clawdocs/shared', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(
        content.includes("from '@clawdocs/shared'"),
        'Should import types from @clawdocs/shared'
      );
    });

    it('should handle cleanup on unmount', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('cancelled'), 'Should have cancelled flag');
      assert.ok(content.includes('return ()'), 'Should return cleanup function');
    });
  });

  describe('useSkills Hook (frontend/src/hooks/useSkills.ts)', () => {
    const hookPath = join(FRONTEND_DIR, 'src/hooks/useSkills.ts');
    
    it('should exist', () => {
      assert.ok(existsSync(hookPath), 'useSkills.ts should exist');
    });

    it('should export useSkills function', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('export function useSkills'), 'Should export useSkills');
    });

    it('should export useSkill function for single skill', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('export function useSkill'), 'Should export useSkill');
    });

    it('should return data property', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('data:'), 'Should have data property');
    });

    it('should return loading property', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('loading:'), 'Should have loading property');
    });

    it('should return error property', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('error:'), 'Should have error property');
    });

    it('should return refetch function', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('refetch:'), 'Should have refetch function');
    });

    it('should use useState for loading state', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('useState'), 'Should use useState');
      assert.ok(content.includes('setLoading'), 'Should have setLoading');
    });

    it('should use useEffect for data fetching', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('useEffect'), 'Should use useEffect');
    });

    it('should handle loading state properly', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('setLoading(true)'), 'Should set loading true at start');
      assert.ok(content.includes('setLoading(false)'), 'Should set loading false when done');
    });

    it('should handle errors and return Error object', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('setError'), 'Should set error state');
    });

    it('should import from api/client', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(
        content.includes("from '../api/client.js'"),
        'Should import from api/client'
      );
    });

    it('should import types from @clawdocs/shared', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(
        content.includes("from '@clawdocs/shared'"),
        'Should import types from @clawdocs/shared'
      );
    });

    it('should handle cleanup on unmount', () => {
      const content = readFileSync(hookPath, 'utf-8');
      assert.ok(content.includes('cancelled'), 'Should have cancelled flag');
    });
  });

  describe('Type Safety', () => {
    it('should use proper TypeScript types in client.ts', () => {
      const content = readFileSync(join(FRONTEND_DIR, 'src/api/client.ts'), 'utf-8');
      assert.ok(content.includes('Promise<Agent[]>'), 'Should type getAgents return');
      assert.ok(content.includes('Promise<Skill[]>'), 'Should type getSkills return');
    });

    it('should use proper TypeScript types in useAgents.ts', () => {
      const content = readFileSync(join(FRONTEND_DIR, 'src/hooks/useAgents.ts'), 'utf-8');
      assert.ok(content.includes('Agent[] | null'), 'Should type data as Agent[] | null');
      assert.ok(content.includes('boolean'), 'Should type loading as boolean');
      assert.ok(content.includes('Error | null'), 'Should type error as Error | null');
    });

    it('should use proper TypeScript types in useSkills.ts', () => {
      const content = readFileSync(join(FRONTEND_DIR, 'src/hooks/useSkills.ts'), 'utf-8');
      assert.ok(content.includes('Skill[] | null'), 'Should type data as Skill[] | null');
      assert.ok(content.includes('boolean'), 'Should type loading as boolean');
      assert.ok(content.includes('Error | null'), 'Should type error as Error | null');
    });
  });
});
