import { Router } from 'express';
import { register, login, getProfile } from './auth.controller.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateJwt, getProfile);

export default router;
