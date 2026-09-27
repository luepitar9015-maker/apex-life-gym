import { Router } from 'express';
import { getPlans, createPlan } from './plans.controller.js';

const router = Router();

router.get('/', getPlans);
router.post('/', createPlan);

export default router;
