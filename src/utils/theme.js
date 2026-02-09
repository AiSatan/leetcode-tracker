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
                dark: "#111827"   // gray-900
            },
            surface: {
                light: "#ffffff", // white
                dark: "#1f2937"   // gray-800
            },
            subtle: {
                light: "#f9fafb", // gray-50 (used in headers, etc)
                dark: "#374151"   // gray-700
            },
            highlight: {
                light: "#eff6ff", // blue-50 (used in headers, etc)
                dark: "rgba(30, 58, 138, 0.4)"   // blue-900/40
            }
        },

        // Typography
        text: {
            main: {
                light: "#111827", // gray-900
                dark: "#f3f4f6"   // gray-100
            },
            muted: {
                light: "#6b7280", // gray-500
                dark: "#9ca3af"   // gray-400
            },
            inverted: {
                light: "#ffffff",
                dark: "#111827"
            }
        },

        // Borders
        border: {
            default: {
                light: "#e5e7eb", // gray-200
                dark: "#374151"   // gray-700
            },
            focus: {
                light: "#9ca3af", // gray-400
                dark: "#4b5563"   // gray-600
            }
        },

        // Brand / Interactive
        primary: {
            main: {
                light: "#2563eb", // blue-600
                dark: "#3b82f6"   // blue-500
            },
            hover: {
                light: "#1e40af", // blue-800
                dark: "#93c5fd"   // blue-300
            },
            light: {
                light: "#dbeafe", // blue-100
                dark: "rgba(30, 58, 138, 0.4)" // blue-900/40
            },
            text: {
                light: "#1d4ed8", // blue-700
                dark: "#93c5fd"   // blue-300
            }
        },

        // Status & Difficulty
        status: {
            success: {
                light: "#16a34a", // green-600
                dark: "#22c55e"   // green-500
            },
            warning: {
                light: "#ca8a04", // yellow-600
                dark: "#eab308"   // yellow-500
            },
            error: {
                light: "#dc2626", // red-600
                dark: "#ef4444"   // red-500
            }
        },

        // Performance / Ratings (Likert Scale)
        performance: {
            1: "#8c2f39", // Deep Crimson
            2: "#b25d48", // Muted Rust
            3: "#d6c68b", // Pale Gold
            4: "#8aa29e", // Cold Teal
            5: "#203354", // Deep Navy
        }
    }
};

/**
 * Legacy support for direct performance color access.
 * @param {number} score 
 * @returns {string} Hex color
 */
export const getPerformanceColor = (score) => {
    return theme.colors.performance[score] || "#e5e7eb";
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
