import { Router } from 'express';
import { getServerStatus, pingDatabase, purgeServerCache } from './server.controller.js';

const router = Router();

router.get('/status', getServerStatus);
router.post('/ping-db', pingDatabase);
router.post('/purge-cache', purgeServerCache);

export default router;
