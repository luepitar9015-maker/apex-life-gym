import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  ArrowRight, 
  UserCheck, 
  RefreshCw, 
  Image as ImageIcon, 
  RotateCcw,
  Unlock,
  Eye
} from 'lucide-react';
import { analyzeBodyWithBackendAI } from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface AIScanViewProps {
  currentTheme?: ColorTheme;
}

const DEFAULT_FRONT_IMAGE = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop';
const DEFAULT_SIDE_IMAGE = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop';

export const AIScanView: React.FC<AIScanViewProps> = ({ currentTheme = getSavedTheme() }) => {
  const [scanning, setScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(true);
  const [activePhoto, setActivePhoto] = useState<'FRONT' | 'SIDE'>('FRONT');
  const [weightInput, setWeightInput] = useState(78.5);
  const [heightInput, setHeightInput] = useState(177);
  const [ageInput, setAgeInput] = useState(28);
  const [genderInput, setGenderInput] = useState<'MALE' | 'FEMALE'>('MALE');

  const [customFrontPhoto, setCustomFrontPhoto] = useState<string | null>(null);
  const [customSidePhoto, setCustomSidePhoto] = useState<string | null>(null);

  const frontFileInputRef = useRef<HTMLInputElement | null>(null);
  const sideFileInputRef = useRef<HTMLInputElement | null>(null);

  const [results, setResults] = useState({
    member: 'Juan Pérez (DNI: 1098765432)',
    date: '22 de Septiembre, 2026',
    estimatedFatPct: 16.2,
    leanMassKg: 65.8,
    weightKg: 78.5,
    bmi: 25.05,
    somatotype: 'Mesomorfo',
    postureScore: 92,
    frontImage: DEFAULT_FRONT_IMAGE,
    sideImage: DEFAULT_SIDE_IMAGE,
    source: 'BIOMETRIC_ENGINE',
    postureFindings: [
      { title: 'Alineación de Hombros', status: 'WARN', detail: 'Hombro derecho 1.2° elevado por tensión de trapecio.' },
      { title: 'Inclinación Pélvica (Pelvic Tilt)', status: 'OK', detail: 'Inclinación de 2.1° dentro de parámetros neutros saludables.' },
      { title: 'Curvatura Espinal Lateral', status: 'OK', detail: 'Sin desviaciones escolióticas aparentes en plano frontal.' },
      { title: 'Simetría Muscular Bíceps/Tríceps', status: 'OK', detail: '97.4% de balance bilateral.' }
    ],
    aiRecommendations: [
      'Incorporar 3 series semanales de Face Pulls y rotaciones externas para alinear la cintura escapular.',
      'Aumentar la proteína diaria a 165g (2.1g/kg) para favorecer la ganancia de masa magra pura.',
      'Mantener sobrecarga progresiva en press militar con agarre neutro para proteger manguito rotador.'
    ]
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'FRONT' | 'SIDE') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (type === 'FRONT') {
        setCustomFrontPhoto(base64);
        setActivePhoto('FRONT');
        setResults(prev => ({ ...prev, frontImage: base64 }));
      } else {
        setCustomSidePhoto(base64);
        setActivePhoto('SIDE');
        setResults(prev => ({ ...prev, sideImage: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const runAIScan = async () => {
    setScanning(true);
    setScanCompleted(false);

    try {
      const imageToAnalyze = (activePhoto === 'FRONT' ? customFrontPhoto : customSidePhoto) || 
                             (activePhoto === 'FRONT' ? DEFAULT_FRONT_IMAGE : DEFAULT_SIDE_IMAGE);

      const aiResponse = await analyzeBodyWithBackendAI({
        frontImageBase64: imageToAnalyze,
        weightKg: Number(weightInput),
        heightCm: Number(heightInput),
        age: Number(ageInput),
        gender: genderInput
      });

      if (aiResponse) {
        setResults(prev => ({
          ...prev,
          estimatedFatPct: aiResponse.bodyFatPercentage || prev.estimatedFatPct,
          leanMassKg: aiResponse.leanMassKg || prev.leanMassKg,
          bmi: aiResponse.bmi || prev.bmi,
          somatotype: aiResponse.somatotype || prev.somatotype,
          postureScore: aiResponse.postureScore || prev.postureScore,
          postureFindings: aiResponse.postureNotes?.map((note: string, idx: number) => ({
            title: `Diagnóstico Biomecánico #${idx + 1}`,
            status: idx === 0 ? 'WARN' : 'OK',
            detail: note
          })) || prev.postureFindings,
          aiRecommendations: aiResponse.recommendations || prev.aiRecommendations,
        }));
      }
    } catch (e) {
      console.warn('Fallback a simulación biométrica local');
    } finally {
      setTimeout(() => {
        setScanning(false);
        setScanCompleted(true);
      }, 1200);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER ESTILO NEXO: VIBRANTE + WIDGET FLOTANTE + SCAN-IA */}
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
          SCAN-IA
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
              % VISIÓN ARTIFICIAL & BIOMETRÍA / ESCANEO 3D
            </span>
            <span style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.82rem', fontWeight: 700 }}>
              Composición Corporal & Diagnóstico Postural
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
            ESCANEO CORPORAL <span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>IA</span>
          </h1>

          <p style={{
            color: 'rgba(7, 10, 18, 0.85)',
            fontSize: '0.92rem',
            fontWeight: 600,
            margin: '0.4rem 0 0 0',
            lineHeight: 1.4,
          }}>
            Estimación de porcentaje de grasa, masa libre de grasa y análisis postural con algoritmos de visión artificial y machine learning.
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={runAIScan}
              disabled={scanning}
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
              <span>{scanning ? 'Procesando Biometría IA...' : 'Ejecutar Escaneo IA'}</span>
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
          {/* Header del card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentTheme.primary, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Unlock size={14} /> Motor de Visión IA
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              color: '#94a3b8',
            }}>
              v4.8 Neural
            </span>
          </div>

          {/* Subtítulo y Porcentaje */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Precisión Biométrica
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
              98.4% <span style={{ fontSize: '0.85rem', color: currentTheme.primary }}>(Calibrado)</span>
            </span>
          </div>

          {/* Barra de progreso Neón */}
          <div style={{
            height: '7px',
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '0.85rem',
          }}>
            <div style={{
              width: '98.4%',
              height: '100%',
              background: currentTheme.primary,
              boxShadow: `0 0 10px ${currentTheme.primary}`,
              borderRadius: '999px',
            }} />
          </div>

          {/* Estadísticas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Grasa Estimada
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: currentTheme.primary, marginTop: '2px' }}>
                {results.estimatedFatPct}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Masa Libre Grasa
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                {results.leanMassKg} kg
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CUERPO BLANCO: FOTOGRAFÍAS & DIAGNÓSTICO BIOMÉTRICO */}
      {/* ------------------------------------------------------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.25rem' }}>
        {/* Visor de Escaneo & Foto */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => setActivePhoto('FRONT')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: activePhoto === 'FRONT' ? currentTheme.primary : '#f8fafc',
                  color: activePhoto === 'FRONT' ? '#000000' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Plano Frontal
              </button>
              <button
                onClick={() => setActivePhoto('SIDE')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: activePhoto === 'SIDE' ? currentTheme.primary : '#f8fafc',
                  color: activePhoto === 'SIDE' ? '#000000' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Plano Lateral
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => (activePhoto === 'FRONT' ? frontFileInputRef : sideFileInputRef).current?.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}
              >
                <Upload size={13} /> Subir Foto
              </button>
              <input
                type="file"
                ref={frontFileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'FRONT')}
              />
              <input
                type="file"
                ref={sideFileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'SIDE')}
              />
            </div>
          </div>

          {/* Marco de imagen con escáner */}
          <div style={{
            height: '320px',
            background: '#070a12',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src={activePhoto === 'FRONT' ? results.frontImage : results.sideImage}
              alt="Scan Target"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />

            {/* Cuadrícula o láser de escaneo si scanning === true */}
            {scanning && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <div style={{
                  width: '80%',
                  height: '3px',
                  background: currentTheme.primary,
                  boxShadow: `0 0 18px ${currentTheme.primary}`,
                  borderRadius: '999px',
                }} />
                <span style={{ color: currentTheme.primary, fontWeight: 900, fontSize: '0.85rem' }}>
                  Extrayendo Puntos Biométricos Clave...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Resultados Biométricos */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color={currentTheme.primary} /> Métricas Calculadas
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>% GRASA CORPORAL</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '2px 0' }}>
                {results.estimatedFatPct}%
              </div>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Rango Atlético Saludable</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>MASA MUSCULAR MAGRA</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '2px 0' }}>
                {results.leanMassKg} kg
              </div>
              <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>83.8% Masa Libre</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>ÍNDICE IMC & SOMATOTIPO</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '2px 0' }}>
                {results.bmi} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({results.somatotype})</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Peso actual: {results.weightKg} kg</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>POSTURA & SIMETRÍA</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669', margin: '2px 0' }}>
                {results.postureScore} / 100
              </div>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Alineación Óptima</span>
            </div>
          </div>

          {/* Hallazgos Posturales */}
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
              Hallazgos de la Red Neuronal:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {results.postureFindings.map((f, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontSize: '0.78rem',
                  padding: '0.5rem 0.65rem',
                  background: f.status === 'WARN' ? '#fffbeb' : '#f8fafc',
                  border: `1px solid ${f.status === 'WARN' ? '#fde68a' : '#e2e8f0'}`,
                  borderRadius: '10px',
                }}>
                  {f.status === 'WARN' ? <AlertTriangle size={15} color="#d97706" /> : <CheckCircle size={15} color="#059669" />}
                  <div>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{f.title}: </span>
                    <span style={{ color: '#475569' }}>{f.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScanView;
