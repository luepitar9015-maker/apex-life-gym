import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { QrCode, Dumbbell, Flame, Trophy, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { theme } from '../styles/theme';

interface HomeScreenProps {
  onNavigateTab: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateTab }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Profile */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeText}>¡A entrenar!</Text>
            <Text style={styles.nameText}>Juan Pérez</Text>
          </View>
        </View>

        <View style={styles.streakBadge}>
          <Flame size={16} color="#f59e0b" />
          <Text style={styles.streakText}>4 días seguidos</Text>
        </View>
      </View>

      {/* Digital Access Pass (Carnet QR) */}
      <View style={styles.qrCard}>
        <View style={styles.qrCardHeader}>
          <View>
            <Text style={styles.planTitle}>PLAN BLACK VIP + IA</Text>
            <Text style={styles.planSubtitle}>Acceso Total Gym & Biometría</Text>
          </View>
          <View style={styles.activeTag}>
            <Text style={styles.activeTagText}>ACTIVO</Text>
          </View>
        </View>

        {/* QR Code Container */}
        <View style={styles.qrCodeBox}>
          <View style={styles.qrSimulated}>
            <QrCode size={110} color="#070a12" />
          </View>
          <Text style={styles.qrInstruction}>Muestra este código frente al torniquete</Text>
        </View>

        <View style={styles.qrCardFooter}>
          <Text style={styles.expiryLabel}>Válido hasta: <Text style={styles.expiryDate}>15 Oct 2026</Text></Text>
          <Text style={styles.memberId}>ID: #1098765432</Text>
        </View>
      </View>

      {/* Today Workout Shortcut */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Entrenamiento de Hoy</Text>
        <TouchableOpacity onPress={() => onNavigateTab('workout')}>
          <Text style={styles.seeAllText}>Comenzar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.workoutCard} onPress={() => onNavigateTab('workout')}>
        <View style={styles.workoutIconBox}>
          <Dumbbell size={24} color="#10b981" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.workoutDayName}>Día 1: Empuje (Push)</Text>
          <Text style={styles.workoutDaySub}>Pecho, Hombro y Tríceps • 5 Ejercicios</Text>
        </View>
        <ChevronRight size={20} color="#94a3b8" />
      </TouchableOpacity>

      {/* AI Body Status Snapshot */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tu Diagnóstico Biométrico (IA)</Text>
        <TouchableOpacity onPress={() => onNavigateTab('aiscan')}>
          <Text style={styles.seeAllText}>Ver Ficha</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.aiSnapshotCard}>
        <View style={styles.aiStatItem}>
          <Text style={styles.aiStatValue}>16.2%</Text>
          <Text style={styles.aiStatLabel}>% Grasa Corporal</Text>
        </View>
        <View style={styles.aiDivider} />
        <View style={styles.aiStatItem}>
          <Text style={styles.aiStatValue}>65.8 kg</Text>
          <Text style={styles.aiStatLabel}>Masa Muscular Magra</Text>
        </View>
        <View style={styles.aiDivider} />
        <View style={styles.aiStatItem}>
          <Text style={styles.aiStatValue}>92/100</Text>
          <Text style={styles.aiStatLabel}>Score Postural</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgDark,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingTop: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  welcomeText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  streakText: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '700',
  },
  qrCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: theme.spacing.lg,
  },
  qrCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  planSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  activeTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  activeTagText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '800',
  },
  qrCodeBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginVertical: 8,
  },
  qrSimulated: {
    marginBottom: 8,
  },
  qrInstruction: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },
  qrCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  expiryLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  expiryDate: {
    color: '#fff',
    fontWeight: '700',
  },
  memberId: {
    color: theme.colors.textDark,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  seeAllText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  workoutCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  workoutIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutDayName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  workoutDaySub: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  aiSnapshotCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.md,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  aiStatItem: {
    alignItems: 'center',
  },
  aiStatValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  aiStatLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  aiDivider: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.border,
  },
});
