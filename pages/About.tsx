import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Users, BookOpen, Rocket, Globe, HeartHandshake, Sparkles, Linkedin, Mail, GraduationCap, Code2, Zap, Award, CheckCircle, Play, Hammer, MapPin, MessageCircle, RefreshCw, Palette, Briefcase } from 'lucide-react';
import { TEAM, SUPPORTING_TEAM } from '../constants';

function useIsMobile() {
  const [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}
function MotionDiv({ children, ...props }: any) {
  const isMobile = useIsMobile();
  if (isMobile) {
    const { initial, animate, whileInView, viewport, transition, whileHover, exit, layout, variants, onAnimationComplete, ...rest } = props;
    return <div {...rest}>{children}</div>;
  }
  return <motion.div {...props}>{children}</motion.div>;
}

const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24 sm:pb-32 bg-slate-50 transition-colors duration-300 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[60px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[60px] rounded-full" />
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-purple-500/10 blur-[60px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">

        {/* Mission Hero */}
        <MotionDiv initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center max-w-4xl mx-auto mb-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
            <Sparkles className="w-4 h-4" />
            Our Mission
          </div>
          <h1 className="text-[2rem] sm:text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
            Empowering the Next Generation of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 animate-shimmer-text">Innovators</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto mb-12">
            We believe every student deserves an education that prepares them for tomorrow — not just for the next exam. Edu Alt Tech was built by a team of passionate technologists and educators who saw a gap between traditional academics and the skills the world actually needs.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: <Target className="w-6 h-6" />, title: "Our Vision", desc: "A world where education and real-world skills are inseparable — where every learner is future-ready." },
              { icon: <HeartHandshake className="w-6 h-6" />, title: "Our Promise", desc: "We partner with students and schools to deliver relevant, high-quality learning that opens doors." },
              { icon: <Rocket className="w-6 h-6" />, title: "Our Drive", desc: "Innovation is at our core. We constantly evolve our platform to match the pace of industry change." },
            ].map((item, idx) => (
              <MotionDiv
                key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + idx * 0.12 }}
                className="bg-white border border-slate-200 rounded-[1.25rem] sm:rounded-[1.5rem] p-6 text-left hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">{item.icon}</div>
                <h3 className="font-black text-slate-900 text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        {/* Our Story */}
        <MotionDiv initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
            <BookOpen className="w-4 h-4" />
            Our Story
          </div>
          <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter">Why We Built Edu Alt Tech</h2>
          <div className="space-y-6 text-slate-600 leading-relaxed text-base sm:text-lg">
            <p>Edu Alt Tech was founded on a simple belief: education should prepare students for the future, not just the exam. We saw a gap between what schools teach and what the world needs — so we built a platform that bridges both.</p>
            <p>For students, we offer courses in AI, programming, digital marketing, entrepreneurship, and creative arts — alongside academic support in mathematics, physics, chemistry, and English. For schools, we provide technology solutions: websites, mobile apps, ERP systems, and AI tools that digitize operations and enhance learning.</p>
            <p>Our team combines deep technical expertise with a genuine passion for education. We don't just build courses or software — we build long-term partnerships with learners and institutions, providing mentorship, support, and continuous innovation.</p>
          </div>
        </MotionDiv>

        {/* Learning Categories */}
        <MotionDiv initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
              <BookOpen className="w-4 h-4" />
              Learning Categories
            </div>
            <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Explore by Subject</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <BookOpen className="w-5 h-5" />, title: "Academic Subjects", color: "from-emerald-500 to-teal-500", items: ["Mathematics", "Physics", "Chemistry", "English"] },
              { icon: <Zap className="w-5 h-5" />, title: "Future Skills", color: "from-blue-500 to-indigo-500", items: ["AI", "Programming", "Cybersecurity", "Data Science"] },
              { icon: <Briefcase className="w-5 h-5" />, title: "Career Skills", color: "from-amber-500 to-orange-500", items: ["Digital Marketing", "Public Speaking", "Finance", "Entrepreneurship"] },
              { icon: <Palette className="w-5 h-5" />, title: "Creative Skills", color: "from-purple-500 to-pink-500", items: ["Music", "Dance", "Design"] },
            ].map((cat, idx) => (
              <MotionDiv
                key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-200 rounded-[1.25rem] sm:rounded-[1.5rem] p-6 sm:p-8 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-5 shadow-md`}>{cat.icon}</div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-4">{cat.title}</h3>
                <ul className="space-y-2.5">
                  {cat.items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        {/* Why Edu Alt Tech */}
        <MotionDiv initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
              <Award className="w-4 h-4" />
              Why Edu Alt Tech?
            </div>
            <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">One Platform. Multiple Opportunities.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Learn Future Skills",
              "Build Real Projects",
              "Industry Mentorship",
              "Flexible Learning",
              "School Technology Solutions",
              "Certification Programs",
            ].map((item, idx) => (
              <MotionDiv
                key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
                className="flex items-center gap-3 p-5 bg-white border border-slate-200 rounded-[1rem] sm:rounded-[1.25rem] hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="font-bold text-slate-900 text-sm sm:text-base">{item}</span>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        {/* How It Works */}
        <MotionDiv initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px] mb-6">
              <MapPin className="w-4 h-4" />
              How It Works
            </div>
            <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Your Path to Success</h2>
          </div>

          <div className="mb-16">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-10 text-center">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 inline mr-2 text-emerald-500" />
              For Students
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <MapPin className="w-6 h-6" />, title: "Choose a Learning Path", desc: "Pick from our curated courses and programs" },
                { icon: <Play className="w-6 h-6" />, title: "Learn Through Live & Recorded Classes", desc: "Study at your own pace with expert guidance" },
                { icon: <Hammer className="w-6 h-6" />, title: "Complete Projects", desc: "Apply your skills with real-world projects" },
                { icon: <Award className="w-6 h-6" />, title: "Earn Certificates", desc: "Get certified and advance your career" },
              ].map((item, idx) => (
                <MotionDiv
                  key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/20">{item.icon}</div>
                  {idx < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[calc(100%-80px)] h-px bg-emerald-200" />}
                  <h4 className="text-sm sm:text-lg font-black text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-500">{item.desc}</p>
                </MotionDiv>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-10 text-center">
              <Globe className="w-6 h-6 sm:w-7 sm:h-7 inline mr-2 text-emerald-500" />
              For Schools
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <MessageCircle className="w-6 h-6" />, title: "Consultation", desc: "We understand your school's unique needs" },
                { icon: <Code2 className="w-6 h-6" />, title: "Solution Development", desc: "Custom solutions tailored to your institution" },
                { icon: <Rocket className="w-6 h-6" />, title: "Deployment & Training", desc: "Implement and train your staff for adoption" },
                { icon: <RefreshCw className="w-6 h-6" />, title: "Continuous Support", desc: "Ongoing support and continuous improvement" },
              ].map((item, idx) => (
                <MotionDiv
                  key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 bg-indigo-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-indigo-500/20">{item.icon}</div>
                  {idx < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[calc(100%-80px)] h-px bg-indigo-200" />}
                  <h4 className="text-sm sm:text-lg font-black text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-500">{item.desc}</p>
                </MotionDiv>
              ))}
            </div>
          </div>
        </MotionDiv>

        {/* Team */}
        <MotionDiv initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[4rem]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-emerald-200/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-indigo-200/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-teal-200/40" />
            <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-indigo-500/8 blur-[80px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-emerald-500/8 blur-[80px] rounded-full" />
          </div>

          <div className="text-center mb-16 relative z-10">
            <MotionDiv initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 !text-indigo-700 font-bold uppercase tracking-widest text-[10px] mb-6">
              <Users className="w-4 h-4" />
              Our People
            </MotionDiv>
            <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-emerald-500 to-teal-500">Team</span>
            </h2>
            <p className="text-sm sm:text-lg text-slate-500 max-w-xl mx-auto">The innovators, builders, and creators shaping the future of Edu Alt Tech</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {TEAM.map((member, idx) => (
              <TeamCard key={idx} idx={idx} member={member} />
            ))}
          </div>
        </MotionDiv>

        {/* Supporting Team */}
        <MotionDiv initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-orange-500/5 rounded-[4rem] blur-3xl pointer-events-none" />
          <div className="text-center mb-16 relative z-10">
            <MotionDiv initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 !text-amber-700 font-bold uppercase tracking-widest text-[10px] mb-6">
              <Users className="w-4 h-4" />
              Supporting Team
            </MotionDiv>
            <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
              Behind the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">Scenes</span>
            </h2>
            <p className="text-sm sm:text-lg text-slate-500">The dedicated folks who keep things running smoothly</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            {SUPPORTING_TEAM.map((member, idx) => (
              <div key={idx} className="w-full sm:w-80">
                <TeamCard idx={idx} member={member} />
              </div>
            ))}
          </div>
        </MotionDiv>

        {/* CTA */}
        <MotionDiv initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-[2rem] sm:rounded-[3rem] p-10 sm:p-14 lg:p-24 text-center shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          <div className="relative z-10">
            <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400 mx-auto mb-8" />
            <h2 className="text-[2rem] sm:text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Ready to Transform Education?</h2>
            <p className="text-base sm:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium">
              Whether you're a student looking to learn future skills or a school seeking digital transformation, Edu Alt Tech can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/courses" className="px-8 sm:px-10 py-4 sm:py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/30 hover:-translate-y-1 text-sm sm:text-base">
                Explore Courses
              </Link>
              <Link to="/contact" className="px-8 sm:px-10 py-4 sm:py-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold transition-all backdrop-blur-sm hover:-translate-y-1 text-sm sm:text-base">
                Partner With Us
              </Link>
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

/* ── Team Card ─────────────────────────────────────────────── */
const cardAccents = [
  { from: 'from-emerald-500', to: 'to-teal-400', glow: 'shadow-emerald-500/20', ring: 'ring-emerald-400/60', light: 'bg-emerald-50 !text-emerald-700', dot: 'bg-emerald-400' },
  { from: 'from-blue-500', to: 'to-indigo-400', glow: 'shadow-blue-500/20', ring: 'ring-blue-400/60', light: 'bg-blue-50 !text-blue-700', dot: 'bg-blue-400' },
  { from: 'from-violet-500', to: 'to-purple-400', glow: 'shadow-violet-500/20', ring: 'ring-violet-400/60', light: 'bg-violet-50 !text-violet-700', dot: 'bg-violet-400' },
  { from: 'from-amber-500', to: 'to-orange-400', glow: 'shadow-amber-500/20', ring: 'ring-amber-400/60', light: 'bg-amber-50 !text-amber-700', dot: 'bg-amber-400' },
  { from: 'from-rose-500', to: 'to-pink-400', glow: 'shadow-rose-500/20', ring: 'ring-rose-400/60', light: 'bg-rose-50 !text-rose-700', dot: 'bg-rose-400' },
  { from: 'from-cyan-500', to: 'to-sky-400', glow: 'shadow-cyan-500/20', ring: 'ring-cyan-400/60', light: 'bg-cyan-50 !text-cyan-700', dot: 'bg-cyan-400' },
  { from: 'from-fuchsia-500', to: 'to-pink-400', glow: 'shadow-fuchsia-500/20', ring: 'ring-fuchsia-400/60', light: 'bg-fuchsia-50 !text-fuchsia-700', dot: 'bg-fuchsia-400' },
  { from: 'from-lime-500', to: 'to-emerald-400', glow: 'shadow-lime-500/20', ring: 'ring-lime-400/60', light: 'bg-lime-50 !text-lime-700', dot: 'bg-lime-400' },
];

function TeamCard({ member, idx }: { member: typeof TEAM[0]; idx: number }) {
  const [imgError, setImgError] = React.useState(false);
  const accent = cardAccents[idx % cardAccents.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: idx * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative bg-slate-900 rounded-[1.75rem] overflow-hidden shadow-2xl ${accent.glow} flex flex-col h-full`}
    >
      {/* Diagonal gradient background decoration */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accent.from} ${accent.to} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${accent.from} ${accent.to} opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4`} />

      {/* Index number watermark */}
      <div className={`absolute top-4 left-4 text-[4rem] font-black leading-none bg-gradient-to-br ${accent.from} ${accent.to} bg-clip-text text-transparent opacity-10 select-none`}>
        {String(idx + 1).padStart(2, '0')}
      </div>

      <div className="relative z-10 p-6 flex flex-col items-center text-center flex-1">
        {/* Avatar with glowing ring */}
        <div className={`relative w-24 h-24 sm:w-28 sm:h-28 mb-5 mt-2 flex-shrink-0`}>
          {/* Glow ring */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${accent.from} ${accent.to} blur-md opacity-50 scale-110`} />
          <div className={`relative w-full h-full rounded-full overflow-hidden ring-2 ${accent.ring} bg-slate-800`}>
            {member.image && !imgError ? (
              <img src={member.image} loading="lazy" decoding="async" alt={member.name}
                className="w-full h-full object-cover" onError={() => setImgError(true)} />
            ) : (
              <div className={`w-full h-full flex items-center justify-center font-black text-2xl bg-gradient-to-br ${accent.from} ${accent.to} text-white`}>
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            )}
          </div>
          {/* Online dot */}
          <span className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 ${accent.dot} rounded-full border-2 border-slate-900`} />
        </div>

        {/* Name */}
        <h3 className="text-sm sm:text-base font-black text-white mb-1.5 tracking-tight leading-snug px-1">{member.name}</h3>

        {/* Role badge */}
        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${accent.light} mb-4`}>
          {member.role}
        </span>

        {/* Bio */}
        <p className="text-xs text-slate-400 leading-relaxed flex-1 mb-5">{member.bio}</p>

        {/* Social links */}
        {(member.email || member.linkedin) && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-700/60 w-full">
            {member.email && (
              <a href={`mailto:${member.email}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:!text-white transition-all text-xs font-semibold`}>
                <Mail className="w-3.5 h-3.5 flex-shrink-0" /> Email
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noreferrer"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-400 hover:!text-white transition-all text-xs font-semibold`}>
                <Linkedin className="w-3.5 h-3.5 flex-shrink-0" /> LinkedIn
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default About;
