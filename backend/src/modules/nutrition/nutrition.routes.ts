import { Router } from 'express';
import { getFoodItems, createNutritionPlan, getUserNutritionPlan } from './nutrition.controller.js';
import { authenticateJwt, requireRoles } from '../../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/foods', getFoodItems);
router.post('/plan', authenticateJwt, requireRoles(Role.SUPERADMIN, Role.ADMIN, Role.NUTRITIONIST), createNutritionPlan);
router.get('/plan/:userId', authenticateJwt, getUserNutritionPlan);

export default router;
