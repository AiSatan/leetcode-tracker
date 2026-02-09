/**
 * "Gone Girl" / Cinematic Color Palette
 * Designed for a moody, high-contrast aesthetic.
 * 
 * 1 (Lowest): Deep Crimson/Blood/Crisis
 * 2: Muted Rust/Warning
 * 3: Pale Gold/Sickly Yellow/Neutral
 * 4: Cold Teal/Progress
 * 5 (Highest): Deep Navy/Cool Blue/Control
 */
export const PERFORMANCE_COLORS = {
    1: "#8c2f39", // Deep Crimson
    2: "#b25d48", // Muted Rust
    3: "#d6c68b", // Pale Gold
    4: "#8aa29e", // Cold Teal
    5: "#203354", // Deep Navy
};

/**
 * Returns the hex color for a given performance score (1-5).
 * Defaults to gray if invalid.
 * @param {number} score 
 * @returns {string} Hex color code
 */
export const getPerformanceColor = (score) => {
    return PERFORMANCE_COLORS[score] || "#e5e7eb"; // Default gray-200
};
