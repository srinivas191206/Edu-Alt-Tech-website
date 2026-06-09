import React from 'react';
import { motion } from 'framer-motion';
import { Mic, BarChart3, TrendingUp, MessageSquareQuote, Brain, Volume2 } from 'lucide-react';

const metrics = [
  { label: 'Speech Clarity', value: '94%', change: '+12%', icon: Mic },
  { label: 'Executive Presence', value: '87%', change: '+18%', icon: Brain },
  { label: 'Pacing Score', value: '91%', change: '+15%', icon: Volume2 },
];

const ProductExperienceSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#020617] relative overflow-hidden border-t border-slate-800/50">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-neon-emerald/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-neon-emerald font-semibold tracking-widest uppercase text-xs mb-4"
          >
            Product Experience
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Real-Time Feedback on{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-emerald to-neon-blue">
              Every Interaction
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-3xl mx-auto"
          >
            Proprietary models that provide live feedback on speech clarity and executive presence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel rounded-3xl p-8 md:p-10 border border-slate-700/50"
          >
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="w-6 h-6 text-neon-emerald" />
              <h3 className="text-white font-bold text-xl">14-Day Performance</h3>
            </div>
            <div className="space-y-6">
              {metrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-neon-emerald">
                      <metric.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">{metric.label}</p>
                      <p className="text-white font-bold text-2xl">{metric.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-neon-emerald">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">{metric.change}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-slate-400 text-sm mt-6 text-center">
              Strong improvement in pacing and executive presence over the last 14 days
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-panel rounded-3xl p-8 md:p-10 border border-slate-700/50 relative"
          >
            <MessageSquareQuote className="w-12 h-12 text-neon-emerald/20 absolute top-6 right-6" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-emerald/30 to-neon-blue/30 flex items-center justify-center">
                <span className="text-white font-bold text-lg">SK</span>
              </div>
              <div>
                <p className="text-white font-semibold">Sara Kapoor</p>
                <p className="text-slate-400 text-sm">Product Manager, TechCorp</p>
              </div>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed font-light">
              "The real-time feedback on my speech patterns transformed how I present to stakeholders. Within two weeks, my team noticed a dramatic improvement in my clarity and confidence during high-stakes meetings."
            </p>
            <div className="mt-6 pt-6 border-t border-slate-800/50 flex items-center gap-2 text-neon-emerald text-sm">
              <div className="flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-neon-emerald" />
                ))}
              </div>
              <span>Verified User</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductExperienceSection;
