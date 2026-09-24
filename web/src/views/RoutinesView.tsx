import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Sparkles, 
  Building2, 
  Home, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Clock, 
  Flame, 
  ShieldCheck, 
  MapPin, 
  Zap, 
  Info,
  Layers,
  ArrowRightLeft,
  X
} from 'lucide-react';
import { 
  fetchGymLocations, 
  generateRoutineAI, 
  GymLocation, 
  GeneratedRoutineResult, 
  RoutineExercisePlan 
} from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface RoutinesViewProps {
  currentTheme?: ColorTheme;
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({ currentTheme = getSavedTheme() }) => {
  // Estado de catálogo de gimnasios / ubicaciones
  const [gymLocations, setGymLocations] = useState<GymLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Parámetros de configuración por IA
  const [level, setLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [goal, setGoal] = useState<'HYPERTROPHY' | 'FAT_LOSS' | 'STRENGTH' | 'TONING_CORE' | 'ENDURANCE'>('HYPERTROPHY');
  const [environment, setEnvironment] = useState<'GYM' | 'HOME'>('GYM');
  const [selectedGymId, setSelectedGymId] = useState<string>('gym-central-vip');
  
  // Estado del generador IA
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [generatedRoutine, setGeneratedRoutine] = useState<GeneratedRoutineResult | null>(null);
  const [activeDay, setActiveDay] = useState(1);

  // Modal de técnica / alternativa
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<RoutineExercisePlan | null>(null);
  const [showAlternativeNote, setShowAlternativeNote] = useState<string | null>(null);

  // Cargar sedes y generar rutina inicial
  useEffect(() => {
    fetchGymLocations().then((locations) => {
      setGymLocations(locations);
      setLoadingLocations(false);

      // Generar primera rutina inteligente por defecto
      handleGenerateRoutine('gym-central-vip', 'INTERMEDIATE', 'HYPERTROPHY', 'GYM');
    });
  }, []);

  const handleGenerateRoutine = async (
    gymId = selectedGymId,
    lvl = level,
    gl = goal,
    env = environment
  ) => {
    setIsGenerating(true);
    try {
      const routine = await generateRoutineAI({
        level: lvl,
        goal: gl,
        environment: env,
        gymLocationId: env === 'HOME' ? 'home-workout' : gymId,
        daysPerWeek: 3,
      });
      setGeneratedRoutine(routine);
      setActiveDay(1);
    } catch (e) {
      console.error('Error generando rutina con IA:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeGym = gymLocations.find((g) => g.id === (environment === 'HOME' ? 'home-workout' : selectedGymId)) || gymLocations[0];
  const currentDayPlan = generatedRoutine?.days.find((d) => d.dayNumber === activeDay) || generatedRoutine?.days[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER ESTILO NEXO: VIBRANTE CON ACCIÓN DE IA */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        background: currentTheme.bannerGradient,
        borderRadius: '18px',
        padding: '2.5rem 3rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: `0 14px 40px ${currentTheme.primaryGlow}`,
      }}>
        {/* Patrón geométrico diagonal */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.22,
          backgroundImage: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(225deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(315deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(45deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%)
          `,
          backgroundSize: '90px 90px',
          backgroundPosition: '0 0, 45px 0, 45px -45px, 0px 45px',
          pointerEvents: 'none',
        }} />

        {/* Marca de agua translúcida gigante */}
        <div style={{
          position: 'absolute',
          right: '340px',
          bottom: '-30px',
          fontSize: '7.5rem',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.12)',
          letterSpacing: '-0.05em',
          userSelect: 'none',
          pointerEvents: 'none',
          fontStyle: 'italic',
        }}>
          ROUTINE-AI
        </div>

        {/* Texto de la Izquierda */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{
              background: '#000000',
              color: currentTheme.primary,
              fontWeight: 900,
              fontSize: '0.72rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Sparkles size={12} /> CONFIGURADOR DE RUTINAS CON IA
            </span>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '0.82rem', fontWeight: 800 }}>
              {environment === 'HOME' ? '🏠 Modalidad En Casa' : `🏢 Sede: ${activeGym?.name || 'Gimnasio'}`}
            </span>
          </div>

          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 900,
            color: '#070a12',
            margin: '0.2rem 0',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
          }}>
            RUTINAS ADAPTADAS AL <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>EQUIPAMIENTO DE TU GYM</span>
          </h1>

          <p style={{
            color: 'rgba(7, 10, 18, 0.9)',
            fontSize: '0.92rem',
            fontWeight: 600,
            margin: '0.4rem 0 0 0',
            lineHeight: 1.4,
          }}>
            La Inteligencia Artificial adapta los ejercicios, series y descansos según tu nivel (básico, medio, avanzado), tu objetivo y las <strong>máquinas reales disponibles en la sede donde estés</strong> o en casa.
          </p>
        </div>

        {/* Status Card Flotante de la Derecha (Estilo Nexo) */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(7, 10, 18, 0.88)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          color: '#ffffff',
          minWidth: '310px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentTheme.primary, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} /> Máquinas Verificadas en Sede
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              color: '#94a3b8',
            }}>
              {level === 'BEGINNER' ? 'Nivel Básico' : level === 'INTERMEDIATE' ? 'Nivel Medio' : 'Nivel Avanzado'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Equipamiento Activo
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
              {activeGym ? activeGym.availableMachines.length : 0} Estaciones <span style={{ fontSize: '0.82rem', color: currentTheme.primary }}>(100% Compatibles)</span>
            </span>
          </div>

          <div style={{
            height: '7px',
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '0.85rem',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: currentTheme.primary,
              boxShadow: `0 0 10px ${currentTheme.primary}`,
              borderRadius: '999px',
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Objetivo Actual
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: currentTheme.primary, marginTop: '2px' }}>
                {goal === 'HYPERTROPHY' ? 'Hipertrofia' : goal === 'FAT_LOSS' ? 'Definición' : goal === 'STRENGTH' ? 'Fuerza' : goal === 'TONING_CORE' ? 'Tonificación' : 'Resistencia'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Ubicación
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {environment === 'HOME' ? 'En Casa' : activeGym?.name.split('-')[0].trim()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PANEL CONFIGURADOR INTELIGENTE CON IA */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.5rem 1.75rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        {/* Cabecera del configurador con botón para colapsar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: currentTheme.accentBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentTheme.primary,
            }}>
              <Zap size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Motor de Configuración de Rutinas por IA
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                Personaliza tu nivel, objetivo, modalidad y sede física para que la IA arme la rutina perfecta.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '999px',
              padding: '0.45rem 0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            {isConfigOpen ? (
              <><span>Ocultar Ajustes</span> <ChevronUp size={16} /></>
            ) : (
              <><span>Cambiar Nivel o Sede</span> <ChevronDown size={16} /></>
            )}
          </button>
        </div>

        {/* Controles del Configurador */}
        {isConfigOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* 1. SELECCIÓN DE NIVEL */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#0f172a', color: '#fff', fontSize: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                NIVEL DE EXPERIENCIA & PROGRESIÓN
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {[
                  {
                    id: 'BEGINNER',
                    label: 'Básico (Principiante)',
                    desc: 'Prioriza aprendizaje de técnica, máquinas guiadas seguras y RPE 7.0.',
                    badge: '🟢 Fácil Adaptación',
                  },
                  {
                    id: 'INTERMEDIATE',
                    label: 'Medio (Intermedio)',
                    desc: 'Sobrecarga progresiva, volumen medio, RPE 8.0-8.5 y descansos controlados.',
                    badge: '🟡 Recomendado',
                  },
                  {
                    id: 'ADVANCED',
                    label: 'Avanzado (Sobrecarga Pro)',
                    desc: 'Alta tensión mecánica, RPE 9.0-9.5, dropsets y pesos libres pesados.',
                    badge: '🔴 Máxima Intensidad',
                  },
                ].map((item) => {
                  const isSelected = level === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setLevel(item.id as any)}
                      style={{
                        borderRadius: '12px',
                        padding: '0.85rem 1rem',
                        cursor: 'pointer',
                        border: isSelected ? `2px solid ${currentTheme.primary}` : '1px solid #e2e8f0',
                        background: isSelected ? currentTheme.accentBg : '#f8fafc',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: isSelected ? '#0f172a' : '#334155' }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: isSelected ? currentTheme.primary : '#64748b' }}>
                          {item.badge}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0, lineHeight: 1.3 }}>
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. OBJETIVO DEL USUARIO ("LO QUE QUIERA MEJORAR") */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#0f172a', color: '#fff', fontSize: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                OBJETIVO PRINCIPAL (LO QUE QUIERES MEJORAR)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
                {[
                  { id: 'HYPERTROPHY', label: 'Masa Muscular / Hipertrofia', icon: Dumbbell, color: '#10b981' },
                  { id: 'FAT_LOSS', label: 'Quemar Grasa / Definición', icon: Flame, color: '#f59e0b' },
                  { id: 'STRENGTH', label: 'Fuerza Máxima & Densidad', icon: Zap, color: '#ef4444' },
                  { id: 'TONING_CORE', label: 'Tonificación, Glúteos & Core', icon: Sparkles, color: '#8b5cf6' },
                  { id: 'ENDURANCE', label: 'Resistencia & Salud Integral', icon: Clock, color: '#06b6d4' },
                ].map((item) => {
                  const isSelected = goal === item.id;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setGoal(item.id as any)}
                      style={{
                        borderRadius: '12px',
                        padding: '0.75rem 0.9rem',
                        cursor: 'pointer',
                        border: isSelected ? `2px solid ${currentTheme.primary}` : '1px solid #e2e8f0',
                        background: isSelected ? currentTheme.accentBg : '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: isSelected ? currentTheme.primary : '#ffffff',
                        color: isSelected ? '#000000' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      }}>
                        <Icon size={16} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. MODALIDAD: GIMNASIO VS EN CASA */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#0f172a', color: '#fff', fontSize: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                  MODALIDAD DE ENTRENAMIENTO
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setEnvironment('GYM')}
                    style={{
                      flex: 1,
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: environment === 'GYM' ? `2px solid ${currentTheme.primary}` : '1px solid #e2e8f0',
                      background: environment === 'GYM' ? currentTheme.accentBg : '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      color: '#0f172a',
                    }}
                  >
                    <Building2 size={18} color={environment === 'GYM' ? currentTheme.primary : '#64748b'} />
                    En Gimnasio (Máquinas)
                  </button>

                  <button
                    onClick={() => setEnvironment('HOME')}
                    style={{
                      flex: 1,
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: environment === 'HOME' ? `2px solid ${currentTheme.primary}` : '1px solid #e2e8f0',
                      background: environment === 'HOME' ? currentTheme.accentBg : '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      color: '#0f172a',
                    }}
                  >
                    <Home size={18} color={environment === 'HOME' ? currentTheme.primary : '#64748b'} />
                    En Casa (Sin Máquinas)
                  </button>
                </div>
              </div>

              {/* 4. SELECTOR DE GIMNASIO / SEDE ESPECÍFICA */}
              {environment === 'GYM' && (
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#0f172a', color: '#fff', fontSize: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>4</span>
                    SEDE / GIMNASIO DONDE ESTÁS ENTRENANDO
                  </div>
                  <select
                    value={selectedGymId}
                    onChange={(e) => setSelectedGymId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {gymLocations
                      .filter((g) => g.type !== 'HOME')
                      .map((gym) => (
                        <option key={gym.id} value={gym.id}>
                          {gym.name} ({gym.availableMachines.length} Máquinas)
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            {/* MUESTRA DEL INVENTARIO DE MÁQUINAS DE LA SEDE */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              border: '1px dashed #cbd5e1',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} color={currentTheme.primary} />
                  Inventario Detectado en {environment === 'HOME' ? 'Entrenamiento Casero' : activeGym?.name}:
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                  {activeGym?.availableMachines.length} Equipos Compatibles
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {activeGym?.availableMachines.slice(0, 8).map((machine, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#475569',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <CheckCircle2 size={12} color="#10b981" /> {machine}
                  </span>
                ))}
                {activeGym && activeGym.availableMachines.length > 8 && (
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, alignSelf: 'center' }}>
                    +{activeGym.availableMachines.length - 8} más...
                  </span>
                )}
              </div>
            </div>

            {/* BOTÓN DE ACCIÓN: GENERAR CON IA */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button
                disabled={isGenerating}
                onClick={() => handleGenerateRoutine()}
                style={{
                  background: currentTheme.primary,
                  color: '#000000',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: `0 6px 20px ${currentTheme.primaryGlow}`,
                  transition: 'all 0.2s ease',
                  opacity: isGenerating ? 0.7 : 1,
                }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Sintetizando Biomecánica por IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Actualizar Rutina con IA para esta Sede</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CUERPO PRINCIPAL: VISUALIZACIÓN DE LA RUTINA GENERADA */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        {/* Banner informativo de justificación de la IA */}
        {generatedRoutine && (
          <div style={{
            background: currentTheme.accentBg,
            border: `1px solid ${currentTheme.primary}`,
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: currentTheme.primary,
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Info size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                {generatedRoutine.title} • {generatedRoutine.subtitle}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                {generatedRoutine.aiRationale}
              </p>
            </div>
          </div>
        )}

        {/* Selector de Días de la Rutina */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {generatedRoutine?.days.map((d) => {
              const isActive = activeDay === d.dayNumber;
              return (
                <button
                  key={d.dayNumber}
                  onClick={() => setActiveDay(d.dayNumber)}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '999px',
                    border: 'none',
                    background: isActive ? currentTheme.primary : '#f8fafc',
                    color: isActive ? '#000000' : '#64748b',
                    fontWeight: isActive ? 900 : 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? `0 3px 12px ${currentTheme.primaryGlow}` : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {d.dayTitle.split(':')[0]} • {d.dayTitle.split(':')[1]?.trim() || `Día ${d.dayNumber}`}
                </button>
              );
            })}
          </div>

          {currentDayPlan && (
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
              Músculos: <span style={{ color: '#0f172a', fontWeight: 800 }}>{currentDayPlan.focusMuscles}</span>
            </div>
          )}
        </div>

        {/* Tabla de Ejercicios del Día con Máquinas y Alternativas */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.85rem 0.5rem' }}>Ejercicio</th>
                <th style={{ padding: '0.85rem 0.5rem' }}>Máquina / Equipo en Sede</th>
                <th style={{ padding: '0.85rem 0.5rem' }}>Series</th>
                <th style={{ padding: '0.85rem 0.5rem' }}>Rango Reps</th>
                <th style={{ padding: '0.85rem 0.5rem' }}>RPE / RIR</th>
                <th style={{ padding: '0.85rem 0.5rem' }}>Descanso</th>
                <th style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>¿Máquina Ocupada?</th>
              </tr>
            </thead>
            <tbody>
              {currentDayPlan?.exercises.map((ex, idx) => {
                const isAlternativeShown = showAlternativeNote === ex.name;
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* Ejercicio */}
                    <td style={{ padding: '0.95rem 0.5rem', fontWeight: 800, color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: currentTheme.primary,
                          color: '#000000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '0.75rem',
                          flexShrink: 0,
                        }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div>{ex.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                            {ex.executionNotes}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Máquina requerida en la sede */}
                    <td style={{ padding: '0.95rem 0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{
                          background: '#f1f5f9',
                          color: '#1e293b',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}>
                          <CheckCircle2 size={12} color="#10b981" />
                          {ex.machineRequired}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                          📍 {ex.machineLocationTag}
                        </span>
                      </div>
                    </td>

                    {/* Series */}
                    <td style={{ padding: '0.95rem 0.5rem', fontWeight: 700, color: '#475569' }}>
                      {ex.targetSets} Series
                    </td>

                    {/* Repeticiones */}
                    <td style={{ padding: '0.95rem 0.5rem', fontWeight: 800, color: '#0f172a' }}>
                      {ex.targetReps}
                    </td>

                    {/* RPE */}
                    <td style={{ padding: '0.95rem 0.5rem' }}>
                      <span style={{
                        background: '#fef3c7',
                        color: '#b45309',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                      }}>
                        RPE {ex.targetRpe}
                      </span>
                    </td>

                    {/* Descanso */}
                    <td style={{ padding: '0.95rem 0.5rem', color: '#64748b', fontWeight: 700 }}>
                      {ex.restSeconds}s
                    </td>

                    {/* Botón Alternativa por si la máquina está ocupada */}
                    <td style={{ padding: '0.95rem 0.5rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => {
                            setShowAlternativeNote(isAlternativeShown ? null : ex.name);
                          }}
                          style={{
                            background: isAlternativeShown ? '#fee2e2' : '#f8fafc',
                            border: `1px solid ${isAlternativeShown ? '#ef4444' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: isAlternativeShown ? '#b91c1c' : '#334155',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <ArrowRightLeft size={12} />
                          {isAlternativeShown ? 'Ocultar' : 'Ver Alternativa'}
                        </button>

                        {isAlternativeShown && (
                          <div style={{
                            background: '#fff1f2',
                            border: '1px solid #fecdd3',
                            borderRadius: '6px',
                            padding: '0.35rem 0.55rem',
                            fontSize: '0.68rem',
                            color: '#9f1239',
                            fontWeight: 700,
                            textAlign: 'left',
                            maxWidth: '240px',
                          }}>
                            ⚡ {ex.alternativeIfOccupied}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoutinesView;
