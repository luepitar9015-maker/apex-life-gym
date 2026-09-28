import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { api, Member, HealthDiagnostic, FoodItem } from '../services/api';

export const DiagnosticFoodView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [diagnostic, setDiagnostic] = useState<HealthDiagnostic | null>(null);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodSearch, setFoodSearch] = useState('');
  const [foodCategoryFilter, setFoodCategoryFilter] = useState('ALL');

  // Listas de Gustos y Rechazos
  const [likedFoods, setLikedFoods] = useState<string[]>([]);
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Formulario de Diagnóstico / Anamnesis
  const [targetGoal, setTargetGoal] = useState('Hipertrofia Muscular y Definición');
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
        selectMember(mList[0]);
      }
    } catch (err) {
      console.error('Error cargando diagnóstico:', err);
    }
  };

  const selectMember = async (member: Member) => {
    setSelectedMember(member);
    try {
      // Cargar diagnóstico previo si existe
      const diag = await api.getMemberDiagnostic(member.id);
      setDiagnostic(diag);
      if (diag) {
        setTargetGoal(diag.targetGoal || 'Hipertrofia Muscular');
        setDiseases(diag.diseases || '');
        setInjuries(diag.injuries || '');
        setDisabilities(diag.disabilities || '');
        setTrainingExperience(diag.trainingExperience || 'INTERMEDIO');
      }

      // Cargar gustos de comida guardados
      if (member.likedFoods) {
        try {
          setLikedFoods(JSON.parse(member.likedFoods));
        } catch (e) {
          setLikedFoods(member.likedFoods.split(',').map((s) => s.trim()));
        }
      } else {
        setLikedFoods([]);
      }

      if (member.dislikedFoods) {
        try {
          setDislikedFoods(JSON.parse(member.dislikedFoods));
        } catch (e) {
          setDislikedFoods(member.dislikedFoods.split(',').map((s) => s.trim()));
        }
      } else {
        setDislikedFoods([]);
      }
    } catch (err) {
      console.error('Error cargando ficha del socio:', err);
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
        diseases,
        injuries,
        disabilities,
        trainingExperience,
        photoBase64: photoPreview || undefined,
        weight: selectedMember.weight || 75,
        height: selectedMember.height || 1.75,
      });

      setDiagnostic(res);
      alert('✨ ¡Diagnóstico con Google Gemini completado! Se han calculado tus métricas y detectado precauciones biomecánicas.');
    } catch (err: any) {
      alert(err.message || 'Error al generar diagnóstico');
    } finally {
      setAnalyzingDiagnostic(false);
    }
  };

  const toggleLikedFood = (foodName: string) => {
    if (likedFoods.includes(foodName)) {
      setLikedFoods(likedFoods.filter((f) => f !== foodName));
    } else {
      setLikedFoods([...likedFoods, foodName]);
      // Quitar de no deseados si estaba
      setDislikedFoods(dislikedFoods.filter((f) => f !== foodName));
    }
  };

  const toggleDislikedFood = (foodName: string) => {
    if (dislikedFoods.includes(foodName)) {
      setDislikedFoods(dislikedFoods.filter((f) => f !== foodName));
    } else {
      setDislikedFoods([...dislikedFoods, foodName]);
      // Quitar de deseados si estaba
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
      alert('✅ Preferencias alimentarias guardadas con éxito para este socio.');
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
        goal: targetGoal.includes('Grasa') ? 'FAT_LOSS' : 'HYPERTROPHY',
        likedFoods,
        dislikedFoods,
      });

      alert(`🥗 ¡Plan Nutricional con IA generado con éxito! Se priorizaron tus ${likedFoods.length} alimentos favoritos y se excluyeron los ${dislikedFoods.length} alimentos vetados.`);
    } catch (err: any) {
      alert(err.message || 'Error generando nutrición con IA');
    } finally {
      setGeneratingDietWithFoods(false);
    }
  };

  const filteredFoods = foods.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(foodSearch.toLowerCase());
    const matchesCat = foodCategoryFilter === 'ALL' || f.category === foodCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Banner Principal */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <HeartPulse size={28} color="#06b6d4" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Diagnóstico Fisiológico con IA & Selección de Alimentos
              </h2>
              <span style={{
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                color: '#06b6d4',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}>
                VISION & BIO-DATA
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Escaneo corporal por fotografía, detección de lesiones/enfermedades, cálculo de % de grasa y armado de dieta personalizada por gustos.
            </p>
          </div>
        </div>

        {/* Selector de Socio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={16} color="#06b6d4" />
          <select
            value={selectedMember?.id || ''}
            onChange={(e) => {
              const m = members.find((item) => item.id === e.target.value);
              if (m) selectMember(m);
            }}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.firstName} {m.lastName} ({m.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedMember && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* COLUMNA 1: ANAMNESIS & ESCANEO FOTOGRÁFICO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Formulario de Salud */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#06b6d4" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  1. Cuestionario de Salud & Antecedentes Clínicos
                </h3>
              </div>

              {/* ¿Qué desea mejorar? */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                  ¿Qué desea mejorar / Objetivo Principal?:
                </label>
                <select
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="Hipertrofia Muscular y Masa Magra">Aumento de Masa Muscular (Hipertrofia)</option>
                  <option value="Pérdida de Grasa y Definición">Pérdida de Grasa Corporal & Definición</option>
                  <option value="Salud Postural y Corrección de Espalda">Salud Postural & Corrección de Espalda</option>
                  <option value="Fuerza Máxima y Potencia">Fuerza Máxima & Levantamientos Pesados</option>
                  <option value="Acondicionamiento Físico y Salud Cardiovascular">Acondicionamiento & Salud Cardiovascular</option>
                </select>
              </div>

              {/* Enfermedades */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                  ¿Padece alguna Enfermedad? (Hipertensión, diabetes, asma, etc.):
                </label>
                <input
                  type="text"
                  placeholder="ej: Hipertensión arterial leve, Asma inducida por ejercicio... o Ninguna"
                  value={diseases}
                  onChange={(e) => setDiseases(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Lesiones Previas o Activas */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={14} />
                  <span>¿Tiene Lesiones Previas o Activas? (Rodilla, lumbar, hombro, hernias...):</span>
                </label>
                <input
                  type="text"
                  placeholder="ej: Condromalacia rotuliana en rodilla derecha, molestia en manguito rotador... o Ninguna"
                  value={injuries}
                  onChange={(e) => setInjuries(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  La IA detectará automáticamente ejercicios peligrosos para vetarlos de tu rutina.
                </span>
              </div>

              {/* Discapacidades o Limitaciones */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                  Discapacidades o Limitaciones de Movilidad:
                </label>
                <input
                  type="text"
                  placeholder="ej: Movilidad reducida en tobillo izquierdo... o Ninguna"
                  value={disabilities}
                  onChange={(e) => setDisabilities(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Nivel de Experiencia */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                  Nivel de Experiencia Deportiva:
                </label>
                <select
                  value={trainingExperience}
                  onChange={(e) => setTrainingExperience(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="SEDENTARIO">Sedentario (Iniciando desde cero)</option>
                  <option value="PRINCIPIANTE">Principiante (Menos de 6 meses)</option>
                  <option value="INTERMEDIO">Intermedio (6 meses a 2 años)</option>
                  <option value="AVANZADO">Avanzado / Atleta (Más de 2 años)</option>
                </select>
              </div>

              {/* Escaneo de Fotografía Corporal */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Camera size={14} />
                  <span>Escaneo Fotográfico Corporal (Opcional para Visión IA):</span>
                </label>
                <div style={{
                  marginTop: '6px',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '2px dashed rgba(6, 182, 212, 0.3)',
                  backgroundColor: 'rgba(6, 182, 212, 0.03)',
                  textAlign: 'center',
                }}>
                  {photoPreview ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={photoPreview}
                        alt="Previsualización Corporal"
                        style={{ maxHeight: '160px', borderRadius: '8px', objectFit: 'contain' }}
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        style={{
                          fontSize: '0.75rem',
                          color: '#ef4444',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Eliminar foto
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={24} color="#06b6d4" style={{ margin: '0 auto 6px auto' }} />
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 6px 0' }}>
                        Arrastra o selecciona la fotografía del socio de frente o perfil
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ fontSize: '0.75rem', color: '#cbd5e1' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAIDiagnostic}
                disabled={analyzingDiagnostic}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#06b6d4',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
                  marginTop: '0.5rem',
                }}
              >
                <Sparkles size={18} />
                <span>{analyzingDiagnostic ? 'Google Gemini Analizando Biotipo...' : 'Diagnosticar con IA Ahora'}</span>
              </button>
            </div>

            {/* Resultados del Diagnóstico IA */}
            {diagnostic && (
              <div className="glass-card" style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={20} color="#10b981" />
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      Resultado del Diagnóstico Fisiológico IA
                    </h4>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Biotipo: <strong style={{ color: '#10b981' }}>{diagnostic.biotype || 'Mesomorfo'}</strong>
                  </span>
                </div>

                {/* Métricas Visuales */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>% Grasa Estimada</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4' }}>
                      {diagnostic.bodyFatPercentage}%
                    </div>
                  </div>

                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Masa Magra (kg)</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                      {diagnostic.muscleMassKg} kg
                    </div>
                  </div>

                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>IMC Corporal</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                      {diagnostic.bmi}
                    </div>
                  </div>
                </div>

                {/* Alerta Roja de Ejercicios Prohibidos */}
                {diagnostic.prohibitedExercises && (
                  <div style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 800, fontSize: '0.85rem' }}>
                      <ShieldAlert size={16} />
                      <span>EJERCICIOS PROHIBIDOS / CONTRAINDICADOS POR LESIÓN:</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#fca5a5', margin: 0 }}>
                      {diagnostic.prohibitedExercises}
                    </p>
                  </div>
                )}

                {/* Diagnóstico Clínico */}
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  <strong style={{ color: '#f1f5f9' }}>Dictamen Fisiológico: </strong>
                  {diagnostic.aiClinicalSummary}
                </div>

                {/* Recomendación */}
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  <strong style={{ color: '#10b981' }}>Recomendaciones de Adaptación: </strong>
                  {diagnostic.recommendedActions}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA 2: CATÁLOGO DE ALIMENTOS & GUSTOS/RECHAZOS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Salad size={18} color="#10b981" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    2. Preferencias Alimentarias & Calorías
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleSaveFoodPreferences}
                    disabled={savingPreferences}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {savingPreferences ? 'Guardando...' : 'Guardar Preferencias'}
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                Marca con <strong style={{ color: '#10b981' }}>Me gusta (Favorito)</strong> los alimentos que deseas en tu dieta, y con <strong style={{ color: '#ef4444' }}>No me gusta (Veto)</strong> los alimentos que rechazas o te causan alergia.
              </p>

              {/* Resumen de Gustos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                    FAVORITOS ({likedFoods.length}):
                  </span>
                  <div style={{ fontSize: '0.78rem', color: '#f1f5f9', marginTop: '4px', maxHeight: '50px', overflowY: 'auto' }}>
                    {likedFoods.length > 0 ? likedFoods.join(', ') : 'Ninguno seleccionado'}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700 }}>
                    RECHAZADOS / VETADOS ({dislikedFoods.length}):
                  </span>
                  <div style={{ fontSize: '0.78rem', color: '#f1f5f9', marginTop: '4px', maxHeight: '50px', overflowY: 'auto' }}>
                    {dislikedFoods.length > 0 ? dislikedFoods.join(', ') : 'Ninguno vetado'}
                  </div>
                </div>
              </div>

              {/* Buscador & Filtro de Alimentos */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={15} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Buscar alimento o fruta..."
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem 0.5rem 2rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>

                <select
                  value={foodCategoryFilter}
                  onChange={(e) => setFoodCategoryFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                  }}
                >
                  <option value="ALL">Todas las Categorías</option>
                  <option value="PROTEIN">Proteínas Magras</option>
                  <option value="CARB">Carbohidratos Complejos</option>
                  <option value="FAT">Grasas Saludables</option>
                  <option value="VEGETABLE">Verduras y Hortalizas</option>
                  <option value="FRUIT">Frutas</option>
                  <option value="DAIRY">Lácteos</option>
                </select>
              </div>

              {/* Lista de Alimentos con Calorías y Macros */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
                {filteredFoods.map((item) => {
                  const isLiked = likedFoods.includes(item.name);
                  const isDisliked = dislikedFoods.includes(item.name);

                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: isLiked
                          ? 'rgba(16, 185, 129, 0.12)'
                          : isDisliked
                          ? 'rgba(239, 68, 68, 0.1)'
                          : 'rgba(255, 255, 255, 0.02)',
                        border: isLiked
                          ? '1px solid #10b981'
                          : isDisliked
                          ? '1px solid #ef4444'
                          : '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                          <strong style={{ color: '#f59e0b' }}>{item.calories} kcal</strong> por 100g • P: {item.protein}g • C: {item.carbs}g • G: {item.fats}g
                        </div>
                      </div>

                      {/* Botones de Me Gusta / No Me Gusta */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => toggleLikedFood(item.name)}
                          title="Me gusta (Priorizar en dieta)"
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: isLiked ? '#10b981' : 'rgba(255,255,255,0.06)',
                            color: isLiked ? '#ffffff' : '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                          }}
                        >
                          <ThumbsUp size={13} />
                          <span>Me gusta</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleDislikedFood(item.name)}
                          title="No me gusta / Alergia (Veto estricto)"
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: isDisliked ? '#ef4444' : 'rgba(255,255,255,0.06)',
                            color: isDisliked ? '#ffffff' : '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                          }}
                        >
                          <ThumbsDown size={13} />
                          <span>No me gusta</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botón Maestro: Armar Plan de Alimentación con IA */}
              <button
                type="button"
                onClick={handleGenerateDietFromFoods}
                disabled={generatingDietWithFoods}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                  marginTop: '0.5rem',
                }}
              >
                <Sparkles size={18} />
                <span>
                  {generatingDietWithFoods
                    ? 'Gemini Armando Plan Nutricional Correcto...'
                    : 'Armar Plan de Alimentación Correcto con IA'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
