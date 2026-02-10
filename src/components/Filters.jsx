import { Filter } from "lucide-react";

const Filters = ({
  categories,
  difficulties,
  filterCategory,
  setFilterCategory,
  filterDifficulty,
  setFilterDifficulty,
  showOnlyDueToday,
  setShowOnlyDueToday,
  hidePlanned,
  setHidePlanned,
  compact,
}) => (
  <div className={compact ? '' : 'bg-background-surface rounded-lg shadow-lg p-6 mb-6 transition-colors'}>
    <div className="flex items-center gap-2 mb-3">
      <Filter size={compact ? 14 : 20} className="text-text-muted" />
      <h2 className={`font-semibold text-text-main ${compact ? 'text-sm' : 'text-xl'}`}>
        Filters
      </h2>
    </div>
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Category
        </label>
        <select
          title="Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full p-1.5 text-sm cursor-pointer border border-border-default rounded bg-background-surface text-text-main focus:outline-none transition-colors"
        >
          {categories.map((cat) => (
            <option
              key={cat}
              value={cat}
              className="bg-background-surface text-text-main"
            >
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Difficulty
        </label>
        <select
          title="Difficulty"
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="w-full p-1.5 text-sm cursor-pointer border border-border-default rounded bg-background-surface text-text-main focus:outline-none transition-colors"
        >
          {difficulties.map((diff) => (
            <option
              key={diff}
              value={diff}
              className="bg-background-surface text-text-main"
            >
              {diff}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="due-today-checkbox"
          type="checkbox"
          title="Show Only Due Today"
          checked={showOnlyDueToday}
          onChange={() => setShowOnlyDueToday((prev) => !prev)}
          className="custom-checkbox"
        />
        <label htmlFor="due-today-checkbox" className="text-xs font-medium text-text-muted cursor-pointer select-none">
          Due Today Only
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="hide-planned-checkbox"
          type="checkbox"
          title="Hide Planned"
          checked={hidePlanned}
          onChange={() => setHidePlanned((prev) => !prev)}
          className="custom-checkbox"
        />
        <label htmlFor="hide-planned-checkbox" className="text-xs font-medium text-text-muted cursor-pointer select-none">
          Hide Planned
        </label>
      </div>
    </div>
  </div>
);

export default Filters;
