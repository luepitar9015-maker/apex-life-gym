import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Modal
} from 'react-native';
import { 
  Dumbbell, 
  Clock, 
  Plus, 
  Check, 
  RotateCcw, 
  Award, 
  Flame, 
  Sparkles, 
  Building2, 
  Home, 
  MapPin, 
  CheckCircle2, 
  ArrowRightLeft, 
  X,
  Zap,
  Info
} from 'lucide-react-native';
import { useTheme } from '../styles/themeConfig';

// Catálogo de sedes y equipamiento para móvil
const MOBILE_GYM_LOCATIONS = [
  {
    id: 'gym-central-vip',
    name: 'Power Gym VIP (Central)',
    type: 'GYM',
    tagline: 'Equipamiento completo de discos y poleas altas',
    machines: ['Prensa 45° Discos', 'Hack Squat', 'Smith Multipower', 'Polea Doble Crossover', 'Remo T con Apoyo', 'Pec Deck', 'Hip Thrust Máquina'],
  },
  {
    id: 'gym-smart-express',
    name: 'Smart Fit Style (Express)',
    type: 'GYM',
    tagline: 'Circuito de placas guiadas y poleas multifunción',
    machines: ['Prensa Placas Guiada', 'Smith Asistida', 'Polea Funcional', 'Pec Deck Contractor', 'Press Pecho Placas', 'Curl Femoral Sentado'],
  },
  {
    id: 'gym-iron-power',
    name: 'Iron Fitness Club (Hardcore)',
    type: 'GYM',
    tagline: 'Barras olímpicas, jaula de potencia y discos',
    machines: ['Jaula Sentadilla Olímpica', 'Plataforma Peso Muerto', 'Bancos Olímpicos', 'Prensa 45° Heavy', 'Remo Barra Libre T', 'Paralelas Fondos Lastre'],
  },
  {
    id: 'home-workout',
    name: 'Entrenamiento En Casa',
    type: 'HOME',
    tagline: 'Calistenia, bandas elásticas y mancuernas',
    machines: ['Peso Corporal / Suelo', 'Bandas de Resistencia', 'Mancuernas Caseras', 'Silla / Banco Robusto'],
  },
];

export const WorkoutScreen: React.FC = () => {
  const { colorTheme, envTheme } = useTheme();

  // Estados de configuración de rutina IA
  const [selectedLevel, setSelectedLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [selectedGoal, setSelectedGoal] = useState<'HYPERTROPHY' | 'FAT_LOSS' | 'STRENGTH' | 'TONING_CORE'>('HYPERTROPHY');
  const [selectedEnv, setSelectedEnv] = useState<'GYM' | 'HOME'>('GYM');
  const [selectedGymId, setSelectedGymId] = useState<string>('gym-central-vip');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Ejercicios activos adaptados a la sede y nivel
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [showAlternativeNote, setShowAlternativeNote] = useState(false);

  // Temporizador de descanso
  const [restSeconds, setRestSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Registro de series
  const [sets, setSets] = useState([
    { id: 1, setNumber: 1, weight: '70', reps: '10', completed: true },
    { id: 2, setNumber: 2, weight: '75', reps: '10', completed: true },
    { id: 3, setNumber: 3, weight: '80', reps: '8', completed: false },
    { id: 4, setNumber: 4, weight: '80', reps: '8', completed: false },
  ]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds((sec) => sec - 1);
      }, 1000);
    } else if (restSeconds === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, restSeconds]);

  const startRestTimer = (seconds = 90) => {
    setRestSeconds(seconds);
    setIsTimerActive(true);
  };

  const toggleSetCompleted = (id: number) => {
    setSets((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextState = !s.completed;
          if (nextState) startRestTimer(selectedGoal === 'STRENGTH' ? 150 : 90);
          return { ...s, completed: nextState };
        }
        return s;
      })
    );
  };

  const addSet = () => {
    const last = sets[sets.length - 1];
    setSets([
      ...sets,
      {
        id: sets.length + 1,
        setNumber: sets.length + 1,
        weight: last ? last.weight : '70',
        reps: '10',
        completed: false,
      },
    ]);
  };

  // Rutina adaptada según sede y entorno
  const currentGym = MOBILE_GYM_LOCATIONS.find((g) => g.id === (selectedEnv === 'HOME' ? 'home-workout' : selectedGymId)) || MOBILE_GYM_LOCATIONS[0];

  const getExercisesForGym = () => {
    if (selectedEnv === 'HOME') {
      return [
        {
          name: 'Flexiones de Pecho (Push-Ups) con Pausa',
          machine: 'Peso Corporal / Calistenia en Suelo',
          reps: selectedLevel === 'BEGINNER' ? '8-10 reps (de rodillas)' : '12-15 reps',
          sets: selectedLevel === 'BEGINNER' ? 3 : 4,
          rpe: 8.0,
          alternative: 'Flexiones inclinadas sobre silla resistente',
          notes: 'Codos a 45 grados, 2 segundos en el fondo.',
        },
        {
          name: 'Press Militar con Banda Elástica',
          machine: 'Bandas Elásticas de Resistencia',
          reps: '12-15 reps',
          sets: 3,
          rpe: 8.5,
          alternative: 'Pike push-ups con pies en suelo',
          notes: 'Pisar banda a dos pies para mayor tensión.',
        },
        {
          name: 'Fondos de Tríceps en Silla Robusta (Dips)',
          machine: 'Silla Robusta / Banco Casero',
          reps: '12-15 reps',
          sets: 3,
          rpe: 8.5,
          alternative: 'Extensiones de tríceps en suelo (Diamond push-ups)',
          notes: 'Espalda rozando el borde de la silla.',
        },
      ];
    }

    if (currentGym.id === 'gym-smart-express') {
      return [
        {
          name: 'Press de Pecho Plano Guiado en Placas',
          machine: 'Máquina de Pecho en Placas #04',
          reps: selectedGoal === 'STRENGTH' ? '6-8 reps' : '10-12 reps',
          sets: selectedLevel === 'BEGINNER' ? 3 : 4,
          rpe: 8.5,
          alternative: 'Press en Máquina Smith Asistida con banco',
          notes: 'Asiento a la altura del esternón medio.',
        },
        {
          name: 'Pec Deck / Contractor Pectoral',
          machine: 'Pec Deck a Placas #08',
          reps: '12-15 reps',
          sets: 4,
          rpe: 9.0,
          alternative: 'Cruces en Polea Doble Funcional',
          notes: 'Empuje con los codos manteniendo el pecho alto.',
        },
        {
          name: 'Press Militar en Máquina Smith Asistida',
          machine: 'Máquina Smith / Multipower',
          reps: '10-12 reps',
          sets: 3,
          rpe: 8.5,
          alternative: 'Press sentado con mancuernas de 14-22kg',
          notes: 'Descenso en 3 segundos sobre clavículas.',
        },
      ];
    }

    if (currentGym.id === 'gym-iron-power') {
      return [
        {
          name: 'Press de Banca Plano con Barra Olímpica',
          machine: 'Banco Olímpico Plano Libre #1',
          reps: selectedGoal === 'STRENGTH' ? '4-6 reps' : '8-10 reps',
          sets: 4,
          rpe: 9.0,
          alternative: 'Press Inclinado Pesado con Mancuernas de 34kg+',
          notes: 'Retracción escapular cerrada y leg drive.',
        },
        {
          name: 'Fondos en Paralelas con Cinturón de Lastre',
          machine: 'Estación de Paralelas Pesadas',
          reps: '8-10 reps (+10kg)',
          sets: 4,
          rpe: 9.0,
          alternative: 'Press cerrado olímpico en banco plano',
          notes: 'Inclinación de 20° para reclutar pectoral inferior.',
        },
        {
          name: 'Press Francés con Barra Z en Banco',
          machine: 'Banco con Barra Z',
          reps: '10-12 reps',
          sets: 3,
          rpe: 8.5,
          alternative: 'Extensión de tríceps tras nuca pesada',
          notes: 'Codos cerrados apuntando al techo.',
        },
      ];
    }

    // Default: Sede Central VIP
    return [
      {
        name: 'Press de Pecho Convergente Inclinado',
        machine: 'Máquina Convergente #02',
        reps: selectedGoal === 'STRENGTH' ? '6-8 reps' : '8-10 reps',
        sets: 4,
        rpe: 8.5,
        alternative: 'Press en Multipower Smith con banco a 30°',
        notes: 'Alineación de muñecas y codos en el plano del asiento.',
      },
      {
        name: 'Pec Deck / Aperturas Convergentes',
        machine: 'Pec Deck / Deltoides #05',
        reps: '12-15 reps',
        sets: 4,
        rpe: 9.0,
        alternative: 'Cruces en Polea Doble Crossover desde arriba',
        notes: 'Estiramiento controlado sin forzar hombros.',
      },
      {
        name: 'Elevaciones Laterales en Polea Doble Crossover',
        machine: 'Torre Central de Poleas Crossover',
        reps: '12-15 reps',
        sets: 4,
        rpe: 8.5,
        alternative: 'Elevaciones laterales con mancuernas en banco a 75°',
        notes: 'Cables cruzados por detrás de la espalda.',
      },
    ];
  };

  const exerciseList = getExercisesForGym();
  const currentEx = exerciseList[activeExerciseIndex] || exerciseList[0];

  return (
    <ScrollView style={[styles.container, { backgroundColor: envTheme.canvasBg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      
      {/* Barra de Ajuste Rápido de Rutina IA */}
      <TouchableOpacity
        style={[styles.aiConfigPill, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}
        onPress={() => setIsConfigModalOpen(true)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
          <Sparkles size={16} color={colorTheme.primary} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, fontWeight: '800', color: colorTheme.primary, textTransform: 'uppercase' }}>
              CONFIGURADOR DE RUTINA IA
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: envTheme.textMain }} numberOfLines={1}>
              {selectedEnv === 'HOME' ? '🏠 En Casa' : `🏢 ${currentGym.name}`} • {selectedLevel === 'BEGINNER' ? 'Básico' : selectedLevel === 'INTERMEDIATE' ? 'Medio' : 'Pro'}
            </Text>
          </View>
        </View>
        <View style={[styles.configActionBtn, { backgroundColor: colorTheme.primary }]}>
          <Text style={{ fontSize: 10, fontWeight: '900', color: '#000' }}>CAMBIAR</Text>
        </View>
      </TouchableOpacity>

      {/* Hero Banner Nexo Workout */}
      <View style={[styles.heroBanner, { backgroundColor: envTheme.cardBg, borderColor: colorTheme.primary }]}>
        <Text style={[styles.watermark, { color: colorTheme.primaryGlow }]}>PUSH</Text>

        <View style={styles.badgeRow}>
          <View style={[styles.pillBadge, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}>
            <Dumbbell size={12} color={colorTheme.primary} />
            <Text style={[styles.pillBadgeText, { color: colorTheme.primary }]}>
              {selectedGoal === 'HYPERTROPHY' ? 'HIPERTROFIA' : selectedGoal === 'FAT_LOSS' ? 'DEFINICIÓN' : 'FUERZA'} • {currentGym.name.split('(')[0].trim()}
            </Text>
          </View>
          {restSeconds > 0 && (
            <View style={[styles.timerBadge, { backgroundColor: 'rgba(6, 182, 212, 0.15)', borderColor: '#06b6d4' }]}>
              <Clock size={12} color="#06b6d4" />
              <Text style={{ color: '#06b6d4', fontSize: 10, fontWeight: '800' }}>{restSeconds}s DESCANSO</Text>
            </View>
          )}
        </View>

        <Text style={[styles.title, { color: envTheme.textMain }]}>{currentEx.name}</Text>
        
        {/* Máquina requerida según el gym */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 8, flexWrap: 'wrap' }}>
          <View style={[styles.machineTag, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981' }]}>
            <CheckCircle2 size={11} color="#10b981" />
            <Text style={{ color: '#10b981', fontSize: 10, fontWeight: '800' }}>
              Máquina: {currentEx.machine}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: envTheme.textMuted }]}>
            {currentEx.sets} Series • {currentEx.reps} • RPE {currentEx.rpe}
          </Text>
        </View>

        {/* Botón Alternativa si está ocupada */}
        <TouchableOpacity
          style={[styles.altBtn, { borderColor: showAlternativeNote ? '#ef4444' : envTheme.border }]}
          onPress={() => setShowAlternativeNote(!showAlternativeNote)}
        >
          <ArrowRightLeft size={12} color={showAlternativeNote ? '#ef4444' : colorTheme.primary} />
          <Text style={{ fontSize: 11, fontWeight: '800', color: showAlternativeNote ? '#ef4444' : colorTheme.primary }}>
            {showAlternativeNote ? 'Ocultar alternativa' : '¿Máquina ocupada? Ver alternativa'}
          </Text>
        </TouchableOpacity>

        {showAlternativeNote && (
          <View style={[styles.altBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }]}>
            <Text style={{ color: '#ef4444', fontSize: 11, fontWeight: '800' }}>
              ⚡ Alternativa en esta sede:
            </Text>
            <Text style={{ color: envTheme.textMain, fontSize: 11, marginTop: 2 }}>
              {currentEx.alternative}
            </Text>
          </View>
        )}
      </View>

      {/* Control de Series */}
      <View style={[styles.card, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: envTheme.textMain }]}>Registro de Series Efectivas</Text>
          <TouchableOpacity
            style={[styles.addSetBtn, { backgroundColor: colorTheme.accentBg, borderColor: colorTheme.primary }]}
            onPress={addSet}
          >
            <Plus size={12} color={colorTheme.primary} />
            <Text style={[styles.addSetText, { color: colorTheme.primary }]}>+ Serie</Text>
          </TouchableOpacity>
        </View>

        {/* Encabezado de Columnas */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colHeader, { width: 44 }]}>SERIE</Text>
          <Text style={[styles.colHeader, { flex: 1, textAlign: 'center' }]}>PESO (KG)</Text>
          <Text style={[styles.colHeader, { flex: 1, textAlign: 'center' }]}>REPS</Text>
          <Text style={[styles.colHeader, { width: 50, textAlign: 'right' }]}>CHECK</Text>
        </View>

        {sets.map((set) => (
          <View
            key={set.id}
            style={[
              styles.setRow,
              {
                backgroundColor: set.completed ? colorTheme.accentBg : 'rgba(255, 255, 255, 0.02)',
                borderColor: set.completed ? colorTheme.primary : 'rgba(255, 255, 255, 0.06)',
              },
            ]}
          >
            <View style={[styles.setNumBox, { backgroundColor: set.completed ? colorTheme.primary : '#334155' }]}>
              <Text style={{ color: set.completed ? '#000' : '#fff', fontSize: 11, fontWeight: '800' }}>
                #{set.setNumber}
              </Text>
            </View>

            <TextInput
              style={[styles.inputBox, { color: envTheme.textMain, borderColor: envTheme.border }]}
              value={set.weight}
              keyboardType="numeric"
              onChangeText={(txt) => {
                setSets(sets.map((s) => (s.id === set.id ? { ...s, weight: txt } : s)));
              }}
            />

            <TextInput
              style={[styles.inputBox, { color: envTheme.textMain, borderColor: envTheme.border }]}
              value={set.reps}
              keyboardType="numeric"
              onChangeText={(txt) => {
                setSets(sets.map((s) => (s.id === set.id ? { ...s, reps: txt } : s)));
              }}
            />

            <TouchableOpacity
              style={[
                styles.checkBtn,
                {
                  backgroundColor: set.completed ? colorTheme.primary : 'rgba(255, 255, 255, 0.05)',
                  borderColor: set.completed ? colorTheme.primary : 'rgba(255, 255, 255, 0.1)',
                },
              ]}
              onPress={() => toggleSetCompleted(set.id)}
            >
              {set.completed && <Check size={16} color="#000000" />}
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Siguientes Ejercicios de la Rutina según el gym */}
      <View style={[styles.card, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border, marginTop: 14 }]}>
        <Text style={[styles.cardTitle, { color: envTheme.textMain, marginBottom: 8 }]}>
          Otros Ejercicios del Día ({exerciseList.length} Estaciones)
        </Text>
        {exerciseList.map((ex, idx) => {
          const isActive = idx === activeExerciseIndex;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.nextExItem,
                { 
                  borderColor: 'rgba(255,255,255,0.05)',
                  backgroundColor: isActive ? colorTheme.accentBg : 'transparent',
                  paddingHorizontal: 8,
                  borderRadius: 8,
                }
              ]}
              onPress={() => {
                setActiveExerciseIndex(idx);
                setShowAlternativeNote(false);
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: isActive ? colorTheme.primary : envTheme.textMain }}>
                  {idx + 1}. {ex.name}
                </Text>
                <Text style={{ fontSize: 11, color: envTheme.textMuted }}>
                  Máquina: {ex.machine} • {ex.reps}
                </Text>
              </View>
              {isActive && (
                <View style={{ backgroundColor: colorTheme.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                  <Text style={{ fontSize: 9, fontWeight: '900', color: '#000' }}>ACTIVO</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* MODAL CONFIGURADOR DE RUTINA IA EN MÓVIL */}
      <Modal visible={isConfigModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: envTheme.cardBg, borderColor: envTheme.border }]}>
            {/* Cabecera */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Sparkles size={18} color={colorTheme.primary} />
                <Text style={[styles.modalTitle, { color: envTheme.textMain }]}>Configurar Rutina IA</Text>
              </View>
              <TouchableOpacity onPress={() => setIsConfigModalOpen(false)}>
                <X size={20} color={envTheme.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
              {/* 1. Nivel */}
              <Text style={[styles.configSectionTitle, { color: colorTheme.primary }]}>1. NIVEL DE ENTRENAMIENTO</Text>
              <View style={styles.chipRow}>
                {[
                  { id: 'BEGINNER', label: 'Básico' },
                  { id: 'INTERMEDIATE', label: 'Medio' },
                  { id: 'ADVANCED', label: 'Avanzado' },
                ].map((lvl) => (
                  <TouchableOpacity
                    key={lvl.id}
                    onPress={() => setSelectedLevel(lvl.id as any)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selectedLevel === lvl.id ? colorTheme.primary : 'rgba(255,255,255,0.05)',
                        borderColor: selectedLevel === lvl.id ? colorTheme.primary : envTheme.border,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '800', color: selectedLevel === lvl.id ? '#000' : envTheme.textMain }}>
                      {lvl.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 2. Objetivo */}
              <Text style={[styles.configSectionTitle, { color: colorTheme.primary, marginTop: 14 }]}>
                2. LO QUE QUIERES MEJORAR
              </Text>
              <View style={styles.chipRow}>
                {[
                  { id: 'HYPERTROPHY', label: 'Hipertrofia' },
                  { id: 'FAT_LOSS', label: 'Perder Grasa' },
                  { id: 'STRENGTH', label: 'Fuerza' },
                  { id: 'TONING_CORE', label: 'Tonificación' },
                ].map((gl) => (
                  <TouchableOpacity
                    key={gl.id}
                    onPress={() => setSelectedGoal(gl.id as any)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selectedGoal === gl.id ? colorTheme.primary : 'rgba(255,255,255,0.05)',
                        borderColor: selectedGoal === gl.id ? colorTheme.primary : envTheme.border,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '800', color: selectedGoal === gl.id ? '#000' : envTheme.textMain }}>
                      {gl.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 3. Modalidad */}
              <Text style={[styles.configSectionTitle, { color: colorTheme.primary, marginTop: 14 }]}>
                3. LUGAR DE ENTRENAMIENTO
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setSelectedEnv('GYM')}
                  style={[
                    styles.envBtn,
                    {
                      backgroundColor: selectedEnv === 'GYM' ? colorTheme.accentBg : 'rgba(255,255,255,0.04)',
                      borderColor: selectedEnv === 'GYM' ? colorTheme.primary : envTheme.border,
                    },
                  ]}
                >
                  <Building2 size={16} color={selectedEnv === 'GYM' ? colorTheme.primary : envTheme.textMuted} />
                  <Text style={{ fontSize: 12, fontWeight: '800', color: envTheme.textMain }}>Máquinas Gym</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedEnv('HOME')}
                  style={[
                    styles.envBtn,
                    {
                      backgroundColor: selectedEnv === 'HOME' ? colorTheme.accentBg : 'rgba(255,255,255,0.04)',
                      borderColor: selectedEnv === 'HOME' ? colorTheme.primary : envTheme.border,
                    },
                  ]}
                >
                  <Home size={16} color={selectedEnv === 'HOME' ? colorTheme.primary : envTheme.textMuted} />
                  <Text style={{ fontSize: 12, fontWeight: '800', color: envTheme.textMain }}>En Casa</Text>
                </TouchableOpacity>
              </View>

              {/* 4. Gimnasio donde estás */}
              {selectedEnv === 'GYM' && (
                <>
                  <Text style={[styles.configSectionTitle, { color: colorTheme.primary, marginTop: 14 }]}>
                    4. GIMNASIO / SEDE DONDE ESTÁS
                  </Text>
                  {MOBILE_GYM_LOCATIONS.filter((g) => g.type === 'GYM').map((gym) => {
                    const isSelected = selectedGymId === gym.id;
                    return (
                      <TouchableOpacity
                        key={gym.id}
                        onPress={() => setSelectedGymId(gym.id)}
                        style={[
                          styles.gymCardOption,
                          {
                            backgroundColor: isSelected ? colorTheme.accentBg : 'rgba(255,255,255,0.03)',
                            borderColor: isSelected ? colorTheme.primary : envTheme.border,
                          },
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 13, fontWeight: '800', color: envTheme.textMain }}>
                            {gym.name}
                          </Text>
                          <Text style={{ fontSize: 10, color: envTheme.textMuted }}>
                            {gym.tagline}
                          </Text>
                          <Text style={{ fontSize: 10, color: colorTheme.primary, marginTop: 2, fontWeight: '700' }}>
                            {gym.machines.length} máquinas mapeadas en este gym
                          </Text>
                        </View>
                        {isSelected && <CheckCircle2 size={18} color={colorTheme.primary} />}
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.applyRoutineBtn, { backgroundColor: colorTheme.primary }]}
              onPress={() => {
                setActiveExerciseIndex(0);
                setIsConfigModalOpen(false);
              }}
            >
              <Sparkles size={16} color="#000" />
              <Text style={{ fontSize: 13, fontWeight: '900', color: '#000' }}>
                APLICAR RUTINA CON ESTAS MÁQUINAS
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 90,
  },
  aiConfigPill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  configActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  heroBanner: {
    position: 'relative',
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    top: 6,
    right: 8,
    fontSize: 40,
    fontWeight: '900',
    opacity: 0.12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  pillBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
  },
  machineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  altBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    marginTop: 4,
  },
  altBox: {
    marginTop: 6,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  addSetText: {
    fontSize: 11,
    fontWeight: '800',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingBottom: 6,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  colHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 8,
  },
  setNumBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    paddingVertical: 4,
    fontSize: 13,
    fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  checkBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextExItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 18,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  configSectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  envBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  gymCardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  applyRoutineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
  },
});
