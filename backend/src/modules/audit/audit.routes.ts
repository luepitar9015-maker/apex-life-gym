import { Router } from 'express';
import { getAuditLogs, createAuditLog, getAuditStats, exportAuditLogs } from './audit.controller.js';

const router = Router();

router.get('/', getAuditLogs);
router.get('/stats', getAuditStats);
router.get('/export', exportAuditLogs);
router.post('/', createAuditLog);

export default router;
