import { Download, Upload, Trash2 } from "lucide-react";

const ExportImportControls = ({ progress, setProgress }) => {
  const exportData = () => {
    const dataStr = JSON.stringify(progress, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leetcode-progress-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const importData = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setProgress(imported);
      } catch {
        alert("Could not parse that file.");
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm("Clear all practice progress?")) setProgress({});
  };

  const linkBase =
    "flex items-center gap-2 text-[11px] text-text-muted hover:text-text-main transition-colors py-1.5 cursor-pointer";

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="smallcaps text-text-muted">Records</h3>
        <span className="text-[10px] text-text-muted/70 display italic">記録</span>
      </div>

      <div className="flex flex-col">
        <button onClick={exportData} className={linkBase}>
          <Download size={13} strokeWidth={1.6} />
          <span>Export</span>
        </button>

        <label className={linkBase}>
          <Upload size={13} strokeWidth={1.6} />
          <span>Import</span>
          <input type="file" accept=".json" onChange={importData} className="hidden" />
        </label>

        <button
          onClick={clearAllData}
          className={`${linkBase} hover:text-status-error`}
        >
          <Trash2 size={13} strokeWidth={1.6} />
          <span>Clear all</span>
        </button>
      </div>
    </div>
  );
};

export default ExportImportControls;
