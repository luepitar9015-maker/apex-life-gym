import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { z } from 'zod';
import { MealType } from '@prisma/client';

export const getFoodItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    const whereClause: any = {};
    if (category) whereClause.category = String(category);
    if (search) whereClause.name = { contains: String(search), mode: 'insensitive' };

    const foods = await prisma.foodItem.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });

    res.status(200).json({ success: true, count: foods.length, data: foods });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al consultar alimentos', error: error.message });
  }
};

const createNutritionPlanSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  userId: z.string(),
  dailyCaloriesTarget: z.number().positive(),
  targetProteinGrams: z.number().positive(),
  targetCarbsGrams: z.number().positive(),
  targetFatGrams: z.number().positive(),
  waterLitersTarget: z.number().optional().default(2.5),
  notes: z.string().optional(),
  mealDays: z.array(
    z.object({
      dayNumber: z.number().int(),
      dayLabel: z.string(),
      meals: z.array(
        z.object({
          type: z.nativeEnum(MealType),
          customName: z.string(),
          timeHour: z.string().optional(),
          orderIndex: z.number().int().default(1),
          foodItems: z.array(
            z.object({
              foodItemId: z.string(),
              portionGrams: z.number().positive(),
              customNotes: z.string().optional(),
            })
          ),
        })
      ),
    })
  ),
});

export const createNutritionPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const nutritionistId = req.user!.userId;
    const validated = createNutritionPlanSchema.parse(req.body);

    // Desactivar planes anteriores activos del socio
    await prisma.nutritionPlan.updateMany({
      where: { userId: validated.userId, isActive: true },
      data: { isActive: false },
    });

    const plan = await prisma.nutritionPlan.create({
      data: {
        title: validated.title,
        description: validated.description,
        userId: validated.userId,
        nutritionistId,
        dailyCaloriesTarget: validated.dailyCaloriesTarget,
        targetProteinGrams: validated.targetProteinGrams,
        targetCarbsGrams: validated.targetCarbsGrams,
        targetFatGrams: validated.targetFatGrams,
        waterLitersTarget: validated.waterLitersTarget,
        notes: validated.notes,
        mealDays: {
          create: validated.mealDays.map((day) => ({
            dayNumber: day.dayNumber,
            dayLabel: day.dayLabel,
            meals: {
              create: day.meals.map((meal) => ({
                type: meal.type,
                customName: meal.customName,
                timeHour: meal.timeHour,
                orderIndex: meal.orderIndex,
                foodItems: {
                  create: meal.foodItems.map((fi) => ({
                    foodItemId: fi.foodItemId,
                    portionGrams: fi.portionGrams,
                    customNotes: fi.customNotes,
                  })),
                },
              })),
            },
          })),
        },
      },
      include: {
        mealDays: {
          include: {
            meals: {
              include: {
                foodItems: { include: { foodItem: true } },
              },
            },
          },
        },
      },
    });

    res.status(201).json({ success: true, message: 'Plan de nutrición creado con éxito', data: plan });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Datos del plan nutricional inválidos', errors: error.issues });
      return;
    }
    res.status(500).json({ success: false, message: 'Error al crear plan nutricional', error: error.message });
  }
};

export const getUserNutritionPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const activePlan = await prisma.nutritionPlan.findFirst({
      where: { userId, isActive: true },
      include: {
        nutritionist: { select: { firstName: true, lastName: true } },
        mealDays: {
          include: {
            meals: {
              include: {
                foodItems: { include: { foodItem: true } },
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { dayNumber: 'asc' },
        },
      },
    });

    if (!activePlan) {
      res.status(404).json({ success: false, message: 'El usuario no tiene un plan nutricional activo.' });
      return;
    }

    res.status(200).json({ success: true, data: activePlan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al consultar plan nutricional', error: error.message });
  }
};
