
import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Zap, Brain, ShieldCheck, Clock, Users } from 'lucide-react';
import { LINKS, HOW_IT_WORKS, COMPARISON } from '../constants';
import { Link } from 'react-router-dom';

const Counter: React.FC<{ target: number; label: string; suffix?: string }> = ({ target, label, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="text-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
      <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
        {count}{suffix}
      </div>
      <div className="text-slate-500 font-medium text-sm md:text-base uppercase tracking-wider">{label}</div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-[#90EE90] rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-[20%] w-[50%] h-[50%] bg-slate-100 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-8 animate-bounce">
            <Zap className="w-3 h-3" /> Solving the Execution Gap
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Education That Builds <span className="text-emerald-500">Execution</span>, Not Just Enrollment.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Peer-to-peer learning. Mentor accountability. Structured systems. Human-first education.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/enroll" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group text-lg"
            >
              Enroll Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href={LINKS.whatsapp} 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:border-[#90EE90] hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-lg shadow-sm"
            >
              Join WhatsApp Community
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white border-y border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">What is Edu Alt Tech?</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Edu Alt Tech is a peer-driven alternative education ecosystem focused on accountability, structured learning, and execution consistency.
              </p>
              
              <div className="space-y-6">
                <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                  <h3 className="text-xl font-bold text-emerald-900 mb-3">The Execution Gap</h3>
                  <p className="text-emerald-800 leading-relaxed">
                    Millions of students know what to study but fail to execute consistently. We bridge this gap with human-centric systems.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Weekly study plans",
                    "Peer teaching model",
                    "Mentor-led accountability",
                    "Structured reminders"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="font-semibold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-[#90EE90] overflow-hidden transform rotate-3 scale-95 opacity-20 absolute inset-0"></div>
              <img 
                src="https://picsum.photos/seed/edu/800/800" 
                alt="Students studying" 
                className="relative z-10 w-full aspect-square object-cover rounded-[3rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Our 4-pillared approach to making you an elite executor.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((card, idx) => (
              <div key={idx} className="group p-8 bg-white rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#90EE90] transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traction Section */}
      <section className="py-24 bg-emerald-500 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <Counter target={50} label="Active Students" suffix="+" />
            <Counter target={25} label="Peer Teachers" suffix="+" />
            <Counter target={3} label="Expert Mentors" />
            <div className="flex flex-col justify-center items-center text-center p-6 bg-white/20 rounded-3xl backdrop-blur-md border border-white/30 text-white">
              <div className="text-lg font-bold mb-2">Validated Model</div>
              <div className="text-sm opacity-90 uppercase tracking-widest font-semibold">WhatsApp-First Validation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Why We Are Different</h2>
            <p className="text-slate-500 text-lg">Traditional EdTech sells content. We sell results.</p>
          </div>
          
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-6 font-bold text-slate-400 uppercase text-xs tracking-widest border-b border-slate-200">Category</th>
                  <th className="p-6 font-bold text-slate-900 border-b border-slate-200">Traditional EdTech</th>
                  <th className="p-6 font-bold text-emerald-600 bg-emerald-50/50 border-b border-emerald-100">Edu Alt Tech</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-6 border-b border-slate-100 text-sm font-semibold text-slate-500">{row.feature}</td>
                    <td className="p-6 border-b border-slate-100 text-slate-600">{row.traditional}</td>
                    <td className="p-6 border-b border-slate-100 font-bold text-emerald-700 bg-emerald-50/30">{row.altTech}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section id="future" className="py-24 bg-slate-900 text-white px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-emerald-500/10 blur-[120px] rounded-full -mr-[20%]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                Coming Soon
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                “AI will assist mentors, not replace them.”
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                We're building a future where smart algorithms handle the logistics so humans can focus on deep transformation.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: <Clock className="w-5 h-5" />, title: "Study plan generation" },
                  { icon: <ShieldCheck className="w-5 h-5" />, title: "Risk alerts" },
                  { icon: <Users className="w-5 h-5" />, title: "Progress summaries" },
                  { icon: <Brain className="w-5 h-5" />, title: "Smart reminders" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-emerald-400">{item.icon}</div>
                    <span className="font-semibold text-slate-200">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="w-full aspect-video rounded-3xl bg-emerald-500/20 animate-pulse flex items-center justify-center border border-white/10 backdrop-blur-3xl">
                <Brain className="w-24 h-24 text-emerald-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto p-12 bg-[#90EE90] rounded-[3rem] text-center shadow-2xl shadow-emerald-200/50">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">Ready to break the execution gap?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/enroll" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:scale-105 transition-all text-lg shadow-lg">
              Start Your Journey
            </Link>
            <a href={LINKS.instagram} target="_blank" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-all text-lg border border-slate-200">
              Follow us on Instagram
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
