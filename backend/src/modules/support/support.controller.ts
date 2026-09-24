import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

/**
 * Listar tickets de soporte (usuario actual o todos si es superadmin)
 */
export const getSupportTickets = async (req: Request, res: Response) => {
  try {
    const { userId, status, priority } = req.query;

    const where: any = {};
    if (userId && typeof userId === 'string') {
      where.userId = userId;
    }
    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }
    if (priority && typeof priority === 'string' && priority !== 'ALL') {
      where.priority = priority;
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: tickets,
      total: tickets.length,
    });
  } catch (error: any) {
    console.error('Error al obtener tickets de soporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al consultar tickets de soporte.',
      error: error.message,
    });
  }
};

/**
 * Crear un nuevo ticket de soporte
 */
export const createSupportTicket = async (req: Request, res: Response) => {
  try {
    const { userId, subject, category = 'SISTEMA', priority = 'MEDIA', description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Asunto y descripción del problema son obligatorios.',
      });
    }

    // Si no se envía userId, buscar el primer usuario disponible o un admin
    let validUserId = userId;
    if (!validUserId) {
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        return res.status(400).json({ success: false, message: 'Usuario no encontrado.' });
      }
      validUserId = firstUser.id;
    }

    // Generar número de ticket único: TK-2026-XXXX
    const count = await prisma.supportTicket.count();
    const ticketNumber = `TK-2026-${String(count + 101).padStart(4, '0')}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId: validUserId,
        subject: subject.trim(),
        category,
        priority,
        status: 'ABIERTO',
        description: description.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: `Ticket ${ticketNumber} generado con éxito. Nuestro equipo técnico responderá a la brevedad.`,
      data: ticket,
    });
  } catch (error: any) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar ticket de soporte.',
      error: error.message,
    });
  }
};

/**
 * Responder o cambiar estado de ticket (Superadmin / Soporte)
 */
export const updateSupportTicket = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status, adminResponse, priority } = req.body;

    const data: any = {};
    if (status) data.status = status;
    if (priority) data.priority = priority;
    if (adminResponse !== undefined) {
      data.adminResponse = adminResponse;
      if (status === 'RESUELTO') {
        data.resolvedAt = new Date();
      }
    }

    const updated = await prisma.supportTicket.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Ticket de soporte actualizado correctamente.',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error al actualizar ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar ticket.',
      error: error.message,
    });
  }
};
