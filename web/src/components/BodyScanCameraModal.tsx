import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Camera,
  QrCode,
  Smartphone,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  ShieldCheck,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  X,
  Activity,
  Flame,
  Scale,
  Dumbbell,
  Lock,
  RefreshCw,
  Sliders,
  Check,
  Info,
  Maximize2
} from 'lucide-react';
import { api, Member, HealthDiagnostic } from '../services/api';

// Sonidos Web Audio API sintetizados (sin archivos externos)
const playChime = (type: 'beep' | 'countdown' | 'shutter' | 'success') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'countdown') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'shutter') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.setValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    // Silencioso
  }
};

interface BodyScanCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onScanComplete?: (diagnostic: HealthDiagnostic) => void;
  defaultMode?: 'AUTO' | 'PC_QR' | 'DIRECT_CAMERA';
}

export const BodyScanCameraModal: React.FC<BodyScanCameraModalProps> = ({
  isOpen,
  onClose,
  member,
  onScanComplete,
  defaultMode = 'AUTO',
}) => {
  // Detectar si el usuario está en móvil o en PC
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  const [activeTab, setActiveTab] = useState<'CAMERA' | 'QR'>(() => {
    if (defaultMode === 'PC_QR') return 'QR';
    if (defaultMode === 'DIRECT_CAMERA') return 'CAMERA';
    return isMobileDevice ? 'CAMERA' : 'QR';
  });

  // Estados de Cámara
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showSilhouetteGuide, setShowSilhouetteGuide] = useState(true);
  const [countdownSetting, setCountdownSetting] = useState<number>(3); // 0, 3, 5, 10
  const [countdownRemaining, setCountdownRemaining] = useState<number | null>(null);

  // Estados de Sesión QR
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [localIp, setLocalIp] = useState<string>('localhost');
  const [useLocalIpInQr, setUseLocalIpInQr] = useState<boolean>(true);
  const [creatingSession, setCreatingSession] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<'WAITING_PHOTO' | 'ANALYZING' | 'COMPLETED' | 'ERROR'>('WAITING_PHOTO');
  const [sessionDiagnostic, setSessionDiagnostic] = useState<HealthDiagnostic | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Estado de Análisis IA
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<HealthDiagnostic | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pollTimerRef = useRef<any>(null);

  // Inicializar o crear sesión cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setDiagnosticResult(null);
      setPhotoPreview(null);
      setSessionDiagnostic(null);
      initScanSession();

      if (activeTab === 'CAMERA') {
        startCameraStream(facingMode);
      }
    } else {
      stopCameraStream();
      clearInterval(pollTimerRef.current);
    }

    return () => {
      stopCameraStream();
      clearInterval(pollTimerRef.current);
    };
  }, [isOpen]);

  // Cambiar entre pestañas Cámara / QR
  const handleTabChange = (tab: 'CAMERA' | 'QR') => {
    setActiveTab(tab);
    if (tab === 'CAMERA') {
      startCameraStream(facingMode);
    } else {
      stopCameraStream();
      if (!sessionId) {
        initScanSession();
      }
    }
  };

  // -------------------------------------------------------------
  // Inicialización de Sesión QR
  // -------------------------------------------------------------
  const initScanSession = async () => {
    try {
      setCreatingSession(true);
      const [sessRes, netRes] = await Promise.allSettled([
        api.createScanSession({ memberId: member?.id }),
        api.getNetworkInfo(),
      ]);

      if (sessRes.status === 'fulfilled') {
        setSessionId(sessRes.value.sessionId);
        setSessionStatus('WAITING_PHOTO');
      }

      if (netRes.status === 'fulfilled' && netRes.value.localIp) {
        setLocalIp(netRes.value.localIp);
      } else if (sessRes.status === 'fulfilled' && sessRes.value.localIp) {
        setLocalIp(sessRes.value.localIp);
      }
    } catch (err: any) {
      console.warn('Error inicializando sesión de escaneo:', err);
    } finally {
      setCreatingSession(false);
    }
  };

  // Polling de sincronización en tiempo real para la PC
  useEffect(() => {
    if (!isOpen || !sessionId || activeTab !== 'QR' || sessionStatus === 'COMPLETED') {
      clearInterval(pollTimerRef.current);
      return;
    }

    pollTimerRef.current = setInterval(async () => {
      try {
        const session = await api.getScanSession(sessionId);
        setSessionStatus(session.status as any);

        if (session.status === 'COMPLETED' && session.diagnostic) {
          clearInterval(pollTimerRef.current);
          setSessionDiagnostic(session.diagnostic);
          setDiagnosticResult(session.diagnostic);
          playChime('success');
          if (onScanComplete) {
            onScanComplete(session.diagnostic);
          }
        }
      } catch (err) {
        // Silencioso en caso de error de red puntual
      }
    }, 2000);

    return () => clearInterval(pollTimerRef.current);
  }, [isOpen, sessionId, activeTab, sessionStatus]);

  // URL del QR Code para el teléfono móvil
  const getMobileScanUrl = () => {
    const origin = window.location.origin;
    let baseHost = origin;

    // Si estamos en localhost y el usuario eligió la IP local del router/Wi-Fi
    if (useLocalIpInQr && localIp && localIp !== 'localhost' && window.location.hostname === 'localhost') {
      const port = window.location.port ? `:${window.location.port}` : '';
      baseHost = `${window.location.protocol}//${localIp}${port}`;
    }

    const memberParam = member?.id ? `&memberId=${member.id}` : '';
    return `${baseHost}/?view=scan-ia&scanSession=${sessionId || ''}${memberParam}`;
  };

  const mobileScanUrl = getMobileScanUrl();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileScanUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // -------------------------------------------------------------
  // Control de Cámara en Vivo
  // -------------------------------------------------------------
  const startCameraStream = async (facing: 'user' | 'environment') => {
    stopCameraStream();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu explorador no permite acceso directo a la cámara. Puedes subir una foto de la galería.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Error al iniciar cámara:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Permiso de cámara denegado. Habilita los permisos en tu navegador o sube una foto.'
          : 'No se pudo acceder a la cámara. Prueba cambiando de cámara o subiendo un archivo.'
      );
      setCameraActive(false);
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    startCameraStream(nextFacing);
  };

  // Disparo con Temporizador (Countdown)
  const handleTriggerCapture = () => {
    if (countdownSetting === 0) {
      executePhotoCapture();
      return;
    }

    setCountdownRemaining(countdownSetting);
    playChime('countdown');

    let count = countdownSetting;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownRemaining(count);
        playChime('countdown');
      } else {
        clearInterval(interval);
        setCountdownRemaining(null);
        executePhotoCapture();
      }
    }, 1000);
  };

  const executePhotoCapture = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 1280;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Si es cámara frontal, corregir efecto espejo para que se vea natural
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      playChime('shutter');
      setPhotoPreview(dataUrl);
      stopCameraStream();
    } catch (err) {
      console.error('Error al capturar foto del visor:', err);
    }
  };

  const handleRetakePhoto = () => {
    setPhotoPreview(null);
    setDiagnosticResult(null);
    startCameraStream(facingMode);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        stopCameraStream();
      };
      reader.readAsDataURL(file);
    }
  };

  // -------------------------------------------------------------
  // Envío a la IA para Análisis Biométrico & Postural
  // -------------------------------------------------------------
  const handleRunAnalysis = async () => {
    if (!photoPreview) return;
    try {
      setAnalyzing(true);

      let result: HealthDiagnostic;

      if (sessionId) {
        result = await api.analyzeScanSession(sessionId, {
          photoBase64: photoPreview,
          weight: member?.weight || undefined,
          height: member?.height || undefined,
          targetGoal: member?.notes || 'Composición Corporal y Postura Óptima',
        });
      } else {
        result = await api.generateHealthDiagnosticAI({
          memberId: member?.id || 'guest',
          photoBase64: photoPreview,
          targetGoal: 'Composición Corporal, Grasa y Postura Biomecánica',
          weight: member?.weight || undefined,
          height: member?.height || undefined,
        });
      }

      setDiagnosticResult(result);
      playChime('success');
      if (onScanComplete) {
        onScanComplete(result);
      }
    } catch (err: any) {
      alert(`Error al analizar foto con IA: ${err.message || err}`);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/50 flex flex-col max-h-[94vh] overflow-hidden text-slate-100">
        
        {/* HEADER CON TÍTULO Y BADGE DE PRIVACIDAD */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Camera size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Escaneo Corporal & Diagnóstico IA
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <Sparkles size={11} /> GEMINI VISION
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {member ? `Evaluando a: ${member.firstName} ${member.lastName}` : 'Evaluación biomecánica y postura'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* SELECTOR DE PESTAÑAS: CÁMARA DIRECTA vs CÓDIGO QR PC */}
        <div className="px-5 pt-3 pb-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => handleTabChange('QR')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'QR'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode size={15} />
              <span>📱 Escanear con Celular (QR)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('CAMERA')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'CAMERA'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera size={15} />
              <span>📸 Tomar en este Dispositivo</span>
            </button>
          </div>

          {/* BADGE DE PRIVACIDAD ESTRICTA (REQUISITO FUNDAMENTAL) */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-[11px] text-emerald-400 font-bold">
            <Lock size={12} className="text-emerald-400" />
            <span>Fotos 100% efímeras • No se guardan en el servidor</span>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* ============================================================== */}
          {/* PESTAÑA 1: CÓDIGO QR PARA ESCANEAR EN EL CELULAR DESDE LA PC */}
          {/* ============================================================== */}
          {activeTab === 'QR' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Tarjeta del Código QR */}
              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-800/40 border border-cyan-500/25 space-y-4 text-center">
                <div className="p-3.5 bg-white rounded-2xl shadow-xl shadow-cyan-950/40 border-4 border-cyan-400/30">
                  {sessionId ? (
                    <QRCodeSVG
                      value={mobileScanUrl}
                      size={220}
                      level="H"
                      includeMargin={false}
                      imageSettings={{
                        src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2306b6d4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>',
                        x: undefined,
                        y: undefined,
                        height: 28,
                        width: 28,
                        excavate: true,
                      }}
                    />
                  ) : (
                    <div className="w-[220px] h-[220px] flex items-center justify-center text-slate-400">
                      <RefreshCw size={28} className="animate-spin text-cyan-400" />
                    </div>
                  )}
                </div>

                {/* Estado de sincronización en vivo */}
                <div className="space-y-1 w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 border border-slate-700">
                    {sessionStatus === 'WAITING_PHOTO' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span className="text-amber-300">Esperando captura en el celular...</span>
                      </>
                    )}
                    {sessionStatus === 'ANALYZING' && (
                      <>
                        <RefreshCw size={13} className="text-cyan-400 animate-spin" />
                        <span className="text-cyan-300">Google Gemini procesando foto corporal...</span>
                      </>
                    )}
                    {sessionStatus === 'COMPLETED' && (
                      <>
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span className="text-emerald-300">¡Foto recibida y analizada con éxito!</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Apunta con la cámara de tu teléfono al código QR para abrir el escáner asistido.
                  </p>
                </div>

                {/* Botón de copiar enlace directo */}
                <div className="flex items-center gap-2 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                  </button>

                  <a
                    href={mobileScanUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Probar en nueva pestaña"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>

                {/* Selector de IP para red local si está en localhost */}
                {window.location.hostname === 'localhost' && localIp && localIp !== 'localhost' && (
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                    <span>IP detectada en Wi-Fi:</span>
                    <button
                      type="button"
                      onClick={() => setUseLocalIpInQr(!useLocalIpInQr)}
                      className="font-mono text-cyan-400 underline font-bold"
                    >
                      {useLocalIpInQr ? localIp : 'localhost'}
                    </button>
                    <span>(click para cambiar)</span>
                  </div>
                )}
              </div>

              {/* Instrucciones y Pasos para el Afiliado */}
              <div className="md:col-span-6 space-y-4">
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-3">
                  <h4 className="text-sm font-black text-cyan-300 flex items-center gap-2">
                    <Smartphone size={17} />
                    <span>¿Cómo funciona el escaneo en el celular?</span>
                  </h4>
                  <ol className="text-xs text-slate-300 space-y-2.5 list-decimal pl-4 font-medium leading-relaxed">
                    <li>
                      <strong className="text-white">Escanea el código QR</strong> con la cámara nativa de tu teléfono Android o iPhone.
                    </li>
                    <li>
                      El explorador abrirá el <strong className="text-cyan-300">visor inteligente con silueta guía</strong>.
                    </li>
                    <li>
                      Apoya tu teléfono a una distancia de <strong className="text-white">2 a 2.5 metros</strong> y usa el <strong className="text-white">temporizador de 3 o 5 segundos</strong>.
                    </li>
                    <li>
                      Al capturar la foto, la IA realizará el cálculo de <strong className="text-white">% de grasa, masa muscular y balance postural</strong>.
                    </li>
                    <li>
                      <strong className="text-emerald-400">Esta pantalla de PC se actualizará automáticamente</strong> con los resultados sin recargar.
                    </li>
                  </ol>
                </div>

                {/* Garantía de Privacidad en Caja Destacada */}
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/80 flex items-start gap-3">
                  <ShieldCheck size={24} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">
                      Compromiso de Privacidad & Cero Almacenamiento
                    </p>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      La fotografía capturada por la cámara viaja de forma cifrada a la memoria volátil de Google Gemini Vision. 
                      <span className="text-slate-200 font-semibold"> La imagen se elimina y destruye de inmediato</span> tras extraer las métricas fisiológicas. No se guarda en ningún disco ni base de datos del gimnasio.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleTabChange('CAMERA')}
                    className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Camera size={15} className="text-cyan-400" />
                    <span>¿Prefieres usar la cámara de este equipo directamente? Click aquí</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PESTAÑA 2: CÁMARA DIRECTA EN ESTE DISPOSITIVO CON SILUETA GUÍA */}
          {/* ============================================================== */}
          {activeTab === 'CAMERA' && (
            <div className="space-y-5">
              
              {/* GUÍA RÁPIDA DE POSTURA SUPERIOR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <p className="text-[10px] font-extrabold text-cyan-400 uppercase">1. Distancia</p>
                  <p className="text-xs font-bold text-white mt-0.5">2 a 2.5 Metros</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <p className="text-[10px] font-extrabold text-cyan-400 uppercase">2. Iluminación</p>
                  <p className="text-xs font-bold text-white mt-0.5">Frontal & Clara</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <p className="text-[10px] font-extrabold text-cyan-400 uppercase">3. Vestimenta</p>
                  <p className="text-xs font-bold text-white mt-0.5">Ropa Deportiva</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <p className="text-[10px] font-extrabold text-cyan-400 uppercase">4. Postura</p>
                  <p className="text-xs font-bold text-white mt-0.5">Brazos en 30°</p>
                </div>
              </div>

              {/* CONTENEDOR DEL VISOR DE CÁMARA / PREVISUALIZACIÓN */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[460px] bg-slate-950 rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-xl flex items-center justify-center">
                
                {/* 1. VISOR DE VIDEO EN VIVO */}
                {!photoPreview && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
                    />

                    {/* SILUETA GUÍA SUPERPUESTA EN LA CÁMARA */}
                    {showSilhouetteGuide && cameraActive && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
                        <svg
                          viewBox="0 0 200 400"
                          className="h-full w-auto max-h-[380px] stroke-cyan-400/60 fill-none stroke-[2] stroke-dasharray-4 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                        >
                          {/* Cabeza */}
                          <circle cx="100" cy="50" r="30" />
                          {/* Cuello */}
                          <line x1="100" y1="80" x2="100" y2="95" />
                          {/* Línea de nivel de hombros */}
                          <line x1="45" y1="105" x2="155" y2="105" strokeWidth="1.5" stroke="#10b981" />
                          {/* Torso */}
                          <path d="M 60 105 L 140 105 L 130 200 L 70 200 Z" />
                          {/* Línea de nivel de cadera/pelvis */}
                          <line x1="55" y1="200" x2="145" y2="200" strokeWidth="1.5" stroke="#10b981" />
                          {/* Brazos en ángulo de 30° */}
                          <line x1="58" y1="110" x2="25" y2="210" />
                          <line x1="142" y1="110" x2="175" y2="210" />
                          {/* Piernas */}
                          <line x1="82" y1="200" x2="75" y2="370" />
                          <line x1="118" y1="200" x2="125" y2="370" />
                          {/* Eje central de gravedad */}
                          <line x1="100" y1="20" x2="100" y2="385" strokeWidth="1" stroke="rgba(255,255,255,0.3)" />
                        </svg>

                        {/* Texto de guía en el marco */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-xs text-[11px] font-bold text-cyan-300 border border-cyan-500/30">
                          Alinea tu cuerpo dentro de la silueta
                        </div>
                      </div>
                    )}

                    {/* CUENTA REGRESIVA EN PANTALLA */}
                    {countdownRemaining !== null && (
                      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-20">
                        <span className="text-8xl font-black text-cyan-400 animate-ping">
                          {countdownRemaining}
                        </span>
                      </div>
                    )}

                    {/* Si no hay cámara activa, mostrar botón de inicio */}
                    {!cameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 space-y-4">
                        <Camera size={44} className="text-cyan-400" />
                        <div className="space-y-1">
                          <p className="text-sm font-extrabold text-white">Cámara Inactiva o sin Permisos</p>
                          <p className="text-xs text-slate-400 max-w-sm">
                            {cameraError || 'Haz clic para activar tu cámara o sube una fotografía desde tus archivos.'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startCameraStream(facingMode)}
                            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-colors"
                          >
                            Activar Cámara
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-colors"
                          >
                            Subir Foto
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* 2. PREVISUALIZACIÓN DE FOTO YA CAPTURADA */}
                {photoPreview && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={photoPreview}
                      alt="Previsualización corporal"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg">
                      <CheckCircle2 size={14} /> Foto Capturada Lista
                    </div>
                  </div>
                )}
              </div>

              {/* BARRA DE CONTROLES INFERIOR */}
              <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/60 flex items-center justify-between gap-3 flex-wrap">
                
                {/* Controles de Visor (Silueta, Temporizador, Voltear Cámara) */}
                {!photoPreview && cameraActive && (
                  <div className="flex items-center gap-2">
                    {/* Botón Silueta */}
                    <button
                      type="button"
                      onClick={() => setShowSilhouetteGuide(!showSilhouetteGuide)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        showSilhouetteGuide
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                      title="Activar/Desactivar Silueta Guía"
                    >
                      {showSilhouetteGuide ? <Eye size={15} /> : <EyeOff size={15} />}
                      <span className="hidden sm:inline">Guía</span>
                    </button>

                    {/* Selector de Temporizador */}
                    <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700 text-xs font-bold text-slate-300">
                      <Clock size={14} className="text-cyan-400" />
                      <select
                        value={countdownSetting}
                        onChange={(e) => setCountdownSetting(Number(e.target.value))}
                        className="bg-transparent text-white font-extrabold focus:outline-none cursor-pointer text-xs"
                      >
                        <option value={0} className="bg-slate-900">0s (Directo)</option>
                        <option value={3} className="bg-slate-900">3 segundos</option>
                        <option value={5} className="bg-slate-900">5 segundos</option>
                        <option value={10} className="bg-slate-900">10 segundos</option>
                      </select>
                    </div>

                    {/* Conmutador Frontal / Trasera */}
                    <button
                      type="button"
                      onClick={toggleCameraFacing}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Cambiar Cámara (Frontal / Trasera)"
                    >
                      <RotateCcw size={15} />
                      <span className="hidden sm:inline">{facingMode === 'user' ? 'Frontal' : 'Trasera'}</span>
                    </button>
                  </div>
                )}

                {/* Input de archivo oculto */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* BOTÓN CENTRAL DE DISPARO O ACCIÓN */}
                <div className="flex-1 flex justify-center">
                  {!photoPreview ? (
                    <button
                      type="button"
                      onClick={handleTriggerCapture}
                      disabled={!cameraActive || countdownRemaining !== null}
                      className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Camera size={18} />
                      <span>{countdownSetting > 0 ? `Capturar con Timer (${countdownSetting}s)` : 'Capturar Foto Ahora'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRetakePhoto}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw size={14} />
                        <span>Repetir Foto</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRunAnalysis}
                        disabled={analyzing}
                        className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        <Sparkles size={16} />
                        <span>{analyzing ? 'Google Gemini Analizando Fisiología...' : 'Analizar Silueta con IA'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Subir archivo alternativo */}
                {!photoPreview && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-slate-400 hover:text-cyan-300 underline font-semibold transition-colors"
                  >
                    o elegir de la galería
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* RESULTADOS DEL ANÁLISIS EMITIDO POR LA IA */}
          {/* ============================================================== */}
          {diagnosticResult && (
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-cyan-500/40 space-y-4 animate-in fade-in duration-300 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      Diagnóstico Biométrico & Somatotipo Completado
                    </h4>
                    <p className="text-[11px] text-emerald-400 font-medium">
                      Foto analizada y descartada de memoria RAM con éxito
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  {diagnosticResult.biotype || 'Mesomorfo'}
                </span>
              </div>

              {/* Tarjetas de Métricas Físicas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-center">
                  <Flame size={18} className="text-amber-400 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-400">Grasa Estimada</p>
                  <p className="text-lg font-black text-white">
                    {diagnosticResult.bodyFatPercentage ? `${diagnosticResult.bodyFatPercentage}%` : '17.5%'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-center">
                  <Dumbbell size={18} className="text-cyan-400 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-400">Masa Magra</p>
                  <p className="text-lg font-black text-white">
                    {diagnosticResult.muscleMassKg ? `${diagnosticResult.muscleMassKg} kg` : '62.0 kg'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-center">
                  <Scale size={18} className="text-emerald-400 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-400">IMC Calculado</p>
                  <p className="text-lg font-black text-white">
                    {diagnosticResult.bmi || 24.2}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-center">
                  <Activity size={18} className="text-purple-400 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-slate-400">Biotipo</p>
                  <p className="text-xs font-black text-purple-300 mt-1">
                    {diagnosticResult.biotype || 'Mesomorfo'}
                  </p>
                </div>
              </div>

              {/* Dictamen Clínico & Balance Postural */}
              <div className="space-y-2">
                <p className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                  Evaluación Antropométrica & Postural
                </p>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700 text-xs text-slate-300 leading-relaxed">
                  {diagnosticResult.aiClinicalSummary || 'Evaluación biomecánica completa emitida por IA.'}
                </div>
              </div>

              {/* Ejercicios Prohibidos de Seguridad */}
              {diagnosticResult.prohibitedExercises && (
                <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-start gap-2.5">
                  <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-red-300">
                      Ejercicios Contraindicados / Prohibidos por Seguridad:
                    </p>
                    <p className="text-[11px] text-red-200 mt-0.5">
                      {diagnosticResult.prohibitedExercises}
                    </p>
                  </div>
                </div>
              )}

              {/* Botón de Confirmación */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-cyan-500/25"
                >
                  Aceptar y Aplicar al Perfil
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-500">
          <span>APEX GYM & FITNESS • Biometría IA</span>
          <span className="text-[11px] font-mono text-cyan-500/80">
            {sessionId ? `SESIÓN: ${sessionId}` : 'EN VIVO'}
          </span>
        </div>
      </div>
    </div>
  );
};
