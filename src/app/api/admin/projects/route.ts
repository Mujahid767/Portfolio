import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { upsertProject, deleteProject } from '@/lib/portfolio';

export const runtime = 'nodejs';

async function guard() {
  const s = await getAdminSession();
  return !!s;
}

export async function PUT(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  await upsertProject(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
