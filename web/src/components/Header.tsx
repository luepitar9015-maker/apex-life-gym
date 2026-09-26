import React, { useState } from 'react';
import { 
  Percent, 
  ChevronDown, 
  Palette, 
  Shield, 
  LogOut, 
  LogIn, 
  Check, 
  Dumbbell, 
  Leaf, 
  User, 
  Menu,
  MoreVertical 
} from 'lucide-react';
import { AuthUser, UserRole } from '../services/api.js';
import { ColorTheme, EnvironmentTheme, SymbolTheme, getSavedSymbol, getSavedPortalName } from '../styles/themeConfig.js';
import { SymbolIcon } from './SymbolIcon.js';

interface HeaderProps {
  title: string;
  subtitle?: string;
  user: AuthUser | null;
  activeSystem: 'gym' | 'tlc';
  currentTheme: ColorTheme;
  currentEnv?: EnvironmentTheme;
  currentSymbol?: SymbolTheme;
  portalName?: string;
  onOpenColorModal: () => void;
  onSwitchSystem: (sys: 'gym' | 'tlc') => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onQuickSwitchUser?: (role: UserRole, businessType?: 'TLC' | 'GYM') => void;
  onOpenMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  user, 
  activeSystem,
  currentTheme,
  currentEnv,
  currentSymbol = getSavedSymbol(),
  portalName = getSavedPortalName(),
  onOpenColorModal,
  onSwitchSystem,
  onOpenLogin, 
  onLogout,
  onQuickSwitchUser,
  onOpenMenu
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  return (
    <header className="app-header">
      {/* Lado izquierdo: Botón menú móvil + Breadcrumb / Título */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
        {onOpenMenu && (
          <button
            onClick={onOpenMenu}
            className="mobile-menu-trigger"
            aria-label="Abrir Menú"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: currentEnv?.cardBg || 'rgba(15, 23, 42, 0.8)',
              border: `1px solid ${currentEnv?.cardBorder || 'rgba(255, 255, 255, 0.1)'}`,
              color: currentEnv?.textPrimary || '#ffffff',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Menu size={18} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: currentEnv?.textSecondary || '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <SymbolIcon iconKey={currentSymbol.iconKey} size={16} color={currentTheme.primary} style={{ flexShrink: 0 }} />
          <span className="header-system-tag" style={{ fontWeight: 800, color: currentTheme.primary }}>
            {portalName || (activeSystem === 'gym' ? 'GYM' : 'TLC')}
          </span>
          <span>/</span>
          <span style={{ fontWeight: 800, color: currentEnv?.textPrimary || '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
        </div>
      </div>

      {/* Controles de la derecha */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap' }}>
        {/* BOTÓN: PERSONALIZAR COLORES & SÍMBOLOS */}
        <button
          onClick={onOpenColorModal}
          title={`Centro de Personalización: ${currentTheme.name} • ${currentSymbol.name}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '999px',
            background: currentTheme.primary,
            color: '#000000',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: 'pointer',
            boxShadow: `0 3px 12px ${currentTheme.primaryGlow}`,
            transition: 'transform 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Palette size={14} />
          <span className="desktop-btn-label">Personalizar ({currentSymbol.emoji} {currentTheme.name.split(' ')[0]})</span>
        </button>

        {/* Conmutador Rápido de Sistema (GYM vs TLC) */}
        <button
          onClick={() => onSwitchSystem(activeSystem === 'gym' ? 'tlc' : 'gym')}
          title={activeSystem === 'gym' ? 'Ver Sistema TLC' : 'Ver Sistema GYM'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.7rem',
            borderRadius: '999px',
            background: currentEnv?.cardBg || '#ffffff',
            border: `1px solid ${currentEnv?.cardBorder || '#e2e8f0'}`,
            color: currentEnv?.textPrimary || '#0f172a',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            whiteSpace: 'nowrap',
          }}
        >
          {activeSystem === 'gym' ? <Dumbbell size={13} color={currentTheme.primary} /> : <Leaf size={13} color={currentTheme.primary} />}
          <span className="desktop-btn-label">{activeSystem === 'gym' ? 'TLC' : 'GYM'}</span>
        </button>

        {/* Simulador Rápido de Roles */}
        {onQuickSwitchUser && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              title={`Rol: ${user?.role || 'SUPERADMIN'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.65rem',
                borderRadius: '8px',
                background: currentEnv?.cardBg || '#ffffff',
                border: `1px solid ${currentEnv?.cardBorder || '#e2e8f0'}`,
                color: currentEnv?.textPrimary || '#0f172a',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Shield size={13} color={currentTheme.primary} />
              <span className="desktop-btn-label">{user?.role || 'ADMIN'}</span>
              <ChevronDown size={12} color={currentEnv?.textSecondary || '#64748b'} />
            </button>

            {isRoleMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '240px',
                background: currentEnv?.cardBg || '#0f172a',
                border: `1px solid ${currentEnv?.cardBorder || 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '12px',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
                padding: '0.4rem',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
              }}>
                <div style={{ padding: '0.35rem 0.5rem', fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                  Simular Perfil de Usuario
                </div>
                {[
                  { role: 'SUPERADMIN' as UserRole, label: 'Superadministrador', desc: 'Acceso Total Multi-Sistema' },
                  { role: 'BUSINESS_ADMIN' as UserRole, businessType: 'GYM' as const, label: 'Admin GYM', desc: 'Sede Gimnasio' },
                  { role: 'BUSINESS_ADMIN' as UserRole, businessType: 'TLC' as const, label: 'Admin TLC', desc: 'Red Total Life Changes' },
                  { role: 'AFFILIATE' as UserRole, businessType: 'TLC' as const, label: 'Afiliado TLC', desc: 'Distribuidor Independiente' },
                  { role: 'TRAINER' as UserRole, businessType: 'GYM' as const, label: 'Entrenador Personal', desc: 'Coaching 1 a 1' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onQuickSwitchUser(item.role, item.businessType);
                      setIsRoleMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: user?.role === item.role ? currentTheme.accentBg : 'transparent',
                      color: user?.role === item.role ? currentTheme.primary : (currentEnv?.textPrimary || '#ffffff'),
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.label}</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{item.desc}</div>
                    </div>
                    {user?.role === item.role && <Check size={13} color={currentTheme.primary} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Botón Salir en móvil / desktop */}
        <button
          onClick={onLogout}
          title="Cerrar Sesión"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            cursor: 'pointer',
          }}
        >
          <LogOut size={13} />
        </button>
      </div>
    </header>
  );
};
