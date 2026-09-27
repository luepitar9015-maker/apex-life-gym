import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

export const verifyAccess = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.body; // Puede ser documentNumber, código (GYM-1001) o ID

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Debe ingresar un documento o código QR' });
    }

    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { documentNumber: identifier },
          { code: identifier },
          { id: identifier },
        ],
      },
      include: {
        currentPlan: true,
      },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        granted: false,
        reason: 'Socio no encontrado. Por favor registrar en recepción.',
      });
    }

    const now = new Date();
    let isGranted = false;
    let daysRemaining = 0;
    let reason = '';

    if (!member.planEndDate) {
      isGranted = false;
      reason = 'El socio no tiene un plan activo asignado.';
    } else {
      const endDate = new Date(member.planEndDate);
      const diffTime = endDate.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffTime < 0) {
        isGranted = false;
        reason = `Membresía vencida hace ${Math.abs(daysRemaining)} días (${endDate.toLocaleDateString()}).`;
      } else {
        isGranted = true;
        reason = daysRemaining <= 3
          ? `¡Acceso autorizado! Advertencia: Tu membresía vence en ${daysRemaining} día(s).`
          : `¡Acceso autorizado! Membresía vigente (${daysRemaining} días restantes).`;
      }
    }

    // Verificar si ya está dentro hoy sin salir
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const existingActiveEntry = await prisma.checkIn.findFirst({
      where: {
        memberId: member.id,
        checkInTime: { gte: startOfToday },
        checkOutTime: null,
        status: 'GRANTED',
      },
    });

    res.json({
      success: true,
      granted: isGranted,
      reason,
      daysRemaining,
      alreadyInGym: !!existingActiveEntry,
      member: {
        id: member.id,
        code: member.code,
        fullName: `${member.firstName} ${member.lastName}`,
        documentNumber: member.documentNumber,
        status: member.status,
        planName: member.currentPlan?.name || 'Sin plan',
        planEndDate: member.planEndDate,
        emergencyContact: member.emergencyContact,
        emergencyPhone: member.emergencyPhone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error en la verificación de acceso', error: error.message });
  }
};

export const registerCheckIn = async (req: Request, res: Response) => {
  try {
    const { identifier, zone = 'GENERAL' } = req.body;

    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { documentNumber: identifier },
          { code: identifier },
          { id: identifier },
        ],
      },
      include: {
        currentPlan: true,
      },
    });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Socio no encontrado' });
    }

    const now = new Date();
    let isGranted = false;
    let reason = 'Membresía activa';

    if (!member.planEndDate || new Date(member.planEndDate) < now) {
      isGranted = false;
      reason = 'Membresía vencida o sin plan';
    } else {
      isGranted = true;
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        memberId: member.id,
        status: isGranted ? 'GRANTED' : 'DENIED',
        reason,
        zone,
        checkInTime: now,
      },
      include: {
        member: {
          include: { currentPlan: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      granted: isGranted,
      message: isGranted ? 'Ingreso registrado correctamente' : 'Acceso denegado registrado',
      data: checkIn,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al registrar ingreso', error: error.message });
  }
};

export const registerCheckOut = async (req: Request, res: Response) => {
  try {
    const { checkInId, memberId } = req.body;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    const where: any = {
      checkOutTime: null,
      checkInTime: { gte: startOfToday },
    };

    if (checkInId) where.id = checkInId;
    if (memberId) where.memberId = memberId;

    const activeEntry = await prisma.checkIn.findFirst({
      where,
      orderBy: { checkInTime: 'desc' },
    });

    if (!activeEntry) {
      return res.status(404).json({ success: false, message: 'No se encontró un ingreso activo para este socio hoy' });
    }

    const updated = await prisma.checkIn.update({
      where: { id: activeEntry.id },
      data: { checkOutTime: now },
      include: { member: true },
    });

    res.json({
      success: true,
      message: `Salida registrada para ${updated.member.firstName} ${updated.member.lastName}`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al registrar salida', error: error.message });
  }
};

export const getTodayCheckIns = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    const entries = await prisma.checkIn.findMany({
      where: {
        checkInTime: { gte: startOfToday },
      },
      orderBy: { checkInTime: 'desc' },
      include: {
        member: {
          include: { currentPlan: true },
        },
      },
    });

    res.json({ success: true, data: entries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al listar accesos de hoy', error: error.message });
  }
};
