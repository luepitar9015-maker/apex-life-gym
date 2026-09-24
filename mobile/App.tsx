import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  Home, 
  Dumbbell, 
  Sparkles, 
  UtensilsCrossed, 
  ShoppingBag, 
  Users, 
  ShieldCheck,
  Leaf,
  Video
} from 'lucide-react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutScreen } from './src/screens/WorkoutScreen';
import { AIScanScreen } from './src/screens/AIScanScreen';
import { NutritionScreen } from './src/screens/NutritionScreen';
import { TLCStoreScreen } from './src/screens/TLCStoreScreen';
import { TLCHubScreen } from './src/screens/TLCHubScreen';
import { TLCVideoAIScreen } from './src/screens/TLCVideoAIScreen';
import { TrainersScreen } from './src/screens/TrainersScreen';
import { MobileHeader, DEMO_USERS, MobileUser } from './src/components/MobileHeader';
import { ColorPaletteModal } from './src/components/ColorPaletteModal';
import { ThemeProvider, useTheme } from './src/styles/themeConfig';

const MainApp: React.FC = () => {
  const { colorTheme, envTheme } = useTheme();

  const [activeSystem, setActiveSystem] = useState<'gym' | 'tlc'>('gym');
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState<MobileUser>(DEMO_USERS[0]); // Inicia como Superadmin
  const [paletteModalOpen, setPaletteModalOpen] = useState(false);

  // Cambio de sistema dual: actualiza la pestaña activa inicial
  const handleSwitchSystem = (system: 'gym' | 'tlc') => {
    setActiveSystem(system);
    if (system === 'tlc') {
      setActiveTab('tlc_store');
    } else {
      setActiveTab('home');
    }
  };

  // Pestañas dinámicas según el sistema activo
  const gymTabs = [
    { id: 'home', label: 'Mi Pase QR', icon: Home },
    { id: 'workout', label: 'Entrenar', icon: Dumbbell },
    { id: 'aiscan', label: 'Escaneo IA', icon: Sparkles },
    { id: 'nutrition', label: 'Macros', icon: UtensilsCrossed },
    { id: 'trainers', label: 'Coaches', icon: ShieldCheck },
  ];

  const tlcTabs = [
    { id: 'tlc_store', label: 'Tienda TLC', icon: ShoppingBag },
    { id: 'tlc_video_ai', label: 'Video IA', icon: Video },
    { id: 'tlc_hub', label: 'Mi Red & Reto', icon: Leaf },
  ];

  const currentTabs = activeSystem === 'gym' ? gymTabs : tlcTabs;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: envTheme.canvasBg }]}>
      <StatusBar style="light" backgroundColor={envTheme.cardBg} />

      {/* Header Superior Móvil con Selector de Sistema, Rol y Paleta de Colores */}
      <MobileHeader
        activeSystem={activeSystem}
        onSwitchSystem={handleSwitchSystem}
        currentUser={currentUser}
        onSwitchUser={(u) => {
          setCurrentUser(u);
          if (u.role === 'AFFILIATE') {
            setActiveSystem('tlc');
            setActiveTab('tlc_store');
          }
        }}
        onOpenPaletteModal={() => setPaletteModalOpen(true)}
      />

      {/* Pantalla Activa */}
      <View style={styles.screenContainer}>
        {activeSystem === 'gym' ? (
          <>
            {activeTab === 'home' && (
              <HomeScreen currentUser={currentUser} onNavigateTab={(t) => setActiveTab(t)} />
            )}
            {activeTab === 'workout' && <WorkoutScreen />}
            {activeTab === 'aiscan' && <AIScanScreen />}
            {activeTab === 'nutrition' && <NutritionScreen />}
            {activeTab === 'trainers' && <TrainersScreen />}
          </>
        ) : (
          <>
            {activeTab === 'tlc_store' && <TLCStoreScreen currentUser={currentUser} />}
            {activeTab === 'tlc_video_ai' && <TLCVideoAIScreen currentUser={currentUser} />}
            {activeTab === 'tlc_hub' && (
              <TLCHubScreen currentUser={currentUser} onNavigateTab={(t) => setActiveTab(t)} />
            )}
          </>
        )}
      </View>

      {/* Barra de Navegación Inferior Flotante Estilo Nexo */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: envTheme.cardBg,
            borderTopColor: envTheme.border,
            borderTopWidth: 1,
            shadowColor: colorTheme.primary,
          },
        ]}
      >
        {currentTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <TouchableOpacity
              key={t.id}
              style={styles.navItem}
              onPress={() => setActiveTab(t.id)}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && {
                    backgroundColor: colorTheme.accentBg,
                    borderColor: colorTheme.primary,
                    borderWidth: 1,
                  },
                ]}
              >
                <Icon size={20} color={isActive ? colorTheme.primary : envTheme.textDark} />
              </View>
              <Text
                style={[
                  styles.navLabel,
                  { color: isActive ? colorTheme.primary : envTheme.textDark },
                  isActive && styles.navLabelActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal de Personalización de Dos Tabletas */}
      <ColorPaletteModal
        visible={paletteModalOpen}
        onClose={() => setPaletteModalOpen(false)}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    height: 68,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 6,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  navLabelActive: {
    fontWeight: '800',
  },
});
