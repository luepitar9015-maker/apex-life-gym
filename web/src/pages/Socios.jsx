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
  UserCheck
} from 'lucide-react';

const mockInitialMembers = [
  { id: 'SOC-101', name: 'Carlos Mendoza', email: 'carlos.m@gmail.com', phone: '+57 312 456 7890', plan: 'Plan Black VIP Anual', status: 'Activo', expires: '15/11/2026', totalDays: 365, attendance: 24 },
  { id: 'SOC-102', name: 'Andrea Torres', email: 'andrea.t@hotmail.com', phone: '+57 301 987 6543', plan: 'Plan Mensual Oro', status: 'Activo', expires: '05/10/2026', totalDays: 30, attendance: 18 },
  { id: 'SOC-103', name: 'Sebastián Vélez', email: 's.velez@outlook.com', phone: '+57 320 111 2233', plan: 'Plan Estudiante', status: 'Vencido', expires: '25/09/2026', totalDays: 30, attendance: 12 },
  { id: 'SOC-104', name: 'Mariana Duarte', email: 'mariana.d@gmail.com', phone: '+57 315 444 5566', plan: 'Plan Black VIP Anual', status: 'Activo', expires: '30/12/2026', totalDays: 365, attendance: 30 },
  { id: 'SOC-105', name: 'Felipe Morales', email: 'felipe.m@yahoo.com', phone: '+57 318 777 8899', plan: 'Plan Trimestral Pro', status: 'Pendiente', expires: '03/10/2026', totalDays: 90, attendance: 4 },
  { id: 'SOC-106', name: 'Valentina Osorio', email: 'valen.o@gmail.com', phone: '+57 300 222 3344', plan: 'Plan Mensual Oro', status: 'Activo', expires: '20/10/2026', totalDays: 30, attendance: 15 },
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

  // Alta de nuevo socio con días automáticos
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name) return;

    const expiresDate = addDaysToToday(newMember.durationDays || 30);
    const item = {
      id: `SOC-${Math.floor(100 + Math.random() * 900)}`,
      name: newMember.name,
      email: newMember.email || 'socio@gym.com',
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
    // Si ya venció, inicia desde hoy; si aún tiene días, se le suman a su fecha actual
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
          status: 'Activo',
          plan: plan.name,
          expires: baseDate,
          totalDays: daysToAdd
        };
      }
      return m;
    });

    setMembers(updated);
    setRenewModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Directorio de Socios</h1>
          <p className="text-gray-500 text-sm">Gestiona altas, membresías, estados y el contador de días de cada afiliado</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus size={18} />
          <span>Registrar Socio</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o email..."
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-4 px-6">Socio</th>
                <th className="py-4 px-6">Contacto</th>
                <th className="py-4 px-6">Plan Asignado</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Contador de Días (Afiliado)</th>
                <th className="py-4 px-6 text-center">Asistencias</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((member) => {
                const daysLeft = getDaysCountdown(member.expires);
                const isExpired = daysLeft <= 0;
                const isWarning = daysLeft > 0 && daysLeft <= 7;
                const isHealthy = daysLeft > 7;

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
                        <span className="truncate max-w-[150px]">{member.email}</span>
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
                        <div className="w-36 h-1.5 bg-gray-100 rounded-full overflow-hidden">
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

                    <td className="py-4 px-6 text-center font-bold text-gray-700">
                      {member.attendance} días
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setRenewModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs px-2.5 py-1.5 rounded-lg hover:bg-blue-50 border border-blue-200 transition-colors inline-flex items-center gap-1"
                      >
                        <RefreshCw size={12} />
                        <span>Renovar</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Member con selección de plan y cálculo automático de días */}
      {modalOpen && (
        <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-extrabold text-base text-blue-950">Nuevo Socio / Afiliado</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Daniel Gómez"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+57 300..."
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="email@gym.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Plan de Membresía (Suma días al contador) *
                </label>
                <select
                  value={newMember.plan}
                  onChange={(e) => {
                    const sel = availablePlans.find(p => p.name === e.target.value);
                    setNewMember({
                      ...newMember,
                      plan: e.target.value,
                      durationDays: sel ? sel.durationDays : 30
                    });
                  }}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-semibold bg-white"
                >
                  {availablePlans.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} — ({p.durationDays} días)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                  <span>⏳</span>
                  <span>El contador iniciará con {newMember.durationDays} días de membresía</span>
                </p>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
                >
                  Registrar Afiliado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Rápido de Renovación de Membresía */}
      {renewModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-blue-950">Renovar Membresía</h3>
                <p className="text-xs text-gray-500">{selectedMember.name} ({selectedMember.id})</p>
              </div>
              <button onClick={() => setRenewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Selecciona el plan para sumarle días al contador del afiliado:
            </p>

            <div className="space-y-2">
              {availablePlans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleRenewMember(selectedMember, p)}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900">{p.name}</p>
                    <p className="text-[11px] text-gray-400">+{p.durationDays} días de vigencia</p>
                  </div>
                  <span className="text-xs font-black text-blue-600">{p.price || '$99.000'}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setRenewModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
