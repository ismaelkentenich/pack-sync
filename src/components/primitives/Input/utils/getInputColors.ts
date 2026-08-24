import Theme from "@theme/theme";
import type { InputState } from "../types";

export type InputColors = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  placeholderColor: string;
  labelColor: string;
  iconColor: string;
  supportingTextColor: string;
};

export function getInputColors(
  state: InputState,
): InputColors {
  switch (state) {
    case "focused":
      return {
        backgroundColor: Theme.colors.neutral[50],
        borderColor: Theme.colors.primary[600],
        textColor: Theme.colors.neutral[900],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.primary[600],
        iconColor: Theme.colors.primary[600],
        supportingTextColor: Theme.colors.neutral[600],
      };

    case "error":
      return {
        backgroundColor: Theme.colors.neutral[50],
        borderColor: Theme.colors.error[500],
        textColor: Theme.colors.neutral[900],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.error[500],
        iconColor: Theme.colors.error[500],
        supportingTextColor: Theme.colors.error[500],
      };

    case "disabled":
      return {
        backgroundColor: Theme.colors.neutral[100],
        borderColor: Theme.colors.neutral[200],
        textColor: Theme.colors.neutral[500],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.neutral[500],
        iconColor: Theme.colors.neutral[400],
        supportingTextColor: Theme.colors.neutral[500],
      };

    case "default":
    default:
      return {
        backgroundColor: Theme.colors.neutral[50],
        borderColor: Theme.colors.neutral[400],
        textColor: Theme.colors.neutral[900],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.neutral[700],
        iconColor: Theme.colors.neutral[500],
        supportingTextColor: Theme.colors.neutral[600],
      };
  }
}
