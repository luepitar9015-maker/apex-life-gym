import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { 
  QrCode, 
  Dumbbell, 
  Flame, 
  Trophy, 
  ChevronRight, 
  Sparkles,
  Users,
  ShieldCheck,
  Activity,
  ArrowRight
} from 'lucide-react-native';
import { useTheme } from '../styles/themeConfig';
import { MobileUser } from '../components/MobileHeader';

interface HomeScreenProps {
  currentUser: MobileUser;
  onNavigateTab: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ currentUser, onNavigateTab }) => {
  const { colorTheme, envTheme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: envTheme.canvasBg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* HERO BANNER ESTILO NEXO VIBRANTE */}
      <View style={[styles.heroBanner, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
        <Text style={[styles.watermark, { color: colorTheme.primaryGlow }]}>GYM-VIP</Text>

        <View style={styles.badgeRow}>
          <View style={[styles.pillBadge, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
            <ShieldCheck size={12} color={colorTheme.primary} />
            <Text style={[styles.pillBadgeText, { color: colorTheme.primary }]}>MEMBRESÍA ACTIVA</Text>
          </View>
          <View style={[styles.pillBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
            <Flame size={12} color="#f59e0b" />
            <Text style={{ color: '#f59e0b', fontSize: 10, fontWeight: '800' }}>4 DÍAS DE RACHA</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: envTheme.textMain }]}>
          Pase Digital & <Text style={{ color: colorTheme.primary }}>Control de Acceso</Text>
        </Text>
        <Text style={[styles.subtitle, { color: envTheme.textMuted }]}>
          Presenta tu código QR en el torniquete inteligente para ingresar y registrar asistencia.
        </Text>

        {/* WIDGET DE AFORO EN VIVO */}
        <View style={[styles.capacityWidget, { backgroundColor: 'rgba(0,0,0,0.4)', borderColor: colorTheme.primary }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Users size={15} color={colorTheme.primary} />
            <Text style={{ color: envTheme.textMain, fontSize: 12, fontWeight: '700' }}>Aforo Sala Central:</Text>
          </View>
          <Text style={{ color: colorTheme.primary, fontSize: 13, fontWeight: '800' }}>38 / 100 personas (38%)</Text>
        </View>
      </View>

      {/* CARNET DIGITAL QR HOLOGRÁFICO */}
      <View style={[styles.qrCard, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
        <View style={styles.qrCardHeader}>
          <View>
            <Text style={[styles.planTitle, { color: envTheme.textMain }]}>PLAN BLACK VIP + IA</Text>
            <Text style={[styles.planSubtitle, { color: envTheme.textMuted }]}>
              {currentUser.name} • Socio Activo
            </Text>
          </View>
          <View style={[styles.activeTag, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
            <Text style={[styles.activeTagText, { color: colorTheme.primary }]}>VIP PASS</Text>
          </View>
        </View>

        {/* Caja de Código QR con Borde de Neón */}
        <View style={[styles.qrCodeBox, { borderColor: colorTheme.primary }]}>
          <View style={styles.qrSimulated}>
            <QrCode size={130} color="#070a12" />
          </View>
          <Text style={styles.qrInstruction}>Muestra este código frente al escáner óptico</Text>
        </View>

        <View style={styles.qrCardFooter}>
          <Text style={[styles.expiryLabel, { color: envTheme.textMuted }]}>
            Vigencia: <Text style={{ color: '#fff', fontWeight: '800' }}>15 Octubre 2026</Text>
          </Text>
          <Text style={[styles.memberId, { color: colorTheme.primary }]}>ID: #1098765432</Text>
        </View>
      </View>

      {/* ATAJO AL ENTRENAMIENTO DEL DÍA */}
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Dumbbell size={16} color={colorTheme.primary} />
          <Text style={[styles.sectionTitle, { color: envTheme.textMain }]}>Rutina de Hoy</Text>
        </View>
        <TouchableOpacity onPress={() => onNavigateTab('workout')}>
          <Text style={[styles.seeAllText, { color: colorTheme.primary }]}>Comenzar Sesión</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.workoutCard, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}
        onPress={() => onNavigateTab('workout')}
      >
        <View style={[styles.workoutIconBox, { backgroundColor: colorTheme.accentBg }]}>
          <Dumbbell size={22} color={colorTheme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.workoutDayName, { color: envTheme.textMain }]}>Día 1: Empuje (Push)</Text>
          <Text style={[styles.workoutDaySub, { color: envTheme.textMuted }]}>
            Pecho, Hombro y Tríceps • 5 Ejercicios con Timer
          </Text>
        </View>
        <ChevronRight size={18} color={colorTheme.primary} />
      </TouchableOpacity>

      {/* SNAPSHOT BIOMÉTRICO IA */}
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Sparkles size={16} color={colorTheme.primary} />
          <Text style={[styles.sectionTitle, { color: envTheme.textMain }]}>Último Escaneo Biométrico (IA)</Text>
        </View>
        <TouchableOpacity onPress={() => onNavigateTab('aiscan')}>
          <Text style={[styles.seeAllText, { color: colorTheme.primary }]}>Ver Detalle</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.aiSnapshotCard, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
        <View style={styles.aiStatItem}>
          <Text style={[styles.aiStatValue, { color: colorTheme.primary }]}>16.2%</Text>
          <Text style={[styles.aiStatLabel, { color: envTheme.textMuted }]}>Grasa Corporal</Text>
        </View>
        <View style={[styles.aiDivider, { backgroundColor: envTheme.border }]} />
        <View style={styles.aiStatItem}>
          <Text style={[styles.aiStatValue, { color: '#38bdf8' }]}>65.8 kg</Text>
          <Text style={[styles.aiStatLabel, { color: envTheme.textMuted }]}>Masa Magra</Text>
        </View>
        <View style={[styles.aiDivider, { backgroundColor: envTheme.border }]} />
        <View style={styles.aiStatItem}>
          <Text style={[styles.aiStatValue, { color: '#f59e0b' }]}>92/100</Text>
          <Text style={[styles.aiStatLabel, { color: envTheme.textMuted }]}>Score Postural</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 90,
  },
  heroBanner: {
    position: 'relative',
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    top: 6,
    right: 8,
    fontSize: 40,
    fontWeight: '900',
    opacity: 0.12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  pillBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  capacityWidget: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  qrCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 18,
  },
  qrCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  planSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  activeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  qrCodeBox: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 2,
  },
  qrSimulated: {
    marginBottom: 8,
  },
  qrInstruction: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  qrCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  expiryLabel: {
    fontSize: 11,
  },
  memberId: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  workoutCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  workoutIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutDayName: {
    fontSize: 14,
    fontWeight: '800',
  },
  workoutDaySub: {
    fontSize: 11,
    marginTop: 2,
  },
  aiSnapshotCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  aiStatItem: {
    alignItems: 'center',
  },
  aiStatValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  aiStatLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  aiDivider: {
    width: 1,
    height: 30,
  },
});
