import { CheckCircle2, Circle, Calendar, ExternalLink, Minus, Star } from "lucide-react";
import { getReviewStatus } from "../utils/scheduler";
import { getPerformanceColor } from "../utils/theme";

const difficultyColor = {
  Easy: "text-green-600",
  Medium: "text-yellow-600",
  Hard: "text-red-600",
};

const ProblemTable = ({
  problems,
  progress,
  handleReview,
  filterCategory,
  filterDifficulty,
  showOnlyDueToday,
}) => {
  const today = new Date().toISOString().split("T")[0];

  const filteredProblems = problems.filter((problem) => {
    const categoryMatch =
      filterCategory === "All" ||
      (problem.topics || []).includes(filterCategory);

    const difficultyMatch =
      filterDifficulty === "All" || problem.difficulty === filterDifficulty;

    if (!showOnlyDueToday) return categoryMatch && difficultyMatch;

    const status = getReviewStatus(problem.id, progress);
    return categoryMatch && difficultyMatch && status === 'due';
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Problems
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-16">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[200px]">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[200px]">
                Reviews & Due Dates
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProblems.map((problem, index) => {
              const prob = progress[problem.id] || {};
              return (
                <tr
                  key={problem.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-1"
                        title={`Open ${problem.name} on NeetCode`}
                      >
                        <span className="line-clamp-2">{problem.title}</span>
                        <ExternalLink size={14} className="flex-shrink-0" />
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex flex-wrap gap-1.5 max-w-[192px]">
                      {problem.listMeta?.section || problem.listMeta?.module ? (
                        <span
                          className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
                          title="Category"
                        >
                          {problem.listMeta.section || problem.listMeta.module}
                        </span>
                      ) : null}
                      {(problem.topics || []).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded"
                          title="Topic"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm font-semibold ${difficultyColor[problem.difficulty]
                      }`}
                  >
                    {problem.difficulty}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      {prob.solved ? (
                        <CheckCircle2
                          className="text-green-600 dark:text-green-500"
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
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Rate how well you did:
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => {
                            const color = getPerformanceColor(rating);
                            return (
                              <button
                                key={rating}
                                onClick={() => handleReview(problem.id, rating)}
                                className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold text-white transition-all transform hover:scale-110 shadow-sm"
                                style={{ backgroundColor: color }}
                                title={`Rate ${rating}/5`}
                              >
                                {rating}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 opacity-75">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Last Score:
                          </span>
                          <span className="text-xs text-gray-400">
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
                                  w-8 h-8 rounded flex items-center justify-center text-sm font-bold transition-all
                                  cursor-not-allowed
                                  ${!isSelected ? 'opacity-30' : 'ring-2 ring-offset-1 ring-gray-400 dark:ring-gray-600'}
                                `}
                                style={{
                                  backgroundColor: isSelected ? color : (prob.performance ? getPerformanceColor(prob.performance) : undefined)
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
