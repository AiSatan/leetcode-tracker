import { useEffect, useState } from "react";
import {
  Briefcase,
  Code,
  MessageSquare,
  DollarSign,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  Brain,
  Rocket,
} from "lucide-react";
import { interviewRoadmap, dsaMindmap } from "../data";

const iconMap = {
  Briefcase,
  Code,
  MessageSquare,
  DollarSign,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  Brain,
};

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
      localStorage.setItem(
        "interview-progress",
        JSON.stringify(completedItems)
      );
    } catch (error) {
      console.error("Error saving interview progress:", error);
    }
  }, [completedItems]);


  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleComplete = (id) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getProgress = (sectionId) => {
    const section = interviewRoadmap.find((s) => s.id === sectionId);
    if (!section) return 0;
    const completed = section.items.filter(
      (item) => completedItems[item.id]
    ).length;
    return Math.round((completed / section.items.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background-page p-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-text-main">
              Interview Mastery Roadmap
            </h1>
            <Rocket size={36} className="text-blue-600 ml-2" />
          </div>
          <p className="text-lg text-text-muted">
            Your complete guide from application to offer
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-background-surface rounded-lg shadow-md p-2 mb-8 flex gap-2">
          <button
            onClick={() => setActiveTab("interview")}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${activeTab === "interview"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-background-subtle text-text-muted hover:bg-background-highlight"
              }`}
          >
            Interview Process
          </button>
          <button
            onClick={() => setActiveTab("dsa")}
            className={`flex-1 py-2 px-6 rounded-lg font-semibold transition-all ${activeTab === "dsa"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-background-subtle text-text-muted hover:bg-background-highlight"
              }`}
          >
            DSA Mind Map
          </button>
        </div>

        {/* Interview Process Tab */}
        {activeTab === "interview" && (
          <div className="space-y-6">
            {interviewRoadmap.map((section, idx) => {
              const Icon = iconMap[section.icon];
              const progress = getProgress(section.id);
              const isExpanded = expandedSections[section.id];

              return (
                <div
                  key={section.id}
                  className="bg-red rounded-lg shadow-lg overflow-hidden"
                >
                  {/* Section Header */}
                  <div
                    onClick={() => toggleSection(section.id)}
                    className={`${section.color} p-4 cursor-pointer hover:opacity-90 transition-opacity`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                          <Icon size={32} className="text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white">
                            {idx + 1}. {section.title}
                          </h2>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="bg-white bg-opacity-30 rounded-full h-2 w-24">
                              <div
                                className="bg-white rounded-full h-2 transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-white text-xs font-semibold">
                              {progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={24} className="text-white" />
                      ) : (
                        <ChevronRight size={24} className="text-white" />
                      )}
                    </div>
                  </div>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="p-6 bg-background-subtle">
                      <div className="grid gap-4">
                        {section.items.map((item) => {
                          const isCompleted = completedItems[item.id];
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleComplete(item.id)}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isCompleted
                                  ? "bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600"
                                  : "bg-background-surface border-border-default hover:border-border-focus"
                                }`}
                            >
                              <div className="flex items-start gap-3">
                                {isCompleted ? (
                                  <CheckCircle
                                    className="text-green-500 flex-shrink-0 mt-1"
                                    size={24}
                                  />
                                ) : (
                                  <Circle
                                    className="text-text-muted flex-shrink-0 mt-1"
                                    size={24}
                                  />
                                )}
                                <div className="flex-1">
                                  <h3
                                    className={`font-semibold mb-1 ${isCompleted
                                        ? "text-green-900 dark:text-green-300 line-through"
                                        : "text-text-main"
                                      }`}
                                  >
                                    {item.title}
                                  </h3>
                                  <p className="text-sm text-text-muted">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* DSA Mind Map Tab */}
        {activeTab === "dsa" && (
          <div className="space-y-6">
            <div className="bg-background-surface rounded-lg shadow-lg py-4 px-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-text-main">
                  {dsaMindmap.title}
                </h2>
                <Brain size={32} className="text-blue-600" />
              </div>
              <p className="text-text-muted">
                {dsaMindmap.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {dsaMindmap.sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-background-surface rounded-lg shadow-lg overflow-hidden"
                >
                  <div className={`${section.color} py-3 px-4`}>
                    <h3 className="text-lg font-bold text-white">
                      {section.title}
                    </h3>
                  </div>
                  <div className="p-4 space-y-2">
                    {section.content.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg ${item.type === "question"
                            ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400"
                            : item.type === "answer"
                              ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 ml-4"
                              : item.type === "use"
                                ? "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 dark:border-purple-400"
                                : item.type === "note"
                                  ? "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-400"
                                  : "bg-background-subtle border-l-4 border-border-default"
                          }`}
                      >
                        <p
                          className={`text-sm ${item.type === "question"
                              ? "font-semibold text-blue-900 dark:text-blue-300"
                              : item.type === "answer"
                                ? "text-green-900 dark:text-green-300"
                                : item.type === "use"
                                  ? "text-purple-900 dark:text-purple-300"
                                  : item.type === "note"
                                    ? "text-yellow-900 dark:text-yellow-300"
                                    : "text-text-main"
                            }`}
                        >
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRoadmap;
