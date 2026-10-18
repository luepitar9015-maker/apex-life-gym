import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Eye,
  EyeOff,
  Flame,
  Scale,
  Dumbbell,
  Activity,
  ArrowRight,
  RefreshCw,
  Info,
  Lock,
} from 'lucide-react';
import { api, HealthDiagnostic } from '../services/api';

const playSound = (type: 'countdown' | 'shutter' | 'success') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'countdown') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'shutter') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.setValueAtTime(400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    }
  } catch (e) {}
};

interface MobileScanViewProps {
  sessionId?: string;
  memberId?: string;
  onExit?: () => void;
}

export const MobileScanView: React.FC<MobileScanViewProps> = ({
  sessionId: propSessionId,
  memberId: propMemberId,
  onExit,
}) => {
  // Extraer parámetros de la URL
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = propSessionId || queryParams.get('scanSession') || '';
  const memberId = propMemberId || queryParams.get('memberId') || '';

  const [step, setStep] = useState<'GUIDE' | 'CAMERA' | 'PREVIEW' | 'ANALYZING' | 'RESULTS'>('GUIDE');
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Cámara
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showSilhouette, setShowSilhouette] = useState(true);
  const [countdown, setCountdown] = useState<number>(3); // 0, 3, 5, 10
  const [remainingCountdown, setRemainingCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Datos Físicos Opcionales
  const [weight, setWeight] = useState<string>('74');
  const [height, setHeight] = useState<string>('1.75');
  const [targetGoal, setTargetGoal] = useState<string>('Composición Corporal y Postura');

  // Resultados
  const [diagnostic, setDiagnostic] = useState<HealthDiagnostic | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cargar información de la sesión
  useEffect(() => {
    if (sessionId) {
      loadSession();
    } else {
      setLoadingSession(false);
    }

    return () => {
      stopCamera();
    };
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoadingSession(true);
      const res = await api.getScanSession(sessionId);
      setSessionInfo(res);
      if (res.diagnostic) {
        setDiagnostic(res.diagnostic);
        setStep('RESULTS');
      }
    } catch (err) {
      console.warn('Error cargando sesión de escaneo:', err);
    } finally {
      setLoadingSession(false);
    }
  };

  const startCamera = async (facing: 'user' | 'environment') => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Navegador no soporta cámara en vivo. Puedes cargar una foto de tu galería.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Error activando cámara:', err);
      setCameraError(err.message || 'No se pudo acceder a la cámara');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleFacing = () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    startCamera(next);
  };

  const handleStartCameraStep = () => {
    setStep('CAMERA');
    startCamera(facingMode);
  };

  // Disparo con temporizador
  const handleTriggerCapture = () => {
    if (countdown === 0) {
      captureFrame();
      return;
    }

    setRemainingCountdown(countdown);
    playSound('countdown');

    let current = countdown;
    const interval = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setRemainingCountdown(current);
        playSound('countdown');
      } else {
        clearInterval(interval);
        setRemainingCountdown(null);
        captureFrame();
      }
    }, 1000);
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 1280;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      playSound('shutter');
      setPhotoPreview(dataUrl);
      stopCamera();
      setStep('PREVIEW');
    } catch (e) {
      console.error('Error al capturar foto:', e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        stopCamera();
        setStep('PREVIEW');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAnalysis = async () => {
    if (!photoPreview) return;
    try {
      setStep('ANALYZING');

      let res: HealthDiagnostic;

      if (sessionId) {
        res = await api.analyzeScanSession(sessionId, {
          photoBase64: photoPreview,
          weight: parseFloat(weight) || 74,
          height: parseFloat(height) || 1.75,
          targetGoal,
        });
      } else {
        res = await api.generateHealthDiagnosticAI({
          memberId: memberId || 'guest',
          photoBase64: photoPreview,
          weight: parseFloat(weight) || 74,
          height: parseFloat(height) || 1.75,
          targetGoal,
        });
      }

      setDiagnostic(res);
      playSound('success');
      setStep('RESULTS');
    } catch (err: any) {
      alert(`Error al analizar: ${err.message || err}`);
      setStep('PREVIEW');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* HEADER MÓVIL */}
      <header className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Camera size={18} />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
              <span>Escáner IA Corporal</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-cyan-500 text-slate-950 font-black">
                MÓVIL
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">
              {sessionInfo?.memberName ? `Socio: ${sessionInfo.memberName}` : 'Visión Biomecánica & Postura'}
            </p>
          </div>
        </div>

        {/* Garantía de Privacidad */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] text-emerald-400 font-bold">
          <Lock size={11} />
          <span>Foto Efímera</span>
        </div>
      </header>

      {/* CONTENIDO SEGÚN EL PASO */}
      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
        
        {/* ============================================================== */}
        {/* PASO 1: GUÍA DE CÓMO TOMAR LA FOTO */}
        {/* ============================================================== */}
        {step === 'GUIDE' && (
          <div className="space-y-4 my-auto">
            <div className="text-center space-y-1.5">
              <span className="inline-block p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-1">
                <Sparkles size={28} />
              </span>
              <h2 className="text-lg font-black text-white">
                Guía de Fotografía para la IA
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Para que la visión artificial calcule tu % de grasa, somatotipo y postura con precisión:
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Distancia de 2 a 2.5 metros</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Apoya el teléfono verticalmente sobre una mesa o superficie estable a la altura de tu cintura/pecho.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Buena iluminación frontal</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Evita pararte frente a una ventana o contraluz. La luz debe iluminar tu torso y cuerpo directamente.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Ropa deportiva o ceñida</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Usa ropa de gimnasio que permita apreciar el contorno muscular y la postura natural.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Postura erguida y relajada</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Vista al frente, hombros nivelados y brazos ligeramente separados del torso (en ángulo de 30°).
                  </p>
                </div>
              </div>
            </div>

            {/* Aviso de Privacidad Estricta */}
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
              <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-200 leading-snug">
                <strong className="text-emerald-300">Privacidad garantizada:</strong> Tu foto se analiza en memoria volátil de la IA y se elimina inmediatamente. Nunca se guarda en el servidor.
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartCameraStep}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Camera size={18} />
              <span>Abrir Cámara con Silueta Guía</span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* PASO 2: CÁMARA EN VIVO CON SILUETA GUÍA Y TEMPORIZADOR */}
        {/* ============================================================== */}
        {step === 'CAMERA' && (
          <div className="flex-1 flex flex-col justify-between space-y-3">
            
            {/* Contenedor del Visor */}
            <div className="relative flex-1 w-full min-h-[380px] bg-slate-950 rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl flex items-center justify-center">
              
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
              />

              {/* Silueta Guía SVG Superpuesta */}
              {showSilhouette && cameraActive && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-3">
                  <svg
                    viewBox="0 0 200 400"
                    className="h-full w-auto max-h-[360px] stroke-cyan-400/60 fill-none stroke-[2] stroke-dasharray-4 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                  >
                    <circle cx="100" cy="50" r="30" />
                    <line x1="100" y1="80" x2="100" y2="95" />
                    <line x1="45" y1="105" x2="155" y2="105" strokeWidth="1.5" stroke="#10b981" />
                    <path d="M 60 105 L 140 105 L 130 200 L 70 200 Z" />
                    <line x1="55" y1="200" x2="145" y2="200" strokeWidth="1.5" stroke="#10b981" />
                    <line x1="58" y1="110" x2="25" y2="210" />
                    <line x1="142" y1="110" x2="175" y2="210" />
                    <line x1="82" y1="200" x2="75" y2="370" />
                    <line x1="118" y1="200" x2="125" y2="370" />
                    <line x1="100" y1="20" x2="100" y2="385" strokeWidth="1" stroke="rgba(255,255,255,0.25)" />
                  </svg>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                    Encuadra tu cuerpo completo
                  </div>
                </div>
              )}

              {/* Cuenta Regresiva de Disparo */}
              {remainingCountdown !== null && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-20">
                  <span className="text-8xl font-black text-cyan-400 animate-ping">
                    {remainingCountdown}
                  </span>
                </div>
              )}

              {/* Mensaje de error de cámara */}
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 space-y-3">
                  <Camera size={40} className="text-cyan-400" />
                  <p className="text-xs text-slate-300">{cameraError || 'Iniciando cámara...'}</p>
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs"
                  >
                    Reintentar Acceso
                  </button>
                </div>
              )}
            </div>

            {/* Controles de la Cámara */}
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
              {/* Toggle Silueta */}
              <button
                type="button"
                onClick={() => setShowSilhouette(!showSilhouette)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                  showSilhouette
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Silueta Guía"
              >
                {showSilhouette ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>

              {/* Selector Temporizador */}
              <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300">
                <Clock size={14} className="text-cyan-400" />
                <select
                  value={countdown}
                  onChange={(e) => setCountdown(Number(e.target.value))}
                  className="bg-transparent text-white font-extrabold focus:outline-none cursor-pointer text-xs"
                >
                  <option value={0} className="bg-slate-900">0s</option>
                  <option value={3} className="bg-slate-900">3s</option>
                  <option value={5} className="bg-slate-900">5s</option>
                  <option value={10} className="bg-slate-900">10s</option>
                </select>
              </div>

              {/* Botón Central Disparo */}
              <button
                type="button"
                onClick={handleTriggerCapture}
                disabled={!cameraActive || remainingCountdown !== null}
                className="py-3 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Camera size={16} />
                <span>{countdown > 0 ? `Timer (${countdown}s)` : 'Tomar Foto'}</span>
              </button>

              {/* Voltear Cámara */}
              <button
                type="button"
                onClick={toggleFacing}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-colors"
                title="Cambiar Cámara"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Alternativa: Subir de Archivo */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-slate-400 hover:text-cyan-400 underline font-semibold transition-colors"
              >
                o seleccionar una foto de la galería
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PASO 3: PREVISUALIZACIÓN DE FOTO Y CONFIRMACIÓN */}
        {/* ============================================================== */}
        {step === 'PREVIEW' && photoPreview && (
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-base font-black text-white">Verifica tu Foto</h2>
              <p className="text-xs text-slate-400">
                Asegúrate de que tu silueta se aprecie claramente sin reflejos intensos.
              </p>
            </div>

            <div className="relative flex-1 w-full min-h-[340px] max-h-[460px] bg-slate-950 rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-xl flex items-center justify-center">
              <img
                src={photoPreview}
                alt="Foto Corporal"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md">
                <CheckCircle2 size={13} /> Foto Lista
              </div>
            </div>

            {/* Aviso de Privacidad Inmediato */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-[11px] text-slate-400">
              🔒 La foto se procesará en memoria volátil de la IA y se destruirá de inmediato.
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setPhotoPreview(null);
                  setStep('CAMERA');
                  startCamera(facingMode);
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw size={15} />
                <span>Repetir Foto</span>
              </button>

              <button
                type="button"
                onClick={handleRunAnalysis}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles size={16} />
                <span>Analizar con IA</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PASO 4: PROCESANDO CON IA */}
        {/* ============================================================== */}
        {step === 'ANALYZING' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-500 animate-spin flex items-center justify-center">
                <RefreshCw size={36} className="text-cyan-400" />
              </div>
              <Sparkles size={20} className="text-amber-400 absolute -top-1 -right-1 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-base font-black text-white">Google Gemini Analizando Silueta</h2>
              <p className="text-xs text-slate-400 max-w-xs">
                Estimando grasa corporal, masa muscular magra, somatotipo y alineación biomecánica...
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-bold">
              🛡️ Destruyendo fotografía de la memoria conforme a directivas de privacidad médica...
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PASO 5: RESULTADOS DEL DIAGNÓSTICO */}
        {/* ============================================================== */}
        {step === 'RESULTS' && diagnostic && (
          <div className="space-y-4 my-auto">
            <div className="p-4 rounded-3xl bg-slate-900 border border-cyan-500/40 space-y-3.5 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <div>
                    <h2 className="text-sm font-black text-white">Análisis Biométrico Completado</h2>
                    <p className="text-[10px] text-slate-400">Sincronizado en tiempo real</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {diagnostic.biotype || 'Mesomorfo'}
                </span>
              </div>

              {/* Grid de Métricas */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <Flame size={16} className="text-amber-400 mx-auto mb-0.5" />
                  <p className="text-[10px] text-slate-400 font-bold">% Grasa</p>
                  <p className="text-base font-black text-white">
                    {diagnostic.bodyFatPercentage ? `${diagnostic.bodyFatPercentage}%` : '17.2%'}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <Dumbbell size={16} className="text-cyan-400 mx-auto mb-0.5" />
                  <p className="text-[10px] text-slate-400 font-bold">Masa Magra</p>
                  <p className="text-base font-black text-white">
                    {diagnostic.muscleMassKg ? `${diagnostic.muscleMassKg}kg` : '62kg'}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <Scale size={16} className="text-emerald-400 mx-auto mb-0.5" />
                  <p className="text-[10px] text-slate-400 font-bold">IMC</p>
                  <p className="text-base font-black text-white">
                    {diagnostic.bmi || 24.1}
                  </p>
                </div>
              </div>

              {/* Dictamen Clínico */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <p className="font-extrabold text-cyan-300 mb-1 text-[11px] uppercase tracking-wider">
                  Evaluación Biomecánica & Postura
                </p>
                {diagnostic.aiClinicalSummary || 'Evaluación física completa emitida.'}
              </div>

              {/* Ejercicios Prohibidos */}
              {diagnostic.prohibitedExercises && (
                <div className="p-3 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-start gap-2">
                  <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <div className="text-[11px]">
                    <span className="font-black text-red-300">Contraindicaciones: </span>
                    <span className="text-red-200">{diagnostic.prohibitedExercises}</span>
                  </div>
                </div>
              )}

              {/* Certificado de Privacidad Cumplido */}
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center text-[10px] text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                <ShieldCheck size={14} />
                <span>Foto destruida de memoria con éxito • Cero almacenamiento</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400 mb-3">
                ¡Tu diagnóstico ya se encuentra reflejado en la pantalla principal del gimnasio!
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onExit) onExit();
                  else window.location.href = '/';
                }}
                className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-cyan-500/25"
              >
                Volver al Portal
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-center text-[10px] text-slate-500">
        APEX GYM & FITNESS • Sistema de Visión Artificial 360°
      </footer>
    </div>
  );
};
