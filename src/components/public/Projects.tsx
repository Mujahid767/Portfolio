'use client';

import { ArrowUpRight, Globe, Star } from 'lucide-react';
import type { Portfolio, Project } from '@/lib/types';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { motion } from 'framer-motion';

export function Projects({ data }: { data: Portfolio }) {
  const featured = data.projects.filter((p) => p.highlight);
  const others = data.projects.filter((p) => !p.highlight);

  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Selected Work"
          title={
            <>
              Things I have <span className="text-gradient-gold">built</span>
            </>
          }
          description="A selection of platforms and AI experiments — from production projects to deep technical builds."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <FeaturedCard project={p} />
            </Reveal>
          ))}
        </div>

        {others.length > 0 && (
          <>
            <div className="mt-16 mb-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
              <span className="eyebrow">More</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {others.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <SmallCard project={p} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noreferrer"
      className="group relative block card-luxe overflow-hidden h-full"
      whileHover={{ scale: 1.005 }}
    >
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold-300/20 to-gold-700/20 border border-gold-400/30 flex items-center justify-center text-gold-300">
            <Star className="h-4 w-4 fill-gold-300" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-gold-300/80">Featured</div>
            <div className="text-xs text-white/40">{project.year} · {project.role}</div>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-white/40 group-hover:text-gold-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
      </div>

      <h3 className="mt-6 font-display text-2xl sm:text-3xl text-white leading-tight">
        {project.title}
      </h3>
      <p className="mt-3 text-white/65 leading-relaxed">{project.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span key={t} className="chip text-[11px]">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-xs text-white/50 group-hover:text-gold-300 transition-colors">
        <Globe className="h-3.5 w-3.5" />
        <span className="truncate max-w-[260px]">{prettyUrl(project.link)}</span>
      </div>
    </motion.a>
  );
}

function SmallCard({ project }: { project: Project }) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noreferrer"
      className="group block card-luxe h-full"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-display text-lg text-white">{project.title}</h4>
        <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-gold-300 transition-colors" />
      </div>
      <p className="mt-2 text-sm text-white/60 line-clamp-3">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 4).map((t) => (
          <span key={t} className="chip text-[10px] !py-0.5">
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

function prettyUrl(url: string) {
  try {
    const u = new URL(url);
    return u.host + (u.pathname !== '/' ? u.pathname : '');
  } catch {
    return url;
  }
}
