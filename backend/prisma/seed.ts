import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Inicializando datos base para APEX GYM...');

  // 1. Limpieza de datos
  await prisma.checkIn.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.memberRoutine.deleteMany();
  await prisma.routineExercise.deleteMany();
  await prisma.routine.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.member.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.user.deleteMany();
  await prisma.gymSetting.deleteMany();

  // 2. Configuración del Gimnasio
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

  // 3. Usuarios del Sistema
  const hashedPassword = await bcrypt.hash('Admin2026!', 10);
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@apexgym.com',
        name: 'Administrador Master',
        password: hashedPassword,
        role: 'ADMIN',
      },
      {
        email: 'recepcion@apexgym.com',
        name: 'Carlos Recepción',
        password: hashedPassword,
        role: 'RECEPTIONIST',
      },
      {
        email: 'coach@apexgym.com',
        name: 'Coach Laura Gómez',
        password: hashedPassword,
        role: 'TRAINER',
      },
    ],
  });

  // 4. Planes de Membresía
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
      description: '365 días de entrenamiento ilimitado, acceso a zonas VIP, toalla y nutricionista',
      price: 780000,
      durationDays: 365,
      accessHours: 'ALL_DAY',
      includesTrainer: true,
      sortOrder: 4,
    },
  });

  // 5. Catálogo de Ejercicios
  const exercises = await Promise.all([
    prisma.exercise.create({
      data: {
        name: 'Press de Banca Plano',
        muscleGroup: 'CHEST',
        equipment: 'BARBELL',
        description: 'Ejercicio básico de empuje para desarrollo de pectoral mayor y tríceps.',
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Aperturas con Mancuernas',
        muscleGroup: 'CHEST',
        equipment: 'DUMBBELL',
        description: 'Aislamiento de pectoral medio y estiramiento con rango completo.',
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Sentadilla Libre con Barra',
        muscleGroup: 'LEGS',
        equipment: 'BARBELL',
        description: 'Rey de los ejercicios de pierna. Cuádriceps, glúteos y estabilidad de core.',
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Prensa Inclinada 45°',
        muscleGroup: 'LEGS',
        equipment: 'MACHINE',
        description: 'Enfoque de sobrecarga controlada para cuádriceps y femorales.',
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Dominadas Pronas',
        muscleGroup: 'BACK',
        equipment: 'BODYWEIGHT',
        description: 'Tracción vertical para desarrollo de dorsal ancho y densidad de espalda.',
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Remo con Barra T',
        muscleGroup: 'BACK',
        equipment: 'BARBELL',
        description: 'Grosor de espalda media, trapecios y romboides.',
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Press Militar de Hombro',
        muscleGroup: 'SHOULDERS',
        equipment: 'DUMBBELL',
        description: 'Fuerza vertical y deltoides anterior/medio.',
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Curl de Bíceps en Banco Scott',
        muscleGroup: 'ARMS',
        equipment: 'BARBELL',
        description: 'Aislamiento máximo de cabeza corta y larga del bíceps.',
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Extensiones de Tríceps en Polea',
        muscleGroup: 'ARMS',
        equipment: 'CABLE',
        description: 'Extensión controlada para cabeza lateral y medial de tríceps.',
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Plancha Abdominal Isométrica',
        muscleGroup: 'CORE',
        equipment: 'BODYWEIGHT',
        description: 'Fuerza isométrica profunda del transverso abdominal.',
      },
    }),
  ]);

  // 6. Rutina de Ejemplo (Hipertrofia 4 Días)
  const rutinaHipertrofia = await prisma.routine.create({
    data: {
      name: 'Torso - Pierna Potencia e Hipertrofia',
      description: 'Rutina clásica de 4 días enfocada en ganar masa muscular magra y fuerza estructural.',
      goal: 'HYPERTROPHY',
      difficulty: 'INTERMEDIATE',
      daysPerWeek: 4,
    },
  });

  await prisma.routineExercise.createMany({
    data: [
      {
        routineId: rutinaHipertrofia.id,
        exerciseId: exercises[0].id, // Press de Banca
        dayNumber: 1,
        sets: 4,
        reps: '8-10',
        restSeconds: 90,
        notes: 'Calentamiento progresivo antes de series efectivas.',
      },
      {
        routineId: rutinaHipertrofia.id,
        exerciseId: exercises[4].id, // Dominadas
        dayNumber: 1,
        sets: 4,
        reps: '10-12',
        restSeconds: 90,
        notes: 'Si es necesario, usar banda elástica de asistencia.',
      },
      {
        routineId: rutinaHipertrofia.id,
        exerciseId: exercises[2].id, // Sentadilla
        dayNumber: 2,
        sets: 4,
        reps: '6-8',
        restSeconds: 120,
        notes: 'Profundidad paralela con espalda neutral.',
      },
      {
        routineId: rutinaHipertrofia.id,
        exerciseId: exercises[3].id, // Prensa
        dayNumber: 2,
        sets: 3,
        reps: '12-15',
        restSeconds: 75,
        notes: 'Ritmo 3 segundos excéntrico.',
      },
    ],
  });

  // 7. Socios de Demostración (Activos, Por Vencer y Vencidos)
  const now = new Date();
  
  // Socio 1: Activo con Plan Trimestral
  const socio1 = await prisma.member.create({
    data: {
      code: 'GYM-1001',
      documentNumber: '1020304050',
      documentType: 'CC',
      firstName: 'Mateo',
      lastName: 'Giraldo Morales',
      phone: '3157894561',
      email: 'mateo.giraldo@ejemplo.com',
      gender: 'MALE',
      birthDate: '1995-04-12',
      status: 'ACTIVE',
      currentPlanId: planTrimestral.id,
      planStartDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // Hace 20 días
      planEndDate: new Date(now.getTime() + 70 * 24 * 60 * 60 * 1000),   // En 70 días
      weight: 78.5,
      height: 1.78,
      notes: 'Objetivo: Aumento de masa muscular y fuerza en press.',
    },
  });

  // Socio 2: Por Vencer (En 2 días - Alerta Ámbar)
  const socio2 = await prisma.member.create({
    data: {
      code: 'GYM-1002',
      documentNumber: '1098765432',
      documentType: 'CC',
      firstName: 'Valentina',
      lastName: 'Castro Rivas',
      phone: '3004561234',
      email: 'valentina.castro@ejemplo.com',
      gender: 'FEMALE',
      birthDate: '1998-09-22',
      status: 'ACTIVE',
      currentPlanId: planMensual.id,
      planStartDate: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
      planEndDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Vence en 2 días
      weight: 59.2,
      height: 1.65,
      notes: 'Entrenamiento funcional y tonificación de tren inferior.',
    },
  });

  // Socio 3: Vencido (Hace 5 días - Alerta Roja)
  const socio3 = await prisma.member.create({
    data: {
      code: 'GYM-1003',
      documentNumber: '1033445566',
      documentType: 'CC',
      firstName: 'Andrés Felipe',
      lastName: 'Ramírez Soto',
      phone: '3128901234',
      email: 'andres.ramirez@ejemplo.com',
      gender: 'MALE',
      birthDate: '1992-11-05',
      status: 'EXPIRED',
      currentPlanId: planMensual.id,
      planStartDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
      planEndDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Venció hace 5 días
      weight: 84.0,
      height: 1.82,
      notes: 'Requiere renovación en recepción.',
    },
  });

  // Socio 4: VIP Black Pass
  const socio4 = await prisma.member.create({
    data: {
      code: 'GYM-1004',
      documentNumber: '1077889900',
      documentType: 'CC',
      firstName: 'Camila',
      lastName: 'Herrera Restrepo',
      phone: '3189998877',
      email: 'camila.herrera@ejemplo.com',
      gender: 'FEMALE',
      birthDate: '1996-02-18',
      status: 'ACTIVE',
      currentPlanId: planAnualVIP.id,
      planStartDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      planEndDate: new Date(now.getTime() + 320 * 24 * 60 * 60 * 1000),
      weight: 62.0,
      height: 1.70,
      notes: 'Cliente VIP - Acceso zona spa y toalla incluida.',
    },
  });

  // Asignar rutina al socio 1
  await prisma.memberRoutine.create({
    data: {
      memberId: socio1.id,
      routineId: rutinaHipertrofia.id,
      active: true,
    },
  });

  // 8. Pagos Registrados
  await prisma.payment.createMany({
    data: [
      {
        invoiceNumber: 'REC-2026-0001',
        memberId: socio1.id,
        planId: planTrimestral.id,
        amount: 245000,
        paymentMethod: 'TRANSFER',
        notes: 'Pago transferencia Bancolombia ref #99482',
        status: 'COMPLETED',
      },
      {
        invoiceNumber: 'REC-2026-0002',
        memberId: socio2.id,
        planId: planMensual.id,
        amount: 95000,
        paymentMethod: 'CASH',
        notes: 'Efectivo en caja recepción',
        status: 'COMPLETED',
      },
      {
        invoiceNumber: 'REC-2026-0003',
        memberId: socio4.id,
        planId: planAnualVIP.id,
        amount: 780000,
        paymentMethod: 'CARD',
        notes: 'Tarjeta de crédito Visa terminada en 4412',
        status: 'COMPLETED',
      },
    ],
  });

  // 9. Check-ins de Prueba (Hoy)
  await prisma.checkIn.createMany({
    data: [
      {
        memberId: socio1.id,
        checkInTime: new Date(now.getTime() - 40 * 60 * 1000), // Hace 40 minutos (En sala)
        status: 'GRANTED',
        reason: 'Membresía activa (Trimestral)',
        zone: 'PESAS',
      },
      {
        memberId: socio4.id,
        checkInTime: new Date(now.getTime() - 25 * 60 * 1000), // Hace 25 minutos (En sala)
        status: 'GRANTED',
        reason: 'Membresía activa (VIP Black)',
        zone: 'CARDIO',
      },
    ],
  });

  console.log('✅ Base de datos inicializada exitosamente con planes, socios, ejercicios y configuración.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
