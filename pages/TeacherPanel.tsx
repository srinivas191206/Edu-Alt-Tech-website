import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, storage, doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp, ref, uploadBytes, getDownloadURL, onAuthStateChanged } from '../lib/firebase';
import { Course, CourseEnrollment, CourseModule, ModuleLecture, CourseResource } from '../types';
import { ArrowLeft, BookOpen, Video, FileText, Plus, Link as LinkIcon, Loader2, Users, Clock, X, Upload, ExternalLink, Calendar, GraduationCap, Trash2, Edit, Save, Send, MessageSquare, UserCheck, ListOrdered } from 'lucide-react';
import type { User } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ADMIN_EMAILS = ['ukkukk97@gmail.com', 'umakrishnakanthchokkapu15@gmail.com'];

const TeacherPanel: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<(CourseEnrollment & { courseData?: Course; studentCount?: number })[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [activeCourseTab, setActiveCourseTab] = useState<'modules' | 'students' | 'chat' | 'schedule'>('modules');

  // Module modals
  const [showModuleModal, setShowModuleModal] = useState<string | null>(null);
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mThumbFile, setMThumbFile] = useState<File | null>(null);

  // Lecture modals
  const [showLectureModal, setShowLectureModal] = useState<{ courseId: string; moduleId: string } | null>(null);
  const [lTitle, setLTitle] = useState('');
  const [lMeet, setLMeet] = useState('');
  const [lRec, setLRec] = useState('');

  // Resource modals
  const [showResourceModal, setShowResourceModal] = useState<string | null>(null);
  const [rTitle, setRTitle] = useState('');
  const [rUrl, setRUrl] = useState('');

  // Modules for expanded course
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);

  // Students tab
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Chat tab
  const [courseChatMessages, setCourseChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Schedule tab
  const [scheduledClasses, setScheduledClasses] = useState<any[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sTitle, setSTitle] = useState('');
  const [sDesc, setSDesc] = useState('');
  const [sMeetLink, setSMeetLink] = useState('');
  const [sDate, setSDate] = useState('');

  const fetchModulesAndResources = async (courseId: string) => {
    setLoadingModules(true);
    try {
      const [mSnap, rSnap] = await Promise.all([
        getDocs(query(collection(db, 'course_modules'), where('courseId', '==', courseId))),
        getDocs(query(collection(db, 'resources'), where('courseId', '==', courseId)))
      ]);
      const loadedModules = mSnap.docs.map(d => ({ id: d.id, ...d.data() } as CourseModule));
      loadedModules.sort((a, b) => (a.order || 0) - (b.order || 0));
      setModules(loadedModules);
      setResources(rSnap.docs.map(d => ({ id: d.id, ...d.data() } as CourseResource)));
    } catch (e) {
      console.error("Failed to load modules", e);
    } finally {
      setLoadingModules(false);
    }
  };

  const fetchStudents = async (courseId: string) => {
    setLoadingStudents(true);
    try {
      const { data, error } = await db.from('enrollments').select('*').eq('course_id', courseId).eq('role', 'student');
      if (error) throw error;
      const studentList = await Promise.all((data || []).map(async (s: any) => {
        let name = 'Unknown Student';
        let email = '';
        try {
          const uDoc = await getDoc(doc(db, 'users', s.user_id));
          if (uDoc.exists()) {
            const uData = uDoc.data();
            name = uData.display_name || uData.email || 'Unknown Student';
            email = uData.email || '';
          }
        } catch (_) {}
        return { ...s, name, email };
      }));
      setStudents(studentList);
    } catch (e) {
      console.error("Failed to load students", e);
      toast.error("Failed to load students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchChatMessages = async (courseId: string) => {
    try {
      const { data, error } = await db.from('course_chat_messages').select('*').eq('course_id', courseId).order('created_at', { ascending: true });
      if (error) throw error;
      const enriched = await Promise.all((data || []).map(async (msg: any) => {
        let senderName = msg.role === 'teacher' ? 'You' : 'Student';
        if (msg.role === 'teacher' && msg.user_id === user?.uid) senderName = 'You';
        else if (msg.role === 'teacher') senderName = 'Teacher';
        else {
          try {
            const uDoc = await getDoc(doc(db, 'users', msg.user_id));
            if (uDoc.exists()) senderName = uDoc.data().display_name || 'Student';
          } catch (_) {}
        }
        return { ...msg, senderName };
      }));
      setCourseChatMessages(enriched);
    } catch (e) {
      console.error("Failed to load chat", e);
    }
  };

  const fetchScheduledClasses = async (courseId: string) => {
    try {
      const { data, error } = await db.from('scheduled_classes').select('*').eq('course_id', courseId).order('scheduled_at', { ascending: false });
      if (error) throw error;
      setScheduledClasses(data || []);
    } catch (e) {
      console.error("Failed to load scheduled classes", e);
    }
  };

  const notifyAdmins = async (courseTitle: string, className: string, meetingLink: string, teacherName: string) => {
    try {
      const { data: adminUsers } = await db.from('users').select('*').in('email', ADMIN_EMAILS);
      if (adminUsers) {
        for (const admin of adminUsers) {
          await db.from('notifications').insert({
            user_id: admin.id,
            title: 'New Class Scheduled by Teacher',
            message: `Teacher ${teacherName} scheduled "${className}" for course "${courseTitle}". Meeting link: ${meetingLink}`,
            type: 'class_scheduled',
            is_read: false,
            created_at: new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.warn("Failed to notify admins", e);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { navigate('/login'); return; }
      setUser(u);
      try {
        const coursesSnap = await getDocs(collection(db, 'courses'));
        const coursesMap = new Map<string, Course>();
        coursesSnap.docs.forEach(d => coursesMap.set(d.id, { id: d.id, ...d.data() } as Course));

        const tq = query(collection(db, 'enrollments'), where('userId', '==', u.uid), where('role', '==', 'teacher'));
        const tSnap = await getDocs(tq);
        const teacherCourses: any[] = [];

        for (const ds of tSnap.docs) {
          const data = ds.data();
          const course = coursesMap.get(data.courseId);
          if (!course) continue;
          const { count } = await db.from('enrollments').select('id', { count: 'exact', head: true }).eq('course_id', data.courseId).neq('user_id', u.uid);
          teacherCourses.push({ id: ds.id, ...data, courseData: course, studentCount: count || 0 });
        }
        setCourses(teacherCourses);
      } catch (err) {
        console.error("Failed to load teacher data", err);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  const toggleCourse = async (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }
    setExpandedCourse(courseId);
    setActiveCourseTab('modules');
    await fetchModulesAndResources(courseId);
    await fetchStudents(courseId);
    await fetchScheduledClasses(courseId);
  };

  const switchTab = async (tab: typeof activeCourseTab, courseId: string) => {
    setActiveCourseTab(tab);
    if (tab === 'chat') await fetchChatMessages(courseId);
    if (tab === 'students') await fetchStudents(courseId);
    if (tab === 'schedule') await fetchScheduledClasses(courseId);
    if (tab === 'modules') await fetchModulesAndResources(courseId);
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !showModuleModal) return;
    try {
      let finalThumbUrl = '';
      if (mThumbFile) {
        const fileRef = ref(storage, `module_thumbnails/${Date.now()}_${mThumbFile.name}`);
        const snap = await uploadBytes(fileRef, mThumbFile);
        finalThumbUrl = await getDownloadURL(snap.ref);
      }
      await addDoc(collection(db, 'course_modules'), {
        courseId: showModuleModal,
        teacherId: user.uid,
        title: mTitle,
        description: mDesc,
        order: modules.length + 1,
        lectures: [],
        thumbnailUrl: finalThumbUrl || '',
        createdAt: serverTimestamp()
      });
      setShowModuleModal(null);
      setMTitle(''); setMDesc(''); setMThumbFile(null);
      await fetchModulesAndResources(showModuleModal);
      toast.success("Module deployed");
    } catch (err) {
      toast.error("Failed to create module");
    }
  };

  const handleAddLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !showLectureModal) return;
    try {
      const moduleRef = doc(db, 'course_modules', showLectureModal.moduleId);
      const newLecture: ModuleLecture = {
        id: Date.now().toString(),
        title: lTitle,
        meetingLink: lMeet,
        recordedLink: lRec,
        createdAt: new Date().toISOString()
      };
      const mod = modules.find(m => m.id === showLectureModal.moduleId);
      const currentLectures = mod?.lectures || [];
      await updateDoc(moduleRef, { lectures: [...currentLectures, newLecture] });
      setShowLectureModal(null);
      setLTitle(''); setLMeet(''); setLRec('');
      await fetchModulesAndResources(showLectureModal.courseId);
      toast.success("Lecture added");
    } catch (err) {
      toast.error("Failed to add lecture");
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResourceModal) return;
    try {
      await addDoc(collection(db, 'resources'), {
        courseId: showResourceModal,
        title: rTitle,
        url: rUrl,
        createdAt: serverTimestamp()
      });
      setShowResourceModal(null);
      setRTitle(''); setRUrl('');
      await fetchModulesAndResources(showResourceModal);
      toast.success("Resource added");
    } catch (err) {
      toast.error("Failed to add resource");
    }
  };

  const handleSendChat = async (courseId: string) => {
    if (!chatInput.trim() || !user) return;
    setSendingMessage(true);
    try {
      const { error } = await db.from('course_chat_messages').insert({
        course_id: courseId,
        user_id: user.uid,
        content: chatInput,
        role: 'teacher',
        created_at: new Date().toISOString()
      });
      if (error) throw error;
      setChatInput('');
      await fetchChatMessages(courseId);
    } catch (e) {
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleScheduleClass = async (courseId: string, courseTitle: string) => {
    if (!sTitle.trim() || !sMeetLink.trim() || !user) {
      toast.error("Title and meeting link are required");
      return;
    }
    try {
      await db.from('scheduled_classes').insert({
        course_id: courseId,
        teacher_id: user.uid,
        title: sTitle,
        description: sDesc || '',
        meeting_link: sMeetLink,
        scheduled_at: sDate || new Date().toISOString(),
        created_at: new Date().toISOString()
      });
      const teacherName = user.displayName || user.email || 'A teacher';
      await notifyAdmins(courseTitle, sTitle, sMeetLink, teacherName);
      setShowScheduleModal(false);
      setSTitle(''); setSDesc(''); setSMeetLink(''); setSDate('');
      await fetchScheduledClasses(courseId);
      toast.success("Class scheduled! Admin notified.");
    } catch (e) {
      toast.error("Failed to schedule class");
    }
  };

  const courseTabs = [
    { id: 'modules' as const, label: 'Modules', icon: BookOpen },
    { id: 'students' as const, label: 'Students', icon: Users },
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
    { id: 'schedule' as const, label: 'Schedule', icon: Calendar },
  ];

  const getCourseTitle = () => {
    if (!expandedCourse) return '';
    const course = courses.find(c => c.courseId === expandedCourse);
    return course?.courseData?.title || 'Course';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-32 px-6 bg-slate-50 dark:bg-[#020617] selection:bg-purple-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>
      <div className="max-w-[1400px] mx-auto relative z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-bold mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
              Teacher Console
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Courses</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl">
            Manage your courses, students, chat, and schedule live classes.
          </p>
        </header>

        {courses.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <GraduationCap className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-400">No Teaching Courses Yet</h3>
            <p className="text-slate-500 font-medium mt-2">Once an admin approves your mentor application, your courses will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <button onClick={() => toggleCourse(course.courseId!)} className="w-full p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors text-left">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-[10px] font-bold uppercase tracking-wider">Teacher</span>
                      <span className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                        <Users className="w-4 h-4" /> {course.studentCount} enrolled
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{course.courseData?.title || 'Unknown Course'}</h3>
                    <p className="text-slate-500 font-medium mt-1 line-clamp-1">{course.courseData?.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-6">
                    <Link to={`/classroom/${course.courseId}`} onClick={(e) => e.stopPropagation()} className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-colors text-sm">
                      Open Classroom
                    </Link>
                    <div className={`w-3 h-3 rounded-full transition-transform ${expandedCourse === course.courseId ? 'rotate-180' : ''}`}>
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-slate-400"><path d="M7 10l5 5 5-5z"/></svg>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedCourse === course.courseId && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-8 pb-8 border-t border-slate-100 dark:border-slate-800">
                        {/* Course Tabs */}
                        <div className="flex gap-1 -mx-8 px-8 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 mb-6 overflow-x-auto">
                          {courseTabs.map(tab => (
                            <button
                              key={tab.id}
                              onClick={() => switchTab(tab.id, course.courseId!)}
                              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-colors whitespace-nowrap ${
                                activeCourseTab === tab.id
                                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <tab.icon className="w-4 h-4" />
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Tab Content */}
                        {activeCourseTab === 'modules' && (
                          <div className="space-y-8">
                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-3">
                              <button onClick={() => setShowModuleModal(course.courseId!)} className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-colors text-sm">
                                <Plus className="w-4 h-4" /> New Module
                              </button>
                              <button onClick={() => setShowResourceModal(course.courseId!)} className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-colors text-sm">
                                <FileText className="w-4 h-4" /> Add Resource
                              </button>
                            </div>

                            {loadingModules ? (
                              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
                            ) : (
                              <>
                                <div>
                                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-purple-500" /> Modules ({modules.length})
                                  </h4>
                                  {modules.length === 0 ? (
                                    <p className="text-slate-400 font-medium text-sm py-6 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl">No modules yet. Create your first module to start building the curriculum.</p>
                                  ) : (
                                    <div className="space-y-3">
                                      {modules.map((mod) => (
                                        <div key={mod.id} className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
                                          <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                              <h5 className="font-bold text-slate-900 dark:text-white">{mod.title}</h5>
                                              {mod.description && <p className="text-sm text-slate-500 mt-1">{mod.description}</p>}
                                              <p className="text-xs text-slate-400 font-medium mt-2">{mod.lectures?.length || 0} lectures</p>
                                            </div>
                                            <button onClick={() => setShowLectureModal({ courseId: course.courseId!, moduleId: mod.id })} className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white font-bold rounded-xl transition-colors text-xs">
                                              <Video className="w-3.5 h-3.5" /> Add Lecture
                                            </button>
                                          </div>
                                          {mod.lectures && mod.lectures.length > 0 && (
                                            <div className="mt-4 space-y-2 pl-4 border-l-2 border-purple-200 dark:border-purple-800">
                                              {mod.lectures.map((lec) => (
                                                <div key={lec.id} className="flex items-center gap-3 text-sm">
                                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                                                  <span className="font-medium text-slate-700 dark:text-slate-300 flex-1">{lec.title}</span>
                                                  {lec.meetingLink && (
                                                    <a href={lec.meetingLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600">
                                                      <Video className="w-4 h-4" />
                                                    </a>
                                                  )}
                                                  {lec.recordedLink && (
                                                    <a href={lec.recordedLink} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-600">
                                                      <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-500" /> Resources ({resources.length})
                                  </h4>
                                  {resources.length === 0 ? (
                                    <p className="text-slate-400 font-medium text-sm py-6 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl">No resources yet.</p>
                                  ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {resources.map((r) => (
                                        <div key={r.id} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                                          <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                                          <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{r.title}</p>
                                          </div>
                                          <a href={r.url} target="_blank" rel="noreferrer" className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Students Tab */}
                        {activeCourseTab === 'students' && (
                          <div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                              <Users className="w-5 h-5 text-purple-500" /> Enrolled Students ({students.length})
                            </h4>
                            {loadingStudents ? (
                              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
                            ) : students.length === 0 ? (
                              <p className="text-slate-400 font-medium text-sm py-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl">No students enrolled yet.</p>
                            ) : (
                              <div className="space-y-3">
                                {students.map((s) => (
                                  <div key={s.id} className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center font-black text-white text-lg shrink-0">
                                      {s.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-slate-900 dark:text-white truncate">{s.name}</p>
                                      <p className="text-xs text-slate-400 font-medium truncate">{s.email}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                      s.student_status === 'active'
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                    }`}>
                                      {s.student_status || 'active'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Chat Tab */}
                        {activeCourseTab === 'chat' && (
                          <div className="flex flex-col h-[500px] bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
                              <h4 className="font-black text-sm flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-purple-500" />
                                Course Chat — Students & Teacher
                              </h4>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                              {courseChatMessages.length === 0 ? (
                                <div className="text-center py-16">
                                  <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                  <p className="text-sm font-medium text-slate-400">No messages yet</p>
                                  <p className="text-xs text-slate-500 mt-1">Start the conversation with your students</p>
                                </div>
                              ) : (
                                courseChatMessages.map((msg) => (
                                  <div key={msg.id} className={`flex ${msg.role === 'teacher' && msg.user_id === user?.uid ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-4 rounded-2xl ${
                                      msg.role === 'teacher' && msg.user_id === user?.uid
                                        ? 'bg-purple-500 text-white rounded-br-md'
                                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md border border-slate-200 dark:border-slate-700/50'
                                    }`}>
                                      <p className="text-xs font-bold opacity-70 mb-1">{msg.senderName}</p>
                                      <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                      <p className={`text-[10px] mt-1 ${msg.role === 'teacher' && msg.user_id === user?.uid ? 'text-purple-200' : 'text-slate-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="p-4 border-t border-slate-200 dark:border-slate-700/50">
                              <div className="flex gap-3">
                                <input
                                  value={chatInput}
                                  onChange={(e) => setChatInput(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChat(course.courseId!); } }}
                                  placeholder="Type a message to students..."
                                  className="flex-1 p-4 bg-white dark:bg-slate-900 rounded-2xl outline-none font-bold border border-transparent focus:border-purple-500 transition-colors text-sm"
                                />
                                <button
                                  onClick={() => handleSendChat(course.courseId!)}
                                  disabled={sendingMessage || !chatInput.trim()}
                                  className="px-6 bg-purple-500 hover:bg-purple-600 text-white font-black rounded-2xl transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                  {sendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Schedule Tab */}
                        {activeCourseTab === 'schedule' && (
                          <div>
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-500" /> Scheduled Classes
                              </h4>
                              <button onClick={() => setShowScheduleModal(true)} className="flex items-center gap-2 px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl transition-colors text-sm">
                                <Plus className="w-4 h-4" /> Schedule Class
                              </button>
                            </div>

                            {scheduledClasses.length === 0 ? (
                              <p className="text-slate-400 font-medium text-sm py-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl">No classes scheduled yet.</p>
                            ) : (
                              <div className="space-y-3">
                                {scheduledClasses.map((sc) => (
                                  <div key={sc.id} className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-white shrink-0">
                                      <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-slate-900 dark:text-white">{sc.title}</p>
                                      {sc.description && <p className="text-xs text-slate-500 mt-0.5">{sc.description}</p>}
                                      <p className="text-xs text-slate-400 font-medium mt-1">
                                        {sc.scheduled_at ? new Date(sc.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No date set'}
                                      </p>
                                    </div>
                                    <a href={sc.meeting_link} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-colors text-xs flex items-center gap-1.5 shrink-0">
                                      <Video className="w-3.5 h-3.5" /> Join
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Module Modal */}
      <AnimatePresence>
        {showModuleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModuleModal(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">New Module</h3>
                <button onClick={() => setShowModuleModal(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateModule} className="space-y-5">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Title</label>
                  <input value={mTitle} onChange={e => setMTitle(e.target.value)} required placeholder="e.g. Introduction to the Course" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                  <textarea value={mDesc} onChange={e => setMDesc(e.target.value)} rows={3} placeholder="Brief overview of this module" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-500 transition-colors resize-none" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Thumbnail (optional)</label>
                  <input type="file" accept="image/*" onChange={e => setMThumbFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100" />
                </div>
                <button type="submit" className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-colors">Create Module</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lecture Modal */}
      <AnimatePresence>
        {showLectureModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLectureModal(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">New Lecture</h3>
                <button onClick={() => setShowLectureModal(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddLecture} className="space-y-5">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Title</label>
                  <input value={lTitle} onChange={e => setLTitle(e.target.value)} required placeholder="e.g. Live Session 1" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Meeting Link (for live classes)</label>
                  <input value={lMeet} onChange={e => setLMeet(e.target.value)} placeholder="https://meet.google.com/..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Recorded Link (optional)</label>
                  <input value={lRec} onChange={e => setLRec(e.target.value)} placeholder="https://youtube.com/..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-500 transition-colors" />
                </div>
                <button type="submit" className="w-full py-4 bg-purple-500 text-white font-black rounded-2xl hover:bg-purple-600 transition-colors">Add Lecture</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Resource Modal */}
      <AnimatePresence>
        {showResourceModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowResourceModal(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Add Resource</h3>
                <button onClick={() => setShowResourceModal(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateResource} className="space-y-5">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Title</label>
                  <input value={rTitle} onChange={e => setRTitle(e.target.value)} required placeholder="e.g. Course Notes PDF" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">URL</label>
                  <input value={rUrl} onChange={e => setRUrl(e.target.value)} required placeholder="https://..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-500 transition-colors" />
                </div>
                <button type="submit" className="w-full py-4 bg-blue-500 text-white font-black rounded-2xl hover:bg-blue-600 transition-colors">Add Resource</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Class Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowScheduleModal(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Schedule a Class</h3>
                <button onClick={() => setShowScheduleModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Class Title</label>
                  <input value={sTitle} onChange={e => setSTitle(e.target.value)} required placeholder="e.g. Live Q&A Session" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Description (optional)</label>
                  <textarea value={sDesc} onChange={e => setSDesc(e.target.value)} rows={2} placeholder="What is this class about?" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-purple-500 transition-colors resize-none" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Meeting Link</label>
                  <input value={sMeetLink} onChange={e => setSMeetLink(e.target.value)} required placeholder="https://meet.google.com/..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Scheduled Date & Time</label>
                  <input value={sDate} onChange={e => setSDate(e.target.value)} type="datetime-local" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-purple-500 transition-colors" />
                </div>
                <button onClick={() => handleScheduleClass(expandedCourse!, getCourseTitle())} className="w-full py-4 bg-purple-500 text-white font-black rounded-2xl hover:bg-purple-600 transition-colors">
                  Schedule Class & Notify Admin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherPanel;
