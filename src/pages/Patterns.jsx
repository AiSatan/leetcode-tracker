import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { patterns } from "../data";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../context/ThemeContext";

const languages = [
  { id: "python",     name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "java",       name: "Java" },
  { id: "go",         name: "Go" },
];

const formatDateline = (d) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

const Patterns = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { isDark } = useTheme();

  const copyToClipboard = async (text, index) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Legacy fallback for non-secure contexts.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const codeStyle = {
    margin: 0,
    padding: "1.1rem 1.25rem",
    background: "transparent",
    fontSize: "12.5px",
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  };

  return (
    <main className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-24">

      {/* Masthead */}
      <header className="pt-10 pb-8 border-b border-border-default">
        <div className="flex items-baseline gap-3">
          <span className="smallcaps text-text-muted">Reference</span>
          <span className="h-px w-6 bg-border-default" />
          <time className="text-[11px] text-text-muted display italic tabular">
            {formatDateline(new Date())}
          </time>
        </div>

        <h1 className="display text-[44px] lg:text-[52px] leading-[1.05] text-text-main mt-4">
          Patterns
        </h1>
        <p className="display italic text-text-muted text-[15px] mt-2">
          A field manual of recurring shapes — sliding window, two pointers, and the like.
          型 (kata).
        </p>
      </header>

      {/* Sticky language strip — inline text tabs, no pill buttons */}
      <div className="sticky top-0 z-10 bg-background-page border-b border-border-default -mx-6 lg:-mx-10 px-6 lg:px-10 py-3 mt-8 mb-2">
        <div className="flex items-center gap-6">
          <span id="lang-label" className="smallcaps text-text-muted">Language</span>
          <div role="tablist" aria-labelledby="lang-label" className="flex items-center gap-5">
            {languages.map(lang => {
              const active = selectedLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  role="tab"
                  id={`tab-${lang.id}`}
                  aria-selected={active}
                  aria-controls={`panel-${lang.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className="relative pb-1 py-2 text-[12px] tracking-wide transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  style={{
                    color: active ? "var(--color-text-main)" : "var(--color-text-muted)",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {lang.name}
                  {active && (
                    <span aria-hidden="true" className="absolute left-0 right-0 -bottom-px h-px bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pattern entries */}
      <div className="divide-y divide-border-default">
        {patterns.map((pattern, idx) => (
          <article
            key={idx}
            className="grid grid-cols-1 lg:grid-cols-[5rem_minmax(0,1fr)] gap-x-8 gap-y-4 py-12"
          >
            {/* Numeral */}
            <div className="flex flex-col">
              <span className="display tabular text-[40px] leading-none text-text-muted/60">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="smallcaps text-text-muted/70 mt-2">Pattern</span>
            </div>

            {/* Body */}
            <div>
              <h2 className="display text-[26px] text-text-main leading-tight">
                {pattern.title}
              </h2>
              <p className="display italic text-[14px] text-text-muted mt-2 max-w-2xl">
                {pattern.description}
              </p>

              {/* Code block — bordered hairline frame, transparent bg */}
              <div
                role="tabpanel"
                id={`panel-${selectedLanguage}`}
                aria-labelledby={`tab-${selectedLanguage}`}
                className="mt-6 border border-border-default"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-border-default bg-background-subtle/50">
                  <span className="smallcaps text-text-muted">
                    {languages.find(l => l.id === selectedLanguage)?.name} · Template
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(pattern.templates[selectedLanguage], idx)}
                    aria-label={copiedIndex === idx ? "Copied to clipboard" : `Copy ${pattern.title} template to clipboard`}
                    className="inline-flex items-center gap-1.5 text-[11px] text-text-muted hover:text-primary transition-colors py-1 px-1 -mx-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check size={13} strokeWidth={1.6} aria-hidden="true" focusable="false" className="text-status-success" />
                        <span className="text-status-success smallcaps">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} strokeWidth={1.6} aria-hidden="true" focusable="false" />
                        <span className="smallcaps">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <SyntaxHighlighter
                  language={selectedLanguage}
                  style={isDark ? oneDark : oneLight}
                  wrapLongLines={true}
                  showLineNumbers={true}
                  customStyle={codeStyle}
                  lineNumberStyle={{
                    color: "var(--color-text-muted)",
                    opacity: 0.5,
                    minWidth: "1.6rem",
                    paddingRight: "0.85rem",
                    fontSize: "11px",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                    },
                  }}
                >
                  {pattern.templates[selectedLanguage].replace(/\\n/g, "\n")}
                </SyntaxHighlighter>
              </div>

              {/* Common problems — footnote-style */}
              <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="smallcaps text-text-muted/80 mr-1">
                  Frequently appears in
                </span>
                {pattern.problems.map((problem, pIdx) => (
                  <span key={pIdx} className="display italic text-[13px] text-text-main">
                    {problem}
                    {pIdx < pattern.problems.length - 1 && (
                      <span className="text-text-muted/40"> · </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="display italic text-text-muted text-center text-[13px] mt-12 max-w-2xl mx-auto">
        Repeat the form until it disappears. 形を忘れる稽古.
      </p>
    </main>
  );
};

export default Patterns;
