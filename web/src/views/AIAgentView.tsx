import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  RotateCw, 
  ArrowRight, 
  Server, 
  Database, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Users, 
  User,
  Key, 
  FileText, 
  Cpu, 
  Zap,
  Leaf,
  Video
} from 'lucide-react';
import { ColorTheme, getSavedTheme } from '../styles/themeConfig.js';
import { sendAgentChatMessage, AgentMessage, AuthUser } from '../services/api.js';

interface AIAgentViewProps {
  currentTheme?: ColorTheme;
  currentUser?: AuthUser | null;
  onNavigate: (view: string) => void;
}

export const AIAgentView: React.FC<AIAgentViewProps> = ({
  currentTheme = getSavedTheme(),
  currentUser,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Bienvenido al Centro de Control de **APEX AI**.\n\nEstoy conectado en tiempo real al backend y base de datos PostgreSQL de **APEX LIFE & TLC**.\n\nPuedo ayudarte con:\n• 📊 **Aforo & Operación Gym:** Monitoreo en sala, afluencia y socios.\n• ⚖️ **Habeas Data & Ley 1581 (Colombia):** Gestión de contactos autorizados TLC.\n• 🔑 **Licencias & Módulos:** Planes activos, expiraciones y permisos granulares.\n• 🌿 **Ecosistema TLC:** Protocolos de desintoxicación, pérdida de grasa y ventas.\n• 🛡️ **Servidor VPS Contabo:** Telemetría, puertos y soporte técnico.\n\nEscribe cualquier comando o consulta para comenzar.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickCapabilities = [
    {
      title: 'Consultar Aforo en Sala',
      desc: 'Monitorea la ocupación actual del gimnasio en tiempo real.',
      prompt: '¿Cuál es el aforo en tiempo real de la sala?',
      icon: Users,
    },
    {
      title: 'Validación Ley 1581 Colombia',
      desc: 'Revisa el protocolo legal de tratamiento de datos personales TLC.',
      prompt: 'Explícame el flujo de captura de prospectos con Ley 1581 Colombia.',
      icon: ShieldCheck,
    },
    {
      title: 'Superadmin: Licencias & Permisos',
      desc: 'Comando para modular módulos habilitados y llaves de acceso.',
      prompt: '¿Cómo generar una licencia comercial y qué módulos puedo activar?',
      icon: Key,
    },
    {
      title: 'Edición Video & Redes IA',
      desc: 'Generador de videos virales y automatización en TikTok e Instagram.',
      prompt: 'Abre el estudio de edición de video IA y automatización de redes sociales.',
      icon: Video,
    },
    {
      title: 'Protocolo Détox TLC Iaso Tea',
      desc: 'Estructuración de tratamiento de 30 días para clientes.',
      prompt: 'Diseña un protocolo détox completo con Iaso Tea y gotas Resolution.',
      icon: Leaf,
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AgentMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const res = await sendAgentChatMessage(textToSend, historyPayload);
    setIsLoading(false);

    if (res.success && res.data) {
      const assistantMsg: AgentMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.data.reply,
        actionSuggestion: res.data.actionSuggestion,
        timestamp: new Date(res.data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } else {
      const errorMsg: AgentMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Hubo un error de comunicación con el Agente IA en el servidor Contabo. Por favor intenta de nuevo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Banner Encabezado del Agente */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: `1px solid ${currentTheme.primary}40`,
          borderRadius: '20px',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: `0 10px 30px ${currentTheme.primaryGlow}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: currentTheme.primary,
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${currentTheme.primaryGlow}`,
              flexShrink: 0,
            }}
          >
            <Bot size={32} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                APEX <span style={{ color: currentTheme.primary }}>AI</span> • Agente Inteligente
              </h1>
              <span 
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                }}
              >
                AUTÓNOMO 24/7
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Asistente cognitivo con visión integral de Gimnasio, Red TLC, Ley 1581 Habeas Data y Servidor Contabo.
            </p>
          </div>
        </div>

        {/* Telemetría rápida */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ padding: '6px 12px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Server size={14} color="#38bdf8" />
            <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600 }}>Contabo: 80.241.212.9</span>
          </div>
          <div style={{ padding: '6px 12px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={14} color="#a855f7" />
            <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600 }}>PostgreSQL: 16.15</span>
          </div>
          <div style={{ padding: '6px 12px', borderRadius: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={14} color={currentTheme.primary} />
            <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600 }}>Gemini Multimodal</span>
          </div>
        </div>
      </div>

      {/* Grid: Tarjetas Rápidas de Capacidades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickCapabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(cap.prompt)}
              disabled={isLoading}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = currentTheme.primary;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${currentTheme.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentTheme.primary }}>
                  <Icon size={18} />
                </div>
                <ArrowRight size={14} color="#64748b" />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{cap.title}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px', lineHeight: 1.3 }}>{cap.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Consola de Chat Interactiva */}
      <div 
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
          overflow: 'hidden',
        }}
      >
        {/* Historial de Mensajes */}
        <div 
          style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <div 
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: msg.role === 'user' ? currentTheme.primary : 'rgba(255, 255, 255, 0.1)',
                  color: msg.role === 'user' ? '#000000' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontWeight: 800,
                  fontSize: '0.8rem',
                }}
              >
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>

              <div style={{ maxWidth: '82%' }}>
                <div 
                  style={{
                    padding: '14px 18px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? currentTheme.primary : 'rgba(255, 255, 255, 0.05)',
                    color: msg.role === 'user' ? '#000000' : '#f8fafc',
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}

                  {msg.actionSuggestion && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <button
                        onClick={() => onNavigate(msg.actionSuggestion!.targetView!)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          background: currentTheme.primary,
                          color: '#000000',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          boxShadow: `0 2px 10px ${currentTheme.primaryGlow}`,
                        }}
                      >
                        <span>{msg.actionSuggestion.label || 'Ejecutar Acción'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px', textAlign: msg.role === 'user' ? 'right' : 'left', padding: '0 4px' }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', width: 'fit-content' }}>
              <RotateCw size={16} className="animate-spin" color={currentTheme.primary} />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>APEX AI está razonando tu consulta...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div 
          style={{
            padding: '14px 18px',
            background: 'rgba(7, 10, 18, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta o comando para el Agente IA..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              background: inputText.trim() && !isLoading ? currentTheme.primary : 'rgba(255, 255, 255, 0.08)',
              color: inputText.trim() && !isLoading ? '#000000' : '#64748b',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
              boxShadow: inputText.trim() && !isLoading ? `0 2px 14px ${currentTheme.primaryGlow}` : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Consultar</span>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
