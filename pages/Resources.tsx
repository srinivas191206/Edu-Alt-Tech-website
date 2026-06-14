import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, FileText, BookOpen, Brain, FileSpreadsheet, Lock, Sparkles, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResourceItem {
  title: string;
  description: string;
  type: 'pdf' | 'notes' | 'questions' | 'worksheet';
  category: string;
  premium: boolean;
  downloads: string;
  url?: string;
}

const RESOURCES: ResourceItem[] = [
  { title: "NON-CONVENTIONAL ENERGY SOURCES", description: "Complete notes on non-conventional energy sources for engineering students", type: "pdf", category: "Engineering", premium: false, downloads: "1.2K", url: "/resources/NON-CONVENTIONAL%20ENERGY%20SOURCES.pdf" },
  { title: "OBJECT ORIENTED PROGRAMMING", description: "Comprehensive OOP concepts and programming notes", type: "pdf", category: "Computer Science", premium: false, downloads: "2.1K", url: "/resources/OBJECT%20ORIENTED%20PROGRAMMING.pdf" },
  { title: "OPERATING SYSTEMS", description: "Detailed operating systems study material covering all key topics", type: "pdf", category: "Computer Science", premium: false, downloads: "1.8K", url: "/resources/OPERATING%20SYSTEMS.pdf" },
  { title: "ORGANIZATIONAL BEHAVIOUR", description: "Organizational behaviour notes for management and engineering students", type: "pdf", category: "Management", premium: false, downloads: "1.5K", url: "/resources/ORGANIZATIONAL%20BEHAVIOUR.pdf" },
  { title: "R22 B.Tech CSE Course Structure & Syllabus", description: "Complete R22 regulation B.Tech CSE course structure and syllabus", type: "pdf", category: "Engineering", premium: false, downloads: "3.4K", url: "/resources/R22B.Tech.CSECourseStructureSyllabus.pdf" },
  { title: "ROBOTICS & AUTOMATION", description: "Robotics and automation study material covering fundamentals to advanced topics", type: "pdf", category: "Engineering", premium: false, downloads: "1.1K", url: "/resources/ROBOTICS%20%26%20AUTOMATION.pdf" },
  { title: "SCRIPTING LANGUAGES", description: "Comprehensive notes on scripting languages including Python, Perl, and shell", type: "pdf", category: "Computer Science", premium: false, downloads: "1.3K", url: "/resources/SCRIPTING%20LANGUAGES.pdf" },
  { title: "SOCIAL MEDIA SECURITY", description: "Social media security principles, threats, and best practices", type: "pdf", category: "Computer Science", premium: false, downloads: "980", url: "/resources/SOCIAL%20MEDIA%20SECURITY.pdf" },
  { title: "SOFTWARE ENGINEERING", description: "Complete software engineering notes covering SDLC, design, and testing", type: "pdf", category: "Computer Science", premium: false, downloads: "2.5K", url: "/resources/SOFTWARE%20ENGINEERING.pdf" },
  { title: "SOFTWARE PROCESS AND PROJECT MANAGEMENT", description: "Software project management principles, processes, and methodologies", type: "pdf", category: "Computer Science", premium: false, downloads: "1.6K", url: "/resources/SOFTWARE%20PROCESS%20AND%20PROJECT%20MANAGEMENT.pdf" },
  { title: "SOFTWARE TESTING METHODOLOGIES", description: "Software testing techniques, strategies, and methodologies", type: "pdf", category: "Computer Science", premium: false, downloads: "1.4K", url: "/resources/SOFTWARE%20TESTING%20METHODOLOGIES.pdf" },
  { title: "Mathematics Formula Sheet", description: "Complete collection of essential math formulas for grades 9-12", type: "pdf", category: "Mathematics", premium: false, downloads: "2.3K" },
  { title: "Physics Quick Reference", description: "Key physics concepts, laws, and equations summarized", type: "notes", category: "Science", premium: false, downloads: "1.8K" },
  { title: "Chemistry Periodic Table Guide", description: "Interactive periodic table with element properties", type: "pdf", category: "Science", premium: false, downloads: "3.1K" },
  { title: "English Grammar Workbook", description: "Comprehensive grammar exercises with answer keys", type: "worksheet", category: "English", premium: false, downloads: "1.5K" },
  { title: "Biology Chapter Summaries", description: "Concise summaries of all major biology chapters", type: "notes", category: "Science", premium: false, downloads: "2K" },
  { title: "History Timeline Cards", description: "Visual timeline of major historical events", type: "pdf", category: "Social Studies", premium: false, downloads: "1.2K" },
  { title: "Advanced Mathematics Problem Set", description: "Challenging problems for competitive exam preparation", type: "questions", category: "Mathematics", premium: true, downloads: "890" },
  { title: "Science Lab Manual", description: "Detailed lab experiments with procedures and observations", type: "pdf", category: "Science", premium: true, downloads: "750" },
  { title: "Coding Fundamentals Workbook", description: "Introduction to programming with Python exercises", type: "worksheet", category: "Computer Science", premium: true, downloads: "1.1K" },
  { title: "Exam Prep Question Bank", description: "300+ practice questions with detailed solutions", type: "questions", category: "All Subjects", premium: true, downloads: "2.5K" },
  { title: "Literature Study Guides", description: "In-depth analysis of prescribed literary works", type: "notes", category: "English", premium: false, downloads: "980" },
  { title: "Geography Map Workbook", description: "Printable map exercises and geography activities", type: "worksheet", category: "Social Studies", premium: false, downloads: "670" },
];

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

const categories = ["All", "Mathematics", "Science", "English", "Social Studies", "Computer Science"];

const Resources: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showPremium, setShowPremium] = useState<'all' | 'free' | 'premium'>('all');

  const filtered = RESOURCES.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filter === 'All' || r.category === filter;
    const matchPremium = showPremium === 'all' || (showPremium === 'free' && !r.premium) || (showPremium === 'premium' && r.premium);
    return matchSearch && matchCat && matchPremium;
  });

  return (
    <div className="min-h-screen pt-32 pb-32 px-6 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-widest text-[10px] mb-6">
            <Sparkles className="w-4 h-4" />
            Learning Resources
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[0.9]">
            Free & Premium<br />Educational <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500">Resources</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl font-medium">
            Download free PDFs, notes, question banks, and worksheets. Premium resources available for enrolled students.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-4 mb-12 items-center">
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === c ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {(['all', 'free', 'premium'] as const).map(s => (
              <button key={s} onClick={() => setShowPremium(s)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                showPremium === s ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}>{s}</button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <motion.div
              key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className={`group bg-white dark:bg-slate-900 border rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 ${
                item.premium
                  ? 'border-amber-200 dark:border-amber-800/50 hover:shadow-xl hover:shadow-amber-500/10'
                  : 'border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-emerald-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  item.premium ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500'
                }`}>{typeIcons[item.type]}</div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    item.premium
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  }`}>{typeLabels[item.type]}</span>
                  {item.premium && (
                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Premium
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{item.downloads} downloads</span>
                {item.url ? (
                  <a href={item.url} download className={`flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                    item.premium
                      ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                  }`}>
                    <Download className="w-3 h-3" /> {item.premium ? 'Unlock' : 'Download'}
                  </a>
                ) : (
                  <button className={`flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                    item.premium
                      ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                  }`}>
                    <Download className="w-3 h-3" /> {item.premium ? 'Unlock' : 'Download'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No resources found matching your criteria.</p>
          </div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 rounded-[2rem] p-12 text-center border border-emerald-100 dark:border-emerald-800/30">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Want Access to Premium Resources?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">Enroll in our courses to unlock premium resources, question banks, and personalized study materials.</p>
          <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-1">
            Browse Courses <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
