import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Salad,
  Flame,
  HeartPulse,
  User,
  Search,
  ThumbsUp,
  ThumbsDown,
  Check,
  ChevronRight,
  ShieldAlert,
  Info,
  Scale,
  Dumbbell,
  Printer,
  Save,
  RefreshCw,
  Utensils,
  ChevronDown
} from 'lucide-react';
import { api, Member, HealthDiagnostic, FoodItem, NutritionPlan, MealItem } from '../services/api';

interface DiagnosticFoodViewProps {
  currentUser?: any;
  activeRole?: string;
  initialMemberId?: string | null;
}

export const DiagnosticFoodView: React.FC<DiagnosticFoodViewProps> = ({
  currentUser,
  activeRole = 'ADMIN',
  initialMemberId
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [diagnostic, setDiagnostic] = useState<HealthDiagnostic | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodSearch, setFoodSearch] = useState('');
  const [foodCategoryFilter, setFoodCategoryFilter] = useState('ALL');

  // Métricas Biométricas Principales
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175); // cm
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [activityFactor, setActivityFactor] = useState<number>(1.55); // 1.2, 1.375, 1.55, 1.725
  const [bodyFat, setBodyFat] = useState<number>(16.0); // %
  const [biotype, setBiotype] = useState<'ECTOMORFO' | 'MESOMORFO' | 'ENDOMORFO'>('MESOMORFO');
  const [savingMetrics, setSavingMetrics] = useState(false);

  // Listas de Gustos y Rechazos
  const [likedFoods, setLikedFoods] = useState<string[]>([]);
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Formulario de Diagnóstico / Anamnesis
  const [targetGoal, setTargetGoal] = useState('Hipertrofia Muscular y Masa Magra');
  const [diseases, setDiseases] = useState('');
  const [injuries, setInjuries] = useState('');
  const [disabilities, setDisabilities] = useState('');
  const [trainingExperience, setTrainingExperience] = useState('INTERMEDIO');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [analyzingDiagnostic, setAnalyzingDiagnostic] = useState(false);
  const [generatingDietWithFoods, setGeneratingDietWithFoods] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [mList, foodList] = await Promise.all([
        api.getMembers(),
        api.getFoodsCatalog(),
      ]);
      setMembers(mList);
      setFoods(foodList);

      if (mList.length > 0) {
        // Si el usuario es un socio (MEMBER), buscar su propio registro
        if (currentUser?.role === 'MEMBER' || activeRole === 'MEMBER') {
          const self = mList.find(
            (m) =>
              m.documentNumber === currentUser?.documentNumber ||
              m.id === currentUser?.id ||
              m.email === currentUser?.email
          ) || mList[0];
          selectMember(self);
        } else if (initialMemberId) {
          const target = mList.find((m) => m.id === initialMemberId) || mList[0];
          selectMember(target);
        } else {
          selectMember(mList[0]);
        }
      }
    } catch (err) {
      console.error('Error cargando datos iniciales:', err);
    }
  };

  const selectMember = async (member: Member) => {
    setSelectedMember(member);

    // Cargar métricas existentes del socio
    const currentWeight = member.weight && member.weight > 30 ? member.weight : 75;
    const currentHeight = member.height
      ? (member.height < 3 ? Math.round(member.height * 100) : member.height)
      : 175;

    setWeight(currentWeight);
    setHeight(currentHeight);
    if (member.gender === 'FEMALE') setGender('FEMALE');
    else setGender('MALE');

    try {
      // Cargar diagnóstico previo si existe
      const diag = await api.getMemberDiagnostic(member.id);
      setDiagnostic(diag);
      if (diag) {
        if (diag.targetGoal) setTargetGoal(diag.targetGoal);
        if (diag.diseases) setDiseases(diag.diseases);
        if (diag.injuries) setInjuries(diag.injuries);
        if (diag.disabilities) setDisabilities(diag.disabilities);
        if (diag.trainingExperience) setTrainingExperience(diag.trainingExperience);
        if (diag.bodyFatPercentage) setBodyFat(diag.bodyFatPercentage);
        if (diag.biotype) {
          const b = diag.biotype.toUpperCase();
          if (b.includes('ECTO')) setBiotype('ECTOMORFO');
          else if (b.includes('ENDO')) setBiotype('ENDOMORFO');
          else setBiotype('MESOMORFO');
        }
      }

      // Cargar plan de nutrición previo
      const nutPlan = await api.getMemberNutrition(member.id);
      setNutritionPlan(nutPlan);

      // Cargar gustos de comida guardados
      if (member.likedFoods) {
        try {
          setLikedFoods(JSON.parse(member.likedFoods));
        } catch {
          setLikedFoods(member.likedFoods.split(',').map((s) => s.trim()));
        }
      } else {
        setLikedFoods(['Pechuga de pollo', 'Huevos enteros', 'Arroz blanco', 'Avena en hojuelas', 'Aguacate']);
      }

      if (member.dislikedFoods) {
        try {
          setDislikedFoods(JSON.parse(member.dislikedFoods));
        } catch {
          setDislikedFoods(member.dislikedFoods.split(',').map((s) => s.trim()));
        }
      } else {
        setDislikedFoods([]);
      }
    } catch (err) {
      console.error('Error cargando ficha del socio:', err);
    }
  };

  // --------------------------------------------------------------------------
  // CÁLCULOS BIOMÉTRICOS Y METABÓLICOS EN VIVO
  // --------------------------------------------------------------------------
  const heightInMeters = height > 0 ? height / 100 : 1.75;
  const bmi = useMemo(() => {
    if (heightInMeters <= 0 || weight <= 0) return 22.5;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }, [weight, heightInMeters]);

  const bmiDetails = useMemo(() => {
    if (bmi < 18.5) return { category: 'Bajo peso', color: '#3b82f6', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (bmi < 25.0) return { category: 'Peso Normal / Saludable', color: '#10b981', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (bmi < 30.0) return { category: 'Sobrepeso', color: '#f59e0b', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (bmi < 35.0) return { category: 'Obesidad Grado I', color: '#f97316', bg: 'bg-orange-50 text-orange-700 border-orange-200' };
    return { category: 'Obesidad Grado II / III', color: '#ef4444', bg: 'bg-red-50 text-red-700 border-red-200' };
  }, [bmi]);

  // Masa magra estimada
  const muscleMassKg = useMemo(() => {
    const fatKg = (weight * bodyFat) / 100;
    return parseFloat((weight - fatKg).toFixed(1));
  }, [weight, bodyFat]);

  // Tasa Metabólica Basal (Mifflin-St Jeor)
  const tmb = useMemo(() => {
    if (gender === 'MALE') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  }, [weight, height, age, gender]);

  // Gasto Energético Total Diario (TDEE)
  const tdee = useMemo(() => {
    return Math.round(tmb * activityFactor);
  }, [tmb, activityFactor]);

  // Calorías Meta según Objetivo
  const targetCalories = useMemo(() => {
    if (targetGoal.toLowerCase().includes('grasa') || targetGoal.toLowerCase().includes('definición')) {
      return Math.max(1400, tdee - 450); // Déficit moderado
    } else if (targetGoal.toLowerCase().includes('hipertrofia') || targetGoal.toLowerCase().includes('masa')) {
      return tdee + 350; // Superávit magro
    } else if (targetGoal.toLowerCase().includes('fuerza')) {
      return tdee + 200;
    }
    return tdee; // Mantenimiento
  }, [tdee, targetGoal]);

  // Desglose de Macronutrientes
  const macros = useMemo(() => {
    const proteinGrams = Math.round(weight * 2.0); // 2g por kg
    const fatGrams = Math.round(weight * 0.9); // 0.9g por kg
    const remainingCalories = targetCalories - (proteinGrams * 4 + fatGrams * 9);
    const carbsGrams = Math.max(80, Math.round(remainingCalories / 4));

    return {
      proteinGrams,
      fatGrams,
      carbsGrams,
      proteinKcal: proteinGrams * 4,
      fatKcal: fatGrams * 9,
      carbsKcal: carbsGrams * 4,
    };
  }, [weight, targetCalories]);

  // --------------------------------------------------------------------------
  // ACCIONES Y LLAMADOS API
  // --------------------------------------------------------------------------
  const handleSavePhysicalMetrics = async () => {
    if (!selectedMember) return;
    try {
      setSavingMetrics(true);
      await api.updateMember(selectedMember.id, {
        weight,
        height: parseFloat(heightInMeters.toFixed(2)),
      });
      alert('💾 ¡Datos físicos actualizados correctamente en el perfil del socio!');
    } catch (err: any) {
      alert(err.message || 'Error guardando datos físicos');
    } finally {
      setSavingMetrics(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAIDiagnostic = async () => {
    if (!selectedMember) return;
    try {
      setAnalyzingDiagnostic(true);
      const res = await api.generateHealthDiagnosticAI({
        memberId: selectedMember.id,
        targetGoal,
        diseases: diseases.trim() || 'Ninguna',
        injuries: injuries.trim() || 'Ninguna',
        disabilities: disabilities.trim() || 'Ninguna',
        trainingExperience,
        photoBase64: photoPreview || undefined,
        weight,
        height: heightInMeters,
      });

      setDiagnostic(res);
      if (res.bodyFatPercentage) setBodyFat(res.bodyFatPercentage);
      alert('✨ ¡Diagnóstico con Google Gemini completado! Se han detectado precauciones biomecánicas y adaptaciones.');
    } catch (err: any) {
      alert(err.message || 'Error al generar diagnóstico con IA');
    } finally {
      setAnalyzingDiagnostic(false);
    }
  };

  const toggleLikedFood = (foodName: string) => {
    if (likedFoods.includes(foodName)) {
      setLikedFoods(likedFoods.filter((f) => f !== foodName));
    } else {
      setLikedFoods([...likedFoods, foodName]);
      setDislikedFoods(dislikedFoods.filter((f) => f !== foodName));
    }
  };

  const toggleDislikedFood = (foodName: string) => {
    if (dislikedFoods.includes(foodName)) {
      setDislikedFoods(dislikedFoods.filter((f) => f !== foodName));
    } else {
      setDislikedFoods([...dislikedFoods, foodName]);
      setLikedFoods(likedFoods.filter((f) => f !== foodName));
    }
  };

  const handleSaveFoodPreferences = async () => {
    if (!selectedMember) return;
    try {
      setSavingPreferences(true);
      await api.updateMemberFoodPreferences(selectedMember.id, {
        likedFoods,
        dislikedFoods,
      });
      alert('✅ Preferencias alimentarias guardadas con éxito.');
    } catch (err: any) {
      alert(err.message || 'Error al guardar preferencias');
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleGenerateDietFromFoods = async () => {
    if (!selectedMember) return;
    try {
      setGeneratingDietWithFoods(true);
      await api.updateMemberFoodPreferences(selectedMember.id, {
        likedFoods,
        dislikedFoods,
      });

      const res = await api.generateNutritionAI({
        memberId: selectedMember.id,
        goal: targetGoal.toLowerCase().includes('grasa') ? 'FAT_LOSS' : 'HYPERTROPHY',
        likedFoods,
        dislikedFoods,
      });

      setNutritionPlan(res.data);
      alert(`🥗 ¡Plan Nutricional con IA generado con éxito! Se estructuraron las comidas respetando tus ${likedFoods.length} alimentos favoritos.`);
    } catch (err: any) {
      alert(err.message || 'Error generando nutrición con IA');
    } finally {
      setGeneratingDietWithFoods(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredFoods = foods.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(foodSearch.toLowerCase());
    const matchesCat = foodCategoryFilter === 'ALL' || f.category === foodCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Encabezado y Selector de Perfil */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner shrink-0">
            <HeartPulse size={30} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                Ficha Biometría & Diagnóstico IA
              </h1>
              <span className="bg-blue-100 text-blue-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Masa Corporal & Nutrición
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Registro antropométrico, cálculo de IMC, prevención de lesiones por IA y cálculo metabólico.
            </p>
          </div>
        </div>

        {/* Selector de Socio o Badge Fijo para Socio */}
        <div className="flex items-center gap-3">
          {currentUser?.role !== 'MEMBER' && activeRole !== 'MEMBER' ? (
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-2xl border border-gray-200">
              <User size={16} className="text-gray-400 shrink-0" />
              <select
                value={selectedMember?.id || ''}
                onChange={(e) => {
                  const m = members.find((item) => item.id === e.target.value);
                  if (m) selectMember(m);
                }}
                className="bg-transparent text-xs sm:text-sm font-bold text-gray-800 focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} ({m.code})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-extrabold text-blue-900">
                Mi Perfil: {selectedMember?.firstName} {selectedMember?.lastName}
              </span>
            </div>
          )}

          <button
            onClick={handlePrint}
            title="Imprimir Ficha Completa"
            className="p-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Imprimir Ficha</span>
          </button>
        </div>
      </div>

      {selectedMember && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* =========================================================================
              COLUMNA IZQUIERDA: DATOS FÍSICOS, IMC Y DIAGNÓSTICO IA (7 COLS)
             ========================================================================= */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. MÓDULO DE REGISTRO FÍSICO Y COMPOSICIÓN CORPORAL */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <Scale size={20} className="text-blue-600" />
                  <h2 className="text-lg font-black text-gray-900">
                    1. Datos Físicos & Composición Corporal
                  </h2>
                </div>
                <button
                  onClick={handleSavePhysicalMetrics}
                  disabled={savingMetrics}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{savingMetrics ? 'Guardando...' : 'Guardar Datos'}</span>
                </button>
              </div>

              {/* Fila de Controles Físicos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Peso */}
                <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Peso (kg)
                  </label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      step="0.1"
                      min="30"
                      max="250"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="w-full text-xl font-black text-blue-950 bg-transparent focus:outline-none"
                    />
                    <span className="text-xs font-bold text-gray-400">kg</span>
                  </div>
                </div>

                {/* Estatura */}
                <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Estatura (cm)
                  </label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      step="1"
                      min="100"
                      max="230"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                      className="w-full text-xl font-black text-blue-950 bg-transparent focus:outline-none"
                    />
                    <span className="text-xs font-bold text-gray-400">cm</span>
                  </div>
                </div>

                {/* % Grasa Corporal */}
                <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    % Grasa
                  </label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      step="0.5"
                      min="3"
                      max="55"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(parseFloat(e.target.value) || 0)}
                      className="w-full text-xl font-black text-cyan-600 bg-transparent focus:outline-none"
                    />
                    <span className="text-xs font-bold text-gray-400">%</span>
                  </div>
                </div>

                {/* Edad */}
                <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Edad
                  </label>
                  <div className="flex items-baseline gap-1">
                    <input
                      type="number"
                      step="1"
                      min="12"
                      max="90"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      className="w-full text-xl font-black text-gray-800 bg-transparent focus:outline-none"
                    />
                    <span className="text-xs font-bold text-gray-400">años</span>
                  </div>
                </div>
              </div>

              {/* TARJETA DESTACADA: IMC (ÍNDICE DE MASA CORPORAL) CALCULADO EN VIVO */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-cyan-50/50 border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                      Índice de Masa Corporal (IMC)
                    </span>
                    <div className="flex items-baseline gap-3 mt-0.5">
                      <span className="text-3xl font-black text-blue-950">{bmi}</span>
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${bmiDetails.bg}`}>
                        {bmiDetails.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-gray-500">Masa Magra Estimada</span>
                    <p className="text-lg font-black text-emerald-600">{muscleMassKg} kg</p>
                  </div>
                </div>

                {/* Semáforo visual del IMC */}
                <div className="space-y-1.5 pt-2">
                  <div className="h-2.5 w-full bg-gray-200 rounded-full flex overflow-hidden">
                    <div className="w-[18.5%] bg-blue-400" title="Bajo peso (< 18.5)" />
                    <div className="w-[26%] bg-emerald-500" title="Normal (18.5 - 24.9)" />
                    <div className="w-[20%] bg-amber-400" title="Sobrepeso (25 - 29.9)" />
                    <div className="w-[20%] bg-orange-500" title="Obesidad I (30 - 34.9)" />
                    <div className="w-[15.5%] bg-red-500" title="Obesidad II/III (≥ 35)" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 px-0.5">
                    <span>16</span>
                    <span>18.5 (Normal)</span>
                    <span>25.0</span>
                    <span>30.0</span>
                    <span>35+</span>
                  </div>
                </div>
              </div>

              {/* Selector de Biotipo / Somatotipo con Explicación */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-2">
                  Biotipo Morfológico (Somatotipo)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setBiotype('ECTOMORFO')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      biotype === 'ECTOMORFO'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <p className="text-xs font-extrabold text-blue-950">Ectomorfo</p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                      Metabolismo rápido, contextura delgada. Requiere superávit calórico y descansos prolongados.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBiotype('MESOMORFO')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      biotype === 'MESOMORFO'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <p className="text-xs font-extrabold text-blue-950">Mesomorfo</p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                      Estructura atlética natural, buena respuesta a hipertrofia. Óptima ganancia de masa magra.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBiotype('ENDOMORFO')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      biotype === 'ENDOMORFO'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <p className="text-xs font-extrabold text-blue-950">Endomorfo</p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                      Estructura ósea ancha y alta fuerza. Tendencia a retener grasa, prioridad en déficit controlado.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. ANAMNESIS CLÍNICA Y DIAGNÓSTICO CON IA */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                <Activity size={20} className="text-blue-600" />
                <h2 className="text-lg font-black text-gray-900">
                  2. Anamnesis Fisiológica & Diagnóstico con IA
                </h2>
              </div>

              {/* Objetivo Principal */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Objetivo Físico Principal
                </label>
                <select
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Hipertrofia Muscular y Masa Magra">Aumento de Masa Muscular (Hipertrofia)</option>
                  <option value="Pérdida de Grasa y Definición">Pérdida de Grasa Corporal & Definición</option>
                  <option value="Salud Postural y Corrección de Espalda">Salud Postural & Corrección de Espalda</option>
                  <option value="Fuerza Máxima y Potencia">Fuerza Máxima & Levantamientos Pesados</option>
                  <option value="Acondicionamiento Físico y Salud Cardiovascular">Acondicionamiento Físico General</option>
                </select>
              </div>

              {/* Lesiones Previas o Activas (Alerta Biomecánica) */}
              <div>
                <label className="block text-xs font-extrabold text-red-600 mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle size={15} />
                  <span>Lesiones Previas o Activas (Rodilla, Columna, Hombro, Cuello...)</span>
                </label>
                <input
                  type="text"
                  placeholder="ej: Hernia discal L5-S1, molestia en manguito rotador derecho... o Ninguna"
                  value={injuries}
                  onChange={(e) => setInjuries(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-red-50/30 border border-red-200 rounded-xl text-xs sm:text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  La IA vetará automáticamente los ejercicios que sobrecarguen estas articulaciones.
                </p>
              </div>

              {/* Enfermedades / Patologías */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Enfermedades o Restricciones (Hipertensión, asma, diabetes, etc.)
                </label>
                <input
                  type="text"
                  placeholder="ej: Hipertensión arterial controlada, Asma inducida... o Ninguna"
                  value={diseases}
                  onChange={(e) => setDiseases(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400"
                />
              </div>

              {/* Nivel de Experiencia */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nivel de Experiencia Deportiva
                </label>
                <select
                  value={trainingExperience}
                  onChange={(e) => setTrainingExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="SEDENTARIO">Sedentario (Iniciando desde cero)</option>
                  <option value="PRINCIPIANTE">Principiante (1 a 6 meses)</option>
                  <option value="INTERMEDIO">Intermedio (6 meses a 2 años)</option>
                  <option value="AVANZADO">Avanzado / Atleta (Más de 2 años)</option>
                </select>
              </div>

              {/* Escaneo de Fotografía Corporal para Visión IA */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Camera size={15} className="text-blue-600" />
                  <span>Foto Frontal o Perfil para Escaneo Visual IA (Opcional)</span>
                </label>
                <div className="p-4 rounded-2xl border-2 border-dashed border-gray-200 text-center bg-gray-50/50">
                  {photoPreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={photoPreview}
                        alt="Foto corporal"
                        className="max-h-36 rounded-xl object-contain shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        Remover foto
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={24} className="mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Cargar imagen del socio para análisis postural y somatotipo
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="text-xs text-gray-500 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Ejecutar Diagnóstico IA */}
              <button
                type="button"
                onClick={handleRunAIDiagnostic}
                disabled={analyzingDiagnostic}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Sparkles size={18} />
                <span>
                  {analyzingDiagnostic
                    ? 'Google Gemini Analizando Fisiología...'
                    : 'Generar Diagnóstico Fisiológico con IA'}
                </span>
              </button>

              {/* RESULTADOS DEL DIAGNÓSTICO IA */}
              {diagnostic && (
                <div className="mt-4 p-5 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <h3 className="text-sm font-extrabold text-blue-950">
                        Diagnóstico Emitido por IA
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                      Biotipo: {diagnostic.biotype || biotype}
                    </span>
                  </div>

                  {/* ALERTA DE SEGURIDAD ROJA: EJERCICIOS PROHIBIDOS */}
                  {diagnostic.prohibitedExercises && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-black text-red-700 uppercase tracking-wider">
                        <ShieldAlert size={16} />
                        <span>Ejercicios Prohibidos por Lesión:</span>
                      </div>
                      <p className="text-xs text-red-800 font-semibold leading-relaxed">
                        {diagnostic.prohibitedExercises}
                      </p>
                    </div>
                  )}

                  {/* Dictamen Clínico */}
                  {diagnostic.aiClinicalSummary && (
                    <div className="text-xs text-gray-700 space-y-1">
                      <p className="font-extrabold text-gray-900">Análisis Postural & Clínico:</p>
                      <p className="leading-relaxed bg-white/70 p-3 rounded-xl border border-gray-100">
                        {diagnostic.aiClinicalSummary}
                      </p>
                    </div>
                  )}

                  {/* Recomendaciones */}
                  {diagnostic.recommendedActions && (
                    <div className="text-xs text-gray-700 space-y-1">
                      <p className="font-extrabold text-emerald-800">Plan de Adaptación Recomendado:</p>
                      <p className="leading-relaxed bg-white/70 p-3 rounded-xl border border-gray-100">
                        {diagnostic.recommendedActions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              COLUMNA DERECHA: PLAN DE NUTRICIÓN ESPECÍFICA & ALIMENTOS (5 COLS)
             ========================================================================= */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 3. CALCULADORA METABÓLICA Y MACRONUTRIENTES */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <Flame size={20} className="text-amber-500" />
                  <h2 className="text-lg font-black text-gray-900">
                    3. Nutrición & Calorías Específicas
                  </h2>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Mifflin-St Jeor
                </span>
              </div>

              {/* Selector de Nivel de Actividad */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Factor de Actividad Física Semanal
                </label>
                <select
                  value={activityFactor}
                  onChange={(e) => setActivityFactor(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
                >
                  <option value={1.2}>Sedentario (Poco o ningún ejercicio)</option>
                  <option value={1.375}>Ligero (Entrenamiento 1-3 días/sem)</option>
                  <option value={1.55}>Moderado (Entrenamiento 3-5 días/sem)</option>
                  <option value={1.725}>Intenso (Entrenamiento pesado 6-7 días/sem)</option>
                </select>
              </div>

              {/* Métricas Energéticas */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase">TMB Basal</span>
                  <p className="text-base font-black text-gray-900 mt-0.5">{tmb} <span className="text-[10px] font-bold">kcal</span></p>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase">TDEE Gasto</span>
                  <p className="text-base font-black text-gray-900 mt-0.5">{tdee} <span className="text-[10px] font-bold">kcal</span></p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] font-black text-emerald-700 uppercase">Meta Diaria</span>
                  <p className="text-base font-black text-emerald-800 mt-0.5">{targetCalories} <span className="text-[10px] font-bold">kcal</span></p>
                </div>
              </div>

              {/* Barras de Macronutrientes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-gray-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                    Proteínas (2.0 g/kg)
                  </span>
                  <span className="font-black text-blue-900">{macros.proteinGrams}g ({macros.proteinKcal} kcal)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, (macros.proteinKcal / targetCalories) * 100)}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-gray-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    Carbohidratos
                  </span>
                  <span className="font-black text-amber-900">{macros.carbsGrams}g ({macros.carbsKcal} kcal)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (macros.carbsKcal / targetCalories) * 100)}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-gray-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    Grasas Saludables
                  </span>
                  <span className="font-black text-emerald-900">{macros.fatGrams}g ({macros.fatKcal} kcal)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (macros.fatKcal / targetCalories) * 100)}%` }} />
                </div>
              </div>
            </div>

            {/* 4. SELECCIÓN DE ALIMENTOS: GUSTOS Y VETOS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Salad size={18} className="text-emerald-600" />
                  <h3 className="text-base font-black text-gray-900">
                    Preferencias de Alimentos
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleSaveFoodPreferences}
                  disabled={savingPreferences}
                  className="text-xs font-extrabold text-blue-600 hover:underline disabled:opacity-50"
                >
                  {savingPreferences ? 'Guardando...' : 'Guardar Gustos'}
                </button>
              </div>

              <p className="text-xs text-gray-500 font-medium">
                Marca los alimentos que te gustan para priorizarlos en tu menú diario, o veta los que rechazas por gusto o alergia.
              </p>

              {/* Resumen de Gustos */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <span className="font-extrabold text-emerald-800 block mb-1">
                    Favoritos ({likedFoods.length})
                  </span>
                  <p className="text-[11px] text-gray-600 truncate">
                    {likedFoods.length > 0 ? likedFoods.join(', ') : 'Ninguno seleccionado'}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-red-50/60 border border-red-100">
                  <span className="font-extrabold text-red-800 block mb-1">
                    Vetados ({dislikedFoods.length})
                  </span>
                  <p className="text-[11px] text-gray-600 truncate">
                    {dislikedFoods.length > 0 ? dislikedFoods.join(', ') : 'Ninguno vetado'}
                  </p>
                </div>
              </div>

              {/* Buscador de Alimentos */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar pollo, arroz, avena, aguacate..."
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Lista Scrollable de Alimentos */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredFoods.slice(0, 15).map((food) => {
                  const isLiked = likedFoods.includes(food.name);
                  const isDisliked = dislikedFoods.includes(food.name);

                  return (
                    <div
                      key={food.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                        isLiked
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : isDisliked
                          ? 'bg-red-50/70 border-red-200'
                          : 'bg-white border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-extrabold text-gray-900">{food.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • G: {food.fats}g
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleLikedFood(food.name)}
                          title="Me gusta"
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isLiked
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-emerald-600'
                          }`}
                        >
                          <ThumbsUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleDislikedFood(food.name)}
                          title="No me gusta"
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isDisliked
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-red-600'
                          }`}
                        >
                          <ThumbsDown size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botón de Generar Dieta Específica con IA */}
              <button
                type="button"
                onClick={handleGenerateDietFromFoods}
                disabled={generatingDietWithFoods}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Utensils size={17} />
                <span>
                  {generatingDietWithFoods
                    ? 'Gemini Armando Menú Nutricional...'
                    : 'Armar Plan de Alimentación con IA'}
                </span>
              </button>
            </div>

            {/* 5. VISOR DEL MENÚ DE COMIDAS ESTRUCTURADO */}
            {nutritionPlan && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span>Plan Nutricional Activo</span>
                  </h3>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {nutritionPlan.targetCalories} kcal
                  </span>
                </div>

                <p className="text-xs font-extrabold text-blue-950">
                  {nutritionPlan.title}
                </p>

                {/* Comidas Desglosadas */}
                <div className="space-y-3">
                  {(() => {
                    let meals: MealItem[] = [];
                    try {
                      meals = JSON.parse(nutritionPlan.mealsJson);
                    } catch {
                      meals = [
                        { meal: 'Desayuno', title: 'Huevos revueltos con avena y fruta', calories: 480, protein: 32, carbs: 55, fats: 14, items: ['3 Huevos enteros', '60g Avena', '1 Banano'] },
                        { meal: 'Almuerzo', title: 'Pechuga a la plancha con arroz y aguacate', calories: 650, protein: 48, carbs: 70, fats: 18, items: ['180g Pechuga de pollo', '150g Arroz blanco', '50g Aguacate'] },
                        { meal: 'Merienda', title: 'Yogurt griego con frutos secos', calories: 320, protein: 22, carbs: 24, fats: 12, items: ['150g Yogurt griego natural', '25g Almendras'] },
                        { meal: 'Cena', title: 'Pescado o atún con ensalada y papa', calories: 450, protein: 38, carbs: 40, fats: 12, items: ['160g Filete de pescado blanco', '150g Papa cocida', 'Ensalada verde'] },
                      ];
                    }

                    return meals.map((m, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-blue-900">{m.meal}</span>
                          <span className="font-black text-emerald-700">{m.calories} kcal</span>
                        </div>
                        <p className="text-xs font-bold text-gray-800">{m.title}</p>
                        {m.items && m.items.length > 0 && (
                          <p className="text-[11px] text-gray-500 leading-tight">
                            {m.items.join(' • ')}
                          </p>
                        )}
                        <div className="flex gap-3 text-[10px] font-bold text-gray-400 pt-0.5">
                          <span>P: {m.protein}g</span>
                          <span>C: {m.carbs}g</span>
                          <span>G: {m.fats}g</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticFoodView;
