import { NextRequest, NextResponse } from 'next/server';
import { saveMessage } from '@/lib/portfolio';
import { sendContactEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, body: text } = body;
    if (!name || !email || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (String(text).length < 5 || String(text).length > 5000) {
      return NextResponse.json({ error: 'Message too short or too long' }, { status: 400 });
    }

    await saveMessage({ name, email, subject, body: text });

    const result = await sendContactEmail({ name, email, subject, body: text });
    return NextResponse.json({ ok: true, emailed: result.sent });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
