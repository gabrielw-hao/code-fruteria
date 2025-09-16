import React, { createContext, useContext, useState } from 'react';
import { THEME_LIGHT, THEME_DARK } from '../constants';

export type ThemeType = 'dark' | 'light';

export const THEME_KEY = 'theme';

const ThemeContext = createContext<{
  theme: ThemeType;
  toggleTheme: () => void;
}>({
  theme: 'dark',
  toggleTheme: () => {},
});

const getInitialTheme = (): ThemeType => {
  const stored = localStorage.getItem('theme');
  if (stored === THEME_DARK || stored === THEME_LIGHT) return stored;
  const userPref =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = userPref ? THEME_DARK : THEME_LIGHT;
  localStorage.setItem(THEME_KEY, theme);
  return theme;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>(getInitialTheme());
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === THEME_DARK ? THEME_LIGHT : THEME_DARK;
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
