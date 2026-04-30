import { Link, useLocation } from "react-router-dom";
import { Github, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NAV = [
  { to: "/",         label: "Practice"  },
  { to: "/patterns", label: "Patterns"  },
  { to: "/roadmap",  label: "Path"      }
];

const SealMark = () => (
  // A vermillion seal-stamp brand mark, drawn as SVG so it never depends on font fallback.
  // Square block, inset stroke, two horizontal "ink bars" inside.
  <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden>
    <rect x="0.5" y="0.5" width="31" height="31"
          fill="var(--color-primary-main)" stroke="var(--color-primary-main)" />
    <rect x="3" y="3" width="26" height="26" fill="none"
          stroke="var(--color-text-inverted)" strokeOpacity="0.30" strokeWidth="0.6" />
    <rect x="9"  y="9"  width="14" height="2.5" fill="var(--color-text-inverted)" />
    <rect x="9"  y="14" width="9"  height="2.5" fill="var(--color-text-inverted)" opacity="0.85" />
    <rect x="9"  y="20" width="14" height="2.5" fill="var(--color-text-inverted)" />
  </svg>
);

const ThemeToggle = ({ isDark, onToggle }) => (
  // Two-side toggle: sun on the left for paper, moon on the right for ink.
  // Active side fills vermillion; inactive sits on the subtle bg.
  <button
    type="button"
    onClick={onToggle}
    aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    title={`Switch to ${isDark ? "light" : "dark"} mode`}
    className="inline-flex items-center border border-border-default hover:border-primary transition-colors"
  >
    <span
      className="flex items-center justify-center w-7 h-7 transition-colors"
      style={{
        backgroundColor: isDark ? "transparent" : "var(--color-primary-main)",
        color: isDark ? "var(--color-text-muted)" : "var(--color-text-inverted)",
      }}
    >
      <Sun size={13} strokeWidth={1.6} />
    </span>
    <span
      className="flex items-center justify-center w-7 h-7 transition-colors border-l border-border-default"
      style={{
        backgroundColor: isDark ? "var(--color-primary-main)" : "transparent",
        color: isDark ? "var(--color-text-inverted)" : "var(--color-text-muted)",
      }}
    >
      <Moon size={13} strokeWidth={1.6} />
    </span>
  </button>
);

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="bg-background-page border-b border-border-default">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <SealMark />
          <div className="flex flex-col leading-none">
            <span className="display text-[19px] tracking-tight text-text-main">
              Codetrack
            </span>
            <span className="smallcaps text-text-muted mt-1">Practice · 稽古</span>
          </div>
        </Link>

        {/* Center nav — smallcaps, hairline-from-below on active */}
        <div className="hidden sm:flex items-center gap-8">
          {NAV.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="relative py-1.5 smallcaps transition-colors"
                style={{
                  color: active ? "var(--color-text-main)" : "var(--color-text-muted)"
                }}
              >
                {label}
                <span
                  className="absolute left-0 right-0 -bottom-px h-px transition-opacity"
                  style={{
                    backgroundColor: "var(--color-primary-main)",
                    opacity: active ? 1 : 0
                  }}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          <a
            href="https://github.com/AiSatan/leetcode-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-main transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="sm:hidden border-t border-border-default">
        <div className="max-w-[1280px] mx-auto px-6 h-11 flex items-center gap-6">
          {NAV.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="smallcaps"
                style={{
                  color: active ? "var(--color-text-main)" : "var(--color-text-muted)"
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
