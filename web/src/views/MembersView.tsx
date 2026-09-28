import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  QrCode,
  Calendar,
  Phone,
  Mail,
  Dumbbell,
  CreditCard,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';
import { api, Member, MembershipPlan } from '../services/api';

interface MembersViewProps {
  onNavigate: (view: string) => void;
  selectedMemberId?: string | null;
}

export const MembersView: React.FC<MembersViewProps> = ({ onNavigate, selectedMemberId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form Nuevo Socio
  const [newForm, setNewForm] = useState({
    firstName: '',
    lastName: '',
    documentNumber: '',
    documentType: 'CC',
    phone: '',
    email: '',
    birthDate: '',
    gender: 'MALE',
    planId: '',
    paymentMethod: 'CASH',
    weight: '',
    height: '',
    notes: '',
  });

  // Form Renovación
  const [renewPlanId, setRenewPlanId] = useState('');
  const [renewMethod, setRenewMethod] = useState('CASH');

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await api.getMembers({ search, status: statusFilter });
      setMembers(data);
    } catch (err) {
      console.error('Error cargando socios:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const data = await api.getPlans();
      setPlans(data);
      if (data.length > 0 && !newForm.planId) {
        setNewForm((prev) => ({ ...prev, planId: data[0].id }));
        setRenewPlanId(data[0].id);
      }
    } catch (err) {
      console.error('Error cargando planes:', err);
    }
  };

  useEffect(() => {
    loadMembers();
    loadPlans();
  }, [statusFilter]);

  useEffect(() => {
    if (selectedMemberId && members.length > 0) {
      const found = members.find((m) => m.id === selectedMemberId);
      if (found) {
        setSelectedMember(found);
        setShowDetailModal(true);
      }
    }
  }, [selectedMemberId, members]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMembers();
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createMember(newForm);
      alert('Socio registrado exitosamente con membresía activa');
      setShowNewModal(false);
      setNewForm({
        firstName: '',
        lastName: '',
        documentNumber: '',
        documentType: 'CC',
        phone: '',
        email: '',
        birthDate: '',
        gender: 'MALE',
        planId: plans[0]?.id || '',
        paymentMethod: 'CASH',
        weight: '',
        height: '',
        notes: '',
      });
      loadMembers();
    } catch (err: any) {
      alert(err.message || 'Error al crear socio');
    }
  };

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !renewPlanId) return;
    try {
      await api.renewMembership(selectedMember.id, renewPlanId, renewMethod);
      alert('Membresía renovada con éxito');
      setShowRenewModal(false);
      loadMembers();
      // Recargar socio
      const updated = await api.getMemberById(selectedMember.id);
      setSelectedMember(updated);
    } catch (err: any) {
      alert(err.message || 'Error al renovar');
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${name} del sistema?`)) return;
    try {
      await api.deleteMember(id);
      setShowDetailModal(false);
      loadMembers();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Bar with Search & Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Search & Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '300px' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar socio por nombre, documento o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </form>

          {/* Filter Status */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'ACTIVE', label: 'Activos' },
              { id: 'EXPIRED', label: 'Vencidos' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                style={{
                  border: 'none',
                  padding: '0.55rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: statusFilter === f.id ? 700 : 500,
                  backgroundColor: statusFilter === f.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: statusFilter === f.id ? '#10b981' : '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* New Member Button */}
        <button
          onClick={() => setShowNewModal(true)}
          style={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            border: 'none',
            padding: '0.75rem 1.4rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
          }}
        >
          <UserPlus size={18} />
          <span>Registrar Nuevo Socio</span>
        </button>
      </div>

      {/* Members Directory Table */}
      <div className="glass-card" style={{ padding: '0.5rem 0' }}>
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '680px', width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Socio</th>
                <th style={{ padding: '1rem' }}>Documento</th>
                <th style={{ padding: '1rem' }}>Teléfono</th>
                <th style={{ padding: '1rem' }}>Plan Activo</th>
                <th style={{ padding: '1rem' }}>Vence el</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Ficha 360°</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((m) => {
                  const isExpired = m.status === 'EXPIRED';
                  const daysLeft = m.planEndDate
                    ? Math.ceil((new Date(m.planEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    : 0;

                  return (
                    <tr
                      key={m.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: isExpired ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: isExpired ? '#ef4444' : '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            border: `1px solid ${isExpired ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                          }}>
                            {m.firstName.charAt(0)}{m.lastName.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem' }}>
                              {m.firstName} {m.lastName}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                              Código: <span style={{ color: '#06b6d4', fontWeight: 600 }}>{m.code}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                        {m.documentType} {m.documentNumber}
                      </td>

                      <td style={{ padding: '1rem', color: '#94a3b8' }}>
                        {m.phone || 'Sin teléfono'}
                      </td>

                      <td style={{ padding: '1rem', color: '#f1f5f9', fontWeight: 600 }}>
                        {m.currentPlan?.name || 'Sin Plan Asignado'}
                      </td>

                      <td style={{ padding: '1rem', color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                        {m.planEndDate ? (
                          <div>
                            <div>{new Date(m.planEndDate).toLocaleDateString()}</div>
                            <div style={{
                              fontSize: '0.72rem',
                              color: isExpired ? '#ef4444' : daysLeft <= 3 ? '#f59e0b' : '#10b981',
                              fontWeight: 600,
                            }}>
                              {isExpired ? 'Vencido' : `${daysLeft} días restantes`}
                            </div>
                          </div>
                        ) : (
                          '--'
                        )}
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: isExpired ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: isExpired ? '#ef4444' : '#10b981',
                        }}>
                          {isExpired ? 'VENCIDO' : 'ACTIVO'}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <button
                          onClick={async () => {
                            const full = await api.getMemberById(m.id);
                            setSelectedMember(full);
                            setShowDetailModal(true);
                          }}
                          style={{
                            backgroundColor: 'rgba(6, 182, 212, 0.12)',
                            border: '1px solid rgba(6, 182, 212, 0.25)',
                            color: '#06b6d4',
                            padding: '0.45rem 0.9rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <QrCode size={14} />
                          <span>Ver Ficha</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    {loading ? 'Cargando directorio de socios...' : 'No se encontraron socios registrados.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ficha 360° del Socio + Carnet Digital QR */}
      {showDetailModal && selectedMember && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative',
            backgroundColor: '#0f172a',
          }}>
            <button
              onClick={() => setShowDetailModal(false)}
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '1.5rem',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={22} />
            </button>

            {/* Carnet Digital High-Tech del Socio */}
            <div style={{
              background: 'linear-gradient(135deg, #0b1329 0%, #06242a 100%)',
              border: '2px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '18px',
              padding: '1.75rem',
              color: '#ffffff',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)',
              marginBottom: '1.75rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: '#06b6d4', fontWeight: 800, textTransform: 'uppercase' }}>
                    CARNET DIGITAL DE SOCIO
                  </span>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '4px 0 0 0' }}>
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    Doc: {selectedMember.documentType} {selectedMember.documentNumber}
                  </p>
                </div>

                <div style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: selectedMember.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: selectedMember.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  border: `1px solid ${selectedMember.status === 'ACTIVE' ? '#10b981' : '#ef4444'}`,
                }}>
                  {selectedMember.status === 'ACTIVE' ? 'MEMBRESÍA ACTIVA' : 'MEMBRESÍA VENCIDA'}
                </div>
              </div>

              {/* QR Code Simulado y Datos */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Plan: </span>
                    <strong style={{ color: '#f1f5f9' }}>{selectedMember.currentPlan?.name || 'Sin Plan'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Código Único: </span>
                    <strong style={{ color: '#06b6d4' }}>{selectedMember.code}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Vence: </span>
                    <strong style={{ color: '#e2e8f0' }}>
                      {selectedMember.planEndDate ? new Date(selectedMember.planEndDate).toLocaleDateString() : '--'}
                    </strong>
                  </div>
                </div>

                {/* QR Code Graphic */}
                <div style={{
                  backgroundColor: '#ffffff',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <div style={{
                    width: '74px',
                    height: '74px',
                    background: 'repeating-linear-gradient(0deg, #000 0, #000 3px, #fff 3px, #fff 6px), repeating-linear-gradient(90deg, #000 0, #000 3px, #fff 3px, #fff 6px)',
                    backgroundBlendMode: 'difference',
                    borderRadius: '4px',
                  }} />
                  <span style={{ fontSize: '0.62rem', color: '#000000', fontWeight: 800, marginTop: '3px' }}>
                    {selectedMember.code}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => {
                  setRenewPlanId(plans[0]?.id || '');
                  setShowRenewModal(true);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <CreditCard size={17} />
                <span>Renovar Membresía</span>
              </button>

              <button
                onClick={() => window.print()}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Printer size={16} />
                <span>Imprimir Carnet</span>
              </button>

              <button
                onClick={() => handleDeleteMember(selectedMember.id, `${selectedMember.firstName} ${selectedMember.lastName}`)}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
                title="Eliminar socio"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Biometría y Notas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Peso</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                  {selectedMember.weight ? `${selectedMember.weight} kg` : '--'}
                </div>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Estatura</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                  {selectedMember.height ? `${selectedMember.height} m` : '--'}
                </div>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>IMC Estimado</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>
                  {selectedMember.weight && selectedMember.height
                    ? (selectedMember.weight / (selectedMember.height * selectedMember.height)).toFixed(1)
                    : '--'}
                </div>
              </div>
            </div>

            {/* Historial de Pagos del Socio */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
                Historial de Pagos Registrados
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedMember.payments && selectedMember.payments.length > 0 ? (
                  selectedMember.payments.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.82rem',
                      }}
                    >
                      <div>
                        <strong style={{ color: '#06b6d4' }}>{p.invoiceNumber}</strong>
                        <span style={{ color: '#94a3b8', marginLeft: '6px' }}>
                          {new Date(p.createdAt).toLocaleDateString()} ({p.paymentMethod})
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, color: '#10b981' }}>
                        ${p.amount.toLocaleString('es-CO')}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>No hay registros de pago previos.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Nuevo Socio */}
      {showNewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative',
            backgroundColor: '#0f172a',
          }}>
            <button
              onClick={() => setShowNewModal(false)}
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '1.5rem',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={22} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Registrar Nuevo Socio
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Genera automáticamente el código único, carnet QR y activa la membresía.
            </p>

            <form onSubmit={handleCreateMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Nombres *</label>
                  <input
                    type="text"
                    required
                    value={newForm.firstName}
                    onChange={(e) => setNewForm({ ...newForm, firstName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      marginTop: '4px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={newForm.lastName}
                    onChange={(e) => setNewForm({ ...newForm, lastName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      marginTop: '4px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Tipo Doc.</label>
                  <select
                    value={newForm.documentType}
                    onChange={(e) => setNewForm({ ...newForm, documentType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      marginTop: '4px',
                    }}
                  >
                    <option value="CC">C.C.</option>
                    <option value="TI">T.I.</option>
                    <option value="CE">C.E.</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Número Documento *</label>
                  <input
                    type="text"
                    required
                    value={newForm.documentNumber}
                    onChange={(e) => setNewForm({ ...newForm, documentNumber: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      marginTop: '4px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Teléfono Móvil</label>
                  <input
                    type="tel"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      marginTop: '4px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Correo Electrónico</label>
                  <input
                    type="email"
                    value={newForm.email}
                    onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      marginTop: '4px',
                    }}
                  />
                </div>
              </div>

              {/* Plan Inicial */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Plan de Membresía</label>
                  <select
                    value={newForm.planId}
                    onChange={(e) => setNewForm({ ...newForm, planId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      marginTop: '4px',
                    }}
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price.toLocaleString('es-CO')})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Método Pago</label>
                  <select
                    value={newForm.paymentMethod}
                    onChange={(e) => setNewForm({ ...newForm, paymentMethod: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      marginTop: '4px',
                    }}
                  >
                    <option value="CASH">Efectivo</option>
                    <option value="CARD">Tarjeta</option>
                    <option value="TRANSFER">Transferencia</option>
                    <option value="NEQUI_DAVIPLATA">Nequi / Daviplata</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
                }}
              >
                Completar Registro y Cobro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Renovar Membresía */}
      {showRenewModal && selectedMember && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 110,
          padding: '1rem',
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '440px',
            padding: '2rem',
            position: 'relative',
            backgroundColor: '#0f172a',
          }}>
            <button
              onClick={() => setShowRenewModal(false)}
              style={{
                position: 'absolute',
                right: '1.25rem',
                top: '1.25rem',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Renovar Membresía
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 1.25rem 0' }}>
              Para: <strong style={{ color: '#f1f5f9' }}>{selectedMember.firstName} {selectedMember.lastName}</strong>
            </p>

            <form onSubmit={handleRenew} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Seleccionar Plan</label>
                <select
                  value={renewPlanId}
                  onChange={(e) => setRenewPlanId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    marginTop: '4px',
                  }}
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.price.toLocaleString('es-CO')}) - {p.durationDays} días
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Forma de Pago</label>
                <select
                  value={renewMethod}
                  onChange={(e) => setRenewMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    marginTop: '4px',
                  }}
                >
                  <option value="CASH">Efectivo en Caja</option>
                  <option value="CARD">Tarjeta Débito/Crédito</option>
                  <option value="TRANSFER">Transferencia Bancaria</option>
                  <option value="NEQUI_DAVIPLATA">Nequi / Daviplata</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
                }}
              >
                Confirmar Renovación y Recibo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
