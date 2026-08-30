import Theme from "@theme/theme";
import type { ButtonSize } from "../types";

export function getButtonLineHeight(
  size: ButtonSize,
): number {
  switch (size) {
    case "sm":
      return Theme.typography.lineHeight.sm;

    case "lg":
      return Theme.typography.lineHeight.lg;

    case "md":
    default:
      return Theme.typography.lineHeight.md;
  }
}
