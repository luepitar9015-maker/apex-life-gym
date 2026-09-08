import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { UtensilsCrossed, Droplets, CheckCircle2, Flame, Apple, Plus } from 'lucide-react-native';
import { theme } from '../styles/theme';

export const NutritionScreen: React.FC = () => {
  const [waterGlasses, setWaterGlasses] = useState(6);
  const totalWaterTarget = 10; // Vasos de 300ml

  const [meals, setMeals] = useState([
    {
      id: 1,
      name: 'Desayuno Energético',
      time: '07:30 AM',
      calories: 580,
      macros: '38g P • 65g C • 16g G',
      items: ['3 Huevos enteros revueltos + 2 claras', '80g Avena en hojuelas con canela', '1 Plátano mediano'],
      completed: true,
    },
    {
      id: 2,
      name: 'Almuerzo Anabólico',
      time: '01:00 PM',
      calories: 720,
      macros: '52g P • 85g C • 18g G',
      items: ['180g Pechuga de pollo a la plancha', '200g Arroz blanco cocido', '1/2 Aguacate Hass'],
      completed: true,
    },
    {
      id: 3,
      name: 'Pre-Entrenamiento',
      time: '04:30 PM',
      calories: 450,
      macros: '32g P • 60g C • 8g G',
      items: ['1 Scoop Whey Isolate', '4 Tortitas de arroz con miel', '1 Manzana verde'],
      completed: false,
    },
    {
      id: 4,
      name: 'Cena Recuperadora',
      time: '08:30 PM',
      calories: 610,
      macros: '43g P • 50g C • 22g G',
      items: ['170g Filete de salmón fresco', '220g Batata al horno', 'Brócoli al vapor'],
      completed: false,
    },
  ]);

  const toggleMeal = (id: number) => {
    setMeals(prev => prev.map(m => (m.id === id ? { ...m, completed: !m.completed } : m)));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Diario de Alimentación</Text>
        <Text style={styles.subtitle}>Meta diaria: 2,400 kcal • 165g Proteína</Text>
      </View>

      {/* Hydration Tracker */}
      <View style={styles.waterCard}>
        <View style={styles.waterHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Droplets size={20} color="#06b6d4" />
            <Text style={styles.waterTitle}>Registro de Hidratación</Text>
          </View>
          <Text style={styles.waterFraction}>
            {((waterGlasses * 300) / 1000).toFixed(1)}L / 3.0L
          </Text>
        </View>

        {/* Glasses visual row */}
        <View style={styles.glassesRow}>
          {Array.from({ length: totalWaterTarget }).map((_, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.glassDot, idx < waterGlasses && styles.glassDotActive]}
              onPress={() => setWaterGlasses(idx + 1)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.addWaterBtn} onPress={() => setWaterGlasses(w => Math.min(w + 1, totalWaterTarget))}>
          <Plus size={14} color="#06b6d4" />
          <Text style={styles.addWaterText}>+ 1 Vaso (300 ml)</Text>
        </TouchableOpacity>
      </View>

      {/* Meals of the Day */}
      <Text style={styles.mealsHeading}>Tus Comidas de Hoy</Text>

      {meals.map(meal => (
        <TouchableOpacity
          key={meal.id}
          style={[styles.mealCard, meal.completed && styles.mealCardCompleted]}
          onPress={() => toggleMeal(meal.id)}
        >
          <View style={styles.mealHeader}>
            <View>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealTime}>{meal.time} • {meal.calories} kcal</Text>
            </View>

            <View style={[styles.checkCircle, meal.completed && styles.checkCircleActive]}>
              <CheckCircle2 size={20} color={meal.completed ? '#10b981' : '#64748b'} />
            </View>
          </View>

          <Text style={styles.macrosText}>{meal.macros}</Text>

          <View style={styles.foodList}>
            {meal.items.map((it, i) => (
              <Text key={i} style={styles.foodItem}>• {it}</Text>
            ))}
          </View>
        </TouchableOpacity>
      ))}
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
    marginBottom: theme.spacing.lg,
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
  },
  waterCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    marginBottom: 20,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  waterTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  waterFraction: {
    color: '#22d3ee',
    fontSize: 13,
    fontWeight: '800',
  },
  glassesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  glassDot: {
    width: 24,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  glassDotActive: {
    backgroundColor: '#06b6d4',
    borderColor: '#22d3ee',
  },
  addWaterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  addWaterText: {
    color: '#22d3ee',
    fontSize: 12,
    fontWeight: '700',
  },
  mealsHeading: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mealCardCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  mealName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  mealTime: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  checkCircle: {
    padding: 4,
  },
  checkCircleActive: {},
  macrosText: {
    color: theme.colors.accentCyan,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
  },
  foodList: {
    gap: 4,
  },
  foodItem: {
    color: theme.colors.textMain,
    fontSize: 12,
  },
});
