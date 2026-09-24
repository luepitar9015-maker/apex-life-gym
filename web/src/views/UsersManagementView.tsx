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
  Leaf
} from 'lucide-react';
import { fetchAllUsers, registerUser, AuthUser, UserRole, BusinessType } from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface UsersManagementViewProps {
  onSwitchUser?: (user: AuthUser) => void;
  currentTheme?: ColorTheme;
}

export const UsersManagementView: React.FC<UsersManagementViewProps> = ({ 
  onSwitchUser, 
  currentTheme = getSavedTheme() 
}) => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [businessFilter, setBusinessFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'BUSINESS_ADMIN' as UserRole,
    businessType: 'TLC' as BusinessType,
    affiliateRank: 'Afiliado Activo',
  });

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const list = await fetchAllUsers();
    setUsers(list);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      phone: formData.phone,
      affiliateRank: formData.role === 'AFFILIATE' ? formData.affiliateRank : undefined,
      business: formData.role !== 'SUPERADMIN' ? {
        id: `biz-${formData.businessType.toLowerCase()}`,
        name: formData.businessType === 'TLC' ? 'Total Life Changes - Sede Central' : 'Power Gym Fitness Club',
        type: formData.businessType,
      } : undefined,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    };

    setUsers([newUser, ...users]);
    setIsCreateModalOpen(false);
    setNotification(`Usuario ${formData.firstName} ${formData.lastName} creado exitosamente con rol ${formData.role}`);
    setTimeout(() => setNotification(null), 4000);

    registerUser({
      email: formData.email,
      password: formData.password || 'password123',
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      phone: formData.phone,
    }).catch(() => {});
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (businessFilter !== 'ALL') {
      if (businessFilter === 'NONE' && u.business) return false;
      if (businessFilter !== 'NONE' && u.business?.type !== businessFilter) return false;
    }
    const term = search.toLowerCase();
    if (term && !`${u.firstName} ${u.lastName}`.toLowerCase().includes(term) && !u.email.toLowerCase().includes(term)) {
      return false;
    }
    return true;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPERADMIN':
        return { label: 'Superadministrador Global', bg: '#fee2e2', color: '#b91c1c' };
      case 'BUSINESS_ADMIN':
        return { label: 'Administrador de Negocio', bg: '#ede9fe', color: '#6d28d9' };
      case 'AFFILIATE':
        return { label: 'Afiliado Distribuidor TLC', bg: '#ecfdf5', color: '#047857' };
      case 'TRAINER':
        return { label: 'Entrenador Personal', bg: '#e0f2fe', color: '#0369a1' };
      case 'MEMBER':
        return { label: 'Socio / Cliente', bg: '#f1f5f9', color: '#475569' };
      default:
        return { label: role, bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER ESTILO NEXO: VIBRANTE + WIDGET FLOTANTE + USERS-SEC */}
      {/* ------------------------------------------------------------- */}
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
        {/* Patrón geométrico diagonal cortado */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.22,
          backgroundImage: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(225deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(315deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%),
            linear-gradient(45deg, rgba(255, 255, 255, 0.45) 25%, transparent 25%)
          `,
          backgroundSize: '90px 90px',
          backgroundPosition: '0 0, 45px 0, 45px -45px, 0px 45px',
          pointerEvents: 'none',
        }} />

        {/* Marca de agua translúcida gigante en el fondo */}
        <div style={{
          position: 'absolute',
          right: '340px',
          bottom: '-30px',
          fontSize: '7.5rem',
          fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.12)',
          letterSpacing: '-0.05em',
          userSelect: 'none',
          pointerEvents: 'none',
          fontStyle: 'italic',
        }}>
          USERS-SEC
        </div>

        {/* Texto de la Izquierda */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px' }}>
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
              % SEGURIDAD & ROLES / MULTI-SISTEMA
            </span>
            <span style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.82rem', fontWeight: 700 }}>
              Superadmin, Negocios GYM & TLC, Afiliados
            </span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#070a12',
            margin: '0.2rem 0',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
          }}>
            GESTIÓN DE USUARIOS <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>& ROLES</span>
          </h1>

          <p style={{
            color: 'rgba(7, 10, 18, 0.85)',
            fontSize: '0.92rem',
            fontWeight: 600,
            margin: '0.4rem 0 0 0',
            lineHeight: 1.4,
          }}>
            Administración centralizada de identidades con separación por negocio (Gimnasios Normales vs Total Life Changes) y simulación instantánea.
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#070a12',
                color: '#ffffff',
                border: 'none',
                padding: '0.55rem 1.15rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Plus size={16} color={currentTheme.primary} />
              <span>Crear Nuevo Usuario</span>
            </button>
          </div>
        </div>

        {/* Status Card Flotante de la Derecha (Estilo Nexo) */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(7, 10, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          color: '#ffffff',
          minWidth: '290px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}>
          {/* Header del card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentTheme.primary, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Unlock size={14} /> Permisos y Roles
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              color: '#94a3b8',
            }}>
              Multi-Tenant
            </span>
          </div>

          {/* Subtítulo y Porcentaje */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              # Cuentas Configuradas
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
              {users.length} <span style={{ fontSize: '0.85rem', color: currentTheme.primary }}>(Activas)</span>
            </span>
          </div>

          {/* Barra de progreso Neón */}
          <div style={{
            height: '7px',
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '0.85rem',
          }}>
            <div style={{
              width: '85%',
              height: '100%',
              background: currentTheme.primary,
              boxShadow: `0 0 10px ${currentTheme.primary}`,
              borderRadius: '999px',
            }} />
          </div>

          {/* Estadísticas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Admins de Negocio
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: currentTheme.primary, marginTop: '2px' }}>
                {users.filter(u => u.role === 'BUSINESS_ADMIN').length} Activos
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Afiliados TLC
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                {users.filter(u => u.role === 'AFFILIATE').length} Líderes
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '0.75rem 1.25rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          fontWeight: 700,
        }}>
          <CheckCircle size={18} color="#059669" /> {notification}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TARJETA BLANCA: FILTROS Y TABLA DE USUARIOS (ESTILO NEXO) */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        {/* Controles de Filtros */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'Todos los Roles' },
              { id: 'SUPERADMIN', label: 'Superadmin' },
              { id: 'BUSINESS_ADMIN', label: 'Admin Negocio' },
              { id: 'AFFILIATE', label: 'Afiliados TLC' },
              { id: 'TRAINER', label: 'Entrenadores' },
            ].map((tab) => {
              const isActive = roleFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '999px',
                    border: 'none',
                    background: isActive ? currentTheme.primary : '#f8fafc',
                    color: isActive ? '#000000' : '#64748b',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: isActive ? `0 3px 12px ${currentTheme.primaryGlow}` : 'none',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '999px',
            padding: '0.4rem 0.85rem',
            fontSize: '0.8rem',
          }}>
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Buscar usuario o correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.8rem',
                color: '#0f172a',
                width: '180px',
              }}
            />
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Usuario</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Rol Asignado</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Negocio Asociado</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Contacto</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Simular Sesión</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const badge = getRoleBadge(u.role);
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={u.firstName}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{u.firstName} {u.lastName}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span style={{
                        background: badge.bg,
                        color: badge.color,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                      }}>
                        {badge.label}
                      </span>
                      {u.affiliateRank && (
                        <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                          Rango: {u.affiliateRank}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      {u.business ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {u.business.type === 'TLC' ? <Leaf size={14} color="#059669" /> : <Dumbbell size={14} color="#0284c7" />}
                          <span style={{ fontWeight: 700, color: '#334155' }}>{u.business.name}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Acceso Global (Todas las Sedes)</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#64748b' }}>
                      <div>{u.email}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{u.phone || 'Sin teléfono'}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                      {onSwitchUser && (
                        <button
                          onClick={() => onSwitchUser(u)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            cursor: 'pointer',
                          }}
                        >
                          <ArrowRightLeft size={13} color={currentTheme.primary} />
                          <span>Entrar como</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear Usuario */}
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(7, 10, 18, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '540px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={22} color={currentTheme.primary} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Crear Usuario en el Sistema
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Nombres</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Apellidos</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Rol a Asignar</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    <option value="SUPERADMIN">Superadministrador</option>
                    <option value="BUSINESS_ADMIN">Administrador de Negocio</option>
                    <option value="AFFILIATE">Afiliado TLC</option>
                    <option value="TRAINER">Entrenador Personal</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tipo de Negocio</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
                    disabled={formData.role === 'SUPERADMIN'}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: formData.role === 'SUPERADMIN' ? '#f1f5f9' : '#fff' }}
                  >
                    <option value="TLC">Total Life Changes (TLC)</option>
                    <option value="GYM">Gimnasio Normal</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: currentTheme.primary,
                    color: '#000000',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: `0 3px 12px ${currentTheme.primaryGlow}`,
                  }}
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagementView;
