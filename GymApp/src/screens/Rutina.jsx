import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Dumbbell, Clock, Flame, CheckCircle, ArrowLeft } from "lucide-react-native";

const initialExercises = [
  { id: 1, name: "Press de Banca Plano", sets: "4x10", weight: "70 kg", done: true },
  { id: 2, name: "Press Inclinado con Mancuernas", sets: "4x12", weight: "24 kg c/u", done: true },
  { id: 3, name: "Aperturas en Poleas Altas", sets: "3x15", weight: "15 kg", done: false },
  { id: 4, name: "Fondos en Paralelas", sets: "3x Fallo", weight: "Peso corporal", done: false },
  { id: 5, name: "Extensión Tríceps Polea Cuerda", sets: "4x12", weight: "25 kg", done: false },
];

export default function Rutina({ onBack = () => {} }) {
  const [exercises, setExercises] = useState(initialExercises);

  const toggleExercise = (id) => {
    setExercises(exercises.map(e => e.id === id ? { ...e, done: !e.done } : e));
  };

  const completedCount = exercises.filter(e => e.done).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ArrowLeft size={20} color="#1E3A8A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Rutina de Fuerza</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Tracker Banner */}
        <View style={styles.summaryCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>Día 3: Pecho & Tríceps</Text>
            <Text style={styles.summarySubtitle}>
              {completedCount} de {exercises.length} ejercicios completados
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(completedCount / exercises.length) * 100}%` }]} />
            </View>
          </View>
          <View style={styles.fireBadge}>
            <Flame size={20} color="#EF4444" />
            <Text style={styles.fireText}>320 kcal</Text>
          </View>
        </View>

        {/* List of Exercises */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {exercises.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => toggleExercise(item.id)}
              style={[styles.exerciseCard, item.done && styles.exerciseCardDone]}
            >
              <View style={[styles.checkCircle, item.done && styles.checkCircleDone]}>
                {item.done && <CheckCircle size={18} color="#FFFFFF" />}
              </View>

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[styles.exerciseTitle, item.done && styles.exerciseDoneText]}>
                  {item.name}
                </Text>
                <Text style={styles.exerciseMeta}>
                  Series: {item.sets} • Carga: {item.weight}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  summaryCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  summarySubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#DBEAFE",
    borderRadius: 3,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 3,
  },
  fireBadge: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    padding: 10,
    borderRadius: 14,
    marginLeft: 12,
  },
  fireText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#EF4444",
    marginTop: 2,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  exerciseCardDone: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleDone: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  exerciseTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  exerciseDoneText: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },
  exerciseMeta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});
