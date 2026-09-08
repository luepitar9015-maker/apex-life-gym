import dotenv from 'dotenv';
import { createApp } from './app.js';

dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Gym Fit AI iniciado con éxito en http://localhost:${PORT}`);
  console.log(`📡 API Health Check disponible en http://localhost:${PORT}/api/health`);
});
