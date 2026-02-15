import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const sharedDir = join(process.cwd(), 'shared');

describe('Shared Types Package', async () => {
  describe('Package Configuration', () => {
    it('should have package.json with name @clawdocs/shared', async () => {
      const pkgPath = join(sharedDir, 'package.json');
      const pkgContent = await readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(pkgContent);
      
      assert.strictEqual(pkg.name, '@clawdocs/shared');
    });

    it('should have TypeScript configuration', async () => {
      const tsconfigPath = join(sharedDir, 'tsconfig.json');
      await access(tsconfigPath);
    });

    it('should have build and typecheck scripts', async () => {
      const pkgPath = join(sharedDir, 'package.json');
      const pkgContent = await readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(pkgContent);
      
      assert.ok(pkg.scripts.build, 'has build script');
      assert.ok(pkg.scripts.typecheck, 'has typecheck script');
    });
  });

  describe('Type Definitions', () => {
    it('should have types.ts with Agent interface', async () => {
      const typesPath = join(sharedDir, 'src', 'types.ts');
      const typesContent = await readFile(typesPath, 'utf-8');
      
      assert.match(typesContent, /export interface Agent/, 'exports Agent interface');
      assert.match(typesContent, /id:\s*string/, 'has id field');
      assert.match(typesContent, /name:\s*string/, 'has name field');
      assert.match(typesContent, /role:\s*string/, 'has role field');
      assert.match(typesContent, /model:\s*string/, 'has model field');
      assert.match(typesContent, /description:\s*string/, 'has description field');
      assert.match(typesContent, /skills:\s*Skill\[\]/, 'has skills field');
      assert.match(typesContent, /tools:\s*Tool\[\]/, 'has tools field');
      assert.match(typesContent, /lastUpdated:\s*Date/, 'has lastUpdated field');
    });

    it('should have types.ts with Skill interface', async () => {
      const typesPath = join(sharedDir, 'src', 'types.ts');
      const typesContent = await readFile(typesPath, 'utf-8');
      
      assert.match(typesContent, /export interface Skill/, 'exports Skill interface');
      assert.match(typesContent, /id:\s*string/, 'has id field');
      assert.match(typesContent, /name:\s*string/, 'has name field');
      assert.match(typesContent, /description:\s*string/, 'has description field');
      assert.match(typesContent, /location:\s*string/, 'has location field');
      assert.match(typesContent, /metadata\?:/, 'has optional metadata field');
    });

    it('should have types.ts with Tool interface', async () => {
      const typesPath = join(sharedDir, 'src', 'types.ts');
      const typesContent = await readFile(typesPath, 'utf-8');
      
      assert.match(typesContent, /export interface Tool/, 'exports Tool interface');
      assert.match(typesContent, /id:\s*string/, 'has id field');
      assert.match(typesContent, /name:\s*string/, 'has name field');
      assert.match(typesContent, /description:\s*string/, 'has description field');
      assert.match(typesContent, /parameters\?:/, 'has optional parameters field');
    });

    it('should export types from index.ts', async () => {
      const indexPath = join(sharedDir, 'src', 'index.ts');
      const indexContent = await readFile(indexPath, 'utf-8');
      
      assert.match(indexContent, /export.*Agent.*from/, 'exports Agent');
      assert.match(indexContent, /export.*Skill.*from/, 'exports Skill');
      assert.match(indexContent, /export.*Tool.*from/, 'exports Tool');
    });
  });

  describe('Build Output', () => {
    it('should have dist directory after build', async () => {
      const distPath = join(sharedDir, 'dist');
      await access(distPath);
    });

    it('should have compiled index.js in dist', async () => {
      const indexPath = join(sharedDir, 'dist', 'index.js');
      await access(indexPath);
    });

    it('should have type definitions in dist', async () => {
      const typesPath = join(sharedDir, 'dist', 'types.d.ts');
      await access(typesPath);
    });
  });

  describe('Backend Integration', () => {
    it('should be listed as dependency in backend package.json', async () => {
      const backendPkgPath = join(process.cwd(), 'backend', 'package.json');
      const backendPkgContent = await readFile(backendPkgPath, 'utf-8');
      const backendPkg = JSON.parse(backendPkgContent);
      
      assert.ok(
        backendPkg.dependencies['@clawdocs/shared'] || 
        backendPkg.devDependencies?.['@clawdocs/shared'],
        'backend depends on @clawdocs/shared'
      );
    });

    it('should re-export types from backend types/index.ts', async () => {
      const typesPath = join(process.cwd(), 'backend', 'src', 'types', 'index.ts');
      const typesContent = await readFile(typesPath, 'utf-8');
      
      assert.match(typesContent, /@clawdocs\/shared/, 'imports from @clawdocs/shared');
    });
  });

  describe('Frontend Integration', () => {
    it('should be listed as dependency in frontend package.json', async () => {
      const frontendPkgPath = join(process.cwd(), 'frontend', 'package.json');
      const frontendPkgContent = await readFile(frontendPkgPath, 'utf-8');
      const frontendPkg = JSON.parse(frontendPkgContent);
      
      assert.ok(
        frontendPkg.dependencies['@clawdocs/shared'] || 
        frontendPkg.devDependencies?.['@clawdocs/shared'],
        'frontend depends on @clawdocs/shared'
      );
    });
  });
});
