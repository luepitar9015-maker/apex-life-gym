import React, { useState, useEffect } from 'react';
import Sidebar, { UserRole } from './components/Sidebar';
import Header from './components/Header';
import LoginView from './views/LoginView';

import Dashboard from './pages/Dashboard';
import Socios from './pages/Socios';
import Membresias from './pages/Membresias';
import Pagos from './pages/Pagos';
import Entrenadores from './pages/Entrenadores';
import Rutinas from './pages/Rutinas';
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

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginSuccess = (user: any, role: UserRole) => {
    setCurrentUser(user);
    setActiveRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('gym_is_authenticated', 'true');
    localStorage.setItem('gym_active_user', JSON.stringify(user));
    localStorage.setItem('gym_active_role', role);

    // Si entra como Administrador TLC o Entrenador, selecciona la pestaña apropiada
    if (role === 'TRAINER') {
      setActiveTab('Rutinas');
    } else if (role === 'MEMBER') {
      setActiveTab('Socios');
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
  };

  // Si no está autenticado, muestra la nueva pantalla de ingreso
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard onNavigate={(tab: string) => setActiveTab(tab)} />;
      case 'Socios':
        return <Socios />;
      case 'Membresías':
        return <Membresias />;
      case 'Pagos':
        return <Pagos />;
      case 'Entrenadores':
        return <Entrenadores />;
      case 'Rutinas':
        return <Rutinas />;
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
        return <Dashboard onNavigate={(tab: string) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800">
      {/* Sidebar de navegación */}
      <Sidebar
        activeItem={activeTab}
        onSelect={(item) => setActiveTab(item)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Área Principal con Header y Vistas */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onQuickAction={(action) => {
            if (action === 'add-member') setActiveTab('Socios');
          }}
        />

        {/* Banner informativo de rol especial (ej: ADMIN_TLC) */}
        {activeRole === 'ADMIN_TLC' && (
          <div className="bg-purple-50 border-b border-purple-100 px-8 py-2.5 flex items-center justify-between text-xs text-purple-900 font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
              <span>Sesión activa: Administrador de TLC (Módulos exclusivos en desarrollo)</span>
            </div>
            <button
              onClick={() => setActiveRole('ADMIN')}
              className="text-[11px] text-purple-700 hover:underline"
            >
              Cambiar a vista General
            </button>
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
