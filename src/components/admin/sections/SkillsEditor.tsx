'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Save, Trash, X } from 'lucide-react';
import type { EditorCtx } from '../types';
import { Field, PageHeader, SectionCard } from '../Field';
import type { SkillCategory } from '@/lib/types';

function nid() {
  return Math.random().toString(36).slice(2, 10);
}

export function SkillsEditor({ ctx }: { ctx: EditorCtx }) {
  const [items, setItems] = useState<SkillCategory[]>(ctx.data.skillCategories);

  function update(idx: number, next: SkillCategory) {
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
    setItems([...items, { id: nid(), title: 'New Category', skills: [], position: items.length }]);
  }

  async function saveOne(item: SkillCategory) {
    const res = await fetch('/api/admin/skills', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
  }

  async function remove(item: SkillCategory) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const res = await fetch('/api/admin/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id }),
    });
    if (!res.ok) {
      ctx.notifyErr('Failed to delete');
      return;
    }
    const next = items.filter((it) => it.id !== item.id);
    next.forEach((it, i) => (it.position = i));
    setItems(next);
    ctx.setData({ ...ctx.data, skillCategories: next });
    ctx.notifyOk('Deleted');
  }

  async function saveAll() {
    try {
      for (let i = 0; i < items.length; i++) {
        await saveOne({ ...items[i], position: i });
      }
      const next = items.map((it, i) => ({ ...it, position: i }));
      setItems(next);
      ctx.setData({ ...ctx.data, skillCategories: next });
      ctx.notifyOk('All skill categories saved');
    } catch (e: any) {
      ctx.notifyErr(e.message);
    }
  }

  return (
    <>
      <PageHeader
        title="Skills"
        description="Group your skills into elegant categories. Drag with arrows to reorder."
      />

      <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
        <button onClick={add} className="btn-ghost text-sm !py-2 !px-4">
          <Plus className="h-4 w-4" /> Add Category
        </button>
        <button onClick={saveAll} className="btn-gold text-sm !py-2 !px-5">
          <Save className="h-4 w-4" /> Save All
        </button>
      </div>

      <div className="space-y-4">
        {items.map((it, idx) => (
          <SectionCard
            key={it.id}
            title={it.title || 'Untitled'}
            action={
              <div className="flex items-center gap-2">
                <button
                  className="btn-ghost !p-2"
                  onClick={() => move(idx, -1)}
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  className="btn-ghost !p-2"
                  onClick={() => move(idx, 1)}
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  className="btn-ghost !p-2 hover:!text-red-300 hover:!border-red-400/30"
                  onClick={() => remove(it)}
                  aria-label="Delete"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            }
          >
            <Field label="Category Title">
              <input
                className="input-luxe"
                value={it.title}
                onChange={(e) => update(idx, { ...it, title: e.target.value })}
              />
            </Field>
            <Field label="Skills" hint="Press Enter to add a skill.">
              <SkillsInput
                value={it.skills}
                onChange={(skills) => update(idx, { ...it, skills })}
              />
            </Field>
          </SectionCard>
        ))}
        {items.length === 0 && (
          <div className="card-luxe text-center text-white/50">
            No categories yet. Add your first one above.
          </div>
        )}
      </div>
    </>
  );
}

function SkillsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
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
          placeholder="e.g. TypeScript"
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
