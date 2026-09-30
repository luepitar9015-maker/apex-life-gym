import React, { useState, useEffect } from 'react';
import { Search, Bell, Plus, Calendar, ShieldCheck, Check } from 'lucide-react';

export default function Header({ onQuickAction = () => {} }) {
  const [currentDate, setCurrentDate] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(now);
    setCurrentDate(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  const notifications = [
    { id: 1, title: 'Nueva reserva confirmada', text: 'Carlos Mendoza reservó Spinning 07:00', time: 'Hace 5m' },
    { id: 2, title: 'Pago recibido', text: '$150.000 mensualidad de Andrea Torres', time: 'Hace 22m' },
    { id: 3, title: 'Cupo límite alcanzado', text: 'Clase HIIT 18:00 está al 100% (20/20)', time: 'Hace 1h' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Input */}
      <div className="relative w-80">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar socio, membresía o pago..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Date & Quick Action Tools */}
      <div className="flex items-center gap-4">
        {/* Date pill */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100">
          <Calendar size={14} className="text-blue-600" />
          <span>{currentDate || 'Cargando fecha...'}</span>
        </div>

        {/* Quick Add Member button */}
        <button
          onClick={() => onQuickAction('add-member')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-500/25 transition-all"
        >
          <Plus size={16} />
          <span>Nuevo Socio</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 flex items-center justify-center relative border border-gray-100 transition-colors"
          >
            <Bell size={18} />
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full absolute top-2 right-2 ring-2 ring-white"></span>
          </button>

          {/* Notifications dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-30 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">Notificaciones</h4>
                <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">3 Nuevas</span>
              </div>
              <div className="space-y-3 mt-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                    <p className="text-xs font-bold text-gray-800">{n.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{n.text}</p>
                    <span className="text-[10px] text-blue-600 font-semibold mt-1 inline-block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
