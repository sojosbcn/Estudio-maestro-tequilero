export interface NomItemParameter {
  name: string;
  value: string;
  description: string;
}

export interface NomItem {
  id: string;
  standard: string;
  clause: string;
  title: string;
  stage: 'Campo' | 'Jima' | 'Cocción' | 'Extracción' | 'Fermentación' | 'Destilación' | 'Maduración' | 'Embotellado';
  description: string;
  requirements: string[];
  parameters: NomItemParameter[];
  sanctions: string;
  criticality: 'Crítico' | 'Alto' | 'Moderado';
}

export const NOM_DATABASE: NomItem[] = [
  {
    id: "nom006_sec51",
    standard: "NOM-006-SCFI-2012",
    clause: "5.1.1",
    title: "Origen de Materia Prima y Registro de Predios",
    stage: "Campo",
    description: "Establece los requisitos obligatorios de origen biológico y geográfico para el agave. Toda piña procesada debe provenir única y exclusivamente de la especie 'Agave tequilana Weber variedad azul', registrada en el padrón nacional.",
    requirements: [
      "Inscripción obligatoria del predio agrícola ante el Consejo Regulador del Tequila (CRT) dentro del primer año de plantación.",
      "El predio agrícola debe estar ubicado dentro de los territorios geográficos declarados bajo la Denominación de Origen Tequila (DOT).",
      "Prohibición absoluta de introducir hijuelos de variedades no autorizadas (como Agave angustifolia o Agave salmiana) en la misma parcela de cultivo."
    ],
    parameters: [
      { name: "Especie Biológica", value: "Agave tequilana Weber variedad azul", description: "Única especie admitida bajo la denominación de origen." },
      { name: "Ubicación del Predio", value: "Zona DOT (Jalisco, Nayarit, Michoacán, Guanajuato y Tamaulipas)", description: "Municipios designados por la ley federal." },
      { name: "Plazo de Registro", value: "Primer año de plantación", description: "Límite máximo para registrar hijuelos ante inspectores del CRT." }
    ],
    sanctions: "Pérdida inmediata de los derechos de certificación del lote de agave. Imposibilidad de ostentar la marca Tequila en el producto final.",
    criticality: "Crítico"
  },
  {
    id: "nom006_sec512",
    standard: "NOM-006-SCFI-2012",
    clause: "5.1.2",
    title: "Maduración y Concentración Mínima en Jima",
    stage: "Jima",
    description: "Determina las condiciones técnicas que deben cumplir las cabezas de agave al momento de la jima para garantizar que la acumulación de azúcares y fructosas de la inulina sea óptima para la fermentación.",
    requirements: [
      "Las piñas de agave deben cosecharse en su etapa de madurez fisiológica (presencia visual del 'sazón' o amarillamiento central).",
      "Medición de los grados Brix del jugo obtenido por prensado o muestreo de rodajas.",
      "Acreditación de guías de tránsito de agave expedidas por el CRT con firmas certificadas de jimadores asignados."
    ],
    parameters: [
      { name: "Grados Brix Mínimos", value: "24° Bx a 30° Bx", description: "Rango óptimo para maximizar el potencial de azúcares reductores directos (ARD)." },
      { name: "Edad de Cosecha Sugerida", value: "6 a 8 años", description: "Periodo necesario de ciclo biológico para que la inulina se sintetice de manera natural." },
      { name: "Corte de Pencas ('Rasurado')", value: "Fracción de penca menor a 2 cm", description: "Evita transferir compuestos clorofílicos amargos y ceras indeseables en la molienda." }
    ],
    sanctions: "Rechazo del cargamento de agave en la báscula de la fábrica. Multas corporativas por trasporte de piñas inmaduras sin sello holográfico.",
    criticality: "Alto"
  },
  {
    id: "nom006_sec52",
    standard: "NOM-006-SCFI-2012",
    clause: "5.2",
    title: "Clasificación por Categorías (Tequila vs 100% Agave)",
    stage: "Fermentación",
    description: "Establece las dos categorías oficiales de Tequila basadas en la procedencia de los azúcares que son sometidos al proceso de fermentación anaeróbica.",
    requirements: [
      "Para la categoría '100% de Agave' no se permite la adición de azúcares de ninguna otra fuente secundaria.",
      "Para la categoría 'Tequila' se permite mezclar hasta un 49% de jugos provenientes de otras fuentes (como azúcar de caña o piloncillo) con un 51% mínimo de azúcares de Agave tequilana Weber azul.",
      "Las tinas de fermentación para ambas categorías deben estar físicamente separadas y debidamente identificadas para evitar contaminación cruzada."
    ],
    parameters: [
      { name: "Proporción Mínima de Agave (Tequila Mixto)", value: "51% de azúcares del agave", description: "Restante 49% puede ser azúcar exógena apta para consumo humano." },
      { name: "Proporción 100% Agave", value: "100% azúcares de Agave tequilana", description: "Debe embotellarse directamente en la planta de origen oficial dentro de la zona DOT." },
      { name: "Pureza de Levadura", value: "Monitoreo bacteriano", description: "Ausencia de saborizantes químicos sintéticos añadidos durante el burbujeo." }
    ],
    sanctions: "Degradación administrativa de la categoría del producto (de un histórico '100% Agave' a simple 'Tequila mixtificado'). Clausura de las tinas infractoras.",
    criticality: "Crítico"
  },
  {
    id: "nom006_sec53",
    standard: "NOM-006-SCFI-2012",
    clause: "5.3",
    title: "Clasificación por Clases y Parámetros de Maduración",
    stage: "Maduración",
    description: "Norma el tiempo mínimo de reposo en recipientes de madera y las barricas admitidas para clasificar y etiquetar legalmente las cinco clases de tequila.",
    requirements: [
      "Tequila Blanco: Sin paso por madera, o madurado por menos de 2 meses en tanques de acero o roble.",
      "Tequila Reposado: Debe madurarse en recipientes de madera de roble o encino durante un tiempo mínimo de 2 meses consecutivos.",
      "Tequila Añejo: Debe madurarse en barricas de roble o encino con capacidad máxima de 600 litros durante un proceso mínimo de 1 año ininterrumpido.",
      "Tequila Extra Añejo: Periodo mínimo de maduración de 3 años continuos en barricas de roble de máximo 600 litros de capacidad."
    ],
    parameters: [
      { name: "Tiempo Mínimo Reposado", value: "2 meses", description: "Maduración obligatoria en tinas o barricas grandes de madera." },
      { name: "Tiempo Mínimo Añejo", value: "12 meses (1 año)", description: "Crianza en barricas selladas con capacidad máxima de 600 L." },
      { name: "Tiempo Mínimo Extra Añejo", value: "36 meses (3 años)", description: "Crianza prolongada que requiere control estricto de evaporación (Angel's Share)." }
    ],
    sanctions: "Pérdida del derecho a ostentar el sello de añejamiento en la etiqueta frontal comercial. Decomiso de las barricas sospechosas por inspectores gubernamentales.",
    criticality: "Crítico"
  },
  {
    id: "nom006_sec61",
    standard: "NOM-006-SCFI-2012",
    clause: "6.1.1",
    title: "Límites Sanitarios y Fisicoquímicos (Metanol, Aldehídos y Ésteres)",
    stage: "Destilación",
    description: "Determina las concentraciones fisicoquímicas máximas y mínimas que debe tener el Tequila rectificado en alambique para ser apto para el consumo humano y portar el certificado de calidad.",
    requirements: [
      "El destilado debe regularse con cortes precisos de cabezas y colas para aislar los compuestos amílicos y metílicos pesados.",
      "Los equipos analíticos de cromatografía de gases deben estar vigentes y calibrados bajo el estándar oficial de laboratorio autorizado."
    ],
    parameters: [
      { name: "Límite de Metanol", value: "30 a 300 mg / 100 ml de alcohol anhidro", description: "Parámetro crítico para prevenir la toxicidad humana originada en la degradación de pectinas." },
      { name: "Alcoholes Superiores", value: "120 a 500 mg / 100 ml de alcohol anhidro", description: "Aceites de fusel (isobutanol, propanol) determinantes del perfil organoléptico aromático." },
      { name: "Ésteres (Acetato de Etilo)", value: "2.0 a 250 mg / 100 ml de alcohol anhidro", description: "Aportes frutales formados durante la fermentación vigentes tras destilar." },
      { name: "Aldehídos (Acetaldehído)", value: "0 a 40 mg / 100 ml de alcohol anhidro", description: "Indicador de oxidación o descarte inadecuado de cabezas irritantes." }
    ],
    sanctions: "Destrucción total o destilación correctiva forzada de todo el lote de destilado. Clausura temporal de las columnas o alambiques asociados.",
    criticality: "Crítico"
  },
  {
    id: "nom142_sec5",
    standard: "NOM-142-SSA1/SCFI-2014",
    clause: "5.1",
    title: "Especificaciones de Metales Pesados y Edulcorantes Prohibidos",
    stage: "Fermentación",
    description: "Normativa sanitaria general que prohíbe el uso de edulcorantes artificiales no calóricos y rige los límites máximos tolerables de metales pesados en bebidas alcohólicas maduradas.",
    requirements: [
      "Prohibición absoluta de añadir aspartamo, sacarina o sucralosa en las tinas de fermentación o posterior a la molienda del agave.",
      "Las soldaduras y uniones de recipientes de acero no deben transferir plomo o arsénico al mosto en estado ácido."
    ],
    parameters: [
      { name: "Límite Máximo de Plomo", value: "0.5 mg / Litro", description: "Evita la acumulación de plomo hepatotóxico en el consumidor de tequila." },
      { name: "Límite Máximo de Arsénico", value: "0.5 mg / Litro", description: "Estándar de inocuidad para arrastres minerales pesados de subsuelo." },
      { name: "Edulcorantes Químicos", value: "0% Tolerado (Nulo)", description: "Salvaguarda de la pureza metabólica de levadura." }
    ],
    sanctions: "Alerta sanitaria nacional. Retiro obligatorio del lote completo de botellas de los estantes comerciales e imposición de multas pecuniarias elevadas.",
    criticality: "Crítico"
  },
  {
    id: "nom142_sec9",
    standard: "NOM-142-SSA1/SCFI-2014",
    clause: "9.2",
    title: "Etiquetado Sanitario Compulsorio y Advertencias de Salud",
    stage: "Embotellado",
    description: "Determina las leyendas obligatorias de peligro sanitario y los pictogramas reglamentarios de advertencia que deben ostentar todos los envases de tequila destinados a venta final.",
    requirements: [
      "Colocación prioritaria de la leyenda clásica sanitaria oficial en letras legibles con alto contraste visual.",
      "Incorporación de tres pictogramas oficiales de restricción: No conducir bajo efectos de alcohol, Prohibido para menores de edad, Prohibido su consumo por mujeres en gestación."
    ],
    parameters: [
      { name: "Leyenda Sanitaria", value: "'EL ABUSO EN EL CONSUMO DE ESTE PRODUCTO ES NOCIVO PARA LA SALUD'", description: "Texto rígido obligatorio impreso de forma destacada." },
      { name: "Tamaño Mínimo Pictogramas", value: "Diámetro no menor a 5 mm", description: "Dimensión regulatoria para asegurar la visibilidad en cuellos de botella y contraetiquetas." }
    ],
    sanctions: "Rechazo del lote de envasado y retención del cargamento en las aduanas de exportación internacional.",
    criticality: "Alto"
  },
  {
    id: "nom251_sec51",
    standard: "NOM-251-SSA1-2009",
    clause: "5.1",
    title: "Sanitización de Equipos Industriales y Grado Alimenticio",
    stage: "Cocción",
    description: "Instruye el uso prioritario de materiales no porosos y de fácil limpieza en hornos de mampostería, autoclaves metálicos y ductos de trasvasado de mieles.",
    requirements: [
      "Todos los ductos que conduzcan jugos calientes o mieles de agave deben ser de acero inoxidable grado alimenticio AISI 304 o superior.",
      "El vapor directo inyectado dentro del horno o autoclave para el tatemado debe estar libre de aditivos químicos desincrustantes industriales corrosivos."
    ],
    parameters: [
      { name: "Aleación de Contacto", value: "Acero Inoxidable AISI 304 / 316", description: "Previene la corrosión reactiva ocasionada por los ácidos orgánicos del agave." },
      { name: "Control de Condensados", value: "Derrame aislado exterior", description: "Evita el retorno de ceras quemadas amargas de desecho." }
    ],
    sanctions: "Apercibimiento formal de Cofepris. Suspensión de actividades operativas en el área de cocción y molienda industrial.",
    criticality: "Moderado"
  },
  {
    id: "nom251_sec56",
    standard: "NOM-251-SSA1-2009",
    clause: "5.6",
    title: "Inocuidad y Filtro de Agua de Dilución Comercial",
    stage: "Embotellado",
    description: "Normativa de higiene para el tratamiento y filtración de aguas destinadas a regular los grados de volumen alcohólico del destilado concentrado antes del llenado comercial de botellas.",
    requirements: [
      "El agua para dilución debe transitar por un tren completo de filtrado de lecho profundo, suavizador de resinas catiónicas y ósmosis inversa selectiva.",
      "Vigilancia rigurosa frente a trazas minerales como hierro o calcio que alteren la transparencia física original del tequila."
    ],
    parameters: [
      { name: "Dureza de Mezcla", value: "0 ppm a 5 ppm (Bajo)", description: "Controla que no existan incrustaciones de cal que enturbien la solución alcohólica." },
      { name: "Presencia de Cloro Libre", value: "0.1 ppm como límite máximo", description: "Evita que subproductos clorados alteren el sabor herbal del tequila refinado." },
      { name: "Filtración Física", value: "Filtro prensa o cartuchos de 1 micra o menor", description: "Garantiza la retención de ceras del agave que precipitan con la dilución en frío." }
    ],
    sanctions: "Retención del lote en cuarentena por aparición de turbidez blanca indeseable o sedimentos calcáreos visibles en botella.",
    criticality: "Alto"
  }
];
