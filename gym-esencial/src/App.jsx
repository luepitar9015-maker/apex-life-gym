import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
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
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar de navegación */}
      <Sidebar activeItem={activeTab} onSelect={(item) => setActiveTab(item)} />

      {/* Área Principal con Header y Vistas */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onQuickAction={(action) => {
          if (action === 'add-member') setActiveTab('Socios');
        }} />

        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
