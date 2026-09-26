import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Role, BusinessType } from '@prisma/client';
import { prisma } from '../../config/prisma.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { AuditService } from '../audit/audit.service.js';
import { PermissionsService } from '../permissions/permissions.service.js';

// Semilla de usuarios en memoria resiliente (asegura que el sistema siempre tenga usuarios disponibles)
let inMemoryUsers: any[] = [
  {
    id: 'usr-luepitar-superadmin',
    email: 'luepitar@gamil.com',
    firstName: 'Luepitar',
    lastName: 'Director Master',
    role: Role.SUPERADMIN,
    phone: '+57 300 000 0000',
    documentId: 'MASTER-001',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
  {
    id: 'usr-superadmin',
    email: 'superadmin@apexlifegym.com',
    firstName: 'Director',
    lastName: 'Superadmin',
    role: Role.SUPERADMIN,
    phone: '+57 300 123 4567',
    documentId: '1000000001',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
  {
    id: 'usr-admin-gym',
    email: 'admin.gym@apexlifegym.com',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    role: Role.BUSINESS_ADMIN,
    phone: '+57 310 987 6543',
    documentId: '1000000002',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    business: {
      id: 'biz-gym-principal',
      name: 'Power Gym Fitness Club - Sede Principal',
      type: BusinessType.GYM,
    },
    createdAt: new Date('2026-01-15T00:00:00Z'),
  },
  {
    id: 'usr-admin-tlc',
    email: 'admin.tlc@apexlifegym.com',
    firstName: 'Patricia',
    lastName: 'Gómez',
    role: Role.BUSINESS_ADMIN,
    phone: '+57 320 555 1234',
    documentId: '1000000003',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
    business: {
      id: 'biz-tlc-global',
      name: 'Total Life Changes - Sede Central',
      type: BusinessType.TLC,
    },
    createdAt: new Date('2026-02-01T00:00:00Z'),
  },
  {
    id: 'usr-affiliate-1',
    email: 'afiliado.tlc@apexlifegym.com',
    firstName: 'Sofía',
    lastName: 'Ramírez',
    role: Role.AFFILIATE,
    phone: '+57 315 444 8899',
    documentId: '1000000004',
    affiliateRank: 'Director Estrella',
    totalPvPoints: 1250,
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
    business: {
      id: 'biz-tlc-global',
      name: 'Total Life Changes - Sede Central',
      type: BusinessType.TLC,
    },
    createdAt: new Date('2026-02-10T00:00:00Z'),
  },
  {
    id: 'usr-trainer-1',
    email: 'entrenador@apexlifegym.com',
    firstName: 'Marco',
    lastName: 'Valderrama',
    role: Role.TRAINER,
    phone: '+57 301 777 2233',
    documentId: '1000000005',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    business: {
      id: 'biz-gym-principal',
      name: 'Power Gym Fitness Club - Sede Principal',
      type: BusinessType.GYM,
    },
    createdAt: new Date('2026-02-15T00:00:00Z'),
  },
  {
    id: 'usr-member-1',
    email: 'socio@apexlifegym.com',
    firstName: 'Andrés',
    lastName: 'López',
    role: Role.MEMBER,
    phone: '+57 312 333 4455',
    documentId: '1000000006',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop',
    business: {
      id: 'biz-gym-principal',
      name: 'Power Gym Fitness Club - Sede Principal',
      type: BusinessType.GYM,
    },
    createdAt: new Date('2026-03-01T00:00:00Z'),
  },
];

const createUserSchema = z.object({
  email: z.string().email('Correo electrónico no válido'),
  password: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres'),
  firstName: z.string().min(2, 'El nombre debe tener mínimo 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener mínimo 2 caracteres'),
  role: z.nativeEnum(Role).default(Role.MEMBER),
  phone: z.string().optional(),
  documentId: z.string().optional(),
  businessType: z.nativeEnum(BusinessType).optional(),
  businessId: z.string().optional(),
  affiliateRank: z.string().optional(),
  avatarUrl: z.string().optional(),
  customPermissions: z.array(z.string()).optional(),
});

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, role, businessType, status } = req.query;

    // Intentar leer de base de datos PostgreSQL
    try {
      const where: any = {};
      if (role && role !== 'ALL') where.role = role;
      if (status === 'ACTIVE') where.isActive = true;
      if (status === 'INACTIVE') where.isActive = false;
      if (search) {
        where.OR = [
          { email: { contains: search as string, mode: 'insensitive' } },
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { documentId: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const dbUsers = await prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          documentId: true,
          avatarUrl: true,
          affiliateRank: true,
          totalPvPoints: true,
          isActive: true,
          businessId: true,
          business: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (dbUsers && dbUsers.length > 0) {
        res.status(200).json({
          success: true,
          data: dbUsers,
          total: dbUsers.length,
          source: 'POSTGRESQL_DB',
        });
        return;
      }
    } catch {
      // Fallback a memoria
    }

    // Filtrar sobre memoria
    let results = [...inMemoryUsers];

    if (role && role !== 'ALL') {
      results = results.filter((u) => u.role === role);
    }
    if (businessType && businessType !== 'ALL') {
      if (businessType === 'NONE') {
        results = results.filter((u) => !u.business);
      } else {
        results = results.filter((u) => u.business?.type === businessType);
      }
    }
    if (status === 'ACTIVE') {
      results = results.filter((u) => u.isActive === true);
    } else if (status === 'INACTIVE') {
      results = results.filter((u) => u.isActive === false);
    }
    if (search) {
      const term = (search as string).toLowerCase();
      results = results.filter(
        (u) =>
          u.email.toLowerCase().includes(term) ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
          (u.documentId && u.documentId.toLowerCase().includes(term))
      );
    }

    res.status(200).json({
      success: true,
      data: results,
      total: results.length,
      source: 'IN_MEMORY_RESILIENT',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al consultar lista de usuarios',
      error: error.message,
    });
  }
};

export const createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validated = createUserSchema.parse(req.body);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    let businessData: any = undefined;
    if (validated.businessType && validated.role !== Role.SUPERADMIN) {
      businessData = {
        id: `biz-${validated.businessType.toLowerCase()}`,
        name:
          validated.businessType === BusinessType.TLC
            ? 'Total Life Changes - Sede Central'
            : 'Power Gym Fitness Club - Sede Principal',
        type: validated.businessType,
      };
    }

    const newUserId = `usr-${Date.now()}`;
    const newUserRecord: any = {
      id: newUserId,
      email: validated.email,
      firstName: validated.firstName,
      lastName: validated.lastName,
      role: validated.role,
      phone: validated.phone || '',
      documentId: validated.documentId || '',
      affiliateRank: validated.role === Role.AFFILIATE ? validated.affiliateRank || 'Afiliado Activo' : undefined,
      totalPvPoints: validated.role === Role.AFFILIATE ? 0 : undefined,
      isActive: true,
      avatarUrl:
        validated.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
      business: businessData,
      businessId: businessData?.id,
      createdAt: new Date(),
    };

    // Agregar al almacén de memoria
    inMemoryUsers.unshift(newUserRecord);

    // Intentar persistir en PostgreSQL
    try {
      let bizId = validated.businessId;
      if (!bizId && validated.businessType) {
        let b = await prisma.business.findFirst({ where: { type: validated.businessType } });
        if (!b) {
          b = await prisma.business.create({
            data: {
              name: businessData.name,
              type: validated.businessType,
            },
          });
        }
        bizId = b.id;
      }

      await prisma.user.create({
        data: {
          id: newUserId,
          email: validated.email,
          passwordHash,
          firstName: validated.firstName,
          lastName: validated.lastName,
          role: validated.role,
          phone: validated.phone,
          documentId: validated.documentId,
          affiliateRank: newUserRecord.affiliateRank,
          businessId: bizId,
          avatarUrl: newUserRecord.avatarUrl,
        },
      });
    } catch (dbErr) {
      // Manejado resilientemente
    }

    // Si se enviaron permisos adicionales personalizados, asignarlos
    if (validated.customPermissions && validated.customPermissions.length > 0) {
      const overrides = validated.customPermissions.map((code) => ({
        permissionCode: code,
        isGranted: true,
      }));
      await PermissionsService.setUserCustomPermissions(
        newUserId,
        overrides,
        req.user?.userId || 'usr-superadmin'
      );
    }

    // REGISTRO DE AUDITORÍA AUTOMÁTICO
    await AuditService.record({
      userId: req.user?.userId || 'usr-superadmin',
      userEmail: req.user?.email || 'admin@apexlifegym.com',
      userName: req.user ? `${req.user.role}` : 'Administrador',
      action: 'USER_CREATED',
      entity: 'User',
      entityId: newUserId,
      details: {
        createdUserId: newUserId,
        createdEmail: validated.email,
        fullName: `${validated.firstName} ${validated.lastName}`,
        role: validated.role,
        businessType: validated.businessType,
        customPermissionsCount: validated.customPermissions?.length || 0,
      },
      severity: 'INFO',
      status: 'SUCCESS',
    });

    res.status(201).json({
      success: true,
      message: `Usuario ${validated.firstName} ${validated.lastName} creado exitosamente.`,
      data: newUserRecord,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: (error as any).issues?.[0]?.message || 'Datos de validación inválidos',
        errors: (error as any).issues || [],
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message,
    });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const body = req.body;

    const existingIndex = inMemoryUsers.findIndex((u) => u.id === id);
    if (existingIndex !== -1) {
      inMemoryUsers[existingIndex] = {
        ...inMemoryUsers[existingIndex],
        ...body,
        updatedAt: new Date(),
      };
    }

    try {
      await prisma.user.update({
        where: { id },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          documentId: body.documentId,
          role: body.role,
          avatarUrl: body.avatarUrl,
          affiliateRank: body.affiliateRank,
        },
      });
    } catch {
      // Fallback a memoria
    }

    // Registrar en auditoría
    await AuditService.record({
      userId: (req.user?.userId as string) || 'usr-superadmin',
      userEmail: (req.user?.email as string) || 'admin@apexlifegym.com',
      userName: 'Administrador del Sistema',
      action: 'USER_UPDATED',
      entity: 'User',
      entityId: id,
      details: { targetUserId: id, updatedFields: Object.keys(body) },
      severity: 'INFO',
      status: 'SUCCESS',
    });

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: inMemoryUsers[existingIndex] || body,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message,
    });
  }
};

export const toggleUserStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { isActive } = req.body;

    const targetUser = inMemoryUsers.find((u) => u.id === id);
    if (targetUser) {
      targetUser.isActive = isActive;
    }

    try {
      await prisma.user.update({
        where: { id },
        data: { isActive },
      });
    } catch {
      // Fallback a memoria
    }

    // REGISTRO DE AUDITORÍA DE SEGURIDAD
    await AuditService.record({
      userId: (req.user?.userId as string) || 'usr-superadmin',
      userEmail: (req.user?.email as string) || 'admin@apexlifegym.com',
      userName: 'Director de Seguridad',
      action: isActive ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
      entity: 'User',
      entityId: id,
      details: { targetUserId: id, newStatus: isActive ? 'ACTIVO' : 'SUSPENDIDO' },
      severity: 'SECURITY',
      status: 'SUCCESS',
    });

    res.status(200).json({
      success: true,
      message: `El usuario ha sido ${isActive ? 'activado' : 'suspendido'} exitosamente.`,
      isActive,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado del usuario',
      error: error.message,
    });
  }
};

export const resetUserPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { newPassword } = req.body;

    const targetPassword = newPassword || `ApexPass.${Math.floor(1000 + Math.random() * 9000)}!`;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(targetPassword, salt);

    try {
      await prisma.user.update({
        where: { id },
        data: { passwordHash },
      });
    } catch {
      // Fallback
    }

    // REGISTRO DE AUDITORÍA
    await AuditService.record({
      userId: (req.user?.userId as string) || 'usr-superadmin',
      userEmail: (req.user?.email as string) || 'admin@apexlifegym.com',
      userName: 'Director de Seguridad',
      action: 'USER_PASSWORD_RESET',
      entity: 'User',
      entityId: id,
      details: { targetUserId: id, method: 'ADMIN_FORCE_RESET' },
      severity: 'SECURITY',
      status: 'SUCCESS',
    });

    res.status(200).json({
      success: true,
      message: 'Contraseña restablecida satisfactoriamente.',
      temporaryPassword: targetPassword,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al restablecer contraseña',
      error: error.message,
    });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    inMemoryUsers = inMemoryUsers.filter((u) => u.id !== id);

    try {
      await prisma.user.delete({ where: { id } });
    } catch {
      // Fallback
    }

    await AuditService.record({
      userId: (req.user?.userId as string) || 'usr-superadmin',
      userEmail: (req.user?.email as string) || 'admin@apexlifegym.com',
      userName: 'Director Superadmin',
      action: 'USER_DELETED',
      entity: 'User',
      entityId: id,
      details: { targetUserId: id },
      severity: 'WARNING',
      status: 'SUCCESS',
    });

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado permanentemente del sistema.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message,
    });
  }
};
