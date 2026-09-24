import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { UtensilsCrossed, Droplet, Plus, Flame, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../styles/themeConfig';

export const NutritionScreen: React.FC = () => {
  const { colorTheme, envTheme } = useTheme();

  const [waterGlasses, setWaterGlasses] = useState(6); // 6 de 10 vasos
  const totalWaterGoal = 10;

  const [meals, setMeals] = useState([
    {
      id: 1,
      title: 'Desayuno Anabólico',
      time: '08:00 AM',
      items: '4 huevos revueltos + 80g avena con frutos rojos + café negro',
      macros: '38g P • 55g C • 18g G • 540 kcal',
      done: true,
    },
    {
      id: 2,
      title: 'Almuerzo de Rendimiento',
      time: '01:00 PM',
      items: '200g pechuga de pollo + 150g arroz jazmín + brócoli al vapor',
      macros: '48g P • 62g C • 10g G • 620 kcal',
      done: true,
    },
    {
      id: 3,
      title: 'Pre-Workout Snack',
      time: '04:30 PM',
      items: '1 scoop proteína whey + 1 banano + 20g mantequilla de maní',
      macros: '30g P • 35g C • 12g G • 360 kcal',
      done: false,
    },
    {
      id: 4,
      title: 'Cena de Recuperación',
      time: '08:30 PM',
      items: '180g lomo de res magro o salmón + ensalada verde con aceite de oliva',
      macros: '42g P • 15g C • 16g G • 480 kcal',
      done: false,
    },
  ]);

  const toggleMeal = (id: number) => {
    setMeals(meals.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));
  };

  const addWater = () => {
    if (waterGlasses < totalWaterGoal) setWaterGlasses(waterGlasses + 1);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: envTheme.canvasBg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero Banner Nexo Dieta */}
      <View style={[styles.heroBanner, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
        <Text style={[styles.watermark, { color: colorTheme.primaryGlow }]}>MACROS</Text>

        <View style={styles.badgeRow}>
          <View style={[styles.pillBadge, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
            <UtensilsCrossed size={12} color={colorTheme.primary} />
            <Text style={[styles.pillBadgeText, { color: colorTheme.primary }]}>PLAN NUTRICIONAL DEPORTIVO</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: envTheme.textMain }]}>Metabolismo & Macronutrientes</Text>
        <Text style={[styles.subtitle, { color: envTheme.textMuted }]}>
          Superávit calórico controlado para hipertrofia con 2.2g de proteína por kg de peso.
        </Text>

        {/* Calorías Totales */}
        <View style={[styles.caloriesWidget, { backgroundColor: 'rgba(0,0,0,0.4)', borderColor: colorTheme.primary }]}>
          <View>
            <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '700' }}>OBJETIVO DIARIO</Text>
            <Text style={[styles.calAmount, { color: colorTheme.primary }]}>2,450 kcal</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '700' }}>CONSUMIDAS</Text>
            <Text style={{ fontSize: 15, color: '#fff', fontWeight: '800' }}>1,160 kcal</Text>
          </View>
        </View>
      </View>

      {/* Tarjetas de Macronutrientes */}
      <View style={styles.macrosRow}>
        <View style={[styles.macroCard, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
          <Text style={[styles.macroLabel, { color: colorTheme.primary }]}>PROTEÍNA</Text>
          <Text style={[styles.macroVal, { color: envTheme.textMain }]}>165g</Text>
          <Text style={{ fontSize: 9, color: envTheme.textMuted }}>Meta diaria</Text>
        </View>

        <View style={[styles.macroCard, { backgroundColor: envTheme.cardBg, borderColor: '#38bdf8' }]}>
          <Text style={[styles.macroLabel, { color: '#38bdf8' }]}>CARBOS</Text>
          <Text style={[styles.macroVal, { color: envTheme.textMain }]}>220g</Text>
          <Text style={{ fontSize: 9, color: envTheme.textMuted }}>Energía limpia</Text>
        </View>

        <View style={[styles.macroCard, { backgroundColor: envTheme.cardBg, borderColor: '#f59e0b' }]}>
          <Text style={[styles.macroLabel, { color: '#f59e0b' }]}>GRASAS</Text>
          <Text style={[styles.macroVal, { color: envTheme.textMain }]}>60g</Text>
          <Text style={{ fontSize: 9, color: envTheme.textMuted }}>Hormonal</Text>
        </View>
      </View>

      {/* Rastreador de Hidratación */}
      <View style={[styles.waterCard, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
        <View style={styles.waterHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Droplet size={18} color="#06b6d4" />
            <Text style={[styles.waterTitle, { color: envTheme.textMain }]}>
              Hidratación Celular ({waterGlasses * 250} ml / 2,500 ml)
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addWaterBtn, { backgroundColor: 'rgba(6, 182, 212, 0.2)', borderColor: '#06b6d4' }]}
            onPress={addWater}
          >
            <Plus size={12} color="#06b6d4" />
            <Text style={{ color: '#06b6d4', fontSize: 11, fontWeight: '800' }}>+250ml</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.glassesBar}>
          {Array.from({ length: totalWaterGoal }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.glassPill,
                { backgroundColor: i < waterGlasses ? '#06b6d4' : 'rgba(255, 255, 255, 0.08)' },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Distribución de Comidas */}
      <View style={[styles.mealsCard, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
        <Text style={[styles.mealsTitle, { color: colorTheme.primary }]}>Horarios de Comidas & Timing</Text>
        {meals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={[styles.mealItem, { borderColor: 'rgba(255, 255, 255, 0.05)' }]}
            onPress={() => toggleMeal(meal.id)}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: envTheme.textMain }}>{meal.title}</Text>
                <Text style={{ fontSize: 10, color: colorTheme.primary, fontWeight: '700' }}>{meal.time}</Text>
              </View>
              <Text style={{ fontSize: 11, color: envTheme.textMuted, marginTop: 2 }}>{meal.items}</Text>
              <Text style={{ fontSize: 10, color: '#38bdf8', fontWeight: '700', marginTop: 2 }}>{meal.macros}</Text>
            </View>

            <View style={[styles.checkCircle, { borderColor: meal.done ? colorTheme.primary : envTheme.border }]}>
              {meal.done && <CheckCircle2 size={20} color={colorTheme.primary} />}
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 14,
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
    marginBottom: 10,
  },
  caloriesWidget: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  calAmount: {
    fontSize: 18,
    fontWeight: '900',
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  macroCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  macroVal: {
    fontSize: 17,
    fontWeight: '900',
  },
  waterCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  waterTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  addWaterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  glassesBar: {
    flexDirection: 'row',
    gap: 6,
    height: 8,
  },
  glassPill: {
    flex: 1,
    borderRadius: 4,
  },
  mealsCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  mealsTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.8,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
