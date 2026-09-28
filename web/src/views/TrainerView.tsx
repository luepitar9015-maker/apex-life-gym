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
  Salad,
  Save,
  Trash2,
  Flame,
  Home,
  Building2,
  Check,
  Edit3,
} from 'lucide-react';
import { api, Member, Routine, Exercise, NutritionPlan, MealItem } from '../services/api';

export const TrainerView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ROUTINE' | 'NUTRITION'>('ROUTINE');

  // Datos específicos del socio seleccionado
  const [currentRoutine, setCurrentRoutine] = useState<Routine | null>(null);
  const [currentNutrition, setCurrentNutrition] = useState<NutritionPlan | null>(null);
  const [loadingMemberData, setLoadingMemberData] = useState(false);

  // Estados de Edición de Rutina por Entrenador
  const [editableRoutine, setEditableRoutine] = useState<any>(null);
  const [savingRoutine, setSavingRoutine] = useState(false);

  // Estados de Edición de Nutrición por Entrenador
  const [editableNutrition, setEditableNutrition] = useState<any>(null);
  const [savingNutrition, setSavingNutrition] = useState(false);

  // Generadores IA Modal / Dropdown
  const [generatingRoutineAI, setGeneratingRoutineAI] = useState(false);
  const [aiRoutineGoal, setAiRoutineGoal] = useState('HYPERTROPHY');
  const [aiRoutineLocation, setAiRoutineLocation] = useState<'GYM' | 'HOME'>('GYM');
  const [aiRoutineDays, setAiRoutineDays] = useState(4);

  const [generatingNutritionAI, setGeneratingNutritionAI] = useState(false);
  const [aiDietGoal, setAiDietGoal] = useState('HYPERTROPHY');
  const [aiDietRestrictions, setAiDietRestrictions] = useState('Sin restricciones específicas');

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
      if (mList.length > 0) {
        selectAthlete(mList[0]);
      }
      if (rList.length > 0) setSelectedRoutineId(rList[0].id);
    } catch (err) {
      console.error('Error cargando entrenador:', err);
    }
  };

  const selectAthlete = async (member: Member) => {
    setSelectedMember(member);
    setLoadingMemberData(true);
    try {
      // 1. Cargar detalle completo del socio para obtener su rutina asignada
      const fullMember = await api.getMemberById(member.id);
      if (fullMember.routines && fullMember.routines.length > 0) {
        const assigned = fullMember.routines.find((r: any) => r.active) || fullMember.routines[0];
        setCurrentRoutine(assigned.routine);
        setEditableRoutine(JSON.parse(JSON.stringify(assigned.routine)));
        setSelectedRoutineId(assigned.routine.id);
      } else {
        setCurrentRoutine(null);
        setEditableRoutine(null);
      }

      // 2. Cargar plan de nutrición
      const nutritionPlan = await api.getMemberNutrition(member.id);
      setCurrentNutrition(nutritionPlan);
      if (nutritionPlan) {
        setEditableNutrition(JSON.parse(JSON.stringify(nutritionPlan)));
      } else {
        setEditableNutrition(null);
      }
    } catch (err) {
      console.error('Error cargando datos del atleta:', err);
    } finally {
      setLoadingMemberData(false);
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
      await selectAthlete(selectedMember);
    } catch (err: any) {
      alert(err.message || 'Error al asignar rutina');
    }
  };

  // Generar Rutina con IA (Gemini 2.5 Flash)
  const handleGenerateRoutineAI = async () => {
    if (!selectedMember) return;
    try {
      setGeneratingRoutineAI(true);
      const res = await api.generateRoutineAI({
        memberId: selectedMember.id,
        goal: aiRoutineGoal,
        level: 'INTERMEDIATE',
        location: aiRoutineLocation,
        daysPerWeek: aiRoutineDays,
        assignToMember: true,
      });

      alert(`✨ Rutina generada con éxito con Google Gemini 2.5 Flash para ${selectedMember.firstName}: ${res.data.name}`);
      await selectAthlete(selectedMember);
      const updatedRoutines = await api.getRoutines();
      setRoutines(updatedRoutines);
    } catch (err: any) {
      alert(err.message || 'Error generando rutina con IA');
    } finally {
      setGeneratingRoutineAI(false);
    }
  };

  // Guardar Edición de Rutina como Entrenador
  const handleSaveRoutineChanges = async () => {
    if (!editableRoutine || !editableRoutine.id) return;
    try {
      setSavingRoutine(true);
      const res = await api.updateRoutineByTrainer(editableRoutine.id, {
        name: editableRoutine.name,
        description: editableRoutine.description,
        aiNotes: editableRoutine.aiNotes,
        exercises: editableRoutine.exercises.map((e: any) => ({
          id: e.id,
          sets: Number(e.sets),
          reps: String(e.reps),
          restSeconds: Number(e.restSeconds),
          notes: e.notes,
        })),
      });

      setCurrentRoutine(res.data);
      setEditableRoutine(JSON.parse(JSON.stringify(res.data)));
      alert('✅ Rutina supervisada y guardada con éxito por el Entrenador.');
    } catch (err: any) {
      alert(err.message || 'Error al actualizar rutina');
    } finally {
      setSavingRoutine(false);
    }
  };

  // Generar Plan de Nutrición con IA (Gemini 2.5 Flash)
  const handleGenerateNutritionAI = async () => {
    if (!selectedMember) return;
    try {
      setGeneratingNutritionAI(true);
      const res = await api.generateNutritionAI({
        memberId: selectedMember.id,
        goal: aiDietGoal,
        dietaryRestrictions: aiDietRestrictions,
        trainingDaysPerWeek: 4,
      });

      alert(`🥗 Plan de Nutrición IA generado con éxito con Google Gemini para ${selectedMember.firstName}!`);
      setCurrentNutrition(res.data);
      setEditableNutrition(JSON.parse(JSON.stringify(res.data)));
    } catch (err: any) {
      alert(err.message || 'Error al generar plan nutricional con IA');
    } finally {
      setGeneratingNutritionAI(false);
    }
  };

  // Guardar Edición de Nutrición como Entrenador
  const handleSaveNutritionChanges = async () => {
    if (!editableNutrition || !editableNutrition.id) return;
    try {
      setSavingNutrition(true);
      const res = await api.updateNutritionPlan(editableNutrition.id, {
        title: editableNutrition.title,
        targetCalories: Number(editableNutrition.targetCalories),
        proteinGrams: Number(editableNutrition.proteinGrams),
        carbsGrams: Number(editableNutrition.carbsGrams),
        fatsGrams: Number(editableNutrition.fatsGrams),
        trainerNotes: editableNutrition.trainerNotes,
        meals: editableNutrition.meals,
      });

      setCurrentNutrition(res.data);
      setEditableNutrition(JSON.parse(JSON.stringify(res.data)));
      alert('✅ Plan nutricional revisado, ajustado y aprobado por el Entrenador.');
    } catch (err: any) {
      alert(err.message || 'Error al guardar nutrición');
    } finally {
      setSavingNutrition(false);
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
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Dumbbell size={26} color="#10b981" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.28rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Portal de Entrenadores & Asistente IA (Gemini 2.5 Flash)
              </h2>
              <span style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <Sparkles size={12} /> IA Conectada
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Prescripción biomecánica, cálculo de macros con IA y edición directa de rutinas/dietas para atletas.
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

      {/* Grid: Lista de Atletas y Panel de Trabajo */}
      <div className="responsive-trainer-grid">
        {/* Atletas a cargo */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#06b6d4" />
            <span>Atletas a Cargo</span>
          </h3>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por nombre..."
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '550px', overflowY: 'auto' }}>
            {filteredMembers.map((m) => {
              const isSelected = selectedMember?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => selectAthlete(m)}
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
                    transition: 'all 0.15s ease',
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

        {/* Panel de Trabajo del Atleta */}
        {selectedMember ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Encabezado del Atleta con Tabs */}
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>
                  EXPEDIENTE DEPORTIVO & FISIOLÓGICO
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 0 0' }}>
                  {selectedMember.firstName} {selectedMember.lastName}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Objetivo: <strong style={{ color: '#f1f5f9' }}>{selectedMember.notes || 'Acondicionamiento general e hipertrofia'}</strong>
                  {' • '}
                  Peso: <strong style={{ color: '#10b981' }}>{selectedMember.weight || 70} kg</strong>
                  {' • '}
                  Estatura: <strong style={{ color: '#10b981' }}>{selectedMember.height || 1.75} m</strong>
                </p>
              </div>

              {/* Selector de Pestaña: Rutina vs Nutrición */}
              <div style={{
                display: 'flex',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '4px',
                borderRadius: '10px',
                gap: '4px',
              }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('ROUTINE')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === 'ROUTINE' ? '#10b981' : 'transparent',
                    color: activeTab === 'ROUTINE' ? '#ffffff' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <Dumbbell size={16} />
                  <span>Rutina & Ejercicios</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('NUTRITION')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeTab === 'NUTRITION' ? '#06b6d4' : 'transparent',
                    color: activeTab === 'NUTRITION' ? '#ffffff' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <Salad size={16} />
                  <span>Nutrición & Dieta IA</span>
                </button>
              </div>
            </div>

            {/* TAB 1: RUTINA & EJERCICIOS */}
            {activeTab === 'ROUTINE' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Generador IA & Asignador Rápido */}
                <div className="glass-card" style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(6, 182, 212, 0.04) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} color="#10b981" />
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                        Generador de Rutina con IA (Google Gemini 2.5 Flash)
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {/* Ubicación: Gym o Casa */}
                      <select
                        value={aiRoutineLocation}
                        onChange={(e) => setAiRoutineLocation(e.target.value as any)}
                        style={{
                          padding: '0.45rem 0.75rem',
                          borderRadius: '8px',
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#ffffff',
                          fontSize: '0.8rem',
                        }}
                      >
                        <option value="GYM">🏋️ Gimnasio (Máquinas y Poleas)</option>
                        <option value="HOME">🏡 En Casa (Calistenia & Peso Corporal)</option>
                      </select>

                      {/* Objetivo */}
                      <select
                        value={aiRoutineGoal}
                        onChange={(e) => setAiRoutineGoal(e.target.value)}
                        style={{
                          padding: '0.45rem 0.75rem',
                          borderRadius: '8px',
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#ffffff',
                          fontSize: '0.8rem',
                        }}
                      >
                        <option value="HYPERTROPHY">Hipertrofia Muscular</option>
                        <option value="FAT_LOSS">Definición y Quema Grasa</option>
                        <option value="STRENGTH">Fuerza Máxima</option>
                        <option value="ENDURANCE">Resistencia & Funcional</option>
                      </select>

                      {/* Días */}
                      <select
                        value={aiRoutineDays}
                        onChange={(e) => setAiRoutineDays(Number(e.target.value))}
                        style={{
                          padding: '0.45rem 0.75rem',
                          borderRadius: '8px',
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#ffffff',
                          fontSize: '0.8rem',
                        }}
                      >
                        <option value={3}>3 días / sem</option>
                        <option value={4}>4 días / sem</option>
                        <option value={5}>5 días / sem</option>
                        <option value={6}>6 días / sem</option>
                      </select>

                      <button
                        onClick={handleGenerateRoutineAI}
                        disabled={generatingRoutineAI}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <Sparkles size={15} />
                        <span>{generatingRoutineAI ? 'Gemini Analizando...' : 'Generar con IA'}</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>O asignar rutina existente del catálogo:</span>
                    <select
                      value={selectedRoutineId}
                      onChange={(e) => setSelectedRoutineId(e.target.value)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '8px',
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        flex: 1,
                      }}
                    >
                      {routines.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.goal} • {r.daysPerWeek} días)
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignRoutine}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Asignar
                    </button>
                  </div>
                </div>

                {/* Editor Directo de Rutina del Atleta */}
                {editableRoutine ? (
                  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
                          SUPERVISIÓN DE RUTINA ACTIVA
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '4px' }}>
                          <input
                            type="text"
                            value={editableRoutine.name || ''}
                            onChange={(e) => setEditableRoutine({ ...editableRoutine, name: e.target.value })}
                            style={{
                              fontSize: '1.2rem',
                              fontWeight: 800,
                              color: '#ffffff',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              padding: '0.35rem 0.65rem',
                              minWidth: '320px',
                            }}
                          />
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: editableRoutine.location === 'HOME' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                            color: editableRoutine.location === 'HOME' ? '#eab308' : '#06b6d4',
                            fontWeight: 700,
                          }}>
                            {editableRoutine.location === 'HOME' ? '🏡 En Casa' : '🏋️ Gimnasio'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleSaveRoutineChanges}
                        disabled={savingRoutine}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.6rem 1.25rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 0 15px rgba(16, 185, 129, 0.35)',
                        }}
                      >
                        <Save size={16} />
                        <span>{savingRoutine ? 'Guardando Cambios...' : 'Guardar y Aprobar Rutina'}</span>
                      </button>
                    </div>

                    {/* Notas del Entrenador / IA */}
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                        Indicaciones Técnicas & Progresión del Entrenador:
                      </label>
                      <textarea
                        rows={2}
                        value={editableRoutine.aiNotes || ''}
                        onChange={(e) => setEditableRoutine({ ...editableRoutine, aiNotes: e.target.value })}
                        placeholder="Ej: Calentar 5 min de movilidad articular. Aplicar sobrecarga progresiva cada 2 semanas..."
                        style={{
                          width: '100%',
                          marginTop: '4px',
                          padding: '0.65rem',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#ffffff',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Lista Editable de Ejercicios */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                          Ejercicios Prescritos ({editableRoutine.exercises?.length || 0})
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          El entrenador puede modificar series, repeticiones y descanso por serie en tiempo real.
                        </span>
                      </div>

                      <div className="table-responsive" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {editableRoutine.exercises?.map((item: any, idx: number) => (
                          <div
                            key={item.id || idx}
                            style={{
                              minWidth: '540px',
                              padding: '0.85rem 1rem',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              display: 'grid',
                              gridTemplateColumns: '2fr 80px 100px 90px 2fr',
                              gap: '0.75rem',
                              alignItems: 'center',
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700 }}>
                                DÍA {item.dayNumber} • {item.exercise?.muscleGroup || 'MÚSCULO'}
                              </div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>
                                {item.exercise?.name || 'Ejercicio'}
                              </div>
                            </div>

                            {/* Series */}
                            <div>
                              <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Series</label>
                              <input
                                type="number"
                                min={1}
                                max={10}
                                value={item.sets}
                                onChange={(e) => {
                                  const updated = [...editableRoutine.exercises];
                                  updated[idx].sets = e.target.value;
                                  setEditableRoutine({ ...editableRoutine, exercises: updated });
                                }}
                                style={{
                                  width: '100%',
                                  padding: '0.4rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#1e293b',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  color: '#10b981',
                                  fontWeight: 700,
                                  fontSize: '0.85rem',
                                  textAlign: 'center',
                                }}
                              />
                            </div>

                            {/* Reps */}
                            <div>
                              <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Reps</label>
                              <input
                                type="text"
                                value={item.reps}
                                onChange={(e) => {
                                  const updated = [...editableRoutine.exercises];
                                  updated[idx].reps = e.target.value;
                                  setEditableRoutine({ ...editableRoutine, exercises: updated });
                                }}
                                style={{
                                  width: '100%',
                                  padding: '0.4rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#1e293b',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  fontSize: '0.85rem',
                                  textAlign: 'center',
                                }}
                              />
                            </div>

                            {/* Descanso */}
                            <div>
                              <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Pausa (seg)</label>
                              <input
                                type="number"
                                step={10}
                                value={item.restSeconds}
                                onChange={(e) => {
                                  const updated = [...editableRoutine.exercises];
                                  updated[idx].restSeconds = e.target.value;
                                  setEditableRoutine({ ...editableRoutine, exercises: updated });
                                }}
                                style={{
                                  width: '100%',
                                  padding: '0.4rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#1e293b',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  color: '#06b6d4',
                                  fontWeight: 700,
                                  fontSize: '0.85rem',
                                  textAlign: 'center',
                                }}
                              />
                            </div>

                            {/* Notas del Ejercicio */}
                            <div>
                              <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Nota técnica / Cadencia</label>
                              <input
                                type="text"
                                placeholder="Ej: RPE 8, tempo 3-0-1-0"
                                value={item.notes || ''}
                                onChange={(e) => {
                                  const updated = [...editableRoutine.exercises];
                                  updated[idx].notes = e.target.value;
                                  setEditableRoutine({ ...editableRoutine, exercises: updated });
                                }}
                                style={{
                                  width: '100%',
                                  padding: '0.4rem 0.6rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#1e293b',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  color: '#94a3b8',
                                  fontSize: '0.82rem',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Dumbbell size={36} color="#64748b" style={{ margin: '0 auto 1rem auto' }} />
                    <h4 style={{ color: '#f8fafc', fontSize: '1.05rem', margin: '0 0 0.5rem 0' }}>
                      Este atleta no tiene una rutina asignada activa.
                    </h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                      Usa el generador con Inteligencia Artificial arriba para crear una rutina personalizada (Gimnasio o En Casa) en segundos.
                    </p>
                    <button
                      onClick={handleGenerateRoutineAI}
                      style={{
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.65rem 1.25rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Sparkles size={16} />
                      <span>Generar Rutina con IA Ahora</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: NUTRICIÓN & DIETA IA */}
            {activeTab === 'NUTRITION' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Generador de Nutrición IA (Gemini 2.5 Flash) */}
                <div className="glass-card" style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Salad size={20} color="#06b6d4" />
                      <div>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                          Agente IA de Nutrición & Dietética (Google Gemini)
                        </span>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                          Calcula el gasto energético basal, reparto de macronutrientes y comidas diarias recomendadas.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <select
                        value={aiDietGoal}
                        onChange={(e) => setAiDietGoal(e.target.value)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#ffffff',
                          fontSize: '0.82rem',
                        }}
                      >
                        <option value="HYPERTROPHY">Superávit Calórico (Hipertrofia)</option>
                        <option value="FAT_LOSS">Déficit Calórico (Definición)</option>
                        <option value="MAINTENANCE">Mantenimiento Normocalórico</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Restricciones: ej. Sin lactosa, vegano..."
                        value={aiDietRestrictions}
                        onChange={(e) => setAiDietRestrictions(e.target.value)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#ffffff',
                          fontSize: '0.82rem',
                          minWidth: '220px',
                        }}
                      />

                      <button
                        onClick={handleGenerateNutritionAI}
                        disabled={generatingNutritionAI}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#06b6d4',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.55rem 1.1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          boxShadow: '0 0 14px rgba(6, 182, 212, 0.35)',
                        }}
                      >
                        <Sparkles size={16} />
                        <span>{generatingNutritionAI ? 'Gemini Calculando Macros...' : 'Generar Dieta con IA'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editor Directo del Plan Nutricional */}
                {editableNutrition ? (
                  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>
                            PLAN NUTRICIONAL PRESCRITO
                          </span>
                          {editableNutrition.reviewedByTrainer && (
                            <span style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}>
                              <CheckCircle2 size={11} /> Aprobado por Coach
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={editableNutrition.title || ''}
                          onChange={(e) => setEditableNutrition({ ...editableNutrition, title: e.target.value })}
                          style={{
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            color: '#ffffff',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '0.35rem 0.65rem',
                            marginTop: '4px',
                            minWidth: '320px',
                          }}
                        />
                      </div>

                      <button
                        onClick={handleSaveNutritionChanges}
                        disabled={savingNutrition}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#06b6d4',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.6rem 1.25rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 0 15px rgba(6, 182, 212, 0.35)',
                        }}
                      >
                        <Save size={16} />
                        <span>{savingNutrition ? 'Guardando...' : 'Guardar y Aprobar Nutrición'}</span>
                      </button>
                    </div>

                    {/* Macros Editables */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                      {/* Calorías */}
                      <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Calorías Diarias</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <input
                            type="number"
                            value={editableNutrition.targetCalories}
                            onChange={(e) => setEditableNutrition({ ...editableNutrition, targetCalories: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.35rem',
                              borderRadius: '6px',
                              backgroundColor: '#1e293b',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#f8fafc',
                              fontWeight: 800,
                              fontSize: '1.1rem',
                            }}
                          />
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>kcal</span>
                        </div>
                      </div>

                      {/* Proteínas */}
                      <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>Proteínas (g)</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <input
                            type="number"
                            value={editableNutrition.proteinGrams}
                            onChange={(e) => setEditableNutrition({ ...editableNutrition, proteinGrams: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.35rem',
                              borderRadius: '6px',
                              backgroundColor: '#1e293b',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              color: '#10b981',
                              fontWeight: 800,
                              fontSize: '1.1rem',
                            }}
                          />
                          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>g</span>
                        </div>
                      </div>

                      {/* Carbohidratos */}
                      <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                        <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700 }}>Carbohidratos (g)</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <input
                            type="number"
                            value={editableNutrition.carbsGrams}
                            onChange={(e) => setEditableNutrition({ ...editableNutrition, carbsGrams: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.35rem',
                              borderRadius: '6px',
                              backgroundColor: '#1e293b',
                              border: '1px solid rgba(6, 182, 212, 0.3)',
                              color: '#06b6d4',
                              fontWeight: 800,
                              fontSize: '1.1rem',
                            }}
                          />
                          <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>g</span>
                        </div>
                      </div>

                      {/* Grasas */}
                      <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700 }}>Grasas Saludables (g)</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <input
                            type="number"
                            value={editableNutrition.fatsGrams}
                            onChange={(e) => setEditableNutrition({ ...editableNutrition, fatsGrams: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.35rem',
                              borderRadius: '6px',
                              backgroundColor: '#1e293b',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              color: '#f59e0b',
                              fontWeight: 800,
                              fontSize: '1.1rem',
                            }}
                          />
                          <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>g</span>
                        </div>
                      </div>
                    </div>

                    {/* Notas del Coach */}
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                        Recomendaciones y Notas del Entrenador:
                      </label>
                      <textarea
                        rows={2}
                        value={editableNutrition.trainerNotes || ''}
                        onChange={(e) => setEditableNutrition({ ...editableNutrition, trainerNotes: e.target.value })}
                        placeholder="Indicaciones para el atleta sobre hidratación, tiempos de ingesta pre/post entreno..."
                        style={{
                          width: '100%',
                          marginTop: '4px',
                          padding: '0.65rem',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#ffffff',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Comidas Diarias */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                        Estructura de Comidas ({editableNutrition.meals?.length || 0})
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                        {editableNutrition.meals?.map((mItem: MealItem, mIdx: number) => (
                          <div
                            key={mIdx}
                            style={{
                              padding: '1rem',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>
                                {mItem.meal}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                                ~{mItem.calories} kcal
                              </span>
                            </div>

                            <input
                              type="text"
                              value={mItem.title || ''}
                              onChange={(e) => {
                                const updatedMeals = [...editableNutrition.meals];
                                updatedMeals[mIdx].title = e.target.value;
                                setEditableNutrition({ ...editableNutrition, meals: updatedMeals });
                              }}
                              style={{
                                width: '100%',
                                padding: '0.4rem',
                                borderRadius: '6px',
                                backgroundColor: '#1e293b',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                              }}
                            />

                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              Alimentos sugeridos:
                              <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.2rem', color: '#cbd5e1' }}>
                                {mItem.items?.map((it, itIdx) => (
                                  <li key={itIdx}>{it}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Salad size={36} color="#64748b" style={{ margin: '0 auto 1rem auto' }} />
                    <h4 style={{ color: '#f8fafc', fontSize: '1.05rem', margin: '0 0 0.5rem 0' }}>
                      Este atleta no tiene un plan de nutrición registrado.
                    </h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                      Presiona "Generar Dieta con IA" arriba para que Google Gemini 2.5 Flash calcule sus macros y menú personalizado según sus datos antropométricos.
                    </p>
                    <button
                      onClick={handleGenerateNutritionAI}
                      style={{
                        backgroundColor: '#06b6d4',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.65rem 1.25rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Sparkles size={16} />
                      <span>Generar Plan Nutricional con IA</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Users size={40} color="#64748b" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Selecciona un Atleta</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Elige a un socio de la lista izquierda para supervisar y editar su rutina de entrenamiento y plan nutricional.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
