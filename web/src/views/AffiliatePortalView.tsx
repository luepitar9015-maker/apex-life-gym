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
} from 'lucide-react';
import { api, Member, Routine, NutritionPlan, MealItem } from '../services/api';

export const AffiliatePortalView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [nutrition, setNutrition] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingNutrition, setGeneratingNutrition] = useState(false);

  // Cronómetro del socio
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      setLoading(true);
      const membersList = await api.getMembers();
      setMembers(membersList);

      if (membersList.length > 0) {
        const activeMember = membersList.find((m) => m.status === 'ACTIVE') || membersList[0];
        await handleSelectMember(activeMember.id);
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

      // Cargar Rutina
      if (full.routines && full.routines.length > 0) {
        const activeRoutine = full.routines.find((r: any) => r.active) || full.routines[0];
        setRoutine(activeRoutine.routine);
      } else {
        const generalRoutines = await api.getRoutines();
        if (generalRoutines.length > 0) setRoutine(generalRoutines[0]);
      }

      // Cargar Nutrición
      const nutPlan = await api.getMemberNutrition(id);
      setNutrition(nutPlan);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAffiliateNutrition = async () => {
    if (!currentMember) return;
    try {
      setGeneratingNutrition(true);
      const res = await api.generateNutritionAI({
        memberId: currentMember.id,
        goal: 'HYPERTROPHY',
        dietaryRestrictions: 'Adaptado al plan de entrenamiento',
        trainingDaysPerWeek: 4,
      });
      setNutrition(res.data);
      alert('🥗 ¡Tu plan nutricional ha sido formulado por APEX AI con Google Gemini!');
    } catch (err: any) {
      alert(err.message || 'Error al generar nutrición con IA');
    } finally {
      setGeneratingNutrition(false);
    }
  };

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      alert('⏰ ¡Fin del descanso! Inicia tu siguiente serie.');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  if (loading && !currentMember) {
    return <div style={{ color: '#94a3b8', textAlign: 'center', padding: '3rem' }}>Cargando portal del socio...</div>;
  }

  const isExpired = currentMember?.status === 'EXPIRED';
  const daysLeft = currentMember?.planEndDate
    ? Math.ceil((new Date(currentMember.planEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1050px', margin: '0 auto' }}>
      {/* Selector de Socio para Simulación de Afiliado */}
      <div className="glass-card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.85rem 1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="#06b6d4" />
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
            Visualizando Portal como Afiliado:
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

      {currentMember && (
        <>
          {/* Carnet Digital Oficial del Afiliado */}
          <div style={{
            background: 'linear-gradient(135deg, #0b1329 0%, #06242a 100%)',
            border: '2px solid rgba(6, 182, 212, 0.4)',
            borderRadius: '20px',
            padding: 'clamp(1rem, 4vw, 2rem)',
            color: '#ffffff',
            boxShadow: '0 0 35px rgba(6, 182, 212, 0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#06b6d4', fontWeight: 800, textTransform: 'uppercase' }}>
                  APEX GYM • CARNET VIRTUAL DE SOCIO
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
                  <strong style={{ color: '#f8fafc' }}>{currentMember.currentPlan?.name || 'Pase Regular'}</strong>
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
                padding: '10px 14px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  background: 'repeating-linear-gradient(0deg, #000 0, #000 3px, #fff 3px, #fff 6px), repeating-linear-gradient(90deg, #000 0, #000 3px, #fff 3px, #fff 6px)',
                  borderRadius: '4px',
                }} />
                <span style={{ fontSize: '0.72rem', color: '#000000', fontWeight: 800, marginTop: '5px' }}>
                  {currentMember.code}
                </span>
                <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600 }}>
                  ESCANEAR EN ENTRADA
                </span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 1: PLAN NUTRICIONAL IA & MACROS */}
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

                {/* Notas del Entrenador */}
                {nutrition.trainerNotes && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.82rem',
                    color: '#94a3b8',
                  }}>
                    <strong style={{ color: '#06b6d4' }}>Indicaciones del Entrenador: </strong>
                    {nutrition.trainerNotes}
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

          {/* SECCIÓN 2: RUTINA DE ENTRENAMIENTO ASIGNADA */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Dumbbell size={22} color="#10b981" />
                  <span>Mi Rutina de Entrenamiento</span>
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  {routine?.name || 'Rutina General de Acondicionamiento'} • Meta: {routine?.goal || 'HIPERTROFIA'}
                </p>
              </div>

              {/* Mini Cronómetro de Descanso para el Socio */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.45rem 0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>DESCANSO:</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                  00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                </span>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  style={{
                    backgroundColor: timerRunning ? '#f59e0b' : '#10b981',
                    border: 'none',
                    color: '#ffffff',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '5px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {timerRunning ? 'Pausa' : 'Start'}
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
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            {/* Ejercicios del Plan */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
              {routine?.exercises && routine.exercises.length > 0 ? (
                routine.exercises.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700 }}>
                        Día {item.dayNumber} • {item.exercise.location === 'HOME' ? '🏡 Casa' : '🏋️ Gym'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {item.restSeconds}s descanso
                      </span>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>
                      {item.exercise.name}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '4px' }}>
                      <span style={{ color: '#94a3b8' }}>Series: <strong style={{ color: '#10b981' }}>{item.sets}</strong></span>
                      <span style={{ color: '#94a3b8' }}>Reps: <strong style={{ color: '#10b981' }}>{item.reps}</strong></span>
                    </div>

                    {item.notes && (
                      <span style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                        {item.notes}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Tu entrenador aún no ha cargado ejercicios específicos.</p>
              )}
            </div>
          </div>

          {/* Historial de Asistencias del Socio */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.85rem' }}>
              Mis Asistencias Recientes
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
        </>
      )}
    </div>
  );
};
