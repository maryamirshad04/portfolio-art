import { useRef, useState } from 'react';
import Window from '../components/Window.jsx';
import Icon from '../components/Icons.jsx';
import StaticCanvas from '../components/StaticCanvas.jsx';
import { useMedia } from '../hooks/useMedia.js';
import { mmss, niceDate, posterOf, vid } from '../lib/media.js';
import { site } from '../data/site.js';

function Thumb({ item }) {
  const [bad, setBad] = useState(false);
  const src = posterOf(item, 320);
  if (!src || bad) return <span className="thumb-fallback">no preview</span>;
  return <img src={src} alt="" loading="lazy" onError={() => setBad(true)} />;
}

function Player({ item }) {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(item.duration || 0);
  const [muted, setMuted] = useState(false);
  const hasVideo = Boolean(item.url);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const fullscreen = () => {
    const wrap = wrapRef.current;
    const v = videoRef.current;
    if (wrap?.requestFullscreen) wrap.requestFullscreen().catch(() => {});
    else if (v?.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iPhone Safari
  };

  return (
    <div className="player-wrap" ref={wrapRef}>
      <div className="player">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={vid(item.url)}
            poster={posterOf(item, 960)}
            playsInline
            preload="metadata"
            muted={muted}
            onClick={toggle}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
          />
        ) : (
          <div className="no-signal">
            <StaticCanvas />
            <span>no signal</span>
          </div>
        )}
      </div>

      <div className="player-bar">
        <button type="button" className="pbtn" onClick={toggle} disabled={!hasVideo} aria-label={playing ? 'Pause' : 'Play'}>
          <Icon name={playing ? 'pause' : 'play'} />
        </button>
        <input
          className="seek"
          type="range"
          min="0"
          max={dur || 0}
          step="0.1"
          value={Math.min(cur, dur || 0)}
          disabled={!hasVideo}
          aria-label="Seek"
          onChange={(e) => {
            if (videoRef.current) videoRef.current.currentTime = Number(e.target.value);
          }}
          style={{ '--p': dur ? `${(cur / dur) * 100}%` : '0%' }}
        />
        <span className="ptime">
          {mmss(cur)} / {mmss(dur)}
        </span>
        <button type="button" className="pbtn" onClick={() => setMuted((m) => !m)} disabled={!hasVideo} aria-label={muted ? 'Unmute' : 'Mute'}>
          <Icon name={muted ? 'mute' : 'volume'} />
        </button>
        <button type="button" className="pbtn" onClick={fullscreen} disabled={!hasVideo} aria-label="Fullscreen">
          <Icon name="full" />
        </button>
      </div>
    </div>
  );
}

export default function Animations({ onClose, onGo }) {
  const { items, loading, demo } = useMedia('animation');
  const [i, setI] = useState(0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const item = items[i];
  const [logoA, logoB] = site.tubeLogo;

  const share = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/#animation`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: ignore */
    }
  };

  const pick = (idx) => {
    setI(idx);
    setLiked(false);
  };

  return (
    <Window title={`${logoA}${logoB}`} sprite="star" onClose={onClose} note={demo ? 'sample clips (demo mode)' : undefined} bodyClass="tube-body">
      <div className="browser-bar">
        <span className="nav-btn" aria-hidden="true"><Icon name="back" /></span>
        <span className="nav-btn" aria-hidden="true"><Icon name="forward" /></span>
        <span className="nav-btn" aria-hidden="true"><Icon name="reload" /></span>
        <div className="address" aria-hidden="true">
          http://www.{site.url}/watch?v={item ? String(item.publicId || item.id).split('/').pop() : ''}
        </div>
      </div>
      <div className="bookmarks">
        <button type="button" onClick={() => onGo('about')}>About</button>
        <button type="button" onClick={() => onGo('art')}>Stills</button>
      </div>

      <div className="tube">
        <div className="tube-head">
          <span className="logo">{logoA}<b>{logoB}</b></span>
          <span className="tube-search" aria-hidden="true" />
          <span className="tube-links" aria-hidden="true">Browse&nbsp;&nbsp;Upload</span>
        </div>

        {loading || !item ? (
          <p className="loading dark">loading videos<span className="blink">_</span></p>
        ) : (
          <div className="tube-grid">
            <div className="tube-main">
              <h2 className="tube-title">{item.title}</h2>
              <p className="tube-by">by <b>{site.name}</b> &middot; {items.length} {items.length === 1 ? 'video' : 'videos'}</p>

              <Player key={item.publicId || item.id} item={item} />

              <div className="tube-desc">
                <p className="tube-date">{niceDate(item.createdAt)}</p>
                <p>{item.caption || 'no description yet.'}</p>
              </div>

              <div className="tube-actions">
                <button type="button" className={`tube-btn ${liked ? 'is-on' : ''}`} onClick={() => setLiked((l) => !l)} aria-pressed={liked}>
                  {liked ? 'Liked!' : 'Like'}
                </button>
                <button type="button" className="tube-btn" onClick={share}>
                  {copied ? 'Link copied!' : 'Share'}
                </button>
              </div>
            </div>

            <aside className="tube-next" aria-label="More animations">
              <h3>More animations</h3>
              <ul>
                {items.map((it, idx) => (
                  <li key={it.publicId || it.id}>
                    <button type="button" className={`next-item ${idx === i ? 'is-active' : ''}`} onClick={() => pick(idx)} aria-current={idx === i ? 'true' : undefined}>
                      <span className="next-thumb">
                        <Thumb item={it} />
                        {it.duration ? <span className="dur">{mmss(it.duration)}</span> : null}
                      </span>
                      <span className="next-text">
                        <b>{it.title}</b>
                        <small>{niceDate(it.createdAt)}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        )}
      </div>
    </Window>
  );
}
