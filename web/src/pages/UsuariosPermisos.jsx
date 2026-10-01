import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Users,
  Lock,
  Check,
  X,
  Search,
  Filter,
  KeyRound,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Shield,
  Edit2,
  Trash2,
  Power,
  ChevronDown
} from 'lucide-react';

// Módulos del Sistema y Acciones Configurables
export const SYSTEM_MODULES = [
  { id: 'dashboard', label: 'Dashboard & Métricas', desc: 'Visualizar indicadores de ingresos, socios y telemetría' },
  { id: 'socios_view', label: 'Ver Directorio de Socios', desc: 'Consultar listado, datos de contacto y estado de membresía' },
  { id: 'socios_create', label: 'Crear / Afiliar Socios', desc: 'Dar de alta nuevos socios y emitir carnets digitales' },
  { id: 'socios_edit', label: 'Editar & Renovar Socios', desc: 'Modificar datos personales y extender días en el contador' },
  { id: 'socios_delete', label: 'Eliminar / Bloquear Socios', desc: 'Dar de baja o suspender carnet de acceso' },
  { id: 'membresias', label: 'Planes & Tarifas', desc: 'Crear, editar precios y vigencia de planes del gimnasio' },
  { id: 'pagos', label: 'Caja & Cobros (POS)', desc: 'Cobrar mensualidades, emitir comprobantes y anular pagos' },
  { id: 'entrenadores', label: 'Entrenadores & Personal', desc: 'Asignar turnos, clases y alumnos a profesores' },
  { id: 'rutinas', label: 'Rutinas & Biomecánica', desc: 'Diseñar planes de entrenamiento y catálogo de ejercicios' },
  { id: 'clases', label: 'Clases Grupales', desc: 'Programar horarios y fijar cupos máximos de asistencia' },
  { id: 'inventario', label: 'Inventario & Tienda', desc: 'Venta de mostrador, control de stock y precios de productos' },
  { id: 'reportes', label: 'Reportes Financieros', desc: 'Consultar balances de caja, retención y horas pico' },
  { id: 'configuracion', label: 'Configuración del Gimnasio', desc: 'Editar nombre comercial, logo, NIT y aforo de la sede' },
  { id: 'modulos_tlc', label: 'Módulos TLC (Exclusivo TLC)', desc: 'Acceso a protocolos, productos y red de Total Life Changes' },
];

const DEFAULT_ROLE_PERMISSIONS = {
  SUPERADMIN: SYSTEM_MODULES.map(m => m.id),
  ADMIN: SYSTEM_MODULES.filter(m => m.id !== 'modulos_tlc').map(m => m.id),
  ADMIN_TLC: ['dashboard', 'modulos_tlc', 'socios_view'],
  TRAINER: ['dashboard', 'rutinas', 'clases', 'socios_view'],
  RECEPTIONIST: ['dashboard', 'socios_view', 'socios_create', 'socios_edit', 'pagos', 'clases', 'inventario'],
  MEMBER: ['socios_view', 'rutinas', 'clases']
};

const INITIAL_USERS = [
  {
    id: 'USR-01',
    name: 'Roberto Gómez (SaaS Master)',
    email: 'superadmin@gym.com',
    role: 'SUPERADMIN',
    gym: 'Todas las Sedes (Global)',
    active: true,
    permissions: SYSTEM_MODULES.map(m => m.id)
  },
  {
    id: 'USR-02',
    name: 'Carlos Santamaría',
    email: 'admin@gym.com',
    role: 'ADMIN',
    gym: 'GYM Esencial - Sede Central',
    active: true,
    permissions: SYSTEM_MODULES.filter(m => m.id !== 'modulos_tlc').map(m => m.id)
  },
  {
    id: 'USR-03',
    name: 'Patricia Albarracín',
    email: 'admin.tlc@gym.com',
    role: 'ADMIN_TLC',
    gym: 'GYM Esencial - Sede Central',
    active: true,
    permissions: ['dashboard', 'modulos_tlc', 'socios_view']
  },
  {
    id: 'USR-04',
    name: 'Laura Gómez (Head Coach)',
    email: 'coach.laura@gym.com',
    role: 'TRAINER',
    gym: 'GYM Esencial - Sede Central',
    active: true,
    permissions: ['dashboard', 'rutinas', 'clases', 'socios_view']
  },
  {
    id: 'USR-05',
    name: 'Daniela Restrepo',
    email: 'recepcion@gym.com',
    role: 'RECEPTIONIST',
    gym: 'GYM Esencial - Sede Central',
    active: true,
    permissions: ['dashboard', 'socios_view', 'socios_create', 'socios_edit', 'pagos', 'clases']
  }
];

export default function UsuariosPermisos({ activeRole = 'ADMIN', currentUser = null }) {
  const [currentViewRole, setCurrentViewRole] = useState(activeRole === 'SUPERADMIN' ? 'SUPERADMIN' : 'ADMIN');
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('gym_system_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [roleMatrix, setRoleMatrix] = useState(() => {
    try {
      const saved = localStorage.getItem('gym_role_permissions');
      return saved ? JSON.parse(saved) : DEFAULT_ROLE_PERMISSIONS;
    } catch {
      return DEFAULT_ROLE_PERMISSIONS;
    }
  });

  const [activeTab, setActiveTab] = useState('usuarios'); // 'usuarios' | 'matriz'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Todos');

  // Modal Crear Usuario
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    gym: 'GYM Esencial - Sede Central',
    permissions: []
  });

  // Modal Editar Permisos
  const [editingUser, setEditingUser] = useState(null);
  const [editPermissionsModalOpen, setEditPermissionsModalOpen] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);

  // Modal Cambiar Contraseña
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [passUser, setPassUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const [notification, setNotification] = useState(null);

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('gym_system_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('gym_role_permissions', JSON.stringify(roleMatrix));
  }, [roleMatrix]);

  // Al seleccionar rol en el formulario, cargar permisos por defecto
  const handleRoleSelectInForm = (selectedRole) => {
    const defaultPerms = roleMatrix[selectedRole] || [];
    setNewUser({ ...newUser, role: selectedRole, permissions: defaultPerms });
  };

  // Guardar nuevo usuario
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const item = {
      id: `USR-${Math.floor(10 + Math.random() * 90)}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      gym: newUser.gym,
      active: true,
      permissions: newUser.permissions.length > 0 ? newUser.permissions : (roleMatrix[newUser.role] || [])
    };

    setUsers([item, ...users]);
    setCreateModalOpen(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'ADMIN',
      gym: 'GYM Esencial - Sede Central',
      permissions: []
    });
    showNotice(`¡Usuario ${item.name} creado con ${item.permissions.length} permisos asignados!`);
  };

  // Abrir modal de edición de permisos
  const openEditPermissions = (u) => {
    setEditingUser(u);
    setUserPermissions(u.permissions || roleMatrix[u.role] || []);
    setEditPermissionsModalOpen(true);
  };

  // Guardar permisos editados
  const handleSaveUserPermissions = () => {
    if (!editingUser) return;
    const updated = users.map((u) => {
      if (u.id === editingUser.id) {
        return { ...u, permissions: userPermissions };
      }
      return u;
    });
    setUsers(updated);
    setEditPermissionsModalOpen(false);
    showNotice(`Permisos actualizados para ${editingUser.name}`);
    setEditingUser(null);
  };

  // Alternar permiso individual
  const togglePermission = (modId) => {
    if (userPermissions.includes(modId)) {
      setUserPermissions(userPermissions.filter(p => p !== modId));
    } else {
      setUserPermissions([...userPermissions, modId]);
    }
  };

  // Alternar permiso en la matriz global (solo Superadmin)
  const toggleMatrixPermission = (role, modId) => {
    const current = roleMatrix[role] || [];
    const updatedRolePerms = current.includes(modId)
      ? current.filter(p => p !== modId)
      : [...current, modId];

    setRoleMatrix({ ...roleMatrix, [role]: updatedRolePerms });
    showNotice(`Matriz de permisos actualizada para rol ${role}`);
  };

  // Alternar estado activo/inactivo
  const toggleUserActive = (userId) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        const nextState = !u.active;
        showNotice(`Usuario ${u.name} ha sido ${nextState ? 'Activado' : 'Desactivado'}`);
        return { ...u, active: nextState };
      }
      return u;
    });
    setUsers(updated);
  };

  // Cambiar contraseña
  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!newPassword || !passUser) return;
    setPassModalOpen(false);
    showNotice(`Contraseña restablecida exitosamente para ${passUser.name}`);
    setPassUser(null);
    setNewPassword('');
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'Todos' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-6xl font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Notificación Flotante */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Encabezado Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-blue-900 tracking-tight">
              Gestión de Usuarios & Permisos
            </h1>
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
              currentViewRole === 'SUPERADMIN'
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              Vista: {currentViewRole === 'SUPERADMIN' ? '👑 Superusuario SaaS' : '🏢 Administrador GYM'}
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            {currentViewRole === 'SUPERADMIN'
              ? 'Control global de roles, matriz de permisos por módulo y altas para Administrador GYM, Administrador TLC y personal.'
              : 'Administra los accesos y permisos específicos de los empleados, entrenadores y recepcionistas de tu gimnasio.'}
          </p>
        </div>

        {/* Switcher de simulación de rol y Botón Crear Usuario */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-xl flex text-xs font-bold text-gray-600">
            <button
              onClick={() => setCurrentViewRole('ADMIN')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentViewRole === 'ADMIN' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-gray-900'
              }`}
            >
              Admin GYM
            </button>
            <button
              onClick={() => setCurrentViewRole('SUPERADMIN')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentViewRole === 'SUPERADMIN' ? 'bg-white text-purple-700 shadow-xs' : 'hover:text-gray-900'
              }`}
            >
              Superusuario
            </button>
          </div>

          <button
            onClick={() => {
              handleRoleSelectInForm('ADMIN');
              setCreateModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/20 active:scale-98 transition-all"
          >
            <UserPlus size={16} />
            <span>Crear Usuario & Permisos</span>
          </button>
        </div>
      </div>

      {/* Pestañas de Vista */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'usuarios'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users size={15} />
          <span>Directorio de Usuarios ({users.length})</span>
        </button>

        {currentViewRole === 'SUPERADMIN' && (
          <button
            onClick={() => setActiveTab('matriz')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'matriz'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sliders size={15} />
            <span>Matriz Global de Permisos por Rol</span>
          </button>
        )}
      </div>

      {/* TAB 1: LISTADO DE USUARIOS Y CONTROL DE ACCESO */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, correo o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {['Todos', 'SUPERADMIN', 'ADMIN', 'ADMIN_TLC', 'TRAINER', 'RECEPTIONIST'].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                    filterRole === r
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {r === 'ADMIN_TLC' ? 'Admin TLC' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/80 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-6">Usuario</th>
                    <th className="py-4 px-6">Rol del Sistema</th>
                    <th className="py-4 px-6">Sede Asignada</th>
                    <th className="py-4 px-6">Permisos Habilitados</th>
                    <th className="py-4 px-6">Estado</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => {
                    const permCount = u.permissions?.length || 0;
                    return (
                      <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-sm shadow-inner shrink-0">
                              {u.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-400 font-mono">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                            u.role === 'SUPERADMIN'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : u.role === 'ADMIN_TLC'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : u.role === 'ADMIN'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : u.role === 'TRAINER'
                              ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {u.role === 'ADMIN_TLC' ? '💼 Administrador TLC' : u.role}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-xs text-gray-600 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Building2 size={13} className="text-gray-400" />
                            <span>{u.gym}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <button
                            onClick={() => openEditPermissions(u)}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-all"
                          >
                            <ShieldCheck size={14} className="text-blue-600" />
                            <span>{permCount} / {SYSTEM_MODULES.length} Módulos</span>
                          </button>
                        </td>

                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            u.active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                            {u.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditPermissions(u)}
                              title="Configurar Permisos Granulares"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold border border-blue-100"
                            >
                              <Shield size={14} />
                            </button>

                            <button
                              onClick={() => {
                                setPassUser(u);
                                setPassModalOpen(true);
                              }}
                              title="Restablecer Contraseña"
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-xs border border-gray-200"
                            >
                              <KeyRound size={14} />
                            </button>

                            <button
                              onClick={() => toggleUserActive(u.id)}
                              title={u.active ? 'Desactivar Usuario' : 'Activar Usuario'}
                              className={`p-1.5 rounded-lg text-xs border ${
                                u.active
                                  ? 'text-red-500 hover:bg-red-50 border-red-100'
                                  : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                              }`}
                            >
                              <Power size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATRIZ GLOBAL DE PERMISOS POR ROL (SUPERADMIN) */}
      {activeTab === 'matriz' && currentViewRole === 'SUPERADMIN' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-black text-blue-950">
                Matriz de Permisos Globales por Rol
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Define qué módulos y funciones se habilitan por defecto cuando se crea un usuario con cada rol.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
              👑 Privilegio de Superusuario
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-72">Módulo / Permiso</th>
                  {['SUPERADMIN', 'ADMIN', 'ADMIN_TLC', 'TRAINER', 'RECEPTIONIST'].map((r) => (
                    <th key={r} className="py-3 px-3 text-center uppercase font-black">
                      {r === 'ADMIN_TLC' ? 'Admin TLC' : r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {SYSTEM_MODULES.map((mod) => (
                  <tr key={mod.id} className="hover:bg-gray-50/60">
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">{mod.label}</p>
                      <p className="text-[11px] text-gray-400">{mod.desc}</p>
                    </td>

                    {['SUPERADMIN', 'ADMIN', 'ADMIN_TLC', 'TRAINER', 'RECEPTIONIST'].map((r) => {
                      const isGranted = (roleMatrix[r] || []).includes(mod.id);
                      return (
                        <td key={r} className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleMatrixPermission(r, mod.id)}
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                              isGranted
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            <Check size={14} className={isGranted ? 'opacity-100' : 'opacity-20'} />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREAR NUEVO USUARIO CON PERMISOS */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-xs" onClick={() => setCreateModalOpen(false)} />
          <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-blue-950">
                <UserPlus className="text-blue-600" size={20} />
                <h3 className="text-lg font-black">Crear Nuevo Usuario & Asignar Permisos</h3>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Andrés Morales"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="correo@gym.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Rol en el Sistema *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => handleRoleSelectInForm(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold bg-white"
                  >
                    <option value="ADMIN">🏢 Administrador GYM</option>
                    <option value="ADMIN_TLC">💼 Administrador de TLC (Nuevo)</option>
                    <option value="TRAINER">🏋️ Entrenador / Coach</option>
                    <option value="RECEPTIONIST">🛎️ Recepcionista / Caja</option>
                    {currentViewRole === 'SUPERADMIN' && (
                      <option value="SUPERADMIN">👑 Superadministrador SaaS</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contraseña Inicial *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Sede del Gimnasio</label>
                <input
                  type="text"
                  value={newUser.gym}
                  onChange={(e) => setNewUser({ ...newUser, gym: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              {/* Selector Granular de Permisos */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Permisos de Módulos Habilitados ({newUser.permissions.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (newUser.permissions.length === SYSTEM_MODULES.length) {
                        setNewUser({ ...newUser, permissions: [] });
                      } else {
                        setNewUser({ ...newUser, permissions: SYSTEM_MODULES.map(m => m.id) });
                      }
                    }}
                    className="text-[11px] text-blue-600 font-bold hover:underline"
                  >
                    {newUser.permissions.length === SYSTEM_MODULES.length ? 'Desmarcar todos' : 'Marcar todos'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-100 rounded-xl bg-gray-50/50">
                  {SYSTEM_MODULES.map((mod) => {
                    const isChecked = newUser.permissions.includes(mod.id);
                    return (
                      <label key={mod.id} className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setNewUser({ ...newUser, permissions: newUser.permissions.filter(p => p !== mod.id) });
                            } else {
                              setNewUser({ ...newUser, permissions: [...newUser.permissions, mod.id] });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded-sm mt-0.5"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 leading-tight">{mod.label}</p>
                          <p className="text-[10px] text-gray-400 leading-tight truncate">{mod.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
                >
                  Crear Usuario con Permisos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR PERMISOS DE UN USUARIO EXISTENTE */}
      {editPermissionsModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-xs" onClick={() => setEditPermissionsModalOpen(false)} />
          <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-black text-blue-950 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-blue-600" />
                  <span>Permisos: {editingUser.name}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Rol asignado: <strong className="text-blue-900">{editingUser.role}</strong></p>
              </div>
              <button onClick={() => setEditPermissionsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-gray-600">
                Selecciona los módulos autorizados ({userPermissions.length}/{SYSTEM_MODULES.length})
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUserPermissions(SYSTEM_MODULES.map(m => m.id))}
                  className="text-[11px] text-blue-600 font-bold hover:underline"
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setUserPermissions([])}
                  className="text-[11px] text-gray-400 font-bold hover:underline"
                >
                  Ninguno
                </button>
              </div>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto p-2 border border-gray-100 rounded-2xl bg-gray-50/50">
              {SYSTEM_MODULES.map((mod) => {
                const checked = userPermissions.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    onClick={() => togglePermission(mod.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      checked
                        ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold leading-tight">{mod.label}</p>
                      <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{mod.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white'
                    }`}>
                      {checked && <Check size={12} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
              <button
                onClick={() => setEditPermissionsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveUserPermissions}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
              >
                Guardar Permisos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RESTABLECER CONTRASEÑA */}
      {passModalOpen && passUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-xs" onClick={() => setPassModalOpen(false)} />
          <div className="relative z-10 bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-black text-sm text-blue-950 flex items-center gap-1.5">
                <KeyRound size={16} className="text-blue-600" />
                <span>Restablecer Contraseña</span>
              </h3>
              <button onClick={() => setPassModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-3">
              <p className="text-xs text-gray-500">
                Asigna una nueva clave de acceso para <strong>{passUser.name}</strong>.
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPassModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
                >
                  Guardar Clave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
