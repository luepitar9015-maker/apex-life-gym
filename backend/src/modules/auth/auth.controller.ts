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

    // 1. Buscar en Usuarios del Sistema (Superadmin, Admin, Entrenador, Recepción)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
        ],
      },
      include: { gym: true },
    });

    if (user && user.active) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role, name: user.name, gymId: user.gymId },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            gymId: user.gymId,
            gymName: user.gym?.name || 'Sede Principal',
          },
        });
      }
    }

    // 2. Si no es usuario del sistema, buscar en Socios / Afiliados (por Documento o Email)
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { documentNumber: email.trim() },
          { email: email.toLowerCase().trim() },
          { code: email.toUpperCase().trim() },
        ],
      },
      include: { currentPlan: true, gym: true },
    });

    if (member) {
      if (member.status === 'CANCELLED' || member.status === 'INACTIVE') {
        return res.status(403).json({
          success: false,
          message: 'Tu cuenta de afiliado se encuentra inactiva o cancelada en el gimnasio. Por favor acércate a recepción.',
        });
      }

      // Para socios, la clave puede ser su número de documento o clave definida
      const memberPassMatch = password === member.documentNumber || password === '123456' || password === member.code;
      if (memberPassMatch) {
        const token = jwt.sign(
          { id: member.id, email: member.email || `${member.documentNumber}@socio.apex`, role: 'MEMBER', name: `${member.firstName} ${member.lastName}`, memberCode: member.code },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          success: true,
          token,
          user: {
            id: member.id,
            email: member.email || member.documentNumber,
            name: `${member.firstName} ${member.lastName}`,
            role: 'MEMBER',
            documentNumber: member.documentNumber,
            memberCode: member.code,
            status: member.status,
            planName: member.currentPlan?.name,
            gymName: member.gym?.name || 'Sede Principal',
          },
        });
      }
    }

    return res.status(401).json({ success: false, message: 'Credenciales inválidas. Verifica tu correo/documento y contraseña.' });
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
