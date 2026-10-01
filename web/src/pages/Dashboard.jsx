import React from 'react';
import StatCard from '../components/StatCard';
import Chart from '../components/Chart';
import ClassReservations from '../components/ClassReservations';
import { Users, DollarSign, CalendarCheck, Clock, UserPlus, CheckCircle, ArrowRight } from 'lucide-react';

export default function Dashboard({ onNavigate = (_tab) => {} }) {
  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
          ¡Hola, Administrador! 👋
        </h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">
          Aquí tienes un resumen de la actividad del gimnasio en tiempo real
        </p>
      </div>

      {/* Grid 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Socios activos"
          value="482"
          color="blue"
          subtitle="↑ 12% vs mes anterior"
          icon={Users}
        />

        <StatCard
          title="Ingresos del mes"
          value="$125.430"
          color="green"
          subtitle="↑ 18.4% meta alcanzada"
          icon={DollarSign}
        />

        <StatCard
          title="Reservas hoy"
          value="36"
          color="blue"
          subtitle="↑ 8 cupos extra"
          icon={CalendarCheck}
        />

        <StatCard
          title="Pagos pendientes"
          value="12"
          color="orange"
          subtitle="Por cobrar esta semana"
          icon={Clock}
        />
      </div>

      {/* Grid 3 Columns: Chart (col-span-2) + Class Reservations (col-span-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Chart />
        </div>

        <div className="lg:col-span-1">
          <ClassReservations onOpenAll={() => onNavigate('Clases')} />
        </div>
      </div>

      {/* Extra Actionable Section: Recent Check-ins and Fast Member Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Quick Check-in Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-blue-950">
              Últimos accesos con QR (Torniquete)
            </h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              En vivo
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { name: 'Carlos Mendoza', plan: 'Plan Black VIP', time: '10:42 AM', status: 'Permitido' },
              { name: 'Mariana Duarte', plan: 'Pase Anual Oro', time: '10:38 AM', status: 'Permitido' },
              { name: 'Sebastián Vélez', plan: 'Plan Estudiante', time: '10:29 AM', status: 'Permitido' },
              { name: 'Diana Quintana', plan: 'Plan Básico', time: '10:15 AM', status: 'Permitido' },
            ].map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.plan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle size={13} /> {item.status}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg shadow-blue-900/10">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4">
              <UserPlus size={24} />
            </div>
            <h3 className="text-xl font-black tracking-tight">
              Gestión comercial y control de socios
            </h3>
            <p className="text-blue-100/80 text-sm mt-2 leading-relaxed">
              Registra nuevos atletas, emite pases de cortesía o cobra membresías en segundos con el módulo de caja rápida y facturación.
            </p>
          </div>

          <div className="pt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('Socios')}
              className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Ver Directorio de Socios</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('Pagos')}
              className="bg-blue-700/60 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl border border-white/20 transition-all"
            >
              Historial de Pagos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
