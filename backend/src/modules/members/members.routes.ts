import { Router } from 'express';
import { getMembers, getMemberDetails, recordAttendance } from './members.controller.js';
import { authenticateJwt, requireRoles } from '../../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

// Rutas protegidas para staff
router.get('/', authenticateJwt, requireRoles(Role.SUPERADMIN, Role.ADMIN, Role.TRAINER, Role.NUTRITIONIST), getMembers);
router.get('/:id', authenticateJwt, getMemberDetails);
router.post('/check-in', authenticateJwt, requireRoles(Role.SUPERADMIN, Role.ADMIN, Role.TRAINER), recordAttendance);

export default router;
