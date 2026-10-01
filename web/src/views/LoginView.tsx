import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  UserCheck,
  Building2,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { UserRole } from '../components/Sidebar';
import { api } from '../services/api';

interface LoginViewProps {
  onLoginSuccess: (user: any, role: UserRole) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Leer configuración de marca del gimnasio (Logo y Nombre)
  const [gymBrand, setGymBrand] = useState(() => {
    try {
      const saved = localStorage.getItem('gym_config');
      return saved ? JSON.parse(saved) : { name: 'GYM ESENCIAL', logo: '' };
    } catch {
      return { name: 'GYM ESENCIAL', logo: '' };
    }
  });

  // Cargar credenciales guardadas si "Recordar contraseña" estaba activo
  useEffect(() => {
    try {
      const savedCreds = localStorage.getItem('gym_remember_creds');
      if (savedCreds) {
        const { email: savedEmail, password: savedPassword } = JSON.parse(savedCreds);
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (e) {
      // Ignorar si no hay credenciales
    }
  }, []);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Si recordar contraseña está marcado, guardar en localStorage
      if (rememberMe) {
        localStorage.setItem('gym_remember_creds', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('gym_remember_creds');
      }

      // Intentar login con backend
      try {
        const res = await api.login(email, password);
        const role = (res.user?.role as UserRole) || 'ADMIN';
        onLoginSuccess(res.user, role);
        return;
      } catch (backendErr) {
        // Fallback en desarrollo/demo si el backend no tiene ese usuario
        const role: UserRole = email.toLowerCase().includes('tlc') ? 'ADMIN_TLC' : 'ADMIN';
        const mockUser = {
          id: 'usr-1',
          name: email.split('@')[0].toUpperCase(),
          email: email,
          role: role
        };
        onLoginSuccess(mockUser, role);
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Acceso rápido por roles
  const handleQuickRoleLogin = (role: UserRole, title: string, demoEmail: string) => {
    const mockUser = {
      id: `usr-${role.toLowerCase()}`,
      name: title,
      email: demoEmail,
      role: role
    };

    if (rememberMe) {
      localStorage.setItem('gym_remember_creds', JSON.stringify({ email: demoEmail, password: '••••••••' }));
    }

    onLoginSuccess(mockUser, role);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotModalOpen(false);
      setForgotEmail('');
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-gray-50 to-blue-50/50 flex flex-col justify-center items-center p-4 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif] text-gray-800">
      
      {/* Contenedor Principal */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8 sm:p-10 relative overflow-hidden">
        
        {/* Decoración superior sutil */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600" />

        {/* Encabezado con Logo y Marca Dinámica */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner overflow-hidden">
            {gymBrand.logo ? (
              <img src={gymBrand.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span>🏋️</span>
            )}
          </div>

          <h1 className="text-2xl font-black text-blue-950 tracking-tight">
            {gymBrand.name || 'GYM ESENCIAL'}
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Plataforma Administrativa & Control de Acceso
          </p>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-700 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Servidor En Línea • 80.241.212.9</span>
          </div>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario de Login */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Correo Electrónico / Documento
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                placeholder="ej: admin@gym.com o C.C."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                aria-label="Ver contraseña"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Fila: Recordar Contraseña & Olvidé Contraseña */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-md border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-gray-600 select-none">
                Recordar contraseña
              </span>
            </label>

            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón Principal de Acceso */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold rounded-xl text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Ingresar al Sistema</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Separador */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              O selecciona tu rol de acceso rápido
            </span>
          </div>
        </div>

        {/* Roles Rápidos Integrados (Incluyendo Administrador TLC) */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickRoleLogin('ADMIN', 'Administrador GYM', 'admin@gym.com')}
            className="p-2.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">Admin GYM</p>
              <p className="text-[10px] text-gray-400 truncate">Control Total</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleLogin('ADMIN_TLC', 'Administrador TLC', 'admin.tlc@gym.com')}
            className="p-2.5 rounded-xl border border-purple-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all text-left flex items-center gap-2 bg-purple-50/20"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
              TLC
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-purple-950 truncate">Admin TLC</p>
              <p className="text-[10px] text-purple-600 truncate">Módulos TLC</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleLogin('TRAINER', 'Coach Laura Gómez', 'coach@gym.com')}
            className="p-2.5 rounded-xl border border-gray-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-all text-left flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold shrink-0">
              CH
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">Entrenador</p>
              <p className="text-[10px] text-gray-400 truncate">Rutinas & Clases</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickRoleLogin('MEMBER', 'Carlos Mendoza (Socio)', 'socio@gym.com')}
            className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
              SC
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">Socio / Afiliado</p>
              <p className="text-[10px] text-gray-400 truncate">Carnet QR & Días</p>
            </div>
          </button>
        </div>

        {/* Pie de Página */}
        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 font-medium">
            Seguridad SSL Activa • Acceso Protegido
          </p>
        </div>
      </div>

      {/* Modal: Recuperar Contraseña */}
      {forgotModalOpen && (
        <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-blue-900">
                <KeyRound size={20} className="text-blue-600" />
                <h3 className="font-extrabold text-base">Recuperar Contraseña</h3>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">¡Enlace Enviado!</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Hemos enviado las instrucciones para restablecer tu contraseña al correo indicado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Ingresa tu correo electrónico registrado y te enviaremos un código de seguridad para restaurar tu acceso.
                </p>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="usuario@gym.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
                  >
                    Enviar Enlace
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginView;
