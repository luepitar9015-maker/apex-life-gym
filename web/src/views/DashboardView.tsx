import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Activity, 
  Sparkles, 
  Download, 
  Eye, 
  Calendar, 
  ChevronDown, 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  QrCode, 
  TrendingUp,
  Unlock,
  Lock,
  Dumbbell
} from 'lucide-react';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  currentTheme?: ColorTheme;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, currentTheme = getSavedTheme() }) => {
  const [selectedStrategy, setSelectedStrategy] = useState('Plan Mensual & Anual');
  const [dateRange, setDateRange] = useState('13/09/2026 - 19/09/2026');
  const [selectedTerminal, setSelectedTerminal] = useState('Terminal Principal QR (T1)');
  const [showEmptyNotice, setShowEmptyNotice] = useState(false);

  const accesses = [
    {
      id: 'ACC-81920',
      login: '10987654',
      name: 'Juan Pérez',
      plan: 'Plan Black VIP + IA',
      method: 'QR Virtual',
      amount: '$65.00',
      status: 'PERMITIDO',
      time: 'Sep 22, 2026, 07:14 PM',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop'
    },
    {
      id: 'ACC-81919',
      login: '98765432',
      name: 'Camila Gómez',
      plan: 'Plan Mensual Pro',
      method: 'QR Virtual',
      amount: '$45.00',
      status: 'PERMITIDO',
      time: 'Sep 22, 2026, 06:52 PM',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop'
    },
    {
      id: 'ACC-81918',
      login: '11223344',
      name: 'Mateo Silva',
      plan: 'Plan Básico (Vencido)',
      method: 'DNI Manual',
      amount: '$0.00',
      status: 'DENEGADO',
      time: 'Sep 22, 2026, 06:30 PM',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop'
    },
    {
      id: 'ACC-81917',
      login: '55443322',
      name: 'Sofía Reyes',
      plan: 'Plan Black VIP + IA',
      method: 'QR Virtual',
      amount: '$65.00',
      status: 'PERMITIDO',
      time: 'Sep 22, 2026, 05:45 PM',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop'
    },
    {
      id: 'ACC-81916',
      login: '77889900',
      name: 'Carlos Mendoza',
      plan: 'Pase Semanal Cross',
      method: 'QR Virtual',
      amount: '$20.00',
      status: 'PERMITIDO',
      time: 'Sep 22, 2026, 04:20 PM',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop'
    }
  ];

  const handleExportCSV = () => {
    const headers = ['Access ID,Documento,Socio,Plan,Metodo,Valor,Estado,Hora'];
    const rows = accesses.map(a => `${a.id},${a.login},"${a.name}","${a.plan}",${a.method},${a.amount},${a.status},"${a.time}"`);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `Accesos_Gym_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER ESTILO NEXO: VIBRANTE + WIDGET FLOTANTE + GYM-AI */}
      {/* ------------------------------------------------------------- */}
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
        {/* Patrón geométrico diagonal cortado */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.22,
          backgroundImage: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(225deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(315deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(45deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%)
          `,
          backgroundSize: '90px 90px',
          backgroundPosition: '0 0, 45px 0, 45px -45px, 0px 45px',
          pointerEvents: 'none',
        }} />

        {/* Título Izquierda */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: '3.4rem',
            fontWeight: 900,
            fontStyle: 'italic',
            color: '#0a0f1d',
            lineHeight: 1.02,
            margin: 0,
            letterSpacing: '-0.035em',
          }}>
            Gym Fit<br />Overview
          </h1>
        </div>

        {/* Widget Negro Inset: Aforo en Tiempo Real + Capacidad Desbloqueada */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          background: '#070a12',
          borderRadius: '16px',
          padding: '1.2rem 1.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.6rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          {/* Barra de progreso de Aforo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', minWidth: '210px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
                # Aforo Ocupado en Sala
              </span>
              <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 800 }}>
                38/100 (38%)
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: '#1e293b',
              borderRadius: '999px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: '38%',
                height: '100%',
                background: currentTheme.primary,
                boxShadow: `0 0 10px ${currentTheme.primary}`,
                borderRadius: '999px',
              }} />
            </div>
          </div>

          <div style={{ width: '1px', height: '42px', background: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Socios Activos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: currentTheme.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 16px ${currentTheme.primaryGlow}`,
            }}>
              <Unlock size={20} color="#000000" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.15 }}>Socios<br />activos</div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginLeft: '0.2rem' }}>
              342
            </div>
          </div>

          <div style={{ width: '1px', height: '42px', background: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Capacidad Libre */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#1a2234',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <Activity size={18} color="#64748b" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.15 }}>Cupos<br />libres</div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#64748b', marginLeft: '0.2rem' }}>
              62
            </div>
          </div>
        </div>

        {/* Branding Marca Derecha */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          fontSize: '3.6rem',
          fontWeight: 900,
          fontStyle: 'italic',
          color: '#ffffff',
          letterSpacing: '-0.04em',
          textShadow: '0 4px 15px rgba(0,0,0,0.12)',
        }}>
          GYM-AI
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PROFIT & REVENUE OVERVIEW CARD */}
      {/* ------------------------------------------------------------- */}
      <section style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.35rem 1.65rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.02)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Ingresos & Rendimiento Operativo
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
              Facturación de membresías y cuotas para el periodo {dateRange}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.42rem 0.85rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#334155',
              cursor: 'pointer',
            }}>
              <Calendar size={13} color="#64748b" />
              <span>{selectedStrategy}</span>
              <ChevronDown size={13} color="#64748b" />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.42rem 0.85rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
            }}>
              <Calendar size={13} color="#64748b" />
              <span>{dateRange}</span>
            </div>

            <button
              onClick={handleExportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.42rem 0.9rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              <Download size={13} />
              <span>Descargar Reporte</span>
            </button>

            <button
              onClick={() => setShowEmptyNotice(!showEmptyNotice)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.42rem 0.9rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              <Eye size={13} />
              <span>Ver Métricas</span>
            </button>
          </div>
        </div>

        {/* Métricas en Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          padding: '1.25rem',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Facturación del Mes</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: currentTheme.primary }}>$18,450.00 USD</div>
            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>+18.2% vs mes anterior</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Planes Black VIP + IA</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>184 Socios</div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Membresía más vendida</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Escaneos Corporales IA</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>87 Realizados</div>
            <span style={{ fontSize: '0.72rem', color: currentTheme.primary, fontWeight: 600 }}>15 diagnósticos hoy</span>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Check-ins de Hoy</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>142 Accesos</div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>98.2% con QR Virtual</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* ACCESS & TRANSACTION HISTORY CARD */}
      {/* ------------------------------------------------------------- */}
      <section style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.35rem 1.65rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.02)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Historial de Check-In & Validaciones en Vivo
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#334155' }}>
              <span style={{ color: '#64748b' }}>Terminal Activa:</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
              }}>
                <span>{selectedTerminal}</span>
                <ChevronDown size={13} />
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.42rem 0.9rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              <FileSpreadsheet size={14} color="#16a34a" />
              <span>Export to Excel</span>
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.82rem',
          }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid #f1f5f9',
                background: '#fafbfc',
                color: '#64748b',
                fontWeight: 600,
              }}>
                <th style={{ padding: '0.85rem 1rem' }}>Access ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Documento</th>
                <th style={{ padding: '0.85rem 1rem' }}>Socio</th>
                <th style={{ padding: '0.85rem 1rem' }}>Membresía</th>
                <th style={{ padding: '0.85rem 1rem' }}>Método</th>
                <th style={{ padding: '0.85rem 1rem' }}>Cuota ($)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Estado</th>
                <th style={{ padding: '0.85rem 1rem' }}>Hora Check-in</th>
              </tr>
            </thead>
            <tbody>
              {accesses.map((acc) => (
                <tr
                  key={acc.id}
                  style={{
                    borderBottom: '1px solid #f8fafc',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: '#0f172a' }}>
                    {acc.id}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#0f172a', fontWeight: 700 }}>
                    {acc.login}
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img src={acc.avatar} alt={acc.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{acc.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#334155' }}>
                    {acc.plan}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#64748b' }}>
                    {acc.method}
                  </td>
                  <td style={{
                    padding: '0.9rem 1rem',
                    fontWeight: 800,
                    color: currentTheme.primary,
                  }}>
                    {acc.amount}
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: acc.status === 'PERMITIDO' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: acc.status === 'PERMITIDO' ? '#10b981' : '#ef4444',
                    }}>
                      {acc.status === 'PERMITIDO' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {acc.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#64748b' }}>
                    {acc.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
