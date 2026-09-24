import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Users, 
  Award, 
  Calendar, 
  Target, 
  Plus, 
  CheckCircle, 
  Star, 
  ChevronRight, 
  TrendingUp, 
  Clock,
  Unlock,
  Search,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { fetchTrainers, assignClientToTrainer, fetchMembers, Trainer } from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface TrainersViewProps {
  currentTheme?: ColorTheme;
}

export const TrainersView: React.FC<TrainersViewProps> = ({ currentTheme = getSavedTheme() }) => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignForm, setAssignForm] = useState({
    trainerId: '',
    clientId: '',
    goal: 'Aumento de masa muscular (hipertrofia)',
    sessionsPerWeek: 3,
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [trData, memData] = await Promise.all([
      fetchTrainers(),
      fetchMembers(),
    ]);
    setTrainers(trData);
    setMembers(memData);
    if (trData.length > 0 && !selectedTrainer) {
      setSelectedTrainer(trData[0]);
      setAssignForm(prev => ({ ...prev, trainerId: trData[0].id }));
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.trainerId || !assignForm.clientId) return;

    await assignClientToTrainer(assignForm);
    setIsAssignModalOpen(false);
    loadData();
  };

  const totalClientsCoached = trainers.reduce((acc, curr) => acc + (curr.trainerClients?.length || 0), 0);

  const filteredTrainers = trainers.filter(t => 
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER ESTILO NEXO: VIBRANTE + WIDGET FLOTANTE + COACH-X */}
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
          COACH-X
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
              % SISTEMA GYM / COACHING PERSONALIZADO
            </span>
            <span style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.82rem', fontWeight: 700 }}>
              Entrenadores 1 a 1 & Metas Individuales
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
            ENTRENADORES <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>PERSONALIZADOS</span>
          </h1>

          <p style={{
            color: 'rgba(7, 10, 18, 0.85)',
            fontSize: '0.92rem',
            fontWeight: 600,
            margin: '0.4rem 0 0 0',
            lineHeight: 1.4,
          }}>
            Asigna socios a coaches especializados, supervisa rutinas de hipertrofia y registra la progresión de cargas semana a semana.
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (trainers.length > 0) setAssignForm(prev => ({ ...prev, trainerId: trainers[0].id }));
                setIsAssignModalOpen(true);
              }}
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
              <span>Asignar Alumno a Coach</span>
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
              <Unlock size={14} /> Capacidad de Coaching
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              color: '#94a3b8',
            }}>
              Sala VIP
            </span>
          </div>

          {/* Subtítulo y Porcentaje */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              # Cupos Asignados
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
              {totalClientsCoached} / 30 <span style={{ fontSize: '0.85rem', color: currentTheme.primary }}>({Math.round((totalClientsCoached / 30) * 100)}%)</span>
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
              width: `${Math.min(100, Math.round((totalClientsCoached / 30) * 100))}%`,
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
                Coaches Activos
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: currentTheme.primary, marginTop: '2px' }}>
                {trainers.length} Expertos
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Retención de Alumnos
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                94.2%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TARJETA BLANCA: FILTRO Y DIRECTIVAS */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Especialidades:</span>
          {['Todos los Coaches', 'Hipertrofia & Fuerza', 'Pérdida de Grasa', 'Cross & Funcional'].map((cat, i) => (
            <button
              key={cat}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                border: 'none',
                background: i === 0 ? currentTheme.primary : '#f8fafc',
                color: i === 0 ? '#000000' : '#64748b',
                fontWeight: i === 0 ? 800 : 600,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
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
            placeholder="Buscar coach o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Grid de Coaches & Alumnos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredTrainers.map((tr) => {
          const isSelected = selectedTrainer?.id === tr.id;
          const assignedCount = tr.trainerClients?.length || 0;
          return (
            <div
              key={tr.id}
              onClick={() => setSelectedTrainer(tr)}
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                padding: '1.5rem',
                border: isSelected ? `2px solid ${currentTheme.primary}` : '1px solid #e2e8f0',
                boxShadow: isSelected ? `0 8px 25px ${currentTheme.primaryGlow}` : '0 4px 15px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img
                  src={tr.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={tr.firstName}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{tr.firstName} {tr.lastName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{tr.specialty || 'Entrenador Personal'}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>ALUMNOS ASIGNADOS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{assignedCount} / 10</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>VALORACIÓN</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Star size={15} fill="#eab308" /> 4.9
                  </div>
                </div>
              </div>

              {/* Lista de Alumnos del Coach */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem' }}>
                  Alumnos bajo su supervisión:
                </div>
                {assignedCount === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    Sin alumnos asignados actualmente.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {tr.trainerClients?.slice(0, 3).map((tc) => (
                      <div key={tc.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.78rem',
                        padding: '0.35rem 0.5rem',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>
                          {tc.client?.firstName} {tc.client?.lastName}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                          {tc.sessionsPerWeek} ses/sem
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAssignForm(prev => ({ ...prev, trainerId: tr.id }));
                  setIsAssignModalOpen(true);
                }}
                style={{
                  marginTop: 'auto',
                  background: isSelected ? currentTheme.primary : '#f1f5f9',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.55rem',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <Plus size={15} />
                <span>Asignar Alumno a {tr.firstName}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Asignar Alumno */}
      {isAssignModalOpen && (
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
            maxWidth: '520px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Dumbbell size={22} color={currentTheme.primary} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Asignar Socio a Coach
                </h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Entrenador Seleccionado
                </label>
                <select
                  value={assignForm.trainerId}
                  onChange={(e) => setAssignForm({ ...assignForm, trainerId: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.specialty})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Socio a Asignar
                </label>
                <select
                  value={assignForm.clientId}
                  onChange={(e) => setAssignForm({ ...assignForm, clientId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="">Selecciona un socio...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Objetivo Principal
                </label>
                <select
                  value={assignForm.goal}
                  onChange={(e) => setAssignForm({ ...assignForm, goal: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="Aumento de masa muscular (hipertrofia)">Aumento de masa muscular (hipertrofia)</option>
                  <option value="Pérdida de porcentaje graso y definición">Pérdida de porcentaje graso y definición</option>
                  <option value="Fuerza máxima y levantamiento de potencia">Fuerza máxima y levantamiento de potencia</option>
                  <option value="Reacondicionamiento físico y salud">Reacondicionamiento físico y salud</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Sesiones Semanales
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={assignForm.sessionsPerWeek}
                    onChange={(e) => setAssignForm({ ...assignForm, sessionsPerWeek: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Duración Estimada
                  </label>
                  <input
                    type="text"
                    disabled
                    value="12 Semanas"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#f1f5f9', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
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
                  Confirmar Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainersView;
