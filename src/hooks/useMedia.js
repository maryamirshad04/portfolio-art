import { useEffect, useState } from 'react';
import { demoArt, demoAnimations } from '../data/demo.js';

// Module-level cache: switching tabs doesn't refetch.
const cache = {};

export function useMedia(kind) {
  const [state, setState] = useState(() => cache[kind] ?? { items: [], loading: true, demo: false });

  useEffect(() => {
    if (cache[kind]) return undefined;
    let cancelled = false;

    (async () => {
      let result;
      try {
        const r = await fetch(`/api/media?kind=${kind}`);
        if (!r.ok) throw new Error(`status ${r.status}`);
        const data = await r.json(); // plain `vite` serves index.html here, which throws -> demo
        if (!Array.isArray(data.items) || data.items.length === 0) throw new Error('empty');
        result = { items: data.items, loading: false, demo: false };
      } catch {
        result = { items: kind === 'art' ? demoArt : demoAnimations, loading: false, demo: true };
      }
      cache[kind] = result;
      if (!cancelled) setState(result);
    })();

    return () => {
      cancelled = true;
    };
  }, [kind]);

  return state;
}
