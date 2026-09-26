import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  UserCheck, 
  Plus, 
  Key, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCircle,
  Filter,
  ArrowRightLeft,
  Unlock,
  Search,
  ShieldAlert,
  Dumbbell,
  Leaf,
  Lock,
  Edit2,
  Trash2,
  Check,
  X,
  RefreshCw,
  Copy,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { 
  fetchUsersList, 
  createUserAdmin, 
  toggleUserStatusAdmin, 
  resetUserPasswordAdmin, 
  deleteUserAdmin, 
  fetchSystemPermissions, 
  fetchUserPermissions, 
  saveUserPermissionOverrides,
  SystemUser, 
  UserRole, 
  BusinessType,
  SystemPermissionItem,
  AuthUser
} from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface UsersManagementViewProps {
  onSwitchUser?: (user: AuthUser) => void;
  currentTheme?: ColorTheme;
}

export const UsersManagementView: React.FC<UsersManagementViewProps> = ({ 
  onSwitchUser, 
  currentTheme = getSavedTheme() 
}) => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [businessFilter, setBusinessFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  
  // Modal de Creación
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    documentId: '',
    role: 'BUSINESS_ADMIN' as UserRole,
    businessType: 'TLC' as BusinessType,
    affiliateRank: 'Afiliado Activo',
    selectedPermissions: [] as string[],
  });

  // Modal de Permisos Granulares
  const [selectedUserForPerms, setSelectedUserForPerms] = useState<SystemUser | null>(null);
  const [systemPermissions, setSystemPermissions] = useState<SystemPermissionItem[]>([]);
  const [effectivePerms, setEffectivePerms] = useState<string[]>([]);
  const [savingPerms, setSavingPerms] = useState(false);

  // Modal de Contraseña Restablecida
  const [resetModalData, setResetModalData] = useState<{ user: SystemUser; tempPass: string } | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);

  // Notificaciones
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersList, permsList] = await Promise.all([
        fetchUsersList(),
        fetchSystemPermissions(),
      ]);
      setUsers(usersList);
      setSystemPermissions(permsList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Crear Usuario
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createUserAdmin({
      firstName: createFormData.firstName,
      lastName: createFormData.lastName,
      email: createFormData.email,
      password: createFormData.password || 'ApexPass123!',
      phone: createFormData.phone,
      documentId: createFormData.documentId,
      role: createFormData.role,
      businessType: createFormData.businessType,
      affiliateRank: createFormData.role === 'AFFILIATE' ? createFormData.affiliateRank : undefined,
      customPermissions: createFormData.selectedPermissions,
    });

    if (result.success) {
      showToast(`Usuario ${createFormData.firstName} ${createFormData.lastName} creado exitosamente con rol ${createFormData.role}`, 'success');
      setIsCreateModalOpen(false);
      setCreateFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        documentId: '',
        role: 'BUSINESS_ADMIN',
        businessType: 'TLC',
        affiliateRank: 'Afiliado Activo',
        selectedPermissions: [],
      });
      loadData();
    } else {
      showToast(result.message || 'Error al crear usuario', 'warn');
    }
  };

  // Cambiar Estado (Activo / Suspendido)
  const handleToggleStatus = async (user: SystemUser) => {
    const nextStatus = !(user.isActive ?? true);
    await toggleUserStatusAdmin(user.id, nextStatus);
    setUsers(users.map(u => u.id === user.id ? { ...u, isActive: nextStatus } : u));
    showToast(`Usuario ${user.firstName} ${user.lastName} fue ${nextStatus ? 'ACTIVADO' : 'SUSPENDIDO'}`, nextStatus ? 'success' : 'warn');
  };

  // Restablecer Contraseña
  const handleResetPassword = async (user: SystemUser) => {
    const result = await resetUserPasswordAdmin(user.id);
    if (result.success) {
      setResetModalData({ user, tempPass: result.temporaryPassword });
    }
  };

  // Abrir Panel de Permisos Granulares
  const handleOpenPermissions = async (user: SystemUser) => {
    setSelectedUserForPerms(user);
    const permsData = await fetchUserPermissions(user.id, user.role);
    setEffectivePerms(permsData.effectivePermissions || []);
  };

  // Alternar Permiso Específico
  const togglePermissionCode = (code: string) => {
    if (effectivePerms.includes(code)) {
      setEffectivePerms(effectivePerms.filter(p => p !== code));
    } else {
      setEffectivePerms([...effectivePerms, code]);
    }
  };

  // Guardar Cambios de Permisos
  const handleSavePermissions = async () => {
    if (!selectedUserForPerms) return;
    setSavingPerms(true);

    const overrides = systemPermissions.map(p => ({
      permissionCode: p.code,
      isGranted: effectivePerms.includes(p.code),
    }));

    await saveUserPermissionOverrides(selectedUserForPerms.id, overrides, selectedUserForPerms.email);
    setSavingPerms(false);
    showToast(`Permisos granulares guardados para ${selectedUserForPerms.firstName} ${selectedUserForPerms.lastName}`, 'success');
    setSelectedUserForPerms(null);
  };

  // Eliminar Usuario
  const handleDeleteUser = async (user: SystemUser) => {
    if (!confirm(`¿Estás seguro de eliminar al usuario ${user.firstName} ${user.lastName}? Esta acción quedará registrada en auditoría.`)) {
      return;
    }
    await deleteUserAdmin(user.id);
    setUsers(users.filter(u => u.id !== user.id));
    showToast(`Usuario ${user.firstName} ${user.lastName} eliminado permanentemente`, 'info');
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (businessFilter !== 'ALL') {
      if (businessFilter === 'NONE' && u.business) return false;
      if (businessFilter !== 'NONE' && u.business?.type !== businessFilter) return false;
    }
    if (statusFilter === 'ACTIVE' && u.isActive === false) return false;
    if (statusFilter === 'SUSPENDED' && u.isActive !== false) return false;
    const term = search.toLowerCase();
    if (term && !`${u.firstName} ${u.lastName}`.toLowerCase().includes(term) && !u.email.toLowerCase().includes(term) && !(u.documentId || '').includes(term)) {
      return false;
    }
    return true;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPERADMIN':
        return { label: 'Superadmin Global', bg: '#fee2e2', color: '#b91c1c' };
      case 'BUSINESS_ADMIN':
        return { label: 'Admin de Negocio', bg: '#ede9fe', color: '#6d28d9' };
      case 'AFFILIATE':
        return { label: 'Afiliado Distribuidor TLC', bg: '#ecfdf5', color: '#047857' };
      case 'TRAINER':
        return { label: 'Entrenador Personal', bg: '#e0f2fe', color: '#0369a1' };
      case 'NUTRITIONIST':
        return { label: 'Nutricionista', bg: '#fef3c7', color: '#b45309' };
      case 'MEMBER':
        return { label: 'Socio / Cliente', bg: '#f1f5f9', color: '#475569' };
      default:
        return { label: role, bg: '#f1f5f9', color: '#475569' };
    }
  };

  // Agrupar permisos del sistema por categoría para visualización clara
  const permissionsByCategory = systemPermissions.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, SystemPermissionItem[]>);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: notification.type === 'warn' ? '#dc2626' : '#059669',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '10px',
          fontWeight: 700,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          <CheckCircle size={18} />
          <span>{notification.text}</span>
        </div>
      )}

      {/* HERO BANNER ESTILO NEXO */}
      <div style={{
        background: currentTheme.bannerGradient,
        borderRadius: '18px',
        padding: '2.5rem 3rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: `0 14px 40px ${currentTheme.primaryGlow}`,
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '620px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{
              background: '#000000',
              color: currentTheme.primary,
              fontWeight: 900,
              fontSize: '0.72rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              % SISTEMA DE IDENTIDAD & PERMISOS RBAC
            </span>
            <span style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.82rem', fontWeight: 700 }}>
              Control Integral Multi-Tenant (GYM & TLC)
            </span>
          </div>

          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 900,
            color: '#070a12',
            margin: '0.2rem 0',
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
          }}>
            CREACIÓN DE USUARIOS <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>& PERMISOS</span>
          </h1>

          <p style={{
            color: 'rgba(7, 10, 18, 0.85)',
            fontSize: '0.92rem',
            fontWeight: 600,
            margin: '0.4rem 0 0 0',
            lineHeight: 1.4,
          }}>
            Gestión centralizada de cuentas, roles, permisos granulares con revocación en tiempo real y auditoría estricta de accesos.
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#070a12',
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1.35rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.35)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Plus size={17} color={currentTheme.primary} />
              <span>Crear Nuevo Usuario</span>
            </button>

            <button
              onClick={loadData}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(255, 255, 255, 0.85)',
                color: '#070a12',
                border: '1px solid rgba(0,0,0,0.1)',
                padding: '0.65rem 1.15rem',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={15} />
              <span>Refrescar Lista</span>
            </button>
          </div>
        </div>

        {/* Resumen Métrico Rápido */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(7, 10, 18, 0.88)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          padding: '1.25rem 1.6rem',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          minWidth: '220px',
        }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
            USUARIOS EN SISTEMA
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: currentTheme.primary, lineHeight: 1 }}>
            {users.length} <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>Cuentas</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
            <span>Activos: <strong style={{ color: '#10b981' }}>{users.filter(u => u.isActive !== false).length}</strong></span>
            <span>Suspendidos: <strong style={{ color: '#ef4444' }}>{users.filter(u => u.isActive === false).length}</strong></span>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS & BÚSQUEDA */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        background: '#0a0f1d',
        padding: '0.85rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        {/* Buscador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px', background: 'rgba(255,255,255,0.04)', padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, cédula/DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.85rem' }}
          />
        </div>

        {/* Filtro por Rol */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Rol:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ background: '#131b2e', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.45rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
          >
            <option value="ALL">Todos los Roles</option>
            <option value="SUPERADMIN">Superadmin</option>
            <option value="BUSINESS_ADMIN">Admin Negocio</option>
            <option value="AFFILIATE">Afiliado TLC</option>
            <option value="TRAINER">Entrenador</option>
            <option value="MEMBER">Socio / Cliente</option>
          </select>
        </div>

        {/* Filtro por Negocio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Negocio:</span>
          <select
            value={businessFilter}
            onChange={(e) => setBusinessFilter(e.target.value)}
            style={{ background: '#131b2e', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.45rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
          >
            <option value="ALL">Todos</option>
            <option value="GYM">Gimnasios</option>
            <option value="TLC">Total Life Changes</option>
            <option value="NONE">Sin Negocio (Super)</option>
          </select>
        </div>

        {/* Filtro por Estado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ background: '#131b2e', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.45rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
          >
            <option value="ALL">Todos</option>
            <option value="ACTIVE">Activos</option>
            <option value="SUSPENDED">Suspendidos</option>
          </select>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE USUARIOS */}
      <div style={{
        background: '#0a0f1d',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>Usuario</th>
                <th style={{ padding: '0.9rem 1rem' }}>Rol / Rango</th>
                <th style={{ padding: '0.9rem 1rem' }}>Negocio</th>
                <th style={{ padding: '0.9rem 1rem' }}>Contacto / Doc</th>
                <th style={{ padding: '0.9rem 1rem' }}>Estado</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                    No se encontraron usuarios con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleBadge = getRoleBadge(u.role);
                  const isUserActive = u.isActive !== false;

                  return (
                    <tr 
                      key={u.id}
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Avatar y Nombre */}
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'}
                            alt={u.firstName}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${isUserActive ? currentTheme.primary : '#64748b'}` }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem' }}>
                              {u.firstName} {u.lastName}
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Rol */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-start' }}>
                          <span style={{
                            background: roleBadge.bg,
                            color: roleBadge.color,
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            letterSpacing: '0.02em',
                          }}>
                            {roleBadge.label}
                          </span>
                          {u.affiliateRank && (
                            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>
                              ★ {u.affiliateRank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Negocio */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {u.business ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                            {u.business.type === 'TLC' ? (
                              <Leaf size={14} color="#10b981" />
                            ) : (
                              <Dumbbell size={14} color="#06b6d4" />
                            )}
                            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                              {u.business.name}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.75rem', fontStyle: 'italic' }}>
                            Acceso Global (SaaS)
                          </span>
                        )}
                      </td>

                      {/* Contacto / Doc */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ color: '#cbd5e1', fontSize: '0.78rem' }}>
                          {u.documentId ? <span>ID: <strong>{u.documentId}</strong></span> : <span style={{ color: '#64748b' }}>Sin DNI</span>}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                          {u.phone || 'Sin teléfono'}
                        </div>
                      </td>

                      {/* Estado */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          background: isUserActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isUserActive ? '#10b981' : '#ef4444',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isUserActive ? '#10b981' : '#ef4444' }} />
                          {isUserActive ? 'ACTIVO' : 'SUSPENDIDO'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                          {/* Permisos Granulares */}
                          <button
                            onClick={() => handleOpenPermissions(u)}
                            title="Gestionar Permisos Granulares"
                            style={{
                              background: 'rgba(168, 85, 247, 0.15)',
                              border: '1px solid rgba(168, 85, 247, 0.3)',
                              color: '#c084fc',
                              borderRadius: '6px',
                              padding: '0.35rem 0.55rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                            }}
                          >
                            <Sliders size={13} />
                            <span>Permisos</span>
                          </button>

                          {/* Simular Sesión */}
                          {onSwitchUser && (
                            <button
                              onClick={() => onSwitchUser(u)}
                              title="Simular ingreso como este usuario"
                              style={{
                                background: `${currentTheme.primary}18`,
                                border: `1px solid ${currentTheme.primary}44`,
                                color: currentTheme.primary,
                                borderRadius: '6px',
                                padding: '0.35rem 0.55rem',
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                              }}
                            >
                              <ArrowRightLeft size={13} />
                            </button>
                          )}

                          {/* Restablecer Clave */}
                          <button
                            onClick={() => handleResetPassword(u)}
                            title="Restablecer Contraseña"
                            style={{
                              background: 'rgba(234, 179, 8, 0.15)',
                              border: '1px solid rgba(234, 179, 8, 0.3)',
                              color: '#facc15',
                              borderRadius: '6px',
                              padding: '0.35rem 0.55rem',
                              cursor: 'pointer',
                            }}
                          >
                            <Key size={13} />
                          </button>

                          {/* Suspender / Activar */}
                          <button
                            onClick={() => handleToggleStatus(u)}
                            title={isUserActive ? 'Suspender usuario' : 'Activar usuario'}
                            style={{
                              background: isUserActive ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.15)',
                              border: `1px solid ${isUserActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                              color: isUserActive ? '#ef4444' : '#10b981',
                              borderRadius: '6px',
                              padding: '0.35rem 0.55rem',
                              cursor: 'pointer',
                            }}
                          >
                            {isUserActive ? <Lock size={13} /> : <Unlock size={13} />}
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={() => handleDeleteUser(u)}
                            title="Eliminar permanentemente"
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#94a3b8',
                              borderRadius: '6px',
                              padding: '0.35rem 0.55rem',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: CREACIÓN DE NUEVO USUARIO COMPLETO                           */}
      {/* ===================================================================== */}
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#0d1322',
            borderRadius: '18px',
            border: `1px solid ${currentTheme.primary}44`,
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: `0 20px 60px ${currentTheme.primaryGlow}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.85rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Crear Nuevo Usuario en el Sistema
                </h2>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
                  El usuario recibirá credenciales y sus permisos se configurarán automáticamente.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Nombres y Apellidos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Nombres *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: Santiago"
                    value={createFormData.firstName}
                    onChange={(e) => setCreateFormData({ ...createFormData, firstName: e.target.value })}
                    style={{ width: '100%', background: '#141c30', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: Restrepo"
                    value={createFormData.lastName}
                    onChange={(e) => setCreateFormData({ ...createFormData, lastName: e.target.value })}
                    style={{ width: '100%', background: '#141c30', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Email y Contraseña Temporal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ej: usuario@apexlifegym.com"
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                    style={{ width: '100%', background: '#141c30', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Contraseña Inicial *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ApexPass123!"
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                    style={{ width: '100%', background: '#141c30', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Teléfono y Documento */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Cédula / Documento de Identidad
                  </label>
                  <input
                    type="text"
                    placeholder="ej: 1098765432"
                    value={createFormData.documentId}
                    onChange={(e) => setCreateFormData({ ...createFormData, documentId: e.target.value })}
                    style={{ width: '100%', background: '#141c30', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Teléfono Celular / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="ej: +57 300 123 4567"
                    value={createFormData.phone}
                    onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                    style={{ width: '100%', background: '#141c30', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Rol y Negocio */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Rol en el Sistema *
                  </label>
                  <select
                    value={createFormData.role}
                    onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value as UserRole })}
                    style={{ width: '100%', background: '#141c30', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    <option value="BUSINESS_ADMIN">Administrador de Negocio</option>
                    <option value="AFFILIATE">Afiliado TLC (Distribuidor)</option>
                    <option value="TRAINER">Entrenador Físico</option>
                    <option value="NUTRITIONIST">Nutricionista</option>
                    <option value="MEMBER">Socio / Cliente Gym</option>
                    <option value="SUPERADMIN">Superadministrador Global</option>
                  </select>
                </div>

                {createFormData.role !== 'SUPERADMIN' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Asignación de Negocio *
                    </label>
                    <select
                      value={createFormData.businessType}
                      onChange={(e) => setCreateFormData({ ...createFormData, businessType: e.target.value as BusinessType })}
                      style={{ width: '100%', background: '#141c30', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}
                    >
                      <option value="TLC">Total Life Changes (Red & Tienda)</option>
                      <option value="GYM">Gimnasio Fitness Club</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Rango Afiliado si es TLC */}
              {createFormData.role === 'AFFILIATE' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Rango Inicial TLC
                  </label>
                  <select
                    value={createFormData.affiliateRank}
                    onChange={(e) => setCreateFormData({ ...createFormData, affiliateRank: e.target.value })}
                    style={{ width: '100%', background: '#141c30', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    <option value="Afiliado Activo">Afiliado Activo</option>
                    <option value="Director">Director</option>
                    <option value="Director Estrella">Director Estrella</option>
                    <option value="Director Ejecutivo">Director Ejecutivo</option>
                    <option value="Director Nacional">Director Nacional</option>
                  </select>
                </div>
              )}

              {/* Botones */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: currentTheme.primary,
                    color: '#000000',
                    border: 'none',
                    padding: '0.6rem 1.6rem',
                    borderRadius: '8px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: `0 4px 15px ${currentTheme.primaryGlow}`,
                  }}
                >
                  Guardar & Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: GESTOR DE PERMISOS GRANULARES                                */}
      {/* ===================================================================== */}
      {selectedUserForPerms && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#0d1322',
            borderRadius: '18px',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(168, 85, 247, 0.3)',
          }}>
            {/* Header del Modal */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sliders size={18} color="#c084fc" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    Permisos Granulares: {selectedUserForPerms.firstName} {selectedUserForPerms.lastName}
                  </h2>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Rol base: <strong style={{ color: currentTheme.primary }}>{selectedUserForPerms.role}</strong> • Los permisos activos se marcan en morado.
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForPerms(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Lista de Permisos por Categoría */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.entries(permissionsByCategory).map(([category, perms]) => (
                <div key={category} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    {category}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.65rem' }}>
                    {perms.map((p) => {
                      const isGranted = effectivePerms.includes(p.code);

                      return (
                        <div
                          key={p.code}
                          onClick={() => togglePermissionCode(p.code)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.65rem',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            background: isGranted ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isGranted ? '#a855f7' : 'rgba(255,255,255,0.08)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            background: isGranted ? '#a855f7' : 'transparent',
                            border: `1.5px solid ${isGranted ? '#a855f7' : '#64748b'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '2px',
                          }}>
                            {isGranted && <Check size={12} color="#ffffff" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isGranted ? '#ffffff' : '#94a3b8' }}>
                              {p.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.15rem' }}>
                              {p.description}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#a855f7', fontWeight: 600, marginTop: '0.15rem' }}>
                              <code>{p.code}</code>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con Guardado */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Total permisos activos: <strong>{effectivePerms.length}</strong>
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setSelectedUserForPerms(null)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '0.55rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  disabled={savingPerms}
                  onClick={handleSavePermissions}
                  style={{
                    background: '#a855f7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.55rem 1.6rem',
                    borderRadius: '8px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                  }}
                >
                  {savingPerms ? 'Guardando...' : 'Aplicar Permisos'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: CONTRASEÑA RESTABLECIDA CON COPIADO RÁPIDO                   */}
      {/* ===================================================================== */}
      {resetModalData && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#0d1322',
            borderRadius: '16px',
            border: '1px solid #facc15',
            width: '100%',
            maxWidth: '460px',
            padding: '1.75rem',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(250, 204, 21, 0.25)',
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(250, 204, 21, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Key size={24} color="#facc15" />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.4rem 0' }}>
              Contraseña Restablecida
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 1.25rem 0' }}>
              Copia esta contraseña temporal y entrégala al usuario <strong>{resetModalData.user.firstName}</strong>:
            </p>

            <div style={{
              background: '#131b2e',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}>
              <code style={{ fontSize: '1.05rem', color: '#facc15', fontWeight: 800 }}>
                {resetModalData.tempPass}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resetModalData.tempPass);
                  setCopiedPass(true);
                  setTimeout(() => setCopiedPass(false), 2500);
                }}
                style={{
                  background: copiedPass ? '#10b981' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {copiedPass ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedPass ? 'Copiada' : 'Copiar'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                setResetModalData(null);
                setCopiedPass(false);
              }}
              style={{
                width: '100%',
                background: '#facc15',
                color: '#000000',
                border: 'none',
                padding: '0.65rem',
                borderRadius: '8px',
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              Entendido y Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersManagementView;
