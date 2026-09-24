import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, FileText, Shield, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { loginUser, registerUser, AuthUser } from '../services/api.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('MEMBER');
  const [regPhone, setRegPhone] = useState('');
  const [regDocumentId, setRegDocumentId] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = async (email: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await loginUser(email, 'password123');
    setIsLoading(false);

    if (res.success && res.user) {
      setSuccessMessage(`¡Bienvenido de nuevo, ${res.user.firstName}!`);
      setTimeout(() => {
        onSuccess(res.user!);
        onClose();
      }, 500);
    } else {
      setErrorMessage(res.message || 'Error al iniciar sesión');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Por favor ingresa correo y contraseña.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await loginUser(loginEmail, loginPassword);
    setIsLoading(false);

    if (res.success && res.user) {
      setSuccessMessage(`¡Acceso concedido! Hola ${res.user.firstName}.`);
      setTimeout(() => {
        onSuccess(res.user!);
        onClose();
      }, 500);
    } else {
      setErrorMessage(res.message || 'Credenciales inválidas');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regFirstName || !regLastName) {
      setErrorMessage('Por favor completa todos los campos requeridos (*).');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await registerUser({
      email: regEmail,
      password: regPassword,
      firstName: regFirstName,
      lastName: regLastName,
      role: regRole,
      phone: regPhone || undefined,
      documentId: regDocumentId || undefined,
    });

    if (res.success) {
      // Auto login
      const loginRes = await loginUser(regEmail, regPassword);
      setIsLoading(false);
      if (loginRes.success && loginRes.user) {
        setSuccessMessage('¡Usuario registrado e ingresado con éxito!');
        setTimeout(() => {
          onSuccess(loginRes.user!);
          onClose();
        }, 500);
      } else {
        setSuccessMessage('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
        setTab('login');
      }
    } else {
      setIsLoading(false);
      setErrorMessage(res.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content auth-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(9, 13, 22, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.15)',
          borderRadius: '20px',
          maxWidth: '520px',
          width: '92%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: 'var(--text-muted)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)',
            marginBottom: '0.75rem',
          }}>
            <Shield size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            {tab === 'login' ? 'Bienvenido a Gym Fit AI' : 'Crear Nueva Cuenta'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            Accede al sistema integral de entrenamiento, nutrición e IA
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '12px',
          padding: '0.85rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <Sparkles size={14} color="#60a5fa" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Acceso Rápido 1-Click (Perfiles de Prueba)
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@gymfit.com')}
              disabled={isLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.45rem 0.6rem',
                borderRadius: '8px',
                color: '#f3f4f6',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              👑 Admin (Carlos)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('coach.marcos@gymfit.com')}
              disabled={isLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.45rem 0.6rem',
                borderRadius: '8px',
                color: '#f3f4f6',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              💪 Entrenador (Marcos)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('nutri.laura@gymfit.com')}
              disabled={isLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.45rem 0.6rem',
                borderRadius: '8px',
                color: '#f3f4f6',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              🥗 Nutricionista (Laura)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('juan.perez@email.com')}
              disabled={isLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.45rem 0.6rem',
                borderRadius: '8px',
                color: '#f3f4f6',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              🏋️ Socio (Juan Pérez)
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '1.25rem',
        }}>
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMessage(null); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: tab === 'login' ? 'var(--primary)' : 'transparent',
              color: tab === 'login' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMessage(null); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: tab === 'register' ? 'var(--primary)' : 'transparent',
              color: tab === 'register' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '0.65rem 0.85rem',
            color: '#fca5a5',
            fontSize: '0.82rem',
            marginBottom: '1rem',
          }}>
            <AlertCircle size={16} color="#ef4444" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '0.65rem 0.85rem',
            color: '#6ee7b7',
            fontSize: '0.82rem',
            marginBottom: '1rem',
          }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form: Login */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="ej: admin@gymfit.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Verificando...' : (
                <>
                  Entrar a la Plataforma <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Form: Register */
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  placeholder="ej: Carlos"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Apellido *
                </label>
                <input
                  type="text"
                  placeholder="ej: Pérez"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Correo Electrónico *
              </label>
              <input
                type="email"
                placeholder="ej: nuevo.socio@gymfit.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.55rem 0.7rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Contraseña (mínimo 6 caracteres) *
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.7rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Rol en el Gym
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    background: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="MEMBER">Socio / Cliente</option>
                  <option value="TRAINER">Entrenador Físico</option>
                  <option value="NUTRITIONIST">Nutricionista</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  DNI / Cédula
                </label>
                <input
                  type="text"
                  placeholder="ej: 1098765432"
                  value={regDocumentId}
                  onChange={(e) => setRegDocumentId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.7rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                placeholder="ej: +57 300 123 4567"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.7rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Registrando...' : 'Completar Registro'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
