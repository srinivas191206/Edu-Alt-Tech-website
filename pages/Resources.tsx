import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Download, FileText, BookOpen, Brain, FileSpreadsheet, Lock, Sparkles, ArrowRight, X } from 'lucide-react';
import { normalizeSearch } from '../lib/search';
import { Link, useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged, db, collection, getDocs } from '../lib/firebase';
import LoginModal from '../components/LoginModal';
import { getDriveSubfolders, getDriveDownloadUrl, getDriveFileCategory } from '../lib/drive';

export interface ResourceItem {
 title: string;
 description: string;
 type: 'pdf' | 'notes' | 'questions' | 'worksheet';
 category: string;
 premium: boolean;
 downloads: string;
 url?: string;
 viewUrl?: string;
 classLevel?: string;
}

export const STATIC_RESOURCES: ResourceItem[] = [];

const typeIcons: Record<string, React.ReactNode> = {
 pdf: <FileText className="w-5 h-5" />,
 notes: <BookOpen className="w-5 h-5" />,
 questions: <Brain className="w-5 h-5" />,
 worksheet: <FileSpreadsheet className="w-5 h-5" />,
};

const typeLabels: Record<string, string> = {
 pdf: "PDF",
 notes: "Notes",
 questions: "Question Bank",
 worksheet: "Worksheet",
};

const categories = ["All", "Mathematics", "Science", "English", "Social Studies", "Computer Science", "Engineering", "Management"];

const Resources: React.FC = () => {
 const [search, setSearch] = useState('');
 const [filter, setFilter] = useState('All');
 const [showPremium, setShowPremium] = useState<'all' | 'free' | 'premium'>('all');
 const [classFilter, setClassFilter] = useState('All');
 const [firebaseResources, setFirebaseResources] = useState<ResourceItem[]>([]);
 const [driveResources, setDriveResources] = useState<ResourceItem[]>([]);
 const [loadingDrive, setLoadingDrive] = useState(true);
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
 const fetchResources = async () => {
 try {
 const snap = await getDocs(collection(db, 'resources'));
 const items = snap.docs.map(d => {
 const data = d.data() as any;
 return { title: data.title || '', description: data.description || '', type: data.type || 'pdf', category: data.category || 'Computer Science', premium: data.premium || false, downloads: data.downloads || '0', url: data.url || '', classLevel: data.class_level || 'General' } as ResourceItem;
 });
 setFirebaseResources(items);
 } catch {}
 };
 fetchResources();
 }, []);

  useEffect(() => {
   const fetchDrive = async () => {
   try {
   const folders = await getDriveSubfolders();
   const items: ResourceItem[] = [];
   for (const folder of folders) {
   const category = getDriveFileCategory(folder.name);
   const folderLower = folder.name.toLowerCase();
   const isJee = folderLower.includes('jee') || folderLower.includes('iit') || folderLower.includes('jeee');
   for (const file of folder.files) {
   if (file.mimeType === 'application/vnd.google-apps.folder') continue;
   const name = file.name.replace(/\.pdf$/i, '');
   const sizeLabel = file.size ? ` (${(Number(file.size) / 1024 / 1024).toFixed(1)} MB)` : '';
   const fileLower = name.toLowerCase();
   const isJeeFile = fileLower.includes('jee') || fileLower.includes('iit') || fileLower.includes('advance') || fileLower.includes('mains') || (['physics', 'chemistry', 'mathematics', 'math'].includes(category.toLowerCase()) && (fileLower.includes('revision') || fileLower.includes('revison')));
   items.push({
   title: name,
   description: `${category} resource from Google Drive${sizeLabel}`,
   type: 'pdf',
   category,
   premium: false,
   downloads: '0',
   url: file.webContentLink || getDriveDownloadUrl(file.id),
   viewUrl: file.webViewLink || getDriveDownloadUrl(file.id).replace('uc?export=download', 'file/d') + '/view',
    classLevel: isJee || isJeeFile ? 'JEE Main' : 'College/Engineering',
   });
   }
   }
   setDriveResources(items);
  } catch (e) {
  console.error('Failed to load Drive resources', e);
  } finally {
  setLoadingDrive(false);
  }
  };
  fetchDrive();
  }, []);

 const allResources = useMemo(() => [...STATIC_RESOURCES, ...firebaseResources.filter(fr => !STATIC_RESOURCES.find(r => r.title === fr.title)), ...driveResources.filter(dr => !STATIC_RESOURCES.find(r => r.title === dr.title) && !firebaseResources.find(fr => fr.title === dr.title))], [firebaseResources, driveResources]);

 const trackDownload = async (item: ResourceItem) => {
 if (!auth.currentUser) return;
 try {
 await db.from('user_downloads').insert({
 user_id: auth.currentUser.uid,
 resource_title: item.title,
 resource_url: item.url || '',
 resource_type: item.type,
 downloaded_at: new Date().toISOString()
 });
 } catch (e) { console.error("Download track failed", e); }
 };

   const filtered = useMemo(() => {
   const normalizedSearch = normalizeSearch(search);
   return allResources.filter(r => {
   const haystack = normalizeSearch(r.title + ' ' + r.description + ' ' + (r.category || '') + ' ' + (r.classLevel || ''));
   const matchSearch = !normalizedSearch || haystack.includes(normalizedSearch);
   const matchCat = filter === 'All' || r.category === filter;
   const matchPremium = showPremium === 'all' || (showPremium === 'free' && !r.premium) || (showPremium === 'premium' && r.premium);
   const matchClass = classFilter === 'All' || r.classLevel === classFilter;
   return matchSearch && matchCat && matchPremium && matchClass;
   });
   }, [allResources, search, filter, showPremium, classFilter]);

 const displayedResources = useMemo(() => {
 return !user ? filtered.slice(0, 3) : filtered;
 }, [filtered, user]);

  return (
  <>
  <Helmet>
    <title>Learning Resources | Edu Alt Tech</title>
    <link rel="canonical" href="https://www.edualttech.com/#/resources" />
  </Helmet>
  <div className="min-h-screen pt-32 pb-32 px-6 bg-white relative overflow-hidden">
 <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[60px] rounded-full" />
 <div className="max-w-[1400px] mx-auto relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mb-16">
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 /30 border border-emerald-200 /50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
 <Sparkles className="w-4 h-4" />
 Learning Resources
 </div>
 <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
 Free & Premium<br />Educational <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500">Resources</span>
 </h1>
 <p className="text-lg text-slate-500 max-w-xl font-medium">
 Download free PDFs, notes, question banks, and worksheets. Premium resources available for enrolled students.
 </p>
 </motion.div>

 {/* Filters */}
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-4 mb-12 items-center">
 <div className="relative flex-1 min-w-[250px] max-w-md">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
 <input
 type="text" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)}
 className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 placeholder-slate-400"
 />
 </div>
 <div className="flex gap-2 flex-wrap">
 {categories.map(c => (
 <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
 filter === c ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 :bg-slate-800 border border-slate-200 '
 }`}>{c}</button>
 ))}
 </div>
  <div className="flex gap-2">
  {(['all', 'free', 'premium'] as const).map(s => (
  <button key={s} onClick={() => setShowPremium(s)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors ${
  showPremium === s ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 :bg-slate-800 border border-slate-200 '
  }`}>{s}</button>
  ))}
  </div>
  {(search || filter !== 'All' || showPremium !== 'all' || classFilter !== 'All') && (
    <button onClick={() => { setSearch(''); setFilter('All'); setShowPremium('all'); setClassFilter('All'); }}
      className="flex items-center gap-1.5 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors">
      <X className="w-3.5 h-3.5" /> Clear All
    </button>
  )}
  </motion.div>

 {/* Class Level Filters */}
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
 className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-slate-100 /60">
  {['All', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'College/Engineering', 'JEE Main'].map(lvl => (
 <button key={lvl} onClick={() => setClassFilter(lvl)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
 classFilter === lvl
 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
 : 'bg-slate-100 text-slate-600 hover:bg-slate-200 :bg-slate-800 border border-slate-200 '
 }`}>{lvl}</button>
 ))}
 </motion.div>

 {/* Grid */}
 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
 {displayedResources.map((item, idx) => (
 <motion.div
 key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
 className={`group bg-white border rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-2 ${
 item.premium
 ? 'border-amber-200 /50 hover:shadow-xl hover:shadow-amber-500/10'
 : 'border-slate-200 hover:shadow-xl hover:border-emerald-500'
 }`}
 >
 <div className="flex items-start justify-between mb-4">
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
 item.premium ? 'bg-amber-50 /20 text-amber-500' : 'bg-emerald-50 /20 text-emerald-500'
 }`}>{typeIcons[item.type]}</div>
 <div className="flex gap-2 flex-wrap justify-end">
 {item.classLevel && (
 <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-indigo-100 /30 text-indigo-700 ">
 {item.classLevel}
 </span>
 )}
 <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
 item.premium
 ? 'bg-amber-100 /30 text-amber-700 '
 : 'bg-emerald-100 /30 text-emerald-700 '
 }`}>{typeLabels[item.type]}</span>
 {item.premium && (
 <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-100 /30 text-amber-700 flex items-center gap-1">
 <Lock className="w-3 h-3" /> Premium
 </span>
 )}
 </div>
 </div>
  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
   {!user ? (
    <span onClick={() => setIsAuthModalOpen(true)} className="cursor-pointer">
     {item.title}
    </span>
   ) : (item.viewUrl || item.url) ? (
    <a href={item.viewUrl || item.url} target="_blank" rel="noopener noreferrer">
     {item.title}
    </a>
   ) : (
    item.title
   )}
  </h3>
  <p className="text-sm text-slate-500 mb-4 leading-relaxed">{item.description}</p>
  <div className="flex items-center justify-between flex-wrap gap-2">
  <span className="text-xs text-slate-400">{item.downloads} downloads</span>
  <div className="flex gap-2">
  {!user ? (
   <>
    <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-colors bg-indigo-600 hover:bg-indigo-50 text-white shadow-lg shadow-indigo-600/20">
     <BookOpen className="w-3 h-3" /> View
    </button>
    <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-colors bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20">
     <Download className="w-3 h-3" /> Download
    </button>
   </>
  ) : (
   <>
    {(item.viewUrl || item.url) && (
     <a href={item.viewUrl || item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-colors bg-indigo-600 hover:bg-indigo-50 text-white shadow-lg shadow-indigo-600/20">
      <BookOpen className="w-3 h-3" /> View
     </a>
    )}
    {item.url ? (
     <a href={item.viewUrl || item.url} target="_blank" rel="noopener noreferrer" onClick={() => trackDownload(item)} className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-colors ${
      item.premium
      ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/20'
      : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
     }`}>
      <Download className="w-3 h-3" /> {item.premium ? 'Unlock' : 'Download'}
     </a>
    ) : (
     <button className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-colors ${
      item.premium
      ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/20'
      : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
     }`}>
      <Download className="w-3 h-3" /> {item.premium ? 'Unlock' : 'Download'}
     </button>
    )}
   </>
  )}
  </div>
  </div>
 </motion.div>
 ))}
 </div>

 {/* Guest Lock Overlay */}
 {!user && filtered.length > 3 && (
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
 className="relative mt-12 py-16 px-8 rounded-3xl bg-white/20 /20 border border-slate-200/50 /50 backdrop-blur-2xl text-center overflow-hidden shadow-2xl">
 <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent pointer-events-none" />
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
 <div className="relative z-10 max-w-md mx-auto">
 <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 text-white mb-6 shadow-xl shadow-emerald-500/20">
 <FileText className="w-8 h-8" />
 </div>
 <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
 Unlock {filtered.length - 3} More Resources
 </h2>
 <p className="text-slate-500 mb-8 font-medium leading-relaxed">
 Join our premium community to gain full access to all worksheets, revision notes, question banks, and learning materials.
 </p>
 <button
 onClick={() => setIsAuthModalOpen(true)}
 className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 hover:from-emerald-600 hover:via-teal-600 hover:to-indigo-600 text-white rounded-2xl font-extrabold tracking-wide shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
 >
 Unlock All Resources
 </button>
 </div>
 </motion.div>
 )}

 {displayedResources.length === 0 && (
 <div className="text-center py-20">
 <p className="text-slate-400 text-lg">No resources found matching your criteria.</p>
 </div>
 )}

 {/* CTA */}
 <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 bg-gradient-to-br from-emerald-50 to-teal-50 /20 /10 rounded-[2rem] p-12 text-center border border-emerald-100 /30">
 <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Want Access to Premium Resources?</h2>
 <p className="text-slate-500 mb-8 max-w-lg mx-auto">Enroll in our courses to unlock premium resources, question banks, and personalized study materials.</p>
 <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-1">
 Browse Courses <ArrowRight className="w-5 h-5" />
 </Link>
 </motion.div>
 </div>
  <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
  </div>
  </>
  );
};

export default Resources;
