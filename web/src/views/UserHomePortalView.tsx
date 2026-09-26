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
  Plus,
  Play,
  Zap,
  Crown,
  Leaf,
  Shield,
  Gem,
  Target,
  Trophy,
  Sliders,
  Maximize2
} from 'lucide-react';
import { 
  ColorTheme, 
  EnvironmentTheme, 
  SymbolTheme, 
  COLOR_PALETTES, 
  USER_SYMBOLS, 
  getSavedTheme, 
  getSavedEnvTheme, 
  getSavedSymbol, 
  getSavedPortalName,
  applyGlobalTheme,
  saveSymbol,
  savePortalName 
} from '../styles/themeConfig.js';
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
  onThemeChange?: (theme: ColorTheme) => void;
  onSymbolChange?: (symbol: SymbolTheme) => void;
  onPortalNameChange?: (name: string) => void;
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
  onThemeChange,
  onSymbolChange,
  onPortalNameChange,
}) => {
  // Selector de Propuestas en Vivo
  const [activeLayout, setActiveLayout] = useState<'apple' | 'kiosk' | 'cyber'>('apple');

  // Estado interactivo de hidratación y hábitos
  const [waterAmount, setWaterAmount] = useState<number>(2250);
  const [targetWater] = useState<number>(3000);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [habits, setHabits] = useState([
    { id: 'h1', text: 'Tomar Té Iaso Détox en ayunas', done: true, tag: 'TLC Détox' },
    { id: 'h2', text: 'Calentamiento dinámico (10 min)', done: true, tag: 'Entrenamiento' },
    { id: 'h3', text: '140g de proteína deportiva', done: false, tag: 'Nutrición' },
    { id: 'h4', text: '8,000 pasos activos', done: false, tag: 'Cardio' }
  ]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  const addWater = (amount: number) => {
    setWaterAmount(prev => Math.min(targetWater + 1000, prev + amount));
  };

  const handleQuickTheme = (pal: ColorTheme) => {
    applyGlobalTheme(pal, currentEnv);
    if (onThemeChange) onThemeChange(pal);
  };

  const handleQuickSymbol = (sym: SymbolTheme) => {
    saveSymbol(sym);
    if (onSymbolChange) onSymbolChange(sym);
  };

  const userName = currentUser?.firstName 
    ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() 
    : 'Luis Ernesto Moreno';

  const completedHabitsCount = habits.filter(h => h.done).length;
  const habitsPercent = Math.round((completedHabitsCount / habits.length) * 100);
  const waterPercent = Math.min(100, Math.round((waterAmount / targetWater) * 100));

  return (
    <div style={{
      padding: '1rem 1.5rem 4rem',
      maxWidth: '1360px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: currentEnv.textPrimary,
      boxSizing: 'border-box',
    }}>

      {/* ============================================================= */}
      {/* SELECTOR SUPERIOR FLOTANTE DE PROPUESTAS VISUALES */}
      {/* ============================================================= */}
      <div style={{
        background: '#070a13',
        borderRadius: '20px',
        padding: '0.85rem 1.25rem',
        border: `2px solid ${currentTheme.primary}`,
        boxShadow: `0 8px 30px ${currentTheme.primaryGlow}`,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem',
        color: '#ffffff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: currentTheme.primary,
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
          }}>
            <Sliders size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              DIRECTOR: SELECCIONA LA PROPUESTA PARA EVALUAR EN VIVO
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              Haz clic en cualquiera de las 3 opciones para transformar toda la interfaz al instante:
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveLayout('apple')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              border: 'none',
              background: activeLayout === 'apple' ? currentTheme.primary : 'rgba(255,255,255,0.08)',
              color: activeLayout === 'apple' ? '#000000' : '#ffffff',
              fontWeight: 900,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeLayout === 'apple' ? `0 2px 14px ${currentTheme.primaryGlow}` : 'none',
              transition: 'all 0.18s ease',
            }}
          >
            <span>📱 1. Apple Fitness Pass</span>
          </button>

          <button
            onClick={() => setActiveLayout('kiosk')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              border: 'none',
              background: activeLayout === 'kiosk' ? currentTheme.primary : 'rgba(255,255,255,0.08)',
              color: activeLayout === 'kiosk' ? '#000000' : '#ffffff',
              fontWeight: 900,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeLayout === 'kiosk' ? `0 2px 14px ${currentTheme.primaryGlow}` : 'none',
              transition: 'all 0.18s ease',
            }}
          >
            <span>🔲 2. Kiosko 4 Cuadrantes</span>
          </button>

          <button
            onClick={() => setActiveLayout('cyber')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              border: 'none',
              background: activeLayout === 'cyber' ? currentTheme.primary : 'rgba(255,255,255,0.08)',
              color: activeLayout === 'cyber' ? '#000000' : '#ffffff',
              fontWeight: 900,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeLayout === 'cyber' ? `0 2px 14px ${currentTheme.primaryGlow}` : 'none',
              transition: 'all 0.18s ease',
            }}
          >
            <span>⚡ 3. Cyber Atleta Pro</span>
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 📱 PROPUESTA 1: ESTILO "APPLE FITNESS PASS" (LIMPIA & MODERNA) */}
      {/* ============================================================= */}
      {activeLayout === 'apple' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.2s ease' }}>
          
          {/* Header de la Propuesta 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  background: currentTheme.primary,
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '999px',
                }}>
                  PROPUESTA 1: APPLE PASS
                </span>
                <span style={{ fontSize: '0.8rem', color: currentEnv.textSecondary }}>
                  Limpia, elegante, mobile-first con carnet central y anillos de progreso
                </span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.3rem 0 0' }}>
                Hola, <span style={{ color: currentTheme.primary }}>{userName}</span>
              </h2>
            </div>

            {/* Barra de Colores Rápida integrada en el encabezado */}
            <div style={{
              background: currentEnv.cardBg,
              padding: '0.4rem 0.8rem',
              borderRadius: '999px',
              border: `1px solid ${currentEnv.cardBorder}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: currentEnv.textSecondary }}>Color:</span>
              {COLOR_PALETTES.slice(0, 5).map((pal) => (
                <div
                  key={pal.id}
                  onClick={() => handleQuickTheme(pal)}
                  title={pal.name}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: pal.primary,
                    cursor: 'pointer',
                    border: currentTheme.id === pal.id ? '2px solid #000000' : '2px solid transparent',
                    boxShadow: currentTheme.id === pal.id ? `0 0 8px ${pal.primary}` : 'none',
                    transform: currentTheme.id === pal.id ? 'scale(1.25)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* CARNET CENTRAL ESTILO APPLE WALLET PASS HOLOGRÁFICO */}
          <div style={{
            background: `linear-gradient(145deg, ${currentEnv.cardBg} 0%, #060911 100%)`,
            border: `2px solid ${currentTheme.primary}`,
            borderRadius: '28px',
            padding: '2rem',
            boxShadow: `0 20px 60px ${currentTheme.primaryGlow}`,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
          }}>
            {/* Símbolo gigante de marca de agua */}
            <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.05, color: currentTheme.primary, pointerEvents: 'none' }}>
              <SymbolIcon iconKey={currentSymbol.iconKey} size={340} />
            </div>

            {/* Lado izquierdo: Datos del carnet */}
            <div style={{ zIndex: 1, flex: '1 1 340px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: currentTheme.primary,
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 16px ${currentTheme.primaryGlow}`,
                }}>
                  <SymbolIcon iconKey={currentSymbol.iconKey} size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    {portalName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: currentTheme.primary, fontWeight: 800, letterSpacing: '0.08em' }}>
                    DIGITAL MEMBERSHIP PASS
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.35rem' }}>
                {userName}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span>ID: <strong style={{ color: '#ffffff' }}>#1098765432</strong></span>
                <span>Membresía: <strong style={{ color: currentTheme.primary }}>BLACK VIP + IA</strong></span>
                <span>Vence: <strong style={{ color: '#ffffff' }}>15 Oct 2026</strong></span>
              </div>

              {/* Selector de Símbolo en vivo en el mismo pase */}
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>Símbolo de tu Carnet:</span>
                {USER_SYMBOLS.slice(0, 6).map((sym) => (
                  <button
                    key={sym.id}
                    onClick={() => handleQuickSymbol(sym)}
                    title={sym.name}
                    style={{
                      padding: '0.25rem 0.55rem',
                      borderRadius: '8px',
                      border: currentSymbol.id === sym.id ? `1.5px solid ${currentTheme.primary}` : '1px solid rgba(255,255,255,0.1)',
                      background: currentSymbol.id === sym.id ? currentTheme.accentBg : 'rgba(255,255,255,0.04)',
                      color: currentSymbol.id === sym.id ? currentTheme.primary : '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {sym.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Lado derecho: QR Gigante de alta definición */}
            <div style={{
              zIndex: 1,
              background: '#ffffff',
              padding: '1.25rem',
              borderRadius: '22px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            }}>
              <QrCode size={140} color="#070a12" />
              <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.04em' }}>
                VALIDAR EN TORNIQUETE
              </div>
            </div>
          </div>

          {/* 3 GRANDES ACCIONES TÁCTILES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div 
              onClick={() => onNavigate('routines')}
              style={{
                background: currentEnv.cardBg,
                borderRadius: '22px',
                border: `1.5px solid ${currentEnv.cardBorder}`,
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = currentTheme.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = currentEnv.cardBorder; }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: currentTheme.accentBg, color: currentTheme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Dumbbell size={22} />
              </div>
              <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.2rem', fontWeight: 900 }}>Entrenamiento de Hoy</h3>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: currentEnv.textSecondary }}>Pecho & Hombros • 4 series con temporizador</p>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: currentTheme.primary, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Iniciar Sesión <ArrowUpRight size={14} />
              </span>
            </div>

            <div 
              onClick={() => onNavigate('nutrition')}
              style={{
                background: currentEnv.cardBg,
                borderRadius: '22px',
                border: `1.5px solid ${currentEnv.cardBorder}`,
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = currentEnv.cardBorder; }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <UtensilsCrossed size={22} />
              </div>
              <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.2rem', fontWeight: 900 }}>Nutrición & TLC Détox</h3>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: currentEnv.textSecondary }}>1,850 kcal • Té Iaso • 140g de proteína</p>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Ver Plan de Comidas <ArrowUpRight size={14} />
              </span>
            </div>

            <div 
              onClick={() => onNavigate('aiscan')}
              style={{
                background: currentEnv.cardBg,
                borderRadius: '22px',
                border: `1.5px solid ${currentEnv.cardBorder}`,
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#06b6d4'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = currentEnv.cardBorder; }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(6,182,212,0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Activity size={22} />
              </div>
              <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.2rem', fontWeight: 900 }}>Escaneo Corporal IA</h3>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: currentEnv.textSecondary }}>14.2% Grasa • Postura & Simetría con cámara</p>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Escanear Ahora <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 🔲 PROPUESTA 2: ESTILO "KIOSKO 4 CUADRANTES" (CERO DISTRACCIONES) */}
      {/* ============================================================= */}
      {activeLayout === 'kiosk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.2s ease' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{
                background: '#0284c7',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.7rem',
                padding: '0.15rem 0.6rem',
                borderRadius: '999px',
              }}>
                PROPUESTA 2: KIOSKO 4 CUADRANTES
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0.25rem 0 0' }}>
                Panel de Control Táctil • Todo en 1 Sola Vista
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: currentEnv.textSecondary }}>
              Sin submenús • Cada tarjeta es una acción directa
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}>
            {/* CUADRANTE 1: PASE QR PERMANENTE */}
            <div style={{
              background: currentEnv.cardBg,
              borderRadius: '24px',
              border: `2px solid ${currentTheme.primary}`,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: `0 8px 30px ${currentTheme.primaryGlow}`,
              textAlign: 'center',
            }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: currentTheme.primary, letterSpacing: '0.06em' }}>
                  CUADRANTE 1 • ACCESO
                </span>
                <span style={{ fontSize: '0.7rem', background: currentTheme.primary, color: '#000000', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                  {currentSymbol.emoji} ACTIVO
                </span>
              </div>

              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <QrCode size={145} color="#070a12" />
              </div>

              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900 }}>{userName}</div>
                <div style={{ fontSize: '0.75rem', color: currentEnv.textSecondary }}>ID: #10987654 • Pase Torniquete</div>
              </div>

              <button
                onClick={() => setIsQrModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '12px',
                  background: currentTheme.primary,
                  color: '#000000',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <Maximize2 size={15} /> Ver en Pantalla Completa
              </button>
            </div>

            {/* CUADRANTE 2: ENTRENAMIENTO DE HOY */}
            <div style={{
              background: currentEnv.cardBg,
              borderRadius: '24px',
              border: `1.5px solid ${currentEnv.cardBorder}`,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.06em' }}>
                  CUADRANTE 2 • EJERCICIO
                </span>
                <span style={{ fontSize: '0.7rem', color: currentEnv.textSecondary }}>45 Min</span>
              </div>

              <div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <Dumbbell size={22} />
                </div>
                <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.3rem', fontWeight: 900 }}>
                  Rutina de Pecho & Hombros
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: currentEnv.textSecondary, lineHeight: 1.4 }}>
                  • Press de Banca (4x10)<br />
                  • Aperturas con Mancuerna (3x12)<br />
                  • Press Militar (4x8)<br />
                  • Elevaciones Laterales (3x15)
                </p>
              </div>

              <button
                onClick={() => onNavigate('routines')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '14px',
                  background: '#f59e0b',
                  color: '#000000',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
                }}
              >
                <Play size={16} /> EMPEZAR ENTRENAMIENTO
              </button>
            </div>

            {/* CUADRANTE 3: NUTRICIÓN & RETO DÉTOX TLC */}
            <div style={{
              background: currentEnv.cardBg,
              borderRadius: '24px',
              border: `1.5px solid ${currentEnv.cardBorder}`,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981', letterSpacing: '0.06em' }}>
                  CUADRANTE 3 • NUTRICIÓN
                </span>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>TLC DÉTOX</span>
              </div>

              <div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <Droplets size={22} />
                </div>
                <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.3rem', fontWeight: 900 }}>
                  Hidratación & Calorías
                </h3>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#06b6d4', margin: '0.4rem 0' }}>
                  {waterAmount} / {targetWater} ml ({waterPercent}%)
                </div>
                <div style={{ fontSize: '0.8rem', color: currentEnv.textSecondary }}>
                  Calorías: 1,850 / 2,400 kcal • 140g Proteína
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => addWater(250)}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '12px',
                    background: 'rgba(6,182,212,0.12)',
                    border: '1px solid #06b6d4',
                    color: '#06b6d4',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  + Vaso (250ml)
                </button>
                <button
                  onClick={() => onNavigate('nutrition')}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '12px',
                    background: '#10b981',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  Ver Menú TLC
                </button>
              </div>
            </div>

            {/* CUADRANTE 4: PERSONALIZADOR DIRECTO EN PANTALLA */}
            <div style={{
              background: currentEnv.cardBg,
              borderRadius: '24px',
              border: `2px dashed ${currentTheme.primary}`,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 900, color: currentTheme.primary, letterSpacing: '0.06em' }}>
                    CUADRANTE 4 • PERSONALIZAR
                  </span>
                  <Palette size={16} color={currentTheme.primary} />
                </div>
                <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem', fontWeight: 900 }}>
                  Cambia Colores & Símbolos
                </h3>
                <div style={{ fontSize: '0.75rem', color: currentEnv.textSecondary, marginBottom: '0.75rem' }}>
                  Toca directamente para cambiar el estilo de tu app:
                </div>

                {/* Fila de Colores */}
                <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  {COLOR_PALETTES.map((pal) => (
                    <div
                      key={pal.id}
                      onClick={() => handleQuickTheme(pal)}
                      title={pal.name}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: pal.primary,
                        cursor: 'pointer',
                        border: currentTheme.id === pal.id ? '2.5px solid #000000' : '2px solid transparent',
                        boxShadow: currentTheme.id === pal.id ? `0 0 10px ${pal.primary}` : 'none',
                        transform: currentTheme.id === pal.id ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.15s ease',
                      }}
                    />
                  ))}
                </div>

                {/* Fila de Símbolos */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {USER_SYMBOLS.slice(0, 8).map((sym) => (
                    <button
                      key={sym.id}
                      onClick={() => handleQuickSymbol(sym)}
                      style={{
                        padding: '0.3rem 0.5rem',
                        borderRadius: '8px',
                        border: currentSymbol.id === sym.id ? `1.5px solid ${currentTheme.primary}` : `1px solid ${currentEnv.cardBorder}`,
                        background: currentSymbol.id === sym.id ? currentTheme.primary : currentEnv.tableHeaderBg,
                        color: currentSymbol.id === sym.id ? '#000000' : currentEnv.textPrimary,
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      {sym.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: currentEnv.textSecondary, textAlign: 'center' }}>
                Estilo activo: <strong>{currentTheme.name.split(' ')[0]}</strong> con símbolo <strong>{currentSymbol.name}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* ⚡ PROPUESTA 3: ESTILO "CYBER ATLETA PRO" (ALTO RENDIMIENTO) */}
      {/* ============================================================= */}
      {activeLayout === 'cyber' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.2s ease' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{
                background: '#a855f7',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.7rem',
                padding: '0.15rem 0.6rem',
                borderRadius: '999px',
              }}>
                PROPUESTA 3: CYBER ATLETA PRO
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.25rem 0 0', letterSpacing: '-0.03em' }}>
                PANEL DE RENDIMIENTO ATLETA
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                background: 'rgba(239,68,68,0.15)',
                color: '#ef4444',
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                fontWeight: 900,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}>
                <Flame size={14} /> 5 DÍAS CONSECUTIVOS
              </div>
            </div>
          </div>

          {/* Cockpit de Métricas Cyber */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}>
            <div style={{ background: '#0b0f19', borderRadius: '18px', padding: '1.25rem', border: `1.5px solid ${currentTheme.primary}`, boxShadow: `0 4px 20px ${currentTheme.primaryGlow}` }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>PASE DE ACCESO QR</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.75rem 0' }}>
                <QrCode size={52} color={currentTheme.primary} />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>Torniquete #1</div>
                  <div style={{ fontSize: '0.7rem', color: currentTheme.primary, fontWeight: 800 }}>PERMITIDO</div>
                </div>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Socio VIP: {userName}</div>
            </div>

            <div style={{ background: '#0b0f19', borderRadius: '18px', padding: '1.25rem', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>CARGA DE ENTRENAMIENTO</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '0.4rem 0' }}>
                840 <span style={{ fontSize: '0.8rem', color: currentTheme.primary }}>kg acum.</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981' }}>+12% sobrecarga vs semana pasada</div>
            </div>

            <div style={{ background: '#0b0f19', borderRadius: '18px', padding: '1.25rem', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>COMPOSICION CORPORAL IA</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '0.4rem 0' }}>
                14.2% <span style={{ fontSize: '0.8rem', color: '#06b6d4' }}>grasa</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#06b6d4' }}>Simetria optima • Escaneo Sep 2026</div>
            </div>

            <div style={{ background: '#0b0f19', borderRadius: '18px', padding: '1.25rem', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>DESAFIO DETOX TLC</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '0.4rem 0' }}>
                Dia 8 <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>/ 30</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>Protocolo Iaso Tea Completado</div>
            </div>
          </div>

          {/* Tarjeta de Inicio Directo de Entrenamiento y Copiloto */}
          <div style={{
            background: '#0b0f19',
            borderRadius: '24px',
            border: '1px solid #1e293b',
            padding: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <SymbolIcon iconKey={currentSymbol.iconKey} size={18} color={currentTheme.primary} />
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: currentTheme.primary, textTransform: 'uppercase' }}>
                  {portalName} • Sesión de Fuerza
                </span>
              </div>
              <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
                Rutina Programada: Hipertrofia de Empuje (Push)
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                Ajustado por el Copiloto IA según tu escaneo antropométrico y metas de masa muscular.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => onNavigate('routines')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '14px',
                  background: currentTheme.primary,
                  color: '#000000',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: `0 4px 20px ${currentTheme.primaryGlow}`,
                }}
              >
                ▶ Iniciar Rutina
              </button>
              <button
                onClick={() => {
                  if (onOpenAICopilot) onOpenAICopilot();
                  else onNavigate('ai_agent');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                💬 Asistente IA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL FULLSCREEN QR PARA EL TORNIQUETE */}
      {/* ============================================================= */}
      {isQrModalOpen && (
        <div 
          onClick={() => setIsQrModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '28px',
              padding: '2.5rem',
              maxWidth: '380px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'center',
              boxShadow: '0 25px 70px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: currentTheme.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
            }}>
              <SymbolIcon iconKey={currentSymbol.iconKey} size={28} />
            </div>

            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
              {portalName} • Pase QR
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Presenta este código frente al torniquete óptico
            </div>

            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '16px', border: '2px solid #e2e8f0' }}>
              <QrCode size={190} color="#070a12" />
            </div>

            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>
              {userName}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              ID: #1098765432 • Estado: <strong style={{ color: '#10b981' }}>ACTIVO</strong>
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '14px',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              Cerrar Pase
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserHomePortalView;
