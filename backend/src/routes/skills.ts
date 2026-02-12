import { Router, Request, Response } from 'express';
import { scanSkills, getSkill } from '../scanner/skillScanner.js';

const router = Router();

/**
 * GET /api/skills
 * Returns array of all scanned skills
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const skills = scanSkills();
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ 
      error: 'Failed to fetch skills',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/skills/:name
 * Returns a single skill by name
 */
router.get('/:name', (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const skill = getSkill(name);
    
    if (!skill) {
      res.status(404).json({ 
        error: 'Skill not found',
        message: `No skill found with name: ${name}`
      });
      return;
    }
    
    res.json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ 
      error: 'Failed to fetch skill',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
