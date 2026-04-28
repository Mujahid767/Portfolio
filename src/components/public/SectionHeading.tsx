import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center mx-auto max-w-2xl' : ''}`}>
      <Reveal>
        <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500/70" />
          <span className="eyebrow">{eyebrow}</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500/70" />
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="section-title mt-5 text-balance">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-white/60 text-base sm:text-lg leading-relaxed text-balance">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
