/**
 * Dojo Theme — Quiet Japanese-stationery minimalism.
 *
 * Light  : washi paper, sumi ink, single vermillion seal accent
 * Dark   : inkstone night, parchment text, brighter seal
 *
 * Colors are defined semantically. Each leaf value has { light, dark }
 * and is flattened into CSS variables by ThemeContext at runtime.
 */
export const theme = {
    colors: {
        // Base layout — washi paper / inkstone night
        background: {
            page: {
                light: "#F4EFE5",   // warm washi
                dark: "#1E1A15"     // lifted inkstone — was #15120F, too compressed
            },
            surface: {
                light: "#FBF6EB",   // unbleached paper
                dark: "#26221C"     // clearer step above page
            },
            subtle: {
                light: "#ECE3D1",   // aged paper grain
                dark: "#302B23"
            },
            highlight: {
                light: "#E5D8BC",   // warm parchment highlight
                dark: "#3B342A"
            }
        },

        // Typography — sumi ink on paper
        text: {
            main: {
                light: "#1B1714",
                dark: "#F1E7D0"
            },
            muted: {
                light: "#6B5F52",
                dark: "#AB9D87"     // lifted to match brighter bg
            },
            inverted: {
                light: "#FBF6EB",
                dark: "#1E1A15"
            }
        },

        // Borders — hairlines, paper grain
        border: {
            default: {
                light: "#D5C9B0",
                dark: "#3F3A30"     // visible against lifted surface
            },
            focus: {
                light: "#B5371A",
                dark: "#D2553A"
            }
        },

        // Vermillion seal — the single brand accent
        primary: {
            main: {
                light: "#B5371A",
                dark: "#D2553A"
            },
            hover: {
                light: "#952C13",
                dark: "#E16A52"
            },
            light: {
                light: "rgba(181, 55, 26, 0.08)",
                dark: "rgba(210, 85, 58, 0.16)"
            },
            text: {
                light: "#7A2410",
                dark: "#F4A797"
            }
        },

        // Status — earthy semantics
        status: {
            success: {                     // matcha / cha-iro
                main: { light: "#3F5C42", dark: "#7AA376" },
                hover: { light: "#2F4732", dark: "#8FBA8B" }
            },
            warning: {                     // yamabuki ochre
                main: { light: "#B8842F", dark: "#DCAA52" },
                hover: { light: "#9A6E22", dark: "#EAC169" }
            },
            error: {                       // vermillion
                main: { light: "#B5371A", dark: "#D2553A" },
                hover: { light: "#952C13", dark: "#E16A52" }
            }
        },

        // Performance / Likert — graded ink wash, struggle → mastered
        performance: {
            1: { light: "#B5371A", dark: "#D2553A" },  // vermillion
            2: { light: "#C66A3D", dark: "#DD8A5C" },  // terracotta
            3: { light: "#B8842F", dark: "#DCAA52" },  // ochre
            4: { light: "#6F8A5A", dark: "#9CB587" },  // sage
            5: { light: "#3F5C42", dark: "#7AA376" }   // deep matcha
        },

        // Categorical — muted earth tones; used for tag tints / radar fills
        categorical: {
            blue:    { light: "#4A6480", dark: "#7892A8" },  // sumi indigo
            blueDim: { light: "rgba(74, 100, 128, 0.10)", dark: "rgba(120, 146, 168, 0.16)" },
            green:   { light: "#6F8A5A", dark: "#9CB587" },
            greenDim:{ light: "rgba(111, 138, 90, 0.10)", dark: "rgba(156, 181, 135, 0.16)" },
            purple:  { light: "#6B5780", dark: "#8E7BA1" },  // muted plum
            purpleDim:{light: "rgba(107, 87, 128, 0.10)", dark: "rgba(142, 123, 161, 0.16)" },
            yellow:  { light: "#B8842F", dark: "#DCAA52" },
            yellowDim:{light: "rgba(184, 132, 47, 0.10)", dark: "rgba(220, 170, 82, 0.16)" },
            red:     { light: "#B5371A", dark: "#D2553A" },
            redDim:  { light: "rgba(181, 55, 26, 0.10)", dark: "rgba(210, 85, 58, 0.16)" },
            indigo:  { light: "#4A6480", dark: "#7892A8" },
            indigoDim:{light: "rgba(74, 100, 128, 0.10)", dark: "rgba(120, 146, 168, 0.16)" },
            pink:    { light: "#A85A5A", dark: "#C97D7D" },  // rose-clay
            pinkDim: { light: "rgba(168, 90, 90, 0.10)", dark: "rgba(201, 125, 125, 0.16)" },
            orange:  { light: "#C66A3D", dark: "#DD8A5C" },
            orangeDim:{light: "rgba(198, 106, 61, 0.10)", dark: "rgba(221, 138, 92, 0.16)" },
            teal:    { light: "#4A7370", dark: "#7FA09C" },  // aged celadon
            tealDim: { light: "rgba(74, 115, 112, 0.10)", dark: "rgba(127, 160, 156, 0.16)" },
            cyan:    { light: "#5A7A85", dark: "#8AAAB5" },  // ash blue
            cyanDim: { light: "rgba(90, 122, 133, 0.10)", dark: "rgba(138, 170, 181, 0.16)" }
        }
    }
};

/**
 * Direct access to performance ink color via CSS variable.
 * @param {number} score 1..5
 */
export const getPerformanceColor = (score) => {
    return theme.colors.performance[score]
        ? `var(--color-performance-${score})`
        : "var(--color-border-default)";
};

/**
 * Builds CSS variable maps for :root (light) and .dark.
 * Kept for legacy callers; ThemeContext also flattens directly.
 */
export const generateThemeVariables = () => {
    const vars = { root: {}, dark: {} };

    const processColor = (key, value, prefix = '-') => {
        if (typeof value === 'string') {
            vars.root[`${prefix}-${key}`] = value;
            vars.dark[`${prefix}-${key}`] = value;
        } else if (value.light && value.dark) {
            vars.root[`${prefix}-${key}`] = value.light;
            vars.dark[`${prefix}-${key}`] = value.dark;
        } else {
            Object.entries(value).forEach(([k, v]) => {
                const step = k === 'default' ? '' : `-${k}`;
                processColor(k, v, `${prefix}${step}`);
            });
        }
    };

    Object.entries(theme.colors).forEach(([category, values]) => {
        processColor(category, values, `--color-${category}`);
    });

    return vars;
};
