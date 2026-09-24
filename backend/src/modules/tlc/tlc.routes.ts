import { Router } from 'express';
import {
  getTLCProducts,
  getTLCAffiliates,
  getTLCProtocols,
  createTLCProtocol,
  getTLCSales,
  createTLCProduct,
  checkoutTLCStore,
  generateTLCVideoAI,
  chatEditTLCVideo,
  getTLCSocialCalendar,
  scheduleTLCSocialPost,
  publishTLCSocialNow,
} from './tlc.controller.js';
import {
  getHabeasDataPolicy,
  getTLCContacts,
  createTLCContact,
  updateTLCContact,
  revokeTLCContactConsent,
} from './contacts.controller.js';

const router = Router();

// Módulo de Contactos y Prospectos (Ley 1581 de 2012 Colombia / Habeas Data)
router.get('/contacts/policy-text', getHabeasDataPolicy);
router.get('/contacts', getTLCContacts);
router.post('/contacts', createTLCContact);
router.put('/contacts/:id', updateTLCContact);
router.post('/contacts/:id/revoke', revokeTLCContactConsent);

router.get('/products', getTLCProducts);
router.post('/products', createTLCProduct);
router.get('/affiliates', getTLCAffiliates);
router.get('/protocols', getTLCProtocols);
router.post('/protocols', createTLCProtocol);
router.get('/sales', getTLCSales);
router.post('/store/checkout', checkoutTLCStore);

// Módulo TLC AI Content Engine & Social Video Studio
router.post('/ai-video/generate', generateTLCVideoAI);
router.post('/ai-video/chat-edit', chatEditTLCVideo);
router.get('/social/calendar', getTLCSocialCalendar);
router.post('/social/schedule', scheduleTLCSocialPost);
router.post('/social/publish-now', publishTLCSocialNow);

export default router;

