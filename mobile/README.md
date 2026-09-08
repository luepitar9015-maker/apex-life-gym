# 📱 Gym Fit AI Mobile App (Android & iOS)

Aplicación móvil nativa multiplataforma construida con **React Native & Expo** para los socios y entrenadores de **Gym Fit AI**.

---

## ⚡ Características Principales

1. **🎟️ Carnet Digital QR (Mi Pase):**
   - Código QR dinámico para acceso automático en el torniquete del gimnasio.
   - Estado del plan de membresía y días restantes de vigencia.

2. **🏋️ Entrenamiento en Vivo (Workout Live):**
   - Registro de series, repeticiones logradas y pesos levantados (kg).
   - Cronómetro regresivo de descanso automático (90s / 120s) al completar cada serie.
   - Pautas del entrenador y ejercicios del día.

3. **🧍 Escaneo Corporal por IA:**
   - Captura guiada de fotos frontal y de perfil.
   - Envío a la API de visión artificial para estimación de % de grasa corporal, masa magra y análisis postural.

4. **🥗 Diario de Nutrición e Hidratación:**
   - Lista interactiva de comidas del día con macros por plato.
   - Contador de hidratación en litros y vasos de agua.

---

## 🚀 Cómo Ejecutar la App en tu Teléfono o Emulador

### 1. Instalar dependencias
```bash
cd mobile
npm install
```

### 2. Iniciar el Servidor de Desarrollo
```bash
npx expo start
```

### 3. Abrir en tu Dispositivo Físico
- **Android:** Descarga la app **Expo Go** desde Google Play Store y escanea el código QR que aparecerá en tu terminal.
- **iOS:** Abre la cámara de tu iPhone y escanea el código QR para abrirlo en **Expo Go** (descargable desde App Store).

### 4. Compilar APK para Android
Si deseas generar el archivo instalador APK directo para teléfonos Android:
```bash
npx eas-cli build -p android --profile preview
```
