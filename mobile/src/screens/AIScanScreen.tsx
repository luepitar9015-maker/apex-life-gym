import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Sparkles, Camera, CheckCircle2, AlertTriangle, Cpu, RotateCcw, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../styles/themeConfig';

export const AIScanScreen: React.FC = () => {
  const { colorTheme, envTheme } = useTheme();

  const [analyzing, setAnalyzing] = useState(false);
  const [photoType, setPhotoType] = useState<'FRONT' | 'SIDE'>('FRONT');

  const [scanResult, setScanResult] = useState({
    fatPct: 16.2,
    leanMass: 65.8,
    postureScore: 92,
    somatotype: 'Mesomorfo Atlético',
    findings: [
      { title: 'Alineación Escapular', ok: false, text: 'Hombro derecho con leve elevación (1.2°)' },
      { title: 'Eje Pélvico', ok: true, text: 'Ángulo neutro saludable (2.1°)' },
      { title: 'Simetría de Brazos', ok: true, text: '97.4% de balance muscular entre bíceps' },
    ],
    recommendation: 'Aumentar trabajo de tracción horizontal (Face Pulls) para alinear hombros. Mantener ingesta de proteína a 165g.',
  });

  const handleRunScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 1800);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: envTheme.canvasBg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero Banner Nexo Scan */}
      <View style={[styles.heroBanner, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
        <Text style={[styles.watermark, { color: colorTheme.primaryGlow }]}>SCAN-AI</Text>

        <View style={styles.badgeRow}>
          <View style={[styles.pillBadge, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
            <Sparkles size={12} color={colorTheme.primary} />
            <Text style={[styles.pillBadgeText, { color: colorTheme.primary }]}>VISIÓN COMPUTACIONAL IA</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: envTheme.textMain }]}>Escaneo Corporal & Postura</Text>
        <Text style={[styles.subtitle, { color: envTheme.textMuted }]}>
          Análisis biomecánico en tiempo real para estimar grasa subcutánea y balance postural.
        </Text>
      </View>

      {/* Visor de Escaneo & Silueta */}
      <View style={[styles.photoCard, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
        <Image
          source={{
            uri:
              photoType === 'FRONT'
                ? 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop',
          }}
          style={styles.athleteImage}
        />

        {/* Línea Láser de Escaneo */}
        <View style={[styles.scanLine, { backgroundColor: colorTheme.primary }]} />

        {/* Selector de Perspectiva Frontal / Lateral */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              photoType === 'FRONT' && { backgroundColor: colorTheme.primary },
            ]}
            onPress={() => setPhotoType('FRONT')}
          >
            <Text style={[styles.toggleBtnText, { color: photoType === 'FRONT' ? '#000' : '#fff' }]}>
              Vista Frontal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              photoType === 'SIDE' && { backgroundColor: colorTheme.primary },
            ]}
            onPress={() => setPhotoType('SIDE')}
          >
            <Text style={[styles.toggleBtnText, { color: photoType === 'SIDE' ? '#000' : '#fff' }]}>
              Vista Lateral
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón de Disparo de Escaneo */}
        <TouchableOpacity
          style={[styles.scanActionBtn, { backgroundColor: colorTheme.primary }]}
          onPress={handleRunScan}
          disabled={analyzing}
        >
          {analyzing ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Camera size={16} color="#000" />
              <Text style={styles.scanActionBtnText}>Escanear con Visión IA</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Resultados Métricos Biométricos */}
      <View style={[styles.metricsGrid, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
        <View style={styles.metricCol}>
          <Text style={{ fontSize: 10, color: envTheme.textMuted }}>% Grasa</Text>
          <Text style={[styles.metricVal, { color: colorTheme.primary }]}>{scanResult.fatPct}%</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: envTheme.border }]} />
        <View style={styles.metricCol}>
          <Text style={{ fontSize: 10, color: envTheme.textMuted }}>Masa Magra</Text>
          <Text style={[styles.metricVal, { color: '#38bdf8' }]}>{scanResult.leanMass} kg</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: envTheme.border }]} />
        <View style={styles.metricCol}>
          <Text style={{ fontSize: 10, color: envTheme.textMuted }}>Postura</Text>
          <Text style={[styles.metricVal, { color: '#f59e0b' }]}>{scanResult.postureScore}/100</Text>
        </View>
      </View>

      {/* Diagnóstico Postural de IA */}
      <View style={[styles.findingsCard, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
        <Text style={[styles.findingsTitle, { color: colorTheme.primary }]}>Diagnóstico de Simetría Muscular</Text>
        {scanResult.findings.map((f, i) => (
          <View key={i} style={[styles.findingRow, { borderColor: 'rgba(255,255,255,0.05)' }]}>
            {f.ok ? (
              <CheckCircle2 size={16} color={colorTheme.primary} />
            ) : (
              <AlertTriangle size={16} color="#f59e0b" />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: envTheme.textMain }}>{f.title}</Text>
              <Text style={{ fontSize: 11, color: envTheme.textMuted }}>{f.text}</Text>
            </View>
          </View>
        ))}

        <View style={[styles.recBox, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
          <Text style={{ fontSize: 10, color: colorTheme.primary, fontWeight: '800' }}>RECOMENDACIÓN DEL MODELO:</Text>
          <Text style={{ fontSize: 11, color: envTheme.textMain, marginTop: 2 }}>{scanResult.recommendation}</Text>
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
    marginBottom: 8,
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
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  photoCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  athleteImage: {
    width: '100%',
    height: 220,
    borderRadius: 14,
  },
  scanLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: '45%',
    height: 2,
    opacity: 0.8,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  scanActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  scanActionBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
  },
  findingsCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  findingsTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  findingRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 0.8,
  },
  recBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
});
