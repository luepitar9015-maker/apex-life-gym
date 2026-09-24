import { Router } from 'express';
import { getTrainers, assignClientToTrainer } from './trainers.controller.js';

const router = Router();

router.get('/', getTrainers);
router.post('/assign', assignClientToTrainer);

export default router;
