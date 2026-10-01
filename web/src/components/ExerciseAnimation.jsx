import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Flame,
  Wind,
  ShieldCheck,
  ChevronRight,
  Gauge,
  Compass
} from 'lucide-react';

export default function ExerciseAnimation({ exercise, isPlaying = true }) {
  const [activePhase, setActivePhase] = useState('excentric'); // 'excentric' (bajada/estiramiento) | 'concentric' (subida/empuje)
  const [repCount, setRepCount] = useState(1);
  const [progress, setProgress] = useState(0); // 0 a 100

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setRepCount((r) => (r >= 15 ? 1 : r + 1));
          setActivePhase('excentric');
          return 0;
        }
        if (prev >= 50 && activePhase !== 'concentric') {
          setActivePhase('concentric');
        }
        return prev + 2; // ~5 segundos por repetición completa y cadencia profesional
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, activePhase]);

  // Factor de interpolación 0 a 1 (0 = posición inicial / extensión, 1 = máxima flexión o esfuerzo)
  const t = Math.sin((progress / 100) * Math.PI);
  const isConcentric = progress >= 50;

  // Renderizador biomecánico con anatomía realista, máquinas con poleas y placas móviles
  const renderBiomechanicalScene = () => {
    switch (exercise.animationType) {
      // ==========================================
      // 1. PRENSA DE PIERNAS INCLINADA 45°
      // ==========================================
      case 'leg-press': {
        const sledShift = t * 38; // Desplazamiento sobre riel de 45°
        const plateX = 145 - sledShift * 0.7;
        const plateY = 45 + sledShift * 0.7;
        const kneeX = 85 + t * 12;
        const kneeY = 92 - t * 15;
        const currentAngle = Math.round(160 - t * 70); // Ángulo de rodilla de 160° a 90°

        return (
          <svg viewBox="0 0 280 200" className="w-full h-full max-h-64 drop-shadow-md">
            <defs>
              <linearGradient id="steelBeam" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <linearGradient id="chromeRail" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="seatLeather" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#172554" />
              </linearGradient>
              <linearGradient id="muscleGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Chasis y Riel a 45° de la Prensa */}
            <line x1="30" y1="185" x2="250" y2="185" stroke="url(#steelBeam)" strokeWidth="6" strokeLinecap="round" />
            <line x1="60" y1="185" x2="220" y2="30" stroke="url(#chromeRail)" strokeWidth="8" strokeLinecap="round" />
            <line x1="80" y1="185" x2="240" y2="30" stroke="url(#chromeRail)" strokeWidth="8" strokeLinecap="round" />
            
            {/* Asiento con respaldo ergonómico inclinado */}
            <path d="M 45 135 L 75 165 L 55 175 Z" fill="url(#seatLeather)" stroke="#0f172a" strokeWidth="2" />
            <line x1="35" y1="110" x2="68" y2="155" stroke="url(#seatLeather)" strokeWidth="14" strokeLinecap="round" />

            {/* Plataforma deslizante con discos de peso */}
            <rect x={plateX - 8} y={plateY - 18} width="36" height="36" rx="4" fill="url(#steelBeam)" stroke="#475569" strokeWidth="2" />
            <line x1={plateX - 12} y1={plateY} x2={plateX + 32} y2={plateY - 44} stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
            {/* Discos olímpicos */}
            <circle cx={plateX + 16} cy={plateY - 14} r="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx={plateX + 22} cy={plateY - 20} r="12" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />

            {/* CUERPO DEL ATLETA (ANATOMÍA) */}
            {/* Cabeza con gorra */}
            <circle cx="48" cy="100" r="9" fill="#2563eb" />
            <path d="M 46 93 Q 56 90 60 95" stroke="#1d4ed8" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Torso apoyado firmemente en respaldo */}
            <line x1="52" y1="106" x2="68" y2="148" stroke="#1e3a8a" strokeWidth="16" strokeLinecap="round" />

            {/* Brazo agarrando manillas laterales de seguridad */}
            <polyline points="56,122 72,138 78,146" fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Muslo / Cuádriceps (Agonista con brillo biomecánico) */}
            <line x1="68" y1="148" x2={kneeX} y2={kneeY} stroke="url(#muscleGlow)" strokeWidth={14 + t * 3} strokeLinecap="round" />
            {/* Pantorrilla y Tendón hacia la plataforma */}
            <line x1={kneeX} y1={kneeY} x2={plateX + 6} y2={plateY + 4} stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
            {/* Pie plano y seguro sobre plataforma */}
            <line x1={plateX + 2} y1={plateY - 2} x2={plateX + 16} y2={plateY + 12} stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />

            {/* INDICADOR BIOMECÁNICO HUD (ÁNGULO DE RODILLA) */}
            <circle cx={kneeX} cy={kneeY} r="16" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
            <text x={kneeX + 8} y={kneeY - 10} fill="#0284c7" fontSize="10" fontWeight="900" fontFamily="sans-serif">
              {currentAngle}°
            </text>

            {/* Flecha de vector de fuerza */}
            {isConcentric ? (
              <path d={`M ${plateX - 5} ${plateY + 20} L ${plateX + 15} ${plateY - 2} L ${plateX + 10} ${plateY + 6}`} stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
              <path d={`M ${plateX + 15} ${plateY - 2} L ${plateX - 5} ${plateY + 20} L ${plateX} ${plateY + 14}`} stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
          </svg>
        );
      }

      // ==========================================
      // 2. EXTENSIÓN DE CUÁDRICEPS EN MÁQUINA
      // ==========================================
      case 'leg-extension': {
        const rot = t * 65; // Ángulo de extensión de 0° (abajo) a 65° (arriba casi horizontal)
        const rad = ((rot - 20) * Math.PI) / 180;
        const ankleX = 145 + Math.sin(rad) * 45;
        const ankleY = 160 - Math.cos(rad) * 45;
        const angleDeg = Math.round(90 + rot);

        return (
          <svg viewBox="0 0 280 200" className="w-full h-full max-h-64 drop-shadow-md">
            <defs>
              <linearGradient id="quadGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>

            {/* Torre de placas de peso con movimiento dinámico */}
            <rect x="22" y="30" width="34" height="150" rx="4" fill="#1e293b" />
            <line x1="39" y1="20" x2="39" y2="185" stroke="#94a3b8" strokeWidth="3" />
            {/* Placas de peso que se elevan al extender */}
            <rect x="26" y={110 - t * 25} width="26" height="40" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            <line x1="39" y1="30" x2="39" y2={110 - t * 25} stroke="#38bdf8" strokeWidth="2.5" />

            {/* Asiento con respaldo ergonómico */}
            <rect x="90" y="115" width="55" height="12" rx="4" fill="#1e3a8a" />
            <rect x="80" y="60" width="12" height="65" rx="4" fill="#1e3a8a" />
            <line x1="85" y1="125" x2="85" y2="185" stroke="#334155" strokeWidth="8" />
            <line x1="135" y1="125" x2="135" y2="185" stroke="#334155" strokeWidth="8" />

            {/* Atleta sentado */}
            <circle cx="92" cy="45" r="9" fill="#2563eb" />
            <line x1="94" y1="52" x2="100" y2="115" stroke="#1e3a8a" strokeWidth="16" strokeLinecap="round" />
            {/* Agarre de manilla lateral */}
            <line x1="102" y1="90" x2="120" y2="118" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />

            {/* Muslo en el asiento */}
            <line x1="100" y1="115" x2="145" y2="118" stroke="url(#quadGlow)" strokeWidth={15 + t * 3} strokeLinecap="round" />

            {/* Eje rotacional de la máquina (alineado con la rodilla) */}
            <circle cx="145" cy="118" r="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />

            {/* Pierna inferior y rodillo acolchado */}
            <line x1="145" y1="118" x2={ankleX} y2={ankleY} stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
            {/* Rodillo inferior acolchado */}
            <circle cx={ankleX} cy={ankleY} r="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />

            {/* HUD: Grados de extensión del cuádriceps */}
            <text x="160" y="70" fill="#2563eb" fontSize="11" fontWeight="900">
              {angleDeg}° Extensión
            </text>
            <text x="160" y="85" fill={t > 0.7 ? '#ef4444' : '#64748b'} fontSize="9" fontWeight="bold">
              {t > 0.7 ? '🔥 PICO DE CONTRACCIÓN' : 'FASE DE CARGA'}
            </text>
          </svg>
        );
      }

      // ==========================================
      // 3. JALÓN AL PECHO EN POLEA ALTA (LAT PULLDOWN)
      // ==========================================
      case 'lat-pulldown': {
        const pullY = 40 + t * 45; // Barra baja de Y:40 a Y:85 (altura clavícula)
        const elbowX = 145 + t * 15;
        const elbowY = pullY + 12;

        return (
          <svg viewBox="0 0 280 200" className="w-full h-full max-h-64 drop-shadow-md">
            {/* Torre y Polea Alta */}
            <rect x="30" y="20" width="30" height="165" rx="3" fill="#1e293b" />
            <circle cx="140" cy="15" r="9" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
            {/* Cable desde la torre hasta la barra */}
            <path d={`M 45 60 L 45 15 L 140 15 L 140 ${pullY}`} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            
            {/* Barra ancha curvada de jalón */}
            <path d={`M 90 ${pullY - 4} Q 140 ${pullY + 5} 190 ${pullY - 4}`} fill="none" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
            
            {/* Asiento y Rodillos protectores para muslos */}
            <rect x="120" y="130" width="40" height="12" rx="3" fill="#1e3a8a" />
            <circle cx="132" cy="115" r="7" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle cx="148" cy="115" r="7" fill="#0f172a" stroke="#475569" strokeWidth="2" />

            {/* ATLETA: Espalda con ligera inclinación 15° */}
            <circle cx="138" cy="72" r="9" fill="#2563eb" />
            {/* Torso / Dorsales (Resaltados al tirar) */}
            <line x1="138" y1="80" x2="135" y2="132" stroke={t > 0.6 ? '#ef4444' : '#1e3a8a'} strokeWidth={16 + t * 3} strokeLinecap="round" />

            {/* Brazos / Codos guiados hacia abajo y costillas */}
            <polyline points={`105,${pullY} 122,${elbowY} 136,88`} fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={`175,${pullY} 158,${elbowY} 140,88`} fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

            {/* Muslos encajados firmemente en los rodillos */}
            <line x1="135" y1="130" x2="148" y2="118" stroke="#172554" strokeWidth="12" strokeLinecap="round" />
            <line x1="148" y1="118" x2="152" y2="165" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />

            {/* HUD de Biomecánica: Escápulas y Respiración */}
            <text x="180" y="60" fill="#0284c7" fontSize="10" fontWeight="bold">
              Depresión Escapular
            </text>
            <text x="180" y="75" fill={isConcentric ? '#10b981' : '#f59e0b'} fontSize="9" fontWeight="bold">
              {isConcentric ? '💨 Exhala al pecho' : '🌬️ Inhala al retornar'}
            </text>
          </svg>
        );
      }

      // ==========================================
      // 4. PRESS DE PECHO EN MÁQUINA SENTADO
      // ==========================================
      case 'chest-press': {
        const handleShift = t * 35; // Brazos empujan hacia adelante
        const handX = 135 + handleShift;
        const elbowX = 115 + handleShift * 0.45;

        return (
          <svg viewBox="0 0 280 200" className="w-full h-full max-h-64 drop-shadow-md">
            {/* Chasis de la máquina */}
            <line x1="50" y1="185" x2="230" y2="185" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <rect x="75" y="45" width="12" height="95" rx="3" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="75" y="135" width="50" height="12" rx="3" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.5" />

            {/* Atleta sentado */}
            <circle cx="92" cy="42" r="9" fill="#2563eb" />
            {/* Pectoral y Torso con expansión */}
            <line x1="88" y1="52" x2="92" y2="135" stroke="#1e3a8a" strokeWidth="16" strokeLinecap="round" />
            {/* Pectoral activo */}
            <circle cx="108" cy="72" r={9 + t * 2} fill="#ef4444" opacity={0.6 + t * 0.4} />

            {/* Palancas de la máquina articulada */}
            <polyline points={`60,30 90,50 ${handX},75`} fill="none" stroke="#64748b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Agarre de la máquina */}
            <line x1={handX} y1="65" x2={handX} y2="85" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />

            {/* Brazo del atleta: Hombro -> Codo -> Mano */}
            <polyline points={`98,68 ${elbowX},82 ${handX},75`} fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

            {/* Piernas bien apoyadas en el suelo */}
            <polyline points="92,135 125,138 128,185" fill="none" stroke="#172554" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />

            {/* HUD de Empuje */}
            <text x="150" y="40" fill="#0284c7" fontSize="11" fontWeight="bold">
              Press Horizontal
            </text>
            <text x="150" y="55" fill={t > 0.8 ? '#10b981' : '#64748b'} fontSize="9" fontWeight="bold">
              {t > 0.8 ? '✓ Bloqueo sin hiperextender codos' : 'Fuerza desde el pectoral'}
            </text>
          </svg>
        );
      }

      // ==========================================
      // 5. FLEXIONES DE PECHO EN CASA (PUSH-UP)
      // ==========================================
      case 'push-up':
      case 'diamond-push-up': {
        const bodyY = 65 + t * 30; // El cuerpo baja hacia el suelo
        const elbowY = 52 + t * 35;
        const elbowX = exercise.animationType === 'diamond-push-up' ? 150 : 160;

        return (
          <svg viewBox="0 0 280 180" className="w-full h-full max-h-64 drop-shadow-md">
            {/* Suelo del hogar con tapete / esterilla */}
            <rect x="20" y="145" width="240" height="6" rx="3" fill="#cbd5e1" />
            <line x1="30" y1="145" x2="250" y2="145" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />

            {/* Cuerpo del Atleta en Tabla Rígida (Core + Glúteo apretado) */}
            <line x1="50" y1="140" x2="190" y2={bodyY} stroke="#1e3a8a" strokeWidth="16" strokeLinecap="round" />

            {/* Cabeza alineada con columna vertebral */}
            <circle cx="206" cy={bodyY - 6} r="10" fill="#2563eb" />

            {/* Brazos y Articulación del codo */}
            <polyline
              points={`180,${bodyY + 2} ${elbowX},${elbowY} 182,143`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Pectoral y Tríceps activos con mapa de calor */}
            <circle cx="175" cy={bodyY + 3} r={8 + t * 3} fill="#ef4444" opacity={0.6 + t * 0.4} />

            {/* Puntas de los pies en el suelo */}
            <circle cx="48" cy="140" r="6" fill="#0f172a" />

            {/* HUD de Biomecánica */}
            <text x="30" y="30" fill="#0284c7" fontSize="11" fontWeight="bold">
              {exercise.animationType === 'diamond-push-up' ? 'Flexión Diamante (Tríceps)' : 'Push-Up Clásica'}
            </text>
            <text x="30" y="46" fill="#64748b" fontSize="9">
              {t > 0.8 ? 'Pecho a 2 cm del suelo • Codos a 45°' : 'Tronco en línea recta perfecta'}
            </text>
          </svg>
        );
      }

      // ==========================================
      // 6. SENTADILLAS AÉREAS / BULGARAS EN CASA
      // ==========================================
      case 'air-squat':
      case 'bulgarian-squat': {
        const hipY = 65 + t * 40;
        const kneeX = 135 + t * 15;
        const kneeAngle = Math.round(165 - t * 75);

        return (
          <svg viewBox="0 0 280 200" className="w-full h-full max-h-64 drop-shadow-md">
            {/* Suelo */}
            <line x1="30" y1="180" x2="250" y2="180" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />

            {/* Silla para Búlgara (si aplica) */}
            {exercise.animationType === 'bulgarian-squat' && (
              <g>
                <rect x="40" y="125" width="35" height="10" rx="2" fill="#d97706" />
                <line x1="45" y1="135" x2="45" y2="180" stroke="#78350f" strokeWidth="4" />
                <line x1="70" y1="135" x2="70" y2="180" stroke="#78350f" strokeWidth="4" />
                {/* Pierna apoyada atrás en la silla */}
                <polyline points={`110,${hipY} 75,${hipY + 20} 55,125`} fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}

            {/* Cabeza */}
            <circle cx="125" cy={hipY - 45} r="10" fill="#2563eb" />

            {/* Torso con ángulo neutro y pecho erguido */}
            <line x1="125" y1={hipY - 35} x2="115" y2={hipY} stroke="#1e3a8a" strokeWidth="16" strokeLinecap="round" />

            {/* Brazos al frente para equilibrio */}
            <line x1="125" y1={hipY - 25} x2="160" y2={hipY - 25} stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />

            {/* Pierna Principal (Cuádriceps y Glúteo) */}
            <line x1="115" y1={hipY} x2={kneeX} y2={hipY + 35} stroke="#ef4444" strokeWidth={14 + t * 3} strokeLinecap="round" />
            <line x1={kneeX} y1={hipY + 35} x2="135" y2="178" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
            {/* Pie firme en el suelo */}
            <line x1="125" y1="178" x2="148" y2="178" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />

            {/* HUD de Profundidad */}
            <text x="175" y="60" fill="#0284c7" fontSize="11" fontWeight="bold">
              {kneeAngle}° Flexión
            </text>
            <text x="175" y="75" fill={t > 0.7 ? '#10b981' : '#64748b'} fontSize="9" fontWeight="bold">
              {t > 0.7 ? 'Profundidad válida paralela' : 'Mantén peso en talones'}
            </text>
          </svg>
        );
      }

      // ==========================================
      // CASO DEFAULT / OTRAS MÁQUINAS (SMITH, POLEAS, ETC.)
      // ==========================================
      default: {
        const defaultY = 60 + t * 30;
        return (
          <svg viewBox="0 0 280 180" className="w-full h-full max-h-64 drop-shadow-md">
            <line x1="30" y1="160" x2="250" y2="160" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
            {/* Máquina o estructura de soporte */}
            <rect x="50" y="30" width="8" height="130" fill="#475569" rx="2" />
            <rect x="220" y="30" width="8" height="130" fill="#475569" rx="2" />
            
            {/* Atleta en movimiento fluido */}
            <circle cx="135" cy={defaultY - 30} r="10" fill="#2563eb" />
            <line x1="135" y1={defaultY - 20} x2="135" y2={defaultY + 25} stroke="#1e3a8a" strokeWidth="16" strokeLinecap="round" />
            <circle cx="135" cy={defaultY} r={10 + t * 3} fill="#ef4444" opacity={0.7} />
            <polyline points={`135,${defaultY - 10} 170,${defaultY} 170,160`} fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* HUD SUPERIOR: FASE DINÁMICA & RESPIRACIÓN */}
      <div className="w-full flex items-center justify-between gap-2 px-3 py-2 mb-3 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 shadow-xs">
        {/* Indicador de Fase */}
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full animate-ping ${
              isConcentric ? 'bg-emerald-500' : 'bg-blue-500'
            }`}
          />
          <span
            className={`text-xs font-black uppercase tracking-wider ${
              isConcentric ? 'text-emerald-700' : 'text-blue-700'
            }`}
          >
            {isConcentric ? 'Fase Concéntrica (Empuje/Tracción)' : 'Fase Excéntrica (Bajada Controlada)'}
          </span>
        </div>

        {/* Respiración sincrónica */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-200">
          <Wind size={13} className={isConcentric ? 'text-emerald-500' : 'text-blue-500'} />
          <span>{isConcentric ? 'Exhala con fuerza' : 'Inhala llenando caja'}</span>
        </div>
      </div>

      {/* CONTENEDOR DEL VISUALIZADOR ANATÓMICO */}
      <div className="w-full bg-gradient-to-b from-slate-900/5 via-slate-900/10 to-slate-900/5 rounded-3xl p-4 border border-gray-200/60 relative overflow-hidden flex items-center justify-center min-h-[220px]">
        {/* Marca de agua Biomecánica */}
        <div className="absolute left-3 top-3 text-[10px] font-black text-gray-400/80 uppercase tracking-widest flex items-center gap-1">
          <Gauge size={12} />
          <span>Simulador Biomecánico 2D</span>
        </div>

        {renderBiomechanicalScene()}

        {/* HUD INFERIOR DENTRO DEL CANVAS: CONTADOR Y CADENCIA */}
        <div className="absolute right-3 bottom-3 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="text-right">
            <span className="text-[9px] font-black uppercase text-gray-400 block">Repetición</span>
            <span className="text-sm font-black text-blue-900">{repCount} / 12</span>
          </div>
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
            ⚡
          </div>
        </div>
      </div>

      {/* BARRA DE CADENCIA Y TEMPO EN TIEMPO REAL */}
      <div className="w-full mt-3 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
          <span>Cadencia: {exercise.tempo || '3-0-1'}</span>
          <span>Progreso de la Rep: {Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
          <div
            className={`h-full transition-all duration-100 ${
              isConcentric
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-blue-600 to-indigo-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
