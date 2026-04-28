'use client';

import { useState } from 'react';
import { KeyRound, Mail, Save, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { EditorCtx } from '../types';
import { Field, PageHeader, SectionCard } from '../Field';

export function AccountEditor({
  ctx,
  email: initialEmail,
}: {
  ctx: EditorCtx;
  email: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('');

  async function saveEmail() {
    if (!emailCurrentPassword) {
      ctx.notifyErr('Enter your current password to change email');
      return;
    }
    if (!email.trim()) {
      ctx.notifyErr('Email cannot be empty');
      return;
    }
    setSavingEmail(true);
    try {
      const res = await fetch('/api/admin/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: emailCurrentPassword,
          newEmail: email.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to update email');
      ctx.notifyOk('Email updated');
      setEmailCurrentPassword('');
      router.refresh();
    } catch (e: any) {
      ctx.notifyErr(e.message);
    } finally {
      setSavingEmail(false);
    }
  }

  async function savePassword() {
    if (!currentPassword) {
      ctx.notifyErr('Enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      ctx.notifyErr('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      ctx.notifyErr('New password and confirmation do not match');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch('/api/admin/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      ctx.notifyOk('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      ctx.notifyErr(e.message);
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Account"
        description="Your sign-in email and password. Stored securely (bcrypt) in the database."
      />

      <SectionCard
        title="Email"
        description="Used to sign in at /admin/login."
        action={
          <button
            onClick={saveEmail}
            disabled={savingEmail}
            className="btn-gold !py-2 !px-5 text-sm"
          >
            <Save className="h-4 w-4" /> {savingEmail ? 'Saving…' : 'Update Email'}
          </button>
        }
      >
        <Field label="Email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="email"
              className="input-luxe pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </Field>
        <Field label="Current Password" hint="Required to confirm an email change.">
          <input
            type="password"
            className="input-luxe"
            value={emailCurrentPassword}
            onChange={(e) => setEmailCurrentPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>
      </SectionCard>

      <div className="h-6" />

      <SectionCard
        title="Password"
        description="Choose a strong password (min. 8 characters)."
        action={
          <button
            onClick={savePassword}
            disabled={savingPassword}
            className="btn-gold !py-2 !px-5 text-sm"
          >
            <KeyRound className="h-4 w-4" />
            {savingPassword ? 'Saving…' : 'Change Password'}
          </button>
        }
      >
        <Field label="Current Password">
          <input
            type="password"
            className="input-luxe"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Field>
        <Field label="New Password">
          <input
            type="password"
            className="input-luxe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </Field>
        <Field label="Confirm New Password">
          <input
            type="password"
            className="input-luxe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </Field>
      </SectionCard>

      <div className="h-6" />

      <div className="card-luxe flex items-start gap-4">
        <ShieldCheck className="h-6 w-6 text-gold-300 mt-0.5 shrink-0" />
        <div className="text-sm text-white/65 leading-relaxed">
          <div className="font-display text-base text-white mb-1">
            Stored in the database
          </div>
          Your credentials live in the <code className="text-gold-200">admin_users</code>{' '}
          table with a bcrypt hash — they are no longer read from{' '}
          <code className="text-gold-200">.env.local</code> after the first run. You can
          safely delete <code className="text-gold-200">ADMIN_EMAIL</code> and{' '}
          <code className="text-gold-200">ADMIN_PASSWORD</code> from your environment
          file.
        </div>
      </div>
    </>
  );
}
