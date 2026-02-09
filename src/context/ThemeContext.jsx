import { createContext, useContext, useEffect, useState } from 'react';
import { theme } from '../utils/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        // Check local storage or system preference
        if (localStorage.getItem('theme') === 'dark') return true;
        if (localStorage.getItem('theme') === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;

        // Remove existing classes
        root.classList.remove('light', 'dark');

        // Add current theme class
        root.classList.add(isDark ? 'dark' : 'light');

        // Apply CSS Variables
        // We flatten the theme object into CSS variables
        const flattenTheme = (obj, prefix = '-') => {
            Object.entries(obj).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    // Check if it's a leaf node with light/dark values
                    if ('light' in value && 'dark' in value) {
                        const cssVar = `${prefix}-${key}`;
                        const colorValue = isDark ? value.dark : value.light;
                        root.style.setProperty(cssVar, colorValue);
                    } else if (typeof value === 'object') {
                        // Recurse, but handle 'default' key specially to avoiding double hyphens
                        const nextPrefix = key === 'default' ? prefix : `${prefix}-${key}`;
                        flattenTheme(value, nextPrefix);
                    }
                } else {
                    // For direct values like performance colors
                    root.style.setProperty(`${prefix}-${key}`, value);
                }
            });
        };

        // We only flatten colors for now as that's the main dynamic part
        flattenTheme(theme.colors, '--color');

        localStorage.setItem('theme', isDark ? 'dark' : 'light');

    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
