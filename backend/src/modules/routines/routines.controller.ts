import { Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { z } from 'zod';
import { RoutineDifficulty, RoutineGoal } from '@prisma/client';

const createRoutineSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  difficulty: z.nativeEnum(RoutineDifficulty).default(RoutineDifficulty.INTERMEDIATE),
  goal: z.nativeEnum(RoutineGoal).default(RoutineGoal.HYPERTROPHY),
  isTemplate: z.boolean().default(false),
  memberId: z.string().optional(),
  days: z.array(
    z.object({
      dayOrder: z.number().int(),
      name: z.string(),
      description: z.string().optional(),
      exercises: z.array(
        z.object({
          exerciseId: z.string(),
          orderIndex: z.number().int(),
          targetSets: z.number().int().default(4),
          targetReps: z.string().default('8-12'),
          targetRpe: z.number().optional(),
          restSeconds: z.number().int().default(90),
          notes: z.string().optional(),
        })
      ),
    })
  ),
});

export const createRoutine = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const trainerId = req.user!.userId;
    const validated = createRoutineSchema.parse(req.body);

    const routine = await prisma.routine.create({
      data: {
        title: validated.title,
        description: validated.description,
        difficulty: validated.difficulty,
        goal: validated.goal,
        isTemplate: validated.isTemplate,
        createdById: trainerId,
        memberId: validated.memberId,
        days: {
          create: validated.days.map((day) => ({
            dayOrder: day.dayOrder,
            name: day.name,
            description: day.description,
            exercises: {
              create: day.exercises.map((ex) => ({
                exerciseId: ex.exerciseId,
                orderIndex: ex.orderIndex,
                targetSets: ex.targetSets,
                targetReps: ex.targetReps,
                targetRpe: ex.targetRpe,
                restSeconds: ex.restSeconds,
                notes: ex.notes,
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: {
            exercises: { include: { exercise: true } },
          },
        },
      },
    });

    res.status(201).json({ success: true, message: 'Rutina creada con éxito', data: routine });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Datos de rutina inválidos', errors: error.issues });
      return;
    }
    res.status(500).json({ success: false, message: 'Error al crear rutina', error: error.message });
  }
};

export const getRoutines = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { memberId, templatesOnly } = req.query;

    const whereClause: any = {};
    if (templatesOnly === 'true') {
      whereClause.isTemplate = true;
    } else if (memberId) {
      whereClause.memberId = String(memberId);
    }

    const routines = await prisma.routine.findMany({
      where: whereClause,
      include: {
        creator: { select: { firstName: true, lastName: true } },
        days: {
          include: {
            exercises: {
              include: { exercise: true },
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { dayOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, count: routines.length, data: routines });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al consultar rutinas', error: error.message });
  }
};

// Registro de entrenamiento en vivo (Workout Log)
const logWorkoutSchema = z.object({
  routineId: z.string().optional(),
  feelingRate: z.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
  sets: z.array(
    z.object({
      exerciseId: z.string(),
      setNumber: z.number().int(),
      weightKg: z.number(),
      repsCompleted: z.number().int(),
      rpeActual: z.number().optional(),
      isWarmup: z.boolean().default(false),
      isFailed: z.boolean().default(false),
    })
  ),
});

export const recordWorkoutSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const validated = logWorkoutSchema.parse(req.body);

    const workout = await prisma.workoutLog.create({
      data: {
        userId,
        routineId: validated.routineId,
        feelingRate: validated.feelingRate,
        notes: validated.notes,
        completedAt: new Date(),
        sets: {
          create: validated.sets.map((s) => ({
            exerciseId: s.exerciseId,
            setNumber: s.setNumber,
            weightKg: s.weightKg,
            repsCompleted: s.repsCompleted,
            rpeActual: s.rpeActual,
            isWarmup: s.isWarmup,
            isFailed: s.isFailed,
          })),
        },
      },
      include: {
        sets: { include: { exercise: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: '¡Sesión de entrenamiento registrada con éxito!',
      data: workout,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Datos de entrenamiento inválidos', errors: error.issues });
      return;
    }
    res.status(500).json({ success: false, message: 'Error al registrar sesión', error: error.message });
  }
};
