import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogOut,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { api, CheckInRecord, AccessVerificationResult } from '../services/api';

interface CheckInViewProps {
  onNavigate: (view: string) => void;
  onSelectMemberForRenewal?: (memberId: string) => void;
}

export const CheckInView: React.FC<CheckInViewProps> = ({ onNavigate, onSelectMemberForRenewal }) => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState<AccessVerificationResult | null>(null);
  const [selectedZone, setSelectedZone] = useState('PESAS');
  const [todayEntries, setTodayEntries] = useState<CheckInRecord[]>([]);
  const [activeMembersInGym, setActiveMembersInGym] = useState<CheckInRecord[]>([]);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const loadTodayData = async () => {
    try {
      const records = await api.getTodayCheckIns();
      setTodayEntries(records);
      setActiveMembersInGym(records.filter((r: any) => r.status === 'GRANTED' && !r.checkOutTime));
    } catch (err) {
      console.error('Error cargando check-ins:', err);
    }
  };

  useEffect(() => {
    loadTodayData();
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleVerify = async (idToVerify?: string) => {
    const val = idToVerify || identifier;
    if (!val.trim()) return;

    try {
      setLoading(true);
      setActionMessage(null);
      const result = await api.verifyAccess(val.trim());
      setVerification(result);

      // Si tiene acceso concedido y no está dentro, registramos automáticamente el ingreso
      if (result.granted && !result.alreadyInGym) {
        await api.registerEntry(result.member.id, selectedZone);
        setActionMessage({ text: `¡Bienvenido ${result.member.fullName}! Entrada registrada en sala.`, type: 'success' });
        loadTodayData();
      } else if (result.alreadyInGym) {
        setActionMessage({ text: `${result.member.fullName} ya tiene un ingreso activo en sala hoy.`, type: 'error' });
      }
    } catch (err: any) {
      setVerification({
        success: false,
        granted: false,
        reason: err.message || 'Documento o código QR no registrado en el sistema.',
        daysRemaining: 0,
        alreadyInGym: false,
        member: {
          id: '',
          code: 'NO REGISTRADO',
          fullName: 'Usuario No Encontrado',
          documentNumber: val,
          status: 'EXPIRED',
          planName: 'Ninguno',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (memberId: string) => {
    try {
      await api.registerCheckout(memberId);
      setActionMessage({ text: 'Salida registrada correctamente. Aforo actualizado.', type: 'success' });
      loadTodayData();
      if (verification?.member.id === memberId) {
        setVerification(null);
      }
    } catch (err: any) {
      alert(err.message || 'Error al registrar salida');
    }
  };

  const handleManualEntry = async () => {
    if (!verification) return;
    try {
      await api.registerEntry(verification.member.id, selectedZone);
      setActionMessage({ text: `Ingreso forzado registrado para ${verification.member.fullName}`, type: 'success' });
      loadTodayData();
      setVerification(null);
      setIdentifier('');
      if (inputRef.current) inputRef.current.focus();
    } catch (err: any) {
      alert(err.message || 'Error al registrar');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Notification */}
      {actionMessage && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          backgroundColor: actionMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${actionMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: actionMessage.type === 'success' ? '#10b981' : '#f87171',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {actionMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Main Scanner Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Input & Virtual Scanner Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <QrCode size={22} color="#10b981" />
              <span>Escáner de Recepción & Check-in</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Ingresa el documento o escanea el código QR del carnet digital.
            </p>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Cédula, DNI o código (ej: 1020304050)..."
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.5rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '0 1.25rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
              }}
            >
              {loading ? 'Validando...' : 'Validar'}
            </button>
          </form>

          {/* Selector de Zona */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem' }}>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Zona de Ingreso:</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['PESAS', 'CARDIO', 'CLASES'].map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  style={{
                    border: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: selectedZone === zone ? 700 : 500,
                    backgroundColor: selectedZone === zone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedZone === zone ? '#10b981' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          {/* Atajos de Prueba Rápida con Socios de la Base de Datos */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simular Lectura de Carnet QR (Pruebas):
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('1020304050');
                  handleVerify('1020304050');
                }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  color: '#10b981',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🟢 Mateo (Activo)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('1098765432');
                  handleVerify('1098765432');
                }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '8px',
                  color: '#f59e0b',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🟡 Valentina (2 días)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('1033445566');
                  handleVerify('1033445566');
                }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🔴 Andrés (Vencido)
              </button>
            </div>
          </div>
        </div>

        {/* Visual Confirmation Card (Result) */}
        <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem',
          border: verification
            ? `2px solid ${verification.granted ? '#10b981' : '#ef4444'}`
            : '1px dashed rgba(255, 255, 255, 0.15)',
          backgroundColor: verification
            ? verification.granted
              ? 'rgba(16, 185, 129, 0.04)'
              : 'rgba(239, 68, 68, 0.04)'
            : 'transparent',
          position: 'relative',
        }}>
          {verification ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              {/* Status Icon */}
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: verification.granted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: verification.granted ? '0 0 25px rgba(16, 185, 129, 0.4)' : '0 0 25px rgba(239, 68, 68, 0.4)',
              }}>
                {verification.granted ? (
                  <CheckCircle2 size={40} color="#10b981" />
                ) : (
                  <XCircle size={40} color="#ef4444" />
                )}
              </div>

              <div>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: verification.granted ? '#10b981' : '#ef4444',
                }}>
                  {verification.granted ? 'ACCESO AUTORIZADO' : 'ACCESO DENEGADO'}
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 0 0' }}>
                  {verification.member.fullName}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  {verification.member.code} • Doc: {verification.member.documentNumber}
                </p>
              </div>

              {/* Plan Details Box */}
              <div style={{
                width: '100%',
                maxWidth: '340px',
                padding: '0.85rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'left',
                fontSize: '0.82rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Plan Contratado:</span>
                  <strong style={{ color: '#f1f5f9' }}>{verification.member.planName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Estado del Plan:</span>
                  <span style={{
                    color: verification.granted ? '#10b981' : '#ef4444',
                    fontWeight: 700,
                  }}>
                    {verification.daysRemaining > 0 ? `${verification.daysRemaining} días restantes` : 'Vencido'}
                  </span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                  {verification.reason}
                </div>
              </div>

              {/* Action Buttons based on status */}
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '340px' }}>
                {!verification.granted && (
                  <button
                    onClick={() => {
                      if (onSelectMemberForRenewal) onSelectMemberForRenewal(verification.member.id);
                      onNavigate('members');
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#f59e0b',
                      color: '#000000',
                      border: 'none',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Renovar en Caja</span>
                    <ArrowRight size={16} />
                  </button>
                )}

                {verification.granted && verification.alreadyInGym && (
                  <button
                    onClick={() => handleCheckOut(verification.member.id)}
                    style={{
                      flex: 1,
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <LogOut size={16} />
                    <span>Registrar Salida</span>
                  </button>
                )}

                {!verification.granted && (
                  <button
                    onClick={handleManualEntry}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                    title="Permitir acceso excepcional"
                  >
                    Pase Cortesía
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '2px dashed #475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShieldCheck size={30} color="#475569" />
              </div>
              <div>
                <h4 style={{ color: '#94a3b8', margin: 0, fontSize: '1rem' }}>Esperando Escaneo...</h4>
                <p style={{ fontSize: '0.82rem', margin: '4px 0 0 0' }}>Escanea un código o usa los botones de simulación arriba.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Socios Actualmente en Sala (Control de Salida / Aforo) */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Socios Actualmente en Sala ({activeMembersInGym.length})
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Personas dentro de las instalaciones con check-in activo hoy
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Socio</th>
                <th style={{ padding: '0.75rem 1rem' }}>Documento</th>
                <th style={{ padding: '0.75rem 1rem' }}>Membresía</th>
                <th style={{ padding: '0.75rem 1rem' }}>Zona</th>
                <th style={{ padding: '0.75rem 1rem' }}>Hora Entrada</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {activeMembersInGym.length > 0 ? (
                activeMembersInGym.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#f1f5f9' }}>
                      {item.member.firstName} {item.member.lastName}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>
                      {item.member.documentNumber}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#10b981', fontWeight: 600 }}>
                      {item.member.currentPlan?.name || 'Membresía'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        fontSize: '0.75rem',
                      }}>
                        {item.zone}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>
                      {new Date(item.checkInTime).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleCheckOut(item.member.id)}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <LogOut size={13} />
                        <span>Marcar Salida</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No hay socios en sala en este momento.
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
