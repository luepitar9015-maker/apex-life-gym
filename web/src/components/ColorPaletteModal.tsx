import React, { useState } from 'react';
import { 
  Palette, 
  Check, 
  Sun, 
  Moon, 
  Layout, 
  Sparkles, 
  Sliders, 
  RefreshCw, 
  Eye, 
  QrCode, 
  ShieldCheck, 
  Edit3, 
  Zap 
} from 'lucide-react';
import { 
  ColorTheme, 
  EnvironmentTheme, 
  SymbolTheme, 
  COLOR_PALETTES, 
  ENVIRONMENT_PALETTES, 
  USER_SYMBOLS, 
  applyGlobalTheme, 
  getSavedEnvTheme, 
  getSavedSymbol, 
  saveSymbol, 
  getSavedPortalName, 
  savePortalName 
} from '../styles/themeConfig.js';
import { SymbolIcon } from './SymbolIcon.js';

interface ColorPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ColorTheme;
  currentEnv?: EnvironmentTheme;
  currentSymbol?: SymbolTheme;
  portalName?: string;
  onThemeChange: (theme: ColorTheme) => void;
  onEnvChange?: (env: EnvironmentTheme) => void;
  onSymbolChange?: (symbol: SymbolTheme) => void;
  onPortalNameChange?: (name: string) => void;
}

export const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  currentEnv = getSavedEnvTheme(),
  currentSymbol = getSavedSymbol(),
  portalName = getSavedPortalName(),
  onThemeChange,
  onEnvChange,
  onSymbolChange,
  onPortalNameChange,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'table1' | 'table2' | 'symbols'>('both');
  const [customPrimary, setCustomPrimary] = useState(currentTheme.primary);
  const [selectedEnv, setSelectedEnv] = useState<EnvironmentTheme>(currentEnv);
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolTheme>(currentSymbol);
  const [currentPortalTitle, setCurrentPortalTitle] = useState<string>(portalName);
  const [symbolCategory, setSymbolCategory] = useState<string>('Todos');

  if (!isOpen) return null;

  const handleSelectPalette = (palette: ColorTheme) => {
    applyGlobalTheme(palette, selectedEnv);
    onThemeChange(palette);
  };

  const handleSelectEnv = (env: EnvironmentTheme) => {
    setSelectedEnv(env);
    applyGlobalTheme(currentTheme, env);
    if (onEnvChange) onEnvChange(env);
  };

  const handleSelectSymbol = (sym: SymbolTheme) => {
    setSelectedSymbol(sym);
    saveSymbol(sym);
    if (onSymbolChange) onSymbolChange(sym);
  };

  const handleSavePortalTitle = (title: string) => {
    setCurrentPortalTitle(title);
    savePortalName(title);
    if (onPortalNameChange) onPortalNameChange(title);
  };

  const handleApplyCustomColor = () => {
    const customTheme: ColorTheme = {
      id: 'custom-palette',
      name: 'Personalizada Libre',
      description: 'Color corporativo personalizado con código hexadecimal libre',
      primary: customPrimary,
      primaryHover: customPrimary,
      primaryGlow: `${customPrimary}66`,
      bannerGradient: `linear-gradient(135deg, ${customPrimary} 0%, #0f172a 100%)`,
      accentBg: `${customPrimary}1f`,
      badgeBg: customPrimary,
      textColor: '#ffffff',
      sidebarAccent: customPrimary,
    };
    applyGlobalTheme(customTheme, selectedEnv);
    onThemeChange(customTheme);
  };

  const filteredSymbols = symbolCategory === 'Todos'
    ? USER_SYMBOLS
    : USER_SYMBOLS.filter(s => s.category === symbolCategory);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.25rem',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '1020px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '2rem',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.5)',
        border: '1px solid #e2e8f0',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        {/* Header Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: currentTheme.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                boxShadow: `0 4px 14px ${currentTheme.primaryGlow}`,
              }}>
                <Palette size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                  Centro de Personalización: Colores, Entornos & Símbolos
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Ajusta la <strong style={{ color: currentTheme.primary }}>Tableta 1</strong> (Colores Neón), la <strong style={{ color: '#0f172a' }}>Tableta 2</strong> (Fondos y Entornos) y la <strong style={{ color: '#0284c7' }}>Tableta 3</strong> (Símbolo de Identidad).
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              cursor: 'pointer',
              fontWeight: 800,
              color: '#64748b',
              fontSize: '1rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Selector de Pestañas de las Tabletas */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: '#f1f5f9',
          padding: '0.35rem',
          borderRadius: '14px',
          alignSelf: 'flex-start',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setActiveTab('both')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'both' ? '#ffffff' : 'transparent',
              color: activeTab === 'both' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'both' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Sliders size={14} /> Todo en Paralelo
          </button>
          <button
            onClick={() => setActiveTab('table1')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'table1' ? '#ffffff' : 'transparent',
              color: activeTab === 'table1' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'table1' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Palette size={14} color={currentTheme.primary} /> 1. Colores & Banners
          </button>
          <button
            onClick={() => setActiveTab('table2')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'table2' ? '#ffffff' : 'transparent',
              color: activeTab === 'table2' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'table2' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Layout size={14} /> 2. Entorno & Superficie
          </button>
          <button
            onClick={() => setActiveTab('symbols')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'symbols' ? currentTheme.primary : 'transparent',
              color: activeTab === 'symbols' ? '#000000' : '#64748b',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'symbols' ? `0 2px 10px ${currentTheme.primaryGlow}` : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <SymbolIcon iconKey={selectedSymbol.iconKey} size={14} /> 3. Símbolos & Emblemas
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TABLETA 3: SÍMBOLOS, EMBLEMAS & PERSONALIZACIÓN DE IDENTIDAD */}
        {/* ------------------------------------------------------------------ */}
        {(activeTab === 'both' || activeTab === 'symbols') && (
          <div style={{
            background: '#f8fafc',
            borderRadius: '18px',
            border: `2px solid ${activeTab === 'symbols' ? currentTheme.primary : '#e2e8f0'}`,
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: currentTheme.accentBg,
                  color: '#0f172a',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                }}>
                  Tableta 3 • Identidad Visual
                </span>
                <h3 style={{ margin: '0.35rem 0 0.15rem', fontSize: '1.15rem', fontWeight: 900 }}>
                  Símbolos & Emblemas de Poder
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Elige el símbolo que encabeza tu carnet, tu portal de bienvenida y los acentos del sistema.
                </div>
              </div>

              {/* Categorías */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {['Todos', 'Energía', 'Fuerza', 'Salud', 'Estatus'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSymbolCategory(cat)}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      border: '1px solid #cbd5e1',
                      background: symbolCategory === cat ? currentTheme.primary : '#ffffff',
                      color: symbolCategory === cat ? '#000000' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuadrícula de Símbolos */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '0.75rem',
            }}>
              {filteredSymbols.map((sym) => {
                const isSelected = selectedSymbol.id === sym.id;
                return (
                  <div
                    key={sym.id}
                    onClick={() => handleSelectSymbol(sym)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '14px',
                      background: isSelected ? '#ffffff' : '#ffffff',
                      border: isSelected ? `2.5px solid ${currentTheme.primary}` : '1.5px solid #e2e8f0',
                      boxShadow: isSelected ? `0 6px 20px ${currentTheme.primaryGlow}` : '0 2px 4px rgba(0,0,0,0.02)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: currentTheme.primary,
                        color: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: isSelected ? currentTheme.primary : '#f1f5f9',
                        color: isSelected ? '#000000' : '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isSelected ? `0 0 12px ${currentTheme.primaryGlow}` : 'none',
                      }}>
                        <SymbolIcon iconKey={sym.iconKey} size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>
                          {sym.name}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                          {sym.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.25 }}>
                      {sym.description}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input de Nombre / Título Personalizado del Portal */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '240px' }}>
                <Edit3 size={18} color={currentTheme.primary} />
                <div style={{ flex: 1 }}>
                  <label htmlFor="portal-name-input" style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', display: 'block' }}>
                    NOMBRE O ALIAS DE TU ESPACIO / PORTAL:
                  </label>
                  <input
                    id="portal-name-input"
                    type="text"
                    value={currentPortalTitle}
                    onChange={(e) => handleSavePortalTitle(e.target.value)}
                    placeholder="Ej. APEX LIFE, TITÁN GYM, MI TEMPLO"
                    style={{
                      width: '100%',
                      padding: '0.35rem 0.5rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginTop: '0.2rem',
                    }}
                  />
                </div>
              </div>

              {/* Sugerencias Rápidas */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Sugerencias:</span>
                {['APEX LIFE', 'TITÁN FITNESS', 'ZONA ÉLITE', 'TLC DÉTOX CLUB'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSavePortalTitle(tag)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#334155',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* PREVIEW EN VIVO DEL CARNET CON EL SÍMBOLO Y COLOR SELECCIONADOS */}
            <div style={{
              background: selectedEnv.cardBg,
              border: `2px solid ${currentTheme.primary}`,
              borderRadius: '16px',
              padding: '1rem',
              color: selectedEnv.textPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: `0 8px 30px ${currentTheme.primaryGlow}`,
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: currentTheme.bannerGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentTheme.textColor,
                  boxShadow: `0 0 18px ${currentTheme.primaryGlow}`,
                }}>
                  <SymbolIcon iconKey={selectedSymbol.iconKey} size={28} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      background: currentTheme.primary,
                      color: '#000000',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                    }}>
                      PREVIEW CARNET SOCIO VIP
                    </span>
                    <span style={{ fontSize: '0.65rem', color: selectedEnv.textSecondary }}>
                      Símbolo: {selectedSymbol.name} {selectedSymbol.emoji}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '0.15rem' }}>
                    {currentPortalTitle} • <span style={{ color: currentTheme.primary }}>Pase Digital</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: selectedEnv.textSecondary }}>
                    Socio: <strong style={{ color: selectedEnv.textPrimary }}>Luis Ernesto Moreno</strong> (ID: #10987654)
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(255,255,255,0.06)',
                padding: '0.5rem 0.8rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <QrCode size={36} color={currentTheme.primary} />
                <div style={{ fontSize: '0.65rem', color: selectedEnv.textSecondary, lineHeight: 1.2 }}>
                  <div>Control Torniquete</div>
                  <strong style={{ color: currentTheme.primary }}>ACCESO PERMITIDO</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TABLETA 1: TABLA DE COLORES DE ACENTO, BANNERS NEÓN & BOTONES */}
        {/* ------------------------------------------------------------------ */}
        {(activeTab === 'both' || activeTab === 'table1') && (
          <div style={{
            background: '#f8fafc',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: currentTheme.accentBg,
                  color: '#0f172a',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                }}>
                  Tableta 1 • Cromaticidad
                </span>
                <h3 style={{ margin: '0.35rem 0 0.15rem', fontSize: '1.15rem', fontWeight: 900 }}>
                  Colores de Acento, Banners & Botones Neón
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Define el color de alta energía de los botones, bordes luminosos y gradientes.
                </div>
              </div>

              {/* Selector de Color Hexadecimal Libre */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '0.35rem 0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>Personalizado Libre:</span>
                <input
                  type="color"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  style={{ width: '28px', height: '28px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                  title="Elegir color hexadecimal exacto"
                />
                <button
                  onClick={handleApplyCustomColor}
                  style={{
                    padding: '0.25rem 0.65rem',
                    background: customPrimary,
                    color: '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  Aplicar Hex
                </button>
              </div>
            </div>

            {/* Tabla de Paletas de Acento */}
            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#475569', fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Muestra</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Nombre de Paleta</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Gradiente de Banner</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Hex Primario</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {COLOR_PALETTES.map((pal) => {
                    const isSelected = currentTheme.id === pal.id;
                    return (
                      <tr 
                        key={pal.id}
                        onClick={() => handleSelectPalette(pal)}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          background: isSelected ? 'rgba(118, 224, 0, 0.05)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: pal.primary,
                            boxShadow: `0 0 10px ${pal.primaryGlow}`,
                            border: '2px solid #ffffff',
                          }} />
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{pal.name}</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{pal.description}</div>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{
                            height: '18px',
                            width: '110px',
                            borderRadius: '6px',
                            background: pal.bannerGradient,
                            border: '1px solid rgba(0,0,0,0.1)',
                          }} />
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', fontWeight: 700, color: '#334155' }}>
                          {pal.primary}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPalette(pal);
                            }}
                            style={{
                              padding: '0.3rem 0.75rem',
                              borderRadius: '999px',
                              border: 'none',
                              background: isSelected ? pal.primary : '#f1f5f9',
                              color: isSelected ? '#000000' : '#475569',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              cursor: 'pointer',
                              boxShadow: isSelected ? `0 2px 10px ${pal.primaryGlow}` : 'none',
                            }}
                          >
                            {isSelected ? <Check size={13} /> : null}
                            <span>{isSelected ? 'Activo' : 'Elegir'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TABLETA 2: TABLA DE ENTORNO, FONDOS & SUPERFICIE (MODO GLOBAL) */}
        {/* ------------------------------------------------------------------ */}
        {(activeTab === 'both' || activeTab === 'table2') && (
          <div style={{
            background: '#f8fafc',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: '#e2e8f0',
                color: '#0f172a',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
              }}>
                Tableta 2 • Entorno y Superficie
              </span>
              <h3 style={{ margin: '0.35rem 0 0.15rem', fontSize: '1.15rem', fontWeight: 900 }}>
                Fondos, Lienzos & Tarjetas (Modo Claro / Oscuro / Slate)
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Cambia el comportamiento de contraste de toda la pantalla: modo noche VIP con cristal grafito, minimal blanco o nexo claro.
              </div>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#475569', fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Muestra Fondo</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Modo de Entorno</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Lienzo / Tarjetas</th>
                    <th style={{ padding: '0.65rem 0.85rem' }}>Sidebar</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ENVIRONMENT_PALETTES.map((env) => {
                    const isSelected = selectedEnv.id === env.id;
                    return (
                      <tr 
                        key={env.id}
                        onClick={() => handleSelectEnv(env)}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          background: isSelected ? 'rgba(15, 23, 42, 0.05)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{
                            display: 'flex',
                            gap: '3px',
                            padding: '3px',
                            background: '#e2e8f0',
                            borderRadius: '8px',
                            width: '42px',
                          }}>
                            <div style={{ width: '16px', height: '20px', borderRadius: '4px', background: env.canvasBg }} />
                            <div style={{ width: '16px', height: '20px', borderRadius: '4px', background: env.cardBg, border: `1px solid ${env.cardBorder}` }} />
                          </div>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{env.name}</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{env.description}</div>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            background: env.canvasBg,
                            color: env.textPrimary,
                            border: `1px solid ${env.cardBorder}`,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}>
                            Lienzo: {env.canvasBg}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            background: env.sidebarBg,
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}>
                            {env.sidebarBg}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectEnv(env);
                            }}
                            style={{
                              padding: '0.3rem 0.75rem',
                              borderRadius: '999px',
                              border: 'none',
                              background: isSelected ? '#0f172a' : '#f1f5f9',
                              color: isSelected ? '#ffffff' : '#475569',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              cursor: 'pointer',
                              boxShadow: isSelected ? '0 2px 10px rgba(0,0,0,0.2)' : 'none',
                            }}
                          >
                            {isSelected ? <Check size={13} color={currentTheme.primary} /> : null}
                            <span>{isSelected ? 'Activo' : 'Aplicar Modo'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* PREVIEW EN VIVO Y BOTÓN FINAL */}
        {/* ------------------------------------------------------------------ */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          background: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
              Identidad Activa:
            </span>
            <span style={{
              background: currentTheme.primary,
              color: '#000000',
              fontWeight: 900,
              fontSize: '0.78rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}>
              <Palette size={12} /> Color: {currentTheme.name.split(' ')[0]}
            </span>
            <span style={{
              background: selectedEnv.sidebarBg,
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.78rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
            }}>
              Entorno: {selectedEnv.name.split(' ')[0]}
            </span>
            <span style={{
              background: '#0f172a',
              color: currentTheme.primary,
              fontWeight: 800,
              fontSize: '0.78rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}>
              <SymbolIcon iconKey={selectedSymbol.iconKey} size={12} /> Símbolo: {selectedSymbol.name}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '0.65rem 1.75rem',
              borderRadius: '999px',
              border: 'none',
              background: currentTheme.primary,
              color: '#000000',
              fontWeight: 900,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${currentTheme.primaryGlow}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Check size={18} />
            <span>Listo, Guardar & Continuar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteModal;
