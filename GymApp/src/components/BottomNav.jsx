import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Home, Dumbbell, Calendar, QrCode, User } from "lucide-react-native";

export default function BottomNav({ activeTab = "Inicio", onSelectTab = () => {} }) {
  const tabs = [
    { id: "Inicio", label: "Inicio", icon: Home },
    { id: "Rutina", label: "Rutina", icon: Dumbbell },
    { id: "QR", label: "Mi Pase", icon: QrCode, isQR: true },
    { id: "Reservas", label: "Reservas", icon: Calendar },
    { id: "Perfil", label: "Perfil", icon: User },
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.icon;

        if (tab.isQR) {
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.9}
              onPress={() => onSelectTab(tab.id)}
              style={styles.qrFloatingWrapper}
            >
              <View style={[styles.qrFloatingButton, isActive && styles.qrFloatingActive]}>
                <IconComponent size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => onSelectTab(tab.id)}
            style={styles.tabButton}
          >
            <IconComponent
              size={20}
              color={isActive ? "#2563EB" : "#94A3B8"}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 4,
  },
  tabLabelActive: {
    color: "#2563EB",
    fontWeight: "800",
  },
  qrFloatingWrapper: {
    alignItems: "center",
    marginTop: -22,
    flex: 1,
  },
  qrFloatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  qrFloatingActive: {
    backgroundColor: "#1D4ED8",
  },
});
