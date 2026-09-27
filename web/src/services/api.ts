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
  currentPlanId?: string | null;
  currentPlan?: MembershipPlan | null;
  planStartDate?: string | null;
  planEndDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  payments?: Payment[];
  checkIns?: CheckInRecord[];
  routines?: any[];
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
  description?: string;
  imageUrl?: string;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  goal: string;
  difficulty: string;
  daysPerWeek: number;
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

  async renewMembership(id: string, planId: string, paymentMethod: string = 'CASH', notes?: string) {
    return request<{ success: boolean; message: string; data: any }>(`/members/${id}/renew`, {
      method: 'POST',
      body: JSON.stringify({ planId, paymentMethod, notes }),
    });
  },

  async deleteMember(id: string) {
    return request<{ success: boolean; message: string }>(`/members/${id}`, {
      method: 'DELETE',
    });
  },

  // Check-In y Control de Acceso
  async verifyAccess(identifier: string): Promise<AccessVerificationResult> {
    return request<AccessVerificationResult>('/checkin/verify', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },

  async registerEntry(identifier: string, zone: string = 'GENERAL') {
    return request<{ success: boolean; granted: boolean; message: string; data: any }>('/checkin/entry', {
      method: 'POST',
      body: JSON.stringify({ identifier, zone }),
    });
  },

  async registerCheckout(memberId: string) {
    return request<{ success: boolean; message: string; data: any }>('/checkin/checkout', {
      method: 'POST',
      body: JSON.stringify({ memberId }),
    });
  },

  async getTodayCheckIns(): Promise<CheckInRecord[]> {
    const res = await request<{ success: boolean; data: CheckInRecord[] }>('/checkin/today');
    return res.data;
  },

  // Planes
  async getPlans(): Promise<MembershipPlan[]> {
    const res = await request<{ success: boolean; data: MembershipPlan[] }>('/plans');
    return res.data;
  },

  async createPlan(data: Partial<MembershipPlan>) {
    return request<{ success: boolean; data: MembershipPlan }>('/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Pagos y Caja
  async getPayments() {
    const res = await request<{ success: boolean; data: { payments: Payment[]; summary: any } }>('/payments');
    return res.data;
  },

  async createPayment(data: { memberId: string; planId?: string; amount: number; paymentMethod: string; notes?: string }) {
    return request<{ success: boolean; message: string; data: Payment }>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Rutinas y Ejercicios
  async getRoutines(): Promise<Routine[]> {
    const res = await request<{ success: boolean; data: Routine[] }>('/routines');
    return res.data;
  },

  async createRoutine(data: any): Promise<Routine> {
    const res = await request<{ success: boolean; data: Routine }>('/routines', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async assignRoutine(memberId: string, routineId: string) {
    return request<{ success: boolean; message: string }>('/routines/assign', {
      method: 'POST',
      body: JSON.stringify({ memberId, routineId }),
    });
  },

  async getExercises(muscleGroup?: string): Promise<Exercise[]> {
    const query = muscleGroup && muscleGroup !== 'ALL' ? `?muscleGroup=${muscleGroup}` : '';
    const res = await request<{ success: boolean; data: Exercise[] }>(`/exercises${query}`);
    return res.data;
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
};
