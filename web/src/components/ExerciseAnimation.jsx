import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export default function ExerciseAnimation({ exercise, isPlaying = true }) {
  const [activePhase, setActivePhase] = useState('excentric'); // 'excentric' (bajada) | 'concentric' (subida)
  const [repCount, setRepCount] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setRepCount((r) => (r >= 12 ? 1 : r + 1));
          setActivePhase('excentric');
          return 0;
        }
        if (prev >= 50 && activePhase !== 'concentric') {
          setActivePhase('concentric');
        }
        return prev + 2.5; // ~4 segundos por ciclo completo
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, activePhase]);

  // Factor de animación 0 a 1 (0 = arriba/inicio, 1 = abajo/flexión máxima)
  const t = Math.sin((progress / 100) * Math.PI);

  const renderSVGAnimation = () => {
    switch (exercise.animationType) {
      // 1. FLEXIONES DE PECHO (PUSH-UP)
      case 'push-up':
      case 'diamond-push-up': {
        const bodyY = 65 + t * 25; // El cuerpo baja hacia el suelo
        const elbowY = 55 + t * 30;
        return (
          <svg viewBox="0 0 240 160" className="w-full h-full max-h-52">
            {/* Suelo */}
            <line x1="20" y1="130" x2="220" y2="130" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
            
            {/* Cuerpo / Tronco */}
            <line x1="60" y1="125" x2="170" y2={bodyY} stroke="#1e3a8a" strokeWidth="14" strokeLinecap="round" />
            
            {/* Cabeza */}
            <circle cx="185" cy={bodyY - 6} r="10" fill="#2563eb" />
            
            {/* Brazos / Codos */}
            <polyline points={`160,${bodyY + 2} 150,${elbowY} 160,128`} fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Pies / Apoyo */}
            <circle cx="58" cy="125" r="5" fill="#64748b" />

            {/* Músculo Activo Resaltado (Pectoral / Tríceps) */}
            <circle cx="155" cy={bodyY + 2} r="8" fill="#ef4444" opacity={0.7 + t * 0.3} className="animate-pulse" />
          </svg>
        );
      }

      // 2. SENTADILLAS AÉREAS (AIR SQUAT) & SMITH SQUAT
      case 'air-squat':
      case 'smith-squat': {
        const hipY = 65 + t * 35; // Cadera baja
        const kneeX = 125 + t * 15;
        const barY = 35 + t * 35;
        return (
          <svg viewBox="0 0 240 180" className="w-full h-full max-h-52">
            {/* Suelo */}
            <line x1="40" y1="160" x2="200" y2="160" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

            {/* Barra Smith (si aplica) */}
            {exercise.animationType === 'smith-squat' && (
              <>
                <line x1="50" y1="10" x2="50" y2="160" stroke="#94a3b8" strokeWidth="3" />
                <line x1="190" y1="10" x2="190" y2="160" stroke="#94a3b8" strokeWidth="3" />
                <line x1="40" y1={barY} x2="200" y2={barY} stroke="#475569" strokeWidth="8" strokeLinecap="round" />
              </>
            )}

            {/* Cabeza */}
            <circle cx="120" cy={barY - 8} r="10" fill="#2563eb" />

            {/* Torso */}
            <line x1="120" y1={barY} x2="110" y2={hipY} stroke="#1e3a8a" strokeWidth="14" strokeLinecap="round" />

            {/* Piernas: Cadera -> Rodilla -> Pie */}
            <polyline points={`110,${hipY} ${kneeX},${hipY + 30} 115,158`} fill="none" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />

            {/* Músculo Activo (Cuádriceps y Glúteo) */}
            <circle cx={kneeX - 8} cy={hipY + 15} r="9" fill="#ef4444" opacity={0.6 + t * 0.4} />
            <circle cx="105" cy={hipY} r="8" fill="#10b981" opacity={0.6 + t * 0.4} />
          </svg>
        );
      }

      // 3. PRENSA DE PIERNAS 45° (LEG PRESS MACHINE)
      case 'leg-press': {
        const sledDist = t * 35; // Distancia de la plataforma que baja
        const platX = 145 - sledDist * 0.7;
        const platY = 60 + sledDist * 0.7;
        return (
          <svg viewBox="0 0 240 180" className="w-full h-full max-h-52">
            {/* Rieles de la prensa 45° */}
            <line x1="60" y1="160" x2="190" y2="30" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

            {/* Asiento y respaldo fijo del deportista */}
            <rect x="50" y="110" width="45" height="15" rx="4" fill="#334155" />
            <line x1="60" y1="120" x2="35" y2="70" stroke="#334155" strokeWidth="14" strokeLinecap="round" />

            {/* Persona sentada: Torso y Cabeza */}
            <line x1="65" y1="115" x2="42" y2="75" stroke="#1e3a8a" strokeWidth="12" strokeLinecap="round" />
            <circle cx="36" cy="60" r="10" fill="#2563eb" />

            {/* Plataforma deslizante con pesas */}
            <rect x={platX} y={platY} width="12" height="35" rx="3" fill="#ef4444" transform={`rotate(-45 ${platX} ${platY})`} />
            <circle cx={platX + 15} cy={platY - 5} r="14" fill="#64748b" stroke="#0f172a" strokeWidth="3" />

            {/* Piernas empujando la plataforma */}
            <polyline
              points={`68,110 ${95 - sledDist * 0.3},${125 - sledDist * 0.6} ${platX},${platY + 15}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      }

      // 4. JALÓN AL PECHO (LAT PULLDOWN)
      case 'lat-pulldown': {
        const barY = 35 + t * 45; // Barra baja al pecho
        return (
          <svg viewBox="0 0 240 180" className="w-full h-full max-h-52">
            {/* Torre y Cable */}
            <line x1="120" y1="10" x2="120" y2={barY} stroke="#64748b" strokeWidth="3" />
            <circle cx="120" cy="15" r="7" fill="#334155" />

            {/* Barra ancha */}
            <line x1="50" y1={barY} x2="190" y2={barY} stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />

            {/* Asiento de la máquina */}
            <rect x="95" y="130" width="50" height="12" rx="3" fill="#475569" />
            <rect x="110" y="100" width="20" height="10" rx="3" fill="#64748b" /> {/* Rodillos muslos */}

            {/* Persona: Torso y Cabeza */}
            <circle cx="120" cy="72" r="10" fill="#2563eb" />
            <line x1="120" y1="82" x2="120" y2="132" stroke="#1e3a8a" strokeWidth="14" strokeLinecap="round" />

            {/* Brazos hacia la barra */}
            <polyline points={`120,85 85,${barY + 15} 65,${barY}`} fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={`120,85 155,${barY + 15} 175,${barY}`} fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

            {/* Músculo Activo (Dorsales en expansión/contracción) */}
            <path d={`M 112,90 Q ${100 - t * 10} 110 115,125`} stroke="#ef4444" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d={`M 128,90 Q ${140 + t * 10} 110 125,125`} stroke="#ef4444" strokeWidth="6" fill="none" strokeLinecap="round" />
          </svg>
        );
      }

      // 5. EXTENSIÓN DE CUÁDRICEPS EN MÁQUINA
      case 'leg-extension': {
        const rotAngle = -t * 80; // Rodillo rota hacia arriba
        return (
          <svg viewBox="0 0 240 180" className="w-full h-full max-h-52">
            {/* Sillón de la máquina */}
            <rect x="60" y="100" width="55" height="16" rx="4" fill="#334155" />
            <line x1="65" y1="105" x2="45" y2="55" stroke="#334155" strokeWidth="14" strokeLinecap="round" />

            {/* Persona */}
            <line x1="70" y1="102" x2="52" y2="60" stroke="#1e3a8a" strokeWidth="12" strokeLinecap="round" />
            <circle cx="48" cy="46" r="10" fill="#2563eb" />

            {/* Muslo horizontal apoyado */}
            <line x1="72" y1="104" x2="120" y2="104" stroke="#1e3a8a" strokeWidth="14" strokeLinecap="round" />

            {/* Eje de giro de la máquina */}
            <circle cx="120" cy="104" r="7" fill="#ef4444" />

            {/* Pierna inferior girando con el rodillo acolchado */}
            <g transform={`rotate(${rotAngle} 120 104)`}>
              <line x1="120" y1="104" x2="120" y2="155" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
              <circle cx="120" cy="150" r="10" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" />
            </g>

            {/* Cuádriceps activo */}
            <circle cx="95" cy="98" r="8" fill="#ef4444" opacity={0.6 + t * 0.4} />
          </svg>
        );
      }

      // 6. CURL FEMORAL
      case 'leg-curl': {
        const rotAngle = t * 85; // Rodillo rota hacia los glúteos
        return (
          <svg viewBox="0 0 240 180" className="w-full h-full max-h-52">
            {/* Banco tumbado */}
            <line x1="50" y1="110" x2="180" y2="110" stroke="#334155" strokeWidth="12" strokeLinecap="round" />

            {/* Torso boca abajo */}
            <line x1="65" y1="102" x2="140" y2="102" stroke="#1e3a8a" strokeWidth="14" strokeLinecap="round" />
            <circle cx="50" cy="100" r="10" fill="#2563eb" />

            {/* Eje rodilla */}
            <circle cx="140" cy="102" r="7" fill="#ef4444" />

            {/* Pierna flexionando hacia arriba */}
            <g transform={`rotate(${-rotAngle} 140 102)`}>
              <line x1="140" y1="102" x2="190" y2="102" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
              <circle cx="185" cy="102" r="10" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" />
            </g>
          </svg>
        );
      }

      // 7. PRESS DE PECHO EN MÁQUINA
      case 'chest-press': {
        const pressX = 135 + (1 - t) * 35; // Brazos empujan hacia adelante
        return (
          <svg viewBox="0 0 240 180" className="w-full h-full max-h-52">
            {/* Asiento y respaldo vertical */}
            <rect x="70" y="125" width="45" height="15" rx="4" fill="#334155" />
            <line x1="80" y1="130" x2="80" y2="55" stroke="#334155" strokeWidth="14" strokeLinecap="round" />

            {/* Persona */}
            <line x1="85" y1="128" x2="85" y2="65" stroke="#1e3a8a" strokeWidth="14" strokeLinecap="round" />
            <circle cx="85" cy="50" r="10" fill="#2563eb" />

            {/* Brazo empujando manillar */}
            <polyline points={`90,80 115,${95 - t * 15} ${pressX},80`} fill="none" stroke="#f59e0b" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            <rect x={pressX - 3} y="65" width="8" height="30" rx="3" fill="#ef4444" />
          </svg>
        );
      }

      // 8. FONDOS DE TRÍCEPS EN SILLA (CHAIR DIPS)
      case 'chair-dips': {
        const dipY = 80 + t * 30; // Cadera baja cerca de la silla
        return (
          <svg viewBox="0 0 240 180" className="w-full h-full max-h-52">
            {/* Suelo */}
            <line x1="20" y1="160" x2="220" y2="160" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

            {/* Silla */}
            <rect x="50" y="100" width="35" height="10" fill="#64748b" rx="2" />
            <line x1="55" y1="105" x2="55" y2="160" stroke="#475569" strokeWidth="6" />
            <line x1="80" y1="105" x2="80" y2="160" stroke="#475569" strokeWidth="6" />
            <line x1="55" y1="100" x2="55" y2="60" stroke="#475569" strokeWidth="6" strokeLinecap="round" />

            {/* Brazos apoyados en el borde de la silla */}
            <polyline points={`80,100 85,${dipY - 10} 100,${dipY + 5}`} fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

            {/* Torso */}
            <circle cx="102" cy={dipY - 14} r="10" fill="#2563eb" />
            <line x1="102" y1={dipY - 4} x2="102" y2={dipY + 35} stroke="#1e3a8a" strokeWidth="14" strokeLinecap="round" />

            {/* Piernas adelantadas */}
            <polyline points={`102,${dipY + 35} 145,135 175,158`} fill="none" stroke="#334155" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

            {/* Tríceps activo */}
            <circle cx="85" cy={dipY - 5} r="7" fill="#ef4444" />
          </svg>
        );
      }

      // 9. PLANCHA ABDOMINAL ISOMÉTRICA
      case 'plank': {
        const pulseCore = Math.sin(progress * 0.2) * 2;
        return (
          <svg viewBox="0 0 240 160" className="w-full h-full max-h-52">
            <line x1="20" y1="130" x2="220" y2="130" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

            {/* Cuerpo en línea recta perfecta */}
            <line x1="60" y1="120" x2="165" y2="95" stroke="#1e3a8a" strokeWidth="14" strokeLinecap="round" />
            <circle cx="180" cy="88" r="10" fill="#2563eb" />

            {/* Antebrazo apoyado a 90° */}
            <polyline points="160,98 160,128 175,128" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

            {/* Puntas de los pies */}
            <circle cx="58" cy="125" r="5" fill="#64748b" />

            {/* Aura de tensión abdominal / Core */}
            <ellipse cx="120" cy={108 + pulseCore} rx="25" ry="8" fill="#ef4444" opacity="0.6" className="animate-pulse" />
          </svg>
        );
      }

      // Default: Gráfico biomecánico dinámico multiuso
      default: {
        const move = t * 25;
        return (
          <svg viewBox="0 0 240 160" className="w-full h-full max-h-52">
            <line x1="20" y1="140" x2="220" y2="140" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
            <circle cx="120" cy={55 + move} r="14" fill="#2563eb" />
            <line x1="120" y1={70 + move} x2="120" y2={115 + move} stroke="#1e3a8a" strokeWidth="14" strokeLinecap="round" />
            <polyline points={`120,${85 + move} ${90 - move * 0.4},${95 + move} 80,120`} fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
            <polyline points={`120,${85 + move} ${150 + move * 0.4},${95 + move} 160,120`} fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
            <circle cx="120" cy={90 + move} r="8" fill="#ef4444" />
          </svg>
        );
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
      {/* Contenedor del Gráfico Animado */}
      <div className="relative bg-gradient-to-b from-blue-50/50 to-gray-50/70 rounded-2xl p-4 flex flex-col items-center justify-center border border-blue-100/60 overflow-hidden min-h-[220px]">
        {/* Badge de Fase Biomecánica */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
            activePhase === 'concentric'
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${activePhase === 'concentric' ? 'bg-amber-500 animate-ping' : 'bg-blue-600'}`} />
            {activePhase === 'concentric' ? 'Fase Concéntrica (Empuje/Subida)' : 'Fase Excéntrica (Descenso Controlado)'}
          </span>
        </div>

        {/* Contador de Repeticiones de la Animación */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-gray-200 text-xs font-black text-blue-950 shadow-xs">
          Rep {repCount} / 12
        </div>

        {/* Gráfico SVG Biomecánico */}
        {renderSVGAnimation()}

        {/* Barra de Ritmo de Cadencia */}
        <div className="w-full max-w-xs mt-2">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
            <span>Ritmo Biomecánico</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Ficha Anatómica Rápida */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-red-50/70 p-2.5 rounded-xl border border-red-100">
          <p className="text-[10px] font-extrabold uppercase text-red-700 tracking-wider">Músculo Principal</p>
          <p className="font-bold text-gray-900 mt-0.5">{exercise.primaryMuscle}</p>
        </div>
        <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
          <p className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">Estabilizadores</p>
          <p className="font-bold text-gray-900 mt-0.5">{exercise.secondaryMuscle}</p>
        </div>
      </div>
    </div>
  );
}
