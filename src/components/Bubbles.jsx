// Slow bubbles drifting up behind the windows (the underwater desktop wallpaper).
const BUBBLES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 53 + 9) % 100,
  size: 16 + ((i * 29) % 48),
  delay: -((i * 7) % 26),
  dur: 20 + ((i * 5) % 18),
}));

export default function Bubbles() {
  return (
    <div className="bubbles" aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
