import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Inicializando datos base ampliados para APEX GYM (Multi-sede, Superadmin, Diagnóstico IA y Alimentos)...');

  // 1. Limpieza de datos
  await prisma.healthDiagnostic.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.nutritionPlan.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.memberRoutine.deleteMany();
  await prisma.routineExercise.deleteMany();
  await prisma.routine.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.member.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.user.deleteMany();
  await prisma.gym.deleteMany();
  await prisma.gymSetting.deleteMany();

  // 2. Gimnasios / Sedes (Multi-tenant para Superadmin)
  const sedePoblado = await prisma.gym.create({
    data: {
      code: 'SEDE-01',
      name: 'APEX Gym Sede Poblado',
      city: 'Medellín',
      address: 'Carrera 43A #1-50, El Poblado',
      phone: '+57 310 892 4410',
      maxCapacity: 90,
      active: true,
    },
  });

  const sedeLaureles = await prisma.gym.create({
    data: {
      code: 'SEDE-02',
      name: 'APEX Gym Sede Laureles',
      city: 'Medellín',
      address: 'Avenida Nutibara #73-22, Laureles',
      phone: '+57 315 440 2199',
      maxCapacity: 75,
      active: true,
    },
  });

  const sedeEnvigado = await prisma.gym.create({
    data: {
      code: 'SEDE-03',
      name: 'APEX Gym Sede Envigado',
      city: 'Envigado',
      address: 'Calle 37 Sur #41-15, Zona Sur',
      phone: '+57 301 772 8841',
      maxCapacity: 80,
      active: true,
    },
  });

  // 3. Configuración del Gimnasio
  await prisma.gymSetting.create({
    data: {
      id: 'singleton',
      gymName: 'APEX GYM & FITNESS',
      nit: '901.884.212-9',
      phone: '+57 310 892 4410',
      address: 'Av. Las Palmas #24-10, Zona Fitness',
      currency: 'COP ($)',
      maxCapacity: 60,
      alertCapacity: 50,
      openingHours: 'Lun - Vie: 5:00 AM - 10:00 PM | Sáb - Dom: 6:00 AM - 6:00 PM',
    },
  });

  // 4. Usuarios del Sistema (Superadmin, Administrador de Sede, Recepcionista, Entrenador)
  const superPassword = await bcrypt.hash('SuperAdmin2026!', 10);
  const adminPassword = await bcrypt.hash('Admin2026!', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'superadmin@apexgym.com',
        name: 'Super Administrador SaaS',
        password: superPassword,
        role: 'SUPERADMIN',
      },
      {
        email: 'admin@apexgym.com',
        name: 'Admin Sede Poblado',
        password: adminPassword,
        role: 'ADMIN',
        gymId: sedePoblado.id,
      },
      {
        email: 'admin.laureles@apexgym.com',
        name: 'Admin Sede Laureles',
        password: adminPassword,
        role: 'ADMIN',
        gymId: sedeLaureles.id,
      },
      {
        email: 'recepcion@apexgym.com',
        name: 'Carlos Recepción',
        password: adminPassword,
        role: 'RECEPTIONIST',
        gymId: sedePoblado.id,
      },
      {
        email: 'coach@apexgym.com',
        name: 'Coach Laura Gómez',
        password: adminPassword,
        role: 'TRAINER',
        gymId: sedePoblado.id,
      },
    ],
  });

  // 5. Planes de Membresía
  const planDiario = await prisma.membershipPlan.create({
    data: {
      name: 'Pase Diario',
      description: 'Acceso total por 1 día a todas las máquinas y duchas',
      price: 15000,
      durationDays: 1,
      accessHours: 'ALL_DAY',
      includesTrainer: false,
      sortOrder: 1,
    },
  });

  const planMensual = await prisma.membershipPlan.create({
    data: {
      name: 'Mensual Pro',
      description: 'Acceso ilimitado por 30 días + valoración física inicial',
      price: 95000,
      durationDays: 30,
      accessHours: 'ALL_DAY',
      includesTrainer: true,
      sortOrder: 2,
    },
  });

  const planTrimestral = await prisma.membershipPlan.create({
    data: {
      name: 'Trimestral Élite',
      description: '90 días de acceso total con descuento del 15% + rutina personalizada',
      price: 245000,
      durationDays: 90,
      accessHours: 'ALL_DAY',
      includesTrainer: true,
      sortOrder: 3,
    },
  });

  const planAnualVIP = await prisma.membershipPlan.create({
    data: {
      name: 'Anual VIP Black',
      description: '365 días con toalla, casillero personal, acceso multi-sede e invitado mensual',
      price: 780000,
      durationDays: 365,
      accessHours: 'ALL_DAY',
      includesTrainer: true,
      sortOrder: 4,
    },
  });

  // 6. Catálogo de Alimentos Frecuentes con Calorías y Macros por 100g
  const foodData = [
    { name: 'Pechuga de Pollo', category: 'PROTEIN', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    { name: 'Huevos Enteros', category: 'PROTEIN', calories: 143, protein: 13, carbs: 1.1, fats: 9.5 },
    { name: 'Claras de Huevo', category: 'PROTEIN', calories: 52, protein: 11, carbs: 0.7, fats: 0.2 },
    { name: 'Salmón Fresco', category: 'PROTEIN', calories: 208, protein: 20, carbs: 0, fats: 13 },
    { name: 'Atún en Agua', category: 'PROTEIN', calories: 116, protein: 26, carbs: 0, fats: 1 },
    { name: 'Carne Magra de Res', category: 'PROTEIN', calories: 190, protein: 26, carbs: 0, fats: 9 },
    { name: 'Tofu Firme', category: 'PROTEIN', calories: 76, protein: 8, carbs: 1.9, fats: 4.8 },
    { name: 'Yogur Griego Sin Azúcar', category: 'DAIRY', calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
    { name: 'Queso Ricotta / Cuajada', category: 'DAIRY', calories: 174, protein: 11, carbs: 3, fats: 13 },
    { name: 'Arroz Blanco', category: 'CARB', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
    { name: 'Arroz Integral', category: 'CARB', calories: 111, protein: 2.6, carbs: 23, fats: 0.9 },
    { name: 'Avena en Hojuelas', category: 'CARB', calories: 389, protein: 16.9, carbs: 66, fats: 6.9 },
    { name: 'Batata / Camote', category: 'CARB', calories: 86, protein: 1.6, carbs: 20, fats: 0.1 },
    { name: 'Papa Cocida', category: 'CARB', calories: 77, protein: 2, carbs: 17, fats: 0.1 },
    { name: 'Quinoa Cocida', category: 'CARB', calories: 120, protein: 4.4, carbs: 21, fats: 1.9 },
    { name: 'Pan Integral 100%', category: 'CARB', calories: 247, protein: 13, carbs: 41, fats: 3.4 },
    { name: 'Plátano / Banano', category: 'FRUIT', calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
    { name: 'Manzana Verde', category: 'FRUIT', calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
    { name: 'Frutos Rojos (Fresas/Arándanos)', category: 'FRUIT', calories: 57, protein: 0.7, carbs: 14, fats: 0.3 },
    { name: 'Aguacate Hass', category: 'FAT', calories: 160, protein: 2, carbs: 8.5, fats: 14.7 },
    { name: 'Aceite de Oliva Extra Virgen', category: 'FAT', calories: 884, protein: 0, carbs: 0, fats: 100 },
    { name: 'Almendras', category: 'FAT', calories: 579, protein: 21, carbs: 22, fats: 49.9 },
    { name: 'Nueces', category: 'FAT', calories: 654, protein: 15, carbs: 14, fats: 65 },
    { name: 'Espinacas Frescas', category: 'VEGETABLE', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4 },
    { name: 'Brócoli al Vapor', category: 'VEGETABLE', calories: 34, protein: 2.8, carbs: 7, fats: 0.4 },
    { name: 'Espárragos', category: 'VEGETABLE', calories: 20, protein: 2.2, carbs: 3.9, fats: 0.1 },
  ];

  for (const item of foodData) {
    await prisma.foodItem.create({ data: item });
  }

  // 7. Catálogo Amplio de Ejercicios (22 Gimnasio + 19 Casa)
  const exerciseData = [
    // GIMNASIO
    { name: 'Press de Banca Plano con Barra', muscleGroup: 'CHEST', equipment: 'BARBELL', location: 'GYM', description: 'Empuje horizontal pectoral sobre banco plano' },
    { name: 'Press Inclinado con Mancuernas', muscleGroup: 'CHEST', equipment: 'DUMBBELL', location: 'GYM', description: 'Enfoque en porción clavicular pectoral superior' },
    { name: 'Cruces en Polea Alta', muscleGroup: 'CHEST', equipment: 'CABLE', location: 'GYM', description: 'Aislamiento esternal continuo' },
    { name: 'Pec Deck / Aperturas en Máquina', muscleGroup: 'CHEST', equipment: 'MACHINE', location: 'GYM', description: 'Aislamiento sin fatiga de estabilizadores' },
    { name: 'Dominadas Pronadas', muscleGroup: 'BACK', equipment: 'BODYWEIGHT', location: 'GYM', description: 'Tracción vertical para dorsal ancho' },
    { name: 'Jalón al Pecho en Polea', muscleGroup: 'BACK', equipment: 'CABLE', location: 'GYM', description: 'Tracción vertical biomecánica' },
    { name: 'Remo con Barra 45°', muscleGroup: 'BACK', equipment: 'BARBELL', location: 'GYM', description: 'Densidad dorsal media y romboides' },
    { name: 'Remo Gironda en Polea Baja', muscleGroup: 'BACK', equipment: 'CABLE', location: 'GYM', description: 'Contracción sostenida de espalda media' },
    { name: 'Sentadilla Libre con Barra Trasera', muscleGroup: 'LEGS', equipment: 'BARBELL', location: 'GYM', description: 'Pilar biomecánico de cuádriceps y glúteo' },
    { name: 'Prensa de Piernas 45 Grados', muscleGroup: 'LEGS', equipment: 'MACHINE', location: 'GYM', description: 'Sobrecarga de cuadríceps sin carga axial' },
    { name: 'Extensiones de Cuádriceps en Máquina', muscleGroup: 'LEGS', equipment: 'MACHINE', location: 'GYM', description: 'Aislamiento de cuádriceps en fase concéntrica' },
    { name: 'Curl Femoral Tumbado en Máquina', muscleGroup: 'LEGS', equipment: 'MACHINE', location: 'GYM', description: 'Aislamiento isquiosural bíceps femoral' },
    { name: 'Peso Muerto Rumano con Barra', muscleGroup: 'LEGS', equipment: 'BARBELL', location: 'GYM', description: 'Bisagra de cadera isquios y glúteos' },
    { name: 'Elevación de Talones en Máquina Smith', muscleGroup: 'LEGS', equipment: 'MACHINE', location: 'GYM', description: 'Hipertrofia de gemelos y sóleo' },
    { name: 'Press Militar de Hombros con Barra', muscleGroup: 'SHOULDERS', equipment: 'BARBELL', location: 'GYM', description: 'Empuje vertical para deltoides anterior' },
    { name: 'Elevaciones Laterales con Mancuernas', muscleGroup: 'SHOULDERS', equipment: 'DUMBBELL', location: 'GYM', description: 'Anchura de hombro deltoide lateral' },
    { name: 'Pájaros en Polea Cruzada', muscleGroup: 'SHOULDERS', equipment: 'CABLE', location: 'GYM', description: 'Deltoides posterior y postura' },
    { name: 'Curl de Bíceps con Barra Z', muscleGroup: 'ARMS', equipment: 'BARBELL', location: 'GYM', description: 'Bíceps braquial sin estrés en muñecas' },
    { name: 'Curl Martillo con Mancuernas', muscleGroup: 'ARMS', equipment: 'DUMBBELL', location: 'GYM', description: 'Braquial anterior y braquiorradial' },
    { name: 'Extensiones de Tríceps en Polea con Cuerda', muscleGroup: 'ARMS', equipment: 'CABLE', location: 'GYM', description: 'Apertura final para cabeza lateral del tríceps' },
    { name: 'Press Francés con Mancuernas', muscleGroup: 'ARMS', equipment: 'DUMBBELL', location: 'GYM', description: 'Cabeza larga del tríceps sobre banco plano' },
    { name: 'Caminadora Inclinada HIIT', muscleGroup: 'CARDIO', equipment: 'MACHINE', location: 'GYM', description: 'Cardio metabólico de pendiente 12% sin impacto' },

    // EN CASA (CALISTENIA / PESO CORPORAL)
    { name: 'Flexiones de Pecho (Push-ups)', muscleGroup: 'CHEST', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Empuje clásico en suelo para pectoral y core' },
    { name: 'Flexiones Diamante', muscleGroup: 'CHEST', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Manos juntas para tríceps y porción esternal' },
    { name: 'Flexiones Declinadas con Pies en Sofá', muscleGroup: 'CHEST', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Enfoque en pectoral superior y deltoides' },
    { name: 'Fondos en Paralelas o entre Sillas', muscleGroup: 'CHEST', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Empuje de torso vertical para pectoral inferior y tríceps' },
    { name: 'Remo Invertido debajo de Mesa (Australian Pull-up)', muscleGroup: 'BACK', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Tracción horizontal sin equipamiento' },
    { name: 'Superman Isométrico en Suelo', muscleGroup: 'BACK', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Fortalecimiento de erectores espinales y glúteo' },
    { name: 'Remo con Toalla en Marco de Puerta', muscleGroup: 'BACK', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Tracción isométrica y dinámica de dorsales' },
    { name: 'Sentadillas al Aire (Air Squats)', muscleGroup: 'LEGS', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Flexión profunda de rodilla y cadera' },
    { name: 'Sentadillas Búlgaras con Pie en Sofá', muscleGroup: 'LEGS', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Trabajo unilateral brutal de cuádriceps y glúteo' },
    { name: 'Zancadas Dinámicas (Lunges)', muscleGroup: 'LEGS', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Pasos alternos con estabilidad de cuádriceps' },
    { name: 'Puente de Glúteos Unilateral en Suelo', muscleGroup: 'LEGS', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Extensión de cadera e isquiotibiales' },
    { name: 'Elevación de Gemelos en un Escalón', muscleGroup: 'LEGS', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Estiramiento profundo y contracción a 1 pierna' },
    { name: 'Pike Push-ups (Flexiones en V)', muscleGroup: 'SHOULDERS', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Empuje vertical para hombros usando peso corporal' },
    { name: 'Plancha Lateral con Elevación de Brazo', muscleGroup: 'CORE', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Estabilidad oblicua y deltoides estabilizador' },
    { name: 'Plancha Abdominal Frontal Isométrica', muscleGroup: 'CORE', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Activación del transverso abdominal' },
    { name: 'Mountain Climbers (Escaladores)', muscleGroup: 'CARDIO', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Cardio metabólico de alta intensidad y core' },
    { name: 'Burpees Completos con Salto', muscleGroup: 'CARDIO', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Acondicionamiento total cuerpo completo' },
    { name: 'Jumping Jacks (Saltos de Tijera)', muscleGroup: 'CARDIO', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Cardio aeróbico de activación' },
    { name: 'Fondos de Tríceps en Borde de Silla', muscleGroup: 'ARMS', equipment: 'BODYWEIGHT', location: 'HOME', description: 'Aislamiento de tríceps con soporte' },
  ];

  const createdExercises: any[] = [];
  for (const ex of exerciseData) {
    const item = await prisma.exercise.create({ data: ex });
    createdExercises.push(item);
  }

  // 8. Socios Afiliados con Preferencias de Alimentos y Diagnóstico
  const now = new Date();
  const socio1 = await prisma.member.create({
    data: {
      code: 'GYM-1001',
      documentNumber: '1020304050',
      documentType: 'CC',
      firstName: 'Mateo',
      lastName: 'Giraldo',
      email: 'mateo.giraldo@ejemplo.com',
      phone: '+57 300 123 4567',
      birthDate: '1998-05-14',
      gender: 'MALE',
      address: 'Calle 10 #43E-12, Medellín',
      emergencyContact: 'Claudia Ríos (Madre)',
      emergencyPhone: '+57 301 987 6543',
      status: 'ACTIVE',
      weight: 76.5,
      height: 1.78,
      notes: 'Hipertrofia muscular y definición magra',
      medicalNotes: 'Sensibilidad leve en rodilla derecha',
      likedFoods: JSON.stringify(['Pechuga de Pollo', 'Huevos Enteros', 'Avena en Hojuelas', 'Arroz Blanco', 'Aguacate Hass', 'Plátano / Banano']),
      dislikedFoods: JSON.stringify(['Tofu Firme', 'Espárragos']),
      gymId: sedePoblado.id,
      currentPlanId: planTrimestral.id,
      planStartDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      planEndDate: new Date(now.getTime() + 70 * 24 * 60 * 60 * 1000),
    },
  });

  const socio2 = await prisma.member.create({
    data: {
      code: 'GYM-1002',
      documentNumber: '1098765432',
      documentType: 'CC',
      firstName: 'Valentina',
      lastName: 'Restrepo',
      email: 'valen.restrepo@ejemplo.com',
      phone: '+57 311 234 5678',
      birthDate: '1995-11-20',
      gender: 'FEMALE',
      address: 'Circular 4 #72-10, Laureles',
      emergencyContact: 'Andrés Restrepo',
      emergencyPhone: '+57 312 345 6789',
      status: 'ACTIVE',
      weight: 58.0,
      height: 1.64,
      notes: 'Tonificación de tren inferior y glúteos en casa y gym',
      likedFoods: JSON.stringify(['Salmón Fresco', 'Yogur Griego Sin Azúcar', 'Frutos Rojos (Fresas/Arándanos)', 'Batata / Camote']),
      dislikedFoods: JSON.stringify(['Carne Magra de Res']),
      gymId: sedeLaureles.id,
      currentPlanId: planMensual.id,
      planStartDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      planEndDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
    },
  });

  // 9. Diagnóstico Fisiológico IA Registrado para Mateo
  await prisma.healthDiagnostic.create({
    data: {
      memberId: socio1.id,
      targetGoal: 'Hipertrofia Muscular y Definición',
      diseases: 'Ninguna detectada',
      injuries: 'Molestia femororrotuliana en rodilla derecha por sobrecarga previa',
      disabilities: 'Ninguna restricción de movilidad',
      trainingExperience: 'INTERMEDIO',
      bodyFatPercentage: 15.2,
      muscleMassKg: 64.8,
      bmi: 24.1,
      biotype: 'Mesomorfo',
      aiClinicalSummary: 'Atleta joven normopeso con buen índice de desarrollo músculo-esquelético. Buena densidad ósea. Se detecta antecedente de condromalacia/femororrotuliana en rodilla derecha.',
      prohibitedExercises: 'Sentadillas profundas por debajo de 90° con barra libre, Prensa 45° con hiperextensión forzada, Saltos pliométricos repetitivos.',
      recommendedActions: 'Priorizar curl femoral tumbado, peso muerto rumano controlado y extensiones de cuádriceps en rango medio (30°-60°). Realizar calentamiento con rodillo de espuma (foam rolling) y activación de glúteo medio.',
    },
  });

  // 10. Rutina Gym y Rutina Casa
  const rutinaGym = await prisma.routine.create({
    data: {
      name: 'Rutina Élite Hipertrofia & Fuerza (Gimnasio)',
      description: 'Bloque estructurado de torso y pierna para sobrecarga progresiva',
      goal: 'HYPERTROPHY',
      difficulty: 'INTERMEDIATE',
      location: 'GYM',
      daysPerWeek: 4,
      aiNotes: 'RPE 7-8 en primeras semanas. Evitar bloqueo articular en ejercicios de empuje.',
    },
  });

  const exBench = createdExercises.find((e) => e.name.includes('Press de Banca Plano')) || createdExercises[0];
  const exSquat = createdExercises.find((e) => e.name.includes('Prensa de Piernas')) || createdExercises[9];

  await prisma.routineExercise.createMany({
    data: [
      { routineId: rutinaGym.id, exerciseId: exBench.id, dayNumber: 1, sets: 4, reps: '8-10', restSeconds: 90, notes: 'Pausa de 1 segundo en el pecho' },
      { routineId: rutinaGym.id, exerciseId: exSquat.id, dayNumber: 2, sets: 4, reps: '12-15', restSeconds: 90, notes: 'Evitar bloqueo de rodilla' },
    ],
  });

  await prisma.memberRoutine.create({
    data: {
      memberId: socio1.id,
      routineId: rutinaGym.id,
      active: true,
    },
  });

  // 11. Plan Nutricional Inteligente con Comidas
  const sampleMeals = JSON.stringify([
    {
      meal: 'Desayuno Anabólico (07:30 AM)',
      title: 'Tortilla de Claras con Avena y Frutas Permitidas',
      calories: 520,
      protein: 38,
      carbs: 65,
      fats: 12,
      items: ['80g de avena en hojuelas con canela', '4 claras de huevo + 1 huevo entero revuelto', '1 plátano / banano mediano'],
    },
    {
      meal: 'Almuerzo de Rendimiento (12:30 PM)',
      title: 'Pechuga de Pollo con Arroz Blanco y Aguacate Hass',
      calories: 680,
      protein: 50,
      carbs: 75,
      fats: 18,
      items: ['180g de pechuga de pollo a la plancha', '160g de arroz blanco al vapor', '60g de aguacate hass fresco'],
    },
    {
      meal: 'Merienda Pre-Entreno (04:30 PM)',
      title: 'Yogur Griego con Nueces y Fruta',
      calories: 320,
      protein: 22,
      carbs: 35,
      fats: 10,
      items: ['150g de yogur griego sin azúcar', '20g de almendras tostadas sin sal', '1 manzana verde en rodajas'],
    },
    {
      meal: 'Cena Post-Entreno (08:30 PM)',
      title: 'Salmón Fresco con Batata y Vegetales',
      calories: 540,
      protein: 42,
      carbs: 45,
      fats: 15,
      items: ['160g de filete de salmón a la plancha', '120g de batata o camote al horno', 'Brócoli al vapor con limón'],
    },
  ]);

  await prisma.nutritionPlan.create({
    data: {
      memberId: socio1.id,
      title: 'Plan de Hipertrofia Magra & Rendimiento 2060 kcal',
      targetCalories: 2060,
      proteinGrams: 152,
      carbsGrams: 220,
      fatsGrams: 55,
      goal: 'HYPERTROPHY',
      mealsJson: sampleMeals,
      trainerNotes: 'Revisado por Coach Laura: Plan optimizado sin Tofu ni Espárragos. Mantener agua en 3.5 litros diarios.',
      generatedByAI: true,
      reviewedByTrainer: true,
    },
  });

  // 12. Pagos y Asistencias
  await prisma.payment.createMany({
    data: [
      { invoiceNumber: 'REC-2026-0001', memberId: socio1.id, planId: planTrimestral.id, amount: 245000, paymentMethod: 'TRANSFER', notes: 'Bancolombia ref #99482', status: 'COMPLETED' },
      { invoiceNumber: 'REC-2026-0002', memberId: socio2.id, planId: planMensual.id, amount: 95000, paymentMethod: 'CASH', notes: 'Efectivo en recepción', status: 'COMPLETED' },
    ],
  });

  await prisma.checkIn.createMany({
    data: [
      { memberId: socio1.id, checkInTime: new Date(now.getTime() - 40 * 60 * 1000), status: 'GRANTED', reason: 'Membresía activa (Trimestral)', zone: 'PESAS' },
    ],
  });

  console.log(`✅ Base de datos poblada exitosamente con 3 sedes, Superadmin, Diagnóstico IA, alimentos con macros y 41 ejercicios.`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
