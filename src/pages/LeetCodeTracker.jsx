import { useState, useEffect } from "react";
import { ExternalLink, ChevronDown } from "lucide-react";
import { scheduleReview } from "../utils/scheduler";
import {
  Filters,
  ProblemTable,
  ExportImportControls,
  CircularStatsCard,
  DailyProgress,
  ForecastRadar,
} from "../components";
import { blind75, leetcode75, neetcode150 } from "../data";

const problemLists = {
  "Blind 75":     blind75,
  "LeetCode 75":  leetcode75,
  "NeetCode 150": neetcode150,
};

const roadmapLinks = {
  "Blind 75":     "https://leetcode.com/problem-list/oizxjoit/",
  "LeetCode 75":  "https://leetcode.com/studyplan/leetcode-75/",
  "NeetCode 150": "https://neetcode.io/roadmap",
};

const formatDateline = (d) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

const LeetCodeTracker = () => {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem("leetcode-progress-v2");
      return saved
        ? JSON.parse(saved)
        : { "Blind 75": {}, "LeetCode 75": {}, "NeetCode 150": {} };
    } catch (error) {
      console.error("Error loading progress from localStorage:", error);
      return { "Blind 75": {}, "LeetCode 75": {}, "NeetCode 150": {} };
    }
  });

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [showOnlyDueToday, setShowOnlyDueToday] = useState(false);
  const [hidePlanned, setHidePlanned] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const [selectedList, setSelectedList] = useState(() => {
    try {
      return localStorage.getItem("leetcode-tracker-selected-list") || "NeetCode 150";
    } catch (error) {
      console.error("Error loading selected list from localStorage:", error);
      return "NeetCode 150";
    }
  });

  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem("leetcode-tracker-filters");
      if (savedFilters) {
        const parsed = JSON.parse(savedFilters);
        setFilterCategory(parsed.category || "All");
        setFilterDifficulty(parsed.difficulty || "All");
        setShowOnlyDueToday(parsed.dueToday || false);
        setHidePlanned(parsed.hidePlanned || false);
      }
    } catch (error) {
      console.error("Error loading filters:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "leetcode-tracker-filters",
        JSON.stringify({
          category: filterCategory,
          difficulty: filterDifficulty,
          dueToday: showOnlyDueToday,
          hidePlanned: hidePlanned,
        })
      );
    } catch (error) {
      console.error("Error saving filters:", error);
    }
  }, [filterCategory, filterDifficulty, showOnlyDueToday, hidePlanned]);

  useEffect(() => {
    try {
      localStorage.setItem("leetcode-tracker-selected-list", selectedList);
    } catch (error) {
      console.error("Error saving selected list to localStorage:", error);
    }
  }, [selectedList]);

  useEffect(() => {
    try {
      localStorage.setItem("leetcode-progress-v2", JSON.stringify(progress));
    } catch (error) {
      console.error("Error saving progress to localStorage:", error);
    }
  }, [progress]);

  const _now = new Date();
  const today = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}-${String(_now.getDate()).padStart(2, '0')}`;

  const handleReview = (problemId, performance) => {
    setProgress(prev => {
      const listProgress = prev[selectedList] || {};
      const current = listProgress[problemId];
      const problem = problems.find(p => p.id === problemId) || { difficulty: "Medium" };
      const updates = scheduleReview(problem, current, performance, prev, selectedList);
      const newState = { ...prev };
      Object.keys(updates).forEach(listName => {
        newState[listName] = { ...(newState[listName] || {}), ...updates[listName] };
      });
      return newState;
    });
  };

  const problems = problemLists[selectedList] || [];
  const currentProgress = progress[selectedList] || {};

  const categories = ["All", ...Array.from(new Set(problems.flatMap(p => p.topics || [])))];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const stats = {
    total: problems.length,
    mastered: problems.filter(p => currentProgress[p.id]?.performance === 5).length,
    easy: problems.filter(p => p.difficulty === "Easy" && currentProgress[p.id]?.performance === 5).length,
    medium: problems.filter(p => p.difficulty === "Medium" && currentProgress[p.id]?.performance === 5).length,
    hard: problems.filter(p => p.difficulty === "Hard" && currentProgress[p.id]?.performance === 5).length,
  };

  const dueCount = problems.filter(p => {
    const r = currentProgress[p.id];
    if (!r || !r.solved) return false;
    return r.nextReview && r.nextReview <= today;
  }).length;

  return (
    <main className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-24">

      {/* ── Masthead ─────────────────────────────────────────── */}
      <header className="pt-10 pb-8 border-b border-border-default">
        <div className="flex items-baseline gap-3">
          <span className="smallcaps text-text-muted">Practice journal</span>
          <span className="h-px w-6 bg-border-default" />
          <time className="text-[11px] text-text-muted display italic tabular">
            {formatDateline(_now)}
          </time>
        </div>

        <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="display text-[44px] lg:text-[52px] leading-[1.05] text-text-main">
              {selectedList}
            </h1>
            <p className="mt-2 display italic text-text-muted text-[15px]">
              Spaced repetition for the long road. 道は遠い。
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] text-text-muted smallcaps">Set</span>
              <select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                className="dojo-select text-[13px]"
              >
                {Object.keys(problemLists).map(listName => (
                  <option key={listName} value={listName}>{listName}</option>
                ))}
              </select>
            </label>

            <a
              href={roadmapLinks[selectedList]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] smallcaps text-text-muted hover:text-primary transition-colors pb-1.5"
              title="Open the official roadmap"
            >
              Official roadmap
              <ExternalLink size={12} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Spaced rep disclosure — quiet, italic, expandable */}
        <button
          onClick={() => setShowExplanation(s => !s)}
          className="mt-6 inline-flex items-center gap-1.5 text-[12px] text-text-muted hover:text-primary transition-colors"
        >
          <ChevronDown
            size={12}
            strokeWidth={1.5}
            style={{
              transform: showExplanation ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 200ms ease",
            }}
          />
          <span className="smallcaps">How the scheduler works</span>
        </button>
        <div
          className="grid transition-all duration-300"
          style={{ gridTemplateRows: showExplanation ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="mt-4 max-w-2xl text-text-muted text-[13px] leading-relaxed display italic">
              <p className="mb-2">
                Each rating from 1 to 5 reshapes the next interval — a mix of difficulty
                weight and your performance. 1–2 forces a review tomorrow; 3 stretches it 1.5×;
                4–5 stretches it 2.5×.
              </p>
              <p className="text-text-muted">
                When a day fills up (5 reviews), high-priority items bump easy ones to the next
                open slot. The forecast on the right shows the load.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Dashboard row ───────────────────────────────────── */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr_1.5fr_0.85fr_0.6fr] gap-x-8 gap-y-10 lg:divide-x lg:divide-border-default">
        <div className="lg:pr-2">
          <CircularStatsCard
            stats={{
              total: stats.total,
              mastered: stats.mastered,
              easy: stats.easy,
              medium: stats.medium,
              hard: stats.hard,
              dueToday: dueCount,
            }}
            problems={problems}
          />
        </div>

        <div className="lg:pl-8 lg:pr-2">
          <ForecastRadar progress={progress} />
        </div>

        <div className="lg:pl-8 lg:pr-2">
          <DailyProgress progress={progress} />
        </div>

        <div className="lg:pl-8 lg:pr-2">
          <Filters
            categories={categories}
            difficulties={difficulties}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterDifficulty={filterDifficulty}
            setFilterDifficulty={setFilterDifficulty}
            showOnlyDueToday={showOnlyDueToday}
            setShowOnlyDueToday={setShowOnlyDueToday}
            hidePlanned={hidePlanned}
            setHidePlanned={setHidePlanned}
          />
        </div>

        <div className="lg:pl-8">
          <ExportImportControls progress={progress} setProgress={setProgress} />
        </div>
      </section>

      {/* ── Problems ────────────────────────────────────────── */}
      <ProblemTable
        problems={problems}
        progress={currentProgress}
        handleReview={handleReview}
        filterCategory={filterCategory}
        filterDifficulty={filterDifficulty}
        showOnlyDueToday={showOnlyDueToday}
        hidePlanned={hidePlanned}
      />
    </main>
  );
};

export default LeetCodeTracker;
