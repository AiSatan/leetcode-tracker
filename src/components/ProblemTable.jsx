import { ExternalLink } from "lucide-react";
import { getReviewStatus } from "../utils/scheduler";
import { getPerformanceColor } from "../utils/theme";

const difficultyTone = {
  Easy:   "var(--color-status-success-main)",
  Medium: "var(--color-status-warning-main)",
  Hard:   "var(--color-status-error-main)",
};

/* A vermillion seal stamp for mastered problems. */
const Seal = ({ size = 16 }) => (
  <span
    aria-hidden="true"
    className="inline-flex items-center justify-center"
    style={{
      width: size, height: size,
      backgroundColor: "var(--color-primary-main)",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)"
    }}
  >
    <svg viewBox="0 0 12 12" width={size * 0.65} height={size * 0.65} aria-hidden="true" focusable="false">
      <path
        d="M2.5 6.4 L5 8.7 L9.5 3.5"
        fill="none"
        stroke="var(--color-text-inverted)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const StatusMark = ({ prob }) => {
  if (prob.performance === 5) {
    return (
      <span className="inline-flex items-center gap-2">
        <Seal size={14} />
        <span className="smallcaps text-text-main">Mastered</span>
      </span>
    );
  }
  if (prob.solved) {
    return (
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className="w-3 h-3 border border-text-muted/60 inline-block" />
        <span className="smallcaps text-text-muted">Learning</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="w-3 h-3 border border-dashed border-border-default inline-block" />
      <span className="smallcaps text-text-muted/70">New</span>
    </span>
  );
};

const RATING_DESCRIPTIONS = {
  1: "Forgotten",
  2: "Struggled",
  3: "Hesitant",
  4: "Solid",
  5: "Mastered",
};

const RatingRow = ({ onPick, currentScore, disabled, problemTitle }) => (
  <div
    role="radiogroup"
    aria-label={problemTitle ? `Rate ${problemTitle} (1 to 5)` : "Rate this problem (1 to 5)"}
    aria-disabled={disabled || undefined}
    className="flex gap-1"
  >
    {[1, 2, 3, 4, 5].map(rating => {
      const ink = getPerformanceColor(rating);
      const selected = currentScore === rating;
      return (
        <button
          key={rating}
          type="button"
          role="radio"
          aria-checked={selected}
          aria-label={`Score ${rating} of 5 — ${RATING_DESCRIPTIONS[rating]}`}
          disabled={disabled}
          onClick={!disabled ? () => onPick(rating) : undefined}
          className={`
            w-8 h-8 flex items-center justify-center
            display tabular text-[13px]
            border transition-all
            focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary
            ${disabled
              ? selected
                ? "text-text-inverted border-transparent"
                : "border-border-default text-text-muted/40 cursor-not-allowed"
              : "border-border-default text-text-muted hover:text-text-inverted hover:border-transparent"}
          `}
          style={{
            backgroundColor: disabled
              ? selected ? ink : "transparent"
              : undefined,
          }}
          onMouseEnter={(e) => {
            if (disabled) return;
            e.currentTarget.style.backgroundColor = ink;
          }}
          onMouseLeave={(e) => {
            if (disabled) return;
            e.currentTarget.style.backgroundColor = "";
          }}
          title={!disabled
            ? `${rating} — ${RATING_DESCRIPTIONS[rating]}`
            : `Last score: ${currentScore || "—"}`}
        >
          <span aria-hidden="true">{rating}</span>
        </button>
      );
    })}
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const ProblemTable = ({
  problems,
  progress,
  handleReview,
  filterCategory,
  filterDifficulty,
  showOnlyDueToday,
  hidePlanned,
}) => {
  const _now = new Date();
  const today = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}-${String(_now.getDate()).padStart(2, '0')}`;

  const filtered = problems.filter(problem => {
    const catMatch = filterCategory === "All" || (problem.topics || []).includes(filterCategory);
    const diffMatch = filterDifficulty === "All" || problem.difficulty === filterDifficulty;
    if (!showOnlyDueToday && !hidePlanned) return catMatch && diffMatch;

    const status = getReviewStatus(problem.id, progress);
    if (showOnlyDueToday && status !== 'due') return false;
    if (hidePlanned && status === 'future') return false;
    return catMatch && diffMatch;
  });

  return (
    <section className="mt-12">
      {/* Section masthead */}
      <header className="flex items-end justify-between border-b border-border-default pb-3 mb-1">
        <div className="flex items-baseline gap-3">
          <h2 className="display text-[26px] text-text-main">Problems</h2>
          <span className="display italic text-[13px] text-text-muted/70">課題</span>
        </div>
        <span className="smallcaps text-text-muted tabular">
          {filtered.length}<span className="opacity-50"> / {problems.length}</span>
        </span>
      </header>

      <div role="table" aria-label="Practice problems" aria-rowcount={filtered.length}>
      {/* Column header — quiet small caps */}
      <div
        role="row"
        className="hidden lg:grid grid-cols-[3rem_minmax(0,2.4fr)_minmax(0,1.4fr)_5rem_8rem_minmax(0,1.6fr)] gap-4 py-2 border-b border-border-default smallcaps text-text-muted/80"
      >
        <span role="columnheader">№</span>
        <span role="columnheader">Problem</span>
        <span role="columnheader">Topic</span>
        <span role="columnheader">Difficulty</span>
        <span role="columnheader">Status</span>
        <span role="columnheader">Review</span>
      </div>

      {filtered.length === 0 && (
        <div role="row">
          <p role="cell" className="display italic text-text-muted py-12 text-center">
            No problems match these filters. Try clearing a filter above.
          </p>
        </div>
      )}

      {filtered.map((problem, index) => {
        const prob = progress[problem.id] || {};
        const isDue = !prob.solved || (prob.nextReview && prob.nextReview <= today);
        const tagSection = problem.listMeta?.section || problem.listMeta?.module;
        const topics = problem.topics || [];
        const tags = Array.from(new Set([tagSection, ...topics].filter(Boolean)));

        return (
          <article
            key={problem.id}
            role="row"
            aria-rowindex={index + 1}
            className="grid grid-cols-1 lg:grid-cols-[3rem_minmax(0,2.4fr)_minmax(0,1.4fr)_5rem_8rem_minmax(0,1.6fr)] gap-x-4 gap-y-3 items-start py-5 border-b border-border-default"
          >
            {/* Index */}
            <span
              role="cell"
              className="display tabular text-[14px] text-text-muted/70 leading-tight pt-0.5"
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Title + link */}
            <a
              role="cell"
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-1.5 leading-tight min-w-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={`${problem.title} (opens on LeetCode in a new tab)`}
            >
              <span className="display text-[15px] text-text-main group-hover:text-primary transition-colors break-words [overflow-wrap:anywhere]">
                {problem.title}
              </span>
              <ExternalLink
                size={12}
                strokeWidth={1.5}
                aria-hidden="true"
                focusable="false"
                className="mt-1 text-text-muted/50 group-hover:text-primary transition-colors flex-shrink-0"
              />
            </a>

            {/* Tags — hairline outlines, small */}
            <div role="cell" className="flex flex-wrap gap-1.5 min-w-0">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-1.5 py-px text-[10px] border tracking-wide break-words [overflow-wrap:anywhere] ${
                    tag === tagSection
                      ? "border-border-default text-text-muted"
                      : "border-primary/40 text-primary-text"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Difficulty */}
            <span role="cell" className="flex items-center gap-1.5 text-[12px]">
              <span
                aria-hidden="true"
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: difficultyTone[problem.difficulty] }}
              />
              <span className="smallcaps" style={{ color: difficultyTone[problem.difficulty] }}>
                {problem.difficulty}
              </span>
            </span>

            {/* Status */}
            <span role="cell">
              <StatusMark prob={prob} />
            </span>

            {/* Review */}
            <div role="cell" className="flex flex-col gap-1.5">
              {isDue ? (
                <>
                  <span className="text-[10px] text-text-muted smallcaps">Rate 1–5</span>
                  <RatingRow
                    onPick={(r) => handleReview(problem.id, r)}
                    currentScore={prob.performance}
                    problemTitle={problem.title}
                  />
                </>
              ) : (
                <>
                  <span className="text-[11px] text-text-muted">
                    <span className="smallcaps text-text-muted/70">Next</span>{" "}
                    <span className="display italic tabular text-text-main">
                      {formatDate(prob.nextReview)}
                    </span>
                    <span className="text-text-muted/60 tabular"> · {prob.interval}d</span>
                  </span>
                  <RatingRow
                    onPick={() => {}}
                    currentScore={prob.performance}
                    disabled
                    problemTitle={problem.title}
                  />
                </>
              )}
            </div>
          </article>
        );
      })}
      </div>
    </section>
  );
};

export default ProblemTable;
