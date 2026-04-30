/**
 * Progress Overview — journal-style mastery card.
 * Thin sumi base ring with a thicker vermillion arc for completion.
 */
const CircularProgress = ({ mastered, total, size = 88 }) => {
  const pct = total > 0 ? (mastered / total) * 100 : 0;
  const stroke = 3.5;
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="relative tabular" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="var(--color-border-default)" strokeWidth={stroke} fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="var(--color-primary-main)" strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="butt"
          style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="display text-[22px] text-text-main">{mastered}</span>
        <span className="text-[10px] text-text-muted mt-0.5">/ {total}</span>
      </div>
    </div>
  );
};

const Bar = ({ label, n, of, tone }) => {
  const pct = of > 0 ? (n / of) * 100 : 0;
  return (
    <div className="grid grid-cols-[3.5rem_1fr_2.6rem] items-center gap-2">
      <span className="smallcaps text-text-muted">{label}</span>
      <span className="relative h-px bg-border-default block">
        <span
          className="absolute left-0 top-0 h-px transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: tone }}
        />
      </span>
      <span className="text-[11px] text-text-muted text-right tabular">
        {n}<span className="text-text-muted/60"> / {of}</span>
      </span>
    </div>
  );
};

const CircularStatsCard = ({ stats, problems }) => {
  const totalEasy   = problems.filter(p => p.difficulty === "Easy").length;
  const totalMedium = problems.filter(p => p.difficulty === "Medium").length;
  const totalHard   = problems.filter(p => p.difficulty === "Hard").length;
  const due = stats.dueToday || 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="smallcaps text-text-muted">Progress</h3>
        <span className="text-[10px] text-text-muted/70 display italic">進捗</span>
      </div>

      <div className="flex items-center gap-5 mb-5">
        <CircularProgress mastered={stats.mastered} total={stats.total} />
        <div className="flex flex-col">
          <span className="display text-[34px] leading-none tabular text-text-main">
            {Math.round((stats.mastered / Math.max(1, stats.total)) * 100)}
            <span className="text-text-muted text-[18px] ml-0.5">%</span>
          </span>
          <span className="smallcaps text-text-muted mt-1.5">Mastered</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <Bar label="Easy"   n={stats.easy}   of={totalEasy}   tone="var(--color-status-success-main)" />
        <Bar label="Medium" n={stats.medium} of={totalMedium} tone="var(--color-status-warning-main)" />
        <Bar label="Hard"   n={stats.hard}   of={totalHard}   tone="var(--color-status-error-main)" />
      </div>

      <div className="rule-x pt-3 mt-1 flex items-baseline gap-2">
        <span className="display tabular text-[20px] text-primary leading-none">{due}</span>
        <span className="smallcaps text-text-muted">Due today</span>
      </div>
    </div>
  );
};

export default CircularStatsCard;
