'use client';

import type { ReactNode } from 'react';
import { Pencil } from 'lucide-react';
import { useAdmin, type EditorSlot } from './AdminContext';

/**
 * Wraps a public section (Hero, About, Skills, …) and overlays a hover-revealed
 * pencil button when rendered inside an AdminProvider. The button opens the
 * corresponding section editor in the side drawer.
 *
 * Outside an admin tree this just renders {children} with no overhead.
 */
export function EditableSection({
  slot,
  label,
  children,
  className = '',
}: {
  slot: EditorSlot;
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  const admin = useAdmin();
  if (!admin?.isAdmin) return <>{children}</>;

  return (
    <div className={`group/admin relative ${className}`}>
      {children}

      {/* dashed gold outline that pops on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 rounded-3xl border border-dashed border-transparent group-hover/admin:border-gold-400/40 transition-colors duration-300"
      />

      {/* floating edit affordance */}
      <button
        type="button"
        onClick={() => admin.open(slot)}
        className="absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-ink-950/80 px-3.5 py-2 text-xs font-medium text-gold-200 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md opacity-0 translate-y-1 transition-all duration-300 group-hover/admin:opacity-100 group-hover/admin:translate-y-0 hover:border-gold-300 hover:text-gold-100"
        aria-label={`Edit ${label ?? slot}`}
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit {label ?? formatSlot(slot)}
      </button>
    </div>
  );
}

function formatSlot(s: EditorSlot) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
