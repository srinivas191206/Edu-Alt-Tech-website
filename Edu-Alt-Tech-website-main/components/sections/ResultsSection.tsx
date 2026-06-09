import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, Award, Users } from 'lucide-react';

const stats = [
  {
    icon: MessageSquare,
    value: '50K+',
    label: 'Conversations Analyzed',
    description: 'Of high-stakes conversation processed by our models.'
  },
  {
    icon: TrendingUp,
    value: '94%',
    label: 'Improvement Rate',
    description: 'Average improvement in communication metrics.'
  },
  {
    icon: Award,
    value: '5K+',
    label: 'Active Users',
    description: 'Professionals and students using our platform.'
  },
  {
    icon: Users,
    value: '200+',
    label: 'Enterprise Clients',
    description: 'Organizations trusting Edu Alt Tech.'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ResultsSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#020617] relative overflow-hidden border-t border-slate-800/50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neon-blue/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-neon-blue font-semibold tracking-widest uppercase text-xs mb-4"
          >
            Our Impact
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            We Don't Measure Views.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet">
              We Measure Transformation.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            Every metric represents real people who have improved their communication skills using our platform.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="glass-panel border border-slate-700/50 rounded-3xl p-8 text-center hover:border-slate-600/50 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-800 transition-colors border border-slate-800/50">
                <stat.icon className="w-7 h-7 text-neon-emerald" />
              </div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</p>
              <p className="text-neon-emerald font-semibold text-sm mb-3 uppercase tracking-wide">{stat.label}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;
