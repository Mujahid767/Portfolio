'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import type { EditorCtx } from '../types';
import { Field, PageHeader, SectionCard } from '../Field';

export function StatsEditor({ ctx }: { ctx: EditorCtx }) {
  const [stats, setStats] = useState(ctx.data.stats);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof stats>(k: K, v: (typeof stats)[K]) {
    setStats({ ...stats, [k]: v });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      ctx.setData({ ...ctx.data, stats });
      ctx.notifyOk('Stats saved');
    } catch (e: any) {
      ctx.notifyErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Stats" description="The quick numbers that show your impact." />
      <SectionCard
        title="Stats"
        action={
          <button onClick={save} disabled={saving} className="btn-gold !py-2 !px-5 text-sm">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="CodeChef Stars">
            <input
              type="number"
              className="input-luxe"
              value={stats.codechefStars}
              onChange={(e) => update('codechefStars', Number(e.target.value))}
            />
          </Field>
          <Field label="CodeChef Rating Label">
            <input
              className="input-luxe"
              value={stats.codechefRating || ''}
              onChange={(e) => update('codechefRating', e.target.value)}
            />
          </Field>
          <Field label="Years Coding">
            <input
              type="number"
              className="input-luxe"
              value={stats.yearsCoding}
              onChange={(e) => update('yearsCoding', Number(e.target.value))}
            />
          </Field>
          <Field label="Projects Built">
            <input
              type="number"
              className="input-luxe"
              value={stats.projectsBuilt}
              onChange={(e) => update('projectsBuilt', Number(e.target.value))}
            />
          </Field>
          <Field label="Technologies">
            <input
              type="number"
              className="input-luxe"
              value={stats.technologies}
              onChange={(e) => update('technologies', Number(e.target.value))}
            />
          </Field>
        </div>
      </SectionCard>
    </>
  );
}
