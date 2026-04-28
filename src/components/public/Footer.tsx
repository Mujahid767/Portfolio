'use client';

import { Github, Linkedin, Trophy, Facebook, Mail } from 'lucide-react';
import type { Portfolio } from '@/lib/types';

export function Footer({ data }: { data: Portfolio }) {
  return (
    <footer className="relative py-12 border-t border-white/5">
      <div className="container-luxe flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <div className="font-display text-lg text-white">{data.hero.name}</div>
          <p className="text-xs text-white/40 mt-1">
            © {new Date().getFullYear()} · Crafted with care, in Dhaka.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FooterIcon href={data.social.github}>
            <Github className="h-4 w-4" />
          </FooterIcon>
          <FooterIcon href={data.social.linkedin}>
            <Linkedin className="h-4 w-4" />
          </FooterIcon>
          <FooterIcon href={data.social.codechef}>
            <Trophy className="h-4 w-4" />
          </FooterIcon>
          <FooterIcon href={data.social.facebook}>
            <Facebook className="h-4 w-4" />
          </FooterIcon>
          <FooterIcon href={data.social.email}>
            <Mail className="h-4 w-4" />
          </FooterIcon>
        </div>
      </div>
    </footer>
  );
}

function FooterIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 hover:text-gold-300 hover:border-gold-400/40 transition-colors"
    >
      {children}
    </a>
  );
}
