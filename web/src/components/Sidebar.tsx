import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  QrCode, 
  Users, 
  Sparkles, 
  Dumbbell, 
  UtensilsCrossed, 
  ShieldCheck, 
  Scale, 
  ShoppingBag, 
  DollarSign, 
  User, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Layers,
  Leaf,
  Activity,
  Award,
  Video,
  Key,
  LifeBuoy,
  LogOut,
  UserCheck
} from 'lucide-react';
import { ColorTheme, EnvironmentTheme } from '../styles/themeConfig.js';
import { AuthUser } from '../services/api.js';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeSystem: 'gym' | 'tlc';
  onSwitchSystem: (system: 'gym' | 'tlc') => void;
  currentTheme: ColorTheme;
  currentEnv?: EnvironmentTheme;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onNavigate,
  activeSystem,
  onSwitchSystem,
  currentTheme,
  currentEnv,
  currentUser,
  onLogout
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <aside style={{
      width: isCollapsed ? '72px' : '235px',
      transition: 'all 0.22s ease',
      background: currentEnv?.sidebarBg || '#070a12',
      borderRadius: '24px',
      padding: isCollapsed ? '1.25rem 0.5rem' : '1.25rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
      color: '#ffffff',
      position: 'relative',
      flexShrink: 0,
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
      alignSelf: 'stretch',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      fontFamily: 'Inter, system-ui, sans-serif',
      zIndex: 50,
    }}>
      {/* Tira vertical neón en el borde derecho */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '0px',
        bottom: '24px',
        width: '3.5px',
        background: currentTheme.primary,
        borderRadius: '999px',
        boxShadow: `0 0 12px ${currentTheme.primaryGlow}`,
      }} />

      {/* Botón circular toggle < */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? 'Expandir Menú' : 'Contraer Menú'}
        style={{
          position: 'absolute',
          top: '36px',
          right: '-13px',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: currentTheme.primary,
          color: '#000000',
          border: '2px solid #070a12',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          boxShadow: `0 0 12px ${currentTheme.primaryGlow}`,
        }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Brand con acento */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.4rem' }}>
        <div style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          fontFamily: 'system-ui',
          color: '#ffffff',
        }}>
          {activeSystem === 'gym' ? (
            <>APEX <span style={{ color: currentTheme.primary }}>LIFE</span></>
          ) : (
            <>APEX <span style={{ color: currentTheme.primary }}>LIFE</span> <span style={{ fontSize: '0.75rem', color: currentTheme.primary }}>TLC</span></>
          )}
        </div>
        {!isCollapsed && (
          <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.06em', marginTop: '2px' }}>
            GLOBAL
          </span>
        )}
      </div>

      {/* User Card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.35rem 0.4rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#1e293b',
            border: `1.5px solid ${currentTheme.primary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}>
            <User size={18} />
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.15 }}>
                Luis Ernesto
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                Moreno
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.06em', marginTop: '1px' }}>
                {showPassword ? 'ID: 51212602' : '••••••••••••'}
              </div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
          >
            {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        )}
      </div>

      {/* Píldora de Balance / Aforo (Solid Theme Pill) */}
      <button
        onClick={() => setShowBalance(!showBalance)}
        style={{
          background: currentTheme.primary,
          border: 'none',
          borderRadius: '999px',
          padding: '0.42rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#000000',
          fontWeight: 800,
          fontSize: '0.75rem',
          cursor: 'pointer',
          boxShadow: `0 4px 14px ${currentTheme.primaryGlow}`,
          transition: 'transform 0.15s ease',
        }}
      >
        <span>{activeSystem === 'gym' ? 'Aforo Sala' : 'Balance TLC'}</span>
        <span>
          {showBalance ? (activeSystem === 'gym' ? '38 / 100' : '$14,892.45') : '••••••'}
        </span>
      </button>

      {/* Selector de Sistema Alterno (GYM vs TLC) */}
      <div style={{
        background: currentTheme.primary,
        borderRadius: '8px',
        padding: '0.45rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#000000',
        fontWeight: 800,
        fontSize: '0.78rem',
        cursor: 'pointer',
      }}
      onClick={() => onSwitchSystem(activeSystem === 'gym' ? 'tlc' : 'gym')}
      title="Cambiar entre Sistema GYM y TLC"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {activeSystem === 'gym' ? <Dumbbell size={15} /> : <Leaf size={15} />}
          {!isCollapsed && <span>{activeSystem === 'gym' ? 'Modo GYM Normal' : 'Modo TLC Détox'}</span>}
        </div>
        {!isCollapsed && <ChevronDown size={14} />}
      </div>

      {/* Menú de Navegación */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem',
        overflowY: 'auto',
        flex: 1,
      }}>
        {activeSystem === 'gym' ? (
          /* MÓDULOS DE GIMNASIO NORMAL & ENTRENADORES */
          <>
            {[
              { id: 'dashboard', label: 'Dashboard Gym', icon: LayoutDashboard },
              { id: 'checkin', label: 'Recepción & QR', icon: QrCode },
              { id: 'members', label: 'Directorio Socios', icon: Users },
              { id: 'aiscan', label: 'Escaneo Corporal IA', icon: Sparkles },
              { id: 'routines', label: 'Rutinas & Series', icon: Dumbbell },
              { id: 'nutrition', label: 'Nutrición Macros', icon: UtensilsCrossed },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.42rem 0.65rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: isActive ? currentTheme.accentBg : 'transparent',
                    color: isActive ? currentTheme.primary : '#94a3b8',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Icon size={16} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}

            {/* Sección Resaltada: Entrenadores 1-on-1 */}
            <div style={{ marginTop: '0.35rem' }}>
              <div 
                onClick={() => onNavigate('trainers')}
                style={{
                  background: currentView === 'trainers' ? currentTheme.primary : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${currentView === 'trainers' ? currentTheme.primary : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '8px',
                  padding: '0.45rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: currentView === 'trainers' ? '#000000' : '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <ShieldCheck size={16} />
                  {!isCollapsed && <span>Entrenadores 1-on-1</span>}
                </div>
                {!isCollapsed && <ChevronDown size={14} />}
              </div>

              {!isCollapsed && currentView === 'trainers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', paddingLeft: '1.6rem', marginTop: '0.35rem' }}>
                  <div style={{ fontSize: '0.75rem', color: currentTheme.primary, fontWeight: 700, padding: '0.15rem 0', cursor: 'pointer' }}>
                    Coaches Activos
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0.15rem 0', cursor: 'pointer' }}>
                    Alumnos Asignados
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* MÓDULOS DE TOTAL LIFE CHANGES (TLC) */
          <>
            {/* Sección Resaltada: Red de Afiliados TLC */}
            <div style={{ marginTop: '0.2rem' }}>
              <div 
                onClick={() => onNavigate('tlc')}
                style={{
                  background: currentTheme.primary,
                  borderRadius: '8px',
                  padding: '0.45rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Users size={16} />
                  {!isCollapsed && <span>My Affiliate Network</span>}
                </div>
                {!isCollapsed && <ChevronDown size={14} />}
              </div>

              {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', paddingLeft: '1.6rem', marginTop: '0.35rem' }}>
                  <div 
                    onClick={() => onNavigate('tlc')}
                    style={{ fontSize: '0.75rem', color: currentView === 'tlc' ? currentTheme.primary : '#94a3b8', fontWeight: 700, padding: '0.15rem 0', cursor: 'pointer' }}
                  >
                    Dashboard TLC
                  </div>
                  <div 
                    onClick={() => onNavigate('tlc_contacts')}
                    style={{ 
                      fontSize: '0.75rem', 
                      color: currentView === 'tlc_contacts' ? currentTheme.primary : '#94a3b8', 
                      fontWeight: currentView === 'tlc_contacts' ? 700 : 500, 
                      padding: '0.15rem 0', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>Contactos Ley 1581</span>
                    <span style={{ fontSize: '0.58rem', background: 'rgba(20, 184, 166, 0.25)', color: '#2dd4bf', fontWeight: 800, padding: '0.05rem 0.3rem', borderRadius: '3px' }}>COL</span>
                  </div>
                  <div 
                    onClick={() => onNavigate('tlc_protocols')}
                    style={{ fontSize: '0.75rem', color: currentView === 'tlc_protocols' ? currentTheme.primary : '#94a3b8', padding: '0.15rem 0', cursor: 'pointer' }}
                  >
                    Reto Détox 15/30 Días
                  </div>
                  <div 
                    onClick={() => onNavigate('tlc_products')}
                    style={{ fontSize: '0.75rem', color: currentView === 'tlc_products' ? currentTheme.primary : '#94a3b8', padding: '0.15rem 0', cursor: 'pointer' }}
                  >
                    Kits Iaso Tea & Gotas
                  </div>
                  <div 
                    onClick={() => onNavigate('tlc_store')}
                    style={{ 
                      fontSize: '0.75rem', 
                      color: currentView === 'tlc_store' ? currentTheme.primary : '#94a3b8', 
                      fontWeight: currentView === 'tlc_store' ? 700 : 500, 
                      padding: '0.15rem 0', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>Tienda en Línea TLC</span>
                    <span style={{ fontSize: '0.6rem', background: currentTheme.primary, color: '#000', fontWeight: 800, padding: '0.05rem 0.3rem', borderRadius: '3px' }}>LINK</span>
                  </div>
                </div>
              )}
            </div>

            {/* Acceso Directo: Tienda en Línea TLC Compartible */}
            <div style={{ marginTop: '0.35rem' }}>
              <button
                onClick={() => onNavigate('tlc_store')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  border: currentView === 'tlc_store' ? `1.5px solid ${currentTheme.primary}` : '1px solid rgba(255, 255, 255, 0.08)',
                  background: currentView === 'tlc_store' ? currentTheme.accentBg : 'rgba(255, 255, 255, 0.03)',
                  color: currentView === 'tlc_store' ? currentTheme.primary : '#f8fafc',
                  fontSize: '0.78rem',
                  fontWeight: currentView === 'tlc_store' ? 800 : 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <ShoppingBag size={16} color={currentView === 'tlc_store' ? currentTheme.primary : '#38bdf8'} />
                {!isCollapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>Tienda Online & Link</span>
                    <span style={{
                      fontSize: '0.58rem',
                      background: 'rgba(56, 189, 248, 0.2)',
                      color: '#38bdf8',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '4px',
                      fontWeight: 700
                    }}>
                      50% COM
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Acceso Especial: TLC AI Content Engine (Video Marketing Autónomo) */}
            <div style={{ marginTop: '0.35rem' }}>
              <button
                onClick={() => onNavigate('tlc_video_ai')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  border: currentView === 'tlc_video_ai' ? `1.5px solid ${currentTheme.primary}` : '1px solid rgba(255, 255, 255, 0.08)',
                  background: currentView === 'tlc_video_ai' ? currentTheme.accentBg : 'rgba(255, 255, 255, 0.03)',
                  color: currentView === 'tlc_video_ai' ? currentTheme.primary : '#f8fafc',
                  fontSize: '0.78rem',
                  fontWeight: currentView === 'tlc_video_ai' ? 800 : 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Video size={16} color={currentView === 'tlc_video_ai' ? currentTheme.primary : '#a855f7'} />
                {!isCollapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>Video Marketing IA</span>
                    <span style={{
                      fontSize: '0.58rem',
                      background: 'rgba(168, 85, 247, 0.25)',
                      color: '#c084fc',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '4px',
                      fontWeight: 800
                    }}>
                      VIRAL IA
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Sección Resaltada: Comisiones TLC */}
            <div style={{ marginTop: '0.45rem' }}>
              <div 
                onClick={() => onNavigate('tlc_sales')}
                style={{
                  background: currentView === 'tlc_sales' ? currentTheme.primary : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${currentView === 'tlc_sales' ? currentTheme.primary : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '8px',
                  padding: '0.45rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: currentView === 'tlc_sales' ? '#000000' : '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <DollarSign size={16} />
                  {!isCollapsed && <span>My Commissions</span>}
                </div>
                {!isCollapsed && <ChevronDown size={14} />}
              </div>

              {!isCollapsed && currentView === 'tlc_sales' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', paddingLeft: '1.6rem', marginTop: '0.35rem' }}>
                  <div style={{ fontSize: '0.75rem', color: currentTheme.primary, fontWeight: 700, padding: '0.15rem 0', cursor: 'pointer' }}>
                    Ventas Minoristas (50%)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0.15rem 0', cursor: 'pointer' }}>
                    Puntos PV Acumulados
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Sección Común: Módulos del Sistema */}
        <div style={{ marginTop: '0.65rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <button
            onClick={() => onNavigate('users')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.42rem 0.65rem',
              borderRadius: '6px',
              border: 'none',
              background: currentView === 'users' ? currentTheme.accentBg : 'transparent',
              color: currentView === 'users' ? currentTheme.primary : '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: currentView === 'users' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <ShieldCheck size={16} />
            {!isCollapsed && <span>Usuarios & Roles</span>}
          </button>

          {/* Activador de Licencias (Superadmin) */}
          <button
            onClick={() => onNavigate('licenses')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.42rem 0.65rem',
              borderRadius: '6px',
              border: 'none',
              background: currentView === 'licenses' ? currentTheme.accentBg : 'transparent',
              color: currentView === 'licenses' ? currentTheme.primary : '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: currentView === 'licenses' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Key size={16} color={currentView === 'licenses' ? currentTheme.primary : '#f97316'} />
            {!isCollapsed && <span>Licencias & Permisos</span>}
          </button>

          {/* Centro de Soporte Técnico */}
          <button
            onClick={() => onNavigate('support')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.42rem 0.65rem',
              borderRadius: '6px',
              border: 'none',
              background: currentView === 'support' ? currentTheme.accentBg : 'transparent',
              color: currentView === 'support' ? currentTheme.primary : '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: currentView === 'support' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <LifeBuoy size={16} color={currentView === 'support' ? currentTheme.primary : '#38bdf8'} />
            {!isCollapsed && <span>Soporte Técnico</span>}
          </button>
        </div>
      </div>

      {/* Footer Usuario en Sidebar */}
      <div style={{
        paddingTop: '0.65rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.4rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: currentTheme.primary,
            color: '#000',
            fontWeight: 800,
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {currentUser?.firstName?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.1, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Carlos Administrador'}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#64748b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentUser?.email || 'admin@gymfit.com'}
              </div>
            </div>
          )}
        </div>
        {!isCollapsed && onLogout && (
          <button
            onClick={onLogout}
            title="Cerrar Sesión"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '6px',
              padding: '0.35rem',
              color: '#f87171',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </aside>
  );
};
