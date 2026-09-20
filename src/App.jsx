import { useCallback, useEffect, useState } from 'react';
import TVIntro from './components/TVIntro.jsx';
import Taskbar from './components/Taskbar.jsx';
import Bubbles from './components/Bubbles.jsx';
import About from './sections/About.jsx';
import Gallery from './sections/Gallery.jsx';
import Animations from './sections/Animations.jsx';

const TABS = [
  { id: 'about', label: 'About', sprite: 'heart' },
  { id: 'art', label: 'Stills', sprite: 'flower' },
  { id: 'animation', label: 'Animation', sprite: 'star' },
];

const fromHash = () => {
  const h = window.location.hash.replace('#', '');
  return TABS.some((t) => t.id === h) ? h : 'about';
};

export default function App() {
  const [stage, setStage] = useState('tv'); // 'tv' | 'desk'
  const [tab, setTab] = useState(fromHash);

  useEffect(() => {
    const onHash = () => setTab(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = useCallback((id) => {
    setTab(id);
    window.history.replaceState(null, '', `#${id}`);
  }, []);

  const shutdown = useCallback(() => setStage('tv'), []);

  if (stage === 'tv') return <TVIntro onEnter={() => setStage('desk')} />;

  return (
    <div className="desk">
      <Bubbles />
      <main className="stage">
        {tab === 'about' && <About onClose={shutdown} />}
        {tab === 'art' && <Gallery onClose={shutdown} />}
        {tab === 'animation' && <Animations onClose={shutdown} onGo={go} />}
      </main>
      <Taskbar tabs={TABS} active={tab} onGo={go} />
    </div>
  );
}
