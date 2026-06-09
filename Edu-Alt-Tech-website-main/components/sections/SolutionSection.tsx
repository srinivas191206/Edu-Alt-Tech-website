import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Users, Target, Zap } from 'lucide-react';

const solutions = [
  { icon: <BookOpen className="w-6 h-6 text-neon-cyan" />, title: "Alternative Curriculums" },
  { icon: <Brain className="w-6 h-6 text-neon-cyan" />, title: "Subjective Learning" },
  { icon: <Users className="w-6 h-6 text-neon-cyan" />, title: "Peer-to-Peer Education" },
  { icon: <Target className="w-6 h-6 text-neon-cyan" />, title: "Skill-Based Frameworks" },
  { icon: <Zap className="w-6 h-6 text-neon-cyan" />, title: "Practical Application" },
];

const SolutionSection: React.FC = () => {
  return (
    <section id="solutions" className="py-32 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
              <p className="text-neon-cyan font-display tracking-widest uppercase text-xs font-semibold">
                The Solution
              </p>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight tracking-tight">
              The Ultimate <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue drop-shadow-[0_0_15px_rgba(0,238,252,0.3)]">Alternative Education Framework</span>
            </h2>
            <p className="text-lg text-slate-400 mb-12 leading-relaxed font-sans max-w-xl">
              We provide engaging, subjective, and highly practical alternative courses designed to enrich traditional education. Our programs empower schools and ambitious seekers with skills that truly matter.
            </p>
            
            <ul className="space-y-5">
              {solutions.map((item, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx, duration: 0.5 }}
                  className="flex items-center gap-5 glass-dark p-5 rounded-2xl border border-white/5 hover:border-neon-cyan/30 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(143,245,255,0.05)] transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-14 h-14 bg-neon-cyan/10 rounded-xl flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors shadow-inner border border-neon-cyan/10">
                    {item.icon}
                  </div>
                  <span className="font-display font-semibold text-white text-xl tracking-tight">{item.title}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Abstract Astral Visualization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[700px] w-full hidden lg:block"
          >
            {/* Center Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-tr from-neon-cyan to-neon-blue rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(0,238,252,0.4)] z-20 animate-[pulse_4s_ease-in-out_infinite] border border-white/20">
              <div className="text-center text-neon-dark">
                <BookOpen className="w-14 h-14 mx-auto mb-3 opacity-90" strokeWidth={1.5} />
                <span className="font-display font-bold tracking-[0.2em] text-xs">ASTRAL<br/>CORE</span>
              </div>
            </div>

            {/* Orbiting Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-dashed border-neon-cyan/20 rounded-full animate-[spin_40s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-dashed border-neon-blue/20 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
            
            {/* Connected Nodes */}
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] left-[20%] glass-dark p-5 rounded-2xl border border-neon-cyan/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-30 backdrop-blur-3xl min-w-[160px] text-center">
              <Brain className="w-10 h-10 text-neon-cyan mx-auto mb-3 drop-shadow-[0_0_8px_rgba(143,245,255,0.8)]" />
              <p className="font-display font-bold text-sm text-white tracking-wide">Subjective<br/>Learning</p>
            </motion.div>
            
            <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1, ease: "easeInOut" }} className="absolute bottom-[20%] right-[5%] glass-dark p-5 rounded-2xl border border-neon-green/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-30 backdrop-blur-3xl min-w-[160px] text-center">
              <Target className="w-10 h-10 text-neon-green mx-auto mb-3 drop-shadow-[0_0_8px_rgba(55,238,155,0.8)]" />
              <p className="font-display font-bold text-sm text-white tracking-wide">Skill<br/>Building</p>
            </motion.div>

            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 2, ease: "easeInOut" }} className="absolute top-[35%] right-0 glass-dark p-5 rounded-2xl border border-neon-blue/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-30 backdrop-blur-3xl min-w-[160px] text-center">
              <Users className="w-10 h-10 text-neon-blue mx-auto mb-3 drop-shadow-[0_0_8px_rgba(0,238,252,0.8)]" />
              <p className="font-display font-bold text-sm text-white tracking-wide">Peer<br/>Mentorship</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
