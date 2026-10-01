import React from 'react';
import {
  Utensils,
  Dumbbell,
  Flame,
  Scale,
  Calendar,
  X,
  Play,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Droplets,
  HeartPulse,
  Building2,
  Home
} from 'lucide-react';
import ExerciseVideoPlayer from './ExerciseVideoPlayer';

// ==========================================
// 1. MODAL DE DIETA & CONTROL CALÓRICO
// ==========================================
export function AffiliateDietModal({ member, isOpen, onClose }) {
  if (!isOpen || !member) return null;
  const diet = member.aiPlan?.diet;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-blue-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col my-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              🥗 Plan Nutricional & Control Calórico Personalizado
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
              Dieta & Macronutrientes de {member.name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Afiliado: <strong>{member.id}</strong> • Evaluación IA:{' '}
              {member.aiPlan?.evaluatedAt || 'Reciente'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {diet ? (
            <>
              {/* Tarjetas de Prescripción Calórica */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">
                      Objetivo Nutricional
                    </span>
                    <h3 className="text-xl font-black">
                      {member.aiPlan?.inputs?.goal || 'Hipertrofia Muscular'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-amber-300">
                      {diet.targetCalories} <span className="text-xs text-gray-300">kcal/día</span>
                    </span>
                    <span className="text-[11px] text-gray-300 block">Meta Calórica Diaria</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <span className="text-[10px] text-blue-200 font-bold uppercase block">Proteínas</span>
                    <span className="text-lg font-black text-white">{diet.proteinGrams}g</span>
                    <span className="text-[10px] text-gray-300 block">{Math.round((diet.proteinGrams * 4 / diet.targetCalories) * 100)}% de calorías</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <span className="text-[10px] text-amber-200 font-bold uppercase block">Carbohidratos</span>
                    <span className="text-lg font-black text-white">{diet.carbsGrams}g</span>
                    <span className="text-[10px] text-gray-300 block">{Math.round((diet.carbsGrams * 4 / diet.targetCalories) * 100)}% de calorías</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <span className="text-[10px] text-emerald-200 font-bold uppercase block">Grasas Buenas</span>
                    <span className="text-lg font-black text-white">{diet.fatGrams}g</span>
                    <span className="text-[10px] text-gray-300 block">{Math.round((diet.fatGrams * 9 / diet.targetCalories) * 100)}% de calorías</span>
                  </div>
                </div>
              </div>

              {/* Menú de Comidas */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Utensils size={16} className="text-emerald-600" />
                  <span>Distribución de Comidas Diarias</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {diet.meals?.map((m, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900">{m.meal}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {m.calories} kcal
                        </span>
                      </div>
                      <p className="text-xs font-bold text-blue-900">{m.title}</p>
                      <p className="text-[10px] text-gray-500 font-semibold">{m.macros}</p>
                      <ul className="text-[11px] text-gray-600 space-y-1 pt-1 border-t border-gray-200/60">
                        {m.foods?.map((f, fIdx) => (
                          <li key={fIdx}>• {f}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Utensils size={44} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-800">Sin plan de alimentación registrado</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Realiza la Validación Corporal por IA para que el sistema calcule automáticamente las
                calorías exactas y el menú de {member.name}.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Cerrar Visor de Dieta
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. MODAL DE RUTINA ESPECÍFICA & VÍDEOS
// ==========================================
export function AffiliateRoutineModal({ member, isOpen, onClose }) {
  const [selectedExForVideo, setSelectedExForVideo] = React.useState(null);

  if (!isOpen || !member) return null;
  const routine = member.aiPlan?.routine;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-blue-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col my-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
                {routine?.location === 'GYM' ? <Building2 size={13} /> : <Home size={13} />}
                <span>
                  {routine?.location === 'GYM' ? 'Rutina en Máquinas de GYM' : 'Rutina Funcional en Casa'}
                </span>
              </span>
              <span className="text-xs font-semibold text-gray-500">• Objetivo: {routine?.goal || 'Personalizado'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
              Plan de Entrenamiento de {member.name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Afiliado: <strong>{member.id}</strong> • Adaptación Biomecánica por IA
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Si se seleccionó un ejercicio para ver su vídeo real */}
          {selectedExForVideo && (
            <div className="bg-gray-50 rounded-3xl p-5 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-900">
                  🎥 Demostración en Vídeo Real: <strong>{selectedExForVideo.name}</strong>
                </span>
                <button
                  onClick={() => setSelectedExForVideo(null)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Cerrar Vídeo
                </button>
              </div>
              <ExerciseVideoPlayer exercise={selectedExForVideo} defaultMode="VIDEO" />
            </div>
          )}

          {routine && routine.exercises?.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Dumbbell size={16} className="text-blue-600" />
                  <span>Ejercicios Prescritos por la IA</span>
                </h4>
                <span className="text-xs font-bold text-gray-500">
                  {routine.exercises.length} ejercicios seleccionados
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routine.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between hover:border-blue-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {ex.muscleGroup}
                        </span>
                        <span className="text-xs font-black text-gray-800">
                          {ex.sets} × {ex.reps}
                        </span>
                      </div>
                      <h5 className="text-xs font-black text-gray-900">{ex.name}</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">{ex.machineType}</p>
                      {ex.safetyNote && (
                        <p className="text-[10px] font-semibold text-emerald-700 mt-2 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-100">
                          {ex.safetyNote}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-2 border-t border-gray-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-semibold">Descanso: {ex.rest}</span>
                      <button
                        onClick={() => setSelectedExForVideo(ex)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Play size={12} className="fill-white" />
                        <span>Ver Vídeo Real</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Dumbbell size={44} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-800">Sin rutina personalizada</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Realiza la Validación Corporal por IA para generar automáticamente la rutina adaptada a
                las lesiones y lugar de entrenamiento de {member.name}.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Cerrar Rutina
          </button>
        </div>
      </div>
    </div>
  );
}
