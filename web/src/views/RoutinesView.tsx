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
} from 'lucide-react';
import { api, Routine, Exercise, Member } from '../services/api';

export const RoutinesView: React.FC = () => {
  const [tab, setTab] = useState<'ROUTINES' | 'EXERCISES'>('ROUTINES');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState('ALL');

  // Asignar rutina modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [assignMemberId, setAssignMemberId] = useState('');

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

  const filteredExercises = exercises.filter(
    (ex) => selectedMuscle === 'ALL' || ex.muscleGroup === selectedMuscle
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header & Rest Timer Widget */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Navigation Tabs */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dumbbell size={24} color="#10b981" />
            <span>Rutinas & Ejercicios Pro</span>
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '4px 0 1rem 0' }}>
            Programas de hipertrofia, fuerza y catálogo de biomecánica.
          </p>

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
              {[30, 60, 90, 120].map((secs) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                {routine.exercises.map((item, idx) => (
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

      {/* Tab: Biblioteca de Ejercicios */}
      {tab === 'EXERCISES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Muscle Filters */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'Todos los Músculos' },
              { id: 'CHEST', label: 'Pecho' },
              { id: 'BACK', label: 'Espalda' },
              { id: 'LEGS', label: 'Piernas' },
              { id: 'SHOULDERS', label: 'Hombros' },
              { id: 'ARMS', label: 'Brazos' },
              { id: 'CORE', label: 'Abdomen' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMuscle(m.id)}
                style={{
                  border: 'none',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
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

          {/* Grid de Ejercicios */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {ex.equipment}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  {ex.name}
                </h4>

                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                  {ex.description || 'Ejercicio de alta demanda neuromuscular y tensión mecánica continua.'}
                </p>
              </div>
            ))}
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
