import { useEffect, useState } from 'react';
import PixelArt from './PixelArt.jsx';

// Bottom bar: start (goes home), one button per window, a clock.
export default function Taskbar({ tabs, active, onGo }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="taskbar">
      <button type="button" className="start" onClick={() => onGo(tabs[0].id)} aria-label="Start: go to About">
        <PixelArt sprite="heart" size={22} />
        <span>start</span>
      </button>

      <nav className="tasks" aria-label="Sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`task ${active === t.id ? 'is-active' : ''}`}
            onClick={() => onGo(t.id)}
            aria-current={active === t.id ? 'page' : undefined}
          >
            <PixelArt sprite={t.sprite} size={20} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <time className="tray" dateTime={now.toISOString()}>
        {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      </time>
    </footer>
  );
}
