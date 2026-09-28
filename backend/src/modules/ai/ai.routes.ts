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
} from './ai.controller.js';

const router = Router();

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
