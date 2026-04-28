'use client';

import type { Portfolio } from '@/lib/types';

export function TechMarquee({ data }: { data: Portfolio }) {
  const all = Array.from(
    new Set(
      data.skillCategories.flatMap((c) => c.skills).filter(Boolean)
    )
  );
  if (all.length === 0) return null;
  const row = [...all, ...all];

  return (
    <section
      aria-hidden
      className="relative py-8 border-y border-white/[0.06] bg-gradient-to-r from-transparent via-ink-900/40 to-transparent overflow-hidden"
    >
      <div className="relative flex">
        <div className="flex shrink-0 items-center gap-8 pr-8 animate-[marquee_110s_linear_infinite] [animation-play-state:running] hover:[animation-play-state:paused]">
          {row.map((s, i) => (
            <Item key={`a-${i}`}>{s}</Item>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-8 pr-8 animate-[marquee_110s_linear_infinite] [animation-play-state:running] hover:[animation-play-state:paused]">
          {row.map((s, i) => (
            <Item key={`b-${i}`}>{s}</Item>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-ink-950 to-transparent" />

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </section>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-display text-xl sm:text-2xl text-white/25 hover:text-gold-300 transition-colors duration-500 whitespace-nowrap">
      {children}
      <span className="ml-8 inline-block h-1.5 w-1.5 rounded-full bg-gold-400/35 align-middle" />
    </span>
  );
}
