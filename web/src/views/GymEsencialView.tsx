import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  CalendarCheck,
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Dumbbell,
  CreditCard,
  Package,
  Settings as SettingsIcon,
  X
} from 'lucide-react';

export const GymEsencialView: React.FC<{ onNavigate?: (v: string) => void }> = ({ onNavigate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'socios' | 'membresias' | 'pagos' | 'clases' | 'reportes'>('dashboard');
  const [periodFilter, setPeriodFilter] = useState('Mes');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Datos de clases y cupos
  const [classesList, setClassesList] = useState([
    { id: 1, time: '07:00', name: 'Spinning', current: 18, max: 20, coach: 'Laura G.' },
    { id: 2, time: '09:00', name: 'Yoga', current: 12, max: 15, coach: 'Esteban M.' },
    { id: 3, time: '18:00', name: 'HIIT', current: 20, max: 20, coach: 'Camilo S.' },
    { id: 4, time: '19:30', name: 'Cross Training', current: 15, max: 18, coach: 'Laura G.' },
  ]);

  // Datos socios
  const [members, setMembers] = useState([
    { id: 'SOC-101', name: 'Carlos Mendoza', plan: 'Plan Black VIP', status: 'Activo', phone: '+57 312 456 7890', exp: '15/11/2026' },
    { id: 'SOC-102', name: 'Andrea Torres', plan: 'Plan Mensual Oro', status: 'Activo', phone: '+57 301 987 6543', exp: '02/10/2026' },
    { id: 'SOC-103', name: 'Sebastián Vélez', plan: 'Plan Estudiante', status: 'Vencido', phone: '+57 320 111 2233', exp: '28/09/2026' },
    { id: 'SOC-104', name: 'Mariana Duarte', plan: 'Plan Black VIP', status: 'Activo', phone: '+57 315 444 5566', exp: '30/12/2026' },
  ]);

  const [searchMember, setSearchMember] = useState('');
  const [modalMemberOpen, setModalMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPlan, setNewMemberPlan] = useState('Plan Black VIP');

  const monthlyChartData = [
    { month: 'Ene', amount: 82000 },
    { month: 'Feb', amount: 91000 },
    { month: 'Mar', amount: 98000 },
    { month: 'Abr', amount: 104000 },
    { month: 'May', amount: 112000 },
    { month: 'Jun', amount: 119000 },
    { month: 'Jul', amount: 125430 },
  ];
  const maxIngreso = 125430;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;
    setMembers([
      {
        id: `SOC-${Math.floor(100 + Math.random() * 900)}`,
        name: newMemberName,
        plan: newMemberPlan,
        status: 'Activo',
        phone: '+57 300 000 0000',
        exp: '30/11/2026',
      },
      ...members,
    ]);
    setNewMemberName('');
    setModalMemberOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-full -m-6 p-6 md:p-8 font-sans text-gray-800">
      {/* Barra de Subnavegación Superior para Cambiar Vistas */}
      <div className="bg-white rounded-2xl p-2.5 border border-gray-200/80 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'socios', label: 'Socios', icon: Users },
            { id: 'clases', label: 'Clases', icon: Calendar },
            { id: 'pagos', label: 'Pagos', icon: CreditCard },
            { id: 'membresias', label: 'Membresías', icon: ShieldCheck },
            { id: 'reportes', label: 'Reportes', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            GYM ESENCIAL • EN VIVO
          </span>
        </div>
      </div>

      {/* VISTA 1: DASHBOARD PRINCIPAL */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header Title */}
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
              ¡Hola, Administrador!
            </h1>
            <p className="text-gray-500 mb-8 mt-1 text-sm font-medium">
              Aquí tienes un resumen de la actividad del gimnasio
            </p>
          </div>

          {/* Grid 4 StatCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* StatCard 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Socios activos</p>
                  <h2 className="text-3xl font-bold text-blue-900 mt-2">482</h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Users size={22} />
                </div>
              </div>
              <p className="text-emerald-500 font-semibold text-xs mt-3 flex items-center gap-1">
                <TrendingUp size={13} /> ↑ 12% vs mes anterior
              </p>
            </div>

            {/* StatCard 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Ingresos del mes</p>
                  <h2 className="text-3xl font-bold text-blue-900 mt-2">$125.430</h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <DollarSign size={22} />
                </div>
              </div>
              <p className="text-emerald-500 font-semibold text-xs mt-3 flex items-center gap-1">
                <TrendingUp size={13} /> ↑ 18% vs mes anterior
              </p>
            </div>

            {/* StatCard 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Reservas hoy</p>
                  <h2 className="text-3xl font-bold text-blue-900 mt-2">36</h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <CalendarCheck size={22} />
                </div>
              </div>
              <p className="text-emerald-500 font-semibold text-xs mt-3 flex items-center gap-1">
                <TrendingUp size={13} /> ↑ 5 cupos extra
              </p>
            </div>

            {/* StatCard 4 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Pagos pendientes</p>
                  <h2 className="text-3xl font-bold text-amber-900 mt-2">12</h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Clock size={22} />
                </div>
              </div>
              <p className="text-amber-600 font-semibold text-xs mt-3 flex items-center gap-1">
                Por cobrar esta semana
              </p>
            </div>
          </div>

          {/* Grid 3 Columns: Rendimiento Mensual (col-span-2) + Reservas de Clases (col-span-1) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Gráfica Ingresos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-xl text-blue-900">Rendimiento mensual</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Ingresos facturados por periodo</p>
                </div>
                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
                  {['Semana', 'Mes', 'Año'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriodFilter(p)}
                      className={`px-3 py-1 rounded-lg ${
                        periodFilter === p ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gráfica interactiva de barras */}
              <div className="h-64 flex items-end justify-between px-4 pb-2 relative">
                {monthlyChartData.map((item, idx) => {
                  const pct = Math.round((item.amount / maxIngreso) * 100);
                  const isLast = idx === monthlyChartData.length - 1;
                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center group relative"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {hoveredBar === idx && (
                        <div className="absolute -top-10 bg-gray-900 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-md">
                          ${item.amount.toLocaleString()}
                        </div>
                      )}
                      <div className="w-10 bg-gray-100 rounded-t-lg h-44 flex flex-col justify-end overflow-hidden">
                        <div
                          style={{ height: `${pct}%` }}
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            isLast
                              ? 'bg-blue-600 shadow-sm'
                              : 'bg-blue-300 group-hover:bg-blue-500'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-500 mt-2">{item.month}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 mt-4">
                <span>Indicador en miles de dólares / pesos</span>
                <span className="font-bold text-gray-700">Total: $764.430</span>
              </div>
            </div>

            {/* Widget Reservas de clases */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-xl text-blue-900 mb-1">Reservas de clases</h2>
                <p className="text-xs text-gray-400 mb-5">Estado de cupos en vivo</p>

                <ul className="space-y-4">
                  {classesList.map((c) => {
                    const isFull = c.current >= c.max;
                    return (
                      <li key={c.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm">
                        <div className="flex items-center justify-between font-medium">
                          <span className="font-bold text-gray-800">
                            {c.time} - {c.name}
                          </span>
                          <span className={`font-extrabold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                            {c.current}/{c.max}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            style={{ width: `${(c.current / c.max) * 100}%` }}
                            className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button
                onClick={() => setActiveSubTab('clases')}
                className="w-full mt-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors"
              >
                Ver Todas las Clases & Calendario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: GESTIÓN DE SOCIOS */}
      {activeSubTab === 'socios' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900">Directorio de Socios</h2>
              <p className="text-gray-500 text-xs">Administración y control de socios inscritos</p>
            </div>
            <button
              onClick={() => setModalMemberOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2"
            >
              <Plus size={16} /> Registrar Nuevo Socio
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <input
                type="text"
                placeholder="Buscar socio por nombre..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="w-full md:w-80 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-6">Socio</th>
                  <th className="py-3 px-6">Plan</th>
                  <th className="py-3 px-6">Teléfono</th>
                  <th className="py-3 px-6">Estado</th>
                  <th className="py-3 px-6">Vencimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members
                  .filter((m) => m.name.toLowerCase().includes(searchMember.toLowerCase()))
                  .map((m) => (
                    <tr key={m.id} className="hover:bg-blue-50/40">
                      <td className="py-3.5 px-6 font-bold text-gray-800">{m.name}</td>
                      <td className="py-3.5 px-6 text-xs text-blue-700 font-semibold">{m.plan}</td>
                      <td className="py-3.5 px-6 text-xs text-gray-600">{m.phone}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            m.status === 'Activo'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-gray-500">{m.exp}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 3: CLASES */}
      {activeSubTab === 'clases' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-bold text-blue-900">Reservas y Cupos de Clases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classesList.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-md">{c.time}</span>
                  <span className={`text-xs font-bold ${c.current >= c.max ? 'text-red-600' : 'text-emerald-600'}`}>
                    {c.current >= c.max ? 'Completo' : `${c.max - c.current} cupos`}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Instructor: {c.coach}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-700">Ocupación: {c.current}/{c.max}</span>
                  <button
                    disabled={c.current >= c.max}
                    onClick={() => {
                      setClassesList(classesList.map(item => item.id === c.id ? { ...item, current: item.current + 1 } : item));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      c.current >= c.max
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    + Inscribir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 4: PAGOS */}
      {activeSubTab === 'pagos' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-bold text-blue-900">Registro de Pagos y Facturación</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="divide-y divide-gray-100">
              {[
                { id: 'FAC-001', member: 'Carlos Mendoza', amount: '$149.000', concept: 'Plan Black VIP', date: 'Hoy 10:30', status: 'Pagado' },
                { id: 'FAC-002', member: 'Andrea Torres', amount: '$99.000', concept: 'Plan Mensual Oro', date: 'Hoy 09:15', status: 'Pagado' },
                { id: 'FAC-003', member: 'Sebastián Vélez', amount: '$79.000', concept: 'Plan Estudiante', date: 'Ayer', status: 'Pendiente' },
              ].map((p, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{p.member}</p>
                    <p className="text-xs text-gray-500">{p.concept} • {p.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-blue-900 text-sm">{p.amount}</p>
                    <span className={`text-[11px] font-bold ${p.status === 'Pagado' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VISTA 5: MEMBRESÍAS */}
      {activeSubTab === 'membresias' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-bold text-blue-900">Planes y Membresías</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Plan Mensual Oro', price: '$99.000/mes', benefits: ['Acceso a sala de máquinas', 'Locker diario', 'App socio'] },
              { name: 'Plan Black VIP', price: '$149.000/mes', benefits: ['Clases grupales ilimitadas', 'Acceso multi-sede', 'Invitado gratis al mes', 'Plan nutricional'] },
              { name: 'Plan Estudiante', price: '$79.000/mes', benefits: ['Horario valle 9:00 - 16:00', 'Área de pesas', 'Carnet digital'] },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-blue-900">{p.name}</h3>
                  <p className="text-2xl font-black text-gray-900 mt-2">{p.price}</p>
                  <ul className="mt-4 space-y-2 text-xs text-gray-600">
                    {p.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="mt-6 w-full py-2 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100">
                  Editar Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 6: REPORTES */}
      {activeSubTab === 'reportes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-bold text-blue-900">Reportes Financieros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 font-bold uppercase">Total Facturado</p>
              <h3 className="text-3xl font-extrabold text-blue-900 mt-2">$125.430</h3>
              <p className="text-xs text-emerald-600 font-bold mt-1">↑ +14.8% este mes</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 font-bold uppercase">Socios Retenidos</p>
              <h3 className="text-3xl font-extrabold text-blue-900 mt-2">89.4%</h3>
              <p className="text-xs text-blue-600 font-bold mt-1">Fidelización alta</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 font-bold uppercase">Asistencia Promedio</p>
              <h3 className="text-3xl font-extrabold text-blue-900 mt-2">320/día</h3>
              <p className="text-xs text-emerald-600 font-bold mt-1">Capacidad óptima</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Socio */}
      {modalMemberOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-bold text-blue-900">Registrar Socio</h3>
              <button onClick={() => setModalMemberOpen(false)} className="text-gray-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600">Nombre</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border rounded-lg text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">Plan</label>
                <select
                  value={newMemberPlan}
                  onChange={(e) => setNewMemberPlan(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border rounded-lg text-xs mt-1"
                >
                  <option value="Plan Black VIP">Plan Black VIP</option>
                  <option value="Plan Mensual Oro">Plan Mensual Oro</option>
                  <option value="Plan Estudiante">Plan Estudiante</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalMemberOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
