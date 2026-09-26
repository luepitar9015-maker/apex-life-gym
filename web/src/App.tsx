import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { MobileBottomNav } from './components/MobileBottomNav.js';
import { AuthModal } from './components/AuthModal.js';
import { ColorPaletteModal } from './components/ColorPaletteModal.js';
import { ColorTheme, EnvironmentTheme, SymbolTheme, getSavedTheme, getSavedEnvTheme, applyGlobalTheme, getSavedSymbol, getSavedPortalName } from './styles/themeConfig.js';
import { UserHomePortalView } from './views/UserHomePortalView.js';
import { DashboardView } from './views/DashboardView.js';
import { CheckInView } from './views/CheckInView.js';
import { MembersView } from './views/MembersView.js';
import { AIScanView } from './views/AIScanView.js';
import { RoutinesView } from './views/RoutinesView.js';
import { NutritionView } from './views/NutritionView.js';
import { TLCView } from './views/TLCView.js';
import { TrainersView } from './views/TrainersView.js';
import { UsersManagementView } from './views/UsersManagementView.js';
import { AuditLogsView } from './views/AuditLogsView.js';
import { ServerStatusView } from './views/ServerStatusView.js';
import { ProfitShareView } from './views/ProfitShareView.js';
import { TLCStoreView } from './views/TLCStoreView.js';
import { TLCVideoAIView } from './views/TLCVideoAIView.js';
import { TLCContactsView } from './views/TLCContactsView.js';
import { LicensesView } from './views/LicensesView.js';
import { SupportView } from './views/SupportView.js';
import { AIAgentView } from './views/AIAgentView.js';
import { AIAgentFabModal } from './components/AIAgentFabModal.js';
import { ApexLifeMasterView } from './views/ApexLifeMasterView.js';
import { ApexLifeApp } from './ApexLifeApp.js';
import { getStoredUser, clearStoredAuth, fetchProfile, setStoredUser, AuthUser, UserRole } from './services/api.js';

const DEFAULT_USER: AuthUser = {
  id: 'usr-luepitar-superadmin',
  email: 'luepitar@gamil.com',
  firstName: 'Luepitar',
  lastName: 'Director Master',
  role: 'SUPERADMIN',
  business: { id: 'b-central', name: 'APEX LIFE Global & Soporte Central', type: 'GYM' },
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
  affiliateRank: 'Director Master Global',
};

export const App: React.FC = () => {
  const [activeSystem, setActiveSystem] = useState<'gym' | 'tlc'>('gym');
  const [currentView, setCurrentView] = useState('users'); // Iniciar en el módulo solicitado de gestión de usuarios & permisos
  const [user, setUser] = useState<AuthUser>(getStoredUser() || DEFAULT_USER);
  const [referralCode, setReferralCode] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(getSavedTheme());
  const [currentEnv, setCurrentEnv] = useState<EnvironmentTheme>(getSavedEnvTheme());
  const [currentSymbol, setCurrentSymbol] = useState<SymbolTheme>(getSavedSymbol());
  const [portalName, setPortalName] = useState<string>(getSavedPortalName());
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isAIAgentModalOpen, setIsAIAgentModalOpen] = useState(false);

  useEffect(() => {
    // Sincronizar tema global en CSS
    applyGlobalTheme(currentTheme, currentEnv);

    // Cargar perfil si existe token
    fetchProfile().then((userData) => {
      if (userData) {
        setUser(userData);
      }
    });

    // Código de afiliado
    if (user?.role === 'AFFILIATE' || user?.role === 'SUPERADMIN') {
      const code = `TLC-${user.firstName.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setReferralCode(code);
    }
  }, []);

  const handleLogout = () => {
    clearStoredAuth();
    setUser(DEFAULT_USER);
  };

  const handleSwitchSystem = (system: 'gym' | 'tlc') => {
    setActiveSystem(system);
    if (system === 'tlc') {
      setCurrentView('tlc');
    } else {
      setCurrentView('home');
    }
  };

  const handleQuickSwitchUser = (role: UserRole, businessType: 'TLC' | 'GYM' = 'GYM') => {
    const avatars: Record<string, string> = {
      SUPERADMIN: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
      BUSINESS_ADMIN: businessType === 'TLC'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      AFFILIATE: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
      TRAINER: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
      NUTRITIONIST: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop',
      MEMBER: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop',
    };

    const names: Record<string, { f: string; l: string }> = {
      SUPERADMIN: { f: 'Director', l: 'Superadmin' },
      BUSINESS_ADMIN: businessType === 'TLC' ? { f: 'Patricia', l: 'Gómez' } : { f: 'Carlos', l: 'Mendoza' },
      AFFILIATE: { f: 'Sofía', l: 'Ramírez' },
      TRAINER: { f: 'Marco', l: 'Valderrama' },
      NUTRITIONIST: { f: 'Dra. Elena', l: 'Vargas' },
      MEMBER: { f: 'Andrés', l: 'López' },
    };

    const newUser: AuthUser = {
      id: `usr-${role.toLowerCase()}-${Date.now()}`,
      email: `${role.toLowerCase()}@apexlifegym.com`,
      firstName: names[role]?.f || 'Usuario',
      lastName: names[role]?.l || 'Activo',
      role,
      avatarUrl: avatars[role],
      business: role !== 'SUPERADMIN' ? {
        id: `biz-${businessType.toLowerCase()}`,
        name: businessType === 'TLC' ? 'Total Life Changes - Sede Central' : 'Power Gym Fitness Club',
        type: businessType,
      } : undefined,
      affiliateRank: role === 'AFFILIATE' ? 'Director Estrella' : undefined,
      totalPvPoints: role === 'AFFILIATE' ? 1250 : undefined,
    };

    setUser(newUser);
    setStoredUser(newUser);

    if (role === 'AFFILIATE') {
      setActiveSystem('tlc');
      setCurrentView('tlc');
    }
  };

  const getViewDetails = () => {
    switch (currentView) {
      case 'users':
        return { title: 'Gestión de Usuarios & Permisos', subtitle: 'Administración de cuentas, roles, permisos granulares y accesos' };
      case 'audit':
        return { title: 'Sistema de Auditoría & Trazabilidad', subtitle: 'Bitácora de seguridad, accesos y eventos de auditoría forense' };
      case 'server_status':
        return { title: 'Estado y Telemetría del Servidor', subtitle: 'Monitoreo de CPU, RAM, PostgreSQL, Prisma y latencia en vivo' };
      case 'apex_master':
        return { title: 'APEX LIFE 360°', subtitle: 'Arquitectura Integral de 3 Roles (Admin, Entrenador IA, Socio Body Scan)' };
      case 'apex_app':
        return { title: 'APEX LIFE High-Tech Biometric', subtitle: 'Fronter autónomo de máquinas, productos y diagnóstico' };
      case 'home':
        return { title: portalName, subtitle: 'Tu Carnet Digital & Portal Inteligente APEX' };
      case 'dashboard':
        return { title: 'Dashboard General Gym', subtitle: 'Métricas de aforo, ingresos y estadísticas del club' };
      case 'checkin':
        return { title: 'Recepción & Check-in QR', subtitle: 'Validación en vivo de membresías y aforo' };
      case 'members':
        return { title: 'Directorio de Socios', subtitle: 'Padrón activo, suscripciones y planes VIP' };
      case 'trainers':
        return { title: 'Directorio de Entrenadores', subtitle: 'Asignaciones personalizadas y supervisión' };
      case 'aiscan':
        return { title: 'Escaneo Corporal IA', subtitle: 'Composición corporal, porcentaje de grasa y somatotipo' };
      case 'routines':
        return { title: 'Rutinas & Entrenamientos', subtitle: 'Catálogo de ejercicios, series, repeticiones y RPE' };
      case 'nutrition':
        return { title: 'Plan Nutricional & Macros', subtitle: 'Cálculo metabólico basal y requerimiento calórico' };
      case 'tlc':
        return { title: 'Total Life Changes (TLC)', subtitle: 'Dashboard de afiliado y red de distribución multinivel' };
      case 'tlc_contacts':
        return { title: 'Prospectos TLC (Ley 1581)', subtitle: 'Base de datos protegida con cumplimiento normativo' };
      case 'tlc_video_ai':
        return { title: 'Video Marketing IA', subtitle: 'Creación automatizada de contenido viral y reels' };
      case 'tlc_store':
        return { title: 'Tienda en Línea TLC', subtitle: 'Catálogo oficial con enlace directo de referidos (50% Comisiones)' };
      case 'licenses':
        return { title: 'Licencias & Permisos SaaS', subtitle: 'Gestión de licencias activas y módulos habilitados' };
      case 'support':
        return { title: 'Soporte Técnico', subtitle: 'Tickets de servicio y asistencia técnica prioritaria' };
      case 'ai_agent':
        return { title: 'Agente IA Autónomo', subtitle: 'Asistente inteligente 24/7 para el club y la red' };
      default:
        return { title: 'APEX LIFE Platform', subtitle: 'Sistema de Gestión Fitness & TLC' };
    }
  };

  const details = getViewDetails();

  return (
    <div 
      className="app-main-layout"
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: currentEnv.canvasBg,
        transition: 'background 0.25s ease',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Sidebar Flotante con navegación integrada */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={(view) => setCurrentView(view)} 
        activeSystem={activeSystem}
        onSwitchSystem={handleSwitchSystem}
        currentTheme={currentTheme}
        currentEnv={currentEnv}
        currentSymbol={currentSymbol}
        portalName={portalName}
        currentUser={user}
        onLogout={handleLogout}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area con estilo Nexo */}
      <main 
        className="app-main-content"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <Header 
          title={details.title} 
          subtitle={details.subtitle} 
          user={user}
          activeSystem={activeSystem}
          currentTheme={currentTheme}
          currentEnv={currentEnv}
          currentSymbol={currentSymbol}
          portalName={portalName}
          onOpenColorModal={() => setIsColorModalOpen(true)}
          onSwitchSystem={handleSwitchSystem}
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onQuickSwitchUser={handleQuickSwitchUser}
          onOpenMenu={() => setIsMobileDrawerOpen(true)}
        />

        <div style={{ flex: 1, minWidth: 0, padding: '1.25rem' }}>
          
          {/* 1. SISTEMA DE CREACIÓN DE USUARIOS & PERMISOS */}
          {currentView === 'users' && (
            <UsersManagementView 
              onSwitchUser={(u) => setUser(u)} 
              currentTheme={currentTheme} 
            />
          )}

          {/* 2. SISTEMA DE AUDITORÍA & TRAZABILIDAD */}
          {currentView === 'audit' && (
            <AuditLogsView 
              currentTheme={currentTheme} 
            />
          )}

          {/* 3. SISTEMA DE ESTADO DEL SERVIDOR */}
          {currentView === 'server_status' && (
            <ServerStatusView 
              currentTheme={currentTheme} 
            />
          )}

          {/* Vista Maestra APEX 360 */}
          {currentView === 'apex_master' && (
            <ApexLifeMasterView
              currentTheme={currentTheme}
              currentEnv={currentEnv}
              currentUser={user}
              onNavigateView={(v) => setCurrentView(v)}
            />
          )}

          {/* Fronter High-Tech Autónomo */}
          {currentView === 'apex_app' && (
            <ApexLifeApp />
          )}

          {/* Portal Intuitivo del Usuario */}
          {currentView === 'home' && (
            <UserHomePortalView 
              onNavigate={(v) => setCurrentView(v)} 
              currentUser={user}
              currentTheme={currentTheme}
              currentEnv={currentEnv}
              currentSymbol={currentSymbol}
              portalName={portalName}
              onOpenCustomizer={() => setIsColorModalOpen(true)}
              onOpenAICopilot={() => setIsAIAgentModalOpen(true)}
              onThemeChange={(newTheme) => setCurrentTheme(newTheme)}
              onSymbolChange={(newSymbol) => setCurrentSymbol(newSymbol)}
              onPortalNameChange={(newName) => setPortalName(newName)}
            />
          )}

          {/* Módulos GYM */}
          {currentView === 'dashboard' && <DashboardView onNavigate={(v) => setCurrentView(v)} currentTheme={currentTheme} />}
          {currentView === 'checkin' && <CheckInView currentTheme={currentTheme} />}
          {currentView === 'members' && <MembersView currentTheme={currentTheme} />}
          {currentView === 'trainers' && <TrainersView currentTheme={currentTheme} />}
          {currentView === 'aiscan' && <AIScanView currentTheme={currentTheme} />}
          {currentView === 'routines' && <RoutinesView currentTheme={currentTheme} />}
          {currentView === 'nutrition' && <NutritionView currentTheme={currentTheme} />}

          {/* Módulos TLC */}
          {currentView === 'tlc_contacts' && <TLCContactsView currentUser={user} currentTheme={currentTheme} />}
          {currentView === 'tlc_video_ai' && <TLCVideoAIView user={user} currentTheme={currentTheme} referralCode={referralCode} />}
          {currentView === 'tlc_store' && <TLCStoreView user={user} currentTheme={currentTheme} referralCode={referralCode} />}
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

          {/* Licencias & Soporte */}
          {currentView === 'licenses' && <LicensesView currentUser={user} currentTheme={currentTheme} />}
          {currentView === 'support' && <SupportView currentUser={user} currentTheme={currentTheme} />}

          {/* Agente IA & Profit Share */}
          {currentView === 'ai_agent' && <AIAgentView currentTheme={currentTheme} currentUser={user} onNavigate={(v) => setCurrentView(v)} />}
          {currentView === 'profit_share' && <ProfitShareView onNavigate={(v) => setCurrentView(v)} onNavigateBack={() => setCurrentView('dashboard')} />}
        </div>
      </main>

      {/* Barra de Navegación Inferior para Celulares */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        activeSystem={activeSystem}
        onSwitchSystem={handleSwitchSystem}
        currentTheme={currentTheme}
        currentUser={user}
        onOpenMenu={() => setIsMobileDrawerOpen(true)}
      />

      {/* Agente IA Flotante Interactivo */}
      <AIAgentFabModal
        currentTheme={currentTheme}
        onNavigate={(view) => setCurrentView(view)}
        isOpen={isAIAgentModalOpen}
        onToggle={() => setIsAIAgentModalOpen(!isAIAgentModalOpen)}
      />

      {/* Centro de Personalización: Colores, Entornos & Símbolos */}
      <ColorPaletteModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        currentTheme={currentTheme}
        currentEnv={currentEnv}
        currentSymbol={currentSymbol}
        portalName={portalName}
        onThemeChange={(newTheme) => {
          setCurrentTheme(newTheme);
          applyGlobalTheme(newTheme, currentEnv);
        }}
        onEnvChange={(newEnv) => {
          setCurrentEnv(newEnv);
          applyGlobalTheme(currentTheme, newEnv);
        }}
        onSymbolChange={(newSymbol) => setCurrentSymbol(newSymbol)}
        onPortalNameChange={(newName) => setPortalName(newName)}
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
