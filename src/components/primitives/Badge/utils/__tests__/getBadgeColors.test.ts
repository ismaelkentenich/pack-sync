import Theme from "@theme/theme";
import { getBadgeColors } from "../getBadgeColors";

describe("getBadgeColors", () => {
  it("returns primary badge colors", () => {
    expect(getBadgeColors("primary")).toEqual({
      backgroundColor: Theme.colors.primary[200],
      textColor: Theme.colors.primary[900],
    });
  });

  it("returns secondary badge colors", () => {
    expect(getBadgeColors("secondary")).toEqual({
      backgroundColor: Theme.colors.secondary[200],
      textColor: Theme.colors.secondary[900],
    });
  });

  it("returns neutral badge colors", () => {
    expect(getBadgeColors("neutral")).toEqual({
      backgroundColor: Theme.colors.neutral[200],
      textColor: Theme.colors.neutral[800],
    });
  });

  it("returns success badge colors", () => {
    expect(getBadgeColors("success")).toEqual({
      backgroundColor: Theme.colors.success[50],
      textColor: Theme.colors.success[700],
    });
  });

  it("returns warning badge colors", () => {
    expect(getBadgeColors("warning")).toEqual({
      backgroundColor: Theme.colors.warning[50],
      textColor: Theme.colors.warning[700],
    });
  });

  it("returns error badge colors", () => {
    expect(getBadgeColors("error")).toEqual({
      backgroundColor: Theme.colors.error[50],
      textColor: Theme.colors.error[700],
    });
  });
});
