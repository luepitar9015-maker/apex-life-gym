import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, QrCode, User, Dumbbell, Shield, LogOut, Crown } from 'lucide-react';
import { UserRole } from './Sidebar';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenQuickScan?: () => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentUser?: any;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenQuickScan,
  activeRole,
  onRoleChange,
  currentUser,
  onLogout,
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
    <header style={{
      padding: '1.1rem 2rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(10, 14, 23, 0.92)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      flexWrap: 'wrap',
      gap: '1rem',
    }}>
      <div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Selector de Rol de Usuario (4 Roles: Superadmin, Admin, Entrenador, Afiliado) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '3px',
          gap: '2px',
        }}>
          <button
            type="button"
            onClick={() => onRoleChange('SUPERADMIN')}
            style={{
              border: 'none',
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              backgroundColor: activeRole === 'SUPERADMIN' ? '#a855f7' : 'transparent',
              color: activeRole === 'SUPERADMIN' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
            }}
          >
            <Crown size={14} />
            <span>Superusuario</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('ADMIN')}
            style={{
              border: 'none',
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              backgroundColor: activeRole === 'ADMIN' ? '#10b981' : 'transparent',
              color: activeRole === 'ADMIN' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
            }}
          >
            <Shield size={14} />
            <span>Admin GYM</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('TRAINER')}
            style={{
              border: 'none',
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              backgroundColor: activeRole === 'TRAINER' ? '#06b6d4' : 'transparent',
              color: activeRole === 'TRAINER' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
            }}
          >
            <Dumbbell size={14} />
            <span>Entrenador</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('MEMBER')}
            style={{
              border: 'none',
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              backgroundColor: activeRole === 'MEMBER' ? '#8b5cf6' : 'transparent',
              color: activeRole === 'MEMBER' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
            }}
          >
            <User size={14} />
            <span>Afiliado</span>
          </button>
        </div>

        {/* Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.4rem 0.8rem',
          borderRadius: '8px',
        }}>
          <Clock size={15} color="#06b6d4" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9', fontVariantNumeric: 'tabular-nums' }}>
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
              gap: '0.5rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            <QrCode size={16} />
            <span>Acceso QR</span>
          </button>
        )}

        {/* Botón Cerrar Sesión */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Cerrar sesión o cambiar de cuenta"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <LogOut size={14} />
            <span>Salir</span>
          </button>
        )}
      </div>
    </header>
  );
};
