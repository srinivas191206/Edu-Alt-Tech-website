import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, GraduationCap, Globe, Smartphone, Brain, Zap, BookOpen, ShieldCheck, Users, Star, Download, FileText } from 'lucide-react';
import { SERVICES, STATS, HOW_IT_WORKS } from '../constants';

const iconMap: Record<string, React.ReactNode> = {
 Globe: <Globe className="w-8 h-8" />,
 Smartphone: <Smartphone className="w-8 h-8" />,
 Brain: <Brain className="w-8 h-8" />,
 Zap: <Zap className="w-8 h-8" />,
 BookOpen: <BookOpen className="w-8 h-8" />,
 GraduationCap: <GraduationCap className="w-8 h-8" />,
};

const Home: React.FC = () => {
 return (
 <div className="bg-white transition-colors duration-300 overflow-hidden">
 {/* Hero Section */}
 <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/30 /20" />
 <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/5 blur-[80px] rounded-full" />
 <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[80px] rounded-full" />

 <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
 <div className="grid lg:grid-cols-2 gap-16 items-center">
 <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 /30 border border-emerald-200 /50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-8 shadow-sm">
 <ShieldCheck className="w-4 h-4" />
 Trusted by 50+ Schools
 </div>
 <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.85]">
 Your Complete{' '}
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500">Education Technology</span>{' '}
 Partner
 </h1>
 <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl font-medium">
 From websites and mobile apps to AI tools and ERP systems — we provide end-to-end technology solutions that empower schools to deliver exceptional education.
 </p>
 <div className="flex flex-wrap gap-4">
 <Link to="/services" className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-colors transition-transform shadow-xl shadow-emerald-600/25 hover:shadow-emerald-500/30 hover:-translate-y-1 inline-flex items-center gap-2">
 Explore Services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
 </Link>
 <Link to="/contact" className="px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 :bg-slate-800 border border-slate-200 hover:-translate-y-1 transition-colors transition-transform">
 Get a Free Consultation
 </Link>
 </div>

 <div className="flex flex-wrap gap-8 mt-12 pt-12 border-t border-slate-200 ">
 {STATS.map((stat, i) => (
 <div key={i}>
 <div className="text-3xl font-black text-slate-900 ">{stat.value}</div>
 <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
 </div>
 ))}
 </div>
 </motion.div>

 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:block">
 <div className="relative">
 <div className="w-full aspect-square rounded-[3rem] bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-blue-400/20 /10 /5 /10 border border-emerald-200/50 /30 backdrop-blur-sm p-12 flex items-center justify-center">
 <div className="grid grid-cols-2 gap-6 w-full">
 {['Website Dev', 'Mobile Apps', 'School ERP', 'AI Tools', 'Curriculum', 'Training'].map((item, i) => (
 <div key={i} className="bg-white/80 /80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-shadow transition-transform">
 <div className="text-emerald-500 mb-3">{iconMap[['Globe', 'Smartphone', 'Brain', 'Zap', 'BookOpen', 'GraduationCap'][i]]}</div>
 <div className="font-bold text-slate-900 text-sm">{item}</div>
 </div>
 ))}
 </div>
 </div>
 <div className="absolute -top-4 -right-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
 <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
 </div>
 </motion.div>
 </div>
 </div>
 </section>

 {/* Services Preview */}
 <section className="py-28 px-6 relative">
 <div className="absolute inset-0 bg-slate-50/50 /50" />
 <div className="max-w-7xl mx-auto relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 /30 border border-emerald-200 /50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
 What We Offer
 </div>
 <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
 Complete Technology Solutions<br />for Modern Schools
 </h2>
 <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
 Everything your school needs to digitize, streamline, and excel in the 21st century.
 </p>
 </motion.div>

 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
 {SERVICES.slice(0, 6).map((service, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.08, duration: 0.5 }}
 className="group bg-white border border-slate-200 rounded-3xl p-8 hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-colors transition-shadow transition-transform duration-500"
 >
 <div className="text-emerald-500 mb-6 bg-emerald-50 /20 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
 {iconMap[service.icon]}
 </div>
 <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{service.title}</h3>
 <p className="text-slate-500 mb-6 leading-relaxed">{service.description}</p>
 <ul className="space-y-2">
 {service.features.slice(0, 3).map((f, i) => (
 <li key={i} className="flex items-start gap-2 text-sm text-slate-600 ">
 <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
 {f}
 </li>
 ))}
 </ul>
 </motion.div>
 ))}
 </div>

 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
 <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 :bg-slate-100 transition-colors transition-transform hover:-translate-y-1">
 View All Services <ArrowRight className="w-5 h-5" />
 </Link>
 </motion.div>
 </div>
 </section>

 {/* Resources Preview */}
 <section className="py-28 px-6 relative">
 <div className="max-w-7xl mx-auto">
 <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
 <div>
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 /30 border border-emerald-200 /50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
 <FileText className="w-4 h-4" />
 Learning Resources
 </div>
 <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">
 Free & Premium<br />Educational Resources
 </h2>
 </div>
 <Link to="/resources" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-500 transition-colors">
 Browse All Resources <ArrowRight className="w-5 h-5" />
 </Link>
 </motion.div>

 <div className="grid md:grid-cols-4 gap-6">
 {[
 { icon: <FileText className="w-6 h-6" />, title: "Free PDFs", desc: "Download free study materials and guides" },
 { icon: <BookOpen className="w-6 h-6" />, title: "Notes & Summaries", desc: "Comprehensive subject notes" },
 { icon: <Brain className="w-6 h-6" />, title: "Question Banks", desc: "Practice with curated question sets" },
 { icon: <Download className="w-6 h-6" />, title: "Worksheets", desc: "Printable worksheets for practice" },
 ].map((item, i) => (
 <motion.div
 key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
 className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-500 hover:-translate-y-2 transition-colors transition-transform duration-500 shadow-sm hover:shadow-xl text-center"
 >
 <div className="w-14 h-14 bg-emerald-50 /20 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-5">{item.icon}</div>
 <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
 <p className="text-sm text-slate-500 ">{item.desc}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* How It Works */}
 <section className="py-28 px-6 relative bg-slate-50/50 /50">
 <div className="max-w-7xl mx-auto">
 <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 /30 border border-emerald-200 /50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
 Our Process
 </div>
 <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
 How We Partner<br />with Schools
 </h2>
 </motion.div>

 <div className="grid md:grid-cols-4 gap-8">
 {HOW_IT_WORKS.map((step, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.1 }}
 className="text-center relative"
 >
 <div className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-xl shadow-emerald-500/20">
 {idx + 1}
 </div>
 <div className="hidden md:block absolute top-10 left-[60%] w-[calc(100%-80px)] h-px bg-emerald-200 /50" style={{ display: idx < 3 ? 'block' : 'none' }} />
 <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
 <p className="text-slate-500 leading-relaxed">{step.description}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Testimonials / Trust */}
 <section className="py-28 px-6 relative">
 <div className="max-w-7xl mx-auto">
 <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-[3rem] p-14 lg:p-20 shadow-2xl overflow-hidden relative">
 <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
 <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

 <div className="relative z-10 text-center max-w-3xl mx-auto">
 <GraduationCap className="w-16 h-16 text-emerald-400 mx-auto mb-8" />
 <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
 Ready to Transform Your School?
 </h2>
 <p className="text-lg text-slate-300 mb-12 leading-relaxed">
 Partner with EduAltTech and bring world-class technology solutions to your institution. From digital infrastructure to AI-powered learning tools — we've got you covered.
 </p>
 <div className="flex flex-wrap justify-center gap-4">
 <Link to="/contact" className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black transition-colors transition-transform shadow-xl shadow-emerald-500/30 hover:-translate-y-1">
 Get Started Today
 </Link>
 <Link to="/resources" className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold transition-colors transition-transform backdrop-blur-sm hover:-translate-y-1">
 Explore Free Resources
 </Link>
 </div>
 </div>
 </motion.div>
 </div>
 </section>
 </div>
 );
};

export default Home;
