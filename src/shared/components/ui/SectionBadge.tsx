import { memo, type FC, type ReactNode } from 'react';

interface SectionBadgeProps {
  icon: ReactNode;
  label: string;
}

export const SectionBadge: FC<SectionBadgeProps> = memo(({ icon, label }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold uppercase tracking-widest text-[10px]">
    {icon}
    {label}
  </div>
));

SectionBadge.displayName = 'SectionBadge';
