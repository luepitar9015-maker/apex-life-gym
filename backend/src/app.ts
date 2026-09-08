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

export const createApp = (): Express => {
  const app = express();

  // Middlewares globales
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Endpoint de salud
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'online',
      service: 'Gym Fit AI - Backend REST API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // Montaje de rutas de la API
  app.use('/api/auth', authRoutes);
  app.use('/api/members', membersRoutes);
  app.use('/api/exercises', exercisesRoutes);
  app.use('/api/routines', routinesRoutes);
  app.use('/api/assessments', assessmentsRoutes);
  app.use('/api/nutrition', nutritionRoutes);
  app.use('/api/ai', aiRoutes);

  // Manejador global de errores
  app.use(errorHandler);

  return app;
};
