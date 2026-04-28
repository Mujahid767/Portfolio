'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import type { EditorCtx } from '../types';
import { Field, PageHeader, SectionCard } from '../Field';

export function SocialEditor({ ctx }: { ctx: EditorCtx }) {
  const [social, setSocial] = useState(ctx.data.social);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof social>(k: K, v: string) {
    setSocial({ ...social, [k]: v });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ social }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      ctx.setData({ ...ctx.data, social });
      ctx.notifyOk('Social links saved');
    } catch (e: any) {
      ctx.notifyErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Social Links" description="All the places people can find you." />
      <SectionCard
        title="Profiles"
        action={
          <button onClick={save} disabled={saving} className="btn-gold !py-2 !px-5 text-sm">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="GitHub">
            <input
              className="input-luxe"
              value={social.github}
              onChange={(e) => update('github', e.target.value)}
              placeholder="https://github.com/..."
            />
          </Field>
          <Field label="LinkedIn">
            <input
              className="input-luxe"
              value={social.linkedin}
              onChange={(e) => update('linkedin', e.target.value)}
              placeholder="https://www.linkedin.com/in/..."
            />
          </Field>
          <Field label="Facebook">
            <input
              className="input-luxe"
              value={social.facebook}
              onChange={(e) => update('facebook', e.target.value)}
            />
          </Field>
          <Field label="CodeChef">
            <input
              className="input-luxe"
              value={social.codechef}
              onChange={(e) => update('codechef', e.target.value)}
            />
          </Field>
          <Field label="Email" hint="Use mailto: prefix or full URL">
            <input
              className="input-luxe"
              value={social.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="mailto:you@example.com"
            />
          </Field>
          <Field label="Twitter / X (optional)">
            <input
              className="input-luxe"
              value={social.twitter || ''}
              onChange={(e) => update('twitter', e.target.value)}
            />
          </Field>
        </div>
      </SectionCard>
    </>
  );
}
