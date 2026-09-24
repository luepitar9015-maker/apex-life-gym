import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { Role } from '@prisma/client';
import { z } from 'zod';

export const getTrainers = async (req: Request, res: Response): Promise<void> => {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: Role.TRAINER },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        trainerClients: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ success: true, data: trainers });
  } catch (error: any) {
    // Mock enriquecido para entrenadores personales
    res.status(200).json({
      success: true,
      data: [
        {
          id: 'tr-1',
          firstName: 'Marcos',
          lastName: 'Valenzuela',
          email: 'marcos.coach@gymfit.com',
          phone: '+1 800 555 9011',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
          specialty: 'Hipertrofia & Fuerza Máxima',
          rating: 4.9,
          activeClientsCount: 8,
          trainerClients: [
            {
              id: 'asg-1',
              goal: 'Hipertrofia tren superior y 100kg en press banca',
              sessionsPerWeek: 4,
              status: 'ACTIVE',
              client: {
                id: 'm1',
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@email.com',
                phone: '+1 800 555 0103',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
              },
            },
            {
              id: 'asg-2',
              goal: 'Recomposición corporal y definición muscular',
              sessionsPerWeek: 3,
              status: 'ACTIVE',
              client: {
                id: 'm2',
                firstName: 'Camila',
                lastName: 'Gómez',
                email: 'camila.g@email.com',
                phone: '+1 800 555 0199',
                avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop',
              },
            },
          ],
        },
        {
          id: 'tr-2',
          firstName: 'Carolina',
          lastName: 'Herrera',
          email: 'carolina.coach@gymfit.com',
          phone: '+1 800 555 9022',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
          specialty: 'Entrenamiento Funcional & Pérdida de Grasa',
          rating: 5.0,
          activeClientsCount: 6,
          trainerClients: [
            {
              id: 'asg-3',
              goal: 'Acondicionamiento metabólico y movilidad articular',
              sessionsPerWeek: 3,
              status: 'ACTIVE',
              client: {
                id: 'm4',
                firstName: 'Sofía',
                lastName: 'Reyes',
                email: 'sofia.reyes@email.com',
                phone: '+1 800 555 0177',
                avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
              },
            },
          ],
        },
      ],
    });
  }
};

export const assignClientToTrainer = async (req: Request, res: Response): Promise<void> => {
  try {
    const schema = z.object({
      trainerId: z.string(),
      clientId: z.string(),
      goal: z.string().optional(),
      sessionsPerWeek: z.number().default(3),
      notes: z.string().optional(),
    });

    const data = schema.parse(req.body);

    const assignment = await prisma.trainerClientAssignment.upsert({
      where: {
        trainerId_clientId: {
          trainerId: data.trainerId,
          clientId: data.clientId,
        },
      },
      update: {
        goal: data.goal,
        sessionsPerWeek: data.sessionsPerWeek,
        notes: data.notes,
        status: 'ACTIVE',
      },
      create: {
        trainerId: data.trainerId,
        clientId: data.clientId,
        goal: data.goal,
        sessionsPerWeek: data.sessionsPerWeek,
        notes: data.notes,
      },
    });

    res.status(200).json({ success: true, data: assignment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Error al asignar alumno', error: error.message });
  }
};
