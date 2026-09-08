// Servicio de conexión con la API del Backend de Gym Fit AI

const API_BASE_URL = 'http://localhost:4000/api';

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    return res.ok;
  } catch (err) {
    return false;
  }
};

export const fetchMembers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/members`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {
    console.warn('Backend no accesible, usando datos de respaldo.');
  }

  // Datos mock enriquecidos si el backend no responde
  return [
    {
      id: 'm1',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
      phone: '+1 800 555 0103',
      documentId: '1098765432',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
      subscriptions: [{
        status: 'ACTIVE',
        endDate: '2026-10-15T00:00:00.000Z',
        membershipPlan: { name: 'Plan Black VIP + IA' },
      }],
    },
    {
      id: 'm2',
      firstName: 'Camila',
      lastName: 'Gómez',
      email: 'camila.g@email.com',
      phone: '+1 800 555 0199',
      documentId: '9876543210',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop',
      subscriptions: [{
        status: 'ACTIVE',
        endDate: '2026-09-30T00:00:00.000Z',
        membershipPlan: { name: 'Plan Mensual Pro' },
      }],
    },
    {
      id: 'm3',
      firstName: 'Mateo',
      lastName: 'Silva',
      email: 'mateo.silva@email.com',
      phone: '+1 800 555 0188',
      documentId: '1122334455',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      subscriptions: [{
        status: 'EXPIRED',
        endDate: '2026-08-30T00:00:00.000Z',
        membershipPlan: { name: 'Plan Básico Gym' },
      }],
    },
    {
      id: 'm4',
      firstName: 'Sofía',
      lastName: 'Reyes',
      email: 'sofia.reyes@email.com',
      phone: '+1 800 555 0177',
      documentId: '5544332211',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
      subscriptions: [{
        status: 'ACTIVE',
        endDate: '2026-11-01T00:00:00.000Z',
        membershipPlan: { name: 'Plan Black VIP + IA' },
      }],
    },
  ];
};

export const checkInMember = async (identifier: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/members/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, method: 'QR_CODE' }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Check-in local fallback');
  }

  // Simulación inteligente para demostración instantánea
  const members = await fetchMembers();
  const found = members.find(
    (m: any) =>
      m.id === identifier ||
      m.email.toLowerCase() === identifier.toLowerCase() ||
      m.documentId === identifier
  );

  if (!found) {
    return {
      success: false,
      accessGranted: false,
      message: 'Socio no encontrado con los datos ingresados.',
    };
  }

  const isExpired = found.subscriptions[0]?.status === 'EXPIRED';
  return {
    success: true,
    accessGranted: !isExpired,
    message: !isExpired ? 'Acceso permitido. ¡Bienvenido!' : 'Acceso Denegado: Membresía Vencida.',
    member: {
      id: found.id,
      name: `${found.firstName} ${found.lastName}`,
      email: found.email,
      membership: found.subscriptions[0]?.membershipPlan.name || 'Sin plan',
      expiresAt: found.subscriptions[0]?.endDate,
      avatarUrl: found.avatarUrl,
    },
    checkInTime: new Date().toISOString(),
  };
};

export const fetchExercises = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/exercises`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {
    console.warn('Fallback catálogo ejercicios');
  }

  return [
    {
      id: 'e1',
      name: 'Press de Banca Plano con Barra',
      primaryMuscle: 'CHEST',
      equipment: 'BARBELL',
      mechanics: 'Compuesto',
      instructions: 'Descenso controlado al esternón medio y empuje explosivo sin despegar la espalda.',
    },
    {
      name: 'Sentadilla Trasera con Barra (Squat)',
      primaryMuscle: 'LEGS_QUADRICEPS',
      equipment: 'BARBELL',
      mechanics: 'Compuesto',
      instructions: 'Pies a la anchura de los hombros, quebrar caderas y descender rompiendo el paralelo.',
    },
    {
      name: 'Peso Muerto Convencional',
      primaryMuscle: 'BACK',
      equipment: 'BARBELL',
      mechanics: 'Compuesto',
      instructions: 'Espalda recta en todo momento, empujar el suelo con los talones y bloquear cadera.',
    },
    {
      name: 'Press Militar con Barra',
      primaryMuscle: 'SHOULDERS',
      equipment: 'BARBELL',
      mechanics: 'Compuesto',
      instructions: 'Empuje vertical estricto manteniendo el core bloqueado y glúteos contraídos.',
    },
    {
      name: 'Dominadas con Agarre Prono',
      primaryMuscle: 'BACK',
      equipment: 'BODYWEIGHT',
      mechanics: 'Compuesto',
      instructions: 'Tracción escapular previa y elevación hasta superar la barra con el mentón.',
    },
    {
      name: 'Extensión de Tríceps en Polea Alta',
      primaryMuscle: 'TRICEPS',
      equipment: 'CABLE',
      mechanics: 'Aislamiento',
      instructions: 'Codos pegados a las costillas y apertura de cuerda al final del recorrido.',
    },
    {
      name: 'Elevaciones Laterales con Mancuernas',
      primaryMuscle: 'SHOULDERS',
      equipment: 'DUMBBELL',
      mechanics: 'Aislamiento',
      instructions: 'Elevar brazos en el plano escapular con ligera flexión de codos.',
    },
  ];
};

export const analyzeBodyWithBackendAI = async (params: {
  weightKg: number;
  heightCm: number;
  age?: number;
  gender?: string;
  frontImageBase64?: string;
}) => {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/analyze-body`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn('Fallo llamada API IA, usando cálculo de respaldo');
  }

  return null;
};

export const generateMealPlanWithBackendAI = async (params: {
  targetCalories: number;
  dietPreference?: string;
  goal?: string;
}) => {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/generate-meal-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn('Fallo llamada API nutrición IA');
  }

  return null;
};

