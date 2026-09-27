import { Router } from 'express';
import { getPayments, createPayment } from './payments.controller.js';

const router = Router();

router.get('/', getPayments);
router.post('/', createPayment);

export default router;
