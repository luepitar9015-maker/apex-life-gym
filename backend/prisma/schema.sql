-- ==============================================================================
-- SCRIPT SQL NATIVO PARA POSTGRESQL - PLATAFORMA GYM AI
-- Base de Datos Relacional Completa: Clientes, Rutinas, Biometría, IA y Nutrición
-- ==============================================================================

-- 1. ENUMS
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'TRAINER', 'NUTRITIONIST', 'MEMBER');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'PAUSED', 'CANCELLED', 'PENDING');
CREATE TYPE "PaymentStatus" AS ENUM ('COMPLETED', 'PENDING', 'FAILED', 'REFUNDED');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'QR_PAYMENT');
CREATE TYPE "MuscleGroup" AS ENUM (
    'CHEST', 'BACK', 'LEGS_QUADRICEPS', 'LEGS_HAMSTRINGS', 'GLUTES',
    'CALVES', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'FOREARMS', 'CORE_ABS',
    'FULL_BODY', 'CARDIO'
);
CREATE TYPE "EquipmentType" AS ENUM (
    'BARBELL', 'DUMBBELL', 'KETTLEBELL', 'MACHINE', 'CABLE',
    'BODYWEIGHT', 'RESISTANCE_BAND', 'SMITH_MACHINE', 'OTHER'
);
CREATE TYPE "RoutineDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE');
CREATE TYPE "RoutineGoal" AS ENUM ('HYPERTROPHY', 'STRENGTH', 'FAT_LOSS', 'ENDURANCE', 'FUNCTIONAL', 'REHABILITATION');
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'AFTERNOON_SNACK', 'PRE_WORKOUT', 'POST_WORKOUT', 'DINNER');

-- 2. TABLAS DE USUARIOS Y ACCESOS
CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "documentId" VARCHAR(50) UNIQUE,
    "phone" VARCHAR(50),
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "gender" "Gender",
    "birthDate" TIMESTAMP WITH TIME ZONE,
    "avatarUrl" TEXT,
    "medicalConditions" TEXT,
    "injuriesHistory" TEXT,
    "emergencyContact" VARCHAR(150),
    "emergencyPhone" VARCHAR(50),
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. PLANES, MEMBRESÍAS Y ASISTENCIA
CREATE TABLE "MembershipPlan" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "durationDays" INTEGER NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    "includesCoach" BOOLEAN NOT NULL DEFAULT FALSE,
    "includesNutrition" BOOLEAN NOT NULL DEFAULT FALSE,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "Subscription" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "membershipPlanId" UUID NOT NULL REFERENCES "MembershipPlan"("id"),
    "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "autoRenew" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "Payment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id"),
    "subscriptionId" UUID REFERENCES "Subscription"("id"),
    "amount" DECIMAL(10, 2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'USD',
    "method" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "status" "PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
    "invoiceNumber" VARCHAR(100) UNIQUE,
    "paidAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "AttendanceLog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "checkInTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "checkOutTime" TIMESTAMP WITH TIME ZONE,
    "method" VARCHAR(50) NOT NULL DEFAULT 'QR_CODE'
);

-- 4. EJERCICIOS Y RUTINAS
CREATE TABLE "Exercise" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(200) UNIQUE NOT NULL,
    "slug" VARCHAR(200) UNIQUE NOT NULL,
    "description" TEXT,
    "primaryMuscle" "MuscleGroup" NOT NULL,
    "secondaryMuscles" "MuscleGroup"[],
    "equipment" "EquipmentType" NOT NULL,
    "mechanics" VARCHAR(50),
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "instructions" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "Routine" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "difficulty" "RoutineDifficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "goal" "RoutineGoal" NOT NULL DEFAULT 'HYPERTROPHY',
    "isTemplate" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdById" UUID NOT NULL REFERENCES "User"("id"),
    "memberId" UUID REFERENCES "User"("id"),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "RoutineDay" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "routineId" UUID NOT NULL REFERENCES "Routine"("id") ON DELETE CASCADE,
    "dayOrder" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT
);

CREATE TABLE "RoutineExercise" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "routineDayId" UUID NOT NULL REFERENCES "RoutineDay"("id") ON DELETE CASCADE,
    "exerciseId" UUID NOT NULL REFERENCES "Exercise"("id"),
    "orderIndex" INTEGER NOT NULL,
    "targetSets" INTEGER NOT NULL DEFAULT 4,
    "targetReps" VARCHAR(50) NOT NULL DEFAULT '8-12',
    "targetRpe" DECIMAL(3, 1),
    "restSeconds" INTEGER NOT NULL DEFAULT 90,
    "notes" TEXT
);

CREATE TABLE "WorkoutLog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "routineId" UUID REFERENCES "Routine"("id"),
    "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "completedAt" TIMESTAMP WITH TIME ZONE,
    "feelingRate" INTEGER,
    "notes" TEXT
);

CREATE TABLE "WorkoutSet" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "workoutLogId" UUID NOT NULL REFERENCES "WorkoutLog"("id") ON DELETE CASCADE,
    "exerciseId" UUID NOT NULL REFERENCES "Exercise"("id"),
    "setNumber" INTEGER NOT NULL,
    "weightKg" DECIMAL(6, 2) NOT NULL,
    "repsCompleted" INTEGER NOT NULL,
    "rpeActual" DECIMAL(3, 1),
    "isWarmup" BOOLEAN NOT NULL DEFAULT FALSE,
    "isFailed" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. DIAGNÓSTICO, ANTROPOMETRÍA Y ANÁLISIS IA
CREATE TABLE "BodyAssessment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "recordedById" UUID REFERENCES "User"("id"),
    "assessmentDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "weightKg" DECIMAL(5, 2) NOT NULL,
    "heightCm" DECIMAL(5, 2) NOT NULL,
    "bodyFatPercentage" DECIMAL(4, 2),
    "leanMassKg" DECIMAL(5, 2),
    "visceralFatScore" INTEGER,
    "chestCm" DECIMAL(5, 2),
    "waistCm" DECIMAL(5, 2),
    "hipsCm" DECIMAL(5, 2),
    "armLeftCm" DECIMAL(5, 2),
    "armRightCm" DECIMAL(5, 2),
    "thighLeftCm" DECIMAL(5, 2),
    "thighRightCm" DECIMAL(5, 2),
    "calfCm" DECIMAL(5, 2),
    "frontPhotoUrl" TEXT,
    "sidePhotoUrl" TEXT,
    "backPhotoUrl" TEXT,
    "notes" TEXT
);

CREATE TABLE "AIBodyScan" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "assessmentId" UUID REFERENCES "BodyAssessment"("id"),
    "scanDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "frontImageUrl" TEXT NOT NULL,
    "sideImageUrl" TEXT,
    "estimatedFatPct" DECIMAL(4, 2) NOT NULL,
    "estimatedLeanMassKg" DECIMAL(5, 2) NOT NULL,
    "estimatedBmi" DECIMAL(4, 2) NOT NULL,
    "somatotype" VARCHAR(50),
    "postureAssessment" TEXT,
    "postureKeypointsJson" JSONB,
    "visualMetricsJson" JSONB,
    "aiRecommendations" TEXT,
    "confidenceScore" DECIMAL(3, 2)
);

-- 6. NUTRICIÓN Y ALIMENTACIÓN
CREATE TABLE "FoodItem" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(200) NOT NULL,
    "brand" VARCHAR(100),
    "servingGrams" DECIMAL(6, 2) NOT NULL DEFAULT 100,
    "calories" DECIMAL(6, 2) NOT NULL,
    "proteinGrams" DECIMAL(6, 2) NOT NULL,
    "carbsGrams" DECIMAL(6, 2) NOT NULL,
    "fatGrams" DECIMAL(6, 2) NOT NULL,
    "fiberGrams" DECIMAL(6, 2),
    "category" VARCHAR(100)
);

CREATE TABLE "NutritionPlan" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "nutritionistId" UUID REFERENCES "User"("id"),
    "dailyCaloriesTarget" DECIMAL(6, 2) NOT NULL,
    "targetProteinGrams" DECIMAL(6, 2) NOT NULL,
    "targetCarbsGrams" DECIMAL(6, 2) NOT NULL,
    "targetFatGrams" DECIMAL(6, 2) NOT NULL,
    "waterLitersTarget" DECIMAL(3, 1) DEFAULT 2.5,
    "notes" TEXT,
    "startDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "endDate" TIMESTAMP WITH TIME ZONE,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "MealDay" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "nutritionPlanId" UUID NOT NULL REFERENCES "NutritionPlan"("id") ON DELETE CASCADE,
    "dayNumber" INTEGER NOT NULL,
    "dayLabel" VARCHAR(100) NOT NULL
);

CREATE TABLE "Meal" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "mealDayId" UUID NOT NULL REFERENCES "MealDay"("id") ON DELETE CASCADE,
    "type" "MealType" NOT NULL DEFAULT 'BREAKFAST',
    "customName" VARCHAR(150) NOT NULL,
    "timeHour" VARCHAR(50),
    "orderIndex" INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE "MealFoodItem" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "mealId" UUID NOT NULL REFERENCES "Meal"("id") ON DELETE CASCADE,
    "foodItemId" UUID NOT NULL REFERENCES "FoodItem"("id"),
    "portionGrams" DECIMAL(6, 2) NOT NULL,
    "customNotes" TEXT
);

-- ÍNDICES DE ALTO RENDIMIENTO
CREATE INDEX "idx_user_role" ON "User"("role");
CREATE INDEX "idx_user_email" ON "User"("email");
CREATE INDEX "idx_subscription_status" ON "Subscription"("status");
CREATE INDEX "idx_attendance_checkin" ON "AttendanceLog"("checkInTime");
CREATE INDEX "idx_exercise_primary_muscle" ON "Exercise"("primaryMuscle");
CREATE INDEX "idx_routine_member" ON "Routine"("memberId");
CREATE INDEX "idx_workout_log_user" ON "WorkoutLog"("userId");
CREATE INDEX "idx_body_assessment_user" ON "BodyAssessment"("userId");
CREATE INDEX "idx_ai_scan_user" ON "AIBodyScan"("userId");
CREATE INDEX "idx_food_item_name" ON "FoodItem"("name");
