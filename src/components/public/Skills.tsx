'use client';

import type { Portfolio } from '@/lib/types';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

export function Skills({ data }: { data: Portfolio }) {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Skills"
          title={
            <>
              The <span className="text-gradient-gold">tools & talents</span> I work with
            </>
          }
          description="A curated stack focused on shipping intelligent, production-grade applications."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.skillCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.05}>
              <div className="card-luxe h-full">
                <div className="flex items-center justify-between mb-5">
                  <div className="font-display text-xl text-white">{cat.title}</div>
                  <span className="text-[11px] font-mono text-gold-400/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <span key={s} className="chip hover:border-gold-400/40 hover:text-gold-200 transition-all">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
