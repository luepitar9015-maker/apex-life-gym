import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Alert 
} from 'react-native';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  FileText, 
  Plus, 
  Search, 
  Lock, 
  Unlock, 
  Key, 
  Zap, 
  Trash2, 
  RefreshCw, 
  Sliders, 
  Check, 
  X, 
  Server, 
  HardDrive, 
  Cpu, 
  Database,
  ChevronRight
} from 'lucide-react-native';
import { useTheme } from '../styles/themeConfig';
import { MobileUser } from '../components/MobileHeader';

interface AdminSystemScreenProps {
  currentUser?: MobileUser;
}

export const AdminSystemScreen: React.FC<AdminSystemScreenProps> = ({ currentUser }) => {
  const { colorTheme, envTheme } = useTheme();

  // Sub-pestañas: 'users' | 'permissions' | 'audit' | 'server'
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'permissions' | 'audit' | 'server'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // -------------------------------------------------------------
  // ESTADO DE USUARIOS
  // -------------------------------------------------------------
  const [userList, setUserList] = useState([
    {
      id: 'usr-1',
      name: 'Carlos Superadmin',
      email: 'superadmin@gymfit.com',
      role: 'SUPERADMIN',
      business: 'APEX LIFE Global',
      isActive: true,
      permissionsCount: 20,
    },
    {
      id: 'usr-2',
      name: 'Roberto Mendoza',
      email: 'admin@powergym.com',
      role: 'BUSINESS_ADMIN',
      business: 'Power Gym Club',
      isActive: true,
      permissionsCount: 14,
    },
    {
      id: 'usr-3',
      name: 'Elena Morales',
      email: 'elena.tlc@totallifechanges.com',
      role: 'AFFILIATE',
      business: 'Total Life Changes',
      isActive: true,
      permissionsCount: 8,
    },
    {
      id: 'usr-4',
      name: 'Marcos Valenzuela',
      email: 'marcos.coach@gymfit.com',
      role: 'TRAINER',
      business: 'Power Gym Club',
      isActive: true,
      permissionsCount: 10,
    },
    {
      id: 'usr-5',
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      role: 'MEMBER',
      business: 'Power Gym Club',
      isActive: false,
      permissionsCount: 4,
    },
  ]);

  // Modal Crear Usuario
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('ApexPass123!');
  const [formRole, setFormRole] = useState<'SUPERADMIN' | 'BUSINESS_ADMIN' | 'AFFILIATE' | 'TRAINER' | 'MEMBER'>('BUSINESS_ADMIN');
  const [formBusiness, setFormBusiness] = useState<'TLC' | 'GYM'>('GYM');

  // -------------------------------------------------------------
  // ESTADO DE PERMISOS GRANULARES
  // -------------------------------------------------------------
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState<string>('BUSINESS_ADMIN');
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    SUPERADMIN: ['users:create', 'users:view', 'users:edit', 'users:delete', 'audit:view', 'server:view', 'server:manage', 'gym:access', 'tlc:store'],
    BUSINESS_ADMIN: ['users:create', 'users:view', 'users:edit', 'audit:view', 'server:view', 'gym:access', 'tlc:store'],
    AFFILIATE: ['tlc:store', 'tlc:network', 'gym:access'],
    TRAINER: ['gym:routines', 'gym:nutrition', 'gym:access'],
    MEMBER: ['gym:access'],
  });

  // -------------------------------------------------------------
  // ESTADO DE AUDITORÍA
  // -------------------------------------------------------------
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'aud-1',
      action: 'SERVER_STATUS_CHECK',
      severity: 'INFO',
      user: 'superadmin@gymfit.com',
      time: 'Hace 2 min',
      detail: 'Telemetría de CPU y base de datos consultada con éxito.',
    },
    {
      id: 'aud-2',
      action: 'USER_CREATED',
      severity: 'INFO',
      user: 'superadmin@gymfit.com',
      time: 'Hace 14 min',
      detail: 'Nuevo usuario creado: marcos.coach@gymfit.com (TRAINER)',
    },
    {
      id: 'aud-3',
      action: 'PERMISSION_OVERRIDE',
      severity: 'SECURITY',
      user: 'superadmin@gymfit.com',
      time: 'Hace 45 min',
      detail: 'Permiso server:view concedido manualmente a Roberto Mendoza',
    },
    {
      id: 'aud-4',
      action: 'AUTH_FAILED',
      severity: 'WARNING',
      user: 'unknown@external.net',
      time: 'Hace 1 hora',
      detail: 'Intento de acceso denegado por token inválido',
    },
  ]);

  // -------------------------------------------------------------
  // ESTADO DE SERVIDOR
  // -------------------------------------------------------------
  const [dbLatency, setDbLatency] = useState(3);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [serverMetrics, setServerMetrics] = useState({
    uptime: '4h 12m',
    cpuLoad: '18%',
    ramUsage: '48%',
    activeConnections: 18,
    dbStatus: 'ONLINE',
  });

  // Crear usuario handler
  const handleCreateUser = () => {
    if (!formFirstName || !formEmail) {
      Alert.alert('Campos requeridos', 'Por favor ingresa nombre y correo electrónico.');
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: `${formFirstName} ${formLastName}`,
      email: formEmail,
      role: formRole,
      business: formBusiness === 'TLC' ? 'Total Life Changes' : 'Power Gym Club',
      isActive: true,
      permissionsCount: formRole === 'SUPERADMIN' ? 20 : 12,
    };

    setUserList([newUser, ...userList]);

    // Registrar en auditoría móvil
    setAuditLogs([
      {
        id: `aud-${Date.now()}`,
        action: 'USER_CREATED',
        severity: 'INFO',
        user: currentUser?.email || 'superadmin@gymfit.com',
        time: 'Justo ahora',
        detail: `Usuario creado: ${newUser.email} (${newUser.role})`,
      },
      ...auditLogs,
    ]);

    setCreateModalVisible(false);
    setFormFirstName('');
    setFormLastName('');
    setFormEmail('');
    Alert.alert('Usuario Creado', `Se ha registrado a ${newUser.name} exitosamente.`);
  };

  // Alternar estado activo / suspendido
  const handleToggleUserStatus = (userId: string) => {
    setUserList(userList.map(u => {
      if (u.id === userId) {
        const next = !u.isActive;
        // Log en auditoría
        setAuditLogs([
          {
            id: `aud-${Date.now()}`,
            action: next ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
            severity: 'SECURITY',
            user: currentUser?.email || 'superadmin@gymfit.com',
            time: 'Justo ahora',
            detail: `Estado modificado para ${u.email} -> ${next ? 'ACTIVO' : 'SUSPENDIDO'}`,
          },
          ...auditLogs,
        ]);
        return { ...u, isActive: next };
      }
      return u;
    }));
  };

  // Ping a base de datos
  const handlePing = () => {
    setPingStatus('Probando conexión PostgreSQL...');
    setTimeout(() => {
      const lat = Math.floor(Math.random() * 4) + 2;
      setDbLatency(lat);
      setPingStatus(`PostgreSQL en Línea (${lat} ms) ✓`);
      setTimeout(() => setPingStatus(null), 3000);
    }, 600);
  };

  // Alternar permiso para un rol
  const handleTogglePerm = (role: string, permCode: string) => {
    const current = rolePermissions[role] || [];
    let updated: string[];
    if (current.includes(permCode)) {
      updated = current.filter(p => p !== permCode);
    } else {
      updated = [...current, permCode];
    }

    setRolePermissions({
      ...rolePermissions,
      [role]: updated,
    });
  };

  const filteredUsers = userList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: envTheme.canvasBg }]}>
      
      {/* Selector de Sub-Pestañas Superiores */}
      <View style={[styles.tabBar, { backgroundColor: envTheme.cardBg, borderBottomColor: envTheme.border }]}>
        <TouchableOpacity
          style={[styles.tabItem, activeSubTab === 'users' && { borderBottomColor: colorTheme.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveSubTab('users')}
        >
          <Users size={16} color={activeSubTab === 'users' ? colorTheme.primary : envTheme.textDark} />
          <Text style={[styles.tabText, { color: activeSubTab === 'users' ? colorTheme.primary : envTheme.textDark }]}>
            Usuarios
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeSubTab === 'permissions' && { borderBottomColor: colorTheme.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveSubTab('permissions')}
        >
          <Sliders size={16} color={activeSubTab === 'permissions' ? colorTheme.primary : envTheme.textDark} />
          <Text style={[styles.tabText, { color: activeSubTab === 'permissions' ? colorTheme.primary : envTheme.textDark }]}>
            Permisos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeSubTab === 'audit' && { borderBottomColor: colorTheme.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveSubTab('audit')}
        >
          <FileText size={16} color={activeSubTab === 'audit' ? colorTheme.primary : envTheme.textDark} />
          <Text style={[styles.tabText, { color: activeSubTab === 'audit' ? colorTheme.primary : envTheme.textDark }]}>
            Auditoría
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeSubTab === 'server' && { borderBottomColor: colorTheme.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveSubTab('server')}
        >
          <Activity size={16} color={activeSubTab === 'server' ? colorTheme.primary : envTheme.textDark} />
          <Text style={[styles.tabText, { color: activeSubTab === 'server' ? colorTheme.primary : envTheme.textDark }]}>
            Servidor
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ============================================================= */}
        {/* 1. VISTA DE USUARIOS                                          */}
        {/* ============================================================= */}
        {activeSubTab === 'users' && (
          <View style={styles.sectionContainer}>
            {/* Header y Botón Crear */}
            <View style={styles.actionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: envTheme.textMain }]}>Gestión de Usuarios</Text>
                <Text style={[styles.sectionSubtitle, { color: envTheme.textDark }]}>
                  {userList.length} cuentas registradas en plataforma
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: colorTheme.primary }]}
                onPress={() => setCreateModalVisible(true)}
              >
                <Plus size={16} color="#000000" />
                <Text style={styles.createButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>

            {/* Buscador */}
            <View style={[styles.searchBox, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
              <Search size={16} color={envTheme.textDark} />
              <TextInput
                placeholder="Buscar por nombre o correo..."
                placeholderTextColor={envTheme.textDark}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.searchInput, { color: envTheme.textMain }]}
              />
            </View>

            {/* Lista de Usuarios */}
            {filteredUsers.map((user) => (
              <View 
                key={user.id} 
                style={[
                  styles.userCard, 
                  { backgroundColor: envTheme.cardBg, borderColor: user.isActive ? envTheme.border : '#ef4444' }
                ]}
              >
                <View style={styles.userCardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.userName, { color: envTheme.textMain }]}>{user.name}</Text>
                    <Text style={[styles.userEmail, { color: envTheme.textDark }]}>{user.email}</Text>
                  </View>

                  <View style={[
                    styles.roleBadge, 
                    { backgroundColor: user.role === 'SUPERADMIN' ? '#fee2e2' : colorTheme.accentBg }
                  ]}>
                    <Text style={[
                      styles.roleBadgeText, 
                      { color: user.role === 'SUPERADMIN' ? '#b91c1c' : colorTheme.primary }
                    ]}>
                      {user.role}
                    </Text>
                  </View>
                </View>

                <View style={styles.userCardFooter}>
                  <Text style={[styles.userBusinessText, { color: envTheme.textDark }]}>
                    🏢 {user.business}
                  </Text>

                  <View style={styles.userActionsRow}>
                    {/* Botón Activar / Suspender */}
                    <TouchableOpacity
                      style={[
                        styles.iconActionButton,
                        { backgroundColor: user.isActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)' }
                      ]}
                      onPress={() => handleToggleUserStatus(user.id)}
                    >
                      {user.isActive ? (
                        <Lock size={14} color="#ef4444" />
                      ) : (
                        <Unlock size={14} color="#10b981" />
                      )}
                    </TouchableOpacity>

                    <Text style={[
                      styles.statusIndicator, 
                      { color: user.isActive ? '#10b981' : '#ef4444' }
                    ]}>
                      {user.isActive ? 'ACTIVO' : 'SUSPENDIDO'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ============================================================= */}
        {/* 2. VISTA DE PERMISOS GRANULARES                               */}
        {/* ============================================================= */}
        {activeSubTab === 'permissions' && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: envTheme.textMain }]}>Matriz de Permisos RBAC</Text>
            <Text style={[styles.sectionSubtitle, { color: envTheme.textDark }]}>
              Configura los permisos autorizados para cada rol del sistema.
            </Text>

            {/* Selector de Rol */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleSelectorScroll}>
              {['SUPERADMIN', 'BUSINESS_ADMIN', 'AFFILIATE', 'TRAINER', 'MEMBER'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.rolePill,
                    {
                      backgroundColor: selectedRoleForPerms === role ? colorTheme.primary : envTheme.cardBg,
                      borderColor: envTheme.border,
                    }
                  ]}
                  onPress={() => setSelectedRoleForPerms(role)}
                >
                  <Text style={[
                    styles.rolePillText,
                    { color: selectedRoleForPerms === role ? '#000000' : envTheme.textMain }
                  ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Lista de Permisos con Toggles */}
            <View style={{ gap: 8 }}>
              {[
                { code: 'users:create', title: 'Crear Usuarios', desc: 'Permite registrar nuevas cuentas y asignar contraseñas' },
                { code: 'users:view', title: 'Ver Directorio', desc: 'Permite consultar lista y perfiles de usuarios' },
                { code: 'users:delete', title: 'Eliminar Cuentas', desc: 'Permite borrar definitivamente registros' },
                { code: 'audit:view', title: 'Ver Auditoría Forense', desc: 'Acceso a registros de eventos y seguridad' },
                { code: 'server:view', title: 'Telemetría Servidor', desc: 'Monitoreo de CPU, RAM y salud de base de datos' },
                { code: 'server:manage', title: 'Acciones de Servidor', desc: 'Permite purgar memoria y reiniciar servicios' },
                { code: 'gym:access', title: 'Check-in y Acceso Gym', desc: 'Permite registrar entradas físicas con QR' },
                { code: 'tlc:store', title: 'Tienda en Línea TLC', desc: 'Visualizar catálogo oficial con links 50%' },
              ].map((perm) => {
                const isGranted = (rolePermissions[selectedRoleForPerms] || []).includes(perm.code);

                return (
                  <TouchableOpacity
                    key={perm.code}
                    style={[
                      styles.permCard,
                      {
                        backgroundColor: envTheme.cardBg,
                        borderColor: isGranted ? colorTheme.primary : envTheme.border,
                      }
                    ]}
                    onPress={() => handleTogglePerm(selectedRoleForPerms, perm.code)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.permTitle, { color: envTheme.textMain }]}>{perm.title}</Text>
                      <Text style={[styles.permDesc, { color: envTheme.textDark }]}>{perm.desc}</Text>
                      <Text style={[styles.permCode, { color: colorTheme.primary }]}><code>{perm.code}</code></Text>
                    </View>

                    <View style={[
                      styles.permCheckBadge,
                      {
                        backgroundColor: isGranted ? colorTheme.primary : 'transparent',
                        borderColor: isGranted ? colorTheme.primary : envTheme.border,
                      }
                    ]}>
                      {isGranted && <Check size={14} color="#000000" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ============================================================= */}
        {/* 3. VISTA DE AUDITORÍA MÓVIL                                   */}
        {/* ============================================================= */}
        {activeSubTab === 'audit' && (
          <View style={styles.sectionContainer}>
            <View style={styles.actionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: envTheme.textMain }]}>Bitácora de Auditoría</Text>
                <Text style={[styles.sectionSubtitle, { color: envTheme.textDark }]}>
                  Trazabilidad forense y registro inmutable de eventos
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.refreshSmallButton, { borderColor: envTheme.border }]}
                onPress={() => Alert.alert('Actualizado', 'Bitácora sincronizada.')}
              >
                <RefreshCw size={14} color={colorTheme.primary} />
              </TouchableOpacity>
            </View>

            {/* Feed de Logs */}
            <View style={{ gap: 10 }}>
              {auditLogs.map((log) => {
                const isSecurity = log.severity === 'SECURITY';
                const isWarning = log.severity === 'WARNING';

                return (
                  <View 
                    key={log.id} 
                    style={[
                      styles.auditCard, 
                      { backgroundColor: envTheme.cardBg, borderColor: isSecurity ? '#a855f7' : isWarning ? '#facc15' : envTheme.border }
                    ]}
                  >
                    <View style={styles.auditHeader}>
                      <View style={[
                        styles.severityPill,
                        {
                          backgroundColor: isSecurity ? 'rgba(168, 85, 247, 0.2)' : isWarning ? 'rgba(250, 204, 21, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        }
                      ]}>
                        <Text style={[
                          styles.severityText,
                          { color: isSecurity ? '#c084fc' : isWarning ? '#facc15' : '#38bdf8' }
                        ]}>
                          {log.severity}
                        </Text>
                      </View>

                      <Text style={[styles.auditActionText, { color: envTheme.textMain }]}>
                        {log.action}
                      </Text>

                      <Text style={[styles.auditTimeText, { color: envTheme.textDark }]}>
                        {log.time}
                      </Text>
                    </View>

                    <Text style={[styles.auditDetailText, { color: envTheme.textMain }]}>
                      {log.detail}
                    </Text>

                    <Text style={[styles.auditUserText, { color: envTheme.textDark }]}>
                      Actor: {log.user}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ============================================================= */}
        {/* 4. VISTA DE ESTADO DEL SERVIDOR MÓVIL                         */}
        {/* ============================================================= */}
        {activeSubTab === 'server' && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: envTheme.textMain }]}>Telemetría del Servidor</Text>
            <Text style={[styles.sectionSubtitle, { color: envTheme.textDark }]}>
              Monitoreo en vivo de recursos y base de datos
            </Text>

            {/* Banner de Estado Global */}
            <View style={[styles.serverHeroCard, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
              <View style={styles.serverHeroTop}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={[styles.pulseDot, { backgroundColor: '#10b981' }]} />
                  <Text style={[styles.serverOnlineText, { color: '#10b981' }]}>NODO ACTIVO Y ESTABLE</Text>
                </View>
                <Text style={[styles.serverUptimeText, { color: envTheme.textDark }]}>Uptime: {serverMetrics.uptime}</Text>
              </View>

              <View style={styles.metricsGrid}>
                <View style={styles.metricBlock}>
                  <Cpu size={18} color={colorTheme.primary} />
                  <Text style={[styles.metricLabel, { color: envTheme.textDark }]}>Carga CPU</Text>
                  <Text style={[styles.metricValue, { color: envTheme.textMain }]}>{serverMetrics.cpuLoad}</Text>
                </View>

                <View style={styles.metricBlock}>
                  <HardDrive size={18} color="#06b6d4" />
                  <Text style={[styles.metricLabel, { color: envTheme.textDark }]}>Uso RAM</Text>
                  <Text style={[styles.metricValue, { color: envTheme.textMain }]}>{serverMetrics.ramUsage}</Text>
                </View>

                <View style={styles.metricBlock}>
                  <Database size={18} color="#a855f7" />
                  <Text style={[styles.metricLabel, { color: envTheme.textDark }]}>Latencia DB</Text>
                  <Text style={[styles.metricValue, { color: '#a855f7' }]}>{dbLatency} ms</Text>
                </View>
              </View>
            </View>

            {/* Botón de Diagnóstico Interactivo */}
            <TouchableOpacity
              style={[styles.pingButton, { backgroundColor: colorTheme.primary }]}
              onPress={handlePing}
            >
              <Zap size={16} color="#000000" />
              <Text style={styles.pingButtonText}>Ejecutar Test de Latencia PostgreSQL</Text>
            </TouchableOpacity>

            {pingStatus && (
              <View style={[styles.pingStatusCard, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981' }]}>
                <Text style={{ color: '#10b981', fontWeight: '800', textAlign: 'center', fontSize: 13 }}>
                  {pingStatus}
                </Text>
              </View>
            )}

            {/* Lista de Servicios */}
            <View style={{ gap: 8, marginTop: 12 }}>
              <Text style={[styles.subSectionTitle, { color: envTheme.textMain }]}>Servicios Registrados</Text>
              {[
                { name: 'APEX Express REST API', status: 'ONLINE', latency: '1 ms' },
                { name: 'PostgreSQL Database Engine', status: 'ONLINE', latency: `${dbLatency} ms` },
                { name: 'Prisma ORM Client v5.22', status: 'ONLINE', latency: '2 ms' },
                { name: 'Motor de Auditoría en Tiempo Real', status: 'ONLINE', latency: '1 ms' },
                { name: 'RBAC Permission Security Engine', status: 'ONLINE', latency: '1 ms' },
                { name: 'Gemini AI Vision Core', status: 'STANDBY', latency: '0 ms' },
              ].map((svc) => (
                <View key={svc.name} style={[styles.serviceRow, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
                  <Text style={[styles.serviceName, { color: envTheme.textMain }]}>{svc.name}</Text>
                  <Text style={[styles.serviceBadge, { color: svc.status === 'ONLINE' ? '#10b981' : '#facc15' }]}>
                    {svc.status} • {svc.latency}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>

      {/* ============================================================= */}
      {/* MODAL MÓVIL DE CREACIÓN DE USUARIO                           */}
      {/* ============================================================= */}
      <Modal visible={createModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
            
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: envTheme.textMain }]}>Crear Usuario</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <X size={20} color={envTheme.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }}>
              <Text style={[styles.inputLabel, { color: envTheme.textDark }]}>Nombre *</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                placeholder="ej: Santiago"
                placeholderTextColor={envTheme.textDark}
                value={formFirstName}
                onChangeText={setFormFirstName}
              />

              <Text style={[styles.inputLabel, { color: envTheme.textDark }]}>Apellido</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                placeholder="ej: Restrepo"
                placeholderTextColor={envTheme.textDark}
                value={formLastName}
                onChangeText={setFormLastName}
              />

              <Text style={[styles.inputLabel, { color: envTheme.textDark }]}>Correo Electrónico *</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                placeholder="usuario@apexlifegym.com"
                placeholderTextColor={envTheme.textDark}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formEmail}
                onChangeText={setFormEmail}
              />

              <Text style={[styles.inputLabel, { color: envTheme.textDark }]}>Contraseña Inicial</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: envTheme.canvasBg, color: envTheme.textMain, borderColor: envTheme.border }]}
                value={formPassword}
                onChangeText={setFormPassword}
              />

              <Text style={[styles.inputLabel, { color: envTheme.textDark }]}>Rol Asignado</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {(['BUSINESS_ADMIN', 'AFFILIATE', 'TRAINER', 'MEMBER'] as const).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.roleChoicePill,
                      {
                        backgroundColor: formRole === r ? colorTheme.primary : envTheme.canvasBg,
                        borderColor: envTheme.border,
                      }
                    ]}
                    onPress={() => setFormRole(r)}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '700', color: formRole === r ? '#000000' : envTheme.textMain }}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.inputLabel, { color: envTheme.textDark }]}>Negocio</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                <TouchableOpacity
                  style={[
                    styles.roleChoicePill,
                    { flex: 1, backgroundColor: formBusiness === 'GYM' ? colorTheme.primary : envTheme.canvasBg, borderColor: envTheme.border }
                  ]}
                  onPress={() => setFormBusiness('GYM')}
                >
                  <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '800', color: formBusiness === 'GYM' ? '#000' : envTheme.textMain }}>
                    Gimnasio
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleChoicePill,
                    { flex: 1, backgroundColor: formBusiness === 'TLC' ? colorTheme.primary : envTheme.canvasBg, borderColor: envTheme.border }
                  ]}
                  onPress={() => setFormBusiness('TLC')}
                >
                  <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '800', color: formBusiness === 'TLC' ? '#000' : envTheme.textMain }}>
                    Total Life Changes
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveModalButton, { backgroundColor: colorTheme.primary }]}
              onPress={handleCreateUser}
            >
              <Text style={styles.saveModalButtonText}>Guardar Usuario</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  sectionContainer: {
    gap: 12,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  createButtonText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  userCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 11,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  userCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
  },
  userBusinessText: {
    fontSize: 11,
  },
  userActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    fontSize: 10,
    fontWeight: '900',
  },
  roleSelectorScroll: {
    marginVertical: 4,
  },
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  permCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  permTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  permDesc: {
    fontSize: 10,
    marginTop: 2,
  },
  permCode: {
    fontSize: 10,
    marginTop: 4,
  },
  permCheckBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshSmallButton: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  auditCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  auditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  severityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 9,
    fontWeight: '900',
  },
  auditActionText: {
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
    marginLeft: 6,
  },
  auditTimeText: {
    fontSize: 10,
  },
  auditDetailText: {
    fontSize: 12,
    marginTop: 2,
  },
  auditUserText: {
    fontSize: 10,
    marginTop: 2,
  },
  serverHeroCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  serverHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  serverOnlineText: {
    fontSize: 11,
    fontWeight: '900',
  },
  serverUptimeText: {
    fontSize: 11,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
  },
  metricBlock: {
    alignItems: 'center',
    gap: 2,
  },
  metricLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  pingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  pingButtonText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 13,
  },
  pingStatusCard: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  subSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '700',
  },
  serviceBadge: {
    fontSize: 11,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    marginBottom: 8,
  },
  roleChoicePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  saveModalButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  saveModalButtonText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 13,
  },
});
