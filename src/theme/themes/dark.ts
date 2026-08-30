import { palette } from "../foundations/colors";
import { ThemeColors } from "../types";

export const darkColors = {
  background: {
    default: palette.neutral[950],
    subtle: "#0D1627",
    muted: "#132038",
    inverse: palette.neutral[0],
    brand: palette.royalBlue[600],
    accent: palette.teal[500],
  },

  surface: {
    default: palette.neutral[900],
    subtle: palette.neutral[800],
    muted: palette.neutral[700],

    brand: palette.royalBlue[600],
    brandSubtle: "rgba(30, 64, 175, 0.25)",

    accent: palette.teal[500],
    accentSubtle: "rgba(23, 135, 155, 0.25)",

    inverse: palette.neutral[0],

    success: "rgba(35, 155, 86, 0.20)",
    warning: "rgba(217, 133, 0, 0.20)",
    error: "rgba(192, 57, 43, 0.25)",
  },

  text: {
    primary: palette.neutral[50],
    secondary: palette.neutral[400],
    tertiary: palette.neutral[500],
    disabled: palette.neutral[600],

    inverse: palette.neutral[0],
    brand: palette.royalBlue[300],

    success: "#4ADE80",
    warning: "#FBBF24",
    error: "#F87171",
  },

  icon: {
    primary: palette.neutral[50],
    secondary: palette.neutral[400],
    disabled: palette.neutral[600],
    inverse: palette.neutral[0],
    brand: palette.royalBlue[300],
  },

  border: {
    default: palette.neutral[700],
    subtle: "#152A45",
    strong: palette.neutral[400],

    brand: palette.royalBlue[400],
    error: palette.brickRed[400],
  },

  action: {
    primary: {
      background: palette.neutral[50],
      foreground: palette.neutral[900],
    },

    brand: {
      background: palette.royalBlue[600],
      foreground: palette.neutral[0],
    },

    accent: {
      background: palette.teal[500],
      foreground: palette.neutral[0],
    },

    secondary: {
      background: palette.neutral[800],
      foreground: palette.neutral[50],
    },

    disabled: {
      background: palette.neutral[800],
      foreground: palette.neutral[600],
    },

    danger: {
      background: palette.red[500],
      foreground: palette.neutral[0],
    },
  },

  status: {
    success: {
      background: "rgba(35, 155, 86, 0.20)",
      foreground: "#4ADE80",
    },

    warning: {
      background: "rgba(217, 133, 0, 0.20)",
      foreground: "#FBBF24",
    },

    error: {
      background: "rgba(192, 57, 43, 0.25)",
      foreground: "#F87171",
    },

    info: {
      background: "rgba(30, 64, 175, 0.25)",
      foreground: palette.royalBlue[300],
    },
  },
} as const satisfies ThemeColors;
