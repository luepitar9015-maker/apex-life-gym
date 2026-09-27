import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // 1. Configuración de aforo
    const settings = await prisma.gymSetting.findUnique({
      where: { id: 'singleton' },
    });
    const maxCapacity = settings?.maxCapacity || 80;

    // 2. Socios totales y activos
    const totalMembers = await prisma.member.count();
    const activeMembers = await prisma.member.count({
      where: { status: 'ACTIVE' },
    });
    const expiredMembers = await prisma.member.count({
      where: { status: 'EXPIRED' },
    });

    // 3. Socios por vencer en los próximos 7 días
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringSoonMembers = await prisma.member.findMany({
      where: {
        status: 'ACTIVE',
        planEndDate: {
          gte: now,
          lte: sevenDaysFromNow,
        },
      },
      include: {
        currentPlan: true,
      },
      take: 5,
    });

    // 4. Check-ins de hoy
    const todayCheckIns = await prisma.checkIn.count({
      where: {
        checkInTime: {
          gte: startOfToday,
          lte: endOfToday,
        },
        status: 'GRANTED',
      },
    });

    // 5. Personas actualmente en sala (checkin de hoy sin checkout)
    const currentInGym = await prisma.checkIn.count({
      where: {
        checkInTime: {
          gte: startOfToday,
        },
        checkOutTime: null,
        status: 'GRANTED',
      },
    });

    // 6. Ingresos de hoy
    const todayPayments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
        status: 'COMPLETED',
      },
    });
    const todayRevenue = todayPayments.reduce((acc, curr) => acc + curr.amount, 0);

    // 7. Accesos recientes
    const recentCheckIns = await prisma.checkIn.findMany({
      take: 8,
      orderBy: { checkInTime: 'desc' },
      include: {
        member: {
          include: {
            currentPlan: true,
          },
        },
      },
    });

    // 8. Ocupación por zonas
    const zones = [
      { name: 'Sala de Musculación / Pesas', code: 'PESAS', capacity: 35, active: Math.min(currentInGym, 20) },
      { name: 'Área de Cardio', code: 'CARDIO', capacity: 25, active: Math.max(0, currentInGym - 20) },
      { name: 'Salón Funcional / Clases', code: 'CLASES', capacity: 20, active: 0 },
    ];

    const occupancyPercent = Math.min(100, Math.round((currentInGym / maxCapacity) * 100));

    res.json({
      success: true,
      data: {
        gymName: settings?.gymName || 'APEX GYM',
        currency: settings?.currency || 'COP ($)',
        metrics: {
          totalMembers,
          activeMembers,
          expiredMembers,
          expiringSoonCount: expiringSoonMembers.length,
          todayCheckIns,
          currentInGym,
          maxCapacity,
          occupancyPercent,
          todayRevenue,
        },
        zones,
        expiringSoonMembers,
        recentCheckIns,
      },
    });
  } catch (error: any) {
    console.error('Error al obtener dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
};
