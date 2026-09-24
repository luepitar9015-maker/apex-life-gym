import { Router } from 'express';
import {
  getSupportTickets,
  createSupportTicket,
  updateSupportTicket,
} from './support.controller.js';

const router = Router();

router.get('/tickets', getSupportTickets);
router.post('/tickets', createSupportTicket);
router.put('/tickets/:id', updateSupportTicket);

export default router;
