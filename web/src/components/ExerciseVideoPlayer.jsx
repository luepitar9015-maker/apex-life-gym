import React, { useState } from 'react';
import {
  Play,
  Pause,
  Maximize2,
  ExternalLink,
  Volume2,
  VolumeX,
  Compass,
  Video,
  Sparkles,
  Info
} from 'lucide-react';
import ExerciseAnimation from './ExerciseAnimation';

export default function ExerciseVideoPlayer({ exercise, defaultMode = 'VIDEO' }) {
  const [viewMode, setViewMode] = useState(defaultMode); // 'VIDEO' | 'BIOMECHANICS'
  const [isMuted, setIsMuted] = useState(true);

  // ID de YouTube oficial o búsqueda
  const videoId = exercise.youtubeId || 'IZxyjW7MPJQ';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0&playsinline=1`;

  return (
    <div className="w-full flex flex-col items-center">
      {/* SELECTOR DE VISTA: VÍDEO REAL CON PERSONA VS BIOMECÁNICA */}
      <div className="w-full flex items-center justify-between gap-2 p-1.5 mb-3 bg-gray-100/90 rounded-2xl border border-gray-200/70">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('VIDEO')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
              viewMode === 'VIDEO'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Video size={14} />
            <span>🎥 Vídeo Real con Persona en Vivo</span>
          </button>

          <button
            onClick={() => setViewMode('BIOMECHANICS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
              viewMode === 'BIOMECHANICS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Compass size={14} />
            <span>📐 Simulador Biomecánico & HUD</span>
          </button>
        </div>

        {viewMode === 'VIDEO' && (
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-blue-600 px-2 py-1 transition-colors"
            title="Abrir en YouTube"
          >
            <span>Ver en HD</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full bg-slate-950 rounded-3xl overflow-hidden border border-gray-200/80 shadow-md relative min-h-[260px] sm:min-h-[320px] flex items-center justify-center">
        {viewMode === 'VIDEO' ? (
          <div className="w-full h-full relative aspect-video flex items-center justify-center bg-slate-950">
            <iframe
              src={embedUrl}
              title={`Ejecución real de ${exercise.name}`}
              className="w-full h-full absolute inset-0 border-0 rounded-3xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full p-4 bg-white">
            <ExerciseAnimation exercise={exercise} isPlaying={true} />
          </div>
        )}
      </div>

      {/* PIE DE VÍDEO CON INDICADOR DE TÉCNICA */}
      <div className="w-full mt-2.5 flex items-center justify-between text-[11px] text-gray-500 px-2">
        <span className="flex items-center gap-1 font-semibold text-gray-700">
          <Sparkles size={12} className="text-blue-600" />
          <span>Demostración con atleta real: <strong>{exercise.name}</strong></span>
        </span>
        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
          {exercise.location === 'GYM' ? '🏢 Máquina Comercial' : '🏠 Peso Corporal'}
        </span>
      </div>
    </div>
  );
}
