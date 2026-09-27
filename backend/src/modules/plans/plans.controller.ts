import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.membershipPlan.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
    res.json({ success: true, data: plans });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al listar planes', error: error.message });
  }
};

export const createPlan = async (req: Request, res: Response) => {
  try {
    const { name, description, price, durationDays, accessHours = 'ALL_DAY', includesTrainer = false } = req.body;

    if (!name || !price || !durationDays) {
      return res.status(400).json({ success: false, message: 'Nombre, precio y duración son obligatorios' });
    }

    const plan = await prisma.membershipPlan.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        durationDays: parseInt(durationDays),
        accessHours,
        includesTrainer: !!includesTrainer,
      },
    });

    res.status(201).json({ success: true, message: 'Plan creado exitosamente', data: plan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al crear plan', error: error.message });
  }
};
