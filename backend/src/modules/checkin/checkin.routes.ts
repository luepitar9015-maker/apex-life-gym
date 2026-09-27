import { Router } from 'express';
import {
  verifyAccess,
  registerCheckIn,
  registerCheckOut,
  getTodayCheckIns,
} from './checkin.controller.js';

const router = Router();

router.post('/verify', verifyAccess);
router.post('/entry', registerCheckIn);
router.post('/checkout', registerCheckOut);
router.get('/today', getTodayCheckIns);

export default router;
