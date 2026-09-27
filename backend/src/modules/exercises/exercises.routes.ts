import { Router } from 'express';
import { getExercises, createExercise } from './exercises.controller.js';

const router = Router();

router.get('/', getExercises);
router.post('/', createExercise);

export default router;
