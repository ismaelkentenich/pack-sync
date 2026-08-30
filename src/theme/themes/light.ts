import { ThemeColors } from "@theme/types";
import { palette } from "../foundations/colors";

export const lightColors = {
  background: {
    default: palette.neutral[0],
    subtle: palette.neutral[100],
    muted: palette.neutral[200],
    inverse: palette.neutral[900],
    brand: palette.royalBlue[600],
    accent: palette.teal[500],
  },

  surface: {
    default: palette.neutral[0],
    subtle: palette.neutral[50],
    muted: palette.neutral[200],

    brand: palette.royalBlue[600],
    brandSubtle: palette.royalBlue[50],

    accent: palette.teal[500],
    accentSubtle: palette.teal[50],

    inverse: palette.neutral[900],

    success: palette.green[50],
    warning: palette.amber[50],
    error: palette.red[50],
  },

  text: {
    primary: palette.neutral[900],
    secondary: palette.neutral[600],
    tertiary: palette.neutral[500],
    disabled: palette.neutral[400],

    inverse: palette.neutral[0],
    brand: palette.royalBlue[600],

    success: palette.green[700],
    warning: palette.amber[700],
    error: palette.red[700],
  },

  icon: {
    primary: palette.neutral[900],
    secondary: palette.neutral[600],
    disabled: palette.neutral[400],
    inverse: palette.neutral[0],
    brand: palette.royalBlue[600],
  },

  border: {
    default: palette.neutral[300],
    subtle: palette.neutral[200],
    strong: palette.neutral[700],

    brand: palette.royalBlue[600],
    error: palette.red[500],
  },

  action: {
    primary: {
      background: palette.neutral[900],
      foreground: palette.neutral[0],
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
      background: palette.neutral[200],
      foreground: palette.neutral[900],
    },

    disabled: {
      background: palette.neutral[300],
      foreground: palette.neutral[500],
    },

    danger: {
      background: palette.red[500],
      foreground: palette.neutral[0],
    },
  },

  status: {
    success: {
      background: palette.green[50],
      foreground: palette.green[700],
    },

    warning: {
      background: palette.amber[50],
      foreground: palette.amber[700],
    },

    error: {
      background: palette.red[50],
      foreground: palette.red[700],
    },

    info: {
      background: palette.royalBlue[50],
      foreground: palette.royalBlue[700],
    },
  },
} as const satisfies ThemeColors;
