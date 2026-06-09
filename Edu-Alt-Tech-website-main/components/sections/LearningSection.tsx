import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, Video, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const cards = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    color: 'emerald',
    badge: 'Alternative Courses',
    title: 'Alternative Courses',
    desc: 'We offer future-focused alternative learning programs that go beyond traditional academics. Students can explore entrepreneurship, AI, technology innovation, design thinking, financial literacy, and real-world problem solving.',
    points: [
      'Innovation & Startup Thinking',
      'AI & Technology Foundations',
      'Real World Skills',
      'Creative Learning Paths',
    ],
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    checkColor: 'text-emerald-500',
    border: 'hover:border-emerald-200 dark:hover:border-emerald-800',
    bar: 'bg-emerald-500',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    color: 'blue',
    badge: 'Subjective Courses',
    title: 'Subjective Courses',
    desc: 'Structured subject-based courses aligned with CBSE, ICSE, and State Board curriculums. Students can strengthen their fundamentals through deep topic-level learning and mastery tracking.',
    points: [
      'Mathematics',
      'Science',
      'Computer Science',
      'Concept-Based Learning',
    ],
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50 dark:bg-blue-900/30',
    badgeText: 'text-blue-600 dark:text-blue-400',
    checkColor: 'text-blue-500',
    border: 'hover:border-blue-200 dark:hover:border-blue-800',
    bar: 'bg-blue-500',
  },
  {
    icon: <Video className="w-6 h-6" />,
    color: 'purple',
    badge: 'Live Classes',
    title: 'Live Classes',
    desc: 'Interactive live sessions led by expert educators where students can learn, ask questions, collaborate, and receive mentorship in real time.',
    points: [
      'Live Interactive Sessions',
      'Google Meet / Integrated Classroom',
      'Doubt Solving',
      'Recorded Class Access',
    ],
    iconBg: 'bg-purple-50 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-50 dark:bg-purple-900/30',
    badgeText: 'text-purple-600 dark:text-purple-400',
    checkColor: 'text-purple-500',
    border: 'hover:border-purple-200 dark:hover:border-purple-800',
    bar: 'bg-purple-500',
  },
];

const LearningSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-emerald-500 font-semibold tracking-wide uppercase text-sm mb-3">
            Learning Ecosystem
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Beyond School Systems –{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">
              Learning That Goes Further
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Edu Alt Tech is not only a digital operating system for schools, but also a learning ecosystem offering alternative education programs, subject-focused courses, and interactive live classes designed for the next generation of learners.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm ${card.border} hover:shadow-xl transition-all duration-300 p-8 flex flex-col gap-6`}
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 ${card.iconBg} ${card.iconColor} rounded-2xl flex items-center justify-center`}>
                  {card.icon}
                </div>
                <span className={`px-3 py-1 ${card.badgeBg} ${card.badgeText} text-xs font-bold rounded-full`}>
                  {card.badge}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{card.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{card.desc}</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 dark:bg-slate-700" />

              {/* Feature points */}
              <ul className="space-y-2.5">
                {card.points.map(point => (
                  <li key={point} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <Check className={`w-4 h-4 flex-shrink-0 ${card.checkColor}`} />
                    {point}
                  </li>
                ))}
              </ul>

              {/* Bottom accent bar */}
              <div className={`h-1 w-12 ${card.bar} rounded-full mt-auto`} />
            </motion.div>
          ))}
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link
            to="/courses"
            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            Explore Courses <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/live-classes"
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Video className="w-4 h-4 text-emerald-500" /> Join Live Classes
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default LearningSection;
