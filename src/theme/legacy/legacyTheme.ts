export const Primary = {
  100: "#ffc9c2",
  200: "#ffb2a7",
  300: "#fe9a8c",
  400: "#fe8372",
  500: "#fe6c57",
  600: "#fb553e",
  700: "#d84936",
  800: "#b53d2d",
  900: "#923124",
  1000: "#6f261b",
  1100: "#4c1a13",
  1200: "#290e0a",
};

export const Secondary = {
  100: "#bbc7e7",
  200: "#9eafdd",
  300: "#8197d2",
  400: "#637fc8",
  500: "#4667be",
  600: "#2b50b2",
  700: "#254599",
  800: "#1f3a80",
  900: "#192f67",
  1000: "#13234f",
  1100: "#0d1836",
  1200: "#070d1d",
};

export const Neutral = {
  50: "#ffffff",
  100: "#d7d7d7",
  200: "#c0c0c0",
  300: "#a8a8a8",
  400: "#919191",
  500: "#797979",
  600: "#606060",
  700: "#474747",
  800: "#2e2e2e",
  900: "#151515",
  950: "#000000",
};

export const Attention = {
  100: "#f7b8bd",
  200: "#f38e96",
  300: "#ee646f",
  400: "#ea3a48",
  500: "#d51f2d",
  600: "#a91924",
  700: "#7d121a",
  800: "#510c11",
  900: "#250508",
};

export const FontSizes = {
  xs: 8,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 36,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
};

const Theme = {
  colors: {
    primary: Primary,
    secondary: Secondary,
    neutral: Neutral,
    attention: Attention,
  },
  fontSizes: FontSizes,
  spacing: FontSizes,
  borderRadius: BorderRadius,
};

export type ThemeType = typeof Theme;
export default Theme;
