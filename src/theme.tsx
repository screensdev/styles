'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

export interface Theme {}
export interface Breakpoints {}
export type StrictBreakpoints = Record<keyof Breakpoints, number>;

interface ThemeContextValue {
  theme?: Theme;
  breakpoints?: StrictBreakpoints;
}

const defaultContextValue: ThemeContextValue = {};

const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);

function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return defaultContextValue;
  }
  return context;
}

const ThemeProvider = ({
  theme = {},
  breakpoints,
  children,
}: {
  theme?: Theme;
  breakpoints?: StrictBreakpoints;
  children?: ReactNode;
}) => {
  const value = useMemo(
    () => ({
      theme,
      breakpoints,
    }),
    [theme, breakpoints]
  );
  return <ThemeContext value={value}>{children}</ThemeContext>;
};

export { ThemeProvider, useThemeContext };
