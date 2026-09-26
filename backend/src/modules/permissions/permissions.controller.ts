import { Request, Response } from 'express';
import { PermissionsService, ALL_SYSTEM_PERMISSIONS } from './permissions.service.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';
import { AuditService } from '../audit/audit.service.js';

export const getAllPermissions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const permissions = PermissionsService.getAllPermissions();
    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener lista de permisos del sistema',
      error: error.message,
    });
  }
};

export const getRolePermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.params;
    if (!Object.values(Role).includes(role as Role)) {
      res.status(400).json({ success: false, message: 'Rol inválido especificado' });
      return;
    }

    const defaultPermissions = PermissionsService.getRolePermissions(role as Role);
    res.status(200).json({
      success: true,
      role,
      data: defaultPermissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al consultar permisos del rol',
      error: error.message,
    });
  }
};

export const getUserPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const role = (req.query.role as Role) || Role.MEMBER;

    const data = await PermissionsService.getUserEffectivePermissions(userId, role);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener permisos del usuario',
      error: error.message,
    });
  }
};

export const updateUserPermissions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const { overrides, targetEmail } = req.body;

    if (!Array.isArray(overrides)) {
      res.status(400).json({
        success: false,
        message: 'El campo overrides debe ser una lista de { permissionCode, isGranted }',
      });
      return;
    }

    const grantedBy = (req.user?.userId as string) || 'usr-superadmin';
    await PermissionsService.setUserCustomPermissions(userId, overrides, grantedBy);

    // Registrar en auditoría
    await AuditService.record({
      userId: (req.user?.userId as string) || 'usr-superadmin',
      userEmail: (req.user?.email as string) || 'admin@apexlifegym.com',
      userName: 'Administrador de Seguridad',
      action: 'PERMISSION_OVERRIDE_UPDATED',
      entity: 'Permission',
      entityId: userId,
      details: {
        targetUserId: userId,
        targetEmail,
        countOverrides: overrides.length,
        overrides,
      },
      severity: 'SECURITY',
      status: 'SUCCESS',
    });

    res.status(200).json({
      success: true,
      message: 'Permisos granulares actualizados exitosamente.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar permisos granulares',
      error: error.message,
    });
  }
};
