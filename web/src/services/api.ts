// APEX GYM - Cliente API REST Conectado al Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('apex_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || `Error ${response.status}: ${response.statusText}`);
    }

    return json;
  } catch (err: any) {
    console.error(`Error en petición a ${endpoint}:`, err);
    throw err;
  }
}

// -------------------------------------------------------------
// Tipos e Interfaces
// -------------------------------------------------------------

export interface Gym {
  id: string;
  code: string;
  name: string;
  city: string;
  address: string;
  phone?: string | null;
  maxCapacity: number;
  active: boolean;
  _count?: {
    members: number;
    users: number;
  };
  users?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
  }>;
}

export interface GymAdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  gymId?: string | null;
  gym?: Gym | null;
}

export interface Member {
  id: string;
  code: string;
  documentNumber: string;
  documentType: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  email?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  address?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  photoUrl?: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'PAUSED' | 'CANCELLED';
  weight?: number | null;
  height?: number | null;
  notes?: string | null;
  medicalNotes?: string | null;
  likedFoods?: string | null;
  dislikedFoods?: string | null;
  gymId?: string | null;
  gym?: Gym | null;
  currentPlanId?: string | null;
  currentPlan?: MembershipPlan | null;
  planStartDate?: string | null;
  planEndDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  payments?: Payment[];
  checkIns?: CheckInRecord[];
  routines?: any[];
  diagnostics?: HealthDiagnostic[];
}

export interface HealthDiagnostic {
  id: string;
  memberId: string;
  photoScanUrl?: string | null;
  targetGoal: string;
  diseases?: string | null;
  injuries?: string | null;
  disabilities?: string | null;
  trainingExperience?: string | null;
  bodyFatPercentage?: number | null;
  muscleMassKg?: number | null;
  bmi?: number | null;
  biotype?: string | null;
  aiClinicalSummary?: string | null;
  prohibitedExercises?: string | null;
  recommendedActions?: string | null;
  createdAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string; // PROTEIN, CARB, FAT, VEGETABLE, FRUIT, DAIRY
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  unit?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  durationDays: number;
  accessHours?: string | null;
  includesTrainer: boolean;
  active: boolean;
  sortOrder?: number;
  _count?: { members: number };
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  memberId: string;
  planId?: string | null;
  amount: number;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | 'NEQUI_DAVIPLATA';
  notes?: string | null;
  status: 'COMPLETED' | 'VOID';
  createdAt: string;
  member?: Member;
  plan?: MembershipPlan;
}

export interface CheckInRecord {
  id: string;
  memberId: string;
  checkInTime: string;
  checkOutTime?: string | null;
  status: 'GRANTED' | 'DENIED';
  reason?: string | null;
  zone: string;
  member: Member;
}

export interface AccessVerificationResult {
  success: boolean;
  granted: boolean;
  reason: string;
  daysRemaining: number;
  alreadyInGym: boolean;
  member: {
    id: string;
    code: string;
    fullName: string;
    documentNumber: string;
    status: string;
    planName: string;
    planEndDate?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
}

export interface DashboardData {
  gymName: string;
  currency: string;
  metrics: {
    totalMembers: number;
    activeMembers: number;
    expiredMembers: number;
    expiringSoonCount: number;
    todayCheckIns: number;
    currentInGym: number;
    maxCapacity: number;
    occupancyPercent: number;
    todayRevenue: number;
  };
  zones: Array<{ name: string; code: string; capacity: number; active: number }>;
  expiringSoonMembers: Member[];
  recentCheckIns: CheckInRecord[];
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'CORE' | 'CARDIO';
  equipment?: string;
  location?: 'GYM' | 'HOME' | 'BOTH';
  description?: string;
  imageUrl?: string;
}

export interface MealItem {
  meal: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  items: string[];
}

export interface NutritionPlan {
  id: string;
  memberId: string;
  title: string;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  goal: string;
  mealsJson: string;
  meals?: MealItem[];
  trainerNotes?: string | null;
  generatedByAI: boolean;
  reviewedByTrainer: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  goal: string;
  difficulty: string;
  location?: string;
  daysPerWeek: number;
  aiNotes?: string;
  exercises: Array<{
    id: string;
    dayNumber: number;
    sets: number;
    reps: string;
    restSeconds: number;
    notes?: string;
    exercise: Exercise;
  }>;
}

export interface GymSettings {
  id: string;
  gymName: string;
  nit: string;
  phone: string;
  address: string;
  currency: string;
  maxCapacity: number;
  alertCapacity: number;
  openingHours: string;
}

// -------------------------------------------------------------
// Métodos del Servicio API
// -------------------------------------------------------------

export const api = {
  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    const res = await request<{ success: boolean; data: DashboardData }>('/dashboard');
    return res.data;
  },

  // Socios
  async getMembers(params: { search?: string; status?: string } = {}): Promise<Member[]> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    const res = await request<{ success: boolean; data: Member[] }>(`/members?${query.toString()}`);
    return res.data;
  },

  async getMemberById(id: string): Promise<Member> {
    const res = await request<{ success: boolean; data: Member }>(`/members/${id}`);
    return res.data;
  },

  async createMember(data: any): Promise<Member> {
    const res = await request<{ success: boolean; data: Member; message: string }>('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateMember(id: string, data: any): Promise<Member> {
    const res = await request<{ success: boolean; data: Member; message: string }>(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async renewMembership(memberId: string, planId: string, paymentMethod = 'CASH') {
    return request<{ success: boolean; message: string; data: Member }>(`/members/${memberId}/renew`, {
      method: 'POST',
      body: JSON.stringify({ planId, paymentMethod }),
    });
  },

  async deleteMember(memberId: string) {
    return request<{ success: boolean; message: string }>(`/members/${memberId}`, {
      method: 'DELETE',
    });
  },

  // Planes
  async getPlans(): Promise<MembershipPlan[]> {
    const res = await request<{ success: boolean; data: MembershipPlan[] }>('/plans');
    return res.data;
  },

  // Pagos y Caja
  async processPayment(data: {
    memberId: string;
    planId: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
  }): Promise<Payment> {
    const res = await request<{ success: boolean; data: Payment; message: string }>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async createPayment(data: {
    memberId: string;
    planId?: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
  }): Promise<{ data: Payment; message: string }> {
    const res = await request<{ success: boolean; data: Payment; message: string }>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res;
  },

  async getPayments(params: { search?: string; limit?: number } = {}): Promise<{ payments: Payment[]; summary: any }> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.limit) query.append('limit', params.limit.toString());
    const res = await request<{ success: boolean; data: { payments: Payment[]; summary: any } }>(`/payments?${query.toString()}`);
    return res.data;
  },

  // Control de Acceso (Torniquete y Carnet QR)
  async verifyAccess(code: string, zone = 'GENERAL'): Promise<AccessVerificationResult> {
    const res = await request<{ success: boolean; granted: boolean; reason: string; data: any }>('/checkin/verify', {
      method: 'POST',
      body: JSON.stringify({ code, zone }),
    });
    return {
      success: res.success,
      granted: res.granted,
      reason: res.reason,
      daysRemaining: res.data?.daysRemaining || 0,
      alreadyInGym: res.data?.alreadyInGym || false,
      member: res.data?.member,
    };
  },

  async getTodayCheckIns(): Promise<CheckInRecord[]> {
    const res = await request<{ success: boolean; data: CheckInRecord[] }>('/checkin/today');
    return res.data;
  },

  async registerEntry(memberId: string, zone = 'GENERAL') {
    return request<{ success: boolean; message: string; data: any }>('/checkin/entry', {
      method: 'POST',
      body: JSON.stringify({ memberId, zone }),
    });
  },

  async registerCheckOut(memberId: string) {
    return request<{ success: boolean; message: string }>('/checkin/checkout', {
      method: 'POST',
      body: JSON.stringify({ memberId }),
    });
  },

  async registerCheckout(memberId: string) {
    return request<{ success: boolean; message: string }>('/checkin/checkout', {
      method: 'POST',
      body: JSON.stringify({ memberId }),
    });
  },

  // Rutinas y Ejercicios
  async getRoutines(): Promise<Routine[]> {
    const res = await request<{ success: boolean; data: Routine[] }>('/routines');
    return res.data;
  },

  async getExercises(muscleGroup?: string): Promise<Exercise[]> {
    const query = muscleGroup ? `?muscleGroup=${muscleGroup}` : '';
    const res = await request<{ success: boolean; data: Exercise[] }>(`/exercises${query}`);
    return res.data;
  },

  async assignRoutine(memberId: string, routineId: string) {
    return request<{ success: boolean; message: string }>('/routines/assign', {
      method: 'POST',
      body: JSON.stringify({ memberId, routineId }),
    });
  },

  // Configuración
  async getSettings(): Promise<GymSettings> {
    const res = await request<{ success: boolean; data: GymSettings }>('/settings');
    return res.data;
  },

  async updateSettings(data: Partial<GymSettings>): Promise<GymSettings> {
    const res = await request<{ success: boolean; data: GymSettings }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // -------------------------------------------------------------
  // SuperAdmin: Gestión de Gimnasios / Sedes & Administradores
  // -------------------------------------------------------------
  async getGyms(): Promise<Gym[]> {
    const res = await request<{ success: boolean; data: Gym[] }>('/gyms');
    return res.data;
  },

  async createGym(data: {
    name: string;
    code: string;
    city: string;
    address: string;
    phone?: string;
    maxCapacity?: number;
  }): Promise<Gym> {
    const res = await request<{ success: boolean; message: string; data: Gym }>('/gyms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateGym(id: string, data: Partial<Gym>): Promise<Gym> {
    const res = await request<{ success: boolean; message: string; data: Gym }>(`/gyms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async getGymAdmins(): Promise<GymAdminUser[]> {
    const res = await request<{ success: boolean; data: GymAdminUser[] }>('/gyms/admins');
    return res.data;
  },

  async createGymAdmin(data: {
    name: string;
    email: string;
    password: string;
    gymId?: string;
    role?: string;
  }): Promise<GymAdminUser> {
    const res = await request<{ success: boolean; message: string; data: GymAdminUser }>('/gyms/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // -------------------------------------------------------------
  // Diagnóstico con IA (Foto Escaneo + Anamnesis de Salud & Lesiones)
  // -------------------------------------------------------------
  async generateHealthDiagnosticAI(data: {
    memberId: string;
    targetGoal: string;
    diseases?: string;
    injuries?: string;
    disabilities?: string;
    trainingExperience?: string;
    photoBase64?: string;
    weight?: number;
    height?: number;
  }): Promise<HealthDiagnostic> {
    const res = await request<{ success: boolean; message: string; data: HealthDiagnostic }>('/ai/diagnostic', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async getMemberDiagnostic(memberId: string): Promise<HealthDiagnostic | null> {
    const res = await request<{ success: boolean; data: HealthDiagnostic | null }>(`/ai/diagnostic/member/${memberId}`);
    return res.data;
  },

  // -------------------------------------------------------------
  // Catálogo de Alimentos & Preferencias
  // -------------------------------------------------------------
  async getFoodsCatalog(): Promise<FoodItem[]> {
    const res = await request<{ success: boolean; data: FoodItem[] }>('/ai/foods');
    return res.data;
  },

  async updateMemberFoodPreferences(memberId: string, data: { likedFoods: string[]; dislikedFoods: string[] }) {
    return request<{ success: boolean; message: string; data: { likedFoods: string[]; dislikedFoods: string[] } }>(
      `/ai/member-food-preferences/${memberId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  // -------------------------------------------------------------
  // Inteligencia Artificial (Google Gemini) - Nutrición & Rutinas
  // -------------------------------------------------------------
  async generateNutritionAI(data: {
    memberId: string;
    goal: string;
    dietaryRestrictions?: string;
    likedFoods?: string[];
    dislikedFoods?: string[];
    trainingDaysPerWeek?: number;
  }) {
    return request<{ success: boolean; message: string; data: NutritionPlan }>('/ai/generate-nutrition', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMemberNutrition(memberId: string): Promise<NutritionPlan | null> {
    const res = await request<{ success: boolean; data: NutritionPlan | null }>(`/ai/nutrition/member/${memberId}`);
    return res.data;
  },

  async updateNutritionPlan(id: string, data: Partial<NutritionPlan>) {
    return request<{ success: boolean; message: string; data: NutritionPlan }>(`/ai/nutrition/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async generateRoutineAI(data: {
    memberId?: string;
    goal: string;
    level: string;
    location: string; // GYM, HOME, BOTH
    daysPerWeek: number;
    assignToMember?: boolean;
  }) {
    return request<{ success: boolean; message: string; data: Routine }>('/ai/generate-routine', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateRoutineByTrainer(id: string, data: Partial<Routine>) {
    return request<{ success: boolean; message: string; data: Routine }>(`/ai/routine/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Autenticación
  async login(email: string, password: string) {
    const res = await request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      localStorage.setItem('apex_token', res.token);
      localStorage.setItem('apex_user', JSON.stringify(res.user));
    }
    return res;
  },
};
