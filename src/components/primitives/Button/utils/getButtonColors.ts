import Theme from "@theme/theme";
import type { ButtonColors, ButtonVariant } from "../types";

const disabledColors: ButtonColors = {
  backgroundColor: Theme.colors.neutral[300],
  borderColor: Theme.colors.neutral[300],
  textColor: Theme.colors.neutral[500],
};

export function getButtonColors(
  variant: ButtonVariant,
  disabled = false,
): ButtonColors {
  if (disabled) {
    return disabledColors;
  }

  switch (variant) {
    case "brand":
      return {
        backgroundColor: Theme.colors.primary[500],
        borderColor: Theme.colors.primary[500],
        textColor: Theme.colors.neutral[0],
      };

    case "accent":
      return {
        backgroundColor: Theme.colors.secondary[400],
        borderColor: Theme.colors.secondary[400],
        textColor: Theme.colors.neutral[900],
      };

    case "secondary":
      return {
        backgroundColor: Theme.colors.neutral[200],
        borderColor: Theme.colors.neutral[200],
        textColor: Theme.colors.neutral[900],
      };

    case "outline":
      return {
        backgroundColor: "transparent",
        borderColor: Theme.colors.neutral[900],
        textColor: Theme.colors.neutral[900],
      };

    case "danger":
      return {
        backgroundColor: Theme.colors.error[500],
        borderColor: Theme.colors.error[500],
        textColor: Theme.colors.neutral[0],
      };

    case "primary":
    default:
      return {
        backgroundColor: Theme.colors.neutral[900],
        borderColor: Theme.colors.neutral[900],
        textColor: Theme.colors.neutral[0],
      };
  }
}
