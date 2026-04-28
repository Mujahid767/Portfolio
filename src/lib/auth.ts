import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { sql } from './db';
import { ensureSchema } from './schema';

const COOKIE_NAME = 'portfolio_admin';
const BCRYPT_ROUNDS = 12;

/* ------------------------------------------------------------------ */
/* JWT session                                                         */
/* ------------------------------------------------------------------ */

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('Missing AUTH_SECRET');
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: { email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecret());
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { email: string };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySession(token);
}

export function setAdminCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}

/* ------------------------------------------------------------------ */
/* Admin user table — DB-backed credentials                            */
/* ------------------------------------------------------------------ */

export type AdminUser = {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
};

let adminInit: Promise<void> | null = null;
async function ensureAdminBootstrap() {
  if (!adminInit) {
    adminInit = (async () => {
      await ensureSchema();
      const rows = (await sql`SELECT COUNT(*)::int AS c FROM admin_users`) as Array<{
        c: number;
      }>;
      const count = rows[0]?.c ?? 0;
      if (count > 0) return;

      // Bootstrap: create the first admin from env vars (one-time only).
      // After this seed runs, ADMIN_EMAIL / ADMIN_PASSWORD env vars are unused.
      const email = (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
      const password = process.env.ADMIN_PASSWORD || 'changeme';
      const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      await sql`
        INSERT INTO admin_users (email, password_hash)
        VALUES (${email}, ${hash})
        ON CONFLICT (email) DO NOTHING;
      `;
    })();
  }
  return adminInit;
}

async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  await ensureAdminBootstrap();
  const rows = (await sql`
    SELECT * FROM admin_users WHERE email = ${email.trim().toLowerCase()} LIMIT 1
  `) as AdminUser[];
  return rows[0] ?? null;
}

/**
 * Validates a (email, password) pair against the admin_users table using
 * bcrypt. Returns the canonical email on success, otherwise null.
 */
export async function checkCredentials(
  email: string,
  password: string
): Promise<string | null> {
  if (!email || !password) return null;
  const user = await findAdminByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  return ok ? user.email : null;
}

/**
 * Updates the current admin's email and/or password. The current password
 * must be provided and verified before any change is applied.
 */
export async function updateAdminAccount(params: {
  currentEmail: string;
  currentPassword: string;
  newEmail?: string;
  newPassword?: string;
}): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  await ensureAdminBootstrap();
  const user = await findAdminByEmail(params.currentEmail);
  if (!user) return { ok: false, error: 'Account not found' };

  const passOk = await bcrypt.compare(params.currentPassword, user.password_hash);
  if (!passOk) return { ok: false, error: 'Current password is incorrect' };

  const targetEmail = params.newEmail
    ? params.newEmail.trim().toLowerCase()
    : user.email;
  if (params.newEmail !== undefined && targetEmail.length === 0) {
    return { ok: false, error: 'Email cannot be empty' };
  }
  if (params.newPassword !== undefined && params.newPassword.length < 8) {
    return { ok: false, error: 'New password must be at least 8 characters' };
  }

  // Prevent collision with another admin row
  if (targetEmail !== user.email) {
    const existing = await findAdminByEmail(targetEmail);
    if (existing) return { ok: false, error: 'That email is already in use' };
  }

  const newHash = params.newPassword
    ? await bcrypt.hash(params.newPassword, BCRYPT_ROUNDS)
    : user.password_hash;

  await sql`
    UPDATE admin_users
    SET email = ${targetEmail},
        password_hash = ${newHash},
        updated_at = NOW()
    WHERE id = ${user.id};
  `;

  return { ok: true, email: targetEmail };
}
