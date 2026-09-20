import { useCallback, useEffect, useState } from 'react';
import Window from '../components/Window.jsx';
import PixelArt from '../components/PixelArt.jsx';
import Icon from '../components/Icons.jsx';
import { useMedia } from '../hooks/useMedia.js';
import { img } from '../lib/media.js';

const label = (i) => `${String(i + 1).padStart(3, '0')}_image`;

export default function Gallery({ onClose }) {
  const { items, loading, demo } = useMedia('art');
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [tag, setTag] = useState(true);

  const step = useCallback(
    (d) => {
      if (!items.length) return;
      setI((v) => (v + d + items.length) % items.length);
      setZoom(1);
    },
    [items.length],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const item = items[i];
  const note = demo ? 'sample art (demo mode)' : undefined;

  return (
    <Window title="Preview" sprite="flower" onClose={onClose} note={note} bodyClass="gallery-body">
      {loading || !item ? (
        <p className="loading">loading pictures<span className="blink">_</span></p>
      ) : (
        <div className="gallery">
          <div className="g-side" role="list" aria-label="Pictures">
            {items.map((it, idx) => (
              <button
                key={it.publicId || it.id}
                type="button"
                role="listitem"
                className={`g-thumb ${idx === i ? 'is-active' : ''}`}
                onClick={() => {
                  setI(idx);
                  setZoom(1);
                }}
                aria-label={`${label(idx)}: ${it.title}`}
                aria-current={idx === i ? 'true' : undefined}
              >
                <span className="frame">
                  <img src={img(it.url, 320)} alt="" loading="lazy" />
                </span>
                <span className="g-name">{label(idx)}</span>
              </button>
            ))}
          </div>

          <div className="g-main">
            <div className="g-toolbar">
              <button type="button" className="tbtn" onClick={() => step(-1)} aria-label="Previous picture">
                <Icon name="back" />
              </button>
              <button type="button" className="tbtn" onClick={() => step(1)} aria-label="Next picture">
                <Icon name="forward" />
              </button>
              <code className="g-file">{label(i)}.jpg</code>
              <span className="g-spacer" />
              <button type="button" className="tbtn" onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))} aria-label="Zoom out" disabled={zoom <= 1}>
                -
              </button>
              <button type="button" className="tbtn" onClick={() => setZoom((z) => Math.min(4, +(z + 0.5).toFixed(1)))} aria-label="Zoom in" disabled={zoom >= 4}>
                +
              </button>
              <button type="button" className="tbtn" onClick={() => setTag((t) => !t)} aria-pressed={tag} aria-label="Show or hide the title tag">
                A
              </button>
            </div>

            <div className="g-stage">
              <div className="g-scroll">
                {zoom === 1 ? (
                  <img className="g-fit" src={img(item.url, 1600)} alt={item.title} />
                ) : (
                  <img className="g-zoomed" style={{ width: `${zoom * 100}%` }} src={img(item.url, 2400)} alt={item.title} />
                )}
              </div>

              {tag && zoom === 1 && (
                <div className="g-frame" aria-hidden="true">
                  <span className="g-tag">{item.title}.</span>
                </div>
              )}

              <div className="g-icons" aria-hidden="true">
                <PixelArt sprite="monitor" size={54} />
                <PixelArt sprite="monitor" size={54} />
                <PixelArt sprite="monitor" size={54} />
              </div>

              <p className="g-caption">{item.caption || item.title}</p>
              <div className="g-scan" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}
    </Window>
  );
}
