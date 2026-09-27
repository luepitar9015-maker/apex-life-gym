import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        member: true,
        plan: true,
      },
    });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    const todayTotal = payments
      .filter((p) => new Date(p.createdAt) >= startOfToday)
      .reduce((sum, p) => sum + p.amount, 0);

    const cashTotal = payments
      .filter((p) => new Date(p.createdAt) >= startOfToday && p.paymentMethod === 'CASH')
      .reduce((sum, p) => sum + p.amount, 0);

    const digitalTotal = todayTotal - cashTotal;

    res.json({
      success: true,
      data: {
        payments,
        summary: {
          todayTotal,
          cashTotal,
          digitalTotal,
          count: payments.length,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al listar pagos', error: error.message });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { memberId, planId, amount, paymentMethod = 'CASH', notes } = req.body;

    if (!memberId || !amount) {
      return res.status(400).json({ success: false, message: 'Socio y monto son obligatorios' });
    }

    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Socio no encontrado' });
    }

    const invoiceNumber = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await prisma.payment.create({
      data: {
        invoiceNumber,
        memberId,
        planId: planId || null,
        amount: parseFloat(amount),
        paymentMethod,
        notes,
        status: 'COMPLETED',
      },
      include: {
        member: true,
        plan: true,
      },
    });

    res.status(201).json({
      success: true,
      message: `Comprobante de pago ${invoiceNumber} generado exitosamente`,
      data: payment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al registrar pago', error: error.message });
  }
};
