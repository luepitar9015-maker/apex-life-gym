import { PrismaClient, Role, Gender, MembershipStatus, MuscleGroup, EquipmentType, RoutineDifficulty, RoutineGoal, MealType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando carga de datos semilla (Seed)...');

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Limpiar datos existentes (orden seguro por restricciones de claves foráneas)
  await prisma.mealFoodItem.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.mealDay.deleteMany();
  await prisma.nutritionPlan.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.workoutSet.deleteMany();
  await prisma.workoutLog.deleteMany();
  await prisma.routineExercise.deleteMany();
  await prisma.routineDay.deleteMany();
  await prisma.routine.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.aIBodyScan.deleteMany();
  await prisma.bodyAssessment.deleteMany();
  await prisma.attendanceLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.user.deleteMany();

  // 2. Crear Usuarios (Admin, Entrenador, Nutricionista, Cliente)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gymfit.com',
      passwordHash: defaultPasswordHash,
      firstName: 'Carlos',
      lastName: 'Administrador',
      documentId: 'ADM001',
      role: Role.SUPERADMIN,
      gender: Gender.MALE,
      phone: '+1 800 555 0100',
    },
  });

  const trainer = await prisma.user.create({
    data: {
      email: 'coach.marcos@gymfit.com',
      passwordHash: defaultPasswordHash,
      firstName: 'Marcos',
      lastName: 'Valenzuela',
      documentId: 'ENT002',
      role: Role.TRAINER,
      gender: Gender.MALE,
      phone: '+1 800 555 0101',
    },
  });

  const nutritionist = await prisma.user.create({
    data: {
      email: 'nutri.laura@gymfit.com',
      passwordHash: defaultPasswordHash,
      firstName: 'Laura',
      lastName: 'Méndez',
      documentId: 'NUT003',
      role: Role.NUTRITIONIST,
      gender: Gender.FEMALE,
      phone: '+1 800 555 0102',
    },
  });

  const member = await prisma.user.create({
    data: {
      email: 'juan.perez@email.com',
      passwordHash: defaultPasswordHash,
      firstName: 'Juan',
      lastName: 'Pérez',
      documentId: '1098765432',
      role: Role.MEMBER,
      gender: Gender.MALE,
      birthDate: new Date('1996-05-14'),
      phone: '+1 800 555 0103',
      medicalConditions: 'Ninguna',
      injuriesHistory: 'Leve molestia en rodilla izquierda hace 2 años',
    },
  });

  // 3. Planes de Membresía
  const planMensual = await prisma.membershipPlan.create({
    data: {
      name: 'Plan Mensual Pro',
      description: 'Acceso total al gimnasio, vestuarios y lockers.',
      durationDays: 30,
      price: 45.0,
      includesCoach: false,
      includesNutrition: false,
    },
  });

  const planVIP = await prisma.membershipPlan.create({
    data: {
      name: 'Plan Black VIP + IA & Coach',
      description: 'Acceso ilimitado, escaneos de IA corporal mensuales, rutina personalizada y plan nutricional.',
      durationDays: 30,
      price: 85.0,
      includesCoach: true,
      includesNutrition: true,
    },
  });

  // 4. Suscripción del cliente
  await prisma.subscription.create({
    data: {
      userId: member.id,
      membershipPlanId: planVIP.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: MembershipStatus.ACTIVE,
    },
  });

  // 5. Catálogo de Ejercicios Fundamentales
  const exercisesData = [
    {
      name: 'Press de Banca Plano con Barra',
      slug: 'press-de-banca-plano-barra',
      primaryMuscle: MuscleGroup.CHEST,
      secondaryMuscles: [MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
      equipment: EquipmentType.BARBELL,
      mechanics: 'Compuesto',
      instructions: 'Acuéstate sobre el banco plano con los ojos bajo la barra. Agarre prono un poco más ancho que los hombros. Desciende de forma controlada hasta tocar el esternón medio y empuja explosivamente contrayendo los pectorales.',
    },
    {
      name: 'Sentadilla Trasera con Barra (Squat)',
      slug: 'sentadilla-trasera-barra',
      primaryMuscle: MuscleGroup.LEGS_QUADRICEPS,
      secondaryMuscles: [MuscleGroup.GLUTES, MuscleGroup.CORE_ABS],
      equipment: EquipmentType.BARBELL,
      mechanics: 'Compuesto',
      instructions: 'Coloca la barra sobre los trapecios. Pies al ancho de hombros con ligera apertura. Baja quebrando caderas y rodillas manteniendo el torso erguido hasta que los muslos rompan el paralelo.',
    },
    {
      name: 'Peso Muerto Convencional (Deadlift)',
      slug: 'peso-muerto-convencional',
      primaryMuscle: MuscleGroup.BACK,
      secondaryMuscles: [MuscleGroup.LEGS_HAMSTRINGS, MuscleGroup.GLUTES, MuscleGroup.FOREARMS],
      equipment: EquipmentType.BARBELL,
      mechanics: 'Compuesto',
      instructions: 'Pies a la anchura de caderas bajo la barra. Sujeta la barra con agarre firme, espalda neutra, pecho inflado. Empuja el suelo con las piernas y bloquea caderas al erguirte.',
    },
    {
      name: 'Dominadas con Agarre Prono (Pull-Ups)',
      slug: 'dominadas-pronas',
      primaryMuscle: MuscleGroup.BACK,
      secondaryMuscles: [MuscleGroup.BICEPS, MuscleGroup.FOREARMS],
      equipment: EquipmentType.BODYWEIGHT,
      mechanics: 'Compuesto',
      instructions: 'Cuélgate de la barra con agarre prono. Retrae escápulas y tracciona con los dorsales hasta que la barbilla supere la barra.',
    },
    {
      name: 'Press Militar de Hombros con Barra',
      slug: 'press-militar-barra',
      primaryMuscle: MuscleGroup.SHOULDERS,
      secondaryMuscles: [MuscleGroup.TRICEPS, MuscleGroup.CORE_ABS],
      equipment: EquipmentType.BARBELL,
      mechanics: 'Compuesto',
      instructions: 'De pie, barra apoyada en la parte alta del pecho. Empuja la barra verticalmente por encima de la cabeza bloqueando los codos y manteniendo el core firme.',
    },
    {
      name: 'Curl de Bíceps con Mancuernas en Banco Inclinado',
      slug: 'curl-biceps-mancuernas-inclinado',
      primaryMuscle: MuscleGroup.BICEPS,
      secondaryMuscles: [MuscleGroup.FOREARMS],
      equipment: EquipmentType.DUMBBELL,
      mechanics: 'Aislamiento',
      instructions: 'Banco a 60 grados. Brazos colgando perpendicularmente. Flexiona los codos supinando las muñecas sin balancear los hombros.',
    },
    {
      name: 'Extensión de Tríceps en Polea Alta con Cuerda',
      slug: 'extension-triceps-polea-cuerda',
      primaryMuscle: MuscleGroup.TRICEPS,
      secondaryMuscles: [],
      equipment: EquipmentType.CABLE,
      mechanics: 'Aislamiento',
      instructions: 'Codos pegados al torso. Extiende los brazos hacia abajo abriendo las puntas de la cuerda al final del recorrido para máxima contracción.',
    },
  ];

  const createdExercises = [];
  for (const ex of exercisesData) {
    const item = await prisma.exercise.create({ data: ex });
    createdExercises.push(item);
  }

  // 6. Crear Rutina Modelo Push / Pull / Legs
  const rutina = await prisma.routine.create({
    data: {
      title: 'Plan Hipertrofia Elite (Push / Pull / Legs)',
      description: 'Rutina optimizada para ganancia de masa muscular y fuerza.',
      difficulty: RoutineDifficulty.INTERMEDIATE,
      goal: RoutineGoal.HYPERTROPHY,
      isTemplate: true,
      createdById: trainer.id,
      memberId: member.id,
    },
  });

  const dia1 = await prisma.routineDay.create({
    data: {
      routineId: rutina.id,
      dayOrder: 1,
      name: 'Día 1: Empuje (Pecho, Hombro, Tríceps)',
    },
  });

  await prisma.routineExercise.create({
    data: {
      routineDayId: dia1.id,
      exerciseId: createdExercises[0].id, // Press Banca
      orderIndex: 1,
      targetSets: 4,
      targetReps: '8-10',
      targetRpe: 8.5,
      restSeconds: 120,
      notes: 'Calentamiento previo de aproximación con barra vacía.',
    },
  });

  await prisma.routineExercise.create({
    data: {
      routineDayId: dia1.id,
      exerciseId: createdExercises[4].id, // Press Militar
      orderIndex: 2,
      targetSets: 3,
      targetReps: '10-12',
      targetRpe: 8.0,
      restSeconds: 90,
    },
  });

  // 7. Diagnóstico Físico & Escaneo con IA del Usuario
  const assessment = await prisma.bodyAssessment.create({
    data: {
      userId: member.id,
      recordedById: trainer.id,
      weightKg: 78.5,
      heightCm: 177.0,
      bodyFatPercentage: 16.4,
      leanMassKg: 65.6,
      chestCm: 102.0,
      waistCm: 81.5,
      hipsCm: 96.0,
      armRightCm: 37.0,
      armLeftCm: 36.8,
      notes: 'Buen balance muscular general, objetivo de recortar grasa a 12% manteniendo masa magra.',
    },
  });

  await prisma.aIBodyScan.create({
    data: {
      userId: member.id,
      assessmentId: assessment.id,
      frontImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop',
      sideImageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop',
      estimatedFatPct: 16.2,
      estimatedLeanMassKg: 65.8,
      estimatedBmi: 25.05,
      somatotype: 'Mesomorfo',
      postureAssessment: 'Excelente simetría escapular. Ligera rotación interna de hombro izquierdo corregible con trabajo de deltoides posterior.',
      postureKeypointsJson: {
        shouldersAlignmentDeg: 0.8,
        pelvicTiltDeg: 2.1,
        spineCurvature: 'Normal / Neutra',
      },
      visualMetricsJson: {
        waistToHipRatio: 0.84,
        shoulderToWaistRatio: 1.42,
      },
      aiRecommendations: 'Priorizar ejercicios de tracción horizontal (Face Pulls) para equilibrar el hombro izquierdo. Mantener ingesta de proteína a 2.0g/kg.',
      confidenceScore: 0.94,
    },
  });

  // 8. Catálogo de Alimentos & Plan de Nutrición
  const alimentos = [
    { name: 'Pechuga de Pollo cocida', servingGrams: 100, calories: 165, proteinGrams: 31.0, carbsGrams: 0, fatGrams: 3.6, category: 'Proteínas' },
    { name: 'Arroz blanco cocido', servingGrams: 100, calories: 130, proteinGrams: 2.7, carbsGrams: 28.2, fatGrams: 0.3, category: 'Carbohidratos' },
    { name: 'Huevos enteros (unidad ~50g)', servingGrams: 50, calories: 72, proteinGrams: 6.3, carbsGrams: 0.4, fatGrams: 4.8, category: 'Proteínas / Grasas' },
    { name: 'Avena en hojuelas', servingGrams: 100, calories: 389, proteinGrams: 16.9, carbsGrams: 66.3, fatGrams: 6.9, category: 'Carbohidratos / Fibra' },
    { name: 'Aguacate / Palta Hass', servingGrams: 100, calories: 160, proteinGrams: 2.0, carbsGrams: 8.5, fatGrams: 14.7, category: 'Grasas Saludables' },
    { name: 'Proteína Whey Isolate', servingGrams: 30, calories: 110, proteinGrams: 25.0, carbsGrams: 1.0, fatGrams: 0.5, category: 'Suplementos' },
  ];

  for (const food of alimentos) {
    await prisma.foodItem.create({ data: food });
  }

  // 9. Plan Nutricional del Cliente
  const planNutricional = await prisma.nutritionPlan.create({
    data: {
      title: 'Recomposición Corporal 2,400 kcal',
      description: 'Déficit calórico moderado con alto aporte de proteína para preservar masa muscular.',
      userId: member.id,
      nutritionistId: nutritionist.id,
      dailyCaloriesTarget: 2400.0,
      targetProteinGrams: 165.0,
      targetCarbsGrams: 260.0,
      targetFatGrams: 65.0,
      waterLitersTarget: 3.0,
      notes: 'Distribuir en 4 comidas diarias. Consumir la mayor parte de carbohidratos alrededor del entrenamiento.',
    },
  });

  const diaLunes = await prisma.mealDay.create({
    data: {
      nutritionPlanId: planNutricional.id,
      dayNumber: 1,
      dayLabel: 'Lunes a Viernes (Días de Entrenamiento)',
    },
  });

  await prisma.meal.create({
    data: {
      mealDayId: diaLunes.id,
      type: MealType.BREAKFAST,
      customName: 'Desayuno Energético',
      timeHour: '07:30 AM',
      orderIndex: 1,
    },
  });

  console.log('✅ Base de datos sembrada con éxito:');
  console.log(`- Administrador: ${admin.email}`);
  console.log(`- Entrenador: ${trainer.email}`);
  console.log(`- Nutricionista: ${nutritionist.email}`);
  console.log(`- Miembro: ${member.email}`);
  console.log(`- Ejercicios cargados: ${createdExercises.length}`);
  console.log(`- Alimentos cargados: ${alimentos.length}`);
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
