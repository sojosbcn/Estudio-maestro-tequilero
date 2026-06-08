import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Hammer, 
  Flame, 
  Droplets, 
  Dna, 
  FlaskConical, 
  Cylinder, 
  Wine, 
  Send, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  Bot,
  User,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  Activity,
  ShieldCheck,
  Clock,
  Volume2, 
  VolumeX,
  History as HistoryIcon,
  Menu,
  X,
  Search,
  PlusCircle,
  Trash2,
  Pencil,
  Check,
  Lightbulb,
  FileText,
  Presentation,
  Download,
  Copy,
  Sparkles,
  BookOpen,
  Award,
  HelpCircle,
  Wifi,
  WifiOff,
  AlertTriangle,
  Globe
} from 'lucide-react';

import { findOfflineResponse, OFFLINE_DB } from './offlineDb';
import NomSearchCompare from './components/NomSearchCompare';
import TequilaLogo from './components/TequilaLogo';


interface ExpertResponses {
  agro: string;
  tech: string;
  lab: string;
  master: string;
}

interface Message {
  role: 'user' | 'ai';
  text?: string;
  experts?: ExpertResponses;
  protocol?: string[];
  stage?: string;
  id: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

const DEPARTMENTS = [
  { id: 'nom', name: 'Asesoría Técnica NOM', icon: ShieldCheck, emoji: '🎓', desc: 'Consultoría clásica de bio-datos y etapas' },
  { id: 'nom_db', name: 'Buscador y Comparativo NOM', icon: BookOpen, emoji: '📜', desc: 'Buscador, filtros y comparativa de normas oficiales' },
  { id: 'rd', name: 'Comité de I+D Creativo', icon: Lightbulb, emoji: '💡', desc: 'Brainstorming y evaluación de viabilidad de ideas' },
  { id: 'reports', name: 'Departamento de Informes', icon: FileText, emoji: '📄', desc: 'Dossiers y reportes ejecutivos automatizados' },
  { id: 'slides', name: 'NotebookLM & Presentaciones', icon: Presentation, emoji: '📊', desc: 'Diapositivas y archivos fuente listos para NotebookLM' },
];

const STAGES = [
  { id: 'Campo', name: 'Campo', icon: Sprout, emoji: '🌱' },
  { id: 'Jima', name: 'Jima', icon: Hammer, emoji: '⚒️' },
  { id: 'Cocción', name: 'Cocción', icon: Flame, emoji: '🔥' },
  { id: 'Extracción', name: 'Extracción', icon: Droplets, emoji: '💧' },
  { id: 'Fermentación', name: 'Fermentación', icon: Dna, emoji: '🧫' },
  { id: 'Destilación', name: 'Destilación', icon: FlaskConical, emoji: '⚗️' },
  { id: 'Maduración', name: 'Maduración', icon: Cylinder, emoji: '🛢️' },
  { id: 'Embotellado', name: 'Embotellado', icon: Wine, emoji: '🍾' },
];

export default function App() {
  const [activeStage, setActiveStage] = useState('Campo');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof window !== 'undefined' ? window.navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  
  // Custom states added for Chat History enhancements
  const [renamingSessionId, setRenamingSessionId] = useState<string | null>(null);
  const [renameTitleInput, setRenameTitleInput] = useState('');
  
  // Dynamic collapsers to save screen space
  const [showDepartments, setShowDepartments] = useState(false);
  const [showStages, setShowStages] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHeroIntro, setShowHeroIntro] = useState(false);
  const [activeMessageExpert, setActiveMessageExpert] = useState<Record<string, 'agro' | 'tech' | 'lab' | 'master' | null>>({});
  const [expandedProtocols, setExpandedProtocols] = useState<Record<string, boolean>>({});

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // --- Start of Departments & R&D / Report Additions ---
  const [activeDepartment, setActiveDepartment] = useState<'nom' | 'nom_db' | 'rd' | 'reports' | 'slides'>('nom');
  
  // R&D State management
  const [userIdeaPitch, setUserIdeaPitch] = useState('');
  const [isRdLoading, setIsRdLoading] = useState(false);
  const [rdIdeas, setRdIdeas] = useState<any[]>(() => {
    const saved = localStorage.getItem('tequila_rd_ideas');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedRdIdea, setSelectedRdIdea] = useState<any>(() => {
    const saved = localStorage.getItem('tequila_rd_ideas');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed[0];
      } catch (e) {}
    }
    return null;
  });
  
  // Reports State management
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [activeReport, setActiveReport] = useState<any>(null);
  const [customReportTopic, setCustomReportTopic] = useState('');
  
  // Slides State management
  const [isSlidesLoading, setIsSlidesLoading] = useState(false);
  const [activePresentation, setActivePresentation] = useState<any>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copiarExito, setCopiarExito] = useState(false);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('tequila_rd_ideas', JSON.stringify(rdIdeas));
  }, [rdIdeas]);

  useEffect(() => {
    const savedRep = localStorage.getItem('tequila_active_report');
    if (savedRep) {
      try { setActiveReport(JSON.parse(savedRep)); } catch (e) {}
    }
    const savedPres = localStorage.getItem('tequila_active_pres');
    if (savedPres) {
      try { setActivePresentation(JSON.parse(savedPres)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (activeReport) {
      localStorage.setItem('tequila_active_report', JSON.stringify(activeReport));
    }
  }, [activeReport]);

  useEffect(() => {
    if (activePresentation) {
      localStorage.setItem('tequila_active_pres', JSON.stringify(activePresentation));
    }
  }, [activePresentation]);

  // Handlers for dynamic I+D, report, and slide generation
  const handleRdGenerate = async (pitch?: string, category?: string) => {
    setIsRdLoading(true);
    try {
      const response = await fetch('/api/rd/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdea: pitch, category }),
      });
      if (!response.ok) throw new Error('Failed to generate R&D idea');
      const data = await response.json();
      
      setRdIdeas(prev => {
        const updated = [data, ...prev];
        return updated;
      });
      setSelectedRdIdea(data);
      if (pitch) setUserIdeaPitch('');
    } catch (e) {
      console.error(e);
      alert('Error de conexión con el Comité Creativo de I+D.');
    } finally {
      setIsRdLoading(false);
    }
  };

  const handleCommissionReport = async (idea: any) => {
    setIsReportLoading(true);
    setIsSlidesLoading(true);
    setActiveDepartment('reports');
    
    try {
      // 1. Fetch Professional Dossier Report
      const repResp = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idea),
      });
      if (!repResp.ok) throw new Error('Report generation failed');
      const reportData = await repResp.json();
      setActiveReport(reportData);
      
      // 2. Fetch Presentation Slides mapped to the Report details
      const presResp = await fetch('/api/presentation/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaTitle: idea.ideaTitle,
          concept: idea.concept,
          report: reportData
        }),
      });
      if (!presResp.ok) throw new Error('Presentation generation failed');
      const presData = await presResp.json();
      setActivePresentation(presData);
      setCurrentSlideIndex(0);
    } catch (e) {
      console.error(e);
      alert('Error de red al comisionar informe e informes visuales.');
    } finally {
      setIsReportLoading(false);
      setIsSlidesLoading(false);
    }
  };

  const handleCustomReport = async () => {
    if (!customReportTopic.trim()) return;
    setIsReportLoading(true);
    setActiveDepartment('reports');
    
    try {
      const dummyIdea = {
        ideaTitle: customReportTopic.trim(),
        concept: "Dossier comisionado en sesión sobre optimización tequilera",
        category: "Comisión Directa",
        verdict: "Aprobación ejecutiva por el Director General",
        specialists: {
          alchemist: `Análisis molecular y alquimia aplicada para: ${customReportTopic.trim()}`,
          conceptual: `Modelo conceptual y narrativa de valor comercial para: ${customReportTopic.trim()}`,
          visionary: `Estrategia de abasto, cadena logística e impacto agrario para: ${customReportTopic.trim()}`
        },
        feasibilityScore: { technical: 90, commercial: 85, cost: "Alto" }
      };
      
      const repResp = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dummyIdea),
      });
      if (!repResp.ok) throw new Error('Custom Report generation failed');
      const reportData = await repResp.json();
      setActiveReport(reportData);
      setCustomReportTopic('');
      
      setIsSlidesLoading(true);
      const presResp = await fetch('/api/presentation/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaTitle: reportData.title,
          concept: reportData.executiveSummary,
          report: reportData
        }),
      });
      if (presResp.ok) {
        const presData = await presResp.json();
        setActivePresentation(presData);
        setCurrentSlideIndex(0);
      }
    } catch (e) {
      console.error(e);
      alert('Error creando el informe personalizado.');
    } finally {
      setIsReportLoading(false);
      setIsSlidesLoading(false);
    }
  };

  const getNotebookLmText = () => {
    if (!activeReport) return "No hay informes cargados para exportar.";
    
    let text = `====================================================\n`;
    text += `DOCUMENTO FUENTE DE INGESTIÓN COMPLETA - NOTEBOOKLM\n`;
    text += `PROYECTO: ${activeReport.title}\n`;
    text += `CÓDIGO DE REGISTRO: ${activeReport.dossierCode}\n`;
    text += `FECHA DE GENERACIÓN: ${activeReport.date}\n`;
    text += `====================================================\n\n`;
    
    text += `RESUMEN EJECUTIVO (VISIÓN GLOBAL DEL NEGOCIO):\n`;
    text += `${activeReport.executiveSummary}\n\n`;
    
    text += `----------------------------------------------------\n`;
    text += `SECCIONES DE CONSULTORÍA TÉCNICA E INDUSTRIAL:\n`;
    text += `----------------------------------------------------\n`;
    activeReport.sections.forEach((sec: any) => {
      text += `\n[${sec.heading}]\n${sec.content}\n`;
    });
    
    text += `\n----------------------------------------------------\n`;
    text += `RECOMENDACIONES DE IMPLEMENTACIÓN PARA DIRECCIÓN:\n`;
    text += `----------------------------------------------------\n`;
    activeReport.recommendations.forEach((rec: any, idx: number) => {
      text += `${idx + 1}. ${rec}\n`;
    });
    
    if (activePresentation) {
      text += `\n\n====================================================\n`;
      text += `LÁMINAS DE PRESENTACIÓN EJECUTIVA ASOCIADAS (SLIDE DECK)\n`;
      text += `====================================================\n`;
      activePresentation.slides.forEach((sl: any) => {
        text += `\n- DIAPOSITIVA ${sl.slideNum}: ${sl.title}\n`;
        text += `  Subtítulo de Soporte: ${sl.subtitle}\n`;
        text += `  Puntos Clave y Datos de Impacto:\n`;
        sl.bullets.forEach((b: string) => {
          text += `    • ${b}\n`;
        });
        text += `  Recomendación Visual/Diseñador: ${sl.visualTip}\n`;
      });
    }
    
    return text;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiarExito(true);
    setTimeout(() => setCopiarExito(false), 2500);
  };

  const downloadReportTxt = () => {
    const text = getNotebookLmText();
    const filename = `dossier_tequila_${activeReport?.dossierCode || 'id'}.txt`;
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  // --- End of Departments & R&D / Report Additions ---

  // Set default sidebar state based on screen size on mount
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('tequila_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          const latest = parsed[0];
          setCurrentSessionId(latest.id);
          setMessages(latest.messages);
        } else {
          startNewNewSession();
        }
      } catch (e) {
        startNewNewSession();
      }
    } else {
      startNewNewSession();
    }
  }, []);

  // Save history on changes (bypassing initial mount empty save, writing empty arrays too on deletion)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem('tequila_chats', JSON.stringify(sessions));
  }, [sessions]);

  const startNewNewSession = () => {
    const id = Date.now().toString();
    const newSession: ChatSession = {
      id,
      title: 'Nueva Consulta',
      messages: [{
        id: 'welcome',
        role: 'ai',
        text: 'Bienvenido a la Guía Maestra del Tequila. Soy su panel de expertos en ciencia y tradición. ¿Desea optimizar su cultivo, analizar un lote o quizás indagar en procesos ancestrales como el tatemado de piñas?',
      }],
      timestamp: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(id);
    setMessages(newSession.messages);
    
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const selectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    }
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (currentSessionId === id) {
      if (updated.length > 0) {
        // Select the next session
        const nextSession = updated[0];
        setCurrentSessionId(nextSession.id);
        setMessages(nextSession.messages);
      } else {
        // Create a new session if none remains
        const newId = Date.now().toString();
        const newSession: ChatSession = {
          id: newId,
          title: 'Nueva Consulta',
          messages: [{
            id: 'welcome',
            role: 'ai',
            text: 'Bienvenido a la Guía Maestra del Tequila. Soy su panel de expertos en ciencia y tradición. ¿Desea optimizar su cultivo, analizar un lote o quizás indagar en procesos ancestrales como el tatemado de piñas?',
          }],
          timestamp: Date.now()
        };
        setSessions([newSession]);
        setCurrentSessionId(newId);
        setMessages(newSession.messages);
      }
    }
  };

  const renameSession = (id: string, newTitle: string) => {
    if (!newTitle.trim()) {
      setRenamingSessionId(null);
      return;
    }
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, title: newTitle.trim() };
      }
      return s;
    }));
    setRenamingSessionId(null);
  };

  const clearAllSessions = () => {
    if (window.confirm('¿Está seguro de que desea eliminar todas las consultas de su historial? Esta acción no se puede deshacer.')) {
      const id = Date.now().toString();
      const newSession: ChatSession = {
        id,
        title: 'Nueva Consulta',
        messages: [{
          id: 'welcome',
          role: 'ai',
          text: 'Bienvenido a la Guía Maestra del Tequila. Soy su panel de expertos en ciencia y tradición. ¿Desea optimizar su cultivo, analizar un lote o quizás indagar en procesos ancestrales como el tatemado de piñas?',
        }],
        timestamp: Date.now()
      };
      setSessions([newSession]);
      setCurrentSessionId(id);
      setMessages(newSession.messages);
    }
  };

  const getSessionStages = (session: ChatSession) => {
    const stagesDiscussed = Array.from(new Set(
      session.messages
        .map(m => m.stage)
        .filter((stage): stage is string => !!stage)
    ));
    return stagesDiscussed;
  };

  const updateCurrentSession = (newMessages: Message[]) => {
    setMessages(newMessages);
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        // Update title from first user message if it's currently default 'Nueva Consulta'
        const firstUserMsg = newMessages.find(m => m.role === 'user');
        const title = (s.title === 'Nueva Consulta' || s.title === 'Nueva Consulta...') && firstUserMsg 
          ? (firstUserMsg.text && firstUserMsg.text.length > 25 ? firstUserMsg.text.slice(0, 25) + '...' : firstUserMsg.text || s.title)
          : s.title;
        return { ...s, messages: newMessages, title };
      }
      return s;
    }));
  };

  const SUGGESTIONS = [
    "¿Efecto del tatemado en notas sensoriales?",
    "Protocolo de limpieza Tahona",
    "Análisis de grados Brix en Jima",
    "Control de metanol en destilación"
  ];

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const speak = (msg: Message) => {
    if (isSpeaking === msg.id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      
      let textToRead = "";
      if (msg.text) textToRead = msg.text;
      if (msg.experts) {
        textToRead = `Respuesta de los expertos. 
        Agrónomo: ${msg.experts.agro}. 
        Técnico: ${msg.experts.tech}. 
        Químico: ${msg.experts.lab}. 
        Maestro Tequilero: ${msg.experts.master}.`;
      }

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'es-ES';
      
      const voices = window.speechSynthesis.getVoices();
      const mxVoice = voices.find(v => v.lang === 'es-MX');
      if (mxVoice) utterance.voice = mxVoice;

      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);
      
      setIsSpeaking(msg.id);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    const msgId = Date.now().toString();
    setInput('');
    
    const newUserMessages: Message[] = [...messages, { id: msgId, role: 'user', text: userMsg, stage: activeStage }];
    setMessages(newUserMessages);
    setIsLoading(true);

    if (!isOnline) {
      setTimeout(() => {
        const matched = findOfflineResponse(userMsg, activeStage);
        let newAiMsg: Message;
        
        if (matched) {
          newAiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            stage: matched.stage,
            experts: matched.experts,
            protocol: matched.protocol
          };
        } else {
          newAiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: `⚠️ **[Modo Sin Conexión]** No se encontró una coincidencia en la base de datos técnica local sobre "${userMsg}".

Dado que está fuera de línea, el Asistente Experto solo puede responder dudas indexadas localmente sobre parámetros esenciales de NOM-006 (como grados Brix, picudo / plagas en campo, tatemado y cocción en hornos/autoclave, molienda / tahona / rodillos, fermentaciones estancadas o paros de tina, control de metanol con corte de cabezas/colas, añejamiento en barricas de roble, y turbidez o agua de dilución). Restablezca su conexión a internet para realizar una consulta de inteligencia artificial avanzada en tiempo real.`
          };
        }
        
        const finalMessages = [...newUserMessages, newAiMsg];
        updateCurrentSession(finalMessages);
        setIsLoading(false);
      }, 800);
      return;
    }

    try {
      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          stage: activeStage,
          history: messages.filter(m => m.id !== 'welcome')
        }),
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const newAiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        experts: data.experts, 
        protocol: data.protocol 
      };
      
      const finalMessages = [...newUserMessages, newAiMsg];
      updateCurrentSession(finalMessages);
    } catch (error) {
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        text: 'Lo siento, hubo un problema técnico en la destilería digital. Por favor intenta de nuevo.' 
      };
      setMessages([...newUserMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSidebarContent = () => {
    return (
      <div className="flex flex-col h-full bg-black/40 backdrop-blur-3xl">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/30">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-amber-secondary" />
            <h3 className="text-xs font-black tracking-widest text-amber-secondary uppercase">Consultas Recientes</h3>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-soft-text hover:text-white"
            title="Ocultar historial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-soft-text" />
            <input 
              type="text"
              placeholder="Buscar consulta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-amber-primary/50 transition-all placeholder:text-soft-text/60"
            />
          </div>
          <button 
            onClick={startNewNewSession}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-br from-amber-primary to-amber-tertiary text-black font-black text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Nueva Consulta
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-none">
          {sessions
            .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(s => {
              const isSelected = currentSessionId === s.id;
              const isRenaming = renamingSessionId === s.id;
              
              return (
                <div
                  key={s.id}
                  onClick={() => selectSession(s.id)}
                  className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                    ? 'bg-amber-primary/15 border-amber-primary/45 shadow-[0_0_15px_rgba(245,166,35,0.08)]' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div className="flex flex-col gap-1 pr-6Data">
                    {isRenaming ? (
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          value={renameTitleInput}
                          onChange={(e) => setRenameTitleInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              renameSession(s.id, renameTitleInput);
                            } else if (e.key === 'Escape') {
                              setRenamingSessionId(null);
                            }
                          }}
                          onBlur={() => renameSession(s.id, renameTitleInput)}
                          className="bg-black/60 text-xs text-white border border-amber-primary/40 rounded px-2 py-1 w-full outline-none focus:border-amber-primary font-bold"
                          autoFocus
                        />
                        <button 
                          onClick={() => renameSession(s.id, renameTitleInput)}
                          className="p-1 rounded bg-amber-primary text-black hover:bg-amber-secondary transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-app-text line-clamp-1 pr-4">{s.title}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenamingSessionId(s.id);
                            setRenameTitleInput(s.title);
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:text-amber-primary text-soft-text/60 transition-all rounded hover:bg-white/5"
                          title="Renombrar consulta"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] text-soft-text uppercase tracking-widest font-bold">
                        {new Date(s.timestamp).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <span className="text-[9px] text-soft-text/60 font-medium">
                          {s.messages.length} {s.messages.length === 1 ? 'msg' : 'msgs'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Unique stage tags for this session */}
                    {getSessionStages(s).length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {getSessionStages(s).map(stg => {
                          const stageObj = STAGES.find(item => item.id === stg);
                          return (
                            <span 
                              key={stg} 
                              title={stg}
                              className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-bold text-soft-text flex items-center gap-0.5"
                            >
                              <span>{stageObj?.emoji || '🌵'}</span>
                              <span className="text-[7.5px] opacity-70 truncate max-w-[50px]">{stageObj?.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={(e) => deleteSession(e, s.id)}
                    className="absolute right-2 top-2 p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-400 text-soft-text/40 transition-all rounded hover:bg-white/5 animate-fade-in"
                    title="Eliminar consulta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          {sessions.length === 0 && (
            <div className="text-center py-6">
              <p className="text-xs text-soft-text">No hay consultas guardadas.</p>
            </div>
          )}
        </div>

        {/* Clear all footer in sidebar */}
        {sessions.length > 1 && (
          <div className="p-4 border-t border-white/10 bg-black/10">
            <button 
              onClick={clearAllSessions}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-500/20 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Vaciar Historial
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex bg-bg h-screen overflow-hidden font-sans selection:bg-amber-primary/30">
      {/* Mobile Drawer - Chat History */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="md:hidden">
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-80 z-50 glass border-r border-white/10 flex flex-col h-full"
            >
              {renderSidebarContent()}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Panel - Chat History (collapsible layout) */}
      <div 
        className={`hidden md:flex flex-col h-full border-r border-white/10 glass transition-all duration-300 overflow-hidden relative z-30 flex-shrink-0 bg-black/10 ${
          isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none border-none'
        }`}
      >
        <div className="w-80 h-full flex flex-col">
          {renderSidebarContent()}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative w-full">
        {/* Background Glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] bg-amber-primary/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-green-primary/5 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20vw] h-[20vw] bg-amber-tertiary/10 blur-[100px] rounded-full" />
        </div>

        {/* Header */}
        <header className="relative z-10 py-2 px-3 md:p-4 border-b border-white/10 glass select-none">
          <div className="max-w-7xl mx-auto flex flex-col gap-2">
            
            {/* Top row with Burger, compact Logo/Title and Online Badge */}
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 md:p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-soft-text hover:text-white"
                  title="Toggle Historial"
                >
                  <Menu className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <div className="hidden md:flex items-center gap-2">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2.5 md:p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-amber-secondary cursor-pointer"
                    title="Historial de consultas"
                  >
                    <HistoryIcon className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.div 
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative shrink-0"
                  >
                    <TequilaLogo size={40} className="md:w-14 md:h-14" />
                  </motion.div>
                  <div>
                    <h1 className="text-xs md:text-xl font-black tracking-widest bg-linear-to-r from-white via-amber-secondary to-amber-primary bg-clip-text text-transparent leading-none">
                      GUÍA MAESTRA
                    </h1>
                    <span className="text-[7.5px] md:text-[10px] text-amber-secondary font-black leading-none block">DEL TEQUILA</span>
                    <p className="text-[7px] md:text-xs font-bold tracking-[0.2em] text-soft-text uppercase hidden md:block mt-1">
                      IA Experta · NOM · Producción
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md transition-colors ${
                isOnline 
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                  : 'border-amber-primary/30 bg-amber-primary/5 text-amber-secondary'
              }`}>
                {isOnline ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[8px] md:text-[10px] font-black tracking-wider uppercase">En Línea</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-primary" />
                    <span className="text-[8px] md:text-[10px] font-black tracking-wider uppercase">Local</span>
                  </>
                )}
              </div>
            </div>

            {/* Active Department Banner / Toggle - Collapsible to save screen space */}
            <div className="flex flex-wrap justify-between items-center gap-2 pt-1.5 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase font-black tracking-widest text-amber-secondary/60">Área:</span>
                {(() => {
                  const currentDept = DEPARTMENTS.find(d => d.id === activeDepartment);
                  return (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-primary/10 border border-amber-primary/25 text-amber-secondary font-black text-[10px] shadow-sm">
                      <span>{currentDept?.emoji}</span>
                      <span className="truncate max-w-[120px] md:max-w-none">{currentDept?.name}</span>
                    </span>
                  );
                })()}
              </div>
              <button
                onClick={() => setShowDepartments(!showDepartments)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-wider text-amber-secondary border border-amber-primary/20 hover:border-amber-primary/40 transition-all cursor-pointer"
              >
                {showDepartments ? '▲ Cerrar' : '▼ Cambiar Área de Trabajo'}
              </button>
            </div>

            {/* Collapsed Department Selectors Grid */}
            {showDepartments && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 md:grid-cols-5 gap-1.5 pt-1.5 border-t border-white/5"
              >
                {DEPARTMENTS.map((dept) => {
                  const isActive = activeDepartment === dept.id;
                  return (
                    <button
                      key={dept.id}
                      onClick={() => {
                        setActiveDepartment(dept.id);
                        setShowDepartments(false); // Closed instantly to save space!
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer border text-center transition-all duration-300 ${
                        isActive
                        ? 'bg-amber-primary/10 border-amber-primary shadow-[0_0_15px_rgba(245,166,35,0.15)] text-white scale-[1.02]'
                        : 'bg-white/5 border-white/5 text-soft-text hover:bg-white/10 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-xs">{dept.emoji}</span>
                        <dept.icon className={`w-3 h-3 ${isActive ? 'text-amber-primary' : 'text-soft-text'}`} />
                      </div>
                      <span className="text-[8.5px] font-black tracking-wider uppercase leading-tight">{dept.name}</span>
                      <span className="text-[7.5px] opacity-60 mt-0.5 hidden md:block line-clamp-1">{dept.desc}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* Active Stage Indicator / Toggle - Only for NOM */}
            {activeDepartment === 'nom' && (
              <div className="border-t border-white/5 pt-1.5 space-y-1.5">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[9px] uppercase font-black tracking-widest text-amber-secondary/60">Etapa NOM:</span>
                    {(() => {
                      const cur = STAGES.find(s => s.id === activeStage);
                      return (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-primary/10 border border-amber-primary/25 text-amber-secondary font-black text-[10px]">
                          <span>{cur?.emoji}</span>
                          <span className="truncate max-w-[120px] md:max-w-none">{cur?.name}</span>
                        </span>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => setShowStages(!showStages)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-wider text-amber-secondary border border-amber-primary/20 hover:border-amber-primary/40 transition-all cursor-pointer"
                  >
                    {showStages ? '▲ Cerrar' : '▼ Editar Etapa'}
                  </button>
                </div>

                {showStages && (
                  <nav className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 animate-fade-in">
                    {STAGES.map((stage) => (
                      <button
                        key={stage.id}
                        onClick={() => {
                          setActiveStage(stage.id);
                          setShowStages(false); // Auto close to keep layout tidy
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-lg text-[10.5px] font-bold whitespace-nowrap transition-all duration-300 ${
                          activeStage === stage.id 
                          ? 'bg-linear-to-br from-amber-primary/20 to-amber-tertiary/10 border-amber-primary shadow-[0_0_15px_rgba(245,166,35,0.15)] text-white scale-102'
                          : 'bg-white/5 border-white/10 text-muted-text hover:bg-white/10'
                        } border backdrop-blur-md`}
                      >
                        <stage.icon className="w-3 h-3" />
                        {stage.name}
                      </button>
                    ))}
                  </nav>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-32">
            
            {/* 1. ASESORÍA TÉCNICA NOM (TRADITIONAL ADVISOR CHAT) */}
            {activeDepartment === 'nom' && (
              <div className="flex flex-col gap-8 animate-fade-in">
                {!showHeroIntro && messages.length < 3 && (
                  <button
                    onClick={() => setShowHeroIntro(true)}
                    className="self-center mx-auto mb-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-amber-secondary hover:bg-white/10 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <span>ℹ️</span> Diagnóstico e Introducción de la Plataforma
                  </button>
                )}
                {/* Hero Static Intro */}
                {showHeroIntro && messages.length < 3 && (
                  <section className="relative p-7 md:p-10 rounded-[2.5rem] glass border-amber-primary/20 overflow-hidden shadow-2xl animate-fade-in mr-auto w-full">
                    <button
                      onClick={() => setShowHeroIntro(false)}
                      className="absolute top-6 right-6 p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-soft-text hover:text-white transition-all cursor-pointer z-20"
                      title="Ocultar Introducción"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-primary/20 blur-[100px] rounded-full pointer-events-none" />
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4 flex-wrap">
                        <TequilaLogo size={68} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-secondary bg-amber-primary/10 px-3.5 py-1.5 rounded-full border border-amber-primary/25">Identidad Maestra Certificada</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black leading-[0.95] tracking-tighter max-w-2xl font-display">
                        La plataforma más avanzada jamás creada sobre producción de tequila.
                      </h2>
                      <p className="text-sm md:text-base text-muted-text leading-relaxed max-w-xl">
                        Diagnóstico visual, inteligencia artificial especializada, control técnico y protocolos NOM para el arte de la destilación.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        {[
                          { label: 'Procesos analizados', value: '12,847', icon: Activity },
                          { label: 'Precisión IA', value: '99.2%', icon: ShieldCheck },
                          { label: 'Expertos activos', value: '24/7', icon: Clock },
                        ].map((stat, i) => (
                          <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-soft-text">{stat.label}</span>
                              <stat.icon className="w-4 h-4 text-amber-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-3xl font-bold">{stat.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Chat Messages */}
                <div className="flex flex-col gap-6">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col max-w-[95%] md:max-w-[90%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                      >
                        {/* Tag */}
                        <div className={`flex items-center gap-2 mb-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          msg.role === 'user' ? 'bg-amber-primary/10 text-amber-primary' : 'bg-white/10 text-amber-secondary'
                        }`}>
                          {msg.role === 'user' ? (
                            <><User className="w-3 h-3" /> {msg.stage || 'Agente'} · Usuario</>
                          ) : (
                            <><Bot className="w-3 h-3" /> Sistema Experto · Diagnóstico Premium</>
                          )}
                        </div>

                        {/* Bubble */}
                        <div className={`group relative p-6 rounded-[2rem] shadow-xl backdrop-blur-3xl ${
                          msg.role === 'user' ? 'amber-glass' : 'glass'
                        }`}>
                          {/* Audio Button */}
                          {msg.role === 'ai' && (
                            <button 
                              onClick={() => speak(msg)}
                              className={`absolute right-4 top-4 p-2 rounded-full transition-all cursor-pointer z-10 ${
                                isSpeaking === msg.id ? 'bg-amber-primary text-black' : 'bg-white/5 text-amber-primary hover:bg-white/10'
                              }`}
                            >
                              {isSpeaking === msg.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                          )}

                          {msg.text && <p className="text-sm md:text-base leading-relaxed text-app-text pr-8">{msg.text}</p>}
                          
                          {msg.experts && (
                            <div className="mt-4 space-y-3">
                              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-secondary/80 flex items-center gap-1.5 mb-1.5">
                                <span>💎</span> CONSEJO DE EXPERTOS (Toca para expandir diagnóstico):
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { key: 'agro', title: 'Agrónomo', icon: '🌱', color: 'bg-green-500/10 border-green-500/20 text-green-300 hover:bg-green-500/20' },
                                  { key: 'tech', title: 'Técnico', icon: '⚒️', color: 'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20' },
                                  { key: 'lab', title: 'Químico', icon: '🧪', color: 'bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/20' },
                                  { key: 'master', title: 'Maestro', icon: '🎓', color: 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20' },
                                ].map((exp) => {
                                  const isSelected = activeMessageExpert[msg.id] === exp.key;
                                  return (
                                    <button
                                      key={exp.key}
                                      onClick={() => {
                                        setActiveMessageExpert(prev => ({
                                          ...prev,
                                          [msg.id]: isSelected ? null : (exp.key as any)
                                        }));
                                      }}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-black tracking-wide transition-all duration-300 cursor-pointer ${
                                        isSelected 
                                        ? 'bg-amber-primary text-black border-amber-primary scale-105 shadow-[0_0_15px_rgba(245,166,35,0.35)]' 
                                        : `${exp.color} opacity-80 hover:opacity-100`
                                      }`}
                                    >
                                      <span>{exp.icon}</span>
                                      <span>{exp.title}</span>
                                      <span className="text-[9px] opacity-70">
                                        {isSelected ? '▲' : '▼'}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Expanded single expert panel */}
                              {(() => {
                                const activeKey = activeMessageExpert[msg.id];
                                if (!activeKey) return null;
                                
                                const expertMap = {
                                  agro: { title: 'Agrónomo Especialista', content: msg.experts.agro, color: 'border-green-500/30 bg-green-500/5', icon: '🌱' },
                                  tech: { title: 'Técnico Operativo', content: msg.experts.tech, color: 'border-amber-primary/30 bg-amber-primary/5', icon: '⚒️' },
                                  lab: { title: 'Químico Analista', content: msg.experts.lab, color: 'border-blue-550/30 bg-blue-500/5', icon: '🧪' },
                                  master: { title: 'Maestro Tequilero', content: msg.experts.master, color: 'border-purple-530/30 bg-purple-500/5', icon: '🎓' },
                                };
                                
                                const activeData = expertMap[activeKey];
                                if (!activeData) return null;

                                return (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.98, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={`p-4 rounded-2xl border ${activeData.color} backdrop-blur-md space-y-1 animate-fade-in`}
                                  >
                                    <div className="flex justify-between items-center pb-1 border-b border-white/5 mb-1.5">
                                      <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-white">
                                        <span>{activeData.icon}</span> {activeData.title}
                                      </h4>
                                      <button
                                        onClick={() => {
                                          setActiveMessageExpert(prev => ({ ...prev, [msg.id]: null }));
                                        }}
                                        className="text-[9.5px] font-black uppercase text-amber-secondary hover:text-white cursor-pointer transition-colors"
                                      >
                                        Ocultar ×
                                      </button>
                                    </div>
                                    <p className="text-xs leading-relaxed text-muted-text">{activeData.content}</p>
                                  </motion.div>
                                );
                              })()}
                            </div>
                          )}

                          {msg.protocol && (
                            <div className="mt-4 border-t border-white/5 pt-4">
                              <button
                                onClick={() => {
                                  setExpandedProtocols(prev => ({
                                    ...prev,
                                    [msg.id]: !prev[msg.id]
                                  }));
                                }}
                                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-black/30 hover:bg-black/50 border border-white/10 text-xs font-black text-amber-secondary uppercase tracking-wider transition-all cursor-pointer"
                              >
                                <span className="flex items-center gap-2">
                                  <ClipboardList className="w-4 h-4 text-amber-primary" /> 
                                  Protocolo Técnico de Acción Encontrado ({msg.protocol.length} pasos)
                                </span>
                                <span className="text-[9.5px]">{expandedProtocols[msg.id] ? '▲ Ocultar' : '▼ Expandir'}</span>
                              </button>

                              {expandedProtocols[msg.id] && (
                                <motion.div 
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-3 p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3 animate-fade-in"
                                >
                                  {msg.protocol.map((step, i) => (
                                    <div key={i} className="flex gap-3.5 items-start">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-linear-to-br from-amber-primary to-amber-tertiary text-black flex items-center justify-center font-black text-[10px] shadow-[0_0_10px_rgba(245,166,35,0.4)]">
                                        {i + 1}
                                      </div>
                                      <p className="text-xs md:text-sm text-soft-text leading-relaxed pt-0.5">{step}</p>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="self-start items-start max-w-[80%]"
                      >
                        <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/10 text-amber-secondary">
                          <Bot className="w-3 h-3" /> Procesando Bio-Datos...
                        </div>
                        <div className="p-6 rounded-[2rem] glass">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-primary animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-2 h-2 rounded-full bg-amber-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 rounded-full bg-amber-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>
              </div>
            )}

            {/* 2. COMITÉ DE I+D CREATIVO (BRAINSTORMING & EVALUATION) */}
            {activeDepartment === 'rd' && (
              <div className="space-y-6 animate-fade-in">
                {!isOnline && (
                  <div className="p-5 rounded-[2rem] border border-amber-primary/30 bg-amber-primary/5 flex gap-3.5 items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-amber-secondary">Comité de I+D en Pausa</h4>
                      <p className="text-[11px] text-muted-text leading-relaxed">
                        Este módulo requiere conexión activa a Internet para que nuestro panel de expertos creativos (Alquimia, Marketing y Modelado Financiero) procese nuevas hipótesis de destilación. Entretanto, puede leer con normalidad sus propuestas previamente guardadas en la barra inferior.
                      </p>
                    </div>
                  </div>
                )}

                {/* R&D Header Info */}
                <section className="relative p-7 rounded-[2rem] bg-amber-primary/[0.03] border border-amber-primary/20 backdrop-blur-3xl overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-primary/10 flex items-center justify-center text-amber-primary shrink-0">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 font-display">Comité Creativo de I+D</h2>
                      <p className="text-xs leading-relaxed text-muted-text">
                        Nuestras tres mentes inquietas idearán tequilas de edición limitada, propuestas vanguardistas o evaluarán las hipótesis que usted les proponga para validar su viabilidad bajo la NOM.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Pitch Submission Field */}
                <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-secondary">Proponer Hipótesis de Producción</h3>
                  <textarea
                    rows={3}
                    value={userIdeaPitch}
                    onChange={(e) => setUserIdeaPitch(e.target.value)}
                    disabled={!isOnline}
                    placeholder={isOnline ? "Ej. Añejar tequila blanco en barricas de roble húngaro que albergaron vino de hielo dulce, tatemando previamente las piñas con madera de cerezo silvestre..." : "⚠️ Sin conexión. Ingrese a internet para redactar propuestas y compartirlas con el comité."}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs md:text-sm text-white focus:outline-none focus:border-amber-primary transition-all placeholder:text-soft-text/40 resize-none leading-relaxed disabled:opacity-40"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[10px] text-soft-text opacity-75">Las ideas se analizan con Alquimia, Marketing y Sustentabilidad Directa.</span>
                    <button
                      onClick={() => handleRdGenerate(userIdeaPitch)}
                      disabled={isRdLoading || !userIdeaPitch.trim() || !isOnline}
                      className="px-5 py-2.5 rounded-xl bg-linear-to-br from-amber-primary to-amber-tertiary text-black text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer disabled:opacity-30"
                    >
                      {isRdLoading ? 'Analizando...' : !isOnline ? 'Sin Conexión' : 'Enviar Propuesta'}
                    </button>
                  </div>
                </div>

                {/* Preset categories spontaneous brainstorming */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-soft-text">Solicitar Ideas Espontáneas del Comité</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { cat: 'Edición Limitada', desc: 'Botellas de colección y cosechas únicas', emoji: '💎' },
                      { cat: 'Concepto de Venta', desc: 'Modelos disruptivos e interactivos', emoji: '📣' },
                      { cat: 'Innovación Química/Destilación', desc: 'Procesos atípicos y fusiones', emoji: '⚗️' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRdGenerate(undefined, item.cat)}
                        disabled={isRdLoading || !isOnline}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-primary/45 hover:bg-amber-primary/[0.02] text-left transition-all duration-300 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-lg">{item.emoji}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-amber-secondary bg-amber-secondary/5 px-2 py-0.5 rounded-full">Solicitar</span>
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-primary transition-colors">{item.cat}</h4>
                        <p className="text-[10px] text-muted-text mt-0.5 opacity-80">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loading state for R&D */}
                {isRdLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 rounded-3xl glass border border-amber-primary/20 text-center space-y-4"
                  >
                    <div className="relative w-12 h-12 mx-auto">
                      <div className="absolute inset-0 rounded-full border-2 border-amber-primary/20" />
                      <div className="absolute inset-0 rounded-full border-2 border-t-amber-primary animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-amber-primary">Comité Deliberando</p>
                      <p className="text-[11px] text-muted-text animate-pulse">
                        El Alquimista afina la fermentación, Sofía delinea el empaque y Mateo calcula costos...
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Ideas selector history in-page */}
                {rdIdeas.length > 0 && !isRdLoading && (
                  <div className="flex gap-2 items-center overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-[10px] font-black uppercase tracking-widest text-soft-text shrink-0 mr-1">Conceptos en sesión:</span>
                    {rdIdeas.map((idea, idx) => {
                      const isSel = selectedRdIdea?.ideaTitle === idea.ideaTitle;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedRdIdea(idea)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold whitespace-nowrap transition-all border ${
                            isSel 
                            ? 'bg-amber-primary/10 border-amber-primary text-white font-black' 
                            : 'bg-white/5 border-white/5 text-muted-text hover:bg-white/10'
                          }`}
                        >
                          🍾 {idea.ideaTitle}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Showing evaluated active idea */}
                {selectedRdIdea && !isRdLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Main concept board */}
                    <div className="p-6 rounded-[2rem] border border-amber-secondary/20 bg-linear-to-br from-black/80 via-black/40 to-transparent shadow-xl">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-primary/15 border border-amber-primary/30 text-[9px] font-black uppercase tracking-wider text-amber-secondary">
                          {selectedRdIdea.category}
                        </span>
                        <span className="text-[9px] font-bold text-soft-text uppercase">Concepto I+D</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-widest font-display mb-1">{selectedRdIdea.ideaTitle}</h3>
                      <p className="text-xs italic text-soft-text leading-relaxed border-l-2 border-amber-primary/30 pl-3">{selectedRdIdea.concept}</p>
                      
                      {/* Specialists opinions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-1.5">
                            <span>⚗️</span> Xavier "El Alquimista"
                          </h4>
                          <p className="text-[11px] leading-relaxed text-slate-300">{selectedRdIdea.specialists.alchemist}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-orange-950/20 border border-amber-500/20">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1.5">
                            <span>🎨</span> Sofía "La Conceptual"
                          </h4>
                          <p className="text-[11px] leading-relaxed text-slate-300">{selectedRdIdea.specialists.conceptual}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1 flex items-center gap-1.5">
                            <span>♻️</span> Mateo "El Visionario"
                          </h4>
                          <p className="text-[11px] leading-relaxed text-slate-300">{selectedRdIdea.specialists.visionary}</p>
                        </div>
                      </div>

                      {/* Score dials */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-soft-text">
                            <span>Viabilidad Técnica</span>
                            <span>{selectedRdIdea.feasibilityScore.technical}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedRdIdea.feasibilityScore.technical}%` }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-soft-text">
                            <span>Atracción Comercial</span>
                            <span>{selectedRdIdea.feasibilityScore.commercial}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedRdIdea.feasibilityScore.commercial}%` }} />
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5 px-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-soft-text">Costo Estimado</span>
                          <span className="text-xs font-black text-amber-primary px-2.5 py-0.5 rounded-full bg-amber-primary/10 tracking-widest">{selectedRdIdea.feasibilityScore.cost}</span>
                        </div>
                      </div>

                      {/* Collective verdict */}
                      <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-primary/10 text-amber-primary flex items-center justify-center font-black shrink-0">🤝</div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-secondary">Veredicto Colectivo del Comité</h4>
                          <p className="text-xs text-muted-text mt-0.5 italic">{selectedRdIdea.verdict}</p>
                        </div>
                      </div>

                      {/* Golden Commission CTA Trigger */}
                      <div className="mt-8 text-center">
                        <button
                          onClick={() => handleCommissionReport(selectedRdIdea)}
                          disabled={!isOnline}
                          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-linear-to-br from-amber-primary via-amber-secondary to-amber-tertiary text-black font-black text-xs md:text-sm uppercase tracking-widest shadow-lg hover:shadow-amber-primary/20 brightness-110 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FileText className="w-4 h-4" /> {isOnline ? 'Redactar Informe Profesional e Diapositivas' : 'Redacción Suspendida (Requiere Internet)'}
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* 3. DEPARTAMENTO DE INFORMES (AUTOMATED CORPORATE REPORTS) */}
            {activeDepartment === 'reports' && (
              <div className="space-y-6 animate-fade-in">
                {!isOnline && (
                  <div className="p-5 rounded-[2rem] border border-amber-primary/30 bg-amber-primary/5 flex gap-3.5 items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-amber-secondary">Redactor de Dossiers en Pausa</h4>
                      <p className="text-[11px] text-muted-text leading-relaxed">
                        La recopilación y redacción automatizada de dossiers ejecutivos sobre la NOM e innovaciones comerciales de alta gama requiere conexión de red activa. Puede leer e imprimir los dossiers previamente emitidos que se encuentran desplegados abajo.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Custom topic prompt in reports screen too */}
                <section className="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                  <h3 className="text-xs font-black uppercase tracking-widest text-soft-text mb-3">Redacción Directa de Informe Especial</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customReportTopic}
                      onChange={(e) => setCustomReportTopic(e.target.value)}
                      disabled={!isOnline}
                      placeholder={isOnline ? "Ej. Estudio de molienda tradicional en tahona de piedra volcánica vs molino de rodillos" : "⚠️ Sin conexión. Restablezca el internet para redactar nuevos dossiers."}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-soft-text/40 focus:outline-none focus:border-amber-primary disabled:opacity-40"
                    />
                    <button
                      onClick={handleCustomReport}
                      disabled={isReportLoading || !customReportTopic.trim() || !isOnline}
                      className="px-4 py-2 bg-amber-primary hover:bg-amber-secondary text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer disabled:opacity-30"
                    >
                      Generar Dossier
                    </button>
                  </div>
                </section>

                {/* Loading state */}
                {isReportLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 text-center space-y-4 rounded-3xl glass border border-amber-primary/20"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-primary animate-spin mx-auto flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-amber-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-amber-primary">Redactando Dossier Oficial</p>
                      <p className="text-[11px] text-muted-text animate-pulse">
                        Sintetizando justificaciones de la NOM, procesos térmicos del tatemado y flujos de empaque comercial...
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Displaying Report */}
                {activeReport && !isReportLoading && (
                  <motion.article 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 md:p-10 rounded-[2.5rem] bg-stone-950/80 border border-white/10 shadow-2xl relative"
                  >
                    {/* Executive Header Decoration */}
                    <div className="absolute top-6 right-6 border border-amber-primary/30 rounded px-2.5 py-1 text-[9px] font-black text-amber-primary tracking-widest font-mono select-none">
                      {activeReport.dossierCode}
                    </div>

                    <div className="border-b border-white/10 pb-6 mb-6">
                      <p className="text-[9px] font-black tracking-widest text-soft-text uppercase">INFORME TÉCNICO Y COMERCIAL DE INNOVACIÓN</p>
                      <h2 className="text-3xl font-bold tracking-tight text-white font-display mt-1">{activeReport.title}</h2>
                      <div className="flex gap-4 items-center mt-3 text-[10px] text-soft-text/80 font-mono">
                        <span>Código: <strong>{activeReport.dossierCode}</strong></span>
                        <span>•</span>
                        <span>Fecha: <strong>{activeReport.date}</strong></span>
                        <span>•</span>
                        <span>Estatus: <strong className="text-emerald-400 uppercase font-bold">Aprobado / NOM Ok</strong></span>
                      </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="p-5 italic rounded-2xl bg-amber-primary/[0.02] border-l-4 border-amber-primary/40 text-xs md:text-sm leading-relaxed text-soft-text/90 mb-8">
                      <strong className="block text-[10px] not-italic font-black uppercase tracking-widest text-amber-primary mb-1">Resumen Ejecutivo</strong>
                      {activeReport.executiveSummary}
                    </div>

                    {/* Sections */}
                    <div className="space-y-8">
                      {activeReport.sections.map((sec: any, i: number) => (
                        <div key={i} className="space-y-2">
                          <h3 className="text-sm md:text-base font-black text-white tracking-wide border-b border-white/5 pb-1 font-display">
                            {sec.heading}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-text leading-relaxed whitespace-pre-wrap">{sec.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recommendations Strategic List */}
                    <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-secondary flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-primary" /> Recomendaciones Estratégicas para Inversionistas
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {activeReport.recommendations.map((rec: string, idx: number) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex gap-3 items-start hover:border-amber-primary/20 transition-all">
                            <span className="w-5 h-5 rounded-full bg-amber-primary/10 text-amber-secondary text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-xs text-muted-text font-medium leading-relaxed">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Export / Download Buttons inside Report view */}
                    <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-3 justify-end items-center">
                      <button
                        onClick={() => setActiveDepartment('slides')}
                        className="px-5 py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Presentation className="w-4 h-4" /> Ver Slides de Pitch
                      </button>
                      <button
                        onClick={downloadReportTxt}
                        className="px-5 py-3 rounded-xl bg-linear-to-br from-amber-primary to-amber-tertiary text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:brightness-110 cursor-pointer transition-all"
                      >
                        <Download className="w-4 h-4" /> Guardar para NotebookLM (.txt)
                      </button>
                    </div>

                  </motion.article>
                )}

                {!activeReport && !isReportLoading && (
                  <div className="p-12 text-center space-y-2 rounded-3xl glass border border-white/5">
                    <p className="text-xs text-muted-text">No hay ningún dossier técnico comisionado todavía.</p>
                    <p className="text-[10px] text-soft-text">Vaya a la sección de Comité I+D Creativo, pitchée o genere un tequila innovador, y presione 'Redactar Informe'.</p>
                  </div>
                )}

              </div>
            )}

            {/* 4. NOTEBOOKLM HUB & PRESENTACIONES (SLIDES) */}
            {activeDepartment === 'slides' && (
              <div className="space-y-6 animate-fade-in">
                {!isOnline && (
                  <div className="p-5 rounded-[2rem] border border-amber-primary/30 bg-amber-primary/5 flex gap-3.5 items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-amber-secondary">Presentaciones de Pitch en Crianza de Datos Estáticos</h4>
                      <p className="text-[11px] text-muted-text leading-relaxed">
                        Este módulo dinámico está operando de forma estática y offline para conservar energía de la batería de su teléfono. Puede visualizar sus diapositivas generadas previamente y copiar las notas curriculares de NotebookLM con total libertad.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Loader */}
                {isSlidesLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 text-center space-y-4 rounded-3xl glass border border-amber-primary/20"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-t-amber-primary animate-spin mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-amber-primary">Trazando Presentación Ejecutiva</p>
                      <p className="text-[11px] text-muted-text">Diagramando láminas de pitch corporativo y afinando consejos de diseño visual...</p>
                    </div>
                  </motion.div>
                )}

                {/* Slides active presentation board */}
                {activePresentation && !isSlidesLoading && (
                  <div className="space-y-6">
                    <div className="bg-black/60 border border-white/15 p-1 rounded-3xl overflow-hidden shadow-2xl">
                      
                      {/* Interactive slide deck */}
                      <div className="aspect-video w-full bg-linear-to-b from-stone-900 to-black p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
                        
                        {/* Background structural lines */}
                        <div className="absolute inset-0 border border-white/[0.02] pointer-events-none" />
                        <div className="absolute top-[1.5px] left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-amber-primary/20 to-transparent" />
                        
                        {/* Top slider header info */}
                        <div className="flex justify-between items-start z-10">
                          <div>
                            <span className="text-[10px] font-mono tracking-widest font-black uppercase text-amber-primary/80">LÁMINA DE PITCH EXCLUSIVA</span>
                            <h4 className="text-xs font-bold text-soft-text truncate max-w-[200px] sm:max-w-xs">{activePresentation.deckTitle}</h4>
                          </div>
                          <span className="text-xs font-bold px-3 py-1 rounded bg-white/5 border border-white/5 font-mono text-soft-text">
                            {currentSlideIndex + 1} / {activePresentation.slides.length}
                          </span>
                        </div>

                        {/* Slide center payload */}
                        <div className="space-y-3 my-4 md:my-0 z-10 max-w-2xl">
                          <p className="text-[10px] font-mono tracking-widest font-black uppercase text-emerald-400 flex items-center gap-1">
                            <span>●</span> Diapositiva {activePresentation.slides[currentSlideIndex].slideNum}
                          </p>
                          <h3 className="text-xl md:text-3xl font-extrabold tracking-tight text-white font-display leading-tight">{activePresentation.slides[currentSlideIndex].title}</h3>
                          <p className="text-xs md:text-sm text-soft-text italic tracking-wide">{activePresentation.slides[currentSlideIndex].subtitle}</p>
                          
                          <div className="space-y-2 pt-2">
                            {activePresentation.slides[currentSlideIndex].bullets.map((bull: string, bidx: number) => (
                              <div key={bidx} className="flex gap-2 items-start">
                                <span className="text-amber-primary text-sm mt-0.5 shrink-0">◇</span>
                                <span className="text-xs md:text-sm text-slate-200 leading-relaxed font-mono tracking-wide">{bull}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Slide tips */}
                        <div className="pt-4 border-t border-white/5 flex flex-wrap justify-between items-center z-10 gap-2">
                          <p className="text-[9px] text-soft-text leading-relaxed max-w-md bg-white/5 p-2 rounded-xl border border-white/5 italic">
                            💡 Concepto visual sugerido: {activePresentation.slides[currentSlideIndex].visualTip}
                          </p>
                          
                          {/* Slide Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                              disabled={currentSlideIndex === 0}
                              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setCurrentSlideIndex(prev => Math.min(activePresentation.slides.length - 1, prev + 1))}
                              disabled={currentSlideIndex === activePresentation.slides.length - 1}
                              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Connection to NotebookLM Guide Panel */}
                    <section className="p-6 rounded-[2rem] border border-amber-primary/20 bg-linear-to-br from-black to-stone-950/40 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-primary/5 blur-xl rounded-full" />
                      <div className="space-y-4">
                        <div className="flex gap-2.5 items-center">
                          <span className="p-2 rounded-xl bg-amber-primary/10 text-amber-primary">💡</span>
                          <h3 className="text-sm font-black uppercase tracking-widest text-amber-secondary">Manual de Ingestación NotebookLM</h3>
                        </div>
                        
                        <p className="text-xs leading-relaxed text-muted-text">
                          NotebookLM (de Google) es una libreta virtual que genera automáticamente resúmenes y un <strong>Podcast de audio fotorrealista (dos locutores discutiendo su idea)</strong>. Su informe premium de I+D de tequila está 100% pre-formateado abajo para que NotebookLM lo asimile con máxima fidelidad.
                        </p>

                        <div className="space-y-2 bg-black/50 p-4 rounded-xl border border-white/5 text-[11px] text-soft-text leading-relaxed font-mono">
                          <p className="font-bold text-white">Instrucciones de exportación rápida:</p>
                          <ol className="list-decimal pl-4 space-y-1">
                            <li>Presione <strong>"Copiar Ingestión Completa"</strong> para almacenar el paquete compilado en su portapapeles.</li>
                            <li>Visite la página oficial de NotebookLM en Google.</li>
                            <li>Cree una nueva libreta, elija fuente "Texto pegado" y suelte la información allí.</li>
                            <li>¡Presione generar audio de Podcast y disfrute de la opinión interactiva de sus procesos!</li>
                          </ol>
                        </div>

                        {/* Export Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            onClick={() => copyToClipboard(getNotebookLmText())}
                            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <Copy className="w-4 h-4" /> {copiarExito ? '¡Copiado con éxito! ✓' : 'Copiar Ingestión Completa'}
                          </button>
                          <button
                            onClick={downloadReportTxt}
                            className="px-5 py-3 rounded-xl bg-linear-to-br from-amber-primary to-amber-tertiary text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:brightness-110 cursor-pointer transition-all"
                          >
                            <Download className="w-4 h-4" /> Descargar Archivo Ingesta .TXT
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* Live source preview panel */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-soft-text">Previsualización de Documento Fuente para NotebookLM</h4>
                      <pre className="p-4 rounded-2xl bg-black/60 border border-white/5 text-[10px] text-soft-text/80 max-h-48 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed select-all cursor-pointer" title="Haga click para copiar">
                        {getNotebookLmText()}
                      </pre>
                    </div>

                  </div>
                )}

                {!activePresentation && !isSlidesLoading && (
                  <div className="p-12 text-center space-y-2 rounded-3xl glass border border-white/5">
                    <p className="text-xs text-muted-text">No hay ninguna presentación ejecutiva generada todavía.</p>
                    <p className="text-[10px] text-soft-text">Genere un informe de I+D en las pestañas anteriores para diseñar automáticamente estas diapositivas compatibles con NotebookLM.</p>
                  </div>
                )}

              </div>
            )}

            {/* 5. BUSCADOR Y COMPARATIVO NOM (DURABLE STATIC COMPLIANCE DATABASE) */}
            {activeDepartment === 'nom_db' && (
              <div className="animate-fade-in">
                <NomSearchCompare isOnline={isOnline} />
              </div>
            )}

          </div>
        </main>

        {/* Input Area */}
        {activeDepartment === 'nom' && (
          <footer className="relative p-4 md:p-6 bg-linear-to-t from-bg via-bg/95 to-transparent z-20 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-4">
              {!isOnline && (
                <div className="flex items-center gap-1.5 justify-center py-2 px-4 rounded-full bg-amber-primary/10 border border-amber-primary/20 text-amber-secondary text-[9px] md:text-[10.5px] font-black uppercase tracking-wider animate-pulse max-w-max mx-auto">
                  <WifiOff className="w-3.5 h-3.5 shrink-0" /> Modo Sin Conexión Activo — Usando Base de Datos local preinstalada
                </div>
              )}

              <div className="flex flex-col gap-2 items-center">
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-amber-secondary hover:text-white transition-all cursor-pointer shadow-md"
                >
                  <span>{showSuggestions ? '🙈 Ocultar Temas de Práctica' : '💡 Sugerencias de Temas de Práctica'}</span>
                </button>

                {showSuggestions && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none justify-center animate-fade-in w-full">
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          handleSuggestion(s);
                          setShowSuggestions(false); // Auto close to restore screen space instantly
                        }}
                        className="px-3 py-1.5 rounded-full bg-amber-primary/5 hover:bg-amber-primary/15 border border-amber-primary/10 hover:border-amber-primary/30 text-[10px] font-bold text-soft-text whitespace-nowrap transition-all cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-2 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl flex items-center gap-3 shadow-2xl focus-within:border-amber-primary/50 transition-colors">
                <div className="flex items-center gap-1 pl-2">
                  {[
                    { icon: ImageIcon, label: 'Imagen' },
                    { icon: Video, label: 'Video' },
                    { icon: Mic, label: 'Voz' },
                  ].map((btn, i) => (
                    <button key={i} className="p-2.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer">
                      <btn.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
                
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isOnline ? `Describe el problema en ${activeStage}...` : `Buscar en la Base de Datos Local sobre ${activeStage}...`}
                  className="flex-1 bg-transparent border-none outline-none text-sm md:text-base text-white placeholder:text-soft-text/50 py-3"
                />
                
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-br from-amber-primary to-amber-tertiary text-black font-black text-sm uppercase tracking-wider shadow-[0_10px_20px_rgba(245,166,35,0.3)] disabled:opacity-50 disabled:shadow-none hover:brightness-110 transition-all cursor-pointer"
                >
                  <span className="hidden md:inline">{isOnline ? 'Consultar' : 'Buscar Local'}</span> <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

