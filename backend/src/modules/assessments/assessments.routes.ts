import { Router } from 'express';
import { recordAssessment, processAIBodyScan, getUserAssessments } from './assessments.controller.js';
import { authenticateJwt, requireRoles } from '../../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

router.post('/', authenticateJwt, requireRoles(Role.SUPERADMIN, Role.ADMIN, Role.TRAINER), recordAssessment);
router.post('/ai-scan', authenticateJwt, processAIBodyScan);
router.get('/user/:userId', authenticateJwt, getUserAssessments);

export default router;
