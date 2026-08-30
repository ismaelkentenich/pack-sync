import { darkTheme, lightTheme } from "@theme/appTheme";
import { getButtonColors } from "../getButtonColors";

describe("getButtonColors", () => {
  describe("with default (light) theme", () => {
    it.each([
      [
        "primary",
        {
          backgroundColor:
            lightTheme.colors.action.primary.background,
          borderColor:
            lightTheme.colors.action.primary.background,
          textColor:
            lightTheme.colors.action.primary.foreground,
        },
      ],
      [
        "brand",
        {
          backgroundColor:
            lightTheme.colors.action.brand.background,
          borderColor:
            lightTheme.colors.action.brand.background,
          textColor:
            lightTheme.colors.action.brand.foreground,
        },
      ],
      [
        "accent",
        {
          backgroundColor:
            lightTheme.colors.action.accent.background,
          borderColor:
            lightTheme.colors.action.accent.background,
          textColor:
            lightTheme.colors.action.accent.foreground,
        },
      ],
      [
        "secondary",
        {
          backgroundColor:
            lightTheme.colors.action.secondary.background,
          borderColor:
            lightTheme.colors.action.secondary.background,
          textColor:
            lightTheme.colors.action.secondary.foreground,
        },
      ],
      [
        "outline",
        {
          backgroundColor: "transparent",
          borderColor: lightTheme.colors.border.strong,
          textColor: lightTheme.colors.text.primary,
        },
      ],
      [
        "danger",
        {
          backgroundColor:
            lightTheme.colors.action.danger.background,
          borderColor:
            lightTheme.colors.action.danger.background,
          textColor:
            lightTheme.colors.action.danger.foreground,
        },
      ],
    ] as const)(
      "returns the expected colors for %s",
      (variant, expectedColors) => {
        expect(getButtonColors(variant)).toEqual(
          expectedColors,
        );
        expect(
          getButtonColors(variant, lightTheme),
        ).toEqual(expectedColors);
      },
    );

    it.each([
      "primary",
      "brand",
      "accent",
      "secondary",
      "outline",
      "danger",
    ] as const)(
      "returns disabled colors for %s when disabled",
      (variant) => {
        const expectedDisabledColors = {
          backgroundColor:
            lightTheme.colors.action.disabled.background,
          borderColor:
            lightTheme.colors.action.disabled.background,
          textColor:
            lightTheme.colors.action.disabled.foreground,
        };

        expect(getButtonColors(variant, true)).toEqual(
          expectedDisabledColors,
        );
        expect(
          getButtonColors(variant, lightTheme, true),
        ).toEqual(expectedDisabledColors);
      },
    );
  });

  describe("with dark theme", () => {
    it.each([
      [
        "primary",
        {
          backgroundColor:
            darkTheme.colors.action.primary.background,
          borderColor:
            darkTheme.colors.action.primary.background,
          textColor:
            darkTheme.colors.action.primary.foreground,
        },
      ],
      [
        "brand",
        {
          backgroundColor:
            darkTheme.colors.action.brand.background,
          borderColor:
            darkTheme.colors.action.brand.background,
          textColor:
            darkTheme.colors.action.brand.foreground,
        },
      ],
      [
        "outline",
        {
          backgroundColor: "transparent",
          borderColor: darkTheme.colors.border.strong,
          textColor: darkTheme.colors.text.primary,
        },
      ],
    ] as const)(
      "returns the expected dark theme colors for %s",
      (variant, expectedColors) => {
        expect(getButtonColors(variant, darkTheme)).toEqual(
          expectedColors,
        );
      },
    );

    it("returns dark theme disabled colors when disabled", () => {
      expect(
        getButtonColors("primary", darkTheme, true),
      ).toEqual({
        backgroundColor:
          darkTheme.colors.action.disabled.background,
        borderColor:
          darkTheme.colors.action.disabled.background,
        textColor:
          darkTheme.colors.action.disabled.foreground,
      });
    });
  });
});
