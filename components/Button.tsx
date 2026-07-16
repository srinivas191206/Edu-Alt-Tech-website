import React from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/20',
  secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm',
  ghost: 'bg-white/80 backdrop-blur-md text-slate-900 :text-white hover:bg-slate-100 :hover:bg-slate-800 border border-slate-200/80 :border-slate-700',
  dark: 'bg-slate-950 :bg-slate-800 hover:bg-emerald-600 :hover:bg-emerald-600 text-white shadow-xl shadow-slate-950/10',
};

const sizes: Record<Size, string> = {
  sm: 'px-5 py-2.5 text-sm rounded-xl',
  md: 'px-8 py-4 rounded-2xl',
  lg: 'px-10 py-5 rounded-2xl',
};

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', to, href: _href, onClick, className = '', disabled, type = 'button' }) => {
  const base = `inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 hover:-translate-y-1 active:scale-95 ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return <Link to={to} className={base}>{children}</Link>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
};

export default Button;
