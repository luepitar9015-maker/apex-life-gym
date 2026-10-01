import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Mail,
  Phone,
  QrCode,
  Calendar,
  RefreshCw,
  X,
  CreditCard,
  UserCheck,
  Sparkles,
  Utensils,
  Dumbbell,
  Scale,
  Building2,
  Home,
  ShieldAlert
} from 'lucide-react';
import AIBiometricEvaluationModal from '../components/AIBiometricEvaluationModal';
import { AffiliateDietModal, AffiliateRoutineModal } from '../components/AffiliatePlanModals';

const mockInitialMembers = [
  {
    id: 'AFI-101',
    name: 'Carlos Mendoza',
    email: 'carlos.m@gmail.com',
    phone: '+57 312 456 7890',
    plan: 'Plan Black VIP Anual',
    status: 'Activo',
    expires: '15/11/2026',
    totalDays: 365,
    attendance: 24,
    aiPlan: {
      evaluatedAt: '28/09/2026',
      inputs: { goal: 'HIPERTROFIA', trainingLocation: 'GYM', injuries: [] },
      biometrics: {
        bodyFat: 14.5,
        leanMass: 64.8,
        targetCalories: 2450,
        proteinGrams: 165,
        carbsGrams: 280,
        fatGrams: 68
      }
    }
  },
  {
    id: 'AFI-102',
    name: 'Andrea Torres',
    email: 'andrea.t@hotmail.com',
    phone: '+57 301 987 6543',
    plan: 'Plan Mensual Oro',
    status: 'Activo',
    expires: '05/10/2026',
    totalDays: 30,
    attendance: 18,
    aiPlan: {
      evaluatedAt: '25/09/2026',
      inputs: { goal: 'DEFINICION', trainingLocation: 'CASA', injuries: ['RODILLA'] },
      biometrics: {
        bodyFat: 22.0,
        leanMass: 46.2,
        targetCalories: 1650,
        proteinGrams: 135,
        carbsGrams: 155,
        fatGrams: 45
      }
    }
  },
  {
    id: 'AFI-103',
    name: 'Sebastián Vélez',
    email: 's.velez@outlook.com',
    phone: '+57 320 111 2233',
    plan: 'Plan Estudiante',
    status: 'Vencido',
    expires: '25/09/2026',
    totalDays: 30,
    attendance: 12
  },
  {
    id: 'AFI-104',
    name: 'Mariana Duarte',
    email: 'mariana.d@gmail.com',
    phone: '+57 315 444 5566',
    plan: 'Plan Black VIP Anual',
    status: 'Activo',
    expires: '30/12/2026',
    totalDays: 365,
    attendance: 30
  },
  {
    id: 'AFI-105',
    name: 'Felipe Morales',
    email: 'felipe.m@yahoo.com',
    phone: '+57 318 777 8899',
    plan: 'Plan Trimestral Pro',
    status: 'Pendiente',
    expires: '03/10/2026',
    totalDays: 90,
    attendance: 4
  },
  {
    id: 'AFI-106',
    name: 'Valentina Osorio',
    email: 'valen.o@gmail.com',
    phone: '+57 300 222 3344',
    plan: 'Plan Mensual Oro',
    status: 'Activo',
    expires: '20/10/2026',
    totalDays: 30,
    attendance: 15
  },
];

export default function Socios() {
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('gym_members');
      return saved ? JSON.parse(saved) : mockInitialMembers;
    } catch {
      return mockInitialMembers;
    }
  });

  const [availablePlans, setAvailablePlans] = useState(() => {
    try {
      const saved = localStorage.getItem('gym_plans');
      return saved ? JSON.parse(saved) : [
        { id: 1, name: 'Plan Mensual Oro', durationDays: 30 },
        { id: 2, name: 'Plan Black VIP Anual', durationDays: 365 },
        { id: 3, name: 'Plan Trimestral Pro', durationDays: 90 },
        { id: 4, name: 'Plan Estudiante', durationDays: 30 }
      ];
    } catch {
      return [{ id: 1, name: 'Plan Mensual Oro', durationDays: 30 }];
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Modales de IA, Dieta y Rutina
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [evaluatingMember, setEvaluatingMember] = useState(null);
  const [dietModalOpen, setDietModalOpen] = useState(false);
  const [routineModalOpen, setRoutineModalOpen] = useState(false);

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Plan Mensual Oro',
    durationDays: 30
  });

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('gym_members', JSON.stringify(members));
  }, [members]);

  // Función para calcular los días restantes del contador del afiliado
  const getDaysCountdown = (expiresStr) => {
    try {
      const parts = expiresStr.split('/');
      if (parts.length === 3) {
        const expDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T23:59:59`);
        const today = new Date();
        const diff = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
      }
    } catch (e) {}
    return 0;
  };

  // Formatear fecha sumando días a hoy
  const addDaysToToday = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + Number(days));
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'Todos' || m.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Alta de nuevo afiliado / cliente con días automáticos
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name) return;

    const expiresDate = addDaysToToday(newMember.durationDays || 30);
    const item = {
      id: `AFI-${Math.floor(100 + Math.random() * 900)}`,
      name: newMember.name,
      email: newMember.email || 'afiliado@gym.com',
      phone: newMember.phone || '+57 300 000 0000',
      plan: newMember.plan,
      status: 'Activo',
      expires: expiresDate,
      totalDays: Number(newMember.durationDays) || 30,
      attendance: 0
    };

    setMembers([item, ...members]);
    setModalOpen(false);
    setNewMember({ name: '', email: '', phone: '', plan: availablePlans[0]?.name || 'Plan Mensual Oro', durationDays: 30 });
  };

  // Renovar plan y sumar días al contador del afiliado
  const handleRenewMember = (member, plan) => {
    const daysToAdd = plan.durationDays || 30;
    const currentDays = getDaysCountdown(member.expires);
    const baseDate = currentDays > 0 ? (() => {
      const parts = member.expires.split('/');
      const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      d.setDate(d.getDate() + daysToAdd);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    })() : addDaysToToday(daysToAdd);

    const updated = members.map((m) => {
      if (m.id === member.id) {
        return {
          ...m,
          plan: plan.name,
          status: 'Activo',
          expires: baseDate,
          totalDays: (m.totalDays || 0) + daysToAdd
        };
      }
      return m;
    });

    setMembers(updated);
    setRenewModalOpen(false);
    setSelectedMember(null);
  };

  // Guardar Plan de IA (Biometría, Dieta y Rutina)
  const handleSaveAIPlan = (memberId, planData) => {
    const updated = members.map((m) => {
      if (m.id === memberId) {
        return {
          ...m,
          aiPlan: planData
        };
      }
      return m;
    });

    setMembers(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 mb-1">
            <Sparkles size={14} className="text-blue-600" />
            <span>Afiliados / Clientes • Inteligencia Artificial Biomecánica & Nutricional</span>
          </div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Directorio de Afiliados / Clientes</h1>
          <p className="text-gray-500 text-sm">
            Gestión integral de clientes, contador de membresía, validación corporal por IA, dietas y rutinas personalizadas.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all shrink-0"
        >
          <Plus size={18} />
          <span>Registrar Afiliado / Cliente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar afiliado por nombre, código o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['Todos', 'Activo', 'Pendiente', 'Vencido'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-4 px-6">Afiliado / Cliente</th>
                <th className="py-4 px-6">Contacto</th>
                <th className="py-4 px-6">Plan Asignado</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Contador de Días</th>
                <th className="py-4 px-6">Plan IA (Dieta & Rutina)</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((member) => {
                const daysLeft = getDaysCountdown(member.expires);
                const isExpired = daysLeft <= 0;
                const isWarning = daysLeft > 0 && daysLeft <= 7;
                const aiPlan = member.aiPlan;

                return (
                  <tr key={member.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-sm shadow-inner shrink-0">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{member.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-gray-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-gray-400 shrink-0" />
                        <span>{member.phone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg text-xs border border-blue-100 whitespace-nowrap">
                        {member.plan}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isExpired
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isWarning
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isExpired ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        {isExpired ? 'Vencido' : isWarning ? 'Por vencer' : 'Activo'}
                      </span>
                    </td>

                    {/* COLUMNA CONTADOR DE DÍAS DEL AFILIADO */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold">
                          {isExpired ? (
                            <span className="text-rose-600 flex items-center gap-1">
                              <XCircle size={14} /> Vencido ({Math.abs(daysLeft)} días)
                            </span>
                          ) : isWarning ? (
                            <span className="text-amber-600 flex items-center gap-1">
                              <AlertTriangle size={14} /> ⏳ {daysLeft} días restantes
                            </span>
                          ) : (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <Clock size={14} /> ⏳ {daysLeft} días restantes
                            </span>
                          )}
                        </div>

                        {/* Barra de progreso visual del plan */}
                        <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isExpired ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${isExpired ? 100 : Math.max(10, Math.min(100, (daysLeft / (member.totalDays || 30)) * 100))}%`
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Vence: <strong className="text-gray-600">{member.expires}</strong>
                        </p>
                      </div>
                    </td>

                    {/* COLUMNA PLAN IA (DIETA & RUTINA) */}
                    <td className="py-4 px-6">
                      {aiPlan ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {aiPlan.biometrics?.targetCalories} kcal
                            </span>
                            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-1">
                              {aiPlan.inputs?.trainingLocation === 'GYM' ? <Building2 size={11} /> : <Home size={11} />}
                              <span>{aiPlan.inputs?.trainingLocation === 'GYM' ? 'GYM' : 'Casa'}</span>
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-semibold">
                            Grasa: <strong>{aiPlan.biometrics?.bodyFat}%</strong> • Magra: <strong>{aiPlan.biometrics?.leanMass}kg</strong>
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEvaluatingMember(member);
                            setAiModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition-colors"
                        >
                          <Sparkles size={12} className="text-indigo-600" />
                          <span>Validar con IA</span>
                        </button>
                      )}
                    </td>

                    {/* ACCIONES POR AFILIADO */}
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-1.5">
                      {/* Botón Validación IA */}
                      <button
                        onClick={() => {
                          setEvaluatingMember(member);
                          setAiModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-bold text-xs p-1.5 rounded-lg hover:bg-indigo-50 border border-indigo-200 transition-colors inline-flex items-center gap-1"
                        title="Evaluación Biométrica & IA"
                      >
                        <Sparkles size={13} />
                        <span className="hidden lg:inline">Test IA</span>
                      </button>

                      {/* Botón Dieta */}
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setDietModalOpen(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-800 font-bold text-xs p-1.5 rounded-lg hover:bg-emerald-50 border border-emerald-200 transition-colors inline-flex items-center gap-1"
                        title="Ver Plan Nutricional & Calorías"
                      >
                        <Utensils size={13} />
                        <span className="hidden lg:inline">Dieta</span>
                      </button>

                      {/* Botón Rutina */}
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setRoutineModalOpen(true);
                        }}
                        className="text-purple-600 hover:text-purple-800 font-bold text-xs p-1.5 rounded-lg hover:bg-purple-50 border border-purple-200 transition-colors inline-flex items-center gap-1"
                        title="Ver Rutina Específica (GYM / Casa)"
                      >
                        <Dumbbell size={13} />
                        <span className="hidden lg:inline">Rutina</span>
                      </button>

                      {/* Botón Renovar */}
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setRenewModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs p-1.5 rounded-lg hover:bg-blue-50 border border-blue-200 transition-colors inline-flex items-center gap-1"
                        title="Renovar Plan y Sumar Días"
                      >
                        <RefreshCw size={13} />
                        <span className="hidden lg:inline">Renovar</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: REGISTRAR NUEVO AFILIADO / CLIENTE */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900">Registrar Afiliado / Cliente</h3>
                <p className="text-xs text-gray-500">Alta de membresía con contador automático de días</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-gray-700 block mb-1">Nombre Completo del Afiliado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Daniel Gómez"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 block mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="cliente@email.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-gray-700 block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+57 300..."
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 block mb-1">Plan de Gimnasio</label>
                <select
                  value={newMember.plan}
                  onChange={(e) => {
                    const sel = availablePlans.find((p) => p.name === e.target.value);
                    setNewMember({
                      ...newMember,
                      plan: e.target.value,
                      durationDays: sel?.durationDays || 30
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800"
                >
                  {availablePlans.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.durationDays} días)
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                <span className="text-blue-900 font-bold">Días asignados al contador:</span>
                <span className="font-black text-blue-700 text-sm">+{newMember.durationDays || 30} días</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Registrar Afiliado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: RENOVAR MEMBRESÍA & CONTADOR */}
      {/* ======================================================== */}
      {renewModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900">Renovar Membresía</h3>
                <p className="text-xs text-gray-500">Afiliado: <strong>{selectedMember.name}</strong></p>
              </div>
              <button onClick={() => setRenewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Selecciona el plan para sumar los días correspondientes al contador del afiliado:
            </p>

            <div className="space-y-2">
              {availablePlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handleRenewMember(selectedMember, plan)}
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-blue-600 hover:bg-blue-50/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600">{plan.name}</p>
                    <p className="text-[11px] text-gray-400">Duración: {plan.durationDays} días</p>
                  </div>
                  <span className="text-xs font-extrabold text-blue-600 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
                    +{plan.durationDays} días
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: EVALUACIÓN & VALIDACIÓN CORPORAL POR IA */}
      {/* ======================================================== */}
      {aiModalOpen && evaluatingMember && (
        <AIBiometricEvaluationModal
          member={evaluatingMember}
          isOpen={aiModalOpen}
          onClose={() => {
            setAiModalOpen(false);
            setEvaluatingMember(null);
          }}
          onSavePlan={handleSaveAIPlan}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL 2: VISOR DE DIETA & CONTROL CALÓRICO */}
      {/* ======================================================== */}
      {dietModalOpen && selectedMember && (
        <AffiliateDietModal
          member={selectedMember}
          isOpen={dietModalOpen}
          onClose={() => {
            setDietModalOpen(false);
            setSelectedMember(null);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL 3: VISOR DE RUTINA ESPECÍFICA & VÍDEOS REALES */}
      {/* ======================================================== */}
      {routineModalOpen && selectedMember && (
        <AffiliateRoutineModal
          member={selectedMember}
          isOpen={routineModalOpen}
          onClose={() => {
            setRoutineModalOpen(false);
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
}
