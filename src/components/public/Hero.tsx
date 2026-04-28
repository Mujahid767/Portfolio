'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Github, Linkedin, Mail, Sparkles, Trophy } from 'lucide-react';
import type { Portfolio } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';

function useTypewriter(words: string[], speed = 80, pause = 1600) {
  const [text, setText] = useState('');
  const [i, setI] = useState(0);
  const [forward, setForward] = useState(true);

  useEffect(() => {
    if (!words.length) return;
    const word = words[i % words.length];
    let timer: any;
    if (forward) {
      if (text.length < word.length) {
        timer = setTimeout(() => setText(word.slice(0, text.length + 1)), speed);
      } else {
        timer = setTimeout(() => setForward(false), pause);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(word.slice(0, text.length - 1)), speed / 2);
      } else {
        setForward(true);
        setI((v) => v + 1);
      }
    }
    return () => clearTimeout(timer);
  }, [text, forward, i, words, speed, pause]);

  return text;
}

export function Hero({ data }: { data: Portfolio }) {
  const typed = useTypewriter(data.hero.titles);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative pt-36 pb-20 sm:pt-44 sm:pb-32">
      <div className="absolute inset-0 -z-10 grid-bg mask-fade-b" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[720px] bg-radial-gold pointer-events-none" />

      <div className="container-luxe">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="lg:col-span-8 order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-7"
            >
              <div className="flex items-center gap-3">
                <span className="eyebrow">
                  <Sparkles className="h-3.5 w-3.5" />
                  {data.about.focus}
                </span>
                {data.hero.available && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-[11px] font-medium text-emerald-300">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inset-0 rounded-full bg-emerald-400/70 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Open to Opportunities
                  </span>
                )}
              </div>

              <div>
                <p className="font-display italic text-white/60 text-lg sm:text-xl mb-3">
                  {data.hero.greeting}
                </p>
                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.35rem] leading-[1.02] font-semibold text-balance">
                  <span className="text-gradient-soft">{data.hero.name.split(' ')[0]}</span>{' '}
                  <span className="text-gradient-gold">
                    {data.hero.name.split(' ').slice(1).join(' ')}
                  </span>
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-white/50">I am a</span>
                <span className="font-mono text-base sm:text-lg text-gold-300 min-h-[1.5em]">
                  {typed}
                  <span className="inline-block w-[2px] h-5 align-middle bg-gold-300 ml-0.5 animate-pulse-slow" />
                </span>
              </div>

              <p className="max-w-2xl text-white/70 text-base sm:text-lg leading-relaxed text-balance">
                {data.hero.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a href="#work" className="btn-gold">
                  View My Work
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#contact" className="btn-ghost">
                  Get in Touch
                </a>
                {data.hero.resumeUrl && (
                  <a
                    href={data.hero.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                  >
                    Resume
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <SocialIcon href={data.social.github} label="GitHub">
                  <Github className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon href={data.social.linkedin} label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon href={data.social.codechef} label="CodeChef">
                  <Trophy className="h-4 w-4" />
                </SocialIcon>
                <SocialIcon href={data.social.email} label="Email">
                  <Mail className="h-4 w-4" />
                </SocialIcon>
              </div>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Stat label="CodeChef" value={`${data.stats.codechefStars}★`} sub="Coder" />
                <Stat label="Years Coding" value={`${data.stats.yearsCoding}+`} />
                <Stat label="Projects" value={`${data.stats.projectsBuilt}+`} />
                <Stat label="Tech Stack" value={`${data.stats.technologies}+`} />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 80]) }}
            className="lg:col-span-4 order-1 lg:order-2 lg:-mt-10"
          >
            <PhotoCard data={data} />
          </motion.div>
        </div>

      </div>
    </section>
  );
}

function PhotoCard({ data }: { data: Portfolio }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative mx-auto w-full max-w-[285px] sm:max-w-[325px]"
    >
      <div className="absolute -inset-4 bg-gradient-to-tr from-gold-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full" />

      <div className="relative aspect-[3/4]">
        <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-tr from-gold-300 via-gold-500 to-gold-700 opacity-60 blur-md animate-pulse-slow" />
        <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-tr from-gold-200 via-gold-500 to-gold-700" />
        <div className="relative h-full w-full rounded-[1.75rem] overflow-hidden bg-ink-900">
          <Image
            src={data.photoUrl}
            alt={data.hero.name}
            fill
            sizes="(max-width: 1024px) 320px, 320px"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent pointer-events-none" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="absolute -left-4 top-6 glass rounded-xl px-3 py-2 hidden sm:flex items-center gap-2.5"
        >
          <div className="h-8 w-8 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center">
            <Trophy className="h-3.5 w-3.5 text-gold-300" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-widest text-white/50">CodeChef</div>
            <div className="text-xs font-semibold text-white">{data.stats.codechefRating}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="absolute -right-4 bottom-6 glass rounded-xl px-3 py-2 hidden sm:flex items-center gap-2.5"
        >
          <div className="h-8 w-8 rounded-full bg-purple-400/[0.12] border border-purple-400/20 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-purple-200" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-widest text-white/50">Speciality</div>
            <div className="text-xs font-semibold text-white">RAG · LLM</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card-luxe !p-4">
      <div className="font-display text-2xl sm:text-3xl text-gradient-gold">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/50">
        {label} {sub && <span className="text-white/40">· {sub}</span>}
      </div>
    </div>
  );
}

function SocialIcon({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 hover:text-gold-300 hover:border-gold-400/40 hover:bg-gold-400/[0.06] transition-all"
    >
      {children}
    </a>
  );
}
