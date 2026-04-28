'use client';

import { Award, Crown, Rocket, Star, Trophy } from 'lucide-react';
import type { Portfolio } from '@/lib/types';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

const ICONS: Record<string, React.ReactNode> = {
  star: <Star className="h-4 w-4" />,
  trophy: <Trophy className="h-4 w-4" />,
  rocket: <Rocket className="h-4 w-4" />,
  crown: <Crown className="h-4 w-4" />,
  award: <Award className="h-4 w-4" />,
};

export function Achievements({ data }: { data: Portfolio }) {
  if (!data.achievements?.length) return null;
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Achievements"
          title={
            <>
              Milestones along the <span className="text-gradient-gold">way</span>
            </>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.achievements.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.05}>
              <div className="card-luxe h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-xl bg-gold-400/10 border border-gold-400/25 text-gold-300 flex items-center justify-center">
                    {ICONS[a.icon || 'award'] || ICONS.award}
                  </div>
                  <div className="font-display text-lg text-white">{a.title}</div>
                </div>
                <p className="text-sm text-white/65 leading-relaxed">{a.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
