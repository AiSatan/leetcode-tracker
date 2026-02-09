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
                light: "#EEE9DF", // Palladian
                dark: "#1B2632"   // Abyssal Anchorfish Blue
            },
            surface: {
                light: "#FFFFFF", // White
                dark: "#2C3B4D"   // Blue Fantastic
            },
            subtle: {
                light: "#C9C1B1", // Oatmeal
                dark: "#233040"   // Slightly darker Blue Fantastic
            },
            highlight: {
                light: "#FFB162", // Burning Flame (low opacity usually)
                dark: "rgba(255, 177, 98, 0.1)"   // Burning Flame tint
            }
        },

        // Typography
        text: {
            main: {
                light: "#1B2632", // Abyssal Anchorfish Blue
                dark: "#EEE9DF"   // Palladian
            },
            muted: {
                light: "#5C6B7F", // Muted Blue
                dark: "#C9C1B1"   // Oatmeal
            },
            inverted: {
                light: "#FFFFFF",
                dark: "#000000"
            }
        },

        // Borders
        border: {
            default: {
                light: "#C9C1B1", // Oatmeal
                dark: "#374A5E"   // Lighter Blue Fantastic
            },
            focus: {
                light: "#A35139", // Truffle Trouble
                dark: "#FFB162"   // Burning Flame
            }
        },

        // Brand / Interactive
        primary: {
            main: {
                light: "#A35139", // Truffle Trouble
                dark: "#FFB162"   // Burning Flame
            },
            hover: {
                light: "#8B4530", // Darker Truffle
                dark: "#FFC285"   // Brighter Flame
            },
            light: {
                light: "rgba(163, 81, 57, 0.1)", // Truffle Low Opacity
                dark: "rgba(255, 177, 98, 0.15)" // Flame Low Opacity
            },
            text: {
                light: "#A35139", // Truffle Trouble
                dark: "#FFB162"   // Burning Flame
            }
        },

        // Status & Difficulty
        status: {
            success: {
                light: "#A35139", // Truffle Trouble
                dark: "#FFB162"   // Burning Flame
            },
            warning: {
                light: "#D97706",
                dark: "#F59E0B"
            },
            error: {
                light: "#DC2626",
                dark: "#EF4444"
            }
        },

        // Performance / Ratings (Likert Scale)
        performance: {
            1: { light: "#A35139", dark: "#A35139" }, // Truffle Trouble
            2: { light: "#B96943", dark: "#B96943" }, // Mix
            3: { light: "#D0814D", dark: "#D0814D" }, // Mix
            4: { light: "#E79957", dark: "#E79957" }, // Mix
            5: { light: "#FFB162", dark: "#FFB162" }, // Burning Flame
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
