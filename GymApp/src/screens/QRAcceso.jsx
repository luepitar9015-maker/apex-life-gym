import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { QrCode, ShieldCheck, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react-native";

export default function QRAcceso({ onBack = () => {} }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ArrowLeft size={20} color="#1E3A8A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Pase de Acceso QR</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Carnet de Acceso Digital */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.gymName}>🏋️ GYM ESENCIAL</Text>
              <Text style={styles.planName}>PLAN BLACK VIP</Text>
            </View>
            <View style={styles.activePill}>
              <ShieldCheck size={14} color="#10B981" />
              <Text style={styles.activeText}>HABILITADO</Text>
            </View>
          </View>

          {/* QR Container */}
          <View style={styles.qrWrapper}>
            <View style={styles.qrBox}>
              <QrCode size={190} color="#0F172A" />
            </View>
            <Text style={styles.memberId}>SOC-2026-8842</Text>
            <Text style={styles.memberName}>Carlos Mendoza</Text>
          </View>

          {/* Instructions */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Vigencia</Text>
              <Text style={styles.infoValue}>15 Nov 2026</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Sedes</Text>
              <Text style={styles.infoValue}>Acceso Total</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Invitados</Text>
              <Text style={styles.infoValue}>1 Restante</Text>
            </View>
          </View>
        </View>

        {/* Turnstile Helper Note */}
        <View style={styles.helperBox}>
          <AlertCircle size={18} color="#2563EB" />
          <Text style={styles.helperText}>
            Acerca la pantalla del celular al lector óptico del torniquete a 10 cm de distancia con brillo alto.
          </Text>
        </View>

        {/* Regenerate Token Button */}
        <TouchableOpacity style={styles.refreshBtn}>
          <RefreshCw size={16} color="#1E40AF" />
          <Text style={styles.refreshText}>Actualizar Código Dinámico (Seguridad)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: "space-between",
    paddingBottom: 20,
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
    fontSize: 17,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 16,
  },
  gymName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  planName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
    marginTop: 2,
  },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  activeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#059669",
  },
  qrWrapper: {
    alignItems: "center",
    paddingVertical: 24,
  },
  qrBox: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#2563EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  memberId: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E3A8A",
    marginTop: 14,
    letterSpacing: 1.5,
  },
  memberName: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
  },
  infoItem: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 2,
  },
  helperBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EFF6FF",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  helperText: {
    fontSize: 11,
    color: "#1E40AF",
    lineHeight: 16,
    flex: 1,
    fontWeight: "500",
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  refreshText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E40AF",
  },
});
