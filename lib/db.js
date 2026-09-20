import { MongoClient } from 'mongodb';

// Reuse the connection between serverless invocations (much faster on Vercel).
const cache = (globalThis.__mongo ??= { promise: null });

export async function getDb() {
  if (!process.env.MONGODB_URI) return null;
  if (!cache.promise) {
    cache.promise = new MongoClient(process.env.MONGODB_URI).connect().catch((err) => {
      cache.promise = null;
      throw err;
    });
  }
  const client = await cache.promise;
  return client.db(process.env.MONGODB_DB || 'retro_portfolio');
}
