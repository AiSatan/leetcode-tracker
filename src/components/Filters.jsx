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
}) => (
  <div className="flex flex-col">
    <div className="flex items-baseline justify-between mb-4">
      <h3 className="smallcaps text-text-muted">Filters</h3>
      <span aria-hidden="true" className="text-[10px] text-text-muted/70 display italic">絞込</span>
    </div>

    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-[10px] text-text-muted smallcaps">Category</span>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="dojo-select text-[12px] w-full"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[10px] text-text-muted smallcaps">Difficulty</span>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="dojo-select text-[12px] w-full"
        >
          {difficulties.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>

      <label
        htmlFor="due-today-checkbox"
        className="flex items-center gap-2 mt-1 py-1.5 cursor-pointer select-none"
      >
        <input
          id="due-today-checkbox"
          type="checkbox"
          checked={showOnlyDueToday}
          onChange={() => setShowOnlyDueToday(p => !p)}
          className="custom-checkbox"
        />
        <span className="text-[11px] text-text-muted">Due today only</span>
      </label>

      <label
        htmlFor="hide-planned-checkbox"
        className="flex items-center gap-2 py-1.5 cursor-pointer select-none"
      >
        <input
          id="hide-planned-checkbox"
          type="checkbox"
          checked={hidePlanned}
          onChange={() => setHidePlanned(p => !p)}
          className="custom-checkbox"
        />
        <span className="text-[11px] text-text-muted">Hide planned</span>
      </label>
    </div>
  </div>
);

export default Filters;
