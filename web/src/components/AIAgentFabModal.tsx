import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  ArrowRight, 
  RotateCw, 
  Maximize2, 
  Minimize2,
  Zap,
  ShieldCheck,
  Dumbbell,
  Leaf,
  Key
} from 'lucide-react';
import { ColorTheme } from '../styles/themeConfig.js';
import { sendAgentChatMessage, AgentMessage } from '../services/api.js';

interface AIAgentFabModalProps {
  currentTheme: ColorTheme;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AIAgentFabModal: React.FC<AIAgentFabModalProps> = ({
  currentTheme,
  onNavigate,
  isOpen,
  onToggle,
}) => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! Soy **APEX AI**, tu Agente Inteligente del sistema **APEX LIFE & TLC**.\n\nPuedo consultar aforo, guiarte en el registro de contactos bajo **Ley 1581**, gestionar licencias, recomendar productos détox TLC o diseñar rutinas.\n\n¿En qué te puedo colaborar hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: '🎬 Edición Video IA & Redes', query: 'Abre el estudio de edición de video IA y automatización de redes sociales.' },
    { label: '📊 Aforo en Sala', query: '¿Cuál es el aforo actual de la sala y flujo en recepción?' },
    { label: '⚖️ Ley 1581 Colombia', query: '¿Cómo funciona el registro de contactos bajo la Ley 1581 de Habeas Data?' },
    { label: '🌿 Protocolo Détox TLC', query: 'Recomiéndame un protocolo con Iaso Tea y Resolution para pérdida de peso.' },
    { label: '🔑 Licencias Superadmin', query: '¿Cómo activo o extiendo una licencia comercial con módulos específicos?' },
    { label: '💪 Diseñar Rutina IA', query: 'Genera una rutina de hipertrofia de 4 días para gimnasio.' },
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

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
        content: 'Disculpa, tuve un inconveniente temporal comunicándome con el servidor Contabo. Por favor intenta de nuevo en unos segundos.',
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

  const handleActionClick = (targetView?: string) => {
    if (targetView) {
      onNavigate(targetView);
      onToggle(); // Cierra el modal flotante para ver la vista
    }
  };

  return (
    <>
      {/* Botón Flotante Neón (FAB) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          aria-label="Abrir Agente IA APEX"
          className="apex-ai-fab"
          style={{
            position: 'fixed',
            bottom: 'calc(75px + env(safe-area-inset-bottom, 0px))',
            right: '20px',
            zIndex: 850,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #070a12 0%, #0d1527 100%)',
            border: `1.5px solid ${currentTheme.primary}`,
            boxShadow: `0 8px 30px rgba(0,0,0,0.6), 0 0 20px ${currentTheme.primaryGlow}`,
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px) scale(1)';
          }}
        >
          <div 
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: currentTheme.primary,
              color: '#000000',
            }}
          >
            <Bot size={18} strokeWidth={2.5} />
            <span 
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #070a12',
              }} 
            />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em' }}>
              APEX <span style={{ color: currentTheme.primary }}>AI</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>
              Agente Autónomo
            </div>
          </div>
        </button>
      )}

      {/* Ventana Modal / Drawer de Chat */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(75px + env(safe-area-inset-bottom, 0px))',
            right: '20px',
            width: isExpanded ? '640px' : '390px',
            maxWidth: 'calc(100vw - 30px)',
            height: isExpanded ? '80vh' : '560px',
            maxHeight: 'calc(100vh - 100px)',
            background: 'rgba(10, 15, 29, 0.94)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${currentTheme.primary}44`,
            borderRadius: '24px',
            boxShadow: `0 24px 60px rgba(0, 0, 0, 0.8), 0 0 35px ${currentTheme.primaryGlow}`,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 950,
            overflow: 'hidden',
            fontFamily: 'Inter, system-ui, sans-serif',
            animation: 'modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header del Agente */}
          <div 
            style={{
              padding: '14px 18px',
              background: 'rgba(15, 23, 42, 0.75)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: currentTheme.primary,
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 14px ${currentTheme.primaryGlow}`,
                }}
              >
                <Bot size={22} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>APEX AI</span>
                  <span 
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: '#4ade80',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    ONLINE
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  Servidor Contabo VPS • Conexión Cifrada
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="desktop-btn-label"
                title={isExpanded ? 'Contraer' : 'Expandir'}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={onToggle}
                title="Cerrar"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div 
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '100%',
                }}
              >
                <div
                  style={{
                    maxWidth: '88%',
                    padding: '12px 15px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' 
                      ? currentTheme.primary 
                      : 'rgba(255, 255, 255, 0.06)',
                    color: msg.role === 'user' ? '#000000' : '#f8fafc',
                    fontWeight: msg.role === 'user' ? 600 : 400,
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: msg.role === 'user' ? `0 4px 14px ${currentTheme.primaryGlow}` : 'none',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}

                  {/* Botón de Acción Sugerida */}
                  {msg.actionSuggestion && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <button
                        onClick={() => handleActionClick(msg.actionSuggestion?.targetView)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: currentTheme.primary,
                          color: '#000000',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          boxShadow: `0 2px 10px ${currentTheme.primaryGlow}`,
                        }}
                      >
                        <span>{msg.actionSuggestion.label || 'Ver Módulo'}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <span style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '3px', padding: '0 4px' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', width: 'fit-content' }}>
                <RotateCw size={14} className="animate-spin" color={currentTheme.primary} />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>APEX AI está pensando...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chips de Consultas Rápidas */}
          <div 
            style={{
              padding: '6px 14px',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(15, 23, 42, 0.4)',
            }}
          >
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                disabled={isLoading}
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${currentTheme.primary}20`;
                  e.currentTarget.style.color = currentTheme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#cbd5e1';
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Barra de Entrada de Texto */}
          <div 
            style={{
              padding: '12px 14px',
              background: 'rgba(15, 23, 42, 0.85)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregúntale a APEX AI..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              aria-label="Enviar"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: inputText.trim() && !isLoading ? currentTheme.primary : 'rgba(255, 255, 255, 0.08)',
                color: inputText.trim() && !isLoading ? '#000000' : '#64748b',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
                boxShadow: inputText.trim() && !isLoading ? `0 2px 12px ${currentTheme.primaryGlow}` : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
