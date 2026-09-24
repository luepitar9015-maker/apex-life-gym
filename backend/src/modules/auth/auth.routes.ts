import { Router } from 'express';
import { register, login, getProfile, getAllUsers, getBusinesses } from './auth.controller.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateJwt, getProfile);
router.get('/users', getAllUsers);
router.get('/businesses', getBusinesses);

export default router;
