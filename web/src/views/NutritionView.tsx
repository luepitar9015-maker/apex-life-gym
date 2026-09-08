import React, { useState } from 'react';
import { UtensilsCrossed, Flame, Droplets, Apple, Plus, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { generateMealPlanWithBackendAI } from '../services/api.js';

export const NutritionView: React.FC = () => {
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
        name: 'Merienda / Pre-Entrenamiento',
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
        name: 'Cena Ligera Recuperadora',
        time: '08:30 PM',
        calories: 610,
        protein: 43,
        carbs: 50,
        fat: 22,
        items: [
          '170g Filete de salmón o atún fresco',
          '220g Batata / Camote al horno',
          'Brócoli y espárragos al vapor'
        ]
      }
    ]
  });

  const handleAIAssist = async (newCals?: number) => {
    setLoadingAI(true);
    const cals = newCals || (targetCalories === 2400 ? 2650 : 2400);
    setTargetCalories(cals);

    const apiPlan = await generateMealPlanWithBackendAI({
      targetCalories: cals,
      dietPreference: cals > 2400 ? 'Superávit Limpio (Volumen Magro)' : 'Definición & Pérdida de Grasa',
      goal: cals > 2400 ? 'Ganancia Muscular' : 'Mantenimiento y Definición',
    });

    if (apiPlan) {
      setPlan(prev => ({
        ...prev,
        title: apiPlan.title,
        caloriesTarget: apiPlan.targetCalories,
        proteinGrams: apiPlan.macros.proteinGrams,
        carbsGrams: apiPlan.macros.carbsGrams,
        fatGrams: apiPlan.macros.fatGrams,
        waterLiters: apiPlan.macros.waterLiters,
      }));
    }

    setLoadingAI(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-active">Plan Nutricional Activo</span>
            <span className="badge badge-cyan">{plan.client}</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Planificador de Alimentación & Macronutrientes</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {plan.title} • Distribución estratégica calculada con IA.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => handleAIAssist()} disabled={loadingAI}>
            {loadingAI ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loadingAI ? 'Optimizando con IA...' : 'Ajustar Macros con IA'}
          </button>
        </div>
      </div>

      {/* Macro Target Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {/* Calorías */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={24} color="#f59e0b" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calorías Diarias</span>
            <h3 style={{ fontSize: '1.7rem', color: '#fff' }}>{plan.caloriesTarget} <span style={{ fontSize: '0.85rem' }}>kcal</span></h3>
          </div>
        </div>

        {/* Proteína */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Apple size={24} color="#10b981" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Proteína (2.1g/kg)</span>
            <h3 style={{ fontSize: '1.7rem', color: 'var(--primary)' }}>{plan.proteinGrams} <span style={{ fontSize: '0.85rem' }}>g</span></h3>
          </div>
        </div>

        {/* Carbohidratos */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={24} color="#06b6d4" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Carbohidratos</span>
            <h3 style={{ fontSize: '1.7rem', color: 'var(--accent-cyan)' }}>{plan.carbsGrams} <span style={{ fontSize: '0.85rem' }}>g</span></h3>
          </div>
        </div>

        {/* Grasas & Agua */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Droplets size={24} color="#8b5cf6" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grasas / Agua</span>
            <h3 style={{ fontSize: '1.7rem', color: 'var(--accent-purple)' }}>{plan.fatGrams}g <span style={{ fontSize: '0.85rem' }}>/ {plan.waterLiters}L</span></h3>
          </div>
        </div>
      </div>

      {/* Meal Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {plan.meals.map((meal, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', color: '#fff' }}>{meal.name}</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>Horario sugerido: {meal.time}</span>
              </div>
              <span className="badge badge-active">{meal.calories} kcal</span>
            </div>

            {/* Macros bar */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              fontSize: '0.75rem',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)'
            }}>
              <span style={{ color: 'var(--primary)' }}><strong>P:</strong> {meal.protein}g</span>
              <span style={{ color: 'var(--accent-cyan)' }}><strong>C:</strong> {meal.carbs}g</span>
              <span style={{ color: 'var(--accent-purple)' }}><strong>G:</strong> {meal.fat}g</span>
            </div>

            {/* Food items list */}
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', listStyle: 'none' }}>
              {meal.items.map((it, idx) => (
                <li key={idx} style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle2 size={14} color="#10b981" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
