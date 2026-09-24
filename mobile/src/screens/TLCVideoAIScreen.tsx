import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Share,
  Linking,
  ActivityIndicator
} from 'react-native';
import {
  Video,
  Play,
  Pause,
  Sparkles,
  Share2,
  Calendar,
  Clock,
  Wand2,
  CheckCircle2,
  Flame,
  DollarSign,
  MessageCircle,
  Copy,
  ChevronRight,
  ExternalLink
} from 'lucide-react-native';
import { useTheme } from '../styles/themeConfig';
import { MobileUser } from '../components/MobileHeader';

interface TLCVideoAIScreenProps {
  currentUser: MobileUser;
}

export const TLCVideoAIScreen: React.FC<TLCVideoAIScreenProps> = ({ currentUser }) => {
  const { colorTheme, envTheme } = useTheme();

  const [selectedProduct, setSelectedProduct] = useState('Iaso Tea Instantáneo');
  const [selectedFormat, setSelectedFormat] = useState<'TIKTOK' | 'REELS'>('TIKTOK');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const affiliateSlug = currentUser.affiliateCode || 'elena-morales';
  const shareableUrl = `https://gymfit.app/tlc?ref=${affiliateSlug}`;

  const [activeVideo, setActiveVideo] = useState({
    title: 'Desinflama tu abdomen en 5 días con Iaso Tea ☕',
    duration: '15s',
    subtitle: '¿Abdomen inflamado y sin energía? El Iaso Tea original limpia tu colon en 5 días 🌿',
    brollUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop',
    audioTitle: 'Cyber Pulse Uplifting Trend (128 BPM)',
    estimatedViews: '38.5K',
  });

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setGenerationStep('🔍 Analizando producto TLC y ganchos...');
    
    setTimeout(() => setGenerationStep('🎙️ Generando voz en off española...'), 800);
    setTimeout(() => setGenerationStep('✨ Renderizando subtítulos neón 9:16...'), 1600);

    setTimeout(() => {
      setIsGenerating(false);
      setActiveVideo({
        title: `Reto Détox Viral: ${selectedProduct}`,
        duration: '15s',
        subtitle: `¡Elimina hasta 5 libras de toxinas con ${selectedProduct}! Pide con link en mi bio 👇`,
        brollUrl: selectedProduct.includes('Gotas')
          ? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop',
        audioTitle: 'Latin House Trend 2026 (Viral)',
        estimatedViews: '45.2K',
      });
      setIsPlaying(true);
      Alert.alert('¡Video IA Generado!', `Tu video para ${selectedFormat} está listo con tu enlace de afiliado (${affiliateSlug}) incrustado.`);
    }, 2400);
  };

  const handleShareWhatsApp = () => {
    const msg = `🔥 ¡Mira este video del Reto Détox TLC! Ordena tu kit oficial directo aquí: ${shareableUrl}`;
    const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;
    Linking.canOpenURL(url).then(s => {
      if (s) Linking.openURL(url);
      else Share.share({ message: msg });
    }).catch(() => Share.share({ message: msg }));
  };

  const handleCopyLink = () => {
    Alert.alert('Enlace Copiado', `Link de afiliado:\n${shareableUrl}\nCada venta te acredita $20 USD.`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: envTheme.canvasBg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero Banner Nexo Video Studio */}
      <View style={[styles.heroBanner, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
        <Text style={[styles.watermark, { color: colorTheme.primaryGlow }]}>AI-VIDEO</Text>

        <View style={styles.badgeRow}>
          <View style={[styles.pillBadge, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
            <Wand2 size={12} color={colorTheme.primary} />
            <Text style={[styles.pillBadgeText, { color: colorTheme.primary }]}>TLC AI CONTENT ENGINE</Text>
          </View>
          <View style={[styles.pillBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)' }]}>
            <DollarSign size={12} color="#f59e0b" />
            <Text style={{ color: '#f59e0b', fontSize: 9, fontWeight: '800' }}>50% COMISIÓN LINK</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: envTheme.textMain }]}>
          Videos Virales <Text style={{ color: colorTheme.primary }}>Automáticos</Text>
        </Text>
        <Text style={[styles.subtitle, { color: envTheme.textMuted }]}>
          Crea reels para TikTok e Instagram en 1-toque con tu enlace de afiliado y WhatsApp incrustados.
        </Text>

        {/* Selector Rápido de Producto TLC */}
        <View style={styles.productsScroll}>
          {['Iaso Tea Instantáneo', 'Gotas Resolution', 'NutraBurst', 'Kit 30 Días'].map((p) => {
            const isSelected = selectedProduct === p;
            return (
              <TouchableOpacity
                key={p}
                style={[
                  styles.productChip,
                  {
                    backgroundColor: isSelected ? colorTheme.primary : 'rgba(255, 255, 255, 0.05)',
                    borderColor: isSelected ? colorTheme.primary : 'rgba(255, 255, 255, 0.1)',
                  },
                ]}
                onPress={() => setSelectedProduct(p)}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: isSelected ? '#000' : '#fff' }}>
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botón de Disparo IA */}
        <TouchableOpacity
          style={[styles.generateBtn, { backgroundColor: colorTheme.primary }]}
          onPress={handleGenerateAI}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Wand2 size={16} color="#000" />
              <Text style={styles.generateBtnText}>Generar Video Viral con IA (15s)</Text>
            </>
          )}
        </TouchableOpacity>

        {isGenerating && (
          <Text style={{ color: colorTheme.primary, fontSize: 11, fontWeight: '700', textAlign: 'center', marginTop: 8 }}>
            {generationStep}
          </Text>
        )}
      </View>

      {/* VISOR DE VIDEO MÓVIL 9:16 CON SUBTÍTULOS NEÓN */}
      <View style={[styles.previewCard, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
        <View style={styles.previewHeader}>
          <Text style={[styles.previewTitle, { color: envTheme.textMain }]}>{activeVideo.title}</Text>
          <View style={[styles.durationBadge, { backgroundColor: colorTheme.accentBg }]}>
            <Text style={{ color: colorTheme.primary, fontSize: 10, fontWeight: '800' }}>{activeVideo.duration}</Text>
          </View>
        </View>

        {/* Frame Vertical */}
        <View style={styles.videoFrame}>
          <Image source={{ uri: activeVideo.brollUrl }} style={styles.videoImg} />

          {/* Subtítulos Neón Flotantes */}
          <View style={[styles.subtitlesBox, { borderColor: colorTheme.primary }]}>
            <Text style={styles.subtitlesText}>{activeVideo.subtitle}</Text>
          </View>

          {/* Enlace de Afiliado Overlay */}
          <View style={[styles.linkOverlay, { backgroundColor: colorTheme.primary }]}>
            <Text style={styles.linkOverlayText}>PIDE EN: gymfit.app/tlc?ref={affiliateSlug}</Text>
          </View>
        </View>

        {/* Botones de Compartir Inmediato */}
        <View style={styles.shareRow}>
          <TouchableOpacity
            style={[styles.shareActionBtn, { backgroundColor: '#25D366' }]}
            onPress={handleShareWhatsApp}
          >
            <MessageCircle size={15} color="#000" />
            <Text style={styles.shareActionText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shareActionBtn, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary, borderWidth: 1 }]}
            onPress={handleCopyLink}
          >
            <Copy size={15} color={colorTheme.primary} />
            <Text style={[styles.shareActionText, { color: colorTheme.primary }]}>Copiar Link</Text>
          </TouchableOpacity>
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
    fontSize: 38,
    fontWeight: '900',
    opacity: 0.12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    lineHeight: 17,
    marginBottom: 12,
  },
  productsScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  productChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  generateBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '900',
  },
  previewCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 16,
    gap: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  durationBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoFrame: {
    width: '100%',
    height: 380,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  videoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  subtitlesBox: {
    position: 'absolute',
    bottom: 50,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  subtitlesText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  linkOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  linkOverlayText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '900',
  },
  shareRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shareActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  shareActionText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '800',
  },
});
