import { palette } from "../foundations/colors";
import { ThemeColors } from "../types";

export const darkColors = {
  background: {
    default: palette.neutral[900],
    subtle: palette.neutral[950],
    muted: palette.neutral[800],
    inverse: palette.neutral[0],
    brand: palette.ultramarine[500],
    accent: palette.golden[400],
  },

  surface: {
    default: palette.neutral[900],
    subtle: palette.neutral[800],
    muted: palette.neutral[700],

    brand: palette.ultramarine[500],
    brandSubtle: palette.ultramarine[900],

    accent: palette.golden[400],
    accentSubtle: palette.golden[900],

    inverse: palette.neutral[0],

    success: palette.neutral[800],
    warning: palette.neutral[800],
    error: palette.neutral[800],
  },

  text: {
    primary: palette.neutral[50],
    secondary: palette.neutral[400],
    tertiary: palette.neutral[500],
    disabled: palette.neutral[600],

    inverse: palette.neutral[900],
    brand: palette.ultramarine[300],

    success: palette.green[500],
    warning: palette.amber[500],
    error: palette.red[500],
  },

  icon: {
    primary: palette.neutral[50],
    secondary: palette.neutral[400],
    disabled: palette.neutral[600],
    inverse: palette.neutral[900],
    brand: palette.ultramarine[300],
  },

  border: {
    default: palette.neutral[700],
    subtle: palette.neutral[800],
    strong: palette.neutral[400],

    brand: palette.ultramarine[400],
    error: palette.red[500],
  },

  action: {
    primary: {
      background: palette.neutral[50],
      foreground: palette.neutral[900],
    },

    brand: {
      background: palette.ultramarine[500],
      foreground: palette.neutral[0],
    },

    accent: {
      background: palette.golden[400],
      foreground: palette.neutral[900],
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
      background: palette.neutral[800],
      foreground: palette.green[500],
    },

    warning: {
      background: palette.neutral[800],
      foreground: palette.amber[500],
    },

    error: {
      background: palette.neutral[800],
      foreground: palette.red[500],
    },

    info: {
      background: palette.ultramarine[900],
      foreground: palette.ultramarine[300],
    },
  },
} as const satisfies ThemeColors;
