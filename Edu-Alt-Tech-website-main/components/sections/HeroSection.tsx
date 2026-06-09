import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden transition-colors duration-300">
      {/* Background Gradients (Deep Space approach) */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-neon-blue/10 to-transparent" />
      <div className="absolute xl:top-20 top-40 -left-20 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute xl:top-40 top-80 -right-20 w-[500px] h-[500px] bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-neon-cyan text-sm font-display tracking-widest uppercase mb-8 border border-neon-cyan/20 shadow-[0_0_15px_rgba(143,245,255,0.1)]"
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
            The Digital Astra
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Reimagining Education Through{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue drop-shadow-[0_0_25px_rgba(0,238,252,0.4)]">
              Alternative Courses
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 mb-10 font-sans max-w-3xl mx-auto"
          >
            We provide innovative, subjective, and highly practical alternative courses tailored for modern schools and ambitious knowledge seekers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-dim text-neon-surfaceHighest hover:brightness-110 rounded-full font-display font-bold transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(0,238,252,0.3)] hover:-translate-y-1">
              Join the Academy
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="#solutions" className="w-full sm:w-auto px-8 py-4 glass text-white border border-white/10 hover:border-neon-cyan/40 hover:bg-white/5 rounded-full font-display transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm hover:-translate-y-1">
              <PlayCircle className="w-5 h-5 text-neon-cyan" />
              Explore Pathways
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
