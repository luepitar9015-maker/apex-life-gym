import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

export const getExercises = async (req: Request, res: Response) => {
  try {
    const { muscleGroup } = req.query;

    const where: any = {};
    if (muscleGroup && typeof muscleGroup === 'string' && muscleGroup !== 'ALL') {
      where.muscleGroup = muscleGroup;
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: exercises });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al listar ejercicios', error: error.message });
  }
};

export const createExercise = async (req: Request, res: Response) => {
  try {
    const { name, muscleGroup, equipment, description } = req.body;

    if (!name || !muscleGroup) {
      return res.status(400).json({ success: false, message: 'Nombre y grupo muscular son obligatorios' });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        muscleGroup,
        equipment: equipment || 'BARBELL',
        description,
      },
    });

    res.status(201).json({ success: true, message: 'Ejercicio creado exitosamente', data: exercise });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al crear ejercicio', error: error.message });
  }
};
