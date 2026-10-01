import React, { useState, useEffect } from 'react';
import {
  Building2,
  Image,
  Upload,
  Save,
  CheckCircle2,
  Clock,
  Shield,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  Calendar,
  Sparkles,
  RefreshCw,
  Sliders
} from 'lucide-react';

const defaultPlans = [
  { id: 1, name: 'Plan Mensual Oro', durationDays: 30, price: '$99.000', popular: false, features: 'Acceso máquinas, Locker libre, App móvil' },
  { id: 2, name: 'Plan Black VIP Anual', durationDays: 365, price: '$1.490.000', popular: true, features: 'Acceso ilimitado sedes, Clases grupales, Plan IA, Zona VIP' },
  { id: 3, name: 'Plan Trimestral Pro', durationDays: 90, price: '$269.000', popular: false, features: 'Acceso total, 1 evaluación física, Clases incluidas' },
  { id: 4, name: 'Plan Estudiante', durationDays: 30, price: '$79.000', popular: false, features: 'Horarios valle 9am a 4pm, Pesas y cardio' },
];

export default function Configuracion() {
  const [activeSubTab, setActiveSubTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Datos del Gimnasio
  const [gymConfig, setGymConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('gym_config');
      return saved ? JSON.parse(saved) : {
        name: 'GYM ESENCIAL',
        slogan: 'Dashboard Administrativo & Gestión Deportiva',
        logo: '',
        nit: '901.458.789-2',
        address: 'Av. Principal #45-12, Sector Poblado',
        phone: '+57 (4) 444 8900',
        city: 'Medellín, Colombia',
        openTime: '05:00',
        closeTime: '23:00',
        maxCapacity: 80,
        // Reglas del Contador de Afiliado
        toleranceDays: 3, // Días de gracia post-vencimiento
        warningDays: 5,   // Alertar al afiliado X días antes de vencer
        autoBlockOnExpire: true,
      };
    } catch {
      return {
        name: 'GYM ESENCIAL',
        slogan: 'Dashboard Administrativo & Gestión Deportiva',
        logo: '',
        nit: '901.458.789-2',
        address: 'Av. Principal #45-12, Sector Poblado',
        phone: '+57 (4) 444 8900',
        city: 'Medellín, Colombia',
        openTime: '05:00',
        closeTime: '23:00',
        maxCapacity: 80,
        toleranceDays: 3,
        warningDays: 5,
        autoBlockOnExpire: true,
      };
    }
  });

  // Lista de Planes
  const [plans, setPlans] = useState(() => {
    try {
      const saved = localStorage.getItem('gym_plans');
      return saved ? JSON.parse(saved) : defaultPlans;
    } catch {
      return defaultPlans;
    }
  });

  const [modalPlanOpen, setModalPlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    durationDays: 30,
    price: '$99.000',
    features: '',
    popular: false
  });

  // Manejo de subida de imagen de logo (base64)
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe superar los 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setGymConfig({ ...gymConfig, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar configuración general
  const handleSaveConfig = (e) => {
    if (e) e.preventDefault();
    localStorage.setItem('gym_config', JSON.stringify(gymConfig));
    localStorage.setItem('gym_plans', JSON.stringify(plans));
    window.dispatchEvent(new Event('gym_config_updated'));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Guardar o actualizar plan
  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!planForm.name) return;
    if (editingPlan) {
      const updated = plans.map(p => p.id === editingPlan.id ? { ...p, ...planForm } : p);
      setPlans(updated);
      localStorage.setItem('gym_plans', JSON.stringify(updated));
    } else {
      const newP = { id: Date.now(), ...planForm };
      const updated = [...plans, newP];
      setPlans(updated);
      localStorage.setItem('gym_plans', JSON.stringify(updated));
    }
    setModalPlanOpen(false);
    setEditingPlan(null);
    setPlanForm({ name: '', durationDays: 30, price: '$99.000', features: '', popular: false });
  };

  const handleDeletePlan = (id) => {
    if (confirm('¿Deseas eliminar este plan de membresía?')) {
      const updated = plans.filter(p => p.id !== id);
      setPlans(updated);
      localStorage.setItem('gym_plans', JSON.stringify(updated));
    }
  };

  const openEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      durationDays: plan.durationDays,
      price: plan.price,
      features: plan.features,
      popular: plan.popular || false
    });
    setModalPlanOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="text-blue-600" size={26} />
            <span>Configuración del Establecimiento</span>
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Personaliza la identidad de tu gimnasio, logo, catálogo de planes y reglas del contador de días para afiliados.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>¡Configuración guardada y sincronizada!</span>
          </div>
        )}
      </div>

      {/* Pestañas de Navegación de Configuración */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeSubTab === 'general'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          1. Identidad & Logo del GYM
        </button>
        <button
          onClick={() => setActiveSubTab('planes')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeSubTab === 'planes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          2. Planes & Contador de Días ({plans.length})
        </button>
        <button
          onClick={() => setActiveSubTab('reglas')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeSubTab === 'reglas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          3. Políticas de Acceso & Alertas
        </button>
      </div>

      {/* SECCIÓN 1: IDENTIDAD Y LOGO */}
      {activeSubTab === 'general' && (
        <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b border-gray-100">
            {/* Vista previa del Logo */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center overflow-hidden shadow-inner">
                {gymConfig.logo ? (
                  <img src={gymConfig.logo} alt="Logo Gimnasio" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🏋️</span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="font-extrabold text-sm text-blue-950">Logo Oficial del Gimnasio</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Este logo se proyectará en la barra lateral, recibos de pago, carnet digital móvil de los afiliados y lector de torniquetes. Formatos admitidos: PNG, JPG, SVG (Máx. 2MB).
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-blue-200 transition-all">
                  <Upload size={14} />
                  <span>Subir imagen de Logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {gymConfig.logo && (
                  <button
                    type="button"
                    onClick={() => setGymConfig({ ...gymConfig, logo: '' })}
                    className="text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl font-semibold border border-red-100"
                  >
                    Restablecer icono predeterminado
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Formulario de Datos Comerciales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Comercial del Gimnasio *</label>
              <input
                type="text"
                value={gymConfig.name}
                onChange={(e) => setGymConfig({ ...gymConfig, name: e.target.value })}
                placeholder="Ej: GYM ESENCIAL, TITAN FITNESS..."
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Eslogan / Subtítulo de Marca</label>
              <input
                type="text"
                value={gymConfig.slogan}
                onChange={(e) => setGymConfig({ ...gymConfig, slogan: e.target.value })}
                placeholder="Ej: Centro de Alto Rendimiento & Salud"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">NIT / Identificación Tributaria</label>
              <input
                type="text"
                value={gymConfig.nit}
                onChange={(e) => setGymConfig({ ...gymConfig, nit: e.target.value })}
                placeholder="Ej: 901.458.789-2"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono / WhatsApp de Recepción</label>
              <input
                type="text"
                value={gymConfig.phone}
                onChange={(e) => setGymConfig({ ...gymConfig, phone: e.target.value })}
                placeholder="Ej: +57 312 456 7890"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Dirección de la Sede</label>
              <input
                type="text"
                value={gymConfig.address}
                onChange={(e) => setGymConfig({ ...gymConfig, address: e.target.value })}
                placeholder="Ej: Calle 50 # 13-45"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ciudad / Municipio</label>
              <input
                type="text"
                value={gymConfig.city}
                onChange={(e) => setGymConfig({ ...gymConfig, city: e.target.value })}
                placeholder="Ej: Bucaramanga, Santander"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Los cambios se aplican automáticamente en la interfaz.</span>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 active:scale-98 transition-all"
            >
              <Save size={16} />
              <span>Guardar Identidad del GYM</span>
            </button>
          </div>
        </form>
      )}

      {/* SECCIÓN 2: PLANES Y CONTADOR DE DÍAS */}
      {activeSubTab === 'planes' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-blue-950">Motor de Contador de Membresías del Afiliado</h4>
              <p className="text-xs text-blue-900/80 mt-1 leading-relaxed">
                Cada plan configurado aquí establece los <strong>días de vigencia</strong> que se le suman al afiliado al momento del pago. El sistema lleva el <strong>contador regresivo diario en tiempo real</strong> para mostrarle cuántos días le quedan antes de vencer, avisarle preventivamente y bloquear accesos no autorizados.
              </p>
            </div>
          </div>

          {/* Botón para añadir plan */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingPlan(null);
                setPlanForm({ name: '', durationDays: 30, price: '$99.000', features: '', popular: false });
                setModalPlanOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-blue-500/20"
            >
              <Plus size={16} />
              <span>Nuevo Plan de Membresía</span>
            </button>
          </div>

          {/* Grilla de Planes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-base text-blue-950">{p.name}</h4>
                    {p.popular && (
                      <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full uppercase">
                        Destacado
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black text-blue-900">{p.price}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      ⏳ {p.durationDays} Días para el Afiliado
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                    <strong>Beneficios:</strong> {p.features || 'Acceso general al gimnasio'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">
                    Suma +{p.durationDays} días al carnet
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditPlan(p)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Edit2 size={13} />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeletePlan(p.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 3: REGLAS DE CONTADOR Y ALERTAS */}
      {activeSubTab === 'reglas' && (
        <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-blue-950">
              Políticas de Aforo, Torniquetes y Alertas al Afiliado
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Configura cómo reacciona el sistema cuando el contador de días del afiliado llega a cero o está próximo a expirar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Alerta Preventiva al Afiliado
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={gymConfig.warningDays}
                  onChange={(e) => setGymConfig({ ...gymConfig, warningDays: Number(e.target.value) })}
                  className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white"
                />
                <span className="text-xs text-gray-500 font-semibold">Días antes</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                El carnet del afiliado se pondrá en color amarillo avisándole que debe renovar su plan.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tolerancia de Gracia al Vencer
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={gymConfig.toleranceDays}
                  onChange={(e) => setGymConfig({ ...gymConfig, toleranceDays: Number(e.target.value) })}
                  className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white"
                />
                <span className="text-xs text-gray-500 font-semibold">Días extra</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Días permitidos para entrenar con advertencia después de que el contador llegue a 0.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Capacidad Máxima de Aforo
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={gymConfig.maxCapacity}
                  onChange={(e) => setGymConfig({ ...gymConfig, maxCapacity: Number(e.target.value) })}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white"
                />
                <span className="text-xs text-gray-500 font-semibold">Personas</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Límite de aforo simultáneo permitido en sala de pesas y áreas comunes.
              </p>
            </div>
          </div>

          {/* Horarios de Operación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Horario Apertura</label>
              <input
                type="time"
                value={gymConfig.openTime}
                onChange={(e) => setGymConfig({ ...gymConfig, openTime: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Horario Cierre</label>
              <input
                type="time"
                value={gymConfig.closeTime}
                onChange={(e) => setGymConfig({ ...gymConfig, closeTime: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 active:scale-98 transition-all"
            >
              <Save size={16} />
              <span>Guardar Reglas de Acceso</span>
            </button>
          </div>
        </form>
      )}

      {/* Modal para Crear/Editar Plan */}
      {modalPlanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs" onClick={() => setModalPlanOpen(false)} />
          <div className="relative z-10 bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-lg font-black text-blue-950">
              {editingPlan ? 'Editar Plan de Membresía' : 'Nuevo Plan de Membresía'}
            </h3>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Plan *</label>
                <input
                  type="text"
                  placeholder="Ej: Plan Mensual Oro, Pase 15 Días..."
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Duración (Días para el contador) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="30"
                    value={planForm.durationDays}
                    onChange={(e) => setPlanForm({ ...planForm, durationDays: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tarifa / Precio *</label>
                  <input
                    type="text"
                    placeholder="$99.000"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Beneficios incluidos</label>
                <textarea
                  rows={2}
                  placeholder="Acceso a máquinas, Clases grupales, Evaluación física..."
                  value={planForm.features}
                  onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={planForm.popular}
                  onChange={(e) => setPlanForm({ ...planForm, popular: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
                <label htmlFor="popularCheck" className="text-xs font-bold text-gray-700">
                  Marcar como Plan Recomendado / Destacado
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalPlanOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
                >
                  Guardar Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
