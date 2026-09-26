import { Request, Response } from 'express';
import { ServerService } from './server.service.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export const getServerStatus = async (_req: Request, res: Response): Promise<void> => {
  try {
    const status = await ServerService.getServerStatus();
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener telemetría del servidor',
      error: error.message,
    });
  }
};

export const pingDatabase = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await ServerService.pingDatabase();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al realizar ping a la base de datos',
      error: error.message,
    });
  }
};

export const purgeServerCache = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await ServerService.purgeCache(req.user?.userId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al purgar memoria caché',
      error: error.message,
    });
  }
};
