import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, MessageCircle, GraduationCap, Mail, Phone, MapPin, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LINKS } from '../constants';

const FAQ_DATA = [
  { q: 'What is Edu Alt Tech?', a: 'Edu Alt Tech is a skill-based learning platform that connects students, mentors, educators, and schools through practical, interactive, and career-focused learning experiences.' },
  { q: 'Who can use Edu Alt Tech?', a: 'Anyone can use Edu Alt Tech, including school students, college students, teachers, parents, professionals, schools, and educational institutions.' },
  { q: 'Is Edu Alt Tech free to use?', a: 'Many resources and features are free. Some premium courses, workshops, and mentorship programs may require a fee.' },
  { q: 'What courses do you offer?', a: 'We offer courses in AI, programming, data science, cybersecurity, digital marketing, design, communication, entrepreneurship, finance, creative arts, and many other practical skills.' },
  { q: 'Can beginners join?', a: 'Yes. Our courses are designed for beginners as well as intermediate and advanced learners.' },
  { q: 'Will I receive a certificate?', a: 'Yes. Eligible courses and workshops include certificates upon successful completion.' },
  { q: 'Can I learn at my own pace?', a: 'Yes. Depending on the course, you can learn through self-paced content, live sessions, or a combination of both.' },
  { q: 'Can students become instructors?', a: 'Yes. Skilled students can apply to become peer educators after meeting our quality standards.' },
  { q: 'How do I enroll in a course?', a: 'Simply create an account, browse available courses, and enroll in the one that matches your interests.' },
  { q: 'How can schools partner with Edu Alt Tech?', a: 'Schools can contact our team to organize workshops, skill-development programs, career guidance sessions, and technology awareness initiatives.' },
  { q: 'Is my personal information secure?', a: 'Yes. We take user privacy seriously and use industry-standard security practices to protect your information.' },
  { q: 'Can I access Edu Alt Tech on my phone?', a: 'Yes. Edu Alt Tech is designed to work on desktops, tablets, and mobile devices.' },
  { q: 'How can I contact support?', a: 'You can reach our support team through the Contact Us page or by emailing us. We aim to respond as quickly as possible.' },
  { q: 'How can I become a mentor?', a: 'If you have expertise in a particular field, you can apply through our Mentor Registration page. Our team will review your application and get in touch.' },
  { q: 'Why should I choose Edu Alt Tech?', a: 'Edu Alt Tech focuses on practical, project-based learning, mentorship, career readiness, and real-world skills. Our goal is to help learners build confidence, gain experience, and prepare for future opportunities.' },
];

function FooterFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_DATA.map((faq, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-3 p-3.5 text-left"
            >
              <span className="text-xs font-semibold text-slate-300 leading-snug flex-1">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-3.5 pb-3.5 text-xs text-slate-400 leading-relaxed border-t border-white/10 pt-3">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

const Footer: React.FC = () => {
  return (
  <footer className="bg-bg-secondary border-t border-border text-text-secondary pt-20 pb-10 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
  <div className="lg:col-span-2">
  <Link to="/" className="flex items-center gap-2 group mb-6">
  <div className="w-12 h-12 overflow-hidden rounded-xl">
  <img src="/logo.png" loading="lazy" decoding="async" alt="EduAltTech Logo" className="w-full h-full object-cover"
  onError={(e) => {
  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23ddd" width="100" height="100"/><text fill="%23999" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14">LOGO</text></svg>';
  }}
  />
  </div>
  <div>
  <span className="text-xl font-bold text-heading tracking-tight">EduAltTech</span>
  <span className="text-[10px] font-semibold text-emerald-600 tracking-widest uppercase block">Education Technology Partner</span>
  </div>
  </Link>
  <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-md">
  Empowering schools with modern technology solutions — from websites and apps to AI tools and ERP systems. We help educational institutions thrive in the digital age.
  </p>
  <div className="flex gap-4">
  <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface text-text-secondary border border-border rounded-full hover:bg-primary hover:text-white transition-colors">
  <Instagram className="w-5 h-5" />
  </a>
  <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface text-text-secondary border border-border rounded-full hover:bg-primary hover:text-white transition-colors">
  <Linkedin className="w-5 h-5" />
  </a>
  <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface text-text-secondary border border-border rounded-full hover:bg-primary hover:text-white transition-colors">
  <MessageCircle className="w-5 h-5" />
  </a>
  </div>
  </div>

  <div>
  <h4 className="font-bold mb-6 text-heading tracking-wide">Services</h4>
  <ul className="space-y-4 text-sm text-text-secondary">
  <li><Link to="/services" className="hover:text-primary transition-colors">Web Development</Link></li>
  <li><Link to="/services" className="hover:text-primary transition-colors">Mobile Apps</Link></li>
  <li><Link to="/services" className="hover:text-primary transition-colors">School ERP</Link></li>
  <li><Link to="/services" className="hover:text-primary transition-colors">AI Solutions</Link></li>
  <li><Link to="/services" className="hover:text-primary transition-colors">Teacher Training</Link></li>
  </ul>
  </div>

  <div>
  <h4 className="font-bold mb-6 text-heading tracking-wide">Quick Links</h4>
  <ul className="space-y-4 text-sm text-text-secondary">
  <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
  <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
  <li><Link to="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
  <li><Link to="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
  <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
  <li><Link to="/" className="hover:text-primary transition-colors">FAQ</Link></li>
  </ul>
  </div>

  <div>
  <h4 className="font-bold mb-6 text-heading tracking-wide">Contact</h4>
  <ul className="space-y-4 text-sm text-text-secondary">
  <li className="flex items-start gap-3">
  <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
  <span>info@edualttech.com</span>
  </li>
  <li className="flex items-start gap-3">
  <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
  <span>+91 9121505879</span>
  </li>
  <li className="flex items-start gap-3">
  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
  <span>India</span>
  </li>
  </ul>
  </div>
  </div>

  {/* FAQ Section */}
  <div className="border-t border-border pt-12 mb-12">
    <div className="flex items-center gap-2 mb-8">
      <HelpCircle className="w-5 h-5 text-emerald-500" />
      <h3 className="text-lg font-bold text-heading">Frequently Asked Questions</h3>
    </div>
    <div className="max-w-4xl">
      <FooterFAQ />
    </div>
  </div>

  <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
  <p className="text-text-muted text-xs">
  &copy; {new Date().getFullYear()} EduAltTech. All rights reserved.
  </p>
  <p className="text-text-muted text-xs">
  Your Complete Education Technology Partner
  </p>
  </div>
  </div>
  </footer>
  );
};

export default Footer;
