import React, { useState, useEffect } from 'react';
import { Sidebar, UserRole } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';

import { DashboardView } from './views/DashboardView';
import { CheckInView } from './views/CheckInView';
import { MembersView } from './views/MembersView';
import { POSView } from './views/POSView';
import { RoutinesView } from './views/RoutinesView';
import { AforoView } from './views/AforoView';
import { SettingsView } from './views/SettingsView';
import { AffiliatePortalView } from './views/AffiliatePortalView';
import { TrainerView } from './views/TrainerView';
import { SuperAdminView } from './views/SuperAdminView';
import { DiagnosticFoodView } from './views/DiagnosticFoodView';
import { GymEsencialView } from './views/GymEsencialView';
import { LoginView } from './views/LoginView';

import { api } from './services/api';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('ADMIN');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [aforoInfo, setAforoInfo] = useState({ current: 2, max: 60, percent: 3 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Verificar si hay sesión guardada en localStorage
  useEffect(() => {
    const savedUserStr = localStorage.getItem('apex_user');
    if (savedUserStr) {
      try {
        const user = JSON.parse(savedUserStr);
        setCurrentUser(user);
        setIsAuthenticated(true);
        const role = (user.role as UserRole) || 'ADMIN';
        setActiveRole(role);
        if (role === 'SUPERADMIN') setCurrentView('superadmin');
        else if (role === 'TRAINER') setCurrentView('trainer');
        else if (role === 'MEMBER') setCurrentView('affiliate');
        else setCurrentView('dashboard');
      } catch (e) {
        localStorage.removeItem('apex_user');
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Sincronizar aforo para el Sidebar
  const syncAforo = async () => {
    try {
      const data = await api.getDashboard();
      if (data?.metrics) {
        setAforoInfo({
          current: data.metrics.currentInGym,
          max: data.metrics.maxCapacity,
          percent: data.metrics.occupancyPercent,
        });
      }
    } catch (e) {
      // Ignorar si el backend está ocupado
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      syncAforo();
      const interval = setInterval(syncAforo, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = (user: any, role: UserRole) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveRole(role);
    if (role === 'SUPERADMIN') setCurrentView('superadmin');
    else if (role === 'ADMIN') setCurrentView('dashboard');
    else if (role === 'TRAINER') setCurrentView('trainer');
    else if (role === 'MEMBER') setCurrentView('affiliate');
  };

  const handleLogout = () => {
    localStorage.removeItem('apex_token');
    localStorage.removeItem('apex_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setActiveRole(newRole);
    if (newRole === 'SUPERADMIN') setCurrentView('superadmin');
    else if (newRole === 'ADMIN') setCurrentView('dashboard');
    else if (newRole === 'TRAINER') setCurrentView('trainer');
    else if (newRole === 'MEMBER') setCurrentView('affiliate');
    setMobileMenuOpen(false);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const handleSelectMemberForRenewal = (memberId: string) => {
    setSelectedMemberId(memberId);
    setCurrentView('members');
    setMobileMenuOpen(false);
  };

  const getHeaderInfo = () => {
    switch (currentView) {
      case 'superadmin':
        return { title: 'Consola Superusuario SaaS', subtitle: 'Administración centralizada de gimnasios, franquicias y administradores' };
      case 'diagnostic':
        return { title: 'Diagnóstico IA & Alimentos', subtitle: 'Escaneo corporal, detección de lesiones y nutrición adaptada a tus gustos' };
      case 'dashboard':
        return { title: 'Panel de Control Principal', subtitle: 'Telemetría del gimnasio y aforo en tiempo real' };
      case 'gym_esencial':
        return { title: 'GYM ESENCIAL - Dashboard Administrativo', subtitle: 'Diseño Institucional Blanco & Azul con Métricas, Socios, Clases y Facturación' };
      case 'checkin':
        return { title: 'Recepción & Control de Acceso', subtitle: 'Validación de carnet QR, DNI y registro de entradas/salidas' };
      case 'members':
        return { title: 'Directorio de Socios', subtitle: 'Gestión integral, carnets digitales y estados de membresía' };
      case 'pos':
        return { title: 'Caja & Cobros (POS)', subtitle: 'Cobro de mensualidades, pases diarios y comprobantes de pago' };
      case 'routines':
        return { title: 'Catálogo de Rutinas & Ejercicios', subtitle: 'Ejercicios para Gimnasio y En Casa con asistente de IA Gemini' };
      case 'aforo':
        return { title: 'Control de Aforo & Salas', subtitle: 'Ocupación perimétrica de salas y monitoreo de afluencia' };
      case 'settings':
        return { title: 'Configuración del Gimnasio', subtitle: 'Parámetros del negocio, NIT, horarios y aforo máximo' };
      case 'affiliate':
        return { title: 'Portal del Afiliado / Socio', subtitle: 'Carnet digital virtual QR, membresía vigente, dieta IA y entrenamientos' };
      case 'trainer':
        return { title: 'Portal del Entrenador & Asistente IA', subtitle: 'Supervisión biomecánica, edición directa de rutinas y nutrición con Google Gemini' };
      default:
        return { title: 'APEX GYM', subtitle: 'Sistema de Gestión' };
    }
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const headerInfo = getHeaderInfo();

  return (
    <div className="app-container">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        aforoInfo={aforoInfo}
        activeRole={activeRole}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="main-content">
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onOpenQuickScan={() => handleNavigate('checkin')}
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
          currentUser={currentUser}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="content-body">
          {currentView === 'superadmin' && <SuperAdminView />}

          {currentView === 'diagnostic' && <DiagnosticFoodView />}

          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onSelectMemberForRenewal={handleSelectMemberForRenewal}
            />
          )}

          {currentView === 'gym_esencial' && (
            <GymEsencialView
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'checkin' && (
            <CheckInView
              onNavigate={handleNavigate}
              onSelectMemberForRenewal={handleSelectMemberForRenewal}
            />
          )}

          {currentView === 'members' && (
            <MembersView
              onNavigate={handleNavigate}
              selectedMemberId={selectedMemberId}
            />
          )}

          {currentView === 'pos' && <POSView />}

          {currentView === 'routines' && <RoutinesView />}

          {currentView === 'aforo' && <AforoView />}

          {currentView === 'settings' && <SettingsView />}

          {currentView === 'affiliate' && <AffiliatePortalView />}

          {currentView === 'trainer' && <TrainerView />}
        </main>

        {/* Barra de Navegación Inferior Nativa para Celulares */}
        <MobileBottomNav
          currentView={currentView}
          onNavigate={handleNavigate}
          activeRole={activeRole}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default App;
