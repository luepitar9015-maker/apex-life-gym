import React from 'react';
import { Check, Sparkles, Plus, ShieldCheck } from 'lucide-react';

const plans = [
  {
    name: 'Plan Mensual Oro',
    price: '$99.000',
    period: '/mes',
    popular: false,
    color: 'border-gray-200',
    features: ['Acceso total a máquinas', 'Evaluación física inicial', 'App móvil de socio básica', 'Locker diario libre'],
    activeUsers: 142
  },
  {
    name: 'Plan Black VIP Anual',
    price: '$149.000',
    period: '/mes',
    popular: true,
    color: 'border-blue-500 ring-2 ring-blue-500/20',
    features: ['Acceso ilimitado a todas las sedes', 'Clases grupales ilimitadas (Spinning, Yoga, HIIT)', 'Plan nutricional e IA en app móvil', 'Acceso para 1 invitado al mes', 'Zona VIP y toallas gratis'],
    activeUsers: 280
  },
  {
    name: 'Plan Estudiante',
    price: '$79.000',
    period: '/mes',
    popular: false,
    color: 'border-gray-200',
    features: ['Acceso en horarios valle (09:00 a 16:00)', 'Área de pesas y cardio', 'App de entrenamiento', 'Carnet digital QR'],
    activeUsers: 60
  }
];

export default function Membresias() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Planes de Membresía</h1>
          <p className="text-gray-500 text-sm">Gestiona tarifas, promociones y beneficios incluidos</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all">
          <Plus size={18} />
          <span>Crear Nuevo Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, idx) => (
          <div key={idx} className={`bg-white rounded-2xl border ${p.color} shadow-sm p-6 flex flex-col justify-between relative`}>
            {p.popular && (
              <span className="absolute -top-3 right-6 bg-blue-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
                Más Vendido
              </span>
            )}
            <div>
              <h3 className="text-xl font-black text-blue-950">{p.name}</h3>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-3xl font-black text-blue-900">{p.price}</span>
                <span className="text-xs text-gray-400 font-semibold">{p.period}</span>
              </div>
              <p className="text-xs font-bold text-emerald-600 mt-2">
                👥 {p.activeUsers} socios suscritos
              </p>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Beneficios incluidos:</p>
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                    <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <button className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 text-blue-700 font-bold text-xs border border-gray-200 hover:border-blue-200 transition-all">
                Editar Tarifas y Reglas
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
