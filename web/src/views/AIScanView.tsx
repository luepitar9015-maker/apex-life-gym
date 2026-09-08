import React, { useState } from 'react';
import { Sparkles, Camera, Upload, CheckCircle, AlertTriangle, ShieldCheck, Activity, Cpu, ArrowRight, UserCheck, RefreshCw } from 'lucide-react';
import { analyzeBodyWithBackendAI } from '../services/api.js';

export const AIScanView: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(true);
  const [activePhoto, setActivePhoto] = useState<'FRONT' | 'SIDE'>('FRONT');
  const [weightInput, setWeightInput] = useState(78.5);
  const [heightInput, setHeightInput] = useState(177);

  // Datos de la evaluación por IA
  const [results, setResults] = useState({
    member: 'Juan Pérez (ID: 1098765432)',
    date: '07 de Septiembre, 2026',
    estimatedFatPct: 16.2,
    leanMassKg: 65.8,
    weightKg: 78.5,
    bmi: 25.05,
    somatotype: 'Mesomorfo',
    postureScore: 92,
    frontImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop',
    sideImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop',
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

  const triggerScan = async () => {
    setScanning(true);
    setScanCompleted(false);

    const apiData = await analyzeBodyWithBackendAI({
      weightKg: weightInput,
      heightCm: heightInput,
      age: 28,
      gender: 'MALE',
    });

    if (apiData) {
      setResults(prev => ({
        ...prev,
        estimatedFatPct: apiData.estimatedFatPct,
        leanMassKg: apiData.leanMassKg,
        weightKg: apiData.weightKg,
        bmi: apiData.bmi,
        somatotype: apiData.somatotype,
        postureScore: apiData.postureScore,
        postureFindings: apiData.postureFindings,
        aiRecommendations: apiData.aiRecommendations,
      }));
    }

    setScanning(false);
    setScanCompleted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-active">Visión por Computadora & Biometría</span>
            <span className="badge badge-cyan">Gemini Vision AI</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Escaneo Corporal & Diagnóstico Postural por IA</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Estimación no invasiva de composición corporal (% grasa, masa magra) y mapeo biomecánico osteomuscular.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Peso:</span>
            <input
              type="number"
              value={weightInput}
              onChange={(e) => setWeightInput(Number(e.target.value))}
              style={{ width: '55px', background: 'transparent', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.85rem', outline: 'none' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>kg</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Altura:</span>
            <input
              type="number"
              value={heightInput}
              onChange={(e) => setHeightInput(Number(e.target.value))}
              style={{ width: '55px', background: 'transparent', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.85rem', outline: 'none' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>cm</span>
          </div>

          <button className="btn btn-primary" onClick={triggerScan} disabled={scanning}>
            {scanning ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {scanning ? 'Analizando en Backend...' : 'Ejecutar Escaneo con IA'}
          </button>
        </div>
      </div>

      {/* Main Analysis Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '2rem' }}>
        {/* Left Column: Visual Silhouette & Skeletal Overlay */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={20} color="var(--primary)" /> Captura Biométrica
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary"
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  background: activePhoto === 'FRONT' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: activePhoto === 'FRONT' ? 'var(--primary)' : 'var(--text-muted)'
                }}
                onClick={() => setActivePhoto('FRONT')}
              >
                Frontal
              </button>
              <button
                className="btn btn-secondary"
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  background: activePhoto === 'SIDE' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  color: activePhoto === 'SIDE' ? 'var(--accent-cyan)' : 'var(--text-muted)'
                }}
                onClick={() => setActivePhoto('SIDE')}
              >
                Lateral
              </button>
            </div>
          </div>

          {/* Photo Frame with AI Scan Effect and Keypoints */}
          <div style={{
            position: 'relative',
            height: '460px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-glow)',
            background: '#040711'
          }}>
            {/* Background Athlete Photo */}
            <img
              src={activePhoto === 'FRONT' ? results.frontImage : results.sideImage}
              alt="Análisis Corporal"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: scanning ? 0.7 : 0.9,
                filter: scanning ? 'grayscale(50%) contrast(1.2)' : 'none',
                transition: 'all 0.5s ease'
              }}
            />

            {/* Laser Line Scanning Effect */}
            {scanning && <div className="laser-line" />}

            {/* AI Keypoint Markers (Biomecánica) */}
            {!scanning && (
              <>
                {/* Hombro Izquierdo */}
                <div style={{
                  position: 'absolute',
                  top: '28%',
                  left: '37%',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 12px #10b981',
                  border: '2px solid #fff'
                }}>
                  <div style={{ position: 'absolute', left: '16px', top: '-6px', background: 'rgba(0,0,0,0.75)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', whiteSpace: 'nowrap', color: '#10b981' }}>
                    Hombro Izq (0°)
                  </div>
                </div>

                {/* Hombro Derecho (Compensación) */}
                <div style={{
                  position: 'absolute',
                  top: '27.4%',
                  left: '61%',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  boxShadow: '0 0 12px #f59e0b',
                  border: '2px solid #fff'
                }}>
                  <div style={{ position: 'absolute', left: '16px', top: '-6px', background: 'rgba(0,0,0,0.75)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', whiteSpace: 'nowrap', color: '#fbbf24' }}>
                    Hombro Der (+1.2°)
                  </div>
                </div>

                {/* Core / Centro de Gravedad */}
                <div style={{
                  position: 'absolute',
                  top: '48%',
                  left: '49%',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#06b6d4',
                  boxShadow: '0 0 15px #06b6d4',
                  border: '2px solid #fff'
                }}>
                  <div style={{ position: 'absolute', left: '18px', top: '-6px', background: 'rgba(0,0,0,0.75)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', whiteSpace: 'nowrap', color: '#22d3ee' }}>
                    Eje Pélvico (Neutro)
                  </div>
                </div>
              </>
            )}

            {/* Bottom Overlay Status */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1rem',
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>Socio Analizado:</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{results.member}</p>
              </div>
              <span className="badge badge-active">94% Precisión Biométrica</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Calculated Metrics & Clinical Report */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top 3 Big Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {/* Fat Percentage */}
            <div className="glass-card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                % Grasa Corporal
              </span>
              <h3 style={{ fontSize: '2.2rem', color: 'var(--primary)', margin: '0.35rem 0' }}>
                {results.estimatedFatPct}%
              </h3>
              <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>Nivel Atlético</span>
            </div>

            {/* Lean Body Mass */}
            <div className="glass-card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Masa Muscular Magra
              </span>
              <h3 style={{ fontSize: '2.2rem', color: 'var(--accent-cyan)', margin: '0.35rem 0' }}>
                {results.leanMassKg} <span style={{ fontSize: '1rem' }}>kg</span>
              </h3>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Alta densidad</span>
            </div>

            {/* Somatotype / Posture Score */}
            <div className="glass-card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Score Postural
              </span>
              <h3 style={{ fontSize: '2.2rem', color: '#fff', margin: '0.35rem 0' }}>
                {results.postureScore} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
              </h3>
              <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>Excelente</span>
            </div>
          </div>

          {/* Biomechanical Diagnostic List */}
          <div className="glass-card">
            <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="var(--primary)" /> Hallazgos Biomecánicos y de Postura
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {results.postureFindings.map((item, idx) => (
                <div key={idx} style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#fff' }}>{item.title}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.detail}</span>
                  </div>
                  {item.status === 'OK' ? (
                    <CheckCircle size={18} color="#10b981" />
                  ) : (
                    <AlertTriangle size={18} color="#f59e0b" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Prescriptions and Recommendations */}
          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="var(--primary)" /> Prescripción de Entrenamiento & Dieta generada por IA
            </h4>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingLeft: '1.25rem' }}>
              {results.aiRecommendations.map((rec, i) => (
                <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                  {rec}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                Aplicar a Rutina del Socio
              </button>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                Exportar Informe PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
