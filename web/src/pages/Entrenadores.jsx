import React from 'react';
import { UserCheck, Plus, Star, Calendar, Mail, Phone } from 'lucide-react';

const coaches = [
  { name: 'Laura Gómez', role: 'Entrenadora Principal & Spinning', rating: '4.9', athletes: 38, shift: 'Turno Mañana (06:00 - 14:00)', phone: '+57 311 234 5678' },
  { name: 'Esteban Morales', role: 'Especialista en Yoga & Movilidad', rating: '4.8', athletes: 29, shift: 'Turno Completo', phone: '+57 314 876 5432' },
  { name: 'Camilo Serna', role: 'Coach HIIT, Cross & Fuerza', rating: '5.0', athletes: 45, shift: 'Turno Tarde/Noche (14:00 - 22:00)', phone: '+57 320 555 9988' },
  { name: 'Valentina Restrepo', role: 'Instructora de Pilates & Core', rating: '4.9', athletes: 22, shift: 'Turno Mañana (07:00 - 13:00)', phone: '+57 301 444 1122' },
];

export default function Entrenadores() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Staff de Entrenadores</h1>
          <p className="text-gray-500 text-sm">Gestiona coaches, turnos y alumnos a cargo</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all">
          <Plus size={18} />
          <span>Agregar Coach</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coaches.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-100 text-blue-800 font-extrabold text-2xl flex items-center justify-center shadow-inner border border-blue-200">
                {c.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="font-extrabold text-base text-gray-900 mt-4">{c.name}</h3>
              <p className="text-xs text-blue-600 font-semibold">{c.role}</p>

              <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-500 mt-2">
                <Star size={14} fill="#f59e0b" />
                <span>{c.rating} / 5.0</span>
                <span className="text-gray-400 font-normal">({c.athletes} alumnos)</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-left text-xs text-gray-500 space-y-1.5">
                <p><strong className="text-gray-700">Horario:</strong> {c.shift}</p>
                <p><strong className="text-gray-700">Tel:</strong> {c.phone}</p>
              </div>
            </div>

            <button className="mt-5 w-full py-2 bg-gray-50 hover:bg-blue-50 text-blue-700 font-bold text-xs rounded-xl border border-gray-200 hover:border-blue-200 transition-all">
              Ver Agenda & Clases
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
