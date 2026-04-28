'use client';

import { useState } from 'react';
import { Plus, Save, Trash } from 'lucide-react';
import type { EditorCtx } from '../types';
import { Field, PageHeader, SectionCard } from '../Field';

export function AboutEditor({ ctx }: { ctx: EditorCtx }) {
  const [about, setAbout] = useState(ctx.data.about);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof about>(k: K, v: (typeof about)[K]) {
    setAbout({ ...about, [k]: v });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ about }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      ctx.setData({ ...ctx.data, about });
      ctx.notifyOk('About saved');
    } catch (e: any) {
      ctx.notifyErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="About Me" description="Your personal narrative." />
      <SectionCard
        title="About Content"
        action={
          <button onClick={save} disabled={saving} className="btn-gold !py-2 !px-5 text-sm">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        }
      >
        <Field label="Intro (italic quote)">
          <input
            className="input-luxe"
            value={about.intro}
            onChange={(e) => update('intro', e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Location">
            <input
              className="input-luxe"
              value={about.location}
              onChange={(e) => update('location', e.target.value)}
            />
          </Field>
          <Field label="Focus / Tagline">
            <input
              className="input-luxe"
              value={about.focus}
              onChange={(e) => update('focus', e.target.value)}
            />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label-luxe !mb-0">Paragraphs</label>
            <button
              type="button"
              onClick={() => update('paragraphs', [...about.paragraphs, ''])}
              className="text-xs text-gold-300 hover:text-gold-200 inline-flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add paragraph
            </button>
          </div>
          <div className="space-y-3">
            {about.paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  rows={3}
                  className="input-luxe resize-y"
                  value={p}
                  onChange={(e) =>
                    update(
                      'paragraphs',
                      about.paragraphs.map((x, j) => (j === i ? e.target.value : x))
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    update(
                      'paragraphs',
                      about.paragraphs.filter((_, j) => j !== i)
                    )
                  }
                  className="self-start mt-1 inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 bg-white/[0.03] text-white/50 hover:text-red-300 hover:border-red-400/30"
                  aria-label="Remove paragraph"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </>
  );
}
