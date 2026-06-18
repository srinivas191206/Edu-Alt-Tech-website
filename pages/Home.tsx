import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle, GraduationCap, Globe, Smartphone, Brain, Zap, BookOpen, 
  ShieldCheck, Users, Star, Download, FileText, Award, Lightbulb, Code2, 
  TrendingUp, Calculator, Atom, Music, Palette, Briefcase, Compass, Sparkles, 
  Play, Hammer, MapPin, MessageCircle, Code, Rocket, RefreshCw, Target, 
  Volume2, Languages, Video, Cpu, School, Sparkle
} from 'lucide-react';

// ════════════════════════════════════════════════════════════ Decrypt Text Animation Component
const DecryptText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 30 }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "अఅあ文ΩΣÆ$#@%&*+-/\\<>[]{}";

  useEffect(() => {
    let active = true;
    let frame = 0;
    const targetText = text;
    const length = targetText.length;
    
    const interval = setInterval(() => {
      if (!active) return;
      
      const progress = frame / 18; // 18 frames to fully resolve
      
      const scrambled = targetText
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index / length < progress) {
            return targetText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
        
      setDisplayText(scrambled);
      frame++;
      
      if (frame >= 18) {
        setDisplayText(targetText);
        clearInterval(interval);
      }
    }, speed);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [text, speed]);

  return <span>{displayText}</span>;
};

// ════════════════════════════════════════════════════════════ Language Simulator Translations
const translations = {
  en: {
    lang: "English",
    flag: "🇺🇸",
    transcript: "Welcome to today's live classroom session! Today, we will explore how we design scalable systems and why clean architecture is essential for large-scale web development.",
    termTitle: "Key Concept Definition",
    termText: "Clean Architecture: A software design philosophy that separates elements into distinct layers to ensure independent testing and backend flexibility.",
    badge: "Active English Stream",
    buttonLabel: "Download English PDF"
  },
  hi: {
    lang: "हिन्दी (Hindi)",
    flag: "🇮🇳",
    transcript: "आज के लाइव क्लास सत्र में आपका स्वागत है! आज हम खोज करेंगे कि हम स्केलेबल सिस्टम कैसे डिज़ाइन करते हैं और बड़े पैमाने के वेब विकास के लिए स्वच्छ आर्किटेक्चर क्यों आवश्यक है।",
    termTitle: "प्रमुख अवधारणा परिभाषा",
    termText: "स्वच्छ आर्किटेक्चर: एक सॉफ्टवेयर डिज़ाइन दर्शन जो स्वतंत्र परीक्षण और बैकएंड लचीलापन सुनिश्चित करने के लिए तत्वों को अलग-अलग परतों में विभाजित करता है।",
    badge: "सक्रिय हिंदी स्ट्रीम",
    buttonLabel: "हिंदी पीडीएफ डाउनलोड करें"
  },
  te: {
    lang: "తెలుగు (Telugu)",
    flag: "🇮🇳",
    transcript: "ఈనాటి ప్రత్యక్ష తరగతి సెషన్‌కు స్వాగతం! ఈ రోజు, మనం స్కేలబుల్ సిస్టమ్‌లను ఎలా డిజైన్ చేస్తామో మరియు పెద్ద ఎత్తున వెబ్ అభివృద్ధికి క్లీన్ ఆర్కిటెక్చర్ ఎందుకు అవసరమో అన్వేషిస్తాము.",
    termTitle: "కీలక భావన నిర్వచనం",
    termText: "క్లీన్ ఆర్కిటెక్చర్: స్వతంత్ర పరీక్షలు మరియు బ్యాకెండ్ వశ్యతను నిర్ధారించడానికి సాఫ్ట్‌వేర్ రూపకల్పన సిద్ధాంతం, ఇది మూలకాలను విభిన్న వలయాలుగా విభజిస్తుంది.",
    badge: "సక్రియ తెలుగు స్ట్రీమ్",
    buttonLabel: "తెలుగు PDF డౌన్‌లోడ్ చేయండి"
  },
  es: {
    lang: "Español (Spanish)",
    flag: "🇪🇸",
    transcript: "¡Bienvenidos a la sesión de clase en vivo de hoy! Hoy exploraremos cómo diseñamos sistemas escalables y por qué la arquitectura limpia es esencial para el desarrollo web a gran escala.",
    termTitle: "Definición del Concepto Clave",
    termText: "Arquitectura Limpia: Una filosofía de diseño de software que separa elementos en distintas capas para asegurar pruebas independientes y flexibilidad del backend.",
    badge: "Transmisión en Español Activa",
    buttonLabel: "Descargar PDF en Español"
  },
  bn: {
    lang: "বাংলা (Bengali)",
    flag: "🇧🇩",
    transcript: "আজকের লাইভ ক্লাসরুম সেশনে আপনাদের স্বাগতম! আজ আমরা অন্বেষণ করব কীভাবে আমরা স্কেলযোগ্য সিস্টেম ডিজাইন করি এবং কেন পরিচ্ছন্ন আর্কিটেকচার বড় আকারের ওয়েব ডেভেলপমেন্টের জন্য অপরিহার্য।",
    termTitle: "মূল ধারণা সংজ্ঞা",
    termText: "পরিচ্ছন্ন আর্কিটেকচার: একটি সফটওয়্যার ডিজাইন দর্শন যা স্বাধীন পরীক্ষা এবং ব্যাকএন্ড নমনীয়তা নিশ্চিত করতে উপাদানগুলিকে পৃথক স্তরে বিভক্ত করে।",
    badge: "সক্রিয় বাংলা স্ট্রিমিং",
    buttonLabel: "বাংলা পিডিএফ ডাউনলোড করুন"
  }
};

type LangKey = keyof typeof translations;

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-8 h-8" />,
  Smartphone: <Smartphone className="w-8 h-8" />,
  Brain: <Brain className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  BookOpen: <BookOpen className="w-8 h-8" />,
  GraduationCap: <GraduationCap className="w-8 h-8" />,
};

const Home: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<LangKey>('en');
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const heroWords = ["for Everyone", "for Schools", "for Students", "without Barriers"];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroWordIndex((prev) => (prev + 1) % heroWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 overflow-hidden min-h-screen relative">
      
      {/* ═══════════════════════════════════════════════════════ Hero Section (Spatial Design) */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-grid-pattern mask-radial-fade opacity-60 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-emerald-400/10 blur-[120px] rounded-full animate-morph-blob" />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full animate-morph-blob" style={{ animationDelay: '-5s' }} />
          <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-amber-400/5 blur-[100px] rounded-full animate-morph-blob" style={{ animationDelay: '-10s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left: Rich Typography & Staggered Elements */}
          <div className="lg:col-span-7 text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-bold uppercase tracking-widest text-[10px] shadow-sm animate-pulse-soft"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Trusted Alternative Education Ecosystem
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]"
            >
              Learn. Build.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 animate-shimmer-text">
                Innovate.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl font-medium"
            >
              Alternative Education, Industry Skills, AI Learning, School Technology Solutions, and Future-Ready Courses — breaking language barriers for everything.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link to="/courses" className="group relative px-8 py-4 bg-slate-950 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-slate-950/20 hover:shadow-emerald-600/30 hover:-translate-y-1 inline-flex items-center gap-2">
                Explore Courses 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-white/80 backdrop-blur-md text-slate-900 rounded-2xl font-bold hover:bg-slate-100 border border-slate-200/80 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                Partner With Us
              </Link>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-wrap gap-8 pt-8 border-t border-slate-200/60 max-w-xl"
            >
              {[
                { value: "4", label: "Partner Schools" },
                { value: "500+", label: "Students Reached" },
                { value: "100+", label: "Study Resources" },
                { value: "98%", label: "Satisfaction Rate" },
              ].map((stat, i) => (
                <div key={i} className="min-w-[100px]">
                  <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Right: Interactive Floating Skill Sphere */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[450px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-80 h-80 rounded-full bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl backdrop-blur-xl"
            >
              {/* Central Logo Orb */}
              <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center shadow-2xl border border-slate-100 z-20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img src="/edulogo.png" alt="EduAltTech Logo" className="w-20 h-20 object-contain z-10 animate-float" />
              </div>

              {/* Orbiting Language Characters representing barrier breaking */}
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute inset-0 animate-orbit-1 flex items-center justify-center">
                  <span className="bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-md font-bold text-emerald-600 text-sm flex items-center gap-1.5 select-none pointer-events-auto">
                    <span>अ</span> <span className="text-[10px] text-slate-400 font-medium">Hindi</span>
                  </span>
                </div>
                <div className="absolute inset-0 animate-orbit-2 flex items-center justify-center">
                  <span className="bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-md font-bold text-blue-600 text-sm flex items-center gap-1.5 select-none pointer-events-auto">
                    <span>ड</span> <span className="text-[10px] text-slate-400 font-medium">Dogri (Jammu)</span>
                  </span>
                </div>
                <div className="absolute inset-0 animate-orbit-3 flex items-center justify-center">
                  <span className="bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-md font-bold text-teal-600 text-sm flex items-center gap-1.5 select-none pointer-events-auto">
                    <span>అ</span> <span className="text-[10px] text-slate-400 font-medium">Telugu</span>
                  </span>
                </div>
                <div className="absolute inset-0 animate-orbit-4 flex items-center justify-center">
                  <span className="bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-md font-bold text-purple-600 text-sm flex items-center gap-1.5 select-none pointer-events-auto">
                    <span>ک</span> <span className="text-[10px] text-slate-400 font-medium">Kashmiri</span>
                  </span>
                </div>
                <div className="absolute inset-0 animate-orbit-5 flex items-center justify-center">
                  <span className="bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-md font-bold text-amber-600 text-sm flex items-center gap-1.5 select-none pointer-events-auto">
                    <span>অ</span> <span className="text-[10px] text-slate-400 font-medium">Bengali</span>
                  </span>
                </div>
              </div>

              {/* Orbital Path rings */}
              <div className="absolute w-[280px] h-[280px] rounded-full border border-emerald-500/10 pointer-events-none" />
              <div className="absolute w-[360px] h-[360px] rounded-full border border-blue-500/5 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ Flagship Feature: Breaking Language Barrier */}
      <section className="py-32 px-6 relative bg-white border-y border-slate-200/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px]">
              <Languages className="w-4 h-4 text-emerald-600" />
              Breaking Language Barriers
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Education Without Linguistic Boundaries
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              We translate everything. Real-time class voice dubbing, localized textbooks, and AI learning support in your mother tongue. Language is no longer a barrier to global tech skills.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Language Simulator Widget (Interactive UI) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glow-card rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-2xl bg-white relative">
                {/* Mock Window Header */}
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 tracking-tight flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                    Session.dub_stream_v2.0
                  </span>
                  <div className="w-12" /> {/* spacer */}
                </div>

                {/* Main Simulator Window */}
                <div className="p-6 md:p-8 space-y-6 bg-slate-950 text-white">
                  
                  {/* Speaker Stream & Video Frame */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between h-44 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                      <div className="z-20 flex justify-between items-start">
                        <span className="text-[10px] bg-red-600/80 text-white px-2 py-0.5 rounded font-black tracking-wider uppercase flex items-center gap-1">
                          <Video className="w-3 h-3" /> Live Feed
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold">
                          Eng Audio Stream
                        </span>
                      </div>
                      
                      {/* Audio Spectrum Waves */}
                      <div className="h-12 flex items-end justify-center gap-1.5 z-20 pb-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((idx) => (
                          <div 
                            key={idx} 
                            className="w-1.5 bg-emerald-500 rounded-full soundwave-bar" 
                            style={{ 
                              animationDelay: `${idx * 0.1}s`,
                              animationDuration: `${0.8 + Math.random() * 0.8}s` 
                            }} 
                          />
                        ))}
                      </div>
                      
                      <div className="z-20 text-xs font-bold text-slate-300">
                        Instructor: Dr. Sarah Jenkins (MIT)
                      </div>
                    </div>

                    {/* Simulator Info Card */}
                    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                          Interactive Live Translation
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          Select student's native language to translate transcript instantly:
                        </h4>
                      </div>

                      {/* Language Selection Tabs */}
                      <div className="flex flex-wrap gap-2 pt-3">
                        {Object.entries(translations).map(([key, data]) => (
                          <button
                            key={key}
                            onClick={() => setSelectedLang(key as LangKey)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                              selectedLang === key 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            <span>{data.flag}</span>
                            <span>{data.lang.split(" ")[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Transcript Panel */}
                  <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                        Live Translated Subtitles
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {translations[selectedLang].badge}
                      </span>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed font-medium min-h-[50px]">
                      <DecryptText text={translations[selectedLang].transcript} />
                    </p>
                  </div>

                  {/* Glossary Term Sync */}
                  <div className="bg-emerald-950/20 rounded-2xl p-5 border border-emerald-500/10 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400">
                        {translations[selectedLang].termTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <DecryptText text={translations[selectedLang].termText} />
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Right: Technical Features list */}
            <div className="lg:col-span-5 space-y-6">
              {[
                {
                  title: "Real-Time Dubbing & Audio Transcripts",
                  desc: "Listen to lectures in English while instantly receiving high-fidelity translated audio streams and transcripts synchronized to your device.",
                  icon: <Volume2 className="w-6 h-6 text-emerald-600" />,
                  bg: "bg-emerald-500/5",
                  border: "hover:border-emerald-500/30"
                },
                {
                  title: "Multilingual Study Materials & PDFs",
                  desc: "Access textbook summaries, coding manuals, math worksheets, and test banks instantly formatted in Hindi, Telugu, Spanish, and others.",
                  icon: <FileText className="w-6 h-6 text-blue-600" />,
                  bg: "bg-blue-500/5",
                  border: "hover:border-blue-500/30"
                },
                {
                  title: "Cross-Linguistic AI Learning Companion",
                  desc: "Ask complex doubts in your local language; our backend interprets, processes against global standards, and answers perfectly in your tongue.",
                  icon: <Brain className="w-6 h-6 text-purple-600" />,
                  bg: "bg-purple-500/5",
                  border: "hover:border-purple-500/30"
                },
                {
                  title: "Universal Peer Collaboration",
                  desc: "Work in groups with students globally. Chat interfaces translate messages instantly, letting you collaborate on software projects without borders.",
                  icon: <Users className="w-6 h-6 text-amber-600" />,
                  bg: "bg-amber-500/5",
                  border: "hover:border-amber-500/30"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`flex gap-5 p-6 bg-white border border-slate-200/80 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${feature.border}`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center shrink-0`}>
                    {feature.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ Featured Learning Programs (Cards Redesign) */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-20 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px]">
              <Star className="w-4 h-4 text-emerald-600" />
              Empowering Skillsets
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Featured Learning Programs
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
              Join industry-led training modules designed to prepare you for building real solutions.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              { title: "Artificial Intelligence Fundamentals", icon: <Brain className="w-6 h-6" />, color: "from-emerald-500 to-teal-500", glow: "rgba(16, 185, 129, 0.15)" },
              { title: "Full Stack Development", icon: <Code2 className="w-6 h-6" />, color: "from-blue-500 to-indigo-500", glow: "rgba(59, 130, 246, 0.15)" },
              { title: "Entrepreneurship & Startups", icon: <Lightbulb className="w-6 h-6" />, color: "from-amber-500 to-orange-500", glow: "rgba(245, 158, 11, 0.15)" },
              { title: "Digital Marketing Growth", icon: <TrendingUp className="w-6 h-6" />, color: "from-purple-500 to-pink-500", glow: "rgba(168, 85, 247, 0.15)" },
              { title: "Advanced Mathematics", icon: <Calculator className="w-6 h-6" />, color: "from-red-500 to-rose-500", glow: "rgba(239, 68, 68, 0.15)" },
              { title: "Physics Excellence Module", icon: <Atom className="w-6 h-6" />, color: "from-cyan-500 to-blue-500", glow: "rgba(6, 182, 212, 0.15)" },
              { title: "Music & Creative Arts", icon: <Music className="w-6 h-6" />, color: "from-violet-500 to-purple-500", glow: "rgba(139, 92, 246, 0.15)" },
              { title: "Creative Digital Design", icon: <Palette className="w-6 h-6" />, color: "from-pink-500 to-rose-500", glow: "rgba(236, 72, 153, 0.15)" },
            ].map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.6 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: `0 20px 40px ${course.glow}`,
                  scale: 1.02
                }}
                className="group bg-white border border-slate-200/80 rounded-[2.5rem] p-7 transition-all duration-300 hover:border-slate-300 relative flex flex-col justify-between h-[280px]"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/5 group-hover:scale-110 transition-transform duration-300`}>
                    {course.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-2">
                    Industry aligned curriculum
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Level: Beginner-Adv
                  </span>
                  <span className="text-xs font-black text-emerald-600 group-hover:text-emerald-500 inline-flex items-center gap-1">
                    Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mt-16"
          >
            <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-950 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all hover:-translate-y-1 shadow-xl shadow-slate-950/10">
              View All Courses <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ Learning Categories */}
      <section className="py-32 px-6 bg-slate-100/50 border-y border-slate-200/40 relative">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-20 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px]">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Structured Tracks
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Explore by Subject
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
              From academic mastery to high-growth career tracks, discover tailored curriculum structures.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BookOpen className="w-5 h-5" />, title: "Academic Subjects", color: "from-emerald-500 to-teal-500",
                items: ["Mathematics Mastery", "Conceptual Physics", "Core Chemistry", "English Language Studies"]
              },
              {
                icon: <Zap className="w-5 h-5" />, title: "Future Tech Skills", color: "from-blue-500 to-indigo-500",
                items: ["Artificial Intelligence", "Full Stack Development", "Information Security", "Analytics & Databases"]
              },
              {
                icon: <Briefcase className="w-5 h-5" />, title: "Professional Careers", color: "from-amber-500 to-orange-500",
                items: ["Digital Marketing Hub", "Public Speaking", "Personal Finance", "Startup Incubation"]
              },
              {
                icon: <Palette className="w-5 h-5" />, title: "Creative Fields", color: "from-purple-500 to-pink-500",
                items: ["Instrumental Music", "Choreography & Dance", "Visual UI/UX Design", "Cinematography Basics"]
              },
            ].map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 hover:shadow-xl transition-all duration-300 hover:border-slate-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-6 shadow-md`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-5 tracking-tight">{cat.title}</h3>
                  <ul className="space-y-4">
                    {cat.items.map((item, i) => (
                      <li key={i} className="text-slate-600 font-bold text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Syllabus Available</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ School Tech Solutions (Interactive Dashboard Redesign) */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Context */}
            <div className="lg:col-span-5 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px]">
                <School className="w-4 h-4 text-emerald-600" />
                School Technology Solutions
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                Complete Education Technology Partner
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                We design custom websites, ERP platforms, and responsive mobile apps tailored for schools, administrators, students, and parents.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Bespoke Portals", text: "Custom web development tailored for schools." },
                  { label: "ERP Systems", text: "Admissions, grading, and finance dashboards." },
                  { label: "Mobile Apps", text: "Cross-platform access for school updates." },
                  { label: "Curriculum Sync", labelIcon: <Sparkle className="w-4.5 h-4.5 text-emerald-500 inline mr-1" />, text: "Digital study material integration." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{item.label}</div>
                    <div className="text-xs text-slate-500 font-medium">{item.text}</div>
                  </div>
                ))}
              </div>

              <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-950 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all hover:-translate-y-1 shadow-md inline-block">
                Explore Tech Services <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right Column: Interactive ERP Mockup Panel */}
            <div className="lg:col-span-7">
              <div className="glow-card rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-2xl bg-white p-6 md:p-8 space-y-6 relative">
                
                {/* Mock ERP header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight">St. Xavier Tech Portal</h4>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Alt-Tech ERP Active</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">
                    Admin Panel
                  </span>
                </div>

                {/* Dashboard Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { title: "Admissions", val: "1,240", change: "+12% this term", color: "text-emerald-600" },
                    { title: "Platform Active", val: "94.6%", change: "Real-time sync", color: "text-blue-600" },
                    { title: "Course Progress", val: "88.2%", change: "+4.2% average", color: "text-purple-600" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                      <div className="text-xs text-slate-500 font-semibold">{stat.title}</div>
                      <div className={`text-2xl font-black ${stat.color} my-1`}>{stat.val}</div>
                      <div className="text-[10px] text-slate-400 font-bold">{stat.change}</div>
                    </div>
                  ))}
                </div>

                {/* ERP Activity log Simulator */}
                <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Edu-Alt-Tech ERP Database Logs
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    <div>[09:20:41] <span className="text-emerald-400">SUCCESS</span>: Synchronized class recordings (Physics L3)</div>
                    <div>[09:25:12] <span className="text-emerald-400">SUCCESS</span>: Subtitle translations generated (Hindi, Telugu)</div>
                    <div>[09:31:00] <span className="text-blue-400">INFO</span>: Pushed grade reports to 542 parent mobile applications</div>
                    <div>[09:40:02] <span className="text-emerald-400">SUCCESS</span>: ERP Billing gateway resolved. System online.</div>
                  </div>
                </div>

                {/* Connected Node Diagram teaser */}
                <div className="border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-bold text-slate-700">Integrate Website + Parents Mobile Apps</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                    <span className="text-[10px] font-bold text-slate-500">Dual Node Connected</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ Why Edu Alt Tech */}
      <section className="py-32 px-6 relative bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-20 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px]">
              <Award className="w-4 h-4 text-emerald-600" />
              Educational Paradigm
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              One Ecosystem. Endless Opportunities.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              "Immersive Future Skills",
              "Hands-On Project Labs",
              "Global Industry Mentors",
              "Dynamic Learning Pace",
              "Bespoke School Platforms",
              "Verified Degree Pathways",
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-center gap-4 p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="font-bold text-slate-900 text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ Free & Premium Resources */}
      <section className="py-32 px-6 relative bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-4">
                <Download className="w-4 h-4 text-emerald-600" />
                Curated Materials
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                Everything You Need<br />to Excel
              </h2>
            </div>
            <Link to="/resources" className="inline-flex items-center gap-2 text-emerald-600 font-black hover:text-emerald-500 transition-colors">
              Browse All Resources <ArrowRight className="w-5 h-5 animate-pulse-soft" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <FileText className="w-6 h-6" />, title: "Free Textbook PDFs", desc: "Download high-quality curated textbook notes and guides." },
              { icon: <BookOpen className="w-6 h-6" />, title: "Topic Question Banks", desc: "Sharpen knowledge with comprehensive practice questionnaires." },
              { icon: <Brain className="w-6 h-6" />, title: "Conceptual Worksheets", desc: "Printable review exercises designed to foster deep intuition." },
              { icon: <Download className="w-6 h-6" />, title: "Academic Mock Exams", desc: "Evaluate performance using board-aligned diagnostic papers." },
              { icon: <Compass className="w-6 h-6" />, title: "Professional Roadmaps", desc: "Follow progressive flowcharts for engineering and design tracks." },
              { icon: <Sparkles className="w-6 h-6" />, title: "AI Learning Manuals", desc: "Unlock prompt guidelines, tutorial sheets, and code logs." },
            ].map((item, i) => (
              <motion.div
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-slate-200/80 rounded-[2rem] p-8 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl text-left flex flex-col justify-between h-[230px] hover:border-slate-300"
              >
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-5">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{item.title}</h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ Process Walkthrough */}
      <section className="py-32 px-6 relative bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-24 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px]">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Strategic Implementation
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Your Path to Success
            </h2>
          </motion.div>

          {/* For Students */}
          <div className="mb-24">
            <h3 className="text-2xl font-black text-slate-900 mb-12 text-center flex items-center justify-center gap-2">
              <GraduationCap className="w-7 h-7 text-emerald-500" />
              For Students
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: 1, icon: <MapPin className="w-6 h-6" />, title: "1. Select Skill Paths", desc: "Choose from our catalog of engineering and conceptual courses." },
                { step: 2, icon: <Play className="w-6 h-6" />, title: "2. Join Active Sessions", desc: "Participate in lectures translated in your native tongue." },
                { step: 3, icon: <Hammer className="w-6 h-6" />, title: "3. Complete Lab Projects", desc: "Translate theoretical learning into working software or systems." },
                { step: 4, icon: <Award className="w-6 h-6" />, title: "4. Earn Qualifications", desc: "Secure industry-recognized credits and build portfolio assets." },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                    {item.icon}
                  </div>
                  {idx < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[calc(100%-80px)] h-px bg-slate-200" />}
                  <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* For Schools */}
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-12 text-center flex items-center justify-center gap-2">
              <School className="w-7 h-7 text-emerald-500" />
              For Schools
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: 1, icon: <MessageCircle className="w-6 h-6" />, title: "1. Consultation", desc: "Audit existing administration workflows and portal requirements." },
                { step: 2, icon: <Code className="w-6 h-6" />, title: "2. Custom Development", desc: "Tailor the ERP engine and school application interfaces." },
                { step: 3, icon: <Rocket className="w-6 h-6" />, title: "3. Deployment & Training", desc: "Setup portal directories and onboard academic departments." },
                { step: 4, icon: <RefreshCw className="w-6 h-6" />, title: "4. Core Support", desc: "Provide secure cloud hosting and regular patch updates." },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 bg-slate-950 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-950/10">
                    {item.icon}
                  </div>
                  {idx < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[calc(100%-80px)] h-px bg-slate-200" />}
                  <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ Impact Metrics */}
      <section className="py-32 px-6 relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-drift" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 animate-drift-reverse" />
        <div className="max-w-7xl mx-auto relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-20 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-emerald-300 font-bold uppercase tracking-widest text-[10px]">
              <Target className="w-4 h-4 text-emerald-400" />
              Success Metrics
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">
              Our Global Footprint
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "4", label: "Partner Schools", icon: <Globe className="w-6 h-6" /> },
              { value: "500+", label: "Students Enrolled", icon: <Users className="w-6 h-6" /> },
              { value: "100+", label: "Learning Roadmaps", icon: <BookOpen className="w-6 h-6" /> },
              { value: "20+", label: "Expert Instructors", icon: <Star className="w-6 h-6" /> },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-md"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6 border border-white/10">
                  {metric.icon}
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tight">{metric.value}</div>
                <div className="text-xs text-emerald-300/80 font-bold uppercase tracking-wider">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ Final CTA */}
      <section className="py-32 px-6 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-[3rem] p-12 lg:p-20 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 animate-drift" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 animate-drift-reverse" />

            <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                <GraduationCap className="w-8 h-8" />
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                Ready to Redefine Education?
              </h2>
              
              <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
                Join our custom tracks as a student to acquire engineering skillsets, or reach out to partner as an institution to leverage our ERP and web services.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link to="/courses" className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 hover:-translate-y-1">
                  Explore Learning Portal
                </Link>
                <Link to="/contact" className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all backdrop-blur-sm hover:-translate-y-1">
                  Consult Tech Department
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
