import React, { createContext, useContext, useState } from 'react';

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  primaryDark: string;
  primaryGlow: string;
  accentBg: string;
  gradientText: string;
  tagBg: string;
  badge: string;
}

export interface EnvironmentTheme {
  id: string;
  name: string;
  canvasBg: string;
  cardBg: string;
  cardBgSubtle: string;
  border: string;
  textMain: string;
  textMuted: string;
  textDark: string;
}

export const COLOR_PALETTES: ColorTheme[] = [
  {
    id: 'nexo-lime',
    name: 'Nexo Lime (Original)',
    primary: '#10b981',
    primaryDark: '#059669',
    primaryGlow: 'rgba(16, 185, 129, 0.45)',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    gradientText: '#34d399',
    tagBg: 'rgba(16, 185, 129, 0.2)',
    badge: 'ESTILO NEXO',
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan & Electric Blue',
    primary: '#00f0ff',
    primaryDark: '#0284c7',
    primaryGlow: 'rgba(0, 240, 255, 0.45)',
    accentBg: 'rgba(0, 240, 255, 0.12)',
    gradientText: '#38bdf8',
    tagBg: 'rgba(0, 240, 255, 0.2)',
    badge: 'FUTURISTA',
  },
  {
    id: 'tlc-emerald',
    name: 'TLC Emerald & Detox Green',
    primary: '#059669',
    primaryDark: '#047857',
    primaryGlow: 'rgba(5, 150, 105, 0.45)',
    accentBg: 'rgba(5, 150, 105, 0.12)',
    gradientText: '#10b981',
    tagBg: 'rgba(5, 150, 105, 0.2)',
    badge: 'TOTAL LIFE CHANGES',
  },
  {
    id: 'sunset-blaze',
    name: 'Sunset Blaze & Coral Neon',
    primary: '#f97316',
    primaryDark: '#ea580c',
    primaryGlow: 'rgba(249, 115, 22, 0.45)',
    accentBg: 'rgba(249, 115, 22, 0.12)',
    gradientText: '#fb923c',
    tagBg: 'rgba(249, 115, 22, 0.2)',
    badge: 'ENERGÍA ALTA',
  },
  {
    id: 'purple-royale',
    name: 'Purple Royale & Cyber Violet',
    primary: '#a855f7',
    primaryDark: '#7e22ce',
    primaryGlow: 'rgba(168, 85, 247, 0.45)',
    accentBg: 'rgba(168, 85, 247, 0.12)',
    gradientText: '#c084fc',
    tagBg: 'rgba(168, 85, 247, 0.2)',
    badge: 'VIP EXECUTIVE',
  },
  {
    id: 'gold-prestige',
    name: 'Gold Prestige & Amber Glow',
    primary: '#eab308',
    primaryDark: '#ca8a04',
    primaryGlow: 'rgba(234, 179, 8, 0.45)',
    accentBg: 'rgba(234, 179, 8, 0.12)',
    gradientText: '#facc15',
    tagBg: 'rgba(234, 179, 8, 0.2)',
    badge: 'PREMIUM GOLD',
  },
  {
    id: 'crimson-sport',
    name: 'Crimson Sport & Hyper Red',
    primary: '#ef4444',
    primaryDark: '#dc2626',
    primaryGlow: 'rgba(239, 68, 68, 0.45)',
    accentBg: 'rgba(239, 68, 68, 0.12)',
    gradientText: '#f87171',
    tagBg: 'rgba(239, 68, 68, 0.2)',
    badge: 'POTENCIA MÁXIMA',
  },
];

export const ENVIRONMENT_PALETTES: EnvironmentTheme[] = [
  {
    id: 'dark-vip',
    name: 'Dark VIP Canvas',
    canvasBg: '#070a12',
    cardBg: '#0f172a',
    cardBgSubtle: 'rgba(30, 41, 59, 0.75)',
    border: 'rgba(255, 255, 255, 0.08)',
    textMain: '#ffffff',
    textMuted: '#94a3b8',
    textDark: '#64748b',
  },
  {
    id: 'cyber-slate',
    name: 'Cyber Slate Canvas',
    canvasBg: '#0b1120',
    cardBg: '#1e293b',
    cardBgSubtle: 'rgba(51, 65, 85, 0.75)',
    border: 'rgba(255, 255, 255, 0.12)',
    textMain: '#f8fafc',
    textMuted: '#cbd5e1',
    textDark: '#94a3b8',
  },
];

interface ThemeContextType {
  colorTheme: ColorTheme;
  envTheme: EnvironmentTheme;
  setColorTheme: (theme: ColorTheme) => void;
  setEnvTheme: (env: EnvironmentTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colorTheme: COLOR_PALETTES[0],
  envTheme: ENVIRONMENT_PALETTES[0],
  setColorTheme: () => {},
  setEnvTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(COLOR_PALETTES[0]);
  const [envTheme, setEnvTheme] = useState<EnvironmentTheme>(ENVIRONMENT_PALETTES[0]);

  return React.createElement(
    ThemeContext.Provider,
    { value: { colorTheme, envTheme, setColorTheme, setEnvTheme } },
    children
  );
};

export const useTheme = () => useContext(ThemeContext);
