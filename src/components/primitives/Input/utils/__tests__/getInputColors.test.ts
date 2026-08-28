import { darkTheme, lightTheme } from "@theme/appTheme";
import { getInputColors } from "../getInputColors";

describe("getInputColors", () => {
  describe("with default (light) theme", () => {
    it.each([
      [
        "default",
        {
          backgroundColor:
            lightTheme.colors.surface.default,
          borderColor: lightTheme.colors.border.default,
          textColor: lightTheme.colors.text.primary,
          placeholderColor: lightTheme.colors.text.disabled,
          labelColor: lightTheme.colors.text.secondary,
          iconColor: lightTheme.colors.icon.secondary,
          supportingTextColor:
            lightTheme.colors.text.secondary,
        },
      ],
      [
        "focused",
        {
          backgroundColor:
            lightTheme.colors.surface.default,
          borderColor: lightTheme.colors.border.brand,
          textColor: lightTheme.colors.text.primary,
          placeholderColor: lightTheme.colors.text.disabled,
          labelColor: lightTheme.colors.text.brand,
          iconColor: lightTheme.colors.icon.brand,
          supportingTextColor:
            lightTheme.colors.text.secondary,
        },
      ],
      [
        "error",
        {
          backgroundColor:
            lightTheme.colors.surface.default,
          borderColor: lightTheme.colors.border.error,
          textColor: lightTheme.colors.text.primary,
          placeholderColor: lightTheme.colors.text.disabled,
          labelColor: lightTheme.colors.text.error,
          iconColor: lightTheme.colors.text.error,
          supportingTextColor: lightTheme.colors.text.error,
        },
      ],
      [
        "disabled",
        {
          backgroundColor: lightTheme.colors.surface.subtle,
          borderColor: lightTheme.colors.border.subtle,
          textColor: lightTheme.colors.text.disabled,
          placeholderColor: lightTheme.colors.text.disabled,
          labelColor: lightTheme.colors.text.disabled,
          iconColor: lightTheme.colors.icon.disabled,
          supportingTextColor:
            lightTheme.colors.text.disabled,
        },
      ],
    ] as const)(
      "returns the expected colors for %s state",
      (state, expectedColors) => {
        expect(getInputColors(state)).toEqual(
          expectedColors,
        );
        expect(getInputColors(state, lightTheme)).toEqual(
          expectedColors,
        );
      },
    );
  });

  describe("with dark theme", () => {
    it.each([
      [
        "default",
        {
          backgroundColor: darkTheme.colors.surface.default,
          borderColor: darkTheme.colors.border.default,
          textColor: darkTheme.colors.text.primary,
          placeholderColor: darkTheme.colors.text.disabled,
          labelColor: darkTheme.colors.text.secondary,
          iconColor: darkTheme.colors.icon.secondary,
          supportingTextColor:
            darkTheme.colors.text.secondary,
        },
      ],
      [
        "focused",
        {
          backgroundColor: darkTheme.colors.surface.default,
          borderColor: darkTheme.colors.border.brand,
          textColor: darkTheme.colors.text.primary,
          placeholderColor: darkTheme.colors.text.disabled,
          labelColor: darkTheme.colors.text.brand,
          iconColor: darkTheme.colors.icon.brand,
          supportingTextColor:
            darkTheme.colors.text.secondary,
        },
      ],
      [
        "error",
        {
          backgroundColor: darkTheme.colors.surface.default,
          borderColor: darkTheme.colors.border.error,
          textColor: darkTheme.colors.text.primary,
          placeholderColor: darkTheme.colors.text.disabled,
          labelColor: darkTheme.colors.text.error,
          iconColor: darkTheme.colors.text.error,
          supportingTextColor: darkTheme.colors.text.error,
        },
      ],
      [
        "disabled",
        {
          backgroundColor: darkTheme.colors.surface.subtle,
          borderColor: darkTheme.colors.border.subtle,
          textColor: darkTheme.colors.text.disabled,
          placeholderColor: darkTheme.colors.text.disabled,
          labelColor: darkTheme.colors.text.disabled,
          iconColor: darkTheme.colors.icon.disabled,
          supportingTextColor:
            darkTheme.colors.text.disabled,
        },
      ],
    ] as const)(
      "returns the expected colors for %s state in dark theme",
      (state, expectedColors) => {
        expect(getInputColors(state, darkTheme)).toEqual(
          expectedColors,
        );
      },
    );
  });
});
