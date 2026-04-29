'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, Image as ImageIcon, Inbox, Lock, LogOut, Pencil } from 'lucide-react';
import { useRequireAdmin } from './AdminContext';

/**
 * Sticky top bar shown only in the admin view. Provides quick links to View
 * Live, the Inbox, Branding, Account, and Sign Out. Sits above the public Nav
 * (which itself is `z-50`) so the admin context is always reachable.
 */
export function AdminBar() {
  const admin = useRequireAdmin();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="sticky top-0 z-[60] border-b border-white/[0.06] bg-ink-950/85 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/[0.08] px-3 py-1 text-[11px] font-medium text-gold-200">
            <Pencil className="h-3 w-3" />
            Editing
          </span>
          <span className="text-xs text-white/45 truncate hidden sm:inline">
            Hover any section, click the pencil to edit. Signed in as{' '}
            <span className="text-white/65">{admin.email}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <BarButton onClick={() => admin.open('general')} icon={<ImageIcon className="h-3.5 w-3.5" />} label="Photo & logo" />
          <BarButton onClick={() => admin.open('messages')} icon={<Inbox className="h-3.5 w-3.5" />} label="Inbox" />
          <BarButton onClick={() => admin.open('account')} icon={<Lock className="h-3.5 w-3.5" />} label="Account" />
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-all hover:border-gold-400/30 hover:bg-gold-400/[0.06] hover:text-gold-200"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View Live</span>
          </a>
          <button
            onClick={signOut}
            disabled={signingOut}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-all hover:border-red-400/30 hover:text-red-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{signingOut ? 'Signing out…' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function BarButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-all hover:border-gold-400/30 hover:bg-gold-400/[0.06] hover:text-gold-200"
    >
      {icon}
      {label}
    </button>
  );
}

/** Toast that surfaces from the AdminContext */
export function AdminToast() {
  const admin = useRequireAdmin();
  if (!admin.toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[90] rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl ${
        admin.toast.kind === 'ok'
          ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
          : 'border-red-400/30 bg-red-400/10 text-red-200'
      }`}
    >
      {admin.toast.msg}
    </div>
  );
}
