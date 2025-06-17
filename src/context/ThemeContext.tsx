import React, { createContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'system',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTheme: () => {},
});

/**
 * ThemeProvider manages the application theme (light | dark | system) and is responsible for
 * toggling the `dark` class on the <html> element so Tailwind CSS dark-variant styles apply.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');

  // Reads initial theme from localStorage (stored under the same key used in Settings)
  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme) || 'system';
    setThemeState(stored);
  }, []);

  // Helper: Applies or removes the `dark` class depending on the desired theme and system preference
  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = t === 'dark' || (t === 'system' && prefersDark);

    // Update class on <html>
    if (shouldUseDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Also update the `color-scheme` property so built-in form controls adopt the correct style
    // and tweak the meta theme-color for a more polished appearance on mobile browsers
    root.style.colorScheme = shouldUseDark ? 'dark' : 'light';

    const metaTheme = document.querySelector<HTMLMetaElement>("meta[name='theme-color']");
    if (metaTheme) {
      metaTheme.setAttribute('content', shouldUseDark ? '#0b2545' : '#ffffff');
    }
  }, []);

  // Apply theme whenever state changes and also listen to system preference changes when in `system` mode
  useEffect(() => {
    applyTheme(theme);

    if (theme !== 'system') return; // Only need listener when following system

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => applyTheme('system');
    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme, applyTheme]);

  // Persist theme to localStorage and update state
  const setTheme = (t: Theme) => {
    localStorage.setItem('theme', t);
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 