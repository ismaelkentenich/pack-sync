import Theme from "@theme/theme";
import type { InputState } from "../types";

type InputColors = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  placeholderColor: string;
  labelColor: string;
};

export function getInputColors(
  state: InputState,
): InputColors {
  switch (state) {
    case "focused":
      return {
        backgroundColor: Theme.colors.neutral[50],
        borderColor: Theme.colors.primary[500],
        textColor: Theme.colors.neutral[900],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.neutral[800],
      };

    case "error":
      return {
        backgroundColor: Theme.colors.neutral[50],
        borderColor: Theme.colors.error[500],
        textColor: Theme.colors.neutral[900],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.error[500],
      };

    case "disabled":
      return {
        backgroundColor: Theme.colors.neutral[100],
        borderColor: Theme.colors.neutral[200],
        textColor: Theme.colors.neutral[500],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.neutral[500],
      };

    case "default":
    default:
      return {
        backgroundColor: Theme.colors.neutral[50],
        borderColor: Theme.colors.neutral[300],
        textColor: Theme.colors.neutral[900],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.neutral[700],
      };
  }
}
