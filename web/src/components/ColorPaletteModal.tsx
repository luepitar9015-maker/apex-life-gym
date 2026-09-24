import React, { useState } from 'react';
import { Palette, Check, Sun, Moon, Layout, Sparkles, Sliders, RefreshCw, Eye } from 'lucide-react';
import { 
  ColorTheme, 
  EnvironmentTheme, 
  COLOR_PALETTES, 
  ENVIRONMENT_PALETTES, 
  applyGlobalTheme,
  getSavedEnvTheme
} from '../styles/themeConfig.js';

interface ColorPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ColorTheme;
  currentEnv?: EnvironmentTheme;
  onThemeChange: (theme: ColorTheme) => void;
  onEnvChange?: (env: EnvironmentTheme) => void;
}

export const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  currentEnv = getSavedEnvTheme(),
  onThemeChange,
  onEnvChange,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'table1' | 'table2'>('both');
  const [customPrimary, setCustomPrimary] = useState(currentTheme.primary);
  const [selectedEnv, setSelectedEnv] = useState<EnvironmentTheme>(currentEnv);

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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 16, 0.82)',
      backdropFilter: 'blur(12px)',
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
        maxWidth: '980px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '2rem',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.45)',
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
                  Dos Tabletas de Personalización: Transforma Toda la Interfaz
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Combina la <strong style={{ color: currentTheme.primary }}>Tableta 1</strong> (Color de Acento & Banners) con la <strong style={{ color: '#0f172a' }}>Tableta 2</strong> (Entorno & Fondos de Pantalla) para cambiar toda la aplicación al instante.
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
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
        }}>
          <button
            onClick={() => setActiveTab('both')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'both' ? '#ffffff' : 'transparent',
              color: activeTab === 'both' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'both' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Sliders size={14} /> Ver Ambas Tabletas en Paralelo
          </button>
          <button
            onClick={() => setActiveTab('table1')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'table1' ? '#ffffff' : 'transparent',
              color: activeTab === 'table1' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'table1' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Palette size={14} color={currentTheme.primary} /> Tableta 1: Colores & Banners Neón
          </button>
          <button
            onClick={() => setActiveTab('table2')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'table2' ? '#ffffff' : 'transparent',
              color: activeTab === 'table2' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'table2' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Layout size={14} /> Tableta 2: Entorno, Fondos & Tarjetas
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TABLETA 1: TABLA DE COLORES DE ACENTO, BANNERS NEÓN & BOTONES */}
        {/* ------------------------------------------------------------------ */}
        {(activeTab === 'both' || activeTab === 'table1') && (
          <div style={{
            background: '#fafbfc',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{
                  background: currentTheme.primary,
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  Tableta 1 de 2
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0.3rem 0 0 0' }}>
                  Paleta de Colores de Acento, Banners & Botones
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Activa: <strong style={{ color: currentTheme.primary }}>{currentTheme.name}</strong>
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Muestra</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Nombre de la Paleta</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Degradado Hero Banner</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>HEX Primario</th>
                    <th style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {COLOR_PALETTES.map((palette) => {
                    const isSelected = currentTheme.id === palette.id;
                    return (
                      <tr key={palette.id} style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: isSelected ? 'rgba(118, 224, 0, 0.04)' : 'transparent',
                      }}>
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: palette.primary,
                            boxShadow: `0 2px 8px ${palette.primaryGlow}`,
                            border: '2px solid #ffffff',
                          }} />
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{palette.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{palette.description}</div>
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <div style={{
                            height: '22px',
                            width: '130px',
                            borderRadius: '6px',
                            background: palette.bannerGradient,
                            border: '1px solid rgba(0,0,0,0.1)',
                          }} />
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <code style={{ background: '#f1f5f9', padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                            {palette.primary}
                          </code>
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>
                          <button
                            onClick={() => handleSelectPalette(palette)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.35rem 0.85rem',
                              borderRadius: '999px',
                              border: isSelected ? 'none' : '1px solid #cbd5e1',
                              background: isSelected ? palette.primary : '#ffffff',
                              color: isSelected ? '#000000' : '#0f172a',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              boxShadow: isSelected ? `0 2px 10px ${palette.primaryGlow}` : 'none',
                            }}
                          >
                            {isSelected ? <Check size={13} /> : null}
                            <span>{isSelected ? 'Aplicado' : 'Aplicar'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selector Hexadecimal Libre */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginTop: '0.4rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <input
                  type="color"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  style={{
                    width: '38px',
                    height: '38px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>Color Hexadecimal Libre</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Escribe o selecciona tu código HEX personalizado</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  style={{
                    padding: '0.4rem 0.65rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    width: '95px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                />
                <button
                  onClick={handleApplyCustomColor}
                  style={{
                    background: customPrimary,
                    color: '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.45rem 0.95rem',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  Aplicar Color HEX
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TABLETA 2: TABLA DE ENTORNO, FONDOS & TARJETAS DE TODA LA INTERFAZ */}
        {/* ------------------------------------------------------------------ */}
        {(activeTab === 'both' || activeTab === 'table2') && (
          <div style={{
            background: '#fafbfc',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  Tableta 2 de 2
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0.3rem 0 0 0' }}>
                  Paleta de Entorno, Fondos y Superficie de Toda la Interfaz
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Modo Actual: <strong style={{ color: '#0f172a' }}>{selectedEnv.name}</strong>
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Visualización</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Modo de la Interfaz</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Fondo de Pantalla</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Tarjetas & Módulos</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Menú Lateral</th>
                    <th style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ENVIRONMENT_PALETTES.map((env) => {
                    const isSelected = selectedEnv.id === env.id;
                    return (
                      <tr key={env.id} style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: isSelected ? 'rgba(15, 23, 42, 0.04)' : 'transparent',
                      }}>
                        {/* Mini mockup visual de la estructura */}
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <div style={{
                            width: '54px',
                            height: '34px',
                            borderRadius: '6px',
                            background: env.canvasBg,
                            border: '1px solid #cbd5e1',
                            display: 'flex',
                            padding: '3px',
                            gap: '3px',
                            boxSizing: 'border-box',
                          }}>
                            {/* Sidebar simulado */}
                            <div style={{ width: '12px', height: '100%', borderRadius: '3px', background: env.sidebarBg }} />
                            {/* Card simulada */}
                            <div style={{ flex: 1, height: '100%', borderRadius: '3px', background: env.cardBg, border: `1px solid ${env.cardBorder}` }} />
                          </div>
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{env.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{env.description}</div>
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <code style={{ background: '#f1f5f9', padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                            {env.canvasBg}
                          </code>
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <code style={{ background: '#f1f5f9', padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                            {env.cardBg}
                          </code>
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <code style={{ background: '#f1f5f9', padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                            {env.sidebarBg}
                          </code>
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>
                          <button
                            onClick={() => handleSelectEnv(env)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.35rem 0.85rem',
                              borderRadius: '999px',
                              border: isSelected ? 'none' : '1px solid #cbd5e1',
                              background: isSelected ? '#0f172a' : '#ffffff',
                              color: isSelected ? '#ffffff' : '#0f172a',
                              fontWeight: 800,
                              fontSize: '0.75rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
              Resultado en toda la interfaz:
            </span>
            <span style={{
              background: currentTheme.primary,
              color: '#000000',
              fontWeight: 900,
              fontSize: '0.78rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
            }}>
              Color: {currentTheme.name.split(' ')[0]}
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
