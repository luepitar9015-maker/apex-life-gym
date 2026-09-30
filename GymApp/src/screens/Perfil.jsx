import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { User, ShieldCheck, CreditCard, Bell, ChevronRight, LogOut, Award, Activity } from "lucide-react-native";

export default function Perfil() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarBigText}>CM</Text>
          </View>
          <Text style={styles.userName}>Carlos Mendoza</Text>
          <Text style={styles.userCode}>Socio #SOC-2026-8842</Text>

          <View style={styles.planBadge}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={styles.planBadgeText}>Plan Black VIP • Activo hasta Nov 2026</Text>
          </View>
        </View>

        {/* Biometrics Summary */}
        <View style={styles.bioCard}>
          <View style={styles.bioItem}>
            <Text style={styles.bioVal}>68.5 kg</Text>
            <Text style={styles.bioLabel}>Peso</Text>
          </View>
          <View style={styles.bioDivider} />
          <View style={styles.bioItem}>
            <Text style={styles.bioVal}>1.75 m</Text>
            <Text style={styles.bioLabel}>Estatura</Text>
          </View>
          <View style={styles.bioDivider} />
          <View style={styles.bioItem}>
            <Text style={styles.bioVal}>14.2%</Text>
            <Text style={styles.bioLabel}>% Grasa</Text>
          </View>
          <View style={styles.bioDivider} />
          <View style={styles.bioItem}>
            <Text style={styles.bioVal}>24</Text>
            <Text style={styles.bioLabel}>Visitas Mes</Text>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuGroup}>
          {[
            { icon: CreditCard, label: "Historial de Pagos & Facturas", desc: "Ver recibos de cuotas" },
            { icon: Award, label: "Mis Logros & Récords Personales", desc: "4 medallas desbloqueadas" },
            { icon: Activity, label: "Evaluaciones Físicas & InBody", desc: "Último escaneo hace 12 días" },
            { icon: Bell, label: "Recordatorios de Clases", desc: "Push & WhatsApp activos" },
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuIconBox}>
                <item.icon size={18} color="#2563EB" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn}>
          <LogOut size={16} color="#EF4444" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingTop: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarBig: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarBigText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 12,
  },
  userCode: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  bioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  bioItem: {
    alignItems: "center",
  },
  bioVal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  bioLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  bioDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#F1F5F9",
    alignSelf: "center",
  },
  menuGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  menuDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#EF4444",
  },
});
