import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { MuscleGroup, EquipmentType } from '@prisma/client';
import { z } from 'zod';

export const getExercises = async (req: Request, res: Response): Promise<void> => {
  try {
    const { muscle, equipment, search } = req.query;

    const whereClause: any = {};

    if (muscle) {
      whereClause.OR = [
        { primaryMuscle: muscle as MuscleGroup },
        { secondaryMuscles: { has: muscle as MuscleGroup } },
      ];
    }

    if (equipment) {
      whereClause.equipment = equipment as EquipmentType;
    }

    if (search) {
      whereClause.name = { contains: String(search), mode: 'insensitive' };
    }

    const exercises = await prisma.exercise.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });

    res.status(200).json({ success: true, count: exercises.length, data: exercises });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al obtener ejercicios', error: error.message });
  }
};

const createExerciseSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  primaryMuscle: z.nativeEnum(MuscleGroup),
  secondaryMuscles: z.array(z.nativeEnum(MuscleGroup)).optional().default([]),
  equipment: z.nativeEnum(EquipmentType),
  mechanics: z.string().optional(),
  videoUrl: z.string().url().optional(),
  instructions: z.string().optional(),
});

export const createExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createExerciseSchema.parse(req.body);

    const exercise = await prisma.exercise.create({
      data: validatedData,
    });

    res.status(201).json({ success: true, message: 'Ejercicio creado exitosamente', data: exercise });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.issues });
      return;
    }
    res.status(500).json({ success: false, message: 'Error al crear ejercicio', error: error.message });
  }
};
