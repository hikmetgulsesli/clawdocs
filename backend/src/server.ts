import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const PORT = 4504;

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

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'clawdocs-backend', timestamp: new Date().toISOString() });
});

// API root
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'ClawDocs API', version: '1.0.0' });
});

// Start server function (exported for testing)
export function startServer(): void {
  app.listen(PORT, () => {
    console.log(`ClawDocs backend server running on http://localhost:${PORT}`);
  });
}
