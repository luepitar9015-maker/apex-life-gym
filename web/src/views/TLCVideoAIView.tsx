import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Calendar,
  Share2,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  Layers,
  Wand2,
  Download,
  Upload,
  Plus,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Award,
  Zap,
  Check,
  Film,
  Music,
  Mic,
  Type,
  Maximize2,
  Sliders,
  ExternalLink,
  ChevronRight,
  Flame,
  Globe
} from 'lucide-react';
import {
  generateTLCVideoAI,
  chatEditTLCVideo,
  fetchTLCSocialCalendar,
  scheduleTLCSocialPost,
  publishTLCSocialNow,
  TLCVideoProject,
  TLCSocialPost,
  AuthUser
} from '../services/api.js';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';

interface TLCVideoAIViewProps {
  user: AuthUser | null;
  currentTheme?: ColorTheme;
  referralCode?: string;
}

export const TLCVideoAIView: React.FC<TLCVideoAIViewProps> = ({
  user,
  currentTheme = getSavedTheme(),
  referralCode: initialRefCode,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'calendar' | 'social' | 'analytics'>('editor');

  // Estado del proyecto de video
  const [currentProject, setCurrentProject] = useState<TLCVideoProject | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Parámetros de generación inicial
  const [selectedProduct, setSelectedProduct] = useState('Iaso Tea Instantáneo con CBD');
  const [selectedObjective, setSelectedObjective] = useState('VENTA_DIRECTA');
  const [selectedFormat, setSelectedFormat] = useState<'TIKTOK_9_16' | 'FEED_4_5'>('TIKTOK_9_16');
  const [selectedDuration, setSelectedDuration] = useState(15);

  // Reproductor de video interactivo
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // Chat asistente conversacional IA
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: '👋 ¡Hola! Soy tu Copiloto de Video Marketing IA para Total Life Changes. Selecciona un producto o dime cómo quieres adaptar tu video (ej. "Hazlo más elegante", "Crea una versión agresiva de venta para TikTok").',
      time: '10:00 AM',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);

  // Calendario y redes sociales
  const [calendarPosts, setCalendarPosts] = useState<TLCSocialPost[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishSuccessModal, setPublishSuccessModal] = useState<any | null>(null);

  // Modal para agendar publicación
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    platform: 'TIKTOK' as 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE',
    date: '2026-09-24',
    time: '20:00',
  });

  const affiliateSlug = (user?.firstName && user?.lastName)
    ? `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`
    : (initialRefCode || 'elena-morales');
  const affiliateName = user ? `${user.firstName} ${user.lastName}` : 'Elena Morales (Director Nacional)';

  useEffect(() => {
    // Generar proyecto inicial por defecto
    handleGenerateVideo();
    loadCalendar();
  }, []);

  // Temporizador de reproducción en el visor
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && currentProject) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.5;
          if (next >= currentProject.durationSeconds) {
            return 0; // Bucle continuo
          }
          return next;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentProject]);

  // Actualizar escena activa según currentTime
  useEffect(() => {
    if (!currentProject || !currentProject.scenes) return;
    const idx = currentProject.scenes.findIndex(
      (s) => currentTime >= s.startSec && currentTime < s.endSec
    );
    if (idx !== -1) {
      setCurrentSceneIndex(idx);
    }
  }, [currentTime, currentProject]);

  const loadCalendar = async () => {
    const data = await fetchTLCSocialCalendar();
    setCalendarPosts(data);
  };

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    setGenerationStep('🔍 Analizando producto oficial TLC...');
    
    setTimeout(() => setGenerationStep('🎯 Extrayendo ganchos virales de 3 segundos...'), 600);
    setTimeout(() => setGenerationStep('🎙️ Generando locución en off en español neutro...'), 1200);
    setTimeout(() => setGenerationStep('✨ Sincronizando subtítulos de neón con timeline...'), 1800);

    const project = await generateTLCVideoAI({
      productName: selectedProduct,
      objective: selectedObjective,
      format: selectedFormat,
      durationSeconds: selectedDuration,
      affiliateName,
      affiliateSlug,
    });

    setTimeout(() => {
      setCurrentProject(project);
      setIsGenerating(false);
      setCurrentTime(0);
      setIsPlaying(true);
    }, 2200);
  };

  const handleSendChatPrompt = async (presetText?: string) => {
    const query = presetText || inputPrompt;
    if (!query.trim() || !currentProject) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsAiReplying(true);

    const res = await chatEditTLCVideo(query, currentProject);

    setIsAiReplying(false);
    if (res) {
      const aiMsg = {
        sender: 'ai' as const,
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      if (res.updatedProject) {
        setCurrentProject(res.updatedProject);
      }
    }
  };

  const handlePublishNow = async (platforms: string[]) => {
    setIsPublishing(true);
    setPublishProgress(15);

    const interval = setInterval(() => {
      setPublishProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 25;
      });
    }, 300);

    const res = await publishTLCSocialNow(platforms, currentProject);

    clearInterval(interval);
    setPublishProgress(100);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishProgress(0);
      setPublishSuccessModal(res);
    }, 500);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    const scheduledDate = `${scheduleForm.date}T${scheduleForm.time}:00.000Z`;
    const newPost = await scheduleTLCSocialPost({
      title: scheduleForm.title || currentProject.title,
      platform: scheduleForm.platform,
      format: currentProject.format,
      scheduledFor: scheduledDate,
      productName: currentProject.productName,
      affiliateSlug,
      copyText: currentProject.copySuggestion.body,
      hashtags: currentProject.copySuggestion.hashtags,
      videoThumbnail: currentProject.scenes[0]?.brollUrl,
    });

    setCalendarPosts([newPost as TLCSocialPost, ...calendarPosts]);
    setIsScheduleModalOpen(false);
    alert(`¡Publicación programada exitosamente en ${scheduleForm.platform} para el ${scheduleForm.date} a las ${scheduleForm.time}!`);
  };

  const activeScene = currentProject?.scenes[currentSceneIndex] || currentProject?.scenes[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------- */}
      {/* HERO BANNER ESTILO NEXO: MOTOR DE CONTENIDO & VIDEO IA TLC     */}
      {/* ------------------------------------------------------------- */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '1.8rem',
        background: `linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)`,
        border: `1.5px solid ${currentTheme.primary}`,
        boxShadow: `0 12px 36px -10px ${currentTheme.primaryGlow}`,
        overflow: 'hidden',
      }}>
        {/* Marca de agua de fondo tecnológica */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          right: '18px',
          fontSize: '5.2rem',
          fontWeight: 900,
          color: currentTheme.primary,
          opacity: 0.08,
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '-0.04em',
        }}>
          TLC-AI-STUDIO
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: currentTheme.primary,
                background: currentTheme.accentBg,
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                border: `1px solid ${currentTheme.primary}`,
              }}>
                <Wand2 size={12} />
                NEW MARKET AI CONTENT ENGINE • TOTAL LIFE CHANGES
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.15)',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
              }}>
                <Flame size={12} />
                AUTÓNOMO 24/7
              </span>
            </div>

            <h1 style={{ fontSize: '1.95rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', margin: '0 0 0.4rem 0' }}>
              Estudio de Video Marketing IA & <span style={{ color: currentTheme.primary }}>Publicación Automática</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              Crea videos virales para TikTok, Reels y Shorts con guiones de persuasión para TLC. El motor incrusta tu enlace de afiliado (<code style={{ color: currentTheme.primary }}>ref={affiliateSlug}</code>) para atribuirte el 50% de ganancia ($20 USD por cada 40 PV) y publica en tus redes automáticamente.
            </p>
          </div>

          {/* Métricas del Motor IA */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: `1px solid ${currentTheme.primary}`,
              borderRadius: '14px',
              padding: '0.75rem 1rem',
              minWidth: '110px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Videos Creados</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff' }}>28</div>
              <div style={{ fontSize: '0.62rem', color: currentTheme.primary, fontWeight: 700 }}>+4 hoy con IA</div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '14px',
              padding: '0.75rem 1rem',
              minWidth: '110px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Vistas Totales</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8' }}>324.5K</div>
              <div style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 700 }}>14.8% Engagement</div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '14px',
              padding: '0.75rem 1rem',
              minWidth: '120px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Comisiones Ventas</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f59e0b' }}>$6,420 USD</div>
              <div style={{ fontSize: '0.62rem', color: '#f59e0b', fontWeight: 700 }}>50% Retail Bonus</div>
            </div>
          </div>
        </div>

        {/* Pestañas Principales del Módulo */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
          {[
            { id: 'editor', label: '🎬 Editor Híbrido & Timeline IA', icon: Video },
            { id: 'calendar', label: '📅 Calendario de Publicación', icon: Calendar },
            { id: 'social', label: '📢 Redes Sociales & Conectores', icon: Share2 },
            { id: 'analytics', label: '📊 Rendimiento & Clientes', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '10px',
                  border: isTabActive ? `1.5px solid ${currentTheme.primary}` : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isTabActive ? currentTheme.primary : 'rgba(255, 255, 255, 0.04)',
                  color: isTabActive ? '#000000' : '#cbd5e1',
                  fontWeight: isTabActive ? 800 : 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 1: EDITOR HÍBRIDO & TIMELINE MULTICAPA (CAPCUT STYLE) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'editor' && (
        <div style={{ display: 'grid', gridTemplateColumns: '310px 1fr 320px', gap: '1.25rem', alignItems: 'start' }}>
          
          {/* PANEL IZQUIERDO: CONFIGURADOR DE MATERIAL TLC */}
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color={currentTheme.primary} />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                1. Selección de Producto TLC
              </h3>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                Producto Oficial TLC
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1e293b',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="Iaso Tea Instantáneo con CBD">Iaso Tea Instantáneo con CBD (Détox)</option>
                <option value="Gotas Resolution Drops">Gotas Resolution Drops (Pérdida de Peso)</option>
                <option value="NutraBurst Multivitamínico Líquido">NutraBurst Multivitamínico Líquido</option>
                <option value="Kit Transformación Total 30 Días">Kit Transformación Total 30 Días (Trilogía)</option>
                <option value="TLC NRG Energía Extrema">TLC NRG Cápsulas de Energía Natural</option>
                <option value="Café Delgada con Chaga y Garcinia">Café Delgada con Chaga y Garcinia</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                Objetivo Comercial
              </label>
              <select
                value={selectedObjective}
                onChange={(e) => setSelectedObjective(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1e293b',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="VENTA_DIRECTA">🔥 Venta Directa (Ganancia $20 USD)</option>
                <option value="TESTIMONIOS">🏆 Testimonio Reto Détox (-5 lbs en 5 días)</option>
                <option value="RECLUTAMIENTO">💼 Reclutamiento de Nuevos Afiliados</option>
                <option value="OFERTA_2X1">🎁 Promoción Exclusiva de Semana</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Formato
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                >
                  <option value="TIKTOK_9_16">9:16 (TikTok/Reels)</option>
                  <option value="FEED_4_5">4:5 (Feed IG/FB)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Duración
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(Number(e.target.value))}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                >
                  <option value={15}>15 Segundos (Viral)</option>
                  <option value={30}>30 Segundos (Detallado)</option>
                  <option value={60}>60 Segundos (Master)</option>
                </select>
              </div>
            </div>

            {/* Enlace de Afiliado Incrustado */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
              padding: '0.75rem',
              border: `1px dashed ${currentTheme.primary}`,
            }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>Link de Afiliado Vinculado:</div>
              <div style={{ fontSize: '0.72rem', color: currentTheme.primary, fontFamily: 'monospace', fontWeight: 700, wordBreak: 'break-all', marginTop: '2px' }}>
                gymfit.app/tlc?ref={affiliateSlug}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '4px' }}>
                ✓ Comisiones del 50% ($20 USD) atribuidas a {affiliateName}
              </div>
            </div>

            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: currentTheme.primary,
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.85rem',
                padding: '0.75rem',
                borderRadius: '12px',
                border: 'none',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                boxShadow: `0 4px 18px ${currentTheme.primaryGlow}`,
                opacity: isGenerating ? 0.7 : 1,
              }}
            >
              <Wand2 size={16} />
              {isGenerating ? 'Generando Video...' : 'Crear Video Automático con IA'}
            </button>

            {isGenerating && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${currentTheme.primary}`,
                borderRadius: '10px',
                padding: '0.6rem',
                textAlign: 'center',
                fontSize: '0.72rem',
                color: currentTheme.primary,
                fontWeight: 700,
              }}>
                {generationStep}
              </div>
            )}
          </div>

          {/* PANEL CENTRAL: VISOR DE VIDEO 9:16 + TIMELINE MULTICAPA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Visor de Video Vertical 9:16 con Subtítulos Neón en Vivo */}
            <div style={{
              background: '#070a12',
              border: `1.5px solid ${currentTheme.primary}`,
              borderRadius: '24px',
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              boxShadow: `0 8px 30px rgba(0,0,0,0.6)`,
            }}>
              {/* Contenedor del Video en Proporción Vertical 9:16 */}
              <div style={{
                width: '280px',
                height: '498px',
                borderRadius: '18px',
                overflow: 'hidden',
                position: 'relative',
                background: '#000000',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                border: '2px solid rgba(255, 255, 255, 0.12)',
              }}>
                {/* Imagen/Frame del B-Roll Activo con Zoom Animado */}
                {activeScene && (
                  <img
                    src={activeScene.brollUrl}
                    alt={activeScene.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.9)',
                      transform: isPlaying ? 'scale(1.05)' : 'scale(1.0)',
                      transition: 'transform 2.5s ease-in-out',
                    }}
                  />
                )}

                {/* Overlay Oscuro Gradual para legibilidad */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.75) 100%)',
                }} />

                {/* Badge Superior: Tienda Oficial TLC */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  zIndex: 2,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    border: `1px solid ${currentTheme.primary}`,
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentTheme.primary }} />
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#ffffff' }}>TIENDA OFICIAL TLC</span>
                  </div>

                  <span style={{
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    background: 'rgba(245, 158, 11, 0.85)',
                    color: '#000',
                    padding: '0.2rem 0.45rem',
                    borderRadius: '4px',
                  }}>
                    RETO 5 DÍAS
                  </span>
                </div>

                {/* SUBTÍTULOS DINÁMICOS DE NEÓN ESTILO CAPCUT */}
                <div style={{
                  position: 'absolute',
                  top: '55%',
                  left: '14px',
                  right: '14px',
                  transform: 'translateY(-50%)',
                  textAlign: 'center',
                  zIndex: 3,
                }}>
                  <div style={{
                    display: 'inline-block',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    background: 'rgba(0, 0, 0, 0.75)',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    lineHeight: 1.3,
                    border: `1.5px solid ${currentTheme.primary}`,
                    boxShadow: `0 0 20px ${currentTheme.primaryGlow}`,
                    textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                  }}>
                    {activeScene?.subtitle}
                  </div>
                </div>

                {/* OVERLAY INFERIOR: BOTÓN COMPRA + ENLACE DE AFILIADO */}
                <div style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '12px',
                  right: '12px',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}>
                  <div style={{
                    background: currentTheme.primary,
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '0.72rem',
                    padding: '0.45rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    boxShadow: `0 0 14px ${currentTheme.primaryGlow}`,
                  }}>
                    🛒 PIDE AQUÍ: gymfit.app/tlc?ref={affiliateSlug}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.6rem',
                    color: '#cbd5e1',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                  }}>
                    <span>Asesor: {affiliateName}</span>
                    <span style={{ color: '#25D366', fontWeight: 800 }}>WhatsApp Directo 💬</span>
                  </div>
                </div>
              </div>

              {/* Barra de Controles del Reproductor */}
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1rem',
                paddingTop: '0.8rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: currentTheme.primary,
                      color: '#000000',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                  </button>

                  <button
                    onClick={() => setCurrentTime(0)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#94a3b8',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Reiniciar"
                  >
                    <RotateCcw size={15} />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#94a3b8',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 800, fontFamily: 'monospace' }}>
                  00:{Math.floor(currentTime).toString().padStart(2, '0')} / 00:{currentProject?.durationSeconds || 15}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => handlePublishNow(['TIKTOK', 'INSTAGRAM'])}
                    disabled={isPublishing}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(56, 189, 248, 0.2)',
                      color: '#38bdf8',
                      border: '1px solid #38bdf8',
                      padding: '0.45rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <Share2 size={13} />
                    Publicar Ahora
                  </button>

                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: currentTheme.primary,
                      color: '#000000',
                      border: 'none',
                      padding: '0.45rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <Calendar size={13} />
                    Agendar
                  </button>
                </div>
              </div>
            </div>

            {/* LÍNEA DE TIEMPO MULTICAPA (TIMELINE PROFESIONAL ESTILO CAPCUT) */}
            <div style={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={16} color={currentTheme.primary} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>Línea de Tiempo Multicapa (15 Segundos)</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.45rem', borderRadius: '4px' }}>Corte IA</span>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.45rem', borderRadius: '4px' }}>Transiciones</span>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.45rem', borderRadius: '4px' }}>Zoom 1080x1920</span>
                </div>
              </div>

              {/* Regla de Segundos */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '90px', fontSize: '0.62rem', color: '#64748b', fontFamily: 'monospace' }}>
                <span>0s</span>
                <span>3s (Hook)</span>
                <span>7s (Producto)</span>
                <span>11s (Prueba)</span>
                <span>13s (Oferta)</span>
                <span>15s (CTA)</span>
              </div>

              {/* Capa 1: Video B-Roll */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '85px', fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Film size={12} color="#38bdf8" /> Video
                </div>
                <div style={{ flex: 1, display: 'flex', gap: '3px', height: '28px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '2px' }}>
                  {currentProject?.scenes.map((sc, i) => (
                    <div
                      key={sc.id}
                      onClick={() => setCurrentTime(sc.startSec)}
                      style={{
                        flex: sc.endSec - sc.startSec,
                        background: currentSceneIndex === i ? currentTheme.primary : 'rgba(56, 189, 248, 0.25)',
                        border: currentSceneIndex === i ? `1px solid ${currentTheme.primary}` : '1px solid rgba(56, 189, 248, 0.4)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.62rem',
                        color: currentSceneIndex === i ? '#000' : '#ffffff',
                        fontWeight: 700,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        padding: '0 4px',
                      }}
                    >
                      E{i + 1}: {sc.name.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Capa 2: Audio & Música */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '85px', fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Music size={12} color="#f59e0b" /> Audio
                </div>
                <div style={{
                  flex: 1,
                  height: '24px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  justifyContent: 'space-between',
                  fontSize: '0.62rem',
                  color: '#f59e0b',
                  fontWeight: 700,
                }}>
                  <span>🎵 {currentProject?.audioTrack.title}</span>
                  <span>128 BPM Trend</span>
                </div>
              </div>

              {/* Capa 3: Voz en Off IA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '85px', fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mic size={12} color="#a855f7" /> Voz IA
                </div>
                <div style={{
                  flex: 1,
                  height: '24px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  fontSize: '0.62rem',
                  color: '#c084fc',
                  fontWeight: 700,
                }}>
                  🎙️ {currentProject?.voiceover.speaker} • {currentProject?.voiceover.tone}
                </div>
              </div>

              {/* Capa 4: Subtítulos Neón */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '85px', fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Type size={12} color={currentTheme.primary} /> Subtítulos
                </div>
                <div style={{
                  flex: 1,
                  height: '24px',
                  background: currentTheme.accentBg,
                  border: `1px solid ${currentTheme.primary}`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  fontSize: '0.62rem',
                  color: currentTheme.primary,
                  fontWeight: 800,
                }}>
                  💬 Sincronización Dinámica Neón Estilo CapCut
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO: ASISTENTE CONVERSACIONAL IA ("COPILOTO DE EDICIÓN") */}
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            height: '620px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <MessageSquare size={18} color={currentTheme.primary} />
              <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>
                  Copiloto de Edición IA
                </h3>
                <span style={{ fontSize: '0.62rem', color: '#64748b' }}>Ajusta tu video con lenguaje natural</span>
              </div>
            </div>

            {/* Sugerencias Rápidas de 1-Clic */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.8rem' }}>
              {[
                '✨ Hazlo más elegante y premium',
                '🔥 Crea versión agresiva para TikTok',
                '🎵 Cambia la música por algo más enérgico',
                '📲 Resalta el botón de WhatsApp',
              ].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendChatPrompt(sug)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.6rem',
                    color: '#cbd5e1',
                    fontSize: '0.68rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Mensajes del Chat */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              paddingRight: '4px',
              marginBottom: '0.8rem',
            }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: msg.sender === 'user' ? currentTheme.primary : '#1e293b',
                    color: msg.sender === 'user' ? '#000000' : '#f8fafc',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    lineHeight: 1.4,
                    fontWeight: msg.sender === 'user' ? 800 : 500,
                    border: msg.sender === 'ai' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <div>{msg.text}</div>
                  <div style={{ fontSize: '0.55rem', opacity: 0.6, marginTop: '2px', textAlign: 'right' }}>
                    {msg.time}
                  </div>
                </div>
              ))}

              {isAiReplying && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: '#1e293b',
                  color: currentTheme.primary,
                  padding: '0.5rem 0.8rem',
                  borderRadius: '10px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}>
                  ⚡ Modificando proyecto y re-renderizando capas...
                </div>
              )}
            </div>

            {/* Input del Chat */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatPrompt()}
                placeholder="Escribe: ej. cambia subtítulos a amarillo..."
                style={{
                  flex: 1,
                  background: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => handleSendChatPrompt()}
                style={{
                  background: currentTheme.primary,
                  color: '#000000',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 2: CALENDARIO DE PUBLICACIÓN AUTOMÁTICA (BUFFER STYLE)*/}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.25rem 0' }}>
                Calendario Editorial Autónomo (Semanal)
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                Las publicaciones se disparan en las horas pico de mayor interacción para maximizar clics en tu enlace de afiliado.
              </p>
            </div>

            <button
              onClick={() => setIsScheduleModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: currentTheme.primary,
                color: '#000',
                padding: '0.65rem 1.1rem',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              Programar Nueva Publicación
            </button>
          </div>

          {/* Tarjetas de Publicaciones Programadas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {calendarPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    background: post.platform === 'TIKTOK' ? '#000' : post.platform === 'INSTAGRAM' ? '#E1306C' : '#1877F2',
                    color: '#ffffff',
                  }}>
                    {post.platform}
                  </span>

                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: currentTheme.primary,
                    background: currentTheme.accentBg,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                  }}>
                    {post.status === 'SCHEDULED' ? '⏰ PROGRAMADO' : '✓ PUBLICADO'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <img
                    src={post.videoThumbnail}
                    alt={post.title}
                    style={{ width: '70px', height: '90px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3 }}>
                      {post.title}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                      Producto: <span style={{ color: currentTheme.primary }}>{post.productName}</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                      Hora programada: {new Date(post.scheduledFor).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '0.6rem',
                  fontSize: '0.7rem',
                  color: '#cbd5e1',
                  lineHeight: 1.4,
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  {post.copyText.slice(0, 110)}...
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.6rem' }}>
                  <span style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>
                    Vistas estimadas: ~{post.estimatedViews.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handlePublishNow([post.platform])}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Disparar Ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 3: REDES SOCIALES & CONEXIÓN DE CANALES               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'social' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Canales Conectados */}
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '1.4rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
              Cuentas Sociales Vinculadas
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
              Tus videos se publican de forma automática con subtítulos sincronizados y tu enlace en bio.
            </p>

            {[
              { name: 'TikTok Creator', handle: '@detoxconelena', followers: '48.2K', status: 'Conectado', color: '#00f0ff' },
              { name: 'Instagram Business', handle: '@elena_tlc_global', followers: '29.5K', status: 'Conectado', color: '#E1306C' },
              { name: 'Facebook Pages', handle: 'Total Life Changes - Líderes VIP', followers: '14.8K', status: 'Conectado', color: '#1877F2' },
              { name: 'YouTube Shorts', handle: 'Elena Reto Détox 15 Días', followers: '11.2K', status: 'Conectado', color: '#FF0000' },
            ].map((acc, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>{acc.name}</div>
                  <div style={{ fontSize: '0.72rem', color: acc.color, fontWeight: 700 }}>{acc.handle} • {acc.followers} seguidores</div>
                </div>

                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: currentTheme.primary,
                  background: currentTheme.accentBg,
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  border: `1px solid ${currentTheme.primary}`,
                }}>
                  ✓ {acc.status}
                </span>
              </div>
            ))}
          </div>

          {/* Generador de Copys y Publicador Inmediato */}
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '1.4rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
              Copy & Hashtags Persuasivos Generados por IA
            </h3>

            <div style={{
              background: '#1e293b',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: currentTheme.primary }}>
                {currentProject?.copySuggestion.headline}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {currentProject?.copySuggestion.body}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>
                {currentProject?.copySuggestion.hashtags.join(' ')}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                Publicar el video actual en todas las redes vinculadas simultáneamente:
              </div>

              <button
                onClick={() => handlePublishNow(['TIKTOK', 'INSTAGRAM', 'FACEBOOK', 'YOUTUBE'])}
                disabled={isPublishing}
                style={{
                  width: '100%',
                  background: currentTheme.primary,
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: isPublishing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: `0 4px 18px ${currentTheme.primaryGlow}`,
                }}
              >
                <Zap size={16} />
                {isPublishing ? `Publicando (${publishProgress}%)...` : 'Disparar Publicación Inmediata Multi-Red'}
              </button>

              {isPublishing && (
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${publishProgress}%`, height: '100%', background: currentTheme.primary, transition: 'width 0.3s ease' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 4: RENDIMIENTO & COMISIONES POR VIDEO (ANALYTICS)    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'analytics' && (
        <div style={{
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
            Atribución de Ventas por Marketing de Video IA
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            Monitorea los clientes potenciales y ventas retail del 50% originadas en los videos generados con tu enlace de afiliado.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Clics en Enlace Tienda</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>12,840</div>
              <div style={{ fontSize: '0.65rem', color: currentTheme.primary, fontWeight: 700 }}>+28% vs semana pasada</div>
            </div>

            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Contactos por WhatsApp</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#25D366', marginTop: '4px' }}>842 chats</div>
              <div style={{ fontSize: '0.65rem', color: '#25D366', fontWeight: 700 }}>Tasa de cierre: 38%</div>
            </div>

            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Kits Détox Vendidos</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>321 kits</div>
              <div style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700 }}>12,840 Puntos PV</div>
            </div>

            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '14px', border: `1px solid ${currentTheme.primary}` }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Comisión Generada ($20/kit)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: currentTheme.primary, marginTop: '4px' }}>$6,420.00 USD</div>
              <div style={{ fontSize: '0.65rem', color: currentTheme.primary, fontWeight: 700 }}>Acreditado a tu billetera</div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: PROGRAMAR PUBLICACIÓN EN CALENDARIO                     */}
      {/* ------------------------------------------------------------- */}
      {isScheduleModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#0f172a',
            border: `1.5px solid ${currentTheme.primary}`,
            borderRadius: '20px',
            width: '100%',
            maxWidth: '460px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                Programar Publicación Automática
              </h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Título de la Campaña
                </label>
                <input
                  type="text"
                  value={scheduleForm.title || currentProject?.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    fontSize: '0.75rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Plataforma
                </label>
                <select
                  value={scheduleForm.platform}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, platform: e.target.value as any })}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    fontSize: '0.75rem',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="TIKTOK">TikTok (9:16)</option>
                  <option value="INSTAGRAM">Instagram Reels (9:16)</option>
                  <option value="FACEBOOK">Facebook Video (4:5)</option>
                  <option value="YOUTUBE">YouTube Shorts (9:16)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                    Hora Pico
                  </label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '0.5rem',
                  background: currentTheme.primary,
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  padding: '0.7rem',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Confirmar y Añadir al Calendario
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: CONFIRMACIÓN DE PUBLICACIÓN INMEDIATA MULTI-RED         */}
      {/* ------------------------------------------------------------- */}
      {publishSuccessModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#0f172a',
            border: `2px solid ${currentTheme.primary}`,
            borderRadius: '24px',
            width: '100%',
            maxWidth: '460px',
            padding: '1.8rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.8rem',
            boxShadow: `0 0 40px ${currentTheme.primaryGlow}`,
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: currentTheme.accentBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentTheme.primary,
            }}>
              <Check size={36} />
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              ¡Video Publicado Exitosamente!
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              El video comercial se encuentra activo en tus redes con tu enlace de afiliado (<code style={{ color: currentTheme.primary }}>ref={affiliateSlug}</code>) incrustado.
            </p>

            <div style={{ width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '0.8rem', textAlign: 'left', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ color: '#cbd5e1' }}>Plataformas activas: <b style={{ color: '#fff' }}>{publishSuccessModal.data?.platforms?.join(', ')}</b></div>
              <div style={{ color: '#cbd5e1' }}>Hora de publicación: <b style={{ color: currentTheme.primary }}>{new Date().toLocaleTimeString()}</b></div>
              <div style={{ color: '#f59e0b', fontWeight: 700 }}>Comisión estimada por ventas: 50% ($20 USD/kit)</div>
            </div>

            <button
              onClick={() => setPublishSuccessModal(null)}
              style={{
                width: '100%',
                background: currentTheme.primary,
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.82rem',
                padding: '0.75rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              Cerrar y Continuar Creando
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
