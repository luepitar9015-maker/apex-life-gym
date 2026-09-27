import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, QrCode } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenQuickScan?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenQuickScan }) => {
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
          weekday: 'long',
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
      padding: '1.25rem 2rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.45rem 0.9rem',
          borderRadius: '10px',
        }}>
          <Clock size={16} color="#06b6d4" />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', fontVariantNumeric: 'tabular-nums' }}>
              {timeStr}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'capitalize' }}>
              {dateStr}
            </div>
          </div>
        </div>

        {/* Quick Scan Button */}
        {onOpenQuickScan && (
          <button
            onClick={onOpenQuickScan}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <QrCode size={18} />
            <span>Escanear Acceso</span>
          </button>
        )}

        {/* Backend Online Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0.45rem 0.8rem',
          borderRadius: '8px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: '#10b981',
        }}>
          <ShieldCheck size={15} />
          <span>Servidor OK</span>
        </div>
      </div>
    </header>
  );
};
