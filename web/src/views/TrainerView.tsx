import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Search,
} from 'lucide-react';
import { api, Member, Routine, Exercise } from '../services/api';

export const TrainerView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const [search, setSearch] = useState('');

  // Temporizador para entrenamiento
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mList, rList, eList] = await Promise.all([
        api.getMembers({ status: 'ACTIVE' }),
        api.getRoutines(),
        api.getExercises(),
      ]);
      setMembers(mList);
      setRoutines(rList);
      setExercises(eList);
      if (mList.length > 0) setSelectedMember(mList[0]);
      if (rList.length > 0) setSelectedRoutineId(rList[0].id);
    } catch (err) {
      console.error('Error cargando entrenador:', err);
    }
  };

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      alert('⏰ ¡Descanso de serie completado!');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const handleAssignRoutine = async () => {
    if (!selectedMember || !selectedRoutineId) return;
    try {
      await api.assignRoutine(selectedMember.id, selectedRoutineId);
      alert(`Rutina asignada exitosamente a ${selectedMember.firstName} ${selectedMember.lastName}`);
      const updated = await api.getMemberById(selectedMember.id);
      setSelectedMember(updated);
    } catch (err: any) {
      alert(err.message || 'Error al asignar rutina');
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.firstName.toLowerCase().includes(search.toLowerCase()) ||
      m.lastName.toLowerCase().includes(search.toLowerCase()) ||
      m.documentNumber.includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Banner Coach */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Dumbbell size={24} color="#10b981" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Portal de Entrenadores & Coaches
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Gestión de rutinas, seguimiento de atletas y cronómetro para sala de musculación.
            </p>
          </div>
        </div>

        {/* Stopwatch Widget */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>PAUSA SERIE:</span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
            00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
          </div>
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            style={{
              backgroundColor: timerRunning ? '#f59e0b' : '#10b981',
              border: 'none',
              color: '#ffffff',
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {timerRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button
            onClick={() => {
              setTimerRunning(false);
              setTimerSeconds(90);
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Grid: Lista de Atletas / Socios & Rutina Asignada */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Atletas a cargo */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#06b6d4" />
            <span>Atletas y Afiliados Activos</span>
          </h3>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por nombre o documento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem 0.6rem 2.2rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
            {filteredMembers.map((m) => {
              const isSelected = selectedMember?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: isSelected ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.05)',
                    backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>
                      {m.firstName} {m.lastName}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      {m.code} • {m.currentPlan?.name || 'Membresía'}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600 }}>
                    {m.weight ? `${m.weight} kg` : 'Sin peso'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ficha de Asignación y Rutina */}
        {selectedMember && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>
                PROGRAMA DE ENTRENAMIENTO
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 0 0' }}>
                {selectedMember.firstName} {selectedMember.lastName}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Objetivo: {selectedMember.notes || 'Acondicionamiento general e hipertrofia'}
              </p>
            </div>

            {/* Asignar Rutina Selector */}
            <div style={{
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                Prescribir Nueva Rutina del Catálogo:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={selectedRoutineId}
                  onChange={(e) => setSelectedRoutineId(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                >
                  {routines.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.goal} - {r.daysPerWeek} días)
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignRoutine}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0 1rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Asignar
                </button>
              </div>
            </div>

            {/* Métricas Físicas del Atleta */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <div style={{ padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Peso Actual</span>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>
                  {selectedMember.weight ? `${selectedMember.weight} kg` : '--'}
                </div>
              </div>
              <div style={{ padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Estatura</span>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>
                  {selectedMember.height ? `${selectedMember.height} m` : '--'}
                </div>
              </div>
              <div style={{ padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>IMC</span>
                <div style={{ fontWeight: 700, color: '#10b981', fontSize: '1rem' }}>
                  {selectedMember.weight && selectedMember.height
                    ? (selectedMember.weight / (selectedMember.height * selectedMember.height)).toFixed(1)
                    : '--'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
