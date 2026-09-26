import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Dumbbell, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Building
} from 'lucide-react';
import { loginUser, registerUser, AuthUser } from '../services/api.js';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Register fields
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDocumentId, setRegDocumentId] = useState('');
  const [regRole, setRegRole] = useState('AFFILIATE');

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFeedback({ type: 'error', text: 'Por favor ingresa usuario/correo y contraseña.' });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    const res = await loginUser(email, password);
    setIsLoading(false);

    if (res.success && res.user) {
      setFeedback({ type: 'success', text: `¡Acceso concedido! Bienvenido ${res.user.firstName}.` });
      setTimeout(() => {
        onLoginSuccess(res.user!);
      }, 400);
    } else {
      setFeedback({ type: 'error', text: res.message || 'Credenciales incorrectas.' });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regFirstName || !regLastName) {
      setFeedback({ type: 'error', text: 'Por favor completa todos los campos requeridos.' });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    const res = await registerUser({
      email: regEmail,
      password: regPassword,
      firstName: regFirstName,
      lastName: regLastName,
      role: regRole,
      documentId: regDocumentId || undefined,
    });

    if (res.success) {
      // Auto login
      const loginRes = await loginUser(regEmail, regPassword);
      setIsLoading(false);
      if (loginRes.success && loginRes.user) {
        onLoginSuccess(loginRes.user);
      } else {
        setMode('login');
        setEmail(regEmail);
        setFeedback({ type: 'success', text: 'Registro exitoso. Ahora ingresa con tu contraseña.' });
      }
    } else {
      setIsLoading(false);
      setFeedback({ type: 'error', text: res.message || 'Error al crear la cuenta.' });
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setIsLoading(true);
    setEmail(demoEmail);
    setPassword('password123');
    setFeedback(null);

    const res = await loginUser(demoEmail, 'password123');
    setIsLoading(false);

    if (res.success && res.user) {
      setFeedback({ type: 'success', text: `Acceso con rol ${res.user.role}...` });
      setTimeout(() => {
        onLoginSuccess(res.user!);
      }, 400);
    } else {
      setFeedback({ type: 'error', text: res.message || 'Error en inicio rápido.' });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0a0d14] relative overflow-hidden">
      {/* Luces de fondo dinámicas */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Logo y Encabezado */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-2xl shadow-emerald-500/20 mb-1">
            <div className="w-full h-full bg-[#0d121f] rounded-[14px] flex items-center justify-center">
              <Dumbbell className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            APEX LIFE <span className="text-teal-400">&amp; TLC</span>
          </h1>
          <p className="text-xs text-gray-400">
            Plataforma Integral de Fitness, Nutrición &amp; Bienestar Integral
          </p>
        </div>

        {/* Tarjeta de Inicio de Sesión */}
        <div className="p-4 sm:p-7 rounded-3xl bg-gray-900/80 border border-gray-800 shadow-2xl backdrop-blur-xl space-y-5">
          {/* Selector Login / Registro */}
          <div className="grid grid-cols-2 p-1 bg-gray-950/80 rounded-xl border border-gray-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setFeedback(null); }}
              className={`py-2 rounded-lg transition ${
                mode === 'login' ? 'bg-teal-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setFeedback(null); }}
              className={`py-2 rounded-lg transition ${
                mode === 'register' ? 'bg-teal-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn ${
              feedback.type === 'success' 
                ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/60 border border-red-500/50 text-red-300'
            }`}>
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{feedback.text}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Correo Electrónico o Usuario *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ej: admin@gymfit.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Contraseña de Acceso *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-800/90 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm transition shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verificando credenciales...
                  </>
                ) : (
                  <>
                    Ingresar al Administrador
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onLoginSuccess({
                    id: 'usr-vip-main',
                    email: 'luis.moreno@apexlife.com',
                    firstName: 'Luis Ernesto',
                    lastName: 'Moreno',
                    role: 'MEMBER',
                    business: { id: 'b-gym', name: 'APEX LIFE Central', type: 'GYM' },
                    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
                  });
                }}
                style={{
                  background: 'rgba(118, 224, 0, 0.15)',
                  border: '1px solid #76e000',
                  color: '#76e000',
                }}
                className="w-full py-2.5 rounded-xl font-extrabold text-xs transition shadow-lg shadow-lime-500/10 flex items-center justify-center gap-2 hover:bg-lime-500 hover:text-black cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ Explorar Mi Portal Directo (Socio VIP)</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="Nombre"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Apellido *</label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Apellido"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Cédula / Documento</label>
                  <input
                    type="text"
                    value={regDocumentId}
                    onChange={(e) => setRegDocumentId(e.target.value)}
                    placeholder="ej: 1020456"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Rol Inicial</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="AFFILIATE">Afiliado TLC</option>
                    <option value="TRAINER">Entrenador</option>
                    <option value="MEMBER">Socio / Cliente</option>
                    <option value="BUSINESS_ADMIN">Admin Gimnasio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 mb-1">Contraseña *</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? 'Registrando...' : 'Completar Registro'}
              </button>
            </form>
          )}

          {/* Accesos Rápidos Preconfigurados */}
          <div className="pt-3 border-t border-gray-800 space-y-2.5">
            <p className="text-[11px] font-medium text-gray-400 text-center">
              Ingreso rápido con cuentas del sistema (Password: password123):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@gymfit.com')}
                className="p-2 rounded-xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700/60 text-left transition"
              >
                <span className="block text-[11px] font-bold text-teal-400">Superadmin</span>
                <span className="block text-[10px] text-gray-400 truncate">admin@gymfit.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('socio.alex@gymfit.com')}
                className="p-2 rounded-xl bg-gray-800/60 hover:bg-gray-800 border border-gray-700/60 text-left transition"
              >
                <span className="block text-[11px] font-bold text-orange-400">Afiliado TLC</span>
                <span className="block text-[10px] text-gray-400 truncate">socio.alex@gymfit.com</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer de Seguridad y Servidor Contabo */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Servidor Contabo VPS • Conexión Cifrada SSL &amp; JWT</span>
        </div>
      </div>
    </div>
  );
};
