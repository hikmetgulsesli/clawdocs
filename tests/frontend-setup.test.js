// tests/frontend-setup.test.js
// Tests for frontend React + Vite project setup

import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');

describe('Frontend Setup Tests', () => {
  describe('Package.json', () => {
    let packageJson;

    before(async () => {
      const content = await fs.readFile(path.join(frontendDir, 'package.json'), 'utf-8');
      packageJson = JSON.parse(content);
    });

    it('should have react dependency', () => {
      assert.ok(packageJson.dependencies?.react, 'react should be in dependencies');
    });

    it('should have react-dom dependency', () => {
      assert.ok(packageJson.dependencies?.['react-dom'], 'react-dom should be in dependencies');
    });

    it('should have vite dev dependency', () => {
      assert.ok(packageJson.devDependencies?.vite, 'vite should be in devDependencies');
    });

    it('should have @vitejs/plugin-react dev dependency', () => {
      assert.ok(packageJson.devDependencies?.['@vitejs/plugin-react'], '@vitejs/plugin-react should be in devDependencies');
    });

    it('should have typescript dev dependency', () => {
      assert.ok(packageJson.devDependencies?.typescript, 'typescript should be in devDependencies');
    });

    it('should have @types/react dev dependency', () => {
      assert.ok(packageJson.devDependencies?.['@types/react'], '@types/react should be in devDependencies');
    });

    it('should have @types/react-dom dev dependency', () => {
      assert.ok(packageJson.devDependencies?.['@types/react-dom'], '@types/react-dom should be in devDependencies');
    });

    it('should have dev script', () => {
      assert.ok(packageJson.scripts?.dev, 'dev script should exist');
    });

    it('should have build script', () => {
      assert.ok(packageJson.scripts?.build, 'build script should exist');
    });

    it('should have typecheck script', () => {
      assert.ok(packageJson.scripts?.typecheck, 'typecheck script should exist');
    });
  });

  describe('Vite Config', () => {
    it('should have vite.config.ts file', async () => {
      const viteConfigPath = path.join(frontendDir, 'vite.config.ts');
      await assert.doesNotReject(
        fs.access(viteConfigPath),
        'vite.config.ts should exist'
      );
    });

    it('should configure port 3504', async () => {
      const content = await fs.readFile(path.join(frontendDir, 'vite.config.ts'), 'utf-8');
      assert.ok(content.includes('port: 3504'), 'vite config should set port to 3504');
    });

    it('should use @vitejs/plugin-react', async () => {
      const content = await fs.readFile(path.join(frontendDir, 'vite.config.ts'), 'utf-8');
      assert.ok(content.includes('@vitejs/plugin-react'), 'vite config should import @vitejs/plugin-react');
      assert.ok(content.includes('react()'), 'vite config should use react plugin');
    });
  });

  describe('Entry Point', () => {
    it('should have index.html file', async () => {
      const indexPath = path.join(frontendDir, 'index.html');
      await assert.doesNotReject(
        fs.access(indexPath),
        'index.html should exist'
      );
    });

    it('should load src/main.tsx from index.html', async () => {
      const content = await fs.readFile(path.join(frontendDir, 'index.html'), 'utf-8');
      assert.ok(content.includes('src/main.tsx'), 'index.html should reference src/main.tsx');
    });

    it('should have src/main.tsx file', async () => {
      const mainPath = path.join(frontendDir, 'src', 'main.tsx');
      await assert.doesNotReject(
        fs.access(mainPath),
        'src/main.tsx should exist'
      );
    });

    it('should render App component in main.tsx', async () => {
      const content = await fs.readFile(path.join(frontendDir, 'src', 'main.tsx'), 'utf-8');
      assert.ok(content.includes('import App'), 'main.tsx should import App');
      assert.ok(content.includes('createRoot'), 'main.tsx should use createRoot');
      assert.ok(content.includes('<App'), 'main.tsx should render App component');
    });
  });

  describe('App Component', () => {
    it('should have src/App.tsx file', async () => {
      const appPath = path.join(frontendDir, 'src', 'App.tsx');
      await assert.doesNotReject(
        fs.access(appPath),
        'src/App.tsx should exist'
      );
    });

    it('should have src/App.css file', async () => {
      const cssPath = path.join(frontendDir, 'src', 'App.css');
      await assert.doesNotReject(
        fs.access(cssPath),
        'src/App.css should exist'
      );
    });

    it('should import App.css in App.tsx', async () => {
      const content = await fs.readFile(path.join(frontendDir, 'src', 'App.tsx'), 'utf-8');
      assert.ok(content.includes("import './App.css'"), 'App.tsx should import App.css');
    });

    it('should export App component as default', async () => {
      const content = await fs.readFile(path.join(frontendDir, 'src', 'App.tsx'), 'utf-8');
      assert.ok(content.includes('export default App'), 'App.tsx should export App as default');
    });

    it('should have basic layout structure', async () => {
      const content = await fs.readFile(path.join(frontendDir, 'src', 'App.tsx'), 'utf-8');
      assert.ok(content.includes('app-header'), 'App should have header class');
      assert.ok(content.includes('app-main'), 'App should have main class');
      assert.ok(content.includes('app-footer'), 'App should have footer class');
    });
  });

  describe('TypeScript Config', () => {
    it('should have tsconfig.json file', async () => {
      const tsconfigPath = path.join(frontendDir, 'tsconfig.json');
      await assert.doesNotReject(
        fs.access(tsconfigPath),
        'tsconfig.json should exist'
      );
    });

    it('should have tsconfig.node.json file', async () => {
      const tsconfigNodePath = path.join(frontendDir, 'tsconfig.node.json');
      await assert.doesNotReject(
        fs.access(tsconfigNodePath),
        'tsconfig.node.json should exist'
      );
    });
  });

  describe('Build Output', () => {
    it('should have dist directory after build', async () => {
      const distPath = path.join(frontendDir, 'dist');
      const stat = await fs.stat(distPath).catch(() => null);
      assert.ok(stat?.isDirectory(), 'dist directory should exist');
    });

    it('should have index.html in dist', async () => {
      const indexPath = path.join(frontendDir, 'dist', 'index.html');
      await assert.doesNotReject(
        fs.access(indexPath),
        'dist/index.html should exist'
      );
    });

    it('should have JS assets in dist', async () => {
      const distPath = path.join(frontendDir, 'dist');
      const files = await fs.readdir(distPath);
      const hasAssets = files.some(f => f === 'assets');
      assert.ok(hasAssets, 'dist should have assets directory');
    });
  });
});
