import React, { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Dumbbell,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { api, DashboardData } from '../services/api';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectMemberForRenewal?: (memberId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onSelectMemberForRenewal }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Error cargando dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // Polling cada 15s para aforo en vivo
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={36} color="#10b981" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>Cargando telemetría del gimnasio...</p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalMembers: 0,
    activeMembers: 0,
    expiredMembers: 0,
    expiringSoonCount: 0,
    todayCheckIns: 0,
    currentInGym: 0,
    maxCapacity: 80,
    occupancyPercent: 0,
    todayRevenue: 0,
  };

  const occupancyColor =
    metrics.occupancyPercent > 85 ? '#ef4444' : metrics.occupancyPercent > 65 ? '#f59e0b' : '#10b981';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner & Quick Status */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={24} color="#10b981" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Centro de Mando • {data?.gymName || 'APEX GYM'}
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Control de acceso activo, caja sincronizada y telemetría de aforo en tiempo real.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onNavigate('checkin')}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
            }}
          >
            <UserCheck size={18} />
            <span>Check-in QR</span>
          </button>
          <button
            onClick={() => onNavigate('pos')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            Nueva Venta / Cobro
          </button>
        </div>
      </div>

      {/* Grid de Métricas Principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Aforo Actual Card */}
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Aforo en Sala
              </span>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ color: occupancyColor }}>{metrics.currentInGym}</span>
                <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>/ {metrics.maxCapacity} máx</span>
              </div>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: `${occupancyColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Users size={22} color={occupancyColor} />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
              <span style={{ color: '#94a3b8' }}>Capacidad Ocupada</span>
              <span style={{ fontWeight: 700, color: occupancyColor }}>{metrics.occupancyPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, metrics.occupancyPercent)}%`, height: '100%', backgroundColor: occupancyColor }} />
            </div>
          </div>
        </div>

        {/* Check-ins de Hoy */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Asistencias Hoy
              </span>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem' }}>
                {metrics.todayCheckIns}
              </div>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <UserCheck size={22} color="#06b6d4" />
            </div>
          </div>
          <div style={{ marginTop: '0.9rem', fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={15} />
            <span>Ingresos validados por QR</span>
          </div>
        </div>

        {/* Socios Activos */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Socios Activos
              </span>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem' }}>
                {metrics.activeMembers}
              </div>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Dumbbell size={22} color="#10b981" />
            </div>
          </div>
          <div style={{ marginTop: '0.9rem', fontSize: '0.78rem', color: '#94a3b8' }}>
            De <strong style={{ color: '#f1f5f9' }}>{metrics.totalMembers}</strong> socios registrados
          </div>
        </div>

        {/* Ingresos del Día */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Caja de Hoy
              </span>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem' }}>
                ${metrics.todayRevenue.toLocaleString('es-CO')}
              </div>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TrendingUp size={22} color="#8b5cf6" />
            </div>
          </div>
          <div style={{ marginTop: '0.9rem', fontSize: '0.78rem', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Membresías y pases diarios</span>
          </div>
        </div>
      </div>

      {/* Secciones Inferiores: Ocupación por Zonas & Alertas de Vencimiento */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Alerta de Socios Próximos a Vencer */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Próximos a Vencer (7 días)
              </h3>
            </div>
            <span style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              fontWeight: 700,
            }}>
              {metrics.expiringSoonCount} pendientes
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            {data?.expiringSoonMembers && data.expiringSoonMembers.length > 0 ? (
              data.expiringSoonMembers.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                    }}>
                      {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9' }}>
                        {member.firstName} {member.lastName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {member.currentPlan?.name || 'Plan'} • Doc: {member.documentNumber}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectMemberForRenewal) onSelectMemberForRenewal(member.id);
                      onNavigate('members');
                    }}
                    style={{
                      backgroundColor: '#f59e0b',
                      color: '#000000',
                      border: 'none',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    Renovar
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                <CheckCircleOutlineIcon />
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>No hay membresías por vencer esta semana.</p>
              </div>
            )}
          </div>
        </div>

        {/* Ocupación por Zonas */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Aforo por Salas y Zonas
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>En vivo</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data?.zones.map((zone) => {
              const pct = Math.round((zone.active / zone.capacity) * 100);
              return (
                <div key={zone.code} style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>{zone.name}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
                      {zone.active} / {zone.capacity} socios
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', backgroundColor: '#10b981' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accesos Recientes en Vivo */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Últimos Check-ins Registrados
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Historial de ingresos por torniquete y recepción
            </p>
          </div>
          <button
            onClick={() => onNavigate('checkin')}
            style={{
              background: 'none',
              border: 'none',
              color: '#10b981',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Ver todos los accesos <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Socio</th>
                <th style={{ padding: '0.75rem 1rem' }}>Documento</th>
                <th style={{ padding: '0.75rem 1rem' }}>Membresía</th>
                <th style={{ padding: '0.75rem 1rem' }}>Zona</th>
                <th style={{ padding: '0.75rem 1rem' }}>Hora</th>
                <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentCheckIns && data.recentCheckIns.length > 0 ? (
                data.recentCheckIns.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#f1f5f9' }}>
                      {item.member.firstName} {item.member.lastName}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>
                      {item.member.documentNumber}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>
                      {item.member.currentPlan?.name || 'Pase Regular'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        fontSize: '0.75rem',
                      }}>
                        {item.zone}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} color="#64748b" />
                        {new Date(item.checkInTime).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: item.status === 'GRANTED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: item.status === 'GRANTED' ? '#10b981' : '#ef4444',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                      }}>
                        {item.status === 'GRANTED' ? 'AUTORIZADO' : 'DENEGADO'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No se han registrado check-ins el día de hoy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CheckCircleOutlineIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
