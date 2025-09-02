const lightTheme = {
  colors: {
    typography: '#000000',
    background: 'green',
    background2: 'lightgreen',
  },
};

type AppTheme = typeof lightTheme;

const darkTheme: AppTheme = {
  colors: {
    typography: '#ffffff',
    background: 'red',
    background2: 'pink',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1700,
} as const;

type AppBreakpoints = typeof breakpoints;

declare module '@screensdev/styles' {
  export interface Breakpoints extends AppBreakpoints {}
  export interface Theme extends AppTheme {}
}
