import { useState, useEffect } from "react";
import { Info, ExternalLink, Map } from "lucide-react";
import { scheduleReview } from "../utils/scheduler";
import {
  Filters,
  StatsCard,
  ProblemTable,
  ExportImportControls,
  CircularStatsCard,
  DailyProgress,
} from "../components";
import { blind75, leetcode75, neetcode150 } from "../data";

const problemLists = {
  "Blind 75": blind75,
  "LeetCode 75": leetcode75,
  "NeetCode 150": neetcode150,
};

// Roadmap URLs for each list
const roadmapLinks = {
  "Blind 75": "https://leetcode.com/problem-list/oizxjoit/",
  "LeetCode 75": "https://leetcode.com/studyplan/leetcode-75/",
  "NeetCode 150": "https://neetcode.io/roadmap",
};

const LeetCodeTracker = () => {
  // --- Local state with localStorage ---
  const [progress, setProgress] = useState(() => {
    try {
      const savedProgress = localStorage.getItem("leetcode-progress-v2");
      return savedProgress
        ? JSON.parse(savedProgress)
        : {
          "Blind 75": {},
          "LeetCode 75": {},
          "NeetCode 150": {},
        };
    } catch (error) {
      console.error("Error loading progress from localStorage:", error);
      return {
        "Blind 75": {},
        "LeetCode 75": {},
        "NeetCode 150": {},
      };
    }
  });

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [showOnlyDueToday, setShowOnlyDueToday] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  // --- Local state with localStorage ---
  const [selectedList, setSelectedList] = useState(() => {
    try {
      return localStorage.getItem("leetcode-tracker-selected-list") || "NeetCode 150";
    } catch (error) {
      console.error("Error loading selected list from localStorage:", error);
      return "NeetCode 150";
    }
  });

  // Save selected list to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("leetcode-tracker-selected-list", selectedList);
    } catch (error) {
      console.error("Error saving selected list to localStorage:", error);
    }
  }, [selectedList]);


  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("leetcode-progress-v2", JSON.stringify(progress));
    } catch (error) {
      console.error("Error saving progress to localStorage:", error);
    }
  }, [progress]);


  // --- Helpers ---
  const today = new Date().toISOString().split("T")[0];

  const handleReview = (problemId, performance) => {
    setProgress((prev) => {
      const listProgress = prev[selectedList] || {};
      const current = listProgress[problemId];
      const problem = problems.find(p => p.id === problemId) || { difficulty: "Medium" };

      // Returns a map of updates: { [listName]: { [probId]: newProgress } }
      const updates = scheduleReview(
        problem,
        current,
        performance,
        prev,
        selectedList
      );

      // Deep merge updates into previous state
      const newState = { ...prev };

      Object.keys(updates).forEach(listName => {
        newState[listName] = {
          ...(newState[listName] || {}),
          ...updates[listName]
        };
      });

      return newState;
    });
  };

  const problems = problemLists[selectedList] || [];
  const currentProgress = progress[selectedList] || {};

  const categories = [
    "All",
    ...Array.from(new Set(problems.flatMap((p) => p.topics || []))),
  ];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const stats = {
    total: problems.length,
    solved: problems.filter((p) => currentProgress[p.id]?.solved).length,
    easy: problems.filter(
      (p) => p.difficulty === "Easy" && currentProgress[p.id]?.solved
    ).length,
    medium: problems.filter(
      (p) => p.difficulty === "Medium" && currentProgress[p.id]?.solved
    ).length,
    hard: problems.filter(
      (p) => p.difficulty === "Hard" && currentProgress[p.id]?.solved
    ).length,
  };

  const getDueProblems = () => {
    return problems.filter((problem) => {
      const prob = currentProgress[problem.id];
      if (!prob || !prob.solved) return false;
      return prob.nextReview && prob.nextReview <= today;
    }).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                CodeTrack Pro - {selectedList} Progress Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Track your progress with spaced repetition
              </p>
            </div>
            <div className="flex sm:flex-row gap-2 items-start sm:items-center">
              {/* Dropdown for problem list */}
              <select
                id="problem-list"
                value={selectedList}
                title="Select a problem list"
                onChange={(e) => setSelectedList(e.target.value)}
                className="px-4 py-2 cursor-pointer rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
              >
                <option value="" disabled>
                  Select List
                </option>
                {Object.keys(problemLists).map((listName) => (
                  <option key={listName} value={listName}>
                    {listName}
                  </option>
                ))}
              </select>

              {/* Official Roadmap */}
              <a
                href={roadmapLinks[selectedList]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
                title="View the official NeetCode roadmap"
              >
                <Map size={16} /> Roadmap <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Toggle Explanation */}
          <div className="mt-4">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm transition-colors"
            >
              <Info size={16} />
              {showExplanation ? "Hide" : "Show"} Spaced Repetition Info
            </button>
          </div>
        </div>

        {/* Explanation Section */}
        {showExplanation && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6 transition-colors">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
              How Spaced Repetition Works
            </h3>
            <div className="text-blue-700 dark:text-blue-200 mt-2">
              <p className="mb-2">
                This tracker uses a <strong>Fair Review Scheduler</strong> based on the Completely Fair Scheduler (CFS) logic.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Rate your performance (1-5) after solving each problem.</li>
                <li><strong>1-2 (Struggled):</strong> High penalty, review scheduled for tomorrow.</li>
                <li><strong>3 (Okay):</strong> Moderate interval increase (1.5x).</li>
                <li><strong>4-5 (Good):</strong> Large interval increase (2.5x).</li>
                <li><strong>Load Balancing:</strong> The system automatically distributes reviews to avoid overloaded days.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Stats */}
        <CircularStatsCard
          stats={{
            total: stats.total,
            solved: stats.solved,
            easy: stats.easy,
            medium: stats.medium,
            hard: stats.hard,
            dueToday: getDueProblems(),
          }}
          problems={problems}
        />

        {/* Export / Import / Clear */}
        <ExportImportControls progress={progress} setProgress={setProgress} />

        {/* Filters */}
        <Filters
          categories={categories}
          difficulties={difficulties}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
          showOnlyDueToday={showOnlyDueToday}
          setShowOnlyDueToday={setShowOnlyDueToday}
        />

        {/* Daily Progress Forecast */}
        <DailyProgress progress={progress} />

        {/* Problems Table */}
        <ProblemTable
          problems={problems}
          progress={currentProgress}
          handleReview={handleReview}
          filterCategory={filterCategory}
          filterDifficulty={filterDifficulty}
          showOnlyDueToday={showOnlyDueToday}
        />
      </div>
    </div>
  );
};

export default LeetCodeTracker;
