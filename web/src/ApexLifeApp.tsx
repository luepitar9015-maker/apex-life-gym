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
  Target,
  Send,
  Lock,
  Smartphone,
  Info,
  Maximize2,
  X,
  Share2,
  ShieldAlert,
  SlidersHorizontal,
  Home,
  BarChart3
} from 'lucide-react';

// ============================================================================
// DEFINICIÓN DE TIPOS
// ============================================================================
export type UserRole = 'ADMIN' | 'COACH' | 'CLIENT';

export interface Machine {
  id: string;
  name: string;
  category: 'Pecho' | 'Espalda' | 'Piernas' | 'Hombros' | 'Brazos' | 'Cardio' | 'Funcional';
  brand: string;
  model: string;
  status: 'Disponible' | 'Mantenimiento' | 'Fuera de servicio';
  mainMuscle: string;
  secondaryMuscles: string[];
  exercises: string[];
  videoUrl: string;
  imageUrl: string;
}

export interface SupplementProduct {
  id: string;
  name: string;
  category: 'Proteína' | 'Creatina' | 'Vitaminas' | 'Quemadores' | 'Pre-entrenos';
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  badge?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  category: 'Proteínas' | 'Carbohidratos' | 'Grasas Saludables' | 'Vegetales';
}

export interface AthleteClient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  height: number;
  weight: number;
  bmi: number;
  bodyFat: number;
  muscleMass: number;
  goal: 'Perder grasa' | 'Ganar músculo' | 'Definir' | 'Rehabilitación' | 'Salud general';
  injuries: string[];
  medicalConditions: string[];
  stressLevel: 'Bajo' | 'Medio' | 'Alto';
  sleepHours: number;
  activityLevel: 'Sedentario' | 'Moderado' | 'Atleta';
  experience: 'Principiante' | 'Intermedio' | 'Avanzado';
  avatar: string;
  planStatus: 'Activo' | 'Pendiente de Ajuste' | 'Completado';
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

// ============================================================================
// DATOS SEMILLA BASE
// ============================================================================
const INITIAL_MACHINES: Machine[] = [
  {
    id: 'm1',
    name: 'Press de Pecho Hammer Iso-Lateral',
    category: 'Pecho',
    brand: 'Hammer Strength',
    model: 'MTS-Chest-01',
    status: 'Disponible',
    mainMuscle: 'Pectoral mayor',
    secondaryMuscles: ['Tríceps braquial', 'Deltoides anterior'],
    exercises: ['Press horizontal hammer', 'Press declinado unilateral', 'Press tempo excéntrico'],
    videoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop',
  },
  {
    id: 'm2',
    name: 'Jalón Dorsal Divergente',
    category: 'Espalda',
    brand: 'Life Fitness',
    model: 'Signature Series Pulldown',
    status: 'Disponible',
    mainMuscle: 'Dorsal ancho',
    secondaryMuscles: ['Bíceps braquial', 'Redondo mayor', 'Romboides'],
    exercises: ['Jalón al pecho agarre prono', 'Jalón unilateral neutro'],
    videoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop',
  },
  {
    id: 'm3',
    name: 'Prensa Inclinada 45° Titan Pro',
    category: 'Piernas',
    brand: 'Cybex',
    model: 'Plate Loaded Leg Press',
    status: 'Disponible',
    mainMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteo mayor', 'Isquiotibiales', 'Gemelos'],
    exercises: ['Prensa inclinada pies medios', 'Prensa unilateral pies altos'],
    videoUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&auto=format&fit=crop',
  },
  {
    id: 'm4',
    name: 'Press Militar de Hombros Guiado',
    category: 'Hombros',
    brand: 'Hammer Strength',
    model: 'Iso-Lateral Shoulder Press',
    status: 'Mantenimiento',
    mainMuscle: 'Deltoides anterior y lateral',
    secondaryMuscles: ['Tríceps', 'Trapecio superior'],
    exercises: ['Press militar sentado', 'Press alterno iso-lateral'],
    videoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop',
  },
  {
    id: 'm5',
    name: 'Cinta Trotadora Curved Assault AirRunner',
    category: 'Cardio',
    brand: 'Assault Fitness',
    model: 'Pro Curved Runner V3',
    status: 'Disponible',
    mainMuscle: 'Sistema Cardiovascular / Piernas',
    secondaryMuscles: ['Glúteos', 'Gemelos', 'Core'],
    exercises: ['HIIT Sprints 20/40', 'Caminata inclinada constante', 'Tempo aeróbico'],
    videoUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&auto=format&fit=crop',
  }
];

const INITIAL_SUPPLEMENTS: SupplementProduct[] = [
  {
    id: 'p1',
    name: 'Hydro Whey Isolate 100% Pura',
    category: 'Proteína',
    description: '27g de proteína de máxima absorción por servicio, 0g azúcar, microfiltrada con enzimas digestivas.',
    price: 68.00,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop',
    badge: 'MÁS VENDIDO'
  },
  {
    id: 'p2',
    name: 'Creatina Monohidrato Creapure Micronizada',
    category: 'Creatina',
    description: 'Sello Creapure 100% de pureza farmacéutica para fuerza explosiva, volumen celular y potencia muscular.',
    price: 34.50,
    stock: 62,
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop',
    badge: 'BIO-HACKING'
  },
  {
    id: 'p3',
    name: 'Pre-Workout Nitro-X Neuro-Focus',
    category: 'Pre-entrenos',
    description: 'Beta-alanina 3.2g, Citrulina malato 6g, Cafeína anhidra 300mg y Alfa-GPC para enfoque de francotirador.',
    price: 42.00,
    stock: 28,
    imageUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&auto=format&fit=crop',
  },
  {
    id: 'p4',
    name: 'Multi-Mineral & Vitamin Complex Sport',
    category: 'Vitaminas',
    description: 'Zinc picolinato, Magnesio bisglicinato, Vitamina D3+K2 para soporte hormonal y balance de electrolitos.',
    price: 24.00,
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop',
  },
  {
    id: 'p5',
    name: 'Thermoburn Fat-Metabolizer Extreme',
    category: 'Quemadores',
    description: 'EGCG de té verde, L-Carnitina tartrato y capsaicina termogénica para acelerar la oxidación de lípidos.',
    price: 38.00,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&auto=format&fit=crop',
  }
];

const FOOD_DATABASE: FoodItem[] = [
  { id: 'f1', name: 'Pechuga de Pollo sin piel (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6, category: 'Proteínas' },
  { id: 'f2', name: 'Salmón Salvaje Fresco (100g)', calories: 208, protein: 22, carbs: 0, fats: 13, category: 'Proteínas' },
  { id: 'f3', name: 'Huevos Enteros Pasteurisados (2 uds)', calories: 144, protein: 12.6, carbs: 0.8, fats: 9.8, category: 'Proteínas' },
  { id: 'f4', name: 'Arroz Integral al Vapor (100g cocido)', calories: 111, protein: 2.6, carbs: 23, fats: 0.9, category: 'Carbohidratos' },
  { id: 'f5', name: 'Camote / Batata Asada (100g)', calories: 86, protein: 1.6, carbs: 20.1, fats: 0.1, category: 'Carbohidratos' },
  { id: 'f6', name: 'Avena en Hojuelas Integral (50g)', calories: 189, protein: 6.5, carbs: 33, fats: 3.5, category: 'Carbohidratos' },
  { id: 'f7', name: 'Aguacate Hass (50g)', calories: 80, protein: 1, carbs: 4, fats: 7.5, category: 'Grasas Saludables' },
  { id: 'f8', name: 'Brócoli al Vapor (100g)', calories: 34, protein: 2.8, carbs: 6.6, fats: 0.4, category: 'Vegetales' },
];

const INITIAL_ATHLETES: AthleteClient[] = [
  {
    id: 'ath-1',
    name: 'Luis Ernesto Moreno',
    age: 32,
    gender: 'M',
    height: 178,
    weight: 80.5,
    bmi: 25.4,
    bodyFat: 19.8,
    muscleMass: 42.1,
    goal: 'Perder grasa',
    injuries: ['Molestia en manguito rotador derecho'],
    medicalConditions: ['Ninguna'],
    stressLevel: 'Medio',
    sleepHours: 7,
    activityLevel: 'Moderado',
    experience: 'Intermedio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    planStatus: 'Activo'
  },
  {
    id: 'ath-2',
    name: 'Camila Rodriguez Paz',
    age: 27,
    gender: 'F',
    height: 165,
    weight: 61.0,
    bmi: 22.4,
    bodyFat: 21.2,
    muscleMass: 28.5,
    goal: 'Ganar músculo',
    injuries: ['Sensibilidad en rótula izquierda (menisco)'],
    medicalConditions: ['Ninguna'],
    stressLevel: 'Bajo',
    sleepHours: 8,
    activityLevel: 'Atleta',
    experience: 'Avanzado',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
    planStatus: 'Activo'
  }
];

export const ApexLifeApp: React.FC = () => {
  // -------------------------------------------------------------
  // ESTADO GLOBAL: ROL SELECCIONADO
  // -------------------------------------------------------------
  const [currentRole, setCurrentRole] = useState<UserRole>('CLIENT');
  const [activeGymName] = useState<string>('APEX LIFE • Sede Central');
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [selectedVideoModal, setSelectedVideoModal] = useState<Machine | null>(null);

  // Subpestañas de cada rol
  const [adminSection, setAdminSection] = useState<'machines' | 'store' | 'branches'>('machines');
  const [coachSection, setCoachSection] = useState<'athletes' | 'diagnostic' | 'plan_builder'>('diagnostic');
  const [clientSection, setClientSection] = useState<'hub' | 'scanner' | 'nutrition' | 'diary' | 'wellness_ai' | 'health_quiz'>('hub');

  // Estados de datos
  const [machines] = useState<Machine[]>(INITIAL_MACHINES);
  const [machineCategoryFilter, setMachineCategoryFilter] = useState<string>('Todos');
  const [supplements] = useState<SupplementProduct[]>(INITIAL_SUPPLEMENTS);
  const [athletes] = useState<AthleteClient[]>(INITIAL_ATHLETES);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteClient>(INITIAL_ATHLETES[0]);

  // Diario del cliente
  const [waterGlasses, setWaterGlasses] = useState<number>(7);
  const [mood, setMood] = useState<string>('Enfocado');
  const [workoutChecked, setWorkoutChecked] = useState<boolean>(true);

  // Alimentos seleccionados en nutrición
  const [favoriteProteins, setFavoriteProteins] = useState<string[]>(['Pollo', 'Huevos', 'Salmón']);
  const [favoriteCarbs, setFavoriteCarbs] = useState<string[]>(['Arroz integral', 'Avena']);
  const [favoriteFruits, setFavoriteFruits] = useState<string[]>(['Plátano', 'Manzana']);
  const [generatedRecipe] = useState({
    title: 'Bowl Proteico de Pollo Grillado con Arroz Salvaje y Aguacate',
    goal: 'Perder Grasa & Mantener Músculo',
    calories: 460,
    protein: 42,
    carbs: 45,
    fats: 11,
    instructions: [
      'Marinar 150g de pechuga en limón, orégano y ajo en polvo.',
      'Sellar en plancha antiadherente a fuego medio 6 minutos por lado.',
      'Servir con 100g de arroz integral y 30g de aguacate fresco en cubos.'
    ]
  });

  // Chat del Coach IA
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: '¡Hola Luis! Soy tu AI Wellness Coach de APEX LIFE. Tu índice de recuperación hoy está al 88%. ¿Listo para el entrenamiento de tren superior o necesitas adaptar alguna carga?', time: '09:15 AM' }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  // Modificación de plan por el coach
  const [coachNotes, setCoachNotes] = useState<string>('Se restringe el press militar pesado con barra libre para proteger el hombro derecho. Priorizar trabajo escapular en máquina Hammer.');
  const [aiLearningFeedback, setAiLearningFeedback] = useState<boolean>(false);

  // Función para enviar mensaje en AI Coach
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Excelente consulta. Basado en tu escaneo corporal y tu ligera molestia en el manguito rotador, te sugiero un calentamiento de 5 minutos con bandas elásticas y mantener los codos a 45 grados en el press de pecho. ¡Tus métricas de hidratación van en camino al objetivo!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiReply]);
    }, 900);
  };

  const handleSaveCoachChanges = () => {
    setAiLearningFeedback(true);
    setTimeout(() => setAiLearningFeedback(false), 3500);
  };

  // Filtrado de máquinas
  const filteredMachines = machines.filter(m => 
    machineCategoryFilter === 'Todos' ? true : m.category === machineCategoryFilter
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050811',
      color: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.08) 0%, #050811 70%)',
    }}>
      {/* ==================================================================== */}
      {/* 1. BARRA SUPERIOR HUD BIOMÉTRICO (CONTROL MAESTRO DE 3 ROLES) */}
      {/* ==================================================================== */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(5, 8, 17, 0.88)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.75rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Logo e Identidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
              color: '#000000',
              fontWeight: 900,
            }}>
              <Zap size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  APEX LIFE
                </span>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '6px',
                  letterSpacing: '0.05em'
                }}>
                  HIGH-TECH BIOMETRIC
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                {activeGymName}
              </p>
            </div>
          </div>

          {/* CONMUTADOR DE 3 ROLES PRINCIPALES */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            padding: '0.3rem',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}>
            <button
              onClick={() => setCurrentRole('ADMIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 800,
                transition: 'all 0.2s ease',
                backgroundColor: currentRole === 'ADMIN' ? '#10b981' : 'transparent',
                color: currentRole === 'ADMIN' ? '#000000' : '#94a3b8',
                boxShadow: currentRole === 'ADMIN' ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none',
              }}
            >
              <Building2 size={16} />
              <span>1. Admin del Gym</span>
            </button>

            <button
              onClick={() => setCurrentRole('COACH')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 800,
                transition: 'all 0.2s ease',
                backgroundColor: currentRole === 'COACH' ? '#10b981' : 'transparent',
                color: currentRole === 'COACH' ? '#000000' : '#94a3b8',
                boxShadow: currentRole === 'COACH' ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none',
              }}
            >
              <Dumbbell size={16} />
              <span>2. Entrenador Personal</span>
            </button>

            <button
              onClick={() => setCurrentRole('CLIENT')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 800,
                transition: 'all 0.2s ease',
                backgroundColor: currentRole === 'CLIENT' ? '#10b981' : 'transparent',
                color: currentRole === 'CLIENT' ? '#000000' : '#94a3b8',
                boxShadow: currentRole === 'CLIENT' ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none',
              }}
            >
              <User size={16} />
              <span>3. Cliente del Gym</span>
            </button>
          </div>

          {/* Acciones Rápidas del HUD */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setIsQrModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <QrCode size={16} color="#10b981" />
              <span>Pase QR</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.72rem',
              color: '#10b981',
              fontWeight: 800,
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }} />
              <span>SISTEMA 100% LIMPIO</span>
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* CUERPO PRINCIPAL CONDICIONAL SEGÚN EL ROL SELECCIONADO */}
      {/* ==================================================================== */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '1.5rem', flex: 1 }}>

        {/* ------------------------------------------------------------------ */}
        {/* ROL 1: ADMINISTRADOR DEL GYM */}
        {/* ------------------------------------------------------------------ */}
        {currentRole === 'ADMIN' && (
          <section>
            {/* Banner de Bienvenida Admin */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 29, 47, 0.85) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '1.75rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.06em' }}>
                  CENTRO DE CONTROL EJECUTIVO • GESTIÓN DEL GIMNASIO
                </span>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '0.35rem 0' }}>
                  Panel Administrativo Completo
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, maxWidth: '650px' }}>
                  Control integral de máquinas biomecánicas, catálogo de suplementos deportivos, sucursales y suscripciones de socios.
                </p>
              </div>

              {/* Submenú de secciones Admin */}
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '0.3rem', borderRadius: '12px' }}>
                <button
                  onClick={() => setAdminSection('machines')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    backgroundColor: adminSection === 'machines' ? '#10b981' : 'transparent',
                    color: adminSection === 'machines' ? '#000000' : '#ffffff',
                  }}
                >
                  Inventario de Máquinas
                </button>
                <button
                  onClick={() => setAdminSection('store')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    backgroundColor: adminSection === 'store' ? '#10b981' : 'transparent',
                    color: adminSection === 'store' ? '#000000' : '#ffffff',
                  }}
                >
                  Tienda & Suplementos
                </button>
                <button
                  onClick={() => setAdminSection('branches')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    backgroundColor: adminSection === 'branches' ? '#10b981' : 'transparent',
                    color: adminSection === 'branches' ? '#000000' : '#ffffff',
                  }}
                >
                  Sedes & Membresías
                </button>
              </div>
            </div>

            {/* SECCIÓN ADMIN: INVENTARIO DE MÁQUINAS Y EQUIPOS */}
            {adminSection === 'machines' && (
              <div>
                {/* Métricas y Filtros de Categoría */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Cardio'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setMachineCategoryFilter(cat)}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: '8px',
                          border: machineCategoryFilter === cat ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                          backgroundColor: machineCategoryFilter === cat ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                          color: machineCategoryFilter === cat ? '#10b981' : '#cbd5e1',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => alert('Abriendo formulario de registro de máquina con campos: Nombre, Categoría, Marca, Modelo, Estado, Músculos y Video explicativo.')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.55rem 1rem',
                      backgroundColor: '#10b981',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Plus size={16} />
                    <span>Registrar Máquina</span>
                  </button>
                </div>

                {/* Grid de Máquinas Biomecánicas */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '1.25rem'
                }}>
                  {filteredMachines.map((machine) => (
                    <div
                      key={machine.id}
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Imagen con Badge de Estado y Video */}
                      <div style={{ position: 'relative', height: '175px', backgroundColor: '#1e293b' }}>
                        <img 
                          src={machine.imageUrl} 
                          alt={machine.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          backgroundColor: machine.status === 'Disponible' 
                            ? 'rgba(16, 185, 129, 0.9)' 
                            : 'rgba(245, 158, 11, 0.9)',
                          color: '#000000'
                        }}>
                          {machine.status.toUpperCase()}
                        </div>

                        <button
                          onClick={() => setSelectedVideoModal(machine)}
                          style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            cursor: 'pointer',
                            backdropFilter: 'blur(8px)'
                          }}
                        >
                          <Play size={14} color="#10b981" fill="#10b981" />
                          <span>Video Biomecánico</span>
                        </button>
                      </div>

                      {/* Detalles Biomecánicos */}
                      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                            {machine.name}
                          </h3>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
                          Marca: <strong style={{ color: '#ffffff' }}>{machine.brand}</strong> • Modelo: {machine.model}
                        </div>

                        {/* Músculo Principal & Secundarios */}
                        <div style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.35)',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          marginBottom: '0.85rem',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                          <div style={{ fontSize: '0.74rem', marginBottom: '0.35rem' }}>
                            <span style={{ color: '#10b981', fontWeight: 800 }}>Músculo Principal:</span>{' '}
                            <strong style={{ color: '#f8fafc' }}>{machine.mainMuscle}</strong>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Secundarios:</span>{' '}
                            {machine.secondaryMuscles.join(', ')}
                          </div>
                        </div>

                        {/* Ejercicios Compatibles */}
                        <div style={{ marginTop: 'auto' }}>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                            Ejercicios Compatibles:
                          </span>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                            {machine.exercises.map((ex, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: '0.68rem',
                                  padding: '0.2rem 0.5rem',
                                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(255, 255, 255, 0.06)',
                                  color: '#cbd5e1'
                                }}
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN ADMIN: TIENDA DE SUPLEMENTOS & BASE NUTRICIONAL */}
            {adminSection === 'store' && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
                    Catálogo de Suplementación & Tienda Oficial
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                    Productos autorizados de nutrición deportiva, control de existencias e inventario en tiempo real.
                  </p>
                </div>

                {/* Grid de Productos */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2rem'
                }}>
                  {supplements.map((prod) => (
                    <div
                      key={prod.id}
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', position: 'relative' }}>
                        <img src={prod.imageUrl} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {prod.badge && (
                          <span style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: '#10b981',
                            color: '#000000',
                            fontSize: '0.62rem',
                            fontWeight: 900,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px'
                          }}>
                            {prod.badge}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                        {prod.category}
                      </div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0 0.5rem 0' }}>
                        {prod.name}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', flex: 1, marginBottom: '0.75rem' }}>
                        {prod.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                      }}>
                        <div>
                          <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>${prod.price.toFixed(2)}</span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Stock: {prod.stock} uds</span>
                        </div>
                        <button
                          onClick={() => alert(`Venta simulada de 1 unidad de ${prod.name}`)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid #10b981',
                            color: '#10b981',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Vender / Facturar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Base de Datos de Alimentos Saludables & Macronutrientes */}
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <UtensilsCrossed size={18} color="#10b981" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      Base de Datos de Alimentos & Macronutrientes (Calorías, Proteínas, Carbs, Grasas)
                    </h3>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                          <th style={{ padding: '0.65rem' }}>Alimento / Ingrediente</th>
                          <th style={{ padding: '0.65rem' }}>Categoría</th>
                          <th style={{ padding: '0.65rem' }}>Calorías</th>
                          <th style={{ padding: '0.65rem' }}>Proteínas (g)</th>
                          <th style={{ padding: '0.65rem' }}>Carbohidratos (g)</th>
                          <th style={{ padding: '0.65rem' }}>Grasas (g)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FOOD_DATABASE.map(food => (
                          <tr key={food.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            <td style={{ padding: '0.65rem', fontWeight: 700, color: '#ffffff' }}>{food.name}</td>
                            <td style={{ padding: '0.65rem', color: '#10b981' }}>{food.category}</td>
                            <td style={{ padding: '0.65rem', color: '#f8fafc' }}>{food.calories} kcal</td>
                            <td style={{ padding: '0.65rem', color: '#38bdf8' }}>{food.protein}g</td>
                            <td style={{ padding: '0.65rem', color: '#facc15' }}>{food.carbs}g</td>
                            <td style={{ padding: '0.65rem', color: '#fb7185' }}>{food.fats}g</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN ADMIN: SEDES Y HORARIOS */}
            {adminSection === 'branches' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.25rem'
              }}>
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.85rem' }}>
                    Sede Central (Principal)
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Calle 93 # 12-45, Zona Financiera</p>
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Horario Lunes a Viernes:</span>
                      <strong style={{ color: '#ffffff' }}>05:00 AM - 11:00 PM</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Sábados y Festivos:</span>
                      <strong style={{ color: '#ffffff' }}>06:00 AM - 08:00 PM</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Capacidad / Aforo:</span>
                      <strong style={{ color: '#10b981' }}>72% (145 personas adentro)</strong>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.85rem' }}>
                    Planes de Membresía Vigentes
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                        <span style={{ color: '#ffffff' }}>Membresía Black VIP 360°</span>
                        <span style={{ color: '#10b981' }}>$85 / mes</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Acceso ilimitado a sedes, escáner corporal IA mensual y AI Coach.</span>
                    </div>

                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                        <span style={{ color: '#ffffff' }}>Plan Fit Estándar</span>
                        <span style={{ color: '#38bdf8' }}>$49 / mes</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Acceso a sala de máquinas de sede fija y rutinas básicas.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* ROL 2: ENTRENADOR PERSONAL (COACH PROFESIONAL) */}
        {/* ------------------------------------------------------------------ */}
        {currentRole === 'COACH' && (
          <section>
            {/* Header Entrenador */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 29, 47, 0.85) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '1.75rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.06em' }}>
                  PANEL PROFESIONAL • COACHING BIOMÉTRICO
                </span>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '0.35rem 0' }}>
                  Diagnóstico IA & Prescripción del Ejercicio
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, maxWidth: '650px' }}>
                  Supervisión de alumnos, prescripción inteligente de entrenamiento en gimnasio vs casa y filtrado de ejercicios prohibidos por patología.
                </p>
              </div>

              {/* Selector de Atleta Activo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Atleta seleccionado:</span>
                <select
                  value={selectedAthlete.id}
                  onChange={(e) => {
                    const found = athletes.find(a => a.id === e.target.value);
                    if (found) setSelectedAthlete(found);
                  }}
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    color: '#ffffff',
                    border: '1px solid #10b981',
                    borderRadius: '10px',
                    padding: '0.55rem 0.9rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {athletes.map(ath => (
                    <option key={ath.id} value={ath.id}>
                      {ath.name} ({ath.goal})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub-pestañas Coach */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                onClick={() => setCoachSection('diagnostic')}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  backgroundColor: coachSection === 'diagnostic' ? '#10b981' : 'rgba(15, 23, 42, 0.7)',
                  color: coachSection === 'diagnostic' ? '#000000' : '#ffffff',
                }}
              >
                1. Diagnóstico Clínico IA
              </button>

              <button
                onClick={() => setCoachSection('plan_builder')}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  backgroundColor: coachSection === 'plan_builder' ? '#10b981' : 'rgba(15, 23, 42, 0.7)',
                  color: coachSection === 'plan_builder' ? '#000000' : '#ffffff',
                }}
              >
                2. Plan Gimnasio vs Casa
              </button>
            </div>

            {/* SUBSECCIÓN COACH: DIAGNÓSTICO GENERADO POR IA */}
            {coachSection === 'diagnostic' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
                {/* Tarjeta de Ficha Biométrica */}
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <img 
                      src={selectedAthlete.avatar} 
                      alt={selectedAthlete.name} 
                      style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #10b981' }} 
                    />
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                        {selectedAthlete.name}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 800 }}>
                        Meta: {selectedAthlete.goal.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Grid de Métricas Corporales */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>PESO ACTUAL</span>
                      <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{selectedAthlete.weight} kg</strong>
                    </div>
                    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>% GRASA</span>
                      <strong style={{ fontSize: '1.1rem', color: '#f59e0b' }}>{selectedAthlete.bodyFat}%</strong>
                    </div>
                    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>MASA MAGRA</span>
                      <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>{selectedAthlete.muscleMass} kg</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div>Altura: <strong style={{ color: '#ffffff' }}>{selectedAthlete.height} cm</strong> • IMC: <strong style={{ color: '#ffffff' }}>{selectedAthlete.bmi}</strong></div>
                    <div>Sueño Diario: <strong style={{ color: '#ffffff' }}>{selectedAthlete.sleepHours} hrs</strong> • Nivel de Estrés: <strong style={{ color: '#ffffff' }}>{selectedAthlete.stressLevel}</strong></div>
                    <div>Lesiones Registradas: <span style={{ color: '#ef4444', fontWeight: 800 }}>{selectedAthlete.injuries.join(', ')}</span></div>
                  </div>
                </div>

                {/* Informe Técnico de la IA para el Entrenador */}
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Bot size={20} color="#10b981" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                      Informe Clínico Generado por IA
                    </h3>
                  </div>

                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    padding: '1rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    lineHeight: '1.45',
                    color: '#cbd5e1',
                    marginBottom: '1rem',
                    borderLeft: '4px solid #10b981'
                  }}>
                    "El atleta presenta una distribución de grasa predominantemente visceral (19.8%), con asimetría menor en cintura escapular y limitación en la flexión completa del hombro derecho. Se recomienda intensidad progresiva al 65-70% 1RM con enfoque en hipertrofia metabólica controlada."
                  </div>

                  {/* Ejercicios Prohibidos vs Recomendados */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                        <AlertTriangle size={14} /> EJERCICIOS PROHIBIDOS
                      </span>
                      <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.72rem', color: '#fca5a5', lineHeight: '1.4' }}>
                        <li>Press militar libre tras nuca</li>
                        <li>Fondos en paralelas con sobrecarga</li>
                        <li>Remo al mentón con barra recta</li>
                      </ul>
                    </div>

                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                        <CheckCircle2 size={14} /> EJERCICIOS RECOMENDADOS
                      </span>
                      <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.72rem', color: '#86efac', lineHeight: '1.4' }}>
                        <li>Press de pecho Hammer Iso-Lateral</li>
                        <li>Elevaciones laterales en polea baja</li>
                        <li>Face Pulls con rotación externa</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBSECCIÓN COACH: CREADOR DE PLANES (GYM VS CASA) */}
            {coachSection === 'plan_builder' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  {/* Plan Gimnasio */}
                  <div style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Building2 size={18} color="#10b981" /> Plan Gimnasio (Día 1: Pecho + Tríceps)
                      </h3>
                      <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>4 EJERCICIOS</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.82rem' }}>
                          <span style={{ color: '#ffffff' }}>1. Press de Pecho Hammer Iso-Lateral</span>
                          <span style={{ color: '#10b981' }}>4 Series x 12 Reps</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          Máquina: Hammer Chest • Carga: 30kg/lado • Descanso: 90s • Técnica: Parada isométrica 1s en contracción.
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.82rem' }}>
                          <span style={{ color: '#ffffff' }}>2. Aperturas en Polea Crossover</span>
                          <span style={{ color: '#10b981' }}>3 Series x 15 Reps</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          Poleas a altura media • Descanso: 60s • Enfoque en estiramiento fascial sin comprometer manguito.
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.82rem' }}>
                          <span style={{ color: '#ffffff' }}>3. Extensión de Tríceps en Cuerda</span>
                          <span style={{ color: '#10b981' }}>4 Series x 12 Reps</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          Codos pegados al torso • Descanso: 60s • Apertura final de cuerda al bloquear.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plan Casa (Adaptado a espacio y bandas) */}
                  <div style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Home size={18} color="#38bdf8" /> Plan Casa (Espacio Reducido & Bandas)
                      </h3>
                      <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800 }}>30 MINUTOS</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.82rem' }}>
                          <span style={{ color: '#ffffff' }}>1. Flexiones con Manos Elevadas (Pared/Mesa)</span>
                          <span style={{ color: '#38bdf8' }}>4 Series x 15 Reps</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          Menor estrés glenohumeral • Carga: Autocarga • Descanso: 60s.
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.82rem' }}>
                          <span style={{ color: '#ffffff' }}>2. Press Horizontal con Banda Elástica Anclada</span>
                          <span style={{ color: '#38bdf8' }}>3 Series x 20 Reps</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          Equipamiento: Banda media • Anclaje en puerta • Tensión continua.
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.82rem' }}>
                          <span style={{ color: '#ffffff' }}>3. Plancha Abdominal Isométrica</span>
                          <span style={{ color: '#38bdf8' }}>3 Series x 45 Segundos</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          Espacio necesario: 1 esterilla • Activación profunda del transverso.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edición del Plan con Retroalimentación al Modelo IA */}
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                      Notas del Entrenador & Ajustes Manuales (Entrenamiento del Modelo IA):
                    </span>
                    {aiLearningFeedback && (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Check size={14} /> ¡Ajustes guardados! La IA ha aprendido estas restricciones para futuros planes.
                      </span>
                    )}
                  </div>
                  <textarea
                    value={coachNotes}
                    onChange={(e) => setCoachNotes(e.target.value)}
                    rows={2}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '0.75rem',
                      fontSize: '0.8rem',
                      fontFamily: 'inherit'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleSaveCoachChanges}
                      style={{
                        padding: '0.55rem 1.25rem',
                        backgroundColor: '#10b981',
                        color: '#000000',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 900,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Guardar Cambios & Entrenar IA
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* ROL 3: CLIENTE DEL GYM (ATLETA / SOCIO) - ESTILO HIGH-TECH BIOMÉTRICO */}
        {/* ------------------------------------------------------------------ */}
        {currentRole === 'CLIENT' && (
          <section>
            {/* ANILLOS BIOMÉTRICOS CIRCULARES (ESTILO BIOHACKING / GARMIN PRO) */}
            <div style={{
              background: 'radial-gradient(ellipse at 50% 20%, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.9) 70%)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '24px',
              padding: '1.75rem',
              marginBottom: '1.5rem',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#10b981', letterSpacing: '0.08em' }}>
                    TELEMETRÍA BIOMÉTRICA EN TIEMPO REAL
                  </span>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: '0.2rem 0' }}>
                    Hola, Luis Ernesto • Estado Físico Óptimo
                  </h1>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setClientSection('hub')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      backgroundColor: clientSection === 'hub' ? '#10b981' : 'rgba(0, 0, 0, 0.4)',
                      color: clientSection === 'hub' ? '#000000' : '#ffffff'
                    }}
                  >
                    Resumen Bio
                  </button>
                  <button
                    onClick={() => setClientSection('scanner')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      backgroundColor: clientSection === 'scanner' ? '#10b981' : 'rgba(0, 0, 0, 0.4)',
                      color: clientSection === 'scanner' ? '#000000' : '#ffffff'
                    }}
                  >
                    Body Scanner AI
                  </button>
                  <button
                    onClick={() => setClientSection('nutrition')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      backgroundColor: clientSection === 'nutrition' ? '#10b981' : 'rgba(0, 0, 0, 0.4)',
                      color: clientSection === 'nutrition' ? '#000000' : '#ffffff'
                    }}
                  >
                    Nutrición & Recetas
                  </button>
                  <button
                    onClick={() => setClientSection('diary')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      backgroundColor: clientSection === 'diary' ? '#10b981' : 'rgba(0, 0, 0, 0.4)',
                      color: clientSection === 'diary' ? '#000000' : '#ffffff'
                    }}
                  >
                    Diario Fitness
                  </button>
                  <button
                    onClick={() => setClientSection('wellness_ai')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      backgroundColor: clientSection === 'wellness_ai' ? '#10b981' : 'rgba(0, 0, 0, 0.4)',
                      color: clientSection === 'wellness_ai' ? '#000000' : '#ffffff'
                    }}
                  >
                    AI Wellness Coach
                  </button>
                  <button
                    onClick={() => setClientSection('health_quiz')}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      backgroundColor: clientSection === 'health_quiz' ? '#10b981' : 'rgba(0, 0, 0, 0.4)',
                      color: clientSection === 'health_quiz' ? '#000000' : '#ffffff'
                    }}
                  >
                    Cuestionario Salud
                  </button>
                </div>
              </div>

              {/* 4 ANILLOS CIRCULARES SVG DE ALTO IMPACTO */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                alignItems: 'center'
              }}>
                {/* Anillo 1: Recuperación Biológica */}
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <svg width="64" height="64" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="3.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3.5"
                        strokeDasharray="88, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>
                      88%
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', fontWeight: 700 }}>RECUPERACIÓN</span>
                    <strong style={{ fontSize: '0.95rem', color: '#10b981' }}>Alta • Listo</strong>
                  </div>
                </div>

                {/* Anillo 2: Carga de Entrenamiento (Strain) */}
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <svg width="64" height="64" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="3.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3.5"
                        strokeDasharray="68, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>
                      68%
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', fontWeight: 700 }}>CARGA MUSCULAR</span>
                    <strong style={{ fontSize: '0.95rem', color: '#f59e0b' }}>14.2 Strain</strong>
                  </div>
                </div>

                {/* Anillo 3: Hidratación */}
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <svg width="64" height="64" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="3.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3.5"
                        strokeDasharray="75, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>
                      75%
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', fontWeight: 700 }}>HIDRATACIÓN</span>
                    <strong style={{ fontSize: '0.95rem', color: '#38bdf8' }}>{waterGlasses * 250} ml / 2.5L</strong>
                  </div>
                </div>

                {/* Anillo 4: Calidad de Sueño */}
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <svg width="64" height="64" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="3.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3.5"
                        strokeDasharray="92, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>
                      92%
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', fontWeight: 700 }}>SUEÑO REM</span>
                    <strong style={{ fontSize: '0.95rem', color: '#a855f7' }}>7h 45m Profundo</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN CLIENTE: HUB PRINCIPAL */}
            {clientSection === 'hub' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {/* Tarjeta de Entrenamiento Asignado Hoy */}
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>SESIÓN PROGRAMADA</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Día 1 / 4 Semanal</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                    Pecho & Tríceps Hipertrofia
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    Diseñado por tu entrenador Marcos Valenzuela. Adaptado a la máquina Hammer Strength Iso-Lateral.
                  </p>
                  <button
                    onClick={() => alert('Iniciando cronómetro y guía interactiva de repeticiones de la sesión de hoy')}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#10b981',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Play size={18} fill="#000000" />
                    <span>Iniciar Entrenamiento de Hoy</span>
                  </button>
                </div>

                {/* Tarjeta de Inteligencia Artificial Predictiva */}
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Cpu size={18} color="#10b981" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>IA PREDICTIVA • PROGRESO 30 DÍAS</span>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    color: '#f8fafc',
                    lineHeight: '1.45',
                    marginBottom: '0.85rem'
                  }}>
                    "Según tus últimos 30 días, aumentaste fuerza en press horizontal un 15% y redujiste grasa corporal estimada en 2.1%. Tu cadencia de descanso está en el percentil superior."
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Recomendación IA: <strong style={{ color: '#10b981' }}>Aumentar 2.5kg en tu próxima sesión de tren superior.</strong>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN CLIENTE: BODY SCANNER AI */}
            {clientSection === 'scanner' && (
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '1.75rem'
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.06em' }}>
                    VISIÓN ARTIFICIAL & BIOMETRÍA 3D
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0' }}>
                    Body Scanner AI • Análisis Postural y Composición
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                    Captura 3 ángulos corporales para evaluar simetría escapular, porcentaje graso y evolución gráfica.
                  </p>
                </div>

                {/* 3 Fotografías del Escaneo */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '1.5rem'
                }}>
                  {/* Foto Frontal */}
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '14px', padding: '1rem', border: '1px dashed rgba(16, 185, 129, 0.4)', textAlign: 'center' }}>
                    <div style={{ height: '180px', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.75rem', position: 'relative' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format&fit=crop" 
                        alt="Frontal" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.8)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', color: '#10b981' }}>
                        Frontal analizada
                      </span>
                    </div>
                    <strong style={{ fontSize: '0.85rem', color: '#ffffff', display: 'block' }}>1. Fotografía Frontal</strong>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Alineación de hombros y cadera simétrica (98%)</span>
                  </div>

                  {/* Foto Lateral */}
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '14px', padding: '1rem', border: '1px dashed rgba(16, 185, 129, 0.4)', textAlign: 'center' }}>
                    <div style={{ height: '180px', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.75rem', position: 'relative' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&auto=format&fit=crop" 
                        alt="Lateral" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.8)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', color: '#10b981' }}>
                        Lateral analizada
                      </span>
                    </div>
                    <strong style={{ fontSize: '0.85rem', color: '#ffffff', display: 'block' }}>2. Fotografía Lateral</strong>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Curvatura lumbar neutra • Ligera antepulsión de cabeza</span>
                  </div>

                  {/* Foto Posterior */}
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '14px', padding: '1rem', border: '1px dashed rgba(16, 185, 129, 0.4)', textAlign: 'center' }}>
                    <div style={{ height: '180px', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.75rem', position: 'relative' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop" 
                        alt="Posterior" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.8)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', color: '#10b981' }}>
                        Posterior analizada
                      </span>
                    </div>
                    <strong style={{ fontSize: '0.85rem', color: '#ffffff', display: 'block' }}>3. Fotografía Posterior</strong>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Activación dorsal equilibrada y simetría glútea</span>
                  </div>
                </div>

                {/* Historial Técnico de Evolución (Fecha 1 vs Fecha 2) */}
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '14px', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
                    Evolución Gráfica y Comparativa de Fechas
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>FECHA 1 (Inicio - Hace 45 días)</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginTop: '0.25rem' }}>85.0 kg</div>
                      <div style={{ fontSize: '0.78rem', color: '#f59e0b' }}>Grasa: 28% • Masa: 38.5 kg</div>
                    </div>

                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>FECHA 2 (Actual - Hoy)</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginTop: '0.25rem' }}>80.5 kg</div>
                      <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 800 }}>Grasa: 19.8% (-8.2%) • Masa: 42.1 kg (+3.6kg)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN CLIENTE: NUTRICIÓN INTELIGENTE & RECETARIO */}
            {clientSection === 'nutrition' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
                {/* Selector de Alimentos Favoritos */}
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.35rem' }}>
                    Alimentos Favoritos del Usuario
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    Marca los ingredientes que prefieres consumir para que la IA genere tus recetas personalizadas.
                  </p>

                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>PROTEÍNAS:</span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                      {['Pollo', 'Carne', 'Pescado', 'Huevos', 'Tofu'].map(item => (
                        <button
                          key={item}
                          onClick={() => {
                            setFavoriteProteins(prev => 
                              prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
                            );
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            border: favoriteProteins.includes(item) ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: favoriteProteins.includes(item) ? 'rgba(16,185,129,0.2)' : 'rgba(0,0,0,0.3)',
                            color: favoriteProteins.includes(item) ? '#10b981' : '#cbd5e1',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {favoriteProteins.includes(item) ? '☑' : '☐'} {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>CARBOHIDRATOS:</span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                      {['Arroz integral', 'Papa', 'Pasta', 'Avena', 'Quinoa'].map(item => (
                        <button
                          key={item}
                          onClick={() => {
                            setFavoriteCarbs(prev => 
                              prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
                            );
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            border: favoriteCarbs.includes(item) ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: favoriteCarbs.includes(item) ? 'rgba(56,189,248,0.2)' : 'rgba(0,0,0,0.3)',
                            color: favoriteCarbs.includes(item) ? '#38bdf8' : '#cbd5e1',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {favoriteCarbs.includes(item) ? '☑' : '☐'} {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>FRUTAS:</span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                      {['Manzana', 'Plátano', 'Arándanos', 'Fresas'].map(item => (
                        <button
                          key={item}
                          onClick={() => {
                            setFavoriteFruits(prev => 
                              prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
                            );
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            border: favoriteFruits.includes(item) ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: favoriteFruits.includes(item) ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.3)',
                            color: favoriteFruits.includes(item) ? '#f59e0b' : '#cbd5e1',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {favoriteFruits.includes(item) ? '☑' : '☐'} {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generador Inteligente de Recetas con Macros */}
                <div style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>RECETA SUGERIDA POR IA</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Objetivo: {generatedRecipe.goal}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.85rem 0' }}>
                    {generatedRecipe.title}
                  </h3>

                  {/* Macros de la Receta */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.35)', padding: '0.6rem', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.62rem', color: '#94a3b8', display: 'block' }}>CALORÍAS</span>
                      <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>{generatedRecipe.calories} kcal</strong>
                    </div>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.35)', padding: '0.6rem', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.62rem', color: '#38bdf8', display: 'block' }}>PROTEÍNA</span>
                      <strong style={{ fontSize: '0.95rem', color: '#38bdf8' }}>{generatedRecipe.protein}g</strong>
                    </div>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.35)', padding: '0.6rem', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.62rem', color: '#facc15', display: 'block' }}>CARBOS</span>
                      <strong style={{ fontSize: '0.95rem', color: '#facc15' }}>{generatedRecipe.carbs}g</strong>
                    </div>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.35)', padding: '0.6rem', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.62rem', color: '#fb7185', display: 'block' }}>GRASAS</span>
                      <strong style={{ fontSize: '0.95rem', color: '#fb7185' }}>{generatedRecipe.fats}g</strong>
                    </div>
                  </div>

                  {/* Instrucciones de Preparación */}
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '8px', flex: 1, marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>
                      Paso a paso rápido:
                    </span>
                    <ol style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
                      {generatedRecipe.instructions.map((step, idx) => (
                        <li key={idx} style={{ marginBottom: '0.25rem' }}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <button
                    onClick={() => alert('Generando nueva receta equilibrada según tus alimentos favoritos seleccionados')}
                    style={{
                      padding: '0.65rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10b981',
                      color: '#10b981',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Regenerar Otra Receta IA
                  </button>
                </div>
              </div>
            )}

            {/* SECCIÓN CLIENTE: DIARIO FITNESS (TRACKER DIARIO) */}
            {clientSection === 'diary' && (
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '1.75rem'
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.06em' }}>
                    SEGUIMIENTO DIARIO DE HÁBITOS
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0' }}>
                    Diario Fitness & Registro de Recuperación
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  {/* Tracker de Agua Interactivo */}
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '1.25rem', borderRadius: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Droplets size={16} /> Agua Consumida
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>{waterGlasses * 250} ml</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                        <button
                          key={v}
                          onClick={() => setWaterGlasses(v)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: v <= waterGlasses ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                            color: v <= waterGlasses ? '#000000' : '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Meta: 10 vasos de 250ml (2.5 Litros)</span>
                  </div>

                  {/* Estado de Ánimo Emocional */}
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '1.25rem', borderRadius: '14px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10b981', display: 'block', marginBottom: '0.75rem' }}>
                      Estado Emocional & Energía
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['Enfocado', 'Excelente', 'Cansado', 'Estresado'].map(state => (
                        <button
                          key={state}
                          onClick={() => setMood(state)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            border: mood === state ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: mood === state ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                            color: mood === state ? '#10b981' : '#cbd5e1',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Check de Entrenamiento Realizado */}
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '1.25rem', borderRadius: '14px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#facc15', display: 'block', marginBottom: '0.75rem' }}>
                      Cumplimiento de la Sesión
                    </span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: '#ffffff' }}>
                      <input 
                        type="checkbox" 
                        checked={workoutChecked} 
                        onChange={() => setWorkoutChecked(!workoutChecked)}
                        style={{ width: '18px', height: '18px', accentColor: '#10b981' }} 
                      />
                      <span>Entrenamiento del día completado al 100%</span>
                    </label>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '0.5rem' }}>
                      Racha activa: <strong style={{ color: '#10b981' }}>18 días consecutivos</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN CLIENTE: AGENTE IA FITNESS COACH */}
            {clientSection === 'wellness_ai' && (
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                height: '560px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={22} color="#10b981" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                      AI Wellness Coach • Asistente Personal
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Activo • Conoce tus lesiones y progreso</span>
                  </div>
                </div>

                {/* Historial de Mensajes */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
                  {chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        backgroundColor: msg.sender === 'user' ? '#10b981' : 'rgba(0, 0, 0, 0.45)',
                        color: msg.sender === 'user' ? '#000000' : '#ffffff',
                        padding: '0.75rem 1rem',
                        borderRadius: '14px',
                        fontSize: '0.82rem',
                        lineHeight: '1.4',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <div>{msg.text}</div>
                      <span style={{ fontSize: '0.62rem', color: msg.sender === 'user' ? 'rgba(0,0,0,0.6)' : '#94a3b8', display: 'block', textAlign: 'right', marginTop: '0.25rem' }}>
                        {msg.time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Input de Envío */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Pregúntale a tu AI Coach sobre nutrición, técnica o recuperación..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      padding: '0.65rem 1rem',
                      fontSize: '0.82rem',
                      fontFamily: 'inherit'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    style={{
                      padding: '0.65rem 1.25rem',
                      backgroundColor: '#10b981',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Send size={16} />
                    <span>Enviar</span>
                  </button>
                </div>
              </div>
            )}

            {/* SECCIÓN CLIENTE: CUESTIONARIO INTELIGENTE DE SALUD */}
            {clientSection === 'health_quiz' && (
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '1.75rem'
              }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.06em' }}>
                    EVALUACIÓN MÉDICA & SEGURIDAD DEL ATLETA
                  </span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0' }}>
                    Cuestionario Inteligente de Salud
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                    Las respuestas alimentan directamente los algoritmos de restricción de ejercicios para tu entrenador y el coach virtual.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '1.25rem', borderRadius: '12px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', display: 'block', marginBottom: '0.5rem' }}>
                      ¿Tiene alguna lesión articular o muscular activa?
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['Rodilla', 'Espalda', 'Hombro', 'Cuello', 'Ninguna'].map(opt => (
                        <button
                          key={opt}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            border: opt === 'Hombro' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: opt === 'Hombro' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.3)',
                            color: opt === 'Hombro' ? '#fca5a5' : '#cbd5e1',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '1.25rem', borderRadius: '12px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', display: 'block', marginBottom: '0.5rem' }}>
                      ¿Tiene alguna enfermedad diagnosticada?
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['Hipertensión', 'Diabetes', 'Problemas Cardíacos', 'Ninguna'].map(opt => (
                        <button
                          key={opt}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            border: opt === 'Ninguna' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: opt === 'Ninguna' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.3)',
                            color: opt === 'Ninguna' ? '#10b981' : '#cbd5e1',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* ==================================================================== */}
      {/* MODAL: PASE QR DIGITAL */}
      {/* ==================================================================== */}
      {isQrModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid #10b981',
            borderRadius: '24px',
            padding: '2rem',
            maxWidth: '380px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.35)'
          }}>
            <button
              onClick={() => setIsQrModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10b981', letterSpacing: '0.08em' }}>
              CREDENCIAL DE ACCESO DIGITAL
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '0.35rem 0 1rem 0' }}>
              Luis Ernesto Moreno
            </h3>

            {/* Simulación del QR con diseño Bio */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              borderRadius: '16px',
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              <QrCode size={180} color="#000000" />
            </div>

            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Membresía: <strong style={{ color: '#ffffff' }}>Black VIP 360°</strong>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, marginTop: '0.25rem' }}>
              ● ACCESO AUTORIZADO • VÁLIDO HASTA DIC 2026
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: VIDEO BIOMECÁNICO DE MÁQUINA */}
      {/* ==================================================================== */}
      {selectedVideoModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '1.5rem',
            maxWidth: '600px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedVideoModal(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>TÉCNICA DE EJECUCIÓN BIOMECÁNICA</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '0.25rem 0 1rem 0' }}>
              {selectedVideoModal.name}
            </h3>

            <div style={{
              height: '300px',
              backgroundColor: '#000000',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '1rem'
            }}>
              <img 
                src={selectedVideoModal.videoUrl} 
                alt={selectedVideoModal.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.45)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)'
                }}>
                  <Play size={28} color="#000000" fill="#000000" />
                </div>
                <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 800, marginTop: '0.75rem' }}>
                  Reproducir Video Explicativo en 4K 60fps
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Músculo Principal: <strong style={{ color: '#ffffff' }}>{selectedVideoModal.mainMuscle}</strong> • Marca: <strong style={{ color: '#ffffff' }}>{selectedVideoModal.brand}</strong>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER DISCRETO HIGH-TECH */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '1.25rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#64748b'
      }}>
        APEX LIFE™ Bio-Fitness Intelligent Platform • Arquitectura Escalable SaaS • Conexión Segura Contabo REST API
      </footer>
    </div>
  );
};
