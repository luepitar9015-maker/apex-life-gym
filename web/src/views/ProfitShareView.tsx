import React, { useState } from 'react';
import { 
  Percent, 
  ChevronDown, 
  Calendar, 
  Download, 
  Eye, 
  EyeOff, 
  FileSpreadsheet, 
  Lock, 
  Unlock, 
  Check, 
  Palette, 
  LayoutDashboard, 
  User, 
  Gift, 
  Wallet, 
  CalendarDays, 
  Share2, 
  Users, 
  BadgePercent, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Layers,
  ArrowLeft
} from 'lucide-react';

// Definición de las paletas de colores disponibles
export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  primary: string;       // Color neón principal (ej: #76e000)
  primaryHover: string;
  primaryGlow: string;
  bannerBg: string;
  accentBg: string;
  badgeBg: string;
  textColor: string;
  sidebarAccent: string;
}

export const COLOR_PALETTES: ColorTheme[] = [
  {
    id: 'nexo-lime',
    name: 'Nexo Lime (Original de la Imagen)',
    description: 'Verde neón fluorescente de alta energía para trading, comisiones y finanzas',
    primary: '#76e000',
    primaryHover: '#65be00',
    primaryGlow: 'rgba(118, 224, 0, 0.45)',
    bannerBg: '#76e000',
    accentBg: 'rgba(118, 224, 0, 0.15)',
    badgeBg: '#76e000',
    textColor: '#0a0f1d',
    sidebarAccent: '#76e000'
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan & Electric Blue',
    description: 'Azul cian futurista para trading cuantitativo y criptomonedas',
    primary: '#06b6d4',
    primaryHover: '#0891b2',
    primaryGlow: 'rgba(6, 182, 212, 0.45)',
    bannerBg: '#06b6d4',
    accentBg: 'rgba(6, 182, 212, 0.15)',
    badgeBg: '#06b6d4',
    textColor: '#ffffff',
    sidebarAccent: '#06b6d4'
  },
  {
    id: 'tlc-emerald',
    name: 'Emerald TLC Health & Detox',
    description: 'Verde esmeralda orgánico de Total Life Changes y bienestar',
    primary: '#10b981',
    primaryHover: '#059669',
    primaryGlow: 'rgba(16, 185, 129, 0.45)',
    bannerBg: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.15)',
    badgeBg: '#10b981',
    textColor: '#ffffff',
    sidebarAccent: '#10b981'
  },
  {
    id: 'sunset-blaze',
    name: 'Sunset Blaze & Flame',
    description: 'Naranja intenso y ámbar para gimnasio de alta intensidad y fuerza',
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryGlow: 'rgba(249, 115, 22, 0.45)',
    bannerBg: '#f97316',
    accentBg: 'rgba(249, 115, 22, 0.15)',
    badgeBg: '#f97316',
    textColor: '#ffffff',
    sidebarAccent: '#f97316'
  },
  {
    id: 'purple-royale',
    name: 'Purple Royale & Luxury',
    description: 'Violeta imperial profundo para cuentas VIP y comisiones premium',
    primary: '#a855f7',
    primaryHover: '#9333ea',
    primaryGlow: 'rgba(168, 85, 247, 0.45)',
    bannerBg: '#a855f7',
    accentBg: 'rgba(168, 85, 247, 0.15)',
    badgeBg: '#a855f7',
    textColor: '#ffffff',
    sidebarAccent: '#a855f7'
  },
  {
    id: 'gold-prestige',
    name: 'Gold Prestige & Wealth',
    description: 'Oro y champán metálico para directores nacionales y altos rendimientos',
    primary: '#eab308',
    primaryHover: '#ca8a04',
    primaryGlow: 'rgba(234, 179, 8, 0.45)',
    bannerBg: '#eab308',
    accentBg: 'rgba(234, 179, 8, 0.15)',
    badgeBg: '#eab308',
    textColor: '#0f172a',
    sidebarAccent: '#eab308'
  },
  {
    id: 'crimson-sport',
    name: 'Crimson Red Performance',
    description: 'Rojo dinámico para alta competición y fitness extremo',
    primary: '#ef4444',
    primaryHover: '#dc2626',
    primaryGlow: 'rgba(239, 68, 68, 0.45)',
    bannerBg: '#ef4444',
    accentBg: 'rgba(239, 68, 68, 0.15)',
    badgeBg: '#ef4444',
    textColor: '#ffffff',
    sidebarAccent: '#ef4444'
  }
];

interface ProfitShareViewProps {
  onNavigateBack?: () => void;
  onNavigate?: (view: string) => void;
}

export const ProfitShareView: React.FC<ProfitShareViewProps> = ({ onNavigateBack, onNavigate }) => {
  // Estado del tema de color activo
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(COLOR_PALETTES[0]);
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);
  const [customPrimary, setCustomPrimary] = useState(COLOR_PALETTES[0].primary);

  // Estados visuales del dashboard
  const [showBalance, setShowBalance] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [balanceAmount] = useState('$14,892.45');
  const [selectedStrategy, setSelectedStrategy] = useState('Select strategy');
  const [selectedAccount, setSelectedAccount] = useState('51212602 (Copy X)');
  const [dateRange, setDateRange] = useState('13/09/2026 - 19/09/2026');
  const [showEmptyNotice, setShowEmptyNotice] = useState(true);

  // Estados del sidebar de Nexo
  const [isNexoSidebarCollapsed, setIsNexoSidebarCollapsed] = useState(false);
  const [activeNexoItem, setActiveNexoItem] = useState('network');

  // Transacciones exactas a la imagen
  const [transactions] = useState([
    {
      dealId: '211161535',
      login: '51212602',
      symbol: 'XAUUSD.f',
      action: 'Buy',
      volume: '0,003',
      price: '4.356,72000',
      profit: '+0,01',
      commission: '-0,03',
      time: 'Sep 22, 2026, 07:06 PM',
      isPositive: true,
    },
    {
      dealId: '211144693',
      login: '51212602',
      symbol: 'XAUUSD.f',
      action: 'Buy',
      volume: '0,003',
      price: '4.349,67000',
      profit: '+2,17',
      commission: '-0,03',
      time: 'Sep 22, 2026, 06:42 PM',
      isPositive: true,
    },
    {
      dealId: '211130661',
      login: '51212602',
      symbol: 'XAUUSD.f',
      action: 'Buy',
      volume: '0,003',
      price: '4.339,78000',
      profit: '+1,45',
      commission: '-0,03',
      time: 'Sep 22, 2026, 05:18 PM',
      isPositive: true,
    },
    {
      dealId: '211098440',
      login: '51212602',
      symbol: 'BTCUSD.f',
      action: 'Sell',
      volume: '0,010',
      price: '63.240,50000',
      profit: '+18,50',
      commission: '-0,50',
      time: 'Sep 22, 2026, 03:30 PM',
      isPositive: true,
    },
    {
      dealId: '211075219',
      login: '51212602',
      symbol: 'EURUSD.f',
      action: 'Buy',
      volume: '0,050',
      price: '1.11420',
      profit: '+5,20',
      commission: '-0,15',
      time: 'Sep 22, 2026, 01:15 PM',
      isPositive: true,
    },
    {
      dealId: '211041188',
      login: '51212602',
      symbol: 'TLC-KIT',
      action: 'Buy',
      volume: '1,000',
      price: '179,95',
      profit: '+60,00',
      commission: '0,00',
      time: 'Sep 22, 2026, 11:00 AM',
      isPositive: true,
    }
  ]);

  // Exportar a CSV/Excel real
  const handleExportExcel = () => {
    const headers = ['Deal ID,Login,Symbol,Action,Volume,Price,Profit,Commission,Time'];
    const rows = transactions.map(t => 
      `${t.dealId},${t.login},${t.symbol},${t.action},"${t.volume}","${t.price}","${t.profit}","${t.commission}","${t.time}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Trading_History_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApplyCustomColor = () => {
    const customTheme: ColorTheme = {
      id: 'custom-palette',
      name: 'Personalizada por Usuario',
      description: 'Color corporativo personalizado ajustado por el usuario',
      primary: customPrimary,
      primaryHover: customPrimary,
      primaryGlow: `${customPrimary}66`,
      bannerBg: customPrimary,
      accentBg: `${customPrimary}1f`,
      badgeBg: customPrimary,
      textColor: '#ffffff',
      sidebarAccent: customPrimary
    };
    setCurrentTheme(customTheme);
    setIsPaletteModalOpen(false);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      background: '#f1f5f9',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#0f172a',
      padding: '12px 16px',
      boxSizing: 'border-box',
      gap: '16px',
    }}>
      {/* ------------------------------------------------------------- */}
      {/* SIDEBAR FLOTANTE OSCURO EXACTO AL EJEMPLO DE LA IMAGEN */}
      {/* ------------------------------------------------------------- */}
      <aside style={{
        width: isNexoSidebarCollapsed ? '72px' : '235px',
        transition: 'width 0.22s ease',
        background: '#070a12',
        borderRadius: '24px',
        padding: isNexoSidebarCollapsed ? '1.25rem 0.5rem' : '1.25rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        color: '#ffffff',
        position: 'relative',
        flexShrink: 0,
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        alignSelf: 'stretch',
        border: '1px solid rgba(255, 255, 255, 0.04)',
      }}>
        {/* Tira vertical verde/acento temático en el borde derecho */}
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '0px',
          bottom: '24px',
          width: '3.5px',
          background: currentTheme.primary,
          borderRadius: '999px',
          boxShadow: `0 0 12px ${currentTheme.primaryGlow}`,
        }} />

        {/* Botón circular verde toggle con flecha < */}
        <button
          onClick={() => setIsNexoSidebarCollapsed(!isNexoSidebarCollapsed)}
          title={isNexoSidebarCollapsed ? 'Expandir Sidebar' : 'Contraer Sidebar'}
          style={{
            position: 'absolute',
            top: '36px',
            right: '-13px',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: currentTheme.primary,
            color: '#000000',
            border: '2px solid #070a12',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            boxShadow: `0 0 12px ${currentTheme.primaryGlow}`,
          }}
        >
          {isNexoSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Brand Logo "nexo" */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.4rem' }}>
          <div style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            fontFamily: 'system-ui',
            color: '#ffffff',
          }}>
            ne<span style={{ color: currentTheme.primary }}>x</span>o
          </div>
          {!isNexoSidebarCollapsed && (
            <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.06em', marginTop: '2px' }}>
              GLOBAL
            </span>
          )}
        </div>

        {/* User Profile Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.35rem 0.4rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#1e293b',
              border: `1.5px solid ${currentTheme.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}>
              <User size={18} />
            </div>
            {!isNexoSidebarCollapsed && (
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.15 }}>
                  Luis Ernesto
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                  Moreno
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.06em', marginTop: '1px' }}>
                  {showPassword ? 'ID: 51212602' : '••••••••••••'}
                </div>
              </div>
            )}
          </div>
          {!isNexoSidebarCollapsed && (
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
            >
              {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
          )}
        </div>

        {/* Balance Pill Button */}
        <button
          onClick={() => setShowBalance(!showBalance)}
          style={{
            background: currentTheme.primary,
            border: 'none',
            borderRadius: '999px',
            padding: '0.42rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#000000',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: 'pointer',
            boxShadow: `0 4px 14px ${currentTheme.primaryGlow}`,
            transition: 'transform 0.15s ease',
          }}
        >
          <span>Balance</span>
          <span>{showBalance ? balanceAmount : '••••••'}</span>
        </button>

        {/* Copy X Button */}
        <div style={{
          background: currentTheme.primary,
          borderRadius: '8px',
          padding: '0.45rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#000000',
          fontWeight: 700,
          fontSize: '0.78rem',
          cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Layers size={15} />
            {!isNexoSidebarCollapsed && <span>Copy X</span>}
          </div>
          {!isNexoSidebarCollapsed && <ChevronDown size={14} />}
        </div>

        {/* Menu Items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.15rem',
          overflowY: 'auto',
          flex: 1,
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'promocodes', label: 'Promocodes & Gift Card', icon: Gift },
            { id: 'wallet', label: 'Wallet', icon: Wallet },
            { id: 'events', label: 'Events', icon: CalendarDays },
            { id: 'masterib', label: 'MasterIB', icon: Share2 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'dashboard' && onNavigateBack) onNavigateBack();
                  setActiveNexoItem(item.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.42rem 0.65rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <Icon size={16} />
                {!isNexoSidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          {/* Sección Resaltada: My Affiliate Network */}
          <div style={{ marginTop: '0.35rem' }}>
            <div style={{
              background: currentTheme.primary,
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Users size={16} />
                {!isNexoSidebarCollapsed && <span>My Affiliate Network</span>}
              </div>
              {!isNexoSidebarCollapsed && <ChevronDown size={14} />}
            </div>

            {!isNexoSidebarCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', paddingLeft: '1.6rem', marginTop: '0.35rem' }}>
                <div style={{ fontSize: '0.75rem', color: currentTheme.primary, fontWeight: 700, padding: '0.15rem 0', cursor: 'pointer' }}>
                  Network
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0.15rem 0', cursor: 'pointer' }}>
                  My Global Affiliate
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0.15rem 0', cursor: 'pointer' }}>
                  My TOP Affiliates
                </div>
              </div>
            )}
          </div>

          {/* Sección Resaltada: My Commissions */}
          <div style={{ marginTop: '0.45rem' }}>
            <div style={{
              background: currentTheme.primary,
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <BadgePercent size={16} />
                {!isNexoSidebarCollapsed && <span>My Commissions</span>}
              </div>
              {!isNexoSidebarCollapsed && <ChevronDown size={14} />}
            </div>

            {!isNexoSidebarCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', paddingLeft: '1.6rem', marginTop: '0.35rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0.15rem 0', cursor: 'pointer' }}>
                  Commission
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0.15rem 0', cursor: 'pointer' }}>
                  My LOT-Commissions
                </div>
              </div>
            )}
          </div>

          {/* Botón Volver al Gimnasio / TLC */}
          {onNavigateBack && !isNexoSidebarCollapsed && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={onNavigateBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#cbd5e1',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <ArrowLeft size={13} /> Volver al Sistema GYM
              </button>
            </div>
          )}
        </div>

        {/* Footer Usuario en Sidebar */}
        <div style={{
          paddingTop: '0.65rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={15} color="#cbd5e1" />
            </div>
            {!isNexoSidebarCollapsed && (
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>
                  Luis Ernesto Moreno
                </div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>
                  lucpitan@gmail.com
                </div>
              </div>
            )}
          </div>
          {!isNexoSidebarCollapsed && (
            <MoreVertical size={14} color="#64748b" style={{ cursor: 'pointer' }} />
          )}
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* ÁREA PRINCIPAL DERECHA */}
      {/* ------------------------------------------------------------- */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.15rem', minWidth: 0 }}>
        {/* Breadcrumb & Botones Superiores */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.15rem 0',
        }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#64748b' }}>
            <Percent size={15} color={currentTheme.primary} />
            <span style={{ fontWeight: 600 }}>Tag</span>
            <span>/</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>Profit Share</span>
          </div>

          {/* Selector de Paleta de Colores & Idioma */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setIsPaletteModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                background: currentTheme.primary,
                color: '#000000',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: `0 3px 12px ${currentTheme.primaryGlow}`,
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Palette size={15} />
              <span>Personalizar Paleta de Colores ({currentTheme.name.split(' ')[0]})</span>
            </button>

            {/* Selector GB */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.65rem',
              borderRadius: '6px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
            }}>
              <span>GB</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* HERO BANNER EXACTO A LA IMAGEN (VERDE NEÓN + COPY-X) */}
        {/* ------------------------------------------------------------- */}
        <div style={{
          background: currentTheme.bannerBg,
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
          {/* Patrón de líneas geométricas poligonales cortadas en diagonal */}
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

          {/* Título Izquierda: My Profit Share */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{
              fontSize: '3.4rem',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#0a0f1d',
              lineHeight: 1.02,
              margin: 0,
              letterSpacing: '-0.035em',
            }}>
              My Profit<br />Share
            </h1>
          </div>

          {/* Widget Negro Inset: # of Directs + Generations Unlocked / Locked */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            background: '#070a12',
            borderRadius: '16px',
            padding: '1.2rem 1.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.6rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            {/* Directs Progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', minWidth: '210px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
                  # of Directs with active Trading account
                </span>
                <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 800 }}>
                  3/5 (60%)
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#1e293b',
                borderRadius: '999px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: '60%',
                  height: '100%',
                  background: currentTheme.primary,
                  boxShadow: `0 0 10px ${currentTheme.primary}`,
                  borderRadius: '999px',
                }} />
              </div>
            </div>

            {/* Línea divisoria */}
            <div style={{ width: '1px', height: '42px', background: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Generations unlocked 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: currentTheme.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 16px ${currentTheme.primaryGlow}`,
              }}>
                <Unlock size={20} color="#000000" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.15 }}>Generations<br />unlocked</div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginLeft: '0.2rem' }}>
                3
              </div>
            </div>

            {/* Línea divisoria */}
            <div style={{ width: '1px', height: '42px', background: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Generations locked 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#1a2234',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <Lock size={18} color="#64748b" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.15 }}>Generations<br />locked</div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#64748b', marginLeft: '0.2rem' }}>
                2
              </div>
            </div>
          </div>

          {/* COPY-X Marca Derecha */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            fontSize: '3.6rem',
            fontWeight: 900,
            fontStyle: 'italic',
            color: '#ffffff',
            letterSpacing: '-0.04em',
            textShadow: '0 4px 15px rgba(0,0,0,0.12)',
          }}>
            COPY-X
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PROFIT SHARE OVERVIEW CARD */}
        {/* ------------------------------------------------------------- */}
        <section style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.35rem 1.65rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.02)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Profit Share Overview
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                Profit Share commission for {dateRange}
              </p>
            </div>

            {/* Controles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.42rem 0.85rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#334155',
                cursor: 'pointer',
              }}>
                <Calendar size={13} color="#64748b" />
                <span>{selectedStrategy}</span>
                <ChevronDown size={13} color="#64748b" />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.42rem 0.85rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}>
                <Calendar size={13} color="#64748b" />
                <span>{dateRange}</span>
              </div>

              <button
                onClick={handleExportExcel}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.42rem 0.9rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}
              >
                <Download size={13} />
                <span>Download Report</span>
              </button>

              <button
                onClick={() => setShowEmptyNotice(!showEmptyNotice)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.42rem 0.9rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}
              >
                <Eye size={13} />
                <span>See All Details</span>
              </button>
            </div>
          </div>

          {/* Inset Box: No profit share data */}
          {showEmptyNotice ? (
            <div style={{
              background: '#fafafa',
              border: '1px solid #f1f5f9',
              borderRadius: '12px',
              padding: '2.25rem',
            }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                No profit share data
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                No profit share data available for this period.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              padding: '1.25rem',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Comisión Directa</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: currentTheme.primary }}>$1,480.00 USD</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Generación 1</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>8,240 PV</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Generación 2</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>4,150 PV</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Generación 3</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>2,100 PV</div>
              </div>
            </div>
          )}
        </section>

        {/* ------------------------------------------------------------- */}
        {/* TRADING HISTORY CARD */}
        {/* ------------------------------------------------------------- */}
        <section style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.35rem 1.65rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.02)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Trading History
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#334155' }}>
                <span style={{ color: '#64748b' }}>Trading Account:</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}>
                  <span>{selectedAccount}</span>
                  <ChevronDown size={13} />
                </div>
              </div>

              <button
                onClick={handleExportExcel}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.42rem 0.9rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}
              >
                <FileSpreadsheet size={14} color="#16a34a" />
                <span>Export to Excel</span>
              </button>
            </div>
          </div>

          {/* Tabla de Registros */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.82rem',
            }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid #f1f5f9',
                  background: '#fafbfc',
                  color: '#64748b',
                  fontWeight: 600,
                }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Deal ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Login</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Symbol</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Action</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Volume (Lots)</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Price</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Profit</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Commission</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.dealId}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: '#0f172a' }}>
                      {tx.dealId}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#0f172a', fontWeight: 700 }}>
                      {tx.login}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#0f172a', fontWeight: 700 }}>
                      {tx.symbol}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                      {tx.action}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#334155' }}>
                      {tx.volume}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#334155' }}>
                      {tx.price}
                    </td>
                    <td style={{
                      padding: '0.9rem 1rem',
                      fontWeight: 800,
                      color: currentTheme.primary, // Resaltado temático
                    }}>
                      {tx.profit}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#64748b' }}>
                      {tx.commission}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: '#334155' }}>
                      {tx.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL INTERACTIVO: TABLA DE PALETAS DE COLORES PERSONALIZADA */}
      {/* ------------------------------------------------------------- */}
      {isPaletteModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 15, 29, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
            border: '1px solid #e2e8f0',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Palette size={22} color={currentTheme.primary} />
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Tabla de Paletas de Colores Personalizada
                  </h2>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                  Selecciona cualquiera de las paletas preconfiguradas o ajusta un tono hexadecimal exacto. Todo el sistema (banner, sidebar, botones y datos) cambiará al instante.
                </p>
              </div>

              <button
                onClick={() => setIsPaletteModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            {/* TABLA DE COLORES */}
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '1.5rem',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Muestra</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Nombre de la Paleta</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Código Hex</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Enfoque</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Aplicar</th>
                  </tr>
                </thead>
                <tbody>
                  {COLOR_PALETTES.map((pal) => {
                    const isSelected = currentTheme.id === pal.id;
                    return (
                      <tr
                        key={pal.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          background: isSelected ? 'rgba(241, 245, 249, 0.8)' : '#ffffff',
                          cursor: 'pointer',
                        }}
                        onClick={() => setCurrentTheme(pal)}
                      >
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{
                            width: '38px',
                            height: '24px',
                            borderRadius: '6px',
                            background: pal.bannerBg,
                            border: `2px solid ${pal.primary}`,
                            boxShadow: `0 2px 8px ${pal.primaryGlow}`,
                          }} />
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                          {pal.name}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: '#64748b', fontWeight: 600 }}>
                          {pal.primary}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.75rem' }}>
                          {pal.description}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          {isSelected ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              background: pal.primary,
                              color: '#000000',
                              fontWeight: 800,
                              fontSize: '0.7rem',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '999px',
                            }}>
                              <Check size={12} /> Activa
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentTheme(pal);
                              }}
                              style={{
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                padding: '0.25rem 0.65rem',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: '#334155',
                                cursor: 'pointer',
                              }}
                            >
                              Seleccionar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* SELECTOR MANUAL */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.92rem', color: '#0f172a', fontWeight: 700 }}>
                  Selector de Color Personalizado Libre
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                  Elige cualquier tono con el selector interactivo o introduce el código HEX:
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="color"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                  {customPrimary.toUpperCase()}
                </span>
                <button
                  onClick={handleApplyCustomColor}
                  style={{
                    padding: '0.5rem 1rem',
                    background: customPrimary,
                    color: '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Aplicar Color
                </button>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setIsPaletteModalOpen(false)}
                style={{
                  padding: '0.65rem 1.5rem',
                  background: '#070a12',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Listo, Guardar & Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
