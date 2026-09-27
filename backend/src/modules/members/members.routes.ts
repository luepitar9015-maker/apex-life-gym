import { Router } from 'express';
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  renewMembership,
  deleteMember,
} from './members.controller.js';

const router = Router();

router.get('/', getMembers);
router.get('/:id', getMemberById);
router.post('/', createMember);
router.put('/:id', updateMember);
router.post('/:id/renew', renewMembership);
router.delete('/:id', deleteMember);

export default router;
