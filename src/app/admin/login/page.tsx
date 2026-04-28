import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { LoginForm } from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const s = await getAdminSession();
  if (s) redirect('/admin');

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-16">
      <div className="absolute inset-0 grid-bg mask-fade-b -z-10" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[700px] bg-radial-gold pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-ink-950 font-display text-xl font-bold shadow-lg mx-auto">
            M
          </div>
          <h1 className="mt-5 font-display text-3xl text-gradient-soft">Admin Sign In</h1>
          <p className="mt-2 text-sm text-white/50">Welcome back. Sign in to manage your portfolio.</p>
        </div>
        <div className="card-luxe">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-white/40">
          Protected by HTTPS-only cookies and signed sessions.
        </p>
      </div>
    </main>
  );
}
