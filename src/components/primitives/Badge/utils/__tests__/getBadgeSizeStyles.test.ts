import Theme from "@theme/theme";
import { getBadgeSizeStyles } from "../getBadgeSizeStyles";

describe("getBadgeSizeStyles", () => {
  it("returns small badge styles", () => {
    expect(getBadgeSizeStyles("sm")).toEqual({
      container: {
        paddingHorizontal: Theme.spacing.xs,
        paddingVertical: Theme.spacing.xxs,
        borderRadius: Theme.radius.xs,
      },
      text: {
        fontSize: Theme.typography.size.xs,
        lineHeight: Theme.typography.lineHeight.xs,
      },
    });
  });

  it("returns medium badge styles", () => {
    expect(getBadgeSizeStyles("md")).toEqual({
      container: {
        paddingHorizontal: Theme.spacing.sm,
        paddingVertical: Theme.spacing.xxs,
        borderRadius: Theme.radius.sm,
      },
      text: {
        fontSize: Theme.typography.size.sm,
        lineHeight: Theme.typography.lineHeight.sm,
      },
    });
  });

  it("returns large badge styles", () => {
    expect(getBadgeSizeStyles("lg")).toEqual({
      container: {
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.xs,
        borderRadius: Theme.radius.md,
      },
      text: {
        fontSize: Theme.typography.size.md,
        lineHeight: Theme.typography.lineHeight.md,
      },
    });
  });
});
