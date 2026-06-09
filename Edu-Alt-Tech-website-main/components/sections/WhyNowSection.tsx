import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const reasons = [
  {
    icon: Zap,
    title: 'LLMs Have Arrived',
    description: 'Advanced language models can now analyze and provide feedback on communication with unprecedented accuracy.'
  },
  {
    icon: Clock,
    title: 'Real-Time Behavioral Models',
    description: 'Behavioral AI can now assess speech clarity, pacing, and executive presence in real time.'
  },
  {
    icon: TrendingUp,
    title: 'The Remote Work Era',
    description: 'With distributed teams, clear communication is no longer a soft skill — it is a critical business asset.'
  },
];

const WhyNowSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#020617] relative overflow-hidden border-t border-slate-800/50">
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-neon-violet/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-emerald/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-neon-violet font-bold tracking-widest uppercase text-xs mb-6">
              <Zap className="w-4 h-4" />
              Why Now?
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              The Excuse{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-violet to-neon-blue">
                No Longer Exists
              </span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              With the advent of advanced LLMs and real-time behavioral models, that excuse no longer exists. 
              There is no reason to wait — the technology is ready, and the need has never been greater.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-neon-violet to-neon-blue text-white font-bold rounded-full hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:-translate-y-1"
            >
              Start Your Transformation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            {reasons.map((reason, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="glass-panel border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 group"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0 border border-slate-800/50 group-hover:bg-slate-800 transition-colors">
                    <reason.icon className="w-6 h-6 text-neon-violet" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">{reason.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyNowSection;
