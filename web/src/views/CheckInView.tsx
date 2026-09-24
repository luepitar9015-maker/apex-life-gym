import React, { useState } from 'react';
import { 
  QrCode, 
  Search, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw,
  Unlock,
  Check,
  CreditCard,
  Camera
} from 'lucide-react';
import { checkInMember } from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface CheckInViewProps {
  currentTheme?: ColorTheme;
}

export const CheckInView: React.FC<CheckInViewProps> = ({ currentTheme = getSavedTheme() }) => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheckIn = async (idToUse?: string) => {
    const target = idToUse || identifier;
    if (!target.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await checkInMember(target.trim());
    setResult(res);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER ESTILO NEXO: VIBRANTE + WIDGET FLOTANTE + ACCESS-QR */}
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

        {/* Marca de agua translúcida gigante en el fondo */}
        <div style={{
          position: 'absolute',
          right: '340px',
          bottom: '-30px',
          fontSize: '7.5rem',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.12)',
          letterSpacing: '-0.05em',
          userSelect: 'none',
          pointerEvents: 'none',
          fontStyle: 'italic',
        }}>
          ACCESS-QR
        </div>

        {/* Texto de la Izquierda */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px' }}>
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
              % SISTEMA GYM / CONTROL DE ACCESO QR
            </span>
            <span style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.82rem', fontWeight: 700 }}>
              Recepción en Vivo & Validación de Torniquete
            </span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#070a12',
            margin: '0.2rem 0',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
          }}>
            RECEPCIÓN & <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>CONTROL QR</span>
          </h1>

          <p style={{
            color: 'rgba(7, 10, 18, 0.85)',
            fontSize: '0.92rem',
            fontWeight: 600,
            margin: '0.4rem 0 0 0',
            lineHeight: 1.4,
          }}>
            Escanea el código QR dinámico de la App Móvil del socio o búscalo por DNI para validar membresía y desbloquear el torniquete.
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleCheckIn('10987654')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#070a12',
                color: '#ffffff',
                border: 'none',
                padding: '0.55rem 1.15rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <QrCode size={16} color={currentTheme.primary} />
              <span>Simular Escaneo QR Socio Al Día</span>
            </button>
            <button
              onClick={() => handleCheckIn('11223344')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#b91c1c',
                border: 'none',
                padding: '0.55rem 1.15rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <XCircle size={16} color="#b91c1c" />
              <span>Simular Socio Vencido</span>
            </button>
          </div>
        </div>

        {/* Status Card Flotante de la Derecha (Estilo Nexo) */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(7, 10, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          color: '#ffffff',
          minWidth: '290px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}>
          {/* Header del card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentTheme.primary, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Unlock size={14} /> Torniquete Principal
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              background: '#059669',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              color: '#ffffff',
            }}>
              ONLINE
            </span>
          </div>

          {/* Subtítulo y Porcentaje */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              # Ingresos Registrados Hoy
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
              284 / 300 <span style={{ fontSize: '0.85rem', color: currentTheme.primary }}>(94.6%)</span>
            </span>
          </div>

          {/* Barra de progreso Neón */}
          <div style={{
            height: '7px',
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '0.85rem',
          }}>
            <div style={{
              width: '94.6%',
              height: '100%',
              background: currentTheme.primary,
              boxShadow: `0 0 10px ${currentTheme.primary}`,
              borderRadius: '999px',
            }} />
          </div>

          {/* Estadísticas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                QR Exitosos
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: currentTheme.primary, marginTop: '2px' }}>
                278 Permitidos
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Denegados / Vencidos
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ef4444', marginTop: '2px' }}>
                6 Rechazos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CUERPO BLANCO: ESCÁNER QR & PANEL DE VALIDACIÓN EN VIVO */}
      {/* ------------------------------------------------------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {/* Tarjeta de Lector QR */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={20} color={currentTheme.primary} /> Visor de Cámara QR
            </h3>
            <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800 }}>
              Cámara HD Activa
            </span>
          </div>

          {/* Simulación visual de visor QR con marco y láser neón */}
          <div style={{
            height: '220px',
            background: '#070a12',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            {/* Línea láser animada */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              right: '10%',
              height: '3px',
              background: currentTheme.primary,
              boxShadow: `0 0 16px ${currentTheme.primary}`,
              borderRadius: '999px',
            }} />

            {/* Recuadro de enfoque */}
            <div style={{
              width: '130px',
              height: '130px',
              border: `2px solid ${currentTheme.primary}`,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <QrCode size={52} color={currentTheme.primary} opacity={0.65} />
            </div>

            <div style={{ position: 'absolute', bottom: '12px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
              Apunta el código QR del socio aquí
            </div>
          </div>

          {/* Búsqueda Manual */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Búsqueda Manual (DNI o Correo):
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="ej: 10987654"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCheckIn()}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleCheckIn()}
                disabled={loading}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: currentTheme.primary,
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: `0 3px 12px ${currentTheme.primaryGlow}`,
                }}
              >
                {loading ? 'Validando...' : 'Verificar'}
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Resultado de Validación en Vivo */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {!result ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
              <UserCheck size={54} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Esperando Escaneo</div>
              <p style={{ fontSize: '0.82rem', margin: '0.35rem 0 0 0' }}>
                Los datos del socio aparecerán aquí en milisegundos tras la lectura de su QR.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: result.allowed ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${result.allowed ? '#a7f3d0' : '#fecaca'}`,
              }}>
                {result.allowed ? <CheckCircle2 size={24} color="#059669" /> : <XCircle size={24} color="#dc2626" />}
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1rem', color: result.allowed ? '#065f46' : '#991b1b' }}>
                    {result.allowed ? 'ACCESO PERMITIDO - TORNIQUETE ABIERTO' : 'ACCESO DENEGADO - MEMBRESÍA VENCIDA'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: result.allowed ? '#047857' : '#b91c1c' }}>
                    {result.reason}
                  </div>
                </div>
              </div>

              {result.member && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                }}>
                  <img
                    src={result.member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt="Socio"
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                      {result.member.firstName} {result.member.lastName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {result.member.email} • DNI: {result.member.documentId}
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <span style={{
                        background: result.allowed ? currentTheme.primary : '#fee2e2',
                        color: result.allowed ? '#000000' : '#b91c1c',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '999px',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                      }}>
                        {result.member.subscriptions?.[0]?.membershipPlan?.name || 'Plan Black VIP'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setResult(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.65rem',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                Limpiar & Esperar Siguiente Socio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInView;
