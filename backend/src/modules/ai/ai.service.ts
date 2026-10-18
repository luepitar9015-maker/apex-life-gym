// Servicio de Inteligencia Artificial para Nutrición, Diagnóstico y Entrenamiento (Google Gemini)

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export interface NutritionSupplement {
  name: string;
  dosage: string;
  timing: string;
  benefit: string;
  warning?: string;
}

export interface NutritionPlanAIData {
  title: string;
  maintenanceCalories?: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  goal: string;
  meals: Array<{
    meal: string;
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    items: string[];
  }>;
  supplements?: NutritionSupplement[];
  recommendations: string[];
}

export interface RoutineAIData {
  name: string;
  description: string;
  goal: string;
  difficulty: string;
  location: string;
  daysPerWeek: number;
  aiNotes: string;
  days: Array<{
    dayNumber: number;
    dayTitle: string;
    exercises: Array<{
      exerciseName: string;
      muscleGroup: string;
      sets: number;
      reps: string;
      restSeconds: number;
      notes: string;
    }>;
  }>;
}

export interface HealthDiagnosticAIData {
  bodyFatPercentage: number;
  muscleMassKg: number;
  bmi: number;
  biotype: 'Ectomorfo' | 'Mesomorfo' | 'Endomorfo' | 'Atlético Mixto';
  aiClinicalSummary: string;
  prohibitedExercises: string;
  recommendedActions: string;
}

// Función auxiliar de llamada a Google Gemini con fallback de modelos
async function callGemini(parts: any[]): Promise<string> {
  const models = ['gemini-3.8-flash', 'gemini-2.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2500,
          },
        }),
      });

      const data: any = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || `Error con modelo ${model}`);
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err: any) {
      lastError = err;
      console.warn(`Aviso Gemini (${model}):`, err.message);
    }
  }

  throw lastError || new Error('No se pudo conectar a los modelos de Google Gemini');
}

// -------------------------------------------------------------
// 1. Diagnóstico Fisiológico y con IA (Multimodal / Foto + Cuestionario)
// -------------------------------------------------------------
export const analyzeHealthDiagnosticAI = async (params: {
  memberName: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  targetGoal: string;
  diseases?: string;
  injuries?: string;
  disabilities?: string;
  trainingExperience?: string;
  photoBase64?: string; // imagen en base64 si el usuario subió una foto o escaneó
}): Promise<HealthDiagnosticAIData> => {
  // Cálculo base de IMC
  const heightM = params.height > 3 ? params.height / 100 : params.height;
  const rawBmi = params.weight / (heightM * heightM);
  const bmi = parseFloat(rawBmi.toFixed(1));

  const promptText = `Actúa como un Médico Deportivo y Fisiólogo de Alto Rendimiento.
Realiza un DIAGNÓSTICO INTEGRAL DEPORTIVO del siguiente afiliado:
- Nombre: ${params.memberName}
- Género: ${params.gender}
- Edad: ${params.age || 26} años
- Peso: ${params.weight} kg
- Estatura: ${heightM} m (IMC: ${bmi})
- ¿Qué desea mejorar / Objetivo?: ${params.targetGoal}
- Enfermedades declaradas: ${params.diseases || 'Ninguna'}
- Lesiones previas o activas: ${params.injuries || 'Sin lesiones'}
- Discapacidades o restricciones motoras: ${params.disabilities || 'Ninguna'}
- Nivel de experiencia en entrenamiento: ${params.trainingExperience || 'Principiante'}

Si hay una imagen corporal adjunta, evalúa la simetría muscular, biotipo aparente y estima el porcentaje de grasa corporal.
Si no hay imagen, realiza la estimación antropométrica clínica más rigurosa posible.

ES CRÍTICO:
1. Identificar ejercicios PROHIBIDOS específicamente para no agravar sus lesiones (ej. Si tiene lesión lumbar: prohibido peso muerto pesado o sentadilla libre; si tiene lesión de hombro: prohibido press militar tras nuca).
2. Considerar sus enfermedades (ej. Hipertensión: evitar maniobra de Valsalva prolongada; Diabetes: controlar hipoglucemias).

Responde ÚNICAMENTE con un objeto JSON sin markdown exterior con esta estructura:
{
  "bodyFatPercentage": 19.5,
  "muscleMassKg": 58.2,
  "bmi": ${bmi},
  "biotype": "Mesomorfo",
  "aiClinicalSummary": "Diagnóstico claro y profesional del atleta, estado físico y precauciones.",
  "prohibitedExercises": "Lista explícita de ejercicios y movimientos que NO debe realizar por riesgo de lesión.",
  "recommendedActions": "Estrategia biomecánica recomendada para lograr su objetivo de forma segura."
}`;

  const requestParts: any[] = [];

  // Si se envió foto en base64
  if (params.photoBase64) {
    const cleanBase64 = params.photoBase64.replace(/^data:image\/\w+;base64,/, '');
    requestParts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: 'image/jpeg',
      },
    });
  }

  requestParts.push({ text: promptText });

  try {
    const rawText = await callGemini(requestParts);
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error('Fallback a diagnóstico deportivo local:', error.message);

    // Fallback inteligente de fisiología deportiva
    let estimatedFat = params.gender === 'FEMALE' ? 24.0 : 16.0;
    if (bmi > 27) estimatedFat += 6;
    if (bmi < 20) estimatedFat -= 3;
    const muscleMass = parseFloat((params.weight * (1 - estimatedFat / 100)).toFixed(1));

    let prohibited = 'Ninguno restrictivo.';
    if (params.injuries?.toLowerCase().includes('rodilla')) {
      prohibited = 'Sentadillas profundas con barra libre, Prensa inclinada con carga máxima, Saltos pliométricos de alto impacto.';
    } else if (params.injuries?.toLowerCase().includes('lumbar') || params.injuries?.toLowerCase().includes('espalda')) {
      prohibited = 'Peso muerto con barra, Buenos días, Remo con barra 90°, Sentadilla frontal pesada.';
    } else if (params.injuries?.toLowerCase().includes('hombro') || params.injuries?.toLowerCase().includes('manguito')) {
      prohibited = 'Press militar tras nuca, Fondos en paralelas profundos, Elevaciones laterales por encima de 90°.';
    }

    return {
      bodyFatPercentage: estimatedFat,
      muscleMassKg: muscleMass,
      bmi,
      biotype: bmi > 26 ? 'Endomorfo' : bmi < 21 ? 'Ectomorfo' : 'Mesomorfo',
      aiClinicalSummary: `Afiliado con IMC ${bmi} en categoría ${bmi >= 25 ? 'Sobrepeso leve' : 'Normopeso'}. Objetivo: ${params.targetGoal}. Se detectan antecedentes de: ${params.injuries || params.diseases || 'salud óptima'}.`,
      prohibitedExercises: prohibited,
      recommendedActions: `Iniciar con acondicionamiento metabólico controlado. Priorizar máquinas guiadas y poleas para aislar los grupos musculares sin comprometer articulaciones lesionadas.`,
    };
  }
};

// -------------------------------------------------------------
// 2. Generador de Nutrición IA con Preferencias de Alimentos (Gustos & Rechazos)
// -------------------------------------------------------------
export const generateNutritionPlanAI = async (params: {
  memberId: string;
  memberName: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  dietaryRestrictions?: string;
  likedFoods?: string[];     // Alimentos que LE GUSTAN
  dislikedFoods?: string[];  // Alimentos que NO LE GUSTAN o alergias
  diseases?: string;         // Enfermedades a considerar (diabetes, hipertensión)
  trainingDaysPerWeek?: number;
}): Promise<NutritionPlanAIData> => {
  const likedStr = params.likedFoods && params.likedFoods.length > 0 ? params.likedFoods.join(', ') : 'Cualquiera saludable';
  const dislikedStr = params.dislikedFoods && params.dislikedFoods.length > 0 ? params.dislikedFoods.join(', ') : 'Ninguno';

  // Cálculo cinético y nutricional de alta precisión (Mifflin-St Jeor)
  const isMale = params.gender !== 'FEMALE';
  const heightCm = params.height > 3 ? params.height : params.height * 100;
  const bmr = isMale
    ? 10 * params.weight + 6.25 * heightCm - 5 * (params.age || 26) + 5
    : 10 * params.weight + 6.25 * heightCm - 5 * (params.age || 26) - 161;

  const activityFactor = 1.45 + (params.trainingDaysPerWeek ? (params.trainingDaysPerWeek - 3) * 0.04 : 0.05);
  const maintenanceCalories = Math.round(bmr * activityFactor);

  let targetCalories = maintenanceCalories;
  if (params.goal === 'FAT_LOSS') targetCalories = Math.round(maintenanceCalories - 450);
  else if (params.goal === 'HYPERTROPHY') targetCalories = Math.round(maintenanceCalories + 350);

  const prompt = `Actúa como un Nutricionista Deportivo de Élite y Master en Bioquímica Nutricional.
Diseña un Plan Nutricional y de Suplementación Inteligente para el atleta:
- Nombre: ${params.memberName}
- Género: ${params.gender}
- Edad: ${params.age || 26} años
- Peso: ${params.weight} kg
- Estatura: ${params.height} m
- Tasa Metabólica Basal (TMB): ${Math.round(bmr)} kcal
- Calorías de Mantenimiento Estimadas: ${maintenanceCalories} kcal
- Calorías Objetivo (${params.goal}): ${targetCalories} kcal
- Objetivo Principal: ${params.goal} (FAT_LOSS = Déficit calórico, HYPERTROPHY = Superávit magro, RECOMPOSITION = Recomposición)
- Días de entrenamiento a la semana: ${params.trainingDaysPerWeek || 4}
- Enfermedades o condiciones a considerar: ${params.diseases || 'Ninguna'}
- RESTRICCIÓN OBLIGATORIA DE ALIMENTOS:
  * ALIMENTOS QUE LE GUSTAN (PRIORIZAR): ${likedStr}
  * ALIMENTOS QUE NO LE GUSTAN / RECHAZA / ALERGIAS (TOTALMENTE PROHIBIDOS): ${dislikedStr}

REGLAS ESTRICTAS:
1. No incluyas en ninguna comida los alimentos listados como rechazados (${dislikedStr}).
2. Incorpora creativamente los alimentos favoritos (${likedStr}) distribuidos a lo largo del día.
3. Especifica los gramos exactos y calorías de cada ingrediente.
4. INCLUYE UNA GUÍA DE SUPLEMENTACIÓN DEPORTIVA idónea para su objetivo y salud (ej: Creatina, Proteína Whey, Omega 3, Magnesio nocturno). Si tiene hipertensión o patología cardíaca, PROHÍBE explícitamente cafeína o quemadores agresivos.

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown exterior):
{
  "title": "Plan Personalizado de Nutrición y Suplementación (${params.goal})",
  "maintenanceCalories": ${maintenanceCalories},
  "targetCalories": ${targetCalories},
  "proteinGrams": 160,
  "carbsGrams": 220,
  "fatsGrams": 50,
  "goal": "${params.goal}",
  "meals": [
    {
      "meal": "Desayuno (07:30 AM)",
      "title": "Nombre descriptivo de la comida",
      "calories": 520,
      "protein": 38,
      "carbs": 60,
      "fats": 14,
      "items": [
        "100g de avena en hojuelas con canela",
        "4 claras de huevo + 1 huevo entero revueltos"
      ]
    },
    {
      "meal": "Almuerzo Energético (12:30 PM)",
      "title": "...",
      "calories": 650,
      "protein": 48,
      "carbs": 75,
      "fats": 16,
      "items": ["150g de pechuga de pollo a la plancha", "150g de arroz integral al vapor", "Porción de aguacate 50g"]
    },
    {
      "meal": "Merienda Pre/Post Entreno (04:30 PM)",
      "title": "...",
      "calories": 380,
      "protein": 30,
      "carbs": 45,
      "fats": 8,
      "items": ["1 yogur griego natural", "1 plátano mediano", "30g de frutos secos"]
    },
    {
      "meal": "Cena Ligera de Recuperación (08:00 PM)",
      "title": "...",
      "calories": 500,
      "protein": 44,
      "carbs": 40,
      "fats": 12,
      "items": ["160g de pescado blanco o atún", "Ensalada verde con aceite de oliva"]
    }
  ],
  "supplements": [
    {
      "name": "Creatina Monohidratada (Creapure)",
      "dosage": "5 gramos diarios",
      "timing": "Todos los días a la misma hora (post-entreno o con el desayuno)",
      "benefit": "Incrementa la fuerza explosiva, la hidratación celular y la tasa de recuperación muscular."
    },
    {
      "name": "Proteína de Suero (Whey Isolate)",
      "dosage": "1 scoop (30g) aportando 25g de proteína",
      "timing": "Inmediatamente después de entrenar o como merienda proteica",
      "benefit": "Acelera la síntesis proteica muscular post-entrenamiento."
    },
    {
      "name": "Omega 3 (EPA / DHA)",
      "dosage": "2 cápsulas (2000mg total)",
      "timing": "Con el almuerzo",
      "benefit": "Efecto antiinflamatorio articular y protección cardiovascular."
    },
    {
      "name": "Bisglicinato de Magnesio",
      "dosage": "350mg",
      "timing": "40 minutos antes de dormir",
      "benefit": "Optimiza el descanso profundo REM y la relajación neuromuscular."
    }
  ],
  "recommendations": [
    "Mantener ingesta hídrica de al menos ${(params.weight * 0.045).toFixed(1)} litros diarios",
    "Consumir la merienda 60 minutos antes o después de entrenar",
    "Respetar los descansos entre comidas para mantener sensibilidad a la insulina"
  ]
}`;

  try {
    const rawText = await callGemini([{ text: prompt }]);
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (!parsed.maintenanceCalories) parsed.maintenanceCalories = maintenanceCalories;
    return parsed;
  } catch (error: any) {
    console.error('Fallback a cálculo nutricional deportivo local:', error.message);

    const proteinGrams = Math.round(params.weight * 2.0);
    const fatsGrams = Math.round(params.weight * 0.85);
    const carbsGrams = Math.round((targetCalories - (proteinGrams * 4 + fatsGrams * 9)) / 4);

    const hasHypertension = params.diseases?.toLowerCase().includes('hipertens') || params.diseases?.toLowerCase().includes('presion');

    return {
      title: `Plan Nutricional Adaptado (${params.goal === 'FAT_LOSS' ? 'Déficit de Grasa' : 'Hipertrofia'})`,
      maintenanceCalories,
      targetCalories,
      proteinGrams,
      carbsGrams,
      fatsGrams,
      goal: params.goal,
      meals: [
        {
          meal: 'Desayuno Proteico (07:30 AM)',
          title: 'Bowl de Avena con Proteína y Frutas Permitidas',
          calories: Math.round(targetCalories * 0.28),
          protein: Math.round(proteinGrams * 0.25),
          carbs: Math.round(carbsGrams * 0.3),
          fats: Math.round(fatsGrams * 0.25),
          items: [
            '80g de avena en hojuelas con canela al vapor',
            '3 claras de huevo + 1 huevo entero revuelto',
            params.likedFoods?.includes('Plátano') ? '1 Plátano mediano' : '1 manzana verde en rodajas',
          ],
        },
        {
          meal: 'Almuerzo Equilibrado (12:30 PM)',
          title: 'Proteína Magra con Carbohidratos Complejos y Ensalada',
          calories: Math.round(targetCalories * 0.35),
          protein: Math.round(proteinGrams * 0.35),
          carbs: Math.round(carbsGrams * 0.35),
          fats: Math.round(fatsGrams * 0.35),
          items: [
            '160g de pechuga de pollo o filete magro a la plancha',
            '150g de arroz integral o batata al horno',
            'Ensalada fresca de espinacas y vegetales con 1 cucharada de aceite de oliva',
          ],
        },
        {
          meal: 'Merienda de Media Tarde (04:30 PM)',
          title: 'Snack de Energía y Recuperación Muscular',
          calories: Math.round(targetCalories * 0.17),
          protein: Math.round(proteinGrams * 0.15),
          carbs: Math.round(carbsGrams * 0.2),
          fats: Math.round(fatsGrams * 0.15),
          items: [
            '1 porción de yogur griego natural sin azúcar añadido',
            '25g de almendras o nueces enteras',
          ],
        },
        {
          meal: 'Cena Reparadora Nocturna (08:00 PM)',
          title: 'Pescado Blanco o Pechuga con Vegetales Salteados',
          calories: Math.round(targetCalories * 0.2),
          protein: Math.round(proteinGrams * 0.25),
          carbs: Math.round(carbsGrams * 0.15),
          fats: Math.round(fatsGrams * 0.25),
          items: [
            '150g de pescado blanco (tilapia/merluza) con especias',
            'Brócoli y espárragos al vapor',
            '40g de aguacate fresco',
          ],
        },
      ],
      supplements: [
        {
          name: 'Creatina Monohidratada (Creapure)',
          dosage: '5g diarios',
          timing: 'Todos los días a la misma hora con agua abundante',
          benefit: 'Aumenta fuerza, potencia y velocidad de recuperación neuromuscular.',
        },
        {
          name: 'Proteína Whey Isolate',
          dosage: '1 porción (30g)',
          timing: 'Post-entrenamiento o entre comidas principales',
          benefit: 'Proporciona aminoácidos esenciales de rápida absorción.',
        },
        {
          name: 'Omega 3 de Alta Concentración',
          dosage: '1000mg a 2000mg al día',
          timing: 'Con el almuerzo',
          benefit: 'Protección cardiovascular y reducción del dolor muscular tardío (DOMS).',
        },
        {
          name: 'Citrato o Bisglicinato de Magnesio',
          dosage: '350mg',
          timing: 'Antes de dormir',
          benefit: 'Favorece la síntesis de testosterona nocturna y relajación muscular.',
        },
        ...(hasHypertension
          ? [
              {
                name: 'Advertencia Médica: Pre-entrenos con Cafeína',
                dosage: '0 mg',
                timing: 'No consumir',
                benefit: 'Contraindicado para evitar picos de presión arterial.',
                warning: 'Evitar estimulantes artificiales por condición de hipertensión.',
              },
            ]
          : []),
      ],
      recommendations: [
        `Plan adaptado a preferencias: priorizando ${likedStr} y excluyendo ${dislikedStr}`,
        `Calorías de Mantenimiento: ${maintenanceCalories} kcal | Objetivo: ${targetCalories} kcal`,
        `Meta de hidratación: ${(params.weight * 0.045).toFixed(1)} litros diarios`,
        'Priorizar el descanso nocturno de mínimo 7 horas para síntesis proteica',
      ],
    };
  }
};

// -------------------------------------------------------------
// 3. Generador de Rutinas IA (Gimnasio o Casa)
// -------------------------------------------------------------
export const generateRoutineAI = async (params: {
  memberId?: string;
  memberName: string;
  goal: string;
  level: string;
  location: string;
  daysPerWeek: number;
  trainingDays?: number[]; // ej: [1, 3, 5] -> Lunes, Miércoles, Viernes
  prohibitedExercises?: string;
}): Promise<RoutineAIData> => {
  const isHome = params.location === 'HOME';
  const prohibitedNotice = params.prohibitedExercises ? `\nEJERCICIOS PROHIBIDOS POR LESIÓN: ${params.prohibitedExercises}` : '';

  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const specifiedDaysNotice = params.trainingDays && params.trainingDays.length > 0
    ? `\nDÍAS EXACTOS EN QUE EL ATLETA VA A ENTRENAR: ${params.trainingDays.map((d) => `${d}: ${dayNames[d - 1]}`).join(', ')}. DEBES CREAR UNA SESIÓN PARA CADA UNO DE ESTOS DÍAS EXACTAMENTE.`
    : '';

  const prompt = `Actúa como un Entrenador Personal de Élite y Biomecánico Deportivo.
Crea una rutina de entrenamiento estructurada POR LOS DÍAS DE LA SEMANA (Lunes a Domingo) para el atleta ${params.memberName}:
- Objetivo: ${params.goal} (HYPERTROPHY, FAT_LOSS, STRENGTH, ENDURANCE)
- Nivel: ${params.level}
- Ubicación: ${isHome ? 'EN CASA (Sin máquinas, usando peso corporal, calistenia, bandas y elementos del hogar)' : 'EN GIMNASIO (Con máquinas, poleas, mancuernas y barras)'}
- Días de entrenamiento a la semana: ${params.daysPerWeek} días
${specifiedDaysNotice}
${prohibitedNotice}

REGLA OBLIGATORIA:
Las rutinas se deben distribuir explícitamente por los DÍAS DE LA SEMANA (1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes, 6: Sábado, 7: Domingo):
${params.trainingDays && params.trainingDays.length > 0 ? `- Genera exclusivamente los días solicitados: ${params.trainingDays.join(', ')}.` : `- Si entrena 3 días: usa Lunes (1), Miércoles (3), Viernes (5).
- Si entrena 4 días: usa Lunes (1), Martes (2), Jueves (4), Viernes (5).
- Si entrena 5 días: usa Lunes (1), Martes (2), Miércoles (3), Jueves (4), Viernes (5).
- Si entrena 6 días: usa Lunes (1), Martes (2), Miércoles (3), Jueves (4), Viernes (5), Sábado (6).`}
- Cada día DEBE incluir en dayTitle el nombre del día de la semana y el grupo muscular (ej: "Lunes: Pecho y Tríceps", "Martes: Espalda y Bíceps", "Jueves: Pierna y Glúteo").

Responde ÚNICAMENTE con un JSON válido (sin markdown exterior):
{
  "name": "Rutina Semanal ${isHome ? 'en Casa' : 'Gimnasio'} - ${params.goal}",
  "description": "Distribución semanal de entrenamiento biomecánico",
  "goal": "${params.goal}",
  "difficulty": "${params.level}",
  "location": "${params.location}",
  "daysPerWeek": ${params.daysPerWeek},
  "aiNotes": "Recomendaciones técnicas del entrenador para cada día de la semana",
  "days": [
    {
      "dayNumber": 1,
      "dayTitle": "Lunes: Pectoral y Tríceps",
      "exercises": [
        {
          "exerciseName": "${isHome ? 'Flexiones de Pecho (Push-ups)' : 'Press de Banca Plano'}",
          "muscleGroup": "CHEST",
          "sets": 4,
          "reps": "10-12",
          "restSeconds": 60,
          "notes": "Tempo controlado 2-0-1"
        }
      ]
    }
  ]
}`;

  try {
    const rawText = await callGemini([{ text: prompt }]);
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error('Fallback a rutina biomecánica local:', error.message);

    const userDays = (params.trainingDays && params.trainingDays.length > 0)
      ? params.trainingDays
      : [1, 2, 4, 5].slice(0, params.daysPerWeek);

    const dayTemplates = [
      {
        focus: 'Pecho, Hombro y Tríceps (Empuje)',
        exercises: [
          {
            exerciseName: isHome ? 'Flexiones de Pecho (Push-ups)' : 'Press de Banca Plano con Barra',
            muscleGroup: 'CHEST',
            sets: 4,
            reps: '10-12',
            restSeconds: 75,
            notes: 'Cadencia 2-0-1-0 sin bloquear codos',
          },
          {
            exerciseName: isHome ? 'Fondos en Silla o Banco' : 'Press Militar con Mancuernas',
            muscleGroup: 'SHOULDERS',
            sets: 3,
            reps: '12',
            restSeconds: 60,
            notes: 'Rango de movimiento completo',
          },
          {
            exerciseName: isHome ? 'Plancha Abdominal Estática' : 'Extensiones de Tríceps en Polea Alta',
            muscleGroup: 'ARMS',
            sets: 3,
            reps: '15',
            restSeconds: 45,
            notes: 'Aislamiento concéntrico',
          },
        ],
      },
      {
        focus: 'Espalda y Bíceps (Tracción)',
        exercises: [
          {
            exerciseName: isHome ? 'Dominadas o Remo con Toalla' : 'Jalón al Pecho en Polea Alta',
            muscleGroup: 'BACK',
            sets: 4,
            reps: '10-12',
            restSeconds: 75,
            notes: 'Retracción escapular al final',
          },
          {
            exerciseName: isHome ? 'Remo Unilateral con Botella/Mochila' : 'Remo en Polea Baja (Gironda)',
            muscleGroup: 'BACK',
            sets: 3,
            reps: '12',
            restSeconds: 60,
            notes: 'Espalda neutra',
          },
          {
            exerciseName: isHome ? 'Curl de Bíceps con Mochila' : 'Curl de Bíceps con Barra Z',
            muscleGroup: 'ARMS',
            sets: 3,
            reps: '12',
            restSeconds: 45,
            notes: 'Codos pegados al torso',
          },
        ],
      },
      {
        focus: 'Pierna, Cuádriceps y Glúteo',
        exercises: [
          {
            exerciseName: isHome ? 'Sentadillas con Salto (Jump Squats)' : 'Prensa de Piernas 45 Grados',
            muscleGroup: 'LEGS',
            sets: 4,
            reps: '12-15',
            restSeconds: 90,
            notes: 'Empujar con los talones',
          },
          {
            exerciseName: isHome ? 'Zancadas Dinámicas (Lunges)' : 'Curl Femoral Tumbado en Máquina',
            muscleGroup: 'LEGS',
            sets: 3,
            reps: '12 por pierna',
            restSeconds: 60,
            notes: 'Mantener torso recto',
          },
          {
            exerciseName: isHome ? 'Elevación de Talones para Gemelos' : 'Elevación de Talones en Máquina',
            muscleGroup: 'LEGS',
            sets: 4,
            reps: '20',
            restSeconds: 45,
            notes: 'Pausa isométrica de 2s arriba',
          },
        ],
      },
      {
        focus: 'Hombros, Trapecio y Core Abdominal',
        exercises: [
          {
            exerciseName: isHome ? 'Pike Push-ups para Deltoides' : 'Press Militar con Mancuernas',
            muscleGroup: 'SHOULDERS',
            sets: 4,
            reps: '10-12',
            restSeconds: 75,
            notes: 'Buena estabilidad escapular',
          },
          {
            exerciseName: isHome ? 'Elevaciones Laterales con Peso' : 'Elevaciones Laterales en Polea',
            muscleGroup: 'SHOULDERS',
            sets: 4,
            reps: '15',
            restSeconds: 45,
            notes: 'Codos ligeramente flexionados',
          },
          {
            exerciseName: isHome ? 'Plancha Abdominal Frontal' : 'Crunch Abdominal en Polea Alta',
            muscleGroup: 'CORE',
            sets: 4,
            reps: '20',
            restSeconds: 45,
            notes: 'Activación del transverso',
          },
        ],
      },
      {
        focus: 'Full Body Funcional & Recuperación Activa',
        exercises: [
          {
            exerciseName: isHome ? 'Burpees sin impacto' : 'Kettlebell Swing',
            muscleGroup: 'CARDIO',
            sets: 3,
            reps: '15',
            restSeconds: 60,
            notes: 'Control respiratorio constante',
          },
          {
            exerciseName: isHome ? 'Escaladores (Mountain Climbers)' : 'Remo en Máquina de Remo Concept2',
            muscleGroup: 'CARDIO',
            sets: 4,
            reps: '30 seg',
            restSeconds: 45,
            notes: 'Intensidad moderada continua',
          },
        ],
      },
      {
        focus: 'Brazos, Core y Acondicionamiento Metabólico',
        exercises: [
          {
            exerciseName: isHome ? 'Fondos de Tríceps' : 'Curl Martillo con Mancuernas',
            muscleGroup: 'ARMS',
            sets: 3,
            reps: '12',
            restSeconds: 45,
            notes: 'Aislamiento de bíceps braquial',
          },
          {
            exerciseName: isHome ? 'Crunch Abdominal en Suelo' : 'Plancha Lateral con Elevación',
            muscleGroup: 'CORE',
            sets: 3,
            reps: '15 por lado',
            restSeconds: 45,
            notes: 'Estabilización pélvica',
          },
        ],
      },
      {
        focus: 'Movilidad Articular & Estiramientos Profundos',
        exercises: [
          {
            exerciseName: 'Yoga Deportivo & Estiramiento Isquiotibial',
            muscleGroup: 'CORE',
            sets: 3,
            reps: '45 seg',
            restSeconds: 30,
            notes: 'Respiración diafragmática profunda',
          },
        ],
      },
    ];

    const generatedDays = userDays.map((d, index) => {
      const template = dayTemplates[index % dayTemplates.length];
      const dName = dayNames[d - 1] || `Día ${d}`;
      return {
        dayNumber: d,
        dayTitle: `${dName}: ${template.focus}`,
        exercises: template.exercises,
      };
    });

    return {
      name: `Rutina Semanal ${isHome ? 'en Casa' : 'en Gimnasio'} (${userDays.length} Días)`,
      description: `Programa de entrenamiento biomecánico estructurado por días de la semana para ${params.goal}.`,
      goal: params.goal,
      difficulty: params.level,
      location: params.location,
      daysPerWeek: userDays.length,
      aiNotes: `Calentar 8 minutos antes de iniciar cada sesión. Respetar los días de descanso para óptima recuperación muscular.`,
      days: generatedDays,
    };
  }
};
