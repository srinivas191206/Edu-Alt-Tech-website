import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { LogOut, Loader2, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { UserObject } from '../types';
import { motion } from 'framer-motion';

import Sidebar from '../components/Sidebar';
import TeacherDashboard from '../components/TeacherDashboard';
import StudentDashboard from '../components/StudentDashboard';

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [userProfile, setUserProfile] = useState<UserObject | null>(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        navigate('/login');
      }
    });

    if (user) {
      // Self-healing: Ensure a profile exists (handles Google Auth and old test accounts)
      const ensureProfile = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            name: user.displayName || 'Learner',
            email: user.email || '',
            role: 'student',
            createdAt: new Date()
          });
        }
      };
      ensureProfile();

      const unsubProfile = onSnapshot(doc(db, 'users', user.uid), (docObj) => {
        if (docObj.exists()) {
          setUserProfile({ uid: docObj.id, ...docObj.data() } as UserObject);
        }
        setLoading(false);
      });

      return () => {
        unsubscribeAuth();
        unsubProfile();
      };
    } else {
      setLoading(false);
    }

    return () => unsubscribeAuth();
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (isSidebarOpen) setIsSidebarOpen(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading || (!userProfile && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Sidebar
        role={userProfile.role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`flex-1 ml-0 md:ml-64 flex flex-col pt-20 md:pt-24 min-h-screen`}>
        <div className="px-4 sm:px-6 md:px-10 pb-12 w-full max-w-6xl mx-auto flex-1 flex flex-col">
          {/* Top bar */}
          <div className="mb-6 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Mobile: hamburger + tab name */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(prev => !prev)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <span className="text-base font-bold text-slate-900 dark:text-white capitalize">{activeTab.replace('-', ' ')}</span>
              </div>
              <motion.button whileTap={{ scale: 0.96 }}
                onClick={handleLogout}
                className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
            {/* Desktop: greeting + logout */}
            <div className="hidden md:flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">{getGreeting()} 👋</p>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                  {userProfile.name.split(' ')[0]}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {userProfile.role === 'teacher' ? 'Manage your classes and students effortlessly.' : 'Ready to continue learning?'}
                </p>
              </div>

            </div>
          </div>
          <div className="flex-1">
            {userProfile.role === 'teacher' || userProfile.role === 'admin' ? (
              <TeacherDashboard user={user} activeTab={activeTab} />
            ) : (
              <StudentDashboard user={user} activeTab={activeTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
