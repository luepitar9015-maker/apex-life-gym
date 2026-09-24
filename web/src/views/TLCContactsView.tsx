import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  Search, 
  Filter, 
  Send, 
  Trash2, 
  Info, 
  Lock, 
  ChevronRight,
  Eye,
  X
} from 'lucide-react';
import { 
  fetchTLCContacts, 
  createTLCContact, 
  updateTLCContact, 
  revokeTLCContactConsent, 
  fetchHabeasDataPolicy, 
  TLCContact, 
  AuthUser 
} from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

const COLOMBIA_DEPARTMENTS = [
  'Antioquia', 'Bogotá D.C.', 'Cundinamarca', 'Valle del Cauca', 'Atlántico', 
  'Santander', 'Bolívar', 'Risaralda', 'Caldas', 'Tolima', 'Huila', 
  'Norte de Santander', 'Quindío', 'Nariño', 'Boyacá', 'Meta', 'Cesar', 
  'Córdoba', 'Cauca', 'Magdalena', 'Sucre', 'La Guajira', 'Casanare'
];

interface TLCContactsViewProps {
  currentUser?: AuthUser | null;
  currentTheme?: ColorTheme;
}

export const TLCContactsView: React.FC<TLCContactsViewProps> = ({
  currentUser,
  currentTheme = getSavedTheme(),
}) => {
  const [contacts, setContacts] = useState<TLCContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modal registro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal Política Ley 1581
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [policyText, setPolicyText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    documentType: 'CC',
    documentId: '',
    phone: '',
    email: '',
    department: 'Antioquia',
    city: '',
    leadSource: 'WHATSAPP',
    interestProduct: 'Iaso Tea Original & Détox 30 Días',
    notes: '',
    dataPolicyAccepted: false,
  });

  useEffect(() => {
    loadContacts();
    fetchHabeasDataPolicy().then((res) => {
      setPolicyText(res.policyText);
    });
  }, [statusFilter]);

  const loadContacts = async () => {
    setIsLoading(true);
    const data = await fetchTLCContacts({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      search: searchFilter || undefined,
    });
    setContacts(data);
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadContacts();
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dataPolicyAccepted) {
      setFeedbackMessage({
        type: 'error',
        text: 'Debe marcar la casilla de aceptación y autorización de la Ley 1581 de 2012 de Colombia para continuar.',
      });
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.documentId || !formData.phone || !formData.email) {
      setFeedbackMessage({
        type: 'error',
        text: 'Nombres, apellidos, número de documento, WhatsApp y correo son obligatorios.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage(null);

    const res = await createTLCContact({
      ...formData,
      assignedAffiliateId: currentUser?.id,
    });

    setIsSubmitting(false);

    if (res.success) {
      setFeedbackMessage({
        type: 'success',
        text: '¡Contacto registrado exitosamente con autorización legal Ley 1581!',
      });
      setFormData({
        firstName: '',
        lastName: '',
        documentType: 'CC',
        documentId: '',
        phone: '',
        email: '',
        department: 'Antioquia',
        city: '',
        leadSource: 'WHATSAPP',
        interestProduct: 'Iaso Tea Original & Détox 30 Días',
        notes: '',
        dataPolicyAccepted: false,
      });
      loadContacts();
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedbackMessage(null);
      }, 1500);
    } else {
      setFeedbackMessage({ type: 'error', text: res.message || 'Error al guardar contacto.' });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateTLCContact(id, { status: newStatus });
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus as any } : c))
    );
  };

  const handleRevokeConsent = async (id: string, name: string) => {
    if (window.confirm(`¿Confirmas que el titular ${name} solicita la supresión/revocatoria de sus datos personales bajo el Derecho de Habeas Data (Ley 1581 de 2012)?`)) {
      const res = await revokeTLCContactConsent(id);
      if (res.success) {
        alert('Se ha registrado la revocatoria de consentimiento y supresión de datos.');
        loadContacts();
      }
    }
  };

  const getWhatsAppLink = (phone: string, firstName: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const formatted = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`;
    const message = encodeURIComponent(`Hola ${firstName}, te saludo de Total Life Changes (TLC). Recibimos tu solicitud de información sobre nuestros productos de bienestar y détox.`);
    return `https://wa.me/${formatted}?text=${message}`;
  };

  const stats = {
    total: contacts.length,
    nuevos: contacts.filter((c) => c.status === 'NUEVO').length,
    seguimiento: contacts.filter((c) => c.status === 'EN_SEGUIMIENTO').length,
    clientes: contacts.filter((c) => c.status === 'CLIENTE').length,
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior Habeas Data Colombia */}
      <div 
        className="p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
          borderColor: 'rgba(20, 184, 166, 0.3)',
        }}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Ley 1581 de 2012 • Habeas Data Colombia
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Gestión de Contactos & Prospectos TLC
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Módulo certificado para la recolección, autorización previa y almacenamiento seguro de prospectos TLC en Colombia. Garantiza el cumplimiento de la ley de protección de datos personales y trazabilidad de consentimientos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPolicyModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900/60 hover:bg-gray-800 text-gray-200 text-sm font-medium transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-teal-400" />
            Ver Política Legal
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg flex items-center gap-2 text-white"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <UserPlus className="w-4 h-4" />
            Registrar Contacto
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Registrados</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Prospectos Nuevos</p>
            <p className="text-2xl font-bold text-blue-400">{stats.nuevos}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">En Seguimiento</p>
            <p className="text-2xl font-bold text-amber-400">{stats.seguimiento}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Clientes Activos</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.clientes}</p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, documento, WhatsApp o ciudad..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/80 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Estado:
          </span>
          {['ALL', 'NUEVO', 'CONTACTADO', 'EN_SEGUIMIENTO', 'CLIENTE', 'DESCARTADO'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {st === 'ALL' ? 'Todos' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Lista / Tabla de Contactos */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mb-3"></div>
            <p>Cargando directorio de contactos seguros...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <Users className="w-12 h-12 mx-auto text-gray-600" />
            <p className="text-lg font-medium text-gray-300">No se encontraron contactos</p>
            <p className="text-sm text-gray-500">Registra un nuevo contacto con su respectiva autorización de datos personales.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl text-sm font-semibold bg-teal-500 text-white hover:bg-teal-600 transition"
            >
              Crear Primer Contacto
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-950/40 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Titular / Contacto</th>
                  <th className="py-3.5 px-4">Identificación (Colombia)</th>
                  <th className="py-3.5 px-4">Ubicación</th>
                  <th className="py-3.5 px-4">Interés TLC</th>
                  <th className="py-3.5 px-4">Estado Prospecto</th>
                  <th className="py-3.5 px-4">Consentimiento Ley 1581</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-sm">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-800/30 transition">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-white">{contact.firstName} {contact.lastName}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <a
                            href={getWhatsAppLink(contact.phone, contact.firstName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition"
                          >
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </a>
                          <span>•</span>
                          <span className="truncate max-w-[150px]">{contact.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-gray-800 text-gray-300 border border-gray-700">
                        {contact.documentType}: {contact.documentId}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{contact.city ? `${contact.city}, ` : ''}{contact.department || 'Colombia'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs text-teal-300 bg-teal-950/60 border border-teal-800/50 px-2 py-1 rounded-md">
                        {contact.interestProduct || 'Détox TLC'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={contact.status}
                        onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          contact.status === 'CLIENTE'
                            ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300'
                            : contact.status === 'EN_SEGUIMIENTO'
                            ? 'bg-amber-900/40 border-amber-500/50 text-amber-300'
                            : contact.status === 'CONTACTADO'
                            ? 'bg-blue-900/40 border-blue-500/50 text-blue-300'
                            : contact.status === 'DESCARTADO'
                            ? 'bg-red-900/40 border-red-500/50 text-red-300'
                            : 'bg-purple-900/40 border-purple-500/50 text-purple-300'
                        }`}
                      >
                        <option value="NUEVO">NUEVO</option>
                        <option value="CONTACTADO">CONTACTADO</option>
                        <option value="EN_SEGUIMIENTO">EN SEGUIMIENTO</option>
                        <option value="CLIENTE">CLIENTE</option>
                        <option value="DESCARTADO">DESCARTADO</option>
                      </select>
                    </td>

                    <td className="py-4 px-4">
                      {contact.revocationRequested ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-950/40 border border-red-800 px-2 py-0.5 rounded">
                          <AlertCircle className="w-3 h-3" /> Revocado (Supresión)
                        </span>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" /> Autorizado
                          </span>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {new Date(contact.acceptedAt).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={getWhatsAppLink(contact.phone, contact.firstName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Contactar en WhatsApp"
                          className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 transition"
                        >
                          <Send className="w-4 h-4" />
                        </a>
                        {!contact.revocationRequested && (
                          <button
                            onClick={() => handleRevokeConsent(contact.id, `${contact.firstName} ${contact.lastName}`)}
                            title="Ejercer Derecho de Supresión / Revocar Consentimiento (Ley 1581)"
                            className="p-2 rounded-lg bg-red-600/10 hover:bg-red-600/30 text-red-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Registrar Contacto Ley 1581 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Registro de Contacto • Ley 1581 de 2012</h3>
                  <p className="text-xs text-gray-400">Autorización previa e informada de Tratamiento de Datos Personales (Colombia)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedbackMessage && (
              <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
                feedbackMessage.type === 'success' 
                  ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                  : 'bg-red-950/60 border border-red-500/50 text-red-300'
              }`}>
                {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {feedbackMessage.text}
              </div>
            )}

            <form onSubmit={handleCreateContact} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="ej: Andrés Felipe"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="ej: Restrepo Gómez"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Tipo Documento *</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="CC">Cédula de Ciudadanía (C.C.)</option>
                    <option value="CE">Cédula de Extranjería (C.E.)</option>
                    <option value="PASAPORTE">Pasaporte</option>
                    <option value="PPT">Permiso Protección Temporal (PPT)</option>
                    <option value="NIT">NIT Persona Jurídica</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Número de Identificación *</label>
                  <input
                    type="text"
                    required
                    value={formData.documentId}
                    onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                    placeholder="ej: 1020456789"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="ej: 3101234567"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ej: cliente@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Departamento (Colombia)</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    {COLOMBIA_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Municipio / Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="ej: Medellín, Envigado, Bogotá"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Producto o Interés TLC</label>
                  <select
                    value={formData.interestProduct}
                    onChange={(e) => setFormData({ ...formData, interestProduct: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Iaso Tea Original & Détox 30 Días">Iaso Tea Original & Détox 30 Días</option>
                    <option value="Gotas Resolution (Quemador Pro)">Gotas Resolution (Quemador Pro)</option>
                    <option value="NRG Energía Natural">NRG Energía Natural</option>
                    <option value="NutraBurst Multivitamínico Líquido">NutraBurst Multivitamínico Líquido</option>
                    <option value="Kit Pérdida de Peso Acelerada">Kit Pérdida de Peso Acelerada</option>
                    <option value="Oportunidad de Negocio / Distribuidor TLC">Oportunidad de Negocio / Distribuidor TLC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Canal de Captura</label>
                  <select
                    value={formData.leadSource}
                    onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="WHATSAPP">WhatsApp Directo</option>
                    <option value="INSTAGRAM">Instagram / Redes Sociales</option>
                    <option value="TIENDA_VIRTUAL">Tienda Virtual TLC</option>
                    <option value="REFERIDO">Referido por Socio</option>
                    <option value="EVENTO">Evento / Stand Presencial</option>
                  </select>
                </div>
              </div>

              {/* Cláusula Legal Obligatoria de Habeas Data */}
              <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-950/20 space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-300 leading-relaxed">
                    <span className="font-bold text-teal-300">Autorización Expresa Ley 1581 de 2012:</span>
                    <p className="mt-1 text-gray-400">
                      El titular autoriza de forma libre, voluntaria y expresa a Total Life Changes (TLC) para el tratamiento de sus datos con la finalidad de contacto comercial, asesoría personalizada en suplementación y seguimiento de bienestar. Puede solicitar la consulta o supresión de sus datos en cualquier momento.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-teal-500/20">
                  <input
                    type="checkbox"
                    required
                    checked={formData.dataPolicyAccepted}
                    onChange={(e) => setFormData({ ...formData, dataPolicyAccepted: e.target.checked })}
                    className="w-5 h-5 text-teal-500 bg-gray-800 border-gray-600 rounded focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-white">
                    * El titular ha leído y autoriza expresamente el tratamiento de sus datos personales bajo la Ley 1581 de 2012 de Colombia.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-teal-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Registrar con Autorización Legal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Texto Completo de Política Ley 1581 */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2 text-teal-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-white">Política de Tratamiento de Datos Personales</h3>
              </div>
              <button 
                onClick={() => setIsPolicyModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-gray-300 whitespace-pre-line leading-relaxed p-4 bg-gray-950/60 rounded-xl border border-gray-800 font-mono">
              {policyText}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-semibold"
              >
                Entendido y Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
