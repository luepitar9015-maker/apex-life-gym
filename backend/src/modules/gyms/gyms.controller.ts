import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';

export const getAllGyms = async (req: Request, res: Response) => {
  try {
    const gyms = await prisma.gym.findMany({
      include: {
        _count: {
          select: { members: true, users: true },
        },
        users: {
          select: { id: true, name: true, email: true, role: true, active: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: gyms });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al listar gimnasios', error: error.message });
  }
};

export const createGym = async (req: Request, res: Response) => {
  try {
    const { name, code, city, address, phone, maxCapacity } = req.body;

    if (!name || !code || !address) {
      return res.status(400).json({ success: false, message: 'Nombre, código y dirección son obligatorios' });
    }

    const existing = await prisma.gym.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ success: false, message: `Ya existe un gimnasio con el código ${code}` });
    }

    const gym = await prisma.gym.create({
      data: {
        name,
        code: code.toUpperCase().trim(),
        city: city || 'Medellín',
        address,
        phone: phone || null,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : 80,
      },
    });

    res.status(201).json({ success: true, message: 'Gimnasio / Sede creada exitosamente', data: gym });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al crear gimnasio', error: error.message });
  }
};

export const updateGym = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, city, address, phone, maxCapacity, active } = req.body;

    const updated = await prisma.gym.update({
      where: { id },
      data: {
        name,
        city,
        address,
        phone,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
      },
    });

    res.json({ success: true, message: 'Gimnasio actualizado correctamente', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al actualizar gimnasio', error: error.message });
  }
};

// -------------------------------------------------------------
// Administradores de Gimnasio (Gestión por Superusuario)
// -------------------------------------------------------------
export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ['SUPERADMIN', 'ADMIN'] },
      },
      include: {
        gym: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al listar administradores', error: error.message });
  }
};

export const createGymAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, gymId, role = 'ADMIN' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nombre, email y contraseña son obligatorios' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Ya existe un usuario con este correo electrónico' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        gymId: gymId || null,
        active: true,
      },
      include: {
        gym: true,
      },
    });

    res.status(201).json({
      success: true,
      message: `Administrador ${name} creado y asignado con éxito`,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        gym: user.gym,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al crear administrador', error: error.message });
  }
};
