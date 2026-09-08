import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Sparkles, Camera, CheckCircle, AlertTriangle, Cpu, RotateCcw } from 'lucide-react-native';
import { theme } from '../styles/theme';

export const AIScanScreen: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [photoType, setPhotoType] = useState<'FRONT' | 'SIDE'>('FRONT');

  const [scanResult, setScanResult] = useState({
    fatPct: 16.2,
    leanMass: 65.8,
    postureScore: 92,
    somatotype: 'Mesomorfo',
    findings: [
      { title: 'Alineación Escapular', ok: false, text: 'Hombro derecho con leve elevación (1.2°)' },
      { title: 'Eje Pélvico', ok: true, text: 'Ángulo neutro saludable (2.1°)' },
      { title: 'Simetría de Brazos', ok: true, text: '97.4% de balance de masa muscular' },
    ],
    recommendation: 'Aumentar trabajo de tracción horizontal (Face Pulls) para alinear hombros. Mantener ingesta de proteína a 165g.',
  });

  const handleRunScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.tagRow}>
          <View style={styles.aiTag}>
            <Sparkles size={12} color="#10b981" />
            <Text style={styles.aiTagText}>Visión Multimodal IA</Text>
          </View>
        </View>
        <Text style={styles.title}>Escaneo Corporal & Postura</Text>
        <Text style={styles.subtitle}>Captura 2 fotos para calcular tu composición corporal y alineación postural</Text>
      </View>

      {/* Photo Preview Container */}
      <View style={styles.photoCard}>
        <Image
          source={{
            uri:
              photoType === 'FRONT'
                ? 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop',
          }}
          style={styles.athleteImage}
        />

        {/* Photo Type Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, photoType === 'FRONT' && styles.toggleBtnActive]}
            onPress={() => setPhotoType('FRONT')}
          >
            <Text style={[styles.toggleBtnText, photoType === 'FRONT' && styles.toggleBtnTextActive]}>Foto Frontal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, photoType === 'SIDE' && styles.toggleBtnActive]}
            onPress={() => setPhotoType('SIDE')}
          >
            <Text style={[styles.toggleBtnText, photoType === 'SIDE' && styles.toggleBtnTextActive]}>Foto Lateral</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Scan Button */}
      <TouchableOpacity style={styles.scanBtn} onPress={handleRunScan} disabled={analyzing}>
        <Camera size={20} color="#fff" />
        <Text style={styles.scanBtnText}>
          {analyzing ? 'Procesando en Red Neuronal...' : 'Tomar Foto & Analizar con IA'}
        </Text>
      </TouchableOpacity>

      {/* Calculated Results */}
      <View style={styles.resultsCard}>
        <Text style={styles.resultsTitle}>Tu Diagnóstico Biométrico</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{scanResult.fatPct}%</Text>
            <Text style={styles.statSub}>% Grasa</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{scanResult.leanMass} kg</Text>
            <Text style={styles.statSub}>Masa Magra</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{scanResult.postureScore}/100</Text>
            <Text style={styles.statSub}>Postura</Text>
          </View>
        </View>

        {/* Posture Findings */}
        <View style={styles.findingsBox}>
          {scanResult.findings.map((item, idx) => (
            <View key={idx} style={styles.findingItem}>
              {item.ok ? <CheckCircle size={16} color="#10b981" /> : <AlertTriangle size={16} color="#f59e0b" />}
              <View style={{ flex: 1 }}>
                <Text style={styles.findingHeading}>{item.title}</Text>
                <Text style={styles.findingSub}>{item.text}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* AI Recommendations */}
        <View style={styles.recBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Cpu size={14} color="#10b981" />
            <Text style={styles.recHeading}>Prescripción de tu Entrenador & IA:</Text>
          </View>
          <Text style={styles.recText}>{scanResult.recommendation}</Text>
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
    paddingTop: 45,
    paddingBottom: 60,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  aiTagText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  photoCard: {
    height: 320,
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  athleteImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  toggleRow: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 999,
    padding: 4,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  toggleBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleBtnText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  toggleBtnTextActive: {
    color: '#fff',
  },
  scanBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  scanBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  resultsCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  statSub: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.border,
  },
  findingsBox: {
    gap: 10,
    marginBottom: 14,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 10,
    borderRadius: 8,
  },
  findingHeading: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  findingSub: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  recBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  recHeading: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '800',
  },
  recText: {
    color: theme.colors.textMain,
    fontSize: 12,
    lineHeight: 16,
  },
});
