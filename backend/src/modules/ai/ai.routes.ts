import { Router } from 'express';
import { handleAnalyzeBody, handleGenerateMealPlan } from './ai.controller.js';

const router = Router();

router.post('/analyze-body', handleAnalyzeBody);
router.post('/generate-meal-plan', handleGenerateMealPlan);

export default router;
