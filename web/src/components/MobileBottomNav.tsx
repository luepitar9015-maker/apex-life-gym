import React from 'react';
import { 
  LayoutDashboard, 
  QrCode, 
  ShieldCheck, 
  Key, 
  Menu,
  Leaf,
  Dumbbell,
  Video,
  Home
} from 'lucide-react';
import { ColorTheme } from '../styles/themeConfig.js';
import { AuthUser } from '../services/api.js';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeSystem: 'gym' | 'tlc';
  onSwitchSystem: (sys: 'gym' | 'tlc') => void;
  currentTheme: ColorTheme;
  currentUser?: AuthUser | null;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  activeSystem,
  onSwitchSystem,
  currentTheme,
  currentUser,
  onOpenMenu,
}) => {
  const isSuperadmin = currentUser?.role === 'SUPERADMIN';

  const navItems = [
    {
      id: 'home',
      label: 'Mi Portal',
      icon: Home,
      active: currentView === 'home',
      onClick: () => onNavigate('home')
    },
    {
      id: 'tlc_video_ai',
      label: 'Video IA',
      icon: Video,
      active: currentView === 'tlc_video_ai',
      onClick: () => onNavigate('tlc_video_ai')
    },
    {
      id: 'tlc_contacts',
      label: 'Ley 1581',
      icon: ShieldCheck,
      active: currentView === 'tlc_contacts',
      onClick: () => onNavigate('tlc_contacts')
    },
    {
      id: isSuperadmin ? 'licenses' : 'tlc',
      label: isSuperadmin ? 'Licencias' : 'TLC Hub',
      icon: isSuperadmin ? Key : Leaf,
      active: isSuperadmin ? currentView === 'licenses' : currentView === 'tlc',
      onClick: () => {
        if (isSuperadmin) {
          onNavigate('licenses');
        } else {
          if (activeSystem !== 'tlc') onSwitchSystem('tlc');
          onNavigate('tlc');
        }
      }
    },
    {
      id: 'menu',
      label: 'Menú',
      icon: Menu,
      active: false,
      onClick: onOpenMenu
    }
  ];

  return (
    <nav 
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        background: 'rgba(7, 10, 18, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 890,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.6)',
      }}
    >
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = item.active;

        return (
          <button
            key={item.id}
            onClick={item.onClick}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              color: isActive ? currentTheme.primary : '#94a3b8',
              transition: 'all 0.15s ease',
              position: 'relative',
              outline: 'none',
            }}
          >
            {isActive && (
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '28px',
                  height: '3px',
                  background: currentTheme.primary,
                  borderRadius: '0 0 4px 4px',
                  boxShadow: `0 0 10px ${currentTheme.primaryGlow}`,
                }} 
              />
            )}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '26px',
                borderRadius: '8px',
                background: isActive ? `${currentTheme.primary}18` : 'transparent',
                transition: 'background 0.2s ease',
              }}
            >
              <IconComponent size={19} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span 
              style={{
                fontSize: '0.66rem',
                fontWeight: isActive ? 800 : 500,
                letterSpacing: '-0.01em',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
