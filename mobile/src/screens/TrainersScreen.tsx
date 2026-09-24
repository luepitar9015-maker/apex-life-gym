import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, Alert } from 'react-native';
import { 
  ShieldCheck, 
  MessageCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star, 
  Sparkles,
  Phone,
  Award
} from 'lucide-react-native';
import { useTheme } from '../styles/themeConfig';

export const TrainersScreen: React.FC = () => {
  const { colorTheme, envTheme } = useTheme();

  const handleOpenCoachWhatsApp = () => {
    const coachPhone = '+573109988776';
    const message = 'Hola Coach Marcos! Tengo una duda sobre mi rutina de hoy en Gym Fit AI.';
    const url = `whatsapp://send?phone=${coachPhone}&text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) Linking.openURL(url);
        else Alert.alert('Chat con Coach', `Contactando a Marcos Valenzuela al ${coachPhone}`);
      })
      .catch(() => Alert.alert('Chat con Coach', `Contactando al Coach Marcos`));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: envTheme.canvasBg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero Banner Nexo Coach */}
      <View style={[styles.heroBanner, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
        <Text style={[styles.watermark, { color: colorTheme.primaryGlow }]}>COACH</Text>

        <View style={styles.badgeRow}>
          <View style={[styles.pillBadge, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
            <ShieldCheck size={12} color={colorTheme.primary} />
            <Text style={[styles.pillBadgeText, { color: colorTheme.primary }]}>COACHING PERSONALIZADO 1-ON-1</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: envTheme.textMain }]}>
          Tu Entrenador <Text style={{ color: colorTheme.primary }}>Asignado</Text>
        </Text>
        <Text style={[styles.subtitle, { color: envTheme.textMuted }]}>
          Supervisión directa de técnica, sobrecarga progresiva y ajustes metabólicos continuos.
        </Text>

        {/* Ficha del Entrenador */}
        <View style={[styles.coachCard, { backgroundColor: 'rgba(0,0,0,0.3)', borderColor: envTheme.border }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' }}
            style={[styles.coachAvatar, { borderColor: colorTheme.primary }]}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.coachName, { color: envTheme.textMain }]}>Marcos Valenzuela</Text>
              <View style={styles.starsRow}>
                <Star size={12} color="#eab308" fill="#eab308" />
                <Text style={{ fontSize: 11, color: '#eab308', fontWeight: '800' }}>4.98</Text>
              </View>
            </View>
            <Text style={[styles.coachSpecialty, { color: colorTheme.primary }]}>
              Especialista en Hipertrofia & Biomecánica
            </Text>
            <Text style={{ fontSize: 10, color: envTheme.textMuted, marginTop: 2 }}>
              Certificación NSCA-CPT • 8 años de experiencia
            </Text>
          </View>
        </View>

        {/* Botón Chat Directo con el Coach */}
        <TouchableOpacity
          style={[styles.chatBtn, { backgroundColor: '#25D366' }]}
          onPress={handleOpenCoachWhatsApp}
        >
          <MessageCircle size={16} color="#000" />
          <Text style={styles.chatBtnText}>Chat Directo con Coach Marcos</Text>
        </TouchableOpacity>
      </View>

      {/* Próxima Sesión Presencial / Evaluación */}
      <View style={[styles.sessionCard, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
        <View style={styles.sessionHeader}>
          <Calendar size={16} color={colorTheme.primary} />
          <Text style={[styles.sessionTitle, { color: envTheme.textMain }]}>Próxima Evaluación 1 a 1</Text>
        </View>
        <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>Jueves, 25 de Septiembre • 07:00 AM</Text>
        <Text style={{ fontSize: 11, color: envTheme.textMuted, marginTop: 2 }}>
          Lugar: Zona de Peso Libre • Sede Central Power Gym
        </Text>
        <View style={[styles.focusPill, { backgroundColor: colorTheme.accentBg }]}>
          <Text style={{ fontSize: 10, color: colorTheme.primary, fontWeight: '700' }}>
            Objetivo: Re-escaneo Biométrico IA y test de 1RM en Sentadilla
          </Text>
        </View>
      </View>

      {/* Observaciones y Feedback Reciente del Coach */}
      <View style={[styles.feedbackCard, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
        <Text style={[styles.feedbackTitle, { color: colorTheme.primary }]}>
          Últimas Indicaciones de Marcos
        </Text>
        <View style={styles.feedbackItem}>
          <CheckCircle2 size={16} color={colorTheme.primary} />
          <Text style={[styles.feedbackText, { color: envTheme.textMain }]}>
            Excelente control en la fase excéntrica del Press de Banca. Para la próxima sesión subiremos 2.5 kg por lado.
          </Text>
        </View>
        <View style={styles.feedbackItem}>
          <CheckCircle2 size={16} color={colorTheme.primary} />
          <Text style={[styles.feedbackText, { color: envTheme.textMain }]}>
            No olvides los 10 minutos de calentamiento del manguito rotador con bandas elásticas.
          </Text>
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
  coachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  coachAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
  },
  coachName: {
    fontSize: 15,
    fontWeight: '800',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  coachSpecialty: {
    fontSize: 11,
    fontWeight: '700',
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  chatBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
  sessionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    gap: 4,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  sessionTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  focusPill: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
  },
  feedbackCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  feedbackItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  feedbackText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
});
