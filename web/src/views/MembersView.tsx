import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Filter, Mail, Phone, Calendar, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';
import { fetchMembers } from '../services/api.js';

export const MembersView: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  // Formulario nuevo socio
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    documentId: '',
    plan: 'Plan Mensual Pro',
  });

  useEffect(() => {
    fetchMembers().then((data) => setMembers(data));
  }, []);

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `m_${Date.now()}`,
      firstName: newMember.firstName,
      lastName: newMember.lastName,
      email: newMember.email,
      phone: newMember.phone,
      documentId: newMember.documentId,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
      subscriptions: [{
        status: 'ACTIVE',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        membershipPlan: { name: newMember.plan }
      }]
    };

    setMembers([created, ...members]);
    setShowModal(false);
    setNewMember({ firstName: '', lastName: '', email: '', phone: '', documentId: '', plan: 'Plan Mensual Pro' });
  };

  const filteredMembers = members.filter((m) => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()) || m.documentId?.includes(search);
    const isExpired = m.subscriptions[0]?.status === 'EXPIRED';

    if (filterStatus === 'ACTIVE') return matchesSearch && !isExpired;
    if (filterStatus === 'EXPIRED') return matchesSearch && isExpired;
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Directorio de Socios & Membresías</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Gestiona los expedientes de los clientes, fechas de vencimiento y perfiles biométricos.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={18} /> Registrar Nuevo Socio
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="input-control"
            placeholder="Buscar por nombre, correo o número de identificación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${filterStatus === 'ALL' ? 'btn-secondary' : ''}`}
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              background: filterStatus === 'ALL' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: filterStatus === 'ALL' ? 'var(--primary)' : 'var(--text-muted)'
            }}
            onClick={() => setFilterStatus('ALL')}
          >
            Todos ({members.length})
          </button>
          <button
            className="btn"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              background: filterStatus === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: filterStatus === 'ACTIVE' ? 'var(--primary)' : 'var(--text-muted)'
            }}
            onClick={() => setFilterStatus('ACTIVE')}
          >
            Activos
          </button>
          <button
            className="btn"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              background: filterStatus === 'EXPIRED' ? 'rgba(244, 63, 94, 0.2)' : 'transparent',
              color: filterStatus === 'EXPIRED' ? 'var(--accent-rose)' : 'var(--text-muted)'
            }}
            onClick={() => setFilterStatus('EXPIRED')}
          >
            Vencidos
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Socio</th>
              <th>Documento</th>
              <th>Contacto</th>
              <th>Plan Vigente</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m) => {
              const sub = m.subscriptions[0];
              const isActive = sub?.status === 'ACTIVE';

              return (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop'}
                        alt={m.firstName}
                        style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ display: 'block', color: '#fff' }}>{m.firstName} {m.lastName}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{m.documentId || 'N/A'}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.phone || 'Sin registrar'}</span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>
                      {sub?.membershipPlan?.name || 'Pase Diario'}
                    </strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {sub?.endDate ? new Date(sub.endDate).toLocaleDateString() : 'Indefinido'}
                    </span>
                  </td>
                  <td>
                    {isActive ? (
                      <span className="badge badge-active">Activo</span>
                    ) : (
                      <span className="badge badge-expired">Vencido</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                      Ficha Biometría
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Registro Nuevo Socio */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1rem' }}>Registrar Nuevo Socio</h3>
            <form onSubmit={handleCreateMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Nombre</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    value={newMember.firstName}
                    onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Apellido</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    value={newMember.lastName}
                    onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Correo Electrónico</label>
                <input
                  type="email"
                  required
                  className="input-control"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>DNI / Cédula</label>
                  <input
                    type="text"
                    required
                    className="input-control"
                    value={newMember.documentId}
                    onChange={(e) => setNewMember({ ...newMember, documentId: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Teléfono</label>
                  <input
                    type="tel"
                    className="input-control"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Plan Inicial</label>
                <select
                  className="input-control"
                  value={newMember.plan}
                  onChange={(e) => setNewMember({ ...newMember, plan: e.target.value })}
                >
                  <option value="Plan Mensual Pro">Plan Mensual Pro ($45/mes)</option>
                  <option value="Plan Black VIP + IA">Plan Black VIP + IA ($85/mes)</option>
                  <option value="Pase Trimestral Elite">Pase Trimestral Elite ($120/trimestre)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Socio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
