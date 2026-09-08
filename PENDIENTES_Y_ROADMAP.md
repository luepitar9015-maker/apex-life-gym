# 📋 GYM FIT AI - Bitácora de Estado y Roadmap de Desarrollo

> **Fecha de guardado:** 2026-09-07 (Noche)  
> **Estado del Sistema:** Operativo en modo desarrollo con servidores activos.

---

## 📌 1. Estado Actual del Proyecto

### 🖥️ Servidores en Ejecución
* **Frontend Web:** [http://localhost:5173/](http://localhost:5173/) *(React + Vite + TypeScript + Lucide Icons)*
* **Backend REST API:** [http://localhost:4000](http://localhost:4000) *(Express + TypeScript + Prisma ORM)*
* **Health Check API:** [http://localhost:4000/api/health](http://localhost:4000/api/health) *(Responde `online`)*

### 📁 Módulos Web ya visualizables y navegables
1. **Dashboard General:** Aforo en vivo, métricas de capacidad, ingresos y actividad.
2. **Recepción & Check-in QR:** Lector virtual de accesos para socios por documento o código QR.
3. **Directorio de Socios:** Visualización de socios, estados de membresía y perfiles biométricos.
4. **Escaneo Corporal IA:** Módulo de análisis antropométrico, porcentaje de grasa (% BF), postura y somatotipo.
5. **Rutinas & Ejercicios:** Catálogo de ejercicios, series, RPE y descansos.
6. **Plan Nutricional:** Cálculo metabólico basal, macros (proteínas, carbohidratos, grasas) y distribución de comidas.

---

## 🚀 2. Tareas Prioritarias para Mañana (Paso a Paso)

### Fase A: Base de Datos Real (PostgreSQL)
- [ ] **Crear la base de datos física:**
  PostgreSQL está activo en el puerto `5432`. Solo falta crear la base de datos llamada `gym_app_db`.
  ```bash
  # En PowerShell o psql:
  psql -U postgres -c "CREATE DATABASE gym_app_db;"
  ```
- [ ] **Migrar el esquema con Prisma:**
  ```bash
  cd backend
  npx prisma db push
  ```
- [ ] **Poblar con datos iniciales (Seed):**
  ```bash
  npm run prisma:seed
  ```
  *(Carga catálogo de 17 tablas: ejercicios, planes VIP/Pro, socios de prueba, recetas).*

---

### Fase B: Autenticación y Conexión Frontend-Backend
- [ ] **Pantalla de Login / Registro en la Web:**
  Implementar la vista de inicio de sesión para administradores, entrenadores y recepcionistas.
- [ ] **Guardar Token JWT:**
  Guardar el token en `localStorage` tras el login y enviarlo en el header `Authorization: Bearer <token>`.
- [ ] **Reemplazar datos mock:**
  Hacer que `web/src/services/api.ts` consulte directamente la base de datos PostgreSQL en lugar del fallback estático.

---

### Fase C: Inteligencia Artificial (Gemini Vision)
- [ ] **Configurar API Key:**
  En `backend/.env`, asignar la clave en `GEMINI_API_KEY="AIza..."`.
- [ ] **Subida de fotos de socios:**
  Configurar recepción de imágenes (fotos frontal y lateral) para que Gemini 1.5/2.0 Flash analice la postura y composición corporal real.

---

### Fase D: Aplicación Móvil (Socio / Entrenador)
- [ ] Instalar dependencias en la carpeta `mobile/`:
  ```bash
  cd mobile
  npm install
  ```
- [ ] Integrar lector de cámara para escaneo QR de acceso.
- [ ] Configurar navegación entre pantallas (`HomeScreen`, `WorkoutScreen`, `AIScanScreen`, `NutritionScreen`).

---

## 🛠️ Comandos Rápidos para Iniciar Mañana

Si reinicias el equipo o cierras las terminales, puedes levantar todo con:

```bash
# Terminal 1 - Backend:
cd "e:\APLICATIVO GYM\backend"
npm run dev

# Terminal 2 - Frontend Web:
cd "e:\APLICATIVO GYM\web"
npm run dev
```

Y abrir en tu navegador: [http://localhost:5173/](http://localhost:5173/)
