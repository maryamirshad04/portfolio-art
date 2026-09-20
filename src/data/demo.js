// Sample content shown until you upload your own (or when the API isn't reachable,
// e.g. running plain `npm run dev`). Real uploads replace this automatically.

const palettes = [
  ['#ff8fd0', '#8a7bff'],
  ['#8ff0c4', '#1414c8'],
  ['#ffe66d', '#ff5fa8'],
  ['#b8a6ff', '#0c0c6e'],
  ['#7df0ff', '#8a7bff'],
  ['#ffb3d9', '#5b5bff'],
];

function svg(i, w, h, label) {
  const [a, b] = palettes[i % palettes.length];
  const dots = Array.from({ length: 14 }, (_, k) => {
    const x = (k * 97 + i * 53) % w;
    const y = (k * 61 + i * 29) % h;
    const r = 10 + ((k * 13 + i * 7) % 40);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${0.12 + (k % 4) * 0.06}"/>`;
  }).join('');
  const s =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
    `<rect width="100%" height="100%" fill="url(#g)"/>${dots}` +
    `<text x="50%" y="52%" text-anchor="middle" font-family="monospace" font-size="${Math.round(h / 9)}" fill="#fff" opacity=".92">${label}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(s);
}

const sizes = [
  [1200, 900],
  [1000, 1000],
  [900, 1200],
  [1200, 800],
  [1000, 1000],
  [1200, 900],
];

export const demoArt = sizes.map(([w, h], i) => ({
  id: `demo-art-${i}`,
  kind: 'art',
  title: `Sample piece ${i + 1}`,
  caption: 'This is placeholder art. Upload your own and it will show up here.',
  url: svg(i, w, h, `sample ${i + 1}`),
  width: w,
  height: h,
  createdAt: new Date(2026, 0, 5 + i * 9).toISOString(),
}));

const clips = [
  ['First loop', 12],
  ['Walk cycle test', 8],
  ['Tiny story', 95],
  ['Glitch dance', 5],
];

export const demoAnimations = clips.map(([title, duration], i) => ({
  id: `demo-anim-${i}`,
  kind: 'animation',
  title,
  caption: 'Placeholder clip with no signal. Upload a video and it plays here.',
  url: null,
  poster: svg(i + 2, 640, 360, title.toLowerCase()),
  duration,
  createdAt: new Date(2026, 1, 3 + i * 11).toISOString(),
}));
