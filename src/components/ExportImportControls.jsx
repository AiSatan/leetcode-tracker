import { Download, Upload, Trash2, Database } from "lucide-react";

const ExportImportControls = ({ progress, setProgress, compact }) => {
  const exportData = () => {
    const dataStr = JSON.stringify(progress, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leetcode-progress-${new Date().toISOString().split("T")[0]
      }.json`;
    link.click();
  };

  const importData = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setProgress(imported);
          alert("Progress imported successfully!");
        } catch {
          alert("Error importing file. Please check the file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear all progress?")) {
      setProgress({});
    }
  };

  const btnBase = "flex items-center gap-2 px-3 py-1.5 text-xs rounded border transition-colors cursor-pointer whitespace-nowrap";

  return (
    <div className={compact ? '' : 'bg-background-surface rounded-lg shadow-lg p-6 mb-6 transition-colors'}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <Database size={compact ? 14 : 20} className="text-text-muted" />
        <h2 className={`font-semibold text-text-main ${compact ? 'text-sm' : 'text-xl'}`}>
          Progress Data
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={exportData}
          className={`${btnBase} border-border-default bg-background-subtle text-text-muted hover:bg-background-highlight hover:text-text-main`}
        >
          <Download size={14} /> Export Progress
        </button>
        <label className={`${btnBase} border-border-default bg-background-subtle text-text-muted hover:bg-background-highlight hover:text-text-main`}>
          <Upload size={14} /> Import Progress
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
        </label>
        <button
          onClick={clearAllData}
          className={`${btnBase} border-transparent bg-background-subtle text-status-error hover:bg-status-error hover:text-white`}
        >
          <Trash2 size={14} /> Clear All
        </button>
      </div>
    </div>
  );
};

export default ExportImportControls;
