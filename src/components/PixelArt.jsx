const PALETTE = {
  r: '#ff5fa8', w: '#ffe3f2', y: '#ffe66d', o: '#ffb347', p: '#ff9fd8',
  g: '#4cd68a', b: '#5b6bff', h: '#8c8cae', l: '#d9d9ea',
};

// 12x12 sprites. '.' = transparent.
const SPRITES = {
  heart: [
    '............',
    '.rrr....rrr.',
    'rrrrr..rrrrr',
    'rrwrrrrrrrrr',
    'rwrrrrrrrrrr',
    'rrrrrrrrrrrr',
    '.rrrrrrrrrr.',
    '..rrrrrrrr..',
    '...rrrrrr...',
    '....rrrr....',
    '.....rr.....',
    '............',
  ],
  star: [
    '.....yy.....',
    '.....yy.....',
    '....yyyy....',
    '....yyyy....',
    'yyyyyyyyyyyy',
    '.yyyyyyyyyy.',
    '..yyyyyyyy..',
    '...yyyyyy...',
    '..oooooooo..',
    '..ooo..ooo..',
    '.ooo....ooo.',
    '.oo......oo.',
  ],
  flower: [
    '.....pp.....',
    '....pppp....',
    '.pp..pp..pp.',
    'pppp.pp.pppp',
    '.ppppyyppp..',
    '..ppyyyypp..',
    '..ppyyyypp..',
    '.ppppyypppp.',
    'pppp.pp.pppp',
    '.pp..gg..pp.',
    '.....gg.gg..',
    '.....gg.....',
  ],
  monitor: [
    '............',
    '.hhhhhhhhhh.',
    '.hbbbbbbbbh.',
    '.hbwwbbbbbh.',
    '.hbwbbbbbbh.',
    '.hbbbbbbbbh.',
    '.hbbbbbbbbh.',
    '.hhhhhhhhhh.',
    '....hhhh....',
    '...hhhhhh...',
    '..llllllll..',
    '............',
  ],
};

export default function PixelArt({ sprite = 'heart', size = 48, className = '' }) {
  const rows = SPRITES[sprite] || SPRITES.heart;
  const rects = [];
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const fill = PALETTE[ch];
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill} />);
    }),
  );
  return (
    <svg
      className={`pixel ${className}`}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}
