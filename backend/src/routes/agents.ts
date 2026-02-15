import { Router, Request, Response } from 'express';
import { scanAgents, getAgent } from '../scanner/agentScanner.js';

const router = Router();

/**
 * GET /api/agents
 * Returns array of all scanned agents
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const agents = scanAgents();
    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ 
      error: 'Failed to fetch agents',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/agents/:id
 * Returns a single agent by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agent = getAgent(id);
    
    if (!agent) {
      res.status(404).json({ 
        error: 'Agent not found',
        message: `No agent found with ID: ${id}`
      });
      return;
    }
    
    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ 
      error: 'Failed to fetch agent',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
