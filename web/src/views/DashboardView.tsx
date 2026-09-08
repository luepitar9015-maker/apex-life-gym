import React from 'react';
import { Users, DollarSign, Activity, Sparkles, ArrowUpRight, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const stats = [
    {
      title: 'Socios Activos',
      value: '342',
      change: '+14% vs mes anterior',
      positive: true,
      icon: Users,
      color: 'var(--primary)',
      bgGlow: 'rgba(16, 185, 129, 0.12)'
    },
    {
      title: 'Aforo en Tiempo Real',
      value: '38 / 100',
      change: 'Capacidad moderada (38%)',
      positive: true,
      icon: Activity,
      color: 'var(--accent-cyan)',
      bgGlow: 'rgba(6, 182, 212, 0.12)'
    },
    {
      title: 'Facturación Mensual',
      value: '$18,450',
      change: '+18.2% incremento',
      positive: true,
      icon: DollarSign,
      color: 'var(--accent-amber)',
      bgGlow: 'rgba(245, 158, 11, 0.12)'
    },
    {
      title: 'Escaneos Corporales IA',
      value: '87',
      change: '15 pendientes de revisión',
      positive: true,
      icon: Sparkles,
      color: 'var(--accent-purple)',
      bgGlow: 'rgba(139, 92, 246, 0.12)'
    },
  ];

  const recentAccesses = [
    {
      name: 'Juan Pérez',
      plan: 'Plan Black VIP + IA',
      time: 'Hace 4 minutos',
      status: 'ALLOWED',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop'
    },
    {
      name: 'Camila Gómez',
      plan: 'Plan Mensual Pro',
      time: 'Hace 12 minutos',
      status: 'ALLOWED',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop'
    },
    {
      name: 'Mateo Silva',
      plan: 'Plan Básico (VENCIDO)',
      time: 'Hace 25 minutos',
      status: 'DENIED',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop'
    },
    {
      name: 'Sofía Reyes',
      plan: 'Plan Black VIP + IA',
      time: 'Hace 38 minutos',
      status: 'ALLOWED',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop'
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <span className="badge badge-active" style={{ marginBottom: '0.75rem' }}>
            Plataforma Operativa
          </span>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>
            Centro de Control Gimnasio de Alto Rendimiento
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', fontSize: '0.95rem' }}>
            Supervisa socios, valida accesos QR, programa rutinas con sobrecarga progresiva y realiza diagnósticos corporales con Inteligencia Artificial.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => onNavigate('checkin')}>
            Abrir Recepción QR
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('aiscan')}>
            <Sparkles size={16} color="var(--primary)" />
            Nuevo Escaneo IA
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card glass-card-glow" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {stat.title}
                  </p>
                  <h3 style={{ fontSize: '1.9rem', color: '#fff', marginTop: '0.25rem' }}>
                    {stat.value}
                  </h3>
                </div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: stat.bgGlow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${stat.color}30`
                }}>
                  <Icon size={22} color={stat.color} />
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: stat.positive ? 'var(--primary)' : 'var(--accent-rose)',
                fontWeight: 600,
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.75rem'
              }}>
                <ArrowUpRight size={14} />
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Column Section: Afluencia & Accesos Recientes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
        {/* Afluencia Horas Pico */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Afluencia de Socios por Horas</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Horas de mayor demanda en las instalaciones</p>
            </div>
            <span className="badge badge-cyan">Hoy en vivo</span>
          </div>

          {/* Gráfico de barras estilizado */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', padding: '0 0.5rem' }}>
            {[
              { hour: '06:00', val: 75 },
              { hour: '08:00', val: 90 },
              { hour: '10:00', val: 40 },
              { hour: '12:00', val: 35 },
              { hour: '14:00', val: 25 },
              { hour: '16:00', val: 60 },
              { hour: '18:00', val: 95 },
              { hour: '20:00', val: 80 },
              { hour: '22:00', val: 30 },
            ].map((bar, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dark)' }}>{bar.val}%</span>
                <div style={{
                  width: '24px',
                  height: `${bar.val * 1.3}px`,
                  background: bar.val > 80 
                    ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: bar.val > 80 ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none'
                }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{bar.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos Recientes */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Últimos Check-ins</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Control de aforo en torniquete</p>
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => onNavigate('checkin')}>
              Ver todos
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentAccesses.map((acc, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={acc.avatar} alt={acc.name} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{acc.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{acc.plan}</p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {acc.status === 'ALLOWED' ? (
                    <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={12} /> Permitido
                    </span>
                  ) : (
                    <span className="badge badge-expired" style={{ fontSize: '0.7rem' }}>
                      <XCircle size={12} /> Denegado
                    </span>
                  )}
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-dark)', marginTop: '0.2rem' }}>{acc.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
