import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Dumbbell, Play, Check, Clock, RotateCcw, Plus, ChevronLeft } from 'lucide-react-native';
import { theme } from '../styles/theme';

export const WorkoutScreen: React.FC = () => {
  const [restSeconds, setRestSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Series del ejercicio actual
  const [sets, setSets] = useState([
    { id: 1, setNumber: 1, weight: '70', reps: '10', completed: true },
    { id: 2, setNumber: 2, weight: '75', reps: '10', completed: true },
    { id: 3, setNumber: 3, weight: '80', reps: '8', completed: false },
    { id: 4, setNumber: 4, weight: '80', reps: '8', completed: false },
  ]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds(sec => sec - 1);
      }, 1000);
    } else if (restSeconds === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, restSeconds]);

  const startRestTimer = (seconds = 90) => {
    setRestSeconds(seconds);
    setIsTimerActive(true);
  };

  const toggleSetCompleted = (id: number) => {
    setSets(prev =>
      prev.map(s => {
        if (s.id === id) {
          const nextState = !s.completed;
          if (nextState) startRestTimer(90);
          return { ...s, completed: nextState };
        }
        return s;
      })
    );
  };

  const addSet = () => {
    const last = sets[sets.length - 1];
    setSets([
      ...sets,
      {
        id: sets.length + 1,
        setNumber: sets.length + 1,
        weight: last ? last.weight : '70',
        reps: '10',
        completed: false,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.routineCategory}>DÍA 1 • HIPERTROFIA EMPUJE</Text>
          <Text style={styles.routineTitle}>Press de Banca Plano con Barra</Text>
        </View>

        {/* Floating Rest Timer Badge */}
        {restSeconds > 0 && (
          <View style={styles.timerBadge}>
            <Clock size={16} color="#06b6d4" />
            <Text style={styles.timerBadgeText}>{restSeconds}s descanso</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Exercise Target Overview */}
        <View style={styles.targetCard}>
          <Text style={styles.targetHeading}>Pautas del Entrenador:</Text>
          <Text style={styles.targetText}>
            4 series efectivas en rango 8-10 reps. RPE 8.5. Mantén retracción escapular y no rebotes en el pecho.
          </Text>
        </View>

        {/* Set Header Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colHeader, { width: 50 }]}>SERIE</Text>
          <Text style={[styles.colHeader, { flex: 1 }]}>KG</Text>
          <Text style={[styles.colHeader, { flex: 1 }]}>REPS</Text>
          <Text style={[styles.colHeader, { width: 60, textAlign: 'center' }]}>LISTO</Text>
        </View>

        {/* Sets List */}
        {sets.map(s => (
          <View key={s.id} style={[styles.setRow, s.completed && styles.setRowCompleted]}>
            <View style={styles.setNumberBadge}>
              <Text style={styles.setNumberText}>{s.setNumber}</Text>
            </View>

            <TextInput
              value={s.weight}
              keyboardType="numeric"
              style={styles.inputField}
              onChangeText={val =>
                setSets(prev => prev.map(item => (item.id === s.id ? { ...item, weight: val } : item)))
              }
            />

            <TextInput
              value={s.reps}
              keyboardType="numeric"
              style={styles.inputField}
              onChangeText={val =>
                setSets(prev => prev.map(item => (item.id === s.id ? { ...item, reps: val } : item)))
              }
            />

            <TouchableOpacity
              style={[styles.checkBtn, s.completed && styles.checkBtnCompleted]}
              onPress={() => toggleSetCompleted(s.id)}
            >
              <Check size={18} color={s.completed ? '#fff' : '#64748b'} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addSetBtn} onPress={addSet}>
          <Plus size={16} color="#10b981" />
          <Text style={styles.addSetText}>Añadir Serie</Text>
        </TouchableOpacity>

        {/* Siguiente Ejercicio */}
        <View style={styles.nextExerciseCard}>
          <Text style={styles.nextLabel}>Siguiente Ejercicio:</Text>
          <Text style={styles.nextExerciseTitle}>Press Militar de Hombro con Barra (3 series)</Text>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.finishBtn}>
          <Text style={styles.finishBtnText}>Finalizar Entrenamiento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgDark,
  },
  header: {
    padding: theme.spacing.md,
    paddingTop: 45,
    backgroundColor: theme.colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routineCategory: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  routineTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  timerBadgeText: {
    color: '#22d3ee',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  targetCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: theme.radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  targetHeading: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  targetText: {
    color: theme.colors.textMain,
    fontSize: 13,
    lineHeight: 18,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  colHeader: {
    color: theme.colors.textDark,
    fontSize: 11,
    fontWeight: '700',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.sm,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  setRowCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  setNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setNumberText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  inputField: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: '#fff',
    borderRadius: 8,
    marginHorizontal: 8,
    paddingVertical: 6,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },
  checkBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtnCompleted: {
    backgroundColor: theme.colors.primary,
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    marginTop: 8,
    marginBottom: 24,
  },
  addSetText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  nextExerciseCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  nextLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  nextExerciseTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.bgCard,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  finishBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  finishBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
