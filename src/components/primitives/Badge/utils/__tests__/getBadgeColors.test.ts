import Theme from "@theme/theme";
import { getBadgeColors } from "../getBadgeColors";

describe("getBadgeColors", () => {
  it("returns status colors", () => {
    expect(getBadgeColors("status")).toEqual({
      backgroundColor: Theme.colors.primary[200],
      textColor: Theme.colors.primary[900],
    });
  });

  it("returns delivery colors", () => {
    expect(getBadgeColors("delivery")).toEqual({
      backgroundColor: Theme.colors.secondary[200],
      textColor: Theme.colors.secondary[900],
    });
  });
});
