import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { Calendar, Clock, Users, CheckCircle2, ChevronLeft, ArrowLeft } from "lucide-react-native";

const classesData = [
  { id: 1, title: "Spinning Power 45", time: "07:00 AM", instructor: "Laura Gómez", spotsLeft: 2, total: 20, reserved: true },
  { id: 2, title: "Yoga Flow & Breath", time: "09:00 AM", instructor: "Esteban Morales", spotsLeft: 3, total: 15, reserved: false },
  { id: 3, title: "Pilates Core & Reformer", time: "11:00 AM", instructor: "Valentina R.", spotsLeft: 4, total: 12, reserved: false },
  { id: 4, title: "HIIT Extreme Burn", time: "06:00 PM", instructor: "Camilo Serna", spotsLeft: 0, total: 20, reserved: false },
  { id: 5, title: "Cross & Barbell", time: "07:15 PM", instructor: "Laura Gómez", spotsLeft: 5, total: 18, reserved: false },
];

export default function Reservas({ onBack = () => {} }) {
  const [classList, setClassList] = useState(classesData);

  const toggleReservation = (id) => {
    setClassList(classList.map(c => {
      if (c.id === id) {
        if (c.reserved) {
          return { ...c, reserved: false, spotsLeft: c.spotsLeft + 1 };
        } else if (c.spotsLeft > 0) {
          return { ...c, reserved: true, spotsLeft: c.spotsLeft - 1 };
        }
      }
      return c;
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ArrowLeft size={20} color="#1E3A8A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reservas de Clases</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.subtitle}>
          Asegura tu cupo en clases dirigidas con antelación de 24 horas.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          {classList.map((item) => {
            const isFull = item.spotsLeft === 0 && !item.reserved;

            return (
              <View key={item.id} style={styles.classCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.classTitle}>{item.title}</Text>
                    <Text style={styles.classTime}>⏰ {item.time} • Instructor: {item.instructor}</Text>
                  </View>
                  <View style={[
                    styles.spotBadge,
                    { backgroundColor: item.reserved ? "#ECFDF5" : isFull ? "#FEF2F2" : "#EFF6FF" }
                  ]}>
                    <Text style={[
                      styles.spotBadgeText,
                      { color: item.reserved ? "#059669" : isFull ? "#EF4444" : "#2563EB" }
                    ]}>
                      {item.reserved ? "RESERVADO" : isFull ? "LLENO" : `${item.spotsLeft} LIBRES`}
                    </Text>
                  </View>
                </View>

                <View style={styles.quotaBarBg}>
                  <View
                    style={[
                      styles.quotaBarFill,
                      {
                        width: `${((item.total - item.spotsLeft) / item.total) * 100}%`,
                        backgroundColor: item.reserved ? "#10B981" : isFull ? "#EF4444" : "#2563EB"
                      }
                    ]}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    item.reserved
                      ? styles.cancelBtn
                      : isFull
                      ? styles.disabledBtn
                      : styles.reserveBtn
                  ]}
                  disabled={isFull}
                  onPress={() => toggleReservation(item.id)}
                >
                  <Text style={[
                    styles.actionBtnText,
                    item.reserved ? { color: "#EF4444" } : isFull ? { color: "#94A3B8" } : { color: "#FFFFFF" }
                  ]}>
                    {item.reserved ? "Cancelar Mi Reserva" : isFull ? "Sin Cupos Disponibles" : "Reservar Mi Lugar"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
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
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 8,
    marginBottom: 20,
  },
  classCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  classTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  classTime: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  spotBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  spotBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  quotaBarBg: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    marginVertical: 12,
    overflow: "hidden",
  },
  quotaBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  actionBtn: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  reserveBtn: {
    backgroundColor: "#2563EB",
  },
  cancelBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  disabledBtn: {
    backgroundColor: "#F1F5F9",
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "800",
  },
});
