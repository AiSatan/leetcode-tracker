/**
 * Lightweight stat tile — hairline-bordered, serif numeral, smallcaps label.
 * Currently unused by the dashboard but kept for ad-hoc surfaces.
 */
const tone = {
  blue:   "var(--color-categorical-blue)",
  green:  "var(--color-status-success-main)",
  yellow: "var(--color-status-warning-main)",
  red:    "var(--color-status-error-main)",
  purple: "var(--color-categorical-purple)",
};

const StatsCard = ({ color, value, label }) => (
  <div className="border border-border-default px-4 py-3 flex flex-col">
    <span
      className="display tabular text-[26px] leading-none"
      style={{ color: tone[color] || "var(--color-text-main)" }}
    >
      {value}
    </span>
    <span className="smallcaps text-text-muted mt-2">{label}</span>
  </div>
);

export default StatsCard;
