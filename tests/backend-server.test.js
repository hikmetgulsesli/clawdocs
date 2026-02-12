import { test } from 'node:test';
import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const backendDir = join(process.cwd(), 'backend');

test('backend package.json has required dependencies', async () => {
  const pkgPath = join(backendDir, 'package.json');
  const pkgContent = await readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(pkgContent);
  
  // Check dependencies
  assert.ok(pkg.dependencies.express, 'express dependency exists');
  assert.ok(pkg.dependencies.cors, 'cors dependency exists');
  
  // Check dev dependencies
  assert.ok(pkg.devDependencies['@types/express'], '@types/express dev dependency exists');
  assert.ok(pkg.devDependencies['@types/cors'], '@types/cors dev dependency exists');
  assert.ok(pkg.devDependencies.typescript, 'typescript dev dependency exists');
  assert.ok(pkg.devDependencies.tsx, 'tsx dev dependency exists');
  
  // Check scripts
  assert.ok(pkg.scripts.dev, 'dev script exists');
  assert.match(pkg.scripts.dev, /tsx watch/, 'dev script uses tsx watch');
});

test('server.ts creates Express app and exports startServer', async () => {
  const serverPath = join(backendDir, 'src', 'server.ts');
  const serverContent = await readFile(serverPath, 'utf-8');
  
  // Check imports
  assert.match(serverContent, /import express.*from ['"]express['"]/, 'imports express');
  assert.match(serverContent, /import cors.*from ['"]cors['"]/, 'imports cors');
  
  // Check app creation
  assert.match(serverContent, /const app = express\(\)/, 'creates Express app');
  assert.match(serverContent, /export const app/, 'exports app');
  
  // Check middleware
  assert.match(serverContent, /app\.use\(cors\(\)\)/, 'uses CORS middleware');
  assert.match(serverContent, /app\.use\(express\.json\(\)\)/, 'uses JSON parsing middleware');
  
  // Check port
  assert.match(serverContent, /4504/, 'uses port 4504');
  
  // Check startServer function
  assert.match(serverContent, /export function startServer/, 'exports startServer function');
  assert.match(serverContent, /app\.listen\(PORT/, 'startServer calls app.listen');
});

test('types/index.ts defines shared types', async () => {
  const typesPath = join(backendDir, 'src', 'types', 'index.ts');
  const typesContent = await readFile(typesPath, 'utf-8');
  
  // Check type definitions
  assert.match(typesContent, /export interface Agent/, 'defines Agent interface');
  assert.match(typesContent, /export interface Skill/, 'defines Skill interface');
  assert.match(typesContent, /export interface Tool/, 'defines Tool interface');
  assert.match(typesContent, /export interface ScanResult/, 'defines ScanResult interface');
});

test('index.ts imports and calls startServer', async () => {
  const indexPath = join(backendDir, 'src', 'index.ts');
  const indexContent = await readFile(indexPath, 'utf-8');
  
  assert.match(indexContent, /import.*startServer.*from ['"]\.\/server\.js['"]/, 'imports startServer from server.js');
  assert.match(indexContent, /startServer\(\)/, 'calls startServer');
});

test('CORS middleware allows all origins', async () => {
  const serverPath = join(backendDir, 'src', 'server.ts');
  const serverContent = await readFile(serverPath, 'utf-8');
  
  // CORS with no options = allow all origins
  assert.match(serverContent, /app\.use\(cors\(\)\)/, 'CORS middleware configured to allow all origins');
});

test('server has health check endpoint', async () => {
  const serverPath = join(backendDir, 'src', 'server.ts');
  const serverContent = await readFile(serverPath, 'utf-8');
  
  assert.match(serverContent, /app\.get\(['"]\/health['"]/, 'has /health endpoint');
});
