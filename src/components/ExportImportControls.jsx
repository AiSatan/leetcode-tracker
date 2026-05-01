import { useEffect, useRef, useState } from "react";
import { Download, Upload, Trash2 } from "lucide-react";

const ExportImportControls = ({ progress, setProgress }) => {
  const [status, setStatus] = useState(null); // { tone: "ok" | "err" | "warn", message: string }
  const [confirmingClear, setConfirmingClear] = useState(false);
  const statusTimer = useRef(null);

  useEffect(() => () => clearTimeout(statusTimer.current), []);

  const flash = (tone, message, ms = 3500) => {
    setStatus({ tone, message });
    clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatus(null), ms);
  };

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(progress, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leetcode-progress-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      flash("ok", "Exported.");
    } catch (err) {
      console.error("Export failed:", err);
      flash("err", "Export failed.");
    }
  };

  const importData = (event) => {
    const input = event.target;
    const file = input.files && input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      flash("err", "File too large (max 5 MB).");
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => flash("err", "Could not read that file.");
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported || typeof imported !== "object" || Array.isArray(imported)) {
          flash("err", "File is not a valid progress export.");
          return;
        }
        setProgress(imported);
        flash("ok", "Imported.");
      } catch {
        flash("err", "Could not parse that file.");
      } finally {
        input.value = "";
      }
    };
    reader.readAsText(file);
  };

  const requestClear = () => {
    setConfirmingClear(true);
  };

  const confirmClear = () => {
    setProgress({});
    setConfirmingClear(false);
    flash("warn", "All progress cleared.");
  };

  const cancelClear = () => setConfirmingClear(false);

  const linkBase =
    "flex items-center gap-2 text-[11px] text-text-muted hover:text-text-main transition-colors py-2 cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary";

  const statusTone = {
    ok: "var(--color-status-success-main)",
    err: "var(--color-status-error-main)",
    warn: "var(--color-status-warning-main)",
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="smallcaps text-text-muted">Records</h3>
        <span aria-hidden="true" className="text-[10px] text-text-muted/70 display italic">記録</span>
      </div>

      <div className="flex flex-col">
        <button type="button" onClick={exportData} className={linkBase}>
          <Download size={13} strokeWidth={1.6} aria-hidden="true" focusable="false" />
          <span>Export</span>
        </button>

        <label className={`${linkBase} focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-primary`}>
          <Upload size={13} strokeWidth={1.6} aria-hidden="true" focusable="false" />
          <span>Import</span>
          <input
            type="file"
            accept="application/json,.json"
            onChange={importData}
            className="sr-only"
          />
        </label>

        {!confirmingClear ? (
          <button
            type="button"
            onClick={requestClear}
            className={`${linkBase} hover:text-status-error`}
          >
            <Trash2 size={13} strokeWidth={1.6} aria-hidden="true" focusable="false" />
            <span>Clear all</span>
          </button>
        ) : (
          <div role="alertdialog" aria-label="Confirm clear all" className="py-2 flex flex-col gap-1.5">
            <span className="text-[11px] text-text-main">Clear all progress?</span>
            <div className="flex items-center gap-3 text-[11px]">
              <button
                type="button"
                onClick={confirmClear}
                autoFocus
                className="smallcaps text-status-error hover:text-status-error-hover py-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={cancelClear}
                className="smallcaps text-text-muted hover:text-text-main py-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div role="status" aria-live="polite" className="min-h-[1.1rem] mt-2 text-[11px] tabular">
        {status && (
          <span className="display italic" style={{ color: statusTone[status.tone] }}>
            {status.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default ExportImportControls;
