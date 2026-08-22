import Theme from "@theme/theme";
import type { ButtonSize } from "../types";

export function getButtonFontSize(
  size: ButtonSize,
): number {
  switch (size) {
    case "sm":
      return Theme.typography.size.sm;

    case "lg":
      return Theme.typography.size.lg;

    case "md":
    default:
      return Theme.typography.size.md;
  }
}
