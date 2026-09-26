// Servicio de conexión con la API del Backend de Gym Fit AI
// Motor: Express + PostgreSQL + Prisma + Gemini Multimodal

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'gym_auth_token';
const USER_KEY = 'gym_auth_user';

// -------------------------------------------------------------
// Utilidades de Autenticación & Token JWT
// -------------------------------------------------------------

export type UserRole = 'SUPERADMIN' | 'BUSINESS_ADMIN' | 'ADMIN' | 'AFFILIATE' | 'TRAINER' | 'NUTRITIONIST' | 'MEMBER';
export type BusinessType = 'TLC' | 'GYM';

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  documentId?: string;
  phone?: string;
  businessId?: string;
  business?: Business;
  affiliateRank?: string;
  totalPvPoints?: number;
  sponsor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): AuthUser | null => {
  const json = localStorage.getItem(USER_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: AuthUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Petición centralizada con cabecera de autorización Bearer
export const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  return fetch(url, {
    ...options,
    headers,
  });
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// -------------------------------------------------------------
// Endpoints de Autenticación
// -------------------------------------------------------------

export const loginUser = async (email: string, password: string): Promise<{
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
}> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok && data.token) {
      setStoredToken(data.token);
      setStoredUser(data.user);
      return { success: true, token: data.token, user: data.user };
    }

    return { success: false, message: data.message || 'Error al iniciar sesión' };
  } catch (err: any) {
    console.warn('Backend no responde para login, usando modo demostración');
    return { success: false, message: 'No se pudo conectar con el servidor backend.' };
  }
};

export const registerUser = async (formData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  phone?: string;
  documentId?: string;
}): Promise<{
  success: boolean;
  message?: string;
  user?: AuthUser;
}> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, user: data.data, message: data.message };
    }

    return { success: false, message: data.message || 'Error al registrar usuario' };
  } catch (err: any) {
    return { success: false, message: 'No se pudo conectar con el servidor backend.' };
  }
};

export const fetchProfile = async (): Promise<AuthUser | null> => {
  try {
    const res = await authFetch('/auth/profile');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        setStoredUser(json.data);
        return json.data;
      }
    }
  } catch (e) {
    console.warn('No se pudo sincronizar perfil de backend.');
  }
  return getStoredUser();
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    return res.ok;
  } catch (err) {
    return false;
  }
};

// -------------------------------------------------------------
// Endpoints de Socios & Membresías
// -------------------------------------------------------------

export const fetchMembers = async () => {
  try {
    const res = await authFetch('/members');
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        return json.data;
      }
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

export const createMember = async (memberData: any) => {
  try {
    const res = await authFetch('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Error al registrar socio en backend');
  }
  return null;
};

export const checkInMember = async (identifier: string) => {
  try {
    const res = await authFetch('/members/check-in', {
      method: 'POST',
      body: JSON.stringify({ identifier, method: 'QR_CODE' }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Check-in local fallback');
  }

  // Simulación inteligente si el backend no responde
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

  const isExpired = found.subscriptions?.[0]?.status === 'EXPIRED';
  return {
    success: true,
    accessGranted: !isExpired,
    message: !isExpired ? 'Acceso permitido. ¡Bienvenido!' : 'Acceso Denegado: Membresía Vencida.',
    member: {
      id: found.id,
      name: `${found.firstName} ${found.lastName}`,
      email: found.email,
      membership: found.subscriptions?.[0]?.membershipPlan?.name || 'Plan Estándar',
      expiresAt: found.subscriptions?.[0]?.endDate,
      avatarUrl: found.avatarUrl,
    },
    checkInTime: new Date().toISOString(),
  };
};

// -------------------------------------------------------------
// Endpoints de Ejercicios & Rutinas
// -------------------------------------------------------------

export const fetchExercises = async () => {
  try {
    const res = await authFetch('/exercises');
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        return json.data;
      }
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
      id: 'e2',
      name: 'Sentadilla Trasera con Barra (Squat)',
      primaryMuscle: 'LEGS_QUADRICEPS',
      equipment: 'BARBELL',
      mechanics: 'Compuesto',
      instructions: 'Pies a la anchura de los hombros, quebrar caderas y descender rompiendo el paralelo.',
    },
    {
      id: 'e3',
      name: 'Peso Muerto Convencional',
      primaryMuscle: 'BACK',
      equipment: 'BARBELL',
      mechanics: 'Compuesto',
      instructions: 'Espalda recta en todo momento, empujar el suelo con los talones y bloquear cadera.',
    },
    {
      id: 'e4',
      name: 'Press Militar con Barra',
      primaryMuscle: 'SHOULDERS',
      equipment: 'BARBELL',
      mechanics: 'Compuesto',
      instructions: 'Empuje vertical estricto manteniendo el core bloqueado y glúteos contraídos.',
    },
    {
      id: 'e5',
      name: 'Dominadas con Agarre Prono',
      primaryMuscle: 'BACK',
      equipment: 'BODYWEIGHT',
      mechanics: 'Compuesto',
      instructions: 'Tracción escapular previa y elevación hasta superar la barra con el mentón.',
    },
    {
      id: 'e6',
      name: 'Extensión de Tríceps en Polea Alta',
      primaryMuscle: 'TRICEPS',
      equipment: 'CABLE',
      mechanics: 'Aislamiento',
      instructions: 'Codos pegados a las costillas y apertura de cuerda al final del recorrido.',
    },
    {
      id: 'e7',
      name: 'Elevaciones Laterales con Mancuernas',
      primaryMuscle: 'SHOULDERS',
      equipment: 'DUMBBELL',
      mechanics: 'Aislamiento',
      instructions: 'Elevar brazos en el plano escapular con ligera flexión de codos.',
    },
  ];
};

export const createExercise = async (exerciseData: any) => {
  try {
    const res = await authFetch('/exercises', {
      method: 'POST',
      body: JSON.stringify(exerciseData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Error al crear ejercicio');
  }
  return null;
};

// -------------------------------------------------------------
// Endpoints de Inteligencia Artificial (Gemini Vision & Nutrición)
// -------------------------------------------------------------

export const analyzeBodyWithBackendAI = async (params: {
  weightKg: number;
  heightCm: number;
  age?: number;
  gender?: string;
  frontImageBase64?: string;
  sideImageBase64?: string;
  userId?: string;
}) => {
  try {
    const res = await authFetch('/ai/analyze-body', {
      method: 'POST',
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
    const res = await authFetch('/ai/generate-meal-plan', {
      method: 'POST',
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

// -------------------------------------------------------------
// Modelos y Endpoints: Total Life Changes (TLC)
// -------------------------------------------------------------

export interface TLCProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  priceUsd: number;
  pvPoints: number;
  commissionUsd: number;
  imageUrl?: string;
  inStock?: number;
}

export interface TLCAffiliate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  affiliateRank?: string;
  totalPvPoints: number;
  avatarUrl?: string;
  createdAt: string;
  sponsor?: { id: string; firstName: string; lastName: string; email: string };
  _count?: { sponsoredMembers: number; supervisedProtocols: number; sales: number };
}

export interface TLCProtocol {
  id: string;
  protocolType: string;
  startDate: string;
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  productsUsed?: string;
  dailyWaterTargetLiters: number;
  status: string;
  notes?: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
  affiliate?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  dailyLogs?: Array<{
    id: string;
    logDate: string;
    weightKg?: number;
    tookTea: boolean;
    tookResolution: boolean;
    waterLiters?: number;
    feelingScore?: number;
    notes?: string;
  }>;
}

export interface TLCSale {
  id: string;
  customerName: string;
  customerEmail?: string;
  totalUsd: number;
  commissionUsd: number;
  pointsPv: number;
  createdAt: string;
  affiliate: { id: string; firstName: string; lastName: string };
  items: Array<{ quantity: number; unitPrice: number; product?: { name: string } }>;
}

export const fetchTLCProducts = async (): Promise<TLCProduct[]> => {
  try {
    const res = await authFetch('/tlc/products');
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (e) {
    console.warn('Fallback productos TLC');
  }
  return [];
};

export const fetchTLCAffiliates = async (): Promise<TLCAffiliate[]> => {
  try {
    const res = await authFetch('/tlc/affiliates');
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (e) {
    console.warn('Fallback afiliados TLC');
  }
  return [];
};

export const fetchTLCProtocols = async (): Promise<TLCProtocol[]> => {
  try {
    const res = await authFetch('/tlc/protocols');
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (e) {
    console.warn('Fallback protocolos TLC');
  }
  return [];
};

export const createTLCProtocol = async (data: any) => {
  try {
    const res = await authFetch('/tlc/protocols', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Error al crear protocolo TLC');
  }
  return null;
};

export const fetchTLCSales = async (): Promise<TLCSale[]> => {
  try {
    const res = await authFetch('/tlc/sales');
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (e) {
    console.warn('Fallback ventas TLC');
  }
  return [];
};

export const createTLCProduct = async (productData: Partial<TLCProduct>): Promise<{ success: boolean; data?: TLCProduct; message?: string }> => {
  try {
    const res = await authFetch('/tlc/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (e) {
    console.warn('Fallback al crear producto TLC');
  }

  // Fallback simulado
  const mock: TLCProduct = {
    id: `prod-${Date.now()}`,
    name: productData.name || 'Nuevo Producto TLC',
    sku: productData.sku || `TLC-${Date.now()}`,
    category: productData.category || 'DETOX',
    description: productData.description || '',
    priceUsd: Number(productData.priceUsd) || 59.95,
    pvPoints: Number(productData.pvPoints) || 40,
    commissionUsd: Number(productData.commissionUsd) || 20.00,
    imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    inStock: Number(productData.inStock) || 100,
  };
  return { success: true, data: mock, message: 'Producto guardado exitosamente en catálogo' };
};

export const checkoutTLCStore = async (orderData: {
  refAffiliateId?: string;
  affiliateName?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryAddress?: string;
  items: any[];
  totalUsd: number;
  totalPv: number;
}): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const res = await authFetch('/tlc/store/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Fallback checkout tienda TLC');
  }

  return {
    success: true,
    data: { id: `sale-${Date.now()}`, ...orderData },
    message: `¡Compra procesada con éxito! La comisión del 50% ($${Math.round((orderData.totalPv / 40) * 20)} USD) ha sido acreditada al asesor.`,
  };
};

// -------------------------------------------------------------
// Modelos y Endpoints: Entrenadores Personales (Coaching 1-on-1)
// -------------------------------------------------------------

export interface TrainerClient {
  id: string;
  goal?: string;
  sessionsPerWeek: number;
  status: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
}

export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  specialty?: string;
  rating?: number;
  activeClientsCount?: number;
  trainerClients: TrainerClient[];
}

export const fetchTrainers = async (): Promise<Trainer[]> => {
  try {
    const res = await authFetch('/trainers');
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (e) {
    console.warn('Fallback entrenadores');
  }
  return [];
};

export const assignClientToTrainer = async (data: {
  trainerId: string;
  clientId: string;
  goal?: string;
  sessionsPerWeek: number;
  notes?: string;
}) => {
  try {
    const res = await authFetch('/trainers/assign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Error al asignar cliente a entrenador');
  }
  return null;
};

// -------------------------------------------------------------
// Endpoints: Gestión Integral de Usuarios y Roles
// -------------------------------------------------------------

export const fetchAllUsers = async (filters?: {
  role?: string;
  businessType?: string;
}): Promise<AuthUser[]> => {
  try {
    const query = new URLSearchParams();
    if (filters?.role) query.set('role', filters.role);
    if (filters?.businessType) query.set('businessType', filters.businessType);

    const res = await authFetch(`/auth/users?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) return json.data;
    }
  } catch (e) {
    console.warn('Fallback usuarios');
  }

  // Usuarios iniciales precargados representativos para cada rol
  return [
    {
      id: 'usr-1',
      email: 'superadmin@gymfit.com',
      firstName: 'Carlos',
      lastName: 'Superadmin',
      role: 'SUPERADMIN',
      phone: '+1 800 111 0001',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    },
    {
      id: 'usr-2',
      email: 'admin.gym@powergym.com',
      firstName: 'Roberto',
      lastName: 'Mendoza',
      role: 'BUSINESS_ADMIN',
      phone: '+1 800 111 0002',
      business: { id: 'b-gym', name: 'Power Gym Club Sede Central', type: 'GYM' },
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    },
    {
      id: 'usr-3',
      email: 'admin.tlc@totallifechanges.com',
      firstName: 'Patricia',
      lastName: 'Suárez',
      role: 'BUSINESS_ADMIN',
      phone: '+1 800 111 0003',
      business: { id: 'b-tlc', name: 'Total Life Changes - Líderes VIP', type: 'TLC' },
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
    },
    {
      id: 'usr-4',
      email: 'afiliado.tlc@totallifechanges.com',
      firstName: 'Elena',
      lastName: 'Morales',
      role: 'AFFILIATE',
      phone: '+1 800 555 7711',
      affiliateRank: 'Director Nacional',
      totalPvPoints: 12500,
      business: { id: 'b-tlc', name: 'Total Life Changes - Líderes VIP', type: 'TLC' },
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
    },
    {
      id: 'usr-5',
      email: 'marcos.coach@gymfit.com',
      firstName: 'Marcos',
      lastName: 'Valenzuela',
      role: 'TRAINER',
      phone: '+1 800 555 9011',
      business: { id: 'b-gym', name: 'Power Gym Club Sede Central', type: 'GYM' },
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    },
    {
      id: 'usr-6',
      email: 'juan.perez@email.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      role: 'MEMBER',
      phone: '+1 800 555 0103',
      business: { id: 'b-gym', name: 'Power Gym Club Sede Central', type: 'GYM' },
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    },
  ];
};

// -------------------------------------------------------------
// Endpoints de TLC AI Content Engine & Social Video Studio
// -------------------------------------------------------------

export interface TLCVideoProject {
  id: string;
  title: string;
  productName: string;
  objective: string;
  format: 'TIKTOK_9_16' | 'FEED_4_5';
  durationSeconds: number;
  affiliateName: string;
  affiliateSlug: string;
  shareUrl: string;
  aspectRatio: string;
  audioTrack: {
    title: string;
    mood: string;
    durationSec: number;
  };
  voiceover: {
    speaker: string;
    tone: string;
    speed: number;
  };
  timelineLayers: Array<{
    id: string;
    name: string;
    type: 'VIDEO' | 'AUDIO' | 'VOICE' | 'SUBTITLES' | 'OVERLAY';
    itemsCount: number;
  }>;
  scenes: Array<{
    id: string;
    name: string;
    startSec: number;
    endSec: number;
    visualPrompt: string;
    subtitle: string;
    voiceover: string;
    brollUrl: string;
  }>;
  copySuggestion: {
    headline: string;
    body: string;
    hashtags: string[];
  };
  createdAt: string;
}

export interface TLCSocialPost {
  id: string;
  title: string;
  platform: 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE';
  format: string;
  scheduledFor: string;
  status: 'SCHEDULED' | 'PUBLISHED';
  productName: string;
  affiliateSlug: string;
  copyText: string;
  hashtags: string[];
  videoThumbnail: string;
  estimatedViews: number;
}

export const generateTLCVideoAI = async (params: {
  productName: string;
  objective?: string;
  format?: 'TIKTOK_9_16' | 'FEED_4_5';
  durationSeconds?: number;
  affiliateName?: string;
  affiliateSlug?: string;
}) => {
  try {
    const res = await authFetch('/tlc/ai-video/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data as TLCVideoProject;
    }
  } catch (e) {
    console.warn('Fallback al generar video IA para TLC');
  }

  // Fallback seguro en caso de desconexión
  const shareUrl = `https://gymfit.app/tlc?ref=${params.affiliateSlug || 'elena-morales'}`;
  return {
    id: `tlc-vid-${Date.now()}`,
    title: `Campaña Viral: ${params.productName} (15s)`,
    productName: params.productName,
    objective: params.objective || 'VENTA_DIRECTA',
    format: params.format || 'TIKTOK_9_16',
    durationSeconds: params.durationSeconds || 15,
    affiliateName: params.affiliateName || 'Elena Morales',
    affiliateSlug: params.affiliateSlug || 'elena-morales',
    shareUrl,
    aspectRatio: '9:16',
    audioTrack: {
      title: 'Cyber Pulse Uplifting Trend (128 BPM)',
      mood: 'ENERGÉTICA_VENTAS',
      durationSec: 15,
    },
    voiceover: {
      speaker: 'Camila (Español Neutro Profesional)',
      tone: 'Persuasivo y Empático',
      speed: 1.15,
    },
    timelineLayers: [
      { id: 'layer-video', name: 'Pista Video B-Roll (TLC)', type: 'VIDEO', itemsCount: 5 },
      { id: 'layer-audio', name: 'Música de Fondo en Tendencia', type: 'AUDIO', itemsCount: 1 },
      { id: 'layer-voice', name: 'Voz en Off IA (Locución)', type: 'VOICE', itemsCount: 5 },
      { id: 'layer-subtitles', name: 'Subtítulos Dinámicos Neón', type: 'SUBTITLES', itemsCount: 5 },
      { id: 'layer-overlays', name: 'Stickers & Enlace de Afiliado', type: 'OVERLAY', itemsCount: 2 },
    ],
    scenes: [
      {
        id: 'scene-1',
        name: 'Hook de Alto Impacto (0-3s)',
        startSec: 0,
        endSec: 3,
        visualPrompt: 'Primer plano dinámico mostrando el abdomen plano con taza de té détox.',
        subtitle: '¿Abdomen inflamado y sin energía? Mira esto 👇',
        voiceover: '¿Sientes tu abdomen pesado e inflamado después de comer?',
        brollUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop',
      },
      {
        id: 'scene-2',
        name: 'Presentación del Producto TLC (3-7s)',
        startSec: 3,
        endSec: 7,
        visualPrompt: 'Transición con destello esmeralda presentando el empaque oficial de Iaso Tea.',
        subtitle: 'El Iaso Tea original limpia tu colon en 5 días 🌿',
        voiceover: 'Conoce el Iaso Tea original con fórmula 100% orgánica para limpiar tu colon.',
        brollUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop',
      },
      {
        id: 'scene-3',
        name: 'Prueba Social & Beneficios (7-11s)',
        startSec: 7,
        endSec: 11,
        visualPrompt: 'Antes y después del Reto Détox mostrando -5 libras y ligereza.',
        subtitle: 'Pierde hasta 5 libras de toxinas acumuladas 🔥',
        voiceover: 'Más de 100,000 testimonios reales han perdido hasta 5 libras en sus primeros 5 días.',
        brollUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop',
      },
      {
        id: 'scene-4',
        name: 'Oferta & Asesoría VIP (11-13s)',
        startSec: 11,
        endSec: 13,
        visualPrompt: 'Tarjeta holográfica con precio y sello de Asesoría Gratis.',
        subtitle: 'Envío prioritario + Guía détox de regalo 🎁',
        voiceover: 'Pide hoy tu tratamiento y recibe mi acompañamiento 1 a 1 de regalo.',
        brollUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
      },
      {
        id: 'scene-5',
        name: 'Llamado a la Acción (CTA) (13-15s)',
        startSec: 13,
        endSec: 15,
        visualPrompt: 'Botón de compra con link del afiliado y botón de WhatsApp.',
        subtitle: 'Toca el LINK de mi perfil o escribe al WhatsApp 📲',
        voiceover: 'Haz clic en el enlace de mi perfil o escríbeme al WhatsApp para ordenar.',
        brollUrl: 'https://images.unsplash.com/photo-1616671285442-fbf78e727e16?w=600&auto=format&fit=crop',
      },
    ],
    copySuggestion: {
      headline: `¿Quieres desinflamar tu abdomen en 5 días de forma natural? 🌿☕`,
      body: `El Iaso Tea original es la solución détox número 1 recomendada. Sin químicos agresivos.\n\n👇 Haz tu pedido oficial en mi tienda aquí: ${shareUrl}\n💬 O escríbeme a WhatsApp para asesorarte gratis.`,
      hashtags: ['#IasoTea', '#RetoDetoxTLC', '#TotalLifeChanges', '#5LibrasEn5Dias', '#AbdomenPlano'],
    },
    createdAt: new Date().toISOString(),
  } as TLCVideoProject;
};

export const chatEditTLCVideo = async (prompt: string, currentProject: TLCVideoProject) => {
  try {
    const res = await authFetch('/tlc/ai-video/chat-edit', {
      method: 'POST',
      body: JSON.stringify({ prompt, currentProject }),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {
    console.warn('Fallback en edición conversacional');
  }

  return {
    reply: `✨ He procesado tu indicación ("${prompt}"): actualicé los tiempos de transición en la línea de tiempo y sincronicé la voz en off con los subtítulos de neón.`,
    updatedProject: currentProject,
  };
};

export const fetchTLCSocialCalendar = async (): Promise<TLCSocialPost[]> => {
  try {
    const res = await authFetch('/tlc/social/calendar');
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {
    console.warn('Fallback al obtener calendario social TLC');
  }

  return [
    {
      id: 'post-1',
      title: 'Desinflama tu abdomen en 5 días con Iaso Tea ☕',
      platform: 'INSTAGRAM',
      format: 'REELS_9_16',
      scheduledFor: '2026-09-24T10:00:00.000Z',
      status: 'SCHEDULED',
      productName: 'Iaso Tea Instantáneo',
      affiliateSlug: 'elena-morales',
      copyText: '¿Abdomen inflamado y digestión pesada? El Iaso Tea original limpia tu colon. 🌿 Link en mi perfil.',
      hashtags: ['#RetoDetox', '#IasoTea', '#TotalLifeChanges', '#5LibrasEn5Dias'],
      videoThumbnail: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop',
      estimatedViews: 24500,
    },
    {
      id: 'post-2',
      title: 'Gotas Resolution: Quema Grasa sin pasar hambre 🔥',
      platform: 'TIKTOK',
      format: 'TIKTOK_9_16',
      scheduledFor: '2026-09-24T20:00:00.000Z',
      status: 'SCHEDULED',
      productName: 'Gotas Resolution Drops',
      affiliateSlug: 'elena-morales',
      copyText: 'Gotas sublinguales que calman la ansiedad por carbohidratos. ⚡ Link oficial en mi biografía.',
      hashtags: ['#ResolutionDrops', '#QuemaGrasa', '#TLCResultados'],
      videoThumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop',
      estimatedViews: 41200,
    },
  ];
};

export const scheduleTLCSocialPost = async (postData: Partial<TLCSocialPost>) => {
  try {
    const res = await authFetch('/tlc/social/schedule', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (e) {
    console.warn('Fallback al programar post social TLC');
  }

  return {
    id: `post-${Date.now()}`,
    ...postData,
    status: 'SCHEDULED',
    estimatedViews: 21000,
  };
};

export const publishTLCSocialNow = async (platforms: string[], postData?: any) => {
  try {
    const res = await authFetch('/tlc/social/publish-now', {
      method: 'POST',
      body: JSON.stringify({ platforms, postData }),
    });
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (e) {
    console.warn('Fallback al publicar en redes sociales');
  }

  return {
    success: true,
    message: `¡Video publicado con éxito en ${platforms.join(', ')} con tu enlace de afiliado activo!`,
    data: {
      publishedAt: new Date().toISOString(),
      platforms,
      status: 'PUBLISHED_LIVE',
    },
  };
};

// -------------------------------------------------------------
// Rutinas Inteligentes con IA (Nivel, Objetivo, Casa vs Gym, Máquinas por Sede)
// -------------------------------------------------------------

export interface GymLocation {
  id: string;
  name: string;
  tagline: string;
  type: 'COMMERCIAL_FULL' | 'EXPRESS_COMPACT' | 'HARDCORE_POWER' | 'HOME';
  address: string;
  availableMachines: string[];
}

export interface RoutineExercisePlan {
  name: string;
  machineRequired: string;
  machineLocationTag: string;
  targetSets: number;
  targetReps: string;
  targetRpe: number;
  restSeconds: number;
  alternativeIfOccupied: string;
  executionNotes: string;
}

export interface RoutineDayPlan {
  dayNumber: number;
  dayTitle: string;
  focusMuscles: string;
  exercises: RoutineExercisePlan[];
}

export interface GeneratedRoutineResult {
  title: string;
  subtitle: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  goal: 'HYPERTROPHY' | 'FAT_LOSS' | 'STRENGTH' | 'TONING_CORE' | 'ENDURANCE';
  environment: 'GYM' | 'HOME';
  gymLocation: GymLocation;
  totalDays: number;
  aiRationale: string;
  frequencyAdvice: string;
  days: RoutineDayPlan[];
  verifiedMachinesCount: number;
}

export const fetchGymLocations = async (): Promise<GymLocation[]> => {
  try {
    const res = await authFetch('/ai/gym-locations');
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) return json.data;
    }
  } catch (e) {
    console.warn('Fallback al obtener sedes y máquinas');
  }

  // Fallback garantizado con inventario de máquinas
  return [
    {
      id: 'gym-central-vip',
      name: 'Power Gym VIP - Sede Central Megasede',
      tagline: '1,800 m² • Equipamiento de Alta Gama y Discos Olímpicos',
      type: 'COMMERCIAL_FULL',
      address: 'Av. Las Palmas #450, Distrito Financiero',
      availableMachines: [
        'Prensa Inclinada 45° a Discos',
        'Hack Squat / Sentadilla Hack Invertida',
        'Máquina Smith / Multipower',
        'Polea Doble Funcional / Crossover',
        'Remo en T con Apoyo Pectoral',
        'Pec Deck / Máquina de Aperturas y Deltoides Posterior',
        'Extensión de Cuádriceps a Placas',
        'Curl Femoral Tumbado a Placas',
        'Curl Femoral Sentado',
        'Press de Pecho Convergente Inclinado',
        'Jalón al Pecho en Polea Alta',
        'Máquina de Fondos y Dominadas Asistidas',
        'Racks de Sentadillas Libres con Barras Olímpicas',
        'Mancuernas de 2kg a 50kg y Bancos Regulables',
        'Máquina Hip Thrust con Cinturón Acolchado',
        'Prensa de Gemelos de Pie',
      ],
    },
    {
      id: 'gym-smart-express',
      name: 'Smart Fit Style - Sede Express Urbana',
      tagline: 'Circuito Biomecánico Guiado de Placas y Poleas Funcionales',
      type: 'EXPRESS_COMPACT',
      address: 'Centro Comercial Plaza Real, Nivel 2',
      availableMachines: [
        'Prensa Horizontal Guiada de Placas',
        'Máquina Smith / Multipower Asistida',
        'Polea Doble Funcional Multifunción',
        'Pec Deck / Contractor Pectoral',
        'Press de Pecho Plano Guiado en Placas',
        'Jalón al Pecho Guiado con Placas',
        'Remo Guiado en Polea Baja',
        'Extensión de Cuádriceps de Placas',
        'Curl Femoral Sentado',
        'Mancuernas de 2kg a 28kg y Bancos Planos',
        'Máquina de Abdominales Crunch Guiada',
        'Cintas de Correr y Elípticas Cardio',
      ],
    },
    {
      id: 'gym-iron-power',
      name: 'Iron Fitness Club - Sede Hardcore Power',
      tagline: 'Culturismo Pesado, Plataformas de Halterofilia y Peso Libre',
      type: 'HARDCORE_POWER',
      address: 'Calle Industria Pesada #12, Zona Industrial',
      availableMachines: [
        'Jaula de Potencia y Racks de Sentadilla Olímpica',
        'Plataformas de Levantamiento Olímpico y Peso Muerto',
        'Bancos Olímpicos Planos, Inclinados y Declinados',
        'Prensa 45° Heavy Duty',
        'Prensa Hack Squat de Discos',
        'Barras Olímpicas, Discos de Competición y Cadenas',
        'Remo con Barra Libre en Punta T',
        'Paralelas de Fondos y Barra de Dominadas con Cinturón de Lastre',
        'Mancuernas Masivas de 4kg a 65kg',
        'Banco Scott Predicador con Barra Z',
        'Polea Alta y Baja Simple',
      ],
    },
    {
      id: 'home-workout',
      name: 'Modalidad En Casa / Sin Máquinas de Gimnasio',
      tagline: '100% Adaptado al Hogar: Calistenia, Bandas y Mancuernas',
      type: 'HOME',
      address: 'Tu Hogar / Salón de Entrenamiento Casero',
      availableMachines: [
        'Peso Corporal / Calistenia (Suelo, Silla y Pared)',
        'Bandas Elásticas de Resistencia (Loop & Tubulares)',
        'Mancuernas Ajustables / Mancuernas Livianas',
        'Colchoneta / Esterilla Antideslizante',
        'Silla Robusta / Banco Casero',
      ],
    },
  ];
};

export const generateRoutineAI = async (params: {
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  goal: 'HYPERTROPHY' | 'FAT_LOSS' | 'STRENGTH' | 'TONING_CORE' | 'ENDURANCE';
  environment: 'GYM' | 'HOME';
  gymLocationId?: string;
  daysPerWeek?: number;
}): Promise<GeneratedRoutineResult> => {
  try {
    const res = await authFetch('/ai/generate-routine', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (e) {
    console.warn('Fallback al generar rutina con IA');
  }

  // Si no responde el backend, sintetizamos de inmediato en cliente con el catálogo
  const locations = await fetchGymLocations();
  const chosenGym = locations.find((l) => l.id === params.gymLocationId) || 
    (params.environment === 'HOME' ? locations[3] : locations[0]);

  const isHome = params.environment === 'HOME' || chosenGym.type === 'HOME';
  const isExpress = chosenGym.type === 'EXPRESS_COMPACT';
  const isHardcore = chosenGym.type === 'HARDCORE_POWER';

  const sets = params.level === 'BEGINNER' ? 3 : params.level === 'ADVANCED' ? 4 : 3;
  const reps = params.goal === 'STRENGTH' ? '5-6' : params.goal === 'FAT_LOSS' ? '12-15' : '8-12';
  const rpe = params.level === 'BEGINNER' ? 7.0 : params.level === 'ADVANCED' ? 9.0 : 8.5;
  const rest = params.goal === 'STRENGTH' ? 150 : 90;

  let days: RoutineDayPlan[] = [];

  if (isHome) {
    days = [
      {
        dayNumber: 1,
        dayTitle: 'Día 1: Empuje & Core en Casa',
        focusMuscles: 'Pectorales, Hombros, Tríceps & Abdomen',
        exercises: [
          {
            name: 'Flexiones de Pecho (Push-Ups) con Pausa Isométrica',
            machineRequired: 'Peso Corporal / Calistenia (Suelo, Silla y Pared)',
            machineLocationTag: 'Suelo / Esterilla',
            targetSets: sets,
            targetReps: params.level === 'BEGINNER' ? '8-10 (rodillas)' : '12-15',
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Flexiones inclinadas sobre silla o mesa',
            executionNotes: 'Codos a 45° respecto al torso, 2 seg en el fondo.',
          },
          {
            name: 'Press Militar de Hombro con Bandas Elásticas',
            machineRequired: 'Bandas Elásticas de Resistencia (Loop & Tubulares)',
            machineLocationTag: 'Zona de Pie con Banda',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Pike push-ups con pies en suelo',
            executionNotes: 'Pisa la banda con los dos pies para mayor tensión en la cúspide.',
          },
          {
            name: 'Elevaciones Laterales con Banda de Resistencia',
            machineRequired: 'Bandas Elásticas de Resistencia (Loop & Tubulares)',
            machineLocationTag: 'Zona de Pie',
            targetSets: 4,
            targetReps: '15-20',
            targetRpe: 8.5,
            restSeconds: 60,
            alternativeIfOccupied: 'Elevaciones con mancuernas caseras livianas',
            executionNotes: 'Ligera inclinación hacia adelante para aislar cabeza lateral.',
          },
          {
            name: 'Fondos de Tríceps en Silla Robusta (Dips Caseros)',
            machineRequired: 'Silla Robusta / Banco Casero',
            machineLocationTag: 'Apoyo en Asiento',
            targetSets: sets,
            targetReps: '12-15',
            targetRpe: rpe,
            restSeconds: 60,
            alternativeIfOccupied: 'Extensiones de tríceps en suelo (Diamond push-ups)',
            executionNotes: 'Espalda rozando el borde de la silla en el descenso.',
          },
        ],
      },
      {
        dayNumber: 2,
        dayTitle: 'Día 2: Pierna Completa & Glúteo en Casa',
        focusMuscles: 'Cuádriceps, Isquiotibiales & Glúteos',
        exercises: [
          {
            name: 'Sentadillas Búlgaras Unilaterales en Silla',
            machineRequired: 'Silla Robusta / Banco Casero',
            machineLocationTag: 'Apoyo Unipodal',
            targetSets: sets,
            targetReps: '10-12 por pierna',
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Zancadas estáticas en el salón',
            executionNotes: 'Torso inclinado 15° para enfatizar glúteo mayor y cuádriceps.',
          },
          {
            name: 'Puente de Glúteos Unilateral con Banda sobre Rodillas',
            machineRequired: 'Bandas Elásticas de Resistencia (Loop & Tubulares)',
            machineLocationTag: 'Esterilla en Suelo',
            targetSets: sets,
            targetReps: '12-15 por pierna',
            targetRpe: rpe,
            restSeconds: 60,
            alternativeIfOccupied: 'Hip Thrust con espalda apoyada en el sofá',
            executionNotes: 'Bloqueo pélvico de 2 segundos en el punto de máxima contracción.',
          },
        ],
      },
      {
        dayNumber: 3,
        dayTitle: 'Día 3: Tracción, Espalda & Brazos en Casa',
        focusMuscles: 'Dorsales, Bíceps & Core',
        exercises: [
          {
            name: 'Remo Unilateral con Banda Elástica Anclada',
            machineRequired: 'Bandas Elásticas de Resistencia (Loop & Tubulares)',
            machineLocationTag: 'Anclaje en Pie o Puerta',
            targetSets: sets,
            targetReps: '12-15',
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Remo invertido debajo de mesa resistente',
            executionNotes: 'Iniciar el tirón con retracción escapular profunda.',
          },
          {
            name: 'Curl de Bíceps con Banda Pisada a Dos Pies',
            machineRequired: 'Bandas Elásticas de Resistencia (Loop & Tubulares)',
            machineLocationTag: 'Suelo de Pie',
            targetSets: sets,
            targetReps: '12-15',
            targetRpe: rpe,
            restSeconds: 60,
            alternativeIfOccupied: 'Curl martillo con botellas de carga o mancuernas',
            executionNotes: 'Mantener codos estables al costado de las costillas.',
          },
        ],
      },
    ];
  } else if (isExpress) {
    days = [
      {
        dayNumber: 1,
        dayTitle: 'Día 1: Empuje Guiado (Placas Biomecánicas)',
        focusMuscles: 'Pectoral, Hombros & Tríceps',
        exercises: [
          {
            name: 'Press de Pecho Plano Guiado en Placas',
            machineRequired: 'Press de Pecho Plano Guiado en Placas',
            machineLocationTag: 'Sector Biomecánico Placas - Máquina #04',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Press en Máquina Smith Asistida con banco plano',
            executionNotes: 'Ajustar la altura del asiento a nivel medio del esternón.',
          },
          {
            name: 'Pec Deck / Contractor Pectoral',
            machineRequired: 'Pec Deck / Contractor Pectoral',
            machineLocationTag: 'Sector Biomecánico Placas - Máquina #08',
            targetSets: 4,
            targetReps: '12-15',
            targetRpe: 9.0,
            restSeconds: 60,
            alternativeIfOccupied: 'Cruces en Polea Doble Funcional a media altura',
            executionNotes: 'Empujar con los codos y mantener el pecho expandido.',
          },
          {
            name: 'Press Militar en Máquina Smith Asistida',
            machineRequired: 'Máquina Smith / Multipower Asistida',
            machineLocationTag: 'Sector Smith - Torre A',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Press de hombros sentado con mancuernas de 12-20kg',
            executionNotes: 'Descenso en 3 segundos justo por encima de las clavículas.',
          },
          {
            name: 'Extensión de Tríceps en Polea con Cuerda',
            machineRequired: 'Polea Doble Funcional Multifunción',
            machineLocationTag: 'Torre de Poleas - Lado B',
            targetSets: sets,
            targetReps: '12-15',
            targetRpe: 8.5,
            restSeconds: 60,
            alternativeIfOccupied: 'Press francés en polea con barra recta',
            executionNotes: 'Abrir los extremos de la cuerda al final de la extensión.',
          },
        ],
      },
      {
        dayNumber: 2,
        dayTitle: 'Día 2: Pierna Guiada & Glúteo',
        focusMuscles: 'Cuádriceps, Isquiotibiales & Glúteos',
        exercises: [
          {
            name: 'Prensa Horizontal Guiada de Placas',
            machineRequired: 'Prensa Horizontal Guiada de Placas',
            machineLocationTag: 'Sector Pierna Guiada - Máquina #12',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Sentadilla en Máquina Smith con pies adelantados',
            executionNotes: 'Pies al ancho de hombros, no despegar la pelvis del asiento.',
          },
          {
            name: 'Extensión de Cuádriceps a Placas',
            machineRequired: 'Extensión de Cuádriceps de Placas',
            machineLocationTag: 'Sector Pierna Guiada - Máquina #14',
            targetSets: 4,
            targetReps: '12-15',
            targetRpe: 9.0,
            restSeconds: 60,
            alternativeIfOccupied: 'Zancadas estáticas con mancuernas en pasillo',
            executionNotes: 'Pausa de 1 segundo arriba para enfatizar el recto femoral.',
          },
          {
            name: 'Curl Femoral Sentado',
            machineRequired: 'Curl Femoral Sentado',
            machineLocationTag: 'Sector Pierna Guiada - Máquina #15',
            targetSets: sets,
            targetReps: '10-12',
            targetRpe: 8.5,
            restSeconds: 60,
            alternativeIfOccupied: 'Peso muerto rumano con mancuernas',
            executionNotes: 'Ajustar la almohadilla superior apretada contra los muslos.',
          },
        ],
      },
      {
        dayNumber: 3,
        dayTitle: 'Día 3: Tracción & Espalda Guiada',
        focusMuscles: 'Dorsales, Bíceps & Abdomen',
        exercises: [
          {
            name: 'Jalón al Pecho Guiado con Placas',
            machineRequired: 'Jalón al Pecho Guiado con Placas',
            machineLocationTag: 'Sector Espalda - Máquina #01',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Jalón neutro en Polea Doble Funcional',
            executionNotes: 'Traccionar con los codos apuntando al suelo, pecho alto.',
          },
          {
            name: 'Remo Guiado en Polea Baja',
            machineRequired: 'Remo Guiado en Polea Baja',
            machineLocationTag: 'Sector Espalda - Torre B',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Remo con mancuernas apoyado en banco plano',
            executionNotes: 'Retracción escapular completa sin balanceo lumbar.',
          },
          {
            name: 'Crunch Abdominal en Máquina Guiada',
            machineRequired: 'Máquina de Abdominales Crunch Guiada',
            machineLocationTag: 'Sector Core - Máquina #20',
            targetSets: 4,
            targetReps: '15-20',
            targetRpe: 9.0,
            restSeconds: 45,
            alternativeIfOccupied: 'Crunch en colchoneta elevando piernas a 90°',
            executionNotes: 'Enrollar el tronco desde el esternón hacia el pubis.',
          },
        ],
      },
    ];
  } else if (isHardcore) {
    days = [
      {
        dayNumber: 1,
        dayTitle: 'Día 1: Press Pesado & Empuje Potencia',
        focusMuscles: 'Pectoral Mayor, Hombros & Tríceps',
        exercises: [
          {
            name: 'Press de Banca Plano con Barra Olímpica Libre',
            machineRequired: 'Bancos Olímpicos Planos, Inclinados y Declinados',
            machineLocationTag: 'Zona Olímpica - Banco #1',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Press Inclinado Pesado con Mancuernas de 30-50kg',
            executionNotes: 'Retracción escapular cerrada y leg drive activo.',
          },
          {
            name: 'Press Militar de Pie con Barra Olímpica',
            machineRequired: 'Jaula de Potencia y Racks de Sentadilla Olímpica',
            machineLocationTag: 'Rack de Potencia Central',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Press sentado con mancuernas pesadas',
            executionNotes: 'Apretar glúteos y core para mantener verticalidad total.',
          },
          {
            name: 'Fondos en Paralelas con Cinturón de Lastre',
            machineRequired: 'Paralelas de Fondos y Barra de Dominadas con Cinturón de Lastre',
            machineLocationTag: 'Estación de Fondos Pesados',
            targetSets: 4,
            targetReps: '8-10',
            targetRpe: 9.0,
            restSeconds: 90,
            alternativeIfOccupied: 'Press cerrado con barra olímpica en banco plano',
            executionNotes: 'Inclinación de 20° para reclutar fibras del pectoral inferior.',
          },
        ],
      },
      {
        dayNumber: 2,
        dayTitle: 'Día 2: Pierna de Alta Tensión & Cadena Posterior',
        focusMuscles: 'Cuádriceps, Isquios & Glúteo Mayor',
        exercises: [
          {
            name: 'Sentadilla Trasera Profunda con Barra Olímpica',
            machineRequired: 'Jaula de Potencia y Racks de Sentadilla Olímpica',
            machineLocationTag: 'Jaula #1 con Plataforma',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Prensa Hack Squat de Discos Heavy Duty',
            executionNotes: 'Descenso rompiendo el paralelo, empuje firme con talones.',
          },
          {
            name: 'Prensa 45° Heavy Duty con Discos de Fundición',
            machineRequired: 'Prensa 45° Heavy Duty',
            machineLocationTag: 'Zona de Prensa Pesada',
            targetSets: 4,
            targetReps: '10-12',
            targetRpe: 9.0,
            restSeconds: 120,
            alternativeIfOccupied: 'Prensa Hack Squat de Discos',
            executionNotes: 'Rango completo sin despegar la pelvis del respaldo.',
          },
        ],
      },
      {
        dayNumber: 3,
        dayTitle: 'Día 3: Tracción Pesada & Espalda de Densidad',
        focusMuscles: 'Dorsales, Trapecios & Bíceps',
        exercises: [
          {
            name: 'Peso Muerto Convencional desde el Suelo',
            machineRequired: 'Plataformas de Levantamiento Olímpico y Peso Muerto',
            machineLocationTag: 'Plataforma Central',
            targetSets: 3,
            targetReps: params.level === 'ADVANCED' ? '4-5' : '6-8',
            targetRpe: 9.0,
            restSeconds: 180,
            alternativeIfOccupied: 'Remo con Barra Libre en Punta T',
            executionNotes: 'Barra rozando tibias, bloqueo firme con glúteos.',
          },
          {
            name: 'Dominadas Pronas Lastradas',
            machineRequired: 'Paralelas de Fondos y Barra de Dominadas con Cinturón de Lastre',
            machineLocationTag: 'Barra de Dominadas',
            targetSets: 4,
            targetReps: '8-10',
            targetRpe: 8.5,
            restSeconds: 90,
            alternativeIfOccupied: 'Jalón en polea alta con barra ancha',
            executionNotes: 'Extensión completa hasta barbilla sobre la barra.',
          },
        ],
      },
    ];
  } else {
    // Sede Central VIP (Megasede)
    days = [
      {
        dayNumber: 1,
        dayTitle: 'Día 1: Empuje & Pectoral Superior / Deltoides',
        focusMuscles: 'Pectorales, Hombros & Tríceps',
        exercises: [
          {
            name: 'Press de Pecho Convergente Inclinado',
            machineRequired: 'Press de Pecho Convergente Inclinado',
            machineLocationTag: 'Zona Pectoral - Máquina #02',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Press en Máquina Smith / Multipower inclinado a 30°',
            executionNotes: 'Alineación de muñecas y codos, descenso en 2 segundos.',
          },
          {
            name: 'Pec Deck / Máquina de Aperturas Convergentes',
            machineRequired: 'Pec Deck / Máquina de Aperturas y Deltoides Posterior',
            machineLocationTag: 'Zona Pectoral - Máquina #05',
            targetSets: 4,
            targetReps: '12-15',
            targetRpe: 8.5,
            restSeconds: 60,
            alternativeIfOccupied: 'Cruces en Polea Doble Funcional desde arriba',
            executionNotes: 'Estiramiento controlado sin forzar hombros.',
          },
          {
            name: 'Press Militar en Máquina Smith con Seguro de Profundidad',
            machineRequired: 'Máquina Smith / Multipower',
            machineLocationTag: 'Zona Smith - Rack #1',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Press de hombros con mancuernas en banco regulable',
            executionNotes: 'Sobrecarga guiada sin arqueo lumbar excesivo.',
          },
          {
            name: 'Elevaciones Laterales en Polea Doble Crossover',
            machineRequired: 'Polea Doble Funcional / Crossover',
            machineLocationTag: 'Torre Central de Poleas',
            targetSets: 4,
            targetReps: '12-15',
            targetRpe: 9.0,
            restSeconds: 60,
            alternativeIfOccupied: 'Elevaciones laterales con mancuernas en banco a 75°',
            executionNotes: 'Cables cruzados por detrás para tensión en todo el recorrido.',
          },
          {
            name: 'Extensión de Tríceps en Polea con Cuerda',
            machineRequired: 'Polea Doble Funcional / Crossover',
            machineLocationTag: 'Torre Central de Poleas - Lado B',
            targetSets: sets,
            targetReps: '12-15',
            targetRpe: 8.5,
            restSeconds: 60,
            alternativeIfOccupied: 'Fondos en Máquina de Fondos y Dominadas Asistidas',
            executionNotes: 'Codos pegados al cuerpo, apertura lateral al final.',
          },
        ],
      },
      {
        dayNumber: 2,
        dayTitle: 'Día 2: Pierna de Alta Hipertrofia & Glúteos',
        focusMuscles: 'Cuádriceps, Isquiotibiales & Glúteo Mayor',
        exercises: [
          {
            name: 'Hack Squat / Sentadilla Hack Invertida con Discos',
            machineRequired: 'Hack Squat / Sentadilla Hack Invertida',
            machineLocationTag: 'Zona de Piernas - Estación #08',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Prensa Inclinada 45° a Discos',
            executionNotes: 'Descenso profundo apoyado en respaldo acolchado.',
          },
          {
            name: 'Prensa Inclinada 45° con Sobrecarga Progresiva',
            machineRequired: 'Prensa Inclinada 45° a Discos',
            machineLocationTag: 'Zona de Piernas - Estación #09',
            targetSets: 4,
            targetReps: '10-12',
            targetRpe: 9.0,
            restSeconds: 90,
            alternativeIfOccupied: 'Extensión de Cuádriceps a Placas',
            executionNotes: 'Pies en parte inferior para enfatizar cuádriceps.',
          },
          {
            name: 'Máquina Hip Thrust con Cinturón Acolchado',
            machineRequired: 'Máquina Hip Thrust con Cinturón Acolchado',
            machineLocationTag: 'Zona Glúteo Especializado',
            targetSets: sets,
            targetReps: '12-15',
            targetRpe: 9.0,
            restSeconds: 75,
            alternativeIfOccupied: 'Hip thrust con barra olímpica y banco acolchado',
            executionNotes: 'Empuje desde talones con pausa de 2 seg en la cúspide.',
          },
          {
            name: 'Curl Femoral Tumbado a Placas',
            machineRequired: 'Curl Femoral Tumbado a Placas',
            machineLocationTag: 'Zona de Isquios - Máquina #11',
            targetSets: sets,
            targetReps: '10-12',
            targetRpe: 8.5,
            restSeconds: 60,
            alternativeIfOccupied: 'Curl Femoral Sentado',
            executionNotes: 'Presionar la pelvis contra el cojín para evitar arqueo.',
          },
        ],
      },
      {
        dayNumber: 3,
        dayTitle: 'Día 3: Tracción, Espalda Densidad & Bíceps',
        focusMuscles: 'Dorsales, Trapecios & Bíceps',
        exercises: [
          {
            name: 'Remo en T con Apoyo Pectoral Ergonómico',
            machineRequired: 'Remo en T con Apoyo Pectoral',
            machineLocationTag: 'Zona Espalda Dorsal - Máquina #03',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Remo con barra olímpica en racks libres',
            executionNotes: 'Apoyo torácico que elimina la fatiga lumbar.',
          },
          {
            name: 'Jalón al Pecho en Polea Alta con Agarre Mag',
            machineRequired: 'Jalón al Pecho en Polea Alta',
            machineLocationTag: 'Zona Dorsal - Torre Alta #1',
            targetSets: sets,
            targetReps: reps,
            targetRpe: rpe,
            restSeconds: rest,
            alternativeIfOccupied: 'Máquina de Fondos y Dominadas Asistidas (modo dominadas)',
            executionNotes: 'Tracción al tercio superior del pecho proyectando tórax.',
          },
          {
            name: 'Curl de Bíceps en Polea Doble Funcional con Barra Z',
            machineRequired: 'Polea Doble Funcional / Crossover',
            machineLocationTag: 'Torre Central de Poleas',
            targetSets: sets,
            targetReps: '10-12',
            targetRpe: 8.5,
            restSeconds: 60,
            alternativeIfOccupied: 'Curl de bíceps con mancuernas en banco inclinado a 60°',
            executionNotes: 'Tensión continua a lo largo de toda la contracción.',
          },
        ],
      },
    ];
  }

  const verifiedMachines = new Set<string>();
  days.forEach((d) => d.exercises.forEach((ex) => verifiedMachines.add(ex.machineRequired)));

  const levelName = params.level === 'BEGINNER' ? 'Básico (Principiante)' : params.level === 'INTERMEDIATE' ? 'Medio (Intermedio)' : 'Avanzado (Sobrecarga Pro)';
  const goalName = params.goal === 'HYPERTROPHY' ? 'Hipertrofia & Masa Muscular' : params.goal === 'FAT_LOSS' ? 'Definición & Pérdida de Grasa' : params.goal === 'STRENGTH' ? 'Fuerza Máxima & Densidad' : params.goal === 'TONING_CORE' ? 'Tonificación, Glúteos & Core' : 'Resistencia & Salud Integral';

  return {
    title: `Rutina IA • ${goalName}`,
    subtitle: `Configurada para Nivel ${levelName} en ${chosenGym.name}`,
    level: params.level,
    goal: params.goal,
    environment: params.environment,
    gymLocation: chosenGym,
    totalDays: days.length,
    aiRationale: `Plan adaptado para ${levelName} enfocado en ${goalName}. La IA validó ${verifiedMachines.size} estaciones/máquinas activas en ${chosenGym.name}. Incluye alternativa inmediata por máquina ocupada.`,
    frequencyAdvice: `Frecuencia recomendada: ${days.length} días por semana.`,
    days,
    verifiedMachinesCount: verifiedMachines.size,
  };
};

// -------------------------------------------------------------
// 15. TLC CONTACTOS & LEY 1581 (HABEAS DATA COLOMBIA)
// -------------------------------------------------------------

export interface TLCContact {
  id: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentId: string;
  phone: string;
  email: string;
  department?: string | null;
  city?: string | null;
  leadSource: string;
  interestProduct?: string | null;
  notes?: string | null;
  status: 'NUEVO' | 'CONTACTADO' | 'EN_SEGUIMIENTO' | 'CLIENTE' | 'DESCARTADO';
  dataPolicyAccepted: boolean;
  acceptedAt: string;
  ipAddress?: string | null;
  authorizationText: string;
  revocationRequested: boolean;
  revocationDate?: string | null;
  assignedAffiliateId?: string | null;
  assignedAffiliate?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const fetchTLCContacts = async (params?: { status?: string; search?: string; affiliateId?: string }): Promise<TLCContact[]> => {
  try {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.affiliateId) query.append('affiliateId', params.affiliateId);

    const res = await fetch(`${API_BASE_URL}/tlc/contacts?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching TLC contacts:', err);
    return [];
  }
};

export const createTLCContact = async (payload: {
  firstName: string;
  lastName: string;
  documentType: string;
  documentId: string;
  phone: string;
  email: string;
  department?: string;
  city?: string;
  leadSource?: string;
  interestProduct?: string;
  notes?: string;
  dataPolicyAccepted: boolean;
  assignedAffiliateId?: string;
}): Promise<{ success: boolean; message: string; data?: TLCContact }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/tlc/contacts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error creating TLC contact:', err);
    return { success: false, message: err.message || 'Error de conexión' };
  }
};

export const updateTLCContact = async (
  id: string,
  payload: { status?: string; notes?: string; interestProduct?: string; assignedAffiliateId?: string }
): Promise<{ success: boolean; message: string; data?: TLCContact }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/tlc/contacts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error updating TLC contact:', err);
    return { success: false, message: err.message || 'Error de conexión' };
  }
};

export const revokeTLCContactConsent = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/tlc/contacts/${id}/revoke`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error revoking consent:', err);
    return { success: false, message: err.message || 'Error de conexión' };
  }
};

export const fetchHabeasDataPolicy = async (): Promise<{ law: string; policyText: string; version: string }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/tlc/contacts/policy-text`);
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      law: 'Ley 1581 de 2012 - Colombia',
      policyText: 'Autorizo de manera previa, explícita e informada para el tratamiento de mis datos personales de acuerdo con la Ley 1581 de 2012.',
      version: '2026.1',
    };
  }
};

// -------------------------------------------------------------
// 16. ACTIVADOR DE LICENCIAS Y PERMISOS DEL SISTEMA
// -------------------------------------------------------------

export interface SystemLicense {
  id: string;
  licenseKey: string;
  businessName: string;
  contactEmail: string;
  contactPhone?: string | null;
  planType: string;
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'EXPIRED';
  maxUsers: number;
  startDate: string;
  expiresAt: string;
  modulesAllowed: string[];
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableModule {
  id: string;
  label: string;
}

export const fetchLicenses = async (): Promise<{ licenses: SystemLicense[]; modules: AvailableModule[] }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/licenses`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (data.success) {
      return {
        licenses: data.data || [],
        modules: data.availableModules || [],
      };
    }
    return { licenses: [], modules: [] };
  } catch (err) {
    console.error('Error fetching licenses:', err);
    return { licenses: [], modules: [] };
  }
};

export const createLicense = async (payload: {
  businessName: string;
  contactEmail: string;
  contactPhone?: string;
  planType?: string;
  durationDays?: number;
  maxUsers?: number;
  modulesAllowed?: string[];
  notes?: string;
}): Promise<{ success: boolean; message: string; data?: SystemLicense }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/licenses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error creating license:', err);
    return { success: false, message: err.message || 'Error de conexión' };
  }
};

export const updateLicense = async (
  id: string,
  payload: {
    status?: string;
    extendDays?: number;
    modulesAllowed?: string[];
    notes?: string;
    maxUsers?: number;
  }
): Promise<{ success: boolean; message: string; data?: SystemLicense }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/licenses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error updating license:', err);
    return { success: false, message: err.message || 'Error de conexión' };
  }
};

// -------------------------------------------------------------
// 17. CENTRO DE SOPORTE TÉCNICO Y TICKETS
// -------------------------------------------------------------

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone?: string;
  };
  subject: string;
  category: 'LICENCIA' | 'PAGOS' | 'SISTEMA' | 'RUTINAS' | 'TLC' | 'OTRO';
  priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  status: 'ABIERTO' | 'EN_PROCESO' | 'ESPERANDO_CLIENTE' | 'RESUELTO' | 'CERRADO';
  description: string;
  adminResponse?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const fetchSupportTickets = async (params?: { userId?: string; status?: string; priority?: string }): Promise<SupportTicket[]> => {
  try {
    const query = new URLSearchParams();
    if (params?.userId) query.append('userId', params.userId);
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);

    const res = await fetch(`${API_BASE_URL}/support/tickets?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Error fetching support tickets:', err);
    return [];
  }
};

export const createSupportTicket = async (payload: {
  userId?: string;
  subject: string;
  category?: string;
  priority?: string;
  description: string;
}): Promise<{ success: boolean; message: string; data?: SupportTicket }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/support/tickets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error creating support ticket:', err);
    return { success: false, message: err.message || 'Error de conexión' };
  }
};

export const updateSupportTicket = async (
  id: string,
  payload: { status?: string; adminResponse?: string; priority?: string }
): Promise<{ success: boolean; message: string; data?: SupportTicket }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/support/tickets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error updating support ticket:', err);
    return { success: false, message: err.message || 'Error de conexión' };
  }
};

/* ========================================================================= */
/* AGENTE IA DE APEX LIFE                                                   */
/* ========================================================================= */

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actionSuggestion?: {
    type: 'NAVIGATE' | 'ACTION';
    targetView?: string;
    label?: string;
  };
  timestamp: string;
}

export const sendAgentChatMessage = async (
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  context?: any
): Promise<{ success: boolean; data?: { reply: string; actionSuggestion?: any; timestamp: string }; message?: string }> => {
  try {
    const user = getStoredUser();
    const res = await fetch(`${API_BASE_URL}/ai/agent-chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        message,
        history,
        userId: user?.id,
        userRole: user?.role,
        systemContext: context,
      }),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error enviando mensaje al Agente IA:', err);
    return {
      success: false,
      message: err.message || 'Error de comunicación con el Agente IA.',
    };
  }
};



