import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Flame,
  Wind,
  ShieldCheck,
  Gauge,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function ExerciseAnimation({ exercise, isPlaying = true }) {
  const [activePhase, setActivePhase] = useState('excentric');
  const [repCount, setRepCount] = useState(1);
  const [progress, setProgress] = useState(0);

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
        return prev + 1.8; // Cadencia controlada y realista (~5.5s por repetición completa)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, activePhase]);

  // Factor de animación sinusoidal 0 -> 1 -> 0
  const t = Math.sin((progress / 100) * Math.PI);
  const isConcentric = progress >= 50;

  // Renderiza el modelo humano realista y la máquina correspondiente
  const renderRealisticAnatomy = () => {
    const animType = exercise.animationType || '';

    // ==========================================
    // 1. PRENSA DE PIERNAS 45° (LEG PRESS)
    // ==========================================
    if (animType === 'leg-press') {
      const sledDist = t * 38;
      const sledX = 145 - sledDist * 0.7;
      const sledY = 45 + sledDist * 0.7;
      const kneeX = 85 + t * 15;
      const kneeY = 96 - t * 18;
      const kneeAngle = Math.round(160 - t * 70);

      return (
        <svg viewBox="0 0 320 220" className="w-full h-full max-h-72 drop-shadow-lg">
          <defs>
            <linearGradient id="frameDark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="chromeTube" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="40%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="skinShade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="40%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            <linearGradient id="humanSkin" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="athleticWear" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            <radialGradient id="musclePump" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ESTRUCTURA DE LA PRENSA */}
          <line x1="20" y1="205" x2="300" y2="205" stroke="url(#frameDark)" strokeWidth="8" strokeLinecap="round" />
          {/* Rieles de acero cromado a 45° */}
          <line x1="55" y1="200" x2="245" y2="35" stroke="url(#chromeTube)" strokeWidth="10" strokeLinecap="round" />
          <line x1="75" y1="205" x2="265" y2="40" stroke="url(#chromeTube)" strokeWidth="10" strokeLinecap="round" />

          {/* Asiento ergonómico con costuras */}
          <path d="M 40 145 L 80 185 L 55 195 Z" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <rect x="25" y="115" width="22" height="60" rx="8" transform="rotate(35, 36, 145)" fill="url(#athleticWear)" stroke="#1e40af" strokeWidth="2" />

          {/* Carro deslizante con discos olímpicos */}
          <rect x={sledX - 10} y={sledY - 20} width="40" height="40" rx="6" fill="#334155" stroke="#64748b" strokeWidth="2" />
          <line x1={sledX - 16} y1={sledY + 4} x2={sledX + 38} y2={sledY - 48} stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
          {/* Discos de 20kg */}
          <circle cx={sledX + 18} cy={sledY - 14} r="18" fill="#090d16" stroke="#e2e8f0" strokeWidth="3" />
          <circle cx={sledX + 26} cy={sledY - 22} r="15" fill="#090d16" stroke="#94a3b8" strokeWidth="2" />

          {/* FIGURA HUMANA REALISTA */}
          {/* Cabeza anatómica con cabello y perfil */}
          <ellipse cx="48" cy="105" rx="9" ry="11" fill="url(#humanSkin)" />
          <path d="M 44 96 Q 52 92 56 99 Q 58 104 56 108" fill="#1e293b" />

          {/* Torso con musculatura y camiseta atlética */}
          <path d="M 48 116 Q 58 125 65 148 Q 58 160 52 165 Z" fill="url(#athleticWear)" stroke="#2563eb" strokeWidth="1.5" />

          {/* Brazo sujetando manillas laterales de seguridad */}
          <path d="M 52 128 Q 65 142 74 154" fill="none" stroke="url(#humanSkin)" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="75" cy="155" rx="4" ry="4" fill="#ea580c" />

          {/* Piernas: Muslo / Cuádriceps con volumen muscular realista */}
          <path
            d={`M 60 160 Q ${kneeX - 12} ${kneeY - 10} ${kneeX} ${kneeY} Q ${kneeX + 4} ${kneeY + 8} 74 165 Z`}
            fill={t > 0.6 ? 'url(#humanSkin)' : 'url(#humanSkin)'}
            stroke="#c2410c"
            strokeWidth="1.5"
          />

          {/* Mapa de calor de activación en cuádriceps */}
          <ellipse cx={(60 + kneeX) / 2} cy={(160 + kneeY) / 2} rx="16" ry="9" fill="url(#musclePump)" opacity={0.6 + t * 0.4} />

          {/* Pantorrilla / Gemelo realista */}
          <path
            d={`M ${kneeX} ${kneeY} Q ${kneeX + 15} ${kneeY + 15} ${sledX + 4} ${sledY + 8} L ${sledX} ${sledY + 4} Z`}
            fill="url(#humanSkin)"
          />

          {/* Zapatilla deportiva sobre plataforma */}
          <path d={`M ${sledX - 2} ${sledY + 2} L ${sledX + 16} ${sledY + 16} L ${sledX + 2} ${sledY + 22} Z`} fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />

          {/* HUD BIOMECÁNICO */}
          <circle cx={kneeX} cy={kneeY} r="18" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
          <text x={kneeX + 10} y={kneeY - 14} fill="#0284c7" fontSize="11" fontWeight="900" fontFamily="sans-serif">
            {kneeAngle}°
          </text>
        </svg>
      );
    }

    // ==========================================
    // 2. EXTENSIÓN DE CUÁDRICEPS (LEG EXTENSION)
    // ==========================================
    if (animType === 'leg-extension') {
      const rot = t * 65;
      const rad = ((rot - 20) * Math.PI) / 180;
      const ankleX = 165 + Math.sin(rad) * 55;
      const ankleY = 175 - Math.cos(rad) * 55;

      return (
        <svg viewBox="0 0 320 220" className="w-full h-full max-h-72 drop-shadow-lg">
          {/* Torre de placas de peso con cable */}
          <rect x="25" y="30" width="40" height="170" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <line x1="45" y1="20" x2="45" y2="200" stroke="#94a3b8" strokeWidth="3" />
          {/* Placas móviles que se elevan */}
          <rect x="30" y={115 - t * 30} width="30" height="50" rx="3" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="45" y1="30" x2="45" y2={115 - t * 30} stroke="#38bdf8" strokeWidth="2.5" />

          {/* Sillón ergonómico acolchado */}
          <rect x="95" y="125" width="70" height="15" rx="5" fill="#172554" stroke="#1e3a8a" strokeWidth="2" />
          <rect x="85" y="65" width="15" height="75" rx="5" fill="#172554" stroke="#1e3a8a" strokeWidth="2" />

          {/* FIGURA HUMANA */}
          <ellipse cx="98" cy="50" rx="10" ry="12" fill="#fb923c" />
          <path d="M 92 42 Q 102 38 106 46 Q 108 52 106 58" fill="#0f172a" />
          {/* Torso con espalda en respaldo */}
          <path d="M 98 62 L 105 125 L 115 125 L 108 62 Z" fill="#1e3a8a" />
          {/* Brazo agarrando la manilla lateral */}
          <path d="M 104 80 Q 120 105 128 126" fill="none" stroke="#ea580c" strokeWidth="7" strokeLinecap="round" />

          {/* Muslo en el asiento */}
          <path d="M 105 125 Q 135 124 165 125 Q 165 138 105 138 Z" fill="#fb923c" />
          {/* Pulso muscular en cuádriceps */}
          <ellipse cx="135" cy="128" rx="20" ry="8" fill="#ef4444" opacity={0.6 + t * 0.4} />

          {/* Eje de la máquina alineado con la rodilla */}
          <circle cx="165" cy="128" r="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />

          {/* Pierna inferior / tibia extendiéndose */}
          <path d={`M 165 128 Q ${(165 + ankleX) / 2} ${(128 + ankleY) / 2 - 4} ${ankleX} ${ankleY}`} fill="none" stroke="#ea580c" strokeWidth="12" strokeLinecap="round" />
          {/* Rodillo acolchado */}
          <circle cx={ankleX} cy={ankleY} r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Zapatilla */}
          <ellipse cx={ankleX + 8} cy={ankleY - 4} rx="8" ry="4" fill="#0284c7" />

          {/* Grados */}
          <text x="185" y="75" fill="#0284c7" fontSize="12" fontWeight="900">
            {Math.round(90 + rot)}° Extensión
          </text>
        </svg>
      );
    }

    // ==========================================
    // 3. JALÓN AL PECHO / LAT PULLDOWN
    // ==========================================
    if (animType === 'lat-pulldown') {
      const pullY = 40 + t * 48;
      const elbowX = 160 + t * 18;
      const elbowY = pullY + 16;

      return (
        <svg viewBox="0 0 320 220" className="w-full h-full max-h-72 drop-shadow-lg">
          {/* Torre y Polea Alta */}
          <rect x="30" y="20" width="35" height="180" rx="4" fill="#1e293b" />
          <circle cx="160" cy="15" r="10" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          {/* Cable */}
          <path d={`M 48 70 L 48 15 L 160 15 L 160 ${pullY}`} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Barra ergonómica ancha */}
          <path d={`M 100 ${pullY - 6} Q 160 ${pullY + 6} 220 ${pullY - 6}`} fill="none" stroke="#f1f5f9" strokeWidth="7" strokeLinecap="round" />

          {/* Asiento y rodillos */}
          <rect x="135" y="145" width="50" height="15" rx="4" fill="#172554" />
          <circle cx="150" cy="128" r="8" fill="#0f172a" stroke="#475569" strokeWidth="2" />
          <circle cx="170" cy="128" r="8" fill="#0f172a" stroke="#475569" strokeWidth="2" />

          {/* ATLETA CON DORSALES VISIBLES */}
          <ellipse cx="158" cy="75" rx="10" ry="12" fill="#fb923c" />
          {/* Espalda en V con camiseta de tirantes */}
          <path d="M 158 87 Q 170 115 155 145 L 145 145 Q 146 115 158 87 Z" fill="#1e3a8a" />
          {/* Músculo dorsal ancho expandiéndose y contrayéndose */}
          <path d={`M 148 95 Q ${elbowX - 25} ${elbowY - 5} 150 135`} fill="none" stroke="#ef4444" strokeWidth={12 + t * 4} strokeLinecap="round" opacity={0.7 + t * 0.3} />

          {/* Brazos atléticos tirando de la barra */}
          <path d={`M 115 ${pullY} Q 135 ${elbowY} 152 95`} fill="none" stroke="#ea580c" strokeWidth="8" strokeLinecap="round" />
          <path d={`M 205 ${pullY} Q 185 ${elbowY} 164 95`} fill="none" stroke="#ea580c" strokeWidth="8" strokeLinecap="round" />

          {/* Muslos bajo rodillos */}
          <rect x="145" y="125" width="28" height="14" rx="4" fill="#1e293b" />
          <path d="M 150 138 L 152 185" stroke="#fb923c" strokeWidth="9" strokeLinecap="round" />

          <text x="210" y="60" fill="#0284c7" fontSize="11" fontWeight="bold">
            Retracción Escapular
          </text>
        </svg>
      );
    }

    // ==========================================
    // 4. PRESS DE PECHO EN MÁQUINA (CHEST PRESS / INCLINE)
    // ==========================================
    if (animType === 'chest-press' || animType === 'incline-chest-press') {
      const handleShift = t * 38;
      const handX = 150 + handleShift;
      const elbowX = 125 + handleShift * 0.45;

      return (
        <svg viewBox="0 0 320 220" className="w-full h-full max-h-72 drop-shadow-lg">
          <line x1="40" y1="205" x2="280" y2="205" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          {/* Respaldo y Asiento */}
          <rect x="85" y="55" width="16" height="105" rx="5" fill="#172554" stroke="#1e3a8a" strokeWidth="2" />
          <rect x="85" y="150" width="55" height="15" rx="5" fill="#172554" stroke="#1e3a8a" strokeWidth="2" />

          {/* Atleta de perfil con pectoral definido */}
          <ellipse cx="106" cy="48" rx="10" ry="12" fill="#fb923c" />
          {/* Torso con pecho hacia afuera */}
          <path d="M 102 60 Q 128 85 106 150 L 98 150 Z" fill="#1e3a8a" />
          {/* Masa pectoral hinchándose en empuje */}
          <circle cx="124" cy="85" r={10 + t * 4} fill="#ef4444" opacity={0.6 + t * 0.4} />

          {/* Palancas mecánicas articuladas */}
          <path d={`M 75 35 Q 110 50 ${handX} 88`} fill="none" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
          <line x1={handX} y1="78" x2={handX} y2="98" stroke="#f8fafc" strokeWidth="7" strokeLinecap="round" />

          {/* Brazo humano empujando */}
          <path d={`M 112 78 Q ${elbowX} 98 ${handX} 88`} fill="none" stroke="#ea580c" strokeWidth="9" strokeLinecap="round" />

          {/* Piernas con pies firmes en el suelo */}
          <path d="M 106 150 L 140 152 L 144 205" fill="none" stroke="#1e293b" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />

          <text x="175" y="45" fill="#0284c7" fontSize="11" fontWeight="bold">
            Empuje Pectoral Mayor
          </text>
        </svg>
      );
    }

    // ==========================================
    // 5. SENTADILLAS HACK / SMITH SQUAT
    // ==========================================
    if (animType === 'hack-squat' || animType === 'smith-squat') {
      const hipY = 80 + t * 45;
      const kneeX = 145 + t * 18;
      const sledShift = t * 40;

      return (
        <svg viewBox="0 0 320 220" className="w-full h-full max-h-72 drop-shadow-lg">
          {/* Rieles y Soporte de hombros */}
          <line x1="60" y1="205" x2="220" y2="25" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />
          <line x1="90" y1="205" x2="250" y2="25" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />
          <rect x={160 - sledShift * 0.6} y={45 + sledShift * 0.7} width="50" height="25" rx="6" fill="#1e3a8a" />

          {/* Atleta en postura de sentadilla */}
          <ellipse cx="145" cy={hipY - 45} rx="10" ry="12" fill="#fb923c" />
          <path d={`M 145 ${hipY - 35} L 135 ${hipY}`} stroke="#1e3a8a" strokeWidth="18" strokeLinecap="round" />
          {/* Cuádriceps bajo carga profunda */}
          <path d={`M 135 ${hipY} L ${kneeX} ${hipY + 35} L 155 200`} fill="none" stroke="#ea580c" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx={(135 + kneeX) / 2} cy={hipY + 18} rx="16" ry="8" fill="#ef4444" opacity={0.7} />

          <text x="180" y="80" fill="#0284c7" fontSize="12" fontWeight="900">
            {Math.round(160 - t * 75)}° Rodilla
          </text>
        </svg>
      );
    }

    // ==========================================
    // 6. CINTA DE CORRER (TREADMILL RUNNING)
    // ==========================================
    if (animType === 'treadmill' || animType === 'stairmaster' || animType === 'cardio') {
      const legCycle = Math.sin((progress / 50) * Math.PI);
      const leg1X = 140 + legCycle * 25;
      const leg2X = 140 - legCycle * 25;
      const armCycle = -legCycle;

      return (
        <svg viewBox="0 0 320 220" className="w-full h-full max-h-72 drop-shadow-lg">
          {/* Chasis de la cinta */}
          <line x1="40" y1="185" x2="260" y2="185" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
          <line x1="70" y1="185" x2="60" y2="105" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <path d="M 60 105 L 105 105" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />

          {/* Atleta corriendo en zancada atlética */}
          <ellipse cx="140" cy="65" rx="10" ry="12" fill="#fb923c" />
          <path d="M 138 77 L 135 125" stroke="#1e3a8a" strokeWidth="16" strokeLinecap="round" />

          {/* Brazos oscilando */}
          <path d={`M 138 90 L ${120 + armCycle * 18} 108 L ${135 + armCycle * 22} 122`} fill="none" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

          {/* Piernas en zancada rápida */}
          <path d={`M 135 125 L ${leg1X} 155 L ${leg1X + 5} 180`} fill="none" stroke="#ea580c" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M 135 125 L ${leg2X} 155 L ${leg2X - 5} 180`} fill="none" stroke="#ea580c" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />

          <text x="180" y="55" fill="#0284c7" fontSize="11" fontWeight="bold">
            Cadencia & Zona Aeróbica
          </text>
        </svg>
      );
    }

    // ==========================================
    // 7. EJERCICIOS DE CASA / CALISTENIA (PUSH-UP, SQUATS, ETC.)
    // ==========================================
    if (animType === 'push-up' || animType === 'diamond-push-up') {
      const bodyY = 75 + t * 35;
      const elbowY = 60 + t * 40;

      return (
        <svg viewBox="0 0 320 200" className="w-full h-full max-h-72 drop-shadow-lg">
          <line x1="30" y1="165" x2="290" y2="165" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
          <line x1="40" y1="165" x2="280" y2="165" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />

          {/* Atleta en plancha / pushup */}
          <ellipse cx="235" cy={bodyY - 6} rx="11" ry="12" fill="#fb923c" />
          {/* Cuerpo en bloque rígido */}
          <path d={`M 65 160 L 215 ${bodyY}`} stroke="#1e3a8a" strokeWidth="18" strokeLinecap="round" />
          {/* Brazos flexionando a 45° */}
          <polyline points={`205,${bodyY + 2} 180,${elbowY} 205,162`} fill="none" stroke="#ea580c" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="198" cy={bodyY + 2} rx="12" ry="7" fill="#ef4444" opacity={0.7} />

          <text x="40" y="40" fill="#0284c7" fontSize="12" fontWeight="bold">
            Flexión con Codos a 45° (Flecha)
          </text>
        </svg>
      );
    }

    // ==========================================
    // DEFAULT: MÁQUINA DE POLEAS / BRAZOS / CORE
    // ==========================================
    const defaultShift = t * 35;
    return (
      <svg viewBox="0 0 320 200" className="w-full h-full max-h-72 drop-shadow-lg">
        <line x1="40" y1="185" x2="280" y2="185" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
        <rect x="50" y="30" width="10" height="155" rx="3" fill="#1e293b" />
        <rect x="260" y="30" width="10" height="155" rx="3" fill="#1e293b" />

        {/* Atleta genérico bien proporcionado */}
        <ellipse cx="160" cy={60 + defaultShift * 0.3} rx="10" ry="12" fill="#fb923c" />
        <path d={`M 160 ${72 + defaultShift * 0.3} L 160 ${130 + defaultShift * 0.3}`} stroke="#1e3a8a" strokeWidth="18" strokeLinecap="round" />
        {/* Piernas */}
        <path d={`M 160 ${130 + defaultShift * 0.3} L 140 180 M 160 ${130 + defaultShift * 0.3} L 180 180`} stroke="#ea580c" strokeWidth="10" strokeLinecap="round" />
        {/* Brazos dinámicos */}
        <polyline points={`160,${85 + defaultShift * 0.3} 190,${85 + defaultShift} 205,${120 + defaultShift}`} fill="none" stroke="#ea580c" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="160" cy={95 + defaultShift * 0.3} r={10 + t * 4} fill="#ef4444" opacity={0.6 + t * 0.4} />

        <text x="185" y="45" fill="#0284c7" fontSize="11" fontWeight="bold">
          Biomecánica & Carga Guiada
        </text>
      </svg>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* HUD SUPERIOR: FASE DINÁMICA & RESPIRACIÓN */}
      <div className="w-full flex items-center justify-between gap-2 px-3 py-2 mb-3 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-3.5 h-3.5 rounded-full animate-ping ${
              isConcentric ? 'bg-emerald-500' : 'bg-blue-500'
            }`}
          />
          <span
            className={`text-xs font-black uppercase tracking-wider ${
              isConcentric ? 'text-emerald-700' : 'text-blue-700'
            }`}
          >
            {isConcentric ? 'Fase Concéntrica (Empuje / Contracción)' : 'Fase Excéntrica (Bajada Controlada)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-200">
          <Wind size={13} className={isConcentric ? 'text-emerald-500' : 'text-blue-500'} />
          <span>{isConcentric ? 'Exhala con fuerza' : 'Inhala llenando caja'}</span>
        </div>
      </div>

      {/* CANVAS DEL MODELO HUMANO REALISTA Y MÁQUINA */}
      <div className="w-full bg-gradient-to-b from-slate-900/5 via-slate-900/10 to-slate-900/5 rounded-3xl p-4 border border-gray-200/60 relative overflow-hidden flex items-center justify-center min-h-[250px]">
        <div className="absolute left-3 top-3 text-[10px] font-black text-gray-400/80 uppercase tracking-widest flex items-center gap-1">
          <Gauge size={12} />
          <span>Simulador Humano & Mecánico Realista</span>
        </div>

        {renderRealisticAnatomy()}

        {/* CONTADOR DE REPETICIÓN */}
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

      {/* BARRA DE TEMPO & CADENCIA */}
      <div className="w-full mt-3 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
          <span>Cadencia: {exercise.tempo || '3-0-1'}</span>
          <span>Ciclo de Repetición: {Math.round(progress)}%</span>
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
