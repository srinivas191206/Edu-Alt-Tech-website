import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const FounderVisionSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#020617] relative overflow-hidden border-t border-slate-800/50">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center lg:items-start"
          >
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-neon-emerald/30 to-neon-blue/30 p-1 mb-8 shadow-[0_0_40px_rgba(0,255,157,0.15)]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-emerald to-neon-blue">N</span>
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">Naryana</h3>
            <p className="text-neon-emerald font-medium text-lg">Genesis Internation school</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <Quote className="w-16 h-16 text-neon-emerald/20 absolute -top-4 -left-4" />
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light relative z-10">
              Our mission is to bridge the gap between traditional education and the skills students truly need for the future. We are building a platform where learning is subjective, practical, and deeply engaging — empowering every student to discover their unique potential.
            </p>
            <div className="mt-8 pt-8 border-t border-slate-800/50">
              <p className="text-slate-400 text-sm">Founder & Visionary</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderVisionSection;
