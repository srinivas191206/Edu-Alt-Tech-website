
import React from 'react';
import { auth } from '../lib/firebase';
import { User, LogOut, Layout, BookOpen, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const Dashboard: React.FC = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">Welcome Back, {user?.displayName || 'Learner'}</h1>
            <p className="text-slate-500 text-lg">Your execution journey continues here.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Active Modules</h3>
            <p className="text-4xl font-bold text-slate-900">0</p>
            <p className="text-slate-500 text-sm mt-2">Enroll in your first module to begin.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hours Studied</h3>
            <p className="text-4xl font-bold text-slate-900">0</p>
            <p className="text-slate-500 text-sm mt-2">Consistency is the key to execution.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Goals Completed</h3>
            <p className="text-4xl font-bold text-slate-900">0</p>
            <p className="text-slate-500 text-sm mt-2">Turn enrollment into execution.</p>
          </div>
        </div>

        <div className="mt-12 bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white text-center">
          <Layout className="w-16 h-16 text-[#90EE90] mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-4">You're Authenticated</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            This is your private dashboard. Only you can see this information. We are currently working on adding more human-centric learning features.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-[#90EE90] text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all">
              Join Study Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
