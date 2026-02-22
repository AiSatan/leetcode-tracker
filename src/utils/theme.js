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
                light: "#F5F7FA", // cool-grey-050
                dark: "#1F2933"   // cool-grey-900
            },
            surface: {
                light: "#FFFFFF",
                dark: "#323F4B"   // cool-grey-800
            },
            subtle: {
                light: "#E4E7EB", // cool-grey-100
                dark: "#3E4C59"   // cool-grey-700
            },
            highlight: {
                light: "#BED0F7", // indigo-100
                dark: "rgba(76, 99, 182, 0.15)" // indigo-500 tint
            }
        },

        // Typography
        text: {
            main: {
                light: "#1F2933", // cool-grey-900
                dark: "#F5F7FA"   // cool-grey-050
            },
            muted: {
                light: "#616E7C", // cool-grey-500
                dark: "#9AA5B1"   // cool-grey-300
            },
            inverted: {
                light: "#FFFFFF",
                dark: "#1F2933"   // cool-grey-900
            }
        },

        // Borders
        border: {
            default: {
                light: "#CBD2D9", // cool-grey-200
                dark: "#3E4C59"   // cool-grey-700
            },
            focus: {
                light: "#4C63B6", // indigo-500
                dark: "#647ACB"   // indigo-400
            }
        },

        // Brand / Interactive
        primary: {
            main: {
                light: "#4C63B6", // indigo-500
                dark: "#647ACB"   // indigo-400
            },
            hover: {
                light: "#4055A8", // indigo-600
                dark: "#7B93DB"   // indigo-300
            },
            light: {
                light: "#E0E8F9", // indigo-050
                dark: "rgba(76, 99, 182, 0.15)"
            },
            text: {
                light: "#35469C", // indigo-700
                dark: "#98AEEB"   // indigo-200
            }
        },

        // Status & Difficulty
        status: {
            success: {
                main: { light: "#27AB83", dark: "#3EBD93" },
                hover: { light: "#199473", dark: "#65D6AD" }
            },
            warning: {
                main: { light: "#F0B429", dark: "#F7C948" },
                hover: { light: "#DE911D", dark: "#FADB5F" }
            },
            error: {
                main: { light: "#E12D39", dark: "#EF4E4E" },
                hover: { light: "#CF1124", dark: "#F86A6A" }
            }
        },

        // Performance / Ratings (Likert Scale)
        performance: {
            1: { light: "#E12D39", dark: "#EF4E4E" }, // red
            2: { light: "#F0B429", dark: "#F7C948" }, // yellow
            3: { light: "#2BB0ED", dark: "#40C3F7" }, // light-blue
            4: { light: "#4C63B6", dark: "#647ACB" }, // indigo
            5: { light: "#27AB83", dark: "#3EBD93" }, // teal
        },

        // Categorical / Roadmap Colors
        categorical: {
            blue: { light: "#2BB0ED", dark: "#40C3F7" },
            blueDim: { light: "rgba(43, 176, 237, 0.1)", dark: "rgba(64, 195, 247, 0.15)" },
            green: { light: "#27AB83", dark: "#3EBD93" },
            greenDim: { light: "rgba(39, 171, 131, 0.1)", dark: "rgba(62, 189, 147, 0.15)" },
            purple: { light: "#7B93DB", dark: "#98AEEB" },
            purpleDim: { light: "rgba(123, 147, 219, 0.1)", dark: "rgba(152, 174, 235, 0.15)" },
            yellow: { light: "#F0B429", dark: "#F7C948" },
            yellowDim: { light: "rgba(240, 180, 41, 0.1)", dark: "rgba(247, 201, 72, 0.15)" },
            red: { light: "#E12D39", dark: "#EF4E4E" },
            redDim: { light: "rgba(225, 45, 57, 0.1)", dark: "rgba(239, 78, 78, 0.15)" },
            indigo: { light: "#4C63B6", dark: "#647ACB" },
            indigoDim: { light: "rgba(76, 99, 182, 0.1)", dark: "rgba(100, 122, 203, 0.15)" },
            pink: { light: "#4C63B6", dark: "#647ACB" },
            pinkDim: { light: "rgba(76, 99, 182, 0.1)", dark: "rgba(100, 122, 203, 0.15)" },
            orange: { light: "#DE911D", dark: "#FADB5F" },
            orangeDim: { light: "rgba(222, 145, 29, 0.1)", dark: "rgba(250, 219, 95, 0.15)" },
            teal: { light: "#27AB83", dark: "#3EBD93" },
            tealDim: { light: "rgba(39, 171, 131, 0.1)", dark: "rgba(62, 189, 147, 0.15)" },
            cyan: { light: "#2BB0ED", dark: "#40C3F7" },
            cyanDim: { light: "rgba(43, 176, 237, 0.1)", dark: "rgba(64, 195, 247, 0.15)" }
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
