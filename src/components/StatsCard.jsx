const colorClasses = {
  blue: "bg-primary-light text-primary",
  green: "bg-status-success/10 text-status-success",
  yellow:
    "bg-status-warning/10 text-status-warning",
  red: "bg-status-error/10 text-status-error",
  purple:
    "bg-primary-light text-primary", // Mapping purple to primary for now to ensure theme spread
};

const StatsCard = ({ color, value, label }) => (
  <div className={`${colorClasses[color]} p-4 rounded-lg transition-colors`}>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm opacity-75">{label}</div>
  </div>
);
export default StatsCard;
