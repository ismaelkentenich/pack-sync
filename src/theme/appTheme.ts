import { radius } from "./foundations/radius";
import { sizing } from "./foundations/sizing";
import { spacing } from "./foundations/spacing";
import { darkColors } from "./themes/dark";
import { lightColors } from "./themes/light";
import { AppTheme } from "./types";

export const lightTheme: AppTheme = {
  colors: lightColors,
  spacing,
  radius,
  sizing,
};

export const darkTheme: AppTheme = {
  colors: darkColors,
  spacing,
  radius,
  sizing,
};
