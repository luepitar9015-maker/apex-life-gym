import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import Home from "./src/screens/Home";
import Rutina from "./src/screens/Rutina";
import Reservas from "./src/screens/Reservas";
import QRAcceso from "./src/screens/QRAcceso";
import Perfil from "./src/screens/Perfil";
import BottomNav from "./src/components/BottomNav";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Inicio");

  const renderScreen = () => {
    switch (currentScreen) {
      case "Inicio":
        return (
          <Home
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenQR={() => setCurrentScreen("QR")}
          />
        );
      case "Rutina":
        return <Rutina onBack={() => setCurrentScreen("Inicio")} />;
      case "Reservas":
        return <Reservas onBack={() => setCurrentScreen("Inicio")} />;
      case "QR":
        return <QRAcceso onBack={() => setCurrentScreen("Inicio")} />;
      case "Perfil":
        return <Perfil />;
      default:
        return (
          <Home
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenQR={() => setCurrentScreen("QR")}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <BottomNav
        activeTab={currentScreen}
        onSelectTab={(tab) => setCurrentScreen(tab)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
});
