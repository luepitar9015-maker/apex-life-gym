import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView
} from "react-native";
import {
  Flame,
  Scale,
  Calendar,
  Clock,
  Dumbbell,
  QrCode,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  X
} from "lucide-react-native";

export const GymEsencialSocioScreen: React.FC<{ onNavigateTab?: (t: string) => void }> = ({ onNavigateTab }) => {
  const [routineModalVisible, setRoutineModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [reservedClass, setReservedClass] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greeting}>Hola Carlos 👋</Text>
            <Text style={styles.subgreeting}>Tu progreso de hoy</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => setQrModalVisible(true)}
          >
            <Text style={styles.avatarText}>CM</Text>
            <View style={styles.onlineDot} />
          </TouchableOpacity>
        </View>

        {/* Membresía Activa */}
        <View style={styles.membershipBadge}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={16} color="#10B981" />
            <Text style={styles.membershipText}>
              Plan Black VIP • <Text style={{ color: "#10B981", fontWeight: "800" }}>Activo</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={styles.qrPill}
            onPress={() => setQrModalVisible(true)}
          >
            <QrCode size={13} color="#1E40AF" />
            <Text style={styles.qrPillText}>Ver Pase QR</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card: Rutina del día */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.tagRoutine}>
              <Dumbbell size={12} color="#FFFFFF" />
              <Text style={styles.tagRoutineText}>RUTINA DEL DÍA</Text>
            </View>
            <View style={styles.timeTag}>
              <Clock size={12} color="#BFDBFE" />
              <Text style={styles.timeTagText}>45 minutos</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Entrenamiento de fuerza</Text>
          <Text style={styles.heroSubtitle}>
            Enfoque en Pecho, Tríceps & Estabilidad de Core. 5 ejercicios preparados por Coach Laura.
          </Text>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.85}
            onPress={() => setRoutineModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>VER RUTINA</Text>
            <ChevronRight size={18} color="#1D4ED8" />
          </TouchableOpacity>
        </View>

        {/* Fila de Métricas: Calorías y Peso */}
        <View style={styles.metricsRow}>
          {/* Card Calorías */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Calorías</Text>
              <View style={[styles.iconBox, { backgroundColor: "#FEF2F2" }]}>
                <Flame size={16} color="#EF4444" />
              </View>
            </View>
            <Text style={styles.cardValue}>320 kcal</Text>
            <View style={styles.cardTrendRow}>
              <TrendingUp size={12} color="#10B981" />
              <Text style={styles.cardTrendText}>+45 kcal vs ayer</Text>
            </View>
          </View>

          {/* Card Peso */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Peso</Text>
              <View style={[styles.iconBox, { backgroundColor: "#EFF6FF" }]}>
                <Scale size={16} color="#2563EB" />
              </View>
            </View>
            <Text style={styles.cardValue}>68.5 kg</Text>
            <View style={styles.cardTrendRow}>
              <TrendingUp size={12} color="#10B981" />
              <Text style={styles.cardTrendText}>-0.4 kg este mes</Text>
            </View>
          </View>
        </View>

        {/* Widget Próxima Clase Reservada */}
        <View style={styles.classCard}>
          <View style={styles.classHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Calendar size={18} color="#1E3A8A" />
              <Text style={styles.classTitle}>Próxima clase</Text>
            </View>
            <View style={styles.confirmedBadge}>
              <CheckCircle2 size={12} color="#10B981" />
              <Text style={styles.confirmedText}>Cupo Confirmado</Text>
            </View>
          </View>

          <View style={styles.classDetailsRow}>
            <View style={styles.classIconBg}>
              <Text style={{ fontSize: 20 }}>🚴‍♂️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.className}>Spinning</Text>
              <Text style={styles.classTime}>07:00 AM • Sala Ciclo 1</Text>
              <Text style={styles.coachName}>Instructor: Laura Gómez (Cupo 18/20)</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.toggleReserveBtn}
            onPress={() => setReservedClass(!reservedClass)}
          >
            <Text style={styles.toggleReserveText}>
              {reservedClass ? "Confirmada (Toca para liberar)" : "Reservar Plaza"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Banner de Acceso QR */}
        <TouchableOpacity
          style={styles.qrBanner}
          activeOpacity={0.9}
          onPress={() => setQrModalVisible(true)}
        >
          <View style={styles.qrBannerContent}>
            <View style={styles.qrIconBox}>
              <QrCode size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.qrBannerTitle}>Abrir Código QR para Ingresar</Text>
              <Text style={styles.qrBannerSubtitle}>
                Válido para entrada al gimnasio y casillero
              </Text>
            </View>
            <ChevronRight size={20} color="#94A3B8" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Rutina */}
      <Modal
        visible={routineModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRoutineModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTag}>RUTINA HOY • 45 MIN</Text>
                <Text style={styles.modalTitle}>Entrenamiento de Fuerza</Text>
              </View>
              <TouchableOpacity
                onPress={() => setRoutineModalVisible(false)}
                style={styles.closeBtn}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 16 }} showsVerticalScrollIndicator={false}>
              {[
                { name: "Press de Banca Plano con Barra", sets: "4 series x 10 reps", rest: "90 seg descanso" },
                { name: "Press Inclinado con Mancuernas", sets: "4 series x 12 reps", rest: "75 seg descanso" },
                { name: "Aperturas en Polea (Cruce)", sets: "3 series x 15 reps", rest: "60 seg descanso" },
                { name: "Fondos en Paralelas", sets: "3 series al fallo", rest: "60 seg descanso" },
                { name: "Extensión de Tríceps en Cuerda", sets: "4 series x 12 reps", rest: "45 seg descanso" },
              ].map((ex, idx) => (
                <View key={idx} style={styles.exerciseItem}>
                  <View style={styles.exerciseIndex}>
                    <Text style={styles.exerciseIndexText}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <Text style={styles.exerciseSets}>{ex.sets}</Text>
                    <Text style={styles.exerciseRest}>⏱️ {ex.rest}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.startWorkoutBtn}
              onPress={() => setRoutineModalVisible(false)}
            >
              <Text style={styles.startWorkoutText}>¡COMENZAR ENTRENAMIENTO!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Pase QR */}
      <Modal
        visible={qrModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: "center", paddingVertical: 32 }]}>
            <Text style={{ fontSize: 13, fontWeight: "800", color: "#2563EB", letterSpacing: 1 }}>
              PASE DIGITAL TORNÍQUETE
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "800", color: "#1E3A8A", marginTop: 4 }}>
              Carlos Mendoza
            </Text>
            <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
              Socio Activo • Plan Black VIP
            </Text>

            <View style={styles.qrBigBox}>
              <QrCode size={180} color="#0F172A" />
            </View>

            <Text style={{ fontSize: 14, fontWeight: "800", color: "#1E3A8A", letterSpacing: 2 }}>
              SOC-2026-8842
            </Text>
            <Text style={{ fontSize: 11, color: "#94A3B8", marginTop: 6, textAlign: "center" }}>
              Acerca la pantalla del celular al escáner óptico del gimnasio
            </Text>

            <TouchableOpacity
              style={styles.closeQrBtn}
              onPress={() => setQrModalVisible(false)}
            >
              <Text style={{ color: "#1E3A8A", fontWeight: "800", fontSize: 13 }}>Cerrar Pase</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E3A8A",
    letterSpacing: -0.5,
  },
  subgreeting: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarText: {
    color: "#1D4ED8",
    fontWeight: "800",
    fontSize: 15,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
    position: "absolute",
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  membershipBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  membershipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  qrPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DBEAFE",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  qrPillText: {
    color: "#1E40AF",
    fontSize: 11,
    fontWeight: "700",
  },
  heroCard: {
    backgroundColor: "#2563EB",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 20,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tagRoutine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  tagRoutineText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  timeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeTagText: {
    color: "#DBEAFE",
    fontSize: 12,
    fontWeight: "600",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: "#EFF6FF",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    opacity: 0.9,
  },
  actionButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButtonText: {
    color: "#1D4ED8",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
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
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
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
  cardValue: {
    fontWeight: "800",
    color: "#1E3A8A",
    fontSize: 22,
    letterSpacing: -0.5,
  },
  cardTrendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  cardTrendText: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "700",
  },
  classCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  confirmedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  confirmedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
  },
  classDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  classIconBg: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  className: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  classTime: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
    marginTop: 1,
  },
  coachName: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  toggleReserveBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  toggleReserveText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  qrBanner: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  qrBannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
  },
  qrBannerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  qrBannerSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "80%",
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTag: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E3A8A",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  exerciseIndex: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseIndexText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  exerciseSets: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  exerciseRest: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
    marginTop: 2,
  },
  startWorkoutBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  startWorkoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  qrBigBox: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#2563EB",
    marginVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  closeQrBtn: {
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
  },
});
