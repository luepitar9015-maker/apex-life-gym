import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Home, Dumbbell, Sparkles, UtensilsCrossed } from 'lucide-react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutScreen } from './src/screens/WorkoutScreen';
import { AIScanScreen } from './src/screens/AIScanScreen';
import { NutritionScreen } from './src/screens/NutritionScreen';
import { theme } from './src/styles/theme';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Mi Pase', icon: Home },
    { id: 'workout', label: 'Entrenar', icon: Dumbbell },
    { id: 'aiscan', label: 'Escaneo IA', icon: Sparkles },
    { id: 'nutrition', label: 'Dieta', icon: UtensilsCrossed },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={theme.colors.bgDark} />

      {/* Main Screen View */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && <HomeScreen onNavigateTab={(t) => setActiveTab(t)} />}
        {activeTab === 'workout' && <WorkoutScreen />}
        {activeTab === 'aiscan' && <AIScanScreen />}
        {activeTab === 'nutrition' && <NutritionScreen />}
      </View>

      {/* Bottom Navigation Tab Bar */}
      <View style={styles.bottomNav}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <TouchableOpacity
              key={t.id}
              style={styles.navItem}
              onPress={() => setActiveTab(t.id)}
            >
              <Icon size={22} color={isActive ? theme.colors.primary : theme.colors.textDark} />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgDark,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    height: 65,
    backgroundColor: theme.colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 6,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  navLabelActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
