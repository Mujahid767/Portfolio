'use client';

import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import type { EditorCtx } from '../types';
import { Field, PageHeader, SectionCard } from '../Field';

export function HeroEditor({ ctx }: { ctx: EditorCtx }) {
  const [hero, setHero] = useState(ctx.data.hero);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof hero>(k: K, v: (typeof hero)[K]) {
    setHero({ ...hero, [k]: v });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      ctx.setData({ ...ctx.data, hero });
      ctx.notifyOk('Hero saved');
    } catch (e: any) {
      ctx.notifyErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Hero Section"
        description="The very first thing visitors read. Make it count."
      />
      <SectionCard
        title="Hero Content"
        action={
          <button onClick={save} disabled={saving} className="btn-gold !py-2 !px-5 text-sm">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Greeting">
            <input
              className="input-luxe"
              value={hero.greeting}
              onChange={(e) => update('greeting', e.target.value)}
            />
          </Field>
          <Field label="Full Name">
            <input
              className="input-luxe"
              value={hero.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </Field>
        </div>

        <Field label="Tagline" hint="One or two sentences that summarize who you are.">
          <textarea
            rows={3}
            className="input-luxe resize-y"
            value={hero.tagline}
            onChange={(e) => update('tagline', e.target.value)}
          />
        </Field>

        <Field label="Resume URL (optional)">
          <input
            className="input-luxe"
            placeholder="https://..."
            value={hero.resumeUrl || ''}
            onChange={(e) => update('resumeUrl', e.target.value)}
          />
        </Field>

        <Field label="Available for Opportunities">
          <button
            type="button"
            onClick={() => update('available', !hero.available)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
              hero.available
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                : 'border-white/10 bg-white/[0.04] text-white/60'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${hero.available ? 'bg-emerald-400' : 'bg-white/40'}`} />
            {hero.available ? 'Available now' : 'Not available'}
          </button>
        </Field>

        <Field label="Rotating Titles" hint="Press Enter to add. These animate as a typewriter on the hero.">
          <TitlesInput value={hero.titles} onChange={(v) => update('titles', v)} />
        </Field>
      </SectionCard>
    </>
  );
}

function TitlesInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('');
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((v, i) => (
          <span key={i} className="chip-gold">
            {v}
            <button
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="ml-1 text-gold-400/70 hover:text-gold-200"
              aria-label="remove"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="input-luxe"
          placeholder="Add a title and press Enter (e.g. AI Engineer)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && draft.trim()) {
              e.preventDefault();
              onChange([...value, draft.trim()]);
              setDraft('');
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            if (!draft.trim()) return;
            onChange([...value, draft.trim()]);
            setDraft('');
          }}
          className="btn-ghost !px-4 !py-2.5 text-sm"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
