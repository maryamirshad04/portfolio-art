// Usage:
//   npm run upload:art  -- ./my-art
//   npm run upload:anim -- ./my-videos
//
// Uploads every image/video in the folder to Cloudinary and saves its metadata
// in MongoDB. Safe to re-run: existing files are updated, not duplicated.
// Optional: put a meta.json in the folder to set titles/captions:
//   { "moon-girl.png": { "title": "Moon girl", "caption": "made in 2026" } }

import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

config({ path: ['.env.local', '.env'] });

const [, , kind, folderArg] = process.argv;

const KINDS = {
  art: { exts: ['.png', '.jpg', '.jpeg', '.webp', '.gif'], resource: 'image' },
  animation: { exts: ['.mp4', '.mov', '.webm', '.m4v'], resource: 'video' },
};

const die = (msg) => {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
};

if (!KINDS[kind] || !folderArg) {
  die('Usage: npm run upload:art -- ./folder   or   npm run upload:anim -- ./folder');
}

const need = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'MONGODB_URI'];
const missing = need.filter((k) => !process.env[k]);
if (missing.length) die(`Missing in .env.local: ${missing.join(', ')}`);

const folder = path.resolve(folderArg);
if (!fs.existsSync(folder)) die(`Folder not found: ${folder}`);

const { exts, resource } = KINDS[kind];
const files = fs
  .readdirSync(folder)
  .filter((f) => exts.includes(path.extname(f).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (!files.length) die(`No ${resource} files (${exts.join(' ')}) found in ${folder}`);

let meta = {};
const metaPath = path.join(folder, 'meta.json');
if (fs.existsSync(metaPath)) {
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    die('meta.json is not valid JSON');
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const pretty = (s) => s.replace(/[-_]+/g, ' ').trim();

function uploadImage(file, publicId) {
  return cloudinary.uploader.upload(file, {
    resource_type: 'image',
    public_id: publicId,
    overwrite: true,
  });
}

// Videos go up in chunks so big files don't time out.
// upload_large calls back once per chunk; the final chunk carries secure_url.
function uploadVideo(file, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      file,
      { resource_type: 'video', public_id: publicId, overwrite: true, chunk_size: 20_000_000 },
      (err, res) => {
        if (err) return reject(err);
        if (res && res.secure_url) resolve(res);
      },
    );
  });
}

const client = new MongoClient(process.env.MONGODB_URI);
let failed = 0;

try {
  await client.connect();
  const col = client.db(process.env.MONGODB_DB || 'retro_portfolio').collection('media');
  await col.createIndex({ publicId: 1 }, { unique: true });
  await col.createIndex({ kind: 1, order: 1 });

  const last = await col.find({ kind }).sort({ order: -1 }).limit(1).next();
  let nextOrder = (last?.order ?? -1) + 1;

  console.log(`\nUploading ${files.length} ${resource}(s) from ${folder}\n`);

  for (const file of files) {
    const full = path.join(folder, file);
    const base = path.basename(file, path.extname(file));
    const m = meta[file] || meta[base] || {};
    const publicId = `retro/${kind}/${slug(base)}`;

    process.stdout.write(`↑ ${file} ... `);
    try {
      const r = resource === 'video' ? await uploadVideo(full, publicId) : await uploadImage(full, publicId);

      const existing = await col.findOne({ publicId: r.public_id });
      const order = existing?.order ?? nextOrder++;

      await col.updateOne(
        { publicId: r.public_id },
        {
          $set: {
            kind,
            title: m.title || pretty(base),
            caption: m.caption || '',
            publicId: r.public_id,
            url: r.secure_url,
            width: r.width,
            height: r.height,
            duration: r.duration ?? null,
            format: r.format,
            bytes: r.bytes,
            order,
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true },
      );
      console.log('done');
    } catch (err) {
      failed++;
      console.log(`FAILED (${err?.message || err})`);
    }
  }
} finally {
  await client.close();
}

console.log(failed ? `\n${failed} file(s) failed. Fix and re-run, finished ones are skipped safely.\n` : '\nAll done ✓\n');
process.exit(failed ? 1 : 0);
