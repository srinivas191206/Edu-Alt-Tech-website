import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'text';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20',
  secondary: 'bg-surface text-text hover:bg-surface-2 border border-border',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-2',
  text: 'bg-transparent text-primary hover:underline underline-offset-2',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
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
  loading?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md',
  to, href, onClick, className = '',
  disabled, loading, type = 'button',
  icon, iconPosition = 'left',
}) => {
  const base = `inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!loading && icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  );

  if (to) {
    return <Link to={to} className={base}>{content}</Link>;
  }

  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" className={base}>{content}</a>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={base}>
      {content}
    </button>
  );
};

export default Button;
