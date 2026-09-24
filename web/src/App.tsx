import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { AuthModal } from './components/AuthModal.js';
import { ColorPaletteModal } from './components/ColorPaletteModal.js';
import { ColorTheme, EnvironmentTheme, getSavedTheme, getSavedEnvTheme, applyGlobalTheme } from './styles/themeConfig.js';
import { DashboardView } from './views/DashboardView.js';
import { CheckInView } from './views/CheckInView.js';
import { MembersView } from './views/MembersView.js';
import { AIScanView } from './views/AIScanView.js';
import { RoutinesView } from './views/RoutinesView.js';
import { NutritionView } from './views/NutritionView.js';
import { TLCView } from './views/TLCView.js';
import { TrainersView } from './views/TrainersView.js';
import { UsersManagementView } from './views/UsersManagementView.js';
import { ProfitShareView } from './views/ProfitShareView.js';
import { TLCStoreView } from './views/TLCStoreView.js';
import { TLCVideoAIView } from './views/TLCVideoAIView.js';
import { TLCContactsView } from './views/TLCContactsView.js';
import { LicensesView } from './views/LicensesView.js';
import { SupportView } from './views/SupportView.js';
import { LoginView } from './views/LoginView.js';
import { getStoredUser, clearStoredAuth, fetchProfile, setStoredUser, AuthUser, UserRole } from './services/api.js';

export const App: React.FC = () => {
  const [activeSystem, setActiveSystem] = useState<'gym' | 'tlc'>('gym');
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [referralCode, setReferralCode] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(getSavedTheme());
  const [currentEnv, setCurrentEnv] = useState<EnvironmentTheme>(getSavedEnvTheme());

  useEffect(() => {
    // Aplicar temas guardados al cargar (Tableta 1 y Tableta 2)
    applyGlobalTheme(currentTheme, currentEnv);

    // Detectar si se accede a la tienda en línea mediante enlace compartido (?view=tlc_store&ref=...)
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const refParam = urlParams.get('ref');

    if (refParam) {
      setReferralCode(refParam);
    }
    if (viewParam === 'tlc_store') {
      setActiveSystem('tlc');
      setCurrentView('tlc_store');
    }

    // Restaurar usuario desde almacenamiento local y sincronizar con backend
    const saved = getStoredUser();
    if (saved) {
      setUser(saved);
      if (!viewParam && (saved.business?.type === 'TLC' || saved.role === 'AFFILIATE')) {
        setActiveSystem('tlc');
        setCurrentView('tlc');
      }
      fetchProfile().then((profile) => {
        if (profile) setUser(profile);
      });
    }
  }, []);

  const handleLogout = () => {
    clearStoredAuth();
    setUser(null);
  };

  const handleSwitchSystem = (system: 'gym' | 'tlc') => {
    setActiveSystem(system);
    if (system === 'tlc') {
      setCurrentView('tlc');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleQuickSwitchUser = (role: UserRole, businessType?: 'TLC' | 'GYM') => {
    let mockUser: AuthUser;

    if (role === 'SUPERADMIN') {
      mockUser = {
        id: 'usr-super',
        email: 'superadmin@gymfit.com',
        firstName: 'Carlos',
        lastName: 'Superadmin',
        role: 'SUPERADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      };
    } else if (role === 'BUSINESS_ADMIN' && businessType === 'TLC') {
      mockUser = {
        id: 'usr-admin-tlc',
        email: 'admin.tlc@totallifechanges.com',
        firstName: 'Patricia',
        lastName: 'Suárez',
        role: 'BUSINESS_ADMIN',
        business: { id: 'b-tlc', name: 'Total Life Changes - Líderes VIP', type: 'TLC' },
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop',
      };
      setActiveSystem('tlc');
      setCurrentView('tlc');
    } else if (role === 'BUSINESS_ADMIN') {
      mockUser = {
        id: 'usr-admin-gym',
        email: 'admin.gym@powergym.com',
        firstName: 'Roberto',
        lastName: 'Mendoza',
        role: 'BUSINESS_ADMIN',
        business: { id: 'b-gym', name: 'Power Gym Club Sede Central', type: 'GYM' },
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
      };
      setActiveSystem('gym');
      setCurrentView('dashboard');
    } else if (role === 'AFFILIATE') {
      mockUser = {
        id: 'usr-aff-tlc',
        email: 'afiliado.tlc@totallifechanges.com',
        firstName: 'Elena',
        lastName: 'Morales',
        role: 'AFFILIATE',
        affiliateRank: 'Director Nacional',
        totalPvPoints: 12500,
        business: { id: 'b-tlc', name: 'Total Life Changes - Líderes VIP', type: 'TLC' },
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop',
      };
      setActiveSystem('tlc');
      setCurrentView('tlc');
    } else if (role === 'TRAINER') {
      mockUser = {
        id: 'usr-coach',
        email: 'marcos.coach@gymfit.com',
        firstName: 'Marcos',
        lastName: 'Valenzuela',
        role: 'TRAINER',
        business: { id: 'b-gym', name: 'Power Gym Club Sede Central', type: 'GYM' },
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      };
      setActiveSystem('gym');
      setCurrentView('trainers');
    } else {
      mockUser = {
        id: 'usr-member',
        email: 'juan.perez@email.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'MEMBER',
        business: { id: 'b-gym', name: 'Power Gym Club Sede Central', type: 'GYM' },
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      };
    }

    setUser(mockUser);
    setStoredUser(mockUser);
  };

  const getViewDetails = () => {
    switch (currentView) {
      case 'dashboard':
        return { title: 'Dashboard General Gym', subtitle: 'Aforo en vivo, métricas de capacidad e ingresos del gimnasio' };
      case 'checkin':
        return { title: 'Recepción & Control de Acceso', subtitle: 'Validación en vivo con código QR para socios' };
      case 'members':
        return { title: 'Directorio de Socios', subtitle: 'Gestión de membresías y perfiles biométricos' };
      case 'trainers':
        return { title: 'Entrenadores Personalizados', subtitle: 'Coaching 1 a 1, asignación de alumnos y metas individuales' };
      case 'aiscan':
        return { title: 'Escaneo Corporal IA', subtitle: 'Análisis de composición corporal y diagnóstico postural con visión artificial' };
      case 'routines':
        return { title: 'Rutinas & Ejercicios', subtitle: 'Planificación de hipertrofia y sobrecarga progresiva' };
      case 'nutrition':
        return { title: 'Plan Nutricional Deportivo', subtitle: 'Cálculo metabólico basal y macronutrientes' };
      case 'tlc':
      case 'tlc_protocols':
      case 'tlc_affiliates':
      case 'tlc_products':
      case 'tlc_sales':
        return { title: 'Total Life Changes (TLC) Hub', subtitle: 'Gestión de red de afiliados, reto détox y kits de suplementos' };
      case 'tlc_store':
        return { title: 'Tienda en Línea TLC Global', subtitle: 'Catálogo de suplementos détox con atribución de comisión 50% vía enlace de afiliado' };
      case 'tlc_video_ai':
        return { title: 'TLC AI Content Engine', subtitle: 'Estudio de Video Marketing IA & Publicación Automática para Redes Sociales' };
      case 'tlc_contacts':
        return { title: 'Contactos TLC • Ley 1581', subtitle: 'Gestión con autorización y Habeas Data de Colombia' };
      case 'licenses':
        return { title: 'Activador de Licencias & Permisos', subtitle: 'Control maestro de vigencia, claves y módulos permitidos' };
      case 'support':
        return { title: 'Centro de Soporte Técnico', subtitle: 'Tickets de asistencia técnica, resolución de incidencias y soporte 24/7' };
      case 'users':
        return { title: 'Gestión de Usuarios & Roles', subtitle: 'Superadministrador, Administradores de Negocio y Afiliados' };
      case 'profit_share':
        return { title: 'My Profit Share (Nexo)', subtitle: 'COPY-X Network & Historial de Comisiones con Tabla de Colores Personalizada' };
      default:
        return { title: 'APEX LIFE & TLC Multi-System', subtitle: 'Plataforma Integral' };
    }
  };

  // Pantalla de Inicio de Sesión obligatoria si no hay usuario autenticado (salvo tienda pública)
  if (!user && currentView !== 'tlc_store') {
    return (
      <LoginView 
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          setStoredUser(loggedUser);
          if (loggedUser.business?.type === 'TLC' || loggedUser.role === 'AFFILIATE') {
            setActiveSystem('tlc');
            setCurrentView('tlc');
          } else {
            setActiveSystem('gym');
            setCurrentView('dashboard');
          }
        }} 
      />
    );
  }

  const details = getViewDetails();

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: currentEnv.canvasBg,
      transition: 'background 0.25s ease',
      padding: '1.25rem',
      gap: '1.25rem',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Sidebar Flotante redondeado con tema dinámico */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={(view) => setCurrentView(view)} 
        activeSystem={activeSystem}
        onSwitchSystem={handleSwitchSystem}
        currentTheme={currentTheme}
        currentEnv={currentEnv}
        currentUser={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area con estilo Nexo */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        minWidth: 0,
      }}>
        <Header 
          title={details.title} 
          subtitle={details.subtitle} 
          user={user}
          activeSystem={activeSystem}
          currentTheme={currentTheme}
          currentEnv={currentEnv}
          onOpenColorModal={() => setIsColorModalOpen(true)}
          onSwitchSystem={handleSwitchSystem}
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onQuickSwitchUser={handleQuickSwitchUser}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Módulos GYM con Estilo Nexo */}
          {currentView === 'dashboard' && <DashboardView onNavigate={(v) => setCurrentView(v)} currentTheme={currentTheme} />}
          {currentView === 'checkin' && <CheckInView currentTheme={currentTheme} />}
          {currentView === 'members' && <MembersView currentTheme={currentTheme} />}
          {currentView === 'trainers' && <TrainersView currentTheme={currentTheme} />}
          {currentView === 'aiscan' && <AIScanView currentTheme={currentTheme} />}
          {currentView === 'routines' && <RoutinesView currentTheme={currentTheme} />}
          {currentView === 'nutrition' && <NutritionView currentTheme={currentTheme} />}

          {/* Contactos Ley 1581 Colombia (TLC) */}
          {currentView === 'tlc_contacts' && (
            <TLCContactsView 
              currentUser={user} 
              currentTheme={currentTheme} 
            />
          )}

          {/* Motor de Video Marketing IA para TLC */}
          {currentView === 'tlc_video_ai' && (
            <TLCVideoAIView 
              user={user} 
              currentTheme={currentTheme} 
              referralCode={referralCode} 
            />
          )}

          {/* Tienda en Línea TLC con Enlace de Afiliado y Exclusividad Superadmin */}
          {currentView === 'tlc_store' && (
            <TLCStoreView 
              user={user} 
              currentTheme={currentTheme} 
              referralCode={referralCode} 
            />
          )}

          {/* Módulos TLC con Estilo Nexo */}
          {currentView !== 'tlc_store' && currentView !== 'tlc_video_ai' && currentView !== 'tlc_contacts' && (currentView === 'tlc' || currentView.startsWith('tlc_')) && (
            <TLCView 
              currentTheme={currentTheme} 
              initialTab={
                currentView === 'tlc_protocols' ? 'protocols' :
                currentView === 'tlc_affiliates' ? 'affiliates' :
                currentView === 'tlc_products' ? 'products' :
                currentView === 'tlc_sales' ? 'sales' : 'overview'
              } 
            />
          )}

          {/* Activador de Licencias y Permisos (Superadmin) */}
          {currentView === 'licenses' && (
            <LicensesView 
              currentUser={user} 
              currentTheme={currentTheme} 
            />
          )}

          {/* Centro de Soporte Técnico */}
          {currentView === 'support' && (
            <SupportView 
              currentUser={user} 
              currentTheme={currentTheme} 
            />
          )}

          {/* Módulos de Administración */}
          {currentView === 'users' && <UsersManagementView onSwitchUser={(u) => setUser(u)} currentTheme={currentTheme} />}
          
          {/* Vista Especial Profit Share Nexo */}
          {currentView === 'profit_share' && <ProfitShareView onNavigate={(v) => setCurrentView(v)} onNavigateBack={() => setCurrentView('dashboard')} />}
        </div>
      </main>

      {/* Modal Interactivo de Dos Tabletas de Colores (Tableta 1: Acento & Banners, Tableta 2: Entorno & Fondos) */}
      <ColorPaletteModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        currentTheme={currentTheme}
        currentEnv={currentEnv}
        onThemeChange={(newTheme) => {
          setCurrentTheme(newTheme);
          applyGlobalTheme(newTheme, currentEnv);
        }}
        onEnvChange={(newEnv) => {
          setCurrentEnv(newEnv);
          applyGlobalTheme(currentTheme, newEnv);
        }}
      />

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />
    </div>
  );
};

export default App;
