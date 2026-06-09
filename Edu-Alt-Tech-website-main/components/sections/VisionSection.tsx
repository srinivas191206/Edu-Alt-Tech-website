import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Rocket, Zap } from 'lucide-react';

const VisionSection: React.FC = () => {
  return (
    <section className="py-32 transition-colors duration-300 relative overflow-hidden z-10">
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-5 bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan rounded-full mb-10 shadow-[0_0_20px_rgba(143,245,255,0.15)]"
          >
            <Lightbulb className="w-8 h-8" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-8 leading-tight tracking-tight"
          >
            Pioneering India's First <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue drop-shadow-[0_0_15px_rgba(0,238,252,0.3)]">
              Alternative Skills Academy
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 font-sans leading-relaxed mb-14"
          >
            We believe that education should empower individuals beyond traditional textbooks. 
            By integrating real-world skills and practical subjective courses with dedicated mentorship, 
            Edu Alt Tech is shaping a dynamic and engaging future of learning.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <div className="flex items-center gap-3 text-white font-display tracking-wide uppercase text-sm glass-dark px-6 py-4 rounded-full border border-white/10 hover:border-neon-cyan/30 transition-colors shadow-lg shadow-black/50">
              <Rocket className="w-5 h-5 text-neon-cyan" /> Constant Innovation
            </div>
            <div className="flex items-center gap-3 text-white font-display tracking-wide uppercase text-sm glass-dark px-6 py-4 rounded-full border border-white/10 hover:border-neon-green/30 transition-colors shadow-lg shadow-black/50">
              <Zap className="w-5 h-5 text-neon-green" /> Hands-On Mentorship
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
