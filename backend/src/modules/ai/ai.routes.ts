import { Router } from 'express';
import {
  handleGenerateNutrition,
  handleGenerateRoutine,
  handleGenerateDiagnostic,
  getMemberDiagnostic,
  getFoodsCatalog,
  updateMemberFoodPreferences,
  getMemberNutrition,
  updateNutritionPlan,
  updateRoutineByTrainer,
  handleCompleteOnboardingAI,
  handleCreateScanSession,
  handleGetScanSession,
  handleAnalyzeScanSession,
  handleGetNetworkInfo,
} from './ai.controller.js';

const router = Router();

// Información de Red Local para Códigos QR
router.get('/network-info', handleGetNetworkInfo);

// Sesiones de Escaneo Corporal IA (Celular / QR / Web)
router.post('/scan-session', handleCreateScanSession);
router.get('/scan-session/:sessionId', handleGetScanSession);
router.post('/scan-session/:sessionId/analyze', handleAnalyzeScanSession);

// Onboarding y Diagnóstico Biométrico 360° con IA
router.post('/onboarding-360', handleCompleteOnboardingAI);

// Diagnóstico IA (Anamnesis + Escaneo Visual)
router.post('/diagnostic', handleGenerateDiagnostic);
router.get('/diagnostic/member/:memberId', getMemberDiagnostic);

// Catálogo de Alimentos & Preferencias del Socio
router.get('/foods', getFoodsCatalog);
router.put('/member-food-preferences/:memberId', updateMemberFoodPreferences);

// Nutrición & Rutinas
router.post('/generate-nutrition', handleGenerateNutrition);
router.post('/generate-routine', handleGenerateRoutine);
router.get('/nutrition/member/:memberId', getMemberNutrition);
router.put('/nutrition/:id', updateNutritionPlan);
router.put('/routine/:id', updateRoutineByTrainer);

export default router;

