import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, storage, doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp, ref, uploadBytes, getDownloadURL, onAuthStateChanged } from '../lib/firebase';
import { Course, CourseEnrollment, CourseModule, ModuleLecture, CourseResource } from '../types';
import { ArrowLeft, BookOpen, Video, FileText, Plus, Link as LinkIcon, Loader2, Users, Clock, X, Upload, ExternalLink, Calendar, GraduationCap, Trash2, Edit, Save } from 'lucide-react';
import type { User } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const TeacherPanel: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<(CourseEnrollment & { courseData?: Course; studentCount?: number })[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

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
    await fetchModulesAndResources(courseId);
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
            Manage your courses, schedule classes, and add resources.
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
                      <div className="px-8 pb-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                        {loadingModules ? (
                          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
                        ) : (
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

                            {/* Modules */}
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

                            {/* Resources */}
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
    </div>
  );
};

export default TeacherPanel;
