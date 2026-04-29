'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useRequireAdmin } from './AdminContext';
import { HeroEditor } from '../sections/HeroEditor';
import { AboutEditor } from '../sections/AboutEditor';
import { StatsEditor } from '../sections/StatsEditor';
import { SocialEditor } from '../sections/SocialEditor';
import { SkillsEditor } from '../sections/SkillsEditor';
import { ProjectsEditor } from '../sections/ProjectsEditor';
import { ExperiencesEditor } from '../sections/ExperiencesEditor';
import { EducationEditor } from '../sections/EducationEditor';
import { AchievementsEditor } from '../sections/AchievementsEditor';
import { CertificatesEditor } from '../sections/CertificatesEditor';
import { GeneralEditor } from '../sections/GeneralEditor';
import { MessagesPanel } from '../sections/MessagesPanel';
import { AccountEditor } from '../sections/AccountEditor';

export function EditDrawer() {
  const admin = useRequireAdmin();
  const open = admin.openSlot !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') admin.close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, admin]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={admin.close}
            className="fixed inset-0 z-[80] bg-ink-950/70 backdrop-blur-md"
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[81] flex h-full w-full max-w-[640px] flex-col border-l border-white/10 bg-ink-950 shadow-[-30px_0_80px_rgba(0,0,0,0.6)]"
          >
            <header className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-3 sm:px-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                  Editing
                </div>
                <div className="font-display text-base text-white">{titleFor(admin.openSlot!)}</div>
              </div>
              <button
                onClick={admin.close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-gold-400/30 hover:text-gold-200"
                aria-label="Close editor"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              <DrawerBody />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerBody() {
  const admin = useRequireAdmin();
  const ctx = admin.editorCtx;
  switch (admin.openSlot) {
    case 'hero':
      return <HeroEditor ctx={ctx} />;
    case 'general':
      return <GeneralEditor ctx={ctx} />;
    case 'about':
      return <AboutEditor ctx={ctx} />;
    case 'stats':
      return <StatsEditor ctx={ctx} />;
    case 'social':
      return <SocialEditor ctx={ctx} />;
    case 'skills':
      return <SkillsEditor ctx={ctx} />;
    case 'projects':
      return <ProjectsEditor ctx={ctx} />;
    case 'experience':
      return <ExperiencesEditor ctx={ctx} />;
    case 'education':
      return <EducationEditor ctx={ctx} />;
    case 'achievements':
      return <AchievementsEditor ctx={ctx} />;
    case 'certificates':
      return <CertificatesEditor ctx={ctx} />;
    case 'messages':
      return <MessagesPanel ctx={ctx} />;
    case 'account':
      return <AccountEditor ctx={ctx} email={admin.email} />;
    default:
      return null;
  }
}

function titleFor(s: string) {
  switch (s) {
    case 'hero':
      return 'Hero Section';
    case 'general':
      return 'Branding & Photo';
    case 'about':
      return 'About Me';
    case 'stats':
      return 'Stats';
    case 'social':
      return 'Social Links';
    case 'skills':
      return 'Skills';
    case 'projects':
      return 'Projects';
    case 'experience':
      return 'Experience';
    case 'education':
      return 'Education';
    case 'achievements':
      return 'Achievements';
    case 'certificates':
      return 'Certificates';
    case 'messages':
      return 'Inbox';
    case 'account':
      return 'Account';
    default:
      return s;
  }
}
