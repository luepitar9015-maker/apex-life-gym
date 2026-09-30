import React, { useState } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

const monthlyData = [
  { month: 'Ene', ingresos: 82000, socios: 380 },
  { month: 'Feb', ingresos: 91000, socios: 410 },
  { month: 'Mar', ingresos: 98000, socios: 430 },
  { month: 'Abr', ingresos: 104000, socios: 445 },
  { month: 'May', ingresos: 112000, socios: 460 },
  { month: 'Jun', ingresos: 119000, socios: 472 },
  { month: 'Jul', ingresos: 125430, socios: 482 },
];

export default function Chart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('Mes');

  const maxIngreso = Math.max(...monthlyData.map(d => d.ingresos));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header with Title and Period Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-xl text-blue-950 tracking-tight">
              Rendimiento mensual
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
              <TrendingUp size={12} />
              +14.8% crecimiento
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Flujo de facturación y proyección de ingresos
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
          {['Semana', 'Mes', 'Año'].map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterPeriod === period
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Bar Chart Visualization */}
      <div className="h-64 relative flex items-end justify-between pt-6 pb-2 px-2">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-gray-200 w-full"></div>
          <div className="border-b border-dashed border-gray-200 w-full"></div>
          <div className="border-b border-dashed border-gray-200 w-full"></div>
          <div className="border-b border-dashed border-gray-200 w-full"></div>
        </div>

        {monthlyData.map((item, index) => {
          const heightPercent = Math.round((item.ingresos / maxIngreso) * 100);
          const isCurrent = index === monthlyData.length - 1;
          const isHovered = hoveredIdx === index;

          return (
            <div
              key={item.month}
              className="relative flex flex-col items-center flex-1 group z-10"
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-14 bg-gray-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-30 animate-in fade-in zoom-in-95">
                  <p className="text-blue-300 font-extrabold">{item.month}: ${item.ingresos.toLocaleString()}</p>
                  <p className="text-gray-300 text-[10px]">{item.socios} socios activos</p>
                </div>
              )}

              {/* Bar */}
              <div className="w-10 md:w-12 bg-gray-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-48 transition-all">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-xl transition-all duration-500 ${
                    isCurrent
                      ? 'bg-gradient-to-t from-blue-700 to-blue-500 shadow-md shadow-blue-500/30'
                      : 'bg-gradient-to-t from-blue-200 to-blue-300 group-hover:from-blue-400 group-hover:to-blue-500'
                  }`}
                />
              </div>

              {/* Month Label */}
              <span className={`text-xs mt-3 font-bold ${isCurrent ? 'text-blue-700' : 'text-gray-400'}`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Chart Footer summary */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span>
          Ingresos en miles de $ (USD/COP)
        </span>
        <span className="font-semibold text-gray-700">Total acumulado: $764.430</span>
      </div>
    </div>
  );
}
