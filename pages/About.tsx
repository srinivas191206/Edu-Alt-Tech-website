import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Users, BookOpen, Rocket, Globe, HeartHandshake, ArrowRight, Sparkles } from 'lucide-react';
import { TEAM } from '../constants';

const values = [
  { icon: <Target className="w-8 h-8" />, title: 'Our Mission', desc: 'Empower schools with cutting-edge technology to deliver exceptional education and streamline operations.', bg: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10', border: 'border-emerald-100 dark:border-emerald-800/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { icon: <Globe className="w-8 h-8" />, title: 'Our Vision', desc: 'A world where every school has access to modern digital infrastructure and AI-powered educational tools.', bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10', border: 'border-blue-100 dark:border-blue-800/30', iconColor: 'text-blue-600 dark:text-blue-400' },
  { icon: <HeartHandshake className="w-8 h-8" />, title: 'Our Approach', desc: 'We partner closely with schools, understanding their unique needs before designing custom technology solutions.', bg: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/10', border: 'border-purple-100 dark:border-purple-800/30', iconColor: 'text-purple-600 dark:text-purple-400' },
  { icon: <Rocket className="w-8 h-8" />, title: 'Our Impact', desc: '50+ schools, 10,000+ students, and a 98% satisfaction rate — we measure success by our partners\' growth.', bg: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10', border: 'border-amber-100 dark:border-amber-800/30', iconColor: 'text-amber-600 dark:text-amber-400' },
];

const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#020617] min-h-screen pt-32 pb-32 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-emerald-500/5 to-blue-500/5 dark:from-emerald-500/10 dark:to-blue-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/3" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center max-w-4xl mx-auto mb-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-widest text-xs mb-6">
            <Sparkles className="w-4 h-4" />
            About Us
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
            Your Trusted{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500">Education Technology</span>{' '}
            Partner
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
            EduAltTech is a complete technology solutions provider for schools and educational institutions. We build websites, mobile apps, ERP systems, and AI tools that help schools digitize operations, enhance learning, and prepare students for the future.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-28">
          {values.map((v, idx) => (
            <motion.div
              key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`p-10 rounded-[2.5rem] bg-gradient-to-br ${v.bg} border ${v.border} hover:-translate-y-2 hover:shadow-xl transition-all duration-500`}
            >
              <div className={`mb-8 ${v.iconColor}`}>{v.icon}</div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{v.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Story */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Our Story</h2>
          <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            <p>Founded by a team of passionate technologists and educators, EduAltTech was born from a simple observation: schools struggle to keep up with rapidly evolving technology. Many institutions lack the resources, expertise, or time to build the digital infrastructure they need.</p>
            <p>We set out to change that. Starting with custom website development for local schools, we expanded into mobile apps, ERP systems, and AI-powered educational tools. Today, we serve 50+ schools across India, helping them digitize everything from admissions to examinations.</p>
            <p>Our team combines deep technical expertise with a genuine understanding of the education sector. We don't just build technology — we build long-term partnerships with schools, providing ongoing support, training, and continuous improvement.</p>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Meet Our Team</h2>
            <p className="text-slate-500 dark:text-slate-400">The people behind EduAltTech</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member, idx) => (
              <motion.div
                key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-emerald-500 hover:-translate-y-2 transition-all duration-500 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-5 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : null}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-2">{member.role}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-[3rem] p-14 lg:p-24 text-center shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 relative z-10 tracking-tighter">Let's Transform Your School</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto relative z-10 font-medium">Partner with us and bring world-class technology to your institution.</p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/contact" className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/30 hover:-translate-y-1">
              Get in Touch
            </Link>
            <Link to="/services" className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold transition-all backdrop-blur-sm hover:-translate-y-1">
              Explore Services
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
