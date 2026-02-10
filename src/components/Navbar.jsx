import { Link } from "react-router-dom";
import { Github, Star, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-background-surface shadow mb-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex gap-3 sm:gap-6">
          <Link
            to="/"
            className="font-bold text-primary hover:text-primary-hover transition"
          >
            Tracker
          </Link>
          <Link
            to="/patterns"
            className="font-bold text-primary hover:text-primary-hover transition"
          >
            Patterns
          </Link>
          <Link
            to="/roadmap"
            className="font-bold text-primary hover:text-primary-hover transition"
          >
            Roadmap
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 flex items-center justify-center rounded bg-background-subtle hover:bg-background-highlight transition-all duration-300"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={20} className="text-status-warning animate-spin-slow" />
            ) : (
              <Moon size={20} className="text-text-muted" />
            )}
          </button>

          {/* GitHub Button */}
          <a
            href="https://github.com/AiSatan/leetcode-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 flex items-center gap-2 px-4 py-2 border border-border-default bg-background-subtle text-text-muted rounded font-semibold transition-all duration-300 hover:bg-background-highlight hover:text-text-main"
          >
            <Github size={20} />
            <span className="hidden sm:inline">
              Star on GitHub
            </span>
            <Star size={16} />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
