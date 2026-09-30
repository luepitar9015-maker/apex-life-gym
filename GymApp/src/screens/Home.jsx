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
  Calendar,
  Clock,
  Dumbbell,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X
} from "lucide-react-native";
import Card from "../components/Card";

export default function Home({ onNavigate = () => {}, onOpenQR = () => {} }) {
  const [routineModalVisible, setRoutineModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header con Avatar y Saludo */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greeting}>Hola Carlos 👋</Text>
            <Text style={styles.subgreeting}>Tu progreso de hoy</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => onNavigate("Perfil")}
          >
            <Text style={styles.avatarText}>CM</Text>
            <View style={styles.onlineDot} />
          </TouchableOpacity>
        </View>

        {/* Tarjeta de Membresía Activa */}
        <View style={styles.membershipBadge}>
          <View style={styles.membershipInfo}>
            <ShieldCheck size={16} color="#10B981" />
            <Text style={styles.membershipText}>
              Plan Black VIP • <Text style={{ color: "#10B981", fontWeight: "800" }}>Activo</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={styles.qrPill}
            onPress={onOpenQR}
          >
            <QrCode size={14} color="#1E40AF" />
            <Text style={styles.qrPillText}>Pase QR</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card: Rutina de Hoy (Azul institucional) */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.tagRoutine}>
              <Dumbbell size={13} color="#FFFFFF" />
              <Text style={styles.tagRoutineText}>RUTINA DEL DÍA</Text>
            </View>
            <View style={styles.timeTag}>
              <Clock size={12} color="#93C5FD" />
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
          <Card
            title="Calorías"
            value="320 kcal"
            progress="+45 kcal vs ayer"
          />
          <Card
            title="Peso"
            value="68.5 kg"
            progress="-0.4 kg este mes"
          />
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
              <Text style={styles.className}>Spinning Power 45</Text>
              <Text style={styles.classTime}>Hoy • 07:00 AM • Sala Ciclo 1</Text>
              <Text style={styles.coachName}>Instructor: Laura Gómez (Cupo 18/20)</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.manageClassBtn}
            onPress={() => onNavigate("Reservas")}
          >
            <Text style={styles.manageClassText}>Gestionar o Explorar Clases</Text>
          </TouchableOpacity>
        </View>

        {/* Acceso Rápido al Torniquete QR */}
        <TouchableOpacity
          style={styles.qrBanner}
          activeOpacity={0.9}
          onPress={onOpenQR}
        >
          <View style={styles.qrBannerContent}>
            <View style={styles.qrIconBox}>
              <QrCode size={26} color="#FFFFFF" />
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

      {/* Modal de Detalle de Rutina */}
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
  membershipInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  manageClassBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  manageClassText: {
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
});
