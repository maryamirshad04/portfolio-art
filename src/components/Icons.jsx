const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 };

const PATHS = {
  prev: <><polygon points="8,8 14,3 14,13" /><polygon points="2,8 8,3 8,13" /></>,
  next: <><polygon points="8,8 2,3 2,13" /><polygon points="14,8 8,3 8,13" /></>,
  play: <polygon points="4,3 13,8 4,13" />,
  pause: <><rect x="3" y="3" width="4" height="10" /><rect x="9" y="3" width="4" height="10" /></>,
  back: <polygon points="11,2 4,8 11,14" />,
  forward: <polygon points="5,2 12,8 5,14" />,
  reload: <><path d="M13 8a5 5 0 1 1-1.6-3.7" {...stroke} /><polygon points="14,1 14,6 9,6" /></>,
  volume: <><polygon points="2,6 5,6 9,3 9,13 5,10 2,10" /><path d="M11.5 5.5a3.5 3.5 0 0 1 0 5" {...stroke} /></>,
  mute: <><polygon points="2,6 5,6 9,3 9,13 5,10 2,10" /><path d="M11 6l4 4M15 6l-4 4" {...stroke} /></>,
  full: <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" {...stroke} />,
};

export default function Icon({ name, size = 16 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
