import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus, CheckCircle, AlertCircle, Dumbbell } from 'lucide-react';

const schedule = [
  { id: 1, name: 'Spinning Power', day: 'Lunes, Miércoles, Viernes', time: '07:00 - 08:00', coach: 'Laura Gómez', room: 'Sala Ciclo 1', enrolled: 18, capacity: 20, intensity: 'Alta' },
  { id: 2, name: 'Yoga Flex & Mind', day: 'Todos los días', time: '09:00 - 10:00', coach: 'Esteban Morales', room: 'Sala Zen', enrolled: 12, capacity: 15, intensity: 'Media' },
  { id: 3, name: 'HIIT Extreme Cardio', day: 'Martes, Jueves', time: '18:00 - 19:00', coach: 'Camilo Serna', room: 'Sala Funcional', enrolled: 20, capacity: 20, intensity: 'Muy Alta' },
  { id: 4, name: 'Cross & Barbell', day: 'Lunes a Viernes', time: '19:15 - 20:15', coach: 'Laura Gómez', room: 'Zona Box', enrolled: 16, capacity: 18, intensity: 'Alta' },
  { id: 5, name: 'Pilates Reformer Core', day: 'Lunes, Miércoles', time: '11:00 - 12:00', coach: 'Valentina Restrepo', room: 'Sala Pilates', enrolled: 8, capacity: 12, intensity: 'Media' },
];

export default function Clases() {
  const [classList, setClassList] = useState(schedule);

  const handleBook = (id) => {
    setClassList(classList.map(c => {
      if (c.id === id && c.enrolled < c.capacity) {
        return { ...c, enrolled: c.enrolled + 1 };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Gestión de Clases & Reservas</h1>
          <p className="text-gray-500 text-sm">Organiza horarios, instructores y disponibilidad de cupos</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all">
          <Plus size={18} />
          <span>Nueva Clase</span>
        </button>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classList.map((c) => {
          const isFull = c.enrolled >= c.capacity;
          const spotsLeft = c.capacity - c.enrolled;

          return (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                    {c.room}
                  </span>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    isFull ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {isFull ? 'Cupo Lleno' : `${spotsLeft} cupos libres`}
                  </span>
                </div>

                <h3 className="text-lg font-black text-blue-950 mb-1">{c.name}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-4">
                  <Clock size={13} className="text-blue-600" />
                  <span>{c.day} • {c.time}</span>
                </p>

                <div className="space-y-2 py-3 border-t border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Instructor:</span>
                    <span className="font-bold text-gray-800">{c.coach}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Intensidad:</span>
                    <span className="font-bold text-gray-800">{c.intensity}</span>
                  </div>
                </div>

                {/* Cupos Bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Inscritos: {c.enrolled}</span>
                    <span>Capacidad: {c.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(c.enrolled / c.capacity) * 100}%` }}
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-rose-500' : 'bg-blue-600'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-gray-100">
                <button
                  disabled={isFull}
                  onClick={() => handleBook(c.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isFull
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {isFull ? 'Lista de Espera' : '+ Reservar Cupo Socio'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
