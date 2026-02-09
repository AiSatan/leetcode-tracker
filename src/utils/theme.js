/**
 * Semantic Theme System
 * 
 * Defines the core design tokens for the application.
 * Colors are defined semantically (e.g., 'primary', 'surface') rather than descriptively (e.g., 'blue-500').
 */
export const theme = {
    colors: {
        // Base Layout
        background: {
            page: {
                light: "#f9fafb", // gray-50
                dark: "#050505"   // Obsidian Black
            },
            surface: {
                light: "#ffffff", // white
                dark: "#121217"   // Deep Void
            },
            subtle: {
                light: "#f9fafb", // gray-50
                dark: "#1c1c24"   // Lighter Void
            },
            highlight: {
                light: "#f5f3ff", // violet-50
                dark: "rgba(139, 92, 246, 0.1)"   // Purple tint
            }
        },

        // Typography
        text: {
            main: {
                light: "#111827", // gray-900
                dark: "#ffffff"   // White
            },
            muted: {
                light: "#6b7280", // gray-500
                dark: "#9ca3af"   // gray-400
            },
            inverted: {
                light: "#ffffff",
                dark: "#000000"
            }
        },

        // Borders
        border: {
            default: {
                light: "#e5e7eb", // gray-200
                dark: "#27272a"   // zinc-800
            },
            focus: {
                light: "#9ca3af", // gray-400
                dark: "#8b5cf6"   // violet-500
            }
        },

        // Brand / Interactive
        primary: {
            main: {
                light: "#7c3aed", // violet-600
                dark: "#8b5cf6"   // violet-500
            },
            hover: {
                light: "#6d28d9", // violet-700
                dark: "#a78bfa"   // violet-400
            },
            light: {
                light: "#ede9fe", // violet-100
                dark: "rgba(139, 92, 246, 0.15)" // violet-500/15
            },
            text: {
                light: "#5b21b6", // violet-800
                dark: "#c4b5fd"   // violet-300
            }
        },

        // Status & Difficulty
        status: {
            success: {
                light: "#16a34a",
                dark: "#4ade80"   // green-400
            },
            warning: {
                light: "#ca8a04",
                dark: "#facc15"   // yellow-400
            },
            error: {
                light: "#dc2626",
                dark: "#f87171"   // red-400
            }
        },

        // Performance / Ratings (Likert Scale)
        performance: {
            1: { light: "#ef4444", dark: "#ff5252" }, // Red
            2: { light: "#f97316", dark: "#ff9100" }, // Orange
            3: { light: "#eab308", dark: "#ffd740" }, // Yellow
            4: { light: "#0ea5e9", dark: "#40c4ff" }, // Blue
            5: { light: "#22c55e", dark: "#69f0ae" }, // Green
        }
    }
};

/**
 * Legacy support for direct performance color access.
 * @param {number} score 
 * @returns {string} CSS Variable or Hex color
 */
export const getPerformanceColor = (score) => {
    return theme.colors.performance[score] ? `var(--color-performance-${score})` : "#e5e7eb";
};


/**
 * Generates CSS variables for the theme.
 * Returns an object with :root (light) and .dark variables.
 */
export const generateThemeVariables = () => {
    const vars = {
        root: {},
        dark: {}
    };

    const processColor = (key, value, prefix = '-') => {
        if (typeof value === 'string') {
            // It's a direct color (like performance colors)
            // We'll just put it in root for now as they don't seem to have dark mode variants in current code
            vars.root[`${prefix}-${key}`] = value;
            vars.dark[`${prefix}-${key}`] = value; // Same for dark mode for now
        } else if (value.light && value.dark) {
            // It's a themed color
            vars.root[`${prefix}-${key}`] = value.light;
            vars.dark[`${prefix}-${key}`] = value.dark;
        } else {
            // It's a nested object
            Object.entries(value).forEach(([k, v]) => {
                const step = k === 'default' ? '' : `-${k}`; // collapse 'default' keys
                processColor(k, v, `${prefix}${step}`);
            });
        }
    };

    Object.entries(theme.colors).forEach(([category, values]) => {
        processColor(category, values, `--color-${category}`);
    });

    return vars;
};
