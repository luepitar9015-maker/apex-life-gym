import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Play,
  RotateCcw,
  Plus,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Clock,
  Sparkles,
  Home,
  Building,
  X,
} from 'lucide-react';
import { api, Routine, Exercise, Member } from '../services/api';

export const RoutinesView: React.FC = () => {
  const [tab, setTab] = useState<'ROUTINES' | 'EXERCISES'>('ROUTINES');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'GYM' | 'HOME'>('ALL');

  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [assignMemberId, setAssignMemberId] = useState('');

  // AI Generator Form
  const [aiGoal, setAiGoal] = useState('HYPERTROPHY');
  const [aiLevel, setAiLevel] = useState('INTERMEDIATE');
  const [aiLocation, setAiLocation] = useState<'GYM' | 'HOME'>('GYM');
  const [aiDays, setAiDays] = useState(4);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Temporizador de descanso
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerInitial, setTimerInitial] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rData, eData, mData] = await Promise.all([
        api.getRoutines(),
        api.getExercises(),
        api.getMembers({ status: 'ACTIVE' }),
      ]);
      setRoutines(rData);
      setExercises(eData);
      setMembers(mData);
      if (mData.length > 0) setAssignMemberId(mData[0].id);
    } catch (err) {
      console.error('Error cargando rutinas:', err);
    }
  };

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert('⏰ ¡Tiempo de descanso completado! Siguiente serie.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleStartTimer = (secs: number) => {
    setTimerInitial(secs);
    setTimerSeconds(secs);
    setIsTimerRunning(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoutine || !assignMemberId) return;

    try {
      await api.assignRoutine(assignMemberId, selectedRoutine.id);
      alert(`Rutina "${selectedRoutine.name}" asignada correctamente.`);
      setShowAssignModal(false);
    } catch (err: any) {
      alert(err.message || 'Error al asignar rutina');
    }
  };

  const handleGenerateRoutineAI = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAiGenerating(true);
      const res = await api.generateRoutineAI({
        goal: aiGoal,
        level: aiLevel,
        location: aiLocation,
        daysPerWeek: aiDays,
      });

      alert(`¡Rutina "${res.data.name}" creada con éxito por Gemini AI!`);
      setShowAiModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error al generar rutina con IA');
    } finally {
      setAiGenerating(false);
    }
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchMuscle = selectedMuscle === 'ALL' || ex.muscleGroup === selectedMuscle;
    const matchLoc =
      locationFilter === 'ALL' ||
      ex.location === locationFilter ||
      ex.location === 'BOTH' ||
      (locationFilter === 'HOME' && ex.equipment === 'BODYWEIGHT');
    return matchMuscle && matchLoc;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header & AI Generator Action */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Navigation Tabs */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Dumbbell size={24} color="#10b981" />
                <span>Rutinas & Ejercicios (Gym & Casa)</span>
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Catálogo biomecánico ampliado con pesas y calistenia en casa.
              </p>
            </div>

            <button
              onClick={() => setShowAiModal(true)}
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                color: '#10b981',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.25)',
              }}
            >
              <Sparkles size={16} />
              <span>Crear Rutina con IA</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setTab('ROUTINES')}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: tab === 'ROUTINES' ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                color: tab === 'ROUTINES' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Planes de Entrenamiento ({routines.length})
            </button>
            <button
              onClick={() => setTab('EXERCISES')}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: tab === 'EXERCISES' ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                color: tab === 'EXERCISES' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Biblioteca de Ejercicios ({exercises.length})
            </button>
          </div>
        </div>

        {/* Cronómetro de Descanso Interactivo */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cronómetro de Descanso Entre Series
            </span>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#ffffff',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              marginTop: '2px',
            }}>
              00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '6px' }}>
              {[30, 45, 60, 90, 120].map((secs) => (
                <button
                  key={secs}
                  onClick={() => handleStartTimer(secs)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#cbd5e1',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {secs}s
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: isTimerRunning ? '#f59e0b' : '#10b981',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Play size={20} />
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(timerInitial);
              }}
              style={{
                width: '46px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#94a3b8',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Reiniciar"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Tab: Programas de Rutinas */}
      {tab === 'ROUTINES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {routines.map((routine) => (
            <div key={routine.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      {routine.name}
                    </h3>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                    }}>
                      {routine.goal}
                    </span>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(6, 182, 212, 0.15)',
                      color: '#06b6d4',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                    }}>
                      {routine.difficulty}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    {routine.description} • Frecuencia: <strong style={{ color: '#f1f5f9' }}>{routine.daysPerWeek} días/semana</strong>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedRoutine(routine);
                    setShowAssignModal(true);
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <Plus size={15} />
                  <span>Asignar a Socio</span>
                </button>
              </div>

              {/* Lista de Ejercicios en la Rutina */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {routine.exercises.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700 }}>
                        Día {item.dayNumber}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {item.restSeconds}s pausa
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9' }}>
                      {item.exercise.name}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                      <span>Series: <strong style={{ color: '#10b981' }}>{item.sets}</strong></span>
                      <span>Reps: <strong style={{ color: '#10b981' }}>{item.reps}</strong></span>
                    </div>

                    {item.notes && (
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                        {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Biblioteca de Ejercicios (GYM & CASA) */}
      {tab === 'EXERCISES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Location Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Ubicación: Gym vs Casa */}
            <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setLocationFilter('ALL')}
                style={{
                  border: 'none',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '7px',
                  backgroundColor: locationFilter === 'ALL' ? '#10b981' : 'transparent',
                  color: locationFilter === 'ALL' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Todos ({exercises.length})
              </button>
              <button
                onClick={() => setLocationFilter('GYM')}
                style={{
                  border: 'none',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '7px',
                  backgroundColor: locationFilter === 'GYM' ? '#06b6d4' : 'transparent',
                  color: locationFilter === 'GYM' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Building size={14} />
                <span>En Gimnasio (Máquinas/Pesas)</span>
              </button>
              <button
                onClick={() => setLocationFilter('HOME')}
                style={{
                  border: 'none',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '7px',
                  backgroundColor: locationFilter === 'HOME' ? '#8b5cf6' : 'transparent',
                  color: locationFilter === 'HOME' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Home size={14} />
                <span>En Casa (Calistenia/Sin Pesas)</span>
              </button>
            </div>

            {/* Muscle Groups */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'CHEST', label: 'Pecho' },
                { id: 'BACK', label: 'Espalda' },
                { id: 'LEGS', label: 'Piernas' },
                { id: 'SHOULDERS', label: 'Hombros' },
                { id: 'ARMS', label: 'Brazos' },
                { id: 'CORE', label: 'Abdomen' },
                { id: 'CARDIO', label: 'Cardio' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMuscle(m.id)}
                  style={{
                    border: 'none',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: selectedMuscle === m.id ? 700 : 500,
                    backgroundColor: selectedMuscle === m.id ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedMuscle === m.id ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Ejercicios */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1rem',
          }}>
            {filteredExercises.map((ex) => {
              const isHome = ex.location === 'HOME' || ex.equipment === 'BODYWEIGHT';
              return (
                <div
                  key={ex.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    border: isHome ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(6, 182, 212, 0.15)',
                      color: '#06b6d4',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                    }}>
                      {ex.muscleGroup}
                    </span>

                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: isHome ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: isHome ? '#8b5cf6' : '#10b981',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      {isHome ? <Home size={11} /> : <Building size={11} />}
                      <span>{isHome ? 'CASA / SIN EQUIPO' : 'GIMNASIO'}</span>
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    {ex.name}
                  </h4>

                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Equipo: {ex.equipment || 'Ninguno / Peso Corporal'}
                  </span>

                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                    {ex.description || 'Ejercicio de alta demanda neuromuscular y tensión mecánica continua.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Generar Rutina con IA (Google Gemini) */}
      {showAiModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '2rem',
            backgroundColor: '#0f172a',
            border: '2px solid rgba(16, 185, 129, 0.4)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={22} color="#10b981" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Generador de Rutinas con IA
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              El agente de IA (Gemini 2.5) diseñará una periodización biomecánicamente óptima según los parámetros seleccionados:
            </p>

            <form onSubmit={handleGenerateRoutineAI} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Objetivo Principal</label>
                <select
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', marginTop: '4px' }}
                >
                  <option value="HYPERTROPHY">Ganancia de Masa Muscular (Hipertrofia)</option>
                  <option value="FAT_LOSS">Pérdida de Grasa & Definición</option>
                  <option value="STRENGTH">Fuerza Máxima & Potencia</option>
                  <option value="RECOMPOSITION">Recomposición Corporal</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Ubicación</label>
                  <select
                    value={aiLocation}
                    onChange={(e) => setAiLocation(e.target.value as any)}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', marginTop: '4px' }}
                  >
                    <option value="GYM">🏛️ En Gimnasio (Máquinas y Barras)</option>
                    <option value="HOME">🏠 En Casa (Peso Corporal/Calistenia)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Nivel del Atleta</label>
                  <select
                    value={aiLevel}
                    onChange={(e) => setAiLevel(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', marginTop: '4px' }}
                  >
                    <option value="BEGINNER">Principiante (0 - 6 meses)</option>
                    <option value="INTERMEDIATE">Intermedio (6m - 2 años)</option>
                    <option value="ADVANCED">Avanzado (+2 años)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Frecuencia Semanal</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginTop: '4px' }}>
                  {[3, 4, 5, 6].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setAiDays(days)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: aiDays === days ? '#10b981' : 'rgba(255,255,255,0.06)',
                        color: aiDays === days ? '#ffffff' : '#94a3b8',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {days} Días
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={aiGenerating}
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={18} />
                <span>{aiGenerating ? 'Gemini IA Generando Rutina...' : 'Generar Rutina con Gemini IA'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Asignar Rutina a Socio */}
      {showAssignModal && selectedRoutine && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '440px',
            padding: '2rem',
            backgroundColor: '#0f172a',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Asignar Rutina a Socio
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 1.25rem 0' }}>
              Rutina: <strong style={{ color: '#10b981' }}>{selectedRoutine.name}</strong>
            </p>

            <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Seleccionar Socio Activo</label>
                <select
                  value={assignMemberId}
                  onChange={(e) => setAssignMemberId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    marginTop: '4px',
                  }}
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} ({m.code})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: '#94a3b8',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Asignar Rutina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
