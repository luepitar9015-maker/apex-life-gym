import { Router } from 'express';
import { getDashboardStats } from './dashboard.controller.js';

const router = Router();

router.get('/', getDashboardStats);

export default router;
