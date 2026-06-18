import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, GraduationCap, Globe, Smartphone, Brain, Zap, BookOpen, ShieldCheck, Users, Star, Download, FileText, Award, Lightbulb, Code2, TrendingUp, Calculator, Atom, Music, Palette, Briefcase, Compass, Sparkles, Play, Hammer, MapPin, MessageCircle, Code, Rocket, RefreshCw, Target } from 'lucide-react';

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
    <div className="bg-white overflow-hidden">

      {/* ═══════════════════════════════════════════════════════ Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/30" />
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/5 blur-[80px] rounded-full animate-drift" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[80px] rounded-full animate-drift-reverse" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/30 border border-amber-200/50 text-amber-700 font-bold uppercase tracking-widest text-[10px] mb-8 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              Trusted by Schools, Educators & Students
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.85]">
              Learn. Build.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 animate-shimmer-text">Innovate.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl font-medium">
              Alternative Education, Industry Skills, AI Learning, School Technology Solutions, and Future-Ready Courses — all in one ecosystem.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/courses" className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-600/25 hover:shadow-emerald-500/30 hover:-translate-y-1 inline-flex items-center gap-2">
                Explore Courses <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 border border-slate-200 hover:-translate-y-1 transition-all">
                Partner With Us
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 mt-12 pt-12 border-t border-slate-200">
              {[
                { value: "4", label: "Schools" },
                { value: "500+", label: "Students" },
                { value: "100+", label: "Learning Resources" },
                { value: "98%", label: "Satisfaction" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-black text-slate-900 animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ Featured Learning Programs */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-slate-50/50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/30 border border-emerald-200/50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
              <Star className="w-4 h-4" />
              Featured Learning Programs
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Popular Courses
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { title: "Artificial Intelligence Fundamentals", icon: <Brain className="w-6 h-6" />, color: "from-emerald-500 to-teal-500" },
              { title: "Full Stack Development", icon: <Code2 className="w-6 h-6" />, color: "from-blue-500 to-indigo-500" },
              { title: "Entrepreneurship & Startup Building", icon: <Lightbulb className="w-6 h-6" />, color: "from-amber-500 to-orange-500" },
              { title: "Digital Marketing", icon: <TrendingUp className="w-6 h-6" />, color: "from-purple-500 to-pink-500" },
              { title: "Mathematics Mastery", icon: <Calculator className="w-6 h-6" />, color: "from-red-500 to-rose-500" },
              { title: "Physics Excellence", icon: <Atom className="w-6 h-6" />, color: "from-cyan-500 to-blue-500" },
              { title: "Music & Creative Arts", icon: <Music className="w-6 h-6" />, color: "from-violet-500 to-purple-500" },
            ].map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="group bg-white border border-slate-200 rounded-3xl p-6 hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  {course.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{course.title}</h3>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:-translate-y-1">
              View All Courses <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ Learning Categories */}
      <section className="py-28 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/30 border border-emerald-200/50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
              <BookOpen className="w-4 h-4" />
              Learning Categories
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Explore by Subject
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BookOpen className="w-5 h-5" />, title: "Academic Subjects", color: "from-emerald-500 to-teal-500",
                items: ["Mathematics", "Physics", "Chemistry", "English"]
              },
              {
                icon: <Zap className="w-5 h-5" />, title: "Future Skills", color: "from-blue-500 to-indigo-500",
                items: ["AI", "Programming", "Cybersecurity", "Data Science"]
              },
              {
                icon: <Briefcase className="w-5 h-5" />, title: "Career Skills", color: "from-amber-500 to-orange-500",
                items: ["Digital Marketing", "Public Speaking", "Finance", "Entrepreneurship"]
              },
              {
                icon: <Palette className="w-5 h-5" />, title: "Creative Skills", color: "from-purple-500 to-pink-500",
                items: ["Music", "Dance", "Design"]
              },
            ].map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-5 shadow-md`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{cat.title}</h3>
                <ul className="space-y-2.5">
                  {cat.items.map((item, i) => (
                    <li key={i} className="text-slate-600 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ School Technology Solutions */}
      <section className="py-28 px-6 relative bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/30 border border-emerald-200/50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
              <Globe className="w-4 h-4" />
              School Technology Solutions
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
              Complete Education Technology Partner
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Everything schools need to digitize and modernize education.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "School Website Development", icon: "Globe", desc: "Custom, modern, responsive websites for schools with integrated portals." },
              { title: "Mobile App Development", icon: "Smartphone", desc: "Native & cross-platform mobile apps for students, parents, and staff." },
              { title: "School ERP Solutions", icon: "Brain", desc: "Complete school management system for administration and academics." },
              { title: "AI Solutions", icon: "Zap", desc: "AI tools to enhance teaching, learning, and administrative efficiency." },
              { title: "Curriculum Support", icon: "BookOpen", desc: "Digitally-enhanced curriculum materials aligned with educational standards." },
              { title: "Teacher Training", icon: "GraduationCap", desc: "Professional development programs for modern teaching methodologies." },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="group bg-white border border-slate-200 rounded-3xl p-8 hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="text-emerald-500 mb-6 bg-emerald-50/20 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {iconMap[service.icon]}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:-translate-y-1">
              Explore Services <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ Why Edu Alt Tech */}
      <section className="py-28 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/30 border border-emerald-200/50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
              <Award className="w-4 h-4" />
              Why Edu Alt Tech?
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              One Platform. Multiple Opportunities.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              "Learn Future Skills",
              "Build Real Projects",
              "Industry Mentorship",
              "Flexible Learning",
              "School Technology Solutions",
              "Certification Programs",
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-center gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="font-bold text-slate-900">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ Free & Premium Resources */}
      <section className="py-28 px-6 relative bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/30 border border-emerald-200/50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
                <Download className="w-4 h-4" />
                Free & Premium Resources
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                Everything You Need<br />to Succeed
              </h2>
            </div>
            <Link to="/resources" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-500 transition-colors">
              Browse Resources <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <FileText className="w-6 h-6" />, title: "Free PDFs", desc: "Download free study materials and guides" },
              { icon: <BookOpen className="w-6 h-6" />, title: "Question Banks", desc: "Practice with curated question sets" },
              { icon: <Brain className="w-6 h-6" />, title: "Worksheets", desc: "Printable worksheets for practice" },
              { icon: <Download className="w-6 h-6" />, title: "Practice Tests", desc: "Mock exams to test your knowledge" },
              { icon: <Compass className="w-6 h-6" />, title: "Career Roadmaps", desc: "Step-by-step guides for your career" },
              { icon: <Sparkles className="w-6 h-6" />, title: "AI Learning Resources", desc: "Learn AI with curated tutorials" },
            ].map((item, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-500 hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-xl text-center"
              >
                <div className="w-14 h-14 bg-emerald-50/20 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-5">{item.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ How It Works */}
      <section className="py-28 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/30 border border-emerald-200/50 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
              <MapPin className="w-4 h-4" />
              How It Works
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
              Your Path to Success
            </h2>
          </motion.div>

          {/* For Students */}
          <div className="mb-20">
            <h3 className="text-2xl font-black text-slate-900 mb-10 text-center">
              <GraduationCap className="w-7 h-7 inline mr-2 text-emerald-500" />
              For Students
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: 1, icon: <MapPin className="w-6 h-6" />, title: "Choose a Learning Path", desc: "Pick from our curated courses and programs" },
                { step: 2, icon: <Play className="w-6 h-6" />, title: "Learn Through Live & Recorded Classes", desc: "Study at your own pace with expert guidance" },
                { step: 3, icon: <Hammer className="w-6 h-6" />, title: "Complete Projects", desc: "Apply your skills with real-world projects" },
                { step: 4, icon: <Award className="w-6 h-6" />, title: "Earn Certificates", desc: "Get certified and advance your career" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/20">
                    {item.icon}
                  </div>
                  {idx < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[calc(100%-80px)] h-px bg-emerald-200" />}
                  <h4 className="text-lg font-black text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* For Schools */}
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-10 text-center">
              <Globe className="w-7 h-7 inline mr-2 text-emerald-500" />
              For Schools
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: 1, icon: <MessageCircle className="w-6 h-6" />, title: "Consultation", desc: "We understand your school's unique needs" },
                { step: 2, icon: <Code className="w-6 h-6" />, title: "Solution Development", desc: "Custom solutions tailored to your institution" },
                { step: 3, icon: <Rocket className="w-6 h-6" />, title: "Deployment & Training", desc: "Implement and train your staff for adoption" },
                { step: 4, icon: <RefreshCw className="w-6 h-6" />, title: "Continuous Support", desc: "Ongoing support and continuous improvement" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 bg-indigo-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-indigo-500/20">
                    {item.icon}
                  </div>
                  {idx < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[calc(100%-80px)] h-px bg-indigo-200" />}
                  <h4 className="text-lg font-black text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ Success Metrics */}
      <section className="py-28 px-6 relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-drift" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 animate-drift-reverse" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-emerald-300 font-bold uppercase tracking-widest text-[10px] mb-6">
              <Target className="w-4 h-4" />
              Success Metrics
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">
              Our Impact
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "4", label: "Partner Schools", icon: <Globe className="w-6 h-6" /> },
              { value: "500+", label: "Students Reached", icon: <Users className="w-6 h-6" /> },
              { value: "100+", label: "Courses & Resources", icon: <BookOpen className="w-6 h-6" /> },
              { value: "20+", label: "Expert Mentors", icon: <Star className="w-6 h-6" /> },
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-5 backdrop-blur-sm border border-white/10">
                  {metric.icon}
                </div>
                <div className="text-5xl font-black text-white mb-2">{metric.value}</div>
                <div className="text-emerald-300/80 font-medium">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ Final CTA */}
      <section className="py-28 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-[3rem] p-14 lg:p-20 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-drift" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 animate-drift-reverse" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <GraduationCap className="w-16 h-16 text-emerald-400 mx-auto mb-8" />
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                Ready to Transform Education?
              </h2>
              <p className="text-lg text-slate-300 mb-12 leading-relaxed">
                Whether you're a student looking to learn future skills or a school seeking digital transformation, Edu Alt Tech can help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/courses" className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/30 hover:-translate-y-1">
                  Explore Courses
                </Link>
                <Link to="/contact" className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold transition-all backdrop-blur-sm hover:-translate-y-1">
                  Book a Consultation
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
