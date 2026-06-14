import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Youtube, Code2, BookOpen, Briefcase, Users, Sparkles, ExternalLink, ChevronDown } from 'lucide-react';
import { POPULAR_PROBLEMS, LEETCODE_150_PROBLEMS, FULL_COURSES, INTERVIEW_EXPERIENCES, TECH_TALKS } from '../data/problems';
import type { LeetCodeProblem, CourseLink, InterviewExperience, TechTalk } from '../data/problems';

type Tab = 'problems' | 'courses' | 'interviews' | 'talks';
type ProblemSet = 'popular' | 'leetcode150';

const difficultyColors: Record<string, string> = {
  Easy: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
};

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'problems', label: 'Problems', icon: <Code2 className="w-4 h-4" /> },
  { key: 'courses', label: 'Full Courses', icon: <BookOpen className="w-4 h-4" /> },
  { key: 'interviews', label: 'Interviews', icon: <Briefcase className="w-4 h-4" /> },
  { key: 'talks', label: 'Tech Talks', icon: <Users className="w-4 h-4" /> },
];

function ProblemCard({ problem }: { problem: LeetCodeProblem }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-lg hover:border-emerald-500 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 shrink-0">#{problem.num}</span>
            <h3 className="font-bold text-slate-900 dark:text-white truncate">{problem.title}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{problem.topic}</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${difficultyColors[problem.difficulty] || ''}`}>
              {problem.difficulty}
            </span>
          </div>
          {problem.companies && problem.companies.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {problem.companies.slice(0, 3).map((c, i) => (
                <span key={i} className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {c.name} {c.count > 0 && `(${c.count})`}
                </span>
              ))}
              {problem.companies.length > 3 && (
                <span className="text-[10px] text-slate-400">+{problem.companies.length - 3}</span>
              )}
            </div>
          )}
        </div>
        <a
          href={problem.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
          title="Watch solution"
        >
          <Youtube className="w-5 h-5" />
        </a>
      </div>
    </motion.div>
  );
}

function CourseCard({ course }: { course: CourseLink }) {
  return (
    <a href={course.url} target="_blank" rel="noopener noreferrer"
      className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-lg hover:border-emerald-500 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shrink-0">
          <Youtube className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{course.title}</h3>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
      </div>
    </a>
  );
}

function InterviewCard({ interview }: { interview: InterviewExperience }) {
  const resultColors: Record<string, string> = {
    Hired: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20',
    Selected: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20',
    Rejected: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20',
  };
  return (
    <a href={interview.url} target="_blank" rel="noopener noreferrer"
      className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-lg hover:border-emerald-500 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{interview.company}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{interview.interviewType}</p>
        </div>
        <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-md ${resultColors[interview.result] || ''}`}>
          {interview.result}
        </span>
        <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
      </div>
    </a>
  );
}

function TalkCard({ talk }: { talk: TechTalk }) {
  return (
    <a href={talk.url} target="_blank" rel="noopener noreferrer"
      className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-lg hover:border-emerald-500 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{talk.topic}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{talk.person}</p>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
      </div>
    </a>
  );
}

const Practice: React.FC = () => {
  const [tab, setTab] = useState<Tab>('problems');
  const [problemSet, setProblemSet] = useState<ProblemSet>('popular');
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [diffFilter, setDiffFilter] = useState('');

  const currentProblems = problemSet === 'popular' ? POPULAR_PROBLEMS : LEETCODE_150_PROBLEMS;

  const allTopics = useMemo(() => {
    const topics = new Set(currentProblems.map(p => p.topic));
    return Array.from(topics).sort();
  }, [problemSet]);

  const allCompanies = useMemo(() => {
    const companies = new Set<string>();
    currentProblems.forEach(p => p.companies?.forEach(c => companies.add(c.name)));
    return Array.from(companies).sort();
  }, [problemSet]);

  const filteredProblems = useMemo(() => {
    return currentProblems.filter(p => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
      const matchTopic = !topicFilter || p.topic === topicFilter;
      const matchDiff = !diffFilter || p.difficulty === diffFilter;
      return matchSearch && matchTopic && matchDiff;
    });
  }, [currentProblems, search, topicFilter, diffFilter]);

  return (
    <div className="min-h-screen pt-32 pb-32 px-6 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-widest text-[10px] mb-6">
            <Sparkles className="w-4 h-4" />
            Practice & Interview Prep
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[0.9]">
            Master Coding<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500">Interviews</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl font-medium">
            280+ handpicked LeetCode problems with video solutions, full courses, interview experiences, and tech talks.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t.key
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </motion.div>

        {/* Problems Tab */}
        {tab === 'problems' && (
          <>
            {/* Problem Set Toggle */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-2 mb-6">
              <button onClick={() => setProblemSet('popular')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                problemSet === 'popular' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}>Most Popular ({POPULAR_PROBLEMS.length})</button>
              <button onClick={() => setProblemSet('leetcode150')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                problemSet === 'leetcode150' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}>LeetCode 150 ({LEETCODE_150_PROBLEMS.length})</button>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-3 mb-8">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
              <select value={topicFilter} onChange={e => setTopicFilter(e.target.value)}
                className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">All Topics</option>
                {allTopics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)}
                className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </motion.div>

            {/* Problem Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProblems.map((p, i) => (
                <ProblemCard key={`${problemSet}-${p.num}`} problem={p} />
              ))}
            </div>
            {filteredProblems.length === 0 && (
              <p className="text-center text-slate-400 py-12 font-medium">No problems match your filters.</p>
            )}
          </>
        )}

        {/* Full Courses Tab */}
        {tab === 'courses' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FULL_COURSES.map(c => (
              <CourseCard key={c.num} course={c} />
            ))}
          </motion.div>
        )}

        {/* Interview Experiences Tab */}
        {tab === 'interviews' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-2">
            {INTERVIEW_EXPERIENCES.map(i => (
              <InterviewCard key={i.num} interview={i} />
            ))}
          </motion.div>
        )}

        {/* Tech Talks Tab */}
        {tab === 'talks' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-2">
            {TECH_TALKS.map(t => (
              <TalkCard key={t.num} talk={t} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Practice;
