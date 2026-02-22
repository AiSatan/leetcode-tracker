import { useState } from "react";
import { Check, Code2, Copy } from "lucide-react";
import { patterns } from "../data";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../context/ThemeContext";


const Patterns = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { isDark } = useTheme();


  const languages = [
    { id: "python", name: "Python" },
    { id: "javascript", name: "JavaScript" },
    { id: "java", name: "Java" },
    { id: "go", name: "Go" },
  ];

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background-page p-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-text-main">
              LeetCode Patterns Cheat Sheet
            </h1>
            <Code2
              size={36}
              className="text-primary-main ml-2"
            />
          </div>
          <p className="text-text-muted text-lg">
            Master coding patterns in multiple languages
          </p>
        </div>

        <div className="bg-background-surface rounded-lg shadow-md p-4 mb-8 sticky top-4 z-10 transition-colors">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-text-muted font-medium">
              Select Language:
            </span>
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedLanguage === lang.id
                  ? `bg-primary-main text-text-inverted shadow-lg scale-105`
                  : "bg-background-subtle text-text-muted hover:bg-background-highlight"
                  }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {patterns.map((pattern, idx) => (
            <div
              key={idx}
              className="bg-background-surface rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="bg-background-subtle border-b border-border-default py-3 px-4">
                <h2 className="text-lg font-bold text-text-main mb-1">
                  {pattern.title}
                </h2>
                <p className="text-text-muted">{pattern.description}</p>
              </div>

              <div className="p-6">
                <div className="relative mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-text-muted uppercase">
                      {languages.find((l) => l.id === selectedLanguage)?.name}{" "}
                      Template
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          pattern.templates[selectedLanguage],
                          idx
                        )
                      }
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-background-subtle hover:bg-background-highlight rounded transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check
                            size={16}
                            className="text-status-success"
                          />
                          <span className="text-status-success">
                            Copied!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy
                            size={16}
                            className="text-text-muted"
                          />
                          <span className="text-text-muted">
                            Copy
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={selectedLanguage}
                    style={isDark ? oneDark : oneLight}
                    wrapLongLines={true}
                    showLineNumbers={true}
                    className="rounded-lg overflow-x-auto"
                  >
                    {pattern.templates[selectedLanguage].replace(/\\n/g, "\n")}
                  </SyntaxHighlighter>
                </div>
                <div className="bg-background-subtle rounded-lg p-4">
                  <span className="font-semibold text-text-main text-sm">
                    Common Problems:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pattern.problems.map((problem, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-3 py-1 bg-primary-light text-primary-text rounded-full text-sm font-medium"
                      >
                        {problem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-text-muted">
          <p className="text-sm">
            💡 Practice these patterns regularly to build strong problem-solving
            intuition
          </p>
        </div>
      </div>
    </div>
  );
};

export default Patterns;
