import { Router } from 'express';
import { getExercises, createExercise } from './exercises.controller.js';
import { authenticateJwt, requireRoles } from '../../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', getExercises);
router.post('/', authenticateJwt, requireRoles(Role.SUPERADMIN, Role.ADMIN, Role.TRAINER), createExercise);

export default router;
