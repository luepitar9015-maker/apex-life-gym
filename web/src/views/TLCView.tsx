import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Users, 
  ShoppingBag, 
  Flame, 
  TrendingUp, 
  DollarSign, 
  Droplet, 
  Scale, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Award,
  ChevronRight,
  PackageCheck,
  Unlock,
  Lock,
  Download,
  Search,
  Eye,
  Check,
  ShieldCheck
} from 'lucide-react';
import { 
  fetchTLCProducts, 
  fetchTLCAffiliates, 
  fetchTLCProtocols, 
  fetchTLCSales,
  createTLCProtocol,
  TLCProduct, 
  TLCAffiliate, 
  TLCProtocol, 
  TLCSale 
} from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';
import { TLCContactsView } from './TLCContactsView.js';

interface TLCViewProps {
  currentTheme?: ColorTheme;
  initialTab?: 'overview' | 'contacts' | 'protocols' | 'affiliates' | 'products' | 'sales';
}

export const TLCView: React.FC<TLCViewProps> = ({ 
  currentTheme = getSavedTheme(),
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'protocols' | 'affiliates' | 'products' | 'sales'>(initialTab);
  
  const [products, setProducts] = useState<TLCProduct[]>([]);
  const [affiliates, setAffiliates] = useState<TLCAffiliate[]>([]);
  const [protocols, setProtocols] = useState<TLCProtocol[]>([]);
  const [sales, setSales] = useState<TLCSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Modal para nuevo reto détox
  const [isNewProtocolModalOpen, setIsNewProtocolModalOpen] = useState(false);
  const [newProtocolData, setNewProtocolData] = useState({
    clientName: '',
    clientEmail: '',
    protocolType: 'DETOX_30_DAYS',
    startWeightKg: 80,
    targetWeightKg: 72,
    productsUsed: 'Iaso Tea Original + Gotas Resolution',
    dailyWaterTargetLiters: 3.5,
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pData, aData, protData, sData] = await Promise.all([
        fetchTLCProducts(),
        fetchTLCAffiliates(),
        fetchTLCProtocols(),
        fetchTLCSales(),
      ]);
      setProducts(pData);
      setAffiliates(aData);
      setProtocols(protData);
      setSales(sData);
    } catch (e) {
      console.error('Error cargando datos TLC', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProtocol = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProt: TLCProtocol = {
      id: `prot-${Date.now()}`,
      protocolType: newProtocolData.protocolType,
      startDate: new Date().toISOString(),
      startWeightKg: Number(newProtocolData.startWeightKg),
      currentWeightKg: Number(newProtocolData.startWeightKg),
      targetWeightKg: Number(newProtocolData.targetWeightKg),
      productsUsed: newProtocolData.productsUsed,
      dailyWaterTargetLiters: Number(newProtocolData.dailyWaterTargetLiters),
      status: 'ACTIVE',
      notes: newProtocolData.notes,
      client: {
        id: `cli-${Date.now()}`,
        firstName: newProtocolData.clientName.split(' ')[0] || 'Cliente',
        lastName: newProtocolData.clientName.split(' ')[1] || 'TLC',
        email: newProtocolData.clientEmail,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
      },
      affiliate: {
        id: 'aff-active',
        firstName: 'Elena',
        lastName: 'Morales',
        email: 'elena.tlc@totallifechanges.com',
      },
      dailyLogs: [
        {
          id: `log-${Date.now()}`,
          logDate: new Date().toISOString(),
          weightKg: Number(newProtocolData.startWeightKg),
          tookTea: true,
          tookResolution: true,
          waterLiters: Number(newProtocolData.dailyWaterTargetLiters),
          feelingScore: 5,
          notes: 'Inicio oficial del Reto Détox Total Life Changes.',
        },
      ],
    };

    setProtocols([newProt, ...protocols]);
    setIsNewProtocolModalOpen(false);
    setActiveTab('protocols');
  };

  const totalCommissions = sales.reduce((acc, curr) => acc + Number(curr.commissionUsd), 0);
  const totalVolumePV = affiliates.reduce((acc, curr) => acc + (curr.totalPvPoints || 0), 0);
  const totalActiveClients = protocols.filter(p => p.status === 'ACTIVE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER ESTILO NEXO: VIBRANTE + WIDGET FLOTANTE + TLC-PRO */}
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
          TLC-PRO
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
              % TOTAL LIFE CHANGES HUB & PROFIT SHARE
            </span>
            <span style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.82rem', fontWeight: 700 }}>
              Reto Détox 15/30 Días & Red de Afiliados
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
            TOTAL LIFE CHANGES <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>HUB</span>
          </h1>

          <p style={{
            color: 'rgba(7, 10, 18, 0.85)',
            fontSize: '0.92rem',
            fontWeight: 600,
            margin: '0.4rem 0 0 0',
            lineHeight: 1.4,
          }}>
            Monitorea el progreso de pérdida de peso de tus clientes con Iaso Tea y Gotas Resolution, impulsa tu red binaria y monetiza comisiones del 50%.
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsNewProtocolModalOpen(true)}
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
              <span>Nuevo Reto Détox</span>
            </button>
            
            <button
              onClick={() => setActiveTab('sales')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#070a12',
                border: 'none',
                padding: '0.55rem 1.15rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <DollarSign size={16} color="#059669" />
              <span>Ver Comisiones (${totalCommissions.toFixed(0)})</span>
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
              <Unlock size={14} /> Calificación: Director Activo
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              color: '#94a3b8',
            }}>
              Rango VIP
            </span>
          </div>

          {/* Subtítulo y Porcentaje */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              # Directos Activos
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
              3 / 5 <span style={{ fontSize: '0.85rem', color: currentTheme.primary }}>(60%)</span>
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
              width: '60%',
              height: '100%',
              background: currentTheme.primary,
              boxShadow: `0 0 10px ${currentTheme.primary}`,
              borderRadius: '999px',
            }} />
          </div>

          {/* Estadísticas de generaciones y puntos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Generaciones Unlocked
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: currentTheme.primary, marginTop: '2px' }}>
                3 de 5
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Volumen Red (PV)
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                {totalVolumePV.toLocaleString()} pts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TARJETA BLANCA: PESTAÑAS DE NAVEGACIÓN Y FILTROS */}
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
        {/* Pills de Pestañas */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: 'Dashboard TLC', icon: Sparkles },
            { id: 'contacts', label: 'Contactos Ley 1581 (Col)', icon: ShieldCheck },
            { id: 'protocols', label: 'Reto Détox 15/30 Días', icon: Scale, count: totalActiveClients },
            { id: 'affiliates', label: 'Red de Afiliados (Downline)', icon: Users, count: affiliates.length },
            { id: 'products', label: 'Kits & Suplementos', icon: ShoppingBag, count: products.length },
            { id: 'sales', label: 'Comisiones & Ventas', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: isActive ? currentTheme.primary : '#f8fafc',
                  color: isActive ? '#000000' : '#64748b',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? `0 3px 12px ${currentTheme.primaryGlow}` : 'none',
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px',
                    background: isActive ? '#000000' : '#e2e8f0',
                    color: isActive ? currentTheme.primary : '#475569',
                    fontWeight: 800,
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Buscador Rápido */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              placeholder="Buscar cliente, afiliado o kit..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
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
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CONTENIDO SEGÚN LA PESTAÑA SELECCIONADA */}
      {/* ------------------------------------------------------------- */}

      {/* PESTAÑA: CONTACTOS & LEY 1581 (COLOMBIA) */}
      {activeTab === 'contacts' && (
        <TLCContactsView currentTheme={currentTheme} />
      )}

      {/* 1. OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tarjetas KPI Superiores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>Comisiones Acumuladas</span>
                <div style={{ padding: '0.45rem', borderRadius: '10px', background: currentTheme.accentBg, color: currentTheme.primary }}>
                  <DollarSign size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
                ${totalCommissions.toFixed(2)} USD
              </div>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <TrendingUp size={13} /> Bono minorista 50% ($20 / kit vendido)
              </span>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>Volumen de Red (Puntos PV)</span>
                <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.12)', color: '#0284c7' }}>
                  <Award size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
                {totalVolumePV.toLocaleString()} PV
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>
                Calificación para rango Ejecutivo & Director
              </span>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>Clientes en Reto Détox</span>
                <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'rgba(249, 115, 22, 0.12)', color: '#ea580c' }}>
                  <Flame size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
                {totalActiveClients} Clientes
              </div>
              <span style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 700 }}>
                Protocolo activo con Iaso Tea y Resolution
              </span>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>Distribuidores Downline</span>
                <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.12)', color: '#9333ea' }}>
                  <Users size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
                {affiliates.length} Afiliados
              </div>
              <span style={{ fontSize: '0.75rem', color: '#9333ea', fontWeight: 700 }}>
                Red binaria y unilevel activa
              </span>
            </div>
          </div>

          {/* Tabla de Clientes Destacados en Reto Détox */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Scale size={20} color={currentTheme.primary} />
                  Monitoreo de Retos Détox (15 & 30 Días)
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                  Progreso de pérdida de peso en tiempo real y consumo de agua.
                </p>
              </div>

              <button
                onClick={() => setIsNewProtocolModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: currentTheme.primary,
                  color: '#000000',
                  border: 'none',
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: `0 3px 12px ${currentTheme.primaryGlow}`,
                }}
              >
                <Plus size={15} />
                <span>+ Inscribir Cliente al Reto</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Cliente</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Protocolo & Productos</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Peso Inicial</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Peso Actual</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Pérdida Total</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Meta</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Estado</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {protocols.map((p) => {
                    const lost = (Number(p.startWeightKg) - Number(p.currentWeightKg)).toFixed(1);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <img
                              src={p.client?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                              alt="Avatar"
                              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.client?.firstName} {p.client?.lastName}</div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{p.client?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span style={{
                            display: 'inline-block',
                            background: '#f1f5f9',
                            color: '#334155',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                          }}>
                            {p.protocolType === 'DETOX_30_DAYS' ? 'Reto Détox 30 Días' : 'Reto Détox 15 Días'}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px' }}>
                            {p.productsUsed}
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: '#475569' }}>
                          {p.startWeightKg} kg
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 800, color: '#0f172a' }}>
                          {p.currentWeightKg} kg
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span style={{
                            background: Number(lost) > 0 ? '#ecfdf5' : '#f8fafc',
                            color: Number(lost) > 0 ? '#059669' : '#64748b',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                          }}>
                            {Number(lost) > 0 ? `-${lost} kg 🔥` : 'En inicio'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: '#64748b' }}>
                          {p.targetWeightKg} kg
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span style={{
                            background: p.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9',
                            color: p.status === 'ACTIVE' ? '#15803d' : '#64748b',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                          }}>
                            {p.status === 'ACTIVE' ? 'ACTIVO' : 'COMPLETADO'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                          <button
                            onClick={() => setActiveTab('protocols')}
                            style={{
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
                            Ver Bitácora
                          </button>
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

      {/* 2. RETO DÉTOX 15/30 DÍAS TAB */}
      {activeTab === 'protocols' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Expedientes de Reto Détox (Iaso Tea & Gotas Resolution)
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                Control clínico de ingesta de té herbal, gotas sublinguales y registro diario de peso.
              </p>
            </div>

            <button
              onClick={() => setIsNewProtocolModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: currentTheme.primary,
                color: '#000000',
                border: 'none',
                padding: '0.55rem 1.25rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: `0 4px 14px ${currentTheme.primaryGlow}`,
              }}
            >
              <Plus size={16} />
              <span>Nuevo Reto Détox</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {protocols.map((p) => {
              const diff = (Number(p.startWeightKg) - Number(p.currentWeightKg)).toFixed(1);
              const progressPct = Math.min(100, Math.max(0, Math.round(((Number(p.startWeightKg) - Number(p.currentWeightKg)) / (Number(p.startWeightKg) - Number(p.targetWeightKg))) * 100)));
              
              return (
                <div key={p.id} style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={p.client?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt="Avatar"
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{p.client?.firstName} {p.client?.lastName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Afiliado Sponsor: {p.affiliate?.firstName}</div>
                      </div>
                    </div>

                    <span style={{
                      background: currentTheme.primary,
                      color: '#000000',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      fontWeight: 800,
                      fontSize: '0.7rem',
                    }}>
                      {p.protocolType === 'DETOX_30_DAYS' ? '30 Días' : '15 Días'}
                    </span>
                  </div>

                  {/* Barra de progreso de la meta */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b', fontWeight: 600 }}>Avance hacia la meta</span>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>{progressPct}% alcanzado</span>
                    </div>
                    <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPct}%`, height: '100%', background: currentTheme.primary, borderRadius: '999px' }} />
                    </div>
                  </div>

                  {/* Métricas de peso */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: '#ffffff', padding: '0.65rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>INICIAL</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#475569' }}>{p.startWeightKg} kg</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>ACTUAL</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>{p.currentWeightKg} kg</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>REDUCIDO</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#059669' }}>-{diff} kg</div>
                    </div>
                  </div>

                  {/* Productos y Agua */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Droplet size={14} color="#0284c7" />
                      <span>Agua: {p.dailyWaterTargetLiters} L / día</span>
                    </div>
                    <div style={{ fontWeight: 600, color: '#334155' }}>
                      {p.productsUsed}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. RED DE AFILIADOS (DOWNLINE) TAB */}
      {activeTab === 'affiliates' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Red Binaria & Unilevel de Distribuidores TLC
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                Afiliados registrados, volumen personal (PV) y árbol de patrocinio.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ background: currentTheme.accentBg, color: currentTheme.primary, fontWeight: 800, padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem' }}>
                Total Red: {affiliates.length} Líderes
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Distribuidor</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Rango Alcanzado</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Patrocinador (Sponsor)</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Puntos PV Red</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Comisiones Estimadas</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((aff) => (
                  <tr key={aff.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: currentTheme.primary,
                          color: '#000000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                        }}>
                          {aff.firstName.charAt(0)}{aff.lastName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{aff.firstName} {aff.lastName}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{aff.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#0f172a',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                      }}>
                        {aff.affiliateRank || 'Afiliado Activo'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#64748b' }}>
                      {aff.sponsor ? `${aff.sponsor.firstName} ${aff.sponsor.lastName}` : 'Línea Directa (Fundador)'}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 800, color: '#0f172a' }}>
                      {(aff.totalPvPoints || 0).toLocaleString()} PV
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 800, color: '#059669' }}>
                      ${((aff.totalPvPoints || 0) * 0.15).toFixed(2)} USD
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}>
                        CALIFICADO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. KITS & SUPLEMENTOS TAB */}
      {activeTab === 'products' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Catálogo Oficial de Productos & Kits TLC
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              Iaso Tea Herbal Détox, Gotas Resolution, Chaga, NRG y Delgada Coffee.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {products.map((prod) => (
              <div key={prod.id} style={{
                background: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <img
                  src={prod.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'}
                  alt={prod.name}
                  style={{ width: '100%', height: '170px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{prod.name}</h3>
                    <span style={{
                      background: currentTheme.primary,
                      color: '#000000',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                    }}>
                      {prod.pvPoints} PV
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                    {prod.description}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>PRECIO AL PÚBLICO</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>${prod.priceUsd} USD</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>TU COMISIÓN 50%</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#059669' }}>+$20.00 USD</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. COMISIONES & VENTAS TAB (ESTILO DEAL HISTORY TABLE) */}
      {activeTab === 'sales' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Historial de Ventas & Comisiones Ganadas (Bono 50%)
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                Registro contable con regla del 50% ($20 USD fijos por cada 40 PV comercializados).
              </p>
            </div>

            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              color: '#065f46',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}>
              Ganancia Total Acumulada: ${totalCommissions.toFixed(2)} USD
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Transacción / ID</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Cliente Comprador</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Producto Adquirido</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Puntos PV</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Regla de Comisión</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Ganancia Neta</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Estado</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 800, color: '#0f172a' }}>
                      {sale.id.slice(0, 10).toUpperCase()}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{sale.customerName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{sale.customerEmail || 'cliente.web@tlc.com'}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: '#334155' }}>
                      {sale.items?.[0]?.product?.name || 'Iaso Tea Original 5 Packs'}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 800, color: '#0f172a' }}>
                      {sale.pointsPv} PV
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}>
                        50% Retail Bonus
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 900, color: '#059669', fontSize: '0.9rem' }}>
                      +${sale.commissionUsd} USD
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}>
                        PAGADO
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: '#64748b', fontSize: '0.75rem' }}>
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO RETO DÉTOX */}
      {isNewProtocolModalOpen && (
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
            maxWidth: '560px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scale size={22} color={currentTheme.primary} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Nuevo Reto Détox TLC
                </h3>
              </div>
              <button
                onClick={() => setIsNewProtocolModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProtocol} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Nombre Completo del Cliente
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Diana Carolina Mendoza"
                  value={newProtocolData.clientName}
                  onChange={(e) => setNewProtocolData({ ...newProtocolData, clientName: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="cliente@correo.com"
                  value={newProtocolData.clientEmail}
                  onChange={(e) => setNewProtocolData({ ...newProtocolData, clientEmail: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Duración del Reto
                  </label>
                  <select
                    value={newProtocolData.protocolType}
                    onChange={(e) => setNewProtocolData({ ...newProtocolData, protocolType: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    <option value="DETOX_15_DAYS">Reto Détox 15 Días</option>
                    <option value="DETOX_30_DAYS">Reto Détox 30 Días</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Meta de Agua Diaria
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProtocolData.dailyWaterTargetLiters}
                    onChange={(e) => setNewProtocolData({ ...newProtocolData, dailyWaterTargetLiters: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Peso Inicial (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProtocolData.startWeightKg}
                    onChange={(e) => setNewProtocolData({ ...newProtocolData, startWeightKg: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Peso Meta (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProtocolData.targetWeightKg}
                    onChange={(e) => setNewProtocolData({ ...newProtocolData, targetWeightKg: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Suplementos Utilizados
                </label>
                <input
                  type="text"
                  value={newProtocolData.productsUsed}
                  onChange={(e) => setNewProtocolData({ ...newProtocolData, productsUsed: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNewProtocolModalOpen(false)}
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
                  Activar Reto Détox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TLCView;
