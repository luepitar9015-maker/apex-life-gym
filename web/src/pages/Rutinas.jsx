import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Building2,
  Home,
  Flame,
  Clock,
  Target,
  Play,
  Pause,
  RotateCcw,
  Search,
  Filter,
  ChevronRight,
  X,
  Sparkles,
  AlertTriangle,
  Wind,
  CheckCircle2,
  Layers,
  Activity,
  ArrowRight,
  Wrench,
  Compass,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  Video,
  ExternalLink
} from 'lucide-react';
import { EXERCISES_DATABASE, WEEKLY_ROUTINES } from '../data/exercisesData';
import ExerciseAnimation from '../components/ExerciseAnimation';
import ExerciseVideoPlayer from '../components/ExerciseVideoPlayer';

export default function Rutinas() {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'GYM' | 'CASA' | 'PROGRAMS'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('TODOS');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalTab, setModalTab] = useState('VIDEO_DEMO'); // 'VIDEO_DEMO' | 'BIOMECHANICS' | 'SAFETY'
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);

  // Temporizador de descanso en el modal
  const [restTimer, setRestTimer] = useState(null);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const [initialRestDuration, setInitialRestDuration] = useState(60);

  // Control del temporizador de descanso
  useEffect(() => {
    let interval = null;
    if (isRestTimerRunning && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => prev - 1);
      }, 1000);
    } else if (restTimer === 0 && isRestTimerRunning) {
      setIsRestTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRestTimerRunning, restTimer]);

  const startRestTimer = (seconds) => {
    setInitialRestDuration(seconds);
    setRestTimer(seconds);
    setIsRestTimerRunning(true);
  };

  const stopRestTimer = () => {
    setIsRestTimerRunning(false);
  };

  const resetRestTimer = () => {
    setRestTimer(initialRestDuration);
    setIsRestTimerRunning(false);
  };

  // Grupos musculares disponibles para filtrar
  const muscleGroups = [
    'TODOS',
    'Pecho',
    'Espalda',
    'Piernas',
    'Hombros',
    'Brazos',
    'Abdomen / Core',
    'Cardio & Core'
  ];

  // Filtrado de ejercicios
  const filteredExercises = EXERCISES_DATABASE.filter((ex) => {
    if (activeTab === 'GYM' && ex.location !== 'GYM') return false;
    if (activeTab === 'CASA' && ex.location !== 'CASA') return false;

    if (selectedMuscle !== 'TODOS' && ex.muscleGroup !== selectedMuscle) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ex.name.toLowerCase().includes(q);
      const matchPrimary = ex.primaryMuscle.toLowerCase().includes(q);
      const matchMachine = ex.machineType?.toLowerCase().includes(q) || false;
      const matchCategory = ex.category.toLowerCase().includes(q);
      return matchName || matchPrimary || matchMachine || matchCategory;
    }

    return true;
  });

  const gymCount = EXERCISES_DATABASE.filter((e) => e.location === 'GYM').length;
  const homeCount = EXERCISES_DATABASE.filter((e) => e.location === 'CASA').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER PRINCIPAL */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            <Sparkles size={14} className="text-blue-600 animate-spin-slow" />
            <span>Simulador Biomecánico & Guía Técnica Real</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-950 tracking-tight">
            Biomecánica en Máquinas de GYM & Ejercicios en Casa
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Animaciones gráficas dinámicas con simulación biomecánica, ángulos articulares, sincronización
            respiratoria, ajuste milimétrico de máquinas y consejos de élite para prevenir lesiones articulares.
          </p>
        </div>

        {/* CONTADORES RÁPIDOS */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-blue-50/80 border border-blue-100 px-4 py-3 rounded-2xl text-center">
            <span className="block text-2xl font-black text-blue-700">{gymCount}</span>
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">Máquinas GYM</span>
          </div>
          <div className="bg-emerald-50/80 border border-emerald-100 px-4 py-3 rounded-2xl text-center">
            <span className="block text-2xl font-black text-emerald-700">{homeCount}</span>
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">En Casa</span>
          </div>
          <div className="bg-indigo-50/80 border border-indigo-100 px-4 py-3 rounded-2xl text-center">
            <span className="block text-2xl font-black text-indigo-700">{WEEKLY_ROUTINES.length}</span>
            <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">Programas</span>
          </div>
        </div>
      </div>

      {/* SELECTOR DE PESTAÑAS (TABS) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/60">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
            activeTab === 'ALL'
              ? 'bg-white text-blue-900 shadow-xs border border-gray-200/50'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Dumbbell size={16} />
          <span>Todos los Ejercicios ({EXERCISES_DATABASE.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('GYM')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
            activeTab === 'GYM'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-gray-600 hover:text-blue-700'
          }`}
        >
          <Building2 size={16} />
          <span>🏢 Máquinas del Gimnasio ({gymCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('CASA')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
            activeTab === 'CASA'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-gray-600 hover:text-emerald-700'
          }`}
        >
          <Home size={16} />
          <span>🏠 Ejercicios en Casa ({homeCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('PROGRAMS')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
            activeTab === 'PROGRAMS'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-600 hover:text-indigo-700'
          }`}
        >
          <Layers size={16} />
          <span>📋 Programas Semanales ({WEEKLY_ROUTINES.length})</span>
        </button>
      </div>

      {/* VISTA 1: PROGRAMAS SEMANALES */}
      {activeTab === 'PROGRAMS' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {WEEKLY_ROUTINES.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        prog.type === 'GYM'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : prog.type === 'CASA'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {prog.type === 'GYM' ? '🏢 GYM Máquinas' : prog.type === 'CASA' ? '🏠 En Casa' : '⚡ Híbrido'}
                    </span>
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                      <Clock size={13} /> {prog.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 leading-snug">{prog.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{prog.description}</p>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600">
                      🎯 <strong className="text-gray-900">{prog.goal}</strong>
                    </span>
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {prog.daysCount} días / sem
                    </span>
                  </div>

                  {/* DESGLOSE DE DÍAS */}
                  <div className="mt-4 space-y-3">
                    <p className="text-[11px] font-extrabold uppercase text-gray-400 tracking-wider">
                      Estructura de Sesiones:
                    </p>
                    {prog.days.map((dayItem, dIdx) => (
                      <div key={dIdx} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs font-bold text-gray-800">{dayItem.day}</p>
                        <ul className="mt-1.5 space-y-1">
                          {dayItem.exercises.map((exItem, eIdx) => {
                            const fullEx = EXERCISES_DATABASE.find((e) => e.id === exItem.exerciseId);
                            return (
                              <li
                                key={eIdx}
                                onClick={() => {
                                  if (fullEx) {
                                    setSelectedExercise(fullEx);
                                    setModalTab('SIMULATOR');
                                  }
                                }}
                                className={`text-[11px] flex items-center justify-between py-0.5 rounded px-1 transition-colors ${
                                  fullEx ? 'cursor-pointer hover:bg-blue-100/60 text-blue-900' : 'text-gray-600'
                                }`}
                              >
                                <span className="font-medium truncate mr-2">
                                  • {exItem.name}
                                </span>
                                <span className="font-bold text-gray-500 shrink-0 text-[10px]">
                                  {exItem.sets} × {exItem.reps}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      const firstEx = EXERCISES_DATABASE.find(
                        (e) => e.id === prog.days[0].exercises[0].exerciseId
                      );
                      if (firstEx) {
                        setSelectedExercise(firstEx);
                        setModalTab('SIMULATOR');
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Comenzar Entrenamiento & Ver Animaciones</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* VISTA 2: CATÁLOGO DE EJERCICIOS (GYM & CASA) */
        <div className="space-y-6">
          {/* BARRA DE FILTROS & BÚSQUEDA */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Buscador */}
            <div className="relative w-full lg:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ejercicio, máquina (Prensa, Polea...) o músculo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Chips de Grupo Muscular */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 lg:pb-0 scrollbar-none">
              <span className="text-[11px] font-bold text-gray-400 mr-1 hidden sm:inline uppercase">Músculo:</span>
              {muscleGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedMuscle(group)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedMuscle === group
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* MENSAJE SI NO HAY RESULTADOS */}
          {filteredExercises.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <Dumbbell size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-800">No se encontraron ejercicios</h3>
              <p className="text-xs text-gray-500 mt-1">
                Prueba cambiando los términos de búsqueda o el filtro muscular.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMuscle('TODOS');
                  setActiveTab('ALL');
                }}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            /* CUADRÍCULA DE EJERCICIOS */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise) => {
                const isGym = exercise.location === 'GYM';
                return (
                  <div
                    key={exercise.id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* HEADER DE LA CARD CON BADGES */}
                      <div className="p-5 pb-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wide ${
                              isGym
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isGym ? <Building2 size={13} /> : <Home size={13} />}
                            <span>{isGym ? 'MÁQUINA GYM' : 'EN CASA'}</span>
                          </span>

                          <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                            {exercise.level}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {exercise.name}
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 mt-0.5">
                          {exercise.machineType || exercise.category}
                        </p>
                      </div>

                      {/* CONTENEDOR PREVIEW VÍDEO REAL CON PERSONA */}
                      <div
                        onClick={() => {
                          setSelectedExercise(exercise);
                          setModalTab('VIDEO_DEMO');
                        }}
                        className="mx-5 bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center cursor-pointer relative group/anim min-h-[185px] shadow-inner"
                      >
                        {exercise.youtubeId ? (
                          <div
                            className="w-full h-full absolute inset-0 bg-cover bg-center opacity-85 group-hover/anim:opacity-100 group-hover/anim:scale-105 transition-all duration-300"
                            style={{ backgroundImage: `url(https://img.youtube.com/vi/${exercise.youtubeId}/mqdefault.jpg)` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/30" />
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs shadow-xs">
                              <Video size={10} />
                              <span>Vídeo Real HD</span>
                            </div>
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-bold">
                              <span>Persona en Vivo</span>
                              <span className="bg-black/50 px-2 py-0.5 rounded text-[10px] text-gray-300">Técnica Pro</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-center">
                            <ExerciseAnimation exercise={exercise} isPlaying={false} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-blue-950/30 backdrop-blur-[1px] opacity-0 group-hover/anim:opacity-100 transition-opacity flex items-center justify-center z-10">
                          <span className="bg-white text-blue-900 font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover/anim:translate-y-0 transition-transform">
                            <Play size={14} className="fill-blue-900" />
                            <span>Ver Vídeo Real con Persona</span>
                          </span>
                        </div>
                      </div>

                      {/* DETALLES MUSCULARES */}
                      <div className="p-5 pt-4 space-y-2.5">
                        <div className="flex items-start gap-2 text-xs">
                          <span className="text-gray-400 font-semibold shrink-0">🎯 Primario:</span>
                          <span className="font-bold text-gray-800">{exercise.primaryMuscle}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-400 font-semibold shrink-0">⏱️ Cadencia:</span>
                          <span className="font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded text-[11px] border border-gray-100">
                            {exercise.tempo}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BOTÓN INFERIOR */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => {
                          setSelectedExercise(exercise);
                          setModalTab('VIDEO_DEMO');
                        }}
                        className="w-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs py-2.5 rounded-xl border border-blue-200 hover:border-blue-600 transition-all flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Video size={14} />
                        <span>Ver Vídeo Real & Biomecánica</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL INTERACTIVO DE EJERCICIO CON ANIMACIÓN GRÁFICA & BIOMECÁNICA */}
      {/* ======================================================== */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-blue-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
            {/* MODAL HEADER */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-20">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-black ${
                      selectedExercise.location === 'GYM'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {selectedExercise.location === 'GYM' ? <Building2 size={13} /> : <Home size={13} />}
                    <span>{selectedExercise.location === 'GYM' ? 'MÁQUINA DEL GIMNASIO' : 'EJERCICIO EN CASA'}</span>
                  </span>
                  <span className="text-xs font-semibold text-gray-500">• {selectedExercise.muscleGroup}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">{selectedExercise.name}</h2>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedExercise.machineType} • Dificultad: <strong className="text-gray-800">{selectedExercise.level}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedExercise(null)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* PESTAÑAS DENTRO DEL MODAL (VÍDEO REAL / BIOMECÁNICA / PREVENCIÓN) */}
            <div className="flex border-b border-gray-100 px-6 bg-gray-50/50 sticky top-[85px] z-10 flex-wrap">
              <button
                onClick={() => setModalTab('VIDEO_DEMO')}
                className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
                  modalTab === 'VIDEO_DEMO'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Video size={16} />
                <span>🎥 Vídeo Real con Persona en Vivo</span>
              </button>

              <button
                onClick={() => setModalTab('BIOMECHANICS')}
                className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
                  modalTab === 'BIOMECHANICS'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Compass size={15} />
                <span>Técnica & Biomecánica Detallada</span>
              </button>

              <button
                onClick={() => setModalTab('SAFETY')}
                className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
                  modalTab === 'SAFETY'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <ShieldAlert size={15} />
                <span>Prevención Articular & Errores</span>
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6">
              {/* TAB 1: VÍDEO REAL CON PERSONA & SIMULADOR BIOMECÁNICO */}
              {modalTab === 'VIDEO_DEMO' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* COLUMNA IZQUIERDA: REPRODUCTOR DE VÍDEO REAL CON PERSONA */}
                  <div className="lg:col-span-7 space-y-4">
                    <ExerciseVideoPlayer exercise={selectedExercise} defaultMode="VIDEO" />
                  </div>

                  {/* COLUMNA DERECHA: CRONÓMETRO Y RESUMEN RÁPIDO */}
                  <div className="lg:col-span-5 space-y-5">
                    {/* TEMPORIZADOR DE DESCANSO ENTRE SERIES */}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                          <Clock size={15} className="text-blue-600" />
                          <span>Cronómetro de Descanso entre Series</span>
                        </span>
                        {restTimer !== null && (
                          <span className="font-mono text-lg font-black text-blue-700 bg-white px-3 py-0.5 rounded-lg border border-blue-100 shadow-xs">
                            {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
                          </span>
                        )}
                      </div>

                      {/* Botones de tiempo rápido */}
                      <div className="grid grid-cols-4 gap-2">
                        {[30, 45, 60, 90].map((sec) => (
                          <button
                            key={sec}
                            onClick={() => startRestTimer(sec)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${
                              initialRestDuration === sec && isRestTimerRunning
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
                            }`}
                          >
                            {sec} seg
                          </button>
                        ))}
                      </div>

                      {/* Acciones de temporizador */}
                      {isRestTimerRunning ? (
                        <button
                          onClick={stopRestTimer}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                        >
                          Pausar Descanso
                        </button>
                      ) : restTimer !== null && restTimer < initialRestDuration ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsRestTimerRunning(true)}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
                          >
                            Reanudar
                          </button>
                          <button
                            onClick={resetRestTimer}
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-300 transition-colors"
                          >
                            Reiniciar
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {/* TARJETAS RÁPIDAS DE BIOMECÁNICA */}
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                        <span className="text-[10px] font-black uppercase text-blue-900 tracking-wider block">
                          🎯 Músculo Principal Agonista
                        </span>
                        <p className="text-sm font-black text-blue-950 mt-1">
                          {selectedExercise.primaryMuscle}
                        </p>
                        {selectedExercise.secondaryMuscle && (
                          <p className="text-xs text-blue-700 mt-0.5">
                            Sinergistas: {selectedExercise.secondaryMuscle}
                          </p>
                        )}
                      </div>

                      {/* PATRÓN RESPIRATORIO */}
                      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-sky-500 text-white shrink-0 mt-0.5">
                          <Wind size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-sky-950 uppercase tracking-wider">
                            Respiración Biomecánica
                          </h4>
                          <p className="text-xs text-sky-900 mt-1 leading-relaxed">
                            {selectedExercise.breathing}
                          </p>
                        </div>
                      </div>

                      {/* CADENCIA RECOMENDADA */}
                      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-purple-950 uppercase tracking-wider">
                            ⏱️ Cadencia / Tempo
                          </span>
                          <span className="font-mono font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                            {selectedExercise.tempo}
                          </span>
                        </div>
                        <p className="text-xs text-purple-800 mt-1.5 leading-relaxed">
                          Controla la fase excéntrica sin usar la inercia del peso y acelera de forma explosiva en la contracción.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BIOMECÁNICA & TÉCNICA DETALLADA */}
              {modalTab === 'BIOMECHANICS' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* EXPLICACIÓN BIOMECÁNICA FUNDAMENTAL */}
                  {selectedExercise.biomechanicsExplanation && (
                    <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs uppercase tracking-wider">
                        <Compass size={16} />
                        <span>Fundamento Biomecánico & Anatomía Funcional</span>
                      </div>
                      <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed font-medium">
                        {selectedExercise.biomechanicsExplanation}
                      </p>
                    </div>
                  )}

                  {/* AJUSTES DE LA MÁQUINA & SETUP INICIAL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedExercise.machineSetup && (
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Wrench size={15} className="text-blue-600" />
                          <span>1. Ajuste Milimétrico de la Máquina</span>
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          {selectedExercise.machineSetup}
                        </p>
                      </div>
                    )}

                    {selectedExercise.setupPosture && (
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Target size={15} className="text-emerald-600" />
                          <span>2. Postura & Setup Inicial (Paso 0)</span>
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          {selectedExercise.setupPosture}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CUES MENTALES DE ÉLITE */}
                  {selectedExercise.cues && (
                    <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-3">
                      <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-2">
                        <Lightbulb size={16} className="text-amber-600" />
                        <span>Cues Mentales de Preparadores de Élite (Conexión Mente-Músculo)</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedExercise.cues.map((cue, cIdx) => (
                          <div key={cIdx} className="bg-white/80 rounded-xl p-3 border border-amber-200 text-xs text-amber-950 font-semibold shadow-2xs">
                            💡 "{cue}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DESGLOSE FASE EXCÉNTRICA VS CONCÉNTRICA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedExercise.eccentricPhase && (
                      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
                        <span className="text-[10px] font-black uppercase text-blue-900 tracking-wider block">
                          📉 Fase Excéntrica (Bajada / Elongación)
                        </span>
                        <p className="text-xs text-blue-950 leading-relaxed font-medium">
                          {selectedExercise.eccentricPhase}
                        </p>
                      </div>
                    )}

                    {selectedExercise.concentricPhase && (
                      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                        <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider block">
                          📈 Fase Concéntrica (Empuje / Contracción)
                        </span>
                        <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                          {selectedExercise.concentricPhase}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* PASO A PASO NUMERADO */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>Protocolo de Ejecución Paso a Paso</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedExercise.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                        >
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-gray-700 leading-relaxed font-medium">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PREVENCIÓN ARTICULAR & ERRORES */}
              {modalTab === 'SAFETY' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* ALERTA DE RIESGO CLÍNICO / FISIOTERAPIA */}
                  {selectedExercise.clinicalRisks && (
                    <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                      <h4 className="text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-2">
                        <ShieldAlert size={16} className="text-rose-600" />
                        <span>Advertencia Fisioterapéutica & Desgaste Articular</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-medium">
                        {selectedExercise.clinicalRisks}
                      </p>
                    </div>
                  )}

                  {/* ERRORES COMUNES DETALLADOS */}
                  {selectedExercise.mistakes && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-600" />
                        <span>Errores Críticos Frecuentes y Cómo Corregirlos</span>
                      </h4>
                      <div className="space-y-2.5">
                        {selectedExercise.mistakes.map((mistake, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3"
                          >
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                              ✕
                            </span>
                            <div>
                              <p className="text-xs font-bold text-amber-950">{mistake}</p>
                              <p className="text-[11px] text-amber-800/90 mt-0.5">
                                Corrección: Mantén la velocidad controlada y no aumentes el peso si este error ocurre.
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/80 rounded-b-3xl flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
                Gym Esencial • Biomecánica & Entrenamiento de Alto Nivel
              </span>
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors ml-auto"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
