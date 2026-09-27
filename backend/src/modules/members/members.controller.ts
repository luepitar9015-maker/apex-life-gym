import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

export const getMembers = async (req: Request, res: Response) => {
  try {
    const { search, status } = req.query;

    const where: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { documentNumber: { contains: search } },
        { code: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const members = await prisma.member.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        currentPlan: true,
      },
    });

    res.json({ success: true, data: members });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al listar socios', error: error.message });
  }
};

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        currentPlan: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        checkIns: {
          orderBy: { checkInTime: 'desc' },
          take: 15,
        },
        routines: {
          where: { active: true },
          include: {
            routine: {
              include: {
                exercises: {
                  include: {
                    exercise: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Socio no encontrado' });
    }

    res.json({ success: true, data: member });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al obtener socio', error: error.message });
  }
};

export const createMember = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      documentNumber,
      documentType = 'CC',
      phone,
      email,
      birthDate,
      gender,
      address,
      emergencyContact,
      emergencyPhone,
      weight,
      height,
      notes,
      planId,
      paymentMethod = 'CASH',
    } = req.body;

    if (!firstName || !lastName || !documentNumber) {
      return res.status(400).json({ success: false, message: 'Nombre, apellido y documento son obligatorios' });
    }

    // Verificar si ya existe documento
    const existing = await prisma.member.findUnique({
      where: { documentNumber },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Ya existe un socio con este documento' });
    }

    // Generar código único correlativo
    const count = await prisma.member.count();
    const code = `GYM-${1000 + count + 1}`;

    let planStartDate: Date | null = null;
    let planEndDate: Date | null = null;
    let selectedPlan = null;

    if (planId) {
      selectedPlan = await prisma.membershipPlan.findUnique({ where: { id: planId } });
      if (selectedPlan) {
        planStartDate = new Date();
        planEndDate = new Date(Date.now() + selectedPlan.durationDays * 24 * 60 * 60 * 1000);
      }
    }

    const member = await prisma.member.create({
      data: {
        code,
        documentNumber,
        documentType,
        firstName,
        lastName,
        phone,
        email,
        birthDate,
        gender,
        address,
        emergencyContact,
        emergencyPhone,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        notes,
        status: planEndDate ? 'ACTIVE' : 'EXPIRED',
        currentPlanId: selectedPlan ? selectedPlan.id : null,
        planStartDate,
        planEndDate,
      },
      include: {
        currentPlan: true,
      },
    });

    // Registrar pago si se seleccionó plan
    if (selectedPlan) {
      const invoiceNumber = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      await prisma.payment.create({
        data: {
          invoiceNumber,
          memberId: member.id,
          planId: selectedPlan.id,
          amount: selectedPlan.price,
          paymentMethod,
          notes: `Pago inicial membresía: ${selectedPlan.name}`,
          status: 'COMPLETED',
        },
      });
    }

    res.status(201).json({ success: true, message: 'Socio registrado exitosamente', data: member });
  } catch (error: any) {
    console.error('Error al crear socio:', error);
    res.status(500).json({ success: false, message: 'Error al registrar socio', error: error.message });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      firstName,
      lastName,
      phone,
      email,
      birthDate,
      gender,
      address,
      emergencyContact,
      emergencyPhone,
      weight,
      height,
      notes,
      medicalNotes,
      status,
    } = req.body;

    const updated = await prisma.member.update({
      where: { id },
      data: {
        firstName,
        lastName,
        phone,
        email,
        birthDate,
        gender,
        address,
        emergencyContact,
        emergencyPhone,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        notes,
        medicalNotes,
        status,
      },
      include: {
        currentPlan: true,
      },
    });

    res.json({ success: true, message: 'Datos actualizados correctamente', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al actualizar socio', error: error.message });
  }
};

export const renewMembership = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { planId, paymentMethod = 'CASH', notes } = req.body;

    const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan de membresía no encontrado' });
    }

    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Socio no encontrado' });
    }

    const now = new Date();
    let startDate = now;
    let endDate = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    if (member.planEndDate && new Date(member.planEndDate) > now) {
      startDate = new Date(member.planEndDate);
      endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    }

    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        currentPlanId: plan.id,
        planStartDate: startDate,
        planEndDate: endDate,
        status: 'ACTIVE',
      },
      include: {
        currentPlan: true,
      },
    });

    const invoiceNumber = `REC-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const payment = await prisma.payment.create({
      data: {
        invoiceNumber,
        memberId: member.id,
        planId: plan.id,
        amount: plan.price,
        paymentMethod,
        notes: notes || `Renovación: ${plan.name}`,
        status: 'COMPLETED',
      },
    });

    res.json({
      success: true,
      message: `Membresía renovada con éxito hasta el ${endDate.toLocaleDateString()}`,
      data: {
        member: updatedMember,
        payment,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al renovar membresía', error: error.message });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.member.delete({ where: { id } });
    res.json({ success: true, message: 'Socio eliminado del sistema' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al eliminar socio', error: error.message });
  }
};
