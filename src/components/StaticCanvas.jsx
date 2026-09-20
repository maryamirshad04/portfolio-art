import { useEffect, useRef } from 'react';

// Low-res TV noise, scaled up with pixelated rendering.
export default function StaticCanvas({ className = '', fps = 24 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const w = (canvas.width = 160);
    const h = (canvas.height = 100);
    const frame = ctx.createImageData(w, h);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    let last = 0;

    const draw = (t) => {
      if (t - last >= 1000 / fps) {
        last = t;
        const d = frame.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = 255;
        }
        ctx.putImageData(frame, 0, 0);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [fps]);

  return <canvas ref={ref} className={`static-canvas ${className}`} aria-hidden="true" />;
}
