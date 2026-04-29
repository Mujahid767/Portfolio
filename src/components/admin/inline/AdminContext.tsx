'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Portfolio } from '@/lib/types';
import type { EditorCtx } from '../types';

export type EditorSlot =
  | 'hero'
  | 'general'
  | 'about'
  | 'stats'
  | 'social'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'achievements'
  | 'certificates'
  | 'messages'
  | 'account';

type Toast = { kind: 'ok' | 'err'; msg: string } | null;

type AdminContextValue = {
  /** True when this tree is being rendered in the admin overlay */
  isAdmin: boolean;
  email: string;
  data: Portfolio;
  setData: (d: Portfolio) => void;
  refresh: () => Promise<void>;
  notifyOk: (m: string) => void;
  notifyErr: (m: string) => void;
  toast: Toast;
  /** Currently-open editor drawer slot */
  openSlot: EditorSlot | null;
  /** Optional sub-target for a slot (e.g. project id to edit, or `__new__`) */
  openTarget: string | null;
  open: (slot: EditorSlot, target?: string | null) => void;
  close: () => void;
  /** EditorCtx shaped for legacy section editors */
  editorCtx: EditorCtx;
};

const Ctx = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue | null {
  return useContext(Ctx);
}

/** Hook that throws if used outside an AdminProvider — for components that
 * only ever render inside the admin tree (drawer, edit buttons, etc.). */
export function useRequireAdmin(): AdminContextValue {
  const c = useContext(Ctx);
  if (!c) throw new Error('useRequireAdmin must be inside AdminProvider');
  return c;
}

export function AdminProvider({
  initial,
  email,
  children,
}: {
  initial: Portfolio;
  email: string;
  children: ReactNode;
}) {
  const [data, setData] = useState<Portfolio>(initial);
  const [toast, setToast] = useState<Toast>(null);
  const [openSlot, setOpenSlot] = useState<EditorSlot | null>(null);
  const [openTarget, setOpenTarget] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((t: NonNullable<Toast>) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const refresh = useCallback(async () => {
    const r = await fetch('/api/admin/portfolio', { cache: 'no-store' });
    if (r.ok) setData(await r.json());
  }, []);

  const notifyOk = useCallback((m: string) => showToast({ kind: 'ok', msg: m }), [showToast]);
  const notifyErr = useCallback((m: string) => showToast({ kind: 'err', msg: m }), [showToast]);

  const open = useCallback((slot: EditorSlot, target: string | null = null) => {
    setOpenSlot(slot);
    setOpenTarget(target);
  }, []);
  const close = useCallback(() => {
    setOpenSlot(null);
    setOpenTarget(null);
  }, []);

  const editorCtx: EditorCtx = useMemo(
    () => ({ data, setData, refresh, notifyOk, notifyErr }),
    [data, refresh, notifyOk, notifyErr]
  );

  const value = useMemo<AdminContextValue>(
    () => ({
      isAdmin: true,
      email,
      data,
      setData,
      refresh,
      notifyOk,
      notifyErr,
      toast,
      openSlot,
      openTarget,
      open,
      close,
      editorCtx,
    }),
    [email, data, refresh, notifyOk, notifyErr, toast, openSlot, openTarget, open, close, editorCtx]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
