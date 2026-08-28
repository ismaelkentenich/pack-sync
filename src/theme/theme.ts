import { palette } from "./foundations/colors";
import { radius } from "./foundations/radius";
import { sizing } from "./foundations/sizing";
import { spacing } from "./foundations/spacing";
import { typography } from "./foundations/typography";

const Theme = {
  colors: {
    primary: palette.royalBlue,
    secondary: palette.teal,
    neutral: palette.neutral,
    success: palette.green,
    warning: palette.amber,
    error: palette.red,
  },

  typography,
  spacing,
  radius,
  sizing,
} as const;

export default Theme;
