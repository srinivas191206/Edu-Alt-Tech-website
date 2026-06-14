import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, ArrowRight, GraduationCap, Mail, Phone, MapPin } from 'lucide-react';
import { LINKS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-6">
              <div className="w-10 h-10 overflow-hidden rounded-xl">
                <img src="/edulogo.png" alt="EduAltTech Logo" className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23ddd" width="100" height="100"/><text fill="%23999" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14">LOGO</text></svg>';
                  }}
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">EduAltTech</span>
                <span className="text-[10px] font-semibold text-emerald-400 tracking-widest uppercase block">School Technology Partner</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
              Empowering schools with modern technology solutions — from websites and apps to AI tools and ERP systems. We help educational institutions thrive in the digital age.
            </p>
            <div className="flex gap-4">
              <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-emerald-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-emerald-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-200 tracking-wide">Services</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Web Development</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Mobile Apps</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">School ERP</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">AI Solutions</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Teacher Training</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-200 tracking-wide">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/resources" className="hover:text-emerald-400 transition-colors">Resources</Link></li>
              <li><Link to="/courses" className="hover:text-emerald-400 transition-colors">Courses</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-200 tracking-wide">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>contact@edualttech.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>+91 123 456 7890</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} EduAltTech. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs">
            Your School Technology Partner
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
