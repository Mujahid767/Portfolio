'use client';

import { Plus } from 'lucide-react';
import { useAdmin, type EditorSlot } from './AdminContext';

/**
 * Renders a "+ Add" button below a list section (Skills, Projects, …) when in
 * admin mode. Clicking it opens the section's editor with target=`__new__` so
 * the editor focuses on creating a new item.
 */
export function AddItemButton({
  slot,
  label,
  className = '',
}: {
  slot: EditorSlot;
  label: string;
  className?: string;
}) {
  const admin = useAdmin();
  if (!admin?.isAdmin) return null;

  return (
    <div className={`mt-8 flex justify-center ${className}`}>
      <button
        type="button"
        onClick={() => admin.open(slot, '__new__')}
        className="group inline-flex items-center gap-2 rounded-full border border-dashed border-gold-400/40 bg-gold-400/[0.04] px-5 py-2.5 text-sm font-medium text-gold-200 transition-all hover:border-gold-300 hover:bg-gold-400/[0.08] hover:text-gold-100"
      >
        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
        {label}
      </button>
    </div>
  );
}
