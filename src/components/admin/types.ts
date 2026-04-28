import type { Portfolio } from '@/lib/types';

export type EditorCtx = {
  data: Portfolio;
  setData: (d: Portfolio) => void;
  refresh: () => Promise<void>;
  notifyOk: (msg: string) => void;
  notifyErr: (msg: string) => void;
};
