import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { upsertCertificate, deleteCertificate } from '@/lib/portfolio';

export const runtime = 'nodejs';

async function guard() {
  const s = await getAdminSession();
  return !!s;
}

export async function PUT(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  await upsertCertificate(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await deleteCertificate(id);
  return NextResponse.json({ ok: true });
}
