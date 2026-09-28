import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';

// Rutas del ecosistema APEX GYM
import authRoutes from './modules/auth/auth.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import membersRoutes from './modules/members/members.routes.js';
import checkinRoutes from './modules/checkin/checkin.routes.js';
import plansRoutes from './modules/plans/plans.routes.js';
import paymentsRoutes from './modules/payments/payments.routes.js';
import routinesRoutes from './modules/routines/routines.routes.js';
import exercisesRoutes from './modules/exercises/exercises.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import gymsRoutes from './modules/gyms/gyms.routes.js';

export const createApp = (): Express => {
  const app = express();

  // Middlewares globales
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Endpoint de salud
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'online',
      service: 'APEX GYM & FITNESS - Backend API',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
    });
  });

  // Montaje de rutas limpias
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/members', membersRoutes);
  app.use('/api/checkin', checkinRoutes);
  app.use('/api/plans', plansRoutes);
  app.use('/api/payments', paymentsRoutes);
  app.use('/api/routines', routinesRoutes);
  app.use('/api/exercises', exercisesRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/gyms', gymsRoutes);

  // Manejador global de errores
  app.use(errorHandler);

  return app;
};
