/**
 * Two-mood theme:
 *
 * Light : Dojo — washi paper, sumi ink, single vermillion seal accent.
 * Dark  : Sakura at night — cool deep ink, drifting petals, sakura-pink accent,
 *         warm petal cream text. A different season, not a recolor.
 *
 * Colors are defined semantically. Each leaf value has { light, dark } and
 * is flattened into CSS variables by ThemeContext at runtime.
 */
export const theme = {
    colors: {
        // Base layout — washi (light) / cool ink night (dark)
        background: {
            page: {
                light: "#F4EFE5",   // warm washi
                dark: "#14111B"     // cool deep ink, slight violet undertone
            },
            surface: {
                light: "#FBF6EB",   // unbleached paper
                dark: "#1E1A26"     // lifted, slightly violet (~1.7:1 step)
            },
            subtle: {
                light: "#ECE3D1",   // aged paper grain
                dark: "#2A2434"     // clearer step for nested surfaces
            },
            highlight: {
                light: "#E5D8BC",   // warm parchment highlight
                dark: "#363042"     // warmer mauve glow
            }
        },

        // Typography — sumi ink on paper / petal cream on ink
        text: {
            main: {
                light: "#1B1714",
                dark: "#F4E8E8"     // warm petal cream, ~13:1 on page
            },
            muted: {
                light: "#6B5F52",
                dark: "#C2B0B8"     // dusty rose-grey, ~7.5:1 (passes AAA)
            },
            inverted: {
                light: "#FBF6EB",
                dark: "#14111B"
            }
        },

        // Borders — hairlines
        border: {
            default: {
                light: "#D5C9B0",
                dark: "#4A4258"     // mauve hairline, ~3.6:1 on page
            },
            focus: {
                light: "#B5371A",
                dark: "#E988A4"     // sakura pink
            }
        },

        // Brand accent — vermillion seal (light) / sakura petal (dark)
        primary: {
            main: {
                light: "#B5371A",
                dark: "#E988A4"     // sakura pink
            },
            hover: {
                light: "#952C13",
                dark: "#F2A0BA"     // brighter petal
            },
            light: {
                light: "rgba(181, 55, 26, 0.08)",
                dark: "rgba(233, 136, 164, 0.22)"   // soft pink halo
            },
            text: {
                light: "#7A2410",
                dark: "#FFD0DC"     // bright petal for text-on-dark
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
            blueDim: { light: "rgba(74, 100, 128, 0.10)", dark: "rgba(120, 146, 168, 0.22)" },
            green:   { light: "#6F8A5A", dark: "#9CB587" },
            greenDim:{ light: "rgba(111, 138, 90, 0.10)", dark: "rgba(156, 181, 135, 0.22)" },
            purple:  { light: "#6B5780", dark: "#8E7BA1" },  // muted plum
            purpleDim:{light: "rgba(107, 87, 128, 0.10)", dark: "rgba(142, 123, 161, 0.22)" },
            yellow:  { light: "#B8842F", dark: "#DCAA52" },
            yellowDim:{light: "rgba(184, 132, 47, 0.10)", dark: "rgba(220, 170, 82, 0.22)" },
            red:     { light: "#B5371A", dark: "#D2553A" },
            redDim:  { light: "rgba(181, 55, 26, 0.10)", dark: "rgba(210, 85, 58, 0.22)" },
            indigo:  { light: "#4A6480", dark: "#7892A8" },
            indigoDim:{light: "rgba(74, 100, 128, 0.10)", dark: "rgba(120, 146, 168, 0.22)" },
            pink:    { light: "#A85A5A", dark: "#C97D7D" },  // rose-clay
            pinkDim: { light: "rgba(168, 90, 90, 0.10)", dark: "rgba(201, 125, 125, 0.22)" },
            orange:  { light: "#C66A3D", dark: "#DD8A5C" },
            orangeDim:{light: "rgba(198, 106, 61, 0.10)", dark: "rgba(221, 138, 92, 0.22)" },
            teal:    { light: "#4A7370", dark: "#7FA09C" },  // aged celadon
            tealDim: { light: "rgba(74, 115, 112, 0.10)", dark: "rgba(127, 160, 156, 0.22)" },
            cyan:    { light: "#5A7A85", dark: "#8AAAB5" },  // ash blue
            cyanDim: { light: "rgba(90, 122, 133, 0.10)", dark: "rgba(138, 170, 181, 0.22)" }
        },

        // Surface texture — barely-perceptible grain.
        // Light: ink-fleck on washi. Dark: faint petal cream on cool ink.
        grain: {
            overlay: {
                light: "rgba(0, 0, 0, 0.012)",
                dark:  "rgba(244, 232, 232, 0.022)"
            }
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
