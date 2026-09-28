import React, { useState } from 'react';
import {
  Flame,
  Shield,
  Dumbbell,
  User,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Crown,
} from 'lucide-react';
import { api } from '../services/api';
import { UserRole } from '../components/Sidebar';

interface LoginViewProps {
  onLoginSuccess: (user: any, role: UserRole) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.login(email, password);
      const roleMap: Record<string, UserRole> = {
        SUPERADMIN: 'SUPERADMIN',
        ADMIN: 'ADMIN',
        TRAINER: 'TRAINER',
        RECEPTIONIST: 'ADMIN',
        MEMBER: 'MEMBER',
      };
      const assignedRole = roleMap[res.user.role] || 'ADMIN';
      onLoginSuccess(res.user, assignedRole);
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas. Puedes usar los accesos rápidos abajo.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    let mockUser: any;
    if (role === 'SUPERADMIN') {
      mockUser = { id: 'superadmin-1', name: 'Super Administrador SaaS', email: 'superadmin@apexgym.com', role: 'SUPERADMIN' };
    } else if (role === 'ADMIN') {
      mockUser = { id: 'admin-1', name: 'Administrador Master', email: 'admin@apexgym.com', role: 'ADMIN' };
    } else if (role === 'TRAINER') {
      mockUser = { id: 'trainer-1', name: 'Coach Laura Gómez', email: 'coach@apexgym.com', role: 'TRAINER' };
    } else {
      mockUser = { id: 'member-1', name: 'Mateo Giraldo', email: 'mateo.giraldo@ejemplo.com', role: 'MEMBER', code: 'GYM-1001' };
    }

    localStorage.setItem('apex_user', JSON.stringify(mockUser));
    onLoginSuccess(mockUser, role);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
            marginBottom: '1rem',
          }}>
            <Flame size={32} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
            APEX<span style={{ color: '#10b981' }}>GYM</span>
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
            Plataforma Integral Multi-Sede & Diagnóstico con IA (Google Gemini)
          </p>
        </div>

        {/* Card de Inicio de Sesión */}
        <div className="glass-card" style={{ padding: '2rem', backgroundColor: 'rgba(15, 23, 42, 0.85)' }}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleManualLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Correo Electrónico o Usuario</label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="ej: superadmin@apexgym.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.4rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Contraseña de Seguridad</label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.4rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
                marginTop: '0.35rem',
              }}
            >
              <span>{loading ? 'Validando...' : 'Iniciar Sesión'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Separador */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.75rem 0 1.25rem 0',
            gap: '0.75rem',
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Acceso Rápido por Roles
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Botones de Acceso Rápido con 1 Clic */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {/* SUPERADMIN */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('SUPERADMIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: '#f8fafc',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(168, 85, 247, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown size={16} color="#c084fc" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Superusuario SaaS</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Crear gimnasios, sedes y administradores</div>
                </div>
              </div>
              <ArrowRight size={15} color="#c084fc" />
            </button>

            {/* ADMIN */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ADMIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#f8fafc',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={16} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Administrador del GYM</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Control total, caja, socios y aforo</div>
                </div>
              </div>
              <ArrowRight size={15} color="#10b981" />
            </button>

            {/* TRAINER */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('TRAINER')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                color: '#f8fafc',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Dumbbell size={16} color="#06b6d4" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Entrenador / Coach</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Supervisar y editar rutinas / nutrición IA</div>
                </div>
              </div>
              <ArrowRight size={15} color="#06b6d4" />
            </button>

            {/* MEMBER */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('MEMBER')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                color: '#f8fafc',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="#8b5cf6" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Afiliado / Socio</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Carnet digital QR, diagnóstico y dieta IA</div>
                </div>
              </div>
              <ArrowRight size={15} color="#8b5cf6" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
          APEX GYM & FITNESS • Motor de IA Gemini 3.8 Conectado
        </div>
      </div>
    </div>
  );
};
