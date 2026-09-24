import { Router } from 'express';
import {
  getLicenses,
  createLicense,
  updateLicense,
  validateLicenseKey,
} from './licenses.controller.js';

const router = Router();

router.get('/', getLicenses);
router.post('/', createLicense);
router.put('/:id', updateLicense);
router.post('/validate', validateLicenseKey);

export default router;
