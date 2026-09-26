import React, { useState } from 'react';
import { 
  QrCode, 
  Dumbbell, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  ChevronRight, 
  Droplets, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Users, 
  Calendar, 
  Award, 
  ArrowUpRight, 
  Bot, 
  Palette, 
  UtensilsCrossed, 
  Activity, 
  Check, 
  Plus 
} from 'lucide-react';
import { ColorTheme, EnvironmentTheme, SymbolTheme, getSavedTheme, getSavedEnvTheme, getSavedSymbol, getSavedPortalName } from '../styles/themeConfig.js';
import { AuthUser } from '../services/api.js';
import { SymbolIcon } from '../components/SymbolIcon.js';

interface UserHomePortalViewProps {
  onNavigate: (view: string) => void;
  currentUser: AuthUser | null;
  currentTheme?: ColorTheme;
  currentEnv?: EnvironmentTheme;
  currentSymbol?: SymbolTheme;
  portalName?: string;
  onOpenCustomizer?: () => void;
  onOpenAICopilot?: () => void;
}

export const UserHomePortalView: React.FC<UserHomePortalViewProps> = ({
  onNavigate,
  currentUser,
  currentTheme = getSavedTheme(),
  currentEnv = getSavedEnvTheme(),
  currentSymbol = getSavedSymbol(),
  portalName = getSavedPortalName(),
  onOpenCustomizer,
  onOpenAICopilot,
}) => {
  // Estado local interactivo para hábitos e hidratación
  const [waterAmount, setWaterAmount] = useState<number>(2250);
  const [targetWater] = useState<number>(3000);
  const [isQrExpanded, setIsQrExpanded] = useState<boolean>(false);
  const [habits, setHabits] = useState([
    { id: 'h1', text: 'Tomar Té Iaso Détox en ayunas', done: true, tag: 'TLC Détox' },
    { id: 'h2', text: 'Calentamiento dinámico de movilidad (10 min)', done: true, tag: 'Entrenamiento' },
    { id: 'h3', text: 'Cumplir 140g de proteína deportiva', done: false, tag: 'Nutrición' },
    { id: 'h4', text: '8,000 pasos activos completados', done: false, tag: 'Cardio' }
  ]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  const addWater = (amount: number) => {
    setWaterAmount(prev => Math.min(targetWater + 1000, prev + amount));
  };

  const userName = currentUser?.firstName 
    ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() 
    : 'Luis Ernesto Moreno';

  const completedHabitsCount = habits.filter(h => h.done).length;
  const habitsPercent = Math.round((completedHabitsCount / habits.length) * 100);
  const waterPercent = Math.min(100, Math.round((waterAmount / targetWater) * 100));

  return (
    <div style={{
      padding: '1.25rem 1.75rem 4rem',
      maxWidth: '1360px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: currentEnv.textPrimary,
      boxSizing: 'border-box',
    }}>

      {/* ------------------------------------------------------------- */}
      {/* 1. HERO BANNER DE BIENVENIDA & PERSONALIZACIÓN RÁPIDA */}
      {/* ------------------------------------------------------------- */}
      <section style={{
        background: currentEnv.cardBg,
        borderRadius: '26px',
        border: `1.5px solid ${currentEnv.cardBorder}`,
        padding: '1.75rem 2rem',
        boxShadow: '0 18px 45px rgba(0,0,0,0.06)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        {/* Marca de agua luminosa con el símbolo actual */}
        <div style={{
          position: 'absolute',
          right: '-25px',
          bottom: '-35px',
          opacity: 0.04,
          pointerEvents: 'none',
          color: currentTheme.primary,
        }}>
          <SymbolIcon iconKey={currentSymbol.iconKey} size={280} />
        </div>

        {/* Lado Izquierdo: Saludo, Emblema y Estado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 1, minWidth: '280px', flex: '1 1 450px' }}>
          {/* Emblema Circular con Efecto Neón Glow */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            background: currentTheme.bannerGradient,
            color: currentTheme.textColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 0 24px ${currentTheme.primaryGlow}`,
            border: '2px solid rgba(255,255,255,0.2)',
          }}>
            <SymbolIcon iconKey={currentSymbol.iconKey} size={36} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <span style={{
                background: currentTheme.accentBg,
                color: currentTheme.primary,
                border: `1px solid ${currentTheme.primary}`,
                fontSize: '0.7rem',
                fontWeight: 900,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                letterSpacing: '0.04em',
              }}>
                <ShieldCheck size={12} /> SOCIO VIP ACTIVO
              </span>
              <span style={{
                background: 'rgba(249, 115, 22, 0.12)',
                color: '#f97316',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                fontSize: '0.7rem',
                fontWeight: 900,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}>
                <Flame size={12} /> 5 DÍAS DE RACHA
              </span>
              <span style={{ fontSize: '0.75rem', color: currentEnv.textSecondary, fontWeight: 700 }}>
                • {portalName}
              </span>
            </div>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 900,
              margin: '0.2rem 0',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}>
              ¡Hola, <span style={{ color: currentTheme.primary }}>{userName}</span>!
            </h1>
            <p style={{ margin: 0, fontSize: '0.88rem', color: currentEnv.textSecondary, fontWeight: 500 }}>
              Tu centro personal de entrenamiento, nutrición inteligente y control de accesos.
            </p>
          </div>
        </div>

        {/* Lado Derecho: Acceso Rápido al Carnet QR & Personalizador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1, flexWrap: 'wrap' }}>
          {/* Botón Personalizador */}
          {onOpenCustomizer && (
            <button
              onClick={onOpenCustomizer}
              title="Personalizar colores y símbolos de la interfaz"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                borderRadius: '14px',
                background: currentEnv.cardBg,
                border: `1.5px solid ${currentTheme.primary}`,
                color: currentEnv.textPrimary,
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: `0 3px 12px ${currentTheme.primaryGlow}`,
                transition: 'all 0.15s ease',
              }}
            >
              <Palette size={16} color={currentTheme.primary} />
              <span>Personalizar Espacio</span>
              <span style={{
                background: currentTheme.primary,
                color: '#000000',
                fontSize: '0.68rem',
                fontWeight: 900,
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
              }}>
                {currentSymbol.emoji}
              </span>
            </button>
          )}

          {/* Botón Pase QR Torniquete */}
          <button
            onClick={() => setIsQrExpanded(!isQrExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '14px',
              background: currentTheme.primary,
              color: '#000000',
              border: 'none',
              fontWeight: 900,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: `0 6px 20px ${currentTheme.primaryGlow}`,
              transition: 'transform 0.15s ease',
            }}
          >
            <QrCode size={18} />
            <span>{isQrExpanded ? 'Ocultar Pase QR' : 'Mi Pase Digital QR'}</span>
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 1.1 CARNET QR HOLOGRÁFICO EXPANDIBLE */}
      {/* ------------------------------------------------------------- */}
      {isQrExpanded && (
        <section style={{
          background: `radial-gradient(circle at 10% 20%, ${currentTheme.accentBg} 0%, ${currentEnv.cardBg} 90%)`,
          borderRadius: '24px',
          border: `2px solid ${currentTheme.primary}`,
          padding: '1.5rem 2rem',
          boxShadow: `0 15px 40px ${currentTheme.primaryGlow}`,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 380px' }}>
            <div style={{
              background: '#ffffff',
              padding: '0.75rem',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem',
              flexShrink: 0,
            }}>
              <QrCode size={120} color="#070a12" />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#475569' }}>
                ID: #1098765432
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{
                  background: currentTheme.primary,
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                }}>
                  MEMBRESÍA BLACK VIP
                </span>
                <span style={{ fontSize: '0.78rem', color: currentEnv.textSecondary, fontWeight: 700 }}>
                  Vigencia: 15 Octubre 2026
                </span>
              </div>
              <h2 style={{ margin: '0.2rem 0', fontSize: '1.35rem', fontWeight: 900 }}>
                {userName}
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: currentEnv.textSecondary }}>
                Acerca este código al lector óptico o torniquete inteligente para validar tu acceso inmediato a las instalaciones y registro biométrico.
              </p>
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentTheme.primary, boxShadow: `0 0 10px ${currentTheme.primary}` }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentTheme.primary }}>
                  Torniquete Sede Central: Conectado & Listo
                </span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '1rem 1.25rem',
            borderRadius: '18px',
            border: `1px solid ${currentEnv.cardBorder}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            minWidth: '220px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentTheme.primary }}>
              <Users size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Aforo en Vivo Sede</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>
              38% <span style={{ fontSize: '0.8rem', fontWeight: 500, color: currentEnv.textSecondary }}>Capacidad</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: currentEnv.textSecondary }}>
              Nivel bajo: Momento ideal para entrenar sin esperas de máquinas.
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. LAS 4 GRANDES ACCIONES RÁPIDAS (ZERO-OVERLOAD) */}
      {/* ------------------------------------------------------------- */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color={currentTheme.primary} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0 }}>
              ¿Qué deseas hacer hoy? (Acciones Rápidas)
            </h2>
          </div>
          <span style={{ fontSize: '0.78rem', color: currentEnv.textSecondary }}>
            Sin menús complicados • Acceso directo en 1 clic
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {/* Tarjeta 1: Rutina de Hoy */}
          <div 
            onClick={() => onNavigate('routines')}
            style={{
              background: currentEnv.cardBg,
              borderRadius: '22px',
              border: `1.5px solid ${currentEnv.cardBorder}`,
              padding: '1.35rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = currentTheme.primary;
              e.currentTarget.style.boxShadow = `0 14px 34px ${currentTheme.primaryGlow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = currentEnv.cardBorder;
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: currentTheme.accentBg,
                color: currentTheme.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Dumbbell size={24} />
              </div>
              <span style={{
                background: 'rgba(234, 179, 8, 0.12)',
                color: '#eab308',
                fontWeight: 800,
                fontSize: '0.68rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
              }}>
                SESIÓN PENDIENTE
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '0 0 0.25rem' }}>
                Mi Entrenamiento de Hoy
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: currentEnv.textSecondary, lineHeight: 1.35 }}>
                Pecho, Hombro & Tríceps • 5 Ejercicios con sobrecarga progresiva y descansos RPE.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: `1px solid ${currentEnv.cardBorder}`,
              fontSize: '0.78rem',
              fontWeight: 800,
              color: currentTheme.primary,
            }}>
              <span>Comenzar Sesión</span>
              <ArrowUpRight size={16} />
            </div>
          </div>

          {/* Tarjeta 2: Plan Nutricional & TLC Détox */}
          <div 
            onClick={() => onNavigate('nutrition')}
            style={{
              background: currentEnv.cardBg,
              borderRadius: '22px',
              border: `1.5px solid ${currentEnv.cardBorder}`,
              padding: '1.35rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = currentTheme.primary;
              e.currentTarget.style.boxShadow = `0 14px 34px ${currentTheme.primaryGlow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = currentEnv.cardBorder;
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <UtensilsCrossed size={24} />
              </div>
              <span style={{
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                fontWeight: 800,
                fontSize: '0.68rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
              }}>
                1,850 / 2,400 KCAL
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '0 0 0.25rem' }}>
                Plan Nutricional & TLC
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: currentEnv.textSecondary, lineHeight: 1.35 }}>
                Desglose de macros (140g proteína), dieta deportiva y protocolo de suplementos Détox.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: `1px solid ${currentEnv.cardBorder}`,
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#10b981',
            }}>
              <span>Ver Comidas & Recetas</span>
              <ArrowUpRight size={16} />
            </div>
          </div>

          {/* Tarjeta 3: Escaneo Corporal IA */}
          <div 
            onClick={() => onNavigate('aiscan')}
            style={{
              background: currentEnv.cardBg,
              borderRadius: '22px',
              border: `1.5px solid ${currentEnv.cardBorder}`,
              padding: '1.35rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = currentTheme.primary;
              e.currentTarget.style.boxShadow = `0 14px 34px ${currentTheme.primaryGlow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = currentEnv.cardBorder;
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Activity size={24} />
              </div>
              <span style={{
                background: 'rgba(6, 182, 212, 0.12)',
                color: '#06b6d4',
                fontWeight: 800,
                fontSize: '0.68rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
              }}>
                14.2% GRASA BF
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '0 0 0.25rem' }}>
                Escaneo Corporal IA
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: currentEnv.textSecondary, lineHeight: 1.35 }}>
                Diagnóstico de visión artificial: porcentaje graso, masa magra, simetría y postura.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: `1px solid ${currentEnv.cardBorder}`,
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#06b6d4',
            }}>
              <span>Escanear Mi Cuerpo</span>
              <ArrowUpRight size={16} />
            </div>
          </div>

          {/* Tarjeta 4: Asistente & Copiloto IA APEX */}
          <div 
            onClick={() => {
              if (onOpenAICopilot) onOpenAICopilot();
              else onNavigate('ai_agent');
            }}
            style={{
              background: currentEnv.cardBg,
              borderRadius: '22px',
              border: `1.5px solid ${currentEnv.cardBorder}`,
              padding: '1.35rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = currentTheme.primary;
              e.currentTarget.style.boxShadow = `0 14px 34px ${currentTheme.primaryGlow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = currentEnv.cardBorder;
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#a855f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Bot size={24} />
              </div>
              <span style={{
                background: 'rgba(168, 85, 247, 0.12)',
                color: '#a855f7',
                fontWeight: 800,
                fontSize: '0.68rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
              }}>
                ONLINE 24/7
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '0 0 0.25rem' }}>
                Copiloto IA Autónomo
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: currentEnv.textSecondary, lineHeight: 1.35 }}>
                Tu entrenador cognitivo: pídele cambios de rutina, consultas nutricionales o soporte en tiempo real.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: `1px solid ${currentEnv.cardBorder}`,
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#a855f7',
            }}>
              <span>Chatear con el Asistente</span>
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. WIDGETS DIARIOS: HIDRATACIÓN + CHECKLIST DE HÁBITOS */}
      {/* ------------------------------------------------------------- */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Widget: Hidratación Inteligente */}
        <div style={{
          background: currentEnv.cardBg,
          borderRadius: '24px',
          border: `1.5px solid ${currentEnv.cardBorder}`,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.25rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(6, 182, 212, 0.12)',
                  color: '#06b6d4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Droplets size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>
                    Hidratación Deportiva
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: currentEnv.textSecondary }}>
                    Meta diaria: {targetWater} ml
                  </div>
                </div>
              </div>

              <span style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#06b6d4',
              }}>
                {waterAmount} <span style={{ fontSize: '0.8rem', color: currentEnv.textSecondary }}>ml ({waterPercent}%)</span>
              </span>
            </div>

            {/* Barra de Progreso de Agua */}
            <div style={{
              height: '10px',
              width: '100%',
              borderRadius: '999px',
              background: 'rgba(6, 182, 212, 0.15)',
              overflow: 'hidden',
              margin: '0.75rem 0 1rem',
            }}>
              <div style={{
                height: '100%',
                width: `${waterPercent}%`,
                background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
                borderRadius: '999px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', color: currentEnv.textSecondary, fontWeight: 600 }}>
              Registrar sorbos:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => addWater(250)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #06b6d4',
                  background: 'rgba(6, 182, 212, 0.1)',
                  color: '#06b6d4',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Plus size={14} /> 250 ml
              </button>
              <button
                onClick={() => addWater(500)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#06b6d4',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Plus size={14} /> Botella (500 ml)
              </button>
            </div>
          </div>
        </div>

        {/* Widget: Hábitos & Reto Détox del Día */}
        <div style={{
          background: currentEnv.cardBg,
          borderRadius: '24px',
          border: `1.5px solid ${currentEnv.cardBorder}`,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: currentTheme.accentBg,
                color: currentTheme.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>
                  Hábitos Clave de Hoy
                </h3>
                <div style={{ fontSize: '0.72rem', color: currentEnv.textSecondary }}>
                  {completedHabitsCount} de {habits.length} completados ({habitsPercent}%)
                </div>
              </div>
            </div>

            <span style={{
              background: habitsPercent === 100 ? currentTheme.primary : currentTheme.accentBg,
              color: habitsPercent === 100 ? '#000000' : currentTheme.primary,
              fontSize: '0.72rem',
              fontWeight: 900,
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
            }}>
              {habitsPercent}% LISTO
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {habits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '12px',
                  background: habit.done ? 'rgba(16, 185, 129, 0.05)' : currentEnv.tableHeaderBg,
                  border: habit.done ? '1px solid rgba(16, 185, 129, 0.25)' : `1px solid ${currentEnv.cardBorder}`,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {habit.done ? (
                    <CheckCircle2 size={18} color="#10b981" />
                  ) : (
                    <Circle size={18} color={currentEnv.textSecondary} />
                  )}
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: habit.done ? 600 : 500,
                    textDecoration: habit.done ? 'line-through' : 'none',
                    color: habit.done ? currentEnv.textSecondary : currentEnv.textPrimary,
                  }}>
                    {habit.text}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.65rem',
                  color: habit.done ? '#10b981' : currentEnv.textSecondary,
                  fontWeight: 700,
                }}>
                  {habit.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default UserHomePortalView;
