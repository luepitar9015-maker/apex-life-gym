import { Request, Response } from 'express';
import { AuditService } from './audit.service.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, action, entity, severity, userId, page, limit } = req.query;

    const result = await AuditService.query({
      search: search as string,
      action: action as string,
      entity: entity as string,
      severity: severity as string,
      userId: userId as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al consultar bitácora de auditoría',
      error: error.message,
    });
  }
};

export const createAuditLog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { action, entity, entityId, details, severity, status } = req.body;

    if (!action || !entity) {
      res.status(400).json({ success: false, message: 'La acción y la entidad son obligatorias' });
      return;
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Direct-API';

    const record = await AuditService.record({
      userId: req.user?.userId || req.body.userId || 'ANONIMO',
      userEmail: req.user?.email || req.body.userEmail || 'client@apexlifegym.com',
      userName: req.body.userName || 'Usuario del Sistema',
      action,
      entity,
      entityId,
      details,
      ipAddress: Array.isArray(clientIp) ? clientIp[0] : (clientIp as string),
      userAgent,
      severity,
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Evento de auditoría registrado correctamente',
      data: record,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar evento de auditoría',
      error: error.message,
    });
  }
};

export const getAuditStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await AuditService.getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener métricas de auditoría',
      error: error.message,
    });
  }
};

export const exportAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await AuditService.query({ limit: 500 });
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.json`);
    res.status(200).send(JSON.stringify(result.items, null, 2));
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al exportar logs de auditoría',
      error: error.message,
    });
  }
};
