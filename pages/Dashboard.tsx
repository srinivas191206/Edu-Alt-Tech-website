import React, { useState, useEffect } from 'react';
import { auth, db, onAuthStateChanged, doc, onSnapshot, collection, query, where, getDocs, getDoc } from '../lib/firebase';
import { Loader2, BookOpen, Download, Award, User, FileText, GraduationCap, ArrowRight, Clock, Star, TrendingUp, CheckCircle, Library, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserObject, CourseEnrollment, Course } from '../types';
import { motion } from 'framer-motion';

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [userProfile, setUserProfile] = useState<UserObject | null>(null);
  const [enrollments, setEnrollments] = useState<(CourseEnrollment & { courseData?: Course })[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) { navigate('/login'); return; }

      const unsubProfile = onSnapshot(doc(db, 'users', u.uid), (docObj) => {
        if (docObj.exists()) setUserProfile({ uid: docObj.id, ...docObj.data() } as UserObject);
      });

      try {
        const q = query(collection(db, 'enrollments'), where('userId', '==', u.uid), where('role', '==', 'student'));
        const snap = await getDocs(q);
        const enrollments: any[] = [];
        for (const ds of snap.docs) {
          const data = ds.data();
          try {
            const cDoc = await getDoc(doc(db, 'courses', data.courseId));
            if (cDoc.exists()) enrollments.push({ id: ds.id, ...data, courseData: { id: cDoc.id, ...cDoc.data() } });
          } catch (e) {}
        }
        setEnrollments(enrollments);
      } catch (err) { console.error(err); }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
            {getGreeting()}, {userProfile?.name || 'Learner'}!
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Welcome to your school technology learning dashboard.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center mb-3"><BookOpen className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{enrollments.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enrolled Courses</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center mb-3"><Award className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">0</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Certificates</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-3"><Download className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">0</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Resources</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-3"><Star className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">0%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Progress</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-emerald-500" /> My Courses
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
          </div>

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
