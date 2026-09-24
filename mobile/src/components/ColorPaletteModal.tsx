import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Check, Palette, Sparkles, Sliders } from 'lucide-react-native';
import { COLOR_PALETTES, ENVIRONMENT_PALETTES, useTheme } from '../styles/themeConfig';

interface ColorPaletteModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({ visible, onClose }) => {
  const { colorTheme, envTheme, setColorTheme, setEnvTheme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheetContainer, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
          {/* Header del Modal */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.iconWrapper, { backgroundColor: colorTheme.accentBg }]}>
                <Palette size={20} color={colorTheme.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: envTheme.textMain }]}>Personalizador de Color</Text>
                <Text style={[styles.subtitle, { color: envTheme.textMuted }]}>
                  Sistema de 2 Tabletas Estilo Nexo
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Tableta 1: Paleta de Acento & Banners Neón */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionBadge}>
                  <Text style={[styles.badgeText, { color: colorTheme.primary }]}>TABLETA 1</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: envTheme.textMain }]}>
                  Acento & Banners Neón
                </Text>
              </View>

              <View style={styles.paletteGrid}>
                {COLOR_PALETTES.map((pal) => {
                  const isSelected = colorTheme.id === pal.id;
                  return (
                    <TouchableOpacity
                      key={pal.id}
                      style={[
                        styles.paletteCard,
                        {
                          backgroundColor: isSelected ? pal.accentBg : 'rgba(255, 255, 255, 0.03)',
                          borderColor: isSelected ? pal.primary : 'rgba(255, 255, 255, 0.08)',
                        },
                      ]}
                      onPress={() => setColorTheme(pal)}
                    >
                      <View style={[styles.colorCircle, { backgroundColor: pal.primary }]}>
                        {isSelected && <Check size={14} color="#000000" />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.paletteName, { color: isSelected ? pal.primary : envTheme.textMain }]}>
                          {pal.name}
                        </Text>
                        <Text style={[styles.paletteBadgeText, { color: pal.gradientText }]}>
                          {pal.badge}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Tableta 2: Entorno, Fondos y Superficies */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionBadge, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                  <Text style={[styles.badgeText, { color: '#38bdf8' }]}>TABLETA 2</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: envTheme.textMain }]}>
                  Entorno, Fondos & Tarjetas
                </Text>
              </View>

              <View style={styles.envGrid}>
                {ENVIRONMENT_PALETTES.map((env) => {
                  const isSelected = envTheme.id === env.id;
                  return (
                    <TouchableOpacity
                      key={env.id}
                      style={[
                        styles.envCard,
                        {
                          backgroundColor: env.canvasBg,
                          borderColor: isSelected ? colorTheme.primary : 'rgba(255, 255, 255, 0.1)',
                        },
                      ]}
                      onPress={() => setEnvTheme(env)}
                    >
                      <View style={styles.envPreviewBox}>
                        <View style={[styles.miniCard, { backgroundColor: env.cardBg }]} />
                        <View style={[styles.miniAccent, { backgroundColor: colorTheme.primary }]} />
                      </View>
                      <Text style={[styles.envName, { color: isSelected ? colorTheme.primary : '#fff' }]}>
                        {env.name}
                      </Text>
                      {isSelected && (
                        <View style={[styles.activePill, { backgroundColor: colorTheme.primary }]}>
                          <Text style={styles.activePillText}>ACTIVO</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Botón Aplicar y Cerrar */}
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colorTheme.primary }]}
              onPress={onClose}
            >
              <Text style={styles.applyBtnText}>Guardar Personalización</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 2,
    maxHeight: '85%',
    padding: 20,
    paddingBottom: 35,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  paletteGrid: {
    gap: 8,
  },
  paletteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  colorCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteName: {
    fontSize: 13,
    fontWeight: '700',
  },
  paletteBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  envGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  envCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  envPreviewBox: {
    width: '100%',
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 4,
  },
  miniCard: {
    width: 32,
    height: 22,
    borderRadius: 4,
  },
  miniAccent: {
    width: 8,
    height: 22,
    borderRadius: 2,
  },
  envName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  activePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activePillText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '800',
  },
  applyBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  applyBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
