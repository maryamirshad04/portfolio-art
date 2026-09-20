# Retro art room

A tiny old-computer portfolio for digital art and animation.
Landing: a TV turns on, static, then your name. Then three windows: **About**, **Stills**, **Animation**.

- **Frontend:** React + Vite
- **Files (heavy stuff):** Cloudinary CDN (images + videos live here, not in your repo or `public/`)
- **Info about each file** (title, caption, link): MongoDB Atlas
- **Glue:** one Vercel serverless function, `api/media.js`

Why not put the files inside MongoDB itself? A document is capped at 16 MB, GridFS is slow to stream video,
and Vercel functions cap responses at roughly 4.5 MB. Cloudinary serves files straight to the browser and
auto-shrinks images, so it's faster and free on the starter plan.

## 1. Run it locally (no accounts needed)

Needs Node 20.19 or newer (`node -v` to check).

```bash
npm install
npm run dev
```

Open the link Vite prints. You'll see sample art and "no signal" video placeholders. That's demo mode.

## 2. Make your accounts (all free tiers)

1. **Cloudinary**: sign up, then copy *Cloud name*, *API Key*, *API Secret* from the dashboard.
2. **MongoDB Atlas**: create a free M0 cluster, add a database user, then *Connect > Drivers* to copy the connection string.
   Under *Network Access*, allow `0.0.0.0/0` (Vercel's IPs change, so it can't be pinned).
3. **Vercel**: sign in with GitHub.

## 3. Add your keys

```bash
cp .env.example .env.local
```

Fill in the five values. `.env.local` is git-ignored, don't commit it.

## 4. Get your files ready

Put stills in `my-art/` and videos in `my-videos/` (both are git-ignored).

Free Cloudinary limits are per file (about 10 MB for images, 100 MB for video, check their current limits).
Shrink videos first, this keeps them fast on phones too:

```bash
ffmpeg -i input.mov -vf "scale=-2:720" -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 128k -movflags +faststart output.mp4
```

Want custom titles and captions? Add a `meta.json` next to the files:

```json
{
  "moon-girl.png": { "title": "Moon girl", "caption": "made in 2026" },
  "walk-cycle.mp4": { "title": "Walk cycle", "caption": "first full loop" }
}
```

Without it, the filename becomes the title (`moon-girl.png` becomes "moon girl").
Files show up in filename order, so name them `01-...`, `02-...` if you care about order.

## 5. Upload

```bash
npm run upload:art -- ./my-art
npm run upload:anim -- ./my-videos
```

Safe to re-run: existing files get updated, not duplicated. New files are added to the end.

## 6. Test it locally with the real API

Plain `npm run dev` doesn't run the `/api` function, so use Vercel's dev server:

```bash
npx vercel login
npx vercel dev
```

Say yes to linking a new project. If the function can't see your keys, run
`npx vercel env pull .env.local` after adding them in the Vercel dashboard (step 7).
Check that your uploads show up, then also try a production build:

```bash
npm run build
npm run preview
```

## 7. Deploy

1. Push to GitHub (`git init`, `git add .`, `git commit -m "first"`, create a repo, `git push`).
2. On vercel.com: *Add New > Project*, import the repo. Framework is detected as Vite.
3. Before deploying, add **Environment Variables**: `MONGODB_URI` and `MONGODB_DB`.
   (The Cloudinary keys are only for the upload script on your machine, Vercel doesn't need them.)
4. Deploy. Later updates are just `git push`.

CLI alternative: `npx vercel` for a preview, `npx vercel --prod` for production.

## Make it yours

Everything written on the site lives in **`src/data/site.js`**: your name, tagline, mood, and the three
About windows (including your side note on what you're doing and why). Give a window your own picture
with `image: 'https://...'` instead of a pixel sprite.

Colors and fonts are at the top of `src/styles/global.css`.

## Layout of the project

```
api/media.js            serverless function: GET /api/media?kind=art|animation
lib/db.js               MongoDB connection (reused between requests)
scripts/upload.js       Cloudinary + MongoDB uploader
src/components/TVIntro.jsx   the TV: off > screen opens + static > name page > zoom in
src/components/Taskbar.jsx   bottom bar (start, one button per window, clock)
src/components/Bubbles.jsx   bubbles floating up the wallpaper
src/sections/About.jsx       music player windows
src/sections/Gallery.jsx     image viewer (arrow keys work)
src/sections/Animations.jsx  old video site + custom player
src/data/site.js             your words
src/data/demo.js             sample content for demo mode
```

## Troubleshooting

- **Still see sample art after uploading:** you're on `npm run dev`. Use `npx vercel dev` or the deployed site.
- **Deployed site shows sample art:** `MONGODB_URI` isn't set in Vercel (add it, then redeploy), or Atlas Network Access is blocking Vercel.
- **Video won't play on iPhone:** make sure it's H.264 `.mp4` (use the ffmpeg command above), not `.mov` from a camera.
- **Intro too long?** Click the TV knob to skip. Motion-sensitive visitors (reduced motion) skip it automatically.
