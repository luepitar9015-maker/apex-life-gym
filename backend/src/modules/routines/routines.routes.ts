import { Router } from 'express';
import { createRoutine, getRoutines, recordWorkoutSession } from './routines.controller.js';
import { authenticateJwt, requireRoles } from '../../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', authenticateJwt, getRoutines);
router.post('/', authenticateJwt, requireRoles(Role.SUPERADMIN, Role.ADMIN, Role.TRAINER), createRoutine);
router.post('/log-session', authenticateJwt, recordWorkoutSession);

export default router;
