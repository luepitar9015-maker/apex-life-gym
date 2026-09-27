import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

export const getRoutines = async (req: Request, res: Response) => {
  try {
    const routines = await prisma.routine.findMany({
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: [{ dayNumber: 'asc' }],
        },
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: routines });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al listar rutinas', error: error.message });
  }
};

export const createRoutine = async (req: Request, res: Response) => {
  try {
    const { name, description, goal = 'HYPERTROPHY', difficulty = 'INTERMEDIATE', daysPerWeek = 4, exercises = [] } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'El nombre de la rutina es obligatorio' });
    }

    const routine = await prisma.routine.create({
      data: {
        name,
        description,
        goal,
        difficulty,
        daysPerWeek: parseInt(daysPerWeek),
        exercises: {
          create: exercises.map((ex: any) => ({
            exerciseId: ex.exerciseId,
            dayNumber: ex.dayNumber || 1,
            sets: ex.sets || 4,
            reps: ex.reps || '10-12',
            restSeconds: ex.restSeconds || 60,
            notes: ex.notes || null,
          })),
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });

    res.status(201).json({ success: true, message: 'Rutina creada exitosamente', data: routine });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al crear rutina', error: error.message });
  }
};

export const assignRoutineToMember = async (req: Request, res: Response) => {
  try {
    const { memberId, routineId } = req.body;

    if (!memberId || !routineId) {
      return res.status(400).json({ success: false, message: 'Socio y rutina son obligatorios' });
    }

    // Desactivar rutinas anteriores
    await prisma.memberRoutine.updateMany({
      where: { memberId },
      data: { active: false },
    });

    const assignment = await prisma.memberRoutine.create({
      data: {
        memberId,
        routineId,
        active: true,
      },
      include: {
        routine: true,
        member: true,
      },
    });

    res.status(201).json({ success: true, message: 'Rutina asignada exitosamente al socio', data: assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al asignar rutina', error: error.message });
  }
};
