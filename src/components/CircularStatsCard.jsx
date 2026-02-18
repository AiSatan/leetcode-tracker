const CircularProgress = ({ mastered, total, size = 80 }) => {
  const percentage = total > 0 ? (mastered / total) * 100 : 0;
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="7"
          fill="none"
          className="text-border-default"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="7"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-xs font-bold text-text-main">
          {mastered}/{total}
        </div>
      </div>
    </div>
  );
};

const CircularStatsCard = ({ stats, problems, compact }) => {
  const totalEasy = problems.filter((p) => p.difficulty === "Easy").length;
  const totalMedium = problems.filter((p) => p.difficulty === "Medium").length;
  const totalHard = problems.filter((p) => p.difficulty === "Hard").length;

  if (compact) {
    return (
      <div className="flex flex-col items-center text-center w-40">
        <h2 className="text-sm font-semibold mb-2 text-text-main">
          Progress Overview
        </h2>
        <CircularProgress mastered={stats.mastered} total={stats.total} size={64} />
        <div className="text-xs text-text-muted mt-1.5 mb-2">
          <span className="text-primary font-semibold">{stats.dueToday || 0} due today</span>
        </div>
        <div className="w-full space-y-1.5">
          {/* Easy */}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-status-success flex-shrink-0"></div>
            <div className="flex-1 bg-background-subtle rounded-full h-1">
              <div
                className="bg-status-success h-1 rounded-full transition-all duration-500"
                style={{ width: `${totalEasy > 0 ? (stats.easy / totalEasy) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-text-muted w-8 text-right">{stats.easy}/{totalEasy}</span>
          </div>
          {/* Medium */}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-status-warning flex-shrink-0"></div>
            <div className="flex-1 bg-background-subtle rounded-full h-1">
              <div
                className="bg-status-warning h-1 rounded-full transition-all duration-500"
                style={{ width: `${totalMedium > 0 ? (stats.medium / totalMedium) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-text-muted w-8 text-right">{stats.medium}/{totalMedium}</span>
          </div>
          {/* Hard */}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-status-error flex-shrink-0"></div>
            <div className="flex-1 bg-background-subtle rounded-full h-1">
              <div
                className="bg-status-error h-1 rounded-full transition-all duration-500"
                style={{ width: `${totalHard > 0 ? (stats.hard / totalHard) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-text-muted w-8 text-right">{stats.hard}/{totalHard}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-surface rounded-lg shadow-lg p-4 mb-4 transition-colors">
      <h2 className="text-sm font-semibold mb-3 text-text-main">
        Progress Overview
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <CircularProgress mastered={stats.mastered} total={stats.total} />
        </div>

        <div className="flex-1 w-full space-y-4">
          {/* Easy */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-3 h-3 rounded-full bg-status-success"></div>
              <span className="text-text-muted font-medium">
                Easy
              </span>
            </div>
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 bg-background-subtle rounded-full h-2">
                <div
                  className="bg-status-success h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalEasy > 0 ? (stats.easy / totalEasy) * 100 : 0
                      }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-text-main min-w-[60px] text-right">
                {stats.easy}/{totalEasy}
              </span>
            </div>
          </div>

          {/* Medium */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-3 h-3 rounded-full bg-status-warning"></div>
              <span className="text-text-muted font-medium">
                Medium
              </span>
            </div>
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 bg-background-subtle rounded-full h-2">
                <div
                  className="bg-status-warning h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalMedium > 0 ? (stats.medium / totalMedium) * 100 : 0
                      }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-text-main min-w-[60px] text-right">
                {stats.medium}/{totalMedium}
              </span>
            </div>
          </div>

          {/* Hard */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-3 h-3 rounded-full bg-status-error"></div>
              <span className="text-text-muted font-medium">
                Hard
              </span>
            </div>
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 bg-background-subtle rounded-full h-2">
                <div
                  className="bg-status-error h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalHard > 0 ? (stats.hard / totalHard) * 100 : 0
                      }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-text-main min-w-[60px] text-right">
                {stats.hard}/{totalHard}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-4 pt-4 border-t border-border-default">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary-light rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">
              {stats.dueToday || 0}
            </div>
            <div className="text-sm text-text-muted">
              Due Today
            </div>
          </div>
          <div className="bg-primary-light rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">
              {Math.round((stats.mastered / stats.total) * 100) || 0}%
            </div>
            <div className="text-sm text-text-muted">
              Completion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularStatsCard;
