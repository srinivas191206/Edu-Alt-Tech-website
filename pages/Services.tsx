import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Globe, Smartphone, Brain, Zap, BookOpen, GraduationCap, Sparkles, ShieldCheck } from 'lucide-react';
import { SERVICES } from '../constants';

const iconMap: Record<string, React.ReactNode> = {
 Globe: <Globe className="w-8 h-8" />,
 Smartphone: <Smartphone className="w-8 h-8" />,
 Brain: <Brain className="w-8 h-8" />,
 Zap: <Zap className="w-8 h-8" />,
 BookOpen: <BookOpen className="w-8 h-8" />,
 GraduationCap: <GraduationCap className="w-8 h-8" />,
};

const Services: React.FC = () => {
 return (
 <div className="min-h-screen pt-32 pb-32 px-6 bg-white relative overflow-hidden">
 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[60px] rounded-full" />
 <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[60px] rounded-full" />

 <div className="max-w-[1400px] mx-auto relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto mb-20">
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 /30 border border-emerald-200 /50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
 <Sparkles className="w-4 h-4" />
 Our Services
 </div>
 <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
 Technology Solutions<br />for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500">Modern Schools</span>
 </h1>
 <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
 Comprehensive digital solutions designed to empower educational institutions with cutting-edge technology.
 </p>
 </motion.div>

 <div className="grid md:grid-cols-2 gap-8 mb-20">
 {SERVICES.map((service, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 40 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.1, duration: 0.6 }}
 className="group bg-white border border-slate-200 rounded-[2rem] p-10 hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-colors transition-shadow transition-transform duration-500"
 >
 <div className="flex items-start gap-6 mb-8">
 <div className="text-emerald-500 bg-emerald-50 /20 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
 {iconMap[service.icon]}
 </div>
 <div>
 <h2 className="text-2xl font-black text-slate-900 mb-2">{service.title}</h2>
 <p className="text-slate-500 leading-relaxed">{service.description}</p>
 </div>
 </div>
 <ul className="grid grid-cols-2 gap-3">
 {service.features.map((f, i) => (
 <li key={i} className="flex items-center gap-2 text-sm text-slate-600 ">
 <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
 {f}
 </li>
 ))}
 </ul>
 </motion.div>
 ))}
 </div>

 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-[3rem] p-14 lg:p-20 text-center shadow-2xl overflow-hidden relative"
 >
 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
 <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
 <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10 tracking-tighter">
 Ready to Get Started?
 </h2>
 <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto relative z-10">
 Schedule a free consultation and discover how we can transform your school with technology.
 </p>
 <div className="flex flex-wrap justify-center gap-4 relative z-10">
 <Link to="/contact" className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black transition-colors transition-transform shadow-xl shadow-emerald-500/30 hover:-translate-y-1">
 Get a Free Consultation
 </Link>
 <Link to="/resources" className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold transition-colors transition-transform backdrop-blur-sm hover:-translate-y-1">
 Explore Resources
 </Link>
 </div>
 </motion.div>
 </div>
 </div>
 );
};

export default Services;
