import { Router } from 'express';
import {
  getAllGyms,
  createGym,
  updateGym,
  getAllAdmins,
  createGymAdmin,
} from './gyms.controller.js';

const router = Router();

router.get('/', getAllGyms);
router.post('/', createGym);
router.put('/:id', updateGym);

router.get('/admins', getAllAdmins);
router.post('/admins', createGymAdmin);

export default router;
