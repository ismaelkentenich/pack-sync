import Theme from "@theme/theme";
import type { ButtonSize } from "../types";

export function getButtonHeight(size: ButtonSize): number {
  switch (size) {
    case "sm":
      return Theme.sizing.control.sm;

    case "lg":
      return Theme.sizing.control.lg;

    case "md":
    default:
      return Theme.sizing.control.md;
  }
}
