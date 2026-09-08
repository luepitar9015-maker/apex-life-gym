import { Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { z } from 'zod';
import { MembershipStatus } from '@prisma/client';

export const getMembers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { search, status } = req.query;

    const whereClause: any = { role: 'MEMBER' };

    if (search) {
      whereClause.OR = [
        { firstName: { contains: String(search), mode: 'insensitive' } },
        { lastName: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
        { documentId: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (status) {
      whereClause.subscriptions = {
        some: { status: status as MembershipStatus },
      };
    }

    const members = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        documentId: true,
        gender: true,
        birthDate: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        subscriptions: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: { membershipPlan: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, count: members.length, data: members });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al obtener socios', error: error.message });
  }
};

export const getMemberDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    const member = await prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: {
          include: { membershipPlan: true },
          orderBy: { createdAt: 'desc' },
        },
        assignedRoutines: {
          include: {
            days: {
              include: {
                exercises: { include: { exercise: true } },
              },
            },
          },
        },
        bodyAssessments: {
          orderBy: { assessmentDate: 'desc' },
          take: 5,
        },
        aiBodyScans: {
          orderBy: { scanDate: 'desc' },
          take: 5,
        },
        nutritionPlans: {
          where: { isActive: true },
          include: {
            mealDays: {
              include: {
                meals: {
                  include: { foodItems: { include: { foodItem: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!member) {
      res.status(404).json({ success: false, message: 'Socio no encontrado.' });
      return;
    }

    res.status(200).json({ success: true, data: member });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al obtener detalles del socio', error: error.message });
  }
};

const checkInSchema = z.object({
  identifier: z.string().min(1), // email, DNI o ID de usuario
  method: z.string().default('QR_CODE'),
});

export const recordAttendance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { identifier, method } = checkInSchema.parse(req.body);

    const member = await prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { email: identifier },
          { documentId: identifier },
        ],
      },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { membershipPlan: true },
          take: 1,
        },
      },
    });

    if (!member) {
      res.status(404).json({ success: false, message: 'Socio no encontrado con el identificador proporcionado.' });
      return;
    }

    const hasActiveSubscription = member.subscriptions.length > 0;
    const activeSub = member.subscriptions[0];

    // Registrar la asistencia
    const attendance = await prisma.attendanceLog.create({
      data: {
        userId: member.id,
        method,
      },
    });

    res.status(200).json({
      success: true,
      message: hasActiveSubscription ? 'Acceso permitido. ¡Buen entrenamiento!' : 'Advertencia: Membresía inactiva o vencida.',
      accessGranted: hasActiveSubscription,
      member: {
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        membership: activeSub ? activeSub.membershipPlan.name : 'Sin plan activo',
        expiresAt: activeSub ? activeSub.endDate : null,
      },
      checkInTime: attendance.checkInTime,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: 'Datos de check-in inválidos', errors: error.issues });
      return;
    }
    res.status(500).json({ success: false, message: 'Error al registrar asistencia', error: error.message });
  }
};
