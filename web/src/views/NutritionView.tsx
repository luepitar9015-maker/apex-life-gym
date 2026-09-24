import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Flame, 
  Droplets, 
  Apple, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Unlock
} from 'lucide-react';
import { generateMealPlanWithBackendAI } from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface NutritionViewProps {
  currentTheme?: ColorTheme;
}

export const NutritionView: React.FC<NutritionViewProps> = ({ currentTheme = getSavedTheme() }) => {
  const [activeMeal, setActiveMeal] = useState('ALL');
  const [loadingAI, setLoadingAI] = useState(false);
  const [targetCalories, setTargetCalories] = useState(2400);

  const [plan, setPlan] = useState({
    title: 'Recomposición Corporal & Definición Magra',
    client: 'Juan Pérez',
    caloriesTarget: 2400,
    proteinGrams: 165,
    carbsGrams: 260,
    fatGrams: 65,
    waterLiters: 3.2,
    meals: [
      {
        name: 'Desayuno Energético',
        time: '07:30 AM',
        calories: 580,
        protein: 38,
        carbs: 65,
        fat: 16,
        items: [
          '3 Huevos enteros revueltos + 2 claras',
          '80g Avena en hojuelas con canela y agua',
          '1 Plátano mediano picado',
          'Café negro sin azúcar'
        ]
      },
      {
        name: 'Almuerzo Anabólico',
        time: '01:00 PM',
        calories: 720,
        protein: 52,
        carbs: 85,
        fat: 18,
        items: [
          '180g Pechuga de pollo a la plancha',
          '200g Arroz blanco cocido',
          '1/2 Aguacate Hass en rodajas',
          'Ensalada verde libre con aceite de oliva (5ml)'
        ]
      },
      {
        name: 'Merienda / Pre-Entreno',
        time: '04:30 PM',
        calories: 450,
        protein: 32,
        carbs: 60,
        fat: 8,
        items: [
          '1 Scoop (30g) Proteína Whey Isolate',
          '40g Harina de arroz o tortitas de arroz (4 uds)',
          '1 Manzana verde picada',
          '5g Creatina Monohidrato'
        ]
      },
      {
        name: 'Cena de Recuperación Nocturna',
        time: '08:30 PM',
        calories: 650,
        protein: 43,
        carbs: 50,
        fat: 23,
        items: [
          '200g Filete de Salmón o Ternera magra',
          '180g Batata / Camote asado',
          'Brócoli y espárragos al vapor con sal marina',
          'Infusión de manzanilla digestiva'
        ]
      }
    ]
  });

  const handleGenerateAI = async () => {
    setLoadingAI(true);
    try {
      const generated = await generateMealPlanWithBackendAI({
        targetCalories: targetCalories,
        goal: 'HIPERTROFIA_MAGRA'
      });
      if (generated?.meals) {
        setPlan(prev => ({
          ...prev,
          caloriesTarget: generated.caloriesTarget || prev.caloriesTarget,
          proteinGrams: generated.proteinGrams || prev.proteinGrams,
          carbsGrams: generated.carbsGrams || prev.carbsGrams,
          fatGrams: generated.fatGrams || prev.fatGrams,
          meals: generated.meals || prev.meals
        }));
      }
    } catch (e) {
      console.warn('Fallback a plan predeterminado');
    } finally {
      setTimeout(() => setLoadingAI(false), 900);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER ESTILO NEXO: VIBRANTE + WIDGET FLOTANTE + DIET-AI */}
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
          DIET-AI
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
              % NUTRICIÓN DEPORTIVA & METABOLISMO
            </span>
            <span style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.82rem', fontWeight: 700 }}>
              Cálculo Calórico Basal & Macronutrientes
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
            PLAN NUTRICIONAL <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>DEPORTIVO</span>
          </h1>

          <p style={{
            color: 'rgba(7, 10, 18, 0.85)',
            fontSize: '0.92rem',
            fontWeight: 600,
            margin: '0.4rem 0 0 0',
            lineHeight: 1.4,
          }}>
            Estructuración de ingesta calórica calculada por IA, distribución precisa de proteína, carbohidratos complejos y grasas saludables.
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleGenerateAI}
              disabled={loadingAI}
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
              <Sparkles size={16} color={currentTheme.primary} />
              <span>{loadingAI ? 'Calculando con IA...' : 'Generar Plan Inteligente con IA'}</span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentTheme.primary, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Unlock size={14} /> Meta Diaria
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              color: '#94a3b8',
            }}>
              Hipertrofia Magra
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Calorías Objetivo
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
              {plan.caloriesTarget} kcal <span style={{ fontSize: '0.85rem', color: currentTheme.primary }}>(100%)</span>
            </span>
          </div>

          <div style={{
            height: '7px',
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '0.85rem',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: currentTheme.primary,
              boxShadow: `0 0 10px ${currentTheme.primary}`,
              borderRadius: '999px',
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>PROTEÍNA</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: currentTheme.primary, marginTop: '2px' }}>
                {plan.proteinGrams}g
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>CARBOS</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                {plan.carbsGrams}g
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>GRASAS</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                {plan.fatGrams}g
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CUERPO BLANCO: COMIDAS DISTRIBUIDAS */}
      {/* ------------------------------------------------------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {plan.meals.map((meal, index) => (
          <div key={index} style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                background: currentTheme.primary,
                color: '#000000',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '0.72rem',
              }}>
                {meal.time}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a' }}>
                {meal.calories} kcal
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {meal.name}
            </h3>

            {/* Macros de la comida */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '10px', textAlign: 'center', fontSize: '0.72rem' }}>
              <div><span style={{ color: '#64748b' }}>Prot:</span> <strong style={{ color: '#0f172a' }}>{meal.protein}g</strong></div>
              <div><span style={{ color: '#64748b' }}>Carb:</span> <strong style={{ color: '#0f172a' }}>{meal.carbs}g</strong></div>
              <div><span style={{ color: '#64748b' }}>Grasa:</span> <strong style={{ color: '#0f172a' }}>{meal.fat}g</strong></div>
            </div>

            {/* Alimentos */}
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {meal.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionView;
