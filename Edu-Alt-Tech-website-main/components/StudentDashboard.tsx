import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, onSnapshot, setDoc, doc, serverTimestamp } from 'firebase/firestore';import { Course, ClassSession, Subject } from '../types';
import { Loader2, BookOpen, ExternalLink, Calendar as CalendarIcon, Target, IndianRupee, Bell, ArrowRight, Play, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CourseDetail from './CourseDetail';
import Chat from './Chat';

declare global { interface Window { Razorpay: any; } }

interface Props { user: User; activeTab: string; }

// ── helpers ──────────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' as const } }),
};

const BADGES = ['Popular', 'New', 'Trending', 'Hot'];
const BADGE_COLORS: Record<string, string> = {
  Popular: 'bg-emerald-500 text-white',
  New: 'bg-blue-500 text-white',
  Trending: 'bg-purple-500 text-white',
  Hot: 'bg-orange-500 text-white',
};

// ── Component ─────────────────────────────────────────────────────────────────
const StudentDashboard: React.FC<Props> = ({ user, activeTab }) => {
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<ClassSession[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [courseSubjects, setCourseSubjects] = useState<{ [courseId: string]: Subject[] }>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [notifications, setNotifications] = useState<{ id: string; text: string; createdAt: any; read?: boolean }[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Real-time notifications from Firestore
  useEffect(() => {
    const q = query(collection(db, 'notifications'), where('global', '==', true));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as { id: string; text: string; createdAt: any }))
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
        .slice(0, 20);
      setNotifications(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const enrollQ = query(collection(db, 'enrollments'), where('studentId', '==', user.uid));
    let unsubClasses: any = null;

    const unsubEnroll = onSnapshot(enrollQ, (snapshot) => {
      const ids = snapshot.docs.map(d => d.data().courseId);
      setEnrolledCourseIds(ids);
      if (ids.length > 0) {
        if (unsubClasses) unsubClasses();
        const chunk = ids.slice(0, 10);
        const classQ = query(collection(db, 'classes'), where('courseId', 'in', chunk));
        unsubClasses = onSnapshot(classQ, (classSnap) => {
          const now = new Date().getTime() - 86400000;
          const clsData = classSnap.docs
            .map(d => ({ id: d.id, ...d.data() } as ClassSession))
            .filter(c => new Date(c.date).getTime() > now);
          clsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setUpcomingClasses(clsData);
        });
      } else {
        setUpcomingClasses([]);
        setLoading(false);
      }
    });

    const fetchCourses = async () => {
      const snap = await getDocs(query(collection(db, 'courses')));
      const courses = snap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
      setAllCourses(courses);
      setLoading(false);
      const subjectsMap: { [courseId: string]: Subject[] } = {};
      await Promise.all(courses.map(async (course) => {
        const subSnap = await getDocs(collection(db, 'courses', course.id, 'subjects'));
        subjectsMap[course.id] = subSnap.docs.map(d => ({ id: d.id, ...d.data() } as Subject));
      }));
      setCourseSubjects(subjectsMap);
    };
    fetchCourses();

    return () => { unsubEnroll(); if (unsubClasses) unsubClasses(); };
  }, [user.uid]);

  const handleEnroll = async (course: Course) => {
    const courseId = course.id;
    const price = course.price ?? 0;
    if (price > 0) {
      setActionLoading(courseId);
      try {
        const res = await fetch('/api/createOrder', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: price * 100 }),
        });
        const order = await res.json();
        if (!res.ok) throw new Error(order.error || 'Failed to create order');
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount, currency: order.currency,
          name: 'Edu-Alt-Tech', description: course.title, order_id: order.id,
          handler: async (response: any) => {
            const verifyRes = await fetch('/api/verifyPayment', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              await setDoc(doc(db, 'enrollments', `${user.uid}_${courseId}`), {
                studentId: user.uid, courseId, enrolledAt: serverTimestamp(),
                paymentId: response.razorpay_payment_id, amountPaid: price,
              });
            } else alert('Payment verification failed.');
          },
          prefill: { email: user.email || '' }, theme: { color: '#10b981' },
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', () => alert('Payment failed. Please try again.'));
        rzp.open();
      } catch (e: any) { alert(e.message || 'Payment initiation failed'); }
      finally { setActionLoading(null); }
    } else {
      setActionLoading(courseId);
      try {
        await setDoc(doc(db, 'enrollments', `${user.uid}_${courseId}`), {
          studentId: user.uid, courseId, enrolledAt: serverTimestamp(),
        });
      } catch { alert('Failed to enroll'); }
      finally { setActionLoading(null); }
    }
  };

  const handleJoinClass = async (cls: ClassSession) => {
    setActionLoading(cls.id);
    try {
      await setDoc(doc(db, 'attendance', `${cls.id}_${user.uid}`), {
        classId: cls.id, studentId: user.uid, courseId: cls.courseId,
        status: 'Present', joinedAt: serverTimestamp(),
      });
      window.open(cls.meetLink, '_blank');
    } catch { alert('Failed to log attendance'); }
    finally { setActionLoading(null); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-neon-cyan" /></div>;

  const enrolledCoursesList = allCourses.filter(c => enrolledCourseIds.includes(c.id));
  const availableCoursesList = allCourses.filter(c => !enrolledCourseIds.includes(c.id));
  const firstName = user.displayName?.split(' ')[0] || 'Learner';

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto space-y-10">

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && selectedCourse && (
        <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} readonly />
      )}

      {activeTab === 'overview' && !selectedCourse && (
        <div className="space-y-10">
          {/* Hero greeting */}
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden bg-space-900 border border-white/5 p-6 md:p-10 shadow-[0_0_40px_rgba(0,240,255,0.05)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-neon-cyan font-bold text-sm uppercase tracking-widest mb-2 font-display">{getGreeting()} 👋</p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 font-display neon-text glow">{firstName}</h2>
                <div className="flex items-center gap-4 text-space-300 text-sm font-medium">
                  <span className="flex items-center gap-2 bg-space-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                    <BookOpen className="w-4 h-4 text-neon-cyan" /> {enrolledCoursesList.length} Active
                  </span>
                  <span className="flex items-center gap-2 bg-space-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                    <CalendarIcon className="w-4 h-4 text-neon-purple" /> {upcomingClasses.length} Upcoming
                  </span>
                  <span className="flex items-center gap-2 bg-space-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                    <Target className="w-4 h-4 text-neon-pink" /> 
                    {enrolledCoursesList.reduce((acc, c) => acc + (courseSubjects[c.id]?.length || 0), 0)} Subjects
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Resume last lesson */}
                {enrolledCoursesList.length > 0 && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCourse(enrolledCoursesList[0])}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-neon-cyan text-space-900 font-bold rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                  >
                    <Play className="w-4 h-4 fill-space-900" /> Resume Learning
                  </motion.button>
                )}
                {/* Notification bell */}
                <div className="relative">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNotif(v => !v)}
                    className="relative flex items-center justify-center w-12 h-12 glass-panel hover:bg-white/10 rounded-xl transition-all"
                  >
                    <Bell className="w-5 h-5 text-neon-cyan" />
                    {notifications.filter(n => !readIds.has(n.id)).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-pink rounded-full text-xs flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(255,42,133,0.6)]">
                        {notifications.filter(n => !readIds.has(n.id)).length}
                      </span>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {showNotif && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-16 w-80 glass-dark border border-white/5 rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                          <p className="text-white font-bold text-sm font-display tracking-wide">NOTIFICATIONS</p>
                          {notifications.length > 0 && (
                            <button onClick={() => setReadIds(new Set(notifications.map(n => n.id)))}
                              className="text-xs text-neon-cyan hover:text-white font-bold transition-colors uppercase tracking-wider"
                            >Clear All</button>
                          )}
                        </div>
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-space-400 text-sm">No new signals.</div>
                        ) : (
                          <div className="max-h-72 overflow-y-auto hidden-scrollbar">
                            {notifications.map(n => (
                              <div key={n.id}
                                onClick={() => setReadIds(prev => new Set([...prev, n.id]))}
                                className={`px-4 py-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0 ${!readIds.has(n.id) ? 'bg-neon-blue/5' : ''}`}
                              >
                                <div className="flex items-start gap-3">
                                  {!readIds.has(n.id) && <div className="w-2 h-2 bg-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)] rounded-full flex-shrink-0 mt-1.5" />}
                                  <div className={!readIds.has(n.id) ? '' : 'pl-5'}>
                                    <p className="text-space-200 text-sm leading-relaxed">{n.text}</p>
                                    <p className="text-space-500 text-xs mt-2 font-mono">
                                      {n.createdAt?.toDate?.()?.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) || 'JUST NOW'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Courses', value: enrolledCoursesList.length, icon: '📚', color: 'text-neon-blue', borderColor: 'border-neon-blue/20' },
              { label: 'Upcoming', value: upcomingClasses.length, icon: '📅', color: 'text-neon-cyan', borderColor: 'border-neon-cyan/20' },
              { label: 'Subjects', value: enrolledCoursesList.reduce((acc, c) => acc + (courseSubjects[c.id]?.length || 0), 0), icon: '🧠', color: 'text-neon-purple', borderColor: 'border-neon-purple/20' },
              { label: 'Available', value: availableCoursesList.length, icon: '🎯', color: 'text-neon-pink', borderColor: 'border-neon-pink/20' },
            ].map((stat, i) => (
              <motion.div key={stat.label} custom={i} variants={CARD_VARIANTS} initial="hidden" animate="visible"
                className={`glass-panel p-6 border-b-2 hover:-translate-y-1 transition-all ${stat.borderColor}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-bold text-space-400 uppercase tracking-widest">{stat.label}</p>
                  <span className="text-xl filter drop-shadow-md">{stat.icon}</span>
                </div>
                <p className={`text-4xl font-extrabold ${stat.color} font-display tracking-tight`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Enrolled courses */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 font-display flex items-center gap-3">
              <span className="w-8 h-[2px] bg-neon-cyan"></span> Your Astral Paths
            </h3>
            {enrolledCoursesList.length === 0 ? (
              <div className="py-16 text-center glass-dark rounded-3xl border border-white/5">
                <p className="text-space-400 font-medium">You haven't initiated any paths yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {enrolledCoursesList.map((course, i) => {
                  const badge = BADGES[i % BADGES.length];
                  const progress = Math.floor(30 + (i * 17) % 60);
                  return (
                    <motion.div key={course.id} custom={i} variants={CARD_VARIANTS} initial="hidden" animate="visible"
                      whileHover={{ scale: 1.02 }}
                      className="glass-dark rounded-2xl p-6 flex flex-col gap-4 border border-white/5 hover:border-neon-cyan/30 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg text-white group-hover:text-neon-cyan transition-colors line-clamp-2 pr-2">{course.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-sm bg-white/5 text-space-300 uppercase tracking-widest">{badge}</span>
                      </div>
                      <p className="text-sm text-space-400 line-clamp-2">{course.description}</p>
                      {/* Progress */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs font-mono text-space-400 mb-2">
                          <span>PROGRESS</span>
                          <span className="text-neon-cyan">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-space-800 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                            className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.6)]"
                          />
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCourse(course)}
                        className="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/5 hover:border-white/10 text-sm uppercase tracking-wide"
                      >
                        Continue Path <ArrowRight className="w-4 h-4 text-neon-cyan" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommended courses */}
          {availableCoursesList.length > 0 && (
            <div className="pt-10">
              <h3 className="text-2xl font-bold text-white mb-6 font-display flex items-center gap-3">
                <span className="w-8 h-[2px] bg-neon-purple"></span> Recommended Modules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availableCoursesList.slice(0, 3).map((course, i) => (
                  <motion.div key={course.id} custom={i} variants={CARD_VARIANTS} initial="hidden" animate="visible"
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel p-6 flex flex-col gap-4 border border-white/5 hover:border-neon-purple/30 transition-all group relative"
                  >
                    <h4 className="font-bold text-white group-hover:text-neon-purple transition-colors line-clamp-2">{course.title}</h4>
                    <p className="text-sm text-space-400 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <span className="text-neon-purple font-mono text-sm font-bold flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />{course.price && course.price > 0 ? course.price : 'FREE'}
                      </span>
                      <motion.button whileTap={{ scale: 0.95 }}
                        onClick={() => handleEnroll(course)} disabled={actionLoading === course.id}
                        className="px-5 py-2 bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple border border-neon-purple/30 text-xs font-bold rounded-lg transition-colors tracking-widest uppercase"
                      >
                        {actionLoading === course.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Enroll'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CATALOG ──────────────────────────────────────────────────────── */}
      {activeTab === 'enroll' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3 font-display neon-text glow">Global Catalog</h2>
            <p className="text-space-400 max-w-2xl font-medium">
              Explore advanced subjective frameworks and alternative reality curriculums curated by master guides.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCoursesList.length === 0 && (
              <div className="col-span-full py-16 text-center glass-dark rounded-3xl border border-white/5 text-space-400">
                No new paths available at this dimensional frequency.
              </div>
            )}
            {availableCoursesList.map((course, i) => {
              const badge = BADGES[i % BADGES.length];
              return (
                <motion.div key={course.id} custom={i} variants={CARD_VARIANTS} initial="hidden" animate="visible"
                  whileHover={{ y: -5 }}
                  className="glass-dark rounded-2xl p-6 border border-white/5 flex flex-col gap-5 hover:border-neon-cyan/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-2 pr-4 font-display">{course.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-1 bg-white/5 border border-white/10 text-space-300 rounded-sm uppercase tracking-widest shrink-0">{badge}</span>
                  </div>
                  <p className="text-sm text-space-400 line-clamp-3 leading-relaxed">{course.description}</p>
                  
                  {courseSubjects[course.id]?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {courseSubjects[course.id].map(sub => (
                        <span key={sub.id} className="px-2 py-1 bg-neon-cyan/10 text-neon-cyan text-[10px] font-bold font-mono rounded border border-neon-cyan/20">
                          {sub.title.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center font-mono font-bold text-white">
                      <IndianRupee className="w-4 h-4 text-neon-cyan" />
                      {course.price && course.price > 0 ? <span>{course.price}</span> : <span className="text-neon-cyan">FREE</span>}
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => handleEnroll(course)} disabled={actionLoading === course.id}
                      className="px-6 py-2.5 bg-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] text-space-900 font-bold text-sm uppercase tracking-wider rounded-xl transition-all"
                    >
                      {actionLoading === course.id ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Access'}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── UPCOMING ─────────────────────────────────────────────────────── */}
      {activeTab === 'upcoming' && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white font-display flex items-center gap-3">
            <span className="w-8 h-[2px] bg-neon-blue"></span> Transmission Schedule
          </h2>
          <div className="glass-panel border border-white/5 rounded-3xl min-h-[400px]">
            {upcomingClasses.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <CalendarIcon className="w-10 h-10 text-space-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">Silence on the network</h3>
                <p className="text-space-400 font-medium max-w-sm">No scheduled transmissions. Use this cycle for deep processing.</p>
              </div>
            ) : (
              <div className="p-6 md:p-8 space-y-4">
                {upcomingClasses.map((cls, i) => {
                  const courseTitle = allCourses.find(c => c.id === cls.courseId)?.title || 'Unknown Path';
                  return (
                    <motion.div key={cls.id} custom={i} variants={CARD_VARIANTS} initial="hidden" animate="visible"
                      className="p-6 border border-white/5 rounded-2xl hover:border-neon-blue/30 hover:bg-white/5 transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between glass-dark relative overflow-hidden group"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2 py-1 text-[10px] font-black font-mono uppercase tracking-widest rounded ${cls.type === 'Live' ? 'bg-neon-pink/10 text-neon-pink border border-neon-pink/20' : 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'}`}>
                            {cls.type === 'Live' ? 'LIVE SYNC' : 'VOD ARCHIVE'}
                          </span>
                          <span className="text-[10px] font-bold text-space-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-neon-blue" />
                            {courseTitle}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xl mb-2 font-display">{cls.title}</h4>
                        <p className="text-sm font-mono text-space-300 flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-space-500" />
                          {new Date(cls.date).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' }).toUpperCase()}
                        </p>
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => handleJoinClass(cls)} disabled={actionLoading === cls.id}
                        className="px-8 py-3 bg-white/5 hover:bg-neon-blue hover:text-space-900 border border-white/10 hover:border-neon-blue text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg w-full md:w-auto disabled:opacity-50 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(0,112,243,0.3)]"
                      >
                        {actionLoading === cls.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{cls.type === 'Live' ? 'Connect' : 'Access Log'}<ExternalLink className="w-4 h-4" /></>}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'messages' && (
        <Chat user={user} role="student" />
      )}
    </div>
  );
};

export default StudentDashboard;
