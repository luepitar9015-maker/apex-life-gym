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
  ArrowRight
} from 'lucide-react';
import { EXERCISES_DATABASE, WEEKLY_ROUTINES } from '../data/exercisesData';
import ExerciseAnimation from '../components/ExerciseAnimation';

export default function Rutinas() {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'GYM' | 'CASA' | 'PROGRAMS'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('TODOS');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);

  // Temporizador de descanso en el modal
  const [restTimer, setRestTimer] = useState(null); // segundos restantes
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
    // Filtro por tab (GYM vs CASA)
    if (activeTab === 'GYM' && ex.location !== 'GYM') return false;
    if (activeTab === 'CASA' && ex.location !== 'CASA') return false;

    // Filtro por grupo muscular
    if (selectedMuscle !== 'TODOS' && ex.muscleGroup !== selectedMuscle) return false;

    // Filtro por texto de búsqueda
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
            <span>Biblioteca Biomecánica & Animaciones Gráficas</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-950 tracking-tight">
            Catálogo de Rutinas, Máquinas & Casa
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Investigación exhaustiva de movimientos biomecánicos: ejercicios en máquinas guiadas de gimnasio
            y rutinas funcionales en casa, con animaciones gráficas interactivas y guías de ejecución técnica.
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
                                onClick={() => fullEx && setSelectedExercise(fullEx)}
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
                      if (firstEx) setSelectedExercise(firstEx);
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

                      {/* CONTENEDOR PREVIEW ANIMACIÓN GRÁFICA */}
                      <div
                        onClick={() => setSelectedExercise(exercise)}
                        className="mx-5 bg-gradient-to-b from-gray-50 to-blue-50/30 rounded-2xl p-4 border border-gray-100 flex items-center justify-center cursor-pointer relative overflow-hidden group/anim min-h-[170px]"
                      >
                        <div className="w-full flex items-center justify-center">
                          <ExerciseAnimation exercise={exercise} isPlaying={false} />
                        </div>
                        <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[2px] opacity-0 group-hover/anim:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white text-blue-900 font-extrabold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover/anim:translate-y-0 transition-transform">
                            <Play size={14} className="fill-blue-900" />
                            <span>Ver Animación en Vivo</span>
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
                        onClick={() => setSelectedExercise(exercise)}
                        className="w-full bg-gray-50 hover:bg-blue-600 text-gray-700 hover:text-white font-bold text-xs py-2.5 rounded-xl border border-gray-200 hover:border-blue-600 transition-all flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Play size={14} />
                        <span>Ver Animación & Técnica Completa</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-blue-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
            {/* MODAL HEADER */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
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
                <h2 className="text-xl md:text-2xl font-black text-gray-900">{selectedExercise.name}</h2>
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

            {/* MODAL BODY */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* COLUMNA IZQUIERDA: ANIMACIÓN GRÁFICA & CONTROLES */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-gradient-to-b from-gray-50 to-blue-50/50 rounded-3xl p-6 border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
                  <ExerciseAnimation exercise={selectedExercise} isPlaying={isAnimationPlaying} />
                </div>

                {/* CONTROLES DE ANIMACIÓN */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsAnimationPlaying(!isAnimationPlaying)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    {isAnimationPlaying ? <Pause size={15} /> : <Play size={15} />}
                    <span>{isAnimationPlaying ? 'Pausar Animación' : 'Reanudar Animación'}</span>
                  </button>

                  <button
                    onClick={() => setIsAnimationPlaying(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
                  >
                    <RotateCcw size={14} />
                    <span>Reiniciar</span>
                  </button>
                </div>

                {/* TEMPORIZADOR DE DESCANSO ENTRE SERIES */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Clock size={14} className="text-blue-600" />
                      <span>Descanso entre Series</span>
                    </span>
                    {restTimer !== null && (
                      <span className="font-mono text-base font-black text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-100">
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
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          initialRestDuration === sec && isRestTimerRunning
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>

                  {/* Acciones de temporizador */}
                  {isRestTimerRunning ? (
                    <button
                      onClick={stopRestTimer}
                      className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      Pausar Cronómetro
                    </button>
                  ) : restTimer !== null && restTimer < initialRestDuration ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsRestTimerRunning(true)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
                      >
                        Reanudar
                      </button>
                      <button
                        onClick={resetRestTimer}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-300 transition-colors"
                      >
                        Reiniciar
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* COLUMNA DERECHA: GUÍA TÉCNICA PASO A PASO, RESPIRACIÓN & ERRORES */}
              <div className="lg:col-span-7 space-y-5">
                {/* MÚSCULOS & CADENCIA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
                    <span className="text-[10px] font-extrabold uppercase text-blue-900 tracking-wider block">
                      Músculo Principal
                    </span>
                    <span className="text-xs font-bold text-blue-950 mt-0.5 block">
                      {selectedExercise.primaryMuscle}
                    </span>
                    {selectedExercise.secondaryMuscle && (
                      <span className="text-[11px] text-blue-700/80 mt-1 block">
                        Secundario: {selectedExercise.secondaryMuscle}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                    <span className="text-[10px] font-extrabold uppercase text-purple-900 tracking-wider block">
                      Cadencia / Tempo
                    </span>
                    <span className="text-xs font-bold text-purple-950 mt-0.5 block">
                      {selectedExercise.tempo}
                    </span>
                    <span className="text-[11px] text-purple-700/80 mt-1 block">
                      Control excéntrico + potencia concéntrica
                    </span>
                  </div>
                </div>

                {/* GUÍA DE RESPIRACIÓN BIOMECÁNICA */}
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-sky-500 text-white shrink-0">
                    <Wind size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-sky-950 uppercase tracking-wider">
                      Patrón de Respiración Correcto
                    </h4>
                    <p className="text-xs text-sky-900 mt-1 leading-relaxed">
                      {selectedExercise.breathing}
                    </p>
                  </div>
                </div>

                {/* PASO A PASO BIOMECÁNICO */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Ejecución Técnica Paso a Paso</span>
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
                        <p className="text-xs text-gray-700 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ERRORES COMUNES A EVITAR */}
                {selectedExercise.mistakes && selectedExercise.mistakes.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 space-y-2">
                    <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle size={15} className="text-amber-600" />
                      <span>Errores Comunes y Riesgo Lesivo a Evitar</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedExercise.mistakes.map((mistake, mIdx) => (
                        <li key={mIdx} className="text-xs text-amber-900 flex items-start gap-2">
                          <span className="text-amber-600 font-bold shrink-0">•</span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/80 rounded-b-3xl flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                Gym Esencial • Biomecánica & Entrenamiento
              </span>
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
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
