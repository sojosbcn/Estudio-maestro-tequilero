import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Users, 
  Megaphone, 
  ClipboardList, 
  Layers, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  LogOut, 
  AlertCircle,
  FileText,
  UserCheck,
  CheckCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { 
  googleSignIn, 
  logout, 
  initAuth, 
  getAccessToken, 
  CLASSROOM_SCOPES 
} from '../classroomAuth';
import { User as FirebaseUser } from 'firebase/auth';

interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  courseState: string;
  alternateLink?: string;
  creationTime?: string;
}

interface CourseWork {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  state: string;
  alternateLink?: string;
  maxPoints?: number;
  workType: string;
}

interface Announcement {
  id: string;
  courseId: string;
  text: string;
  creationTime: string;
  alternateLink?: string;
}

interface ClassroomTopic {
  courseId: string;
  topicId: string;
  name: string;
}

interface ClassroomUser {
  userId: string;
  profile: {
    name: {
      fullName: string;
    };
    emailAddress: string;
    photoUrl?: string;
  };
}

export default function ClassroomManager() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Classroom data state
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);
  const [activeCourseTab, setActiveCourseTab] = useState<'work' | 'announcements' | 'roster' | 'topics'>('work');

  // Selected course details
  const [courseWork, setCourseWork] = useState<CourseWork[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [topics, setTopics] = useState<ClassroomTopic[]>([]);
  const [students, setStudents] = useState<ClassroomUser[]>([]);
  const [teachers, setTeachers] = useState<ClassroomUser[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Forms states
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseSection, setNewCourseSection] = useState('');
  const [newCourseHeading, setNewCourseHeading] = useState('');
  const [newCourseRoom, setNewCourseRoom] = useState('');
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);

  const [isCreatingWork, setIsCreatingWork] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [newWorkDesc, setNewWorkDesc] = useState('');
  const [newWorkPoints, setNewWorkPoints] = useState(100);
  const [isSubmittingWork, setIsSubmittingWork] = useState(false);

  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);
  const [newAnnouncementText, setNewAnnouncementText] = useState('');
  const [isSubmittingAnnouncement, setIsSubmittingAnnouncement] = useState(false);

  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);

  // Suggested courses & tasks for rapid insertion
  const SUGGESTED_COURSES = [
    { name: 'Maestría en NOM-006-SCFI-2012', section: 'Módulo Técnico', heading: 'Control de calidad, graduación alcohólica y especificaciones en la producción de Tequila.', room: 'Sala Alambique' },
    { name: 'Taller de Jima y Agricultura de Agave', section: 'Módulo de Campo', heading: 'Selección de hijuelos, cultivo de Agave tequilana Weber variedad azul y técnicas de jima.', room: 'Campo El Arenal' },
    { name: 'Curso de Sommelier y Catado de Tequila', section: 'Módulo Sensorial', heading: 'Evaluación organoléptica, perfiles de blanco, reposado, añejo y extra añejo.', room: 'Cava de Maduración' }
  ];

  const SUGGESTED_TASKS = [
    { title: 'Análisis Práctico de Grados Brix', desc: 'Realiza una medición en campo del jugo de agave cocido utilizando refractómetro. Elabora un reporte con el porcentaje de azúcares reductores totales.', points: 100 },
    { title: 'Diferencias NOM: Tequila vs Mezcal', desc: 'Elabora un cuadro comparativo donde detalles las principales diferencias de denominación de origen, materias primas permitidas, áreas geográficas y tipos de destilación entre la NOM-006-SCFI (Tequila) y la NOM-070-SCFI (Mezcal).', points: 100 },
    { title: 'Prueba Organoléptica de Destilado', desc: 'A partir de un lote muestra de Tequila Blanco recién destilado en alambique de cobre, describe el perfil aromático (notas cítricas, herbales, cocidas) y la persistencia en boca.', points: 100 }
  ];

  // Initialize auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setNeedsAuth(false);
        fetchCourses(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        fetchCourses(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user' || err.message?.includes('popup-closed-by-user')) {
        setError('El inicio de sesión se canceló porque la ventana emergente fue cerrada. Por favor, vuelve a intentarlo sin cerrar la ventana de Google.');
      } else {
        setError('Error al iniciar sesión con Google Classroom. Revisa los permisos e inténtalo de nuevo.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setCourses([]);
      setSelectedCourse(null);
    } catch (err) {
      console.error(err);
    }
  };

  // API calls
  const fetchCourses = async (accessToken: string) => {
    setIsLoadingCourses(true);
    setError(null);
    try {
      const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err: any) {
      console.error(err);
      setError('No se pudieron cargar los cursos de Google Classroom. Verifica tu conexión.');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const fetchCourseDetails = async (courseId: string) => {
    if (!token) return;
    setIsLoadingDetails(true);
    setError(null);
    try {
      // 1. Fetch CourseWork
      const cwRes = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cwData = await cwRes.json();
      setCourseWork(cwData.courseWork || []);

      // 2. Fetch Announcements
      const annRes = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const annData = await annRes.json();
      setAnnouncements(annData.announcements || []);

      // 3. Fetch Topics
      const topicRes = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/topics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const topicData = await topicRes.json();
      setTopics(topicData.topic || []);

      // 4. Fetch Teachers
      const tRes = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tData = await tRes.json();
      setTeachers(tData.teachers || []);

      // 5. Fetch Students
      const sRes = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sData = await sRes.json();
      setStudents(sData.students || []);

    } catch (err) {
      console.error(err);
      setError('Error al obtener los detalles del curso de Classroom.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newCourseName.trim()) return;

    setIsSubmittingCourse(true);
    setError(null);
    try {
      const res = await fetch('https://classroom.googleapis.com/v1/courses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newCourseName,
          section: newCourseSection || undefined,
          descriptionHeading: newCourseHeading || undefined,
          room: newCourseRoom || undefined,
          ownerId: 'me',
          courseState: 'ACTIVE'
        })
      });

      if (!res.ok) {
        const errDetail = await res.json();
        throw new Error(errDetail?.error?.message || 'Error creating course');
      }

      const created = await res.json();
      setCourses(prev => [created, ...prev]);
      setIsCreatingCourse(false);
      setNewCourseName('');
      setNewCourseSection('');
      setNewCourseHeading('');
      setNewCourseRoom('');
      
      // Auto-select the newly created course
      setSelectedCourse(created);
      fetchCourseDetails(created.id);
    } catch (err: any) {
      console.error(err);
      setError(`No se pudo crear el curso: ${err.message || 'Error del servidor de Google'}`);
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const handleCreateWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedCourse || !newWorkTitle.trim()) return;

    setIsSubmittingWork(true);
    setError(null);
    try {
      const res = await fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/courseWork`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newWorkTitle,
          description: newWorkDesc || undefined,
          workType: 'ASSIGNMENT',
          state: 'PUBLISHED',
          maxPoints: newWorkPoints || undefined
        })
      });

      if (!res.ok) {
        const errDetail = await res.json();
        throw new Error(errDetail?.error?.message || 'Error creating coursework');
      }

      const created = await res.json();
      setCourseWork(prev => [created, ...prev]);
      setIsCreatingWork(false);
      setNewWorkTitle('');
      setNewWorkDesc('');
      setNewWorkPoints(100);
    } catch (err: any) {
      console.error(err);
      setError(`No se pudo publicar la tarea: ${err.message}`);
    } finally {
      setIsSubmittingWork(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedCourse || !newAnnouncementText.trim()) return;

    setIsSubmittingAnnouncement(true);
    setError(null);
    try {
      const res = await fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/announcements`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: newAnnouncementText,
          state: 'PUBLISHED'
        })
      });

      if (!res.ok) throw new Error('Error creating announcement');
      const created = await res.json();
      setAnnouncements(prev => [created, ...prev]);
      setIsCreatingAnnouncement(false);
      setNewAnnouncementText('');
    } catch (err: any) {
      console.error(err);
      setError('No se pudo publicar el anuncio en Classroom.');
    } finally {
      setIsSubmittingAnnouncement(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedCourse || !newTopicName.trim()) return;

    setIsSubmittingTopic(true);
    setError(null);
    try {
      const res = await fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/topics`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newTopicName
        })
      });

      if (!res.ok) throw new Error('Error creating topic');
      const created = await res.json();
      setTopics(prev => [created, ...prev]);
      setIsCreatingTopic(false);
      setNewTopicName('');
    } catch (err: any) {
      console.error(err);
      setError('No se pudo crear el tema.');
    } finally {
      setIsSubmittingTopic(false);
    }
  };

  // Destructive operations require explicit confirmation
  const handleDeleteCourseWork = async (courseWorkId: string, title: string) => {
    const userConfirmed = window.confirm(
      `¿Está absolutamente seguro de que desea eliminar la tarea "${title}" en Google Classroom? Esta operación modificará los datos del curso de forma permanente.`
    );
    if (!userConfirmed) return;

    if (!token || !selectedCourse) return;
    setError(null);
    try {
      const res = await fetch(`https://classroom.googleapis.com/v1/courses/${selectedCourse.id}/courseWork/${courseWorkId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete coursework');
      setCourseWork(prev => prev.filter(w => w.id !== courseWorkId));
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar la tarea seleccionada.');
    }
  };

  const handleSelectCourse = (course: ClassroomCourse) => {
    setSelectedCourse(course);
    fetchCourseDetails(course.id);
  };

  const applySuggestedCourse = (sug: typeof SUGGESTED_COURSES[0]) => {
    setNewCourseName(sug.name);
    setNewCourseSection(sug.section);
    setNewCourseHeading(sug.heading);
    setNewCourseRoom(sug.room);
  };

  const applySuggestedTask = (sug: typeof SUGGESTED_TASKS[0]) => {
    setNewWorkTitle(sug.title);
    setNewWorkDesc(sug.desc);
    setNewWorkPoints(sug.points);
  };

  return (
    <div id="classroom-manager-root" className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141210] border border-white/5 rounded-xl p-4 md:p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-primary/10 rounded-xl border border-amber-primary/20">
            <GraduationCap className="h-6 w-6 text-amber-secondary animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Academia del Tequila <span className="text-xs font-normal text-amber-secondary px-2 py-0.5 rounded-full bg-amber-secondary/10 border border-amber-secondary/20">Google Classroom</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Sincroniza y organiza cursos, tareas, normativas y expedientes educativos de forma segura.</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 bg-[#1e1b18] border border-white/5 px-4 py-2 rounded-xl text-xs">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="h-7 w-7 rounded-full border border-amber-primary/40" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-7 w-7 rounded-full bg-amber-primary/10 flex items-center justify-center text-amber-secondary">
                <User className="h-4 w-4" />
              </div>
            )}
            <div className="text-left hidden sm:block">
              <p className="font-bold text-gray-200">{user.displayName || 'Docente'}</p>
              <p className="text-[10px] text-gray-500">{user.email || ''}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
              title="Desconectar cuenta"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-red-200 text-xs shadow-lg"
        >
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">{error}</div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-white font-bold px-2 py-1">✕</button>
        </motion.div>
      )}

      {/* REQUERIR LOGIN */}
      {needsAuth ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#141210] border border-white/5 rounded-2xl text-center space-y-6 shadow-2xl">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-primary/20 blur-xl rounded-full"></div>
            <div className="relative p-6 bg-[#1e1b18] rounded-2xl border border-amber-primary/20">
              <GraduationCap className="h-12 w-12 text-amber-secondary" />
            </div>
          </div>
          
          <div className="max-w-md space-y-2">
            <h3 className="text-lg font-bold text-white">Vincula tu Google Classroom</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Integra tus módulos educativos tequileros con Google Classroom. Como profesor o estudiante, podrás gestionar tareas sobre la NOM-006, calificar reportes analíticos e interactuar con tus alumnos de forma directa.
            </p>
          </div>

          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="gsi-material-button scale-105 active:scale-95 transition-transform"
          >
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className="gsi-material-button-contents font-sans font-medium text-sm text-[#1f1f1f]">
                {isLoggingIn ? 'Conectando...' : 'Iniciar Sesión con Google'}
              </span>
            </div>
          </button>
        </div>
      ) : (
        /* PANEL PRINCIPAL AUTENTICADO */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: LISTA DE CURSOS */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex justify-between items-center bg-[#141210] p-4 border border-white/5 rounded-xl">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-amber-secondary" /> Cursos Activos
              </h3>
              <button 
                onClick={() => setIsCreatingCourse(!isCreatingCourse)}
                className="flex items-center gap-1 bg-amber-primary hover:bg-amber-secondary text-black text-xs font-bold px-2.5 py-1 rounded-lg transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> Nuevo Curso
              </button>
            </div>

            {/* FORMULARIO CREAR CURSO */}
            <AnimatePresence>
              {isCreatingCourse && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCreateCourse}
                  className="bg-[#141210] border border-amber-primary/20 p-4 rounded-xl space-y-3 overflow-hidden text-xs"
                >
                  <h4 className="font-bold text-amber-secondary mb-1">Crear Curso Nuevo</h4>
                  
                  {/* Sugerencias Rápidas */}
                  <div className="bg-[#1e1b18] p-2.5 rounded-lg border border-white/5 space-y-1.5">
                    <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-secondary" /> Plantillas de Cátedra Tequilera:
                    </p>
                    <div className="flex flex-col gap-1">
                      {SUGGESTED_COURSES.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => applySuggestedCourse(sug)}
                          className="text-[10px] text-left text-gray-300 hover:text-amber-secondary hover:bg-white/5 p-1 rounded transition-colors truncate"
                        >
                          📚 {sug.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Nombre de la Clase (Requerido)</label>
                    <input 
                      type="text"
                      required
                      value={newCourseName}
                      onChange={e => setNewCourseName(e.target.value)}
                      placeholder="Ej: Tequila Avanzado Módulo III"
                      className="w-full bg-[#1e1b18] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Sección / Nivel</label>
                    <input 
                      type="text"
                      value={newCourseSection}
                      onChange={e => setNewCourseSection(e.target.value)}
                      placeholder="Ej: Generación 2026"
                      className="w-full bg-[#1e1b18] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Materia o Descripción Breve</label>
                    <input 
                      type="text"
                      value={newCourseHeading}
                      onChange={e => setNewCourseHeading(e.target.value)}
                      placeholder="Ej: Procesos físicos de tatemado y molienda"
                      className="w-full bg-[#1e1b18] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">Aula / Locación</label>
                    <input 
                      type="text"
                      value={newCourseRoom}
                      onChange={e => setNewCourseRoom(e.target.value)}
                      placeholder="Ej: Destilería Virtual"
                      className="w-full bg-[#1e1b18] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-primary"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmittingCourse}
                      className="flex-1 bg-amber-primary hover:bg-amber-secondary text-black font-bold py-2 rounded-lg transition-colors"
                    >
                      {isSubmittingCourse ? 'Creando curso...' : 'Confirmar e Iniciar'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsCreatingCourse(false)}
                      className="bg-[#1e1b18] hover:bg-white/5 border border-white/10 text-white font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* LISTADO DE CURSOS */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {isLoadingCourses ? (
                <div className="py-12 text-center text-xs text-gray-400 space-y-2">
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-amber-secondary border-t-transparent"></div>
                  <p>Obteniendo listado de Google Classroom...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="bg-[#141210] p-6 text-center rounded-xl border border-white/5 space-y-3">
                  <p className="text-xs text-gray-400">No tienes cursos activos en Google Classroom.</p>
                  <button 
                    onClick={() => setIsCreatingCourse(true)}
                    className="text-xs text-amber-secondary font-bold underline decoration-amber-secondary/40 hover:text-amber-primary"
                  >
                    Crea tu primer curso con una plantilla
                  </button>
                </div>
              ) : (
                courses.map((course) => {
                  const isSelected = selectedCourse?.id === course.id;
                  return (
                    <button
                      key={course.id}
                      onClick={() => handleSelectCourse(course)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col justify-between items-start gap-2 ${
                        isSelected 
                          ? 'bg-amber-primary/5 border-amber-primary shadow-lg shadow-amber-primary/5' 
                          : 'bg-[#141210] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="w-full flex justify-between items-start gap-2">
                        <span className="text-xs font-black text-white line-clamp-1 flex-1">{course.name}</span>
                        <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform ${isSelected ? 'rotate-90 text-amber-secondary' : ''}`} />
                      </div>
                      
                      {course.section && (
                        <p className="text-[10px] text-amber-secondary font-medium">{course.section}</p>
                      )}

                      {course.descriptionHeading && (
                        <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">{course.descriptionHeading}</p>
                      )}

                      <div className="w-full flex justify-between items-center border-t border-white/5 pt-2 mt-1 text-[9px] text-gray-500">
                        <span>Aula: {course.room || 'No asignada'}</span>
                        <span className="capitalize">{course.courseState.toLowerCase()}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: SELECCIÓN DE DETALLES */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!selectedCourse ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#141210] border border-white/5 rounded-2xl p-8 text-center flex flex-col items-center justify-center py-20 space-y-4"
                >
                  <div className="p-4 bg-amber-primary/5 border border-amber-primary/10 rounded-full text-amber-secondary">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <div className="max-w-xs">
                    <h4 className="font-bold text-white text-sm">Selecciona una clase o curso</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Elige un curso activo del listado de la izquierda para ver alumnos, publicar tareas evaluativas, configurar temas y comunicarte con la comunidad.
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* CURSO SELECCIONADO: MOSTRAR VISTA AVANZADA */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-[#141210] border border-white/5 rounded-2xl p-4 md:p-6 space-y-6 shadow-xl"
                >
                  {/* ENCABEZADO DE LA CLASE */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-white/5 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedCourse(null)}
                          className="lg:hidden p-1 bg-white/5 rounded-lg border border-white/10 text-gray-400 hover:text-white mr-1"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                        <h3 className="text-lg font-black tracking-tight text-white">{selectedCourse.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 items-center mt-1 text-xs text-gray-400">
                        {selectedCourse.section && (
                          <span className="text-amber-secondary font-medium">{selectedCourse.section}</span>
                        )}
                        {selectedCourse.room && (
                          <span className="text-gray-500">• Aula: {selectedCourse.room}</span>
                        )}
                        {selectedCourse.alternateLink && (
                          <a 
                            href={selectedCourse.alternateLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-amber-secondary/80 hover:text-amber-secondary flex items-center gap-0.5 transition-colors underline decoration-amber-secondary/30 text-[10px]"
                          >
                            Ver en Classroom Web <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* NAVEGACIÓN INTERNA EN PESTAÑAS */}
                  <div className="flex border-b border-white/5 pb-0 overflow-x-auto gap-2">
                    {[
                      { id: 'work', name: 'Trabajo de Clase', icon: ClipboardList },
                      { id: 'announcements', name: 'Novedades', icon: Megaphone },
                      { id: 'roster', name: 'Personas (Roster)', icon: Users },
                      { id: 'topics', name: 'Temas', icon: Layers }
                    ].map((tab) => {
                      const isActive = activeCourseTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveCourseTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                            isActive 
                              ? 'border-amber-primary text-amber-secondary bg-amber-primary/5 rounded-t-lg' 
                              : 'border-transparent text-gray-400 hover:text-white'
                          }`}
                        >
                          <tab.icon className="h-4 w-4" />
                          {tab.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* CONTENIDO INTERNO DE PESTAÑA */}
                  <div className="min-h-[300px]">
                    {isLoadingDetails ? (
                      <div className="flex flex-col items-center justify-center py-20 text-xs text-gray-400 space-y-2">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-amber-secondary border-t-transparent"></div>
                        <p>Cargando información del curso...</p>
                      </div>
                    ) : (
                      <>
                        {/* 1. TRABAJO DE CLASE (TAREAS) */}
                        {activeCourseTab === 'work' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center bg-[#1e1b18] p-3 border border-white/5 rounded-xl">
                              <span className="text-xs font-bold text-gray-300">Asignaciones de la Academia</span>
                              <button
                                onClick={() => setIsCreatingWork(!isCreatingWork)}
                                className="flex items-center gap-1 bg-amber-primary/10 hover:bg-amber-primary/20 text-amber-secondary border border-amber-primary/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <Plus className="h-4 w-4" /> Crear Tarea
                              </button>
                            </div>

                            {/* CREAR TAREA FORM */}
                            <AnimatePresence>
                              {isCreatingWork && (
                                <motion.form
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  onSubmit={handleCreateWork}
                                  className="bg-[#1c1a17] border border-amber-primary/10 p-4 rounded-xl space-y-4 text-xs overflow-hidden"
                                >
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-amber-secondary">Publicar Nueva Tarea en Google Classroom</h4>
                                    <button 
                                      type="button" 
                                      onClick={() => applySuggestedTask(SUGGESTED_TASKS[0])}
                                      className="text-[10px] text-amber-secondary hover:underline flex items-center gap-1 bg-amber-secondary/10 px-2 py-0.5 rounded border border-amber-secondary/20"
                                    >
                                      <Sparkles className="h-3 w-3" /> Auto-llenar NOM Brix
                                    </button>
                                  </div>

                                  {/* Plantillas de Tareas */}
                                  <div className="flex flex-wrap gap-1.5 bg-[#141210] p-2 rounded-lg border border-white/5">
                                    <span className="text-[10px] text-gray-400 w-full mb-1">Cargar Tarea Sugerida:</span>
                                    {SUGGESTED_TASKS.map((sug, idx) => (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => applySuggestedTask(sug)}
                                        className="text-[10px] bg-[#1e1b18] hover:bg-amber-primary/10 text-gray-300 hover:text-amber-secondary px-2 py-1 rounded border border-white/5 transition-colors text-left truncate max-w-xs"
                                      >
                                        💡 {sug.title}
                                      </button>
                                    ))}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-3">
                                      <label className="block text-[10px] text-gray-400 mb-1">Título de la Tarea</label>
                                      <input 
                                        type="text"
                                        required
                                        value={newWorkTitle}
                                        onChange={e => setNewWorkTitle(e.target.value)}
                                        placeholder="Ej: Ensayo de Madurez de Piñas de Agave"
                                        className="w-full bg-[#1e1b18] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-primary"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] text-gray-400 mb-1">Puntaje Máximo</label>
                                      <input 
                                        type="number"
                                        min={1}
                                        max={1000}
                                        required
                                        value={newWorkPoints}
                                        onChange={e => setNewWorkPoints(parseInt(e.target.value) || 100)}
                                        className="w-full bg-[#1e1b18] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-primary"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] text-gray-400 mb-1">Instrucciones / Criterios</label>
                                    <textarea 
                                      value={newWorkDesc}
                                      onChange={e => setNewWorkDesc(e.target.value)}
                                      rows={3}
                                      placeholder="Especifica los entregables, pautas de la NOM-006 a cumplir, y fecha sugerida."
                                      className="w-full bg-[#1e1b18] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-primary resize-none"
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      type="submit"
                                      disabled={isSubmittingWork}
                                      className="flex-1 bg-amber-primary hover:bg-amber-secondary text-black font-bold py-2 rounded-lg transition-colors"
                                    >
                                      {isSubmittingWork ? 'Publicando en Classroom...' : 'Publicar Tarea Oficial'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setIsCreatingWork(false)}
                                      className="bg-[#1e1b18] hover:bg-white/5 border border-white/10 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </motion.form>
                              )}
                            </AnimatePresence>

                            {/* LISTADO DE TAREAS */}
                            <div className="space-y-3">
                              {courseWork.length === 0 ? (
                                <div className="text-center py-10 bg-[#1e1b18]/40 border border-white/5 rounded-xl text-gray-400 text-xs">
                                  No hay tareas asignadas en esta clase. ¡Publica la primera para tus estudiantes!
                                </div>
                              ) : (
                                courseWork.map((work) => (
                                  <div 
                                    key={work.id}
                                    className="bg-[#1e1b18] border border-white/5 p-4 rounded-xl flex justify-between items-start gap-4 transition-all hover:border-white/10"
                                  >
                                    <div className="flex-1 text-xs">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-white text-sm">{work.title}</h4>
                                        <span className="text-[9px] bg-amber-primary/10 border border-amber-primary/20 text-amber-secondary px-2 py-0.5 rounded-full font-black">
                                          {work.maxPoints} pts
                                        </span>
                                      </div>
                                      
                                      {work.description && (
                                        <p className="text-gray-400 mt-1.5 whitespace-pre-line leading-relaxed text-[11px] max-w-2xl">{work.description}</p>
                                      )}

                                      <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-500">
                                        <span className="capitalize">Estado: {work.state.toLowerCase()}</span>
                                        {work.alternateLink && (
                                          <a 
                                            href={work.alternateLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-amber-secondary/80 hover:text-amber-secondary flex items-center gap-0.5 underline"
                                          >
                                            Ver en Classroom <ExternalLink className="h-3 w-3" />
                                          </a>
                                        )}
                                      </div>
                                    </div>

                                    {/* ACCIÓN DE BORRADO DE TAREA (REQUIERE CONFIRMACIÓN) */}
                                    <button
                                      onClick={() => handleDeleteCourseWork(work.id, work.title)}
                                      className="p-1.5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/10"
                                      title="Eliminar tarea en Classroom"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}

                        {/* 2. NOVEDADES (ANUNCIOS) */}
                        {activeCourseTab === 'announcements' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center bg-[#1e1b18] p-3 border border-white/5 rounded-xl">
                              <span className="text-xs font-bold text-gray-300">Tablón de Anuncios y Avisos</span>
                              <button
                                onClick={() => setIsCreatingAnnouncement(!isCreatingAnnouncement)}
                                className="flex items-center gap-1 bg-amber-primary/10 hover:bg-amber-primary/20 text-amber-secondary border border-amber-primary/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <Plus className="h-4 w-4" /> Publicar Aviso
                              </button>
                            </div>

                            {/* CREAR ANUNCIO FORM */}
                            <AnimatePresence>
                              {isCreatingAnnouncement && (
                                <motion.form
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  onSubmit={handleCreateAnnouncement}
                                  className="bg-[#1c1a17] border border-amber-primary/10 p-4 rounded-xl space-y-3 text-xs overflow-hidden"
                                >
                                  <h4 className="font-bold text-amber-secondary">Escribir Aviso en el Tablón</h4>
                                  <div>
                                    <textarea 
                                      value={newAnnouncementText}
                                      onChange={e => setNewAnnouncementText(e.target.value)}
                                      required
                                      rows={3}
                                      placeholder="Escribe un anuncio importante para toda la clase (ej: Mañana tendremos taller presencial de molienda de agave...)"
                                      className="w-full bg-[#1e1b18] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-primary resize-none"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      type="submit"
                                      disabled={isSubmittingAnnouncement}
                                      className="flex-1 bg-amber-primary hover:bg-amber-secondary text-black font-bold py-2 rounded-lg transition-colors"
                                    >
                                      {isSubmittingAnnouncement ? 'Publicando aviso...' : 'Publicar Anuncio'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setIsCreatingAnnouncement(false)}
                                      className="bg-[#1e1b18] hover:bg-white/5 border border-white/10 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </motion.form>
                              )}
                            </AnimatePresence>

                            {/* LISTA DE ANUNCIOS */}
                            <div className="space-y-3">
                              {announcements.length === 0 ? (
                                <div className="text-center py-10 bg-[#1e1b18]/40 border border-white/5 rounded-xl text-gray-400 text-xs">
                                  No hay anuncios publicados en el tablón de este curso.
                                </div>
                              ) : (
                                announcements.map((ann) => (
                                  <div 
                                    key={ann.id}
                                    className="bg-[#1e1b18] border border-white/5 p-4 rounded-xl space-y-2 text-xs"
                                  >
                                    <div className="flex items-start gap-2">
                                      <Megaphone className="h-4 w-4 text-amber-secondary mt-0.5 flex-shrink-0" />
                                      <p className="text-gray-200 leading-relaxed whitespace-pre-line flex-1 text-[11px]">{ann.text}</p>
                                    </div>
                                    <div className="flex items-center gap-3 pt-2 border-t border-white/5 mt-2 text-[9px] text-gray-500">
                                      <span>Creado: {new Date(ann.creationTime).toLocaleString()}</span>
                                      {ann.alternateLink && (
                                        <a 
                                          href={ann.alternateLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-amber-secondary/80 hover:text-amber-secondary flex items-center gap-0.5 underline ml-auto"
                                        >
                                          Ver en Classroom <ExternalLink className="h-2.5 w-2.5" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}

                        {/* 3. ROSTER (ALUMNOS Y PROFESORES) */}
                        {activeCourseTab === 'roster' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* PROFESORES */}
                            <div className="space-y-3">
                              <h4 className="font-bold text-amber-secondary text-xs flex items-center gap-1.5 border-b border-white/5 pb-1">
                                <UserCheck className="h-4 w-4" /> Docentes e Instructores ({teachers.length})
                              </h4>
                              {teachers.length === 0 ? (
                                <p className="text-xs text-gray-500">No se encontraron profesores.</p>
                              ) : (
                                teachers.map((teacher, idx) => (
                                  <div 
                                    key={teacher.userId || idx}
                                    className="flex items-center gap-3 p-3 bg-[#1e1b18] border border-white/5 rounded-xl"
                                  >
                                    {teacher.profile?.photoUrl ? (
                                      <img src={teacher.profile.photoUrl} alt="" className="h-8 w-8 rounded-full border border-amber-primary/25" referrerPolicy="no-referrer" />
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-amber-primary/10 flex items-center justify-center text-amber-secondary font-bold text-xs">
                                        {teacher.profile?.name?.fullName?.charAt(0) || 'P'}
                                      </div>
                                    )}
                                    <div className="text-xs">
                                      <p className="font-bold text-white">{teacher.profile?.name?.fullName || 'Profesor de la Academia'}</p>
                                      <p className="text-[10px] text-gray-500">{teacher.profile?.emailAddress}</p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* ALUMNOS */}
                            <div className="space-y-3">
                              <h4 className="font-bold text-amber-secondary text-xs flex items-center gap-1.5 border-b border-white/5 pb-1">
                                <Users className="h-4 w-4" /> Alumnos Matriculados ({students.length})
                              </h4>
                              {students.length === 0 ? (
                                <div className="text-center py-6 bg-[#1e1b18]/40 border border-white/5 rounded-xl text-gray-500 text-xs">
                                  No hay estudiantes inscritos aún en este curso.
                                </div>
                              ) : (
                                students.map((student, idx) => (
                                  <div 
                                    key={student.userId || idx}
                                    className="flex items-center gap-3 p-3 bg-[#1e1b18] border border-white/5 rounded-xl"
                                  >
                                    {student.profile?.photoUrl ? (
                                      <img src={student.profile.photoUrl} alt="" className="h-8 w-8 rounded-full border border-amber-primary/10" referrerPolicy="no-referrer" />
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-amber-primary/5 flex items-center justify-center text-amber-secondary text-xs">
                                        {student.profile?.name?.fullName?.charAt(0) || 'E'}
                                      </div>
                                    )}
                                    <div className="text-xs">
                                      <p className="font-bold text-white">{student.profile?.name?.fullName}</p>
                                      <p className="text-[10px] text-gray-500">{student.profile?.emailAddress}</p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>

                          </div>
                        )}

                        {/* 4. TEMAS */}
                        {activeCourseTab === 'topics' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center bg-[#1e1b18] p-3 border border-white/5 rounded-xl">
                              <span className="text-xs font-bold text-gray-300">Temas y Módulos Organizativos</span>
                              <button
                                onClick={() => setIsCreatingTopic(!isCreatingTopic)}
                                className="flex items-center gap-1 bg-amber-primary/10 hover:bg-amber-primary/20 text-amber-secondary border border-amber-primary/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <Plus className="h-4 w-4" /> Crear Tema
                              </button>
                            </div>

                            {/* CREAR TEMA FORM */}
                            <AnimatePresence>
                              {isCreatingTopic && (
                                <motion.form
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  onSubmit={handleCreateTopic}
                                  className="bg-[#1c1a17] border border-amber-primary/10 p-4 rounded-xl space-y-3 text-xs overflow-hidden"
                                >
                                  <h4 className="font-bold text-amber-secondary">Crear Módulo de Contenido</h4>
                                  <div>
                                    <input 
                                      type="text"
                                      value={newTopicName}
                                      onChange={e => setNewTopicName(e.target.value)}
                                      required
                                      placeholder="Ej: Unidad I: Regulación NOM y Especificaciones Químicas"
                                      className="w-full bg-[#1e1b18] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-hidden focus:border-amber-primary"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      type="submit"
                                      disabled={isSubmittingTopic}
                                      className="flex-1 bg-amber-primary hover:bg-amber-secondary text-black font-bold py-2 rounded-lg transition-colors"
                                    >
                                      {isSubmittingTopic ? 'Guardando tema...' : 'Guardar Tema'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setIsCreatingTopic(false)}
                                      className="bg-[#1e1b18] hover:bg-white/5 border border-white/10 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </motion.form>
                              )}
                            </AnimatePresence>

                            {/* LISTA DE TEMAS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {topics.length === 0 ? (
                                <div className="col-span-2 text-center py-10 bg-[#1e1b18]/40 border border-white/5 rounded-xl text-gray-400 text-xs">
                                  No hay temas definidos aún para esta clase.
                                </div>
                              ) : (
                                topics.map((topic, i) => (
                                  <div 
                                    key={topic.topicId || i}
                                    className="bg-[#1e1b18] border border-white/5 p-4 rounded-xl flex items-center gap-3 text-xs text-white"
                                  >
                                    <Layers className="h-5 w-5 text-amber-secondary flex-shrink-0" />
                                    <span className="font-bold leading-relaxed">{topic.name}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}

    </div>
  );
}
