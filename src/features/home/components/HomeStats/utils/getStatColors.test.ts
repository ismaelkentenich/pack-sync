import Theme from "@theme/theme";
import { getStatColors } from "./getStatColors";

describe("getStatColors", () => {
  it("returns success colors", () => {
    expect(getStatColors("success")).toEqual({
      backgroundColor: Theme.colors.primary[400],
      borderColor: Theme.colors.neutral[200],
      valueColor: Theme.colors.neutral[100],
      labelColor: Theme.colors.neutral[100],
    });
  });

  it("returns warning colors", () => {
    expect(getStatColors("warning")).toEqual({
      backgroundColor: Theme.colors.secondary[500],
      borderColor: Theme.colors.secondary[500],
      valueColor: Theme.colors.neutral[100],
      labelColor: Theme.colors.neutral[100],
    });
  });

  it("returns neutral colors", () => {
    expect(getStatColors("neutral")).toEqual({
      backgroundColor: Theme.colors.primary[800],
      borderColor: Theme.colors.neutral[200],
      valueColor: Theme.colors.neutral[100],
      labelColor: Theme.colors.neutral[100],
    });
  });
});
