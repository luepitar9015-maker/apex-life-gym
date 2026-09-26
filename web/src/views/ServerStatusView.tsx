import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Server, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Terminal, 
  HardDrive,
  Trash2,
  Radio,
  Play
} from 'lucide-react';
import { fetchServerStatus, pingServerDatabase, purgeServerMemoryCache, ServerStatusData } from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface ServerStatusViewProps {
  currentTheme?: ColorTheme;
}

export const ServerStatusView: React.FC<ServerStatusViewProps> = ({ 
  currentTheme = getSavedTheme() 
}) => {
  const [status, setStatus] = useState<ServerStatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [pingResult, setPingResult] = useState<{ latencyMs: number; message: string } | null>(null);
  const [pinging, setPinging] = useState(false);
  const [purging, setPurging] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadStatus();

    let interval: any = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadStatus(true);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadStatus = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await fetchServerStatus();
      setStatus(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handlePingDb = async () => {
    setPinging(true);
    try {
      const res = await pingServerDatabase();
      setPingResult({ latencyMs: res.data?.latencyMs || 4, message: res.data?.message || 'DB Online' });
      loadStatus(true);
    } finally {
      setPinging(false);
    }
  };

  const handlePurgeCache = async () => {
    setPurging(true);
    try {
      await purgeServerMemoryCache();
      loadStatus(true);
    } finally {
      setPurging(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* HERO BANNER ESTILO NEXO */}
      <div style={{
        background: currentTheme.bannerGradient,
        borderRadius: '18px',
        padding: '2.5rem 3rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: `0 14px 40px ${currentTheme.primaryGlow}`,
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '620px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{
              background: '#000000',
              color: currentTheme.primary,
              fontWeight: 900,
              fontSize: '0.72rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              % TELEMETRÍA DE INFRAESTRUCTURA & CORE
            </span>
            <span style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.82rem', fontWeight: 700 }}>
              Monitoreo en Tiempo Real 24/7
            </span>
          </div>

          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 900,
            color: '#070a12',
            margin: '0.2rem 0',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
          }}>
            ESTADO DEL <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>SERVIDOR</span>
          </h1>

          <p style={{
            color: 'rgba(7, 10, 18, 0.85)',
            fontSize: '0.92rem',
            fontWeight: 600,
            margin: '0.4rem 0 0 0',
            lineHeight: 1.4,
          }}>
            Salud de servicios Express, motor PostgreSQL + Prisma ORM, consumo de memoria RAM, carga de CPU y latencia de red.
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handlePingDb}
              disabled={pinging}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#070a12',
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1.35rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.35)',
              }}
            >
              <Zap size={16} color={currentTheme.primary} />
              <span>{pinging ? 'Midiendo Latencia...' : 'Probar Latencia DB'}</span>
            </button>

            <button
              onClick={handlePurgeCache}
              disabled={purging}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(255, 255, 255, 0.85)',
                color: '#070a12',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '0.65rem 1.15rem',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={15} />
              <span>{purging ? 'Purgando...' : 'Purgar Caché'}</span>
            </button>

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: autoRefresh ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0, 0, 0, 0.4)',
                color: autoRefresh ? '#10b981' : '#ffffff',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '0.65rem 1.15rem',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              <Radio size={15} />
              <span>Auto-Refresco: {autoRefresh ? '5s ACTIVO' : 'PAUSADO'}</span>
            </button>
          </div>
        </div>

        {/* Card de Uptime & Latencia en Banner */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(7, 10, 18, 0.88)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          padding: '1.25rem 1.6rem',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          minWidth: '220px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>SISTEMA EN LÍNEA</span>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>TIEMPO DE ACTIVIDAD (UPTIME)</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>
              {status?.uptimeFormatted || 'Calculando...'}
            </div>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.4rem' }}>
            Último pulso: <strong>{lastUpdated.toLocaleTimeString()}</strong>
          </div>
        </div>
      </div>

      {/* METRICAS PRINCIPALES: CPU, RAM, BASE DE DATOS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {/* Tarjeta 1: CPU y Carga */}
        <div style={{
          background: '#0a0f1d',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color={currentTheme.primary} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>Procesador & CPU</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, background: 'rgba(16,185,129,0.15)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
              {status?.cpu.cores || 8} NÚCLEOS
            </span>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            {status?.cpu.model || 'CPU Host'}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <span style={{ color: '#94a3b8' }}>Load Averages (1m, 5m, 15m):</span>
            <span style={{ color: '#cbd5e1', fontWeight: 700, fontFamily: 'monospace' }}>
              {status?.cpu.loadAverage.map(n => n.toFixed(2)).join(' • ') || '0.12 • 0.25 • 0.18'}
            </span>
          </div>
        </div>

        {/* Tarjeta 2: Memoria RAM */}
        <div style={{
          background: '#0a0f1d',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HardDrive size={18} color="#06b6d4" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>Memoria RAM (Sistema & Heap)</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#06b6d4', fontWeight: 800, background: 'rgba(6,182,212,0.15)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
              {status?.memory.usedSystemPercent || 50}% EN USO
            </span>
          </div>

          {/* Barra de progreso */}
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              width: `${status?.memory.usedSystemPercent || 50}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #06b6d4 0%, #10b981 100%)',
              borderRadius: '999px',
            }} />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1' }}>
            <span>Node Heap Usado: <strong style={{ color: '#06b6d4' }}>{status?.memory.processHeapUsedMB || 45} MB</strong></span>
            <span>RSS Total: <strong style={{ color: '#ffffff' }}>{status?.memory.processRssMB || 88} MB</strong></span>
          </div>
        </div>

        {/* Tarjeta 3: PostgreSQL Database */}
        <div style={{
          background: '#0a0f1d',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} color="#a855f7" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>Base de Datos Relacional</span>
            </div>
            <span style={{
              fontSize: '0.7rem',
              color: status?.database.status === 'ONLINE' ? '#10b981' : '#facc15',
              fontWeight: 800,
              background: status?.database.status === 'ONLINE' ? 'rgba(16,185,129,0.15)' : 'rgba(250,204,21,0.15)',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
            }}>
              {status?.database.status || 'ONLINE'}
            </span>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Motor: <strong style={{ color: '#ffffff' }}>PostgreSQL 16</strong> con Prisma ORM
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1' }}>
            <span>Latencia Query: <strong style={{ color: '#a855f7' }}>{status?.database.latencyMs || 2} ms</strong></span>
            {pingResult && (
              <span style={{ color: '#10b981', fontWeight: 700 }}>Ping: {pingResult.latencyMs}ms ✓</span>
            )}
          </div>
        </div>
      </div>

      {/* ESTADO DETALLADO DE SERVICIOS CORE */}
      <div style={{
        background: '#0a0f1d',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={17} color={currentTheme.primary} />
            <span style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 800 }}>
              SERVICIOS DEL ECOSISTEMA APEX LIFE ({status?.services.length || 6})
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            Plataforma: <strong>{status?.host.platform} ({status?.host.arch})</strong> • Node: <strong>{status?.host.nodeVersion}</strong>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
          {status?.services.map((svc) => (
            <div
              key={svc.id}
              style={{
                background: '#0a0f1d',
                padding: '1.15rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.84rem' }}>
                  {svc.name}
                </span>
                <span style={{
                  background: svc.status === 'ONLINE' ? 'rgba(16,185,129,0.15)' : 'rgba(250,204,21,0.15)',
                  color: svc.status === 'ONLINE' ? '#10b981' : '#facc15',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                }}>
                  {svc.status} • {svc.latencyMs}ms
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.3 }}>
                {svc.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ServerStatusView;
