import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.gymSetting.findUnique({ where: { id: 'singleton' } });
    if (!settings) {
      settings = await prisma.gymSetting.create({
        data: { id: 'singleton' },
      });
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al obtener configuración', error: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { gymName, nit, phone, address, currency, maxCapacity, alertCapacity, openingHours } = req.body;

    const updated = await prisma.gymSetting.upsert({
      where: { id: 'singleton' },
      update: {
        gymName,
        nit,
        phone,
        address,
        currency,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined,
        alertCapacity: alertCapacity ? parseInt(alertCapacity) : undefined,
        openingHours,
      },
      create: {
        id: 'singleton',
        gymName: gymName || 'APEX GYM & FITNESS',
        nit,
        phone,
        address,
        currency: currency || 'COP ($)',
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : 80,
        alertCapacity: alertCapacity ? parseInt(alertCapacity) : 70,
        openingHours,
      },
    });

    res.json({ success: true, message: 'Configuración guardada exitosamente', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al actualizar configuración', error: error.message });
  }
};
