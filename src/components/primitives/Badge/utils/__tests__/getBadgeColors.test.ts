import { darkTheme, lightTheme } from "@theme/appTheme";
import { getBadgeColors } from "../getBadgeColors";

describe("getBadgeColors", () => {
  describe("with default (light) theme", () => {
    it("returns primary badge colors", () => {
      expect(getBadgeColors("primary")).toEqual({
        backgroundColor:
          lightTheme.colors.surface.brandSubtle,
        textColor: lightTheme.colors.text.brand,
      });
      expect(getBadgeColors("primary", lightTheme)).toEqual(
        {
          backgroundColor:
            lightTheme.colors.surface.brandSubtle,
          textColor: lightTheme.colors.text.brand,
        },
      );
    });

    it("returns secondary badge colors", () => {
      expect(getBadgeColors("secondary")).toEqual({
        backgroundColor:
          lightTheme.colors.surface.accentSubtle,
        textColor: lightTheme.colors.text.primary,
      });
    });

    it("returns neutral badge colors", () => {
      expect(getBadgeColors("neutral")).toEqual({
        backgroundColor: lightTheme.colors.surface.muted,
        textColor: lightTheme.colors.text.primary,
      });
    });

    it("returns success badge colors", () => {
      expect(getBadgeColors("success")).toEqual({
        backgroundColor:
          lightTheme.colors.status.success.background,
        textColor:
          lightTheme.colors.status.success.foreground,
      });
    });

    it("returns warning badge colors", () => {
      expect(getBadgeColors("warning")).toEqual({
        backgroundColor:
          lightTheme.colors.status.warning.background,
        textColor:
          lightTheme.colors.status.warning.foreground,
      });
    });

    it("returns error badge colors", () => {
      expect(getBadgeColors("error")).toEqual({
        backgroundColor:
          lightTheme.colors.status.error.background,
        textColor:
          lightTheme.colors.status.error.foreground,
      });
    });
  });

  describe("with dark theme", () => {
    it("returns primary badge colors in dark theme", () => {
      expect(getBadgeColors("primary", darkTheme)).toEqual({
        backgroundColor:
          darkTheme.colors.surface.brandSubtle,
        textColor: darkTheme.colors.text.brand,
      });
    });

    it("returns neutral badge colors in dark theme", () => {
      expect(getBadgeColors("neutral", darkTheme)).toEqual({
        backgroundColor: darkTheme.colors.surface.muted,
        textColor: darkTheme.colors.text.primary,
      });
    });

    it("returns success badge colors in dark theme", () => {
      expect(getBadgeColors("success", darkTheme)).toEqual({
        backgroundColor:
          darkTheme.colors.status.success.background,
        textColor:
          darkTheme.colors.status.success.foreground,
      });
    });
  });
});
