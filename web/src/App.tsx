import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

import { DashboardView } from './views/DashboardView';
import { CheckInView } from './views/CheckInView';
import { MembersView } from './views/MembersView';
import { POSView } from './views/POSView';
import { RoutinesView } from './views/RoutinesView';
import { AforoView } from './views/AforoView';
import { SettingsView } from './views/SettingsView';
import { AffiliatePortalView } from './views/AffiliatePortalView';
import { TrainerView } from './views/TrainerView';

import { api } from './services/api';

export type UserRole = 'ADMIN' | 'TRAINER' | 'MEMBER';

export const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>('ADMIN');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [aforoInfo, setAforoInfo] = useState({ current: 2, max: 60, percent: 3 });

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
    syncAforo();
    const interval = setInterval(syncAforo, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setActiveRole(newRole);
    if (newRole === 'ADMIN') setCurrentView('dashboard');
    else if (newRole === 'TRAINER') setCurrentView('trainer');
    else if (newRole === 'MEMBER') setCurrentView('affiliate');
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleSelectMemberForRenewal = (memberId: string) => {
    setSelectedMemberId(memberId);
    setCurrentView('members');
  };

  const getHeaderInfo = () => {
    switch (currentView) {
      case 'dashboard':
        return { title: 'Panel de Control Principal', subtitle: 'Telemetría del gimnasio y aforo en tiempo real' };
      case 'checkin':
        return { title: 'Recepción & Control de Acceso', subtitle: 'Validación de carnet QR, DNI y registro de entradas/salidas' };
      case 'members':
        return { title: 'Directorio de Socios', subtitle: 'Gestión integral, carnets digitales y estados de membresía' };
      case 'pos':
        return { title: 'Caja & Cobros (POS)', subtitle: 'Cobro de mensualidades, pases diarios y comprobantes de pago' };
      case 'routines':
        return { title: 'Rutinas & Ejercicios', subtitle: 'Catálogo biomecánico, asignación a socios y cronómetro de descanso' };
      case 'aforo':
        return { title: 'Control de Aforo & Salas', subtitle: 'Ocupación perimétrica de salas y monitoreo de afluencia' };
      case 'settings':
        return { title: 'Configuración del Gimnasio', subtitle: 'Parámetros del negocio, NIT, horarios y aforo máximo' };
      case 'affiliate':
        return { title: 'Portal del Afiliado / Socio', subtitle: 'Carnet digital virtual QR, membresía vigente y entrenamientos' };
      case 'trainer':
        return { title: 'Portal del Entrenador', subtitle: 'Supervisión de atletas, prescripción de rutinas y descansos' };
      default:
        return { title: 'APEX GYM', subtitle: 'Sistema de Gestión' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="app-container">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        aforoInfo={aforoInfo}
        activeRole={activeRole}
      />

      <div className="main-content">
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onOpenQuickScan={() => handleNavigate('checkin')}
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
        />

        <main className="content-body">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onSelectMemberForRenewal={handleSelectMemberForRenewal}
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
      </div>
    </div>
  );
};

export default App;
