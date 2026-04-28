'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail, Send, Trophy, Facebook } from 'lucide-react';
import type { Portfolio } from '@/lib/types';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

export function Contact({ data }: { data: Portfolio }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      subject: String(fd.get('subject') || ''),
      body: String(fd.get('body') || ''),
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      setStatus('sent');
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus('error');
      setError(err.message);
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let&apos;s build something <span className="text-gradient-gold">extraordinary</span>
            </>
          }
          description="Whether it's an AI product, a full-stack platform or just a chat about ideas — I'd love to hear from you."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Reveal className="lg:col-span-5" delay={0.05}>
            <div className="card-luxe h-full">
              <h3 className="font-display text-2xl text-white">Reach me directly</h3>
              <p className="mt-2 text-white/60 text-sm">
                I usually respond within a day. For quick conversations:
              </p>

              <div className="mt-6 space-y-3">
                <ContactRow href={data.social.email} icon={<Mail className="h-4 w-4" />} label="Email" value="Send a message" />
                <ContactRow href={data.social.linkedin} icon={<Linkedin className="h-4 w-4" />} label="LinkedIn" value="tohidur-rahman-mujahid" />
                <ContactRow href={data.social.github} icon={<Github className="h-4 w-4" />} label="GitHub" value="@Mujahid767" />
                <ContactRow href={data.social.codechef} icon={<Trophy className="h-4 w-4" />} label="CodeChef" value={`@avid_scene_94 · ${data.stats.codechefRating}`} />
                <ContactRow href={data.social.facebook} icon={<Facebook className="h-4 w-4" />} label="Facebook" value="muju1433016" />
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <form onSubmit={onSubmit} className="card-luxe">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-luxe">Name</label>
                  <input name="name" required minLength={2} className="input-luxe" placeholder="Your name" />
                </div>
                <div>
                  <label className="label-luxe">Email</label>
                  <input name="email" type="email" required className="input-luxe" placeholder="you@example.com" />
                </div>
              </div>
              <div className="mt-4">
                <label className="label-luxe">Subject</label>
                <input name="subject" className="input-luxe" placeholder="What's this about?" />
              </div>
              <div className="mt-4">
                <label className="label-luxe">Message</label>
                <textarea
                  name="body"
                  required
                  minLength={10}
                  rows={5}
                  className="input-luxe resize-y"
                  placeholder="Tell me about your idea, project or opportunity..."
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs text-white/40">
                  Your message goes straight to my inbox — no bots, no spam.
                </p>
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent! ✓' : 'Send Message'}
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
              {status === 'sent' && (
                <p className="mt-3 text-sm text-emerald-300">
                  Thank you — I&apos;ll get back to you very soon.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-3 text-sm text-red-300">Something went wrong: {error}</p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-gold-400/30 hover:bg-gold-400/[0.04] transition-all"
    >
      <div className="h-9 w-9 rounded-lg bg-gold-400/10 border border-gold-400/20 text-gold-300 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">{label}</div>
        <div className="text-sm text-white">{value}</div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-gold-300 transition-colors" />
    </a>
  );
}
