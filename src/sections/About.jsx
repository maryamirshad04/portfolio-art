import { useEffect, useState } from 'react';
import Window from '../components/Window.jsx';
import PixelArt from '../components/PixelArt.jsx';
import Icon from '../components/Icons.jsx';
import { site } from '../data/site.js';

const pad = (n) => String(n).padStart(2, '0');
const fmt = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

function Player({ track }) {
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(track.start ?? 0);
  const dur = track.seconds;

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => setT((v) => (v + 1) % dur), 1000);
    return () => clearInterval(id);
  }, [playing, dur]);

  return (
    <article className="mp" aria-label={track.file}>
      <header className="mp-title">
        <span className="cd" aria-hidden="true" />
        <span>Music Player</span>
        <span className="mp-x" aria-hidden="true">
          <i /><i /><i />
        </span>
      </header>
      <div className="mp-menu" aria-hidden="true">
        <span>Disc</span><span>View</span><span>Options</span><span>Help</span>
      </div>

      <div className="mp-body">
        <div className="mp-left">
          <div className="mp-cover" style={{ background: track.bg }}>
            {track.image ? (
              <img src={track.image} alt="" loading="lazy" />
            ) : (
              <PixelArt sprite={track.sprite} size="72%" />
            )}
          </div>
          <div className="mp-ctrls">
            <button type="button" className="mp-ctrl" onClick={() => setT(0)}>
              <Icon name="prev" /><span>Prev</span>
            </button>
            <button type="button" className="mp-ctrl" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing}>
              <Icon name={playing ? 'pause' : 'play'} /><span>{playing ? 'Stop' : 'Play'}</span>
            </button>
            <button type="button" className="mp-ctrl" onClick={() => setT((v) => Math.min(dur - 1, v + 30))}>
              <Icon name="next" /><span>Next</span>
            </button>
          </div>
        </div>

        <div className="mp-fields">
          <div className="mp-field mp-field--title">{track.title}</div>
          {track.fields.map((f) => (
            <div key={f.label} className="mp-row">
              <span className="mp-label">{f.label} :</span>
              <div className={`mp-field ${f.long ? 'is-long' : ''}`}>{f.value}</div>
            </div>
          ))}
        </div>

        <div className="mp-time">
          <span>{fmt(t)}</span>
          <input
            className="seek"
            type="range"
            min="0"
            max={dur}
            value={t}
            aria-label={`Seek ${track.file}`}
            onChange={(e) => setT(Number(e.target.value))}
            style={{ '--p': `${(t / dur) * 100}%` }}
          />
          <span>{fmt(dur)}</span>
        </div>
      </div>
    </article>
  );
}

export default function About({ onClose }) {
  return (
    <Window title="About Me" sprite="heart" onClose={onClose} bodyClass="about-body">
      <div className="about-grid">
        {site.tracks.map((tr) => (
          <Player key={tr.file} track={tr} />
        ))}
      </div>
    </Window>
  );
}
