import { Router } from 'express';
import { getRoutines, createRoutine, assignRoutineToMember } from './routines.controller.js';

const router = Router();

router.get('/', getRoutines);
router.post('/', createRoutine);
router.post('/assign', assignRoutineToMember);

export default router;
