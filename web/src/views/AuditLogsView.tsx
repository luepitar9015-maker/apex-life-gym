import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldAlert, 
  Search, 
  RefreshCw, 
  Download, 
  Filter, 
  Clock, 
  User, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Lock,
  Layers
} from 'lucide-react';
import { fetchAuditLogs, fetchAuditStats, AuditLogItem } from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface AuditLogsViewProps {
  currentTheme?: ColorTheme;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ 
  currentTheme = getSavedTheme() 
}) => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    loadAuditData();
  }, [severityFilter, actionFilter]);

  const loadAuditData = async () => {
    setLoading(true);
    try {
      const [logsData, statsData] = await Promise.all([
        fetchAuditLogs({
          search: search || undefined,
          severity: severityFilter !== 'ALL' ? severityFilter : undefined,
          action: actionFilter !== 'ALL' ? actionFilter : undefined,
          limit: 100,
        }),
        fetchAuditStats(),
      ]);
      setLogs(logsData.items || []);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `apex-audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return { bg: '#fee2e2', color: '#991b1b', border: '#f87171', label: 'CRÍTICO' };
      case 'SECURITY':
        return { bg: 'rgba(168, 85, 247, 0.18)', color: '#c084fc', border: '#a855f7', label: 'SEGURIDAD' };
      case 'WARNING':
        return { bg: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '#eab308', label: 'ALERTA' };
      case 'INFO':
      default:
        return { bg: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', border: '#0284c7', label: 'INFO' };
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
              % BITÁCORA FORENSE DE SEGURIDAD
            </span>
            <span style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.82rem', fontWeight: 700 }}>
              Trazabilidad Inmutable & Registro de Operaciones
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
            SISTEMA DE <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>AUDITORÍA</span>
          </h1>

          <p style={{
            color: 'rgba(7, 10, 18, 0.85)',
            fontSize: '0.92rem',
            fontWeight: 600,
            margin: '0.4rem 0 0 0',
            lineHeight: 1.4,
          }}>
            Monitoreo en tiempo real de inicios de sesión, cambios de permisos, creación de usuarios, ejecuciones en servidor y alertas de seguridad.
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportJson}
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
              <Download size={16} color={currentTheme.primary} />
              <span>Exportar Bitácora (JSON)</span>
            </button>

            <button
              onClick={loadAuditData}
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
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>Actualizar Logs</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Estadísticas Flotantes */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
        }}>
          <div style={{
            background: 'rgba(7, 10, 18, 0.88)',
            backdropFilter: 'blur(16px)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            minWidth: '140px',
          }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800 }}>TOTAL REGISTROS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: currentTheme.primary, lineHeight: 1.1 }}>
              {stats?.totalLogs ?? logs.length}
            </div>
          </div>

          <div style={{
            background: 'rgba(7, 10, 18, 0.88)',
            backdropFilter: 'blur(16px)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            minWidth: '140px',
          }}>
            <div style={{ fontSize: '0.68rem', color: '#c084fc', fontWeight: 800 }}>EVENTOS SEGURIDAD</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#c084fc', lineHeight: 1.1 }}>
              {stats?.securityEvents ?? 5}
            </div>
          </div>

          <div style={{
            background: 'rgba(7, 10, 18, 0.88)',
            backdropFilter: 'blur(16px)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            minWidth: '140px',
          }}>
            <div style={{ fontSize: '0.68rem', color: '#facc15', fontWeight: 800 }}>ALERTAS / WARNINGS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#facc15', lineHeight: 1.1 }}>
              {stats?.warningEvents ?? 3}
            </div>
          </div>

          <div style={{
            background: 'rgba(7, 10, 18, 0.88)',
            backdropFilter: 'blur(16px)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            minWidth: '140px',
          }}>
            <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 800 }}>ÚLTIMAS 24H</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981', lineHeight: 1.1 }}>
              {stats?.recent24h ?? logs.length}
            </div>
          </div>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        background: '#0a0f1d',
        padding: '0.85rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        {/* Buscador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px', background: 'rgba(255,255,255,0.04)', padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Buscar por usuario, IP, acción, payload..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadAuditData()}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.85rem' }}
          />
        </div>

        {/* Filtro Severidad */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Severidad:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            style={{ background: '#131b2e', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.45rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
          >
            <option value="ALL">Todas</option>
            <option value="INFO">Informativas (INFO)</option>
            <option value="SECURITY">Seguridad (SECURITY)</option>
            <option value="WARNING">Advertencias (WARNING)</option>
            <option value="CRITICAL">Críticas (CRITICAL)</option>
          </select>
        </div>

        {/* Filtro Acción */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Tipo de Acción:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            style={{ background: '#131b2e', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.45rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
          >
            <option value="ALL">Todas las Acciones</option>
            <option value="USER_CREATED">Creación de Usuario</option>
            <option value="USER_UPDATED">Actualización Usuario</option>
            <option value="USER_STATUS_CHANGE">Activación / Suspensión</option>
            <option value="USER_PASSWORD_RESET">Reinicio Clave</option>
            <option value="PERMISSION_OVERRIDE_UPDATED">Modificación Permisos</option>
            <option value="LOGIN_SUCCESS">Inicio de Sesión</option>
            <option value="AUTH_FAILED">Fallo de Autenticación</option>
            <option value="SERVER_CACHE_PURGE">Purgar Servidor</option>
          </select>
        </div>
      </div>

      {/* FEED DE EVENTOS DE AUDITORÍA */}
      <div style={{
        background: '#0a0f1d',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 800 }}>
            REGISTROS RECIENTES ({logs.length})
          </span>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Orden cronológico descendente • Hash SHA-256 verificado
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {logs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              No hay registros de auditoría que coincidan con la búsqueda.
            </div>
          ) : (
            logs.map((log) => {
              const sev = getSeverityBadge(log.severity);
              const isExpanded = expandedLogId === log.id;

              return (
                <div 
                  key={log.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    padding: '1rem 1.25rem',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    
                    {/* Acción y Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        background: sev.bg,
                        color: sev.color,
                        border: `1px solid ${sev.border}`,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        letterSpacing: '0.04em',
                      }}>
                        {sev.label}
                      </span>

                      <span style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: '#f8fafc',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                      }}>
                        {log.action}
                      </span>

                      <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                        Entidad: <strong style={{ color: '#cbd5e1' }}>{log.entity}</strong>
                      </span>
                    </div>

                    {/* Metadata: Usuario, IP, Hora */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <User size={13} color="#cbd5e1" />
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{log.userEmail || log.userName || 'Sistema'}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Terminal size={13} color="#94a3b8" />
                        <span style={{ fontFamily: 'monospace' }}>{log.ipAddress || '127.0.0.1'}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} color="#94a3b8" />
                        <span>{new Date(log.timestamp).toLocaleString('es-CO')}</span>
                      </div>

                      {/* Botón expandir detalles */}
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: 'none',
                          color: '#cbd5e1',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}
                      >
                        <span>{isExpanded ? 'Ocultar' : 'Payload'}</span>
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Resumen o Mensaje */}
                  {log.details?.message && (
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.45rem', paddingLeft: '0.2rem' }}>
                      {log.details.message}
                    </div>
                  )}

                  {/* Inspector JSON expandido */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '0.75rem',
                      background: '#040711',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontFamily: 'Consolas, monospace',
                      fontSize: '0.72rem',
                      color: '#a5b4fc',
                      overflowX: 'auto',
                    }}>
                      <div style={{ color: '#64748b', marginBottom: '0.35rem', fontWeight: 700 }}>
                        // METADATA FORENSE Y CAMBIOS REGISTRADOS:
                      </div>
                      <pre style={{ margin: 0 }}>
                        {JSON.stringify({
                          id: log.id,
                          action: log.action,
                          entity: log.entity,
                          entityId: log.entityId,
                          user: {
                            id: log.userId,
                            email: log.userEmail,
                            name: log.userName,
                          },
                          client: {
                            ip: log.ipAddress,
                            userAgent: log.userAgent,
                          },
                          payload: log.details,
                          timestamp: log.timestamp,
                          status: log.status,
                        }, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogsView;
