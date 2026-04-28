'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Save, Trash } from 'lucide-react';
import type { EditorCtx } from '../types';
import { Field, PageHeader, SectionCard } from '../Field';
import type { Education } from '@/lib/types';

function nid() {
  return Math.random().toString(36).slice(2, 10);
}

export function EducationEditor({ ctx }: { ctx: EditorCtx }) {
  const [items, setItems] = useState<Education[]>(ctx.data.education);

  function update(idx: number, next: Education) {
    setItems(items.map((it, i) => (i === idx ? next : it)));
  }
  function move(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const arr = [...items];
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    arr.forEach((it, i) => (it.position = i));
    setItems(arr);
  }
  function add() {
    setItems([
      ...items,
      { id: nid(), degree: 'New Degree', school: '', period: '', detail: '', position: items.length },
    ]);
  }
  async function saveOne(item: Education) {
    const res = await fetch('/api/admin/education', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
  }
  async function remove(item: Education) {
    if (!confirm(`Delete "${item.degree}"?`)) return;
    const res = await fetch('/api/admin/education', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id }),
    });
    if (!res.ok) {
      ctx.notifyErr('Failed');
      return;
    }
    const next = items.filter((it) => it.id !== item.id);
    next.forEach((it, i) => (it.position = i));
    setItems(next);
    ctx.setData({ ...ctx.data, education: next });
    ctx.notifyOk('Deleted');
  }
  async function saveAll() {
    try {
      for (let i = 0; i < items.length; i++) {
        await saveOne({ ...items[i], position: i });
      }
      const next = items.map((it, i) => ({ ...it, position: i }));
      setItems(next);
      ctx.setData({ ...ctx.data, education: next });
      ctx.notifyOk('Education saved');
    } catch (e: any) {
      ctx.notifyErr(e.message);
    }
  }

  return (
    <>
      <PageHeader title="Education" description="Schools and degrees." />
      <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
        <button onClick={add} className="btn-ghost text-sm !py-2 !px-4">
          <Plus className="h-4 w-4" /> Add Education
        </button>
        <button onClick={saveAll} className="btn-gold text-sm !py-2 !px-5">
          <Save className="h-4 w-4" /> Save All
        </button>
      </div>

      <div className="space-y-4">
        {items.map((it, idx) => (
          <SectionCard
            key={it.id}
            title={it.degree || 'Untitled'}
            description={it.school}
            action={
              <div className="flex items-center gap-2">
                <button className="btn-ghost !p-2" onClick={() => move(idx, -1)}><ChevronUp className="h-4 w-4" /></button>
                <button className="btn-ghost !p-2" onClick={() => move(idx, 1)}><ChevronDown className="h-4 w-4" /></button>
                <button className="btn-ghost !p-2 hover:!text-red-300 hover:!border-red-400/30" onClick={() => remove(it)}>
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Degree">
                <input className="input-luxe" value={it.degree} onChange={(e) => update(idx, { ...it, degree: e.target.value })} />
              </Field>
              <Field label="School">
                <input className="input-luxe" value={it.school} onChange={(e) => update(idx, { ...it, school: e.target.value })} />
              </Field>
              <Field label="Period">
                <input className="input-luxe" value={it.period} onChange={(e) => update(idx, { ...it, period: e.target.value })} />
              </Field>
            </div>
            <Field label="Detail (optional)">
              <textarea rows={3} className="input-luxe resize-y" value={it.detail || ''} onChange={(e) => update(idx, { ...it, detail: e.target.value })} />
            </Field>
          </SectionCard>
        ))}
        {items.length === 0 && <div className="card-luxe text-center text-white/50">No entries yet.</div>}
      </div>
    </>
  );
}
