import React from 'react';
import {
  LayoutDashboard,
  QrCode,
  Users,
  CreditCard,
  Dumbbell,
  HeartPulse,
  Shield,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { UserRole } from './Sidebar';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeRole: UserRole;
  onLogout?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  activeRole,
  onLogout,
}) => {
  const getNavItems = () => {
    switch (activeRole) {
      case 'SUPERADMIN':
        return [
          { id: 'superadmin', label: 'SaaS Sedes', icon: Shield },
          { id: 'diagnostic', label: 'Diag & Dieta', icon: HeartPulse },
          { id: 'dashboard', label: 'Telemetría', icon: LayoutDashboard },
          { id: 'members', label: 'Socios', icon: Users },
        ];
      case 'TRAINER':
        return [
          { id: 'trainer', label: 'Entrenador', icon: Dumbbell },
          { id: 'diagnostic', label: 'Diag & Dieta', icon: HeartPulse },
          { id: 'routines', label: 'Rutinas', icon: Sparkles },
          { id: 'members', label: 'Atletas', icon: Users },
        ];
      case 'MEMBER':
        return [
          { id: 'affiliate', label: 'Mi Carnet', icon: QrCode },
          { id: 'diagnostic', label: 'Diagnóstico', icon: HeartPulse },
          { id: 'routines', label: 'Mi Rutina', icon: Dumbbell },
        ];
      case 'ADMIN':
      default:
        return [
          { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
          { id: 'checkin', label: 'Acceso QR', icon: QrCode },
          { id: 'diagnostic', label: 'Diag & Dieta', icon: HeartPulse },
          { id: 'members', label: 'Socios', icon: Users },
          { id: 'pos', label: 'Caja POS', icon: CreditCard },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="mobile-bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(10, 14, 23, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0.45rem 0.25rem',
      paddingBottom: 'calc(0.45rem + env(safe-area-inset-bottom, 12px))',
      zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.6)',
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              padding: '0.35rem 0.5rem',
              color: isActive ? '#10b981' : '#94a3b8',
              cursor: 'pointer',
              flex: 1,
              position: 'relative',
              transition: 'all 0.18s ease',
            }}
          >
            {isActive && (
              <span style={{
                position: 'absolute',
                top: 0,
                width: '24px',
                height: '3px',
                backgroundColor: '#10b981',
                borderRadius: '99px',
                boxShadow: '0 0 10px #10b981',
              }} />
            )}
            <Icon size={20} color={isActive ? '#10b981' : '#64748b'} />
            <span style={{
              fontSize: '0.68rem',
              fontWeight: isActive ? 700 : 500,
              letterSpacing: '-0.01em',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Botón Logout Compacto en Móvil */}
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          title="Cerrar Sesión"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            background: 'none',
            border: 'none',
            padding: '0.35rem 0.5rem',
            color: '#ef4444',
            cursor: 'pointer',
            flex: 0.8,
          }}
        >
          <LogOut size={18} color="#ef4444" />
          <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Salir</span>
        </button>
      )}
    </nav>
  );
};
