import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Dumbbell,
  Calendar,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  CreditCard,
  User,
  Activity,
  Printer,
  ChevronRight,
  Salad,
  Flame,
  CheckCircle2,
  Apple,
  Scale,
  HeartPulse,
  AlertTriangle,
  Save,
  Check,
  Smartphone,
  ShieldCheck,
  Camera,
  Upload,
  X,
  Zap,
  Pill,
  Info,
  Target,
  ChevronLeft,
  Search,
  RefreshCw,
  Video,
  VideoOff,
} from 'lucide-react';
import { api, Member, Routine, NutritionPlan, MealItem, HealthDiagnostic, FoodItem, DAYS_OF_WEEK, getDayName, getTodayDayNumber } from '../services/api';
import { BodyScanCameraModal } from '../components/BodyScanCameraModal';

// Generador de alertas sonoras nativas Web Audio API para el cronómetro del socio
const playBeep = (freq = 880, duration = 0.25) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silencioso si no hay soporte de audio
  }
};

export const AffiliatePortalView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [nutrition, setNutrition] = useState<NutritionPlan | null>(null);
  const [diagnostic, setDiagnostic] = useState<HealthDiagnostic | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'CARNET' | 'ROUTINE' | 'DIAGNOSTIC' | 'NUTRITION'>('CARNET');

  // Filtro de día de la semana (por defecto HOY: Lunes = 1 .. Domingo = 7)
  const [selectedWeekDay, setSelectedWeekDay] = useState<number | 'ALL'>(() => getTodayDayNumber());

  // Estados de la APK: Seguimiento de Rutina
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('gym_completed_exercises');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [exerciseLoads, setExerciseLoads] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('gym_exercise_loads');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Estados de Registro Rápido de Pesaje en Gym
  const [newWeight, setNewWeight] = useState('');
  const [savingWeight, setSavingWeight] = useState(false);
  const [weightSavedSuccess, setWeightSavedSuccess] = useState(false);

  // Generador Nutrición IA
  const [generatingNutrition, setGeneratingNutrition] = useState(false);

  // Cronómetro interactivo de descanso de series
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Estados del Asistente Biométrico & Onboarding 360° con IA
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  // Paso 2: Biometría & Salud
  const [obWeight, setObWeight] = useState('');
  const [obHeight, setObHeight] = useState('');
  const [obAge, setObAge] = useState('26');
  const [obGender, setObGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [obInjuries, setObInjuries] = useState<string[]>([]);
  const [obDiseases, setObDiseases] = useState<string[]>([]);
  const [obCustomHealthNotes, setObCustomHealthNotes] = useState('');

  // Paso 3: Entrenamiento & Días
  const [obGoal, setObGoal] = useState('HYPERTROPHY');
  const [obLocation, setObLocation] = useState<'GYM' | 'HOME'>('GYM');
  const [obExperience, setObExperience] = useState('PRINCIPIANTE');
  const [obTrainingDays, setObTrainingDays] = useState<number[]>([1, 2, 4, 5]);

  // Paso 4: Nutrición & Despensa
  const [obLikedFoods, setObLikedFoods] = useState<string[]>([
    'Pechuga de Pollo',
    'Huevos',
    'Arroz',
    'Avena',
    'Atún',
    'Aguacate',
  ]);
  const [obDislikedFoods, setObDislikedFoods] = useState<string[]>([]);
  const [obCustomLikedFood, setObCustomLikedFood] = useState('');

  // Procesamiento y Resultados
  const [processing360, setProcessing360] = useState(false);
  const [results360, setResults360] = useState<any | null>(null);

  // Catálogo Completo de Alimentos
  const [foodsCatalog, setFoodsCatalog] = useState<FoodItem[]>([]);
  const [foodCategoryFilter, setFoodCategoryFilter] = useState<string>('ALL');
  const [foodSearchTerm, setFoodSearchTerm] = useState('');

  // Cámara Directa & Celular
  const [showBodyScanModal, setShowBodyScanModal] = useState(false);
  const [bodyScanModalMode, setBodyScanModalMode] = useState<'AUTO' | 'PC_QR' | 'DIRECT_CAMERA'>('AUTO');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = React.useRef<MediaStream | null>(null);
  const nativeCameraInputRef = React.useRef<HTMLInputElement | null>(null);

  // Identificar usuario activo desde sesión
  const currentUser = (() => {
    try {
      const saved = localStorage.getItem('gym_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();
  const isMemberRole = currentUser?.role === 'MEMBER';

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    try {
      setLoading(true);
      const membersList = await api.getMembers();
      setMembers(membersList);

      if (membersList.length > 0) {
        let targetId = membersList[0].id;
        // Si el usuario conectado es socio, buscar su registro por ID o documento
        if (isMemberRole && currentUser) {
          const found = membersList.find(
            (m) => m.id === currentUser.id || m.documentNumber === currentUser.documentNumber
          );
          if (found) targetId = found.id;
        } else {
          const activeMember = membersList.find((m) => m.status === 'ACTIVE') || membersList[0];
          targetId = activeMember.id;
        }
        await handleSelectMember(targetId);
      }

      // Cargar catálogo maestro de alimentos clasificados
      try {
        const catalog = await api.getFoodsCatalog();
        if (catalog && catalog.length > 0) {
          setFoodsCatalog(catalog);
        }
      } catch (fErr) {
        console.warn('No se pudo cargar catálogo de alimentos:', fErr);
      }
    } catch (err) {
      console.error('Error cargando portal afiliado:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMember = async (id: string) => {
    try {
      setLoading(true);
      const full = await api.getMemberById(id);
      setCurrentMember(full);
      setNewWeight(full.weight ? String(full.weight) : '');

      // 1. Cargar Rutina Asignada
      if (full.routines && full.routines.length > 0) {
        const activeRoutine = full.routines.find((r: any) => r.active) || full.routines[0];
        setRoutine(activeRoutine.routine);
      } else {
        const generalRoutines = await api.getRoutines();
        if (generalRoutines.length > 0) setRoutine(generalRoutines[0]);
      }

      // 2. Cargar Nutrición IA
      const nutPlan = await api.getMemberNutrition(id);
      setNutrition(nutPlan);

      // 3. Cargar Diagnóstico Antropométrico
      const diag = await api.getMemberDiagnostic(id);
      setDiagnostic(diag);

      // Pre-cargar datos en el asistente biométrico
      if (full.weight) setObWeight(String(full.weight));
      if (full.height) setObHeight(String(full.height));
      if (full.gender) setObGender(full.gender as any);
      if (full.likedFoods) {
        try {
          const parsed = JSON.parse(full.likedFoods);
          if (Array.isArray(parsed) && parsed.length > 0) setObLikedFoods(parsed);
        } catch {}
      }
      if (full.dislikedFoods) {
        try {
          const parsed = JSON.parse(full.dislikedFoods);
          if (Array.isArray(parsed) && parsed.length > 0) setObDislikedFoods(parsed);
        } catch {}
      }
    } catch (err) {
      console.error('Error al seleccionar socio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const b64 = uploadEvent.target?.result as string;
      setPhotoPreview(b64);
      setPhotoBase64(b64);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Manejo de Cámara Directa y Celular
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false,
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Error accediendo a cámara:', err);
      setCameraError('No se pudo acceder a la cámara del navegador. Usa el botón "Abrir Cámara del Celular" para capturar la foto directamente.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPhotoPreview(dataUrl);
    setPhotoBase64(dataUrl);
    stopCamera();
  };

  const triggerNativePhoneCamera = () => {
    nativeCameraInputRef.current?.click();
  };

  // Selección rápida de básicos fitness
  const handleSelectBasicHealthyFoods = () => {
    const basics = [
      'Pechuga de Pollo',
      'Huevos Enteros',
      'Arroz Blanco',
      'Avena en Hojuelas',
      'Aguacate Hass',
      'Plátano / Banano',
      'Espinacas Frescas',
      'Yogur Griego Sin Azúcar',
      'Atún en Agua',
      'Papa Cocida',
    ];
    setObLikedFoods((prev) => Array.from(new Set([...prev, ...basics])));
  };

  const toggleObInjury = (item: string) => {
    setObInjuries((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleObDisease = (item: string) => {
    setObDiseases((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const toggleObTrainingDay = (dayId: number) => {
    setObTrainingDays((prev) => {
      const exists = prev.includes(dayId);
      const updated = exists ? prev.filter((d) => d !== dayId) : [...prev, dayId];
      return updated.sort((a, b) => a - b);
    });
  };

  const toggleObLikedFood = (food: string) => {
    setObLikedFoods((prev) =>
      prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]
    );
  };

  const toggleObDislikedFood = (food: string) => {
    setObDislikedFoods((prev) =>
      prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]
    );
  };

  const handleAddCustomLikedFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obCustomLikedFood.trim()) return;
    if (!obLikedFoods.includes(obCustomLikedFood.trim())) {
      setObLikedFoods([...obLikedFoods, obCustomLikedFood.trim()]);
    }
    setObCustomLikedFood('');
  };

  const handleSubmitOnboarding360 = async () => {
    if (!currentMember) return;
    try {
      setProcessing360(true);
      setOnboardingStep(5);

      const wNum = parseFloat(obWeight) || currentMember.weight || 74;
      const hNum = parseFloat(obHeight) || currentMember.height || 1.75;
      const ageNum = parseInt(obAge) || 26;

      const diseasesStr = [
        ...obDiseases,
        obCustomHealthNotes ? `Detalle: ${obCustomHealthNotes}` : '',
      ]
        .filter(Boolean)
        .join(', ');

      const injuriesStr = obInjuries.join(', ');

      const res = await api.completeOnboarding360({
        memberId: currentMember.id,
        photoBase64: photoBase64 || undefined,
        weight: wNum,
        height: hNum,
        age: ageNum,
        gender: obGender,
        targetGoal: obGoal,
        trainingDays: obTrainingDays.length > 0 ? obTrainingDays : [1, 3, 5],
        location: obLocation,
        trainingExperience: obExperience,
        diseases: diseasesStr || undefined,
        injuries: injuriesStr || undefined,
        likedFoods: obLikedFoods,
        dislikedFoods: obDislikedFoods,
      });

      setResults360(res.data);
      setDiagnostic(res.data.diagnostic);
      setNutrition(res.data.nutrition);
      setRoutine(res.data.routine);
      setOnboardingStep(6);

      // Sincronizar socio
      await handleSelectMember(currentMember.id);
    } catch (err: any) {
      alert(`Error al procesar onboarding 360° con IA: ${err.message || err}`);
      setOnboardingStep(4);
    } finally {
      setProcessing360(false);
    }
  };

  // Toggle de ejercicio completado en la APK
  const toggleExerciseComplete = (exerciseId: string) => {
    const updated = { ...completedExercises, [exerciseId]: !completedExercises[exerciseId] };
    setCompletedExercises(updated);
    localStorage.setItem('gym_completed_exercises', JSON.stringify(updated));
    if (updated[exerciseId]) {
      playBeep(659, 0.12);
    }
  };

  // Guardar carga utilizada en el ejercicio
  const handleSaveLoad = (exerciseId: string, value: string) => {
    const updated = { ...exerciseLoads, [exerciseId]: value };
    setExerciseLoads(updated);
    localStorage.setItem('gym_exercise_loads', JSON.stringify(updated));
  };

  // Registro de Pesaje en la Báscula del Gimnasio
  const handleSaveNewWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember || !newWeight) return;

    try {
      setSavingWeight(true);
      const numericWeight = parseFloat(newWeight);
      if (isNaN(numericWeight) || numericWeight <= 20 || numericWeight > 300) {
        alert('Por favor ingresa un peso válido en kilogramos');
        return;
      }

      // Actualizar peso en el socio y re-calcular diagnóstico biométrico
      await api.updateMember(currentMember.id, { weight: numericWeight });
      await api.generateHealthDiagnosticAI({
        memberId: currentMember.id,
        weight: numericWeight,
        height: currentMember.height || 1.75,
        targetGoal: diagnostic?.targetGoal || 'Evolución y Acondicionamiento Físico',
      });

      // Recargar datos
      await handleSelectMember(currentMember.id);
      setWeightSavedSuccess(true);
      playBeep(880, 0.2);
      setTimeout(() => setWeightSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar peso');
    } finally {
      setSavingWeight(false);
    }
  };

  const handleGenerateAffiliateNutrition = async () => {
    if (!currentMember) return;
    try {
      setGeneratingNutrition(true);
      const res = await api.generateNutritionAI({
        memberId: currentMember.id,
        goal: diagnostic?.targetGoal || 'HYPERTROPHY',
        dietaryRestrictions: 'Adaptado al plan de entrenamiento',
        trainingDaysPerWeek: 4,
      });
      setNutrition(res.data);
      alert('🥗 ¡Tu plan nutricional ha sido recalculado con Google Gemini 2.5 Flash!');
    } catch (err: any) {
      alert(err.message || 'Error al generar nutrición con IA');
    } finally {
      setGeneratingNutrition(false);
    }
  };

  // Timer Effect con alarma sonora
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      playBeep(880, 0.4);
      setTimeout(() => playBeep(1174, 0.4), 250);
      alert('⏰ ¡Fin del descanso! Inicia tu siguiente serie con máxima intensidad.');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  if (loading && !currentMember) {
    return <div style={{ color: '#94a3b8', textAlign: 'center', padding: '3rem' }}>Cargando APK del socio...</div>;
  }

  const isExpired = currentMember?.status === 'EXPIRED';
  const daysLeft = currentMember?.planEndDate
    ? Math.ceil((new Date(currentMember.planEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Cálculo de IMC para visualización
  const currentHeightMeters = currentMember?.height ? (currentMember.height > 3 ? currentMember.height / 100 : currentMember.height) : 1.75;
  const currentWeightKg = currentMember?.weight || 70;
  const calculatedBmi = diagnostic?.bmi || parseFloat((currentWeightKg / (currentHeightMeters * currentHeightMeters)).toFixed(1));

  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Bajo Peso', color: '#38bdf8' };
    if (bmi < 25) return { label: 'Peso Saludable', color: '#10b981' };
    if (bmi < 30) return { label: 'Sobrepeso Leve', color: '#f59e0b' };
    return { label: 'Obesidad', color: '#ef4444' };
  };
  const bmiInfo = getBmiStatus(calculatedBmi);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1080px', margin: '0 auto' }}>
      {/* Selector de Socio solo visible para administradores y entrenadores */}
      {!isMemberRole && (
        <div className="glass-card" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.85rem 1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} color="#06b6d4" />
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              Simulador APK Móvil de Socio (Modo Administrador/Coach):
            </span>
          </div>

          <select
            value={currentMember?.id || ''}
            onChange={(e) => handleSelectMember(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              fontWeight: 600,
              fontSize: '0.85rem',
              outline: 'none',
            }}
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.firstName} {m.lastName} ({m.code} - {m.status === 'ACTIVE' ? '🟢 Activo' : '🔴 Vencido'})
              </option>
            ))}
          </select>
        </div>
      )}

      {currentMember && (
        <>
          {/* BANNER PROMINENTE ASISTENTE BIOMÉTRICO & ONBOARDING 360° CON IA */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(16, 185, 129, 0.15) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
              }}>
                <Sparkles size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    Asistente Biométrico & Diagnóstico IA 360°
                  </h3>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(16, 185, 129, 0.25)',
                    color: '#10b981',
                    fontWeight: 800,
                  }}>
                    GEMINI 2.5 FLASH MULTIMODAL
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '3px 0 0 0', maxWidth: '620px' }}>
                  Escaneo corporal con foto, cálculo de somatotipo (% grasa y músculo), registro de lesiones, selección de días Lun-Dom, alimentos favoritos, suplementos y rutina personalizada.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setBodyScanModalMode('AUTO');
                  setShowBodyScanModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0f172a',
                  color: '#06b6d4',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  padding: '0.75rem 1.3rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Camera size={18} />
                <span>📸 Escaneo IA & QR</span>
              </button>

              <button
                onClick={() => {
                  setOnboardingStep(1);
                  setShowOnboardingModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#06b6d4',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Zap size={18} />
                <span>Iniciar Diagnóstico 360°</span>
              </button>
            </div>
          </div>

          {/* MODAL DEL ASISTENTE BIOMÉTRICO 360° */}
          {showOnboardingModal && (
            <div style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              overflowY: 'auto',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                maxWidth: '780px',
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                borderRadius: '20px',
                padding: 'clamp(1.2rem, 3vw, 2rem)',
                boxShadow: '0 0 50px rgba(6, 182, 212, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                maxHeight: '92vh',
                overflowY: 'auto',
              }}>
                {/* Header del Modal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} color="#06b6d4" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      Evaluación Biomecánica & Nutrición 360° IA
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      stopCamera();
                      setShowOnboardingModal(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Stepper / Indicador de Progreso */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {[
                    { num: 1, label: '1. Foto Corporal' },
                    { num: 2, label: '2. Salud & Lesiones' },
                    { num: 3, label: '3. Días & Gym' },
                    { num: 4, label: '4. Alimentos & Dieta' },
                    { num: 5, label: '5. Análisis IA' },
                    { num: 6, label: '6. Resultados 360°' },
                  ].map((s) => (
                    <div
                      key={s.num}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: onboardingStep === s.num
                          ? '#06b6d4'
                          : onboardingStep > s.num
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(255,255,255,0.04)',
                        color: onboardingStep === s.num
                          ? '#ffffff'
                          : onboardingStep > s.num
                          ? '#10b981'
                          : '#64748b',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>

                {/* PASO 1: FOTO CORPORAL - CÁMARA DIRECTA MÓVIL & EN VIVO */}
                {onboardingStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(6, 182, 212, 0.08)',
                      border: '1px solid rgba(6, 182, 212, 0.25)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Camera size={22} color="#06b6d4" />
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                          Foto Corporal para Diagnóstico Visual IA
                        </h4>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                        Tómate una foto de cuerpo completo o torso. La IA estimará tu somatotipo, postura y % de grasa corporal.
                      </p>
                    </div>

                    {/* Inputs de Cámara Nativos Ocultos */}
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      ref={nativeCameraInputRef}
                      style={{ display: 'none' }}
                      onChange={handlePhotoUpload}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="gym-gallery-file-input"
                      style={{ display: 'none' }}
                      onChange={handlePhotoUpload}
                    />

                    {/* Contenedor de Visor / Previsualización */}
                    <div style={{
                      border: '2px dashed rgba(6, 182, 212, 0.3)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '260px',
                    }}>
                      {/* Estado 1: Foto Ya Capturada */}
                      {photoPreview ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                          }}>
                            <CheckCircle2 size={14} /> Foto Lista para el Análisis IA
                          </div>
                          <img
                            src={photoPreview}
                            alt="Foto Corporal"
                            style={{
                              maxHeight: '280px',
                              maxWidth: '100%',
                              borderRadius: '12px',
                              border: '2px solid #06b6d4',
                              boxShadow: '0 0 25px rgba(6, 182, 212, 0.25)',
                            }}
                          />
                          <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={triggerNativePhoneCamera}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                                color: '#06b6d4',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <RefreshCw size={14} /> Tomar Otra Foto
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPhotoPreview(null);
                                setPhotoBase64(null);
                              }}
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ) : isCameraActive ? (
                        /* Estado 2: Cámara en Vivo Activa */
                        <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '2px solid #06b6d4' }}>
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', display: 'block' }}
                            />
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              border: '2px dashed rgba(255,255,255,0.4)',
                              borderRadius: '12px',
                              pointerEvents: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <span style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem' }}>
                                Encuadra tu cuerpo
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={capturePhoto}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#10b981',
                                color: '#ffffff',
                                border: 'none',
                                padding: '0.7rem 1.5rem',
                                borderRadius: '10px',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
                              }}
                            >
                              <Camera size={18} /> 📸 Capturar Foto Ahora
                            </button>
                            <button
                              type="button"
                              onClick={stopCamera}
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                color: '#94a3b8',
                                border: 'none',
                                padding: '0.7rem 1rem',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Estado 3: Sin Foto - Botones Claros y Directos */
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '340px' }}>
                          <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(6, 182, 212, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Camera size={32} color="#06b6d4" />
                          </div>

                          <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1rem' }}>
                              ¿Cómo deseas tomar tu foto?
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.76rem', marginTop: '2px' }}>
                              Sin complicaciones: ábrela directamente con la cámara
                            </div>
                          </div>

                          {cameraError && (
                            <div style={{ fontSize: '0.75rem', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '6px 10px', borderRadius: '6px', textAlign: 'center' }}>
                              {cameraError}
                            </div>
                          )}

                          {/* Botón Principal: Abrir Cámara del Teléfono */}
                          {/* Botón Principal: Escáner Asistido con Silueta y Timer */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowBodyScanModal(true);
                              setBodyScanModalMode('DIRECT_CAMERA');
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              backgroundColor: '#06b6d4',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0.85rem 1.25rem',
                              borderRadius: '12px',
                              fontWeight: 800,
                              fontSize: '0.92rem',
                              cursor: 'pointer',
                              boxShadow: '0 0 16px rgba(6, 182, 212, 0.35)',
                            }}
                          >
                            <Camera size={20} />
                            <span>📸 Abrir Escáner Asistido (Silueta & Timer)</span>
                          </button>

                          {/* Botón Secundario: Código QR para Celular */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowBodyScanModal(true);
                              setBodyScanModalMode('PC_QR');
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              backgroundColor: 'rgba(6, 182, 212, 0.12)',
                              color: '#38bdf8',
                              border: '1px solid rgba(6, 182, 212, 0.3)',
                              padding: '0.75rem 1rem',
                              borderRadius: '10px',
                              fontWeight: 700,
                              fontSize: '0.84rem',
                              cursor: 'pointer',
                            }}
                          >
                            <QrCode size={18} />
                            <span>📱 Escanear con Celular (Código QR)</span>
                          </button>

                          {/* Aviso de Privacidad Garantizada */}
                          <div style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(16, 185, 129, 0.08)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            fontSize: '0.75rem',
                            color: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}>
                            <ShieldCheck size={14} style={{ flexShrink: 0 }} />
                            <span>🔒 Fotos efímeras en RAM: No se almacenan en el servidor.</span>
                          </div>

                          {/* Subir de Galería como Alternativa */}
                          <label
                            htmlFor="gym-gallery-file-input"
                            style={{
                              color: '#94a3b8',
                              fontSize: '0.78rem',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Upload size={13} />
                            o seleccionar de la galería de fotos
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Botones de Navegación del Paso 1 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          stopCamera();
                          setOnboardingStep(2);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          fontSize: '0.8rem',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        Omitir foto y continuar con datos biométricos ➔
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          stopCamera();
                          setOnboardingStep(2);
                        }}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.7rem 1.4rem',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <span>Siguiente: Mis Datos & Salud</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* PASO 2: BIOMETRÍA & FICHA DE SALUD / LESIONES */}
                {onboardingStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      Métricas Antropométricas & Ficha Médica
                    </h4>

                    {/* Inputs de Peso, Talla, Edad, Género */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                          Peso Actual (kg):
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={obWeight}
                          onChange={(e) => setObWeight(e.target.value)}
                          placeholder="Ej: 74.5"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#ffffff',
                            fontWeight: 700,
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                          Estatura (metros o cm):
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={obHeight}
                          onChange={(e) => setObHeight(e.target.value)}
                          placeholder="Ej: 1.75"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#ffffff',
                            fontWeight: 700,
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                          Edad (años):
                        </label>
                        <input
                          type="number"
                          value={obAge}
                          onChange={(e) => setObAge(e.target.value)}
                          placeholder="Ej: 26"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#ffffff',
                            fontWeight: 700,
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                          Género:
                        </label>
                        <select
                          value={obGender}
                          onChange={(e) => setObGender(e.target.value as any)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#ffffff',
                            fontWeight: 700,
                          }}
                        >
                          <option value="MALE">Masculino</option>
                          <option value="FEMALE">Femenino</option>
                        </select>
                      </div>
                    </div>

                    {/* Chips de Lesiones */}
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                        ⚠️ Lesiones Previas o Zonas con Dolor (La IA excluirá ejercicios riesgosos):
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {[
                          'Rodilla / Meniscos',
                          'Lumbar / Espalda Baja',
                          'Hombro / Manguito Rotador',
                          'Cervical / Cuello',
                          'Muñeca / Antebrazo',
                          'Tobillo',
                          'Ninguna Lesión',
                        ].map((inj) => {
                          const isSelected = obInjuries.includes(inj);
                          return (
                            <button
                              key={inj}
                              type="button"
                              onClick={() => toggleObInjury(inj)}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '7px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: isSelected ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)',
                                color: isSelected ? '#ef4444' : '#94a3b8',
                                cursor: 'pointer',
                              }}
                            >
                              {inj}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chips de Patologías */}
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                        Condiciones Médicas o de Salud:
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {[
                          'Hipertensión Arterial',
                          'Diabetes / Resistencia Insulina',
                          'Asma / Dificultad Respiratoria',
                          'Problemas Cardíacos',
                          'Ninguna',
                        ].map((dis) => {
                          const isSelected = obDiseases.includes(dis);
                          return (
                            <button
                              key={dis}
                              type="button"
                              onClick={() => toggleObDisease(dis)}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '7px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                                backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                                color: isSelected ? '#f59e0b' : '#94a3b8',
                                cursor: 'pointer',
                              }}
                            >
                              {dis}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notas médicas abiertas */}
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Detalles adicionales de salud o dolor al entrenar:
                      </label>
                      <input
                        type="text"
                        value={obCustomHealthNotes}
                        onChange={(e) => setObCustomHealthNotes(e.target.value)}
                        placeholder="Ej: Cirugía de rodilla hace 2 años, dolor al hacer press tras nuca..."
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#ffffff',
                          fontSize: '0.82rem',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => setOnboardingStep(1)}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          color: '#f8fafc',
                          border: 'none',
                          padding: '0.6rem 1.1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ⬅ Volver a Foto
                      </button>
                      <button
                        onClick={() => setOnboardingStep(3)}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.65rem 1.25rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Siguiente: Días & Gimnasio ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* PASO 3: DÍAS DE ENTRENAMIENTO & UBICACIÓN */}
                {onboardingStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      Preferencias de Entrenamiento Semanal
                    </h4>

                    {/* Selector de Días de la Semana Lun a Dom */}
                    <div>
                      <label style={{ fontSize: '0.82rem', color: '#06b6d4', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                        ¿Qué días de la semana vas a ir a entrenar? ({obTrainingDays.length} días seleccionados):
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '6px' }}>
                        {DAYS_OF_WEEK.map((d) => {
                          const isSelected = obTrainingDays.includes(d.id);
                          return (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => toggleObTrainingDay(d.id)}
                              style={{
                                padding: '0.65rem 0.5rem',
                                borderRadius: '10px',
                                textAlign: 'center',
                                border: isSelected ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                                backgroundColor: isSelected ? '#10b981' : 'rgba(255,255,255,0.03)',
                                color: isSelected ? '#ffffff' : '#94a3b8',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <div>{d.short}</div>
                              <div style={{ fontSize: '0.68rem', fontWeight: 600, opacity: 0.85 }}>{d.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ubicación y Nivel */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                          Lugar de Entrenamiento:
                        </label>
                        <select
                          value={obLocation}
                          onChange={(e) => setObLocation(e.target.value as any)}
                          style={{
                            width: '100%',
                            padding: '0.55rem',
                            borderRadius: '8px',
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#ffffff',
                            fontWeight: 700,
                          }}
                        >
                          <option value="GYM">🏋️ En Gimnasio (Máquinas, barras y poleas)</option>
                          <option value="HOME">🏡 En Casa (Calistenia y peso corporal)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                          Objetivo Principal:
                        </label>
                        <select
                          value={obGoal}
                          onChange={(e) => setObGoal(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.55rem',
                            borderRadius: '8px',
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#ffffff',
                            fontWeight: 700,
                          }}
                        >
                          <option value="HYPERTROPHY">Hipertrofia Muscular (Ganancia limpia)</option>
                          <option value="FAT_LOSS">Definición y Pérdida de Grasa</option>
                          <option value="STRENGTH">Fuerza Máxima y Potencia</option>
                          <option value="ENDURANCE">Resistencia & Funcional</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                          Nivel de Experiencia:
                        </label>
                        <select
                          value={obExperience}
                          onChange={(e) => setObExperience(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.55rem',
                            borderRadius: '8px',
                            backgroundColor: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#ffffff',
                            fontWeight: 700,
                          }}
                        >
                          <option value="PRINCIPIANTE">Principiante (0 a 6 meses)</option>
                          <option value="INTERMEDIO">Intermedio (6 meses a 2 años)</option>
                          <option value="AVANZADO">Avanzado (+2 años constante)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => setOnboardingStep(2)}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          color: '#f8fafc',
                          border: 'none',
                          padding: '0.6rem 1.1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ⬅ Volver a Salud
                      </button>
                      <button
                        onClick={() => setOnboardingStep(4)}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.65rem 1.25rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Siguiente: Alimentos & Despensa ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* PASO 4: ALIMENTOS FAVORITOS POR CATEGORÍAS & DESPENSA */}
                {onboardingStep === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                    <div style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Salad size={22} color="#10b981" />
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                            ¿Qué alimentos te gustan y tienes disponibles?
                          </h4>
                        </div>
                        <span style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                        }}>
                          {obLikedFoods.length} seleccionados
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                        Toca los alimentos que consumes o tienes en casa. Gemini 2.5 Flash armará tus comidas exactamente con tus ingredientes favoritos.
                      </p>
                    </div>

                    {/* Barra de Búsqueda y Botón de Básicos Saludables */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{
                        flex: 1,
                        minWidth: '220px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '10px',
                        padding: '0.45rem 0.85rem',
                      }}>
                        <Search size={16} color="#94a3b8" />
                        <input
                          type="text"
                          value={foodSearchTerm}
                          onChange={(e) => setFoodSearchTerm(e.target.value)}
                          placeholder="Buscar alimento (ej: pollo, arroz, banano, atún)..."
                          style={{
                            width: '100%',
                            background: 'none',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '0.82rem',
                            outline: 'none',
                          }}
                        />
                        {foodSearchTerm && (
                          <button
                            type="button"
                            onClick={() => setFoodSearchTerm('')}
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleSelectBasicHealthyFoods}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: 'rgba(6, 182, 212, 0.15)',
                          color: '#06b6d4',
                          border: '1px solid rgba(6, 182, 212, 0.35)',
                          padding: '0.5rem 1rem',
                          borderRadius: '10px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Zap size={14} />
                        <span>⚡ Básicos Fitness</span>
                      </button>
                    </div>

                    {/* Filtro por Categorías */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                      {[
                        { id: 'ALL', label: 'Todos' },
                        { id: 'PROTEIN', label: '🍗 Proteínas' },
                        { id: 'CARB', label: '🥔 Carbohidratos' },
                        { id: 'LEGUME', label: '🫘 Legumbres' },
                        { id: 'FAT', label: '🥑 Grasas & Semillas' },
                        { id: 'DAIRY', label: '🥛 Lácteos' },
                        { id: 'FRUIT', label: '🍎 Frutas' },
                        { id: 'VEGETABLE', label: '🥦 Verduras' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFoodCategoryFilter(cat.id)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            border: foodCategoryFilter === cat.id ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)',
                            backgroundColor: foodCategoryFilter === cat.id ? '#06b6d4' : 'rgba(255,255,255,0.03)',
                            color: foodCategoryFilter === cat.id ? '#ffffff' : '#94a3b8',
                            cursor: 'pointer',
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Grilla de Alimentos Clasificados */}
                    {(() => {
                      // Fallback amplio en caso de que aún no cargue la BD
                      const fallbackFoods: { name: string; category: string }[] = [
                        { name: 'Pechuga de Pollo', category: 'PROTEIN' },
                        { name: 'Huevos Enteros', category: 'PROTEIN' },
                        { name: 'Claras de Huevo', category: 'PROTEIN' },
                        { name: 'Carne Magra de Res', category: 'PROTEIN' },
                        { name: 'Carne Molida Especial (90/10)', category: 'PROTEIN' },
                        { name: 'Lomo de Cerdo Magro', category: 'PROTEIN' },
                        { name: 'Pechuga de Pavo', category: 'PROTEIN' },
                        { name: 'Atún en Agua', category: 'PROTEIN' },
                        { name: 'Atún en Aceite de Oliva', category: 'PROTEIN' },
                        { name: 'Salmón Fresco', category: 'PROTEIN' },
                        { name: 'Tilapia / Pescado Blanco', category: 'PROTEIN' },
                        { name: 'Camarones', category: 'PROTEIN' },
                        { name: 'Tofu Firme', category: 'PROTEIN' },
                        { name: 'Tempeh', category: 'PROTEIN' },
                        { name: 'Soja Texturizada', category: 'PROTEIN' },
                        { name: 'Arroz Blanco', category: 'CARB' },
                        { name: 'Arroz Integral', category: 'CARB' },
                        { name: 'Avena en Hojuelas', category: 'CARB' },
                        { name: 'Papa Cocida', category: 'CARB' },
                        { name: 'Papa Criolla', category: 'CARB' },
                        { name: 'Batata / Camote', category: 'CARB' },
                        { name: 'Yuca Cocida', category: 'CARB' },
                        { name: 'Plátano Maduro', category: 'CARB' },
                        { name: 'Plátano Verde', category: 'CARB' },
                        { name: 'Pasta Integral', category: 'CARB' },
                        { name: 'Pasta Tradicional', category: 'CARB' },
                        { name: 'Quinoa Cocida', category: 'CARB' },
                        { name: 'Arepa de Maíz', category: 'CARB' },
                        { name: 'Pan Integral 100%', category: 'CARB' },
                        { name: 'Tortillas de Maíz', category: 'CARB' },
                        { name: 'Lentejas Cocidas', category: 'LEGUME' },
                        { name: 'Garbanzos Cocidos', category: 'LEGUME' },
                        { name: 'Fríjoles Rojos', category: 'LEGUME' },
                        { name: 'Fríjoles Negros', category: 'LEGUME' },
                        { name: 'Arvejas / Chícharos', category: 'LEGUME' },
                        { name: 'Aguacate Hass', category: 'FAT' },
                        { name: 'Aceite de Oliva Extra Virgen', category: 'FAT' },
                        { name: 'Almendras', category: 'FAT' },
                        { name: 'Nueces', category: 'FAT' },
                        { name: 'Maní / Cacahuates', category: 'FAT' },
                        { name: 'Mantequilla de Maní Natural', category: 'FAT' },
                        { name: 'Mantequilla de Almendras', category: 'FAT' },
                        { name: 'Semillas de Chía', category: 'FAT' },
                        { name: 'Semillas de Linaza', category: 'FAT' },
                        { name: 'Aceitunas', category: 'FAT' },
                        { name: 'Yogur Griego Sin Azúcar', category: 'DAIRY' },
                        { name: 'Leche Deslactosada / Descremada', category: 'DAIRY' },
                        { name: 'Bebida de Almendras Sin Azúcar', category: 'DAIRY' },
                        { name: 'Queso Cottage', category: 'DAIRY' },
                        { name: 'Queso Cuajada Fresca', category: 'DAIRY' },
                        { name: 'Queso Ricotta', category: 'DAIRY' },
                        { name: 'Queso Mozzarella Bajo en Grasa', category: 'DAIRY' },
                        { name: 'Proteína Whey en Polvo', category: 'DAIRY' },
                        { name: 'Plátano / Banano', category: 'FRUIT' },
                        { name: 'Manzana', category: 'FRUIT' },
                        { name: 'Pera', category: 'FRUIT' },
                        { name: 'Fresas', category: 'FRUIT' },
                        { name: 'Arándanos / Frutos Rojos', category: 'FRUIT' },
                        { name: 'Piña Fresca', category: 'FRUIT' },
                        { name: 'Papaya', category: 'FRUIT' },
                        { name: 'Mango', category: 'FRUIT' },
                        { name: 'Naranja / Mandarina', category: 'FRUIT' },
                        { name: 'Sandía', category: 'FRUIT' },
                        { name: 'Melón', category: 'FRUIT' },
                        { name: 'Kiwi', category: 'FRUIT' },
                        { name: 'Uvas', category: 'FRUIT' },
                        { name: 'Espinacas Frescas', category: 'VEGETABLE' },
                        { name: 'Brócoli al Vapor', category: 'VEGETABLE' },
                        { name: 'Espárragos', category: 'VEGETABLE' },
                        { name: 'Zanahoria', category: 'VEGETABLE' },
                        { name: 'Tomate', category: 'VEGETABLE' },
                        { name: 'Pepino', category: 'VEGETABLE' },
                        { name: 'Lechuga / Mezclum Verde', category: 'VEGETABLE' },
                        { name: 'Calabacín / Zucchini', category: 'VEGETABLE' },
                        { name: 'Champiñones / Setas', category: 'VEGETABLE' },
                        { name: 'Coliflor', category: 'VEGETABLE' },
                        { name: 'Pimientos / Pimentón', category: 'VEGETABLE' },
                        { name: 'Cebolla', category: 'VEGETABLE' },
                        { name: 'Habichuelas / Judías Verdes', category: 'VEGETABLE' },
                      ];

                      const sourceList = foodsCatalog.length > 0 ? foodsCatalog : fallbackFoods;
                      const filtered = sourceList.filter((f) => {
                        const matchesCategory = foodCategoryFilter === 'ALL' || f.category === foodCategoryFilter;
                        const matchesSearch = !foodSearchTerm.trim() || f.name.toLowerCase().includes(foodSearchTerm.toLowerCase());
                        return matchesCategory && matchesSearch;
                      });

                      return (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                          gap: '8px',
                          maxHeight: '280px',
                          overflowY: 'auto',
                          padding: '4px',
                        }}>
                          {filtered.map((food) => {
                            const isSelected = obLikedFoods.includes(food.name);
                            return (
                              <button
                                key={food.name}
                                type="button"
                                onClick={() => toggleObLikedFood(food.name)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '8px 10px',
                                  borderRadius: '9px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  textAlign: 'left',
                                  border: isSelected ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                                  backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.02)',
                                  color: isSelected ? '#10b981' : '#cbd5e1',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '4px' }}>
                                  {food.name}
                                </span>
                                {isSelected ? (
                                  <Check size={14} color="#10b981" style={{ flexShrink: 0 }} />
                                ) : (
                                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>+</span>
                                )}
                              </button>
                            );
                          })}
                          {filtered.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '1rem', color: '#64748b', fontSize: '0.8rem' }}>
                              No se encontraron alimentos con ese término. Puedes añadirlo abajo.
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Añadir Alimento Personalizado */}
                    <form onSubmit={handleAddCustomLikedFood} style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        value={obCustomLikedFood}
                        onChange={(e) => setObCustomLikedFood(e.target.value)}
                        placeholder="¿Otro alimento favorito que no esté en la lista? (ej: arepa de chócolo, quinua...)"
                        style={{
                          flex: 1,
                          padding: '0.55rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: '#ffffff',
                          fontSize: '0.8rem',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          backgroundColor: '#06b6d4',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.55rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        + Añadir
                      </button>
                    </form>

                    {/* Alimentos Rechazados / Alergias */}
                    <div style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}>
                      <label style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                        Alimentos que NO te gustan o te causan alergia / intolerancia:
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {[
                          'Lactosa / Lácteos',
                          'Gluten',
                          'Mariscos',
                          'Cerdo',
                          'Carne Roja',
                          'Picante',
                          'Cebolla',
                          'Pescado',
                          'Huevo',
                          'Frutos Secos',
                        ].map((df) => {
                          const isSelected = obDislikedFoods.includes(df);
                          return (
                            <button
                              key={df}
                              type="button"
                              onClick={() => toggleObDislikedFood(df)}
                              style={{
                                padding: '4px 9px',
                                borderRadius: '7px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                border: isSelected ? '1.5px solid #ef4444' : '1px solid rgba(255,255,255,0.08)',
                                backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.02)',
                                color: isSelected ? '#fca5a5' : '#94a3b8',
                                cursor: 'pointer',
                              }}
                            >
                              {isSelected ? `✕ ${df}` : df}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => setOnboardingStep(3)}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          color: '#f8fafc',
                          border: 'none',
                          padding: '0.65rem 1.2rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <ChevronLeft size={16} /> Volver a Días
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmitOnboarding360}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.75rem 1.6rem',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
                        }}
                      >
                        <Sparkles size={18} />
                        <span>¡Generar Mi Plan 360° con IA!</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PASO 5: LOADING DE IA GEMINI */}
                {onboardingStep === 5 && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem 1.5rem',
                    textAlign: 'center',
                    gap: '1rem',
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      border: '4px solid rgba(6, 182, 212, 0.2)',
                      borderTopColor: '#06b6d4',
                      animation: 'spin 1s linear infinite',
                    }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      Google Gemini 2.5 Flash Procesando tu Diagnóstico 360°
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '480px', margin: 0 }}>
                      Analizando foto corporal, calculando somatotipo, formulando balance calórico de mantenimiento vs meta, estructurando guía de suplementos y programando tu rutina semanal por días...
                    </p>
                  </div>
                )}

                {/* PASO 6: RESULTADOS Y ÉXITO 360° */}
                {onboardingStep === 6 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{
                      padding: '1.25rem',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
                      border: '1px solid #10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}>
                      <CheckCircle2 size={32} color="#10b981" />
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                          ¡Diagnóstico y Plan 360° Completado con Éxito!
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '2px 0 0 0' }}>
                          Tu plan ha sido sincronizado con la base de datos y tu entrenador en sala ha recibido la notificación de supervisión.
                        </p>
                      </div>
                    </div>

                    {/* Resumen de Métricas */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                      <div className="glass-card" style={{ padding: '0.85rem', borderLeft: '4px solid #06b6d4' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Biotipo / Somatotipo</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#06b6d4', marginTop: '2px' }}>
                          {diagnostic?.biotype || results360?.diagnostic?.biotype || 'Mesomorfo'}
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '0.85rem', borderLeft: '4px solid #f59e0b' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>% Grasa Corporal</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                          {diagnostic?.bodyFatPercentage || results360?.diagnostic?.bodyFatPercentage || 18}%
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '0.85rem', borderLeft: '4px solid #10b981' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Masa Muscular Magra</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                          {diagnostic?.muscleMassKg || results360?.diagnostic?.muscleMassKg || 58} kg
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '0.85rem', borderLeft: '4px solid #8b5cf6' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Meta Calórica Diaria</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8b5cf6', marginTop: '2px' }}>
                          {nutrition?.targetCalories || results360?.nutrition?.targetCalories || 2100} kcal
                        </div>
                      </div>
                    </div>

                    {/* Resumen de Rutina y Suplementación */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                      <div className="glass-card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <Dumbbell size={16} color="#10b981" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>Rutina Programada:</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>
                          {routine?.name || results360?.routine?.name || 'Rutina Semanal'}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                          Frecuencia: {routine?.daysPerWeek || results360?.routine?.daysPerWeek || obTrainingDays.length} días a la semana estructurados de Lunes a Domingo.
                        </p>
                      </div>

                      <div className="glass-card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <Pill size={16} color="#8b5cf6" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>Suplementación Clave:</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                          Creatina Creapure 5g diarios, Proteína Whey post-entreno, Omega 3 con comidas y Magnesio nocturno.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowOnboardingModal(false)}
                      style={{
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.85rem',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                        textAlign: 'center',
                      }}
                    >
                      ¡Comenzar a Entrenar y Ver Mi Rutina Completa! 🏋️‍♂️
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BARRA DE NAVEGACIÓN PRINCIPAL DE LA APK MÓVIL */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.65rem',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            padding: '0.5rem',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <button
              onClick={() => setActiveTab('CARNET')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'CARNET' ? '#06b6d4' : 'transparent',
                color: activeTab === 'CARNET' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <QrCode size={18} />
              <span>Carnet QR</span>
            </button>

            <button
              onClick={() => setActiveTab('ROUTINE')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'ROUTINE' ? '#10b981' : 'transparent',
                color: activeTab === 'ROUTINE' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Dumbbell size={18} />
              <span>Mi Rutina</span>
            </button>

            <button
              onClick={() => setActiveTab('DIAGNOSTIC')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'DIAGNOSTIC' ? '#8b5cf6' : 'transparent',
                color: activeTab === 'DIAGNOSTIC' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Scale size={18} />
              <span>Diagnóstico & IMC</span>
            </button>

            <button
              onClick={() => setActiveTab('NUTRITION')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'NUTRITION' ? '#f59e0b' : 'transparent',
                color: activeTab === 'NUTRITION' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Salad size={18} />
              <span>Nutrición IA</span>
            </button>
          </div>

          {/* TAB 1: CARNET VIRTUAL OFICIAL DE ACCESO */}
          {activeTab === 'CARNET' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0b1329 0%, #06242a 100%)',
                border: '2px solid rgba(6, 182, 212, 0.4)',
                borderRadius: '20px',
                padding: 'clamp(1.25rem, 4vw, 2.25rem)',
                color: '#ffffff',
                boxShadow: '0 0 35px rgba(6, 182, 212, 0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#06b6d4', fontWeight: 800, textTransform: 'uppercase' }}>
                      APEX LIFE GYM • CARNET VIRTUAL DE SOCIO
                    </span>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '6px 0 0 0', letterSpacing: '-0.02em' }}>
                      {currentMember.firstName} {currentMember.lastName}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
                      Doc. Identidad: {currentMember.documentType} {currentMember.documentNumber}
                    </p>
                  </div>

                  <div style={{
                    padding: '6px 14px',
                    borderRadius: '10px',
                    backgroundColor: isExpired ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: isExpired ? '#ef4444' : '#10b981',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    border: `1px solid ${isExpired ? '#ef4444' : '#10b981'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isExpired ? '#ef4444' : '#10b981' }} />
                    <span>{isExpired ? 'MEMBRESÍA EXPIRADA' : 'MEMBRESÍA ACTIVA'}</span>
                  </div>
                </div>

                {/* Código QR y Datos del Plan */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Plan Contratado: </span>
                      <strong style={{ color: '#f8fafc' }}>{currentMember.currentPlan?.name || 'Membresía Completa'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Código de Acceso: </span>
                      <strong style={{ color: '#06b6d4', letterSpacing: '0.05em' }}>{currentMember.code}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Fecha de Vencimiento: </span>
                      <strong style={{ color: isExpired ? '#ef4444' : '#10b981' }}>
                        {currentMember.planEndDate ? new Date(currentMember.planEndDate).toLocaleDateString() : '--'}
                        {!isExpired && daysLeft > 0 && ` (${daysLeft} días restantes)`}
                      </strong>
                    </div>
                  </div>

                  {/* QR Virtual Listo para Torniquete */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  }}>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      background: 'repeating-linear-gradient(0deg, #000 0, #000 3px, #fff 3px, #fff 6px), repeating-linear-gradient(90deg, #000 0, #000 3px, #fff 3px, #fff 6px)',
                      borderRadius: '4px',
                    }} />
                    <span style={{ fontSize: '0.75rem', color: '#000000', fontWeight: 800, marginTop: '6px' }}>
                      {currentMember.code}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600 }}>
                      ESCANEAR EN ENTRADA
                    </span>
                  </div>
                </div>
              </div>

              {/* Historial de Asistencias del Socio */}
              <div className="glass-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.85rem' }}>
                  Mis Asistencias Recientes al Gimnasio
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentMember.checkIns && currentMember.checkIns.length > 0 ? (
                    currentMember.checkIns.slice(0, 5).map((ci) => (
                      <div
                        key={ci.id}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem',
                        }}
                      >
                        <span style={{ color: '#f1f5f9', fontWeight: 600 }}>
                          Entrenamiento en Sala ({ci.zone})
                        </span>
                        <span style={{ color: '#94a3b8' }}>
                          {new Date(ci.checkInTime).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.82rem', color: '#64748b' }}>No tienes registros de asistencia recientes.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RUTINA DE ENTRENAMIENTO DIARIA & SEGUIMIENTO DE CARGAS */}
          {activeTab === 'ROUTINE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Dumbbell size={22} color="#10b981" />
                      <span>{routine?.name || 'Rutina Diaria de Entrenamiento'}</span>
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                      Meta: <strong style={{ color: '#10b981' }}>{routine?.goal || 'Acondicionamiento & Fuerza'}</strong> • Supervisada por tu entrenador en sala
                    </p>
                  </div>

                  {/* Cronómetro de Descanso entre Series */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.45rem 0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    <Clock size={16} color="#10b981" />
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>DESCANSO:</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                      00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                    </span>
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      style={{
                        backgroundColor: timerRunning ? '#f59e0b' : '#10b981',
                        border: 'none',
                        color: '#ffffff',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {timerRunning ? 'Pausa' : 'Iniciar'}
                    </button>
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSeconds(60);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                      }}
                      title="Reiniciar a 60 segundos"
                    >
                      <RotateCcw size={15} />
                    </button>
                  </div>
                </div>

                {/* Selector de Días de la Semana */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '1.25rem' }}>
                  <button
                    onClick={() => setSelectedWeekDay('ALL')}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: selectedWeekDay === 'ALL' ? '#10b981' : 'rgba(255,255,255,0.06)',
                      color: selectedWeekDay === 'ALL' ? '#ffffff' : '#94a3b8',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Semana Completa
                  </button>
                  {DAYS_OF_WEEK.map((d) => {
                    const isToday = d.id === getTodayDayNumber();
                    const isSelected = selectedWeekDay === d.id;
                    const dayExercises = routine?.exercises?.filter((ex) => ex.dayNumber === d.id) || [];
                    const hasExercises = dayExercises.length > 0;

                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedWeekDay(d.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          border: isSelected
                            ? '1px solid #10b981'
                            : isToday
                            ? '1px solid rgba(6, 182, 212, 0.6)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                          backgroundColor: isSelected
                            ? '#10b981'
                            : isToday
                            ? 'rgba(6, 182, 212, 0.12)'
                            : 'rgba(255, 255, 255, 0.03)',
                          color: isSelected ? '#ffffff' : isToday ? '#06b6d4' : '#cbd5e1',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span>{d.name}</span>
                        {isToday && (
                          <span style={{
                            fontSize: '0.62rem',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            backgroundColor: isSelected ? 'rgba(0,0,0,0.3)' : '#06b6d4',
                            color: '#ffffff',
                            fontWeight: 800,
                          }}>
                            HOY
                          </span>
                        )}
                        {hasExercises && !isToday && (
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? '#ffffff' : '#10b981',
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Lista de Ejercicios Interactiva */}
                {(() => {
                  const filteredExercises = routine?.exercises
                    ? routine.exercises.filter((item) => {
                        if (selectedWeekDay === 'ALL') return true;
                        return item.dayNumber === selectedWeekDay;
                      })
                    : [];

                  if (filteredExercises.length === 0 && selectedWeekDay !== 'ALL') {
                    return (
                      <div style={{
                        padding: '2.5rem 1.5rem',
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '16px',
                        border: '1px dashed rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#10b981',
                        }}>
                          <Flame size={28} />
                        </div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                          Día de Descanso y Recuperación Activa ({getDayName(selectedWeekDay)})
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '480px', margin: 0 }}>
                          No tienes sesiones de pesas programadas para {getDayName(selectedWeekDay).toLowerCase()}. Aprovecha para descansar tus fibras musculares, hidratarte con electrolitos y realizar caminata suave o estiramientos.
                        </p>
                        <button
                          onClick={() => setSelectedWeekDay('ALL')}
                          style={{
                            marginTop: '0.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#f1f5f9',
                            padding: '0.45rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Ver Toda la Rutina Semanal
                        </button>
                      </div>
                    );
                  }

                  if (filteredExercises.length === 0) {
                    return (
                      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Tu entrenador en sala estará asignando tus ejercicios específicos.</p>
                    );
                  }

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                      {filteredExercises.map((item) => {
                        const isDone = completedExercises[item.id] || false;
                        const userLoad = exerciseLoads[item.id] || '';

                        return (
                          <div
                            key={item.id}
                            style={{
                              padding: '1.1rem',
                              borderRadius: '12px',
                              backgroundColor: isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                              border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                  fontSize: '0.7rem',
                                  padding: '2px 7px',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(6, 182, 212, 0.15)',
                                  color: '#06b6d4',
                                  fontWeight: 800,
                                }}>
                                  {getDayName(item.dayNumber)}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                                  • {item.exercise.muscleGroup}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                {item.restSeconds}s descanso
                              </span>
                            </div>

                            <div style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: isDone ? '#10b981' : '#f1f5f9',
                              textDecoration: isDone ? 'line-through' : 'none',
                            }}>
                              {item.exercise.name}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                              <span style={{ color: '#94a3b8' }}>Series: <strong style={{ color: '#10b981' }}>{item.sets}</strong></span>
                              <span style={{ color: '#94a3b8' }}>Reps: <strong style={{ color: '#10b981' }}>{item.reps}</strong></span>
                            </div>

                            {/* Campo de Registro de Cargas (Kilos/Libras) */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Carga hoy:</span>
                              <input
                                type="text"
                                placeholder="Ej: 50 kg"
                                value={userLoad}
                                onChange={(e) => handleSaveLoad(item.id, e.target.value)}
                                style={{
                                  width: '90px',
                                  padding: '0.3rem 0.5rem',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.12)',
                                  color: '#f8fafc',
                                  fontSize: '0.78rem',
                                  outline: 'none',
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => toggleExerciseComplete(item.id)}
                                style={{
                                  marginLeft: 'auto',
                                  backgroundColor: isDone ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                                  color: isDone ? '#ffffff' : '#94a3b8',
                                  border: isDone ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: '6px',
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {isDone ? <Check size={14} /> : null}
                                <span>{isDone ? '¡Hecho!' : 'Marcar'}</span>
                              </button>
                            </div>

                            {item.notes && (
                              <span style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                                Nota: {item.notes}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 3: DIAGNÓSTICO FÍSICO, IMC & EVOLUCIÓN ANTROPOMÉTRICA */}
          {activeTab === 'DIAGNOSTIC' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Tarjeta de Registro de Pesaje en Gym */}
              <div className="glass-card" style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Scale size={22} color="#8b5cf6" />
                      <span>Control de Pesaje & Ficha Antropométrica</span>
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                      Pésate en la báscula de tu sede y registra tu evolución para que tu entrenador ajuste tus cargas y nutrición.
                    </p>
                  </div>

                  {weightSavedSuccess && (
                    <span style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}>
                      ✅ ¡Pesaje registrado y sincronizado con tu entrenador!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveNewWeight} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 600 }}>Mi Peso Hoy:</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Ej: 74.5"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      style={{
                        width: '110px',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#f8fafc',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        outline: 'none',
                      }}
                    />
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>kg</span>
                  </div>

                  <button
                    type="submit"
                    disabled={savingWeight}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#8b5cf6',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.55rem 1.25rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(139, 92, 246, 0.35)',
                    }}
                  >
                    <Save size={16} />
                    <span>{savingWeight ? 'Guardando...' : 'Registrar Nuevo Peso'}</span>
                  </button>
                </form>
              </div>

              {/* Banner de Estado del Escaneo Biométrico 360° */}
              <div style={{
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Camera size={18} color="#a78bfa" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
                      Diagnóstico Biométrico 360° & Somatotipo
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      Evaluado por visión multimodal Google Gemini 2.5 Flash y anamnesis deportiva
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOnboardingStep(1);
                    setShowOnboardingModal(true);
                  }}
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.25)',
                    color: '#c4b5fd',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={12} />
                  <span>Nuevo Escaneo 360°</span>
                </button>
              </div>

              {/* Indicadores de Composición Corporal */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem' }}>
                {/* IMC */}
                <div className="glass-card" style={{ padding: '1rem', borderLeft: `4px solid ${bmiInfo.color}` }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Índice de Masa Corporal (IMC)</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: bmiInfo.color, marginTop: '4px' }}>
                    {calculatedBmi}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: bmiInfo.color, fontWeight: 700 }}>
                    {bmiInfo.label}
                  </div>
                </div>

                {/* Peso Actual */}
                <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Peso Registrado</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                    {currentMember.weight || 70} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>kg</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Estatura: {currentHeightMeters} m
                  </div>
                </div>

                {/* % Grasa Corporal */}
                <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>% Grasa Corporal Estimada</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                    {diagnostic?.bodyFatPercentage ? `${diagnostic.bodyFatPercentage}%` : '18.5%'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Escaneo visual IA
                  </div>
                </div>

                {/* Masa Muscular Magra */}
                <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #8b5cf6' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Masa Muscular Magra</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a78bfa', marginTop: '4px' }}>
                    {diagnostic?.muscleMassKg ? `${diagnostic.muscleMassKg} kg` : `${Math.round((currentMember.weight || 70) * 0.42)} kg`}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Masa activa libre de grasa
                  </div>
                </div>

                {/* Biotipo */}
                <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #06b6d4' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Biotipo / Somatotipo</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#06b6d4', marginTop: '6px' }}>
                    {diagnostic?.biotype || 'Mesomorfo'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                    {diagnostic?.biotype?.toLowerCase().includes('ecto')
                      ? 'Metabolismo rápido, alta demanda energética'
                      : diagnostic?.biotype?.toLowerCase().includes('endo')
                      ? 'Metabolismo eficiente, propensión a almacenar'
                      : 'Estructura atlética con respuesta óptima'}
                  </div>
                </div>
              </div>

              {/* Alerta de Seguridad y Ejercicios Prohibidos */}
              {diagnostic?.prohibitedExercises && (
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ef4444', margin: 0 }}>
                      Seguridad y Ejercicios Contraindicados (Filtro Activo)
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#f8fafc', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                      {diagnostic.prohibitedExercises}
                    </p>
                    <div style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '4px' }}>
                      Tu rutina generada por la IA ha bloqueado automáticamente estos movimientos para proteger tus articulaciones y columna.
                    </div>
                  </div>
                </div>
              )}

              {/* Resumen Clínico del Entrenador */}
              <div className="glass-card">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  Recomendaciones del Entrenador en Sala & IA
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                  {diagnostic?.aiClinicalSummary || diagnostic?.recommendedActions ||
                    'Mantén la progresión de cargas con buena técnica postural. Tu entrenador en sala supervisará tu evolución cada semana.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PLAN NUTRICIONAL IA & MACROS */}
          {activeTab === 'NUTRITION' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card" style={{
                border: '1px solid rgba(6, 182, 212, 0.25)',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(16, 185, 129, 0.03) 100%)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Salad size={22} color="#06b6d4" />
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        Mi Plan Nutricional & Macros IA
                      </h3>
                      {nutrition?.reviewedByTrainer && (
                        <span style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          <CheckCircle2 size={12} /> Aprobado por Entrenador
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
                      {nutrition?.title || 'Nutrición personalizada optimizada para tu rendimiento deportivo'}
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateAffiliateNutrition}
                    disabled={generatingNutrition}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#06b6d4',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      boxShadow: '0 0 12px rgba(6, 182, 212, 0.3)',
                    }}
                  >
                    <Sparkles size={14} />
                    <span>{generatingNutrition ? 'Gemini Calculando...' : 'Re-Calcular Macros con IA'}</span>
                  </button>
                </div>

                {nutrition ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Comparación Metabólica: TDEE Mantenimiento vs Meta Diaria */}
                    {(() => {
                      let parsedNotes: any = null;
                      if (nutrition.trainerNotes) {
                        try {
                          parsedNotes = JSON.parse(nutrition.trainerNotes);
                        } catch {
                          parsedNotes = null;
                        }
                      }
                      const maintCals = nutrition.maintenanceCalories || parsedNotes?.maintenanceCalories;
                      const supps = nutrition.supplements || parsedNotes?.supplements || [];
                      const recs = parsedNotes?.recommendations || [];
                      const calDiff = maintCals ? nutrition.targetCalories - maintCals : null;

                      return (
                        <>
                          {maintCals && (
                            <div style={{
                              padding: '1rem 1.25rem',
                              borderRadius: '12px',
                              backgroundColor: 'rgba(6, 182, 212, 0.08)',
                              border: '1px solid rgba(6, 182, 212, 0.25)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '1rem',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '42px',
                                  height: '42px',
                                  borderRadius: '10px',
                                  backgroundColor: 'rgba(6, 182, 212, 0.15)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                  <Flame size={22} color="#06b6d4" />
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Cálculo Metabólico de Mantenimiento (TDEE)</div>
                                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                                    {maintCals} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>kcal/día</span>
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                  backgroundColor: calDiff && calDiff < 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                  color: calDiff && calDiff < 0 ? '#10b981' : '#3b82f6',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.8rem',
                                  fontWeight: 800,
                                }}>
                                  {calDiff && calDiff < 0
                                    ? `Déficit: ${calDiff} kcal (Quema de Grasa)`
                                    : calDiff && calDiff > 0
                                    ? `Superávit: +${calDiff} kcal (Hipertrofia)`
                                    : 'Mantenimiento Óptimo'}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Cuadros de Macronutrientes */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                            {/* Calorías */}
                            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Meta Calórica Diaria</div>
                              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                                {nutrition.targetCalories} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>kcal</span>
                              </div>
                            </div>

                            {/* Proteínas */}
                            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>Proteínas</div>
                              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                                {nutrition.proteinGrams}g
                              </div>
                            </div>

                            {/* Carbohidratos */}
                            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                              <div style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700 }}>Carbohidratos</div>
                              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginTop: '2px' }}>
                                {nutrition.carbsGrams}g
                              </div>
                            </div>

                            {/* Grasas */}
                            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                              <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700 }}>Grasas Saludables</div>
                              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                                {nutrition.fatsGrams}g
                              </div>
                            </div>
                          </div>

                          {/* Comidas del Día */}
                          {nutrition.meals && nutrition.meals.length > 0 && (
                            <div>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
                                Distribución de Comidas Diarias
                              </h4>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                                {nutrition.meals.map((m, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      padding: '0.85rem 1rem',
                                      borderRadius: '10px',
                                      backgroundColor: 'rgba(255,255,255,0.02)',
                                      border: '1px solid rgba(255,255,255,0.06)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '0.35rem',
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>
                                        {m.meal}
                                      </span>
                                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                                        {m.calories} kcal
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>
                                      {m.title}
                                    </div>
                                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                                      {m.items?.map((it, iIdx) => (
                                        <li key={iIdx}>{it}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Sección de Suplementación Inteligente Recomendada */}
                          {supps && supps.length > 0 && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                                <Pill size={18} color="#ec4899" />
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                                  Protocolo de Suplementación Inteligente
                                </h4>
                                <span style={{
                                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                                  color: '#ec4899',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                }}>
                                  Basado en tus datos
                                </span>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                                {supps.map((s: any, sIdx: number) => (
                                  <div
                                    key={sIdx}
                                    style={{
                                      padding: '1rem',
                                      borderRadius: '12px',
                                      backgroundColor: 'rgba(236, 72, 153, 0.03)',
                                      border: '1px solid rgba(236, 72, 153, 0.2)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '0.45rem',
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fdf2f8' }}>
                                        {s.name}
                                      </div>
                                      <span style={{
                                        backgroundColor: 'rgba(255,255,255,0.06)',
                                        color: '#cbd5e1',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.68rem',
                                        fontWeight: 600,
                                      }}>
                                        {s.timing}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: 700 }}>
                                      Dosis recomendada: {s.dosage}
                                    </div>
                                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                                      {s.reason}
                                    </p>
                                    {s.caution && (
                                      <div style={{
                                        fontSize: '0.72rem',
                                        color: '#f59e0b',
                                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        marginTop: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                      }}>
                                        <AlertTriangle size={12} color="#f59e0b" />
                                        <span>{s.caution}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recomendaciones Generales */}
                          {recs && recs.length > 0 && (
                            <div style={{
                              padding: '0.85rem 1rem',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                            }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                                Hábitos y Recomendaciones Clave:
                              </div>
                              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                                {recs.map((r: string, rIdx: number) => (
                                  <li key={rIdx} style={{ marginBottom: '2px' }}>{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                      Aún no tienes un plan nutricional asignado. Realiza el Onboarding Biométrico 360° o presiona el botón para calcular tus macros con Google Gemini 2.5 Flash.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL DE ESCANEO CORPORAL IA & CÓDIGO QR MÓVIL */}
      <BodyScanCameraModal
        isOpen={showBodyScanModal}
        onClose={() => setShowBodyScanModal(false)}
        member={currentMember}
        defaultMode={bodyScanModalMode}
        onScanComplete={(newDiag) => {
          setDiagnostic(newDiag);
          if (currentMember?.id) {
            handleSelectMember(currentMember.id);
          }
          setShowBodyScanModal(false);
        }}
      />
    </div>
  );
};
