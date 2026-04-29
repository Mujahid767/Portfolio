/**
 * Compress a browser File to a JPEG data URL for storing in Postgres `photo_url`.
 * Uses createImageBitmap when available, with a canvas/Image fallback for Safari / HEIC edge cases.
 */

function isProbablyImage(file: File): boolean {
  if (file.type.startsWith('image/')) return true;
  const n = file.name.toLowerCase();
  return /\.(jpe?g|png|webp|gif|bmp|heic|heif)$/.test(n);
}

async function loadToCanvas(
  file: File,
  maxEdge: number
): Promise<{ canvas: HTMLCanvasElement }> {
  // Path A: createImageBitmap (fast; may fail on HEIC or some Safari builds)
  try {
    const bitmap = await createImageBitmap(file);
    try {
      let { width, height } = bitmap;
      const scale = Math.min(1, maxEdge / Math.max(width, height, 1));
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not read image.');
      ctx.drawImage(bitmap, 0, 0, width, height);
      return { canvas };
    } finally {
      if (typeof bitmap.close === 'function') bitmap.close();
    }
  } catch {
    // Path B: classic Image + object URL (works more widely)
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { naturalWidth: width, naturalHeight: height } = img;
        if (!width || !height) {
          reject(new Error('Invalid image dimensions.'));
          return;
        }
        const scale = Math.min(1, maxEdge / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not read image.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve({ canvas });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(
          new Error(
            'Could not decode this image. Try JPG or PNG from your camera roll, or use a URL instead.'
          )
        );
      };
      img.src = url;
    });
  }
}

export async function compressImageFileToDataUrl(
  file: File,
  options: { maxEdge?: number; quality?: number; maxBytesHint?: number } = {}
): Promise<string> {
  const maxEdge = options.maxEdge ?? 1200;
  const quality = options.quality ?? 0.82;
  const maxBytesHint = options.maxBytesHint ?? 2_500_000;

  if (!isProbablyImage(file)) {
    throw new Error('Please choose an image file (JPG, PNG, or WebP).');
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('Image is too large. Please use a file under 12 MB.');
  }

  const { canvas } = await loadToCanvas(file, maxEdge);
  let dataUrl = canvas.toDataURL('image/jpeg', quality);
  if (dataUrl.length > maxBytesHint) {
    dataUrl = canvas.toDataURL('image/jpeg', Math.max(0.45, quality - 0.18));
  }
  if (dataUrl.length > 5_000_000) {
    throw new Error('Compressed image is still too large. Try a smaller photo.');
  }
  return dataUrl;
}
