export interface ExpertResponses {
  agro: string;
  tech: string;
  lab: string;
  master: string;
}

export interface OfflineTopic {
  title: string;
  category: string;
  stage: string;
  experts: ExpertResponses;
  protocol: string[];
  keywords: string[];
}

export const OFFLINE_DB: OfflineTopic[] = [
  {
    title: "Grados Brix y Cosecha de Agave (Jima)",
    category: "Control de Calidad",
    stage: "Jima",
    experts: {
      agro: "La Jima óptima requiere piñas de agave azul Tequilana Weber maduraciones de por lo menos 6 a 8 años, logrando un mínimo de 24° a 30° Brix para maximizar la fermentabilidad del mosto. Evite recolectar agaves sumamente jóvenes o tiernos (conocidos como 'tiernos'), ya que contienen baja inulina libre.",
      tech: "Se debe registrar minuciosamente el peso promedio de la piña jada llegada a báscula para parametrizar la eficiencia del tatemado. Es prioritario cortar a ras las pencas usando una coa bien afilada para prevenir el exceso de clorofila y ceras indeseables en el proceso de extracción posterior.",
      lab: "Utilice refractómetros ópticos calibrados a temperatura estandarizada (compensación de 20°C). Se debe realizar la medición de azúcares reductores directos (ARD) tras hidrólisis completa para comprobar el potencial alcohólico teórico del lote de piñas.",
      master: "La madurez biológica otorga al tequila final ese perfume característico a mieles de agave cocido de gran peso, sutiles toques cítricos y florales. Un agave tierno produce alcoholes ásperos y un sabor amargo-herbal tipo aserrín verde que deprecia las cualidades de la botella."
    },
    protocol: [
      "Analice aleatoriamente 10 plantas de cada hilera en campo antes de coordinar la cuadrilla de Jima, usando refractómetros mecánicos portátiles en rodajas transversales.",
      "Asegúrese que la piña muestre el clásico color amarillento-rojizo del centro ('sazón') que denota la plena concentración de fructosas.",
      "Exija a los jimadores un corte limpio de pencas rasurando bien la cabeza del agave, eliminando el cogollo central verde para mitigar astringencias metálicas.",
      "Evite el contacto prolongado de las piñas con lodo e instrumentación sucia, transportándolas a fábrica en un máximo de 24 horas para prevenir sobrefermentación ácida."
    ],
    keywords: ["brix", "azúcar", "azucar", "madurez", "maduro", "jima", "cosecha", "sacarosa", "calidad", "recolección", "dulces", "piña", "piñas", "coa", "jimador", "sazón", "tierno"]
  },
  {
    title: "Control de Plagas en Campo: Picudo y Pudrición de Cogollo",
    category: "Sanidad de Cultivo",
    stage: "Campo",
    experts: {
      agro: "El principal enemigo es el picudo del agave (Scyphophorus acupunctatus), cuyas larvas perforan y pudren la yema apical ('cogollo'). Su control descansa en trampas de feromonas estratégicas asociadas con hongos entomopatógenos como Beauveria bassiana.",
      tech: "Realice inspecciones oculares diarias en las cuadrículas agrícolas. Todo agave seco o con goteo gomoso oscuro de base debe ser desenterrado, troceado y quemado localmente para bloquear que los insectos migren hacia el resto de la plantación.",
      lab: "Extraiga muestras fitopatológicas de tejidos para descartar pudrición blanda bacteriana causada por Erwinia carotovora y hongos agresivos como Ceratocystis y Fusarium, los cuales degradan prematuramente los azúcares funcionales del agave.",
      master: "El agave podrido transmite aromas muy desagradables de humedades fétidas, moho y azufres en la fermentación que la destilación clásica no logra depurar. Nunca permita que piñas enfermas ingresen al horno o autoclave; la calidad inicia en el campo."
    },
    protocol: [
      "Instale un sistema perimetral de trampas de feromonas (4 por hectárea) con atrayente y veneno selectivo biodegradable, revisándolas y limpiándolas rigurosamente cada 7 días.",
      "Ante detección de exudaciones oscuras en pencas, aísle la planta y aplique tratamientos focalizados autorizados por el CRT y el organismo de inocuidad nacional.",
      "Incorpore materia orgánica sana y bacterias protectoras de raíz para activar el sistema inmunológico del ágave Tequilana Weber contra pudriciones invernales.",
      "Instruya al equipo técnico agrícola para desinfectar las coas e implementaciones de corte con alcohol isopropílico antes de pasar de una hilera a la siguiente."
    ],
    keywords: ["picudo", "plaga", "insecto", "enfermedad", "pudrición", "pudricion", "cogollo", "hongo", "bacterias", "marchitamiento", "infección", "gusanillo", "bicho", "plagas", "erwinia", "fusarium"]
  },
  {
    title: "Tatemado de Piñas y Optimización Térmica (Cocción)",
    category: "Procesamiento Industrial",
    stage: "Cocción",
    experts: {
      agro: "El contenido óptimo de humedad y la densidad de las piñas determinan el tiempo necesario de hidrólisis; agaves cultivados en tierras altas suelen tener fibras más gruesas y necesitan mayor penetración de calor.",
      tech: "En horno tradicional de mampostería colocamos las piñas más colosales en la parte inferior, donde el flujo directo de vapor es vigoroso. Se requiere una cocción lenta a 90°C por 36-48 horas. En autoclave de acero el ritmo sube a 1.2 bar por 12-18 horas, agilizando el flujo operativo industrial.",
      lab: "Monitoreamos la degradación enzimática indirecta mediante cromatografía de líquidos HPLC. Controlamos meticulosamente el parámetro de furfural, un subproducto del sobrecocimiento que no debe rebasar 4 mg/100 ml de alcohol al 40% Alc. Vol.",
      master: "La cocción lenta en horno de piedra de ladrillo carameliza cariñosamente las inulinas generando notas espectaculares de canela, pimienta, clavo y calabaza en tacha. El autoclave, si bien es eficiente, puede generar ligeras notas ácidas si no se realiza un purgado estricto del condensado."
    },
    protocol: [
      "Realice un purgado de condensados amargos y humos durante las primeras 2 a 3 horas de inyección inicial de vapor; esto ayuda a arrastrar ceras externas nocivas.",
      "Eleve gradualmente el vapor hasta lograr una isoterma de 95°C para una cocción suave en horno tradicional, o mantenga 121°C en autoclave industrial de alta presión.",
      "Efectúe una evaluación organoléptica manual tomando muestras del centro de una piña cocida al finalizar el ciclo: debe verse marrón oscuro, fibroso y dulce almibarado.",
      "Deje reposar las piñas cocidas durante mínimo 12 horas en enfriamiento controlado para que las mieles excedentes drenen y se estabilicen antes de molienda."
    ],
    keywords: ["tatemado", "cocción", "coccion", "horno", "hornos", "autoclave", "autoclaves", "vapor", "inulina", "caramelo", "sobrecocimiento", "quemado", "mampostería", "mamposteria", "cocer", "horneado", "calor", "hidrólisis"]
  },
  {
    title: "Molienda y Extracción de Jugos de Agave",
    category: "Procesamiento Industrial",
    stage: "Extracción",
    experts: {
      agro: "La calidad de las fibras del agave determina la resistencia a la abrasión mecánica; piñas sanas liberan jugos concentrados con menor presión, reduciendo el riesgo de rasgar hilos celulares.",
      tech: "La tahona de piedra aplasta de forma amorfa y pausada las fibras, preservando la riqueza mineral y proteica que la levadura consumirá con alegría. El tren de molinos y deshebradoras modernas es formidablemente eficiente, pero un exceso de fuerza extrae compuestos tánicos amargos de la madera celular del agave verde.",
      lab: "Analice el bagazo remanente de manera continua. El porcentaje de azúcares reductores residuales en la fibra exprimida debe ser estrictamente menor al 2% para evaluar el proceso como rentable y eficiente.",
      master: "La molienda pesada moderna en molinos metálicos genera mostos sumamente limpios y estériles, pero la tahona ancestral aporta una textural, untuosidad y rusticidad inigualables. El uso directo de bagazo en fermentación confiere una robustez aromática salvaje maravillosa."
    },
    protocol: [
      "Aplique un lavado con agua desmineralizada a contracorriente en forma de lluvia fina sobre el bagazo saliente para arrastrar azúcares dulces atrapados en hilos de fibra.",
      "Ejecute un protocolo de desinfección química alimentaria diario del área de molienda usando aspersión de agua caliente a alta presión para ahuyentar moscas y bacterias del vinagre.",
      "Calibre mecánicamente la separación de los rodillos extractores semanalmente para esquivar desgastes inútiles por piñas de dimensiones colosales.",
      "Recicle la fibra excedente (bagazo) en pilas de compostaje con estiércol y lodos de vinaza para reintegrarlos a los suelos agrícolas de la marca como abono orgánico."
    ],
    keywords: ["tahona", "molienda", "moliendo", "molino", "molinos", "extracción", "extraccion", "jugo", "bagazo", "fibra", "piedra", "rodillos", "difusor", "exprimir", "prensado", "fibras"]
  },
  {
    title: "Fermentación, Control de Levaduras y Paros de Tinas",
    category: "Microbiología y Biotecnología",
    stage: "Fermentación",
    experts: {
      agro: "Las levaduras de la superficie del agave (como Hanseniaspora y Saccharomyces silvestres) varían sustancialmente según los cultivos aledaños y el microclima de cada predio rural mexicano.",
      tech: "Monitoree la cinética diaria. Mantenga el control absoluto de las camisas de enfriamiento en tina entre 28°C y 32°C. Altas temperaturas provocan que la levadura sufra estrés por etanol acumulado y detenga el metabolismo prematuramente.",
      lab: "Efectúe tinciones con azul de metileno bajo microscopio portátil para vigilar la viabilidad celular bacteriana, controlando que se posicione por encima del 80%. Mida la acidez volátil; valores de ácido acético superiores a 1.2 g/l señalan infección bacteriana severa.",
      master: "Si observa tinas desinfladas o sin burbujeo vivaz en plena fermentación, actúe de inmediato. Los paros de tinas estresan el mosto y producen alcoholes amilicos pesados que arruinan la delicadeza organoléptica del destilado."
    },
    protocol: [
      "Mida los grados Brix y densidad del mosto líquido cada 4-6 horas utilizando densitómetros mecánicos calibrados.",
      "Si la fermentación se aletarga, verifique el pH (que debe ubicarse idealmente estable entre 4.0 y 5.0) para comprobar que no existan contaminaciones de bacterias lácticas.",
      "Inocule nutrientes solubles adicionales como urea o fosfato de amonio si el mosto está falto de nitrógeno asimilable por levadura.",
      "En caso de muerte térmica de levaduras, enfríe el tanque inmediatamente a 28°C e inocule un cultivo de refuerzo Saccharomyces cerevisiae adaptado a concentraciones medias-altas de alcohol."
    ],
    keywords: ["levadura", "fermentación", "fermentacion", "paro", "stuck", "tinas", "mosto", "temperatura", "yeast", "nutrientes", "burbujeo", "bacterias", "alcohol", "azúcares", "tina", "inoculación", "levaduras", "acidez"]
  },
  {
    title: "Destilación: Cortes de Cabezas y Colas y Mitigación de Metanol",
    category: "Destilación y Purificación",
    stage: "Destilación",
    experts: {
      agro: "La calidad de la filtración en extracción aminora el contenido de pectinas solubles de la planta, las cuales son precursoras directas del molesto metanol que se busca evitar.",
      tech: "Durante la segunda destilación ('rectificación') efectuada en alambique de cobre tradicional, se hace el descarte del primer 2-3% de la corriente destilada ('cabezas') y se corta el flujo de 'corazón' cuando los grados alcohólicos caen de 35% ABV para evitar recolectar 'colas'.",
      lab: "Utilice cromatógrafos de gases para certificar las normas de pureza. El metanol debe permanecer acotado entre 30 y 300 mg por cada 100 ml de alcohol anhidro para cumplir con rigor con la NOM-006-SCFI nacional.",
      master: "Las cabezas contienen acetona y acetaldehídos que queman la nariz con notas de barniz de uñas. Las colas traen aceites fusel sumamente pesados con olor a perro mojado y cartón viejo. El 'corazón' de la destilación debe brillar cristalino, untuoso y con un balance sedoso idóneo."
    },
    protocol: [
      "Limpie con vapor caliente o solución ácida suave el alambique de cobre antes de verter el ordinario (primer destilado) para remover sales nocivas de cobre.",
      "Controle el flujo de fuego o vapor en la camisa del alambique de forma pausada; una destilación lenta genera una mejor separación fraccional de metilicos.",
      "Separe las fracciones basándose firmemente tanto en lecturas del termómetro en copa del alambique (78.4°C para etanol) como en el alcoholímetro dinámico de campana.",
      "Almacene el corazón destilado resultante (usualmente entre 45% y 55% Alc. Vol.) en tanques cerrados de acero inoxidable de grado alimentario."
    ],
    keywords: ["metanol", "destilación", "destilacion", "cabeza", "colas", "cabezas", "cola", "alambique", "cobre", "rectificación", "rectificacion", "alcohol", "corazón", "corazon", "corte", "purificar", "destilar", "destilado"]
  },
  {
    title: "Añejamiento, Barricas y Control de la Oxidación (Maduración)",
    category: "Maduración y Crianza",
    stage: "Maduración",
    experts: {
      agro: "Un agave cultivado en valles cálidos posee microelementos que interactúan de forma particular con los taninos naturales expulsados por la madera de encino.",
      tech: "Utilice barricas de roble blanco americano o encino francés de 200 litros con diferentes niveles de tostado interno. Establezca la temperatura del almacén de crianza entre 18°C y 22°C, con humedad de 65-70% para mitigar la merma ('angel's share' acumulativo de hasta 4% anual).",
      lab: "Efectúe análisis de absorbancia lumínica para supervisar el crecimiento de compuestos fenólicos, taninos libres y vanilinas naturales absorbidos progresivamente del leño.",
      master: "El Reposado (de 2 a 12 meses) suaviza el carácter bravío del tequila blanco aportando mantequillas y madera sutil. El Añejo (1 a 3 años) y Extra Añejo (más de 3 años) son obras de arte que añaden notas a tabaco, frutos secos, caramelo quemado y un final amaderado seco y majestuoso."
    },
    protocol: [
      "Lave e hidrate ligeramente barricas nuevas antes de llenarlas por primera vez para cerrar poros y remover excesos de taninos astringentes superficiales.",
      "Registre con sellos indelebles las fechas de llenado y número de barrica en un libro de control regulado para futuras visitas de inspectores autorizados del CRT.",
      "Monitoree periódicamente el volumen y la graduación del alcohol; un clima seco evapora agua incrementando la graduación del destilado madurado.",
      "Antes de vaciar las barricas para su ensamblaje final, use filtración por gravedad fina para remover micropartículas de carbón suelto."
    ],
    keywords: ["barrica", "barricas", "añejamiento", "añejo", "reposado", "madurez", "roble", "madera", "evaporación", "maderas", "tostado", "aroma", "vaciado", "tiempo", "maduración", "crianza", "madurar"]
  },
  {
    title: "Agua de Dilución, Estabilización por Frío y Embotellado",
    category: "Terminado de Producto",
    stage: "Embotellado",
    experts: {
      agro: "Los minerales aportados por el agua del manto acuífero de origen volcánico añaden notas rústicas particulares que identifican terruños auténticos.",
      tech: "El tequila se diluye de su graduación de alambique a graduación comercial (regularmente 38% a 40% Alc. Vol.) con agua desmineralizada por ósmosis inversa. El tequila puede registrar turbidez si hay precipitados salinos metálicos; se resuelve mediante filtrado prensa frío.",
      lab: "Verifique dureza de agua purificada de mezcla (debe estar en 0 ppm). Vigile que no existan microtrazas de hierro que puedan oxidar y oscurecer el tono del tequila, o calcio que genere precipitados en botella.",
      master: "El agua es el ingrediente invisible de mayor peso. El agua para dilución debe estar completamente despojada de cloro y sales pesadas. Un agua inadecuada arruina el brillo del tequila de forma drástica orillando a un producto opaco."
    },
    protocol: [
      "Procese el agua de pozo industrial a través de un tren completo de filtro de carbón activo de lecho profundo, suavizador de resina y ósmosis inversa selectiva.",
      "Vierta el agua purificada de forma lenta y con agitación mecánica suave sobre el tanque de tequila concentrado para no estresar los aceites de agave integrados.",
      "Enfríe obligatoriamente la mezcla a -3°C durante 24 horas continuas para estabilizar los compuestos y forzar la precipitación de ceras lípidas solubles antes de filtrar.",
      "Haga un pase final por filtro de placas de celulosa fina de 1-3 micras directamente conectado a la tolva sellada de la máquina embotelladora automática."
    ],
    keywords: ["agua", "dilución", "dilucion", "turbidez", "filtración", "filtracion", "suciedad", "sarro", "precipitado", "embotellado", "embotellar", "minerales", "ósmosis", "graduación", "alcoholímetro", "dureza", "cristalino", "filtro"]
  },
  {
    title: "Cumplimiento de la Normativa NOM-006-SCFI del Tequila",
    category: "Regulaciones y Legalidad",
    stage: "Embotellado",
    experts: {
      agro: "Todo predio destinado al cultivo de agave tequilero debe ser registrado de forma obligatoria ante el Consejo Regulador del Tequila (CRT) dentro de su primer año de plantación.",
      tech: "Se debe contar con bitácora foliada del movimiento de piñas y mantener en áreas visibles los certificados de autenticidad del destilado emitidos por el organismo supervisor.",
      lab: "Analice periódicamente parámetros mínimos regulatorios: Ésteres (2 a 250 mg), Alcoholes Superiores (120 a 500 mg) y Aldehídos (0 a 40 mg) por cada 100 ml de alcohol anhidro.",
      master: "La denominación de origen Tequila es un patrimonio sagrado. Cumplir con la NOM-006-SCFI garantiza que cada sorbo en el extranjero representa estrictamente el suelo y el arduo trabajo de nuestras manos libres."
    },
    protocol: [
      "Solicite la inspección oportuna de piñas cosechadas del CRT antes de comenzar el proceso de descargas de camión en molienda.",
      "Mantenga el porcentaje de azúcares de agave azul en al menos 51% para tequila mixto, o 100% puro de agave para tequila premium certificado.",
      "Imprima en las etiquetas comerciales oficiales el número de NOM del fabricante y el estatus holográfico que valida el lote auditado.",
      "Garantice que el envasado final se realice en la planta autorizada de origen que ostente los registros sanitarios correspondientes para exportación."
    ],
    keywords: ["nom", "nom-006-scfi", "crt", "norma", "consejo regulador", "denominación de origen", "denominacion", "regulación", "regulacion", "ley", "legal", "permiso", "certificado", "inspección", "inspeccion", "etiqueta", "requisitos"]
  }
];

export function findOfflineResponse(query: string, activeStage: string): OfflineTopic | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  // First, search for records that strictly match keywords and are in the ACTIVE stage
  const stageFiltered = OFFLINE_DB.filter(topic => topic.stage.toLowerCase() === activeStage.toLowerCase());
  for (const topic of stageFiltered) {
    if (topic.keywords.some(kw => normalizedQuery.includes(kw))) {
      return topic;
    }
  }
  
  // Second, search in the whole database if no match was found in the active stage
  for (const topic of OFFLINE_DB) {
    if (topic.keywords.some(kw => normalizedQuery.includes(kw))) {
      return topic;
    }
  }
  
  return null;
}
