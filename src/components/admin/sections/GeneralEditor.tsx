'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import type { EditorCtx } from '../types';
import { Field, PageHeader, SectionCard } from '../Field';
import { ProfilePhotoFields } from './ProfilePhotoFields';

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
      <PageHeader
        title="General"
        description="Brand letter and profile photo. The same photo can be edited under Hero → Edit as well."
      />
      <SectionCard
        title="Photo & brand"
        action={
          <button onClick={save} disabled={saving} className="btn-gold !py-2 !px-5 text-sm">
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
          </button>
        }
      >
        <Field label="Brand / Logo Letter" hint="The letter shown in the round logo.">
          <input className="input-luxe max-w-xs" maxLength={3} value={brand} onChange={(e) => setBrand(e.target.value)} />
        </Field>

        <div className="my-10 border-t border-white/10" />

        <ProfilePhotoFields
          photoUrl={photoUrl}
          onChange={setPhotoUrl}
          notifyOk={ctx.notifyOk}
          notifyErr={ctx.notifyErr}
        />

        <div className="mt-8 pt-6 border-t border-white/10">
          <button
            onClick={save}
            disabled={saving}
            className="btn-gold !py-2 !px-5 text-sm inline-flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </SectionCard>
    </>
  );
}
