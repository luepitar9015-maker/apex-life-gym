import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { 
  Users, 
  DollarSign, 
  Award, 
  Flame, 
  CheckCircle2, 
  Circle, 
  ArrowUpRight, 
  ShoppingBag, 
  Leaf, 
  Calendar,
  Sparkles,
  TrendingUp,
  Video
} from 'lucide-react-native';
import { useTheme } from '../styles/themeConfig';
import { MobileUser } from '../components/MobileHeader';

interface TLCHubScreenProps {
  currentUser: MobileUser;
  onNavigateTab: (tab: string) => void;
}

export const TLCHubScreen: React.FC<TLCHubScreenProps> = ({ currentUser, onNavigateTab }) => {
  const { colorTheme, envTheme } = useTheme();

  const [challengeDays, setChallengeDays] = useState([
    { day: 1, completed: true, weight: 78.5 },
    { day: 2, completed: true, weight: 78.0 },
    { day: 3, completed: true, weight: 77.4 },
    { day: 4, completed: true, weight: 77.1 },
    { day: 5, completed: true, weight: 76.8 },
    { day: 6, completed: true, weight: 76.2 },
    { day: 7, completed: true, weight: 75.8 },
    { day: 8, completed: true, weight: 75.5 },
    { day: 9, completed: true, weight: 75.1 },
    { day: 10, completed: true, weight: 74.8 },
    { day: 11, completed: true, weight: 74.5 },
    { day: 12, completed: false, weight: 74.3 },
  ]);

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Taza de Iaso Tea tibio en ayunas', done: true },
    { id: 2, text: '10 gotas Resolution Drops 15 min antes de almorzar', done: true },
    { id: 3, text: 'Consumo mínimo de 3 Litros de agua purificada', done: true },
    { id: 4, text: 'Sin harinas refinadas ni azúcares añadidos', done: false },
    { id: 5, text: 'Cucharada de NutraBurst con la cena', done: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(prev =>
      prev.map(c => (c.id === id ? { ...c, done: !c.done } : c))
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: envTheme.canvasBg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero Banner Nexo TLC */}
      <View style={[styles.heroBanner, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
        <Text style={[styles.watermark, { color: colorTheme.primaryGlow }]}>TLC-NET</Text>

        <View style={styles.badgeRow}>
          <View style={[styles.pillBadge, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
            <Leaf size={12} color={colorTheme.primary} />
            <Text style={[styles.pillBadgeText, { color: colorTheme.primary }]}>RED DE AFILIADOS TLC</Text>
          </View>
          <View style={[styles.pillBadge, { backgroundColor: 'rgba(234, 179, 8, 0.15)', borderColor: 'rgba(234, 179, 8, 0.4)' }]}>
            <Award size={12} color="#eab308" />
            <Text style={{ color: '#eab308', fontSize: 10, fontWeight: '800' }}>DIRECTOR NACIONAL</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: envTheme.textMain }]}>
          Billetera de Comisiones & <Text style={{ color: colorTheme.primary }}>Reto Détox</Text>
        </Text>
        <Text style={[styles.subtitle, { color: envTheme.textMuted }]}>
          Monitorea tus comisiones por ventas directas del 50% ($20 USD/producto) y el avance de tu equipo.
        </Text>

        {/* Resumen Financiero Rápido */}
        <View style={[styles.financialCard, { backgroundColor: 'rgba(0,0,0,0.4)', borderColor: colorTheme.primary }]}>
          <View style={styles.finCol}>
            <Text style={styles.finLabel}>Ganancias Retail (50%)</Text>
            <Text style={[styles.finAmount, { color: colorTheme.primary }]}>$14,892.45 USD</Text>
            <Text style={styles.finSub}>+ $120 USD hoy</Text>
          </View>
          <View style={[styles.finDivider, { backgroundColor: envTheme.border }]} />
          <View style={styles.finCol}>
            <Text style={styles.finLabel}>Volumen de Puntos</Text>
            <Text style={[styles.finAmount, { color: '#38bdf8' }]}>12,500 PV</Text>
            <Text style={styles.finSub}>Meta: 15,000 PV</Text>
          </View>
        </View>

        {/* Acceso Rápido a Tienda TLC */}
        <TouchableOpacity
          style={[styles.storeDirectBtn, { backgroundColor: colorTheme.primary }]}
          onPress={() => onNavigateTab('tlc_store')}
        >
          <ShoppingBag size={16} color="#000000" />
          <Text style={styles.storeDirectText}>Ir a la Tienda en Línea & Compartir Link</Text>
          <ArrowUpRight size={16} color="#000000" />
        </TouchableOpacity>

        {/* Acceso a Estudio de Video Marketing IA */}
        <TouchableOpacity
          style={[styles.storeDirectBtn, { backgroundColor: 'rgba(168, 85, 247, 0.25)', borderColor: '#a855f7', borderWidth: 1, marginTop: 8 }]}
          onPress={() => onNavigateTab('tlc_video_ai')}
        >
          <Video size={16} color="#c084fc" />
          <Text style={[styles.storeDirectText, { color: '#c084fc' }]}>Crear Videos Virales con IA (TikTok / Reels)</Text>
          <ArrowUpRight size={16} color="#c084fc" />
        </TouchableOpacity>
      </View>

      {/* SECCIÓN: RETO DÉTOX 15/30 DÍAS */}
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Flame size={18} color="#f97316" />
          <Text style={[styles.sectionTitle, { color: envTheme.textMain }]}>Reto Détox • Día 12 de 30</Text>
        </View>
        <View style={[styles.kilosTag, { backgroundColor: colorTheme.accentBg }]}>
          <Text style={[styles.kilosTagText, { color: colorTheme.primary }]}>-4.2 kg Perdidos</Text>
        </View>
      </View>

      {/* Checklist Diario */}
      <View style={[styles.checklistCard, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
        <Text style={[styles.checklistTitle, { color: colorTheme.primary }]}>
          Checklist Diario de Protocolo
        </Text>
        {checklist.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.checkItem, { borderColor: 'rgba(255, 255, 255, 0.05)' }]}
            onPress={() => toggleCheck(item.id)}
          >
            {item.done ? (
              <CheckCircle2 size={18} color={colorTheme.primary} />
            ) : (
              <Circle size={18} color={envTheme.textDark} />
            )}
            <Text
              style={[
                styles.checkText,
                { color: item.done ? envTheme.textMain : envTheme.textMuted },
                item.done && styles.checkTextDone,
              ]}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Historial de Peso de los Últimos Días */}
      <View style={[styles.progressCard, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
        <View style={styles.progressHeader}>
          <TrendingUp size={16} color={colorTheme.primary} />
          <Text style={[styles.progressTitle, { color: envTheme.textMain }]}>Evolución de Peso</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
          {challengeDays.map((d) => (
            <View
              key={d.day}
              style={[
                styles.dayBubble,
                {
                  backgroundColor: d.completed ? colorTheme.accentBg : 'rgba(255, 255, 255, 0.03)',
                  borderColor: d.completed ? colorTheme.primary : 'rgba(255, 255, 255, 0.08)',
                },
              ]}
            >
              <Text style={{ fontSize: 10, color: d.completed ? colorTheme.primary : '#64748b', fontWeight: '800' }}>
                DÍA {d.day}
              </Text>
              <Text style={{ fontSize: 12, color: '#fff', fontWeight: '800', marginTop: 2 }}>
                {d.weight} kg
              </Text>
            </View>
          ))}
        </ScrollView>
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
    marginBottom: 14,
  },
  financialCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  finCol: {
    flex: 1,
    alignItems: 'center',
  },
  finLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 2,
  },
  finAmount: {
    fontSize: 17,
    fontWeight: '900',
  },
  finSub: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  finDivider: {
    width: 1,
    height: '100%',
  },
  storeDirectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  storeDirectText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  kilosTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  kilosTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  checklistCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    gap: 8,
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: 0.8,
  },
  checkText: {
    fontSize: 12,
    flex: 1,
  },
  checkTextDone: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  progressCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  daysScroll: {
    gap: 8,
  },
  dayBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
});
