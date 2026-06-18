import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, onAuthStateChanged } from '../lib/firebase';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import type { User } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const TeacherApplication: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [subjects, setSubjects] = useState('');
  const [mode, setMode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) { navigate('/login'); return; }
      setName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!agreeTerms) {
      toast.error('Please accept the terms');
      return;
    }
    setSubmitLoading(true);
    try {
      const { error } = await db.from('teacher_applications').insert({
        user_id: user.uid,
        name,
        email,
        phone,
        highest_qualification: qualification,
        experience,
        subjects,
        teaching_mode: mode,
        agree_terms: agreeTerms,
        status: 'pending',
        applied_at: new Date().toISOString()
      });
      if (error) throw error;
      toast.success('Application submitted successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit application');
    } finally {
      setSubmitLoading(false);
    }
  };

  const inputCls = "w-full p-4 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm";
  const labelCls = "block text-xs font-black text-slate-400 uppercase tracking-widest mb-2";

  if (loading) {
    return <div className="min-h-screen pt-32 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="min-h-screen pt-28 pb-32 px-6 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl mx-auto relative z-10">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white/90 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200/50">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Apply as Teacher</h1>
              <p className="text-sm text-slate-500 font-medium">Share your expertise and start teaching</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required className={inputCls} placeholder="Your full name" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Highest Qualification</label>
                <input value={qualification} onChange={e => setQualification(e.target.value)} className={inputCls} placeholder="e.g. B.Tech, M.Sc, Ph.D" />
              </div>
              <div>
                <label className={labelCls}>Years of Experience</label>
                <input type="number" min="0" value={experience} onChange={e => setExperience(e.target.value)} className={inputCls} placeholder="e.g. 3" />
              </div>
              <div>
                <label className={labelCls}>Subjects to Teach</label>
                <input value={subjects} onChange={e => setSubjects(e.target.value)} className={inputCls} placeholder="e.g. Algebra, Physics, Coding" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Teaching Mode</label>
                <select value={mode} onChange={e => setMode(e.target.value)} className={inputCls}>
                  <option value="">Select mode</option>
                  <option value="live">Live</option>
                  <option value="recorded">Recorded</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-50/50 rounded-2xl border border-slate-200">
              <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
              <span className="text-sm font-medium text-slate-700">I accept the Terms & Conditions for teaching on this platform.</span>
            </label>

            <button type="submit" disabled={submitLoading}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-lg"
            >
              {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              {submitLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherApplication;
