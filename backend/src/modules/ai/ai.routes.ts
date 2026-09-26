import { Router } from 'express';
import { 
  handleAnalyzeBody, 
  handleGenerateMealPlan, 
  handleGenerateRoutine, 
  handleGetGymLocations,
  handleAgentChat
} from './ai.controller.js';

const router = Router();

router.post('/analyze-body', handleAnalyzeBody);
router.post('/generate-meal-plan', handleGenerateMealPlan);
router.post('/generate-routine', handleGenerateRoutine);
router.get('/gym-locations', handleGetGymLocations);
router.post('/agent-chat', handleAgentChat);

export default router;
