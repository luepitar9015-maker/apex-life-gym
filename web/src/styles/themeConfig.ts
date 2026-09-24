// Configuración centralizada de Paletas de Colores & Temas Visuales
// Estilo de Alta Energía inspirado en Nexo / Copy-X

export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  primary: string;         // Color neón principal (ej: #76e000)
  primaryHover: string;
  primaryGlow: string;
  bannerGradient: string;
  accentBg: string;
  badgeBg: string;
  textColor: string;
  sidebarAccent: string;
}

export interface EnvironmentTheme {
  id: string;
  name: string;
  description: string;
  canvasBg: string;       // Fondo de toda la pantalla/lienzo
  cardBg: string;         // Fondo de las tarjetas y módulos
  cardBorder: string;     // Borde de las tarjetas
  textPrimary: string;    // Color de textos y títulos principales
  textSecondary: string;  // Color de textos secundarios
  sidebarBg: string;      // Fondo del menú lateral
  tableHeaderBg: string;  // Fondo del encabezado de tablas
  tableRowHover: string;  // Hover de filas de tabla
  inputBg: string;        // Fondo de buscadores e inputs
  badgeText: string;
}

// -------------------------------------------------------------
// TABLETA 1: PALETA DE COLORES DE ACENTO, BANNERS & BOTONES
// -------------------------------------------------------------
export const COLOR_PALETTES: ColorTheme[] = [
  {
    id: 'nexo-lime',
    name: 'Nexo Lime (Original)',
    description: 'Verde neón fluorescente de alta energía para finanzas y rendimiento',
    primary: '#76e000',
    primaryHover: '#65be00',
    primaryGlow: 'rgba(118, 224, 0, 0.45)',
    bannerGradient: 'linear-gradient(135deg, #7be000 0%, #68c800 45%, #4ea500 100%)',
    accentBg: 'rgba(118, 224, 0, 0.15)',
    badgeBg: '#76e000',
    textColor: '#0a0f1d',
    sidebarAccent: '#76e000'
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan & Electric Blue',
    description: 'Azul cian futurista para biometría, escaneo IA y trading',
    primary: '#06b6d4',
    primaryHover: '#0891b2',
    primaryGlow: 'rgba(6, 182, 212, 0.45)',
    bannerGradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #1e40af 100%)',
    accentBg: 'rgba(6, 182, 212, 0.15)',
    badgeBg: '#06b6d4',
    textColor: '#ffffff',
    sidebarAccent: '#06b6d4'
  },
  {
    id: 'tlc-emerald',
    name: 'Emerald TLC Health & Detox',
    description: 'Verde esmeralda orgánico de Total Life Changes y nutrición deportiva',
    primary: '#10b981',
    primaryHover: '#059669',
    primaryGlow: 'rgba(16, 185, 129, 0.45)',
    bannerGradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    accentBg: 'rgba(16, 185, 129, 0.15)',
    badgeBg: '#10b981',
    textColor: '#ffffff',
    sidebarAccent: '#10b981'
  },
  {
    id: 'sunset-blaze',
    name: 'Sunset Blaze & Flame',
    description: 'Naranja intenso y fuego para entrenamiento de alta intensidad y fuerza',
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryGlow: 'rgba(249, 115, 22, 0.45)',
    bannerGradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #dc2626 100%)',
    accentBg: 'rgba(249, 115, 22, 0.15)',
    badgeBg: '#f97316',
    textColor: '#ffffff',
    sidebarAccent: '#f97316'
  },
  {
    id: 'purple-royale',
    name: 'Purple Royale & Luxury',
    description: 'Violeta imperial profundo para directores VIP y comisiones elevadas',
    primary: '#a855f7',
    primaryHover: '#9333ea',
    primaryGlow: 'rgba(168, 85, 247, 0.45)',
    bannerGradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #4c1d95 100%)',
    accentBg: 'rgba(168, 85, 247, 0.15)',
    badgeBg: '#a855f7',
    textColor: '#ffffff',
    sidebarAccent: '#a855f7'
  },
  {
    id: 'gold-prestige',
    name: 'Gold Prestige & Wealth',
    description: 'Oro y champán metálico para altos rendimientos y liderazgo',
    primary: '#eab308',
    primaryHover: '#ca8a04',
    primaryGlow: 'rgba(234, 179, 8, 0.45)',
    bannerGradient: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #a16207 100%)',
    accentBg: 'rgba(234, 179, 8, 0.15)',
    badgeBg: '#eab308',
    textColor: '#0f172a',
    sidebarAccent: '#eab308'
  },
  {
    id: 'crimson-sport',
    name: 'Crimson Red Performance',
    description: 'Rojo dinámico de alta competición para cross-training y superación',
    primary: '#ef4444',
    primaryHover: '#dc2626',
    primaryGlow: 'rgba(239, 68, 68, 0.45)',
    bannerGradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 50%, #7f1d1d 100%)',
    accentBg: 'rgba(239, 68, 68, 0.15)',
    badgeBg: '#ef4444',
    textColor: '#ffffff',
    sidebarAccent: '#ef4444'
  }
];

// -------------------------------------------------------------
// TABLETA 2: PALETA DE ENTORNO, FONDOS Y SUPERFICIE (MODO GLOBAL)
// -------------------------------------------------------------
export const ENVIRONMENT_PALETTES: EnvironmentTheme[] = [
  {
    id: 'nexo-light',
    name: 'Lienzo Nexo Light (Original)',
    description: 'Lienzo claro #f1f5f9 con tarjetas blancas nítidas y sidebar flotante oscuro',
    canvasBg: '#f1f5f9',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    sidebarBg: '#070a12',
    tableHeaderBg: '#f8fafc',
    tableRowHover: '#f8fafc',
    inputBg: '#f8fafc',
    badgeText: '#000000'
  },
  {
    id: 'dark-vip',
    name: 'Modo Dark VIP (Cristal Oscuro)',
    description: 'Lienzo nocturno #070a13 con tarjetas grafito #0e1626, bordes sutiles y textos luminosos',
    canvasBg: '#070a13',
    cardBg: '#0e1626',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    sidebarBg: '#04060c',
    tableHeaderBg: 'rgba(255, 255, 255, 0.03)',
    tableRowHover: 'rgba(255, 255, 255, 0.02)',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    badgeText: '#000000'
  },
  {
    id: 'cyber-slate',
    name: 'Modo Cyber Slate (Pizarra Metálica)',
    description: 'Entorno tecno-deportivo #0f172a con tarjetas pizarra #1e293b y alto contraste',
    canvasBg: '#0f172a',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    sidebarBg: '#090d16',
    tableHeaderBg: '#172033',
    tableRowHover: 'rgba(255, 255, 255, 0.03)',
    inputBg: '#0f172a',
    badgeText: '#000000'
  },
  {
    id: 'minimal-white',
    name: 'Minimal Blanco Inmaculado',
    description: 'Lienzo blanco #ffffff con contrastes limpios y tarjetas con sombras de alta definición',
    canvasBg: '#fafbfc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    textPrimary: '#020617',
    textSecondary: '#475569',
    sidebarBg: '#0f172a',
    tableHeaderBg: '#f1f5f9',
    tableRowHover: '#f8fafc',
    inputBg: '#ffffff',
    badgeText: '#000000'
  }
];

const THEME_STORAGE_KEY = 'nexo_gym_active_theme';
const ENV_STORAGE_KEY = 'nexo_gym_active_env';

export const applyGlobalTheme = (colorTheme: ColorTheme, envTheme?: EnvironmentTheme): void => {
  const root = document.documentElement;
  const env = envTheme || getSavedEnvTheme();

  // Variables cromáticas de Acento & Banners (Tableta 1)
  root.style.setProperty('--theme-primary', colorTheme.primary);
  root.style.setProperty('--theme-primary-hover', colorTheme.primaryHover);
  root.style.setProperty('--theme-primary-glow', colorTheme.primaryGlow);
  root.style.setProperty('--theme-banner-gradient', colorTheme.bannerGradient);
  root.style.setProperty('--theme-accent-bg', colorTheme.accentBg);
  root.style.setProperty('--theme-badge-bg', colorTheme.badgeBg);
  root.style.setProperty('--theme-sidebar-accent', colorTheme.sidebarAccent);

  // Variables de Entorno, Fondos & Modo de Interfaz (Tableta 2)
  root.style.setProperty('--canvas-bg', env.canvasBg);
  root.style.setProperty('--card-bg', env.cardBg);
  root.style.setProperty('--card-border', env.cardBorder);
  root.style.setProperty('--text-primary', env.textPrimary);
  root.style.setProperty('--text-secondary', env.textSecondary);
  root.style.setProperty('--sidebar-bg', env.sidebarBg);
  root.style.setProperty('--table-header-bg', env.tableHeaderBg);
  root.style.setProperty('--table-row-hover', env.tableRowHover);
  root.style.setProperty('--input-bg', env.inputBg);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(colorTheme));
    localStorage.setItem(ENV_STORAGE_KEY, JSON.stringify(env));
  } catch (e) {
    console.warn('No se pudo guardar tema en localStorage');
  }
};

export const getSavedTheme = (): ColorTheme => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return COLOR_PALETTES[0]; // Nexo Lime por defecto
};

export const getSavedEnvTheme = (): EnvironmentTheme => {
  try {
    const saved = localStorage.getItem(ENV_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return ENVIRONMENT_PALETTES[0]; // Nexo Light Canvas por defecto
};
