import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import agentsRouter from './routes/agents.js';
import skillsRouter from './routes/skills.js';
import healthRouter from './routes/health.js';

const PORT = 4504;

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
export const app = express();

// Middleware: CORS - allow all origins for Mission Control access
app.use(cors());

// Middleware: JSON body parsing
app.use(express.json());

// Middleware: Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// API routes - must come before static files
app.use('/health', healthRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/skills', skillsRouter);

// API root
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'ClawDocs API', version: '1.0.0' });
});

// Static files - serve built frontend from public directory
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req: Request, res: Response) => {
  // Don't serve index.html for API routes that weren't matched
  if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested API resource was not found'
    });
    return;
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Error handling middleware - must be last
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start server function (exported for testing)
export function startServer(): void {
  app.listen(PORT, () => {
    console.log(`ClawDocs backend server running on http://localhost:${PORT}`);
  });
}
