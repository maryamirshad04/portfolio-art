import { useState } from 'react';
import PixelArt from './PixelArt.jsx';
import { site } from '../data/site.js';

export default function Window({ title, sprite = 'heart', menu = [], note, onClose, className = '', bodyClass = '', children }) {
  const [wiggle, setWiggle] = useState(false);
  const bump = () => {
    setWiggle(true);
    setTimeout(() => setWiggle(false), 420);
  };

  const ticker = `mood: ${site.mood}   ♥   now playing: ${site.nowPlaying}`;

  return (
    <section className={`win ${wiggle ? 'win-wiggle' : ''} ${className}`} aria-label={title}>
      <header className="win-title">
        <PixelArt sprite={sprite} size={20} />
        <h1 className="win-name">{title}</h1>
        <div className="win-btns">
          <button type="button" className="wbtn" aria-label="Minimize (it just wiggles)" onClick={bump}>
            <span className="g g-min" />
          </button>
          <button type="button" className="wbtn" aria-label="Maximize (it just wiggles)" onClick={bump}>
            <span className="g g-max" />
          </button>
          <button
            type="button"
            className="wbtn"
            aria-label="Close: turns the TV off and replays the intro"
            title="Close turns the TV off"
            onClick={onClose}
          >
            <span className="g g-x" />
          </button>
        </div>
      </header>

      {menu.length > 0 && (
        <div className="win-menu" aria-hidden="true">
          {menu.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}

      <div className={`win-body ${bodyClass}`}>{children}</div>

      <footer className="win-status">
        <span className="online">
          <i className="dot" /> online now
        </span>
        <div className="marquee" aria-label={ticker}>
          <div className="marquee-track" aria-hidden="true">
            <span>{ticker}</span>
            <span>{ticker}</span>
          </div>
        </div>
        {note && <span className="status-note">{note}</span>}
      </footer>
    </section>
  );
}
