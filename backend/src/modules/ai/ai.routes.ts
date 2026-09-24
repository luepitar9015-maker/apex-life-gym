import { Router } from 'express';
import { 
  handleAnalyzeBody, 
  handleGenerateMealPlan, 
  handleGenerateRoutine, 
  handleGetGymLocations 
} from './ai.controller.js';

const router = Router();

router.post('/analyze-body', handleAnalyzeBody);
router.post('/generate-meal-plan', handleGenerateMealPlan);
router.post('/generate-routine', handleGenerateRoutine);
router.get('/gym-locations', handleGetGymLocations);

export default router;
