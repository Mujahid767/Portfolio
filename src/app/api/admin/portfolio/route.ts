import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getPortfolio, updateMeta } from '@/lib/portfolio';

export const runtime = 'nodejs';

async function requireAdmin() {
  const s = await getAdminSession();
  if (!s) return false;
  return true;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await getPortfolio();
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const patch = await req.json();
  await updateMeta(patch);
  return NextResponse.json({ ok: true });
}
