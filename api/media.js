import { getDb } from '../lib/db.js';

// GET /api/media?kind=art|animation
// Returns metadata only (title, caption, Cloudinary URL...). The heavy files
// themselves are served straight from Cloudinary's CDN, never through Vercel.
export default async function handler(req, res) {
  const { kind } = req.query;
  if (kind !== 'art' && kind !== 'animation') {
    return res.status(400).json({ error: 'kind must be "art" or "animation"' });
  }

  try {
    const db = await getDb();
    if (!db) return res.status(200).json({ items: [], demo: true });

    const items = await db
      .collection('media')
      .find({ kind }, { projection: { _id: 0, bytes: 0 } })
      .sort({ order: 1, createdAt: -1 })
      .limit(200)
      .toArray();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ items });
  } catch (err) {
    console.error('media api error:', err);
    return res.status(500).json({ error: 'could not load media' });
  }
}
