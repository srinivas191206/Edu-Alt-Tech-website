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
  { title: "ARTIFICIAL INTELLIGENCE", description: "AI principles, algorithms, and applications study material", type: "pdf", category: "Computer Science", premium: false, downloads: "2.1K", url: "/resources/ARTIFICIAL%20INTELLIGENCE.pdf" },
  { title: "BIG DATA ANALYTICS", description: "Big data technologies, analytics techniques, and tools", type: "pdf", category: "Computer Science", premium: false, downloads: "1.7K", url: "/resources/BIG%20DATA%20ANALYTICS.pdf" },
  { title: "CLOUD COMPUTING", description: "Cloud computing concepts, architectures, and service models", type: "pdf", category: "Computer Science", premium: false, downloads: "1.9K", url: "/resources/CLOUD%20COMPUTING.pdf" },
  { title: "CLOUD COMPUTING - Part 2", description: "Advanced cloud computing topics and case studies", type: "pdf", category: "Computer Science", premium: false, downloads: "1.4K", url: "/resources/CLOUD%20COMPUTING2.pdf" },
  { title: "COMPILER DESIGN", description: "Compiler design principles, parsing, and code generation", type: "pdf", category: "Computer Science", premium: false, downloads: "1.6K", url: "/resources/COMPILER%20DESIGN.pdf" },
  { title: "COMPILER DESIGN - Part 2", description: "Advanced compiler optimization and code generation techniques", type: "pdf", category: "Computer Science", premium: false, downloads: "1.2K", url: "/resources/COMPILER%20DESIGN2.pdf" },
  { title: "COMPILER DESIGN - Part 3", description: "Compiler design advanced topics and implementation", type: "pdf", category: "Computer Science", premium: false, downloads: "1.1K", url: "/resources/COMPILER%20DESIGN3.pdf" },
  { title: "COMPUTER NETWORKS", description: "Computer networks fundamentals, protocols, and architecture", type: "pdf", category: "Computer Science", premium: false, downloads: "1.9K", url: "/resources/COMPUTER%20NETWORKS.pdf" },
  { title: "COMPUTER ORGANIZATION", description: "Computer organization and architecture study material", type: "pdf", category: "Computer Science", premium: false, downloads: "1.7K", url: "/resources/COMPUTER%20ORGANIZATION.pdf" },
  { title: "CRYPTOGRAPHIC & NETWORK SECURITY", description: "Cryptography and network security principles and practices", type: "pdf", category: "Computer Science", premium: false, downloads: "1.5K", url: "/resources/CRYPTOGRAPHIC%20%26%20NETWORK%20SECURITY.pdf" },
  { title: "DATA MINING", description: "Data mining concepts, techniques, and algorithms", type: "pdf", category: "Computer Science", premium: false, downloads: "1.6K", url: "/resources/DATA%20MINING.pdf" },
  { title: "DATABASE MANAGEMENT SYSTEMS", description: "Comprehensive DBMS notes covering SQL, normalization, and transactions", type: "pdf", category: "Computer Science", premium: false, downloads: "2.2K", url: "/resources/DATABASE%20MANAGEMENT%20SYSTEMS.pdf" },
  { title: "DESIGN & ANALYSIS OF ALGORITHMS", description: "Algorithm design techniques, analysis, and complexity", type: "pdf", category: "Computer Science", premium: false, downloads: "1.8K", url: "/resources/DESIGN%20%26%20ANALYSIS%20OF%20ALGORITHMS.pdf" },
  { title: "DISCRETE MATHEMATICS", description: "Discrete mathematics concepts including logic, sets, graphs, and combinatorics", type: "pdf", category: "Mathematics", premium: false, downloads: "2K", url: "/resources/DISCRETE%20MATHEMATICS.pdf" },
  { title: "DISTRIBUTED SYSTEMS", description: "Distributed systems principles, architectures, and middleware", type: "pdf", category: "Computer Science", premium: false, downloads: "1.5K", url: "/resources/DISTRIBUTED%20SYSTEMS.pdf" },
  { title: "FORMAL LANGUAGES AND AUTOMATA THEORY", description: "Automata theory, formal languages, and computational models", type: "pdf", category: "Computer Science", premium: false, downloads: "1.6K", url: "/resources/FORMAL%20LANGUAGES%20AND%20AUTOMATA%20THEORY.pdf" },
  { title: "FULL STACK DEVELOPMENT", description: "Full stack web development covering frontend, backend, and databases", type: "pdf", category: "Computer Science", premium: false, downloads: "2.3K", url: "/resources/FULL%20STACK%20DEVELOPMENT.pdf" },
  { title: "HUMAN-COMPUTER INTERACTION", description: "HCI principles, user interface design, and usability evaluation", type: "pdf", category: "Computer Science", premium: false, downloads: "1.4K", url: "/resources/HUMAN-COMPUTER%20INTERACTION.pdf" },
  { title: "INTERNET OF THINGS & ITS APPLICATIONS", description: "IoT concepts, protocols, and real-world applications", type: "pdf", category: "Computer Science", premium: false, downloads: "1.8K", url: "/resources/INTERNET%20OF%20THINGS%20%26%20ITS%20APPLICATIONS.pdf" },
  { title: "MACHINE LEARNING", description: "Machine learning algorithms, models, and applications", type: "pdf", category: "Computer Science", premium: false, downloads: "2.5K", url: "/resources/MACHINE%20LEARNING.pdf" },
  { title: "NATURAL LANGUAGE PROCESSING", description: "NLP techniques, text processing, and language models", type: "pdf", category: "Computer Science", premium: false, downloads: "1.7K", url: "/resources/NATURAL%20LANGUAGE%20PROCESSING.pdf" },
  { title: "DevOps", description: "DevOps principles, CI/CD, and infrastructure as code", type: "pdf", category: "Computer Science", premium: false, downloads: "1.3K", url: "/resources/DevOps.pdf" },
  { title: "ROBOTICS & AUTOMATION", description: "Robotics and automation study material covering fundamentals to advanced topics", type: "pdf", category: "Engineering", premium: false, downloads: "1.1K", url: "/resources/ROBOTICS%20%26%20AUTOMATION.pdf" },
  { title: "SCRIPTING LANGUAGES", description: "Comprehensive notes on scripting languages including Python, Perl, and shell", type: "pdf", category: "Computer Science", premium: false, downloads: "1.3K", url: "/resources/SCRIPTING%20LANGUAGES.pdf" },
  { title: "SOCIAL MEDIA SECURITY", description: "Social media security principles, threats, and best practices", type: "pdf", category: "Computer Science", premium: false, downloads: "980", url: "/resources/SOCIAL%20MEDIA%20SECURITY.pdf" },
  { title: "SOFTWARE ENGINEERING", description: "Complete software engineering notes covering SDLC, design, and testing", type: "pdf", category: "Computer Science", premium: false, downloads: "2.5K", url: "/resources/SOFTWARE%20ENGINEERING.pdf" },
  { title: "SOFTWARE PROCESS AND PROJECT MANAGEMENT", description: "Software project management principles, processes, and methodologies", type: "pdf", category: "Computer Science", premium: false, downloads: "1.6K", url: "/resources/SOFTWARE%20PROCESS%20AND%20PROJECT%20MANAGEMENT.pdf" },
  { title: "SOFTWARE TESTING METHODOLOGIES", description: "Software testing techniques, strategies, and methodologies", type: "pdf", category: "Computer Science", premium: false, downloads: "1.4K", url: "/resources/SOFTWARE%20TESTING%20METHODOLOGIES.pdf" },
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

const categories = ["All", "Mathematics", "Science", "English", "Social Studies", "Computer Science", "Engineering", "Management"];

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
