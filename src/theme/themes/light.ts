import { ThemeColors } from "@theme/types";
import { palette } from "../foundations/colors";

export const lightColors = {
  background: {
    default: palette.neutral[0],
    subtle: palette.neutral[50],
    muted: palette.neutral[200],
    inverse: palette.neutral[900],
    brand: palette.ultramarine[500],
    accent: palette.golden[400],
  },

  surface: {
    default: palette.neutral[0],
    subtle: palette.neutral[100],
    muted: palette.neutral[200],

    brand: palette.ultramarine[500],
    brandSubtle: palette.ultramarine[50],

    accent: palette.golden[400],
    accentSubtle: palette.golden[50],

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
    brand: palette.ultramarine[600],

    success: palette.green[700],
    warning: palette.amber[700],
    error: palette.red[700],
  },

  icon: {
    primary: palette.neutral[900],
    secondary: palette.neutral[600],
    disabled: palette.neutral[400],
    inverse: palette.neutral[0],
    brand: palette.ultramarine[500],
  },

  border: {
    default: palette.neutral[300],
    subtle: palette.neutral[200],
    strong: palette.neutral[700],

    brand: palette.ultramarine[500],
    error: palette.red[500],
  },

  action: {
    primary: {
      background: palette.neutral[900],
      foreground: palette.neutral[0],
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
      background: palette.ultramarine[50],
      foreground: palette.ultramarine[700],
    },
  },
} as const satisfies ThemeColors;
