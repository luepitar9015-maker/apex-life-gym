// Catálogo Exhaustivo de Ejercicios y Máquinas: Gimnasio Comercial Completo vs Casa
// Incluye biomecánica avanzada, ajuste de maquinaria, cues de élite y prevención fisioterapéutica de lesiones.

export const EXERCISES_DATABASE = [
  // =========================================================================
  // 🏢 1. TREN INFERIOR (PIERNAS & GLÚTEOS) - MÁQUINAS DEL GYM
  // =========================================================================
  {
    id: 'gym-leg-press',
    name: 'Prensa de Piernas Inclinada a 45°',
    location: 'GYM',
    category: 'Máquina de Palanca / Placas',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Cuádriceps y Glúteo Mayor',
    secondaryMuscle: 'Isquiosurales, Aductores y Sóleo',
    level: 'Principiante a Avanzado',
    machineType: 'Prensa 45° con discos o placas',
    tempo: '3-0-1 (3s descenso controlado, 0s pausa, 1s empuje explosivo)',
    breathing: 'Inhala al descender la plataforma; exhala con fuerza al empujar.',
    machineSetup: 'Ajusta el respaldo en un ángulo de 45° a 55° para que la pelvis quede totalmente anclada. Libera las trabas de seguridad únicamente con las manos firmes en los agarres laterales.',
    setupPosture: 'Espalda completa y sacro pegados al respaldo. Pies a la anchura de los hombros en el centro de la plataforma con las puntas ligeramente rotadas hacia afuera (10-15°).',
    biomechanicsExplanation: 'Movimiento compuesto en plano sagital con triple extensión (cadera, rodilla y tobillo). Al estar la columna soportada por el respaldo, elimina la carga axial de las vértebras, permitiendo una máxima sobrecarga progresiva en cuádriceps y glúteos.',
    cues: [
      'Empuja la plataforma como si quisieras alejar el suelo de ti con los talones',
      'No dejes que las rodillas colapsen hacia adentro (valgo de rodilla)',
      'Detén el descenso antes de que la pelvis empiece a despegarse del respaldo (guiño glúteo)'
    ],
    eccentricPhase: 'Baja en 3 segundos lentos y uniformes hasta que la rodilla forme un ángulo aproximado de 90° sin forzar la zona lumbar.',
    concentricPhase: 'Empuja con potencia durante 1 segundo mediante la planta del pie, deteniéndote milímetros antes de bloquear las rodillas.',
    clinicalRisks: 'Bloquear (hiperextender) las rodillas en la extensión transfiere todo el tonelaje del peso directamente a los meniscos y ligamentos cruzados. Despegar la zona lumbar genera cizallamiento agudo en las vértebras L4-L5 y L5-S1.',
    mistakes: [
      'Despegar la zona lumbar o los glúteos del respaldo en el punto profundo',
      'Bloquear las rodillas por completo en la fase final de empuje',
      'Levantar los talones de la plataforma transfiriendo tensión al tendón rotuliano'
    ],
    steps: [
      'Siéntate y acomoda la espalda y glúteos perfectamente sellados contra el respaldo acolchado.',
      'Coloca los pies a la anchura de tus caderas en el centro de la plataforma.',
      'Sujeta con firmeza las manillas de agarre y empuja ligeramente para desenganchar los seguros.',
      'Inhala y desciende el carro lentamente durante 3 segundos hasta alcanzar un ángulo de 90° en rodillas.',
      'Exhala y empuja con fuerza desde los talones hasta extender las piernas, manteniendo una micro-flexión protectora.'
    ],
    animationType: 'leg-press'
  },
  {
    id: 'gym-hack-squat',
    name: 'Sentadilla Hack a 45° (Hack Squat Machine)',
    location: 'GYM',
    category: 'Máquina Guiada de Discos / Carga Pesada',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Cuádriceps (Énfasis en Vasto Lateral y Recto Femoral)',
    secondaryMuscle: 'Glúteo Mayor y Aductores',
    level: 'Intermedio a Avanzado',
    machineType: 'Máquina Hack de 45° con almohadillas en hombros',
    tempo: '3-1-1 (3s bajada profunda, 1s pausa isométrica, 1s subida)',
    breathing: 'Inhala profundamente antes de bajar; exhala al superar la mitad del ascenso.',
    machineSetup: 'Ajusta los topes de seguridad a una profundidad que permita alcanzar al menos 90° de flexión en rodilla.',
    setupPosture: 'Espalda y cabeza apoyadas firmemente en el respaldo móvil. Hombros encajados bajo las almohadillas. Pies adelantados en la plataforma al ancho de hombros.',
    biomechanicsExplanation: 'Al tener el torso apoyado en un ángulo fijo de 45°, se maximiza el momento de flexión de la rodilla reduciendo al mínimo el estrés en la columna baja. Es la mejor máquina para desarrollo puro del cuádriceps.',
    cues: [
      'Empuja con toda la planta del pie, manteniendo los talones soldados a la chapa',
      'Abre las rodillas en la misma dirección que los dedos de los pies',
      'Desciende suave sin rebotar en los topes mecánicos'
    ],
    eccentricPhase: 'Baja en 3 segundos controlados sintiendo la tensión acumulada en la parte frontal de los muslos.',
    concentricPhase: 'Empuja con explosividad durante 1 segundo sin bloquear rodillas arriba.',
    clinicalRisks: 'Poner los pies muy abajo en la plataforma causa una excesiva translación tibial anterior con sobrecarga del tendón rotuliano.',
    mistakes: [
      'Despegar la espalda baja del cojín durante el descenso',
      'Rebotar bruscamente en el fondo',
      'Hiperextender las rodillas violentamente en la cima'
    ],
    steps: [
      'Colócate bajo las almohadillas apoyando hombros y espalda completa.',
      'Coloca los pies en el tercio superior de la plataforma a la anchura de hombros.',
      'Empuja levemente y gira las manijas para liberar las trabas.',
      'Desciende lentamente en 3 segundos hasta que los muslos estén paralelos a la plataforma.',
      'Empuja con fuerza desde los talones hasta regresar arriba.'
    ],
    animationType: 'hack-squat'
  },
  {
    id: 'gym-leg-extension',
    name: 'Extensión de Cuádriceps en Máquina',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Cuádriceps (Recto Femoral, Vasto Lateral y Medial)',
    secondaryMuscle: 'Tensor de la Fascia Lata',
    level: 'Todos los niveles',
    machineType: 'Sillón de extensiones guiado por levas',
    tempo: '2-1-2 (2s extensión, 1s contracción isométrica en la cima, 2s bajada)',
    breathing: 'Exhala al levantar el rodillo acolchado; inhala profundamente al bajarlo.',
    machineSetup: 'Ajusta el respaldo para que la fosa poplítea (detrás de la rodilla) quede justo en el borde del asiento. El rodillo inferior debe descansar en la unión entre la tibia baja y el empeine (justo encima de los tobillos). El eje circular de la máquina debe alinearse con la articulación de la rodilla.',
    setupPosture: 'Torso erguido contra el respaldo. Agarra firmemente las manillas inferiores laterales para clavar la pelvis al asiento.',
    biomechanicsExplanation: 'Ejercicio de cadena cinética abierta en plano sagital. Es el único ejercicio que carga al máximo el recto femoral en su función extensora con el cuádriceps acortado en la porción final.',
    cues: [
      'Clava los glúteos al asiento usando las manillas laterales',
      'Imagina patear hacia el techo y aprieta el muslo 1 segundo arriba',
      'No dejes que los discos de peso choquen en la bajada; frena antes'
    ],
    eccentricPhase: 'Controla el descenso en 2 segundos completos resistiendo la fuerza del rodillo, sintiendo la elongación controlada del cuádriceps.',
    concentricPhase: 'Extiende las piernas con potencia en 2 segundos hasta casi los 180°, apretando al máximo el cuádriceps durante 1 segundo completo.',
    clinicalRisks: 'Patear con impulso brusco o permitir que el rodillo baje sin control puede causar sobrecarga patelar y condromalacia.',
    mistakes: [
      'Balancear el torso hacia atrás para hacer palanca con la espalda',
      'Despegar los glúteos del asiento por usar peso excesivo',
      'Permitir que las placas choquen violentamente perdiendo la tensión continua'
    ],
    steps: [
      'Regula el respaldo y el rodillo para que encajen anatómicamente con tus rodillas y tobillos.',
      'Sujeta los mangos laterales para mantener la cadera pegada a la banqueta.',
      'Extiende las piernas de manera fluida hasta la horizontal sin dar tirones.',
      'Pausa 1 segundo en la máxima contracción sintiendo ardor en los vastos musculares.',
      'Desciende con ritmo controlado en 2 segundos sin que el peso descanse.'
    ],
    animationType: 'leg-extension'
  },
  {
    id: 'gym-leg-curl',
    name: 'Curl Femoral Tumbado / Sentado',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Isquiosurales (Bíceps Femoral, Semitendinoso y Semimembranoso)',
    secondaryMuscle: 'Gemelos (Gastrocnemio)',
    level: 'Intermedio',
    machineType: 'Máquina de curl femoral prone / seated',
    tempo: '2-1-2 (2s flexión hacia glúteos, 1s pausa, 2s extensión controlada)',
    breathing: 'Exhala al flexionar las rodillas hacia los glúteos; inhala al devolver el rodillo.',
    machineSetup: 'Alinea la articulación de la rodilla con el eje de rotación de la máquina. El rodillo debe descansar en la parte posterior del talón de Aquiles, no sobre las pantorrillas.',
    setupPosture: 'Caderas firmemente aplastadas contra el cojín angular. Manos sujetando las manillas para anclar el torso.',
    biomechanicsExplanation: 'Aislamiento directo de los flexores de rodilla. Al mantener el tobillo en dorsiflexión se incrementa la participación de los isquiotibiales desactivando parcialmente los gemelos.',
    cues: [
      'Mantén la pelvis pegada a la almohadilla sin arquear la zona lumbar',
      'Lleva los talones hacia las nalgas de forma estricta',
      'Mantén los dedos de los pies apuntando hacia las espinillas'
    ],
    eccentricPhase: 'Regresa el rodillo en 2 segundos sintiendo el estiramiento profundo del bíceps femoral sin que se hiperextienda la rodilla.',
    concentricPhase: 'Flexiona con fuerza en 2 segundos hasta que el rodillo esté a pocos centímetros del glúteo.',
    clinicalRisks: 'Arquear la zona lumbar para trampear el peso comprime los discos intervertebrales y reduce el trabajo del isquiotibial en un 40%.',
    mistakes: [
      'Levantar la cadera del acolchado en la flexión',
      'Hacer tirones violentos con la cabeza levantada tensando el cuello',
      'Dejar caer el peso en la bajada sin fase excéntrica'
    ],
    steps: [
      'Acuéstate boca abajo con el rodillo justo por encima de los talones.',
      'Sujeta los agarres y presiona el pubis contra el banco.',
      'Flexiona las rodillas hacia los glúteos contrayendo la parte posterior de los muslos.',
      'Sostén 1 segundo en el punto máximo de flexión.',
      'Retorna lentamente resistiendo la carga hasta la posición de estiramiento.'
    ],
    animationType: 'leg-curl'
  },
  {
    id: 'gym-hip-thrust',
    name: 'Máquina de Hip Thrust / Glute Drive',
    location: 'GYM',
    category: 'Máquina de Palanca / Placas / Glúteos',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Glúteo Mayor (Porción Superior e Inferior)',
    secondaryMuscle: 'Isquiosurales y Core',
    level: 'Todos los niveles',
    machineType: 'Máquina Glute Drive con cinturón acolchado o barra guiada',
    tempo: '2-2-1 (2s elevación, 2s bloqueo con retroversión pélvica, 1s descenso)',
    breathing: 'Inhala al descender la pelvis; exhala fuertemente al empujar hacia el techo.',
    machineSetup: 'Ajusta el cinturón de seguridad ancho y acolchado sobre la pelvis (espina ilíaca anterosuperior).',
    setupPosture: 'Espalda superior (escápulas) apoyada contra el rodillo pivotante. Pies al ancho de hombros sobre la plataforma con tibias perpendiculares al suelo a 90° en la cima.',
    biomechanicsExplanation: 'Extensión pura de cadera con máxima tensión mecánica en el punto de máximo acortamiento del glúteo mayor (a diferencia de la sentadilla, donde la máxima tensión ocurre en estiramiento).',
    cues: [
      'Clava los talones en la plataforma y aprieta los glúteos como si sostuvieras un billete',
      'Mantén la barbilla pegada al pecho mirando al frente (evita hiperextender el cuello)',
      'Haz retroversión pélvica en la cima bloqueando la cadera recta'
    ],
    eccentricPhase: 'Baja en 1-2 segundos hasta que la cadera flexione sin que la espalda se despegue del soporte.',
    concentricPhase: 'Empuja con potencia desde los talones en 2 segundos y aprieta al máximo arriba 2 segundos completos.',
    clinicalRisks: 'Arquear la zona lumbar en lugar de extender la cadera causa compresión facetaria en L5-S1.',
    mistakes: [
      'Mirar al techo hiperextendiendo la columna cervical y lumbar',
      'Poner los pies muy adelante o muy atrás',
      'No bloquear completamente arriba por exceso de peso'
    ],
    steps: [
      'Siéntate en la máquina, ajusta y asegura el cinturón acolchado sobre tus caderas.',
      'Coloca los pies al ancho de hombros en la plataforma.',
      'Empuja la cadera hacia arriba, desacopla la palanca de seguridad.',
      'Desciende controladamente hasta flexionar caderas.',
      'Empuja con los talones elevando la pelvis y contrayendo los glúteos 2 segundos arriba.'
    ],
    animationType: 'hip-thrust'
  },
  {
    id: 'gym-abductor',
    name: 'Máquina de Abductores Sentado (Glúteo Medio)',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Glúteo Medio y Glúteo Menor',
    secondaryMuscle: 'Tensor de la Fascia Lata y Piriforme',
    level: 'Todos los niveles',
    machineType: 'Máquina de abducción de cadera con placas',
    tempo: '2-1-2 (2s apertura, 1s pausa isométrica de máxima apertura, 2s cierre)',
    breathing: 'Exhala al abrir las piernas hacia los lados; inhala al cerrarlas.',
    machineSetup: 'Ajusta las almohadillas para que apoyen en la cara externa de los muslos o rodillas. Selecciona el pasador de placas.',
    setupPosture: 'Espalda bien pegada al respaldo (o ligeramente inclinado hacia adelante para mayor activación del glúteo superior).',
    biomechanicsExplanation: 'Abducción de cadera en plano transversal. Clave para la estabilidad de la pelvis en carrera y prevención de valgo de rodilla.',
    cues: [
      'Empuja desde las rodillas, no desde los tobillos',
      'Aguanta 1 segundo con las piernas abiertas al máximo',
      'Controla el cierre impidiendo que las placas choquen'
    ],
    eccentricPhase: 'Cierra las piernas en 2 segundos resistiendo la fuerza del mecanismo.',
    concentricPhase: 'Abre las piernas con fuerza en 2 segundos hasta el máximo rango sin despegar los glúteos.',
    clinicalRisks: 'Hacer movimientos bruscos de rebote puede distender el músculo piriforme y comprimir el nervio ciático.',
    mistakes: ['Juntar las rodillas por impulso descontrolado', 'Hacer aperturas muy cortas con sobrecarga'],
    steps: [
      'Siéntate con la espalda firme y coloca las piernas entre los cojines laterales.',
      'Ajusta la palanca de rango para iniciar con las piernas juntas.',
      'Abre las piernas con fuerza hacia el exterior separando los cojines.',
      'Sostén 1 segundo la máxima apertura sintiendo el lateral del glúteo.',
      'Regresa lentamente sin permitir que las pesas descansen.'
    ],
    animationType: 'abductor'
  },
  {
    id: 'gym-adductor',
    name: 'Máquina de Aductores Sentado (Muslo Interno)',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Aductor Mayor, Largo y Corto',
    secondaryMuscle: 'Grácil y Pectíneo',
    level: 'Todos los niveles',
    machineType: 'Máquina de aducción de cadera con placas',
    tempo: '2-1-2 (2s cierre hacia el centro, 1s compresión, 2s apertura controlada)',
    breathing: 'Exhala al juntar las piernas; inhala al abrirlas sintiendo el estiramiento.',
    machineSetup: 'Gira las almohadillas hacia el interior de las rodillas. Ajusta la palanca de apertura a un rango cómodo sin dolor en ingles.',
    setupPosture: 'Sentado erguido con glúteos bien pegados y manos en las manillas.',
    biomechanicsExplanation: 'Aducción de cadera en plano transversal. Fortalece la cara medial del muslo y estabiliza la articulación coxofemoral.',
    cues: [
      'Conduce la fuerza desde la parte interna de las rodillas',
      'Aprieta con firmeza 1 segundo en el punto de contacto central',
      'No abras de golpe para evitar tirones en el pubis'
    ],
    eccentricPhase: 'Abre las piernas despacio en 2 segundos sintiendo elongación progresiva en los aductores.',
    concentricPhase: 'Cierra ambas piernas con potencia en 2 segundos hasta que los cojines se toquen en el centro.',
    clinicalRisks: 'Iniciar con un rango de apertura excesivo bajo carga pesada puede ocasionar osteopatía dinámica de pubis (pubalgia).',
    mistakes: ['Usar inercia rebotando en el centro', 'Abrir las piernas más allá de la flexibilidad articular'],
    steps: [
      'Siéntate y coloca la cara interna de los muslos contra los cojines.',
      'Junta las piernas con fuerza contrayendo el interior de los muslos.',
      'Pausa 1 segundo con los cojines en contacto.',
      'Abre las piernas de forma lenta y controlada en 2 segundos.'
    ],
    animationType: 'adductor'
  },
  {
    id: 'gym-standing-calf',
    name: 'Elevación de Talones de Pie en Máquina (Standing Calf Raise)',
    location: 'GYM',
    category: 'Máquina de Placas / Pantorrilla',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Gastrocnemio (Gemelo Medial y Lateral)',
    secondaryMuscle: 'Sóleo y Tendón de Aquiles',
    level: 'Todos los niveles',
    machineType: 'Máquina vertical de placas con almohadillas en hombros',
    tempo: '2-2-2 (2s subida en puntas, 2s contracción en la cima, 2s estiramiento profundo abajo)',
    breathing: 'Exhala al elevarte sobre las puntas; inhala al bajar los talones.',
    machineSetup: 'Ajusta la altura del bloque superior de hombros para que al apoyar los metatarsos en el escalón las rodillas queden casi extendidas.',
    setupPosture: 'Almohadillas sobre los hombros, espalda recta, rodillas con una micro-flexión constante de 5° (nunca flexionadas a 90°).',
    biomechanicsExplanation: 'Flexión plantar con rodilla extendida. Dado que el gastrocnemio es biarticular, la extensión de rodilla optimiza su longitud-tensión respecto al sóleo.',
    cues: [
      'Sube todo lo que puedas como una bailarina de ballet',
      'Baja los talones por debajo del nivel del escalón sintiendo un estiramiento profundo',
      'Pausa abajo 2 segundos para eliminar el rebote elástico del tendón de Aquiles'
    ],
    eccentricPhase: 'Baja los talones despacio en 2 segundos por debajo del escalón y mantén 1 segundo el estiramiento.',
    concentricPhase: 'Empuja con los metatarsos en 2 segundos y quédate en la cima 2 segundos apretando los gemelos.',
    clinicalRisks: 'Rebotar rápido abajo sobrecarga y desgasta el tendón de Aquiles sin generar hipertrofia muscular.',
    mistakes: ['Doblar las rodillas como si fuera una sentadilla', 'Hacer rebotes cortos sin rango completo'],
    steps: [
      'Apoya las almohadillas en los hombros y coloca los metatarsos en el borde del escalón.',
      'Desciende los talones lentamente por debajo de la plataforma sintiendo el estiramiento.',
      'Empuja con las puntas de los pies elevándote al máximo posible.',
      'Sostén la contracción 2 segundos arriba antes de bajar.'
    ],
    animationType: 'standing-calf'
  },
  {
    id: 'gym-seated-calf',
    name: 'Elevación de Talones Sentado en Máquina (Seated Calf Raise)',
    location: 'GYM',
    category: 'Máquina de Discos / Placas / Aislamiento',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Sóleo (Músculo Profundo de la Pantorrilla)',
    secondaryMuscle: 'Gastrocnemio y Flexores del Pie',
    level: 'Todos los niveles',
    machineType: 'Máquina de sóleo sentado con almohadillas en rodillas',
    tempo: '2-2-2 (2s elevación, 2s pausa arriba, 2s bajada profunda)',
    breathing: 'Exhala al elevar los talones; inhala al bajarlos.',
    machineSetup: 'Ajusta las almohadillas acolchadas firmemente contra la parte baja de los muslos (justo por encima de las rodillas).',
    setupPosture: 'Sentado erguido, pies apoyados en el escalón por los metatarsos.',
    biomechanicsExplanation: 'Al estar las rodillas flexionadas a 90°, el gastrocnemio entra en insuficiencia activa, aislando al 100% el músculo sóleo.',
    cues: [
      'Eleva al máximo los talones contrayendo la cara profunda de la pantorrilla',
      'Desciende hasta sentir el estiramiento completo del tendón',
      'Cero impulsos con el torso'
    ],
    eccentricPhase: 'Baja los talones lentamente en 2 segundos.',
    concentricPhase: 'Sube con potencia en 2 segundos y aprieta en la cima 2 segundos.',
    clinicalRisks: 'Soltar la palanca de seguridad sin control puede aplastar los muslos con la carga.',
    mistakes: ['Hacer repeticiones ultra rápidas con rebote', 'Colocar los dedos muy al borde del escalón'],
    steps: [
      'Siéntate, coloca los metatarsos en el escalón y encaja los muslos bajo el soporte.',
      'Empuja con los talones y quita la traba de seguridad.',
      'Baja los talones lentamente sintiendo estiramiento en la pantorrilla.',
      'Eleva los talones con fuerza hasta la máxima flexión plantar.',
      'Pausa 2 segundos arriba y repite.'
    ],
    animationType: 'seated-calf'
  },
  {
    id: 'gym-smith-squat',
    name: 'Sentadillas en Máquina Smith / Multipower',
    location: 'GYM',
    category: 'Máquina Guiada / Compuesto',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Cuádriceps y Glúteos',
    secondaryMuscle: 'Aductores, Isquiotibiales y Espinales',
    level: 'Intermedio',
    machineType: 'Máquina Smith con rieles guiados verticales o inclinados',
    tempo: '3-1-1 (3s descenso controlado, 1s pausa abajo, 1s subida potente)',
    breathing: 'Inhala profundamente y crea presión intraabdominal; exhala tras superar el punto más difícil de la subida.',
    machineSetup: 'Ajusta los topes de seguridad a una altura que permita romper la paralela (rodillas a 90°). Desbloquea la barra girando los ganchos.',
    setupPosture: 'Barra apoyada sobre los trapecios (barra alta). Pies adelantados unos 15-20 cm respecto a la línea de la barra para permitir verticalidad del torso.',
    biomechanicsExplanation: 'Al estar el movimiento restringido a un plano vertical, permite colocar los pies más adelantados que en una sentadilla libre, incrementando la flexión de rodilla y maximizando el reclutamiento del cuádriceps con menor estrés lumbar.',
    cues: [
      'Apoya bien los pies y empuja el suelo con fuerza',
      'Desciende con la espalda erguida apoyándote en la barra guiada',
      'Mantén las rodillas en la misma dirección que las puntas de los pies'
    ],
    eccentricPhase: 'Baja en 3 segundos lentos hasta que los muslos queden al menos paralelos al suelo.',
    concentricPhase: 'Empuja con los talones y la planta completa en 1 segundo hasta la posición erguida.',
    clinicalRisks: 'Colocar los pies directamente debajo de la barra como en sentadilla libre puede forzar una flexión lumbar extrema por la rigidez del riel.',
    mistakes: [
      'Dejar caer el peso rápido sin control del carro guiado',
      'Colapso de rodillas hacia el interior (valgo)',
      'Levantar los talones del suelo al descender'
    ],
    steps: [
      'Coloca la barra sobre los trapecios y posiciona los pies adelantados unos 15 cm.',
      'Gira la barra para desacoplar los ganchos de seguridad.',
      'Flexiona caderas y rodillas bajando el cuerpo en 3 segundos hasta los 90°.',
      'Haz una breve pausa de 1 segundo sin rebotar en los topes.',
      'Empuja con fuerza desde los talones hasta regresar arriba.'
    ],
    animationType: 'smith-squat'
  },

  // =========================================================================
  // 🏢 2. PECHO & PECTORAL - MÁQUINAS DEL GYM
  // =========================================================================
  {
    id: 'gym-chest-press',
    name: 'Press de Pecho en Máquina Sentado',
    location: 'GYM',
    category: 'Máquina de Palancas / Placas',
    muscleGroup: 'Pecho',
    primaryMuscle: 'Pectoral Mayor (Porción Esternal y Clavicular)',
    secondaryMuscle: 'Deltoides Anterior y Tríceps Braquial',
    level: 'Todos los niveles',
    machineType: 'Máquina articulada convergente de empuje',
    tempo: '3-0-1 (3s descenso excéntrico, 0s pausa, 1s empuje)',
    breathing: 'Inhala mientras los mangos retroceden hacia el pecho; exhala con potencia al empujar.',
    machineSetup: 'Regula la altura del asiento para que los mangos de agarre queden alineados exactamente con la línea media de los pezones (mitad del esternón).',
    setupPosture: 'Espalda y cabeza firmes en el respaldo. Pies apoyados totalmente en el piso. Retrae las escápulas juntando los omóplatos detrás del torso.',
    biomechanicsExplanation: 'Movimiento convergente que simula el press con mancuernas pero con trayectoria biomecánica guiada que protege el hombro al evitar la hiperextensión del tendón bicipital.',
    cues: [
      'Mantén el pecho inflado como una paloma durante todo el movimiento',
      'Imagina juntar los bíceps delante de tu pecho',
      'No despegues la espalda alta del respaldo al empujar'
    ],
    eccentricPhase: 'Permite que los mangos retrocedan en 3 segundos sintiendo el estiramiento de las fibras pectorales sin forzar el hombro hacia atrás.',
    concentricPhase: 'Empuja con los pectorales en 1 segundo hasta extender los brazos sin trabar los codos.',
    clinicalRisks: 'Colocar el asiento muy bajo sitúa las manos sobre los hombros, provocando pinzamiento del manguito rotador.',
    mistakes: [
      'Empujar adelantando los hombros (desactivando el pectoral)',
      'Bloquear fuertemente los codos al final del recorrido',
      'Despegar la espalda para empujar con el peso del cuerpo'
    ],
    steps: [
      'Ajusta la banqueta para que los mangos coincidan con la altura del pecho medio.',
      'Siéntate con retracción escapular y pies bien plantados.',
      'Empuja los mangos hacia adelante con el pectoral hasta estirar casi por completo los brazos.',
      'Regresa lentamente en 3 segundos sintiendo la apertura y estiramiento del pecho.',
      'Repite el movimiento manteniendo el pecho elevado.'
    ],
    animationType: 'chest-press'
  },
  {
    id: 'gym-incline-chest-press',
    name: 'Press Inclinado de Pecho en Máquina (Incline Press)',
    location: 'GYM',
    category: 'Máquina de Palancas / Placas / Ángulo Inclinado',
    muscleGroup: 'Pecho',
    primaryMuscle: 'Pectoral Mayor (Haz Clavicular / Pecho Superior)',
    secondaryMuscle: 'Deltoides Anterior y Tríceps',
    level: 'Todos los niveles',
    machineType: 'Máquina de empuje inclinado a 30°-45°',
    tempo: '3-0-1 (3s descenso, 0s pausa, 1s empuje hacia arriba y adelante)',
    breathing: 'Inhala al descender los mangos hacia las clavículas; exhala con potencia al empujar.',
    machineSetup: 'Ajusta el asiento para que los agarres queden situados a la altura de las clavículas.',
    setupPosture: 'Espalda bien apoyada en el respaldo inclinado, escápulas retraídas y hombros deprimidos.',
    biomechanicsExplanation: 'Trayectoria ascendente en plano sagital y frontal que recluta preferentemente las fibras claviculares del pectoral mayor con menor estrés en el manguito rotador que un press inclinado libre.',
    cues: [
      'Empuja hacia arriba y hacia el centro como si quisieras juntar las manos',
      'Saca el pecho alto durante todo el recorrido',
      'Mantén los codos en un ángulo de flecha de 45° respecto al torso'
    ],
    eccentricPhase: 'Baja en 3 segundos sintiendo el estiramiento en la parte superior del pecho.',
    concentricPhase: 'Empuja con fuerza en 1 segundo focalizando la contracción cerca de las clavículas.',
    clinicalRisks: 'Abrir los codos en cruz a 90° genera pinzamiento subacromial en el hombro.',
    mistakes: ['Arquear la espalda lumbar para convertirlo en press plano', 'Dejar caer los mangos bruscamente'],
    steps: [
      'Regula el asiento para que los mangos comiencen a la altura del pecho alto.',
      'Retrae las escápulas y apoya los pies firmes en el piso.',
      'Empuja los mangos de forma ascendente con el pecho alto.',
      'Baja con control en 3 segundos sintiendo el estiramiento superior.'
    ],
    animationType: 'incline-chest-press'
  },
  {
    id: 'gym-pec-deck',
    name: 'Aperturas en Pec Deck / Máquina Mariposa',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Pecho',
    primaryMuscle: 'Pectoral Mayor (Fibras Mediales e Internas)',
    secondaryMuscle: 'Deltoides Anterior',
    level: 'Todos los niveles',
    machineType: 'Máquina flyes / pec deck',
    tempo: '2-1-2 (2s cierre, 1s contracción máxima isométrica, 2s apertura)',
    breathing: 'Exhala al cerrar los brazos frente al pecho; inhala al abrir sintiendo el estiramiento.',
    machineSetup: 'Ajusta el asiento para que los codos y las manos queden ligeramente por debajo de la altura de los hombros. Ajusta el rango de apertura para no sobreestirar la cápsula articular anterior.',
    setupPosture: 'Espalda bien pegada al cojín. Codos con una ligera flexión de 10° constante (como si abrazaras un barril grande).',
    biomechanicsExplanation: 'Aducción horizontal pura en plano transversal. A diferencia del press, no interviene el tríceps, aislando el pectoral al 100%.',
    cues: [
      'Imagina que vas a dar un abrazo enorme',
      'Los codos nunca se doblan ni se estiran durante el movimiento; se mantienen rígidos',
      'Aprieta con intención el pecho cuando los mangos se toquen'
    ],
    eccentricPhase: 'Abre los brazos en 2 segundos hasta que sientas el estiramiento en el pectoral, sin pasar de la línea de los hombros.',
    concentricPhase: 'Cierra los brazos en 2 segundos conduciendo con los codos y aprieta 1 segundo en el centro.',
    clinicalRisks: 'Llevar los brazos demasiado atrás en la apertura desgarra el tendón del bíceps y distiende la cápsula anterior del hombro.',
    mistakes: [
      'Empujar doblando y estirando los codos como si fuera un press',
      'Dejar que los hombros se adelanten al cerrar',
      'Apertura excesiva que produzca dolor en la cara frontal del hombro'
    ],
    steps: [
      'Siéntate con la espalda firme y coloca los brazos en las almohadillas o manubrios.',
      'Mantén los codos semiflexionados y saca el pecho.',
      'Cierra ambos brazos hacia el centro apretando el pecho con fuerza.',
      'Mantén 1 segundo la contracción en el punto de contacto frontal.',
      'Abre lentamente resistiendo la carga.'
    ],
    animationType: 'pec-deck'
  },
  {
    id: 'gym-cable-crossover',
    name: 'Cruces en Polea Doble (Cable Crossover)',
    location: 'GYM',
    category: 'Poleas / Aislamiento Pectoral',
    muscleGroup: 'Pecho',
    primaryMuscle: 'Pectoral Mayor (Haz Esternal e Inferior)',
    secondaryMuscle: 'Deltoides Anterior y Serrato Anterior',
    level: 'Intermedio a Avanzado',
    machineType: 'Torre de doble polea ajustable con estribos',
    tempo: '2-1-2 (2s cruce al frente, 1s apretar en el centro, 2s apertura)',
    breathing: 'Exhala al juntar los mangos frente al ombligo o pecho; inhala al abrir los brazos.',
    machineSetup: 'Coloca las dos poleas a la altura de la cabeza o arriba para cruces descendentes.',
    setupPosture: 'De pie en el centro de la torre. Da un paso al frente con una pierna para ganar estabilidad, torso inclinado 15°.',
    biomechanicsExplanation: 'Aducción horizontal y hacia abajo contra la resistencia continua de los cables en todo el rango.',
    cues: [
      'Conduce el movimiento abrazando un árbol',
      'Cruza ligeramente una mano sobre la otra en el centro para máxima contracción esternal',
      'Mantén los codos con flexión fija de 15°'
    ],
    eccentricPhase: 'Permite que los cables abran tus brazos en 2 segundos hasta el plano de los hombros.',
    concentricPhase: 'Cruza los cables al frente en 2 segundos apretando el pecho fuertemente.',
    clinicalRisks: 'Dejar que el cable tire de los brazos muy hacia atrás bajo peso excesivo puede lesionar el labrum glenoideo.',
    mistakes: ['Balancear el cuerpo para arrancar el movimiento', 'Hacer un press en lugar de un vuelo'],
    steps: [
      'Toma ambos estribos y da un paso adelante fijando la postura.',
      'Inclina levemente el torso con el pecho inflado.',
      'Cierra los brazos hacia el centro y hacia abajo hasta que se toquen las manos.',
      'Sostén 1 segundo la contracción máxima.',
      'Abre con suavidad controlando el retorno de los cables.'
    ],
    animationType: 'cable-crossover'
  },

  // =========================================================================
  // 🏢 3. ESPALDA & TRACCIÓN - MÁQUINAS DEL GYM
  // =========================================================================
  {
    id: 'gym-lat-pulldown',
    name: 'Jalón al Pecho en Polea Alta (Lat Pulldown)',
    location: 'GYM',
    category: 'Polea / Torre de Tracción Vertical',
    muscleGroup: 'Espalda',
    primaryMuscle: 'Dorsal Ancho (Lats) y Redondo Mayor',
    secondaryMuscle: 'Bíceps Braquial, Braquiorradial y Romboides',
    level: 'Todos los niveles',
    machineType: 'Torre de polea alta con barra ergonómica',
    tempo: '1-1-2 (1s tirón explosivo, 1s compresión de escápulas, 2s retorno controlado)',
    breathing: 'Inhala profundamente antes de iniciar; exhala con fuerza al llevar la barra hacia la clavícula.',
    machineSetup: 'Ajusta los rodillos de sujeción para que queden firmes y bloqueen tus muslos sin permitir que tu cuerpo se eleve durante la tracción.',
    setupPosture: 'Agarre prono ligeramente más ancho que los hombros. Pecho erguido, mirada al frente y torso con una leve inclinación de 10-15° hacia atrás.',
    biomechanicsExplanation: 'Aducción y extensión del húmero en el plano frontal y sagital. El movimiento inicia con la depresión y retracción de las escápulas antes de que los brazos se flexionen.',
    cues: [
      'Inicia el movimiento bajando los hombros lejos de las orejas (depresión escapular)',
      'Imagina clavar los codos en los bolsillos traseros del pantalón',
      'No pienses en jalar con las manos; las manos son solo ganchos'
    ],
    eccentricPhase: 'Extiende los brazos lentamente en 2 segundos permitiendo que los dorsales se estiren completamente en la cima.',
    concentricPhase: 'Tira guiando con los codos hacia abajo y ligeramente hacia atrás, tocando la parte alta del esternón.',
    clinicalRisks: 'Jalar la barra por detrás de la nuca genera rotación externa extrema y cizallamiento en el manguito rotador y vértebras cervicales.',
    mistakes: [
      'Tirar la barra detrás del cuello',
      'Balancear el torso exageradamente hacia atrás para usar la inercia',
      'Encoger los hombros hacia arriba perdiendo el trabajo dorsal'
    ],
    steps: [
      'Ajusta los rodillos a tus muslos y toma la barra con agarre amplio.',
      'Siéntate con los muslos bloqueados y saca el pecho hacia adelante.',
      'Baja las escápulas y tira de la barra hacia la clavícula guiando con los codos.',
      'Aprieta los dorsales 1 segundo cuando la barra toque el pecho alto.',
      'Controla la subida en 2 segundos hasta estirar los brazos por completo.'
    ],
    animationType: 'lat-pulldown'
  },
  {
    id: 'gym-seated-cable-row',
    name: 'Remo Sentado en Polea Baja (Cable Row)',
    location: 'GYM',
    category: 'Polea / Tracción Horizontal',
    muscleGroup: 'Espalda',
    primaryMuscle: 'Espalda Media (Romboides, Trapecio Medio e Inferior)',
    secondaryMuscle: 'Dorsal Ancho, Deltoides Posterior y Bíceps',
    level: 'Todos los niveles',
    machineType: 'Torre de remo bajo con agarre cerrado o abierto',
    tempo: '2-1-2 (2s tirón al abdomen, 1s retracción escapular, 2s retorno)',
    breathing: 'Inhala al extender los brazos; exhala al llevar el agarre hacia el ombligo.',
    machineSetup: 'Coloca el manillar en V o barra cerrada en el mosquetón de la polea baja. Ajusta los apoyapiés.',
    setupPosture: 'Pies firmes en los apoyos con rodillas semiflexionadas (nunca bloqueadas). Espalda recta con ligera curvatura lumbar fisiológica y hombros relajados.',
    biomechanicsExplanation: 'Retracción escapular con extensión horizontal de hombro. Fortalece la cadena posterior corrigiendo la postura cifótica de hombros caídos.',
    cues: [
      'Saca el pecho y pellizca una moneda entre tus omóplatos',
      'Conduce los codos hacia atrás rozando las costillas',
      'Mantén el torso casi inmóvil; no uses el balanceo lumbar'
    ],
    eccentricPhase: 'Permite que los brazos se extiendan y las escápulas se abran suavemente en 2 segundos sin encorvar la espalda baja.',
    concentricPhase: 'Tira del agarre hacia el ombligo retrayendo los hombros con fuerza en 2 segundos.',
    clinicalRisks: 'Encorvar la zona lumbar al estirar los brazos bajo peso pesado puede producir hernias discales lumbares.',
    mistakes: [
      'Mover el torso hacia adelante y atrás como si remaras en un bote',
      'Subir los hombros en exceso hacia las orejas',
      'Tirar únicamente con los bíceps sin mover las escápulas'
    ],
    steps: [
      'Apoya los pies en los estribos con rodillas semiflexionadas y toma el agarre.',
      'Endereza la espalda y lleva el pecho hacia adelante.',
      'Tira del manillar hacia la boca del estómago manteniendo los codos cerca del cuerpo.',
      'Pellizca las escápulas fuertemente 1 segundo.',
      'Extiende los brazos lentamente sintiendo el estiramiento de la espalda media.'
    ],
    animationType: 'seated-cable-row'
  },
  {
    id: 'gym-tbar-row',
    name: 'Remo en Máquina T-Bar con Apoyo al Pecho (Chest-Supported Row)',
    location: 'GYM',
    category: 'Máquina de Palanca / Placas / Espalda Media',
    muscleGroup: 'Espalda',
    primaryMuscle: 'Romboides, Dorsal Ancho y Trapecio Medio',
    secondaryMuscle: 'Erectores Espinales y Bíceps',
    level: 'Todos los niveles',
    machineType: 'Máquina T-Bar con almohadilla pectoral inclinada',
    tempo: '2-1-2 (2s tirón, 1s retracción de escápulas, 2s retorno)',
    breathing: 'Inhala antes de tirar; exhala con fuerza al comprimir los omóplatos.',
    machineSetup: 'Ajusta la altura del reposapiés para que la parte superior de la almohadilla quede a la altura del esternón.',
    setupPosture: 'Pecho apoyado firmemente contra la almohadilla eliminando cualquier tensión lumbar.',
    biomechanicsExplanation: 'Al estar el pecho soportado por la almohadilla, se anula la fatiga de los erectores espinales, permitiendo aislar la espalda media y dorsal con cargas pesadas.',
    cues: [
      'No despegues el pecho de la almohadilla al traccionar',
      'Conduce con los codos hacia el techo',
      'Aprieta la espalda 1 segundo antes de descender'
    ],
    eccentricPhase: 'Baja los brazos en 2 segundos hasta el estiramiento completo de la espalda.',
    concentricPhase: 'Tira con fuerza guiando con los codos en 2 segundos.',
    clinicalRisks: 'Tirar con el cuello hiperextendido genera sobrecarga cervical.',
    mistakes: ['Separar el pecho del cojín para darse impulso', 'Hacer tirones incompletos'],
    steps: [
      'Apoya el pecho en la almohadilla y toma los mangos con agarre neutro o prono.',
      'Tira de los mangos hacia tus costillas juntando las escápulas.',
      'Sostén 1 segundo la máxima contracción.',
      'Baja con control en 2 segundos hasta estirar los brazos.'
    ],
    animationType: 'tbar-row'
  },
  {
    id: 'gym-assisted-pullup-dip',
    name: 'Máquina de Dominadas y Fondos Asistidos',
    location: 'GYM',
    category: 'Máquina de Contrapeso / Placas',
    muscleGroup: 'Espalda',
    primaryMuscle: 'Dorsal Ancho (en dominada) / Pectoral y Tríceps (en fondos)',
    secondaryMuscle: 'Bíceps, Antebrazo y Estabilizadores de Core',
    level: 'Principiante a Intermedio',
    machineType: 'Torre de dominadas asistidas por plataforma con placas',
    tempo: '2-1-2 (2s ascenso, 1s pausa con barbilla sobre la barra, 2s bajada)',
    breathing: 'Exhala al subir; inhala al descender con control.',
    machineSetup: 'Selecciona el peso de asistencia: a mayor peso seleccionado, más ligera será la dominada.',
    setupPosture: 'Coloca las rodillas sobre la plataforma acolchada y sujeta la barra ancha superior.',
    biomechanicsExplanation: 'Permite dominar el patrón de tracción vertical sin el freno de la fuerza relativa del peso corporal.',
    cues: [
      'Saca el pecho hacia la barra',
      'Lleva los codos hacia abajo y atrás',
      'Baja despacio sin que la plataforma te empuje de golpe'
    ],
    eccentricPhase: 'Baja en 2 segundos controlando el estiramiento de los dorsales.',
    concentricPhase: 'Tracciona en 2 segundos hasta pasar la barbilla por encima de la barra.',
    clinicalRisks: 'Soltar la plataforma de golpe puede causar impactos articulares en rodillas o dedos.',
    mistakes: ['Dejar que el contrapeso haga todo el trabajo sin tensión muscular', 'Encoger los hombros arriba'],
    steps: [
      'Selecciona el peso de asistencia deseado.',
      'Sube al escalón, toma los mangos superiores y apoya las rodillas en la plataforma.',
      'Tracciona con los dorsales hasta que tu barbilla supere los agarres.',
      'Baja de forma controlada hasta estirar los brazos casi por completo.'
    ],
    animationType: 'assisted-pullup-dip'
  },

  // =========================================================================
  // 🏢 4. HOMBROS & DELTOIDES - MÁQUINAS DEL GYM
  // =========================================================================
  {
    id: 'gym-shoulder-press',
    name: 'Press Militar de Hombros en Máquina',
    location: 'GYM',
    category: 'Máquina de Placas / Compuesto',
    muscleGroup: 'Hombros',
    primaryMuscle: 'Deltoides Anterior y Medio',
    secondaryMuscle: 'Tríceps Braquial y Trapecio Superior',
    level: 'Intermedio',
    machineType: 'Máquina guiada vertical de hombros',
    tempo: '3-0-1 (3s descenso, 0s pausa, 1s empuje hacia arriba)',
    breathing: 'Inhala al bajar los agarres a nivel de orejas; exhala con potencia al empujar hacia el techo.',
    machineSetup: 'Ajusta la altura del sillín de modo que los mangos comiencen a la altura de la mandíbula o las orejas.',
    setupPosture: 'Glúteos y espalda alta contra el respaldo. Pies apoyados firmemente en el suelo.',
    biomechanicsExplanation: 'Abducción y flexión del hombro en el plano escapular (aproximadamente 30° adelantado respecto al plano frontal), protegiendo el espacio subacromial.',
    cues: [
      'Empuja verticalmente como si levantaras el techo con los hombros',
      'Mantén los codos ligeramente hacia adelante, no abiertos a 180°',
      'No arquees la zona lumbar para compensar el peso'
    ],
    eccentricPhase: 'Baja el peso en 3 segundos lentos hasta la altura de las orejas.',
    concentricPhase: 'Empuja hacia arriba con fuerza en 1 segundo sin bloquear los codos.',
    clinicalRisks: 'Forzar los codos hacia atrás en línea recta causa roce patológico en el tendón del supraespinoso.',
    mistakes: [
      'Arquear la espalda exageradamente separando las lumbares',
      'Bajar más allá de la barbilla forzando el hombro en hiperextensión',
      'Golpear los topes de la máquina al subir'
    ],
    steps: [
      'Ajusta la altura de la banqueta y siéntate erguido.',
      'Toma los agarres con las palmas mirando hacia adelante o neutras.',
      'Empuja verticalmente extendiendo los brazos sin bloquear codos.',
      'Baja de forma controlada en 3 segundos hasta que las manos queden a la altura de las orejas.',
      'Vuelve a empujar con potencia.'
    ],
    animationType: 'shoulder-press'
  },
  {
    id: 'gym-lateral-raise-machine',
    name: 'Elevaciones Laterales en Máquina (Lateral Raise)',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Hombros',
    primaryMuscle: 'Deltoides Lateral (Cabeza Media del Hombro)',
    secondaryMuscle: 'Trapecio Superior y Supraespinoso',
    level: 'Todos los niveles',
    machineType: 'Máquina sentada con almohadillas en codos',
    tempo: '2-1-2 (2s elevación, 1s contracción isométrica en la cima, 2s bajada)',
    breathing: 'Exhala al levantar los brazos lateralmente; inhala al descender.',
    machineSetup: 'Ajusta el asiento para que el eje de rotación de las palancas coincida exactamente con la articulación del hombro.',
    setupPosture: 'Torso erguido contra el respaldo, pecho abierto, codos apoyados firmemente contra las almohadillas laterales.',
    biomechanicsExplanation: 'Abducción pura en plano frontal con resistencia constante desde el inicio del rango, superando la limitación de las mancuernas donde el tercio inicial casi no tiene carga.',
    cues: [
      'Conduce la fuerza empujando con los codos, no con las manos',
      'Levanta hasta que los codos queden alineados con los hombros (paralelos al piso)',
      'No encojas los hombros hacia el cuello'
    ],
    eccentricPhase: 'Baja los codos lentamente en 2 segundos resistiendo la carga.',
    concentricPhase: 'Eleva los brazos en 2 segundos hasta los 90° y aprieta 1 segundo en la cima.',
    clinicalRisks: 'Elevar los codos por encima de la línea de los hombros puede generar choque acromial.',
    mistakes: ['Usar inercia con el torso', 'Empujar con las muñecas en lugar de los codos'],
    steps: [
      'Siéntate, ajusta el sillín y coloca los codos contra las almohadillas.',
      'Sujeta las manillas ligeramente sin apretar en exceso.',
      'Eleva los codos hacia los lados hasta la horizontal de los hombros.',
      'Pausa 1 segundo arriba sintiendo el deltoides lateral.',
      'Baja despacio en 2 segundos.'
    ],
    animationType: 'lateral-raise-machine'
  },
  {
    id: 'gym-rear-delt-fly',
    name: 'Pájaros / Deltoides Posterior en Pec Deck Invertido',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Hombros',
    primaryMuscle: 'Deltoides Posterior',
    secondaryMuscle: 'Romboides, Trapecio Medio e Infraespinoso',
    level: 'Todos los niveles',
    machineType: 'Máquina Pec Deck configurada en sentido inverso',
    tempo: '2-1-2 (2s apertura hacia atrás, 1s compresión posterior, 2s retorno)',
    breathing: 'Exhala al abrir los brazos hacia atrás; inhala al retornar.',
    machineSetup: 'Coloca los brazos de la máquina en los topes más retrasados. Ajusta el asiento para que los mangos queden a la altura de los hombros.',
    setupPosture: 'Siéntate de cara a la almohadilla (pecho contra el respaldo). Brazos estirados al frente con micro-flexión de codos.',
    biomechanicsExplanation: 'Abducción horizontal del hombro con foco exclusivo en la cara posterior del deltoides.',
    cues: [
      'Abre los brazos guiando con el dorso de las manos',
      'Mantén los hombros bajos lejos del cuello',
      'Aprieta la parte de atrás del hombro, no pienses en pellizcar las escápulas'
    ],
    eccentricPhase: 'Vuelve al frente despacio en 2 segundos manteniendo los codos rígidos.',
    concentricPhase: 'Abre hacia atrás en 2 segundos hasta alcanzar la línea del torso.',
    clinicalRisks: 'Flexionar y extender los codos convierte el ejercicio en un tríceps restando efectividad.',
    mistakes: ['Encoger los hombros hacia arriba activando el trapecio superior', 'Usar peso excesivo que curve la espalda'],
    steps: [
      'Siéntate de frente al respaldo con el pecho apoyado.',
      'Toma los mangos con agarre neutro o prono con brazos casi rectos.',
      'Abre los brazos hacia atrás en un arco amplio.',
      'Aprieta la parte posterior de los hombros 1 segundo.',
      'Regresa lentamente al centro.'
    ],
    animationType: 'rear-delt-fly'
  },
  {
    id: 'gym-cable-lateral-raise',
    name: 'Elevaciones Laterales en Polea Baja',
    location: 'GYM',
    category: 'Polea / Aislamiento',
    muscleGroup: 'Hombros',
    primaryMuscle: 'Deltoides Lateral',
    secondaryMuscle: 'Trapecio y Supraespinoso',
    level: 'Intermedio',
    machineType: 'Torre de polea baja con estribo',
    tempo: '2-1-2 (2s subida, 1s pausa arriba, 2s bajada)',
    breathing: 'Exhala al elevar el brazo; inhala al descender.',
    machineSetup: 'Coloca la polea en el punto más bajo. Sujeta el estribo con la mano contraria pasándolo por detrás o delante del cuerpo.',
    setupPosture: 'De pie de perfil a la polea con el torso ligeramente inclinado hacia afuera para alinear el vector de fuerza.',
    biomechanicsExplanation: 'Curva de resistencia perfecta: la polea ofrece tensión máxima desde los primeros grados de abducción.',
    cues: [
      'Lanza la mano hacia la esquina de la habitación (hacia afuera, no solo hacia arriba)',
      'Mantén la muñeca firme y el codo levemente flexionado',
      'No subas más allá de la altura de la oreja'
    ],
    eccentricPhase: 'Baja en 2 segundos frenando la tracción del cable.',
    concentricPhase: 'Eleva el brazo lateralmente en 2 segundos hasta la altura del hombro.',
    clinicalRisks: 'Tirones bruscos con el torso pueden desgarrar fibras del manguito rotador.',
    mistakes: ['Balancear el cuerpo para elevar el cable', 'Flexionar el brazo como si fuera un curl'],
    steps: [
      'De pie al lado de la polea baja, toma el estribo con la mano externa.',
      'Inclina levemente el cuerpo y eleva el brazo hacia el lado en arco amplio.',
      'Pausa 1 segundo a la altura del hombro.',
      'Desciende con control en 2 segundos.'
    ],
    animationType: 'cable-lateral-raise'
  },

  // =========================================================================
  // 🏢 5. BRAZOS (BÍCEPS & TRÍCEPS) - MÁQUINAS DEL GYM
  // =========================================================================
  {
    id: 'gym-triceps-pushdown',
    name: 'Extensión de Tríceps en Polea Alta con Cuerda',
    location: 'GYM',
    category: 'Polea / Aislamiento',
    muscleGroup: 'Brazos',
    primaryMuscle: 'Tríceps Braquial (Las 3 cabezas: Lateral, Medial y Larga)',
    secondaryMuscle: 'Músculos del Antebrazo y Estabilizadores de Muñeca',
    level: 'Todos los niveles',
    machineType: 'Torre de polea alta con cuerda doble',
    tempo: '2-1-2 (2s extensión con apertura de cuerda, 1s bloqueo, 2s subida)',
    breathing: 'Exhala al extender y abrir la cuerda; inhala al flexionar los codos hacia arriba.',
    machineSetup: 'Coloca el mosquetón en el punto más alto de la torre con la cuerda doble instalada.',
    setupPosture: 'De pie con el torso inclinado unos 10-15° hacia el frente. Pies estables y codos pegados a los costados del torso.',
    biomechanicsExplanation: 'Extensión pura de codo en plano sagital. El uso de la cuerda permite una pronación y abducción distal final que recluta con mayor intensidad la cabeza lateral del tríceps.',
    cues: [
      'Pega los codos a tus costillas como si estuvieran atornillados',
      'Abre las puntas de la cuerda hacia afuera al final del empuje',
      'No permitas que los codos se desplacen hacia adelante en la subida'
    ],
    eccentricPhase: 'Deja subir las manos hasta que los antebrazos superen los 90° en 2 segundos sin mover los codos del sitio.',
    concentricPhase: 'Extiende con potencia en 2 segundos hacia el suelo y separa los extremos de la cuerda apretando el tríceps 1 segundo.',
    clinicalRisks: 'El uso de impulsos del hombro y peso excesivo sobrecarga el tendón del tríceps provocando tendinopatía tricipital.',
    mistakes: [
      'Mover los codos hacia adelante y atrás convirtiéndolo en un ejercicio de hombro',
      'Encorvar la espalda y cargar con el peso del cuerpo',
      'No abrir la cuerda al final perdiendo el rango completo de movimiento'
    ],
    steps: [
      'Toma los dos extremos de la cuerda con agarre neutro.',
      'Fija los codos pegados al cuerpo y reclina levemente el tronco.',
      'Empuja la cuerda hacia el suelo estirando los brazos y abriendo las manos hacia los muslos.',
      'Contrae fuertemente el tríceps 1 segundo abajo.',
      'Sube con control hasta que los antebrazos queden paralelos al suelo.'
    ],
    animationType: 'triceps-pushdown'
  },
  {
    id: 'gym-seated-dip-machine',
    name: 'Máquina de Fondos de Tríceps Sentado (Seated Dip Machine)',
    location: 'GYM',
    category: 'Máquina de Palanca / Placas / Brazos',
    muscleGroup: 'Brazos',
    primaryMuscle: 'Tríceps Braquial (Énfasis en Cabeza Medial y Lateral)',
    secondaryMuscle: 'Pectoral Inferior y Deltoides Anterior',
    level: 'Todos los niveles',
    machineType: 'Máquina sentada con barras paralelas de empuje hacia abajo',
    tempo: '2-1-2 (2s empuje hacia abajo, 1s bloqueo, 2s subida)',
    breathing: 'Exhala al empujar las barras hacia abajo; inhala al subir.',
    machineSetup: 'Ajusta el cinturón de sujeción para fijar los muslos al asiento si vas a usar cargas pesadas.',
    setupPosture: 'Espalda bien apoyada en el respaldo, codos flexionados junto al cuerpo sobre los mangos.',
    biomechanicsExplanation: 'Permite realizar fondos pesados para tríceps sin la inestabilidad articular del peso corporal libre en paralelas.',
    cues: [
      'Empuja con la base de las palmas hacia el suelo',
      'Mantén los codos pegados al cuerpo (no los abras hacia afuera)',
      'Bloquea los tríceps con firmeza abajo'
    ],
    eccentricPhase: 'Permite que los mangos suban en 2 segundos hasta que los codos formen 90°.',
    concentricPhase: 'Empuja hacia abajo con fuerza en 2 segundos hasta extender los brazos.',
    clinicalRisks: 'Dejar que los mangos suban más allá de los 90° ejerce tensión lesiva sobre el hombro anterior.',
    mistakes: ['Despegar la espalda del asiento', 'Abrir los codos en exceso hacia los laterales'],
    steps: [
      'Siéntate y ajusta el cinturón o almohadilla sobre los muslos.',
      'Toma las barras laterales con las palmas hacia abajo.',
      'Empuja las barras hacia el suelo extendiendo los codos por completo.',
      'Aprieta los tríceps 1 segundo abajo.',
      'Sube despacio en 2 segundos hasta los 90° de flexión.'
    ],
    animationType: 'seated-dip-machine'
  },
  {
    id: 'gym-preacher-curl',
    name: 'Curl de Bíceps en Banco Scott / Predicador',
    location: 'GYM',
    category: 'Máquina de Placas / Aislamiento',
    muscleGroup: 'Brazos',
    primaryMuscle: 'Bíceps Braquial y Braquial Anterior',
    secondaryMuscle: 'Braquiorradial y Pronador Redondo',
    level: 'Intermedio',
    machineType: 'Máquina o Banco Scott con barra Z / polea',
    tempo: '2-1-2 (2s flexión, 1s contracción en la cima, 2s descenso controlado)',
    breathing: 'Exhala al flexionar y subir el peso; inhala al bajar controlando el estiramiento.',
    machineSetup: 'Ajusta el asiento para que las axilas reposen cómodamente en el borde superior del acolchado inclinado a 45°.',
    setupPosture: 'Pecho apoyado en el banco, tríceps totalmente planos contra el acolchado.',
    biomechanicsExplanation: 'Al estar el hombro flexionado a 45°, se acorta la cabeza larga del bíceps y se sobrecarga intensamente el braquial y la cabeza corta en el tercio inicial del movimiento.',
    cues: [
      'Apoya todo el tríceps contra la almohadilla, no solo los codos',
      'Sube apretando la bola del bíceps',
      'No hiperextiendas bruscamente el codo al final de la bajada'
    ],
    eccentricPhase: 'Baja en 2 segundos sintiendo tensión constante hasta dejar una micro-flexión protectora en el codo.',
    concentricPhase: 'Flexiona con fuerza en 2 segundos llevando la barra hacia la barbilla.',
    clinicalRisks: 'Dejar caer el peso hasta bloquear el codo en hiperextensión puede ocasionar desgarro del tendón distal del bíceps.',
    mistakes: [
      'Despegar los brazos de la almohadilla al levantar el peso',
      'Tirones de cuello y balanceo de espalda',
      'Hiperextensión violenta de los codos en la posición baja'
    ],
    steps: [
      'Ajusta el asiento para que el pecho y axilas queden encajados en la almohadilla.',
      'Toma la barra o mangos con las palmas mirando hacia arriba.',
      'Flexiona los codos subiendo el peso hacia los hombros sin mover los brazos del soporte.',
      'Aprieta 1 segundo arriba sintiendo el pico del bíceps.',
      'Desciende despacio en 2 segundos hasta casi estirar el brazo.'
    ],
    animationType: 'preacher-curl'
  },
  {
    id: 'gym-cable-biceps-curl',
    name: 'Curl de Bíceps en Polea Baja de Pie con Barra',
    location: 'GYM',
    category: 'Polea / Aislamiento',
    muscleGroup: 'Brazos',
    primaryMuscle: 'Bíceps Braquial (Cabeza Larga y Corta)',
    secondaryMuscle: 'Braquial Anterior y Músculos del Antebrazo',
    level: 'Todos los niveles',
    machineType: 'Torre de polea baja con barra recta o barra EZ',
    tempo: '2-1-2 (2s flexión hacia arriba, 1s contracción en la cima, 2s bajada)',
    breathing: 'Exhala al subir la barra; inhala al bajar.',
    machineSetup: 'Fija el mosquetón en la polea más baja con la barra corta colocada.',
    setupPosture: 'De pie frente a la polea, torso erguido, codos pegados a los costados y pies al ancho de caderas.',
    biomechanicsExplanation: 'A diferencia de las mancuernas, el cable mantiene tensión angular continua incluso en el punto superior de la flexión.',
    cues: [
      'Mantén los codos pegados a la cintura sin adelantarlos',
      'Gira levemente las muñecas hacia arriba para máxima supinación',
      'No uses balanceo de cadera para iniciar la repetición'
    ],
    eccentricPhase: 'Baja la barra en 2 segundos resistiendo la tensión del cable.',
    concentricPhase: 'Sube la barra en 2 segundos contrayendo los bíceps con potencia.',
    clinicalRisks: 'Arquear la espalda lumbar para subir el peso causa fatiga y pinzamiento en la columna.',
    mistakes: ['Mover los codos hacia adelante convirtiéndolo en ejercicio de hombro', 'Balanceo del torso'],
    steps: [
      'Toma la barra con palmas hacia arriba a la anchura de hombros.',
      'Pega los codos al cuerpo y mantén la espalda erguida.',
      'Flexiona los codos subiendo la barra hacia el pecho.',
      'Aprieta fuertemente los bíceps en el punto más alto durante 1 segundo.',
      'Desciende con control en 2 segundos.'
    ],
    animationType: 'cable-biceps-curl'
  },

  // =========================================================================
  // 🏢 6. ABDOMEN, CORE & LUMBAR - MÁQUINAS DEL GYM
  // =========================================================================
  {
    id: 'gym-seated-abs-machine',
    name: 'Máquina de Crunch Abdominal Sentado con Carga',
    location: 'GYM',
    category: 'Máquina de Placas / Core Guiado',
    muscleGroup: 'Abdomen / Core',
    primaryMuscle: 'Recto Abdominal Completo',
    secondaryMuscle: 'Oblicuos y Serratos',
    level: 'Todos los niveles',
    machineType: 'Máquina de abdominales sentado con rodillos en pecho y pies',
    tempo: '2-1-2 (2s flexión de torso, 1s compresión máxima, 2s retorno)',
    breathing: 'Exhala expulsando todo el aire al enrollar el torso; inhala al retornar.',
    machineSetup: 'Ajusta el asiento para que el eje de rotación de la máquina quede alineado con el ombligo.',
    setupPosture: 'Sentado con los pies trabados en los rodillos inferiores y las manos sujetando los mangos superiores.',
    biomechanicsExplanation: 'Sobrecarga progresiva pura del recto abdominal mediante flexión toracolumbar con resistencia guiada.',
    cues: [
      'Enrolla el torso como un acordeón llevando las costillas a la cadera',
      'No empujes con las piernas ni jales con los brazos; el esfuerzo nace del abdomen',
      'Expulsa el aire con fuerza en la máxima contracción'
    ],
    eccentricPhase: 'Regresa despacio en 2 segundos sintiendo el estiramiento abdominal.',
    concentricPhase: 'Flexiona el torso en 2 segundos apretando el abdomen 1 segundo.',
    clinicalRisks: 'Usar peso desmedido sin fuerza de core transfiere la carga a los flexores de cadera dañando la zona lumbar.',
    mistakes: ['Tirar con los brazos en lugar del abdomen', 'Hacer repeticiones rápidas rebotando'],
    steps: [
      'Siéntate, coloca los pies tras los rodillos y sujeta los mangos superiores.',
      'Contrae el abdomen flexionando la columna hacia adelante.',
      'Sostén la compresión 1 segundo expulsando todo el aire.',
      'Vuelve a la posición inicial en 2 segundos de forma controlada.'
    ],
    animationType: 'seated-abs-machine'
  },
  {
    id: 'gym-cable-crunch',
    name: 'Crunch Abdominal en Polea Alta con Cuerda',
    location: 'GYM',
    category: 'Polea / Aislamiento de Core',
    muscleGroup: 'Abdomen / Core',
    primaryMuscle: 'Recto Abdominal (Parte Superior y Media)',
    secondaryMuscle: 'Oblicuos Internos y Externos',
    level: 'Intermedio a Avanzado',
    machineType: 'Torre de polea alta con cuerda',
    tempo: '2-1-2 (2s enrollar la columna, 1s compresión máxima, 2s retorno)',
    breathing: 'Inhala arriba al estirar; exhala todo el aire al enrollar la columna hacia la pelvis.',
    machineSetup: 'Fija la polea en la posición más alta y coloca la cuerda de tríceps.',
    setupPosture: 'Arrodillado a un metro de la polea. Manos con la cuerda apoyadas a los lados de la cabeza o cuello. Cadera fija a 90° respecto a los muslos.',
    biomechanicsExplanation: 'Flexión activa de la columna vertebral contra resistencia. La clave biomecánica es curvar la columna (enrollarse como un caparazón) sin flexionar la articulación de la cadera.',
    cues: [
      'Imagina llevar la barbilla y las costillas hacia el ombligo',
      'No te sientes sobre tus talones; la cadera no se mueve',
      'Vacía todo el aire de tus pulmones en la contracción'
    ],
    eccentricPhase: 'Permite que la columna se extienda lentamente en 2 segundos hasta la posición neutra sin que el peso tire bruscamente de ti.',
    concentricPhase: 'Flexiona la espalda enrollando el torso en 2 segundos llevando los codos hacia las rodillas.',
    clinicalRisks: 'Si mueves la cadera en lugar de la columna, el ejercicio lo realizan los flexores de cadera (psoas ilíaco), provocando dolor lumbar.',
    mistakes: [
      'Sentarse en los talones convirtiéndolo en un movimiento de cadera',
      'Tirar con los brazos en lugar de usar los abdominales',
      'Mantener la columna recta como una tabla impidiendo la flexión del recto abdominal'
    ],
    steps: [
      'Arrodíllate frente a la polea y coloca las manos con la cuerda a los lados de tus orejas.',
      'Fija las caderas en el aire sin sentarte.',
      'Enrolla el torso contrayendo el abdomen y llevando los codos hacia los muslos.',
      'Sostén 1 segundo la contracción expulsando todo el aire.',
      'Vuelve a la posición inicial estirando suavemente el abdomen.'
    ],
    animationType: 'cable-crunch'
  },
  {
    id: 'gym-hyperextension',
    name: 'Banco de Hiperextensiones Lumbar y Glúteo a 45°',
    location: 'GYM',
    category: 'Banco Inclinado / Cadena Posterior',
    muscleGroup: 'Abdomen / Core',
    primaryMuscle: 'Erectores Espinales (Zona Lumbar)',
    secondaryMuscle: 'Glúteo Mayor e Isquiosurales',
    level: 'Todos los niveles',
    machineType: 'Banco romano inclinado a 45°',
    tempo: '2-1-2 (2s elevación a línea recta, 1s pausa, 2s flexión hacia abajo)',
    breathing: 'Inhala al descender el torso; exhala al elevarte hasta la línea recta.',
    machineSetup: 'Ajusta la almohadilla superior para que quede justo por debajo de la cresta ilíaca (hueso de la cadera) permitiendo la flexión libre.',
    setupPosture: 'Pies bien apoyados en la plataforma con talones contra los rodillos traseros.',
    biomechanicsExplanation: 'Extensión de tronco y cadera en plano sagital. Fortalece la musculatura paravertebral lumbar que previene lesiones discales.',
    cues: [
      'Sube hasta formar una línea recta con tu cuerpo, no te arquees hacia atrás como un arco',
      'Cruza los brazos sobre el pecho o colócalos tras la nuca sin tirar de ella',
      'Baja con control sintiendo el estiramiento en la cadena posterior'
    ],
    eccentricPhase: 'Baja el torso en 2 segundos hasta un ángulo cercano a 90° con las piernas.',
    concentricPhase: 'Sube en 2 segundos contrayendo glúteos y lumbares hasta quedar alineado.',
    clinicalRisks: 'Hiperextender la columna más allá de la línea recta comprime severamente las vértebras lumbares.',
    mistakes: ['Hiperextender el torso exageradamente hacia atrás', 'Hacer rebotes rápidos'],
    steps: [
      'Colócate en el banco con los talones trabados y la cadera en el acolchado.',
      'Cruza los brazos sobre el pecho.',
      'Flexiona la cadera bajando el torso hacia el suelo de forma controlada.',
      'Eleva el cuerpo hasta quedar en perfecta línea recta con las piernas.',
      'Sostén 1 segundo y repite.'
    ],
    animationType: 'hyperextension'
  },

  // =========================================================================
  // 🏢 7. CARDIO & RESISTENCIA EN MÁQUINAS DEL GYM
  // =========================================================================
  {
    id: 'gym-treadmill',
    name: 'Cinta de Correr Profesional (Incline Walk & Running)',
    location: 'GYM',
    category: 'Máquina Cardiovascular Motorizada',
    muscleGroup: 'Cardio & Core',
    primaryMuscle: 'Sistema Cardiorrespiratorio y Piernas Completas',
    secondaryMuscle: 'Gemelos, Cuádriceps, Glúteos y Core',
    level: 'Todos los niveles',
    machineType: 'Cinta de correr eléctrica con pendiente ajustable',
    tempo: 'Continuo o Intervalos HIIT (ej: 1 min sprint x 1 min caminata)',
    breathing: 'Respiración rítmica diafragmática coordinada con la cadencia de zancada.',
    machineSetup: 'Ajusta la pendiente (incline de 2% a 12%) para mayor activación de glúteo sin impacto articular.',
    setupPosture: 'Torso erguido, mirada al frente, hombros relajados y brazos braceando a 90°.',
    biomechanicsExplanation: 'Entrenamiento aeróbico y anaeróbico de alto consumo calórico y mejora del VO2 Máx.',
    cues: [
      'Aterriza con la parte media del pie, no de talón brusco',
      'No te sujetes de las barandillas al caminar con inclinación; bracea naturalmente',
      'Mantén el centro de la cinta sin pisar los laterales'
    ],
    eccentricPhase: 'Fase de amortiguación en cada zancada.',
    concentricPhase: 'Fase de despegue y propulsión.',
    clinicalRisks: 'Correr talonando con calzado inadecuado puede generar periostitis tibial y fascitis plantar.',
    mistakes: ['Sujetarse de la pantalla reduciendo el gasto calórico en un 40%', 'Mirar el móvil tropezando'],
    steps: [
      'Coloca la llave de seguridad en tu camiseta.',
      'Inicia con caminata suave de calentamiento durante 3-5 minutos.',
      'Ajusta la velocidad o pendiente según tu objetivo (quema grasa o HIIT).',
      'Mantén el braceo natural y zancada elástica.',
      'Finaliza con vuelta a la calma de 3 minutos.'
    ],
    animationType: 'treadmill'
  },
  {
    id: 'gym-stairmaster',
    name: 'Escaladora Sinfín (Stairmaster / StepMill)',
    location: 'GYM',
    category: 'Máquina Cardiovascular de Peldaños Reales',
    muscleGroup: 'Cardio & Core',
    primaryMuscle: 'Glúteos, Cuádriceps y Pantorrillas',
    secondaryMuscle: 'Capacidad Cardiorrespiratoria y Core Estabilizador',
    level: 'Intermedio a Avanzado',
    machineType: 'Simulador de escaleras mecánicas giratorias',
    tempo: 'Continuo a ritmo constante (60-90 escalones por minuto)',
    breathing: 'Inhalación profunda nasal y exhalación bucal controlada.',
    machineSetup: 'Selecciona el nivel de velocidad en la consola digital.',
    setupPosture: 'Torso erguido con leve inclinación frontal desde los tobillos (no jorobado sobre los pasamanos).',
    biomechanicsExplanation: 'Triple extensión repetitiva contra la gravedad en cada peldaño, con máximo estímulo para glúteos e isquiotibiales con nulo impacto articular.',
    cues: [
      'Pisa el peldaño con toda la planta del pie, no solo con las puntas',
      'Apoya las manos en los sensores solo para equilibrio, no descargues tu peso en ellos',
      'Empuja desde el talón activando el glúteo en cada paso'
    ],
    eccentricPhase: 'Amortiguación mínima en el descenso del peldaño.',
    concentricPhase: 'Elevación de todo el peso corporal en cada paso.',
    clinicalRisks: 'Caminar en puntas sobrecarga excesivamente el tendón de Aquiles y la fascia plantar.',
    mistakes: ['Apoyarse pesadamente con los codos en la consola', 'Saltar peldaños de forma descontrolada'],
    steps: [
      'Sube al primer peldaño y pulsa Start.',
      'Comienza a subir escalones con ritmo pausado apoyando la planta completa.',
      'Aumenta la velocidad gradualmente manteniendo la espalda erguida.',
      'Sostiene la sesión durante 15 a 30 minutos según tu capacidad.'
    ],
    animationType: 'stairmaster'
  },
  {
    id: 'gym-stationary-bike',
    name: 'Bicicleta Estática / Spinning',
    location: 'GYM',
    category: 'Cardiovascular de Bajo Impacto',
    muscleGroup: 'Cardio & Core',
    primaryMuscle: 'Cuádriceps, Isquiosurales y Sistema Cardiovascular',
    secondaryMuscle: 'Glúteos y Gemelos',
    level: 'Todos los niveles',
    machineType: 'Bicicleta de piñón fijo o magnética',
    tempo: 'Cadencia de 70 a 95 RPM (Revoluciones Por Minuto)',
    breathing: 'Respiración aeróbica constante y profunda.',
    machineSetup: 'Ajusta el sillín a la altura de la cresta ilíaca (hueso de la cadera al estar de pie al lado de la bici). El manillar a una altura que no force la espalda baja.',
    setupPosture: 'Pelvis fija en el asiento, rodilla con micro-flexión de 15° en el punto más bajo del pedal.',
    biomechanicsExplanation: 'Pedaleo circular en cadena cerrada con impacto articular cero en rodillas y caderas.',
    cues: [
      'Imagina raspar barro de la suela en la parte baja del pedaleo (pedaleo redondo)',
      'Mantén los hombros relajados sin apretar el manillar con tensión',
      'No dejes que las rodillas apunten hacia afuera'
    ],
    eccentricPhase: 'Fase de recobro hacia arriba.',
    concentricPhase: 'Fase de empuje hacia abajo del pedal.',
    clinicalRisks: 'Sillín muy bajo genera compresión patelofemoral extrema en la rodilla; sillín muy alto causa balanceo pélvico y bursitis.',
    mistakes: ['Sillín mal regulado', 'Pedalear con resistencia cero rebotando en el asiento'],
    steps: [
      'Regula el sillín y manillar a tus medidas antropométricas.',
      'Ajusta las correas de los pedales sobre los empeines.',
      'Comienza a pedalear suave ajustando la resistencia.',
      'Mantén la cadencia entre 80-90 RPM.'
    ],
    animationType: 'cardio'
  },
  {
    id: 'gym-rowing-machine',
    name: 'Máquina de Remo Indoor / Ergómetro de Aire (Concept2)',
    location: 'GYM',
    category: 'Cardio Full Body / Resistencia de Potencia',
    muscleGroup: 'Cardio & Core',
    primaryMuscle: 'Cadena Posterior Completa (Piernas, Espalda, Core y Brazos)',
    secondaryMuscle: 'Capacidad Aeróbica y Anaeróbica',
    level: 'Intermedio a Avanzado',
    machineType: 'Ergómetro de remo con resistencia por turbina de aire',
    tempo: '24-28 paladas por minuto (Relación 1:2: 1s empuje potente, 2s recuperación suave)',
    breathing: 'Exhala en el empuje potente; inhala en el retorno hacia adelante.',
    machineSetup: 'Ajusta la talonera para que la correa cruce justo por el nacimiento de los cordones de la zapatilla.',
    setupPosture: 'Secuencia estricta: Piernas -> Torso -> Brazos en el empuje; Brazos -> Torso -> Piernas en el retorno.',
    biomechanicsExplanation: 'Recluta el 86% de la masa muscular corporal combinando triple extensión con tracción dorsal horizontal.',
    cues: [
      'El 60% de la fuerza proviene de las piernas, 20% del core y solo 20% de los brazos',
      'Empuja con las piernas antes de jalar con los brazos',
      'Mantén la cadena horizontal sin dar saltos con la empuñadura'
    ],
    eccentricPhase: 'Retorno controlado (Recuperación) hacia la turbina en 2 segundos.',
    concentricPhase: 'Empuje explosivo de piernas seguido del tirón dorsal en 1 segundo.',
    clinicalRisks: 'Doblar las rodillas antes de pasar la barra sobre ellas genera choque y encorvamiento lumbar lesivo.',
    mistakes: ['Tirar solo con los brazos sin empujar con las piernas', 'Encorvar la espalda baja'],
    steps: [
      'Ajusta las correas en los pies y toma la empuñadura.',
      'Comienza en posición de ataque con piernas flexionadas.',
      'Empuja con potencia desde las piernas estirándolas por completo.',
      'Inclina levemente el torso y tira de la empuñadura hacia las costillas.',
      'Regresa en orden inverso: estira brazos, inclina torso y flexiona piernas.'
    ],
    animationType: 'cardio'
  },

  // =========================================================================
  // 🏠 8. EJERCICIOS EN CASA (CALISTENIA & PESO CORPORAL)
  // =========================================================================
  {
    id: 'home-push-up',
    name: 'Flexiones de Pecho Clásicas (Push-Ups)',
    location: 'CASA',
    category: 'Calistenia / Peso Corporal',
    muscleGroup: 'Pecho',
    primaryMuscle: 'Pectoral Mayor (Porción media e inferior)',
    secondaryMuscle: 'Tríceps Braquial, Deltoides Anterior y Core',
    level: 'Principiante a Intermedio',
    machineType: 'Sin equipamiento (Esterilla opcional)',
    tempo: '3-0-1 (3s descenso controlado, 0s pausa, 1s empuje)',
    breathing: 'Inhala profundamente por la nariz al bajar; exhala con fuerza por la boca al empujar.',
    machineSetup: 'Suelo nivelado o esterilla antideslizante con espacio libre alrededor.',
    setupPosture: 'Manos apoyadas a una anchura ligeramente superior a los hombros. Dedos bien abiertos. Cuerpo en plancha perfecta desde los talones hasta la coronilla.',
    biomechanicsExplanation: 'Cadena cinética cerrada de empuje horizontal. Los codos deben formar un ángulo de flecha de 45° respecto al torso para proteger el manguito rotador.',
    cues: [
      'Aprieta los glúteos y el abdomen como si fueras a recibir un golpe',
      'Dibuja una punta de flecha con tus codos (no una T mayúscula)',
      'Baja hasta que el pecho roce suavemente el suelo'
    ],
    eccentricPhase: 'Baja en 3 segundos manteniendo el cuerpo completamente rígido hasta quedar a 2 centímetros del suelo.',
    concentricPhase: 'Empuja el piso con fuerza en 1 segundo hasta extender los brazos sin hiperextender codos.',
    clinicalRisks: 'Abrir los codos a 90° en cruz (forma de T) causa compresión del tendón supraespinoso en el acromion. Dejar caer la cadera comprime la zona lumbar.',
    mistakes: [
      'Dejar caer la pelvis hacia el suelo por debilidad de core',
      'Abrir los codos hacia afuera en un ángulo de 90°',
      'Hacer repeticiones cortas sin bajar el pecho hasta el suelo'
    ],
    steps: [
      'Colócate en posición de plancha con manos separadas al ancho de los hombros.',
      'Activa glúteos, cuádriceps y abdomen para formar una línea recta.',
      'Desciende el cuerpo en bloque en 3 segundos doblando los codos a 45°.',
      'Toca o acércate a 2 cm del suelo con el pecho.',
      'Empuja con fuerza el piso hasta volver a la posición de plancha.'
    ],
    animationType: 'push-up'
  },
  {
    id: 'home-diamond-push-up',
    name: 'Flexiones Diamante (Enfoque Tríceps)',
    location: 'CASA',
    category: 'Calistenia / Peso Corporal',
    muscleGroup: 'Brazos',
    primaryMuscle: 'Tríceps Braquial (Cabeza Lateral y Medial)',
    secondaryMuscle: 'Pectoral Mayor (Porción Esternal) y Deltoides Anterior',
    level: 'Intermedio a Avanzado',
    machineType: 'Sin equipamiento',
    tempo: '3-0-1 (3s descenso, 0s pausa, 1s empuje)',
    breathing: 'Inhala mientras bajas el pecho hacia las manos; exhala con potencia al empujar.',
    machineSetup: 'Suelo firme.',
    setupPosture: 'Junta los dedos índices y pulgares formando un triángulo o diamante directamente debajo del centro del pecho.',
    biomechanicsExplanation: 'Al cerrar el agarre, se reduce el brazo de momento del pectoral y se multiplica la flexión de codo, obligando a los tríceps a soportar hasta el 75% de la carga corporal.',
    cues: [
      'Apunta con el esternón hacia el centro del diamante',
      'Mantén los codos pegados a los costados del torso',
      'Si es muy difícil, apoya las rodillas para perfeccionar la técnica'
    ],
    eccentricPhase: 'Baja en 3 segundos lentos manteniendo el control milimétrico sobre los codos.',
    concentricPhase: 'Empuja con las palmas en 1 segundo focalizando toda la tensión en la cara posterior de los brazos.',
    clinicalRisks: 'Si sientes molestia en las muñecas, separa ligeramente los dedos o realiza el ejercicio apoyado sobre mancuernas para mantener la muñeca neutra.',
    mistakes: [
      'Abrir los codos excesivamente generando dolor en muñecas',
      'Arquear la columna lumbar',
      'Hacer solo la mitad del recorrido'
    ],
    steps: [
      'Adopta la posición de flexión y junta las manos formando un diamante con índices y pulgares.',
      'Mantén el cuerpo completamente recto y firme.',
      'Baja despacio en 3 segundos llevando el pecho hacia el diamante.',
      'Empuja con las palmas y extiende los codos con fuerza en 1 segundo.',
      'Contrae los tríceps arriba y repite.'
    ],
    animationType: 'diamond-push-up'
  },
  {
    id: 'home-air-squat',
    name: 'Sentadilla Aérea (Air Squat)',
    location: 'CASA',
    category: 'Calistenia / Peso Corporal',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Cuádriceps y Glúteos',
    secondaryMuscle: 'Isquiosurales, Gemelos y Core',
    level: 'Principiante a Intermedio',
    machineType: 'Sin equipamiento',
    tempo: '3-1-1 (3s descenso, 1s pausa en el fondo, 1s subida)',
    breathing: 'Inhala al descender enviando aire al abdomen; exhala al levantarte.',
    machineSetup: 'Espacio despejado en casa.',
    setupPosture: 'Pies a la anchura de los hombros con las puntas rotadas 15° hacia afuera. Brazos al frente para equilibrar el centro de gravedad.',
    biomechanicsExplanation: 'Patrón de movimiento funcional básico de triple extensión. La cadera se inicia hacia atrás y abajo al unísono con la flexión de rodillas.',
    cues: [
      'Siéntate en una silla imaginaria hacia atrás',
      'Clava el trípode del pie (talón, dedo gordo y dedo pequeño)',
      'Empuja las rodillas hacia afuera en la misma dirección de las puntas de los pies'
    ],
    eccentricPhase: 'Desciende en 3 segundos hasta que las caderas queden por debajo del nivel de las rodillas (romper la paralela).',
    concentricPhase: 'Empuja desde el centro del pie en 1 segundo apretando los glúteos al llegar arriba.',
    clinicalRisks: 'Levantar los talones del suelo transfiere toda la carga al tendón rotuliano; redondear la espalda baja bajo fatiga genera dolor lumbar.',
    mistakes: [
      'Levantar los talones del piso durante la sentadilla',
      'Permitir que las rodillas se cierren hacia adentro (valgo)',
      'Mirar hacia el suelo encorvando la espalda'
    ],
    steps: [
      'Colócate de pie con los pies al ancho de hombros y brazos al frente.',
      'Inicia el movimiento empujando la cadera hacia atrás y doblando las rodillas.',
      'Baja en 3 segundos hasta romper la paralela con el pecho erguido.',
      'Pausa 1 segundo abajo sin perder tensión muscular.',
      'Empuja con los talones y regresa a la posición inicial extendiendo caderas.'
    ],
    animationType: 'air-squat'
  },
  {
    id: 'home-bulgarian-squat',
    name: 'Sentadilla Búlgara en Silla o Banco',
    location: 'CASA',
    category: 'Calistenia / Unilateral',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Glúteo Mayor y Cuádriceps',
    secondaryMuscle: 'Isquiotibiales, Aductores y Estabilizadores de Cadera',
    level: 'Intermedio a Avanzado',
    machineType: 'Una silla, sofá o banco doméstico estable',
    tempo: '3-0-1 (3s bajada, 0s pausa, 1s empuje)',
    breathing: 'Inhala al descender; exhala al impulsarte hacia arriba.',
    machineSetup: 'Silla firme pegada a la pared para evitar desplazamientos.',
    setupPosture: 'De pie de espaldas a la silla. Apoya el empeine de un pie sobre el asiento. Da un paso largo al frente con la pierna delantera.',
    biomechanicsExplanation: 'Ejercicio unilateral que elimina desequilibrios de fuerza entre ambas piernas. Requiere estabilización del glúteo medio en plano frontal.',
    cues: [
      'Baja la rodilla trasera directamente hacia el suelo',
      'El 90% del peso corporal debe descansar en el talón de la pierna delantera',
      'Inclina levemente el torso hacia adelante si buscas mayor activación de glúteo'
    ],
    eccentricPhase: 'Baja en 3 segundos hasta que la rodilla trasera casi toque el suelo.',
    concentricPhase: 'Empuja con fuerza desde el talón delantero en 1 segundo hasta erguirte.',
    clinicalRisks: 'Colocar el pie delantero muy cerca de la silla genera un ángulo excesivo en la rodilla con tensión patelofemoral desmedida.',
    mistakes: [
      'Dar un paso muy corto provocando dolor de rodilla',
      'Perder el equilibrio por no activar el abdomen',
      'Apoyar el peso en la pierna trasera en vez de la delantera'
    ],
    steps: [
      'Coloca el empeine de una pierna sobre el borde de la silla.',
      'Adelanta la otra pierna a una distancia donde puedas descender cómodamente.',
      'Baja la cadera en 3 segundos hasta que el muslo delantero quede paralelo al suelo.',
      'La rodilla trasera debe quedar a escasos centímetros del piso.',
      'Empuja con el talón delantero y repite antes de cambiar de pierna.'
    ],
    animationType: 'bulgarian-squat'
  },
  {
    id: 'home-chair-dips',
    name: 'Fondos de Tríceps en Silla o Sofá',
    location: 'CASA',
    category: 'Calistenia / Peso Corporal',
    muscleGroup: 'Brazos',
    primaryMuscle: 'Tríceps Braquial',
    secondaryMuscle: 'Deltoides Anterior y Pectoral Menor',
    level: 'Principiante a Intermedio',
    machineType: 'Silla o banco firme',
    tempo: '2-1-2 (2s bajada, 1s pausa, 2s subida)',
    breathing: 'Inhala al flexionar los codos; exhala al extender los brazos.',
    machineSetup: 'Silla bien apoyada.',
    setupPosture: 'Siéntate en el borde, coloca las manos junto a las caderas con los dedos hacia adelante. Desliza los glúteos fuera del asiento con piernas semiflexionadas (o estiradas para mayor dificultad).',
    biomechanicsExplanation: 'Extensión de codo en posición de hiperextensión relativa del húmero.',
    cues: [
      'Mantén la espalda rozando el borde de la silla',
      'Apunta con los codos hacia atrás, nunca hacia los lados',
      'No bajes más allá de los 90° de flexión en los codos'
    ],
    eccentricPhase: 'Desciende en 2 segundos hasta que los codos formen exactamente un ángulo de 90°.',
    concentricPhase: 'Empuja con las palmas en 2 segundos hasta estirar los brazos.',
    clinicalRisks: 'Bajar más de 90° provoca un estiramiento forzado de la cápsula anterior del hombro pudiendo generar bursitis o pinzamiento.',
    mistakes: [
      'Separar la espalda de la silla sobrecargando los hombros',
      'Bajar en exceso dañando la cápsula articular',
      'Encoger los hombros hacia las orejas'
    ],
    steps: [
      'Apoya las manos en el borde de una silla firme con los dedos hacia el frente.',
      'Saca la cadera de la silla manteniendo la espalda muy cerca de ella.',
      'Flexiona los codos hacia atrás en 2 segundos hasta alcanzar 90°.',
      'Pausa 1 segundo y empuja con la fuerza de los tríceps.',
      'Extiende los brazos por completo en la parte alta.'
    ],
    animationType: 'chair-dips'
  },
  {
    id: 'home-glute-bridge',
    name: 'Puente de Glúteos en Suelo',
    location: 'CASA',
    category: 'Calistenia / Cadena Posterior',
    muscleGroup: 'Piernas',
    primaryMuscle: 'Glúteo Mayor',
    secondaryMuscle: 'Isquiosurales y Erectores Espinales',
    level: 'Todos los niveles',
    machineType: 'Esterilla o suelo',
    tempo: '2-2-2 (2s subida, 2s contracción isométrica máxima arriba, 2s bajada)',
    breathing: 'Inhala abajo; exhala al levantar la pelvis y apretar los glúteos.',
    machineSetup: 'Esterilla en suelo firme.',
    setupPosture: 'Tumbado boca arriba con rodillas dobladas y pies apoyados en el suelo a la anchura de caderas. Brazos a los lados del cuerpo.',
    biomechanicsExplanation: 'Extensión pura de cadera sin carga axial en la columna. Ideal para reactivar el glúteo dormido por exceso de sedentarismo.',
    cues: [
      'Empuja con los talones y aprieta los glúteos como si sostuvieras una moneda entre ellos',
      'Haz una retroversión pélvica al subir para no arquear la espalda lumbar',
      'Forma una línea recta diagonal desde las rodillas hasta los hombros'
    ],
    eccentricPhase: 'Baja la cadera en 2 segundos hasta casi rozar el suelo sin apoyar el peso.',
    concentricPhase: 'Eleva la pelvis en 2 segundos y aprieta los glúteos durante 2 segundos completos en la cima.',
    clinicalRisks: 'Hiperextender la espalda baja en lugar de usar los glúteos genera pinzamiento de las facetas articulares lumbares.',
    mistakes: [
      'Arquear la espalda lumbar en vez de extender la cadera',
      'Empujar con las puntas de los pies en vez de los talones',
      'Hacer el ejercicio rápido sin pausar arriba'
    ],
    steps: [
      'Acuéstate boca arriba con las rodillas dobladas y pies planos a la distancia de las caderas.',
      'Apoya los brazos a los lados con las palmas hacia abajo.',
      'Empuja a través de los talones elevando las caderas hacia el techo.',
      'Aprieta los glúteos con fuerza en el punto más alto durante 2 segundos.',
      'Baja con control sin descansar totalmente en el suelo y repite.'
    ],
    animationType: 'glute-bridge'
  },
  {
    id: 'home-plank',
    name: 'Plancha Abdominal Isométrica',
    location: 'CASA',
    category: 'Core Isométrico / Estabilidad',
    muscleGroup: 'Abdomen / Core',
    primaryMuscle: 'Transverso Abdominal y Recto del Abdomen',
    secondaryMuscle: 'Glúteos, Cuádriceps y Deltoides',
    level: 'Todos los niveles',
    machineType: 'Esterilla',
    tempo: 'Isométrico continuo (30s a 60s por serie)',
    breathing: 'Respiración continua, superficial y controlada; jamás contengas la respiración.',
    machineSetup: 'Suelo con colchoneta.',
    setupPosture: 'Apoya antebrazos en el suelo con codos alineados directamente debajo de los hombros. Puntas de los pies en el piso.',
    biomechanicsExplanation: 'Contracción isométrica anti-extensión de la columna lumbar. Fortalece la faja natural protegiendo toda la estructura de la columna vertebral.',
    cues: [
      'Imagina llevar los codos hacia los dedos de los pies (tensión activa)',
      'Aprieta los glúteos y los cuádriceps tan fuerte como puedas',
      'Mira al suelo entre tus antebrazos para mantener el cuello neutral'
    ],
    eccentricPhase: 'Mantén la posición fija resistiendo la gravedad sin dejar caer la cadera ni elevarla.',
    concentricPhase: 'Sostén la tensión máxima durante todo el intervalo fijado.',
    clinicalRisks: 'Dejar caer la pelvis arqueando la zona lumbar (lordosis) causa dolor agudo por compresión facetaria.',
    mistakes: [
      'Hundir la cadera hacia el piso',
      'Elevar los glúteos en forma de pirámide',
      'Mirar al frente tensionando las cervicales'
    ],
    steps: [
      'Apoya los antebrazos con los codos justo bajo los hombros.',
      'Extiende las piernas apoyando las puntas de los pies.',
      'Contrae fuertemente glúteos, abdomen y muslos para formar una tabla recta.',
      'Mantén la vista fija en el suelo y respira rítmicamente durante el tiempo establecido.'
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
    breathing: 'Respiración rítmica coordinada con cada cambio de pierna.',
    machineSetup: 'Espacio despejado en suelo.',
    setupPosture: 'Posición de flexión alta con brazos estirados bajo los hombros y cuerpo en línea recta.',
    biomechanicsExplanation: 'Flexión alterna de cadera a alta velocidad con demanda de estabilización anti-rotacional del core.',
    cues: [
      'Lleva las rodillas al pecho sin rebotar la cadera arriba y abajo',
      'Mantén los hombros fijos sobre las muñecas',
      'No dejes que el pie que avanza toque el suelo'
    ],
    eccentricPhase: 'Regresa la pierna a la posición de plancha de forma inmediata.',
    concentricPhase: 'Lleva la rodilla contraria con velocidad hacia el pecho.',
    clinicalRisks: 'Rebotar la pelvis bruscamente fatiga la musculatura lumbar de manera descontrolada.',
    mistakes: [
      'Subir la cadera al techo como una carpa',
      'Dejar los hombros retrasados respecto a las muñecas',
      'Descuidar la alineación del cuello'
    ],
    steps: [
      'Comienza en plancha alta con los brazos rectos bajo los hombros.',
      'Lleva una rodilla hacia el pecho con potencia.',
      'Regrésala e inmediatamente adelanta la rodilla opuesta.',
      'Alterna con un ritmo fluido y constante simulando una carrera en el suelo.'
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
    secondaryMuscle: 'Recto Abdominal y Flexores de Cadera',
    level: 'Intermedio',
    machineType: 'Esterilla',
    tempo: '2-1-2 (2s rotación por lado, 1s pausa, 2s cambio)',
    breathing: 'Exhala en cada giro hacia la rodilla; inhala en el punto central de transición.',
    machineSetup: 'Esterilla.',
    setupPosture: 'Tumbado boca arriba, manos con dedos rozando suavemente las orejas (sin entrelazar ni tirar del cuello). Piernas a 90° en el aire.',
    biomechanicsExplanation: 'Flexión con rotación del tronco. Según estudios electromiográficos de biomecánica de la Universidad de San Diego, es el ejercicio con mayor activación simultánea de recto y oblicuos.',
    cues: [
      'Lleva el hombro hacia la rodilla contraria (no solo el codo)',
      'Extiende la pierna libre por completo hacia adelante',
      'Gira con el abdomen, no con el cuello'
    ],
    eccentricPhase: 'Regresa al centro de forma pausada.',
    concentricPhase: 'Gira el torso cruzando el codo hacia la rodilla opuesta y aprieta 1 segundo.',
    clinicalRisks: 'Tirar de la nuca con las manos produce tensión y riesgo de lesión cervical.',
    mistakes: [
      'Tirar del cuello con los brazos',
      'Mover las piernas rápido como pedaleo de bicicleta sin rotar el torso',
      'Dejar caer los omóplatos al suelo entre repeticiones'
    ],
    steps: [
      'Túmbate boca arriba con las manos tras las orejas y eleva las piernas flexionadas.',
      'Levanta los hombros del suelo despegando las escápulas.',
      'Lleva el codo derecho hacia la rodilla izquierda mientras estiras la pierna derecha.',
      'Alterna el lado girando desde el torso en un movimiento controlado.',
      'Repite sintiendo la contracción en los laterales del abdomen.'
    ],
    animationType: 'bicycle-crunches'
  },
  {
    id: 'home-burpees',
    name: 'Burpees Completos con Salto',
    location: 'CASA',
    category: 'Metabólico Full Body / Quema Grasa',
    muscleGroup: 'Cardio & Core',
    primaryMuscle: 'Todo el Cuerpo (Pectorales, Piernas, Glúteos y Core)',
    secondaryMuscle: 'Capacidad Cardiorrespiratoria y Potencia',
    level: 'Intermedio a Avanzado',
    machineType: 'Sin equipamiento',
    tempo: 'Explosivo y constante',
    breathing: 'Inhala al descender al suelo; exhala con potencia explosiva al saltar.',
    machineSetup: 'Espacio libre.',
    setupPosture: 'De pie con pies al ancho de hombros.',
    biomechanicsExplanation: 'Movimiento pliométrico y metabólico multiarticular de cuerpo entero que eleva el VO2 máx y la quema de calorías post-ejercicio (EPOC).',
    cues: [
      'Apoya el pecho completo en el suelo sin dejar caer la pelvis bruscamente',
      'Recoge los pies de un salto colocándolos por fuera de las manos',
      'Aterriza suave flexionando las rodillas para amortiguar el impacto'
    ],
    eccentricPhase: 'Baja apoyando manos, lanza pies atrás y deposita el pecho en el piso con control.',
    concentricPhase: 'Empuja el piso, recoge pies y salta verticalmente extendiendo los brazos arriba.',
    clinicalRisks: 'Aterrizar con las piernas rígidas transmite todo el impacto a los meniscos y zona lumbar.',
    mistakes: [
      'Dejar caer la cadera sin control al apoyar el cuerpo',
      'Aterrizar con las rodillas bloqueadas sin amortiguar',
      'No extender la cadera por completo en el salto vertical'
    ],
    steps: [
      'Desde posición de pie, agáchate y apoya las manos firmes en el suelo.',
      'Lanza los pies hacia atrás de un salto quedando en plancha y baja el pecho al suelo.',
      'Empuja con los brazos y recoge los pies de un salto cerca de las manos.',
      'Salta en vertical con los brazos estirados hacia el techo.',
      'Aterriza con suavidad flexionando rodillas e inicia la siguiente repetición.'
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
          { exerciseId: 'gym-incline-chest-press', name: 'Press Inclinado de Pecho en Máquina', sets: '3 series', reps: '10-12 reps', rest: '75s' },
          { exerciseId: 'gym-pec-deck', name: 'Aperturas en Pec Deck / Mariposa', sets: '3 series', reps: '12-15 reps', rest: '60s' },
          { exerciseId: 'gym-shoulder-press', name: 'Press Militar de Hombros en Máquina', sets: '4 series', reps: '10-12 reps', rest: '75s' },
          { exerciseId: 'gym-triceps-pushdown', name: 'Extensión de Tríceps en Polea Alta', sets: '4 series', reps: '12-15 reps', rest: '60s' }
        ]
      },
      {
        day: 'Día 2: Pierna Completa & Máquinas Guiadas',
        exercises: [
          { exerciseId: 'gym-leg-press', name: 'Prensa de Piernas Inclinada a 45°', sets: '4 series', reps: '10-12 reps', rest: '90s' },
          { exerciseId: 'gym-hack-squat', name: 'Sentadilla Hack a 45°', sets: '3 series', reps: '10 reps', rest: '90s' },
          { exerciseId: 'gym-leg-extension', name: 'Extensión de Cuádriceps en Máquina', sets: '4 series', reps: '12-15 reps', rest: '60s' },
          { exerciseId: 'gym-leg-curl', name: 'Curl Femoral Tumbado / Sentado', sets: '4 series', reps: '10-12 reps', rest: '60s' },
          { exerciseId: 'gym-hip-thrust', name: 'Máquina de Hip Thrust / Glute Drive', sets: '3 series', reps: '12 reps', rest: '75s' },
          { exerciseId: 'gym-standing-calf', name: 'Elevación de Talones de Pie en Máquina', sets: '4 series', reps: '15 reps', rest: '45s' }
        ]
      },
      {
        day: 'Día 3: Tracción & Espalda en Poleas',
        exercises: [
          { exerciseId: 'gym-lat-pulldown', name: 'Jalón al Pecho en Polea Alta (Lat Pulldown)', sets: '4 series', reps: '10-12 reps', rest: '75s' },
          { exerciseId: 'gym-seated-cable-row', name: 'Remo Sentado en Polea Baja', sets: '4 series', reps: '10-12 reps', rest: '75s' },
          { exerciseId: 'gym-tbar-row', name: 'Remo en Máquina T-Bar con Apoyo Pectoral', sets: '3 series', reps: '10-12 reps', rest: '75s' },
          { exerciseId: 'gym-preacher-curl', name: 'Curl de Bíceps en Banco Scott / Predicador', sets: '4 series', reps: '12 reps', rest: '60s' },
          { exerciseId: 'gym-seated-abs-machine', name: 'Máquina de Crunch Abdominal Sentado', sets: '4 series', reps: '15 reps', rest: '45s' }
        ]
      },
      {
        day: 'Día 4: Torso Completo & Definición',
        exercises: [
          { exerciseId: 'gym-cable-crossover', name: 'Cruces en Polea Doble', sets: '3 series', reps: '12-15 reps', rest: '60s' },
          { exerciseId: 'gym-lateral-raise-machine', name: 'Elevaciones Laterales en Máquina', sets: '4 series', reps: '15 reps', rest: '45s' },
          { exerciseId: 'gym-rear-delt-fly', name: 'Pájaros / Deltoides Posterior en Pec Deck', sets: '3 series', reps: '15 reps', rest: '45s' },
          { exerciseId: 'gym-seated-dip-machine', name: 'Máquina de Fondos de Tríceps', sets: '3 series', reps: '12 reps', rest: '60s' },
          { exerciseId: 'gym-hyperextension', name: 'Banco de Hiperextensiones Lumbar', sets: '3 series', reps: '15 reps', rest: '45s' }
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
