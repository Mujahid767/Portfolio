'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import type { EditorCtx } from '../types';
import { Field, PageHeader, SectionCard } from '../Field';

export function GeneralEditor({ ctx }: { ctx: EditorCtx }) {
  const [brand, setBrand] = useState(ctx.data.brand);
  const [photoUrl, setPhotoUrl] = useState(ctx.data.photoUrl);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, photoUrl }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      ctx.setData({ ...ctx.data, brand, photoUrl });
      ctx.notifyOk('General settings saved');
    } catch (e: any) {
      ctx.notifyErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="General" description="Brand, logo letter and profile photo." />
      <SectionCard
        title="Branding"
        action={
          <button onClick={save} disabled={saving} className="btn-gold !py-2 !px-5 text-sm">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        }
      >
        <Field label="Brand / Logo Letter" hint="The letter shown in the round logo.">
          <input className="input-luxe max-w-xs" maxLength={3} value={brand} onChange={(e) => setBrand(e.target.value)} />
        </Field>

        <Field label="Profile Photo URL" hint="Place an image in /public and use a path like /profile.png, or a full URL.">
          <input className="input-luxe" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
        </Field>

        {photoUrl && (
          <div className="mt-2">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 mb-2">Preview</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt="Preview"
              className="rounded-2xl border border-white/10 max-h-72 object-cover"
            />
          </div>
        )}
      </SectionCard>
    </>
  );
}
