// Catálogo Exhaustivo de Ejercicios: Máquinas de Gimnasio vs Ejercicios en Casa
export const EXERCISES_DATABASE = [
  // ==========================================
  // 🏢 MÁQUINAS DEL GIMNASIO (GYM MACHINES)
  // ==========================================
  {
    id: 'gym-leg-press',
    name: 'Prensa de Piernas Inclinada a 45°',
    location: 'GYM',
    category: 'Máquina de Palanca / Placas',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Cuádriceps y Glúteos',
    secondaryMuscle: 'Isquiosurales y Aductores',
    level: 'Principiante a Avanzado',
    machineType: 'Prensa 45° con discos o placas',
    tempo: '3-0-1 (3s bajada, 0s pausa, 1s empuje)',
    breathing: 'Inhala mientras bajas la plataforma; exhala con fuerza al empujar.',
    mistakes: ['Despegar la zona lumbar del respaldo', 'Bloquear las rodillas por completo en la extensión', 'Levantar los talones de la plataforma'],
    steps: [
      'Siéntate con la espalda y cadera bien pegadas al respaldo acolchado.',
      'Coloca los pies a la anchura de los hombros en el centro de la plataforma.',
      'Libera las palancas de seguridad con ambas manos sujetando los agarres.',
      'Flexiona las rodillas de forma controlada hasta un ángulo cercano a 90°.',
      'Empuja con la fuerza de los talones y la planta completa sin hiperextender rodillas al final.'
    ],
    animationType: 'leg-press'
  },
  {
    id: 'gym-leg-extension',
    name: 'Extensión de Cuádriceps en Máquina',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Cuádriceps (Recto femoral y vastos)',
    secondaryMuscle: 'Tensor de la fascia lata',
    level: 'Todos los niveles',
    machineType: 'Sillón de extensiones de cuádriceps',
    tempo: '2-1-2 (2s subida, 1s contracción isométrica, 2s bajada)',
    breathing: 'Exhala al subir las piernas; inhala al descender el rodillo.',
    mistakes: ['Impulsar el torso hacia atrás', 'Usar peso excesivo que despegue los glúteos del asiento', 'Dejar caer el peso sin frenar la bajada'],
    steps: [
      'Ajusta el respaldo para que la curva de las rodillas coincida con el eje de rotación de la máquina.',
      'Coloca el rodillo inferior justo sobre los tobillos (empeine bajo).',
      'Sujeta firmemente las manillas laterales para fijar la pelvis.',
      'Extiende las piernas hasta llegar casi a la línea horizontal, aguantando 1 segundo la contracción.',
      'Baja el peso lentamente sintiendo el estiramiento del cuádriceps.'
    ],
    animationType: 'leg-extension'
  },
  {
    id: 'gym-leg-curl',
    name: 'Curl Femoral Tumbado / Sentado',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Isquiosurales (Bíceps femoral y semitendinoso)',
    secondaryMuscle: 'Gemelos (Gastrocnemio)',
    level: 'Intermedio',
    machineType: 'Máquina de curl femoral prone / seated',
    tempo: '2-1-2 (2s flexión, 1s pausa, 2s extensión controlada)',
    breathing: 'Exhala al flexionar las rodillas hacia los glúteos; inhala al retornar.',
    mistakes: ['Arquear en exceso la espalda lumbar', 'Despegar la cadera de la almohadilla', 'Movimientos bruscos sin control'],
    steps: [
      'Ajusta el rodillo para que descanse en la parte posterior de los tobillos (tendón de Aquiles).',
      'Alinea la articulación de la rodilla con el punto de giro de la máquina.',
      'Flexiona las piernas contrayendo los isquiotibiales hacia los glúteos.',
      'Aprieta 1 segundo en la máxima flexión y desciende lentamente sin soltar la tensión.'
    ],
    animationType: 'leg-curl'
  },
  {
    id: 'gym-lat-pulldown',
    name: 'Jalón al Pecho en Polea Alta (Lat Pulldown)',
    location: 'GYM',
    category: 'Polea / Torre de Tracción',
    muscleGroup: 'Espalda',
    primaryMuscle: 'Dorsal Ancho y Redondo Mayor',
    secondaryMuscle: 'Bíceps braquial y Deltoides posterior',
    level: 'Todos los niveles',
    machineType: 'Torre de polea alta con barra ancha',
    tempo: '1-1-2 (1s tirón al pecho, 1s retracción escapular, 2s retorno)',
    breathing: 'Inhala antes de tirar; exhala al llevar la barra hacia la clavícula.',
    mistakes: ['Tirar la barra por detrás de la nuca', 'Balancear el torso exageradamente hacia atrás', 'Encoger los hombros hacia las orejas'],
    steps: [
      'Ajusta los rodillos para que queden firmes sobre los muslos evitando que te levantes.',
      'Agarra la barra con un ancho superior al de los hombros y palmas al frente (pronación).',
      'Con el torso ligeramente inclinado hacia atrás (10-15°), deprime las escápulas.',
      'Tira de la barra hacia la parte alta del pecho guiando el movimiento con los codos.',
      'Regresa la barra estirando completamente los dorsales de forma controlada.'
    ],
    animationType: 'lat-pulldown'
  },
  {
    id: 'gym-seated-cable-row',
    name: 'Remo Sentado en Polea Baja (Cable Row)',
    location: 'GYM',
    category: 'Polea / Tracción Horizontal',
    muscleGroup: 'Espalda',
    primaryMuscle: 'Espalda Media (Romboides y Trapecio)',
    secondaryMuscle: 'Dorsal Ancho, Deltoides Posterior y Bíceps',
    level: 'Todos los niveles',
    machineType: 'Banco de remo en polea baja con agarre V estrecho',
    tempo: '2-1-2 (1s tirón, 1s contracción escapular, 2s retorno controlado)',
    breathing: 'Exhala al llevar el agarre hacia el ombligo; inhala al extender los brazos.',
    mistakes: ['Redondear la espalda baja (zona lumbar)', 'Impulsarse con balanceo del torso', 'No juntar las escápulas al final del tirón'],
    steps: [
      'Siéntate con los pies en los topes, rodillas semi-flexionadas y espalda erguida.',
      'Sujeta el agarre en V con los brazos extendidos y el pecho elevado.',
      'Tira del cable dirigiendo los codos pegados a los costados hacia atrás.',
      'Junta las escápulas en la contracción máxima cerca del abdomen.',
      'Regresa lentamente estirando los brazos sin encorvar la columna.'
    ],
    animationType: 'cable-row'
  },
  {
    id: 'gym-chest-press',
    name: 'Press de Pecho en Máquina Guiada',
    location: 'GYM',
    category: 'Máquina de Palanca / Concéntrica',
    muscleGroup: 'Pecho',
    primaryMuscle: 'Pectoral Mayor (Fibras medias e inferiores)',
    secondaryMuscle: 'Tríceps y Deltoides Anterior',
    level: 'Principiante a Intermedio',
    machineType: 'Máquina de press de pecho sentado con selector de placas',
    tempo: '2-0-1 (2s fase excéntrica, 1s empuje)',
    breathing: 'Inhala mientras los agarres regresan al pecho; exhala con fuerza al empujar.',
    mistakes: ['Separar la espalda del respaldo', 'Subir los codos a la altura de las orejas (lesión de hombro)', 'Descolocar los hombros hacia adelante'],
    steps: [
      'Ajusta la altura del asiento para que los agarres queden a la altura media del pecho.',
      'Apoya la cabeza, espalda alta y glúteos firmemente en el respaldo.',
      'Empuja los manillares hacia adelante hasta la extensión casi total de los brazos.',
      'Retorna controlando el peso hasta sentir el estiramiento pectoral (codos a 45° del torso).'
    ],
    animationType: 'chest-press'
  },
  {
    id: 'gym-pec-deck',
    name: 'Aperturas en Máquina (Pec Deck / Fly)',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Pecho',
    primaryMuscle: 'Pectoral Mayor (Enfoque en aducción y centro)',
    secondaryMuscle: 'Deltoides anterior',
    level: 'Todos los niveles',
    machineType: 'Máquina Contractora / Pec Deck Fly',
    tempo: '2-1-2 (2s apertura, 1s apretón en el centro)',
    breathing: 'Inhala al abrir los brazos; exhala al juntar los brazos al frente.',
    mistakes: ['Abrir los brazos más allá de la línea de los hombros forzando el manguito rotador', 'Flexionar y extender los codos como en un press'],
    steps: [
      'Regula el asiento para que los brazos queden paralelos al suelo con los codos ligeramente doblados.',
      'Junta los manillares al frente del pecho como si abrazaras un árbol grande.',
      'Aprieta con fuerza el pectoral durante 1 segundo en el punto de contacto.',
      'Abre lentamente manteniendo los codos rígidos y firmes.'
    ],
    animationType: 'pec-deck'
  },
  {
    id: 'gym-shoulder-press',
    name: 'Press Militar en Máquina de Hombros',
    location: 'GYM',
    category: 'Máquina Guiada de Empuje Vertical',
    muscleGroup: 'Hombros',
    primaryMuscle: 'Deltoides Anterior y Medio',
    secondaryMuscle: 'Tríceps y Trapecio superior',
    level: 'Todos los niveles',
    machineType: 'Máquina de press militar de hombros con respaldo vertical',
    tempo: '2-0-1 (2s bajada, 1s empuje hacia arriba)',
    breathing: 'Exhala al empujar hacia el techo; inhala al bajar los agarres a nivel de orejas.',
    mistakes: ['Arquear la zona lumbar para compensar el peso', 'Bloquear los codos arriba con impacto articular'],
    steps: [
      'Ajusta el asiento para que los agarres queden a la altura de las clavículas.',
      'Mantén los pies firmes en el suelo y el core contraído.',
      'Empuja los agarres hacia arriba hasta extender los brazos sin hiperextensión.',
      'Desciende de forma controlada hasta la altura de las orejas.'
    ],
    animationType: 'shoulder-press'
  },
  {
    id: 'gym-tricep-pushdown',
    name: 'Extensión de Tríceps en Polea Alta (Pushdown)',
    location: 'GYM',
    category: 'Polea / Aislamiento de Brazos',
    muscleGroup: 'Brazos',
    primaryMuscle: 'Tríceps Braquial (Cabeza lateral y larga)',
    secondaryMuscle: 'Antebrazos y muñecas',
    level: 'Principiante a Avanzado',
    machineType: 'Polea alta con cuerda o barra recta/V',
    tempo: '2-1-2 (2s subida, 1s contracción abajo)',
    breathing: 'Exhala al empujar hacia abajo; inhala al subir los antebrazos a 90°.',
    mistakes: ['Mover los codos hacia adelante y atrás', 'Usar el peso del cuerpo inclinándose sobre la barra', 'Separar los codos de los costados'],
    steps: [
      'Párate frente a la polea con los codos pegados a los costados del torso.',
      'Sujeta la cuerda o barra a la altura del pecho.',
      'Empuja hacia abajo extendiendo los brazos por completo.',
      'Si usas cuerda, abre las puntas hacia afuera en la parte inferior para mayor contracción.',
      'Regresa lentamente hasta que los antebrazos queden paralelos al suelo.'
    ],
    animationType: 'tricep-pushdown'
  },
  {
    id: 'gym-bicep-curl-machine',
    name: 'Curl de Bíceps en Banco Scott / Máquina',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Brazos',
    primaryMuscle: 'Bíceps Braquial y Braquial anterior',
    secondaryMuscle: 'Braquiorradial',
    level: 'Todos los niveles',
    machineType: 'Máquina de predicador / Scott curl asistido',
    tempo: '2-1-2 (2s subida, 1s contracción, 2s bajada controlada)',
    breathing: 'Exhala al flexionar los codos; inhala al extender los brazos.',
    mistakes: ['Despegar los codos del soporte acolchado', 'Extender los brazos bruscamente con sobrecarga en tendones'],
    steps: [
      'Coloca los brazos sobre la almohadilla inclinada con las axilas bien apoyadas en el borde superior.',
      'Agarra los manillares con agarre supino (palmas hacia arriba).',
      'Flexiona los codos contrayendo los bíceps con potencia.',
      'Desciende de forma suave y controlada sin soltar la tensión en el punto más bajo.'
    ],
    animationType: 'bicep-curl'
  },
  {
    id: 'gym-cable-crunch',
    name: 'Crunch Abdominal en Polea Alta',
    location: 'GYM',
    category: 'Polea / Core con Carga',
    muscleGroup: 'Abdomen / Core',
    primaryMuscle: 'Recto Abdominal',
    secondaryMuscle: 'Oblicuos',
    level: 'Intermedio',
    machineType: 'Polea alta con cuerda doble de tríceps',
    tempo: '2-1-2 (2s flexión de columna, 1s apriete abdominal)',
    breathing: 'Exhala todo el aire al encorvar el tronco; inhala al extender el torso.',
    mistakes: ['Mover la cadera hacia atrás (usar flexores de cadera en vez del abdomen)', 'Bajar con los brazos en lugar de enrollar la columna'],
    steps: [
      'Arrodíllate frente a la polea alta sosteniendo la cuerda a ambos lados de la cabeza (junto a las orejas).',
      'Fija la cadera en una posición estática sin sentarte en los talones.',
      'Flexiona la columna vertebral llevando los codos hacia las rodillas apretando el abdomen.',
      'Regresa lentamente sin hiperextender la zona lumbar.'
    ],
    animationType: 'cable-crunch'
  },
  {
    id: 'gym-smith-machine-squat',
    name: 'Sentadilla en Máquina Smith (Multipower)',
    location: 'GYM',
    category: 'Máquina Smith / Rieles Guiados',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Cuádriceps y Glúteos',
    secondaryMuscle: 'Isquiotibiales y Zona Core',
    level: 'Intermedio a Avanzado',
    machineType: 'Smith Machine con barra guiada y ganchos de seguridad',
    tempo: '3-1-1 (3s bajada profunda, 1s pausa, 1s subida)',
    breathing: 'Inhala hondo y aprieta el abdomen al descender; exhala al superar el punto medio de subida.',
    mistakes: ['Colocar los pies demasiado atrás respecto a la barra', 'Arquear la espalda o despegar talones'],
    steps: [
      'Coloca la barra sobre los trapecios (no en el cuello) y adelanta ligeramente los pies.',
      'Gira la barra para desenganchar los topes de seguridad.',
      'Desciende flexionando cadera y rodillas hasta que los muslos queden paralelos al suelo.',
      'Empuja con los talones manteniendo el pecho erguido hasta la posición inicial.'
    ],
    animationType: 'smith-squat'
  },

  // ==========================================
  // 🏠 RUTINAS DESDE CASA (HOME WORKOUTS)
  // ==========================================
  {
    id: 'home-push-up',
    name: 'Flexiones de Pecho Clásicas (Push-ups)',
    location: 'CASA',
    category: 'Peso Corporal / Calistenia',
    muscleGroup: 'Pecho',
    primaryMuscle: 'Pectoral Mayor y Tríceps',
    secondaryMuscle: 'Deltoides anterior, Core y Serrato',
    level: 'Todos los niveles (con opción en rodillas)',
    machineType: 'Sin equipamiento (Esterilla o Suelo)',
    tempo: '2-0-1 (2s descenso controlado, 1s empuje)',
    breathing: 'Inhala mientras bajas el pecho hacia el suelo; exhala al empujar hacia arriba.',
    mistakes: ['Dejar caer la cadera formando un arco lumbar', 'Abrir los codos en forma de T a 90° (daño en hombro)', 'Hacer medio recorrido sin tocar casi el suelo'],
    steps: [
      'Colócate en posición de plancha alta con manos un poco más anchas que los hombros.',
      'Mantén una línea recta desde la cabeza hasta los talones con abdomen y glúteos firmes.',
      'Flexiona los codos en un ángulo de 45° respecto al torso hasta que el pecho quede a 2 cm del suelo.',
      'Empuja el suelo con fuerza hasta estirar los brazos sin bloquear los codos.'
    ],
    animationType: 'push-up'
  },
  {
    id: 'home-diamond-push-up',
    name: 'Flexiones Diamante (Diamond Push-ups)',
    location: 'CASA',
    category: 'Peso Corporal / Énfasis Tríceps',
    muscleGroup: 'Brazos',
    primaryMuscle: 'Tríceps Braquial',
    secondaryMuscle: 'Pectoral interno y Deltoides anterior',
    level: 'Intermedio a Avanzado',
    machineType: 'Sin equipamiento',
    tempo: '2-1-1 (2s descenso, 1s contracción de tríceps)',
    breathing: 'Inhala al descender; exhala al extender los brazos.',
    mistakes: ['Separar las manos durante la ejecución', 'Perder la rigidez de la plancha abdominal'],
    steps: [
      'Junta los dedos índices y pulgares en el suelo formando un triángulo o diamante debajo del esternón.',
      'Mantén el cuerpo recto en tabla.',
      'Baja el pecho hacia el centro del diamante doblando los codos pegados a los costados.',
      'Empuja con la fuerza de los tríceps hasta volver a la posición alta.'
    ],
    animationType: 'diamond-push-up'
  },
  {
    id: 'home-air-squat',
    name: 'Sentadillas Aéreas (Air Squats)',
    location: 'CASA',
    category: 'Peso Corporal / Fuerza de Piernas',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Cuádriceps y Glúteo Mayor',
    secondaryMuscle: 'Isquiosurales, Core y Pantorrillas',
    level: 'Todos los niveles',
    machineType: 'Sin equipamiento',
    tempo: '2-1-1 (2s bajada, 1s abajo, 1s subida explosiva)',
    breathing: 'Inhala profundo al descender la cadera; exhala con fuerza al subir.',
    mistakes: ['Levantar los talones del suelo', 'Dejar que las rodillas colapsen hacia adentro (valgo de rodilla)', 'Encorvar la espalda alta'],
    steps: [
      'Párate con los pies separados al ancho de los hombros y puntas ligeramente abiertas hacia afuera (15-20°).',
      'Inicia el movimiento empujando la cadera hacia atrás como si fueras a sentarte en una silla baja.',
      'Baja hasta que las caderas queden por debajo del nivel de las rodillas (romper el paralelo).',
      'Extiende las caderas empujando con toda la planta del pie hasta quedar erguido.'
    ],
    animationType: 'air-squat'
  },
  {
    id: 'home-bulgarian-split-squat',
    name: 'Sentadilla Búlgara en Silla o Cama',
    location: 'CASA',
    category: 'Unilateral / Hipertrofia de Pierna',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Glúteo Mayor y Cuádriceps',
    secondaryMuscle: 'Isquiosurales y Estabilizadores de cadera',
    level: 'Intermedio',
    machineType: 'Silla firme, sofá o borde de cama',
    tempo: '3-0-1 (3s descenso profundo y 1s subida)',
    breathing: 'Inhala al bajar la rodilla trasera hacia el suelo; exhala al levantarte.',
    mistakes: ['Poner el pie delantero demasiado cerca del soporte', 'Inclinarse en exceso hacia los lados perdiendo el balance'],
    steps: [
      'Da un paso hacia adelante y coloca el empeine del pie trasero sobre una silla o mueble estable.',
      'Mantén el pecho erguido y el abdomen firme.',
      'Desciende doblando la rodilla delantera hasta que el muslo quede paralelo al suelo y la rodilla trasera casi toque el piso.',
      'Empuja a través del talón delantero para regresar arriba.'
    ],
    animationType: 'bulgarian-squat'
  },
  {
    id: 'home-chair-dips',
    name: 'Fondos de Tríceps en Silla / Mueble',
    location: 'CASA',
    category: 'Peso Corporal / Tríceps',
    muscleGroup: 'Brazos',
    primaryMuscle: 'Tríceps Braquial',
    secondaryMuscle: 'Deltoides anterior y Pectoral menor',
    level: 'Principiante a Intermedio',
    machineType: 'Silla firme, borde de cama o banco casero',
    tempo: '2-1-1 (2s descenso, 1s pausa, 1s empuje)',
    breathing: 'Inhala al flexionar los codos; exhala al estirar los brazos.',
    mistakes: ['Separar la espalda demasiado de la silla (tensión lesiva en hombros)', 'Bajar más de 90° de flexión en los codos'],
    steps: [
      'Siéntate en el borde de una silla firme y apoya las palmas de las manos al lado de tus caderas.',
      'Adelanta los pies y desliza los glúteos fuera del asiento.',
      'Flexiona los codos hacia atrás bajando la cadera en línea recta cerca del borde de la silla.',
      'Empuja con las palmas extendiendo los brazos con control.'
    ],
    animationType: 'chair-dips'
  },
  {
    id: 'home-glute-bridge',
    name: 'Puente de Glúteos en Suelo (Glute Bridge)',
    location: 'CASA',
    category: 'Suelo / Activación Posterior',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Glúteo Mayor y Medio',
    secondaryMuscle: 'Isquiotibiales y Zona Lumbar',
    level: 'Todos los niveles',
    machineType: 'Esterilla o Alfombra',
    tempo: '1-2-2 (1s subida, 2s apretón en la cima, 2s bajada)',
    breathing: 'Exhala al levantar la pelvis contrayendo los glúteos; inhala al bajar.',
    mistakes: ['Arquear la columna lumbar en vez de empujar con los glúteos', 'Apoyar el peso en los dedos de los pies en vez de los talones'],
    steps: [
      'Acuéstate boca arriba con rodillas flexionadas y pies apoyados en el suelo a la anchura de las caderas.',
      'Brazos extendidos a los lados con las palmas hacia abajo.',
      'Eleva la pelvis contrayendo los glúteos hasta formar una línea recta entre rodillas, caderas y hombros.',
      'Aprieta con fuerza los glúteos durante 2 segundos arriba y desciende suavemente sin tocar del todo el suelo.'
    ],
    animationType: 'glute-bridge'
  },
  {
    id: 'home-plank',
    name: 'Plancha Abdominal Frontal Isométrica',
    location: 'CASA',
    category: 'Isometría / Core Profundo',
    muscleGroup: 'Abdomen / Core',
    primaryMuscle: 'Transverso Abdominal y Recto del Abdomen',
    secondaryMuscle: 'Hombros, Glúteos y Cuádriceps',
    level: 'Todos los niveles',
    machineType: 'Esterilla o Suelo',
    tempo: 'Isométrico continuo (30s a 60s por serie)',
    breathing: 'Respira de manera fluida y rítmica sin contener el aire.',
    mistakes: ['Hundir la cadera hacia el suelo (hiperlordosis)', 'Levantar los glúteos como una pirámide', 'Mirar al frente en vez de al suelo tensando el cuello'],
    steps: [
      'Apoya los antebrazos en el suelo alineando los codos directamente debajo de los hombros.',
      'Extiende las piernas apoyando las puntas de los pies.',
      'Contrae glúteos, cuádriceps y abdomen para formar una tabla recta.',
      'Mantén la mirada entre los antebrazos y sostén la tensión durante el tiempo marcado.'
    ],
    animationType: 'plank'
  },
  {
    id: 'home-mountain-climbers',
    name: 'Escaladores Dinámicos (Mountain Climbers)',
    location: 'CASA',
    category: 'Cardio Core / Metabólico',
    muscleGroup: 'Cardio & Core',
    primaryMuscle: 'Recto Abdominal, Oblicuos y Flexores de Cadera',
    secondaryMuscle: 'Deltoides, Tríceps y Sistema Cardiovascular',
    level: 'Intermedio',
    machineType: 'Sin equipamiento',
    tempo: 'Ritmo rápido y continuo (30-45 segundos)',
    breathing: 'Respiración coordinada con cada cambio de rodilla.',
    mistakes: ['Rebotar la cadera arriba y abajo', 'Dejar los hombros detrás de las muñecas'],
    steps: [
      'Empieza en posición de flexión alta con los brazos estirados.',
      'Lleva una rodilla hacia el pecho sin que el pie toque el suelo.',
      'Regresa la pierna e inmediatamente lleva la rodilla contraria en un movimiento fluido como si escalaras una montaña.',
      'Mantén el torso estable y la cadera baja durante toda la serie.'
    ],
    animationType: 'mountain-climbers'
  },
  {
    id: 'home-bicycle-crunches',
    name: 'Abdominales Bicicleta (Bicycle Crunches)',
    location: 'CASA',
    category: 'Suelo / Oblicuos',
    muscleGroup: 'Abdomen / Core',
    primaryMuscle: 'Oblicuos Internos y Externos',
    secondaryMuscle: 'Recto abdominal y Flexores de cadera',
    level: 'Intermedio',
    machineType: 'Esterilla',
    tempo: '2-1-2 (2s rotación controlada por lado)',
    breathing: 'Exhala en cada giro hacia la rodilla; inhala en el punto central.',
    mistakes: ['Tirar del cuello con las manos', 'Mover las piernas rápido sin rotar el torso'],
    steps: [
      'Túmbate boca arriba con las manos detrás de la cabeza sin entrelazar los dedos con fuerza.',
      'Eleva las piernas flexionadas a 90° y levanta ligeramente los omóplatos del suelo.',
      'Lleva el codo derecho hacia la rodilla izquierda mientras extiendes la pierna derecha.',
      'Alterna los lados en un movimiento continuo y controlado girando desde el torso.'
    ],
    animationType: 'bicycle-crunch'
  },
  {
    id: 'home-burpees',
    name: 'Burpees Completos con Salto',
    location: 'CASA',
    category: 'Metabólico Full Body / Quema Grasa',
    muscleGroup: 'Cardio & Core',
    primaryMuscle: 'Todo el Cuerpo (Pectorales, Piernas, Core)',
    secondaryMuscle: 'Capacidad Cardiorrespiratoria',
    level: 'Intermedio a Avanzado',
    machineType: 'Sin equipamiento',
    tempo: 'Explosivo y rítmico',
    breathing: 'Inhala en el descenso; exhala con potencia al saltar.',
    mistakes: ['Dejar caer la cadera al apoyar el cuerpo en el suelo', 'Aterrizar con las rodillas bloqueadas'],
    steps: [
      'Desde posición de pie, agáchate y apoya las manos firmes en el suelo.',
      'Lanza los pies hacia atrás de un salto quedando en plancha y desciende el pecho al suelo.',
      'Empuja con los brazos, recoge los pies de un salto hacia las manos.',
      'Salta en vertical con los brazos extendidos hacia el techo y aterriza amortiguando con las rodillas.'
    ],
    animationType: 'burpees'
  }
];

// ==========================================
// 📋 PROGRAMAS SEMANALES PRECONFIGURADOS
// ==========================================
export const WEEKLY_ROUTINES = [
  {
    id: 'prog-gym-hipertrofia-4dias',
    title: 'Programa Pro Hipertrofia en Máquinas (4 Días)',
    type: 'GYM',
    goal: 'Ganancia de Masa Muscular y Definición',
    level: 'Intermedio a Avanzado',
    duration: '50-60 min / sesión',
    daysCount: 4,
    description: 'Enfocado 100% en máquinas guiadas y poleas del gimnasio para máximo estímulo hipertrófico minimizando riesgo lesivo articular.',
    days: [
      {
        day: 'Día 1: Empuje (Pecho, Hombros & Tríceps)',
        exercises: [
          { exerciseId: 'gym-chest-press', name: 'Press de Pecho en Máquina Sentado', sets: '4 series', reps: '10-12 reps', rest: '90s' },
          { exerciseId: 'gym-pec-deck', name: 'Aperturas en Pec Deck / Mariposa', sets: '3 series', reps: '12-15 reps', rest: '60s' },
          { exerciseId: 'gym-shoulder-press', name: 'Press Militar de Hombros en Máquina', sets: '4 series', reps: '10-12 reps', rest: '75s' },
          { exerciseId: 'gym-triceps-pushdown', name: 'Extensión de Tríceps en Polea Alta', sets: '4 series', reps: '12-15 reps', rest: '60s' }
        ]
      },
      {
        day: 'Día 2: Pierna Completa & Máquinas Guiadas',
        exercises: [
          { exerciseId: 'gym-leg-press', name: 'Prensa de Piernas Inclinada a 45°', sets: '4 series', reps: '10-12 reps', rest: '90s' },
          { exerciseId: 'gym-leg-extension', name: 'Extensión de Cuádriceps en Máquina', sets: '4 series', reps: '12-15 reps', rest: '60s' },
          { exerciseId: 'gym-leg-curl', name: 'Curl Femoral Tumbado / Sentado', sets: '4 series', reps: '10-12 reps', rest: '60s' },
          { exerciseId: 'gym-smith-squat', name: 'Sentadillas en Máquina Smith Guiada', sets: '3 series', reps: '10 reps', rest: '90s' }
        ]
      },
      {
        day: 'Día 3: Tracción & Espalda en Poleas',
        exercises: [
          { exerciseId: 'gym-lat-pulldown', name: 'Jalón al Pecho en Polea Alta (Lat Pulldown)', sets: '4 series', reps: '10-12 reps', rest: '75s' },
          { exerciseId: 'gym-seated-cable-row', name: 'Remo Sentado en Polea Baja', sets: '4 series', reps: '10-12 reps', rest: '75s' },
          { exerciseId: 'gym-preacher-curl', name: 'Curl de Bíceps en Banco Scott / Predicador', sets: '4 series', reps: '12 reps', rest: '60s' },
          { exerciseId: 'gym-cable-crunch', name: 'Crunch Abdominal en Polea Alta con Cuerda', sets: '3 series', reps: '15-20 reps', rest: '45s' }
        ]
      },
      {
        day: 'Día 4: Torso Completo & Definición',
        exercises: [
          { exerciseId: 'gym-chest-press', name: 'Press de Pecho en Máquina', sets: '3 series', reps: '12 reps', rest: '75s' },
          { exerciseId: 'gym-lat-pulldown', name: 'Jalón al Pecho en Polea Alta', sets: '3 series', reps: '12 reps', rest: '75s' },
          { exerciseId: 'gym-shoulder-press', name: 'Press Militar de Hombros', sets: '3 series', reps: '12 reps', rest: '60s' },
          { exerciseId: 'gym-cable-crunch', name: 'Crunch Abdominal en Polea Alta', sets: '3 series', reps: '20 reps', rest: '45s' }
        ]
      }
    ]
  },
  {
    id: 'prog-home-fullbody-ceroequipo',
    title: 'Rutina Funcional en Casa - Sin Equipamiento (3 Días)',
    type: 'CASA',
    goal: 'Tonificación, Movilidad y Pérdida de Grasa',
    level: 'Principiante a Intermedio',
    duration: '35-45 min / sesión',
    daysCount: 3,
    description: 'Diseñada con biomecánica de calistenia para activar el metabolismo, fortalecer articulaciones y quemar calorías desde el hogar.',
    days: [
      {
        day: 'Día 1: Fuerza de Empuje y Pierna',
        exercises: [
          { exerciseId: 'home-air-squat', name: 'Sentadilla Aérea (Air Squat)', sets: '4 series', reps: '15-20 reps', rest: '45s' },
          { exerciseId: 'home-push-up', name: 'Flexiones de Pecho (Push-Ups)', sets: '3 series', reps: '10-15 reps', rest: '60s' },
          { exerciseId: 'home-chair-dips', name: 'Fondos de Tríceps en Silla o Banco', sets: '3 series', reps: '12-15 reps', rest: '45s' },
          { exerciseId: 'home-plank', name: 'Plancha Abdominal Isométrica', sets: '3 series', reps: '45-60 seg', rest: '45s' }
        ]
      },
      {
        day: 'Día 2: Tren Inferior y Quema Grasa HIIT',
        exercises: [
          { exerciseId: 'home-bulgarian-squat', name: 'Sentadilla Búlgara en Silla', sets: '3 series x pierna', reps: '10-12 reps', rest: '60s' },
          { exerciseId: 'home-glute-bridge', name: 'Puente de Glúteos en Suelo', sets: '4 series', reps: '15-20 reps', rest: '45s' },
          { exerciseId: 'home-mountain-climbers', name: 'Escaladores Dinámicos (Mountain Climbers)', sets: '4 series', reps: '40 seg activos', rest: '20s' },
          { exerciseId: 'home-burpees', name: 'Burpees Completos con Salto', sets: '3 series', reps: '10-12 reps', rest: '60s' }
        ]
      },
      {
        day: 'Día 3: Core y Tonificación Integral',
        exercises: [
          { exerciseId: 'home-diamond-push-up', name: 'Flexiones Diamante (Enfoque Tríceps)', sets: '3 series', reps: '8-12 reps', rest: '60s' },
          { exerciseId: 'home-bicycle-crunches', name: 'Abdominales Bicicleta (Bicycle Crunches)', sets: '4 series', reps: '20 reps (10/lado)', rest: '45s' },
          { exerciseId: 'home-plank', name: 'Plancha Abdominal Isométrica', sets: '3 series', reps: '60 seg', rest: '45s' },
          { exerciseId: 'home-air-squat', name: 'Sentadilla Aérea (Air Squat)', sets: '3 series', reps: '20 reps', rest: '45s' }
        ]
      }
    ]
  },
  {
    id: 'prog-hibrido-quema-grasa',
    title: 'Plan Híbrido Quema Grasa & Fuerza (GYM + CASA)',
    type: 'HIBRIDO',
    goal: 'Acondicionamiento Metabólico y Definición Muscular',
    level: 'Intermedio',
    duration: '40 min / sesión',
    daysCount: 4,
    description: 'Combina máquinas pesadas del gimnasio con sesiones de cardio y calistenia explosiva en casa los días de no asistencia.',
    days: [
      {
        day: 'Sesión GYM: Fuerza e Hipertrofia de Piernas y Espalda',
        exercises: [
          { exerciseId: 'gym-leg-press', name: 'Prensa de Piernas Inclinada a 45°', sets: '4 series', reps: '12 reps', rest: '90s' },
          { exerciseId: 'gym-lat-pulldown', name: 'Jalón al Pecho en Polea Alta', sets: '4 series', reps: '12 reps', rest: '75s' },
          { exerciseId: 'gym-leg-curl', name: 'Curl Femoral en Máquina', sets: '3 series', reps: '12 reps', rest: '60s' }
        ]
      },
      {
        day: 'Sesión CASA: HIIT Quema Grasa y Pectoral',
        exercises: [
          { exerciseId: 'home-push-up', name: 'Flexiones de Pecho (Push-Ups)', sets: '4 series', reps: '15 reps', rest: '45s' },
          { exerciseId: 'home-mountain-climbers', name: 'Escaladores Dinámicos', sets: '4 vueltas', reps: '45 seg', rest: '20s' },
          { exerciseId: 'home-burpees', name: 'Burpees Completos con Salto', sets: '4 vueltas', reps: '10 reps', rest: '40s' }
        ]
      }
    ]
  }
];

