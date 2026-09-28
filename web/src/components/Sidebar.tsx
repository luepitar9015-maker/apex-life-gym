import React from 'react';
import {
  LayoutDashboard,
  QrCode,
  Users,
  CreditCard,
  Dumbbell,
  Sliders,
  Flame,
  Activity,
  User,
  Shield,
  HeartPulse,
  Building2,
  X,
} from 'lucide-react';

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'TRAINER' | 'MEMBER';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  aforoInfo?: { current: number; max: number; percent: number };
  activeRole: UserRole;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  aforoInfo,
  activeRole,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const getNavItems = () => {
    if (activeRole === 'SUPERADMIN') {
      return [
        { id: 'superadmin', label: 'Consola Superusuario', icon: Shield, badge: 'SaaS' },
        { id: 'diagnostic', label: 'Diagnóstico IA & Alimentos', icon: HeartPulse, badge: 'IA' },
        { id: 'dashboard', label: 'Telemetría de Sedes', icon: LayoutDashboard, badge: null },
        { id: 'members', label: 'Socios Globales', icon: Users, badge: null },
        { id: 'routines', label: 'Catálogo de Rutinas', icon: Dumbbell, badge: null },
      ];
    }

    if (activeRole === 'TRAINER') {
      return [
        { id: 'trainer', label: 'Panel del Entrenador', icon: Dumbbell, badge: 'Coach' },
        { id: 'diagnostic', label: 'Diagnóstico IA & Alimentos', icon: HeartPulse, badge: 'IA' },
        { id: 'routines', label: 'Rutinas & Biomecánica', icon: Activity, badge: null },
        { id: 'members', label: 'Directorio de Atletas', icon: Users, badge: null },
      ];
    }

    if (activeRole === 'MEMBER') {
      return [
        { id: 'affiliate', label: 'Mi Carnet & Portal', icon: QrCode, badge: 'Socio' },
        { id: 'diagnostic', label: 'Mi Diagnóstico & Dieta', icon: HeartPulse, badge: 'IA' },
        { id: 'routines', label: 'Mi Plan de Ejercicios', icon: Dumbbell, badge: null },
      ];
    }

    // Default: ADMIN
    return [
      { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard, badge: null },
      { id: 'diagnostic', label: 'Diagnóstico IA & Alimentos', icon: HeartPulse, badge: 'IA' },
      { id: 'checkin', label: 'Recepción & QR', icon: QrCode, badge: 'En vivo' },
      { id: 'members', label: 'Directorio de Socios', icon: Users, badge: null },
      { id: 'pos', label: 'Caja & Cobros', icon: CreditCard, badge: null },
      { id: 'routines', label: 'Rutinas & Ejercicios', icon: Dumbbell, badge: null },
      { id: 'aforo', label: 'Control de Aforo', icon: Activity, badge: null },
      { id: 'settings', label: 'Configuración', icon: Sliders, badge: null },
    ];
  };

  const navItems = getNavItems();

  const getRoleLabel = () => {
    switch (activeRole) {
      case 'SUPERADMIN':
        return { title: 'Superusuario SaaS', subtitle: 'Control Multi-Gimnasio', color: '#a855f7', initial: 'SU' };
      case 'ADMIN':
        return { title: 'Administrador GYM', subtitle: 'Control Total & Caja', color: '#10b981', initial: 'AD' };
      case 'TRAINER':
        return { title: 'Coach Laura Gómez', subtitle: 'Entrenador de Sala', color: '#06b6d4', initial: 'LG' };
      case 'MEMBER':
        return { title: 'Mateo Giraldo', subtitle: 'Afiliado Pro (GYM-1001)', color: '#8b5cf6', initial: 'MG' };
    }
  };

  const roleInfo = getRoleLabel();

  const handleItemClick = (viewId: string) => {
    onNavigate(viewId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Backdrop para móvil */}
      {isOpenMobile && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpenMobile ? 'mobile-open' : ''}`} style={{
        width: '270px',
        backgroundColor: '#0a0e17',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '1.5rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
            }}>
              <Flame size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  APEX<span style={{ color: '#10b981' }}>GYM</span>
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Mobile & SaaS Edition
              </span>
            </div>
          </div>

          {/* Botón cerrar para móvil */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="mobile-drawer-close"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                borderRadius: '8px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Live Aforo Badge (Admin / Coach / SuperAdmin) */}
        {aforoInfo && activeRole !== 'MEMBER' && (
          <div style={{
            margin: '1rem 1rem 0.5rem 1rem',
            padding: '0.75rem 0.85rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                Aforo en Sala
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
                {aforoInfo.current} / {aforoInfo.max}
              </span>
            </div>
            <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, aforoInfo.percent)}%`,
                height: '100%',
                backgroundColor: aforoInfo.percent > 85 ? '#ef4444' : aforoInfo.percent > 65 ? '#f59e0b' : '#10b981',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                  color: isActive ? '#10b981' : '#94a3b8',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.18s ease',
                  position: 'relative',
                }}
              >
                <Icon size={19} color={isActive ? '#10b981' : '#64748b'} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '2px 7px',
                    borderRadius: '6px',
                    backgroundColor: item.badge === 'SaaS' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(16, 185, 129, 0.2)',
                    color: item.badge === 'SaaS' ? '#c084fc' : '#10b981',
                    fontWeight: 700,
                  }}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '18%',
                    bottom: '18%',
                    width: '3.5px',
                    backgroundColor: '#10b981',
                    borderRadius: '0 4px 4px 0',
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Active User Card at Bottom */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: `${roleInfo.color}25`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: roleInfo.color,
            fontSize: '0.82rem',
            border: `1px solid ${roleInfo.color}50`,
          }}>
            {roleInfo.initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {roleInfo.title}
            </div>
            <div style={{ fontSize: '0.7rem', color: roleInfo.color, fontWeight: 600 }}>
              {roleInfo.subtitle}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
