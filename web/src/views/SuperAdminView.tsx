import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Shield,
  Plus,
  Search,
  CheckCircle2,
  MapPin,
  Phone,
  BarChart3,
  Flame,
  Lock,
  Mail,
  UserCheck,
  Power,
} from 'lucide-react';
import { api, Gym, GymAdminUser } from '../services/api';

export const SuperAdminView: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [admins, setAdmins] = useState<GymAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'GYMS' | 'ADMINS'>('GYMS');

  // Modales
  const [showCreateGymModal, setShowCreateGymModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);

  // Formulario nuevo Gym
  const [newGymName, setNewGymName] = useState('');
  const [newGymCode, setNewGymCode] = useState('');
  const [newGymCity, setNewGymCity] = useState('Medellín');
  const [newGymAddress, setNewGymAddress] = useState('');
  const [newGymPhone, setNewGymPhone] = useState('');
  const [newGymCapacity, setNewGymCapacity] = useState(80);
  const [creatingGym, setCreatingGym] = useState(false);

  // Formulario nuevo Admin
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('Admin2026!');
  const [newAdminGymId, setNewAdminGymId] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gymList, adminList] = await Promise.all([
        api.getGyms(),
        api.getGymAdmins(),
      ]);
      setGyms(gymList);
      setAdmins(adminList);
      if (gymList.length > 0) {
        setNewAdminGymId(gymList[0].id);
      }
    } catch (err) {
      console.error('Error cargando Superadmin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGym = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGymName || !newGymCode || !newGymAddress) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setCreatingGym(true);
      await api.createGym({
        name: newGymName,
        code: newGymCode,
        city: newGymCity,
        address: newGymAddress,
        phone: newGymPhone,
        maxCapacity: Number(newGymCapacity),
      });

      alert(`Gimnasio ${newGymName} registrado exitosamente.`);
      setShowCreateGymModal(false);
      setNewGymName('');
      setNewGymCode('');
      setNewGymAddress('');
      setNewGymPhone('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error al crear gimnasio');
    } finally {
      setCreatingGym(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail || !newAdminPassword) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setCreatingAdmin(true);
      await api.createGymAdmin({
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword,
        gymId: newAdminGymId,
        role: 'ADMIN',
      });

      alert(`Administrador ${newAdminName} creado y asignado.`);
      setShowCreateAdminModal(false);
      setNewAdminName('');
      setNewAdminEmail('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error al crear administrador');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const totalMembers = gyms.reduce((acc, g) => acc + (g._count?.members || 0), 0);
  const totalCapacity = gyms.reduce((acc, g) => acc + g.maxCapacity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Banner SuperAdmin */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(236, 72, 153, 0.08) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Shield size={28} color="#a855f7" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Consola Central de SuperUsuario (SaaS Multi-Gimnasio)
              </h2>
              <span style={{
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}>
                SUPERADMIN MASTER
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Gestión global de franquicias, creación de gimnasios/sedes y aprovisionamiento de administradores.
            </p>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setShowCreateGymModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#a855f7',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.35)',
            }}
          >
            <Plus size={16} />
            <span>Crear Gimnasio / Sede</span>
          </button>

          <button
            onClick={() => setShowCreateAdminModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <UserCheck size={16} />
            <span>Crear Administrador</span>
          </button>
        </div>
      </div>

      {/* Métricas Globales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Gimnasios / Sedes</span>
            <Building2 size={20} color="#a855f7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            {gyms.length}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Sedes operativas en red</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Administradores Activos</span>
            <Users size={20} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            {admins.length}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 600 }}>Gestores asignados</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Afiliados Totales en Red</span>
            <Flame size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            {totalMembers}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Socios registrados</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Capacidad de Aforo Global</span>
            <BarChart3 size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            {totalCapacity} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>pax</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>Simultaneidad máxima</span>
        </div>
      </div>

      {/* Tabs: Gimnasios vs Administradores */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('GYMS')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'GYMS' ? '#a855f7' : 'rgba(255, 255, 255, 0.04)',
            color: activeTab === 'GYMS' ? '#ffffff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <Building2 size={16} />
          <span>Gimnasios & Sedes ({gyms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ADMINS')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'ADMINS' ? '#a855f7' : 'rgba(255, 255, 255, 0.04)',
            color: activeTab === 'ADMINS' ? '#ffffff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <Users size={16} />
          <span>Administradores de Sedes ({admins.length})</span>
        </button>
      </div>

      {/* CONTENIDO TAB 1: LISTADO DE GIMNASIOS */}
      {activeTab === 'GYMS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.25rem' }}>
          {gyms.map((g) => (
            <div
              key={g.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 800, letterSpacing: '0.08em' }}>
                    {g.code}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: g.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: g.active ? '#10b981' : '#ef4444',
                    fontWeight: 700,
                  }}>
                    {g.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0 0 0' }}>
                  {g.name}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.85rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="#64748b" />
                    <span>{g.address}, {g.city}</span>
                  </div>
                  {g.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={15} color="#64748b" />
                      <span>{g.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Métricas del Gym */}
              <div style={{
                paddingTop: '0.85rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                textAlign: 'center',
              }}>
                <div style={{ padding: '0.4rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Aforo Máx</span>
                  <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>{g.maxCapacity}</div>
                </div>
                <div style={{ padding: '0.4rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Socios</span>
                  <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>{g._count?.members || 0}</div>
                </div>
                <div style={{ padding: '0.4rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Admins</span>
                  <div style={{ fontWeight: 700, color: '#06b6d4', fontSize: '0.9rem' }}>{g._count?.users || 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTENIDO TAB 2: ADMINISTRADORES */}
      {activeTab === 'ADMINS' && (
        <div className="glass-card table-responsive" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ minWidth: '600px', width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <th style={{ padding: '1rem' }}>Nombre</th>
                <th style={{ padding: '1rem' }}>Correo Electrónico</th>
                <th style={{ padding: '1rem' }}>Rol</th>
                <th style={{ padding: '1rem' }}>Gimnasio / Sede Asignada</th>
                <th style={{ padding: '1rem' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {u.name}
                  </td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: u.role === 'SUPERADMIN' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                      color: u.role === 'SUPERADMIN' ? '#c084fc' : '#06b6d4',
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#f1f5f9' }}>
                    {u.gym ? `${u.gym.name} (${u.gym.code})` : 'Acceso Global SaaS'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: u.active ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                      {u.active ? '🟢 Activo' : '🔴 Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CREAR GIMNASIO */}
      {showCreateGymModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 1.25rem 0' }}>
              Registrar Nuevo Gimnasio / Sede
            </h3>

            <form onSubmit={handleCreateGym} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Nombre del Gimnasio</label>
                <input
                  type="text"
                  required
                  placeholder="ej: APEX Gym Sede Belén"
                  value={newGymName}
                  onChange={(e) => setNewGymName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Código Único</label>
                  <input
                    type="text"
                    required
                    placeholder="ej: SEDE-04"
                    value={newGymCode}
                    onChange={(e) => setNewGymCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Ciudad</label>
                  <input
                    type="text"
                    required
                    value={newGymCity}
                    onChange={(e) => setNewGymCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Dirección Exacta</label>
                <input
                  type="text"
                  required
                  placeholder="ej: Carrera 76 #30-15"
                  value={newGymAddress}
                  onChange={(e) => setNewGymAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Teléfono</label>
                  <input
                    type="text"
                    placeholder="+57 300 000 0000"
                    value={newGymPhone}
                    onChange={(e) => setNewGymPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Aforo Máximo</label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={newGymCapacity}
                    onChange={(e) => setNewGymCapacity(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateGymModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={creatingGym}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#a855f7',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {creatingGym ? 'Creando Sede...' : 'Guardar Sede'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR ADMINISTRADOR */}
      {showCreateAdminModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 1.25rem 0' }}>
              Crear Nuevo Administrador de Sede
            </h3>

            <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="ej: Andrés Montoya"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Correo Electrónico (Login)</label>
                <input
                  type="email"
                  required
                  placeholder="andres.admin@apexgym.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Contraseña Inicial</label>
                <input
                  type="text"
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Asignar al Gimnasio / Sede</label>
                <select
                  value={newAdminGymId}
                  onChange={(e) => setNewAdminGymId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                  }}
                >
                  {gyms.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.city})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateAdminModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={creatingAdmin}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#a855f7',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {creatingAdmin ? 'Guardando...' : 'Crear Administrador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
