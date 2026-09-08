import { Request, Response } from 'express';
import { analyzeBodyWithAI, generateMealPlanWithAI } from './gemini.service.js';
import { prisma } from '../../config/prisma.js';

export const handleAnalyzeBody = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, weightKg, heightCm, age, gender, frontImageBase64, frontImageUrl, sideImageUrl } = req.body;

    if (!weightKg || !heightCm) {
      res.status(400).json({ success: false, message: 'El peso (kg) y la altura (cm) son requeridos.' });
      return;
    }

    const analysis = await analyzeBodyWithAI({
      userId,
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      age: age ? Number(age) : 28,
      gender: gender || 'MALE',
      frontImageBase64,
      frontImageUrl,
      sideImageUrl,
    });

    // Si se especificó un usuario registrado, guardamos el escaneo en la base de datos
    if (userId) {
      try {
        await prisma.aIBodyScan.create({
          data: {
            userId,
            frontImageUrl: frontImageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
            sideImageUrl: sideImageUrl || null,
            estimatedFatPct: analysis.estimatedFatPct,
            estimatedLeanMassKg: analysis.leanMassKg,
            estimatedBmi: analysis.bmi,
            somatotype: analysis.somatotype,
            postureAssessment: analysis.postureFindings.map((f) => `${f.title}: ${f.detail}`).join(' | '),
            aiRecommendations: analysis.aiRecommendations.join(' • '),
            confidenceScore: analysis.confidenceScore,
          },
        });
      } catch (dbErr) {
        console.warn('Nota: El escaneo se procesó pero no se pudo asociar a la BD (usuario no existe o local):', dbErr);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Escaneo corporal analizado exitosamente por el motor de IA.',
      data: analysis,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al procesar el análisis de IA corporal',
      error: error.message,
    });
  }
};

export const handleGenerateMealPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetCalories, dietPreference, allergies, goal } = req.body;

    const calories = Number(targetCalories) || 2400;

    const plan = await generateMealPlanWithAI({
      targetCalories: calories,
      dietPreference,
      allergies,
      goal,
    });

    res.status(200).json({
      success: true,
      message: 'Plan de comidas generado por IA con éxito.',
      data: plan,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al generar plan nutricional con IA',
      error: error.message,
    });
  }
};
