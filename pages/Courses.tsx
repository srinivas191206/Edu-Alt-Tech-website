import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { auth, onAuthStateChanged, db, collection, getDocs, query } from '../lib/firebase';
import { Course } from '../types';
import { Search, Book, Sparkles, Globe, GraduationCap, Compass, ExternalLink, Code, Clock, CircleDollarSign, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from '../components/LoginModal';
import { PLATFORM_COURSES } from '../data/platformCourses';

const FOLDER_MAP: Record<string, 'education' | 'alternative'> = {
 'Core Education': 'education',
 'Language Skills': 'education',
 'Music': 'education',
 'Dance': 'education',
 'Arts & Creativity': 'education',
 'Life Skills': 'education',
 'Mind Sports': 'education',
 'Health & Wellness': 'education',
};

const EDUCATION_FOLDERS = new Set(['Core Education', 'Language Skills', 'Music', 'Dance', 'Arts & Creativity', 'Life Skills', 'Mind Sports', 'Health & Wellness']);

function getFallbackThumbnail(title: string, folder: string): string {
 const colors: Record<string, [string, string]> = {
 'Artificial Intelligence': ['#059669', '#10b981'],
 'Entrepreneurship': ['#7c3aed', '#a855f7'],
 'Career Development': ['#0284c7', '#38bdf8'],
 'Finance': ['#ca8a04', '#eab308'],
 'Innovation': ['#ea580c', '#f97316'],
 'Life Skills': ['#0891b2', '#22d3ee'],
 'Robotics': ['#4f46e5', '#818cf8'],
 'Cybersecurity': ['#1e293b', '#475569'],
 'Creator Economy': ['#be123c', '#f43f5e'],
 'Future Technologies': ['#6d28d9', '#8b5cf6'],
 'Technology': ['#0369a1', '#0ea5e9'],
 'Core Education': ['#0d9488', '#14b8a6'],
 'Language Skills': ['#d97706', '#f59e0b'],
 'Music': ['#9333ea', '#a855f7'],
 'Dance': ['#db2777', '#ec4899'],
 'Arts & Creativity': ['#e11d48', '#fb7185'],
 'Mind Sports': ['#15803d', '#22c55e'],
 'Health & Wellness': ['#059669', '#34d399'],
 };
 const [c1, c2] = colors[folder] || ['#6366f1', '#a855f7'];
 return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${c1}"/><stop offset="100%" style="stop-color:${c2}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="200" y="200" text-anchor="middle" font-size="64" fill="rgba(255,255,255,0.2)">📚</text><text x="200" y="260" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.6)" font-weight="bold" font-family="sans-serif">${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</text></svg>`)}`;
}

function getThumbnail(title: string, folder: string): string {
 const seed = encodeURIComponent((title || folder || 'course').replace(/\s+/g, '-').toLowerCase().slice(0, 50));
 return `https://picsum.photos/seed/${seed}/400/225`;
}

const PROVIDER_LOGOS: Record<string, string> = {
  'DeepLearningAI': 'https://www.deeplearning.ai/favicon.ico',
  'Hugging Face': 'https://huggingface.co/front/assets/huggingface_logo.svg',
};

const providerIcons: Record<string, React.ReactNode> = {
  'DeepLearningAI': <Book className="w-5 h-5" />,
  'Hugging Face': <Code className="w-5 h-5" />,
};

const Courses: React.FC = () => {
 const [courses, setCourses] = useState<Course[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [activeFilter, setActiveFilter] = useState<'all' | 'education' | 'alternative'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
 const [user, setUser] = useState<any>(auth.currentUser);
 const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 const navigate = useNavigate();

 useEffect(() => {
 const unsubscribe = onAuthStateChanged(auth, (u) => {
 setUser(u);
 });
 return () => unsubscribe();
 }, []);

 useEffect(() => {
 const fetchCourses = async () => {
 try {
 const q = query(collection(db, 'courses'));
 const querySnapshot = await getDocs(q);
 const fetchedCourses: Course[] = [];
 querySnapshot.forEach((doc) => {
 const data = doc.data();
 const folder = data.folder || data.category || '';
 fetchedCourses.push({
 id: doc.id,
 title: data.title || '',
 description: data.description || '',
 category: FOLDER_MAP[folder] || 'alternative',
 price: data.price ?? 0,
 thumbnailUrl: data.thumbnailUrl || getThumbnail(data.title || 'Course', folder),
 folder,
 duration: data.duration,
 level: data.level,
 classLevel: data.classLevel || data.class_level || 'General',
 comingSoon: data.comingSoon ?? data.coming_soon ?? false,
 createdAt: data.createdAt || data.created_at,
 createdBy: data.createdBy || '',
 } as Course);
 });
 // Add provider courses as Coming Soon at the top
 AI_COURSES.forEach((provider, pi) => {
 provider.courses.forEach((course, ci) => {
 const courseTitle = typeof course === 'string' ? course : course.title;
 const courseUrl = typeof course === 'string' ? provider.url : course.url;
 fetchedCourses.push({
 id: `ai-${pi}-${ci}`,
 title: courseTitle,
 description: `Free course from ${provider.name}. Master ${courseTitle.toLowerCase()} with industry-leading curriculum.`,
 category: 'alternative',
 price: 0,
 thumbnailUrl: `https://picsum.photos/seed/${provider.name.toLowerCase().replace(/\s+/g, '-')}-${ci}/400/225`,
 folder: 'Artificial Intelligence',
 duration: 'Self-paced',
 level: 'beginner',
 classLevel: 'General',
 comingSoon: false,
 provider: provider.name,
 externalUrl: courseUrl,
 createdAt: new Date().toISOString(),
 createdBy: 'provider',
 } as Course & { provider?: string });
 });
  });
  // Add platform courses
  PLATFORM_COURSES.forEach((course, pi) => {
  fetchedCourses.push({
  id: `pc-${pi}`,
  ...course,
  createdAt: new Date().toISOString(),
  createdBy: 'admin',
  } as Course);
  });
  // Sort: provider courses first (with their order preserved), then DB courses
  const providerCourses = fetchedCourses.filter(c => c.id.startsWith('ai-'));
  const dbCourses = fetchedCourses.filter(c => !c.id.startsWith('ai-') && !c.id.startsWith('pc-'));
  const platformCourses = fetchedCourses.filter(c => c.id.startsWith('pc-'));
  setCourses([...providerCourses, ...platformCourses, ...dbCourses]);
 } catch (err) {
 console.error("Failed to fetch courses", err);
 } finally {
 setLoading(false);
 }
 };
 fetchCourses();
 }, []);

  const filteredCourses = useMemo(() => {
  return courses
  .filter(course => {
  if ((course.folder || '') === 'Marketing') return false;
   const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
   (course.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
   (course.provider || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
   (course.folder || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
   (course.category || '').toLowerCase().includes(searchTerm.toLowerCase());
  
  let matchesCategory = true;
  if (activeFilter === 'education') {
  matchesCategory = EDUCATION_FOLDERS.has(course.folder || '');
  } else if (activeFilter === 'alternative') {
  matchesCategory = !EDUCATION_FOLDERS.has(course.folder || '');
  }
  
   let matchesPrice = true;
   const price = course.price ?? -1;
   if (priceFilter === 'free') matchesPrice = price === 0;
   else if (priceFilter === 'paid') matchesPrice = price > 0;

   return matchesSearch && matchesCategory && matchesPrice;
   })
  .sort((a, b) => {
  const aPaid = (a.price ?? 0) > 0 ? 1 : 0;
  const bPaid = (b.price ?? 0) > 0 ? 1 : 0;
  return bPaid - aPaid;
  });
  }, [courses, searchTerm, activeFilter, priceFilter]);

 const providerCourses = useMemo(() => filteredCourses.filter(c => c.id.startsWith('ai-')), [filteredCourses]);
 const dbCourses = useMemo(() => filteredCourses.filter(c => !c.id.startsWith('ai-')), [filteredCourses]);

 const displayedCourses = useMemo(() => {
 return !user ? filteredCourses.slice(0, 3) : filteredCourses;
 }, [filteredCourses, user]);

  return (
  <>
  <Helmet>
    <title>Courses | Edu Alt Tech</title>
    <link rel="canonical" href="https://www.edualttech.com/#/courses" />
  </Helmet>
  <div className="min-h-screen bg-slate-50 selection:bg-emerald-500/30">
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
  <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[60px] rounded-full" />
  <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/5 blur-[60px] rounded-full" />
  </div>

 <div className="max-w-[1400px] mx-auto relative z-10 px-6 py-24 md:py-32">
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 md:mb-16">
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-800 text-[10px] font-black tracking-[0.2em] uppercase mb-6 shadow-sm">
 <Sparkles className="w-4 h-4 text-emerald-500" /> Course Catalog
 </div>
 <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.85]">
 Explore Our{' '}
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500">Learning</span> Pathways.
 </h1>
 <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-xl">
 Curated courses from top providers and our own curriculum. Master in-demand skills with structured learning paths.
 </p>
 </motion.div>

 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
 <div className="relative max-w-md">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
 <input type="text" placeholder="Search courses or providers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-14 pr-6 py-4 bg-white backdrop-blur-xl rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow font-medium placeholder:text-slate-400" />
 </div>
 </motion.div>

 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
 className="flex flex-wrap gap-3 mb-6">
 {[
 { id: 'all', label: 'All Courses', icon: Compass },
 { id: 'education', label: 'Subjective', icon: GraduationCap },
 { id: 'alternative', label: 'Alternative', icon: Sparkles },
 ].map((f) => (
 <button key={f.id} onClick={() => setActiveFilter(f.id as any)}
 className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-colors ${
 activeFilter === f.id
 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
 : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-500/50'
 }`}>
 <f.icon className="w-4 h-4" /> {f.label}
 </button>
 ))}

    <div className="w-px h-8 bg-slate-200 self-center" />
    {[
      { id: 'all', label: 'All Prices', icon: CircleDollarSign },
      { id: 'free', label: 'Free', icon: CircleDollarSign },
      { id: 'paid', label: 'Paid', icon: CircleDollarSign },
    ].map((f) => (
      <button key={f.id} onClick={() => setPriceFilter(f.id as any)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-colors ${
          priceFilter === f.id
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
            : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-500/50'
        }`}>
        <f.icon className="w-3.5 h-3.5" /> {f.label}
      </button>
    ))}
  </motion.div>

 {loading ? (
 <div className="flex flex-col items-center justify-center py-40 gap-4">
 <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ willChange: 'transform' }}>
 <Sparkles className="w-12 h-12 text-emerald-500" />
 </motion.div>
 <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Loading courses...</p>
 </div>
 ) : filteredCourses.length > 0 ? (
 <>
  {/* Available Courses Section — paid first, then free */}
  {dbCourses.length > 0 && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  <div className="flex items-center gap-3 mb-6">
  <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
  <Book className="w-5 h-5" />
  </div>
  <div>
  <h2 className="text-xl font-black text-slate-900">Available Now</h2>
  <p className="text-xs text-slate-500 font-medium">Enroll and start learning today</p>
  </div>
  </div>
  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  <AnimatePresence mode="popLayout">
  {displayedCourses.filter(c => !c.id.startsWith('ai-')).map((course) => (
 <motion.div layout key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
 className="group bg-white backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-500/30 hover:shadow-[0_32px_64px_-16px_rgba(16,185,129,0.1)] transition-all duration-500 flex flex-col">
 <div className="relative h-48 overflow-hidden bg-slate-100">
 {course.price === 0 ? (
 <img src={course.thumbnailUrl} loading="lazy" decoding="async" alt="" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
 onError={(e) => { const el = e.target as HTMLImageElement; if (!el.dataset.fallback) { el.dataset.fallback = '1'; el.src = getFallbackThumbnail(course.title, course.folder || ''); } }} />
 ) : (
 <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
 <div className="text-center px-6">
 <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 flex items-center justify-center">
 <Book className="w-8 h-8 text-white/60" />
 </div>
 <h4 className="text-white font-bold text-sm leading-tight line-clamp-2">{course.title}</h4>
 </div>
 </div>
 )}
 <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
 <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-200/50">
 {course.folder || course.category}
 </div>
 {course.classLevel && (
 <div className="px-3 py-1.5 bg-indigo-600/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-indigo-500/20">
 {course.classLevel}
 </div>
 )}
 </div>
  <div className={`absolute top-4 right-4 px-3 py-1.5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider ${course.comingSoon ? 'bg-amber-500/90 text-white' : 'bg-emerald-500/90 text-white'}`}>
    {course.comingSoon ? 'Coming Soon' : course.price === 0 ? 'Free' : `₹${course.price}/month`}
  </div>
 </div>
 <div className="p-6 flex flex-col flex-1">
 <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight leading-tight group-hover:text-emerald-500 transition-colors line-clamp-2">
 {course.title}
 </h3>
 <p className="text-sm text-slate-500 mb-5 font-medium leading-relaxed line-clamp-2 flex-1">
 {course.description}
 </p>
  {course.comingSoon ? (
    <span className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-amber-100 text-amber-600 rounded-xl font-bold text-sm tracking-wide cursor-not-allowed">
      <Clock className="w-4 h-4" /> Coming Soon
    </span>
  ) : !user ? (
    <button onClick={() => setIsAuthModalOpen(true)}
      className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-emerald-500 hover:text-white transition-all active:scale-[0.98]">
      Explore Course →
    </button>
  ) : course.externalUrl ? (
 <a href={course.externalUrl} target="_blank" rel="noopener noreferrer"
 className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm tracking-wide hover:from-emerald-600 hover:to-teal-600 transition-all active:scale-[0.98]">
 Start Free <ExternalLink className="w-4 h-4" />
 </a>
 ) : (
 <Link to={`/courses/${course.id}`}
 className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-emerald-500 hover:text-white transition-all active:scale-[0.98]">
 Explore Course →
 </Link>
 )}
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 </motion.div>
 </motion.div>
 )}

  {/* Provider Courses Section — free, shown after paid */}
  {providerCourses.length > 0 && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
  <div className="flex items-center gap-3 mb-6">
  <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
  <Globe className="w-5 h-5" />
  </div>
  <div>
  <h2 className="text-xl font-black text-slate-900">Free Courses from Industry Leaders</h2>
  <p className="text-xs text-slate-500 font-medium">Free, high-quality courses from top providers — start learning today</p>
  </div>
  <div className="ml-auto hidden sm:flex items-center gap-2">
  <span className="text-xs text-slate-400 font-bold">{providerCourses.length} courses</span>
  <div className="flex -space-x-2">
  {AI_COURSES.slice(0, 5).map((p, i) => (
  <img key={i} src={p.logo} loading="lazy" decoding="async" alt={p.name} className="w-6 h-6 rounded-full border-2 border-white bg-white"
  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
  ))}
  </div>
  </div>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {providerCourses.map((course) => {
  const provider = course.provider || '';
  return (
  <motion.div key={course.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
  className="group relative bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  <div className="p-5 relative">
  <div className="flex items-center gap-3 mb-3">
  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600 shrink-0">
  {PROVIDER_LOGOS[provider] ? (
  <img src={PROVIDER_LOGOS[provider]} loading="lazy" decoding="async" alt={provider} className="w-5 h-5 rounded"
  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-5 h-5 flex items-center justify-center text-xs font-bold">' + provider.charAt(0) + '</div>'; }} />
  ) : (
  <span className="text-xs font-bold">{provider.charAt(0)}</span>
  )}
  </div>
  <div className="min-w-0">
  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{provider}</p>
  <p className="text-xs text-slate-400 font-medium truncate">{course.duration}</p>
  </div>
  </div>
  <h3 className="font-bold text-slate-900 mb-2 leading-snug text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">
  {course.title}
  </h3>
  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
  {course.description}
  </p>
  <div className="flex items-center justify-between">
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
  <Sparkles className="w-3 h-3" /> Free
  </span>
  <a href={course.externalUrl} target="_blank" rel="noopener noreferrer"
  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors">
  Start Free <ExternalLink className="w-3 h-3" />
  </a>
  </div>
  </div>
  </motion.div>
  );
  })}
  </div>
  </motion.div>
  )}

  {/* Guest Lock Overlay */}
 {!user && filteredCourses.length > 3 && (
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
 className="relative mt-12 py-16 px-8 rounded-3xl bg-white/20 border border-slate-200/50 backdrop-blur-2xl text-center overflow-hidden shadow-2xl">
 <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent pointer-events-none" />
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
 <div className="relative z-10 max-w-md mx-auto">
 <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 text-white mb-6 shadow-xl shadow-emerald-500/20">
 <Book className="w-8 h-8" />
 </div>
 <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
 Unlock {filteredCourses.length - 3} More Courses
 </h2>
 <p className="text-slate-500 mb-8 font-medium leading-relaxed">
 Join our premium community to gain full access to all curricular pathways, practice materials, and advanced resources.
 </p>
 <button
 onClick={() => setIsAuthModalOpen(true)}
 className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 hover:from-emerald-600 hover:via-teal-600 hover:to-indigo-600 text-white rounded-2xl font-extrabold tracking-wide shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
 >
 Unlock All Content
 </button>
 </div>
 </motion.div>
 )}
 </>
 ) : (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white backdrop-blur-xl rounded-3xl border border-slate-200">
 <Search className="w-12 h-12 text-slate-300 mx-auto mb-6" />
 <h3 className="text-2xl font-black text-slate-900 mb-2">No courses found</h3>
 <p className="text-slate-500 mb-6">Try a different search or filter.</p>
 <button onClick={() => { setSearchTerm(''); setActiveFilter('all'); setPriceFilter('all'); }}
 className="px-8 py-3.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-transform">Reset Filters</button>
 </motion.div>
 )}
  <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
  </div>
  </div>
  </>
  );
};

const AI_COURSES = [
  { name: "DeepLearningAI", url: "https://www.deeplearning.ai/courses/", logo: "https://www.deeplearning.ai/favicon.ico", courses: [
 { title: "AI Prompting for Everyone", url: "https://www.deeplearning.ai/courses/ai-prompting-for-everyone/" },
 { title: "Build with Andrew", url: "https://www.deeplearning.ai/courses/build-with-andrew/" },
 { title: "Agentic AI", url: "https://www.deeplearning.ai/courses/agentic-ai/" },
 { title: "AI Python for Beginners", url: "https://www.deeplearning.ai/courses/ai-python-for-beginners/" },
 { title: "AI for Everyone", url: "https://www.deeplearning.ai/courses/ai-for-everyone/" },
 { title: "Generative AI for Everyone", url: "https://www.deeplearning.ai/courses/generative-ai-for-everyone/" },
 { title: "Machine Learning in Production", url: "https://www.deeplearning.ai/courses/machine-learning-in-production/" },
 { title: "RAG", url: "https://www.deeplearning.ai/courses/retrieval-augmented-generation-rag/" },
 { title: "Fast and Efficient LLM Inference with vLLM", url: "https://www.deeplearning.ai/courses/fast-and-efficient-llm-inference-with-vllm/" },
 { title: "ChatGPT Prompt Engineering for Developers", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" },
 { title: "LangChain for LLM Application Development", url: "https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/" },
 { title: "Building Systems with ChatGPT API", url: "https://www.deeplearning.ai/short-courses/building-systems-with-chatgpt/" },
 { title: "Building and Evaluating Advanced RAG", url: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/" },
 { title: "Functions, Tools and Agents with LangChain", url: "https://www.deeplearning.ai/short-courses/functions-tools-agents-langchain/" },
 { title: "Finetuning Large Language Models", url: "https://www.deeplearning.ai/short-courses/finetuning-large-language-models/" },
 { title: "Building GenAI Apps with Gradio", url: "https://www.deeplearning.ai/short-courses/building-generative-ai-applications-with-gradio/" },
 { title: "Vector Databases: From Embeddings to Applications", url: "https://www.deeplearning.ai/short-courses/vector-databases-embeddings-applications/" },
 { title: "LLMs with Semantic Search", url: "https://www.deeplearning.ai/short-courses/large-language-models-semantic-search/" },
 { title: "How Diffusion Models Work", url: "https://www.deeplearning.ai/short-courses/how-diffusion-models-work/" },
 { title: "Building Apps with Vector Databases", url: "https://www.deeplearning.ai/short-courses/building-applications-vector-databases/" },
 { title: "Pretraining LLMs", url: "https://www.deeplearning.ai/short-courses/pretraining-llms/" },
 { title: "Generative AI with Large Language Models", url: "https://www.deeplearning.ai/courses/generative-ai-with-large-language-models/" },
 { title: "Prompt Engineering with Llama 2", url: "https://www.deeplearning.ai/short-courses/prompt-engineering-with-llama-2/" },
 { title: "Building and Evaluating Data Agents", url: "https://www.deeplearning.ai/short-courses/building-and-evaluating-data-agents/" },
 { title: "Automated Testing for LLMOps", url: "https://www.deeplearning.ai/short-courses/automated-testing-for-llmops/" },
 { title: "Quality and Safety for LLM Applications", url: "https://www.deeplearning.ai/short-courses/quality-safety-llm-applications/" },
 { title: "LangChain Chat with Your Data", url: "https://www.deeplearning.ai/short-courses/langchain-chat-with-your-data/" },
 { title: "Evaluating and Debugging Generative AI", url: "https://www.deeplearning.ai/short-courses/evaluating-debugging-generative-ai/" },
 { title: "Knowledge Graphs for RAG", url: "https://www.deeplearning.ai/short-courses/knowledge-graphs-rag/" },
 { title: "Multi AI Agent Systems with CrewAI", url: "https://www.deeplearning.ai/short-courses/multi-ai-agent-systems-with-crewai/" },
 { title: "AI Agentic Design Patterns with AutoGen", url: "https://www.deeplearning.ai/short-courses/ai-agentic-design-patterns-with-autogen/" },
 { title: "Building Agentic RAG with LlamaIndex", url: "https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/" },
 { title: "Serverless Agentic Workflows with Amazon Bedrock", url: "https://www.deeplearning.ai/short-courses/serverless-agentic-workflows-amazon-bedrock/" },
 { title: "AI Agents in LangGraph", url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/" },
 { title: "Reasoning with o1", url: "https://www.deeplearning.ai/short-courses/reasoning-with-o1/" },
 { title: "Open Source Models with Hugging Face", url: "https://www.deeplearning.ai/short-courses/open-source-models-hugging-face/" },
 { title: "LLMOps", url: "https://www.deeplearning.ai/short-courses/llmops/" },
 { title: "AI Agents and Agentic AI", url: "https://www.deeplearning.ai/short-courses/ai-agents-and-agentic-ai/" },
 { title: "Building Code Agents with Hugging Face", url: "https://www.deeplearning.ai/short-courses/building-code-agents-hugging-face/" },
 { title: "Building Towards Computer Use with Anthropic", url: "https://www.deeplearning.ai/short-courses/building-towards-computer-use-anthropic/" },
 { title: "MCP: Build Rich-Context AI Apps with Anthropic", url: "https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/" },
 { title: "Build and Train an LLM with JAX", url: "https://www.deeplearning.ai/short-courses/build-and-train-an-llm-with-jax/" },
 { title: "Building Live Voice Agents with Google's ADK", url: "https://www.deeplearning.ai/short-courses/building-live-voice-agents-with-googles-adk/" },
 { title: "Fast Prototyping of GenAI Apps with Streamlit", url: "https://www.deeplearning.ai/short-courses/fast-prototyping-of-genai-apps-with-streamlit/" },
 { title: "Fine-tuning & RL for LLMs: Intro to Post-training", url: "https://www.deeplearning.ai/short-courses/fine-tuning-rl-for-llms-intro-to-post-training/" },
 { title: "Design, Develop and Deploy Multi-Agent Systems with CrewAI", url: "https://www.deeplearning.ai/short-courses/design-develop-deploy-multi-agent-systems-crewai/" },
 { title: "Build Apps with Windsurf's AI Coding Agents", url: "https://www.deeplearning.ai/short-courses/build-apps-with-windsurfs-ai-coding-agents/" },
 { title: "Prompt Engineering for Vision Models", url: "https://www.deeplearning.ai/short-courses/prompt-engineering-for-vision-models/" },
 { title: "Efficiently Serving LLMs", url: "https://www.deeplearning.ai/short-courses/efficiently-serving-llms/" },
 { title: "Building AI Browser Agents", url: "https://www.deeplearning.ai/short-courses/building-ai-browser-agents/" },
 { title: "Event Driven Agentic Document Workflows", url: "https://www.deeplearning.ai/short-courses/event-driven-agentic-document-workflows/" },
 { title: "Practical Multi AI Agents and Advanced Use Cases", url: "https://www.deeplearning.ai/short-courses/practical-multi-ai-agents/" },
 { title: "Building AI Powered Search Systems", url: "https://www.deeplearning.ai/short-courses/building-ai-powered-search-systems/" },
 { title: "Embedding Models From Theory to Practice", url: "https://www.deeplearning.ai/short-courses/embedding-models-from-theory-to-practice/" },
 { title: "Advanced Retrieval for AI Applications", url: "https://www.deeplearning.ai/short-courses/advanced-retrieval-for-ai-applications/" },
 { title: "Building Agent Memory Systems", url: "https://www.deeplearning.ai/short-courses/building-agent-memory-systems/" },
 { title: "Evaluating AI Agents", url: "https://www.deeplearning.ai/short-courses/evaluating-ai-agents/" },
 { title: "Building AI Applications with Open Source Models", url: "https://www.deeplearning.ai/short-courses/building-ai-applications-open-source-models/" },
 { title: "Production RAG Systems", url: "https://www.deeplearning.ai/short-courses/production-rag-systems/" },
 { title: "Agent Communication Protocols", url: "https://www.deeplearning.ai/short-courses/agent-communication-protocols/" },
 ] },
 { name: "Hugging Face", url: "https://huggingface.co/learn", logo: "https://huggingface.co/front/assets/huggingface_logo.svg", courses: [
 { title: "LLM Course", url: "https://huggingface.co/learn/llm-course" },
 { title: "Agents Course", url: "https://huggingface.co/learn/agents-course" },
 { title: "Computer Vision Course", url: "https://huggingface.co/learn/computer-vision-course" },
 { title: "Deep Reinforcement Learning Course", url: "https://huggingface.co/learn/deep-rl-course" },
 { title: "Diffusion Course", url: "https://huggingface.co/learn/diffusion-course" },
 { title: "ML for Games Course", url: "https://huggingface.co/learn/ml-games-course" },
 { title: "Robotics Course", url: "https://huggingface.co/learn/robotics-course" },
 { title: "a smol course", url: "https://huggingface.co/learn/smol-course" },
  { title: "Open-Source AI Cookbook", url: "https://huggingface.co/learn/cookbook" },
   ] },
];

export default Courses;
