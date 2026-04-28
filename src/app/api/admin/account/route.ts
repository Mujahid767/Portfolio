import { NextRequest, NextResponse } from 'next/server';
import {
  clearAdminCookie,
  getAdminSession,
  setAdminCookie,
  signSession,
  updateAdminAccount,
} from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ email: s.email });
}

export async function PATCH(req: NextRequest) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { currentPassword, newEmail, newPassword } = body as {
    currentPassword?: string;
    newEmail?: string;
    newPassword?: string;
  };

  if (!currentPassword) {
    return NextResponse.json(
      { error: 'Current password is required' },
      { status: 400 }
    );
  }
  if (!newEmail && !newPassword) {
    return NextResponse.json(
      { error: 'Provide a new email or new password to update.' },
      { status: 400 }
    );
  }

  const result = await updateAdminAccount({
    currentEmail: s.email,
    currentPassword,
    newEmail,
    newPassword,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Re-issue a session cookie with the canonical (possibly new) email so the
  // current browser stays signed in seamlessly.
  const token = await signSession({ email: result.email });
  setAdminCookie(token);

  return NextResponse.json({ ok: true, email: result.email });
}

export async function DELETE() {
  // Helper used by the editor to force a logout (e.g. after a sensitive change).
  clearAdminCookie();
  return NextResponse.json({ ok: true });
}
