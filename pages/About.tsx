import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Users, BookOpen, Rocket, Globe, HeartHandshake, ArrowRight, Sparkles, Linkedin, Mail } from 'lucide-react';
import { TEAM } from '../constants';

const values = [
  { icon: <Target className="w-8 h-8" />, title: 'Our Mission', desc: 'Empower schools with cutting-edge technology to deliver exceptional education and streamline operations.', bg: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10', border: 'border-emerald-100 dark:border-emerald-800/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { icon: <Globe className="w-8 h-8" />, title: 'Our Vision', desc: 'A world where every school has access to modern digital infrastructure and AI-powered educational tools.', bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10', border: 'border-blue-100 dark:border-blue-800/30', iconColor: 'text-blue-600 dark:text-blue-400' },
  { icon: <HeartHandshake className="w-8 h-8" />, title: 'Our Approach', desc: 'We partner closely with schools, understanding their unique needs before designing custom technology solutions.', bg: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/10', border: 'border-purple-100 dark:border-purple-800/30', iconColor: 'text-purple-600 dark:text-purple-400' },
  { icon: <Rocket className="w-8 h-8" />, title: 'Our Impact', desc: '50+ schools, 10,000+ students, and a 98% satisfaction rate — we measure success by our partners\' growth.', bg: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10', border: 'border-amber-100 dark:border-amber-800/30', iconColor: 'text-amber-600 dark:text-amber-400' },
];

function TiltCard({ member, idx }: { member: typeof TEAM[0]; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 12 });
  const springY = useSpring(y, { stiffness: 150, damping: 12 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  function handleMouse(e: React.MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const gradients = ['from-emerald-500 to-teal-500', 'from-blue-500 to-indigo-500', 'from-purple-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-rose-500 to-red-500', 'from-cyan-500 to-blue-500', 'from-violet-500 to-purple-500', 'from-lime-500 to-emerald-500'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.02, z: 20 }}
        className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 transition-colors duration-500 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-800/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`w-24 h-24 mx-auto mb-5 rounded-[1.25rem] overflow-hidden bg-gradient-to-br ${gradients[idx % gradients.length]} p-[3px] shadow-lg`}
          >
            <div className="w-full h-full rounded-[1.1rem] overflow-hidden bg-white dark:bg-slate-900">
              {member.image ? (
                <img src={member.image} loading="lazy" decoding="async" alt={member.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-2xl text-slate-400">{member.name.charAt(0)}</div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '40%' }}
            viewport={{ once: true }}
            className="h-0.5 mx-auto mb-4 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
          />

          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight leading-tight">{member.name}</h3>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${gradients[idx % gradients.length]} text-white mb-3 shadow-sm`}
          >
            {member.role}
          </motion.div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">{member.bio}</p>

          <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            {member.email && (
              <a href={`mailto:${member.email}`} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/5 to-teal-500/5 blur-2xl group-hover:from-emerald-500/20 group-hover:to-teal-500/20 transition-all duration-700 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}

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
              className={`p-10 rounded-[2.5rem] bg-gradient-to-br ${v.bg} border ${v.border} hover:-translate-y-2 hover:shadow-xl transition-transform transition-shadow duration-500`}
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
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-blue-500/5 rounded-[4rem] blur-3xl pointer-events-none" />
          <div className="text-center mb-16 relative z-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-widest text-xs mb-6">
              <Users className="w-4 h-4" />
              Our People
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-emerald-500 to-teal-500">Team</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">The innovators shaping the future of EduAltTech</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
            {TEAM.map((member, idx) => (
              <TiltCard key={idx} idx={idx} member={member} />
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
            <Link to="/contact" className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black transition-colors transition-transform shadow-xl shadow-emerald-500/30 hover:-translate-y-1">
              Get in Touch
            </Link>
            <Link to="/services" className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold transition-colors transition-transform backdrop-blur-sm hover:-translate-y-1">
              Explore Services
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
