'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import type { Portfolio } from '@/lib/types';

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#work', label: 'Work' },
  { href: '#journey', label: 'Journey' },
  { href: '#certificates', label: 'Certificates' },
  { href: '#contact', label: 'Contact' },
];

export function Nav({ data }: { data: Portfolio }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'pt-3' : 'pt-6'
      }`}
    >
      <div className="container-luxe">
        <nav
          className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled
              ? 'glass-strong shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]'
              : 'bg-transparent border border-transparent'
          }`}
        >
          <Link href="#top" className="flex items-center gap-2 group">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-ink-950 font-display text-lg font-bold shadow-lg">
              {data.brand?.[0] || 'M'}
              <span className="absolute inset-0 rounded-full ring-1 ring-gold-300/40 group-hover:ring-gold-300/80 transition" />
            </span>
            <span className="hidden sm:block font-display text-sm tracking-widest text-white/80">
              MUJAHID
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative px-3 py-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <span>{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href="#contact" className="hidden sm:inline-flex btn-gold !px-5 !py-2 text-sm">
              Let&apos;s Talk
            </a>
            <button
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 text-white/80"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass-strong rounded-2xl p-4">
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="block px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/[0.04]"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.header>
  );
}
