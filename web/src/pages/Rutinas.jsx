import React, { useState } from 'react';
import { Dumbbell, Plus, Flame, Clock, Target, Play } from 'lucide-react';

const mockRoutines = [
  {
    id: 1,
    title: 'Fuerza & Hipertrofia Tren Superior',
    focus: 'Pecho, Espalda y Brazos',
    duration: '50 min',
    level: 'Intermedio',
    exercises: [
      { name: 'Press de Banca Plano con Barra', sets: '4 series x 8-10 reps', rest: '90s' },
      { name: 'Remo con Barra T', sets: '4 series x 10 reps', rest: '75s' },
      { name: 'Press Militar con Mancuernas', sets: '3 series x 12 reps', rest: '60s' },
      { name: 'Fondos en Paralelas lastrados', sets: '3 series x al fallo', rest: '60s' },
    ]
  },
  {
    id: 2,
    title: 'Pierna Completa & Glúteo Explosivo',
    focus: 'Cuádriceps, Isquiotibiales y Pantorrilla',
    duration: '55 min',
    level: 'Avanzado',
    exercises: [
      { name: 'Sentadilla Libre con Barra Trasera', sets: '4 series x 8 reps', rest: '120s' },
      { name: 'Prensa 45° con cadencia controlada', sets: '4 series x 12 reps', rest: '90s' },
      { name: 'Peso Muerto Rumano con Mancuernas', sets: '3 series x 10 reps', rest: '90s' },
      { name: 'Elevación de Talones De Pie', sets: '4 series x 15 reps', rest: '45s' },
    ]
  },
  {
    id: 3,
    title: 'Acondicionamiento HIIT & Core',
    focus: 'Quema de Grasa y Resistencia',
    duration: '35 min',
    level: 'Todos los niveles',
    exercises: [
      { name: 'Kettlebell Swings', sets: '4 vueltas x 45s activo', rest: '15s' },
      { name: 'Burpees con salto al cajón', sets: '4 vueltas x 30s activo', rest: '30s' },
      { name: 'Plancha Abdominal Dinámica', sets: '3 series x 60s', rest: '45s' },
    ]
  }
];

export default function Rutinas() {
  const [selectedRoutine, setSelectedRoutine] = useState(mockRoutines[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Catálogo de Rutinas & Ejercicios</h1>
          <p className="text-gray-500 text-sm">Biblioteca de planes de entrenamiento asignables a socios</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all">
          <Plus size={18} />
          <span>Crear Nueva Rutina</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Routines list */}
        <div className="space-y-4">
          {mockRoutines.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedRoutine(r)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedRoutine.id === r.id
                  ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-100">
                  {r.level}
                </span>
                <span className="text-gray-500 font-semibold flex items-center gap-1">
                  <Clock size={12} /> {r.duration}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">{r.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{r.focus}</p>
            </div>
          ))}
        </div>

        {/* Routine exercises detail */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Vista Previa de la Rutina
              </span>
              <h2 className="text-xl font-extrabold text-blue-950 mt-2">{selectedRoutine.title}</h2>
              <p className="text-xs text-gray-500 mt-1">Enfoque: {selectedRoutine.focus} • Duración estimada: {selectedRoutine.duration}</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors">
              Asignar a Socio
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Ejercicios de la sesión:</h4>
            {selectedRoutine.exercises.map((ex, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{ex.name}</p>
                    <p className="text-xs text-gray-500">{ex.sets}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-200">
                  Descanso: {ex.rest}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
