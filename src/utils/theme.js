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
                main: {
                    light: "#A35139", // Truffle Trouble
                    dark: "#FFB162"   // Burning Flame
                },
                hover: {
                    light: "#8B4530", // Darker Truffle
                    dark: "#FFC285"   // Brighter Flame
                }
            },
            warning: {
                main: {
                    light: "#D97706",
                    dark: "#F59E0B"
                },
                hover: {
                    light: "#B45309",
                    dark: "#D97706"
                }
            },
            error: {
                main: {
                    light: "#DC2626",
                    dark: "#EF4444"
                },
                hover: {
                    light: "#B91C1C",
                    dark: "#DC2626"
                }
            }
        },

        // Performance / Ratings (Likert Scale)
        performance: {
            1: { light: "#704040", dark: "#7E4E4E" }, // Muted Earth Red
            2: { light: "#6E5438", dark: "#7E6048" }, // Muted Earth Brown
            3: { light: "#636030", dark: "#78703A" }, // Dark Olive
            4: { light: "#405A42", dark: "#4D6550" }, // Dark Muted Sage
            5: { light: "#385555", dark: "#486565" }, // Dark Grey-Teal
        },

        // Categorical / Roadmap Colors
        categorical: {
            blue: {
                light: "#4A6FA5", // Muted Blue
                dark: "#6B9AC4"   // Light Blue
            },
            blueDim: {
                light: "rgba(74, 111, 165, 0.1)",
                dark: "rgba(107, 154, 196, 0.2)"
            },
            green: {
                light: "#5E8C61", // Sage Green
                dark: "#7FB083"   // Light Sage
            },
            greenDim: {
                light: "rgba(94, 140, 97, 0.1)",
                dark: "rgba(127, 176, 131, 0.2)"
            },
            purple: {
                light: "#886095", // Muted Purple
                dark: "#A882C7"   // Light Purple
            },
            purpleDim: {
                light: "rgba(136, 96, 149, 0.1)",
                dark: "rgba(168, 130, 199, 0.2)"
            },
            yellow: {
                light: "#D4A017", // Ochre
                dark: "#EAC435"   // Bright Ochre
            },
            yellowDim: {
                light: "rgba(212, 160, 23, 0.1)",
                dark: "rgba(234, 196, 53, 0.2)"
            },
            red: {
                light: "#C04E4E", // Muted Red
                dark: "#E06C6C"   // Light Red
            },
            redDim: {
                light: "rgba(192, 78, 78, 0.1)",
                dark: "rgba(224, 108, 108, 0.2)"
            },
            indigo: {
                light: "#5B6592", // Slate Indigo
                dark: "#7D86B6"   // Light Indigo
            },
            indigoDim: {
                light: "rgba(91, 101, 146, 0.1)",
                dark: "rgba(125, 134, 182, 0.2)"
            },
            pink: {
                light: "#C27BA0", // Dusty Pink
                dark: "#E6A3C4"   // Light Pink
            },
            pinkDim: {
                light: "rgba(194, 123, 160, 0.1)",
                dark: "rgba(230, 163, 196, 0.2)"
            },
            orange: {
                light: "#D67D3E", // Rust
                dark: "#F09D58"   // Light Rust
            },
            orangeDim: {
                light: "rgba(214, 125, 62, 0.1)",
                dark: "rgba(240, 157, 88, 0.2)"
            },
            teal: {
                light: "#4E8E8E", // Teal
                dark: "#70B0B0"   // Light Teal
            },
            tealDim: {
                light: "rgba(78, 142, 142, 0.1)",
                dark: "rgba(112, 176, 176, 0.2)"
            },
            cyan: {
                light: "#5F9EA0", // Cadet Blue
                dark: "#82C0C2"   // Light Cyan
            },
            cyanDim: {
                light: "rgba(95, 158, 160, 0.1)",
                dark: "rgba(130, 192, 194, 0.2)"
            }
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
