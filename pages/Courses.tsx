import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, query } from '../lib/firebase';
import { Course } from '../types';
import { Search, Book, Sparkles, Globe, GraduationCap, Compass, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

function getThumbnail(title: string, folder: string): string {
  const colors: Record<string, [string, string]> = {
    'Artificial Intelligence': ['#059669', '#10b981'],
    'Entrepreneurship': ['#7c3aed', '#a855f7'],
    'Career Development': ['#0284c7', '#38bdf8'],
    'Marketing': ['#dc2626', '#f87171'],
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
  const icon = getIconForFolder(folder);
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${c1}"/><stop offset="100%" style="stop-color:${c2}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="200" y="140" text-anchor="middle" font-size="64" fill="rgba(255,255,255,0.2)">${icon}</text><text x="200" y="260" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.6)" font-weight="bold" font-family="sans-serif">${escapeXml(title)}</text></svg>`)}`;
}

function getIconForFolder(folder: string): string {
  const icons: Record<string, string> = {
    'Artificial Intelligence': '🤖',
    'Entrepreneurship': '🚀',
    'Career Development': '📈',
    'Marketing': '📢',
    'Finance': '💰',
    'Innovation': '💡',
    'Life Skills': '🧠',
    'Robotics': '⚙️',
    'Cybersecurity': '🔒',
    'Creator Economy': '🎬',
    'Future Technologies': '🔮',
    'Technology': '💻',
    'Core Education': '📚',
    'Language Skills': '🗣️',
    'Music': '🎵',
    'Dance': '💃',
    'Arts & Creativity': '🎨',
    'Mind Sports': '♟️',
    'Health & Wellness': '🧘',
  };
  return icons[folder] || '📖';
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'education' | 'alternative'>('all');

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
            createdAt: data.created_at,
            createdBy: '',
          } as Course);
        });
        // Add free AI courses from providers
        AI_COURSES.forEach((provider, pi) => {
          provider.courses.forEach((course, ci) => {
            fetchedCourses.push({
              id: `ai-${pi}-${ci}`,
              title: `${course} — ${provider.name}`,
              description: `Free course by ${provider.name}. Learn ${course.toLowerCase()} from industry leaders.`,
              category: 'alternative',
              price: 0,
              thumbnailUrl: getThumbnail(course, 'Artificial Intelligence'),
              folder: 'Artificial Intelligence',
              duration: 'Self-paced',
              level: 'beginner',
              createdAt: new Date().toISOString(),
              createdBy: 'provider',
              externalUrl: provider.url,
            } as Course);
          });
        });
        setCourses(fetchedCourses);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (course.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'education') return matchesSearch && EDUCATION_FOLDERS.has((course as any).folder || '');
    return matchesSearch && !EDUCATION_FOLDERS.has((course as any).folder || '');
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] selection:bg-emerald-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 px-6 py-24 md:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-black tracking-[0.2em] uppercase mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-500" /> Curriculum Discovery
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[0.85]">
            Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500">Learning</span> Pathways.
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-xl">
            Curated architectural frameworks for modern execution. Bridge the gap between theory and real-world mastery.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-white transition-all font-medium placeholder:text-slate-400" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-3 mb-10">
          {[
            { id: 'all', label: 'All Courses', icon: Compass },
            { id: 'education', label: 'Subjective', icon: GraduationCap },
            { id: 'alternative', label: 'Alternative', icon: Sparkles },
          ].map((f) => (
            <button key={f.id} onClick={() => setActiveFilter(f.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeFilter === f.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
              }`}>
              <f.icon className="w-4 h-4" /> {f.label}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-12 h-12 text-emerald-500" />
            </motion.div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Loading courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <motion.div layout key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 hover:shadow-[0_32px_64px_-16px_rgba(16,185,129,0.1)] transition-all duration-500 flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white border border-slate-200/50 dark:border-slate-700/50">
                      {course.folder || course.category}
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-wider">
                      {course.price === 0 ? 'Free' : `₹${course.price}`}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-tight group-hover:text-emerald-500 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 font-medium leading-relaxed line-clamp-2 flex-1">
                      {course.description}
                    </p>
                    {course.externalUrl ? (
                      <a href={course.externalUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm tracking-wide hover:from-emerald-600 hover:to-teal-600 transition-all active:scale-[0.98]">
                        Start Free <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link to={`/courses/${course.id}`}
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold text-sm tracking-wide hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all active:scale-[0.98]">
                        Explore Course →
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Try a different search or filter.</p>
            <button onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
              className="px-8 py-3.5 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all">Reset Filters</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const AI_COURSES = [
  { name: "Anthropic", url: "https://anthropic.skilljar.com", logo: "https://www.anthropic.com/favicon.ico", courses: ["Claude API", "Prompt Engineering", "AI Safety"] },
  { name: "Google", url: "https://grow.google/ai", logo: "https://www.google.com/favicon.ico", courses: ["Google AI Essentials", "Gemini"] },
  { name: "Meta", url: "https://ai.meta.com/resources", logo: "https://about.meta.com/favicon.ico", courses: ["Llama Tutorials", "Responsible AI"] },
  { name: "NVIDIA", url: "https://developer.nvidia.com/training", logo: "https://developer.nvidia.com/favicon.ico", courses: ["Generative AI", "Deep Learning"] },
  { name: "Microsoft", url: "https://learn.microsoft.com/training", logo: "https://learn.microsoft.com/favicon.ico", courses: ["AI-900", "Azure OpenAI"] },
  { name: "OpenAI", url: "https://academy.openai.com", logo: "https://openai.com/favicon.ico", courses: ["Prompt Engineering", "Agents SDK"] },
  { name: "IBM", url: "https://skillsbuild.org", logo: "https://www.ibm.com/favicon.ico", courses: ["AI Fundamentals", "Generative AI"] },
  { name: "AWS", url: "https://skillbuilder.aws", logo: "https://aws.amazon.com/favicon.ico", courses: ["Generative AI", "Bedrock"] },
  { name: "DeepLearning.AI", url: "https://www.deeplearning.ai", logo: "https://www.deeplearning.ai/favicon.ico", courses: ["AI for Everyone", "LangChain"] },
  { name: "Hugging Face", url: "https://huggingface.co/learn", logo: "https://huggingface.co/favicon.ico", courses: ["NLP Course", "Transformers"] },
  { name: "FastAI", url: "https://course.fast.ai", logo: "https://course.fast.ai/favicon.ico", courses: ["Practical Deep Learning"] },
  { name: "Kaggle", url: "https://www.kaggle.com/learn", logo: "https://www.kaggle.com/favicon.ico", courses: ["Python", "ML", "Deep Learning"] },
  { name: "Stanford", url: "https://cs231n.stanford.edu", logo: "https://www.stanford.edu/favicon.ico", courses: ["CS231n: CNNs"] },
  { name: "MIT", url: "https://ocw.mit.edu", logo: "https://ocw.mit.edu/favicon.ico", courses: ["ML", "AI", "Math"] },
  { name: "DeepMind", url: "https://deepmind.google/learning-resources", logo: "https://deepmind.google/favicon.ico", courses: ["AI Safety", "RL"] },
  { name: "Pinecone", url: "https://learn.pinecone.io", logo: "https://www.pinecone.io/favicon.ico", courses: ["Vector DBs", "RAG"] },
];

export default Courses;
