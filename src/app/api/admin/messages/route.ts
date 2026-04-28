import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { listMessages, deleteMessage } from '@/lib/portfolio';

export const runtime = 'nodejs';

async function guard() {
  const s = await getAdminSession();
  return !!s;
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const list = await listMessages();
  return NextResponse.json(list);
}

export async function DELETE(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await deleteMessage(Number(id));
  return NextResponse.json({ ok: true });
}
