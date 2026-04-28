'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, ArrowUpRight, X } from 'lucide-react';
import type { Certificate, Portfolio } from '@/lib/types';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

export function Certificates({ data }: { data: Portfolio }) {
  const [active, setActive] = useState<Certificate | null>(null);

  if (!data.certificates?.length) return null;

  return (
    <section id="certificates" className="relative py-24 sm:py-32">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Certificates"
          title={
            <>
              Earned through <span className="text-gradient-gold">dedication</span>
            </>
          }
          description="Continuous learning is at the heart of building great software. Click any certificate to view it full size."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.certificates.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.07}>
              <CertificateCard cert={c} onClick={() => setActive(c)} />
            </Reveal>
          ))}
        </div>
      </div>

      {active && <CertificateModal cert={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function CertificateCard({ cert, onClick }: { cert: Certificate; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      whileHover={{ y: -2 }}
      className="group relative w-full text-left card-luxe !p-4 sm:!p-5 overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gold-500/[0.07] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div
        className="relative rounded-xl overflow-hidden border border-white/10 bg-white"
      >
        <div className="relative aspect-[1.5/1]">
          <Image
            src={cert.imageUrl}
            alt={cert.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Award className="h-3.5 w-3.5 text-gold-300" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-gold-300/80">
              {cert.issuer}
            </span>
          </div>
          <div className="font-display text-lg sm:text-xl text-white leading-tight">
            {cert.title}
          </div>
          {cert.date && (
            <div className="text-xs text-white/50 mt-1">{cert.date}</div>
          )}
        </div>
        <ArrowUpRight className="h-5 w-5 text-white/40 group-hover:text-gold-300 transition-all flex-shrink-0" />
      </div>

      {cert.credentialId && (
        <div className="mt-3 text-[10px] font-mono text-white/35 truncate">
          ID: {cert.credentialId}
        </div>
      )}
    </motion.button>
  );
}

function CertificateModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/85 backdrop-blur-md p-4 sm:p-8"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full"
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" /> Close
        </button>

        <div className="rounded-2xl overflow-hidden border border-gold-400/20 shadow-[0_30px_80px_-20px_rgba(245,179,66,0.25)] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cert.imageUrl}
            alt={cert.title}
            className="w-full h-auto block"
          />
        </div>

        <div className="mt-4 glass rounded-xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-display text-lg text-white">{cert.title}</div>
              <div className="text-xs text-white/50 mt-0.5">
                {cert.issuer}
                {cert.date && ` · ${cert.date}`}
              </div>
            </div>
            {cert.link && (
              <a
                href={cert.link}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost !py-2 !px-4 text-xs"
              >
                Visit Issuer <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
