
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, LogOut, User, Layout, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
// Use type-only import for User and standard modular imports for functions
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LINKS } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Listen for auth state changes using the modular API
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const navLinks = [
    { name: 'About', path: '/#about' },
    { name: 'Peer Education', path: '/peer-education' },
    { name: 'Free AI Courses', path: '/free-courses' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-6xl z-50 transition-all duration-300 rounded-2xl md:rounded-full ${scrolled ? 'glass-dark border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-3 px-6' : 'bg-transparent py-5 px-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/edulogo.png" 
            alt="Edu Alt Tech Logo" 
            className="w-10 h-10 md:w-14 md:h-14 object-contain transform group-hover:scale-105 transition-transform" 
          />
          <span className="font-display font-bold text-lg md:text-xl tracking-widest text-white uppercase">Edu Alt Tech</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-sm font-display tracking-widest uppercase text-slate-300 hover:text-neon-cyan transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-neon-cyan transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-display tracking-widest uppercase text-slate-300 hover:text-neon-cyan transition-colors"
                >
                  <Layout className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center gap-2 text-sm font-display tracking-widest uppercase text-slate-300 border-l border-white/20 pl-4">
                  <User className="w-4 h-4 text-neon-cyan" />
                  <span className="max-w-[100px] truncate">{user.displayName || 'Learner'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-display tracking-widest uppercase text-slate-400 hover:text-neon-dim transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-display tracking-widest uppercase text-slate-300 hover:text-neon-cyan transition-colors">
                  Log in
                </Link>
                <Link 
                  to="/peer-education" 
                  className="px-6 py-2.5 bg-gradient-to-r from-neon-cyan to-neon-dim text-neon-dark text-sm font-display font-bold uppercase tracking-widest rounded-full hover:brightness-110 transition-all flex items-center gap-1 group shadow-[0_0_15px_rgba(0,238,252,0.3)] hover:shadow-[0_0_25px_rgba(0,238,252,0.5)]"
                >
                  Join Us
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-800 dark:text-white">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-[110%] left-0 right-0 glass-dark border border-white/10 p-6 flex flex-col gap-6 shadow-2xl rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-3xl">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="text-lg font-display uppercase tracking-widest text-slate-300 hover:text-neon-cyan">
              {link.name}
            </Link>
          ))}
          <hr className="border-white/10" />
          <div className="flex flex-col gap-4">
            {user ? (
              <div className="space-y-4">
                <Link to="/dashboard" className="flex items-center gap-3 text-lg font-display uppercase tracking-widest text-slate-300">
                  <Layout className="w-5 h-5 text-neon-cyan" /> Dashboard
                </Link>
                <div className="flex items-center gap-3 text-lg font-display uppercase tracking-widest text-slate-300">
                  <User className="w-5 h-5 text-neon-cyan" /> {user.displayName || 'Learner'}
                </div>
                <button onClick={handleLogout} className="w-full py-4 glass text-slate-300 font-display font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border border-neon-dim/30 hover:bg-neon-dim/10">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-lg font-display uppercase tracking-widest text-slate-300">Login</Link>
                <Link to="/peer-education" className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-dim text-neon-dark text-center font-display font-bold tracking-widest uppercase rounded-xl">
                  Join Us
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;