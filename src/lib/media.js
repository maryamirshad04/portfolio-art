// Cloudinary URL helpers. Anything that isn't a Cloudinary URL is returned as-is,
// so demo content and other hosts keep working.

const isCld = (u) => typeof u === 'string' && u.includes('res.cloudinary.com') && u.includes('/upload/');

// Small, auto-format, auto-quality image (webp/avif where supported).
export const img = (url, w = 800) =>
  isCld(url) ? url.replace('/upload/', `/upload/f_auto,q_auto,w_${w},c_limit/`) : url;

// A still frame from a video, used as poster / thumbnail.
export function posterOf(item, w = 640) {
  if (item.poster) return item.poster;
  if (!isCld(item.url)) return undefined;
  return item.url
    .replace('/upload/', `/upload/so_1,f_jpg,q_auto,w_${w},c_limit/`)
    .replace(/\.[a-z0-9]+$/i, '.jpg');
}

export const mmss = (s) => {
  if (!Number.isFinite(s) || s <= 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

export const niceDate = (d) => {
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Video delivery: let Cloudinary pick a sensible bitrate, and always serve mp4
// (so .mov / .webm uploads still play everywhere).
export const vid = (url) =>
  isCld(url) ? url.replace('/upload/', '/upload/q_auto/').replace(/\.[a-z0-9]+$/i, '.mp4') : url;
