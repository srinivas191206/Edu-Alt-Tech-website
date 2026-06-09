import React from 'react';
import { motion } from 'framer-motion';
import { ServerCrash, Users, Activity } from 'lucide-react';

const problems = [
  {
    icon: <ServerCrash className="w-8 h-8 text-rose-400" />,
    title: "Rigid Curriculums",
    description: "Mainstream education relies on rigid, standardized curriculums that fail to adapt to individual student needs and modern realities."
  },
  {
    icon: <Users className="w-8 h-8 text-orange-400" />,
    title: "Theoretical Cramming",
    description: "Students are forced to memorize theoretical concepts without understanding how to apply them practically in the real world."
  },
  {
    icon: <Activity className="w-8 h-8 text-neon-cyan" />,
    title: "Lack of Subjective Skills",
    description: "There is a massive gap in teaching subjective, soft skills and alternative perspectives that go beyond traditional textbooks."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ProblemSection: React.FC = () => {
  return (
    <section className="py-32 transition-colors duration-300 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-rose-400 font-display font-semibold tracking-widest uppercase text-xs mb-4"
          >
            The Current Challenge
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight"
          >
            Why Traditional Education Isn't Enough
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 font-sans"
          >
            Standardized education is leaving students unprepared for the real world. We identified three major gaps in the modern schooling system.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {problems.map((problem, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="glass-dark p-8 rounded-3xl border border-white/5 hover:border-white/20 hover:bg-white/5 hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:bg-black/40 transition-colors">
                {problem.icon}
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-4 tracking-tight">{problem.title}</h3>
              <p className="text-slate-400 leading-relaxed font-sans">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
