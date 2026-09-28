import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, QrCode, User, Dumbbell, Shield, LogOut, Crown, Menu } from 'lucide-react';
import { UserRole } from './Sidebar';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenQuickScan?: () => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentUser?: any;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenQuickScan,
  activeRole,
  onRoleChange,
  currentUser,
  onLogout,
  onToggleMobileMenu,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('es-CO', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="app-header" style={{
      padding: '0.85rem 1.5rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(10, 14, 23, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      flexWrap: 'wrap',
      gap: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Botón Hamburguesa para Móvil */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="mobile-menu-trigger"
            aria-label="Abrir Menú"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            <Menu size={20} />
          </button>
        )}

        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
            {title}
          </h1>
          {subtitle && (
            <p className="header-subtitle-text" style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        {/* Selector de Rol de Usuario (4 Roles con etiquetas responsive) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '2px',
          gap: '2px',
        }}>
          <button
            type="button"
            onClick={() => onRoleChange('SUPERADMIN')}
            title="Superusuario SaaS"
            style={{
              border: 'none',
              padding: '0.4rem 0.65rem',
              borderRadius: '7px',
              backgroundColor: activeRole === 'SUPERADMIN' ? '#a855f7' : 'transparent',
              color: activeRole === 'SUPERADMIN' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <Crown size={13} />
            <span className="role-btn-text">SaaS</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('ADMIN')}
            title="Administrador Gym"
            style={{
              border: 'none',
              padding: '0.4rem 0.65rem',
              borderRadius: '7px',
              backgroundColor: activeRole === 'ADMIN' ? '#10b981' : 'transparent',
              color: activeRole === 'ADMIN' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <Shield size={13} />
            <span className="role-btn-text">Admin</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('TRAINER')}
            title="Entrenador / Coach"
            style={{
              border: 'none',
              padding: '0.4rem 0.65rem',
              borderRadius: '7px',
              backgroundColor: activeRole === 'TRAINER' ? '#06b6d4' : 'transparent',
              color: activeRole === 'TRAINER' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <Dumbbell size={13} />
            <span className="role-btn-text">Coach</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('MEMBER')}
            title="Afiliado / Socio"
            style={{
              border: 'none',
              padding: '0.4rem 0.65rem',
              borderRadius: '7px',
              backgroundColor: activeRole === 'MEMBER' ? '#8b5cf6' : 'transparent',
              color: activeRole === 'MEMBER' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <User size={13} />
            <span className="role-btn-text">Socio</span>
          </button>
        </div>

        {/* Reloj (oculto en pantallas muy angostas para no saturar) */}
        <div className="header-clock" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.35rem 0.65rem',
          borderRadius: '8px',
        }}>
          <Clock size={14} color="#06b6d4" />
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f1f5f9', fontVariantNumeric: 'tabular-nums' }}>
            {timeStr}
          </span>
        </div>

        {/* Quick Scan Button (Only for Admin & Reception) */}
        {activeRole === 'ADMIN' && onOpenQuickScan && (
          <button
            onClick={onOpenQuickScan}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.35)',
            }}
          >
            <QrCode size={15} />
            <span className="desktop-btn-label">Acceso QR</span>
          </button>
        )}

        {/* Botón Salir */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="header-logout-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '0.4rem 0.65rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <LogOut size={13} />
            <span className="desktop-btn-label">Salir</span>
          </button>
        )}
      </div>
    </header>
  );
};
