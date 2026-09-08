# 🏋️‍♂️ Backend Gym AI - Base de Datos PostgreSQL & API

Ecosistema de backend para la plataforma de gimnasio, rutinas, diagnóstico biométrico por IA y nutrición.

## 🗄️ Estructura de la Base de Datos (PostgreSQL)

El esquema cuenta con 17 tablas relacionales optimizadas:

1. **Gestión y Accesos:**
   - `User`: Administradores, Entrenadores, Nutricionistas y Socios.
   - `MembershipPlan`: Planes de suscripción (Precios, duración, accesos a IA/Coach).
   - `Subscription`: Control de socios activos, renovaciones y vigencias.
   - `Payment`: Registro de cobros, facturas y métodos de pago.
   - `AttendanceLog`: Registro de entradas al gym con código QR / huella.

2. **Entrenamiento y Progresión:**
   - `Exercise`: Catálogo de ejercicios (músculos principales, secundarios, equipo y técnicas).
   - `Routine`: Rutinas asignadas y plantillas (Push/Pull/Legs, Upper/Lower, etc.).
   - `RoutineDay`: Días de entreno por semana.
   - `RoutineExercise`: Series objetivo, rangos de reps, RPE y descansos.
   - `WorkoutLog`: Sesiones completadas por los usuarios.
   - `WorkoutSet`: Series reales levantadas (kilos/libras, reps logradas, fallo).

3. **Diagnóstico & Escaneo Corporal por IA:**
   - `BodyAssessment`: Medidas antropométricas manuales (pliegues, perímetros, peso, altura).
   - `AIBodyScan`: Análisis fotográfico con IA:
     - Estimación de porcentaje de grasa (% Body Fat) y masa magra.
     - Detección postural biomecánica (hombros, pelvis, columna).
     - Ratios anatómicos y sugerencias de entrenamiento personalizadas.

4. **Nutrición Inteligente:**
   - `FoodItem`: Tabla de alimentos con calorías y macronutrientes (proteínas, carbohidratos, grasas).
   - `NutritionPlan`: Plan calórico con metas de macros y agua.
   - `MealDay` y `Meal`: Distribución de comidas (desayuno, pre-entreno, almuerzo, etc.).
   - `MealFoodItem`: Porciones en gramos.

---

## 🚀 Cómo inicializar la Base de Datos

### Opción A: Usando Prisma ORM
1. En tu archivo `.env`, configura la URL de tu PostgreSQL:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/gym_app_db?schema=public"
   ```
2. Ejecuta la migración:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Carga los datos iniciales de prueba (seed):
   ```bash
   npm run prisma:seed
   ```
4. Visualiza la base de datos en el navegador:
   ```bash
   npm run prisma:studio
   ```

### Opción B: Importar SQL Puro
Si usas **Supabase**, **Neon**, **pgAdmin** o un servidor PostgreSQL externo:
- Abre el archivo `prisma/schema.sql` y ejecútalo directamente en la consola SQL de tu gestor.
