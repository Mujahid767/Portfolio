'use client';

import { useEffect, useState } from 'react';
import { Mail, Trash, RefreshCcw } from 'lucide-react';
import type { EditorCtx } from '../types';
import { PageHeader } from '../Field';

type Msg = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  read: boolean;
  created_at: string;
};

export function MessagesPanel({ ctx }: { ctx: EditorCtx }) {
  const [items, setItems] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/messages');
      if (r.ok) setItems(await r.json());
    } catch {}
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function remove(id: number) {
    if (!confirm('Delete this message?')) return;
    const r = await fetch('/api/admin/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (r.ok) {
      setItems(items.filter((m) => m.id !== id));
      ctx.notifyOk('Deleted');
    }
  }

  return (
    <>
      <PageHeader title="Inbox" description="Messages people sent through your contact form." />
      <div className="flex items-center justify-end mb-4">
        <button onClick={load} className="btn-ghost !py-2 !px-4 text-sm">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="card-luxe text-center text-white/50">Loading...</div>
      ) : items.length === 0 ? (
        <div className="card-luxe text-center">
          <Mail className="h-8 w-8 text-white/30 mx-auto mb-3" />
          <p className="text-white/60">No messages yet.</p>
          <p className="text-xs text-white/40 mt-1">When visitors send you a message, it will show here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="card-luxe">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-display text-lg text-white">{m.subject || '(No subject)'}</div>
                  <div className="text-xs text-white/50 mt-0.5">
                    From <span className="text-gold-300">{m.name}</span> &lt;{m.email}&gt; · {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => remove(m.id)}
                  className="btn-ghost !p-2 hover:!text-red-300 hover:!border-red-400/30"
                  aria-label="Delete"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{m.body}</p>
              <div className="mt-3">
                <a
                  href={`mailto:${m.email}?subject=Re: ${m.subject || 'your message'}`}
                  className="text-xs text-gold-300 hover:text-gold-200"
                >
                  Reply via email →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
