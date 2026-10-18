import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCheck,
  Dumbbell,
  Calendar,
  Package,
  BarChart3,
  Settings,
  ChevronRight,
  ShieldCheck,
  Building2,
  QrCode,
  Sparkles,
  ShoppingBag,
  Activity,
  HeartPulse,
  User,
  Salad,
  X
} from 'lucide-react';

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'TRAINER' | 'MEMBER' | 'RECEPTIONIST' | 'ADMIN_TLC';

export const ROLE_MENU_ITEMS: Record<UserRole, string[]> = {
  SUPERADMIN: [
    'Dashboard',
    'Sedes & Franquicias',
    'Socios',
    'Diagnóstico IA & Biometría',
    'Nutrición',
    'Usuarios & Permisos',
    'Reportes',
    'Configuración',
  ],
  ADMIN: [
    'Dashboard',
    'Socios',
    'Check-In & Aforo',
    'Diagnóstico IA & Biometría',
    'Nutrición',
    'Punto de Venta (POS)',
    'Rutinas',
    'Membresías',
    'Clases',
    'Inventario',
    'Reportes',
    'Usuarios & Permisos',
    'Configuración',
  ],
  ADMIN_TLC: [
    'Dashboard',
    'Socios',
    'Diagnóstico IA & Biometría',
    'Nutrición',
    'Inventario',
    'Reportes',
  ],
  RECEPTIONIST: [
    'Check-In & Aforo',
    'Socios',
    'Nutrición',
    'Punto de Venta (POS)',
    'Clases',
  ],
  TRAINER: [
    'Diagnóstico IA & Biometría',
    'Nutrición',
    'Rutinas',
    'Socios',
    'Clases',
  ],
  MEMBER: [
    'Mi Portal & Carnet',
    'Diagnóstico IA & Biometría',
    'Nutrición',
    'Rutinas',
    'Clases',
  ],
};

const navIcons: Record<string, React.ElementType> = {
  Dashboard: LayoutDashboard,
  'Sedes & Franquicias': Building2,
  Afiliados: Users,
  Socios: Users,
  'Check-In & Aforo': QrCode,
  'Diagnóstico IA & Biometría': Sparkles,
  'Nutrición': Salad,
  'Punto de Venta (POS)': ShoppingBag,
  'Membresías': CreditCard,
  Pagos: CreditCard,
  Entrenadores: UserCheck,
  Rutinas: Dumbbell,
  Clases: Calendar,
  Inventario: Package,
  Reportes: BarChart3,
  'Mi Portal & Carnet': QrCode,
  'Configuración': Settings,
  'Usuarios & Permisos': ShieldCheck,
};

export const menuItems = [
  "Dashboard",
  "Sedes & Franquicias",
  "Socios",
  "Check-In & Aforo",
  "Diagnóstico IA & Biometría",
  "Nutrición",
  "Punto de Venta (POS)",
  "Membresías",
  "Pagos",
  "Entrenadores",
  "Rutinas",
  "Clases",
  "Inventario",
  "Reportes",
  "Configuración",
  "Usuarios & Permisos"
];

interface SidebarProps {
  activeItem?: string;
  onSelect?: (item: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  activeRole?: UserRole;
  currentUser?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem = "Dashboard",
  onSelect = () => {},
  isOpenMobile = false,
  onCloseMobile,
  activeRole = 'ADMIN',
  currentUser
}) => {
  const [gymBrand, setGymBrand] = useState(() => {
    try {
      const saved = localStorage.getItem('gym_config');
      return saved ? JSON.parse(saved) : { name: 'GYM ESENCIAL', logo: '' };
    } catch {
      return { name: 'GYM ESENCIAL', logo: '' };
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('gym_config');
        if (saved) setGymBrand(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('gym_config_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('gym_config_updated', handleUpdate);
    };
  }, []);

  const content = (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shadow-sm min-h-screen h-full">
      <div>
        {/* Brand Logo & Mobile close */}
        <div className="flex items-center justify-between mb-8 pl-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl shadow-inner border border-blue-100 overflow-hidden shrink-0">
              {gymBrand.logo ? (
                <img src={gymBrand.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span>🏋️</span>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-black tracking-tight text-blue-900 leading-tight truncate">
                {gymBrand.name || 'GYM ESENCIAL'}
              </h1>
              <span className="block text-blue-600 font-extrabold text-[11px] tracking-wider uppercase">
                Panel GYM
              </span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 shrink-0"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation list filtrada por rol */}
        <nav className="space-y-1.5">
          {(ROLE_MENU_ITEMS[activeRole] || menuItems).map((item) => {
            const Icon = navIcons[item] || LayoutDashboard;
            const isActive = activeItem === item;

            return (
              <button
                key={item}
                onClick={() => {
                  onSelect(item);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span>{item}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-blue-200" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-sm shrink-0">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : activeRole.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">
              {currentUser?.name || 'Usuario Activo'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 truncate">
                {activeRole}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <div className="hidden lg:block shrink-0">
        {content}
      </div>

      {/* Mobile drawer modal overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
