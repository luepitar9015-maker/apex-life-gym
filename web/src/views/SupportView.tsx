import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageSquare, 
  Filter, 
  Send, 
  User, 
  ShieldCheck, 
  Search,
  Check,
  X
} from 'lucide-react';
import { 
  fetchSupportTickets, 
  createSupportTicket, 
  updateSupportTicket, 
  SupportTicket, 
  AuthUser 
} from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface SupportViewProps {
  currentUser?: AuthUser | null;
  currentTheme?: ColorTheme;
}

export const SupportView: React.FC<SupportViewProps> = ({
  currentUser,
  currentTheme = getSavedTheme(),
}) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  // Modal Crear Ticket
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    subject: '',
    category: 'SISTEMA',
    priority: 'MEDIA',
    description: '',
  });

  // Modal Responder Ticket (Superadmin / Soporte)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [adminResponseText, setAdminResponseText] = useState('');
  const [newStatus, setNewStatus] = useState('RESUELTO');

  useEffect(() => {
    loadTickets();
  }, [statusFilter]);

  const loadTickets = async () => {
    setIsLoading(true);
    const data = await fetchSupportTickets({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
    });
    setTickets(data);
    setIsLoading(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) {
      setFeedback({ type: 'error', message: 'Por favor ingresa asunto y descripción del caso.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const res = await createSupportTicket({
      ...formData,
      userId: currentUser?.id,
    });

    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      loadTickets();
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
        setFormData({ subject: '', category: 'SISTEMA', priority: 'MEDIA', description: '' });
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Error al enviar ticket.' });
    }
  };

  const handleOpenResponse = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setAdminResponseText(ticket.adminResponse || '');
    setNewStatus(ticket.status === 'ABIERTO' ? 'EN_PROCESO' : ticket.status);
  };

  const handleSaveResponse = async () => {
    if (!selectedTicket) return;
    setIsSubmitting(true);
    const res = await updateSupportTicket(selectedTicket.id, {
      adminResponse: adminResponseText,
      status: newStatus,
    });
    setIsSubmitting(false);

    if (res.success) {
      setSelectedTicket(null);
      loadTickets();
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (!searchFilter) return true;
    const query = searchFilter.toLowerCase();
    return (
      t.ticketNumber.toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.user?.firstName.toLowerCase().includes(query) ||
      t.user?.email.toLowerCase().includes(query)
    );
  });

  const isSuperadmin = currentUser?.role === 'SUPERADMIN' || currentUser?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Header Soporte Técnico */}
      <div 
        className="p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
        }}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <LifeBuoy className="w-3.5 h-3.5" />
            Centro de Soporte Técnico 24/7
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Gestión de Tickets & Asistencia Técnica
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Canal oficial para soporte de licencias, pasarelas de pago, sincronización de la app, activación de módulos y dudas sobre la plataforma TLC o Gym.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
        >
          <Plus className="w-4 h-4" />
          Crear Ticket de Soporte
        </button>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-xs text-gray-400 font-medium">Total Tickets</p>
          <p className="text-2xl font-bold text-white">{tickets.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-xs text-gray-400 font-medium">Abiertos</p>
          <p className="text-2xl font-bold text-blue-400">
            {tickets.filter((t) => t.status === 'ABIERTO').length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-xs text-gray-400 font-medium">En Proceso</p>
          <p className="text-2xl font-bold text-amber-400">
            {tickets.filter((t) => t.status === 'EN_PROCESO').length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-xs text-gray-400 font-medium">Resueltos</p>
          <p className="text-2xl font-bold text-emerald-400">
            {tickets.filter((t) => t.status === 'RESUELTO').length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por código, asunto o usuario..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['ALL', 'ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {st === 'ALL' ? 'Todos' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tickets */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-400">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
          <p>Consultando tickets de asistencia técnica...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-800 bg-gray-900/50 space-y-3">
          <LifeBuoy className="w-12 h-12 mx-auto text-gray-600" />
          <p className="text-lg font-medium text-gray-300">No hay tickets registrados</p>
          <p className="text-sm text-gray-500">Si presentas algún inconveniente o requerimiento, genera un ticket de soporte.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl border border-gray-800 bg-gray-900/70 hover:border-gray-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                    {t.ticketNumber}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    t.status === 'RESUELTO'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : t.status === 'EN_PROCESO'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                    Categoría: {t.category}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    t.priority === 'URGENTE' || t.priority === 'ALTA' ? 'text-red-400 bg-red-950/40' : 'text-gray-400 bg-gray-800'
                  }`}>
                    Prioridad: {t.priority}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base">{t.subject}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{t.description}</p>

                {t.adminResponse && (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1">
                    <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Respuesta de Soporte Técnico:
                    </p>
                    <p className="text-xs text-emerald-200">{t.adminResponse}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                  <span>Solicitado por: <strong className="text-gray-300">{t.user?.firstName} {t.user?.lastName} ({t.user?.email})</strong></span>
                  <span>•</span>
                  <span>{new Date(t.createdAt).toLocaleString('es-CO')}</span>
                </div>
              </div>

              {isSuperadmin && (
                <button
                  onClick={() => handleOpenResponse(t)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition flex items-center gap-2 shrink-0 border border-gray-700"
                >
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  {t.adminResponse ? 'Modificar Respuesta' : 'Responder Ticket'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear Ticket */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2.5 text-blue-400">
                <LifeBuoy className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Crear Ticket de Soporte</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === 'success' ? 'bg-emerald-950/60 text-emerald-300' : 'bg-red-950/60 text-red-300'
              }`}>
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Asunto del Problema *</label>
                <input
                  type="text"
                  required
                  placeholder="ej: Consulta sobre renovación de licencia o error en escáner"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="LICENCIA">Licenciamiento & Activación</option>
                    <option value="PAGOS">Pagos & Facturación</option>
                    <option value="SISTEMA">Error en el Sistema</option>
                    <option value="TLC">Módulo TLC & Afiliados</option>
                    <option value="RUTINAS">Rutinas & IA</option>
                    <option value="OTRO">Otro Requerimiento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Prioridad</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Descripción Detallada *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe con claridad qué sucede, qué pasos realizaste o qué asistencia necesitas..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Crear Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Responder Ticket (Superadmin) */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="font-bold text-white text-base">Atención de Ticket {selectedTicket.ticketNumber}</h3>
                <p className="text-xs text-gray-400">{selectedTicket.subject}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800 text-xs text-gray-300">
              <strong className="text-white block mb-1">Descripción reportada por {selectedTicket.user?.firstName}:</strong>
              {selectedTicket.description}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Estado del Ticket</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="ABIERTO">ABIERTO</option>
                  <option value="EN_PROCESO">EN PROCESO</option>
                  <option value="RESUELTO">RESUELTO (Cerrar caso)</option>
                  <option value="CERRADO">CERRADO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Respuesta Técnica / Solución *</label>
                <textarea
                  rows={4}
                  placeholder="Escribe la solución brindada, instrucciones o resolución técnica..."
                  value={adminResponseText}
                  onChange={(e) => setAdminResponseText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 text-xs font-semibold bg-gray-800 text-gray-300 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveResponse}
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar y Notificar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
