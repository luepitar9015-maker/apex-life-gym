import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  resetUserPassword,
  deleteUser,
} from './users.controller.js';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id/status', toggleUserStatus);
router.post('/:id/reset-password', resetUserPassword);
router.delete('/:id', deleteUser);

export default router;
