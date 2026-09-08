import React from 'react';
import { Search, Bell, Shield, Activity } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header style={{
      height: '75px',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(9, 13, 22, 0.7)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Title & Subtitle */}
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Aforo en vivo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 0.85rem',
          borderRadius: '999px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            display: 'inline-block'
          }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>
            Aforo Actual: 38 / 100
          </span>
        </div>

        {/* Notificaciones */}
        <button style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-muted)'
        }}>
          <Bell size={18} />
        </button>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"
            alt="Admin"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '2px solid var(--primary)'
            }}
          />
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Carlos Admin</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>Super Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
};
