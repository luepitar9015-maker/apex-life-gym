import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

// Lista de módulos base disponibles en el sistema
export const ALL_SYSTEM_MODULES = [
  { id: 'gym_dashboard', label: 'Panel Gimnasio & Métricas' },
  { id: 'members', label: 'Gestión de Socios & Pagos' },
  { id: 'checkin', label: 'Control de Asistencia & QR / Torniquete' },
  { id: 'ai_scans', label: 'Escáner Biométrico con IA 3D' },
  { id: 'routines', label: 'Rutinas & Series de Entrenamiento' },
  { id: 'nutrition', label: 'Planes de Nutrición Inteligente' },
  { id: 'trainers', label: 'Entrenadores Personales (1-on-1)' },
  { id: 'tlc_network', label: 'TLC Red de Afiliados & Puntos PV' },
  { id: 'tlc_contacts', label: 'Registro de Contactos Ley 1581 (Colombia)' },
  { id: 'tlc_store', label: 'Tienda Virtual TLC con Enlace de Afiliado' },
  { id: 'tlc_video_ai', label: 'Generador de Video IA para Redes Sociales' },
];

/**
 * Obtener lista de licencias (Superadmin)
 */
export const getLicenses = async (req: Request, res: Response) => {
  try {
    const licenses = await prisma.systemLicense.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: licenses.map((l) => ({
        ...l,
        modulesAllowed: JSON.parse(l.modulesAllowed || '[]'),
      })),
      availableModules: ALL_SYSTEM_MODULES,
    });
  } catch (error: any) {
    console.error('Error al obtener licencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al consultar licencias.',
      error: error.message,
    });
  }
};

/**
 * Crear y activar una nueva licencia (Superadmin)
 */
export const createLicense = async (req: Request, res: Response) => {
  try {
    const {
      businessName,
      contactEmail,
      contactPhone,
      planType = 'GYM_TLC_PRO',
      durationDays = 365,
      maxUsers = 100,
      modulesAllowed = [],
      notes,
    } = req.body;

    if (!businessName || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Nombre de empresa y correo de contacto son requeridos.',
      });
    }

    // Generar clave de licencia profesional única: EJ: TLC-PRO-2026-AB12-XY89
    const prefix = planType.startsWith('TLC') ? 'TLC' : 'GYM';
    const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const licenseKey = `${prefix}-PRO-2026-${rand1}-${rand2}`;

    const startDate = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(durationDays));

    const finalModules = Array.isArray(modulesAllowed) && modulesAllowed.length > 0
      ? modulesAllowed
      : ALL_SYSTEM_MODULES.map((m) => m.id);

    const license = await prisma.systemLicense.create({
      data: {
        licenseKey,
        businessName: businessName.trim(),
        contactEmail: contactEmail.trim().toLowerCase(),
        contactPhone: contactPhone?.trim() || null,
        planType,
        status: 'ACTIVE',
        maxUsers: Number(maxUsers) || 100,
        startDate,
        expiresAt,
        modulesAllowed: JSON.stringify(finalModules),
        notes: notes?.trim() || null,
      },
    });

    res.status(201).json({
      success: true,
      message: `¡Licencia activada con éxito! Clave: ${licenseKey}`,
      data: {
        ...license,
        modulesAllowed: finalModules,
      },
    });
  } catch (error: any) {
    console.error('Error al crear licencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al activar la licencia.',
      error: error.message,
    });
  }
};

/**
 * Actualizar estado de una licencia (Activar / Suspender / Extender)
 */
export const updateLicense = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status, extendDays, modulesAllowed, notes, maxUsers } = req.body;

    const existing = await prisma.systemLicense.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Licencia no encontrada.' });
    }

    let newExpiresAt = existing.expiresAt;
    if (extendDays && Number(extendDays) > 0) {
      const baseDate = new Date(existing.expiresAt) > new Date() ? new Date(existing.expiresAt) : new Date();
      baseDate.setDate(baseDate.getDate() + Number(extendDays));
      newExpiresAt = baseDate;
    }

    const updated = await prisma.systemLicense.update({
      where: { id },
      data: {
        ...(status && { status }),
        expiresAt: newExpiresAt,
        ...(modulesAllowed && { modulesAllowed: JSON.stringify(modulesAllowed) }),
        ...(notes !== undefined && { notes }),
        ...(maxUsers && { maxUsers: Number(maxUsers) }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Licencia actualizada correctamente.',
      data: {
        ...updated,
        modulesAllowed: JSON.parse(updated.modulesAllowed || '[]'),
      },
    });
  } catch (error: any) {
    console.error('Error al actualizar licencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la licencia.',
      error: error.message,
    });
  }
};

/**
 * Validar licencia del sistema por clave
 */
export const validateLicenseKey = async (req: Request, res: Response) => {
  try {
    const { licenseKey } = req.body;
    if (!licenseKey) {
      return res.status(400).json({ success: false, message: 'Clave de licencia requerida.' });
    }

    const license = await prisma.systemLicense.findUnique({
      where: { licenseKey: licenseKey.trim().toUpperCase() },
    });

    if (!license) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'La clave de licencia ingresada no existe.',
      });
    }

    const now = new Date();
    const isExpired = new Date(license.expiresAt) < now;
    const isActive = license.status === 'ACTIVE' && !isExpired;

    res.status(200).json({
      success: true,
      valid: isActive,
      license: {
        ...license,
        isExpired,
        modulesAllowed: JSON.parse(license.modulesAllowed || '[]'),
      },
    });
  } catch (error: any) {
    console.error('Error al validar licencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar licencia.',
      error: error.message,
    });
  }
};
