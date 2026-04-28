'use client';

import { MapPin, Code2, Brain, Database } from 'lucide-react';
import type { Portfolio } from '@/lib/types';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

export function About({ data }: { data: Portfolio }) {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="About"
          title={
            <>
              A glimpse into{' '}
              <span className="text-gradient-gold">who I am</span> and how I build.
            </>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <div className="card-luxe">
              <p className="font-display text-xl sm:text-2xl italic text-gradient-soft leading-snug">
                &ldquo;{data.about.intro}&rdquo;
              </p>
              <div className="divider-gold my-6" />
              <div className="space-y-4 text-white/70 leading-relaxed">
                {data.about.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <div className="chip">
                  <MapPin className="h-3.5 w-3.5 text-gold-300" />
                  {data.about.location}
                </div>
                <div className="chip-gold">{data.about.focus}</div>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            <Reveal delay={0.1}>
              <Pillar
                icon={<Brain className="h-5 w-5" />}
                title="AI / RAG"
                desc="LLM apps, embeddings, retrieval systems and agents."
              />
            </Reveal>
            <Reveal delay={0.15}>
              <Pillar
                icon={<Code2 className="h-5 w-5" />}
                title="Full-Stack"
                desc="Next.js, TypeScript and modern web platforms."
              />
            </Reveal>
            <Reveal delay={0.2}>
              <Pillar
                icon={<Database className="h-5 w-5" />}
                title="Databases"
                desc="PostgreSQL, schema design and query tuning."
              />
            </Reveal>
            <Reveal delay={0.25}>
              <Pillar
                icon={<Cpu />}
                title="CS Foundations"
                desc="DSA, OOP and competitive programming."
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Cpu() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  );
}

function Pillar({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card-luxe h-full">
      <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gold-400/10 border border-gold-400/20 text-gold-300 mb-4">
        {icon}
      </div>
      <div className="font-display text-lg text-white">{title}</div>
      <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}
