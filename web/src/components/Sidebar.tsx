import React from 'react';
import { 
  LayoutDashboard, 
  QrCode, 
  Users, 
  Sparkles, 
  Dumbbell, 
  UtensilsCrossed, 
  Activity,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'checkin', label: 'Recepción & QR', icon: QrCode, badge: 'En vivo' },
    { id: 'members', label: 'Socios & Membresías', icon: Users },
    { id: 'aiscan', label: 'Escaneo Corporal IA', icon: Sparkles, highlight: true },
    { id: 'routines', label: 'Rutinas & Ejercicios', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrición & Macros', icon: UtensilsCrossed },
  ];

  return (
    <aside style={{
      width: '280px',
      background: 'rgba(10, 15, 29, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
        }}>
          <Activity size={24} color="#ffffff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            GYM FIT <span style={{ color: 'var(--primary)' }}>AI</span>
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Panel Administrativo</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        <p style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-dark)',
          padding: '0 0.75rem 0.5rem'
        }}>
          Navegación Principal
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive 
                  ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)' 
                  : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-display)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.92rem',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Icon size={20} color={isActive ? 'var(--primary)' : 'currentColor'} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '999px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--accent-cyan)',
                  fontWeight: 700,
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}>
                  {item.badge}
                </span>
              )}

              {item.highlight && !isActive && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '999px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--primary)',
                  fontWeight: 700
                }}>
                  IA
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#10b981',
          boxShadow: '0 0 10px #10b981'
        }} />
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>Servidor Backend</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>Puerto 4000 • En línea</p>
        </div>
      </div>
    </aside>
  );
};
