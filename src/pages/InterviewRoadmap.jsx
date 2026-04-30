import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { interviewRoadmap, dsaMindmap } from "../data";

const Seal = ({ size = 14 }) => (
  <span
    className="inline-flex items-center justify-center"
    style={{
      width: size,
      height: size,
      backgroundColor: "var(--color-primary-main)",
    }}
  >
    <svg viewBox="0 0 12 12" width={size * 0.65} height={size * 0.65} aria-hidden>
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

const formatDateline = (d) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

const InterviewRoadmap = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [completedItems, setCompletedItems] = useState(() => {
    try {
      const saved = localStorage.getItem("interview-progress");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [activeTab, setActiveTab] = useState("interview");

  useEffect(() => {
    try {
      localStorage.setItem("interview-progress", JSON.stringify(completedItems));
    } catch (error) {
      console.error("Error saving interview progress:", error);
    }
  }, [completedItems]);

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleComplete = (id) => {
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getProgress = (sectionId) => {
    const section = interviewRoadmap.find(s => s.id === sectionId);
    if (!section) return 0;
    const completed = section.items.filter(item => completedItems[item.id]).length;
    return Math.round((completed / section.items.length) * 100);
  };

  return (
    <main className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-24">

      <header className="pt-10 pb-8 border-b border-border-default">
        <div className="flex items-baseline gap-3">
          <span className="smallcaps text-text-muted">The path</span>
          <span className="h-px w-6 bg-border-default" />
          <time className="text-[11px] text-text-muted display italic tabular">
            {formatDateline(new Date())}
          </time>
        </div>

        <h1 className="display text-[44px] lg:text-[52px] leading-[1.05] text-text-main mt-4">
          From application to offer
        </h1>
        <p className="display italic text-text-muted text-[15px] mt-2">
          A walking map. 道 (michi).
        </p>
      </header>

      {/* Tab strip — text-tabs */}
      <div className="border-b border-border-default mt-8">
        <div className="flex items-center gap-8">
          {[
            { id: "interview", label: "Interview process" },
            { id: "dsa",       label: "Decision tree" },
          ].map(t => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="relative py-3 text-[12px] tracking-wide transition-colors"
                style={{
                  color: active ? "var(--color-text-main)" : "var(--color-text-muted)",
                  fontWeight: active ? 600 : 400,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                }}
              >
                {t.label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-px h-px bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interview Process */}
      {activeTab === "interview" && (
        <div className="divide-y divide-border-default">
          {interviewRoadmap.map((section, idx) => {
            const progress = getProgress(section.id);
            const isExpanded = expandedSections[section.id];

            return (
              <article key={section.id} className="py-8">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full grid grid-cols-[3.5rem_minmax(0,1fr)_8rem_2rem] gap-x-6 items-center text-left group"
                >
                  <span className="display tabular text-[34px] leading-none text-text-muted/60 group-hover:text-primary transition-colors">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h2 className="display text-[22px] text-text-main leading-tight">
                      {section.title}
                    </h2>
                    <span className="smallcaps text-text-muted/70 mt-1 inline-block">
                      Stage
                    </span>
                  </div>

                  {/* Hairline progress */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-text-muted tabular text-right">
                      {progress}<span className="text-text-muted/60">%</span>
                    </span>
                    <span className="relative h-px bg-border-default block">
                      <span
                        className="absolute left-0 top-0 h-px bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </span>
                  </div>

                  <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    className="text-text-muted justify-self-end transition-transform"
                    style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)" }}
                  />
                </button>

                <div
                  className="grid transition-all duration-300"
                  style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="mt-6 pl-[3.5rem] grid sm:grid-cols-2 gap-x-8 gap-y-5 border-l border-border-default ml-6">
                      {section.items.map(item => {
                        const done = completedItems[item.id];
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleComplete(item.id)}
                            className="flex items-start gap-3 text-left group"
                          >
                            <span className="mt-0.5 flex-shrink-0">
                              {done ? (
                                <Seal size={14} />
                              ) : (
                                <span className="block w-3.5 h-3.5 border border-border-default group-hover:border-primary transition-colors" />
                              )}
                            </span>
                            <span className="flex flex-col">
                              <span
                                className="display text-[15px] leading-tight"
                                style={{
                                  color: done
                                    ? "var(--color-text-muted)"
                                    : "var(--color-text-main)",
                                  textDecorationLine: done ? "line-through" : "none",
                                  textDecorationColor: "var(--color-primary-main)",
                                  textDecorationThickness: "1px",
                                }}
                              >
                                {item.title}
                              </span>
                              <span className="display italic text-[12.5px] text-text-muted mt-1 leading-snug">
                                {item.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* DSA Decision Tree */}
      {activeTab === "dsa" && (
        <section className="mt-10">
          <header className="mb-8 max-w-2xl">
            <h2 className="display text-[28px] text-text-main">{dsaMindmap.title}</h2>
            <p className="display italic text-text-muted mt-2 text-[14px]">
              {dsaMindmap.description}
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-12">
            {dsaMindmap.sections.map((section, idx) => (
              <article key={section.id}>
                <div className="flex items-baseline gap-3 border-b border-border-default pb-3 mb-4">
                  <span className="display tabular text-[14px] text-text-muted/60">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <h3 className="display text-[20px] text-text-main">{section.title}</h3>
                </div>

                <ul className="space-y-2.5">
                  {section.content.map((item, i) => {
                    const tone = {
                      question: "var(--color-text-main)",
                      answer:   "var(--color-status-success-main)",
                      use:      "var(--color-primary-main)",
                      note:     "var(--color-status-warning-main)",
                      info:     "var(--color-text-muted)",
                    }[item.type] || "var(--color-text-muted)";

                    const marker = {
                      question: "?",
                      answer:   "→",
                      use:      "✓",
                      note:     "※",
                      info:     "·",
                    }[item.type] || "·";

                    const indent = item.type === "answer" ? "pl-6" : "pl-0";
                    const weight =
                      item.type === "question" ? 600 :
                      item.type === "use"      ? 500 : 400;

                    return (
                      <li
                        key={i}
                        className={`grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2 ${indent} text-[13px] leading-snug`}
                      >
                        <span
                          className="display tabular pt-[1px]"
                          style={{ color: tone, opacity: 0.7 }}
                        >
                          {marker}
                        </span>
                        <span
                          style={{
                            color: tone,
                            fontWeight: weight,
                            fontStyle: item.type === "note" ? "italic" : "normal",
                          }}
                          className={item.type === "note" ? "display" : ""}
                        >
                          {item.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default InterviewRoadmap;
