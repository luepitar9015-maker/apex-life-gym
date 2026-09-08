import React, { useState } from 'react';
import { QrCode, Search, CheckCircle2, XCircle, UserCheck, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { checkInMember } from '../services/api.js';

export const CheckInView: React.FC = () => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Recepción & Validación de Acceso QR</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Escanea el código QR de la App Móvil del socio o búscalo por DNI/Correo para autorizar el torniquete.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        {/* Lector QR / Buscador */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <QrCode size={22} color="var(--primary)" /> Escáner de Acceso
            </h3>
            <span className="badge badge-active">Cámara Lista</span>
          </div>

          {/* Simulación visual de visor QR con efecto láser */}
          <div style={{
            height: '240px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '2px dashed rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-md)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <div className="laser-line" />
            <div style={{
              width: '120px',
              height: '120px',
              border: '2px solid rgba(16, 185, 129, 0.6)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)'
            }}>
              <QrCode size={64} color="rgba(16, 185, 129, 0.8)" />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Apunta el código QR de la App del cliente frente al lector
            </p>
          </div>

          {/* Buscador Manual */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Búsqueda Rápida por DNI o Correo
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                className="input-control"
                placeholder="Ej: 1098765432 o juan.perez@email.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCheckIn()}
              />
              <button 
                className="btn btn-primary" 
                onClick={() => handleCheckIn()}
                disabled={loading}
                style={{ whiteSpace: 'nowrap' }}
              >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
                Validar
              </button>
            </div>
          </div>

          {/* Pruebas rápidas instantáneas con 1 clic */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dark)', marginBottom: '0.5rem', fontWeight: 600 }}>
              PRUEBAS RÁPIDAS DE DEMOSTRACIÓN:
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
                onClick={() => { setIdentifier('1098765432'); handleCheckIn('1098765432'); }}
              >
                <UserCheck size={14} color="var(--primary)" /> Socio Activo (Juan)
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
                onClick={() => { setIdentifier('1122334455'); handleCheckIn('1122334455'); }}
              >
                <ShieldAlert size={14} color="var(--accent-rose)" /> Socio Vencido (Mateo)
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Resultado en Tiempo Real */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {!result && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dark)' }}>
              <QrCode size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Esperando Escaneo</h4>
              <p style={{ fontSize: '0.85rem' }}>El resultado de la verificación de acceso aparecerá en este panel.</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
              {/* Status Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: result.accessGranted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                border: `1px solid ${result.accessGranted ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`
              }}>
                {result.accessGranted ? (
                  <CheckCircle2 size={38} color="#10b981" />
                ) : (
                  <XCircle size={38} color="#f43f5e" />
                )}
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: result.accessGranted ? '#34d399' : '#fb7185' }}>
                    {result.accessGranted ? 'ACCESO AUTORIZADO' : 'ACCESO DENEGADO'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>{result.message}</p>
                </div>
              </div>

              {result.member && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={result.member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'}
                      alt={result.member.name}
                      style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', border: '2px solid var(--border-subtle)' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.2rem', color: '#fff' }}>{result.member.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{result.member.email}</p>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    fontSize: '0.85rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-dark)', display: 'block', fontSize: '0.75rem' }}>Plan Actual:</span>
                      <strong style={{ color: '#fff' }}>{result.member.membership}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dark)', display: 'block', fontSize: '0.75rem' }}>Vencimiento:</span>
                      <strong style={{ color: result.accessGranted ? 'var(--primary)' : 'var(--accent-rose)' }}>
                        {result.member.expiresAt ? new Date(result.member.expiresAt).toLocaleDateString() : 'N/A'}
                      </strong>
                    </div>
                  </div>

                  {result.accessGranted && (
                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                      <CheckCircle2 size={18} /> Torniquete Desbloqueado (5s)
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
