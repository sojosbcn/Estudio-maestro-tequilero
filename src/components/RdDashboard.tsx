import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Coins, 
  Layers, 
  Award, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Filter, 
  Sparkles, 
  Database, 
  Trash2, 
  PlusCircle,
  Eye,
  BarChart2,
  PieChart as PieIcon,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export const SEED_RD_IDEAS = [
  {
    category: "Innovación Química/Destilación",
    ideaTitle: "Tequila Ancestral Tatemado en Mezquite",
    concept: "Cocer cabezas de agave azul en horno de tierra con leña de mezquite silvestre y hojas de higuera, destilando en alambiques de cobre pequeños con arrastre de vapor de romero fresco.",
    specialists: {
      alchemist: "La cocción lenta aporta fenoles ahumados muy pronunciados, equilibrando las notas florales del romero. El arrastre de vapor preserva los terpenos del agave.",
      conceptual: "Atractivo directo para coleccionistas de mezcal y tequila artesanal. Botella negra soplada a mano con sello de cera de abeja natural.",
      visionary: "Costo de producción alto (+45% por cocción en foso). Margen excelente al posicionarlo como edición de culto a USD $150 la botella."
    },
    feasibilityScore: {
      technical: 85,
      commercial: 92,
      cost: "Alto"
    },
    verdict: "Idea altamente viable y comercialmente explosiva. Se recomienda iniciar lote de pruebas de 500 litros en destilería boutique."
  },
  {
    category: "Edición Limitada",
    ideaTitle: "Reposado en Barricas de Vino de Hielo",
    concept: "Repasar tequila blanco premium durante 6 meses en barricas que contuvieron vino de hielo canadiense (Icewine) de uva Vidal, aportando notas frutales y acidez sutil.",
    specialists: {
      alchemist: "La acidez residual del icewine complementa los azúcares naturales del agave maduro. Perfil sensorial con notas de chabacano, miel y un final limpio.",
      conceptual: "Mercado internacional en Canadá, EEUU y Europa. Estuche de madera clara con detalles minimalistas dorados.",
      visionary: "Viabilidad financiera media. Conseguir barricas de icewine es costoso, pero eleva notablemente el estatus de marca."
    },
    feasibilityScore: {
      technical: 90,
      commercial: 88,
      cost: "Alto"
    },
    verdict: "Aprobado por el comité. Las barricas de vino dulce combinan de manera excelsa con el tequila reposado. Un acierto rotundo para temporada invernal."
  },
  {
    category: "Concepto de Venta",
    ideaTitle: "Tequila Frecuencia Solar 432Hz",
    concept: "Destilación de tequila en una planta operada 100% con energía solar concentrada, sometiendo la fermentación a frecuencias musicales específicas (432Hz) para favorecer la levadura silvestre.",
    specialists: {
      alchemist: "La fermentación musical estimula de forma micro-física a las levaduras, logrando una tasa de conversión más homogénea y aromas frutales refinados.",
      conceptual: "Perfecto para el consumidor de Generación Z y Millennials conscientes. Campaña digital centrada en la pureza y la vibración natural del agave.",
      visionary: "Inversión inicial media-alta en paneles solares y sistemas de audio inductivos. El retorno se acelera por el ahorro energético masivo a largo plazo."
    },
    feasibilityScore: {
      technical: 75,
      commercial: 85,
      cost: "Medio"
    },
    verdict: "Viable y de alto impacto mediático. Un concepto verde que resuena con la sustentabilidad y el misticismo del tequila moderno."
  },
  {
    category: "Innovación Química/Destilación",
    ideaTitle: "Tequila Carbón de Cáscara de Coco",
    concept: "Filtrar tequila reposado mediante lecho de carbón activado obtenido de cáscaras de coco locales, logrando un tequila cristalino de cuerpo robusto y notas sutiles de coco tostado.",
    specialists: {
      alchemist: "El carbón de coco remueve los compuestos de color de la barrica pero retiene los ésteres grasos, manteniendo la sedosidad y agregando una nota sutil de lactonas de coco.",
      conceptual: "Segmento de Tequilas Cristalinos, el de mayor crecimiento actual. Un giro tropical premium al 'Cristalino' tradicional.",
      visionary: "Costo de producción bajo en comparación con otros métodos de filtrado. Excelente escalabilidad para producción masiva."
    },
    feasibilityScore: {
      technical: 95,
      commercial: 90,
      cost: "Bajo"
    },
    verdict: "Excelente proyecto de bajo costo y alto retorno. El mercado de tequilas cristalinos abrazará con entusiasmo esta variación con cáscara de coco."
  },
  {
    category: "Edición Limitada",
    ideaTitle: "Extra Añejo Crianza Oporto-Sauternes",
    concept: "Añejar durante 3 años en barricas de roble americano y terminarlo 12 meses más dividiendo el lote: la mitad en barricas de Oporto Ruby y la otra mitad en Sauternes, mezclándolos antes de embotellar.",
    specialists: {
      alchemist: "Complejidad aromática sin precedentes. Combina notas oscuras de frutos secos del Oporto con la miel y flores blancas del Sauternes. Un elixir denso.",
      conceptual: "Diseño señorial en licorera de cristal francés con cuello bañado en oro de 24 quilates. Dirigido a subastas y coleccionistas VIP.",
      visionary: "Inversión de capital prolongada (4 años de reposo). El precio sugerido de venta ($250 USD) absorbe el costo y provee márgenes superiores al 200%.",
    },
    feasibilityScore: {
      technical: 80,
      commercial: 95,
      cost: "Alto"
    },
    verdict: "Una obra maestra de maduración. Requiere paciencia, pero posicionará a la destilería en el pináculo de la alta gama internacional."
  }
];

interface RdDashboardProps {
  rdIdeas: any[];
  setRdIdeas: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedRdIdea: (idea: any) => void;
  onNavigateToIdea: () => void;
}

export default function RdDashboard({ rdIdeas, setRdIdeas, setSelectedRdIdea, onNavigateToIdea }: RdDashboardProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [costFilter, setCostFilter] = useState<string>('all');
  const [selectedDetailIdea, setSelectedDetailIdea] = useState<any>(null);

  // Load Seed Data
  const handleLoadSeeds = () => {
    setRdIdeas(SEED_RD_IDEAS);
    setSelectedRdIdea(SEED_RD_IDEAS[0]);
  };

  // Clear all ideas
  const handleClearIdeas = () => {
    if (window.confirm('¿Está seguro de que desea eliminar todas las ideas de I+D registradas en su laboratorio local?')) {
      setRdIdeas([]);
      setSelectedRdIdea(null);
      setSelectedDetailIdea(null);
    }
  };

  // Filtered Ideas
  const filteredIdeas = useMemo(() => {
    return rdIdeas.filter(idea => {
      const matchCat = categoryFilter === 'all' || idea.category === categoryFilter;
      const matchCost = costFilter === 'all' || idea.feasibilityScore?.cost === costFilter;
      return matchCat && matchCost;
    });
  }, [rdIdeas, categoryFilter, costFilter]);

  // Statistics Computations
  const stats = useMemo(() => {
    if (rdIdeas.length === 0) {
      return {
        total: 0,
        avgTech: 0,
        avgComm: 0,
        highCostCount: 0,
        medCostCount: 0,
        lowCostCount: 0,
        mostCommonCategory: 'N/A'
      };
    }

    let techSum = 0;
    let commSum = 0;
    let highCost = 0;
    let medCost = 0;
    let lowCost = 0;
    const categories: Record<string, number> = {};

    rdIdeas.forEach(idea => {
      techSum += Number(idea.feasibilityScore?.technical || 0);
      commSum += Number(idea.feasibilityScore?.commercial || 0);
      
      const cost = idea.feasibilityScore?.cost || 'Medio';
      if (cost === 'Alto') highCost++;
      else if (cost === 'Bajo') lowCost++;
      else medCost++;

      const cat = idea.category || 'General';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    let topCat = 'N/A';
    let maxCatCount = 0;
    Object.entries(categories).forEach(([cat, count]) => {
      if (count > maxCatCount) {
        maxCatCount = count;
        topCat = cat;
      }
    });

    return {
      total: rdIdeas.length,
      avgTech: Math.round(techSum / rdIdeas.length),
      avgComm: Math.round(commSum / rdIdeas.length),
      highCostCount: highCost,
      medCostCount: medCost,
      lowCostCount: lowCost,
      mostCommonCategory: topCat
    };
  }, [rdIdeas]);

  // Chart Data: Feasibility & Commercial Scores Comparison
  const scoresChartData = useMemo(() => {
    return filteredIdeas.map(idea => ({
      name: idea.ideaTitle.length > 25 ? idea.ideaTitle.substring(0, 22) + '...' : idea.ideaTitle,
      fullName: idea.ideaTitle,
      'Viabilidad Técnica': idea.feasibilityScore?.technical || 0,
      'Atracción Comercial': idea.feasibilityScore?.commercial || 0
    }));
  }, [filteredIdeas]);

  // Chart Data: Cost Levels
  const costChartData = useMemo(() => {
    return [
      { name: 'Bajo', value: stats.lowCostCount, color: '#10b981' }, // emerald
      { name: 'Medio', value: stats.medCostCount, color: '#f59e0b' }, // amber
      { name: 'Alto', value: stats.highCostCount, color: '#ef4444' } // red
    ].filter(item => item.value > 0);
  }, [stats]);

  // Chart Data: Category Distribution
  const categoryChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    rdIdeas.forEach(idea => {
      const cat = idea.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, val]) => ({
      name,
      value: val
    }));
  }, [rdIdeas]);

  const CATEGORY_COLORS = ['#fbbf24', '#3b82f6', '#10b981', '#a855f7', '#ec4899'];

  return (
    <div id="rd-dashboard-root" className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 rounded-3xl p-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-primary" />
            Dashboard Analítico de I+D
          </h2>
          <p className="text-xs text-muted-text mt-0.5">
            Estadísticas y comparativas de proyectos experimentales del laboratorio de destilación.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {rdIdeas.length === 0 ? (
            <button
              onClick={handleLoadSeeds}
              className="flex items-center gap-2 px-4 py-2 bg-amber-primary/10 hover:bg-amber-primary/20 border border-amber-primary/30 rounded-xl text-xs font-black uppercase text-amber-secondary tracking-wider transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 text-amber-primary" />
              Cargar Proyectos Semilla
            </button>
          ) : (
            <button
              onClick={handleClearIdeas}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-xs font-black uppercase text-red-400 tracking-wider transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Resetear Lab
            </button>
          )}
        </div>
      </div>

      {rdIdeas.length === 0 ? (
        /* Empty State with instant load button */
        <div className="text-center p-12 rounded-[2.5rem] bg-white/[0.01] border border-white/5 space-y-5">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-amber-secondary">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-sm font-bold text-white">No hay datos en el Laboratorio de I+D</h3>
            <p className="text-xs text-muted-text leading-relaxed">
              El panel estadístico requiere ideas previas para modelar gráficos. Proponga una hipótesis arriba en el <strong>Comité de I+D Creativo</strong> para que el comité la evalúe, o cargue nuestros sofisticados proyectos de muestra con un solo clic.
            </p>
          </div>
          <div>
            <button
              onClick={handleLoadSeeds}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-primary to-amber-tertiary text-black text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Cargar Proyectos Piloto de Alta Gama
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-soft-text block">Proyectos Totales</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{stats.total}</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded-full">Activos</span>
              </div>
              <p className="text-[9px] text-muted-text">Registrados en la memoria de la destilería.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-soft-text block">Viabilidad Técnica Promedio</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{stats.avgTech}%</span>
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${stats.avgTech}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-soft-text block">Atracción Comercial Promedio</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{stats.avgComm}%</span>
                <Award className="w-4 h-4 text-amber-primary shrink-0" />
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-primary rounded-full" style={{ width: `${stats.avgComm}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-soft-text block">Línea de Costo Dominante</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-amber-secondary truncate">{stats.highCostCount >= stats.lowCostCount && stats.highCostCount >= stats.medCostCount ? 'Alto' : stats.lowCostCount >= stats.medCostCount ? 'Bajo' : 'Medio'}</span>
                <Coins className="w-4 h-4 text-amber-secondary shrink-0" />
              </div>
              <p className="text-[9px] text-muted-text">Costos: {stats.highCostCount} Alto | {stats.medCostCount} Medio | {stats.lowCostCount} Bajo.</p>
            </div>
          </div>

          {/* Interactive Filters Panel */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Filter className="w-4 h-4 text-amber-secondary" />
              Filtrar Análisis:
            </div>
            <div className="flex flex-wrap gap-2">
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-primary"
                >
                  <option value="all">Todas las Categorías</option>
                  <option value="Edición Limitada">Edición Limitada</option>
                  <option value="Concepto de Venta">Concepto de Venta</option>
                  <option value="Innovación Química/Destilación">Innovación Química/Destilación</option>
                </select>
              </div>
              <div>
                <select
                  value={costFilter}
                  onChange={(e) => setCostFilter(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-primary"
                >
                  <option value="all">Cualquier Costo</option>
                  <option value="Bajo">Costo Bajo</option>
                  <option value="Medio">Costo Medio</option>
                  <option value="Alto">Costo Alto</option>
                </select>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Feasibility comparison (Dual Bar Chart) */}
            <div className="lg:col-span-2 p-5 rounded-3xl bg-black/40 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-amber-primary" />
                  Comparación de Viabilidad y Atracción
                </h3>
                <span className="text-[10px] text-soft-text">Datos filtrados ({filteredIdeas.length})</span>
              </div>

              <div className="h-72 w-full text-xs">
                {scoresChartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-soft-text text-[11px] italic">
                    No hay propuestas que coincidan con los filtros seleccionados.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scoresChartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="name" stroke="#a3a3a3" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} stroke="#a3a3a3" tick={{ fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#171717', 
                          borderColor: '#404040', 
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px'
                        }} 
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="Viabilidad Técnica" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Atracción Comercial" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 2: Cost distribution (Pie Chart) */}
            <div className="p-5 rounded-3xl bg-black/40 border border-white/5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 mb-1">
                  <PieIcon className="w-4 h-4 text-amber-secondary" />
                  Distribución de Costo Estimado
                </h3>
                <p className="text-[10px] text-muted-text">Mapeo del requerimiento financiero del lab.</p>
              </div>

              <div className="h-48 w-full flex items-center justify-center relative">
                {costChartData.length === 0 ? (
                  <span className="text-[11px] italic text-soft-text">Sin datos</span>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {costChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#171717', 
                          borderColor: '#404040', 
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {/* Center text on Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-white">{stats.total}</span>
                  <span className="text-[8px] uppercase tracking-widest text-muted-text font-black">Proyectos</span>
                </div>
              </div>

              {/* Pie Legends */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5">
                <div className="space-y-0.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1" />
                  <span className="text-[10px] font-bold text-white block">Bajo</span>
                  <span className="text-[10px] text-soft-text">{stats.lowCostCount} ideas</span>
                </div>
                <div className="space-y-0.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-1" />
                  <span className="text-[10px] font-bold text-white block">Medio</span>
                  <span className="text-[10px] text-soft-text">{stats.medCostCount} ideas</span>
                </div>
                <div className="space-y-0.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 mr-1" />
                  <span className="text-[10px] font-bold text-white block">Alto</span>
                  <span className="text-[10px] text-soft-text">{stats.highCostCount} ideas</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Lab Inventory (Comparison table) */}
          <div className="p-5 rounded-3xl bg-black/40 border border-white/5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Inventario e Historial de Ensayos I+D ({filteredIdeas.length})</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-soft-text">
                    <th className="py-3 px-4">Proyecto</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4 text-center">Técnica</th>
                    <th className="py-3 px-4 text-center">Comercial</th>
                    <th className="py-3 px-4 text-center">Costo</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredIdeas.map((idea, index) => {
                    const costColor = 
                      idea.feasibilityScore?.cost === 'Alto' ? 'text-red-400 bg-red-500/10' :
                      idea.feasibilityScore?.cost === 'Bajo' ? 'text-emerald-400 bg-emerald-500/10' :
                      'text-amber-400 bg-amber-500/10';

                    return (
                      <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-3 px-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span>🍾</span>
                            <div>
                              <span>{idea.ideaTitle}</span>
                              <span className="block text-[10px] text-muted-text font-normal italic truncate max-w-[250px] lg:max-w-md mt-0.5">
                                {idea.concept}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-soft-text">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[9px] font-bold">
                            {idea.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span className={idea.feasibilityScore?.technical >= 85 ? 'text-emerald-400' : 'text-amber-400'}>
                            {idea.feasibilityScore?.technical}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span className={idea.feasibilityScore?.commercial >= 85 ? 'text-emerald-400' : 'text-amber-400'}>
                            {idea.feasibilityScore?.commercial}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${costColor}`}>
                            {idea.feasibilityScore?.cost}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedDetailIdea(idea)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
                              title="Ver detalles rápidos"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRdIdea(idea);
                                onNavigateToIdea();
                              }}
                              className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-amber-primary/10 hover:bg-amber-primary/20 border border-amber-primary/20 text-[10px] text-amber-secondary font-black uppercase tracking-wider transition-all cursor-pointer"
                            >
                              <span>Cargar</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Detail Modal Drawer if an idea is clicked */}
          {selectedDetailIdea && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-stone-900 border border-white/10 rounded-[2.5rem] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 animate-fade-in relative">
                <button
                  onClick={() => setSelectedDetailIdea(null)}
                  className="absolute top-6 right-6 text-soft-text hover:text-white font-bold text-sm bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>

                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-primary/15 border border-amber-primary/30 text-[9px] font-black uppercase tracking-wider text-amber-secondary">
                    {selectedDetailIdea.category}
                  </span>
                  <h3 className="text-xl font-black text-white font-display">{selectedDetailIdea.ideaTitle}</h3>
                  <p className="text-xs text-soft-text italic leading-relaxed border-l-2 border-amber-primary/30 pl-3">
                    {selectedDetailIdea.concept}
                  </p>
                </div>

                {/* Scores Dials */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/5">
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-text block mb-1">Técnica</span>
                    <span className="text-lg font-black text-emerald-400">{selectedDetailIdea.feasibilityScore?.technical}%</span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-text block mb-1">Comercial</span>
                    <span className="text-lg font-black text-amber-primary">{selectedDetailIdea.feasibilityScore?.commercial}%</span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-text block mb-1">Costo</span>
                    <span className="text-lg font-black text-amber-secondary">{selectedDetailIdea.feasibilityScore?.cost}</span>
                  </div>
                </div>

                {/* Opinions */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-secondary">Perspectivas de los Especialistas</h4>
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                      <span className="font-extrabold text-emerald-400">Xavier (El Alquimista):</span> {selectedDetailIdea.specialists?.alchemist}
                    </div>
                    <div className="p-3.5 rounded-xl bg-orange-950/20 border border-amber-500/20">
                      <span className="font-extrabold text-amber-400">Sofía (La Conceptual):</span> {selectedDetailIdea.specialists?.conceptual}
                    </div>
                    <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20">
                      <span className="font-extrabold text-blue-400">Mateo (El Visionario):</span> {selectedDetailIdea.specialists?.visionary}
                    </div>
                  </div>
                </div>

                {/* Verdict */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-secondary block mb-1">Veredicto Colectivo</span>
                  <p className="text-xs text-muted-text italic">{selectedDetailIdea.verdict}</p>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setSelectedDetailIdea(null)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRdIdea(selectedDetailIdea);
                      setSelectedDetailIdea(null);
                      onNavigateToIdea();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-primary hover:bg-amber-secondary text-black text-xs font-black uppercase tracking-wider cursor-pointer"
                  >
                    Cargar en Comité Principal
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
