import * as React from 'react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  BookOpen, 
  Check, 
  Plus, 
  Scale, 
  Trash2, 
  AlertTriangle, 
  Filter, 
  Info, 
  X,
  FileSpreadsheet,
  Award,
  BookMarked
} from 'lucide-react';
import { NOM_DATABASE, NomItem } from '../nomDb';

interface NomSearchCompareProps {
  isOnline: boolean;
}

export default function NomSearchCompare({ isOnline }: NomSearchCompareProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('Todos');
  const [selectedStandard, setSelectedStandard] = useState<string>('Todas');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('Todos');
  const [comparedItems, setComparedItems] = useState<NomItem[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'compare'>('browse');

  // Stages of production as filters
  const stagesList = ['Todos', 'Campo', 'Jima', 'Cocción', 'Extracción', 'Fermentación', 'Destilación', 'Maduración', 'Embotellado'];
  
  // Standards list
  const standardsList = ['Todas', 'NOM-006-SCFI-2012', 'NOM-142-SSA1/SCFI-2014', 'NOM-251-SSA1-2009'];

  // Criticality list
  const criticalityList = ['Todos', 'Crítico', 'Alto', 'Moderado'];

  // Filtered NOM Database
  const filteredNOM = useMemo(() => {
    return NOM_DATABASE.filter(item => {
      // Stage match
      const stageMatch = selectedStage === 'Todos' || item.stage === selectedStage;
      
      // Standard match
      const standardMatch = selectedStandard === 'Todas' || item.standard === selectedStandard;

      // Criticality match
      const criticalityMatch = selectedCriticality === 'Todos' || item.criticality === selectedCriticality;

      // Search term matching title, clause, description, or requirements
      const searchNormalized = searchTerm.toLowerCase().trim();
      const textMatch = !searchNormalized || 
        item.title.toLowerCase().includes(searchNormalized) ||
        item.standard.toLowerCase().includes(searchNormalized) ||
        item.clause.toLowerCase().includes(searchNormalized) ||
        item.description.toLowerCase().includes(searchNormalized) ||
        item.requirements.some(req => req.toLowerCase().includes(searchNormalized)) ||
        item.parameters.some(p => p.name.toLowerCase().includes(searchNormalized) || p.value.toLowerCase().includes(searchNormalized));

      return stageMatch && standardMatch && criticalityMatch && textMatch;
    });
  }, [searchTerm, selectedStage, selectedStandard, selectedCriticality]);

  // Handlers for comparison queue
  const toggleCompare = (item: NomItem) => {
    setComparedItems(prev => {
      const isAlreadyAdded = prev.some(i => i.id === item.id);
      if (isAlreadyAdded) {
        return prev.filter(i => i.id !== item.id);
      } else {
        if (prev.length >= 3) {
          alert("Se permite comparar un máximo de 3 normativas de forma simultánea.");
          return prev;
        }
        return [...prev, item];
      }
    });
  };

  const clearCompare = () => {
    setComparedItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <section className="relative p-7 rounded-[2rem] bg-amber-primary/[0.03] border border-amber-primary/20 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookMarked className="w-32 h-32 text-amber-primary" />
        </div>
        <div className="flex items-start gap-4 flex-col sm:flex-row">
          <div className="p-3.5 bg-amber-primary/10 rounded-2xl border border-amber-primary/30 mt-1">
            <Scale className="w-6 h-6 text-amber-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
              Buscador y Comparativo NOM <span className="text-[10px] bg-amber-primary/10 border border-amber-primary/30 text-amber-secondary px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Offline Activo</span>
            </h2>
            <p className="text-xs leading-relaxed text-muted-text max-w-2xl">
              Consulte reglamentaciones técnicas de forma inmediata. Filtre y compare requisitos para el agua de dilución, límites microbiológicos, metanol, cobre y plagas sin depender de conexión a internet.
            </p>
          </div>
        </div>
      </section>

      {/* Mode selectors */}
      <div className="flex border-b border-white/5 gap-2">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === 'browse'
              ? 'border-amber-primary text-amber-secondary'
              : 'border-transparent text-soft-text hover:text-white'
          }`}
          id="tab-browse-nom"
        >
          🔍 Explorar y Filtrar Normas ({filteredNOM.length})
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`relative px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'compare'
              ? 'border-amber-primary text-amber-secondary'
              : 'border-transparent text-soft-text hover:text-white'
          }`}
          id="tab-compare-nom"
        >
          ⚖️ Matriz de Comparativa Side-by-Side
          {comparedItems.length > 0 && (
            <span className="bg-amber-primary text-black text-[10px] font-black px-2 py-0.5 rounded-full">
              {comparedItems.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'browse' && (
        <div className="space-y-6 animate-fade-in" id="nom-browse-container">
          {/* Controls Panel */}
          <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] space-y-4">
            
            {/* Search Bar */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-soft-text/60">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Escriba un término (ej. 'metanol', 'brix', 'arsénico', 'cobre', 'maduración')..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs md:text-sm text-white focus:outline-none focus:border-amber-primary transition-all placeholder:text-soft-text/40 leading-relaxed"
                id="nom-search-input"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-soft-text hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Standard select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-soft-text flex items-center gap-1.5">
                  <Filter className="w-3 h-3" /> Norma Oficial
                </label>
                <select
                  value={selectedStandard}
                  onChange={(e) => setSelectedStandard(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-primary transition-colors cursor-pointer"
                  id="nom-filter-standard"
                >
                  {standardsList.map(st => (
                    <option key={st} value={st} className="bg-bg">{st === 'Todas' ? 'Todas las Normas' : st}</option>
                  ))}
                </select>
              </div>

              {/* Criticality select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-soft-text flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> Nivel de Criticidad
                </label>
                <select
                  value={selectedCriticality}
                  onChange={(e) => setSelectedCriticality(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-primary transition-colors cursor-pointer"
                  id="nom-filter-criticality"
                >
                  {criticalityList.map(cr => (
                    <option key={cr} value={cr} className="bg-bg">{cr === 'Todos' ? 'Todos los Niveles' : `Criticidad: ${cr}`}</option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStage('Todos');
                    setSelectedStandard('Todas');
                    setSelectedCriticality('Todos');
                  }}
                  className="w-full py-2.5 px-4 text-[10px] font-black uppercase tracking-wider text-soft-text border border-white/10 rounded-xl hover:bg-white/5 active:scale-98 transition-all cursor-pointer"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>

            {/* Stages horizontal tabs inside search tools */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-soft-text">
                Filtrar por Etapa de Producción
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {stagesList.map(stG => {
                  const isSelected = selectedStage === stG;
                  return (
                    <button
                      key={stG}
                      onClick={() => setSelectedStage(stG)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'bg-amber-primary/15 border-amber-primary text-amber-secondary font-black'
                          : 'bg-white/5 border-white/5 text-muted-text hover:bg-white/10 hover:text-white'
                      } border`}
                    >
                      {stG}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredNOM.map((item) => {
                const addedToCompare = comparedItems.some(i => i.id === item.id);
                
                // Color mapping for criticality
                let critColor = 'border-amber-primary/20 text-amber-secondary bg-amber-primary/5';
                if (item.criticality === 'Crítico') {
                  critColor = 'border-rose-500/30 text-rose-400 bg-rose-500/5';
                } else if (item.criticality === 'Moderado') {
                  critColor = 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5';
                }

                return (
                  <motion.div
                    key={item.id}
                    layoutId={`nom-card-${item.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-primary/30 hover:bg-white/[0.04] transition-all flex flex-col justify-between shadow-lg"
                    id={`nom-card-node-${item.id}`}
                  >
                    <div>
                      {/* Badge header */}
                      <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                        <span className="text-[10px] font-bold text-amber-primary font-mono bg-amber-primary/5 border border-amber-primary/20 px-2.5 py-0.5 rounded-full">
                          {item.standard} · Cláusula {item.clause}
                        </span>
                        
                        <div className="flex gap-1.5 items-center">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-text px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                            {item.stage}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${critColor}`}>
                            {item.criticality}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white font-sans tracking-tight mb-2 leading-snug">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs leading-relaxed text-muted-text mb-4">
                        {item.description}
                      </p>

                      {/* Key Technical Parameters Box */}
                      {item.parameters.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 mb-4 space-y-2">
                          <h4 className="text-[9px] font-black uppercase tracking-widest text-amber-secondary flex items-start gap-1">
                            <Info className="w-3 h-3 text-amber-primary shrink-0" /> Parámetros y Límites Técnicos
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {item.parameters.map((p, pIdx) => (
                              <div key={pIdx} className="flex justify-between items-start text-[11px] border-b border-white/5 pb-1 last:border-0 last:pb-0">
                                <span className="text-muted-text font-medium">{p.name}</span>
                                <span className="text-white font-mono font-bold text-right ml-2">{p.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Requirements List */}
                      <div className="space-y-1.5 mb-4">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-soft-text">Acciones y Requisitos Obligatorios</h4>
                        <ul className="space-y-1.5">
                          {item.requirements.map((req, rIdx) => (
                            <li key={rIdx} className="text-xs text-muted-text flex items-start gap-2 leading-relaxed">
                              <span className="text-amber-primary mt-1 select-none">✓</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Sanctions Box */}
                      <div className="p-3.5 rounded-xl bg-rose-500/[0.02] border border-rose-500/10 text-xs text-rose-300">
                        <p className="leading-relaxed">
                          <strong className="text-rose-400 uppercase tracking-wider text-[9px] font-black mr-1 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Sanción por Incumplimiento:
                          </strong>
                          {item.sanctions}
                        </p>
                      </div>
                    </div>

                    {/* Action button at bottom */}
                    <div className="mt-5 pt-4 border-t border-white/5 flex justify-end">
                      <button
                        onClick={() => toggleCompare(item)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                          addedToCompare
                            ? 'bg-amber-primary text-black border-amber-primary'
                            : 'bg-white/5 text-white/80 border-white/10 hover:border-amber-primary/30 hover:bg-white/10 hover:text-white'
                        }`}
                        id={`btn-compare-toggle-${item.id}`}
                      >
                        {addedToCompare ? (
                          <>
                            <Check className="w-3 h-3 text-black stroke-[3px]" /> Agregado a Comparación
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" /> Añadir a Comparación
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredNOM.length === 0 && (
              <div className="col-span-full p-12 text-center rounded-3xl glass border border-white/5 space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-primary mx-auto animate-pulse" />
                <p className="text-xs font-semibold text-white">Ningún requisito o parámetro coincide con su búsqueda.</p>
                <p className="text-[11px] text-muted-text">Intente reducir los filtros elegidos o busque palabras alternativas como "grados", "agua" o "cobre".</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="space-y-6 animate-fade-in" id="nom-compare-container">
          {comparedItems.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass border border-white/5 space-y-4">
              <Scale className="w-10 h-10 text-soft-text mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Comparativa side-by-side vacía</h3>
                <p className="text-xs text-muted-text max-w-sm mx-auto">
                  Por favor regrese a la pestaña "Explorar y Filtrar Normas" y agregue al menos de 2 a 3 regulaciones para ver su matriz comparativa técnica de forma interactiva.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 bg-amber-primary hover:bg-amber-secondary text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
              >
                Volver al Explorador
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active list selection with quick clean option */}
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex-wrap gap-3">
                <span className="text-xs text-muted-text">
                  Comparando <strong className="text-white font-bold">{comparedItems.length}</strong> de máximo 3 normativas técnicas para destilería.
                </span>
                <button
                  onClick={clearCompare}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer"
                  id="btn-clear-compare-queue"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Quitar los {comparedItems.length} elementos
                </button>
              </div>

              {/* Matrix Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="comparison-matrix-grid">
                {comparedItems.map((item) => {
                  let badgeCritColor = 'border-amber-primary/20 text-amber-secondary bg-amber-primary/5';
                  if (item.criticality === 'Crítico') {
                    badgeCritColor = 'border-rose-500/30 text-rose-400 bg-rose-500/5';
                  } else if (item.criticality === 'Moderado') {
                    badgeCritColor = 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5';
                  }

                  return (
                    <div 
                      key={item.id} 
                      className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between shadow-lg relative overflow-hidden"
                      id={`compared-card-node-${item.id}`}
                    >
                      <button 
                        onClick={() => toggleCompare(item)}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-muted-text hover:text-white transition-colors cursor-pointer"
                        title="Quitar de comparación"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="space-y-4">
                        {/* Standards header */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-amber-primary font-mono uppercase bg-amber-primary/5 px-2 py-0.5 rounded border border-amber-primary/10">
                            {item.standard}
                          </span>
                          <h4 className="text-sm font-bold text-white font-display pt-1">
                            Cláusula {item.clause}: {item.title}
                          </h4>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-1.5 flex-wrap pt-1">
                          <span className="text-[9px] font-bold uppercase text-muted-text bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                            Proceso: {item.stage}
                          </span>
                          <span className={`text-[9px] font-black uppercase border px-2 py-0.5 rounded ${badgeCritColor}`}>
                            Criticidad: {item.criticality}
                          </span>
                        </div>

                        {/* Section Description */}
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-[11px] text-muted-text leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Technical threshold comparison */}
                        <div className="pt-3 border-t border-white/5 space-y-1.5">
                          <h5 className="text-[9px] font-black tracking-widest uppercase text-amber-secondary">Límites Clave</h5>
                          {item.parameters.length > 0 ? (
                            <div className="space-y-1">
                              {item.parameters.map((p, pi) => (
                                <div key={pi} className="text-[10.5px] p-2 rounded-lg bg-black/30 border border-white/5 flex flex-col gap-0.5">
                                  <span className="text-soft-text font-bold text-[9px] uppercase tracking-wider">{p.name}</span>
                                  <span className="text-white font-mono font-bold leading-none pt-0.5">{p.value}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-soft-text italic leading-relaxed">Ver requisitos normativos cualitativos abajo.</span>
                          )}
                        </div>

                        {/* Requisite details */}
                        <div className="pt-3 border-t border-white/5 space-y-1.5">
                          <h5 className="text-[9px] font-black tracking-widest uppercase text-soft-text">Obligaciones Distiladas</h5>
                          <ul className="space-y-1">
                            {item.requirements.map((req, rx) => (
                              <li key={rx} className="text-[11px] text-muted-text flex items-start gap-1.5 leading-relaxed">
                                <span className="text-amber-primary mt-1 shrink-0">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Penalties side-by-side */}
                        <div className="pt-3 border-t border-white/5 p-3 rounded-xl bg-rose-500/[0.01] border border-rose-500/10 text-[11px] text-rose-300">
                          <span className="font-black text-rose-400 uppercase tracking-widest text-[8px] block mb-1">Riesgo Corporativo Legal</span>
                          <p className="leading-relaxed">{item.sanctions}</p>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-white/5">
                        <button
                          onClick={() => toggleCompare(item)}
                          className="w-full py-2 bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 text-rose-400 hover:text-rose-300 text-[10px] font-bold uppercase rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Quitar de la Comparación
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
