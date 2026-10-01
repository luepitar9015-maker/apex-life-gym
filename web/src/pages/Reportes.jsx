import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Download, Calendar } from 'lucide-react';

export default function Reportes() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Reportes Financieros & Operativos</h1>
          <p className="text-gray-500 text-sm">Auditoría de ingresos, asistencia promedio y fidelización de socios</p>
        </div>
        <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all">
          <Download size={16} />
          <span>Exportar a Excel / PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tasa de Renovación</p>
          <h2 className="text-3xl font-black text-blue-950 mt-2">89.4%</h2>
          <p className="text-xs font-semibold text-emerald-600 mt-2">↑ 3.2% vs mes pasado</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ticket Promedio por Socio</p>
          <h2 className="text-3xl font-black text-blue-950 mt-2">$138.200</h2>
          <p className="text-xs font-semibold text-blue-600 mt-2">Incluye compras en tienda</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Afluencia Pico</p>
          <h2 className="text-3xl font-black text-blue-950 mt-2">18:00 - 20:00</h2>
          <p className="text-xs font-semibold text-amber-600 mt-2">Promedio 78 personas simultáneas</p>
        </div>
      </div>

      {/* Breakdown Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-extrabold text-blue-950 mb-4">Desglose de Ingresos por Categoría</h3>
        <div className="space-y-4">
          {[
            { label: 'Membresías y suscripciones', amount: '$104.200.000', percentage: 83, color: 'bg-blue-600' },
            { label: 'Venta de suplementos y bebidas', amount: '$12.800.000', percentage: 10, color: 'bg-emerald-500' },
            { label: 'Entrenamientos personalizados', amount: '$5.930.000', percentage: 5, color: 'bg-amber-500' },
            { label: 'Alquiler de casilleros y accesorios', amount: '$2.500.000', percentage: 2, color: 'bg-purple-500' },
          ].map((cat, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                <span>{cat.label}</span>
                <span>{cat.amount} ({cat.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div style={{ width: `${cat.percentage}%` }} className={`h-full ${cat.color} rounded-full`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
