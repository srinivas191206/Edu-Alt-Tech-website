import React, { useState, useEffect } from 'react';
import { auth, db, onAuthStateChanged, doc, onSnapshot, collection, query, where, getDocs, getDoc } from '../lib/firebase';
import { Loader2, BookOpen, Download, Award, User, FileText, GraduationCap, ArrowRight, Clock, Star, TrendingUp, CheckCircle, Library, Sparkles, Video, CalendarCheck, AlertCircle, Users, Lightbulb, Target, MessageSquare, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserObject, CourseEnrollment, Course, TeacherApplication } from '../types';
import { motion } from 'framer-motion';

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
};

const extractMeetingLink = (message: string | undefined): string | null => {
  if (!message) return null;
  const match = message.match(/\[Interview Link:\s*(https?:\/\/[^\]]+)\]/);
  return match ? match[1] : null;
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [userProfile, setUserProfile] = useState<UserObject | null>(null);
  const [enrollments, setEnrollments] = useState<(CourseEnrollment & { courseData?: Course })[]>([]);
  const [teachingEnrollments, setTeachingEnrollments] = useState<(CourseEnrollment & { courseData?: Course })[]>([]);
  const [myApplications, setMyApplications] = useState<(TeacherApplication & { courseTitle?: string })[]>([]);
  const [chatMessages, setChatMessages] = useState<{ id: string; content: string; role: string; created_at: string }[]>([]);
  const [resourceCount, setResourceCount] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      try {
        setUser(u);
        if (!u) { navigate('/login'); return; }

        try {
          const docObj = await getDoc(doc(db, 'users', u.uid));
          if (docObj.exists() && !cancelled) setUserProfile({ uid: docObj.id, ...docObj.data() } as UserObject);
        } catch (_) {}

        // Fetch all courses for lookups
        const coursesSnap = await getDocs(collection(db, 'courses'));
        const coursesMap = new Map<string, Course>();
        coursesSnap.docs.forEach(d => coursesMap.set(d.id, { id: d.id, ...d.data() } as Course));

        // Student enrollments
        const sq = query(collection(db, 'enrollments'), where('userId', '==', u.uid), where('role', '==', 'student'));
        const sSnap = await getDocs(sq);
        const studentEnr: any[] = [];
        sSnap.docs.forEach(ds => {
          const data = ds.data();
          const course = coursesMap.get(data.courseId);
          if (course) studentEnr.push({ id: ds.id, ...data, courseData: course });
        });
        if (!cancelled) setEnrollments(studentEnr);

        // Teaching enrollments (role=teacher)
        const tq = query(collection(db, 'enrollments'), where('userId', '==', u.uid), where('role', '==', 'teacher'));
        const tSnap = await getDocs(tq);
        const teacherEnr: any[] = [];
        tSnap.docs.forEach(ds => {
          const data = ds.data();
          const course = coursesMap.get(data.courseId);
          if (course) teacherEnr.push({ id: ds.id, ...data, courseData: course });
        });
        if (!cancelled) setTeachingEnrollments(teacherEnr);

        // Teacher applications for this user
        const appQ = query(collection(db, 'teacher_applications'), where('userId', '==', u.uid));
        const appSnap = await getDocs(appQ);
        const apps = appSnap.docs.map(d => {
          const data = d.data() as TeacherApplication;
          const courseIdVal = data.qualification || '';
          const course = coursesMap.get(courseIdVal);
          return {
            ...data,
            id: d.id,
            courseTitle: course?.title || 'Unknown Course',
            userName: data.name || 'Unknown',
            userEmail: data.email || ''
          };
        });
        if (!cancelled) setMyApplications(apps);

        // Fetch chat messages for this user
        try {
          const { data: chatData } = await db.from('chat_messages').select('*').eq('user_id', u.uid).order('created_at', { ascending: true });
          if (chatData && !cancelled) setChatMessages(chatData);
        } catch (_) {}

        // Count resources
        try {
          const { count: dlCount } = await db.from('user_downloads').select('id', { count: 'exact', head: true }).eq('user_id', u.uid);
          const enrolledCourseIds = [...new Set([...studentEnr.map(e => e.courseId), ...teacherEnr.map(e => e.courseId)])];
          let courseResCount = 0;
          if (enrolledCourseIds.length > 0) {
            const { count: crCount } = await db.from('resources').select('id', { count: 'exact', head: true }).in('course_id', enrolledCourseIds);
            courseResCount = crCount || 0;
          }
          if (!cancelled) setResourceCount((dlCount || 0) + courseResCount);
        } catch (_) {}
      } catch (err) { console.error("Dashboard init error", err); }
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; unsubscribeAuth(); };
  }, []);

  const nextSteps: string[] = [];
  if (enrollments.length === 0 && myApplications.length === 0) nextSteps.push('Browse courses and enroll to start learning');
  if (myApplications.some(a => a.status === 'pending')) nextSteps.push('Your teacher application is pending review — the admin will reach out');
  const scheduledApp = myApplications.find(a => a.status === 'scheduled');
  if (scheduledApp && extractMeetingLink(scheduledApp.message)) nextSteps.push('You have an interview scheduled! Join using the meeting link below');
  if (myApplications.some(a => a.status === 'approved') && teachingEnrollments.length === 0) nextSteps.push('Your application was approved! The admin will assign you as a teacher shortly');
  if (teachingEnrollments.length > 0) nextSteps.push('Go to your classroom to manage your course modules and students');
  if (enrollments.length > 0) nextSteps.push('Continue your learning — pick up where you left off in My Courses');

  const loadChatMessages = async () => {
    if (!user) return;
    const { data } = await db.from('chat_messages').select('*').eq('user_id', user.uid).order('created_at', { ascending: true });
    if (data) setChatMessages(data);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !user) return;
    setSendingMessage(true);
    try {
      await db.from('chat_messages').insert({
        user_id: user.uid,
        content: chatInput,
        role: 'user',
        created_at: new Date().toISOString()
      });
      setChatInput('');
      await loadChatMessages();
    } catch (e) {
      console.error("Failed to send message", e);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  const totalTeaching = teachingEnrollments.length;
  const totalApplications = myApplications.length;
  const pendingApps = myApplications.filter(a => a.status === 'pending').length;
  const approvedApps = myApplications.filter(a => a.status === 'approved').length;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
            {getGreeting()}, {userProfile?.name || 'Learner'}!
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Your learning command center.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center mb-3"><BookOpen className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{enrollments.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Learning</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-3"><Users className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalTeaching}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Teaching</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center mb-3"><FileText className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalApplications}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Applications</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-3"><Download className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{resourceCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Resources</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-3"><Star className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{enrollments.length > 0 ? 'In Progress' : '0%'}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Progress</div>
          </div>
        </motion.div>

        {/* Interview Scheduled — prominent banner */}
        {scheduledApp && extractMeetingLink(scheduledApp.message) && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="mb-10">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Video className="w-40 h-40" /></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Action Required</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Interview Scheduled</h2>
                  <p className="text-blue-100 text-lg font-medium">
                    {scheduledApp.courseTitle} — Click the link below to join your interview.
                  </p>
                </div>
                <a
                  href={extractMeetingLink(scheduledApp.message)!}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-3 px-8 py-5 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-colors shadow-xl text-lg"
                >
                  <Video className="w-6 h-6" /> Join Interview Now
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Step Assistant Card (hidden if interview banner is shown) */}
        {!scheduledApp && nextSteps.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><Target className="w-32 h-32" /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-7 h-7 text-emerald-200" />
                  <h2 className="text-xl font-black tracking-tight">Next Step</h2>
                </div>
                <ul className="space-y-3">
                  {nextSteps.slice(0, 3).map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-emerald-50">
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{i + 1}</span>
                      <span className="font-medium">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* My Learning */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-emerald-500" /> My Learning
                </h2>
                <Link to="/courses" className="text-sm font-bold text-emerald-600 hover:text-emerald-500 transition-colors">Browse All</Link>
              </div>

              {enrollments.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
                  <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Enrollments Yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">Start your learning journey by enrolling in a course.</p>
                  <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20">
                    Browse Courses <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {enrollments.map((enr, idx) => (
                    <motion.div
                      key={enr.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-emerald-500 transition-colors duration-300 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{enr.courseData?.title || 'Unknown Course'}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{enr.courseData?.description}</p>
                          <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Enrolled {new Date(enr.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Link to={`/classroom/${enr.courseId}`} className="shrink-0 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                          Continue
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* My Teaching */}
            {totalTeaching > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-500" /> My Teaching
                  </h2>
                  <Link to="/teacher-panel" className="text-sm font-bold text-purple-600 hover:text-purple-500 transition-colors">Manage All →</Link>
                </div>
                <div className="grid gap-4">
                  {teachingEnrollments.map((enr, idx) => (
                    <motion.div
                      key={enr.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800/50 rounded-2xl p-6 hover:border-purple-500 transition-colors duration-300 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-[10px] font-bold uppercase tracking-wider">Teacher</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{enr.courseData?.title || 'Unknown Course'}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{enr.courseData?.description}</p>
                        </div>
                        <Link to={`/classroom/${enr.courseId}`} className="shrink-0 px-5 py-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl font-bold text-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                          Manage
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Applications */}
            {totalApplications > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-amber-500" /> Teacher Applications
                  </h2>
                </div>
                <div className="grid gap-4">
                  {myApplications.map((app, idx) => {
                    const meetingLink = extractMeetingLink(app.message);
                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
                      >
                        {app.status === 'scheduled' && meetingLink ? (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">Interview Scheduled</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{app.courseTitle}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                              Applied {new Date(app.appliedAt?.toDate?.() || Date.now()).toLocaleDateString()}
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
                              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Your Interview</p>
                              <a href={meetingLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors text-sm shadow-lg shadow-blue-600/20">
                                <Video className="w-5 h-5" /> Join Interview Now
                              </a>
                            </div>
                          </div>
                        ) : app.status === 'approved' ? (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">Approved</span>
                              </div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{app.courseTitle}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">You are approved to teach this course.</p>
                            </div>
                            <Link to="/teacher-panel" className="shrink-0 px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-colors text-sm shadow-lg shadow-purple-600/20">
                              Teacher Panel →
                            </Link>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                  app.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                }`}>
                                  {app.status}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{app.courseTitle}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Applied {new Date(app.appliedAt?.toDate?.() || Date.now()).toLocaleDateString()}
                              </p>
                              {meetingLink && (
                                <a href={meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm">
                                  <Video className="w-4 h-4" /> Join Interview
                                </a>
                              )}
                            </div>
                            <div className="shrink-0">
                              {app.status === 'pending' && <CalendarCheck className="w-8 h-8 text-amber-400" />}
                              {app.status === 'rejected' && <AlertCircle className="w-8 h-8 text-red-400" />}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

            {/* Messages */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-500" /> Messages
                </h2>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="h-72 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-10">
                      <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 font-medium text-sm">No messages yet</p>
                      <p className="text-xs text-slate-500 mt-1">Reach out to the admin team below</p>
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-emerald-500 text-white rounded-br-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md'
                        }`}>
                          <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex gap-3">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      placeholder="Type a message to admin..."
                      className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none font-medium text-sm border border-transparent focus:border-emerald-500 transition-colors"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !chatInput.trim()}
                      className="px-5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center gap-2 text-sm"
                    >
                      {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center font-black text-xl overflow-hidden">
                  {userProfile?.profilePic ? <img src={userProfile.profilePic} loading="lazy" decoding="async" alt="" className="w-full h-full object-cover" /> : (userProfile?.name?.charAt(0) || 'U')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{userProfile?.name || 'User'}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{userProfile?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {userProfile?.role || 'Student'}
                  </span>
                </div>
              </div>
              <Link to="/profile" className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                View Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Quick Links */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { icon: <Library className="w-4 h-4" />, label: 'Browse Resources', path: '/resources' },
                  { icon: <FileText className="w-4 h-4" />, label: 'Flashcards', path: '/flashcards' },
                  { icon: <GraduationCap className="w-4 h-4" />, label: 'All Courses', path: '/courses' },
                ].map((link, i) => (
                  <Link key={i} to={link.path} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    <span className="text-emerald-500">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Application Status Summary */}
            {totalApplications > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-amber-500" /> Application Status</h3>
                <div className="space-y-3">
                  {pendingApps > 0 && (
                    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Pending Review</span>
                      <span className="text-lg font-black text-amber-600 dark:text-amber-400">{pendingApps}</span>
                    </div>
                  )}
                  {approvedApps > 0 && (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Approved</span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{approvedApps}</span>
                    </div>
                  )}
                  {scheduledApp && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Interview Scheduled</span>
                      <span className="text-lg font-black text-blue-600 dark:text-blue-400">1</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Resources Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20">
              <Download className="w-8 h-8 mb-3 text-emerald-200" />
              <h3 className="font-black text-lg mb-1">Free Resources</h3>
              <p className="text-sm text-emerald-100 mb-4">Download PDFs, notes, and worksheets.</p>
              <Link to="/resources" className="inline-flex items-center gap-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors backdrop-blur-sm">
                Explore <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
