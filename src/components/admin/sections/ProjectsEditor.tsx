'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Save, Star, StarOff, Trash, X } from 'lucide-react';
import type { EditorCtx } from '../types';
import { Field, PageHeader, SectionCard } from '../Field';
import type { Project } from '@/lib/types';

function nid() {
  return Math.random().toString(36).slice(2, 10);
}

export function ProjectsEditor({ ctx }: { ctx: EditorCtx }) {
  const [items, setItems] = useState<Project[]>(ctx.data.projects);

  function update(idx: number, next: Project) {
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
      {
        id: nid(),
        title: 'New Project',
        description: '',
        tags: [],
        link: '',
        highlight: false,
        position: items.length,
      },
    ]);
  }

  async function saveOne(item: Project) {
    const res = await fetch('/api/admin/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
  }

  async function remove(item: Project) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const res = await fetch('/api/admin/projects', {
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
    ctx.setData({ ...ctx.data, projects: next });
    ctx.notifyOk('Deleted');
  }

  async function saveAll() {
    try {
      for (let i = 0; i < items.length; i++) {
        await saveOne({ ...items[i], position: i });
      }
      const next = items.map((it, i) => ({ ...it, position: i }));
      setItems(next);
      ctx.setData({ ...ctx.data, projects: next });
      ctx.notifyOk('All projects saved');
    } catch (e: any) {
      ctx.notifyErr(e.message);
    }
  }

  return (
    <>
      <PageHeader title="Projects" description="Showcase your best work. Mark featured ones with a star." />

      <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
        <button onClick={add} className="btn-ghost text-sm !py-2 !px-4">
          <Plus className="h-4 w-4" /> Add Project
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
            description={it.highlight ? 'Featured project' : undefined}
            action={
              <div className="flex items-center gap-2">
                <button
                  className={`btn-ghost !p-2 ${it.highlight ? '!text-gold-300 !border-gold-400/30 !bg-gold-400/10' : ''}`}
                  onClick={() => update(idx, { ...it, highlight: !it.highlight })}
                  aria-label="Toggle highlight"
                  title="Featured"
                >
                  {it.highlight ? <Star className="h-4 w-4 fill-gold-300" /> : <StarOff className="h-4 w-4" />}
                </button>
                <button className="btn-ghost !p-2" onClick={() => move(idx, -1)} aria-label="Up">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button className="btn-ghost !p-2" onClick={() => move(idx, 1)} aria-label="Down">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Title">
                <input
                  className="input-luxe"
                  value={it.title}
                  onChange={(e) => update(idx, { ...it, title: e.target.value })}
                />
              </Field>
              <Field label="Year / Period">
                <input
                  className="input-luxe"
                  value={it.year || ''}
                  onChange={(e) => update(idx, { ...it, year: e.target.value })}
                />
              </Field>
              <Field label="Role">
                <input
                  className="input-luxe"
                  value={it.role || ''}
                  onChange={(e) => update(idx, { ...it, role: e.target.value })}
                />
              </Field>
              <Field label="Live Link">
                <input
                  className="input-luxe"
                  value={it.link}
                  onChange={(e) => update(idx, { ...it, link: e.target.value })}
                  placeholder="https://..."
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                rows={3}
                className="input-luxe resize-y"
                value={it.description}
                onChange={(e) => update(idx, { ...it, description: e.target.value })}
              />
            </Field>

            <Field label="Tags">
              <TagInput
                value={it.tags}
                onChange={(tags) => update(idx, { ...it, tags })}
              />
            </Field>
          </SectionCard>
        ))}
        {items.length === 0 && (
          <div className="card-luxe text-center text-white/50">No projects yet.</div>
        )}
      </div>
    </>
  );
}

function TagInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('');
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((v, i) => (
          <span key={i} className="chip">
            {v}
            <button
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="ml-1 text-white/50 hover:text-red-300"
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
          placeholder="Add tag, press Enter"
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
