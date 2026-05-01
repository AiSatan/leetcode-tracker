import { useTheme } from "../context/ThemeContext";

/**
 * Drifting cherry petals — dark mode only.
 *
 * Fixed-position SVG layer behind page content. Each petal has its own
 * column, duration, delay, scale and rotation so the loop never feels
 * synchronized. Respects prefers-reduced-motion via the global rule
 * in index.css (animations collapse to ~0ms).
 */
const PETALS = [
  { left: "4%",  size: 13, duration: 22, delay: -2,  drift: 5,  swayMs: 5800, opacity: 0.55 },
  { left: "14%", size: 10, duration: 28, delay: -10, drift: 9,  swayMs: 6400, opacity: 0.45 },
  { left: "26%", size: 16, duration: 25, delay: -6,  drift: 4,  swayMs: 7200, opacity: 0.6  },
  { left: "38%", size: 11, duration: 30, delay: -14, drift: 7,  swayMs: 6000, opacity: 0.42 },
  { left: "52%", size: 18, duration: 27, delay: -3,  drift: 6,  swayMs: 7500, opacity: 0.55 },
  { left: "64%", size: 12, duration: 24, delay: -18, drift: 8,  swayMs: 5400, opacity: 0.5  },
  { left: "76%", size: 14, duration: 32, delay: -8,  drift: 5,  swayMs: 6800, opacity: 0.48 },
  { left: "88%", size: 10, duration: 26, delay: -12, drift: 10, swayMs: 5200, opacity: 0.4  },
];

const PetalSvg = ({ size }) => (
  <svg
    viewBox="0 0 20 20"
    width={size}
    height={size}
    aria-hidden="true"
    focusable="false"
  >
    {/* Two halves with a slight indent at the tip — reads as a cherry petal */}
    <path
      d="M10 1
         C 14.5 4 17 8.5 14.5 17
         C 12.5 16 10.8 13 10.6 9
         C 10.4 5 10 1 10 1 Z
         M10 1
         C 5.5 4 3 8.5 5.5 17
         C 7.5 16 9.2 13 9.4 9
         C 9.6 5 10 1 10 1 Z"
      fill="currentColor"
    />
  </svg>
);

const SakuraBackground = () => {
  const { isDark } = useTheme();
  if (!isDark) return null;
  return (
    <div aria-hidden="true" className="sakura-layer">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="sakura-petal"
          style={{
            left: p.left,
            opacity: p.opacity,
            "--sakura-duration": `${p.duration}s`,
            "--sakura-delay": `${p.delay}s`,
            "--sakura-drift": `${p.drift}vw`,
            "--sakura-sway": `${p.swayMs}ms`,
          }}
        >
          <PetalSvg size={p.size} />
        </span>
      ))}
    </div>
  );
};

export default SakuraBackground;
