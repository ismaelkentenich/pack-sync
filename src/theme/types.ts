import type { radius } from "./foundations/radius";
import type { sizing } from "./foundations/sizing";
import type { spacing } from "./foundations/spacing";

type SemanticColor = string;

type ActionColors = {
  background: SemanticColor;
  foreground: SemanticColor;
};

type StatusColors = {
  background: SemanticColor;
  foreground: SemanticColor;
};

export type ThemeColors = {
  background: {
    default: SemanticColor;
    subtle: SemanticColor;
    muted: SemanticColor;
    inverse: SemanticColor;
    brand: SemanticColor;
    accent: SemanticColor;
  };

  surface: {
    default: SemanticColor;
    subtle: SemanticColor;
    muted: SemanticColor;

    brand: SemanticColor;
    brandSubtle: SemanticColor;

    accent: SemanticColor;
    accentSubtle: SemanticColor;

    inverse: SemanticColor;

    success: SemanticColor;
    warning: SemanticColor;
    error: SemanticColor;
  };

  text: {
    primary: SemanticColor;
    secondary: SemanticColor;
    tertiary: SemanticColor;
    disabled: SemanticColor;

    inverse: SemanticColor;
    brand: SemanticColor;

    success: SemanticColor;
    warning: SemanticColor;
    error: SemanticColor;
  };

  icon: {
    primary: SemanticColor;
    secondary: SemanticColor;
    disabled: SemanticColor;

    inverse: SemanticColor;
    brand: SemanticColor;
  };

  border: {
    default: SemanticColor;
    subtle: SemanticColor;
    strong: SemanticColor;

    brand: SemanticColor;
    error: SemanticColor;
  };

  action: {
    primary: ActionColors;
    brand: ActionColors;
    accent: ActionColors;
    secondary: ActionColors;
    disabled: ActionColors;
    danger: ActionColors;
  };

  status: {
    success: StatusColors;
    warning: StatusColors;
    error: StatusColors;
    info: StatusColors;
  };
};

export type AppTheme = {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  sizing: typeof sizing;
};
