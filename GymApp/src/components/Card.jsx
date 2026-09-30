import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Flame, Scale, TrendingUp } from "lucide-react-native";

export default function Card({ title, value, icon, progress }) {
  const isCalories = title.toLowerCase().includes("calor");

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.iconBox, { backgroundColor: isCalories ? "#FEF2F2" : "#EFF6FF" }]}>
          {isCalories ? (
            <Flame size={16} color="#EF4444" />
          ) : (
            <Scale size={16} color="#2563EB" />
          )}
        </View>
      </View>

      <Text style={styles.value}>{value}</Text>

      <View style={styles.progressRow}>
        <TrendingUp size={12} color="#10B981" />
        <Text style={styles.progressText}>{progress || "+4% meta hoy"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    width: "48%",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontWeight: "800",
    color: "#1E3A8A",
    fontSize: 22,
    letterSpacing: -0.5,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  progressText: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "700",
  },
});
