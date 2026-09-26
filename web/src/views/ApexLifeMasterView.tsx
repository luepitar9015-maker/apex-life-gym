import React, { useState } from 'react';
import { 
  Building2, 
  Dumbbell, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Droplets, 
  Camera, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  Play, 
  UtensilsCrossed, 
  TrendingUp, 
  Bot, 
  Layers, 
  Search, 
  Heart, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  QrCode, 
  ChevronRight, 
  FileText, 
  Sliders, 
  Check, 
  Smile, 
  Moon, 
  Eye, 
  RefreshCw,
  Cpu,
  Zap,
  Target
} from 'lucide-react';
import { ColorTheme, EnvironmentTheme, getSavedTheme, getSavedEnvTheme } from '../styles/themeConfig.js';
import { AuthUser } from '../services/api.js';

interface ApexLifeMasterViewProps {
  currentTheme?: ColorTheme;
  currentEnv?: EnvironmentTheme;
  currentUser?: AuthUser | null;
  onNavigateView?: (view: string) => void;
}

export const ApexLifeMasterView: React.FC<ApexLifeMasterViewProps> = ({
  currentTheme = getSavedTheme(),
  currentEnv = getSavedEnvTheme(),
  currentUser,
}) => {
  // 1. Selector de Rol Maestro (3 tipos de usuarios)
  const [activeRole, setActiveRole] = useState<'ADMIN' | 'COACH' | 'CLIENT'>('CLIENT');

  // Sub-tabs por rol
  const [adminTab, setAdminTab] = useState<'machines' | 'store' | 'branches' | 'members'>('machines');
  const [coachTab, setCoachTab] = useState<'diagnostic' | 'plan_builder' | 'clients'>('diagnostic');
  const [clientTab, setClientTab] = useState<'hub' | 'scanner' | 'nutrition' | 'diary' | 'coach_ai' | 'onboarding'>('hub');

  // -------------------------------------------------------------
  // ESTADOS MÓDULO 1: ADMINISTRADOR - MÁQUINAS & EQUIPOS
  // -------------------------------------------------------------
  const [machineCategory, setMachineCategory] = useState<string>('Todos');
  const [machines, setMachines] = useState([
    {
      id: 'm-1',
      name: 'Press de Pecho Hammer Strength',
      category: 'Pecho',
      brand: 'Hammer Strength',
      model: 'Plate-Loaded ISO-Lateral',
      status: 'Disponible' as const,
      mainMuscle: 'Pectoral Mayor',
      secondaryMuscles: ['Tríceps Braquial', 'Deltoides Anterior'],
      compatibleExercises: ['Press Horizontal Unilateral', 'Press Inclinado Biomecánico'],
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop',
    },
    {
      id: 'm-2',
      name: 'Polea Alta Lat Pulldown',
      category: 'Espalda',
      brand: 'Life Fitness',
      model: 'Signature Series Cable',
      status: 'Disponible' as const,
      mainMuscle: 'Dorsal Ancho',
      secondaryMuscles: ['Bíceps Braquial', 'Redondo Mayor', 'Romboide'],
      compatibleExercises: ['Jalón al Pecho Agarre Neutro', 'Jalón Unilateral', 'Pullover en Polea'],
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop',
    },
    {
      id: 'm-3',
      name: 'Prensa Inclinada 45° Leg Press',
      category: 'Piernas',
      brand: 'Cybex',
      model: 'Titanium Linear Roller',
      status: 'Disponible' as const,
      mainMuscle: 'Cuádriceps',
      secondaryMuscles: ['Glúteo Mayor', 'Isquiotibiales', 'Gemelos'],
      compatibleExercises: ['Prensa Profunda de Cuádriceps', 'Elevación de Gemelos en Prensa'],
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop',
    },
    {
      id: 'm-4',
      name: 'Máquina Hack Squat Pro',
      category: 'Piernas',
      brand: 'Hammer Strength',
      model: 'V-Squat Converging',
      status: 'Mantenimiento' as const,
      mainMuscle: 'Vasto Medial y Lateral',
      secondaryMuscles: ['Glúteo', 'Core Abdominal'],
      compatibleExercises: ['Hack Squat Pesado', 'Sentadilla Inversa Hack'],
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500&auto=format&fit=crop',
    },
    {
      id: 'm-5',
      name: 'Caminadora Curva Sin Motor',
      category: 'Cardio',
      brand: 'Assault Fitness',
      model: 'AirRunner Elite HIIT',
      status: 'Disponible' as const,
      mainMuscle: 'Sistema Cardiovascular',
      secondaryMuscles: ['Cadena Posterior', 'Pantorrillas'],
      compatibleExercises: ['Sprints Tabata HIIT', 'Caminata con Inclinación Metabólica'],
      image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&auto=format&fit=crop',
    }
  ]);

  // Tienda del Gimnasio (Suplementos y Nutrición)
  const [storeProducts] = useState([
    {
      id: 'p-1',
      name: 'Whey Isolate Hydro 100%',
      category: 'Proteína',
      price: '$58.00',
      stock: 34,
      desc: 'Proteína aislada de máxima biodisponibilidad y cero carbohidratos.',
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&auto=format&fit=crop'
    },
    {
      id: 'p-2',
      name: 'Creatina Creapure Monohidrato',
      category: 'Creatina',
      price: '$34.00',
      stock: 52,
      desc: '100% micronizada para fuerza máxima, potencia y sobrecarga muscular.',
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&auto=format&fit=crop'
    },
    {
      id: 'p-3',
      name: 'Pre-Workout N.O. Explosion',
      category: 'Pre-entrenos',
      price: '$42.00',
      stock: 18,
      desc: 'Citrulina malato 8g, beta-alanina y cafeína anhidra para bombeo extremo.',
      image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400&auto=format&fit=crop'
    },
    {
      id: 'p-4',
      name: 'Iaso Tea Original TLC Détox',
      category: 'Quemadores & Détox',
      price: '$49.95',
      stock: 75,
      desc: 'Fórmula herbal de desintoxicación digestiva y quema metabólica acelerada.',
      image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=400&auto=format&fit=crop'
    }
  ]);

  // -------------------------------------------------------------
  // ESTADOS MÓDULO 2: ENTRENADOR PERSONAL & DIAGNÓSTICO IA
  // -------------------------------------------------------------
  const [selectedStudent, setSelectedStudent] = useState({
    name: 'Juan Camilo Pérez',
    age: 28,
    weight: '82.4 kg',
    height: '1.78 m',
    imc: '26.0 (Sobrepeso leve)',
    fatPercent: '23.4%',
    muscleMass: '35.8 kg',
    goal: 'Pérdida de grasa & Definición muscular',
    injuries: 'Molestia en manguito rotador derecho (hombro) y lumbalgia postural leve.',
    sleep: '6.5 horas promedio',
    nutritionHabits: 'Consumo alto de carbohidratos refinados, hidratación 1.8L.',
    aiDiagnosis: 'El usuario presenta adiposidad focalizada en zona abdominal y dorsal baja, leve asimetría en deltoides anterior derecho con rotación interna de hombros. Capacidad aeróbica moderada.',
    aiRecommendations: [
      'Entrenamiento de sobrecarga progresiva con descanso de 75-90 segundos.',
      'Priorizar tracciones verticales y remo neutro para compensar postura de hombros.',
      'Bloquear press trasnuca y press militar con barra libre por riesgo en manguito rotador.',
      'Cardio HIIT en zona 2 (130-140 bpm) 20 minutos pos-entreno.'
    ],
    prohibitedExercises: ['Press Militar Trasnuca', 'Fondos en Paralelas Profundos', 'Sentadilla Good-Morning Pesada']
  });

  // Constructor de Plan Personalizado (Gym & Casa)
  const [activePlanType, setActivePlanType] = useState<'GYM' | 'HOME'>('GYM');

  // -------------------------------------------------------------
  // ESTADOS MÓDULO 3: CLIENTE / SOCIO DEL GYM
  // -------------------------------------------------------------
  // Scanner IA y Evaluación Corporal
  const [scanHistory] = useState([
    { date: '15 Ago 2026', weight: '85.2 kg', fat: '26.8%', muscle: '34.2 kg', status: 'Inicial' },
    { date: '01 Sep 2026', weight: '83.0 kg', fat: '24.5%', muscle: '35.0 kg', status: 'Progreso' },
    { date: '26 Sep 2026', weight: '80.4 kg', fat: '21.8%', muscle: '35.9 kg', status: 'Actual (Óptimo)' },
  ]);

  // Nutrición Inteligente & Selección de Alimentos Favoritos
  const [selectedProteins, setSelectedProteins] = useState<string[]>(['Pollo Grillado', 'Huevos Enteros', 'Atún Fresco']);
  const [selectedCarbs, setSelectedCarbs] = useState<string[]>(['Arroz Integral', 'Avena en Hojuelas', 'Batata / Camote']);
  const [selectedFruits, setSelectedFruits] = useState<string[]>(['Manzana Verde', 'Plátano / Banana', 'Frutos Rojos']);

  const toggleSelect = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Diario Fitness interactivo
  const [diaryWater, setDiaryWater] = useState(2500);
  const [diaryMood, setDiaryMood] = useState('Energético');
  const [diarySleep, setDiarySleep] = useState('7.5 Horas');
  const [diaryWorkoutDone, setDiaryWorkoutDone] = useState(true);

  // Chat Asistente AI Wellness Coach
  const [coachChat, setCoachChat] = useState([
    {
      sender: 'ai',
      text: '¡Hola, atleta! Soy tu **AI Wellness Coach**. Analicé tu último escaneo corporal (80.4 kg, 21.8% grasa) y tu objetivo de definición. Hoy tienes programado Pecho & Tríceps con énfasis en control biomecánico. ¿Tienes alguna pregunta sobre tu sesión o tus macros?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendCoachChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setCoachChat(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let aiResponse = `Entendido perfectamente. Para tu objetivo de **pérdida de grasa conservando masa magra**, mantén las series entre 10 y 12 reps al fallo -1 (RPE 8). Recuerda hidratarte con 500 ml antes de comenzar. ¡A darle con todo! ⚡`;
      if (userText.toLowerCase().includes('dolor') || userText.toLowerCase().includes('hombro')) {
        aiResponse = `⚠️ **Atención:** Detecté que mencionaste dolor. Conforme a tu historial de hombro derecho, sustituye de inmediato el press con barra libre por **Press en Máquina Hammer Convergente** con agarre neutro para proteger el manguito rotador.`;
      }
      setCoachChat(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 500);
  };

  const accentColor = '#10b981'; // Verde Energético SaaS
  const accentGlow = 'rgba(16, 185, 129, 0.4)';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070a12',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxSizing: 'border-box',
      paddingBottom: '5rem',
    }}>
      
      {/* ============================================================= */}
      {/* 1. BARRA SUPERIOR MAESTRA: CONMUTADOR DE 3 USUARIOS           */}
      {/* ============================================================= */}
      <header style={{
        background: 'rgba(10, 15, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0.75rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              fontWeight: 900,
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.5)',
            }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
                APEX <span style={{ color: accentColor }}>LIFE</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '0.08em', fontWeight: 700 }}>
                INTELLIGENT WELLNESS ECOSYSTEM
              </div>
            </div>
          </div>

          {/* SELECTOR DE 3 ROLES PRINCIPALES */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '0.35rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}>
            <button
              onClick={() => setActiveRole('ADMIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '12px',
                border: 'none',
                background: activeRole === 'ADMIN' ? accentColor : 'transparent',
                color: activeRole === 'ADMIN' ? '#000000' : '#94a3b8',
                fontWeight: 900,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <Building2 size={16} />
              <span>1. Admin del Gym</span>
            </button>

            <button
              onClick={() => setActiveRole('COACH')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '12px',
                border: 'none',
                background: activeRole === 'COACH' ? accentColor : 'transparent',
                color: activeRole === 'COACH' ? '#000000' : '#94a3b8',
                fontWeight: 900,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <Dumbbell size={16} />
              <span>2. Entrenador Personal</span>
            </button>

            <button
              onClick={() => setActiveRole('CLIENT')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '12px',
                border: 'none',
                background: activeRole === 'CLIENT' ? accentColor : 'transparent',
                color: activeRole === 'CLIENT' ? '#000000' : '#94a3b8',
                fontWeight: 900,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: activeRole === 'CLIENT' ? `0 0 16px ${accentGlow}` : 'none',
              }}
            >
              <User size={16} />
              <span>3. Cliente del Gym</span>
            </button>
          </div>

          {/* Estatus & Servidor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: accentColor,
              border: `1px solid ${accentColor}`,
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
              IA ONLINE • CLOUD CONTABO
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={{ maxWidth: '1440px', margin: '1.5rem auto 0', padding: '0 1.5rem' }}>

        {/* ========================================================================= */}
        {/* ROL 1: ADMINISTRADOR DEL GIMNASIO (INVENTARIO, TIENDA, SEDES)             */}
        {/* ========================================================================= */}
        {activeRole === 'ADMIN' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.2s ease' }}>
            
            {/* Header del Admin */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #090d16 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '1.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: accentColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Panel Administrativo Maestro
                </span>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.25rem 0 0.2rem' }}>
                  Gestión Integral de Sede, Equipos & Comercial
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                  Control de inventario biomecánico de máquinas, stock de suplementos de la tienda y sucursales.
                </p>
              </div>

              {/* Sub-navegación Admin */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setAdminTab('machines')}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '12px',
                    border: adminTab === 'machines' ? `1px solid ${accentColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                    background: adminTab === 'machines' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: adminTab === 'machines' ? accentColor : '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  🦾 Inventario de Máquinas
                </button>
                <button
                  onClick={() => setAdminTab('store')}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '12px',
                    border: adminTab === 'store' ? `1px solid ${accentColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                    background: adminTab === 'store' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: adminTab === 'store' ? accentColor : '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  🛍️ Tienda de Suplementos
                </button>
                <button
                  onClick={() => setAdminTab('branches')}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '12px',
                    border: adminTab === 'branches' ? `1px solid ${accentColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                    background: adminTab === 'branches' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: adminTab === 'branches' ? accentColor : '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  🏢 Sucursales & Membresías
                </button>
              </div>
            </div>

            {/* TAB 1: INVENTARIO DE MÁQUINAS Y EQUIPOS */}
            {adminTab === 'machines' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Filtro por Categorías */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Cardio', 'Funcional'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setMachineCategory(cat)}
                        style={{
                          padding: '0.35rem 0.85rem',
                          borderRadius: '999px',
                          border: machineCategory === cat ? `1.5px solid ${accentColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                          background: machineCategory === cat ? accentColor : 'rgba(255, 255, 255, 0.04)',
                          color: machineCategory === cat ? '#000000' : '#cbd5e1',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <button style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '12px',
                    background: accentColor,
                    color: '#000000',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}>
                    <Plus size={16} /> Registrar Nueva Máquina
                  </button>
                </div>

                {/* Grid de Máquinas */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '1.25rem',
                }}>
                  {machines
                    .filter(m => machineCategory === 'Todos' || m.category === machineCategory)
                    .map((m) => (
                      <div
                        key={m.id}
                        style={{
                          background: '#0d1322',
                          borderRadius: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                        }}
                      >
                        <div style={{ position: 'relative', height: '170px' }}>
                          <img 
                            src={m.image} 
                            alt={m.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            background: m.status === 'Disponible' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                            color: '#000000',
                          }}>
                            {m.status}
                          </div>
                          <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '8px',
                            fontSize: '0.68rem',
                            fontWeight: 900,
                            background: 'rgba(0,0,0,0.7)',
                            color: '#ffffff',
                            backdropFilter: 'blur(8px)',
                          }}>
                            {m.brand} • {m.category}
                          </div>
                        </div>

                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'space-between' }}>
                          <div>
                            <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.15rem', fontWeight: 900 }}>
                              {m.name}
                            </h3>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                              Modelo: {m.model}
                            </div>
                          </div>

                          {/* Biomecánica: Músculos Trabajados */}
                          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, marginBottom: '0.25rem' }}>
                              BIOMECÁNICA:
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: accentColor }}>
                              Primario: {m.mainMuscle}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                              Secundarios: {m.secondaryMuscles.join(', ')}
                            </div>
                          </div>

                          {/* Ejercicios Compatibles */}
                          <div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                              Ejercicios Compatibles:
                            </div>
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                              {m.compatibleExercises.map((ex, i) => (
                                <span key={i} style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                                  {ex}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button style={{
                            width: '100%',
                            padding: '0.55rem',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}>
                            Editar Ficha Biomecánica & Video
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 2: TIENDA COMERCIAL & SUPLEMENTOS */}
            {adminTab === 'store' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>
                    Catálogo de Suplementos & Nutrición
                  </h2>
                  <button style={{
                    padding: '0.55rem 1.15rem',
                    borderRadius: '12px',
                    background: accentColor,
                    color: '#000000',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}>
                    + Agregar Producto
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {storeProducts.map((p) => (
                    <div key={p.id} style={{ background: '#0d1322', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.68rem', color: accentColor, fontWeight: 800 }}>{p.category}</span>
                          <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>Stock: {p.stock}</span>
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900 }}>{p.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{p.desc}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>{p.price}</span>
                          <button style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: accentColor, color: '#000000', fontWeight: 800, fontSize: '0.75rem', border: 'none' }}>
                            Gestionar Stock
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SUCURSALES & MEMBRESÍAS */}
            {adminTab === 'branches' && (
              <div style={{ background: '#0d1322', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 1rem' }}>Sedes & Control de Accesos</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.72rem', color: accentColor, fontWeight: 800 }}>SEDE PRINCIPAL</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0.2rem 0' }}>Power Gym Club Central</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Horario: Lun - Sáb: 5:00 AM - 10:00 PM | Dom: 7:00 AM - 4:00 PM</div>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#ffffff' }}>Aforo actual: <strong>38 personas (38%)</strong></div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>SEDE NORTE</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0.2rem 0' }}>Apex Life Wellness Club</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Horario: 24 Horas con Llave Magnética & QR</div>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#ffffff' }}>Aforo actual: <strong>19 personas (22%)</strong></div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* ROL 2: ENTRENADOR PERSONAL & DIAGNÓSTICO GENERADO POR IA                  */}
        {/* ========================================================================= */}
        {activeRole === 'COACH' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.2s ease' }}>
            
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #090d16 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '1.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Panel Profesional de Coaching 1 a 1
                </span>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.25rem 0 0.2rem' }}>
                  Diagnóstico IA & Prescripción Biomecánica
                </h1>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                  Informe técnico automático para entrenadores y planificador adaptativo (Gimnasio y Casa).
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  onClick={() => setCoachTab('diagnostic')}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '12px',
                    border: coachTab === 'diagnostic' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                    background: coachTab === 'diagnostic' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: coachTab === 'diagnostic' ? '#f59e0b' : '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  🧠 Diagnóstico Generado por IA
                </button>
                <button
                  onClick={() => setCoachTab('plan_builder')}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '12px',
                    border: coachTab === 'plan_builder' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                    background: coachTab === 'plan_builder' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: coachTab === 'plan_builder' ? '#f59e0b' : '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  📝 Creador de Planes (Gym & Casa)
                </button>
              </div>
            </div>

            {/* EXPEDIENTE TÉCNICO Y DIAGNÓSTICO IA */}
            {coachTab === 'diagnostic' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                
                {/* Columna Izquierda: Datos Físicos & Lesiones del Alumno */}
                <div style={{ background: '#0d1322', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#1e293b', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={22} color="#f59e0b" />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>{selectedStudent.name}</h3>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Alumno Activo • {selectedStudent.age} años</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 900 }}>
                      VIP PRO
                    </span>
                  </div>

                  {/* Grid de Métricas del Alumno */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>PESO</div>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>{selectedStudent.weight}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>% GRASA</div>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: '#f59e0b' }}>{selectedStudent.fatPercent}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.6rem', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>MASA MAGRA</div>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: accentColor }}>{selectedStudent.muscleMass}</div>
                    </div>
                  </div>

                  {/* Lesiones & Hábitos */}
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '0.85rem', borderRadius: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                      <AlertTriangle size={14} /> LESIONES Y LIMITACIONES FÍSICAS:
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#fca5a5', lineHeight: 1.35 }}>
                      {selectedStudent.injuries}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: '14px', fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div><strong>Objetivo del Alumno:</strong> {selectedStudent.goal}</div>
                    <div><strong>Patrón de Sueño:</strong> {selectedStudent.sleep}</div>
                    <div><strong>Hábitos de Nutrición:</strong> {selectedStudent.nutritionHabits}</div>
                  </div>
                </div>

                {/* Columna Derecha: Informe Generado por la IA */}
                <div style={{ background: '#0d1322', borderRadius: '24px', padding: '1.5rem', border: '1.5px solid #f59e0b', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 8px 30px rgba(245, 158, 11, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f59e0b', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Cpu size={18} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Informe Técnico para el Entrenador</h3>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Generado por IA Multimodal (Visión & Métricas)</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '14px', fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.45, borderLeft: '3px solid #f59e0b' }}>
                    "{selectedStudent.aiDiagnosis}"
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Recomendaciones de Prescripción:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {selectedStudent.aiRecommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Ejercicios Prohibidos */}
                  <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                      🚫 Ejercicios Prohibidos para este Alumno:
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {selectedStudent.prohibitedExercises.map((p, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', background: '#ef4444', color: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setCoachTab('plan_builder')}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      background: '#f59e0b',
                      color: '#000000',
                      border: 'none',
                      fontWeight: 900,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span>Crear Plan de Entrenamiento con estas pautas</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB: CREADOR DE PLANES PERSONALIZADOS (GYM & CASA) */}
            {coachTab === 'plan_builder' && (
              <div style={{ background: '#0d1322', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.3rem', fontWeight: 900 }}>
                      Prescripción de Entrenamiento Personalizado
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Plan adaptado automáticamente para: <strong>{selectedStudent.name}</strong>
                    </div>
                  </div>

                  {/* Selector Gym vs Casa */}
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.25rem', borderRadius: '12px', display: 'flex', gap: '0.3rem' }}>
                    <button
                      onClick={() => setActivePlanType('GYM')}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: activePlanType === 'GYM' ? accentColor : 'transparent',
                        color: activePlanType === 'GYM' ? '#000000' : '#cbd5e1',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      🏋️ Plan Gimnasio (Máquinas)
                    </button>
                    <button
                      onClick={() => setActivePlanType('HOME')}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: activePlanType === 'HOME' ? accentColor : 'transparent',
                        color: activePlanType === 'HOME' ? '#000000' : '#cbd5e1',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      🏠 Plan Casa (Sin Equipamiento)
                    </button>
                  </div>
                </div>

                {activePlanType === 'GYM' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: accentColor }}>
                      DÍA 1: PECHO + TRÍCEPS (HIPERTROFIA & SALUD ARTICULAR)
                    </div>
                    {[
                      { exercise: 'Press en Banco Hammer Strength', machine: 'Press de Pecho Hammer (#m-1)', sets: '4 Series', reps: '10-12 Reps', rest: '90 Seg', technique: 'Agarre neutro para evitar pinzamiento del hombro derecho.' },
                      { exercise: 'Aperturas en Polea con Cruce', machine: 'Polea Doble Dual (#m-2)', sets: '3 Series', reps: '12-15 Reps', rest: '60 Seg', technique: 'Codos ligeramente flexionados, pico de contracción de 1 seg.' },
                      { exercise: 'Extensión de Tríceps en Cuerda', machine: 'Polea Alta Tríceps', sets: '4 Series', reps: '12 Reps', rest: '60 Seg', technique: 'Mantener brazos fijos al torso, abrir cuerda al final.' }
                    ].map((row, idx) => (
                      <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: '0.95rem' }}>{row.exercise}</div>
                          <div style={{ fontSize: '0.72rem', color: accentColor }}>Máquina: {row.machine}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>Técnica: {row.technique}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.08)', padding: '0.25rem 0.6rem', borderRadius: '8px' }}>{row.sets}</span>
                          <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.08)', padding: '0.25rem 0.6rem', borderRadius: '8px' }}>{row.reps}</span>
                          <span style={{ fontSize: '0.78rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '0.25rem 0.6rem', borderRadius: '8px' }}>Descanso: {row.rest}</span>
                          <button style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#ffffff', fontSize: '0.72rem', cursor: 'pointer' }}>
                            Ajustar Carga
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>
                      RUTINA CASA ADAPTATIVA: ESPACIO REDUCIDO • BANDAS ELÁSTICAS & PESO CORPORAL
                    </div>
                    {[
                      { exercise: 'Flexiones con Elevación Controlada', equipment: 'Peso Corporal (Suelo)', sets: '4 Series', reps: 'Al fallo -2', rest: '60 Seg', tip: 'Apoyo sobre rodillas si aparece molestia articular.' },
                      { exercise: 'Remo Unilateral con Banda Elástica', equipment: 'Banda Elástica Media', sets: '4 Series', reps: '15 Reps por brazo', rest: '45 Seg', tip: 'Enfocar la retracción escapular sin compensar con cuello.' },
                      { exercise: 'Sentadilla Búlgara en Silla/Sofá', equipment: 'Silla del hogar', sets: '3 Series', reps: '10 Reps por pierna', rest: '60 Seg', tip: 'Tronco erguido, controlando la bajada en 3 segundos.' },
                      { exercise: 'Plancha Abdominal Isometrica', equipment: 'Tapete / Suelo', sets: '3 Series', reps: '40 Segundos', rest: '45 Seg', tip: 'Glúteo apretado y ombligo hacia la columna vertebral.' }
                    ].map((row, idx) => (
                      <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: '0.95rem' }}>{row.exercise}</div>
                          <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>Material: {row.equipment}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>Tip: {row.tip}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.08)', padding: '0.25rem 0.6rem', borderRadius: '8px' }}>{row.sets}</span>
                          <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.08)', padding: '0.25rem 0.6rem', borderRadius: '8px' }}>{row.reps}</span>
                          <span style={{ fontSize: '0.78rem', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '0.25rem 0.6rem', borderRadius: '8px' }}>{row.rest}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button style={{ padding: '0.65rem 1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
                    Modificar con IA
                  </button>
                  <button style={{ padding: '0.65rem 1.5rem', borderRadius: '12px', background: accentColor, color: '#000000', border: 'none', fontWeight: 900, fontSize: '0.82rem', cursor: 'pointer' }}>
                    Guardar & Enviar a la App del Alumno
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* ROL 3: CLIENTE / SOCIO DEL GYM (APLICACIÓN PERSONAL & BODY SCANNER AI)     */}
        {/* ========================================================================= */}
        {activeRole === 'CLIENT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.2s ease' }}>
            
            {/* Sub-barra táctil del Cliente */}
            <div style={{
              background: '#0d1322',
              borderRadius: '20px',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              overflowX: 'auto',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              {[
                { id: 'hub', label: '📱 Mi Carnet & Rutina', icon: QrCode },
                { id: 'scanner', label: '📸 Body Scanner AI', icon: Camera },
                { id: 'nutrition', label: '🥗 Nutrición Inteligente', icon: UtensilsCrossed },
                { id: 'diary', label: '📖 Diario Fitness', icon: Activity },
                { id: 'coach_ai', label: '🤖 AI Wellness Coach', icon: Bot },
                { id: 'onboarding', label: '📋 Cuestionario de Salud', icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isCurrent = clientTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setClientTab(tab.id as any)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.55rem 1rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: isCurrent ? accentColor : 'transparent',
                      color: isCurrent ? '#000000' : '#94a3b8',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                      boxShadow: isCurrent ? `0 2px 12px ${accentGlow}` : 'none',
                    }}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB: MI HUB (CARNET DE ACCESO & ENTRENAMIENTO) */}
            {clientTab === 'hub' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                
                {/* CARNET DIGITAL QR PARA TORNIQUETE */}
                <div style={{
                  background: 'linear-gradient(135deg, #0e1626 0%, #070a12 100%)',
                  borderRadius: '26px',
                  border: `2px solid ${accentColor}`,
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.25rem',
                  boxShadow: `0 14px 45px ${accentGlow}`,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: accentColor }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>APEX <span style={{ color: accentColor }}>PASS</span></div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 900, background: accentColor, color: '#000000', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                      BLACK VIP SOCIO
                    </span>
                  </div>

                  {/* QR Box */}
                  <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                    <QrCode size={160} color="#070a12" />
                  </div>

                  <div>
                    <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.3rem', fontWeight: 900 }}>Juan Camilo Pérez</h3>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>ID: #1098765432 • Sede Central</div>
                    <div style={{ fontSize: '0.72rem', color: accentColor, fontWeight: 800, marginTop: '0.25rem' }}>ACCESO TORNICQUETE: AUTORIZADO ✅</div>
                  </div>

                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', padding: '0.65rem', borderRadius: '12px', fontSize: '0.72rem', color: '#cbd5e1' }}>
                    Vigencia: <strong>15 Octubre 2026</strong> • Plan Personalizado con IA
                  </div>
                </div>

                {/* SESIÓN DEL DÍA & ATRIBUTOS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: '#0d1322', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 900, color: accentColor }}>RUTINA ASIGNADA DE HOY</span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>45 Minutos</span>
                    </div>

                    <div>
                      <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.3rem', fontWeight: 900 }}>Pecho & Hombros Biomecánico</h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                        Adaptado por tu entrenador y AI Wellness Coach. 3 máquinas seleccionadas sin estrés en manguito rotador.
                      </p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '14px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>1. Press Hammer Strength</span>
                        <strong style={{ color: accentColor }}>4 x 10 (45 kg)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>2. Aperturas en Polea Alta</span>
                        <strong style={{ color: accentColor }}>3 x 12 (15 kg)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>3. Elevación Lateral Controlada</span>
                        <strong style={{ color: accentColor }}>3 x 15 (7 kg)</strong>
                      </div>
                    </div>

                    <button style={{
                      padding: '0.85rem',
                      borderRadius: '14px',
                      background: accentColor,
                      color: '#000000',
                      border: 'none',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: `0 4px 18px ${accentGlow}`,
                    }}>
                      <Play size={18} /> INICIAR SESIÓN CON TEMPORIZADOR
                    </button>
                  </div>

                  {/* Resumen Diario Rápido */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: '#0d1322', borderRadius: '18px', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#38bdf8' }}>AGUA DEL DÍA</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '0.2rem 0' }}>2,500 / 3,000 ml</div>
                      <button onClick={() => setDiaryWater(p => p + 250)} style={{ width: '100%', padding: '0.35rem', borderRadius: '8px', background: 'rgba(56,189,248,0.15)', border: '1px solid #38bdf8', color: '#38bdf8', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer' }}>
                        + Vaso 250ml
                      </button>
                    </div>

                    <div style={{ background: '#0d1322', borderRadius: '18px', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>CALORÍAS</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '0.2rem 0' }}>1,850 / 2,400</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Déficit óptimo para definición</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BODY SCANNER AI (ESCANEO CORPORAL & FOTOS) */}
            {clientTab === 'scanner' && (
              <div style={{ background: '#0d1322', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#06b6d4', letterSpacing: '0.06em' }}>
                      VISIÓN ARTIFICIAL & BIOMETRÍA 3D
                    </span>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0.2rem 0 0' }}>
                      Body Scanner AI: Análisis de Postura & Composición
                    </h2>
                  </div>

                  <button style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '12px',
                    background: '#06b6d4',
                    color: '#000000',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}>
                    <Camera size={16} /> Capturar 3 Fotografías
                  </button>
                </div>

                {/* 3 Ángulos de Captura Fotográfica */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    { label: 'Fotografía Frontal', desc: 'Simetría de hombros, cintura pélvica y pectoral.', status: 'Capturada ✅' },
                    { label: 'Fotografía Lateral', desc: 'Curvatura lumbar, lordosis y postura cervical.', status: 'Capturada ✅' },
                    { label: 'Fotografía Posterior', desc: 'Desarrollo dorsal, escápulas y glúteos.', status: 'Capturada ✅' },
                  ].map((angle, idx) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '18px', padding: '1.25rem', border: '1px dashed rgba(6,182,212,0.4)', textAlign: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(6,182,212,0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                        <Camera size={24} />
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '0.95rem' }}>{angle.label}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0.35rem 0' }}>{angle.desc}</div>
                      <span style={{ fontSize: '0.68rem', color: '#06b6d4', fontWeight: 800 }}>{angle.status}</span>
                    </div>
                  ))}
                </div>

                {/* Historial Evolutivo Gráfico */}
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '0 0 0.75rem' }}>
                    Historial Evolutivo con IA
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8' }}>
                          <th style={{ padding: '0.75rem' }}>Fecha de Escaneo</th>
                          <th style={{ padding: '0.75rem' }}>Peso Corporal</th>
                          <th style={{ padding: '0.75rem' }}>% Grasa Corporal</th>
                          <th style={{ padding: '0.75rem' }}>Masa Muscular</th>
                          <th style={{ padding: '0.75rem' }}>Diagnóstico IA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scanHistory.map((s, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <td style={{ padding: '0.75rem', fontWeight: 800 }}>{s.date}</td>
                            <td style={{ padding: '0.75rem' }}>{s.weight}</td>
                            <td style={{ padding: '0.75rem', color: '#f59e0b', fontWeight: 800 }}>{s.fat}</td>
                            <td style={{ padding: '0.75rem', color: accentColor, fontWeight: 800 }}>{s.muscle}</td>
                            <td style={{ padding: '0.75rem' }}>
                              <span style={{ background: 'rgba(16,185,129,0.15)', color: accentColor, padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Predicción de la IA */}
                <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <TrendingUp size={28} color="#06b6d4" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#06b6d4' }}>
                      INTELIGENCIA ARTIFICIAL PREDICTIVA:
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                      "En los últimos 42 días redujiste un <strong>5% de grasa corporal</strong> y ganaste <strong>1.7 kg de masa muscular</strong>. Si mantienes esta tasa, alcanzarás tu objetivo de 18% BF en 24 días."
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: NUTRICIÓN INTELIGENTE & GENERADOR DE RECETAS */}
            {clientTab === 'nutrition' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                
                {/* Selector de Alimentos Favoritos */}
                <div style={{ background: '#0d1322', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: accentColor }}>PREFERENCIAS DEL USUARIO</span>
                    <h3 style={{ margin: '0.2rem 0', fontSize: '1.25rem', fontWeight: 900 }}>Selecciona tus Alimentos Favoritos</h3>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>La IA construirá tus recetas en base a lo que disfrutas comer.</div>
                  </div>

                  {/* Proteínas */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.4rem' }}>🥩 Proteínas:</div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['Pollo Grillado', 'Carne de Res Magra', 'Pescado Blanco', 'Huevos Enteros', 'Atún Fresco', 'Tofu'].map((p) => {
                        const isSel = selectedProteins.includes(p);
                        return (
                          <button
                            key={p}
                            onClick={() => toggleSelect(p, selectedProteins, setSelectedProteins)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '8px',
                              border: isSel ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)',
                              background: isSel ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.3)',
                              color: isSel ? accentColor : '#cbd5e1',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {isSel ? '☑ ' : '☐ '} {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Carbohidratos */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.4rem' }}>🍚 Carbohidratos:</div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['Arroz Integral', 'Papa Cocida', 'Avena en Hojuelas', 'Batata / Camote', 'Pasta Integral', 'Quinoa'].map((c) => {
                        const isSel = selectedCarbs.includes(c);
                        return (
                          <button
                            key={c}
                            onClick={() => toggleSelect(c, selectedCarbs, setSelectedCarbs)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '8px',
                              border: isSel ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)',
                              background: isSel ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.3)',
                              color: isSel ? accentColor : '#cbd5e1',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {isSel ? '☑ ' : '☐ '} {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Frutas */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ec4899', marginBottom: '0.4rem' }}>🍎 Frutas:</div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['Manzana Verde', 'Plátano / Banana', 'Frutos Rojos', 'Kiwi', 'Papaya'].map((f) => {
                        const isSel = selectedFruits.includes(f);
                        return (
                          <button
                            key={f}
                            onClick={() => toggleSelect(f, selectedFruits, setSelectedFruits)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '8px',
                              border: isSel ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)',
                              background: isSel ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.3)',
                              color: isSel ? accentColor : '#cbd5e1',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {isSel ? '☑ ' : '☐ '} {f}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recetas Inteligentes Generadas */}
                <div style={{ background: '#0d1322', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: accentColor }}>GENERADOR INTELIGENTE</span>
                    <h3 style={{ margin: '0.2rem 0', fontSize: '1.25rem', fontWeight: 900 }}>Menú del Día Personalizado</h3>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total: 1,850 kcal • 140g Proteína • 180g Carbos • 45g Grasas</div>
                  </div>

                  {[
                    { meal: 'Desayuno Energético', title: 'Omelette de 3 Huevos con Avena y Frutos Rojos', cal: '420 kcal', p: '32g', c: '45g', f: '12g' },
                    { meal: 'Almuerzo Principal', title: 'Pechuga Grillada con Arroz Integral y Vegetales', cal: '550 kcal', p: '45g', c: '60g', f: '10g' },
                    { meal: 'Merienda / Snack', title: 'Batido de Proteína con Banana y Crema de Cacahuete', cal: '320 kcal', p: '28g', c: '35g', f: '8g' },
                    { meal: 'Cena Liviana TLC', title: 'Filete de Pescado Blanco con Ensalada & Té Iaso', cal: '360 kcal', p: '35g', c: '20g', f: '7g' },
                  ].map((r, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: accentColor }}>{r.meal}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ffffff' }}>{r.cal}</span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ffffff' }}>{r.title}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                        P: <strong style={{ color: '#ffffff' }}>{r.p}</strong> | C: <strong style={{ color: '#ffffff' }}>{r.c}</strong> | G: <strong style={{ color: '#ffffff' }}>{r.f}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: DIARIO FITNESS (SEGUIMIENTO DIARIO) */}
            {clientTab === 'diary' && (
              <div style={{ background: '#0d1322', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: accentColor }}>DIARIO FITNESS</span>
                  <h3 style={{ margin: '0.2rem 0', fontSize: '1.4rem', fontWeight: 900 }}>Registro del Día</h3>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Lleva tu control diario de hábitos para que la IA refine tus progresiones.</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>ESTADO EMOCIONAL:</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {['Energético', 'Normal', 'Cansado'].map(mood => (
                        <button
                          key={mood}
                          onClick={() => setDiaryMood(mood)}
                          style={{
                            flex: 1,
                            padding: '0.45rem',
                            borderRadius: '8px',
                            border: diaryMood === mood ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)',
                            background: diaryMood === mood ? 'rgba(16,185,129,0.2)' : 'transparent',
                            color: diaryMood === mood ? accentColor : '#cbd5e1',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>HORAS DE SUEÑO:</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '0.3rem 0' }}>{diarySleep}</div>
                    <div style={{ fontSize: '0.7rem', color: accentColor }}>Calidad reparadora óptima</div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>CONSUMO DE AGUA:</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#06b6d4', margin: '0.3rem 0' }}>{diaryWater} ml</div>
                    <button onClick={() => setDiaryWater(p => p + 250)} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#06b6d4', color: '#000000', fontWeight: 900, fontSize: '0.7rem', border: 'none' }}>
                      + Registrar 250ml
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AI WELLNESS COACH (CHAT COGNITIVO) */}
            {clientTab === 'coach_ai' && (
              <div style={{ background: '#0d1322', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '480px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: accentColor, color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>AI Wellness Coach</h3>
                    <div style={{ fontSize: '0.7rem', color: accentColor, fontWeight: 700 }}>Conectado a tu expediente antropométrico y médico</div>
                  </div>
                </div>

                {/* Mensajes del chat */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                  {coachChat.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        padding: '0.85rem 1.15rem',
                        borderRadius: '16px',
                        background: msg.sender === 'user' ? accentColor : 'rgba(255,255,255,0.06)',
                        color: msg.sender === 'user' ? '#000000' : '#ffffff',
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        fontWeight: msg.sender === 'user' ? 800 : 500,
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                {/* Input del Chat */}
                <form onSubmit={handleSendCoachChat} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Pregúntale a tu entrenador IA sobre tu rutina, dolor o calorías..."
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '14px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '14px',
                      background: accentColor,
                      color: '#000000',
                      border: 'none',
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    Enviar
                  </button>
                </form>
              </div>
            )}

            {/* TAB: CUESTIONARIO INTELIGENTE DE SALUD (ONBOARDING) */}
            {clientTab === 'onboarding' && (
              <div style={{ background: '#0d1322', borderRadius: '24px', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#f59e0b' }}>EVALUACIÓN MÉDICA & FÍSICA INICIAL</span>
                  <h3 style={{ margin: '0.2rem 0', fontSize: '1.4rem', fontWeight: 900 }}>Cuestionario Inteligente de Salud</h3>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Datos obligatorios para que la IA y el entrenador protejan tu salud biomecánica.</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      ¿Tiene alguna lesión actualmente?
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['Rodilla', 'Espalda', 'Hombro', 'Cuello', 'Ninguna'].map((les) => (
                        <button key={les} style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', background: les === 'Hombro' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)', border: les === 'Hombro' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: les === 'Hombro' ? '#ef4444' : '#cbd5e1', fontSize: '0.75rem', fontWeight: 800 }}>
                          {les}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      ¿Tiene alguna enfermedad diagnosticada?
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['Hipertensión', 'Diabetes', 'Cardíaco', 'Ninguna'].map((enf) => (
                        <button key={enf} style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', background: enf === 'Ninguna' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)', border: enf === 'Ninguna' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', color: enf === 'Ninguna' ? '#10b981' : '#cbd5e1', fontSize: '0.75rem', fontWeight: 800 }}>
                          {enf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                    Estado del Cuestionario: <strong style={{ color: accentColor }}>Completado & Validado</strong>
                  </div>
                  <button style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: accentColor, color: '#000000', fontWeight: 900, border: 'none', fontSize: '0.75rem' }}>
                    Actualizar Respuestas
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};

export default ApexLifeMasterView;
