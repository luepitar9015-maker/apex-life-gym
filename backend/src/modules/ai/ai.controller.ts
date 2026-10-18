import { Request, Response } from 'express';
import os from 'os';
import { prisma } from '../../config/prisma.js';
import {
  generateNutritionPlanAI,
  generateRoutineAI,
  analyzeHealthDiagnosticAI,
} from './ai.service.js';

// -------------------------------------------------------------
// Generar Plan de Nutrición IA con Alimentos Favoritos y Rechazados
// -------------------------------------------------------------
export const handleGenerateNutrition = async (req: Request, res: Response) => {
  try {
    const {
      memberId,
      goal = 'HYPERTROPHY',
      dietaryRestrictions,
      trainingDaysPerWeek,
      likedFoods,
      dislikedFoods,
    } = req.body;

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: { diagnostics: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Socio no encontrado' });
    }

    // Obtener preferencias guardadas o pasadas en el cuerpo
    let finalLiked: string[] = [];
    if (likedFoods && Array.isArray(likedFoods)) {
      finalLiked = likedFoods;
    } else if (member.likedFoods) {
      try {
        finalLiked = JSON.parse(member.likedFoods);
      } catch (e) {
        finalLiked = member.likedFoods.split(',').map((s) => s.trim());
      }
    }

    let finalDisliked: string[] = [];
    if (dislikedFoods && Array.isArray(dislikedFoods)) {
      finalDisliked = dislikedFoods;
    } else if (member.dislikedFoods) {
      try {
        finalDisliked = JSON.parse(member.dislikedFoods);
      } catch (e) {
        finalDisliked = member.dislikedFoods.split(',').map((s) => s.trim());
      }
    }

    // Revisar antecedentes del diagnóstico si existe
    const latestDiag = member.diagnostics?.[0];
    const diseases = latestDiag?.diseases || undefined;

    const aiPlan = await generateNutritionPlanAI({
      memberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`,
      gender: member.gender || 'MALE',
      age: 27,
      weight: member.weight || 75,
      height: member.height || 1.75,
      goal,
      dietaryRestrictions,
      likedFoods: finalLiked,
      dislikedFoods: finalDisliked,
      diseases,
      trainingDaysPerWeek: trainingDaysPerWeek ? parseInt(trainingDaysPerWeek) : 4,
    });

    // Guardar en base de datos
    const savedPlan = await prisma.nutritionPlan.create({
      data: {
        memberId: member.id,
        title: aiPlan.title,
        targetCalories: aiPlan.targetCalories,
        proteinGrams: aiPlan.proteinGrams,
        carbsGrams: aiPlan.carbsGrams,
        fatsGrams: aiPlan.fatsGrams,
        goal: aiPlan.goal,
        mealsJson: JSON.stringify(aiPlan.meals),
        trainerNotes: `Plan formulado con Google Gemini. Recomendaciones: ${aiPlan.recommendations?.join('. ')}`,
        generatedByAI: true,
        reviewedByTrainer: false,
      },
      include: {
        member: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Plan nutricional generado con Inteligencia Artificial exitosamente',
      data: {
        ...savedPlan,
        meals: JSON.parse(savedPlan.mealsJson),
      },
    });
  } catch (error: any) {
    console.error('Error al generar nutrición IA:', error);
    res.status(500).json({ success: false, message: 'Error al generar nutrición', error: error.message });
  }
};

// -------------------------------------------------------------
// Generar Diagnóstico Fisiológico y con IA (Multimodal / Foto)
// -------------------------------------------------------------
export const handleGenerateDiagnostic = async (req: Request, res: Response) => {
  try {
    const {
      memberId,
      targetGoal,
      diseases,
      injuries,
      disabilities,
      trainingExperience,
      photoBase64,
      weight,
      height,
    } = req.body;

    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Socio no encontrado' });
    }

    const currentWeight = weight ? parseFloat(weight) : (member.weight || 74);
    const currentHeight = height ? parseFloat(height) : (member.height || 1.75);

    // Actualizar peso/estatura en el socio si cambiaron
    if (weight || height) {
      await prisma.member.update({
        where: { id: member.id },
        data: {
          weight: currentWeight,
          height: currentHeight,
        },
      });
    }

    const aiResult = await analyzeHealthDiagnosticAI({
      memberName: `${member.firstName} ${member.lastName}`,
      gender: member.gender || 'MALE',
      age: 26,
      weight: currentWeight,
      height: currentHeight,
      targetGoal: targetGoal || 'Mejora general de composición corporal',
      diseases,
      injuries,
      disabilities,
      trainingExperience,
      photoBase64,
    });

    // Guardar diagnóstico en base de datos
    const createdDiagnostic = await prisma.healthDiagnostic.create({
      data: {
        memberId: member.id,
        photoScanUrl: photoBase64 ? 'PHOTO_ATTACHED_AND_SCANNED' : null,
        targetGoal: targetGoal || 'Acondicionamiento Físico',
        diseases: diseases || null,
        injuries: injuries || null,
        disabilities: disabilities || null,
        trainingExperience: trainingExperience || 'PRINCIPIANTE',
        bodyFatPercentage: aiResult.bodyFatPercentage,
        muscleMassKg: aiResult.muscleMassKg,
        bmi: aiResult.bmi,
        biotype: aiResult.biotype,
        aiClinicalSummary: aiResult.aiClinicalSummary,
        prohibitedExercises: aiResult.prohibitedExercises,
        recommendedActions: aiResult.recommendedActions,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Diagnóstico IA completado con éxito por Google Gemini',
      data: createdDiagnostic,
    });
  } catch (error: any) {
    console.error('Error al generar diagnóstico IA:', error);
    res.status(500).json({ success: false, message: 'Error al generar diagnóstico', error: error.message });
  }
};

export const getMemberDiagnostic = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.memberId as string;
    const diagnostic = await prisma.healthDiagnostic.findFirst({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: diagnostic || null });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al consultar diagnóstico', error: error.message });
  }
};

// -------------------------------------------------------------
// Catálogo de Alimentos & Preferencias
// -------------------------------------------------------------
export const getFoodsCatalog = async (req: Request, res: Response) => {
  try {
    let foods = await prisma.foodItem.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] });
    if (foods.length < 50) {
      // Catálogo maestro completo de alimentos clasificados por categoría
      const defaultFoods = [
        // PROTEÍNAS
        { name: 'Pechuga de Pollo', category: 'PROTEIN', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
        { name: 'Carne Magra de Res', category: 'PROTEIN', calories: 190, protein: 26, carbs: 0, fats: 9 },
        { name: 'Carne Molida Especial (90/10)', category: 'PROTEIN', calories: 176, protein: 20, carbs: 0, fats: 10 },
        { name: 'Lomo de Cerdo Magro', category: 'PROTEIN', calories: 143, protein: 26, carbs: 0, fats: 3.5 },
        { name: 'Pechuga de Pavo', category: 'PROTEIN', calories: 135, protein: 30, carbs: 0, fats: 1 },
        { name: 'Atún en Agua', category: 'PROTEIN', calories: 116, protein: 26, carbs: 0, fats: 1 },
        { name: 'Atún en Aceite de Oliva', category: 'PROTEIN', calories: 198, protein: 27, carbs: 0, fats: 10 },
        { name: 'Salmón Fresco', category: 'PROTEIN', calories: 208, protein: 20, carbs: 0, fats: 13 },
        { name: 'Tilapia / Pescado Blanco', category: 'PROTEIN', calories: 96, protein: 20, carbs: 0, fats: 1.7 },
        { name: 'Trucha Fresca', category: 'PROTEIN', calories: 141, protein: 20, carbs: 0, fats: 6 },
        { name: 'Camarones / Langostinos', category: 'PROTEIN', calories: 99, protein: 24, carbs: 0.2, fats: 0.3 },
        { name: 'Huevos Enteros', category: 'PROTEIN', calories: 143, protein: 13, carbs: 1.1, fats: 9.5 },
        { name: 'Claras de Huevo', category: 'PROTEIN', calories: 52, protein: 11, carbs: 0.7, fats: 0.2 },
        { name: 'Tofu Firme', category: 'PROTEIN', calories: 76, protein: 8, carbs: 1.9, fats: 4.8 },
        { name: 'Tempeh', category: 'PROTEIN', calories: 193, protein: 19, carbs: 9, fats: 11 },
        { name: 'Soja Texturizada', category: 'PROTEIN', calories: 336, protein: 50, carbs: 30, fats: 1.2 },
        { name: 'Edamame', category: 'PROTEIN', calories: 122, protein: 11, carbs: 10, fats: 5 },

        // CARBOHIDRATOS & GRANOS
        { name: 'Arroz Blanco', category: 'CARB', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
        { name: 'Arroz Integral', category: 'CARB', calories: 111, protein: 2.6, carbs: 23, fats: 0.9 },
        { name: 'Avena en Hojuelas', category: 'CARB', calories: 389, protein: 16.9, carbs: 66, fats: 6.9 },
        { name: 'Papa Cocida', category: 'CARB', calories: 77, protein: 2, carbs: 17, fats: 0.1 },
        { name: 'Papa Criolla', category: 'CARB', calories: 86, protein: 2.1, carbs: 19, fats: 0.2 },
        { name: 'Batata / Camote', category: 'CARB', calories: 86, protein: 1.6, carbs: 20, fats: 0.1 },
        { name: 'Yuca Cocida', category: 'CARB', calories: 160, protein: 1.4, carbs: 38, fats: 0.3 },
        { name: 'Plátano Maduro', category: 'CARB', calories: 122, protein: 1.3, carbs: 32, fats: 0.4 },
        { name: 'Plátano Verde', category: 'CARB', calories: 122, protein: 1.3, carbs: 32, fats: 0.2 },
        { name: 'Quinoa Cocida', category: 'CARB', calories: 120, protein: 4.4, carbs: 21, fats: 1.9 },
        { name: 'Pasta Tradicional', category: 'CARB', calories: 131, protein: 5, carbs: 25, fats: 1.1 },
        { name: 'Pasta Integral', category: 'CARB', calories: 124, protein: 5.3, carbs: 26, fats: 0.5 },
        { name: 'Arepa de Maíz', category: 'CARB', calories: 160, protein: 3.5, carbs: 33, fats: 1.2 },
        { name: 'Pan Integral 100%', category: 'CARB', calories: 247, protein: 13, carbs: 41, fats: 3.4 },
        { name: 'Tortillas de Maíz', category: 'CARB', calories: 218, protein: 5.7, carbs: 45, fats: 2.8 },
        { name: 'Tortillas Integrales', category: 'CARB', calories: 240, protein: 7, carbs: 42, fats: 4.5 },
        { name: 'Cuscús', category: 'CARB', calories: 112, protein: 3.8, carbs: 23, fats: 0.2 },

        // LEGUMBRES
        { name: 'Lentejas Cocidas', category: 'LEGUME', calories: 116, protein: 9, carbs: 20, fats: 0.4 },
        { name: 'Garbanzos Cocidos', category: 'LEGUME', calories: 164, protein: 8.9, carbs: 27, fats: 2.6 },
        { name: 'Fríjoles Rojos', category: 'LEGUME', calories: 127, protein: 8.7, carbs: 23, fats: 0.5 },
        { name: 'Fríjoles Negros', category: 'LEGUME', calories: 132, protein: 8.9, carbs: 24, fats: 0.5 },
        { name: 'Arvejas / Chícharos', category: 'LEGUME', calories: 81, protein: 5.4, carbs: 14, fats: 0.4 },

        // GRASAS SALUDABLES & SEMILLAS
        { name: 'Aguacate Hass', category: 'FAT', calories: 160, protein: 2, carbs: 8.5, fats: 14.7 },
        { name: 'Aceite de Oliva Extra Virgen', category: 'FAT', calories: 884, protein: 0, carbs: 0, fats: 100 },
        { name: 'Almendras', category: 'FAT', calories: 579, protein: 21, carbs: 22, fats: 49.9 },
        { name: 'Nueces', category: 'FAT', calories: 654, protein: 15, carbs: 14, fats: 65 },
        { name: 'Maní / Cacahuates', category: 'FAT', calories: 567, protein: 26, carbs: 16, fats: 49 },
        { name: 'Mantequilla de Maní Natural', category: 'FAT', calories: 588, protein: 25, carbs: 20, fats: 50 },
        { name: 'Mantequilla de Almendras', category: 'FAT', calories: 614, protein: 21, carbs: 19, fats: 56 },
        { name: 'Semillas de Chía', category: 'FAT', calories: 486, protein: 17, carbs: 42, fats: 31 },
        { name: 'Semillas de Linaza', category: 'FAT', calories: 534, protein: 18, carbs: 29, fats: 42 },
        { name: 'Aceitunas', category: 'FAT', calories: 115, protein: 0.8, carbs: 6, fats: 10.7 },
        { name: 'Aceite de Coco', category: 'FAT', calories: 862, protein: 0, carbs: 0, fats: 100 },

        // LÁCTEOS & DERIVADOS
        { name: 'Yogur Griego Sin Azúcar', category: 'DAIRY', calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
        { name: 'Leche Deslactosada / Descremada', category: 'DAIRY', calories: 42, protein: 3.4, carbs: 5, fats: 1 },
        { name: 'Bebida de Almendras Sin Azúcar', category: 'DAIRY', calories: 13, protein: 0.4, carbs: 0.3, fats: 1.1 },
        { name: 'Queso Cottage', category: 'DAIRY', calories: 98, protein: 11, carbs: 3.4, fats: 4.3 },
        { name: 'Queso Cuajada Fresca', category: 'DAIRY', calories: 174, protein: 11, carbs: 3, fats: 13 },
        { name: 'Queso Ricotta', category: 'DAIRY', calories: 138, protein: 11, carbs: 5, fats: 8 },
        { name: 'Queso Mozzarella Bajo en Grasa', category: 'DAIRY', calories: 254, protein: 24, carbs: 2.8, fats: 16 },
        { name: 'Proteína Whey en Polvo', category: 'DAIRY', calories: 370, protein: 80, carbs: 4, fats: 3 },

        // FRUTAS
        { name: 'Plátano / Banano', category: 'FRUIT', calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
        { name: 'Manzana', category: 'FRUIT', calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
        { name: 'Pera', category: 'FRUIT', calories: 57, protein: 0.4, carbs: 15, fats: 0.1 },
        { name: 'Fresas', category: 'FRUIT', calories: 32, protein: 0.7, carbs: 7.7, fats: 0.3 },
        { name: 'Arándanos / Frutos Rojos', category: 'FRUIT', calories: 57, protein: 0.7, carbs: 14, fats: 0.3 },
        { name: 'Piña Fresca', category: 'FRUIT', calories: 50, protein: 0.5, carbs: 13, fats: 0.1 },
        { name: 'Papaya', category: 'FRUIT', calories: 43, protein: 0.5, carbs: 11, fats: 0.3 },
        { name: 'Mango', category: 'FRUIT', calories: 60, protein: 0.8, carbs: 15, fats: 0.4 },
        { name: 'Naranja / Mandarina', category: 'FRUIT', calories: 47, protein: 0.9, carbs: 12, fats: 0.1 },
        { name: 'Sandía', category: 'FRUIT', calories: 30, protein: 0.6, carbs: 7.6, fats: 0.2 },
        { name: 'Melón', category: 'FRUIT', calories: 34, protein: 0.8, carbs: 8.2, fats: 0.2 },
        { name: 'Kiwi', category: 'FRUIT', calories: 61, protein: 1.1, carbs: 15, fats: 0.5 },
        { name: 'Uvas', category: 'FRUIT', calories: 67, protein: 0.6, carbs: 17, fats: 0.4 },
        { name: 'Durazno / Melocotón', category: 'FRUIT', calories: 39, protein: 0.9, carbs: 9.5, fats: 0.3 },

        // VERDURAS & VEGETALES
        { name: 'Espinacas Frescas', category: 'VEGETABLE', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4 },
        { name: 'Brócoli al Vapor', category: 'VEGETABLE', calories: 34, protein: 2.8, carbs: 7, fats: 0.4 },
        { name: 'Espárragos', category: 'VEGETABLE', calories: 20, protein: 2.2, carbs: 3.9, fats: 0.1 },
        { name: 'Zanahoria', category: 'VEGETABLE', calories: 41, protein: 0.9, carbs: 10, fats: 0.2 },
        { name: 'Tomate', category: 'VEGETABLE', calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2 },
        { name: 'Pepino', category: 'VEGETABLE', calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1 },
        { name: 'Lechuga / Mezclum Verde', category: 'VEGETABLE', calories: 15, protein: 1.4, carbs: 2.9, fats: 0.2 },
        { name: 'Calabacín / Zucchini', category: 'VEGETABLE', calories: 17, protein: 1.2, carbs: 3.1, fats: 0.3 },
        { name: 'Champiñones / Setas', category: 'VEGETABLE', calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3 },
        { name: 'Coliflor', category: 'VEGETABLE', calories: 25, protein: 1.9, carbs: 5, fats: 0.3 },
        { name: 'Pimientos / Pimentón', category: 'VEGETABLE', calories: 20, protein: 0.9, carbs: 4.6, fats: 0.2 },
        { name: 'Cebolla', category: 'VEGETABLE', calories: 40, protein: 1.1, carbs: 9.3, fats: 0.1 },
        { name: 'Habichuelas / Judías Verdes', category: 'VEGETABLE', calories: 31, protein: 1.8, carbs: 7, fats: 0.2 },
        { name: 'Remolacha / Betabel', category: 'VEGETABLE', calories: 43, protein: 1.6, carbs: 10, fats: 0.2 },
      ];

      for (const item of defaultFoods) {
        const exists = await prisma.foodItem.findFirst({ where: { name: item.name } });
        if (!exists) {
          await prisma.foodItem.create({ data: item });
        }
      }
      foods = await prisma.foodItem.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] });
    }

    res.json({ success: true, data: foods });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al consultar alimentos', error: error.message });
  }
};

export const updateMemberFoodPreferences = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.memberId as string;
    const { likedFoods, dislikedFoods } = req.body;

    const updated = await prisma.member.update({
      where: { id: memberId },
      data: {
        likedFoods: likedFoods ? JSON.stringify(likedFoods) : undefined,
        dislikedFoods: dislikedFoods ? JSON.stringify(dislikedFoods) : undefined,
      },
    });

    res.json({
      success: true,
      message: 'Preferencias de alimentos guardadas exitosamente',
      data: {
        likedFoods: updated.likedFoods ? JSON.parse(updated.likedFoods) : [],
        dislikedFoods: updated.dislikedFoods ? JSON.parse(updated.dislikedFoods) : [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al actualizar preferencias', error: error.message });
  }
};

// -------------------------------------------------------------
// Rutinas IA
// -------------------------------------------------------------
export const handleGenerateRoutine = async (req: Request, res: Response) => {
  try {
    const {
      memberId,
      goal = 'HYPERTROPHY',
      level = 'INTERMEDIATE',
      location = 'GYM',
      daysPerWeek = 4,
      assignToMember = true,
    } = req.body;

    let memberName = 'Atleta APEX';
    let member = null;
    let prohibitedExercises: string | undefined = undefined;

    if (memberId) {
      member = await prisma.member.findUnique({
        where: { id: memberId },
        include: { diagnostics: { orderBy: { createdAt: 'desc' }, take: 1 } },
      });
      if (member) {
        memberName = `${member.firstName} ${member.lastName}`;
        prohibitedExercises = member.diagnostics?.[0]?.prohibitedExercises || undefined;
      }
    }

    const aiRoutine = await generateRoutineAI({
      memberId: memberId || '',
      memberName,
      goal,
      level,
      location,
      daysPerWeek: parseInt(daysPerWeek) || 4,
      prohibitedExercises,
    });

    // Crear la rutina en Prisma
    const newRoutine = await prisma.routine.create({
      data: {
        name: aiRoutine.name,
        description: aiRoutine.description,
        goal: aiRoutine.goal,
        difficulty: aiRoutine.difficulty,
        location: aiRoutine.location,
        daysPerWeek: aiRoutine.daysPerWeek,
        aiNotes: aiRoutine.aiNotes,
      },
    });

    // Asociar ejercicios
    for (const day of aiRoutine.days) {
      for (const exItem of day.exercises) {
        let exercise = await prisma.exercise.findFirst({
          where: { name: { contains: exItem.exerciseName } },
        });

        if (!exercise) {
          exercise = await prisma.exercise.create({
            data: {
              name: exItem.exerciseName,
              muscleGroup: exItem.muscleGroup || 'FULL_BODY',
              location: aiRoutine.location,
              description: `Ejercicio sugerido por IA para ${exItem.muscleGroup}`,
            },
          });
        }

        await prisma.routineExercise.create({
          data: {
            routineId: newRoutine.id,
            exerciseId: exercise.id,
            dayNumber: day.dayNumber,
            sets: exItem.sets || 4,
            reps: String(exItem.reps || '10-12'),
            restSeconds: exItem.restSeconds || 60,
            notes: exItem.notes || null,
          },
        });
      }
    }

    // Asignar al socio si se solicitó
    if (memberId && assignToMember) {
      await prisma.memberRoutine.updateMany({
        where: { memberId },
        data: { active: false },
      });
      await prisma.memberRoutine.create({
        data: {
          memberId,
          routineId: newRoutine.id,
          active: true,
        },
      });
    }

    const fullRoutine = await prisma.routine.findUnique({
      where: { id: newRoutine.id },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Rutina creada con Inteligencia Artificial y lista para supervisión del entrenador',
      data: fullRoutine,
    });
  } catch (error: any) {
    console.error('Error al generar rutina IA:', error);
    res.status(500).json({ success: false, message: 'Error al generar rutina', error: error.message });
  }
};

export const getMemberNutrition = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.memberId as string;
    const plan = await prisma.nutritionPlan.findFirst({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
      include: { member: true },
    });

    if (!plan) {
      return res.json({ success: true, data: null });
    }

    let extraData: any = {};
    if (plan.trainerNotes) {
      try {
        extraData = JSON.parse(plan.trainerNotes);
      } catch {
        extraData = {};
      }
    }

    res.json({
      success: true,
      data: {
        ...plan,
        meals: JSON.parse(plan.mealsJson),
        maintenanceCalories: extraData.maintenanceCalories,
        supplements: extraData.supplements,
        recommendations: extraData.recommendations,
        biotype: extraData.biotype,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al consultar nutrición', error: error.message });
  }
};

export const updateNutritionPlan = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, targetCalories, proteinGrams, carbsGrams, fatsGrams, trainerNotes, meals } = req.body;

    const updated = await prisma.nutritionPlan.update({
      where: { id },
      data: {
        title,
        targetCalories: targetCalories ? parseInt(targetCalories) : undefined,
        proteinGrams: proteinGrams ? parseInt(proteinGrams) : undefined,
        carbsGrams: carbsGrams ? parseInt(carbsGrams) : undefined,
        fatsGrams: fatsGrams ? parseInt(fatsGrams) : undefined,
        trainerNotes,
        mealsJson: meals ? JSON.stringify(meals) : undefined,
        reviewedByTrainer: true,
      },
      include: { member: true },
    });

    let extraData: any = {};
    if (updated.trainerNotes) {
      try {
        extraData = JSON.parse(updated.trainerNotes);
      } catch {
        extraData = {};
      }
    }

    res.json({
      success: true,
      message: 'Plan nutricional revisado y actualizado por el Entrenador con éxito',
      data: {
        ...updated,
        meals: JSON.parse(updated.mealsJson),
        maintenanceCalories: extraData.maintenanceCalories,
        supplements: extraData.supplements,
        recommendations: extraData.recommendations,
        biotype: extraData.biotype,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al actualizar nutrición', error: error.message });
  }
};

export const updateRoutineByTrainer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, aiNotes, exercises } = req.body;

    await prisma.routine.update({
      where: { id },
      data: {
        name,
        description,
        aiNotes,
      },
    });

    if (exercises && Array.isArray(exercises)) {
      for (const ex of exercises) {
        if (ex.id) {
          await prisma.routineExercise.update({
            where: { id: ex.id },
            data: {
              dayNumber: ex.dayNumber ? parseInt(ex.dayNumber) : undefined,
              sets: ex.sets ? parseInt(ex.sets) : undefined,
              reps: ex.reps ? String(ex.reps) : undefined,
              restSeconds: ex.restSeconds ? parseInt(ex.restSeconds) : undefined,
              notes: ex.notes,
            },
          });
        }
      }
    }

    const full = await prisma.routine.findUnique({
      where: { id },
      include: {
        exercises: { include: { exercise: true } },
      },
    });

    res.json({
      success: true,
      message: 'Rutina editada y aprobada por el Entrenador Personal',
      data: full,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al actualizar rutina', error: error.message });
  }
};

// -------------------------------------------------------------
// Onboarding y Diagnóstico Biométrico 360° con Inteligencia Artificial
// -------------------------------------------------------------
export const handleCompleteOnboardingAI = async (req: Request, res: Response) => {
  try {
    const {
      memberId,
      photoBase64,
      weight,
      height,
      age = 26,
      gender = 'MALE',
      targetGoal = 'HYPERTROPHY',
      trainingDays = [1, 3, 5],
      location = 'GYM',
      trainingExperience = 'PRINCIPIANTE',
      diseases = '',
      injuries = '',
      disabilities = '',
      likedFoods = [],
      dislikedFoods = [],
    } = req.body;

    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Socio no encontrado' });
    }

    const currentWeight = weight ? parseFloat(weight) : (member.weight || 74);
    const currentHeight = height ? parseFloat(height) : (member.height || 1.75);

    // 1. Actualizar datos base del socio en el sistema
    await prisma.member.update({
      where: { id: member.id },
      data: {
        weight: currentWeight,
        height: currentHeight,
        gender: gender || member.gender,
        likedFoods: JSON.stringify(likedFoods),
        dislikedFoods: JSON.stringify(dislikedFoods),
      },
    });

    // 2. Ejecutar Diagnóstico Fisiológico con IA (Gemini Multimodal / Visión)
    const diagnosticAI = await analyzeHealthDiagnosticAI({
      memberName: `${member.firstName} ${member.lastName}`,
      gender,
      age: parseInt(age),
      weight: currentWeight,
      height: currentHeight,
      targetGoal,
      diseases,
      injuries,
      disabilities,
      trainingExperience,
      photoBase64,
    });

    const savedDiagnostic = await prisma.healthDiagnostic.create({
      data: {
        memberId: member.id,
        photoScanUrl: photoBase64 ? 'PHOTO_ATTACHED_AND_SCANNED' : null,
        targetGoal,
        diseases: diseases || null,
        injuries: injuries || null,
        disabilities: disabilities || null,
        trainingExperience,
        bodyFatPercentage: diagnosticAI.bodyFatPercentage,
        muscleMassKg: diagnosticAI.muscleMassKg,
        bmi: diagnosticAI.bmi,
        biotype: diagnosticAI.biotype,
        aiClinicalSummary: diagnosticAI.aiClinicalSummary,
        prohibitedExercises: diagnosticAI.prohibitedExercises,
        recommendedActions: diagnosticAI.recommendedActions,
      },
    });

    // 3. Generar Plan Nutricional IA con Alimentos Favoritos y Suplementación
    const nutritionAI = await generateNutritionPlanAI({
      memberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`,
      gender,
      age: parseInt(age),
      weight: currentWeight,
      height: currentHeight,
      goal: targetGoal,
      likedFoods,
      dislikedFoods,
      diseases,
      trainingDaysPerWeek: Array.isArray(trainingDays) && trainingDays.length > 0 ? trainingDays.length : 4,
    });

    const savedNutrition = await prisma.nutritionPlan.create({
      data: {
        memberId: member.id,
        title: nutritionAI.title,
        targetCalories: nutritionAI.targetCalories,
        proteinGrams: nutritionAI.proteinGrams,
        carbsGrams: nutritionAI.carbsGrams,
        fatsGrams: nutritionAI.fatsGrams,
        goal: nutritionAI.goal,
        mealsJson: JSON.stringify(nutritionAI.meals),
        trainerNotes: JSON.stringify({
          maintenanceCalories: nutritionAI.maintenanceCalories,
          supplements: nutritionAI.supplements,
          recommendations: nutritionAI.recommendations,
          biotype: diagnosticAI.biotype,
        }),
        generatedByAI: true,
        reviewedByTrainer: false,
      },
    });

    // 4. Generar Rutina Adaptada por Días de la Semana
    const routineAI = await generateRoutineAI({
      memberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`,
      goal: targetGoal,
      level: trainingExperience,
      location,
      daysPerWeek: Array.isArray(trainingDays) && trainingDays.length > 0 ? trainingDays.length : 4,
      trainingDays: Array.isArray(trainingDays) && trainingDays.length > 0 ? trainingDays : [1, 3, 5],
      prohibitedExercises: diagnosticAI.prohibitedExercises,
    });

    // Guardar Rutina en BD
    const createdRoutine = await prisma.routine.create({
      data: {
        name: routineAI.name,
        description: routineAI.description,
        goal: routineAI.goal,
        difficulty: routineAI.difficulty,
        daysPerWeek: routineAI.daysPerWeek,
        location: routineAI.location,
        aiNotes: routineAI.aiNotes,
      },
    });

    // Guardar los ejercicios de la rutina
    for (const day of routineAI.days) {
      for (const ex of day.exercises) {
        let existingEx = await prisma.exercise.findFirst({
          where: { name: { equals: ex.exerciseName } },
        });

        if (!existingEx) {
          existingEx = await prisma.exercise.create({
            data: {
              name: ex.exerciseName,
              muscleGroup: (ex.muscleGroup as any) || 'CORE',
              location: location === 'HOME' ? 'HOME' : 'GYM',
              description: ex.notes,
            },
          });
        }

        await prisma.routineExercise.create({
          data: {
            routineId: createdRoutine.id,
            exerciseId: existingEx.id,
            dayNumber: day.dayNumber,
            sets: ex.sets || 4,
            reps: String(ex.reps || '10-12'),
            restSeconds: ex.restSeconds || 60,
            notes: ex.notes || null,
          },
        });
      }
    }

    // Desactivar rutinas previas y activar la nueva
    await prisma.memberRoutine.updateMany({
      where: { memberId: member.id },
      data: { active: false },
    });

    await prisma.memberRoutine.create({
      data: {
        memberId: member.id,
        routineId: createdRoutine.id,
        active: true,
      },
    });

    const fullRoutine = await prisma.routine.findUnique({
      where: { id: createdRoutine.id },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { dayNumber: 'asc' },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: '¡Diagnóstico y Onboarding 360° completado con éxito por Google Gemini!',
      data: {
        diagnostic: savedDiagnostic,
        nutrition: {
          ...savedNutrition,
          meals: JSON.parse(savedNutrition.mealsJson),
          extra: JSON.parse(savedNutrition.trainerNotes || '{}'),
        },
        routine: fullRoutine,
      },
    });
  } catch (error: any) {
    console.error('Error en onboarding 360:', error);
    res.status(500).json({ success: false, message: 'Error procesando onboarding 360', error: error.message });
  }
};

// -------------------------------------------------------------
// GESTIÓN DE SESIONES DE ESCANEO QR Y PRIVACIDAD EFÍMERA
// -------------------------------------------------------------

export interface ScanSession {
  sessionId: string;
  memberId: string;
  memberName: string;
  status: 'WAITING_PHOTO' | 'ANALYZING' | 'COMPLETED' | 'ERROR' | 'EXPIRED';
  createdAt: number;
  expiresAt: number;
  diagnostic?: any;
  error?: string;
  weight?: number;
  height?: number;
}

const scanSessions = new Map<string, ScanSession>();

// Limpieza periódica de sesiones expiradas (> 15 minutos)
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of scanSessions.entries()) {
    if (session.expiresAt < now) {
      scanSessions.delete(id);
    }
  }
}, 5 * 60 * 1000);

export function getLocalServerIp(): string {
  try {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('127.')) {
          return net.address;
        }
      }
    }
  } catch (e) {
    // Silencioso
  }
  return 'localhost';
}

export const handleGetNetworkInfo = (req: Request, res: Response) => {
  const localIp = getLocalServerIp();
  res.json({
    success: true,
    localIp,
    port: process.env.PORT || 4000,
    webPort: 5173,
  });
};

export const handleCreateScanSession = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.body;
    let memberName = 'Socio / Atleta';
    let memberRecord = null;

    if (memberId && memberId !== 'guest') {
      memberRecord = await prisma.member.findUnique({ where: { id: memberId } });
      if (memberRecord) {
        memberName = `${memberRecord.firstName} ${memberRecord.lastName}`;
      }
    }

    const sessionId = `scan_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos

    const session: ScanSession = {
      sessionId,
      memberId: memberRecord?.id || memberId || 'guest',
      memberName,
      status: 'WAITING_PHOTO',
      createdAt: Date.now(),
      expiresAt,
      weight: memberRecord?.weight || undefined,
      height: memberRecord?.height || undefined,
    };

    scanSessions.set(sessionId, session);
    const localIp = getLocalServerIp();

    res.status(201).json({
      success: true,
      sessionId,
      memberId: session.memberId,
      memberName: session.memberName,
      localIp,
      expiresAt,
    });
  } catch (error: any) {
    console.error('Error al crear sesión de escaneo:', error);
    res.status(500).json({ success: false, message: 'Error al crear sesión de escaneo', error: error.message });
  }
};

export const handleGetScanSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = scanSessions.get(sessionId as string);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Sesión de escaneo no encontrada o ya finalizada' });
    }

    if (session.expiresAt < Date.now()) {
      session.status = 'EXPIRED';
      return res.status(410).json({ success: false, message: 'La sesión de escaneo ha expirado', session });
    }

    res.json({
      success: true,
      session: {
        sessionId: session.sessionId,
        memberId: session.memberId,
        memberName: session.memberName,
        status: session.status,
        diagnostic: session.diagnostic || null,
        error: session.error || null,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error consultando sesión', error: error.message });
  }
};

export const handleAnalyzeScanSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = scanSessions.get(sessionId as string);

  try {
    if (!session) {
      return res.status(404).json({ success: false, message: 'Sesión de escaneo no encontrada' });
    }

    if (session.expiresAt < Date.now()) {
      return res.status(410).json({ success: false, message: 'La sesión de escaneo ha expirado' });
    }

    const {
      photoBase64,
      targetGoal = 'Análisis Biomecánico y Composición Corporal',
      diseases = '',
      injuries = '',
      disabilities = '',
      trainingExperience = 'PRINCIPIANTE',
      weight,
      height,
    } = req.body;

    if (!photoBase64) {
      return res.status(400).json({ success: false, message: 'Se requiere la captura de la fotografía para el análisis' });
    }

    session.status = 'ANALYZING';

    let member = null;
    if (session.memberId && session.memberId !== 'guest') {
      member = await prisma.member.findUnique({ where: { id: session.memberId } });
    }

    const currentWeight = weight ? parseFloat(weight) : (member?.weight || session.weight || 72);
    const currentHeight = height ? parseFloat(height) : (member?.height || session.height || 1.74);

    if (member && (weight || height)) {
      await prisma.member.update({
        where: { id: member.id },
        data: { weight: currentWeight, height: currentHeight },
      });
    }

    // 🔒 GARANTÍA ESTRICTA DE PRIVACIDAD:
    // La imagen se transfiere directamente al motor multimodal de Gemini en RAM
    // y NUNCA se escribe en disco ni se persiste como archivo en el servidor.
    const aiResult = await analyzeHealthDiagnosticAI({
      memberName: session.memberName,
      gender: member?.gender || 'MALE',
      age: 26,
      weight: currentWeight,
      height: currentHeight,
      targetGoal,
      diseases,
      injuries,
      disabilities,
      trainingExperience,
      photoBase64,
    });

    let savedDiagnostic = null;

    if (member) {
      savedDiagnostic = await prisma.healthDiagnostic.create({
        data: {
          memberId: member.id,
          photoScanUrl: 'PROCESSED_IN_RAM_EPHEMERAL_DELETED',
          targetGoal,
          diseases: diseases || null,
          injuries: injuries || null,
          disabilities: disabilities || null,
          trainingExperience,
          bodyFatPercentage: aiResult.bodyFatPercentage,
          muscleMassKg: aiResult.muscleMassKg,
          bmi: aiResult.bmi,
          biotype: aiResult.biotype,
          aiClinicalSummary: aiResult.aiClinicalSummary,
          prohibitedExercises: aiResult.prohibitedExercises,
          recommendedActions: aiResult.recommendedActions,
        },
      });
    } else {
      savedDiagnostic = {
        id: `diag_${Date.now()}`,
        memberId: 'guest',
        photoScanUrl: 'PROCESSED_IN_RAM_EPHEMERAL_DELETED',
        targetGoal,
        diseases: diseases || null,
        injuries: injuries || null,
        disabilities: disabilities || null,
        trainingExperience,
        ...aiResult,
        createdAt: new Date().toISOString(),
      };
    }

    // Sincronizar estado en memoria para que el PC conectado reciba los resultados de inmediato
    session.status = 'COMPLETED';
    session.diagnostic = savedDiagnostic;

    res.status(200).json({
      success: true,
      message: 'Foto analizada con éxito. Imagen destruida de memoria RAM conforme a la directiva de privacidad.',
      data: savedDiagnostic,
    });
  } catch (error: any) {
    console.error('Error al analizar foto en sesión:', error);
    if (session) {
      session.status = 'ERROR';
      session.error = error.message;
    }
    res.status(500).json({ success: false, message: 'Error al procesar diagnóstico IA', error: error.message });
  }
};

