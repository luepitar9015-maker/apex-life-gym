import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Plus,
  Minus,
} from 'lucide-react';
import { api, DashboardData } from '../services/api';

export const AforoView: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [zones, setZones] = useState([
    { name: 'Sala de Musculación / Pesas', code: 'PESAS', capacity: 35, active: 12 },
    { name: 'Zona de Cardio & Cintas', code: 'CARDIO', capacity: 25, active: 6 },
    { name: 'Salón Funcional / Clases', code: 'CLASES', capacity: 20, active: 4 },
  ]);

  const loadData = async () => {
    try {
      const res = await api.getDashboard();
      setData(res);
      if (res.zones && res.zones.length > 0) {
        setZones(res.zones);
      }
    } catch (err) {
      console.error('Error cargando aforo:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalActive = zones.reduce((sum, z) => sum + z.active, 0);
  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
  const totalPercent = Math.min(100, Math.round((totalActive / totalCapacity) * 100));

  const handleAdjustZone = (index: number, delta: number) => {
    setZones((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        active: Math.max(0, Math.min(updated[index].capacity, updated[index].active + delta)),
      };
      return updated;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Info */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={24} color="#10b981" />
              <span>Control Integral de Aforo & Salas</span>
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Monitoreo perimétrico de salas, afluencia horaria y prevención de sobrecupo.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Ocupación Global</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: totalPercent > 80 ? '#ef4444' : '#10b981' }}>
                {totalActive} / {totalCapacity} socios
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Salas y Zonas con Controles Manuales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}>
        {zones.map((zone, idx) => {
          const pct = Math.round((zone.active / zone.capacity) * 100);
          const color = pct > 85 ? '#ef4444' : pct > 65 ? '#f59e0b' : '#10b981';

          return (
            <div key={zone.code} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    {zone.name}
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>CÓDIGO: {zone.code}</span>
                </div>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: `${color}20`,
                  color: color,
                  fontWeight: 800,
                  fontSize: '0.75rem',
                }}>
                  {pct}% OCUPADO
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', backgroundColor: color, transition: 'width 0.3s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                  <span>{zone.active} personas dentro</span>
                  <span>Capacidad: {zone.capacity}</span>
                </div>
              </div>

              {/* Controles de Ajuste Manual */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Ajuste en Sala:</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleAdjustZone(idx, -1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Minus size={15} />
                  </button>
                  <button
                    onClick={() => handleAdjustZone(idx, 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Horarios Pico Estimados */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="#06b6d4" />
          <span>Distribución Estimada de Afluencia por Horario</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {[
            { hour: '05:00 - 08:00', level: 'ALTO (Pico Matutino)', pct: 85, color: '#f59e0b' },
            { hour: '08:00 - 12:00', level: 'MODERADO', pct: 45, color: '#10b981' },
            { hour: '12:00 - 15:00', level: 'MEDIO', pct: 60, color: '#06b6d4' },
            { hour: '15:00 - 18:00', level: 'MODERADO', pct: 50, color: '#10b981' },
            { hour: '18:00 - 21:00', level: 'MÁXIMO (Pico Tarde)', pct: 95, color: '#ef4444' },
            { hour: '21:00 - 22:00', level: 'BAJO', pct: 25, color: '#64748b' },
          ].map((h) => (
            <div key={h.hour} style={{
              padding: '0.85rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>{h.hour}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: h.color, marginTop: '4px' }}>{h.level}</div>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${h.pct}%`, height: '100%', backgroundColor: h.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
