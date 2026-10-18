import React, { useState, useEffect } from 'react';
import Sidebar, { UserRole } from './components/Sidebar';
import Header from './components/Header';
import LoginView from './views/LoginView';

// Vistas de Producción Conectadas a la Base de Datos & IA
import { DashboardView } from './views/DashboardView';
import { MembersView } from './views/MembersView';
import { CheckInView } from './views/CheckInView';
import { DiagnosticFoodView } from './views/DiagnosticFoodView';
import { POSView } from './views/POSView';
import { RoutinesView } from './views/RoutinesView';
import { SuperAdminView } from './views/SuperAdminView';
import { AffiliatePortalView } from './views/AffiliatePortalView';
import { NutritionView } from './views/NutritionView';

// Módulos Auxiliares de Administración
import Membresias from './pages/Membresias';
import Pagos from './pages/Pagos';
import Entrenadores from './pages/Entrenadores';
import Clases from './pages/Clases';
import Inventario from './pages/Inventario';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';
import UsuariosPermisos from './pages/UsuariosPermisos';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gym_is_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('gym_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('gym_active_role');
      return (saved as UserRole) || 'ADMIN';
    } catch {
      return 'ADMIN';
    }
  });

  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginSuccess = (user: any, role: UserRole) => {
    setCurrentUser(user);
    setActiveRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('gym_is_authenticated', 'true');
    localStorage.setItem('gym_active_user', JSON.stringify(user));
    localStorage.setItem('gym_active_role', role);

    // Enrutamiento inicial según el rol del usuario (RBAC)
    if (role === 'SUPERADMIN') {
      setActiveTab('Dashboard');
    } else if (role === 'TRAINER') {
      setActiveTab('Diagnóstico IA & Biometría');
    } else if (role === 'RECEPTIONIST') {
      setActiveTab('Check-In & Aforo');
    } else if (role === 'MEMBER') {
      setActiveTab('Mi Portal & Carnet');
    } else {
      setActiveTab('Dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('gym_is_authenticated');
    localStorage.removeItem('gym_active_user');
    localStorage.removeItem('gym_active_role');
    localStorage.removeItem('apex_token');
    localStorage.removeItem('apex_user');
  };

  // Si no está autenticado, muestra la pantalla de inicio limpia y profesional
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardView onNavigate={(tab: string) => setActiveTab(tab)} />;
      case 'Sedes & Franquicias':
        return <SuperAdminView />;
      case 'Afiliados':
      case 'Socios':
        return <MembersView onNavigate={(tab: string) => setActiveTab(tab)} />;
      case 'Check-In & Aforo':
        return <CheckInView onNavigate={(tab: string) => setActiveTab(tab)} />;
      case 'Diagnóstico IA & Biometría':
        return (
          <DiagnosticFoodView
            currentUser={currentUser}
            activeRole={activeRole}
          />
        );
      case 'Nutrición':
        return (
          <NutritionView
            currentUser={currentUser}
            activeRole={activeRole}
            onNavigate={(tab: string) => setActiveTab(tab)}
          />
        );
      case 'Punto de Venta (POS)':
        return <POSView />;
      case 'Rutinas':
        return <RoutinesView />;
      case 'Mi Portal & Carnet':
        return <AffiliatePortalView />;
      case 'Membresías':
        return <Membresias />;
      case 'Pagos':
        return <Pagos />;
      case 'Entrenadores':
        return <Entrenadores />;
      case 'Clases':
        return <Clases />;
      case 'Inventario':
        return <Inventario />;
      case 'Reportes':
        return <Reportes />;
      case 'Configuración':
        return <Configuracion />;
      case 'Usuarios & Permisos':
        return <UsuariosPermisos activeRole={activeRole} currentUser={currentUser} />;
      default:
        return <DashboardView onNavigate={(tab: string) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800">
      {/* Sidebar de navegación con filtrado estricto por Rol (RBAC) */}
      <Sidebar
        activeItem={activeTab}
        onSelect={(item) => setActiveTab(item)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activeRole={activeRole}
        currentUser={currentUser}
      />

      {/* Área Principal con Header y Vistas de Producción */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onQuickAction={(action) => {
            if (action === 'add-member') setActiveTab('Socios');
          }}
        />

        {/* Banner de Rol Especial si aplica */}
        {activeRole === 'SUPERADMIN' && (
          <div className="bg-blue-900 text-white px-6 py-2 flex items-center justify-between text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Modo Superadministrador Global • Vista Multi-Sede y Control Maestro</span>
            </div>
            <span className="text-[11px] text-blue-200 uppercase tracking-wider font-extrabold">
              Acceso Nivel 1
            </span>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
