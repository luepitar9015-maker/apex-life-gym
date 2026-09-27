import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-gym-jwt-key-2026';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y contraseña requeridos' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas o usuario inactivo' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error en inicio de sesión', error: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      select: { id: true, email: true, name: true, role: true },
    });
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error de usuario', error: error.message });
  }
};
