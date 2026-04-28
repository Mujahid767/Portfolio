'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  ExternalLink,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquare,
  Settings,
  Sparkles,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Portfolio } from '@/lib/types';
import { HeroEditor } from './sections/HeroEditor';
import { AboutEditor } from './sections/AboutEditor';
import { StatsEditor } from './sections/StatsEditor';
import { SocialEditor } from './sections/SocialEditor';
import { SkillsEditor } from './sections/SkillsEditor';
import { ProjectsEditor } from './sections/ProjectsEditor';
import { ExperiencesEditor } from './sections/ExperiencesEditor';
import { EducationEditor } from './sections/EducationEditor';
import { AchievementsEditor } from './sections/AchievementsEditor';
import { CertificatesEditor } from './sections/CertificatesEditor';
import { MessagesPanel } from './sections/MessagesPanel';
import { GeneralEditor } from './sections/GeneralEditor';
import { AccountEditor } from './sections/AccountEditor';

type Section =
  | 'overview'
  | 'general'
  | 'hero'
  | 'about'
  | 'stats'
  | 'social'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'achievements'
  | 'certificates'
  | 'messages'
  | 'account';

const NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: 'general', label: 'General', icon: <Settings className="h-4 w-4" /> },
  { id: 'hero', label: 'Hero', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'about', label: 'About Me', icon: <User className="h-4 w-4" /> },
  { id: 'stats', label: 'Stats', icon: <Award className="h-4 w-4" /> },
  { id: 'social', label: 'Social Links', icon: <ExternalLink className="h-4 w-4" /> },
  { id: 'skills', label: 'Skills', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'projects', label: 'Projects', icon: <ImageIcon className="h-4 w-4" /> },
  { id: 'experience', label: 'Experience', icon: <Briefcase className="h-4 w-4" /> },
  { id: 'education', label: 'Education', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'achievements', label: 'Achievements', icon: <Award className="h-4 w-4" /> },
  { id: 'certificates', label: 'Certificates', icon: <BadgeCheck className="h-4 w-4" /> },
  { id: 'messages', label: 'Inbox', icon: <Inbox className="h-4 w-4" /> },
  { id: 'account', label: 'Account', icon: <Lock className="h-4 w-4" /> },
];

export function AdminEditor({ initial, email }: { initial: Portfolio; email: string }) {
  const router = useRouter();
  const [data, setData] = useState<Portfolio>(initial);
  const [section, setSection] = useState<Section>('overview');
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  async function refresh() {
    const r = await fetch('/api/admin/portfolio');
    if (r.ok) setData(await r.json());
  }

  const ctx = useMemo(
    () => ({
      data,
      setData,
      refresh,
      notifyOk: (m: string) => setToast({ kind: 'ok', msg: m }),
      notifyErr: (m: string) => setToast({ kind: 'err', msg: m }),
    }),
    [data]
  );

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <div className="absolute inset-0 grid-bg mask-fade-b -z-10 pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="hidden lg:flex flex-col border-r border-white/5 bg-ink-900/40 backdrop-blur-xl">
          <div className="px-6 py-6 flex items-center gap-3 border-b border-white/5">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-ink-950 font-display text-lg font-bold flex items-center justify-center">
              M
            </div>
            <div>
              <div className="font-display text-base text-white">Admin Studio</div>
              <div className="text-[11px] text-white/50">{email}</div>
            </div>
          </div>
          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={`w-full text-left flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  section === n.id
                    ? 'bg-gold-400/10 text-gold-200 border border-gold-400/20'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <span className={section === n.id ? 'text-gold-300' : 'text-white/40'}>
                  {n.icon}
                </span>
                {n.label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-white/5 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/70 hover:text-gold-300 hover:border-gold-400/30 transition-all"
            >
              <ExternalLink className="h-4 w-4" /> View Portfolio
            </a>
            <button
              onClick={logout}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/70 hover:text-red-300 hover:border-red-400/30 transition-all"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </aside>

        <main className="px-5 sm:px-8 lg:px-12 py-8 max-w-5xl mx-auto w-full">
          <div className="lg:hidden flex items-center justify-between mb-6">
            <select
              value={section}
              onChange={(e) => setSection(e.target.value as Section)}
              className="input-luxe max-w-xs"
            >
              {NAV.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
            <button onClick={logout} className="btn-ghost !py-2 !px-4 text-sm">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>

          {section === 'overview' && <Overview data={data} setSection={setSection} />}
          {section === 'general' && <GeneralEditor ctx={ctx} />}
          {section === 'hero' && <HeroEditor ctx={ctx} />}
          {section === 'about' && <AboutEditor ctx={ctx} />}
          {section === 'stats' && <StatsEditor ctx={ctx} />}
          {section === 'social' && <SocialEditor ctx={ctx} />}
          {section === 'skills' && <SkillsEditor ctx={ctx} />}
          {section === 'projects' && <ProjectsEditor ctx={ctx} />}
          {section === 'experience' && <ExperiencesEditor ctx={ctx} />}
          {section === 'education' && <EducationEditor ctx={ctx} />}
          {section === 'achievements' && <AchievementsEditor ctx={ctx} />}
          {section === 'certificates' && <CertificatesEditor ctx={ctx} />}
          {section === 'messages' && <MessagesPanel ctx={ctx} />}
          {section === 'account' && <AccountEditor ctx={ctx} email={email} />}
        </main>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 text-sm shadow-2xl backdrop-blur-xl border ${
            toast.kind === 'ok'
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
              : 'border-red-400/30 bg-red-400/10 text-red-200'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function Overview({
  data,
  setSection,
}: {
  data: Portfolio;
  setSection: (s: Section) => void;
}) {
  const stats = [
    { label: 'Projects', value: data.projects.length, target: 'projects' as Section },
    { label: 'Skill Categories', value: data.skillCategories.length, target: 'skills' as Section },
    { label: 'Certificates', value: data.certificates.length, target: 'certificates' as Section },
    { label: 'Achievements', value: data.achievements.length, target: 'achievements' as Section },
  ];
  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-gradient-soft">
            Welcome back, Mujahid
          </h1>
          <p className="text-sm text-white/50 mt-1">
            This is your studio. Edit anything you see — it updates instantly on your live portfolio.
          </p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="btn-gold !py-2 !px-5 text-sm">
          <ExternalLink className="h-4 w-4" />
          View Live
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => setSection(s.target)}
            className="card-luxe text-left"
          >
            <div className="font-display text-3xl text-gradient-gold">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setSection('hero')}
          className="card-luxe text-left flex items-start gap-4"
        >
          <Sparkles className="h-6 w-6 text-gold-300 mt-1" />
          <div>
            <div className="font-display text-lg">Edit Hero</div>
            <p className="text-sm text-white/60 mt-1">
              Change your name, titles and tagline that visitors see first.
            </p>
          </div>
        </button>
        <button
          onClick={() => setSection('projects')}
          className="card-luxe text-left flex items-start gap-4"
        >
          <ImageIcon className="h-6 w-6 text-gold-300 mt-1" />
          <div>
            <div className="font-display text-lg">Manage Projects</div>
            <p className="text-sm text-white/60 mt-1">
              Add, edit or remove your portfolio projects.
            </p>
          </div>
        </button>
        <button
          onClick={() => setSection('skills')}
          className="card-luxe text-left flex items-start gap-4"
        >
          <Award className="h-6 w-6 text-gold-300 mt-1" />
          <div>
            <div className="font-display text-lg">Update Skills</div>
            <p className="text-sm text-white/60 mt-1">
              Curate categories and the technologies you specialize in.
            </p>
          </div>
        </button>
        <button
          onClick={() => setSection('messages')}
          className="card-luxe text-left flex items-start gap-4"
        >
          <MessageSquare className="h-6 w-6 text-gold-300 mt-1" />
          <div>
            <div className="font-display text-lg">Inbox</div>
            <p className="text-sm text-white/60 mt-1">
              Read messages people send through your contact form.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
