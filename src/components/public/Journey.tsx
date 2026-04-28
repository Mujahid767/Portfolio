'use client';

import { Briefcase, GraduationCap } from 'lucide-react';
import type { Portfolio } from '@/lib/types';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

export function Journey({ data }: { data: Portfolio }) {
  return (
    <section id="journey" className="relative py-24 sm:py-32">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Journey"
          title={
            <>
              Experience &amp; <span className="text-gradient-gold">Education</span>
            </>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-xl bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-gold-300">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="font-display text-xl">Experience</div>
            </div>
            <Timeline
              items={data.experiences.map((e) => ({
                id: e.id,
                title: e.title,
                org: e.org,
                period: e.period,
                description: e.description,
              }))}
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-xl bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-gold-300">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="font-display text-xl">Education</div>
            </div>
            <Timeline
              items={data.education.map((e) => ({
                id: e.id,
                title: e.degree,
                org: e.school,
                period: e.period,
                description: e.detail || '',
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Timeline({
  items,
}: {
  items: { id: string; title: string; org: string; period: string; description: string }[];
}) {
  return (
    <ol className="relative border-l border-white/10 ml-1.5 space-y-6">
      {items.map((it, i) => (
        <Reveal as="li" key={it.id} delay={i * 0.05} className="pl-6 relative">
          <span className="absolute -left-[7px] top-2 h-3 w-3 rounded-full bg-gradient-to-br from-gold-300 to-gold-600 ring-4 ring-ink-950" />
          <div className="card-luxe">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-display text-lg text-white">{it.title}</div>
              <span className="text-[11px] font-mono text-gold-300/80">{it.period}</span>
            </div>
            <div className="text-sm text-gold-200/80 mt-0.5">{it.org}</div>
            {it.description && (
              <p className="mt-3 text-sm text-white/65 leading-relaxed">{it.description}</p>
            )}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
