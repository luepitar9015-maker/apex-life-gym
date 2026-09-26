import { Router } from 'express';
import {
  getAllPermissions,
  getRolePermissions,
  getUserPermissions,
  updateUserPermissions,
} from './permissions.controller.js';

const router = Router();

router.get('/', getAllPermissions);
router.get('/role/:role', getRolePermissions);
router.get('/user/:userId', getUserPermissions);
router.post('/user/:userId', updateUserPermissions);

export default router;
