import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';

// Importación de rutas modulares
import authRoutes from './modules/auth/auth.routes.js';
import membersRoutes from './modules/members/members.routes.js';
import exercisesRoutes from './modules/exercises/exercises.routes.js';
import routinesRoutes from './modules/routines/routines.routes.js';
import assessmentsRoutes from './modules/assessments/assessments.routes.js';
import nutritionRoutes from './modules/nutrition/nutrition.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import tlcRoutes from './modules/tlc/tlc.routes.js';
import trainersRoutes from './modules/trainers/trainers.routes.js';
import licensesRoutes from './modules/licenses/licenses.routes.js';
import supportRoutes from './modules/support/support.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import permissionsRoutes from './modules/permissions/permissions.routes.js';
import auditRoutes from './modules/audit/audit.routes.js';
import serverRoutes from './modules/server/server.routes.js';

export const createApp = (): Express => {
  const app = express();

  // Middlewares globales
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Endpoint de salud
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'online',
      service: 'APEX LIFE - Backend REST API (Multi-Tenant GYM & TLC)',
      timestamp: new Date().toISOString(),
      version: '1.2.0',
    });
  });

  // Montaje de rutas de la API
  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/permissions', permissionsRoutes);
  app.use('/api/audit', auditRoutes);
  app.use('/api/server', serverRoutes);
  app.use('/api/members', membersRoutes);
  app.use('/api/exercises', exercisesRoutes);
  app.use('/api/routines', routinesRoutes);
  app.use('/api/assessments', assessmentsRoutes);
  app.use('/api/nutrition', nutritionRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/tlc', tlcRoutes);
  app.use('/api/trainers', trainersRoutes);
  app.use('/api/licenses', licensesRoutes);
  app.use('/api/support', supportRoutes);

  // Manejador global de errores
  app.use(errorHandler);

  return app;
};
