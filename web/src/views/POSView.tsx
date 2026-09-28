import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Receipt,
  User,
  CheckCircle2,
  Printer,
  Sparkles,
  TrendingUp,
  Clock,
  Search,
} from 'lucide-react';
import { api, Member, MembershipPlan, Payment } from '../services/api';

export const POSView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState({ todayTotal: 0, cashTotal: 0, digitalTotal: 0, count: 0 });

  // Cobro State
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER' | 'NEQUI_DAVIPLATA'>('CASH');
  const [cashGiven, setCashGiven] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [lastPayment, setLastPayment] = useState<Payment | null>(null);

  const loadData = async () => {
    try {
      const [membersData, plansData, paymentsRes] = await Promise.all([
        api.getMembers(),
        api.getPlans(),
        api.getPayments(),
      ]);
      setMembers(membersData);
      setPlans(plansData);
      setPayments(paymentsRes.payments);
      setSummary(paymentsRes.summary);

      if (plansData.length > 0 && !selectedPlanId) {
        setSelectedPlanId(plansData[0].id);
        setAmount(plansData[0].price);
      }
      if (membersData.length > 0 && !selectedMemberId) {
        setSelectedMemberId(membersData[0].id);
      }
    } catch (err) {
      console.error('Error cargando POS:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const p = plans.find((x) => x.id === planId);
    if (p) {
      setAmount(p.price);
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !amount) {
      alert('Seleccione socio y monto válido');
      return;
    }

    try {
      const res = await api.createPayment({
        memberId: selectedMemberId,
        planId: selectedPlanId || undefined,
        amount,
        paymentMethod,
        notes: notes || undefined,
      });

      setLastPayment(res.data);
      alert(`¡Cobro exitoso! Comprobante #${res.data.invoiceNumber}`);
      loadData();
      setCashGiven('');
      setNotes('');
    } catch (err: any) {
      alert(err.message || 'Error al procesar cobro');
    }
  };

  const cashChange = cashGiven ? Math.max(0, parseFloat(cashGiven) - amount) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Resumen de Caja del Día */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
      }}>
        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Total Recaudado Hoy</span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            ${summary.todayTotal.toLocaleString('es-CO')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{summary.count} transacciones registradas</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Efectivo en Caja</span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            ${summary.cashTotal.toLocaleString('es-CO')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Disponible para arqueo</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Transferencias & Digital</span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
            ${summary.digitalTotal.toLocaleString('es-CO')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>Tarjeta, Nequi y Daviplata</span>
        </div>
      </div>

      {/* POS Terminal & Receipt Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Cobro Terminal Form */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={22} color="#10b981" />
            <span>Terminal de Cobro Rápido</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '4px 0 1.5rem 0' }}>
            Registra ventas de membresías, pases diarios o productos con comprobante digital.
          </p>

          <form onSubmit={handleProcessPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Socio */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Seleccionar Socio *</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  marginTop: '4px',
                  fontSize: '0.9rem',
                }}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} • Doc: {m.documentNumber} ({m.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Plan o Concepto */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Plan / Concepto de Cobro</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '6px' }}>
                {plans.map((p) => {
                  const isSelected = selectedPlanId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePlanChange(p.id)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: isSelected ? '#ffffff' : '#94a3b8',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: isSelected ? '#10b981' : '#64748b', fontWeight: 700 }}>
                        ${p.price.toLocaleString('es-CO')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monto Final */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Total a Cobrar</label>
              <div style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#10b981',
                padding: '0.5rem 0.85rem',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                borderRadius: '10px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                marginTop: '4px',
              }}>
                ${amount.toLocaleString('es-CO')}
              </div>
            </div>

            {/* Método de Pago */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Método de Pago</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginTop: '6px' }}>
                {[
                  { id: 'CASH', label: 'Efectivo' },
                  { id: 'CARD', label: 'Tarjeta' },
                  { id: 'TRANSFER', label: 'Transfer.' },
                  { id: 'NEQUI_DAVIPLATA', label: 'Nequi' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    style={{
                      padding: '0.6rem 0.3rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: paymentMethod === m.id ? '#10b981' : 'rgba(255,255,255,0.06)',
                      color: paymentMethod === m.id ? '#ffffff' : '#94a3b8',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculadora de Cambio para Efectivo */}
            {paymentMethod === 'CASH' && (
              <div style={{
                padding: '0.85rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
              }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Efectivo Recibido</label>
                  <input
                    type="number"
                    placeholder="Ej: 100000"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      marginTop: '2px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Cambio a Devolver</label>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>
                    ${cashChange.toLocaleString('es-CO')}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '0.9rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Receipt size={20} />
              <span>Confirmar Cobro e Imprimir Recibo</span>
            </button>
          </form>
        </div>

        {/* Comprobante de Pago Generado (Imprimible) */}
        <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0c1322',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Comprobante de Caja
            </h3>
            {lastPayment && (
              <button
                onClick={() => window.print()}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Printer size={14} />
                <span>Imprimir</span>
              </button>
            )}
          </div>

          {lastPayment ? (
            <div style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              padding: '1.5rem',
              borderRadius: '12px',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            }}>
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>APEX GYM & FITNESS</h4>
                <p style={{ margin: '2px 0', fontSize: '0.75rem', color: '#64748b' }}>NIT: 901.884.212-9</p>
                <p style={{ margin: '2px 0', fontSize: '0.75rem', color: '#64748b' }}>Av. Las Palmas #24-10</p>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block', marginTop: '6px' }}>
                  RECIBO: {lastPayment.invoiceNumber}
                </strong>
              </div>

              <div style={{ padding: '0.75rem 0', borderBottom: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div>Fecha: {new Date(lastPayment.createdAt).toLocaleString()}</div>
                <div>Socio: {lastPayment.member?.firstName} {lastPayment.member?.lastName}</div>
                <div>Documento: {lastPayment.member?.documentNumber}</div>
                <div>Método: {lastPayment.paymentMethod}</div>
              </div>

              <div style={{ padding: '0.75rem 0', borderBottom: '1px dashed #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>{lastPayment.plan?.name || 'Membresía / Servicio'}</span>
                  <span>${lastPayment.amount.toLocaleString('es-CO')}</span>
                </div>
              </div>

              <div style={{ paddingTop: '0.75rem', textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  TOTAL: ${lastPayment.amount.toLocaleString('es-CO')}
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748b', marginTop: '1rem' }}>
                  ¡Gracias por entrenar en APEX GYM!
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Receipt size={40} color="#475569" />
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                Realiza un cobro a la izquierda para visualizar el comprobante oficial listo para imprimir.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Historial de Transacciones Recientes */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
          Últimas Transacciones Registradas
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b' }}>
                <th style={{ padding: '0.75rem 1rem' }}>N° Comprobante</th>
                <th style={{ padding: '0.75rem 1rem' }}>Socio</th>
                <th style={{ padding: '0.75rem 1rem' }}>Concepto</th>
                <th style={{ padding: '0.75rem 1rem' }}>Método</th>
                <th style={{ padding: '0.75rem 1rem' }}>Fecha</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 8).map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#06b6d4' }}>
                    {p.invoiceNumber}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#f1f5f9' }}>
                    {p.member ? `${p.member.firstName} ${p.member.lastName}` : 'Cliente'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>
                    {p.plan?.name || 'Membresía'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      fontSize: '0.75rem',
                    }}>
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>
                    {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                    ${p.amount.toLocaleString('es-CO')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
