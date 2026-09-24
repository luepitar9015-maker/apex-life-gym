import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Building, 
  Calendar, 
  Plus, 
  Copy, 
  Check, 
  Sliders, 
  Lock, 
  Unlock, 
  RotateCw, 
  Users, 
  Sparkles,
  Zap,
  X
} from 'lucide-react';
import { 
  fetchLicenses, 
  createLicense, 
  updateLicense, 
  SystemLicense, 
  AvailableModule, 
  AuthUser 
} from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface LicensesViewProps {
  currentUser?: AuthUser | null;
  currentTheme?: ColorTheme;
}

export const LicensesView: React.FC<LicensesViewProps> = ({
  currentUser,
  currentTheme = getSavedTheme(),
}) => {
  const [licenses, setLicenses] = useState<SystemLicense[]>([]);
  const [availableModules, setAvailableModules] = useState<AvailableModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modal para activar nueva licencia
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    contactEmail: '',
    contactPhone: '',
    planType: 'GYM_TLC_PRO',
    durationDays: 365,
    maxUsers: 100,
    modulesAllowed: [] as string[],
    notes: '',
  });

  // Modal para editar módulos / extender
  const [selectedLicense, setSelectedLicense] = useState<SystemLicense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModules, setEditModules] = useState<string[]>([]);
  const [extendDays, setExtendDays] = useState(30);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const res = await fetchLicenses();
    setLicenses(res.licenses);
    setAvailableModules(res.modules);
    if (formData.modulesAllowed.length === 0 && res.modules.length > 0) {
      setFormData((prev) => ({
        ...prev,
        modulesAllowed: res.modules.map((m) => m.id),
      }));
    }
    setIsLoading(false);
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.contactEmail) {
      setFeedback({ type: 'error', message: 'Nombre de la empresa y correo son obligatorios.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const res = await createLicense(formData);
    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      loadData();
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
        setFormData({
          businessName: '',
          contactEmail: '',
          contactPhone: '',
          planType: 'GYM_TLC_PRO',
          durationDays: 365,
          maxUsers: 100,
          modulesAllowed: availableModules.map((m) => m.id),
          notes: '',
        });
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Error al crear licencia.' });
    }
  };

  const toggleModule = (modId: string) => {
    setFormData((prev) => {
      const exists = prev.modulesAllowed.includes(modId);
      return {
        ...prev,
        modulesAllowed: exists
          ? prev.modulesAllowed.filter((id) => id !== modId)
          : [...prev.modulesAllowed, modId],
      };
    });
  };

  const toggleEditModule = (modId: string) => {
    setEditModules((prev) => {
      const exists = prev.includes(modId);
      return exists ? prev.filter((id) => id !== modId) : [...prev, modId];
    });
  };

  const handleOpenEdit = (license: SystemLicense) => {
    setSelectedLicense(license);
    setEditModules(license.modulesAllowed || []);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedLicense) return;
    setIsSubmitting(true);
    const res = await updateLicense(selectedLicense.id, {
      modulesAllowed: editModules,
      extendDays: extendDays > 0 ? extendDays : undefined,
    });
    setIsSubmitting(false);

    if (res.success) {
      alert('Licencia y permisos actualizados correctamente.');
      setIsEditModalOpen(false);
      loadData();
    }
  };

  const handleToggleStatus = async (license: SystemLicense) => {
    const nextStatus = license.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const confirmMsg = nextStatus === 'SUSPENDED' 
      ? `¿Suspender la licencia de ${license.businessName}? Sus usuarios no podrán ingresar hasta reactivarla.`
      : `¿Reactivar la licencia de ${license.businessName}?`;

    if (window.confirm(confirmMsg)) {
      await updateLicense(license.id, { status: nextStatus });
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Activador Superusuario */}
      <div 
        className="p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border"
        style={{
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(147, 51, 234, 0.08) 100%)',
          borderColor: 'rgba(234, 88, 12, 0.3)',
        }}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
            <Key className="w-3.5 h-3.5" />
            Panel Superusuario • Control Maestro
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Activador de Licencias & Permisos Específicos
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Genera, activa y modula licencias comerciales para gimnasios, sedes o franquicias TLC. Define de manera granular qué módulos tienen permitidos (Gimnasio, Nutrición, Rutinas, Escáner IA, TLC Network o Tienda).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg flex items-center gap-2 text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
        >
          <Plus className="w-4 h-4" />
          Activar Nueva Licencia
        </button>
      </div>

      {/* Grid de Licencias */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-400">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-3"></div>
          <p>Consultando licencias maestras del sistema...</p>
        </div>
      ) : licenses.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-800 bg-gray-900/50 space-y-4">
          <Key className="w-12 h-12 mx-auto text-gray-600" />
          <p className="text-lg font-medium text-gray-300">No hay licencias registradas aún</p>
          <p className="text-sm text-gray-500">Crea la primera licencia para activar los módulos del cliente.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition"
          >
            Generar Primera Licencia
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {licenses.map((lic) => {
            const isExpired = new Date(lic.expiresAt) < new Date();
            const daysLeft = Math.ceil((new Date(lic.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={lic.id}
                className="p-5 rounded-2xl border bg-gray-900/70 border-gray-800 hover:border-gray-700 transition flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      lic.status === 'ACTIVE' && !isExpired
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : lic.status === 'SUSPENDED'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      {lic.status === 'ACTIVE' && !isExpired ? '● ACTIVA' : lic.status === 'SUSPENDED' ? '● SUSPENDIDA' : '● VENCIDA'}
                    </span>
                    <h3 className="font-bold text-white text-base truncate max-w-[200px]">
                      {lic.businessName}
                    </h3>
                    <p className="text-xs text-gray-400">{lic.contactEmail}</p>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    {lic.planType.replace('_', ' ')}
                  </span>
                </div>

                {/* Clave de Licencia con Botón Copiar */}
                <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-medium text-gray-400 uppercase">Clave de Licencia</p>
                    <p className="font-mono text-xs text-teal-300 font-semibold">{lic.licenseKey}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(lic.licenseKey)}
                    className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition"
                    title="Copiar Clave"
                  >
                    {copiedKey === lic.licenseKey ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Métricas de tiempo y usuarios */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-800/40 border border-gray-800/80">
                    <p className="text-gray-400">Vigencia:</p>
                    <p className={`font-semibold ${daysLeft <= 15 ? 'text-amber-400' : 'text-gray-200'}`}>
                      {daysLeft > 0 ? `${daysLeft} días restantes` : 'Expirada'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-800/40 border border-gray-800/80">
                    <p className="text-gray-400">Capacidad:</p>
                    <p className="font-semibold text-gray-200">{lic.maxUsers} Usuarios</p>
                  </div>
                </div>

                {/* Módulos Habilitados */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-orange-400" /> Módulos Habilitados ({lic.modulesAllowed?.length || 0}):
                  </p>
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                    {(lic.modulesAllowed || []).map((mId) => (
                      <span key={mId} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                        {mId.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleStatus(lic)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      lic.status === 'ACTIVE'
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {lic.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    {lic.status === 'ACTIVE' ? 'Suspender' : 'Reactivar'}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(lic)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 transition flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-orange-400" />
                    Permisos & Extensión
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Crear y Activar Nueva Licencia */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Activar Nueva Licencia de Sistema</h3>
                  <p className="text-xs text-gray-400">Configuración de cliente, vigencia y permisos modulares</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
                feedback.type === 'success' 
                  ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                  : 'bg-red-950/60 border border-red-500/50 text-red-300'
              }`}>
                {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Nombre Gimnasio / Empresa *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="ej: Power Gym Medellín Central"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Correo de Contacto *</label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="ej: gerencia@powergym.com"
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Tipo de Plan</label>
                  <select
                    value={formData.planType}
                    onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="GYM_TLC_PRO">GYM + TLC PRO (Híbrido)</option>
                    <option value="GYM_STANDARD">GYM Standard</option>
                    <option value="TLC_GROWTH">TLC Growth (Solo TLC)</option>
                    <option value="ENTERPRISE_UNLIMITED">Enterprise Unlimited</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Vigencia (Días)</label>
                  <select
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value={30}>30 Días (Mensual)</option>
                    <option value={90}>90 Días (Trimestral)</option>
                    <option value={180}>180 Días (Semestral)</option>
                    <option value={365}>365 Días (Anual Pro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Límite Usuarios</label>
                  <input
                    type="number"
                    value={formData.maxUsers}
                    onChange={(e) => setFormData({ ...formData, maxUsers: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Selector de Permisos y Módulos Específicos */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-white">
                    Permisos de Módulos Activados ({formData.modulesAllowed.length}/{availableModules.length}):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.modulesAllowed.length === availableModules.length) {
                        setFormData({ ...formData, modulesAllowed: [] });
                      } else {
                        setFormData({ ...formData, modulesAllowed: availableModules.map((m) => m.id) });
                      }
                    }}
                    className="text-xs text-orange-400 hover:text-orange-300 font-medium"
                  >
                    {formData.modulesAllowed.length === availableModules.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 bg-gray-950/60 rounded-xl border border-gray-800 max-h-48 overflow-y-auto">
                  {availableModules.map((mod) => {
                    const isChecked = formData.modulesAllowed.includes(mod.id);
                    return (
                      <label
                        key={mod.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition border text-xs ${
                          isChecked
                            ? 'bg-orange-500/10 border-orange-500/30 text-white font-medium'
                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleModule(mod.id)}
                          className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-700 rounded focus:ring-orange-500 cursor-pointer"
                        />
                        <span>{mod.label}</span>
                      </label>
                    );
                  })}
                </div>
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
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Activando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generar y Activar Licencia
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Editar Permisos y Extender Licencia */}
      {isEditModalOpen && selectedLicense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-base font-bold text-white">Editar Permisos: {selectedLicense.businessName}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedLicense.licenseKey}</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-300">Extender Vigencia</label>
              <div className="flex items-center gap-2">
                {[30, 60, 90, 365].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setExtendDays(days)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      extendDays === days
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    +{days} Días
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300">Módulos Habilitados</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 bg-gray-950/60 rounded-xl border border-gray-800">
                {availableModules.map((m) => {
                  const active = editModules.includes(m.id);
                  return (
                    <label key={m.id} className="flex items-center gap-2.5 p-1.5 text-xs text-gray-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleEditModule(m.id)}
                        className="w-4 h-4 text-orange-500 rounded bg-gray-800 border-gray-700"
                      />
                      <span>{m.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg"
              >
                Guardar Modificaciones
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
