import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { getReviewStatus } from "../utils/scheduler";
import { getPerformanceColor } from "../utils/theme";

const difficultyColor = {
  Easy: "text-status-success",
  Medium: "text-status-warning",
  Hard: "text-status-error",
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
  const today = new Date().toISOString().split("T")[0];

  const filteredProblems = problems.filter((problem) => {
    const categoryMatch =
      filterCategory === "All" ||
      (problem.topics || []).includes(filterCategory);

    const difficultyMatch =
      filterDifficulty === "All" || problem.difficulty === filterDifficulty;

    if (!showOnlyDueToday && !hidePlanned) return categoryMatch && difficultyMatch;

    const status = getReviewStatus(problem.id, progress);

    if (showOnlyDueToday && status !== 'due') return false;

    // "Hide Planned" hides problems that are solved and scheduled for the future
    // (i.e. their stars are disabled because they aren't due yet)
    if (hidePlanned && status === 'future') return false;

    return categoryMatch && difficultyMatch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-background-surface rounded-lg shadow-lg p-6 transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-text-main">
        Problems
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-default">
          <thead className="bg-background-subtle">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider w-16">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider min-w-[200px]">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider w-40">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider w-24">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider w-32">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider min-w-[200px]">
                Reviews & Due Dates
              </th>
            </tr>
          </thead>
          <tbody className="bg-background-surface divide-y divide-border-default">
            {filteredProblems.map((problem, index) => {
              const prob = progress[problem.id] || {};
              return (
                <tr
                  key={problem.id}
                  className=""
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-text-main">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 text-sm text-text-main">
                    <div className="flex items-center gap-2">
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-hover hover:underline flex items-center gap-1"
                        title={`Open ${problem.name} on NeetCode`}
                      >
                        <span className="line-clamp-2">{problem.title}</span>
                        <ExternalLink size={14} className="flex-shrink-0" />
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-text-main">
                    <div className="flex flex-wrap gap-1.5 max-w-[192px]">
                      {(() => {
                        const section = problem.listMeta?.section || problem.listMeta?.module;
                        const topics = problem.topics || [];
                        const uniqueTags = new Set();

                        if (section) uniqueTags.add(section);
                        topics.forEach(t => uniqueTags.add(t));

                        return Array.from(uniqueTags).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 text-xs rounded ${tag === section
                              ? "bg-background-subtle text-text-muted border border-border-default"
                              : "bg-primary-light text-primary-text"
                              }`}
                            title="Category/Topic"
                          >
                            {tag}
                          </span>
                        ));
                      })()}
                    </div>
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm font-semibold ${difficultyColor[problem.difficulty]}`}
                  >
                    {problem.difficulty}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-text-muted">
                      {prob.solved ? (
                        <CheckCircle2
                          className="text-status-success"
                          size={20}
                        />
                      ) : (
                        <Circle size={20} />
                      )}
                      <span className="text-xs">
                        {prob.solved ? "Solved" : "Not Solved"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {/* Review Actions */}
                    {(!prob.solved || (prob.nextReview && prob.nextReview <= today)) ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-text-muted mb-1">
                          Rate how well you did:
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => {
                            const color = getPerformanceColor(rating);
                            return (
                              <button
                                key={rating}
                                onClick={() => handleReview(problem.id, rating)}
                                className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold text-gray-300 transition-all transform hover:scale-110"
                                style={{ backgroundColor: color }}
                                title={`Rate ${rating}/5`}
                              >
                                {rating}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 opacity-75">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-text-muted">
                            Last Score:
                          </span>
                          <span className="text-xs text-text-muted">
                            Next: {formatDate(prob.nextReview)} ({prob.interval}d)
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => {
                            const isSelected = prob.performance === rating;
                            const color = getPerformanceColor(rating);
                            return (
                              <button
                                key={rating}
                                disabled
                                className={`
                                  w-8 h-8 rounded-sm flex items-center justify-center text-sm font-bold transition-all
                                  cursor-not-allowed
                                  ${isSelected ? 'text-gray-300' : 'bg-striped opacity-40'}
                                `}
                                style={{
                                  backgroundColor: isSelected ? color : undefined
                                }}
                                title={`Last rating: ${prob.performance || 'N/A'}`}
                              >
                                {isSelected ? rating : ''}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemTable;
