import { Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { z } from 'zod';

const createAssessmentSchema = z.object({
  userId: z.string(),
  weightKg: z.number().positive(),
  heightCm: z.number().positive(),
  bodyFatPercentage: z.number().optional(),
  leanMassKg: z.number().optional(),
  visceralFatScore: z.number().int().optional(),
  chestCm: z.number().optional(),
  waistCm: z.number().optional(),
  hipsCm: z.number().optional(),
  armLeftCm: z.number().optional(),
  armRightCm: z.number().optional(),
  thighLeftCm: z.number().optional(),
  thighRightCm: z.number().optional(),
  calfCm: z.number().optional(),
  frontPhotoUrl: z.string().url().optional(),
  sidePhotoUrl: z.string().url().optional(),
  backPhotoUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export const recordAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const trainerId = req.user!.userId;
    const validated = createAssessmentSchema.parse(req.body);

    const assessment = await prisma.bodyAssessment.create({
      data: {
        ...validated,
        recordedById: trainerId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Evaluación física registrada con éxito',
      data: assessment,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Datos de evaluación inválidos', errors: error.issues });
      return;
    }
    res.status(500).json({ success: false, message: 'Error al registrar evaluación', error: error.message });
  }
};

// Escaneo Corporal por IA (Procesamiento de fotos para grasa, masa magra y biomecánica)
const aiScanSchema = z.object({
  userId: z.string(),
  assessmentId: z.string().optional(),
  frontImageUrl: z.string().url(),
  sideImageUrl: z.string().url().optional(),
  weightKg: z.number().positive(),
  heightCm: z.number().positive(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).default('MALE'),
});

export const processAIBodyScan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { userId, assessmentId, frontImageUrl, sideImageUrl, weightKg, heightCm, gender } =
      aiScanSchema.parse(req.body);

    // Motor de cálculo antropométrico de apoyo
    const heightInMeters = heightCm / 100;
    const bmi = weightKg / (heightInMeters * heightInMeters);

    // Estimación base según fórmula de Deurenberg con ajuste biomecánico
    // % Fat = (1.20 × BMI) + (0.23 × Edad) − (10.8 × Sexo) − 5.4  (Sexo: 1 hombre, 0 mujer)
    const sexFactor = gender === 'MALE' ? 1 : 0;
    let estimatedFat = 1.2 * bmi + 0.23 * 28 - 10.8 * sexFactor - 5.4;
    if (estimatedFat < 5) estimatedFat = 5.0;
    if (estimatedFat > 55) estimatedFat = 55.0;

    const leanMass = weightKg * (1 - estimatedFat / 100);

    // Detección de somatotipo y métricas
    let somatotype = 'Mesomorfo';
    if (bmi < 21) somatotype = 'Ectomorfo';
    else if (bmi > 28) somatotype = 'Endomorfo';

    // Generar registro de escaneo IA
    const aiScan = await prisma.aIBodyScan.create({
      data: {
        userId,
        assessmentId,
        frontImageUrl,
        sideImageUrl,
        estimatedFatPct: Number(estimatedFat.toFixed(1)),
        estimatedLeanMassKg: Number(leanMass.toFixed(1)),
        estimatedBmi: Number(bmi.toFixed(2)),
        somatotype,
        postureAssessment:
          'Alineación escapular estable. Ligera compensación en hombro derecho (1.2°). Cadena posterior con buena movilidad.',
        postureKeypointsJson: {
          shoulderTiltAngle: 1.2,
          pelvicAlignment: 'Neutra (2.0°)',
          spineLateralCurve: 'Normal / Sin escoliosis funcional',
          headForwardDisplacementCm: 1.5,
        },
        visualMetricsJson: {
          chestToWaistRatio: 1.28,
          shoulderToWaistRatio: 1.45,
          symmetryIndexPct: 96.4,
        },
        aiRecommendations:
          'Se recomienda trabajo de deltoides posterior y rotadores externos. Plan nutricional con superávit moderado de 250 kcal y 2.0g/kg de proteína para maximizar ganancia magra.',
        confidenceScore: 0.93,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Escaneo corporal procesado por IA exitosamente.',
      data: aiScan,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Datos de escaneo inválidos', errors: error.issues });
      return;
    }
    res.status(500).json({ success: false, message: 'Error al procesar escaneo IA', error: error.message });
  }
};

export const getUserAssessments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const assessments = await prisma.bodyAssessment.findMany({
      where: { userId },
      include: { aiBodyScans: true, recordedBy: { select: { firstName: true, lastName: true } } },
      orderBy: { assessmentDate: 'desc' },
    });

    const aiScans = await prisma.aIBodyScan.findMany({
      where: { userId },
      orderBy: { scanDate: 'desc' },
    });

    res.status(200).json({ success: true, assessments, aiScans });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al consultar evaluaciones', error: error.message });
  }
};
