import React, { useState } from 'react';
import { Calendar, Users, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

const initialClasses = [
  { id: 1, time: '07:00', name: 'Spinning', current: 18, max: 20, coach: 'Laura G.' },
  { id: 2, time: '09:00', name: 'Yoga Flex', current: 12, max: 15, coach: 'Esteban M.' },
  { id: 3, time: '11:00', name: 'Pilates Core', current: 8, max: 12, coach: 'Valentina R.' },
  { id: 4, time: '18:00', name: 'HIIT Extreme', current: 20, max: 20, coach: 'Camilo S.' },
  { id: 5, time: '19:30', name: 'Cross Training', current: 16, max: 18, coach: 'Laura G.' },
];

export default function ClassReservations({ onOpenAll = () => {} }) {
  const [classesList, setClassesList] = useState(initialClasses);
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-extrabold text-lg text-blue-950 tracking-tight">
              Reservas de clases
            </h2>
            <p className="text-xs text-gray-500">Cupos y aforo en vivo hoy</p>
          </div>
          <button
            onClick={onOpenAll}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
          >
            Ver todas
          </button>
        </div>

        <div className="space-y-4">
          {classesList.map((c) => {
            const isFull = c.current >= c.max;
            const percentage = Math.round((c.current / c.max) * 100);

            return (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-gray-50/70 border border-gray-100 hover:border-blue-200 transition-all"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-blue-900 bg-white px-2 py-0.5 rounded-lg border border-gray-200 text-xs shadow-2xs">
                      {c.time}
                    </span>
                    <div>
                      <p className="font-bold text-gray-800 leading-tight">{c.name}</p>
                      <p className="text-[11px] text-gray-500">Coach: {c.coach}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-black text-xs px-2 py-0.5 rounded-full inline-block ${
                        isFull
                          ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}
                    >
                      {c.current}/{c.max} {isFull && '• Lleno'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull ? 'bg-rose-500' : percentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
          <CheckCircle2 size={13} /> 4 salas operativas
        </span>
        <span className="font-bold text-blue-900">Total: 74 reservas</span>
      </div>
    </div>
  );
}
