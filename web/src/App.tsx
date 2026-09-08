import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { DashboardView } from './views/DashboardView.js';
import { CheckInView } from './views/CheckInView.js';
import { MembersView } from './views/MembersView.js';
import { AIScanView } from './views/AIScanView.js';
import { RoutinesView } from './views/RoutinesView.js';
import { NutritionView } from './views/NutritionView.js';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const getViewDetails = () => {
    switch (currentView) {
      case 'dashboard':
        return { title: 'Dashboard General', subtitle: 'Métricas de rendimiento e indicadores en tiempo real' };
      case 'checkin':
        return { title: 'Recepción & Control de Acceso', subtitle: 'Validación en vivo con código QR' };
      case 'members':
        return { title: 'Directorio de Socios', subtitle: 'Gestión de membresías y perfiles biométricos' };
      case 'aiscan':
        return { title: 'Escaneo Corporal IA', subtitle: 'Análisis de composición corporal y diagnóstico postural' };
      case 'routines':
        return { title: 'Rutinas & Ejercicios', subtitle: 'Planificación de hipertrofia y sobrecarga progresiva' };
      case 'nutrition':
        return { title: 'Plan Nutricional', subtitle: 'Cálculo metabólico y macronutrientes' };
      default:
        return { title: 'Gym Fit AI', subtitle: 'Plataforma Integral' };
    }
  };

  const details = getViewDetails();

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} onNavigate={(view) => setCurrentView(view)} />

      {/* Main Content Area */}
      <main className="main-content">
        <Header title={details.title} subtitle={details.subtitle} />

        <div className="content-body">
          {currentView === 'dashboard' && <DashboardView onNavigate={(v) => setCurrentView(v)} />}
          {currentView === 'checkin' && <CheckInView />}
          {currentView === 'members' && <MembersView />}
          {currentView === 'aiscan' && <AIScanView />}
          {currentView === 'routines' && <RoutinesView />}
          {currentView === 'nutrition' && <NutritionView />}
        </div>
      </main>
    </div>
  );
};

export default App;
