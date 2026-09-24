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
  MoreVertical 
} from 'lucide-react';
import { AuthUser, UserRole } from '../services/api.js';
import { ColorTheme, EnvironmentTheme } from '../styles/themeConfig.js';

interface HeaderProps {
  title: string;
  subtitle?: string;
  user: AuthUser | null;
  activeSystem: 'gym' | 'tlc';
  currentTheme: ColorTheme;
  currentEnv?: EnvironmentTheme;
  onOpenColorModal: () => void;
  onSwitchSystem: (sys: 'gym' | 'tlc') => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onQuickSwitchUser?: (role: UserRole, businessType?: 'TLC' | 'GYM') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  user, 
  activeSystem,
  currentTheme,
  currentEnv,
  onOpenColorModal,
  onSwitchSystem,
  onOpenLogin, 
  onLogout,
  onQuickSwitchUser 
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.4rem 0',
      fontFamily: 'Inter, system-ui, sans-serif',
      flexWrap: 'wrap',
      gap: '0.75rem',
    }}>
      {/* Breadcrumb estilo Nexo: % Tag / Modulo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: currentEnv?.textSecondary || '#64748b' }}>
        <Percent size={15} color={currentTheme.primary} />
        <span style={{ fontWeight: 600 }}>{activeSystem === 'gym' ? 'Sistema GYM' : 'Total Life Changes'}</span>
        <span>/</span>
        <span style={{ fontWeight: 800, color: currentEnv?.textPrimary || '#0f172a' }}>{title}</span>
      </div>

      {/* Controles de la derecha */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        {/* BOTÓN: DOS TABLETAS DE COLORES PERSONALIZADA */}
        <button
          onClick={onOpenColorModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.42rem 0.95rem',
            borderRadius: '999px',
            background: currentTheme.primary,
            color: '#000000',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.78rem',
            cursor: 'pointer',
            boxShadow: `0 3px 14px ${currentTheme.primaryGlow}`,
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Palette size={15} />
          <span>Dos Tabletas de Colores ({currentTheme.name.split(' ')[0]})</span>
        </button>

        {/* Conmutador Rápido de Sistema (GYM vs TLC) */}
        <button
          onClick={() => onSwitchSystem(activeSystem === 'gym' ? 'tlc' : 'gym')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.42rem 0.85rem',
            borderRadius: '999px',
            background: currentEnv?.cardBg || '#ffffff',
            border: `1px solid ${currentEnv?.cardBorder || '#e2e8f0'}`,
            color: currentEnv?.textPrimary || '#0f172a',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
          }}
        >
          {activeSystem === 'gym' ? <Dumbbell size={14} color={currentTheme.primary} /> : <Leaf size={14} color={currentTheme.primary} />}
          <span>{activeSystem === 'gym' ? 'Ver Sistema TLC' : 'Ver Sistema GYM'}</span>
        </button>

        {/* Simulador Rápido de Roles */}
        {onQuickSwitchUser && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.42rem 0.85rem',
                borderRadius: '8px',
                background: currentEnv?.cardBg || '#ffffff',
                border: `1px solid ${currentEnv?.cardBorder || '#e2e8f0'}`,
                color: currentEnv?.textPrimary || '#0f172a',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Shield size={14} color={currentTheme.primary} />
              <span>Rol: {user?.role || 'SUPERADMIN'}</span>
              <ChevronDown size={13} color={currentEnv?.textSecondary || '#64748b'} />
            </button>

            {isRoleMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '260px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)',
                padding: '0.5rem',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
              }}>
                <div style={{ padding: '0.35rem 0.5rem', fontSize: '0.68rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                  Simular Perfil de Usuario
                </div>
                {[
                  { role: 'SUPERADMIN' as UserRole, label: 'Superadministrador', desc: 'Acceso Total Multi-Sistema' },
                  { role: 'BUSINESS_ADMIN' as UserRole, businessType: 'GYM' as const, label: 'Admin Negocio (GYM)', desc: 'Administra Sede de Gimnasio' },
                  { role: 'BUSINESS_ADMIN' as UserRole, businessType: 'TLC' as const, label: 'Admin Negocio (TLC)', desc: 'Administra Red Total Life Changes' },
                  { role: 'AFFILIATE' as UserRole, businessType: 'TLC' as const, label: 'Afiliado TLC', desc: 'Distribuidor con Comisiones & Retos' },
                  { role: 'TRAINER' as UserRole, businessType: 'GYM' as const, label: 'Entrenador Personal', desc: 'Coaching 1 a 1 de Alumnos' },
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
                      padding: '0.5rem 0.65rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: user?.role === item.role ? currentTheme.accentBg : 'transparent',
                      color: user?.role === item.role ? currentTheme.primary : '#0f172a',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.78rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.label}</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{item.desc}</div>
                    </div>
                    {user?.role === item.role && <Check size={14} color={currentTheme.primary} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selector de País / Idioma estilo Nexo GB v */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.42rem 0.65rem',
          borderRadius: '6px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#334155',
          cursor: 'pointer',
        }}>
          <span>CO</span>
          <ChevronDown size={13} color="#64748b" />
        </div>
      </div>
    </header>
  );
};
