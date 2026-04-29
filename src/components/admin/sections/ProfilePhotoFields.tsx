'use client';

import { useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { Field } from '../Field';
import { compressImageFileToDataUrl } from '@/lib/image-compress';

type Props = {
  photoUrl: string;
  onChange: (url: string) => void;
  notifyOk: (m: string) => void;
  notifyErr: (m: string) => void;
};

/**
 * Profile image picker — file input overlays the buttons so clicks always reach
 * the native picker (fixes label/htmlFor quirks in drawers / Chrome).
 */
export function ProfilePhotoFields({ photoUrl, onChange, notifyOk, notifyErr }: Props) {
  const [processing, setProcessing] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setProcessing(true);
    try {
      const dataUrl = await compressImageFileToDataUrl(file);
      onChange(dataUrl);
      notifyOk('Photo loaded — remember to click Save');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not read image';
      notifyErr(msg);
      console.error('[ProfilePhotoFields]', err);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      <Field
        label="Profile photo"
        hint="Click the gold area to pick from your computer (JPG, PNG, WebP). Shown in the hero."
      >
        <div className="flex flex-wrap gap-3 items-center">
          {/* Native file input on top of the visible control — most reliable in Chrome */}
          <div className="relative inline-flex">
            <span
              className={`btn-gold !py-2.5 !px-5 text-sm inline-flex items-center gap-2 pointer-events-none ${
                processing ? 'opacity-60' : ''
              }`}
            >
              <Upload className="h-4 w-4" />
              {processing ? 'Processing…' : 'Choose photo from device'}
            </span>
            <input
              type="file"
              accept="image/*,.heic,.heif"
              disabled={processing}
              aria-label="Choose profile photo from device"
              onChange={onFile}
              className="absolute inset-0 cursor-pointer opacity-0 w-full min-h-[40px]"
            />
          </div>

          <button
            type="button"
            className="btn-ghost !py-2.5 !px-4 text-sm inline-flex items-center gap-2 text-white/65"
            onClick={() => {
              onChange('/profile.png');
              notifyOk('Reset to default /profile.png — click Save');
            }}
          >
            <X className="h-4 w-4" /> Use built-in default photo
          </button>
        </div>
      </Field>

      <Field label="Photo URL or path (optional)" hint="Override with a hosted URL or /profile.png instead of uploading.">
        <input
          className="input-luxe"
          value={photoUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/profile.png or https://..."
        />
      </Field>

      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 mb-2 flex items-center gap-2">
          <ImageIcon className="h-3 w-3" /> Preview
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-ink-900/60 aspect-[3/4] max-w-[200px] max-h-[240px]">
          {photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photoUrl}
              alt=""
              className="h-full w-full object-cover"
              onError={() => notifyErr('Preview failed — check URL or upload again')}
            />
          ) : (
            <div className="flex h-full min-h-[160px] items-center justify-center text-xs text-white/40 px-3 text-center">
              No preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
