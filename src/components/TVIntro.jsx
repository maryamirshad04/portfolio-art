import { useEffect, useRef, useState } from 'react';
import StaticCanvas from './StaticCanvas.jsx';
import PixelArt from './PixelArt.jsx';
import { site } from '../data/site.js';

// off -> on (screen opens + static) -> live (name page) -> zoom (into the screen)
export default function TVIntro({ onEnter }) {
  const [stage, setStage] = useState('off');
  const timers = useRef([]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setStage('live');
      return undefined;
    }
    timers.current = [setTimeout(() => setStage('on'), 600), setTimeout(() => setStage('live'), 2700)];
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const skip = () => {
    timers.current.forEach(clearTimeout);
    setStage((s) => (s === 'live' || s === 'zoom' ? s : 'live'));
  };

  const enter = () => {
    if (stage !== 'live') return;
    setStage('zoom');
    timers.current.push(setTimeout(onEnter, 750));
  };

  const powered = stage !== 'off';

  return (
    <div className={`tv-scene stage-${stage} ${powered ? 'powered' : ''}`}>
      <div className="tv" style={{ '--chars': Math.max(site.name.length, 6) }}>
        <div className="tv-body" />

        <div className="tv-well">
          <div className="tv-screen">
            <div className="tv-crt">
              <div className="tv-live" aria-hidden={stage !== 'live' && stage !== 'zoom'}>
                <span className="osd">CH 03</span>
                <p className="live-hello">hi, i'm</p>
                <h1 className="live-name">{site.name}</h1>
                <p className="live-tag">{site.tagline}</p>
                <button type="button" className="live-enter" onClick={enter} disabled={stage !== 'live'}>
                  ▶ enter my room
                </button>
              </div>

              {stage === 'on' && (
                <div className="tv-static-wrap">
                  <StaticCanvas className="tv-static" />
                  <div className="tv-roll" />
                </div>
              )}

              <div className="tv-glass" />
            </div>
          </div>
        </div>

        <div className="tv-panel" aria-hidden={stage === 'live'}>
          <div className="tv-display"><span>03</span></div>
          <div className="tv-pills"><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="tv-display tv-display--small"><span>PM</span></div>
          <div className="tv-slider"><b /><b /></div>
          <div className="tv-sticker"><PixelArt sprite="heart" size="100%" /></div>
          <span className="tv-led" />
          <button
            type="button"
            className="tv-knob"
            aria-label="Skip the intro"
            onClick={skip}
            disabled={stage === 'live' || stage === 'zoom'}
          />
        </div>
      </div>

      <p className="tv-hint" aria-hidden="true">
        {stage === 'live' || stage === 'zoom' ? '' : 'click the knob to skip'}
      </p>
    </div>
  );
}
