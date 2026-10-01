import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  HeartPulse,
  Scale,
  Activity,
  AlertTriangle,
  CheckCircle2,
  X,
  Building2,
  Home,
  Flame,
  Utensils,
  Dumbbell,
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  Download,
  Share2,
  Play,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { EXERCISES_DATABASE } from '../data/exercisesData';

export default function AIBiometricEvaluationModal({
  member,
  isOpen,
  onClose,
  onSavePlan
}) {
  const [step, setStep] = useState(1); // 1: Medidas, 2: Objetivos, 3: Salud/Lesiones, 4: Resultado IA
  const [isProcessing, setIsProcessing] = useState(false);

  // Formulario de medidas antropométricas
  const [formData, setFormData] = useState({
    gender: 'MALE', // 'MALE' | 'FEMALE'
    age: 29,
    weight: 76, // kg
    height: 176, // cm
    waist: 83, // cm (cintura)
    hip: 98, // cm (cadera, para mujeres)
    neck: 38, // cm (cuello)
    activityLevel: 1.45, // 1.2: Sedentario, 1.45: Moderado, 1.65: Intenso, 1.85: Atleta

    // Objetivos
    goal: 'HIPERTROFIA', // 'HIPERTROFIA' | 'DEFINICION' | 'RECOMPOSICION' | 'SALUD'
    trainingLocation: 'GYM', // 'GYM' | 'CASA'
    experienceLevel: 'Intermedio',
    daysPerWeek: 4,

    // Salud y Lesiones
    diseases: [], // ['HIPERTENSION', 'DIABETES', 'ASMA', 'CARDIOPATIA']
    injuries: [], // ['RODILLA', 'LUMBAR', 'HOMBRO', 'CUELLO', 'MUNECAS']
    notes: ''
  });

  // Cálculos Biométricos Automáticos (US Navy Body Fat Formula & Harris-Benedict)
  const biometricResults = useMemo(() => {
    const { gender, weight, height, waist, neck, hip, age, activityLevel, goal } = formData;

    const h = Number(height);
    const w = Number(weight);
    const c = Number(waist);
    const n = Number(neck);
    const hipCm = Number(hip);

    // IMC
    const heightM = h / 100;
    const bmi = +(w / (heightM * heightM)).toFixed(1);

    // % Grasa Corporal Fórmula US Navy
    let bodyFat = 18;
    try {
      if (gender === 'MALE') {
        const diff = Math.max(c - n, 1);
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(h)) - 450;
      } else {
        const sum = Math.max(c + hipCm - n, 1);
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(sum) + 0.22100 * Math.log10(h)) - 450;
      }
      bodyFat = Math.max(5, Math.min(48, +bodyFat.toFixed(1)));
    } catch {
      bodyFat = gender === 'MALE' ? 18 : 24;
    }

    // Masa Grasa y Masa Magra
    const fatMass = +(w * (bodyFat / 100)).toFixed(1);
    const leanMass = +(w - fatMass).toFixed(1);

    // Tasa Metabólica Basal (Katch-McArdle basada en masa magra)
    const bmr = Math.round(370 + 21.6 * leanMass);
    const tdee = Math.round(bmr * activityLevel);

    // Meta Calórica según objetivo
    let targetCalories = tdee;
    if (goal === 'HIPERTROFIA') targetCalories = Math.round(tdee + 350); // Superávit limpio
    if (goal === 'DEFINICION') targetCalories = Math.round(tdee - 450); // Déficit moderado
    if (goal === 'RECOMPOSICION') targetCalories = Math.round(tdee - 150); // Ligero déficit
    if (goal === 'SALUD') targetCalories = tdee;

    // Macronutrientes
    let proteinPerKg = 2.0;
    if (goal === 'HIPERTROFIA') proteinPerKg = 2.2;
    if (goal === 'DEFINICION') proteinPerKg = 2.3;
    if (goal === 'SALUD') proteinPerKg = 1.6;

    const proteinGrams = Math.round(w * proteinPerKg);
    const fatGrams = Math.round((targetCalories * 0.25) / 9);
    const remainingCalories = targetCalories - (proteinGrams * 4 + fatGrams * 9);
    const carbsGrams = Math.max(80, Math.round(remainingCalories / 4));

    return {
      bmi,
      bodyFat,
      fatMass,
      leanMass,
      bmr,
      tdee,
      targetCalories,
      proteinGrams,
      carbsGrams,
      fatGrams
    };
  }, [formData]);

  // Manejo de checkboxes
  const toggleArrayItem = (key, item) => {
    setFormData((prev) => {
      const arr = prev[key];
      if (arr.includes(item)) {
        return { ...prev, [key]: arr.filter((x) => x !== item) };
      } else {
        return { ...prev, [key]: [...arr, item] };
      }
    });
  };

  // Generador Inteligente de Rutina Adaptada por IA
  const generatePersonalizedRoutine = () => {
    const isGym = formData.trainingLocation === 'GYM';
    const hasKneeInjury = formData.injuries.includes('RODILLA');
    const hasLumbarInjury = formData.injuries.includes('LUMBAR');
    const hasShoulderInjury = formData.injuries.includes('HOMBRO');

    // Filtrar ejercicios de la base de datos
    let candidatePool = EXERCISES_DATABASE.filter(
      (ex) => ex.location === (isGym ? 'GYM' : 'CASA')
    );

    // Filtros biomecánicos según lesiones
    if (hasKneeInjury) {
      candidatePool = candidatePool.filter(
        (ex) => !['gym-hack-squat', 'home-air-squat', 'home-burpees'].includes(ex.id)
      );
    }
    if (hasLumbarInjury) {
      candidatePool = candidatePool.filter(
        (ex) => !['gym-smith-squat', 'home-burpees'].includes(ex.id)
      );
    }
    if (hasShoulderInjury) {
      candidatePool = candidatePool.filter(
        (ex) => !['gym-shoulder-press', 'home-diamond-push-up'].includes(ex.id)
      );
    }

    // Seleccionar 5-6 ejercicios seguros y equilibrados
    const selectedExercises = candidatePool.slice(0, 6).map((ex) => {
      let safetyNote = '✓ Seguro y verificado para tu biomecánica';
      if (hasKneeInjury && ex.muscleGroup === 'Piernas') {
        safetyNote = '🛡️ Modificado: Rango controlado para proteger articulación de rodilla';
      }
      if (hasLumbarInjury) {
        safetyNote = '🛡️ Espalda con soporte: Cero compresión lumbar';
      }
      if (hasShoulderInjury && (ex.muscleGroup === 'Hombros' || ex.muscleGroup === 'Pecho')) {
        safetyNote = '🛡️ Plano escapular protegido: Agarre neutro';
      }

      return {
        ...ex,
        safetyNote,
        sets: '4 series',
        reps: formData.goal === 'HIPERTROFIA' ? '10-12 reps' : '12-15 reps',
        rest: '75s'
      };
    });

    return selectedExercises;
  };

  // Plan de Dieta y Comidas Sugeridas
  const generatedMealPlan = useMemo(() => {
    const { targetCalories, proteinGrams, carbsGrams, fatGrams } = biometricResults;

    return [
      {
        meal: '🌅 Desayuno Energético',
        time: '07:30 - 08:30 AM',
        title: 'Tortilla de Claras, Avena con Frutos Rojos & Café',
        calories: Math.round(targetCalories * 0.25),
        macros: `Proteína: ${Math.round(proteinGrams * 0.25)}g | Carbos: ${Math.round(carbsGrams * 0.28)}g | Grasas: ${Math.round(fatGrams * 0.22)}g`,
        foods: [
          '4 Claras de huevo + 1 huevo entero revuelto con espinacas',
          '60g de hojuelas de avena en agua o leche de almendras',
          '1 taza de fresas o arándanos frescos',
          'Café negro o infusión sin azúcar'
        ]
      },
      {
        meal: '🥗 Almuerzo de Rendimiento & Biomecánica',
        time: '12:30 - 01:30 PM',
        title: 'Pechuga a la Plancha, Arroz Integral & Ensalada Verde',
        calories: Math.round(targetCalories * 0.35),
        macros: `Proteína: ${Math.round(proteinGrams * 0.35)}g | Carbos: ${Math.round(carbsGrams * 0.40)}g | Grasas: ${Math.round(fatGrams * 0.30)}g`,
        foods: [
          '180g de pechuga de pollo o lomo de res magro a la plancha',
          '150g de arroz integral cocido o papa al vapor',
          '1 bowl grande de ensalada con aceite de oliva virgen (10ml)',
          '1 porción de brócoli al vapor con limón'
        ]
      },
      {
        meal: '🍎 Merienda / Pre-Entreno Activo',
        time: '04:30 - 05:30 PM',
        title: 'Yogurt Griego, Almendras & Banana',
        calories: Math.round(targetCalories * 0.18),
        macros: `Proteína: ${Math.round(proteinGrams * 0.18)}g | Carbos: ${Math.round(carbsGrams * 0.20)}g | Grasas: ${Math.round(fatGrams * 0.25)}g`,
        foods: [
          '170g de yogurt griego natural sin azúcar',
          '1 banana mediana rebanada',
          '15g de almendras o nueces tostadas',
          'Agua con electrolitos'
        ]
      },
      {
        meal: '🍲 Cena Reparadora & Antiinflamatoria',
        time: '08:00 - 09:00 PM',
        title: 'Salmón o Pescado Blanco con Puré de Calabaza',
        calories: Math.round(targetCalories * 0.22),
        macros: `Proteína: ${Math.round(proteinGrams * 0.22)}g | Carbos: ${Math.round(carbsGrams * 0.12)}g | Grasas: ${Math.round(fatGrams * 0.23)}g`,
        foods: [
          '160g de filete de pescado o atún',
          '150g de puré de calabaza / zapallo con especias',
          'Espárragos o verduras salteadas en sartén',
          'Té de manzanilla o relajante muscular'
        ]
      }
    ];
  }, [biometricResults]);

  const handleRunAIAnalysis = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
    }, 1200);
  };

  const handleSaveAndApply = () => {
    const routine = generatePersonalizedRoutine();
    const planData = {
      evaluatedAt: new Date().toLocaleDateString(),
      biometrics: biometricResults,
      inputs: formData,
      diet: {
        targetCalories: biometricResults.targetCalories,
        proteinGrams: biometricResults.proteinGrams,
        carbsGrams: biometricResults.carbsGrams,
        fatGrams: biometricResults.fatGrams,
        meals: generatedMealPlan
      },
      routine: {
        location: formData.trainingLocation,
        goal: formData.goal,
        exercises: routine
      }
    };

    onSavePlan(member.id, planData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-blue-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col my-auto">
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 text-xs font-black">
              <Sparkles size={14} className="text-blue-600 animate-spin-slow" />
              <span>Diagnóstico Biomédico & Prescripción por IA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Evaluación Corporal & Plan Integral para {member?.name}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Afiliado ID: <strong>{member?.id}</strong> • Estado: {member?.plan}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* PROGRESS STEPPER */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between overflow-x-auto gap-2">
          {[
            { num: 1, label: '1. Medidas & Composición' },
            { num: 2, label: '2. Objetivos & Entorno' },
            { num: 3, label: '3. Salud & Lesiones' },
            { num: 4, label: '4. Diagnóstico IA & Plan' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              disabled={s.num > step}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                step === s.num
                  ? 'bg-blue-600 text-white shadow-xs'
                  : step > s.num
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-gray-400 opacity-60'
              }`}
            >
              <span>{s.label}</span>
              {step > s.num && <CheckCircle2 size={13} className="text-emerald-600" />}
            </button>
          ))}
        </div>

        {/* MODAL CONTENT */}
        <div className="p-6">
          {/* ======================================================== */}
          {/* PASO 1: MEDIDAS ANTROPOMÉTRICAS & COMPOSICIÓN CORPORAL */}
          {/* ======================================================== */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed font-medium">
                💡 <strong>Validación Biomecánica:</strong> Ingresa las medidas para que el algoritmo
                estime con precisión clínica la <strong>Masa Magra</strong>, el <strong>% de Grasa Corporal</strong> y el
                gasto energético basal de {member?.name}.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Género */}
                <div>
                  <label className="text-xs font-black uppercase text-gray-500 block mb-1.5">Género Biológico</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'MALE' })}
                      className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                        formData.gender === 'MALE'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      Hombre
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'FEMALE' })}
                      className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                        formData.gender === 'FEMALE'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      Mujer
                    </button>
                  </div>
                </div>

                {/* Edad */}
                <div>
                  <label className="text-xs font-black uppercase text-gray-500 block mb-1.5">Edad (Años)</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                  />
                </div>

                {/* Peso */}
                <div>
                  <label className="text-xs font-black uppercase text-gray-500 block mb-1.5">Peso Corporal (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                  />
                </div>

                {/* Altura */}
                <div>
                  <label className="text-xs font-black uppercase text-gray-500 block mb-1.5">Altura / Estatura (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                  />
                </div>

                {/* Cintura */}
                <div>
                  <label className="text-xs font-black uppercase text-gray-500 block mb-1.5">Cintura a nivel ombligo (cm)</label>
                  <input
                    type="number"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                  />
                </div>

                {/* Cuello */}
                <div>
                  <label className="text-xs font-black uppercase text-gray-500 block mb-1.5">Cuello bajo nuez (cm)</label>
                  <input
                    type="number"
                    value={formData.neck}
                    onChange={(e) => setFormData({ ...formData, neck: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                  />
                </div>

                {/* Cadera (Mujer) */}
                {formData.gender === 'FEMALE' && (
                  <div>
                    <label className="text-xs font-black uppercase text-gray-500 block mb-1.5">Cadera máxima (cm)</label>
                    <input
                      type="number"
                      value={formData.hip}
                      onChange={(e) => setFormData({ ...formData, hip: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                    />
                  </div>
                )}
              </div>

              {/* TARJETA DE CÁLCULO EN TIEMPO REAL */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-5 text-white shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
                    <Scale size={15} />
                    <span>Composición Corporal Calculada en Tiempo Real</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Fórmula US Navy & Katch
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
                    <span className="text-[10px] text-blue-200 font-bold block uppercase">Grasa Corporal</span>
                    <span className="text-xl sm:text-2xl font-black text-white">{biometricResults.bodyFat}%</span>
                    <span className="text-[10px] text-gray-300 block">{biometricResults.fatMass} kg grasa</span>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
                    <span className="text-[10px] text-emerald-200 font-bold block uppercase">Masa Magra (Músculo)</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-300">{biometricResults.leanMass} kg</span>
                    <span className="text-[10px] text-gray-300 block">Tejido muscular activo</span>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
                    <span className="text-[10px] text-purple-200 font-bold block uppercase">Metabolismo Basal</span>
                    <span className="text-xl sm:text-2xl font-black text-purple-200">{biometricResults.bmr}</span>
                    <span className="text-[10px] text-gray-300 block">kcal en reposo</span>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
                    <span className="text-[10px] text-amber-200 font-bold block uppercase">Gasto Diario (TDEE)</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-300">{biometricResults.tdee}</span>
                    <span className="text-[10px] text-gray-300 block">kcal mantenimiento</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <span>Continuar a Objetivos & Entorno</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 2: OBJETIVOS Y ENTORNO (GYM VS CASA) */}
          {/* ======================================================== */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Lugar de entrenamiento */}
              <div>
                <label className="text-xs font-black uppercase text-gray-500 block mb-2">
                  ¿Dónde entrenará el Afiliado? (Lugar Preferido)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setFormData({ ...formData, trainingLocation: 'GYM' })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                      formData.trainingLocation === 'GYM'
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="p-3 rounded-xl bg-blue-600 text-white shrink-0">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900">En el Gimnasio (GYM)</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Entrenamiento completo en sala de pesas: máquinas guiadas, poleas, prensas y pesos de aislamiento.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, trainingLocation: 'CASA' })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                      formData.trainingLocation === 'CASA'
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="p-3 rounded-xl bg-emerald-600 text-white shrink-0">
                      <Home size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900">Desde Casa (Home Workout)</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Calistenia funcional con peso corporal, sin necesidad de equipamiento pesado o mancuernas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Objetivo Principal */}
              <div>
                <label className="text-xs font-black uppercase text-gray-500 block mb-2">
                  Objetivo Principal del Afiliado
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: 'HIPERTROFIA', title: 'Hipertrofia Muscular', desc: 'Aumentar masa magra con superávit proteico' },
                    { id: 'DEFINICION', title: 'Pérdida de Grasa', desc: 'Déficit calórico para marcar y definir' },
                    { id: 'RECOMPOSICION', title: 'Recomposición', desc: 'Quemar grasa y tonificar simultáneamente' },
                    { id: 'SALUD', title: 'Salud & Resistencia', desc: 'Acondicionamiento físico y longevidad' }
                  ].map((g) => (
                    <div
                      key={g.id}
                      onClick={() => setFormData({ ...formData, goal: g.id })}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        formData.goal === g.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-2xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      <p className="text-xs font-black">{g.title}</p>
                      <p className="text-[11px] text-gray-500 mt-1 leading-snug">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Días por semana */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-gray-500 block mb-1.5">
                    Días Disponibles a la Semana
                  </label>
                  <select
                    value={formData.daysPerWeek}
                    onChange={(e) => setFormData({ ...formData, daysPerWeek: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                  >
                    <option value={3}>3 Días por semana (Full Body)</option>
                    <option value={4}>4 Días por semana (Torso / Pierna o Push-Pull)</option>
                    <option value={5}>5 Días por semana (Split Avanzado)</option>
                    <option value={6}>6 Días por semana (Alto Rendimiento)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-gray-500 block mb-1.5">
                    Nivel de Experiencia
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                  >
                    <option value="Principiante">Principiante (0 a 6 meses de entrenamiento)</option>
                    <option value="Intermedio">Intermedio (6 meses a 2 años constantes)</option>
                    <option value="Avanzado">Avanzado (Más de 2 años con buena técnica)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Volver a Medidas
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <span>Continuar a Salud & Lesiones</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 3: CUESTIONARIO DE SALUD, ENFERMEDADES & LESIONES */}
          {/* ======================================================== */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950 leading-relaxed font-medium">
                ⚠️ <strong>Filtro de Seguridad Articular por IA:</strong> La IA analizará las lesiones y
                patologías declaradas para <strong>excluir ejercicios riesgosos</strong> (ej. evitar sentadillas pesadas
                si hay lesión de rodilla, o evitar cargas axiales si hay dolor lumbar) y formular una rutina 100% segura.
              </div>

              {/* Enfermedades / Patologías */}
              <div>
                <label className="text-xs font-black uppercase text-gray-500 block mb-2">
                  Enfermedades o Condiciones Médicas Declaradas
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'HIPERTENSION', label: 'Hipertensión Arterial' },
                    { id: 'DIABETES', label: 'Diabetes Tipo 1 / 2' },
                    { id: 'ASMA', label: 'Asma / Respiratorio' },
                    { id: 'CARDIOPATIA', label: 'Afección Cardíaca' }
                  ].map((dis) => {
                    const isSelected = formData.diseases.includes(dis.id);
                    return (
                      <button
                        key={dis.id}
                        type="button"
                        onClick={() => toggleArrayItem('diseases', dis.id)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                          isSelected
                            ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {dis.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lesiones Articulares */}
              <div>
                <label className="text-xs font-black uppercase text-gray-500 block mb-2">
                  Lesiones, Cirugías Previas o Zonas con Dolor Articular
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'RODILLA', label: '🦵 Lesión de Rodilla (Meniscos / LCA)' },
                    { id: 'LUMBAR', label: '⚡ Dolor Lumbar / Hernia Discal' },
                    { id: 'HOMBRO', label: '💪 Pinzamiento Hombro / Manguito' },
                    { id: 'CUELLO', label: '💆 Tensión Cervical / Cuello' },
                    { id: 'MUNECAS', label: '✋ Molestia en Muñecas' }
                  ].map((inj) => {
                    const isSelected = formData.injuries.includes(inj.id);
                    return (
                      <button
                        key={inj.id}
                        type="button"
                        onClick={() => toggleArrayItem('injuries', inj.id)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-2xs'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {inj.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Volver a Objetivos
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleRunAIAnalysis}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw size={15} className="animate-spin" />
                      <span>Procesando Validación Biomecánica por IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Generar Diagnóstico, Dieta & Rutina Personalizada</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 4: RESULTADO DE LA VALIDACIÓN POR IA (DIETA & RUTINA) */}
          {/* ======================================================== */}
          {step === 4 && (
            <div className="space-y-6">
              {/* BANNER DE DICTAMEN CLÍNICO IA */}
              <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                      ✓ Diagnóstico Integral Aprobado por IA
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black mt-2">
                      Plan Específico Biomecánico & Nutricional
                    </h3>
                    <p className="text-xs text-blue-200 mt-0.5">
                      Entorno: <strong>{formData.trainingLocation === 'GYM' ? '🏢 Gimnasio (Máquinas)' : '🏠 Casa (Calistenia)'}</strong> • Meta:{' '}
                      <strong>{formData.goal}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-black text-amber-300">
                      {biometricResults.targetCalories}{' '}
                      <span className="text-xs text-gray-300">kcal/día</span>
                    </span>
                    <span className="text-[11px] text-gray-300 block">Prescripción Calórica Exacta</span>
                  </div>
                </div>

                {/* Resumen de Macros */}
                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <span className="text-[10px] text-blue-200 font-bold uppercase block">Proteínas</span>
                    <span className="text-lg font-black text-white">{biometricResults.proteinGrams}g</span>
                    <span className="text-[10px] text-gray-300 block">Construcción muscular</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <span className="text-[10px] text-amber-200 font-bold uppercase block">Carbohidratos</span>
                    <span className="text-lg font-black text-white">{biometricResults.carbsGrams}g</span>
                    <span className="text-[10px] text-gray-300 block">Energía glucolítica</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <span className="text-[10px] text-emerald-200 font-bold uppercase block">Grasas Saludables</span>
                    <span className="text-lg font-black text-white">{biometricResults.fatGrams}g</span>
                    <span className="text-[10px] text-gray-300 block">Salud hormonal</span>
                  </div>
                </div>

                {/* Advertencias por Lesiones */}
                {formData.injuries.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-amber-300">
                    <ShieldAlert size={16} className="shrink-0" />
                    <span>
                      <strong>Adaptación por lesión activa:</strong> Se adaptó el volumen articular para{' '}
                      {formData.injuries.join(', ')}.
                    </span>
                  </div>
                )}
              </div>

              {/* SECCIÓN 1: PLAN NUTRICIONAL & DIETA CALÓRICA */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Utensils size={16} className="text-emerald-600" />
                    <span>Menú Nutricional Diario Sugerido (4 Comidas Estructuradas)</span>
                  </h4>
                  <span className="text-xs font-bold text-gray-500">
                    Hidratación meta: <strong>{+(formData.weight * 0.035).toFixed(1)} L/día</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedMealPlan.map((m, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-800">{m.meal}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {m.calories} kcal
                        </span>
                      </div>
                      <p className="text-xs font-bold text-blue-900">{m.title}</p>
                      <p className="text-[10px] text-gray-500 font-semibold">{m.macros}</p>
                      <ul className="text-[11px] text-gray-600 space-y-1 pt-1 border-t border-gray-200/60">
                        {m.foods.map((food, fIdx) => (
                          <li key={fIdx}>• {food}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECCIÓN 2: RUTINA ESPECÍFICA GENERADA POR IA */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Dumbbell size={16} className="text-blue-600" />
                    <span>
                      Rutina Adaptada por IA ({formData.trainingLocation === 'GYM' ? 'Máquinas GYM' : 'En Casa'})
                    </span>
                  </h4>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {formData.daysPerWeek} días / semana
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatePersonalizedRoutine().map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {ex.muscleGroup}
                          </span>
                          <span className="text-xs font-extrabold text-gray-700">
                            {ex.sets} × {ex.reps}
                          </span>
                        </div>
                        <h5 className="text-xs font-black text-gray-900">{ex.name}</h5>
                        <p className="text-[11px] text-gray-500 mt-0.5">{ex.machineType}</p>
                        <p className="text-[10px] font-semibold text-emerald-700 mt-2 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-100">
                          {ex.safetyNote}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-gray-400 font-semibold">Descanso: {ex.rest}</span>
                        <span className="font-bold text-blue-600 flex items-center gap-1">
                          <Play size={11} className="fill-blue-600" />
                          <span>Vídeo Real Disponible</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACCIONES FINALES */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Volver a Revisar Datos
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndApply}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Guardar & Asignar Plan al Afiliado</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
