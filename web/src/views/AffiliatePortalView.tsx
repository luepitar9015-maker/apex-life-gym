import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Dumbbell,
  Calendar,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  CreditCard,
  User,
  Activity,
  Printer,
  ChevronRight,
  Salad,
  Flame,
  CheckCircle2,
  Apple,
  Scale,
  HeartPulse,
  AlertTriangle,
  Save,
  Check,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { api, Member, Routine, NutritionPlan, MealItem, HealthDiagnostic, DAYS_OF_WEEK, getDayName, getTodayDayNumber } from '../services/api';

// Generador de alertas sonoras nativas Web Audio API para el cronómetro del socio
const playBeep = (freq = 880, duration = 0.25) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silencioso si no hay soporte de audio
  }
};

export const AffiliatePortalView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [nutrition, setNutrition] = useState<NutritionPlan | null>(null);
  const [diagnostic, setDiagnostic] = useState<HealthDiagnostic | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'CARNET' | 'ROUTINE' | 'DIAGNOSTIC' | 'NUTRITION'>('CARNET');

  // Filtro de día de la semana (por defecto HOY: Lunes = 1 .. Domingo = 7)
  const [selectedWeekDay, setSelectedWeekDay] = useState<number | 'ALL'>(() => getTodayDayNumber());

  // Estados de la APK: Seguimiento de Rutina
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('gym_completed_exercises');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [exerciseLoads, setExerciseLoads] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('gym_exercise_loads');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Estados de Registro Rápido de Pesaje en Gym
  const [newWeight, setNewWeight] = useState('');
  const [savingWeight, setSavingWeight] = useState(false);
  const [weightSavedSuccess, setWeightSavedSuccess] = useState(false);

  // Generador Nutrición IA
  const [generatingNutrition, setGeneratingNutrition] = useState(false);

  // Cronómetro interactivo de descanso de series
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Identificar usuario activo desde sesión
  const currentUser = (() => {
    try {
      const saved = localStorage.getItem('gym_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();
  const isMemberRole = currentUser?.role === 'MEMBER';

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      setLoading(true);
      const membersList = await api.getMembers();
      setMembers(membersList);

      if (membersList.length > 0) {
        let targetId = membersList[0].id;
        // Si el usuario conectado es socio, buscar su registro por ID o documento
        if (isMemberRole && currentUser) {
          const found = membersList.find(
            (m) => m.id === currentUser.id || m.documentNumber === currentUser.documentNumber
          );
          if (found) targetId = found.id;
        } else {
          const activeMember = membersList.find((m) => m.status === 'ACTIVE') || membersList[0];
          targetId = activeMember.id;
        }
        await handleSelectMember(targetId);
      }
    } catch (err) {
      console.error('Error cargando portal afiliado:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMember = async (id: string) => {
    try {
      setLoading(true);
      const full = await api.getMemberById(id);
      setCurrentMember(full);
      setNewWeight(full.weight ? String(full.weight) : '');

      // 1. Cargar Rutina Asignada
      if (full.routines && full.routines.length > 0) {
        const activeRoutine = full.routines.find((r: any) => r.active) || full.routines[0];
        setRoutine(activeRoutine.routine);
      } else {
        const generalRoutines = await api.getRoutines();
        if (generalRoutines.length > 0) setRoutine(generalRoutines[0]);
      }

      // 2. Cargar Nutrición IA
      const nutPlan = await api.getMemberNutrition(id);
      setNutrition(nutPlan);

      // 3. Cargar Diagnóstico Antropométrico
      const diag = await api.getMemberDiagnostic(id);
      setDiagnostic(diag);
    } catch (err) {
      console.error('Error al seleccionar socio:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle de ejercicio completado en la APK
  const toggleExerciseComplete = (exerciseId: string) => {
    const updated = { ...completedExercises, [exerciseId]: !completedExercises[exerciseId] };
    setCompletedExercises(updated);
    localStorage.setItem('gym_completed_exercises', JSON.stringify(updated));
    if (updated[exerciseId]) {
      playBeep(659, 0.12);
    }
  };

  // Guardar carga utilizada en el ejercicio
  const handleSaveLoad = (exerciseId: string, value: string) => {
    const updated = { ...exerciseLoads, [exerciseId]: value };
    setExerciseLoads(updated);
    localStorage.setItem('gym_exercise_loads', JSON.stringify(updated));
  };

  // Registro de Pesaje en la Báscula del Gimnasio
  const handleSaveNewWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember || !newWeight) return;

    try {
      setSavingWeight(true);
      const numericWeight = parseFloat(newWeight);
      if (isNaN(numericWeight) || numericWeight <= 20 || numericWeight > 300) {
        alert('Por favor ingresa un peso válido en kilogramos');
        return;
      }

      // Actualizar peso en el socio y re-calcular diagnóstico biométrico
      await api.updateMember(currentMember.id, { weight: numericWeight });
      await api.generateHealthDiagnosticAI({
        memberId: currentMember.id,
        weight: numericWeight,
        height: currentMember.height || 1.75,
        targetGoal: diagnostic?.targetGoal || 'Evolución y Acondicionamiento Físico',
      });

      // Recargar datos
      await handleSelectMember(currentMember.id);
      setWeightSavedSuccess(true);
      playBeep(880, 0.2);
      setTimeout(() => setWeightSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar peso');
    } finally {
      setSavingWeight(false);
    }
  };

  const handleGenerateAffiliateNutrition = async () => {
    if (!currentMember) return;
    try {
      setGeneratingNutrition(true);
      const res = await api.generateNutritionAI({
        memberId: currentMember.id,
        goal: diagnostic?.targetGoal || 'HYPERTROPHY',
        dietaryRestrictions: 'Adaptado al plan de entrenamiento',
        trainingDaysPerWeek: 4,
      });
      setNutrition(res.data);
      alert('🥗 ¡Tu plan nutricional ha sido recalculado con Google Gemini 2.5 Flash!');
    } catch (err: any) {
      alert(err.message || 'Error al generar nutrición con IA');
    } finally {
      setGeneratingNutrition(false);
    }
  };

  // Timer Effect con alarma sonora
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      playBeep(880, 0.4);
      setTimeout(() => playBeep(1174, 0.4), 250);
      alert('⏰ ¡Fin del descanso! Inicia tu siguiente serie con máxima intensidad.');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  if (loading && !currentMember) {
    return <div style={{ color: '#94a3b8', textAlign: 'center', padding: '3rem' }}>Cargando APK del socio...</div>;
  }

  const isExpired = currentMember?.status === 'EXPIRED';
  const daysLeft = currentMember?.planEndDate
    ? Math.ceil((new Date(currentMember.planEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Cálculo de IMC para visualización
  const currentHeightMeters = currentMember?.height ? (currentMember.height > 3 ? currentMember.height / 100 : currentMember.height) : 1.75;
  const currentWeightKg = currentMember?.weight || 70;
  const calculatedBmi = diagnostic?.bmi || parseFloat((currentWeightKg / (currentHeightMeters * currentHeightMeters)).toFixed(1));

  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Bajo Peso', color: '#38bdf8' };
    if (bmi < 25) return { label: 'Peso Saludable', color: '#10b981' };
    if (bmi < 30) return { label: 'Sobrepeso Leve', color: '#f59e0b' };
    return { label: 'Obesidad', color: '#ef4444' };
  };
  const bmiInfo = getBmiStatus(calculatedBmi);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1080px', margin: '0 auto' }}>
      {/* Selector de Socio solo visible para administradores y entrenadores */}
      {!isMemberRole && (
        <div className="glass-card" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.85rem 1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} color="#06b6d4" />
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              Simulador APK Móvil de Socio (Modo Administrador/Coach):
            </span>
          </div>

          <select
            value={currentMember?.id || ''}
            onChange={(e) => handleSelectMember(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              fontWeight: 600,
              fontSize: '0.85rem',
              outline: 'none',
            }}
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.firstName} {m.lastName} ({m.code} - {m.status === 'ACTIVE' ? '🟢 Activo' : '🔴 Vencido'})
              </option>
            ))}
          </select>
        </div>
      )}

      {currentMember && (
        <>
          {/* BARRA DE NAVEGACIÓN PRINCIPAL DE LA APK MÓVIL */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.65rem',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            padding: '0.5rem',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <button
              onClick={() => setActiveTab('CARNET')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'CARNET' ? '#06b6d4' : 'transparent',
                color: activeTab === 'CARNET' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <QrCode size={18} />
              <span>Carnet QR</span>
            </button>

            <button
              onClick={() => setActiveTab('ROUTINE')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'ROUTINE' ? '#10b981' : 'transparent',
                color: activeTab === 'ROUTINE' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Dumbbell size={18} />
              <span>Mi Rutina</span>
            </button>

            <button
              onClick={() => setActiveTab('DIAGNOSTIC')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'DIAGNOSTIC' ? '#8b5cf6' : 'transparent',
                color: activeTab === 'DIAGNOSTIC' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Scale size={18} />
              <span>Diagnóstico & IMC</span>
            </button>

            <button
              onClick={() => setActiveTab('NUTRITION')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'NUTRITION' ? '#f59e0b' : 'transparent',
                color: activeTab === 'NUTRITION' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Salad size={18} />
              <span>Nutrición IA</span>
            </button>
          </div>

          {/* TAB 1: CARNET VIRTUAL OFICIAL DE ACCESO */}
          {activeTab === 'CARNET' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0b1329 0%, #06242a 100%)',
                border: '2px solid rgba(6, 182, 212, 0.4)',
                borderRadius: '20px',
                padding: 'clamp(1.25rem, 4vw, 2.25rem)',
                color: '#ffffff',
                boxShadow: '0 0 35px rgba(6, 182, 212, 0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#06b6d4', fontWeight: 800, textTransform: 'uppercase' }}>
                      APEX LIFE GYM • CARNET VIRTUAL DE SOCIO
                    </span>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '6px 0 0 0', letterSpacing: '-0.02em' }}>
                      {currentMember.firstName} {currentMember.lastName}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
                      Doc. Identidad: {currentMember.documentType} {currentMember.documentNumber}
                    </p>
                  </div>

                  <div style={{
                    padding: '6px 14px',
                    borderRadius: '10px',
                    backgroundColor: isExpired ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: isExpired ? '#ef4444' : '#10b981',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    border: `1px solid ${isExpired ? '#ef4444' : '#10b981'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isExpired ? '#ef4444' : '#10b981' }} />
                    <span>{isExpired ? 'MEMBRESÍA EXPIRADA' : 'MEMBRESÍA ACTIVA'}</span>
                  </div>
                </div>

                {/* Código QR y Datos del Plan */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Plan Contratado: </span>
                      <strong style={{ color: '#f8fafc' }}>{currentMember.currentPlan?.name || 'Membresía Completa'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Código de Acceso: </span>
                      <strong style={{ color: '#06b6d4', letterSpacing: '0.05em' }}>{currentMember.code}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Fecha de Vencimiento: </span>
                      <strong style={{ color: isExpired ? '#ef4444' : '#10b981' }}>
                        {currentMember.planEndDate ? new Date(currentMember.planEndDate).toLocaleDateString() : '--'}
                        {!isExpired && daysLeft > 0 && ` (${daysLeft} días restantes)`}
                      </strong>
                    </div>
                  </div>

                  {/* QR Virtual Listo para Torniquete */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  }}>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      background: 'repeating-linear-gradient(0deg, #000 0, #000 3px, #fff 3px, #fff 6px), repeating-linear-gradient(90deg, #000 0, #000 3px, #fff 3px, #fff 6px)',
                      borderRadius: '4px',
                    }} />
                    <span style={{ fontSize: '0.75rem', color: '#000000', fontWeight: 800, marginTop: '6px' }}>
                      {currentMember.code}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600 }}>
                      ESCANEAR EN ENTRADA
                    </span>
                  </div>
                </div>
              </div>

              {/* Historial de Asistencias del Socio */}
              <div className="glass-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.85rem' }}>
                  Mis Asistencias Recientes al Gimnasio
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentMember.checkIns && currentMember.checkIns.length > 0 ? (
                    currentMember.checkIns.slice(0, 5).map((ci) => (
                      <div
                        key={ci.id}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem',
                        }}
                      >
                        <span style={{ color: '#f1f5f9', fontWeight: 600 }}>
                          Entrenamiento en Sala ({ci.zone})
                        </span>
                        <span style={{ color: '#94a3b8' }}>
                          {new Date(ci.checkInTime).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.82rem', color: '#64748b' }}>No tienes registros de asistencia recientes.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RUTINA DE ENTRENAMIENTO DIARIA & SEGUIMIENTO DE CARGAS */}
          {activeTab === 'ROUTINE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Dumbbell size={22} color="#10b981" />
                      <span>{routine?.name || 'Rutina Diaria de Entrenamiento'}</span>
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                      Meta: <strong style={{ color: '#10b981' }}>{routine?.goal || 'Acondicionamiento & Fuerza'}</strong> • Supervisada por tu entrenador en sala
                    </p>
                  </div>

                  {/* Cronómetro de Descanso entre Series */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.45rem 0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    <Clock size={16} color="#10b981" />
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>DESCANSO:</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                      00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                    </span>
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      style={{
                        backgroundColor: timerRunning ? '#f59e0b' : '#10b981',
                        border: 'none',
                        color: '#ffffff',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {timerRunning ? 'Pausa' : 'Iniciar'}
                    </button>
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSeconds(60);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                      }}
                      title="Reiniciar a 60 segundos"
                    >
                      <RotateCcw size={15} />
                    </button>
                  </div>
                </div>

                {/* Selector de Días de la Semana */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '1.25rem' }}>
                  <button
                    onClick={() => setSelectedWeekDay('ALL')}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: selectedWeekDay === 'ALL' ? '#10b981' : 'rgba(255,255,255,0.06)',
                      color: selectedWeekDay === 'ALL' ? '#ffffff' : '#94a3b8',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Semana Completa
                  </button>
                  {DAYS_OF_WEEK.map((d) => {
                    const isToday = d.id === getTodayDayNumber();
                    const isSelected = selectedWeekDay === d.id;
                    const dayExercises = routine?.exercises?.filter((ex) => ex.dayNumber === d.id) || [];
                    const hasExercises = dayExercises.length > 0;

                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedWeekDay(d.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          border: isSelected
                            ? '1px solid #10b981'
                            : isToday
                            ? '1px solid rgba(6, 182, 212, 0.6)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          backgroundColor: isSelected
                            ? '#10b981'
                            : isToday
                            ? 'rgba(6, 182, 212, 0.12)'
                            : 'rgba(255, 255, 255, 0.03)',
                          color: isSelected ? '#ffffff' : isToday ? '#06b6d4' : '#cbd5e1',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span>{d.name}</span>
                        {isToday && (
                          <span style={{
                            fontSize: '0.62rem',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            backgroundColor: isSelected ? 'rgba(0,0,0,0.3)' : '#06b6d4',
                            color: '#ffffff',
                            fontWeight: 800,
                          }}>
                            HOY
                          </span>
                        )}
                        {hasExercises && !isToday && (
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? '#ffffff' : '#10b981',
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Lista de Ejercicios Interactiva */}
                {(() => {
                  const filteredExercises = routine?.exercises
                    ? routine.exercises.filter((item) => {
                        if (selectedWeekDay === 'ALL') return true;
                        return item.dayNumber === selectedWeekDay;
                      })
                    : [];

                  if (filteredExercises.length === 0 && selectedWeekDay !== 'ALL') {
                    return (
                      <div style={{
                        padding: '2.5rem 1.5rem',
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '16px',
                        border: '1px dashed rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#10b981',
                        }}>
                          <Flame size={28} />
                        </div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                          Día de Descanso y Recuperación Activa ({getDayName(selectedWeekDay)})
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '480px', margin: 0 }}>
                          No tienes sesiones de pesas programadas para {getDayName(selectedWeekDay).toLowerCase()}. Aprovecha para descansar tus fibras musculares, hidratarte con electrolitos y realizar caminata suave o estiramientos.
                        </p>
                        <button
                          onClick={() => setSelectedWeekDay('ALL')}
                          style={{
                            marginTop: '0.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#f1f5f9',
                            padding: '0.45rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Ver Toda la Rutina Semanal
                        </button>
                      </div>
                    );
                  }

                  if (filteredExercises.length === 0) {
                    return (
                      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Tu entrenador en sala estará asignando tus ejercicios específicos.</p>
                    );
                  }

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                      {filteredExercises.map((item) => {
                        const isDone = completedExercises[item.id] || false;
                        const userLoad = exerciseLoads[item.id] || '';

                        return (
                          <div
                            key={item.id}
                            style={{
                              padding: '1.1rem',
                              borderRadius: '12px',
                              backgroundColor: isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                              border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                  fontSize: '0.7rem',
                                  padding: '2px 7px',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(6, 182, 212, 0.15)',
                                  color: '#06b6d4',
                                  fontWeight: 800,
                                }}>
                                  {getDayName(item.dayNumber)}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                                  • {item.exercise.muscleGroup}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                {item.restSeconds}s descanso
                              </span>
                            </div>

                            <div style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: isDone ? '#10b981' : '#f1f5f9',
                              textDecoration: isDone ? 'line-through' : 'none',
                            }}>
                              {item.exercise.name}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                              <span style={{ color: '#94a3b8' }}>Series: <strong style={{ color: '#10b981' }}>{item.sets}</strong></span>
                              <span style={{ color: '#94a3b8' }}>Reps: <strong style={{ color: '#10b981' }}>{item.reps}</strong></span>
                            </div>

                            {/* Campo de Registro de Cargas (Kilos/Libras) */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Carga hoy:</span>
                              <input
                                type="text"
                                placeholder="Ej: 50 kg"
                                value={userLoad}
                                onChange={(e) => handleSaveLoad(item.id, e.target.value)}
                                style={{
                                  width: '90px',
                                  padding: '0.3rem 0.5rem',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.12)',
                                  color: '#f8fafc',
                                  fontSize: '0.78rem',
                                  outline: 'none',
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => toggleExerciseComplete(item.id)}
                                style={{
                                  marginLeft: 'auto',
                                  backgroundColor: isDone ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                                  color: isDone ? '#ffffff' : '#94a3b8',
                                  border: isDone ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: '6px',
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {isDone ? <Check size={14} /> : null}
                                <span>{isDone ? '¡Hecho!' : 'Marcar'}</span>
                              </button>
                            </div>

                            {item.notes && (
                              <span style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                                Nota: {item.notes}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 3: DIAGNÓSTICO FÍSICO, IMC & EVOLUCIÓN ANTROPOMÉTRICA */}
          {activeTab === 'DIAGNOSTIC' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Tarjeta de Registro de Pesaje en Gym */}
              <div className="glass-card" style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Scale size={22} color="#8b5cf6" />
                      <span>Control de Pesaje & Ficha Antropométrica</span>
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                      Pésate en la báscula de tu sede y registra tu evolución para que tu entrenador ajuste tus cargas y nutrición.
                    </p>
                  </div>

                  {weightSavedSuccess && (
                    <span style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}>
                      ✅ ¡Pesaje registrado y sincronizado con tu entrenador!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveNewWeight} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 600 }}>Mi Peso Hoy:</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Ej: 74.5"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      style={{
                        width: '110px',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#f8fafc',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        outline: 'none',
                      }}
                    />
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>kg</span>
                  </div>

                  <button
                    type="submit"
                    disabled={savingWeight}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#8b5cf6',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.55rem 1.25rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(139, 92, 246, 0.35)',
                    }}
                  >
                    <Save size={16} />
                    <span>{savingWeight ? 'Guardando...' : 'Registrar Nuevo Peso'}</span>
                  </button>
                </form>
              </div>

              {/* Indicadores de Composición Corporal */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                {/* IMC */}
                <div className="glass-card" style={{ padding: '1rem', borderLeft: `4px solid ${bmiInfo.color}` }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Índice de Masa Corporal (IMC)</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: bmiInfo.color, marginTop: '4px' }}>
                    {calculatedBmi}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: bmiInfo.color, fontWeight: 700 }}>
                    {bmiInfo.label}
                  </div>
                </div>

                {/* Peso Actual */}
                <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Peso Registrado</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                    {currentMember.weight || 70} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>kg</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Estatura: {currentHeightMeters} m
                  </div>
                </div>

                {/* % Grasa Corporal */}
                <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>% Grasa Corporal Estimada</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                    {diagnostic?.bodyFatPercentage ? `${diagnostic.bodyFatPercentage}%` : '18.5%'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Evaluación clínica IA
                  </div>
                </div>

                {/* Biotipo */}
                <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #06b6d4' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Biotipo / Somatotipo</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginTop: '6px' }}>
                    {diagnostic?.biotype || 'Mesomorfo'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Estructura metabólica
                  </div>
                </div>
              </div>

              {/* Alerta de Seguridad y Ejercicios Prohibidos */}
              {diagnostic?.prohibitedExercises && (
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ef4444', margin: 0 }}>
                      Seguridad y Ejercicios Contraindicados
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#f8fafc', margin: '4px 0 0 0' }}>
                      {diagnostic.prohibitedExercises}
                    </p>
                  </div>
                </div>
              )}

              {/* Resumen Clínico del Entrenador */}
              <div className="glass-card">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  Recomendaciones del Entrenador en Sala
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                  {diagnostic?.recommendedActions ||
                    'Mantén la progresión de cargas con buena técnica postural. Tu entrenador en sala supervisará tu evolución cada semana.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PLAN NUTRICIONAL IA & MACROS */}
          {activeTab === 'NUTRITION' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card" style={{
                border: '1px solid rgba(6, 182, 212, 0.25)',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(16, 185, 129, 0.03) 100%)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Salad size={22} color="#06b6d4" />
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        Mi Plan Nutricional & Macros IA
                      </h3>
                      {nutrition?.reviewedByTrainer && (
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
                          <CheckCircle2 size={12} /> Aprobado por Entrenador
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
                      {nutrition?.title || 'Nutrición personalizada optimizada para tu rendimiento deportivo'}
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateAffiliateNutrition}
                    disabled={generatingNutrition}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#06b6d4',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      boxShadow: '0 0 12px rgba(6, 182, 212, 0.3)',
                    }}
                  >
                    <Sparkles size={14} />
                    <span>{generatingNutrition ? 'Gemini Calculando...' : 'Re-Calcular Macros con IA'}</span>
                  </button>
                </div>

                {nutrition ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Cuadros de Macronutrientes */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                      {/* Calorías */}
                      <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Meta Calórica Diaria</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                          {nutrition.targetCalories} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>kcal</span>
                        </div>
                      </div>

                      {/* Proteínas */}
                      <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                        <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>Proteínas</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                          {nutrition.proteinGrams}g
                        </div>
                      </div>

                      {/* Carbohidratos */}
                      <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                        <div style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700 }}>Carbohidratos</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginTop: '2px' }}>
                          {nutrition.carbsGrams}g
                        </div>
                      </div>

                      {/* Grasas */}
                      <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                        <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700 }}>Grasas Saludables</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                          {nutrition.fatsGrams}g
                        </div>
                      </div>
                    </div>

                    {/* Comidas del Día */}
                    {nutrition.meals && nutrition.meals.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                        {nutrition.meals.map((m, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '0.85rem 1rem',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.35rem',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>
                                {m.meal}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                                {m.calories} kcal
                              </span>
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>
                              {m.title}
                            </div>
                            <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                              {m.items?.map((it, iIdx) => (
                                <li key={iIdx}>{it}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                      Aún no tienes un plan nutricional asignado. Presiona el botón para calcular tus macros con Google Gemini 2.5 Flash.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
