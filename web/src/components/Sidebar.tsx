import React from 'react';
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
  X
} from 'lucide-react';

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'TRAINER' | 'MEMBER';

const navIcons: Record<string, React.ElementType> = {
  Dashboard: LayoutDashboard,
  Socios: Users,
  'Membresías': CreditCard,
  Pagos: CreditCard,
  Entrenadores: UserCheck,
  Rutinas: Dumbbell,
  Clases: Calendar,
  Inventario: Package,
  Reportes: BarChart3,
  'Configuración': Settings,
};

export const menuItems = [
  "Dashboard",
  "Socios",
  "Membresías",
  "Pagos",
  "Entrenadores",
  "Rutinas",
  "Clases",
  "Inventario",
  "Reportes",
  "Configuración"
];

interface SidebarProps {
  activeItem?: string;
  onSelect?: (item: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem = "Dashboard",
  onSelect = () => {},
  isOpenMobile = false,
  onCloseMobile
}) => {
  const content = (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shadow-sm min-h-screen h-full">
      <div>
        {/* Brand Logo & Mobile close */}
        <div className="flex items-center justify-between mb-10 pl-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl shadow-inner border border-blue-100">
              🏋️
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-blue-900 leading-tight">
                GYM
                <span className="block text-blue-600 font-black text-sm tracking-wider">
                  ESENCIAL
                </span>
              </h1>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
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

      {/* Admin Quick Profile Footer */}
      <div className="pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">Admin Principal</p>
            <p className="text-[11px] text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
              Sede Central
            </p>
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
