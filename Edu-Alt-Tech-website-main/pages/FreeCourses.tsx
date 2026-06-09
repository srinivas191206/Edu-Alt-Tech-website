import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Globe, 
  Brain, 
  Code, 
  Terminal, 
  Layers, 
  Database, 
  Network, 
  Sparkles,
  Bot,
  Zap,
  BookOpen,
  Cloud,
  Microscope,
  ShieldAlert,
  ArrowRight,
  X
} from 'lucide-react';

const courses = [
  { id: 1, name: 'Anthropic', url: 'http://anthropic.skilljar.com', icon: Brain, color: 'emerald', orbitRadius: 180, orbitDuration: 25, desc: 'Master Constitutional AI and advanced prompt engineering directly from the creators of Claude.' },
  { id: 2, name: 'Google', url: 'http://grow.google/ai', icon: Globe, color: 'blue', orbitRadius: 240, orbitDuration: 30, desc: 'Foundational and advanced AI/ML courses from Google Cloud and DeepMind engineers.' },
  { id: 3, name: 'Meta', url: 'http://ai.meta.com/resources', icon: Network, color: 'indigo', orbitRadius: 300, orbitDuration: 35, desc: 'Open-source AI research, PyTorch tutorials, and LLaMA deployment resources.' },
  { id: 4, name: 'NVIDIA', url: 'http://developer.nvidia.com/training', icon: Cpu, color: 'green', orbitRadius: 140, orbitDuration: 20, desc: 'The GOATed resource for GPU programming, Deep Learning, and AI infrastructure.' },
  { id: 5, name: 'Microsoft', url: 'http://learn.microsoft.com/training', icon: Layers, color: 'cyan', orbitRadius: 220, orbitDuration: 28, desc: 'Enterprise-grade AI training, Azure OpenAI integrations, and Copilot architecture.' },
  { id: 6, name: 'OpenAI', url: 'http://academy.openai.com', icon: Sparkles, color: 'slate', orbitRadius: 160, orbitDuration: 22, desc: 'Official developer resources for building with GPT-4, DALL-E, and advanced embeddings.' },
  { id: 7, name: 'IBM', url: 'http://skillsbuild.org', icon: Database, color: 'blue', orbitRadius: 340, orbitDuration: 40, desc: 'Enterprise AI workflows, Watsonx tutorials, and data science fundamentals.' },
  { id: 8, name: 'AWS', url: 'http://skillbuilder.aws', icon: Cloud, color: 'orange', orbitRadius: 280, orbitDuration: 32, desc: 'Deploying scalable AI pipelines and training foundation models on AWS Bedrock.' },
  { id: 9, name: 'DeepLearning.AI', url: 'http://deeplearning.ai', icon: Bot, color: 'teal', orbitRadius: 200, orbitDuration: 26, desc: 'Andrew Ng\'s legendary courses on neural networks, LLMOps, and generative AI.' },
  { id: 10, name: 'Hugging Face', url: 'http://huggingface.co/learn', icon: Sparkles, color: 'yellow', orbitRadius: 260, orbitDuration: 31, desc: 'The ultimate guide to open-source transformers, datasets, and NLP pipelines.' },
  { id: 11, name: 'FastAI', url: 'https://course.fast.ai', icon: Zap, color: 'amber', orbitRadius: 320, orbitDuration: 38, desc: 'Practical, code-first Deep Learning for coders. Build production-ready models fast.' },
  { id: 12, name: 'Kaggle Learn', url: 'https://kaggle.com/learn', icon: Database, color: 'sky', orbitRadius: 360, orbitDuration: 42, desc: 'Bite-sized, practical data science and machine learning tutorials with real datasets.' },
  { id: 13, name: 'Stanford AI', url: 'https://cs231n.stanford.edu', icon: BookOpen, color: 'red', orbitRadius: 380, orbitDuration: 45, desc: 'The gold standard CS231n course on Convolutional Neural Networks for Visual Recognition.' },
  { id: 14, name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', icon: Microscope, color: 'slate', orbitRadius: 400, orbitDuration: 48, desc: 'Rigorous academic foundations in AI, linear algebra, and computational cognitive science.' },
  { id: 15, name: 'Full Stack Deep Learning', url: 'https://fullstackdeeplearning.com', icon: Layers, color: 'purple', orbitRadius: 310, orbitDuration: 36, desc: 'Learn how to ship deep learning models to production and manage ML infrastructure.' },
  { id: 16, name: 'DeepMind', url: 'https://deepmind.com/learning-resources', icon: Network, color: 'blue', orbitRadius: 190, orbitDuration: 24, desc: 'Advanced reinforcement learning and AGI research papers and educational lectures.' },
  { id: 17, name: 'OpenAI Cookbook', url: 'https://github.com/openai/openai-cookbook', icon: Code, color: 'slate', orbitRadius: 150, orbitDuration: 21, desc: 'Code examples and guides for building real-world applications with the OpenAI API.' },
  { id: 18, name: 'Papers With Code', url: 'https://paperswithcode.com', icon: Terminal, color: 'emerald', orbitRadius: 420, orbitDuration: 50, desc: 'Stay updated with the latest state-of-the-art AI research accompanied by actual code.' },
  { id: 19, name: 'AssemblyAI', url: 'https://assemblyai.com/blog', icon: ShieldAlert, color: 'indigo', orbitRadius: 330, orbitDuration: 39, desc: 'Excellent tutorials on Speech AI, audio processing, and practical deep learning.' },
  { id: 20, name: 'Pinecone', url: 'https://learn.pinecone.io', icon: Database, color: 'rose', orbitRadius: 270, orbitDuration: 33, desc: 'Master Vector Databases, RAG (Retrieval-Augmented Generation), and semantic search.' },
];

const colorMap: Record<string, string> = {
  emerald: 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30 shadow-emerald-500/20',
  blue: 'text-blue-400 bg-blue-400/20 border-blue-400/30 shadow-blue-500/20',
  indigo: 'text-indigo-400 bg-indigo-400/20 border-indigo-400/30 shadow-indigo-500/20',
  green: 'text-green-400 bg-green-400/20 border-green-400/30 shadow-green-500/20',
  cyan: 'text-cyan-400 bg-cyan-400/20 border-cyan-400/30 shadow-cyan-500/20',
  slate: 'text-slate-300 bg-slate-400/20 border-slate-400/30 shadow-slate-500/20',
  orange: 'text-orange-400 bg-orange-400/20 border-orange-400/30 shadow-orange-500/20',
  teal: 'text-teal-400 bg-teal-400/20 border-teal-400/30 shadow-teal-500/20',
  yellow: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30 shadow-yellow-500/20',
  amber: 'text-amber-400 bg-amber-400/20 border-amber-400/30 shadow-amber-500/20',
  sky: 'text-sky-400 bg-sky-400/20 border-sky-400/30 shadow-sky-500/20',
  red: 'text-red-400 bg-red-400/20 border-red-400/30 shadow-red-500/20',
  purple: 'text-purple-400 bg-purple-400/20 border-purple-400/30 shadow-purple-500/20',
  rose: 'text-rose-400 bg-rose-400/20 border-rose-400/30 shadow-rose-500/20',
};

const FreeCourses: React.FC = () => {
  const [activeCourse, setActiveCourse] = useState<typeof courses[0] | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden font-display flex items-center justify-center">
      {/* Deep Space Background / Nebula Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-indigo-900/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-900/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Header Overlay */}
      <div className="absolute top-28 left-0 right-0 z-20 text-center px-6 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase mb-6 shadow-2xl">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          The Open AI Ecosystem
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-tight drop-shadow-2xl">
          Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Intelligence</span> Nodes.
        </h1>
        <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto drop-shadow-md">
          Explore world-class, free AI curricula provided by industry titans. Select a node to access the knowledge base.
        </p>
      </div>

      {/* Interactive Node Map (Desktop) */}
      <div className="hidden lg:flex relative z-10 w-full h-screen items-center justify-center mt-10">
        
        {/* Core Node */}
        <div className="absolute z-20 flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 rounded-full bg-slate-900 border-2 border-slate-700 shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center z-10">
            <Cpu className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-slate-700/20" style={{ animationDuration: '3s' }} />
        </div>

        {/* Orbit Rings & Nodes */}
        <div 
          className="relative flex items-center justify-center" 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {courses.map((course, index) => {
            // Distribute starting positions evenly
            const startAngle = (index / courses.length) * 360;
            
            return (
              <div key={course.id} className="absolute flex items-center justify-center pointer-events-none">
                {/* Orbital Ring */}
                <div 
                  className="absolute rounded-full border border-white/[0.03]"
                  style={{
                    width: course.orbitRadius * 2,
                    height: course.orbitRadius * 2,
                  }}
                />
                
                {/* Orbit Container */}
                <div 
                  className="absolute flex items-center justify-center"
                  style={{
                    width: course.orbitRadius * 2,
                    height: course.orbitRadius * 2,
                    animation: `spin ${course.orbitDuration}s linear infinite`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                    // Start each node at a different angle
                    transform: `rotate(${startAngle}deg)`
                  }}
                >
                  {/* The Node */}
                  <div 
                    className="absolute top-0 flex flex-col items-center justify-center pointer-events-auto cursor-pointer group"
                    style={{
                      transform: 'translateY(-50%)',
                      marginTop: 0
                    }}
                    onClick={() => setActiveCourse(course)}
                  >
                    {/* Reverse Spin to keep icon upright */}
                    <div 
                      className={`w-12 h-12 rounded-full glass border flex items-center justify-center transition-all duration-300 hover:scale-125 hover:shadow-[0_0_30px_currentColor] ${colorMap[course.color] || colorMap.slate} ${activeCourse?.id === course.id ? 'scale-125 ring-2 ring-white' : ''}`}
                      style={{
                        animation: `spin-reverse ${course.orbitDuration}s linear infinite`,
                        animationPlayState: isPaused ? 'paused' : 'running',
                        // Offset the start angle
                        transform: `rotate(-${startAngle}deg)`
                      }}
                    >
                      <course.icon className="w-5 h-5" />
                    </div>
                    
                    {/* Tooltip Label (visible on hover) */}
                    <div 
                      className="absolute top-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-bold whitespace-nowrap shadow-xl"
                      style={{
                        animation: `spin-reverse ${course.orbitDuration}s linear infinite`,
                        animationPlayState: isPaused ? 'paused' : 'running',
                      }}
                    >
                      {course.name}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical List Fallback */}
      <div className="lg:hidden relative z-10 w-full px-6 pt-72 pb-32 flex flex-col gap-4">
        {courses.map((course) => (
          <div 
            key={course.id}
            onClick={() => setActiveCourse(course)}
            className={`glass-dark border rounded-2xl p-6 flex items-center gap-4 transition-all active:scale-95 ${colorMap[course.color]?.replace('bg-', 'hover:bg-').replace('text-', 'text-').split(' ')[0]} border-white/10`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[course.color]}`}>
              <course.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg leading-none">{course.name}</h3>
              <p className="text-slate-400 text-xs mt-2 line-clamp-1">{course.desc}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500" />
          </div>
        ))}
      </div>

      {/* Detail Slide-in Panel */}
      <AnimatePresence>
        {activeCourse && (
          <>
            {/* Backdrop overlay for mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCourse(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Side Panel */}
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full lg:w-[450px] glass-dark border-l border-white/10 z-50 p-8 flex flex-col shadow-2xl overflow-y-auto"
            >
              <button 
                onClick={() => setActiveCourse(null)}
                className="absolute top-8 right-8 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mt-12 flex-1">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border ${colorMap[activeCourse.color]}`}>
                  <activeCourse.icon className="w-10 h-10" />
                </div>
                
                <h2 className="text-4xl font-black text-white tracking-tight mb-2">
                  {activeCourse.name}
                </h2>
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-slate-300 text-[10px] font-black tracking-widest uppercase mb-8 border border-white/10">
                  Free Access
                </div>

                <p className="text-slate-300 text-lg leading-relaxed font-medium mb-12">
                  {activeCourse.desc}
                </p>

                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 mb-8">
                  <h4 className="text-xs font-black tracking-widest uppercase text-slate-500 mb-4">Required Prerequisites</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Basic Python Knowledge
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Passion for Artificial Intelligence
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <a 
                  href={activeCourse.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 rounded-2xl bg-white text-slate-900 font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02]"
                >
                  Enter Knowledge Base <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default FreeCourses;
