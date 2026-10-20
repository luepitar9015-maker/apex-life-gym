import React, { useState, useEffect, useMemo } from 'react';
import {
  Salad,
  Flame,
  Apple,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Search,
  Plus,
  Trash2,
  Printer,
  ChevronRight,
  User,
  Scale,
  Activity,
  Zap,
  Clock,
  Filter,
  RefreshCw,
  HeartPulse,
  Info,
} from 'lucide-react';
import {
  api,
  Member,
  NutritionPlan,
  MealItem,
  FoodItem,
  HealthDiagnostic,
} from '../services/api';

interface NutritionViewProps {
  currentUser?: any;
  activeRole?: string;
  initialMemberId?: string;
  onNavigate?: (tab: string) => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  currentUser,
  activeRole = 'ADMIN',
  initialMemberId,
  onNavigate,
}) => {
  const isMemberRole = activeRole === 'MEMBER' || currentUser?.role === 'MEMBER';

  // Fallback inmediato para que nunca quede en blanco si la red o API es lenta
  const getInitialMember = (): Member | null => {
    if (currentUser) {
      const fullName = (currentUser.name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`).trim() || 'Mateo Giraldo';
      const names = fullName.split(' ');
      const fName = currentUser.firstName || names[0] || 'Mateo';
      const lName = currentUser.lastName || (names.length > 1 ? names.slice(1).join(' ') : 'Giraldo');
      return {
        id: currentUser.id || 'aa6f2904-2e7c-4188-a9b8-c3f15db65c31',
        gymId: currentUser.gymId || 'gym-1',
        code: currentUser.code || 'GYM-1003',
        firstName: fName,
        lastName: lName,
        documentType: currentUser.documentType || 'CC',
        documentNumber: currentUser.documentNumber || '1020304050',
        email: currentUser.email || 'mateo.giraldo@ejemplo.com',
        phone: currentUser.phone || '+57 300 000 0000',
        gender: currentUser.gender || 'MALE',
        weight: currentUser.weight || 75,
        height: currentUser.height || 175,
        status: 'ACTIVE',
        likedFoods: JSON.stringify(['Pechuga de pollo', 'Huevos enteros', 'Arroz blanco', 'Avena en hojuelas', 'Aguacate']),
        dislikedFoods: JSON.stringify([]),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return null;
  };

  // Estados de datos
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(() => getInitialMember());
  const [memberSearch, setMemberSearch] = useState('');
  const [diagnostic, setDiagnostic] = useState<HealthDiagnostic | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [editablePlan, setEditablePlan] = useState<NutritionPlan | null>(null);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodSearch, setFoodSearch] = useState('');
  const [foodCategoryFilter, setFoodCategoryFilter] = useState('ALL');

  // Estados de UI
  const [activeTab, setActiveTab] = useState<'PLAN' | 'SUPPLEMENTS' | 'CATALOG'>('PLAN');
  const [loading, setLoading] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Parámetros para re-calcular con IA
  const [aiGoal, setAiGoal] = useState('HYPERTROPHY');
  const [aiDays, setAiDays] = useState(4);
  const [aiMealsCount, setAiMealsCount] = useState(4);

  // Nuevo suplemento manual
  const [newSuppName, setNewSuppName] = useState('');
  const [newSuppDosage, setNewSuppDosage] = useState('');
  const [newSuppTiming, setNewSuppTiming] = useState('Post-entreno');
  const [newSuppReason, setNewSuppReason] = useState('');

  useEffect(() => {
    initView();
  }, []);

  const initView = async () => {
    try {
      setLoading(true);

      // 1. Cargar catálogo de alimentos con tolerancia a fallos
      try {
        const catalog = await api.getFoodsCatalog();
        if (catalog && catalog.length > 0) setFoods(catalog);
      } catch (fErr) {
        console.warn('Catálogo de alimentos fallback:', fErr);
      }

      // 2. Cargar socios
      let membersList: Member[] = [];
      try {
        membersList = await api.getMembers();
        if (membersList && membersList.length > 0) {
          setMembers(membersList);
        }
      } catch (mErr) {
        console.warn('Error cargando socios en nutrición:', mErr);
      }

      if (membersList.length > 0) {
        let targetId = membersList[0].id;
        if (initialMemberId) {
          targetId = initialMemberId;
        } else if (isMemberRole && currentUser) {
          const found = membersList.find(
            (m) =>
              (currentUser.documentNumber && m.documentNumber === currentUser.documentNumber) ||
              (currentUser.id && m.id === currentUser.id) ||
              (currentUser.email && m.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
              `${m.firstName} ${m.lastName}`.toLowerCase().includes((currentUser.name || '').toLowerCase())
          ) || membersList.find((m) => m.firstName?.toLowerCase().includes('mateo')) || membersList[0];
          targetId = found.id;
        }
        await selectMember(targetId, membersList);
      } else if (!selectedMember) {
        const fallback = getInitialMember();
        if (fallback) setSelectedMember(fallback);
      }
    } catch (err) {
      console.error('Error cargando modulo de nutricion:', err);
      if (!selectedMember) {
        const fallback = getInitialMember();
        if (fallback) setSelectedMember(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectMember = async (id: string, list = members) => {
    try {
      setLoading(true);
      const found = list.find((m) => m.id === id) || (await api.getMemberById(id));
      setSelectedMember(found);

      try {
        const plan = await api.getMemberNutrition(id);
        setNutritionPlan(plan);
        setEditablePlan(plan ? JSON.parse(JSON.stringify(plan)) : null);
      } catch (planErr) {
        console.warn('Plan nutricional previo no disponible:', planErr);
      }

      try {
        const diag = await api.getMemberDiagnostic(id);
        setDiagnostic(diag);
      } catch (diagErr) {
        console.warn('Diagnóstico previo no disponible:', diagErr);
      }
    } catch (err) {
      console.error('Error al seleccionar socio:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cálculo Metabólico Mifflin-St Jeor en tiempo real
  const metabolicStats = useMemo(() => {
    if (!selectedMember) return null;
    const w = selectedMember.weight || 72;
    const hCm = selectedMember.height ? (selectedMember.height < 3 ? selectedMember.height * 100 : selectedMember.height) : 174;
    const age = 27;
    const isMale = (selectedMember.gender || 'MALE') === 'MALE';

    // BMR (Mifflin-St Jeor)
    const bmr = isMale
      ? 10 * w + 6.25 * hCm - 5 * age + 5
      : 10 * w + 6.25 * hCm - 5 * age - 161;

    // TDEE Factor ~1.55 (Moderado)
    const tdee = Math.round(bmr * 1.55);

    const targetCals = editablePlan?.targetCalories || tdee;
    const calDiff = targetCals - tdee;

    return {
      bmr: Math.round(bmr),
      tdee,
      targetCals,
      calDiff,
      deficitOrSurplus:
        calDiff < -50
          ? `Déficit de ${Math.abs(calDiff)} kcal (Quema de grasa)`
          : calDiff > 50
          ? `Superávit de +${calDiff} kcal (Hipertrofia)`
          : 'Mantenimiento Normocalórico',
    };
  }, [selectedMember, editablePlan?.targetCalories]);

  // Lista de suplementos parseada
  const activeSupplements = useMemo(() => {
    if (!editablePlan) return [];
    if (editablePlan.supplements && Array.isArray(editablePlan.supplements) && editablePlan.supplements.length > 0) {
      return editablePlan.supplements;
    }
    if (editablePlan.trainerNotes) {
      try {
        const parsed = JSON.parse(editablePlan.trainerNotes);
        if (parsed.supplements && Array.isArray(parsed.supplements)) return parsed.supplements;
      } catch {}
    }
    return [
      {
        name: 'Creatina Monohidrato (Creapure)',
        dosage: '5g diarios',
        timing: 'Post-entreno o con el desayuno',
        reason: 'Saturación de fosfocreatina para fuerza y volumen celular muscular.',
      },
      {
        name: 'Proteína de Suero (Whey Isolate)',
        dosage: '30g por porción',
        timing: 'Post-entreno',
        reason: 'Aporte de aminoácidos esenciales y síntesis proteica rápida.',
      },
      {
        name: 'Omega 3 (EPA/DHA)',
        dosage: '2000mg diarios',
        timing: 'Con el almuerzo',
        reason: 'Modulación de inflamación articular y soporte cardiovascular.',
      },
    ];
  }, [editablePlan]);

  // Guardar Plan Editado
  const handleSavePlan = async () => {
    if (!editablePlan || !editablePlan.id) return;
    try {
      setSavingPlan(true);

      // Empaquetar suplementos actualizados en trainerNotes
      let existingNotes: any = {};
      try {
        if (editablePlan.trainerNotes) existingNotes = JSON.parse(editablePlan.trainerNotes);
      } catch {
        existingNotes = { textNotes: editablePlan.trainerNotes };
      }

      existingNotes.supplements = activeSupplements;
      existingNotes.maintenanceCalories = metabolicStats?.tdee;

      const res = await api.updateNutritionPlan(editablePlan.id, {
        title: editablePlan.title,
        targetCalories: Number(editablePlan.targetCalories),
        proteinGrams: Number(editablePlan.proteinGrams),
        carbsGrams: Number(editablePlan.carbsGrams),
        fatsGrams: Number(editablePlan.fatsGrams),
        trainerNotes: JSON.stringify(existingNotes),
        meals: editablePlan.meals || [],
      });

      setNutritionPlan(res.data);
      setEditablePlan(JSON.parse(JSON.stringify(res.data)));
      alert('✅ Plan nutricional guardado y aprobado oficialmente con éxito.');
    } catch (err: any) {
      alert(err.message || 'Error al guardar el plan nutricional');
    } finally {
      setSavingPlan(false);
    }
  };

  // Generar nuevo plan con IA
  const handleGenerateAI = async () => {
    if (!selectedMember) return;
    try {
      setGeneratingAI(true);
      const res = await api.generateNutritionAI({
        memberId: selectedMember.id,
        memberName: `${selectedMember.firstName} ${selectedMember.lastName}`,
        gender: (selectedMember.gender as any) || 'MALE',
        age: 27,
        weight: selectedMember.weight || 72,
        height: selectedMember.height ? (selectedMember.height < 3 ? selectedMember.height * 100 : selectedMember.height) : 174,
        goal: aiGoal,
        diseases: diagnostic?.diseases || undefined,
        trainingDaysPerWeek: aiDays,
      });

      setNutritionPlan(res.data);
      setEditablePlan(JSON.parse(JSON.stringify(res.data)));
      setShowAiModal(false);
      alert('✨ ¡Plan Nutricional generado y formulado con éxito por Google Gemini 2.5 Flash!');
    } catch (err: any) {
      alert(err.message || 'Error al generar nutrición con IA');
    } finally {
      setGeneratingAI(false);
    }
  };

  // Agregar suplemento manual
  const handleAddSupplement = () => {
    if (!newSuppName.trim()) return;
    const updated = [
      ...activeSupplements,
      {
        name: newSuppName.trim(),
        dosage: newSuppDosage.trim() || '1 dosis diaria',
        timing: newSuppTiming,
        reason: newSuppReason.trim() || 'Soporte metabólico y rendimiento físico',
      },
    ];

    if (editablePlan) {
      let existingNotes: any = {};
      try {
        if (editablePlan.trainerNotes) existingNotes = JSON.parse(editablePlan.trainerNotes);
      } catch {}
      existingNotes.supplements = updated;

      setEditablePlan({
        ...editablePlan,
        supplements: updated,
        trainerNotes: JSON.stringify(existingNotes),
      });
    }

    setNewSuppName('');
    setNewSuppDosage('');
    setNewSuppReason('');
  };

  // Eliminar suplemento
  const handleRemoveSupplement = (idx: number) => {
    const updated = activeSupplements.filter((_, i) => i !== idx);
    if (editablePlan) {
      let existingNotes: any = {};
      try {
        if (editablePlan.trainerNotes) existingNotes = JSON.parse(editablePlan.trainerNotes);
      } catch {}
      existingNotes.supplements = updated;

      setEditablePlan({
        ...editablePlan,
        supplements: updated,
        trainerNotes: JSON.stringify(existingNotes),
      });
    }
  };

  // Imprimir Ficha
  const handlePrint = () => {
    window.print();
  };

  // Filtrado de miembros en la barra
  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return members;
    const q = memberSearch.toLowerCase();
    return members.filter(
      (m) =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        (m.documentNumber && m.documentNumber.includes(q))
    );
  }, [members, memberSearch]);

  // Filtrado de alimentos en el catálogo
  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      const matchCat = foodCategoryFilter === 'ALL' || f.category === foodCategoryFilter;
      const matchQuery = !foodSearch.trim() || f.name.toLowerCase().includes(foodSearch.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [foods, foodCategoryFilter, foodSearch]);

  return (
    <div style={{ padding: '1.25rem', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* HEADER DEL MÓDULO */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem 1.5rem',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Salad size={24} color="#10b981" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Módulo de Nutrición Deportiva & Planes Dietarios IA
              </h1>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: '2px 0 0 0' }}>
                Formulación de dietas hipertróficas/definición, cálculo Mifflin-St Jeor, macronutrientes y dispensario de suplementación.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowAiModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#06b6d4',
              color: '#ffffff',
              border: 'none',
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.35)',
            }}
          >
            <Sparkles size={16} />
            <span>Formular con Gemini IA</span>
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <Printer size={16} />
            <span>Imprimir Ficha</span>
          </button>
        </div>
      </div>

      {/* SELECTOR DE SOCIO (SI NO ES ROL SOCIO) */}
      {!isMemberRole && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Buscar socio por nombre o documento para gestionar su dieta..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '600px', paddingBottom: '2px' }}>
            {filteredMembers.slice(0, 5).map((m) => (
              <button
                key={m.id}
                onClick={() => selectMember(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: selectedMember?.id === m.id ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.06)',
                  backgroundColor: selectedMember?.id === m.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.02)',
                  color: selectedMember?.id === m.id ? '#10b981' : '#cbd5e1',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <User size={13} />
                <span>{m.firstName} {m.lastName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FICHA RESUMEN DEL ATLETA ACTIVO */}
      {selectedMember && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
        }}>
          <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Atleta Asignado</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              {selectedMember.firstName} {selectedMember.lastName}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Doc: {selectedMember.documentNumber || 'S/D'}</span>
          </div>

          <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Peso & Estatura</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
              {selectedMember.weight || 72} kg <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/ {selectedMember.height || 1.74} m</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              IMC: {selectedMember.weight && selectedMember.height ? (selectedMember.weight / (selectedMember.height * selectedMember.height)).toFixed(1) : '23.8'}
            </span>
          </div>

          <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '0.72rem', color: '#0891b2', fontWeight: 700 }}>TDEE Mantenimiento</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0891b2', marginTop: '2px' }}>
              {metabolicStats?.tdee || 2450} <span style={{ fontSize: '0.78rem', color: '#64748b' }}>kcal/día</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>TMB Basal: {metabolicStats?.bmr} kcal</span>
          </div>

          <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700 }}>Biotipo / Somatotipo</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#7c3aed', marginTop: '2px' }}>
              {diagnostic?.biotype || 'Mesomorfo'}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Grasa: {diagnostic?.bodyFatPercentage || 17}%</span>
          </div>
        </div>
      )}

      {/* PESTAÑAS PRINCIPALES DEL MÓDULO */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '4px',
        overflowX: 'auto',
      }}>
        <button
          onClick={() => setActiveTab('PLAN')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeTab === 'PLAN' ? '3px solid #10b981' : '3px solid transparent',
            backgroundColor: activeTab === 'PLAN' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
            color: activeTab === 'PLAN' ? '#10b981' : '#94a3b8',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          <Salad size={18} />
          <span>Plan Dietario & Macros</span>
        </button>

        <button
          onClick={() => setActiveTab('SUPPLEMENTS')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeTab === 'SUPPLEMENTS' ? '3px solid #ec4899' : '3px solid transparent',
            backgroundColor: activeTab === 'SUPPLEMENTS' ? 'rgba(236, 72, 153, 0.12)' : 'transparent',
            color: activeTab === 'SUPPLEMENTS' ? '#ec4899' : '#94a3b8',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          <Pill size={18} />
          <span>Protocolo de Suplementación ({activeSupplements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CATALOG')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            borderBottom: activeTab === 'CATALOG' ? '3px solid #06b6d4' : '3px solid transparent',
            backgroundColor: activeTab === 'CATALOG' ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
            color: activeTab === 'CATALOG' ? '#06b6d4' : '#94a3b8',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          <Apple size={18} />
          <span>Catálogo de Alimentos ({foods.length})</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* SUB-PESTAÑA 1: PLAN DIETARIO ACTIVO & MACROS */}
      {/* ============================================================== */}
      {activeTab === 'PLAN' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {editablePlan ? (
            <>
              {/* Barra Superior con Título del Plan y Botón Guardar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                      RÉGIMEN ASIGNADO
                    </span>
                    {editablePlan.reviewedByTrainer && (
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
                  <input
                    type="text"
                    value={editablePlan.title || ''}
                    onChange={(e) => setEditablePlan({ ...editablePlan, title: e.target.value })}
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.15)',
                      outline: 'none',
                      padding: '2px 0',
                    }}
                  />
                </div>

                <button
                  onClick={handleSavePlan}
                  disabled={savingPlan}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.7rem 1.4rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
                  }}
                >
                  <Save size={16} />
                  <span>{savingPlan ? 'Guardando...' : 'Guardar y Aprobar Nutrición'}</span>
                </button>
              </div>

              {/* Comparador de Calorías & Ajuste Metabólico */}
              {metabolicStats && (
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
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Equilibrio Calórico Objetivo</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                        {editablePlan.targetCalories} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>kcal / día</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: metabolicStats.calDiff < 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: metabolicStats.calDiff < 0 ? '#10b981' : '#3b82f6',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                  }}>
                    {metabolicStats.deficitOrSurplus}
                  </div>
                </div>
              )}

              {/* Cuadros de Macronutrientes Editables */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
                {/* Calorías */}
                <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Calorías Totales</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <input
                      type="number"
                      value={editablePlan.targetCalories}
                      onChange={(e) => setEditablePlan({ ...editablePlan, targetCalories: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '0.4rem',
                        borderRadius: '6px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#f8fafc',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>kcal</span>
                  </div>
                </div>

                {/* Proteínas */}
                <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>Proteínas (g)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <input
                      type="number"
                      value={editablePlan.proteinGrams}
                      onChange={(e) => setEditablePlan({ ...editablePlan, proteinGrams: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '0.4rem',
                        borderRadius: '6px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#10b981' }}>g</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    ~{Math.round((editablePlan.proteinGrams * 4 / (editablePlan.targetCalories || 2000)) * 100)}% de calorías
                  </span>
                </div>

                {/* Carbohidratos */}
                <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 700 }}>Carbohidratos (g)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <input
                      type="number"
                      value={editablePlan.carbsGrams}
                      onChange={(e) => setEditablePlan({ ...editablePlan, carbsGrams: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '0.4rem',
                        borderRadius: '6px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        color: '#06b6d4',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#06b6d4' }}>g</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    ~{Math.round((editablePlan.carbsGrams * 4 / (editablePlan.targetCalories || 2000)) * 100)}% de calorías
                  </span>
                </div>

                {/* Grasas */}
                <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700 }}>Grasas Saludables (g)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <input
                      type="number"
                      value={editablePlan.fatsGrams}
                      onChange={(e) => setEditablePlan({ ...editablePlan, fatsGrams: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '0.4rem',
                        borderRadius: '6px',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#f59e0b',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>g</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    ~{Math.round((editablePlan.fatsGrams * 9 / (editablePlan.targetCalories || 2000)) * 100)}% de calorías
                  </span>
                </div>
              </div>

              {/* Estructura de Comidas Diarias */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    Distribución de Comidas ({editablePlan.meals?.length || 0})
                  </h3>
                  <button
                    onClick={() => {
                      const updatedMeals = [
                        ...(editablePlan.meals || []),
                        {
                          meal: `Comida ${(editablePlan.meals?.length || 0) + 1}`,
                          title: 'Nueva Comida',
                          calories: 350,
                          protein: 25,
                          carbs: 35,
                          fats: 10,
                          items: ['1 porción de proteína', '1 porción de carbohidratos'],
                        },
                      ];
                      setEditablePlan({ ...editablePlan, meals: updatedMeals });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.12)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} /> Añadir Comida
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                  {editablePlan.meals?.map((m: MealItem, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                          {m.meal}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 700 }}>
                            ~{m.calories} kcal
                          </span>
                          <button
                            onClick={() => {
                              const updated = editablePlan.meals?.filter((_, i) => i !== idx);
                              setEditablePlan({ ...editablePlan, meals: updated });
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...(editablePlan.meals || [])];
                          updated[idx].title = e.target.value;
                          setEditablePlan({ ...editablePlan, meals: updated });
                        }}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          borderRadius: '6px',
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      />

                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Alimentos sugeridos:
                        <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.2rem', color: '#cbd5e1' }}>
                          {m.items?.map((item, iIdx) => (
                            <li key={iIdx} style={{ marginBottom: '2px' }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.01)',
              border: '2px dashed rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <Salad size={48} color="#10b981" />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Este socio aún no tiene un plan nutricional asignado
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '6px 0 0 0', maxWidth: '500px' }}>
                  Puedes formular automáticamente su régimen dietario personalizado utilizando el motor de Inteligencia Artificial Gemini 2.5 Flash.
                </p>
              </div>
              <button
                onClick={() => setShowAiModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Sparkles size={18} />
                <span>Formular Plan Nutricional con Gemini IA</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-PESTAÑA 2: PROTOCOLO DE SUPLEMENTACIÓN INTELIGENTE */}
      {/* ============================================================== */}
      {activeTab === 'SUPPLEMENTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(236, 72, 153, 0.08)',
            border: '1px solid rgba(236, 72, 153, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Pill size={22} color="#ec4899" />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Dispensario y Protocolo de Suplementación Inteligente
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Formulación de suplementos deportivos basada en evidencia científica, adaptada a los objetivos y salud del socio.
                </p>
              </div>
            </div>

            <button
              onClick={handleSavePlan}
              disabled={savingPlan}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ec4899',
                color: '#ffffff',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <Save size={15} />
              <span>Guardar Protocolo</span>
            </button>
          </div>

          {/* Grilla de Suplementos Asignados */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {activeSupplements.map((supp: any, idx: number) => (
              <div
                key={idx}
                style={{
                  padding: '1.1rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(236, 72, 153, 0.03)',
                  border: '1px solid rgba(236, 72, 153, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fdf2f8' }}>
                    {supp.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      backgroundColor: 'rgba(236, 72, 153, 0.15)',
                      color: '#ec4899',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}>
                      {supp.timing}
                    </span>
                    <button
                      onClick={() => handleRemoveSupplement(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#ec4899', fontWeight: 700 }}>
                  Dosis prescrita: {supp.dosage}
                </div>

                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                  {supp.reason}
                </p>

                {supp.caution && (
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <AlertTriangle size={12} color="#f59e0b" />
                    <span>{supp.caution}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Formulario para Agregar Nuevo Suplemento al Socio */}
          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              + Prescribir Suplemento Adicional al Atleta
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
              <input
                type="text"
                placeholder="Nombre (ej: Glutamina, Cafeína, Magnesio...)"
                value={newSuppName}
                onChange={(e) => setNewSuppName(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                }}
              />
              <input
                type="text"
                placeholder="Dosis (ej: 5g al despertar)"
                value={newSuppDosage}
                onChange={(e) => setNewSuppDosage(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                }}
              />
              <select
                value={newSuppTiming}
                onChange={(e) => setNewSuppTiming(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                }}
              >
                <option value="En ayunas">En ayunas</option>
                <option value="Pre-entreno">Pre-entreno (30 min antes)</option>
                <option value="Intra-entreno">Intra-entreno</option>
                <option value="Post-entreno">Post-entreno inmediato</option>
                <option value="Con comidas">Con las comidas</option>
                <option value="Antes de dormir">Antes de dormir</option>
              </select>
              <input
                type="text"
                placeholder="Beneficio / Motivo clínico"
                value={newSuppReason}
                onChange={(e) => setNewSuppReason(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                }}
              />
            </div>
            <button
              onClick={handleAddSupplement}
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(236, 72, 153, 0.2)',
                color: '#ec4899',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              + Agregar Suplemento a la Lista
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-PESTAÑA 3: CATÁLOGO MAESTRO DE ALIMENTOS */}
      {/* ============================================================== */}
      {activeTab === 'CATALOG' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Barra de Filtros y Búsqueda */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder="Buscar en el catálogo (ej: atún, arroz, fresa, avena)..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'PROTEIN', label: '🍗 Proteínas' },
                { id: 'CARB', label: '🥔 Carbohidratos' },
                { id: 'LEGUME', label: '🫘 Legumbres' },
                { id: 'FAT', label: '🥑 Grasas' },
                { id: 'DAIRY', label: '🥛 Lácteos' },
                { id: 'FRUIT', label: '🍎 Frutas' },
                { id: 'VEGETABLE', label: '🥦 Verduras' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFoodCategoryFilter(c.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '7px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: foodCategoryFilter === c.id ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: foodCategoryFilter === c.id ? '#06b6d4' : 'rgba(255,255,255,0.02)',
                    color: foodCategoryFilter === c.id ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de Alimentos y Macros */}
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', color: '#334155', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Alimento</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Categoría</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Calorías (100g)</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#059669', fontWeight: 800 }}>Proteína</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#0891b2', fontWeight: 800 }}>Carbohidratos</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#d97706', fontWeight: 800 }}>Grasas</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoods.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      No se encontraron alimentos en el catálogo.
                    </td>
                  </tr>
                ) : (
                  filteredFoods.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        color: '#000000',
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#000000' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor:
                            item.category === 'PROTEIN'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : item.category === 'CARB'
                              ? 'rgba(6, 182, 212, 0.15)'
                              : item.category === 'FAT'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : '#f1f5f9',
                          color:
                            item.category === 'PROTEIN'
                              ? '#059669'
                              : item.category === 'CARB'
                              ? '#0891b2'
                              : item.category === 'FAT'
                              ? '#d97706'
                              : '#475569',
                        }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#000000' }}>{item.calories} kcal</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#059669', fontWeight: 700 }}>{item.protein}g</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#0891b2', fontWeight: 700 }}>{item.carbs}g</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#d97706', fontWeight: 700 }}>{item.fats}g</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: FORMULAR DIETA CON GEMINI IA */}
      {/* ============================================================== */}
      {showAiModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '16px',
            padding: '1.75rem',
            width: '100%',
            maxWidth: '520px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={22} color="#06b6d4" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Formular Dieta Personalizada con Gemini IA
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
              Gemini calculará los macros exactos, dividirá las comidas según tus horarios y formulará un protocolo de suplementación para {selectedMember?.firstName}.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Objetivo Nutricional:
                </label>
                <select
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  <option value="HYPERTROPHY">Hipertrofia Muscular & Superávit Limpio</option>
                  <option value="FAT_LOSS">Definición Muscular & Déficit Calórico Controlado</option>
                  <option value="RECOMPOSITION">Recomposición Corporal (Perder Grasa y Ganar Músculo)</option>
                  <option value="MAINTENANCE">Mantenimiento y Rendimiento Deportivo</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Días de Entreno Semanales:
                  </label>
                  <select
                    value={aiDays}
                    onChange={(e) => setAiDays(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      fontWeight: 700,
                    }}
                  >
                    <option value={3}>3 días a la semana</option>
                    <option value={4}>4 días a la semana</option>
                    <option value={5}>5 días a la semana</option>
                    <option value={6}>6 días a la semana</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Número de Comidas al Día:
                  </label>
                  <select
                    value={aiMealsCount}
                    onChange={(e) => setAiMealsCount(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      fontWeight: 700,
                    }}
                  >
                    <option value={3}>3 comidas (Desayuno, Almuerzo, Cena)</option>
                    <option value={4}>4 comidas (+ Merienda)</option>
                    <option value={5}>5 comidas (+ Snack matutino y merienda)</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#94a3b8',
                  border: 'none',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={generatingAI}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#06b6d4',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
                }}
              >
                <Sparkles size={16} />
                <span>{generatingAI ? 'Gemini Calculando...' : 'Formular Ahora con IA'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
