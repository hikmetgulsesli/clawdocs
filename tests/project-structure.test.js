import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

test('US-001: Project structure exists', () => {
  // Check that main directories exist
  assert.ok(existsSync(join(rootDir, 'backend')), 'backend/ directory should exist');
  assert.ok(existsSync(join(rootDir, 'frontend')), 'frontend/ directory should exist');
  assert.ok(existsSync(join(rootDir, 'shared')), 'shared/ directory should exist');
});

test('US-001: Root package.json has workspace configuration', () => {
  const pkgPath = join(rootDir, 'package.json');
  assert.ok(existsSync(pkgPath), 'Root package.json should exist');
  
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  assert.ok(Array.isArray(pkg.workspaces), 'workspaces field should be an array');
  assert.ok(pkg.workspaces.includes('backend'), 'workspaces should include backend');
  assert.ok(pkg.workspaces.includes('frontend'), 'workspaces should include frontend');
  assert.ok(pkg.workspaces.includes('shared'), 'workspaces should include shared');
});

test('US-001: Backend tsconfig.json extends Node.js configuration', () => {
  const tsconfigPath = join(rootDir, 'backend', 'tsconfig.json');
  assert.ok(existsSync(tsconfigPath), 'backend/tsconfig.json should exist');
  
  const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
  assert.ok(tsconfig.compilerOptions, 'tsconfig should have compilerOptions');
  assert.strictEqual(tsconfig.compilerOptions.module, 'ES2022', 'module should be ES2022');
  assert.ok(tsconfig.compilerOptions.types.includes('node'), 'types should include node');
});

test('US-001: Frontend tsconfig.json extends Vite React configuration', () => {
  const tsconfigPath = join(rootDir, 'frontend', 'tsconfig.json');
  assert.ok(existsSync(tsconfigPath), 'frontend/tsconfig.json should exist');
  
  const tsconfigContent = readFileSync(tsconfigPath, 'utf-8');
  // Strip comments from JSON (simple approach for tsconfig.json)
  const cleanJson = tsconfigContent.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
  const tsconfig = JSON.parse(cleanJson);
  assert.ok(tsconfig.compilerOptions, 'tsconfig should have compilerOptions');
  assert.strictEqual(tsconfig.compilerOptions.jsx, 'react-jsx', 'jsx should be react-jsx');
  assert.ok(tsconfig.compilerOptions.lib.includes('DOM'), 'lib should include DOM');
});

test('US-001: Typecheck passes', async () => {
  const { execSync } = await import('node:child_process');
  
  // This will throw if typecheck fails
  execSync('npm run typecheck', { 
    cwd: rootDir,
    stdio: 'inherit'
  });
  
  // If we get here, typecheck passed
  assert.ok(true, 'Typecheck should pass');
});
