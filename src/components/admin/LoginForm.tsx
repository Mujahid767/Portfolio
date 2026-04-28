'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, LogIn } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(fd.get('email') || ''),
          password: String(fd.get('password') || ''),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Login failed');
      }
      router.replace('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label-luxe">Email</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            name="email"
            type="email"
            required
            placeholder="admin@..."
            className="input-luxe pl-10"
            autoFocus
          />
        </div>
      </div>
      <div>
        <label className="label-luxe">Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="input-luxe pl-10"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
        {loading ? 'Signing in...' : 'Sign In'}
        <LogIn className="h-4 w-4" />
      </button>
    </form>
  );
}
