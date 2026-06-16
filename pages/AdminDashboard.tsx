import React, { useState, useEffect, useMemo } from 'react';
import { auth, db, storage, onAuthStateChanged, collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where, orderBy, ref, uploadBytes, getDownloadURL } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Loader2, Users, CalendarClock, X, LayoutDashboard, Database, ClipboardList, ArrowLeft, MessageSquare, BarChart3, Send, MoreVertical, Calendar, Video } from 'lucide-react';
import { TeacherApplication } from '../types';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_EMAILS = ['ukkukk97@gmail.com', 'umakrishnakanthchokkapu15@gmail.com'];

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'chat' | 'stats' | 'classes'>('applications');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Data states
  const [teacherApps, setTeacherApps] = useState<(TeacherApplication & { userName?: string, userEmail?: string, courseTitle?: string })[]>([]);
  const [selectedApp, setSelectedApp] = useState<(TeacherApplication & { userName?: string, userEmail?: string, courseTitle?: string }) | null>(null);

  // Chat states
  const [chatContacts, setChatContacts] = useState<{ id: string; name: string; email: string }[]>([]);
  const [selectedContact, setSelectedContact] = useState<{ id: string; name: string; email: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<{ id: string; user_id: string; content: string; role: string; created_at: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Stats states
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  // Scheduled classes
  const [scheduledClasses, setScheduledClasses] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);


  const fetchData = async () => {
    setLoading(true);
    try {
      const [cSnap, aSnap, eSnap] = await Promise.all([
        getDocs(collection(db, 'courses')),
        getDocs(collection(db, 'teacher_applications')),
        getDocs(collection(db, 'enrollments'))
      ]);

      const courses = cSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCoursesList(courses);

      const enrollmentsData = eSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEnrollments(enrollmentsData);

      const rawApps = aSnap.docs.map((d) => {
        const data = d.data() as TeacherApplication;
        const courseIdVal = data.qualification || '';
        const cFind = courses.find((c: any) => c.id === courseIdVal);
        return {
          ...data,
          id: d.id,
          courseTitle: cFind?.title || 'Unknown Course',
          userName: data.name || 'Unknown',
          userEmail: data.email || 'No Email',
          courseId: courseIdVal,
          skills: (data.message || '').startsWith('Skills:') ? (data.message || '').split('\n')[0].replace('Skills: ', '') : 'Course Expert',
          message: (data.message || '').startsWith('Skills:') ? (data.message || '').split('\n').slice(1).join('\n').trim() : (data.message || '')
        };
      });

      setTeacherApps(rawApps as any);
    } catch (e) {
      console.error("Dashboard data fetch failed", e);
      toast.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledClasses = async () => {
    setLoadingClasses(true);
    try {
      const { data, error } = await db.from('scheduled_classes').select('*, users:teacher_id (display_name, email)').order('scheduled_at', { ascending: false });
      if (!error) setScheduledClasses(data || []);
    } catch (e) {
      console.error("Failed to load scheduled classes", e);
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u || !ADMIN_EMAILS.includes(u.email || '')) {
        navigate('/');
      } else {
        fetchData();
        fetchScheduledClasses();
      }
    });
    return () => unsub();
  }, [navigate]);

  // Build chat contacts from teacher_applications
  useEffect(() => {
    if (teacherApps.length > 0) {
      const map = new Map<string, { id: string; name: string; email: string }>();
      teacherApps.forEach(app => {
        const id = app.userId || app.id;
        if (!map.has(id)) {
          map.set(id, { id, name: app.userName || 'Unknown', email: app.userEmail || 'No Email' });
        }
      });
      setChatContacts(Array.from(map.values()));
    }
  }, [teacherApps]);

  const loadChatMessages = async (userId: string) => {
    try {
      const { data, error } = await db.from('chat_messages').select('*').eq('user_id', userId).order('created_at', { ascending: true });
      if (!error && data) setChatMessages(data);
    } catch (e) {
      console.error("Failed to load messages", e);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedContact) return;
    setSendingMessage(true);
    try {
      await db.from('chat_messages').insert({
        user_id: selectedContact.id,
        content: chatInput,
        role: 'admin',
        created_at: new Date().toISOString()
      });
      setChatInput('');
      await loadChatMessages(selectedContact.id);
    } catch (e) {
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFinalVerdictTeacher = async (appId: string, emailStr: string | undefined, verdict: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'teacher_applications', appId), {
        status: verdict
      });

      if (verdict === 'approved') {
        const appDoc = await getDoc(doc(db, 'teacher_applications', appId));
        if (appDoc.exists()) {
          const data = appDoc.data();
          const courseIdVal = data.qualification || appId;
          const enrollmentId = crypto.randomUUID();
          await setDoc(doc(db, 'enrollments', enrollmentId), {
            userId: data.userId,
            courseId: courseIdVal,
            role: 'teacher',
            studentStatus: 'active',
            createdAt: serverTimestamp()
          });
        }
      }

      if (emailStr && (verdict === 'approved' || verdict === 'rejected')) {
        try {
          const { error: mailErr } = await db.from('mail').insert({
            to: emailStr,
            subject: `Teacher Application ${verdict === 'approved' ? 'Approved' : 'Rejected'}`,
            text: verdict === 'approved' 
              ? 'Congratulations! You have been approved to teach this course.'
              : 'Thank you for your interest, but we are unable to proceed.'
          });
          if (mailErr) console.warn("Mail insert warning:", mailErr);
        } catch(mailErr) {
          console.warn("Mail send failed (non-blocking)", mailErr);
        }
      }
      setSelectedApp(null);
      fetchData();
      toast.success(`Application ${verdict}`);
    } catch(e: any) { toast.error(e?.message || "Verdict update failed"); console.error(e); }
  };

  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState('');
  const [meetDate, setMeetDate] = useState('');

  const handleApproveApp = async (appId: string, emailStr?: string) => {
    if(!meetLink) { toast.error("Provide a meet link"); return; }
    try {
      const existingApp = await getDoc(doc(db, 'teacher_applications', appId));
      const existingMsg = existingApp.exists() ? existingApp.data().message || '' : '';
      const updatedMsg = existingMsg + `\n[Interview Link: ${meetLink}]` + (meetDate ? `\n[Interview Date: ${new Date(meetDate).toISOString()}]` : '');

      const updateData: any = {
        status: 'scheduled',
        message: updatedMsg,
        meetingLink: meetLink,
      };
      if (meetDate) {
        updateData.meetingDate = new Date(meetDate).toISOString();
      }

      try {
        await updateDoc(doc(db, 'teacher_applications', appId), updateData);
      } catch (dbErr: any) {
        console.warn("DB update with explicit columns failed, falling back to message-only storage", dbErr);
        await updateDoc(doc(db, 'teacher_applications', appId), {
          status: 'scheduled',
          message: updatedMsg,
        });
      }

      if (emailStr) {
        try {
          const { error: mailErr } = await db.from('mail').insert({
            to: emailStr,
            subject: 'Interview Scheduled: Teacher Application',
            text: `Your application has been reviewed. Join the interview here: ${meetLink}${meetDate ? ` on ${new Date(meetDate).toLocaleString()}` : ''}`
          });
          if (mailErr) console.warn("Mail insert warning:", mailErr);
        } catch(mailErr) {
          console.warn("Mail send failed (non-blocking)", mailErr);
        }
      }

      setSchedulingId(null);
      setMeetLink('');
      setMeetDate('');
      setSelectedApp(null);
      fetchData();
      toast.success("Interview scheduled");
    } catch (e: any) {
      console.error("Schedule error:", e?.message || e);
      toast.error("Scheduling failed");
    }
  };

  const handleRemoveTeacher = async (appId: string, teacherUserId: string | undefined, courseId: string | undefined) => {
    if (!teacherUserId || !courseId) { toast.error("Missing teacher or course info"); return; }
    if (!confirm("Remove this teacher from the course? This will delete their enrollment.")) return;
    try {
      const eq = query(collection(db, 'enrollments'), where('userId', '==', teacherUserId), where('courseId', '==', courseId), where('role', '==', 'teacher'));
      const eSnap = await getDocs(eq);
      for (const d of eSnap.docs) {
        await deleteDoc(doc(db, 'enrollments', d.id));
      }
      await updateDoc(doc(db, 'teacher_applications', appId), { status: 'rejected' });
      setSelectedApp(null);
      fetchData();
      toast.success("Teacher removed from course");
    } catch (e) {
      toast.error("Failed to remove teacher");
    }
  };

  const selectChatContact = async (contact: { id: string; name: string; email: string }) => {
    setSelectedContact(contact);
    await loadChatMessages(contact.id);
  };

  const activeCount = useMemo(() => enrollments.filter((e: any) => e.status === 'active').length, [enrollments]);
  const enrollmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    enrollments.forEach((e: any) => {
      const id = e.course_id || e.courseId;
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }, [enrollments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ willChange: 'transform' }}
        >
          <Loader2 className="w-12 h-12 text-emerald-500" />
        </motion.div>
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Syncing Core Systems...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar (always visible on md+) */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-72 bg-white dark:bg-[#0f172a] border-r border-slate-200/50 dark:border-slate-800/50 z-40 flex-col p-8">
        <div className="mb-12 flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <LayoutDashboard className="w-7 h-7 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter leading-none">CORE <span className="text-emerald-500">OPS</span></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Admin Terminal</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {[
            { id: 'applications', label: 'Applications', icon: Users, desc: 'Provider review' },
            { id: 'chat', label: 'Provider Chat', icon: MessageSquare, desc: 'Direct messaging' },
            { id: 'stats', label: 'Course Stats', icon: BarChart3, desc: 'Enrollment analytics' },
            { id: 'classes', label: 'Scheduled Classes', icon: Calendar, desc: 'Teacher-scheduled classes' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-colors relative group overflow-hidden ${
                activeTab === item.id 
                ? 'bg-slate-900 dark:bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20' 
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {activeTab === item.id && (
                <motion.div layoutId="nav-bg" className="absolute inset-0 bg-emerald-500 dark:bg-emerald-600 -z-10" />
              )}
              <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
              <div className="flex flex-col items-start">
                <span className="text-sm">{item.label}</span>
                <span className={`text-[9px] font-medium uppercase tracking-widest ${activeTab === item.id ? 'text-white/60' : 'text-slate-400'}`}>{item.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800/50">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Exit Console</span>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar (overlay, controlled by state) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[55]"
            />
            <motion.nav 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="md:hidden fixed left-0 top-0 h-full w-72 max-w-[85vw] bg-white dark:bg-[#0f172a] border-r border-slate-200/50 dark:border-slate-800/50 z-[60] flex flex-col p-6 shadow-2xl"
            >
              <div className="mb-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                    <LayoutDashboard className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-xl tracking-tighter leading-none">CORE <span className="text-emerald-500">OPS</span></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Admin Terminal</span>
                  </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 space-y-3">
                {[
                  { id: 'applications', label: 'Applications', icon: Users, desc: 'Provider review' },
                  { id: 'chat', label: 'Provider Chat', icon: MessageSquare, desc: 'Direct messaging' },
                  { id: 'stats', label: 'Course Stats', icon: BarChart3, desc: 'Enrollment analytics' },
                  { id: 'classes', label: 'Scheduled Classes', icon: Calendar, desc: 'Teacher-scheduled classes' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-colors relative group overflow-hidden ${
                      activeTab === item.id 
                      ? 'bg-slate-900 dark:bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20' 
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                    <div className="flex flex-col items-start">
                      <span className="text-sm">{item.label}</span>
                      <span className={`text-[9px] font-medium uppercase tracking-widest ${activeTab === item.id ? 'text-white/60' : 'text-slate-400'}`}>{item.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800/50">
                <button 
                  onClick={() => navigate('/')}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Exit Console</span>
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="md:pl-72 pt-20 md:pt-12 pb-24 px-4 sm:px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <header className="mb-16">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Admin Console</span>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {activeTab === 'applications' ? 'Provider Applications' : activeTab === 'chat' ? 'Provider Chat' : activeTab === 'stats' ? 'Course Statistics' : 'Scheduled Classes'}
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              {activeTab === 'applications' ? 'Review and manage teacher/provider applications' : activeTab === 'chat' ? 'Direct messaging with providers' : activeTab === 'stats' ? 'Enrollment analytics per course' : 'Live classes scheduled by teachers'}
            </p>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "circOut" }}
            >
              {activeTab === 'applications' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
                    {teacherApps.length === 0 ? (
                      <div className="col-span-full py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <CalendarClock className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-slate-400">NO PENDING DOSSIERS</h3>
                        <p className="text-slate-500 text-sm font-medium mt-2">The system is currently clear of applicants.</p>
                      </div>
                    ) : (
                      teacherApps.map(app => (
                        <motion.div 
                          layout
                          key={app.id} 
                          className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] transition-shadow duration-500 relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full animate-pulse ${
                               app.status === 'pending' ? 'bg-amber-500' :
                               app.status === 'approved' ? 'bg-emerald-500' : 'bg-blue-500'
                             }`} />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${
                               app.status === 'pending' ? 'text-amber-500' :
                               app.status === 'approved' ? 'text-emerald-500' : 'text-blue-500'
                             }`}>
                               {app.status}
                             </span>
                          </div>

                          <div className="mb-8">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Applicant</span>
                            <h4 className="font-black text-2xl text-slate-900 dark:text-white mb-1 line-clamp-1">{app.userName}</h4>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">{app.userEmail}</p>
                          </div>

                          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 mb-8">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Target Curriculum</span>
                            <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-emerald-500" /> {app.courseTitle}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 mb-8">
                            <div className="flex-1 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                              <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Experience</span>
                              <span className="text-xl font-black text-slate-900 dark:text-white">{app.experience}y</span>
                            </div>
                            <div className="flex-1 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                              <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Skills</span>
                              <span className="text-xl font-black text-emerald-500">{app.skills?.split(',').length || 0}</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => setSelectedApp(app)}
                            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-transform transition-colors shadow-xl group-hover:bg-emerald-500 group-hover:text-white"
                          >
                            REVIEW DOSSIER
                          </button>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-280px)] min-h-[500px]">
                  {/* Contacts sidebar */}
                  <div className="lg:w-80 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col shrink-0">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="font-black text-lg">Provider Contacts</h3>
                      <p className="text-xs text-slate-400 font-medium mt-1">{chatContacts.length} providers</p>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {chatContacts.length === 0 ? (
                        <div className="p-8 text-center">
                          <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                          <p className="text-sm font-medium text-slate-400">No provider contacts yet</p>
                          <p className="text-xs text-slate-500 mt-1">Applications will appear here</p>
                        </div>
                      ) : (
                        chatContacts.map(contact => (
                          <button
                            key={contact.id}
                            onClick={() => selectChatContact(contact)}
                            className={`w-full p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50 text-left ${
                              selectedContact?.id === contact.id ? 'bg-emerald-500/5 dark:bg-emerald-500/10' : ''
                            }`}
                          >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-white text-lg shrink-0">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm truncate">{contact.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium truncate">{contact.email}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Chat area */}
                  <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                    {!selectedContact ? (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <MessageSquare className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                          <h3 className="text-xl font-black text-slate-400">Select a Contact</h3>
                          <p className="text-sm text-slate-500 mt-1">Choose a provider from the sidebar to start chatting</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Chat header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-white">
                            {selectedContact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold">{selectedContact.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{selectedContact.email}</p>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                          {chatMessages.length === 0 ? (
                            <div className="text-center py-12">
                              <p className="text-slate-400 font-medium">No messages yet</p>
                              <p className="text-xs text-slate-500 mt-1">Send a message to start the conversation</p>
                            </div>
                          ) : (
                            chatMessages.map((msg) => (
                              <div key={msg.id} className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl ${
                                  msg.role === 'admin' 
                                    ? 'bg-emerald-500 text-white rounded-br-md' 
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md'
                                }`}>
                                  <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                  <p className={`text-[10px] mt-1 ${msg.role === 'admin' ? 'text-emerald-200' : 'text-slate-400'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Input */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex gap-4">
                            <input
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                              placeholder="Type a message..."
                              className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-500 transition-colors"
                            />
                            <button
                              onClick={handleSendMessage}
                              disabled={sendingMessage || !chatInput.trim()}
                              className="px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {sendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-8">
                  {/* Summary cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Courses</span>
                      <p className="text-4xl font-black mt-2 text-slate-900 dark:text-white">{coursesList.length}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Enrollments</span>
                      <p className="text-4xl font-black mt-2 text-emerald-500">{enrollments.length}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Enrollments</span>
                      <p className="text-4xl font-black mt-2 text-blue-500">{activeCount}</p>
                    </div>
                  </div>

                  {/* Course enrollment table */}
                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="text-xl font-black tracking-tight">Enrollments by Course</h3>
                    </div>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 dark:bg-slate-800/30 sticky top-0 backdrop-blur-md">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Course</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Enrollments</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                          {coursesList.map((course: any) => {
                            const count = enrollmentCounts[course.id] || 0;
                            return (
                              <tr key={course.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="px-8 py-5">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                                      {course.title?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900 dark:text-white">{course.title || 'Untitled'}</p>
                                      <p className="text-[10px] text-slate-400 font-medium">{course.id?.slice(0, 8)}...</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-5">
                                  <span className="text-xs font-medium text-slate-500">{course.category || 'Uncategorized'}</span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                  <span className={`inline-flex items-center justify-center w-12 h-12 rounded-xl font-black text-lg ${
                                    count > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                  }`}>
                                    {count}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {coursesList.length === 0 && (
                            <tr>
                              <td colSpan={3} className="px-8 py-16 text-center">
                                <p className="text-slate-400 font-medium">No courses found</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'classes' && (
                <div className="space-y-6">
                  {loadingClasses ? (
                    <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
                  ) : scheduledClasses.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-6" />
                      <h3 className="text-xl font-black text-slate-400">No Scheduled Classes</h3>
                      <p className="text-slate-500 text-sm font-medium mt-2">Teachers have not scheduled any live classes yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {scheduledClasses.map((sc) => (
                        <div key={sc.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-white">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-slate-900 dark:text-white truncate">{sc.title}</p>
                              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                {sc.scheduled_at ? new Date(sc.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No date'}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs font-medium text-slate-500 mb-4 line-clamp-2">{sc.description || 'No description'}</p>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teacher:</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{sc.users?.display_name || sc.teacher_id?.slice(0, 8) || 'Unknown'}</span>
                          </div>
                          <a href={sc.meeting_link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-colors text-sm">
                            <Video className="w-4 h-4" /> Join Class
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Premium Application Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight mb-2">Mentor Review</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Application Dossier #{selectedApp.id.slice(0, 8)}</p>
                  </div>
                  <button onClick={() => setSelectedApp(null)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  <section>
                    <label className="block text-xs font-black text-emerald-500 uppercase tracking-widest mb-4">Applicant Profile</label>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-sm font-black text-slate-400 uppercase mb-1">Name</p>
                        <p className="font-bold text-lg">{selectedApp.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-400 uppercase mb-1">Target Curriculum</p>
                        <p className="font-bold text-lg">{selectedApp.courseTitle}</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <label className="block text-xs font-black text-emerald-500 uppercase tracking-widest mb-4">Professional Experience</label>
                    <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem]">
                      {selectedApp.experience || 'No experience provided.'}
                    </p>
                  </section>

                  {selectedApp.status === 'pending' && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] mb-6">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Schedule Interview</label>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Interview Date & Time</label>
                              <input
                                type="datetime-local"
                                value={meetDate}
                                onChange={e => setMeetDate(e.target.value)}
                                className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-500 transition-colors"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Google Meet / Zoom Link</label>
                              <input
                                value={meetLink}
                                onChange={e => setMeetLink(e.target.value)}
                                placeholder="Paste Link..."
                                className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl outline-none font-bold border border-transparent focus:border-emerald-500 transition-colors"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleApproveApp(selectedApp.id, selectedApp.userEmail)}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-colors shadow-lg shadow-emerald-500/20"
                          >
                            Schedule Interview & Send Link
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => handleFinalVerdictTeacher(selectedApp.id, selectedApp.userEmail, 'approved')}
                          className="flex-1 py-5 bg-emerald-500 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-500/20 hover:scale-[1.01] transition-transform"
                        >
                          APPROVE MENTOR NOW
                        </button>
                        <button
                          onClick={() => handleFinalVerdictTeacher(selectedApp.id, selectedApp.userEmail, 'rejected')}
                          className="flex-1 py-5 bg-red-500 text-white font-black rounded-[2rem] shadow-xl shadow-red-500/20 hover:scale-[1.01] transition-transform"
                        >
                          REJECT APPLICATION
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedApp.status === 'scheduled' && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[2rem] mb-6 border border-blue-200 dark:border-blue-800">
                        <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Scheduled Interview Link</label>
                        {(() => {
                          const linkMatch = selectedApp.message?.match(/\[Interview Link:\s*([^\]\n]+)\]/);
                          const meetingUrl = linkMatch ? linkMatch[1] : selectedApp.meetingLink;
                          const formattedUrl = meetingUrl ? (meetingUrl.startsWith('http') ? meetingUrl : `https://${meetingUrl}`) : null;
                          return formattedUrl ? (
                            <a href={formattedUrl} target="_blank" rel="noreferrer" className="block w-full p-4 bg-white dark:bg-slate-900 rounded-2xl font-bold text-blue-600 hover:underline truncate">
                              {meetingUrl}
                            </a>
                          ) : <p className="text-sm text-slate-500">No meeting link found.</p>;
                        })()}

                        {(() => {
                          const dateMatch = selectedApp.message?.match(/\[Interview Date:\s*([^\]\n]+)\]/);
                          const meetingDateVal = dateMatch ? dateMatch[1] : selectedApp.meetingDate;
                          return meetingDateVal ? (
                            <div className="mt-4">
                              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Interview Date & Time</label>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {new Date(meetingDateVal).toLocaleString()}
                              </p>
                            </div>
                          ) : null;
                        })()}
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => handleFinalVerdictTeacher(selectedApp.id, selectedApp.userEmail, 'approved')}
                          className="flex-1 py-5 bg-emerald-500 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-500/20 hover:scale-[1.01] transition-transform"
                        >
                          APPROVE MENTOR NOW
                        </button>
                        <button
                          onClick={() => handleFinalVerdictTeacher(selectedApp.id, selectedApp.userEmail, 'rejected')}
                          className="flex-1 py-5 bg-red-500 text-white font-black rounded-[2rem] shadow-xl shadow-red-500/20 hover:scale-[1.01] transition-transform"
                        >
                          REJECT APPLICATION
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedApp.status === 'approved' && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                      <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-[2rem] border border-rose-200 dark:border-rose-800">
                        <label className="block text-xs font-black text-rose-600 uppercase tracking-widest mb-2">Active Mentor</label>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium">This mentor is currently assigned to teach this course.</p>
                        <button
                          onClick={() => handleRemoveTeacher(selectedApp.id, selectedApp.userId, selectedApp.courseId || selectedApp.qualification)}
                          className="w-full py-4 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600 transition-colors"
                        >
                          REMOVE TEACHER
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    );
};

export default AdminDashboard;
