import { render } from "@testing-library/react-native";
import Theme from "@theme/theme";
import { AnimatedCircleBackground } from "../AnimatedCircleBackground";
import type { AnimatedCircleConfig } from "../types";

const hiddenElementsOptions = {
  includeHiddenElements: true,
};

describe("AnimatedCircleBackground", () => {
  it("renders with the default testID", () => {
    const { getByTestId } = render(
      <AnimatedCircleBackground />,
    );

    expect(
      getByTestId(
        "animatedCircleBackground",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();
  });

  it("renders with a custom testID", () => {
    const { getByTestId } = render(
      <AnimatedCircleBackground testID="customBackground" />,
    );

    expect(
      getByTestId(
        "customBackground",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();
  });

  it("renders the default animated circles", () => {
    const { getByTestId } = render(
      <AnimatedCircleBackground />,
    );

    expect(
      getByTestId(
        "animatedCircle-primary-large",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-secondary-large",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-primary-medium",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-secondary-medium",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-primary-small",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-secondary-small",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();
  });

  it("renders custom circles", () => {
    const circles: AnimatedCircleConfig[] = [
      {
        id: "custom-primary",
        size: 120,
        top: 24,
        left: -20,
        color: Theme.colors.primary[600],
        opacity: 0.2,
        translateX: 40,
        translateY: 80,
        duration: 8000,
      },
      {
        id: "custom-secondary",
        size: 80,
        bottom: 20,
        right: 10,
        color: Theme.colors.secondary[400],
        opacity: 0.3,
        translateX: -30,
        translateY: -50,
        duration: 10000,
      },
    ];

    const { getByTestId } = render(
      <AnimatedCircleBackground circles={circles} />,
    );

    expect(
      getByTestId(
        "animatedCircle-custom-primary",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-custom-secondary",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();
  });

  it("does not render default circles when custom circles are provided", () => {
    const circles: AnimatedCircleConfig[] = [
      {
        id: "custom",
        size: 100,
        top: 0,
        left: 0,
        color: Theme.colors.primary[600],
        opacity: 0.2,
        translateX: 20,
        translateY: 20,
        duration: 5000,
      },
    ];

    const { queryByTestId } = render(
      <AnimatedCircleBackground circles={circles} />,
    );

    expect(
      queryByTestId(
        "animatedCircle-primary-large",
        hiddenElementsOptions,
      ),
    ).toBeNull();

    expect(
      queryByTestId(
        "animatedCircle-custom",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();
  });

  it("renders no circles when an empty array is provided", () => {
    const { getByTestId, queryByTestId } = render(
      <AnimatedCircleBackground circles={[]} />,
    );

    expect(
      getByTestId(
        "animatedCircleBackground",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      queryByTestId(
        "animatedCircle-primary-large",
        hiddenElementsOptions,
      ),
    ).toBeNull();
  });

  it("applies the configured dimensions and position", () => {
    const circles: AnimatedCircleConfig[] = [
      {
        id: "position-test",
        size: 96,
        top: 32,
        right: -12,
        color: Theme.colors.primary[600],
        opacity: 0.25,
        translateX: 20,
        translateY: 40,
        duration: 6000,
      },
    ];

    const { getByTestId } = render(
      <AnimatedCircleBackground circles={circles} />,
    );

    const circle = getByTestId(
      "animatedCircle-position-test",
      hiddenElementsOptions,
    );

    expect(circle).toHaveStyle({
      width: 96,
      height: 96,
      borderRadius: 48,
      top: 32,
      right: -12,
      backgroundColor: Theme.colors.primary[600],
      opacity: 0.25,
    });
  });

  it("renders the dense variant with 12 circles", () => {
    const { getByTestId } = render(
      <AnimatedCircleBackground variant="dense" />,
    );

    expect(
      getByTestId(
        "animatedCircle-dense-orb-1",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-dense-orb-2",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-dense-orb-3",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-dense-particle-3",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();
  });

  it("renders the subtle variant", () => {
    const { getByTestId } = render(
      <AnimatedCircleBackground variant="subtle" />,
    );

    expect(
      getByTestId(
        "animatedCircle-subtle-primary-1",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-subtle-secondary-1",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();
  });

  it("renders the energetic variant with active circles", () => {
    const { getByTestId } = render(
      <AnimatedCircleBackground variant="energetic" />,
    );

    expect(
      getByTestId(
        "animatedCircle-energetic-large-1",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-energetic-particle-2",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();
  });

  it("renders the floating variant with floating bubble circles", () => {
    const { getByTestId } = render(
      <AnimatedCircleBackground variant="floating" />,
    );

    expect(
      getByTestId(
        "animatedCircle-floating-bubble-1",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-floating-bubble-10",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();
  });

  it("renders the minimal variant with 2 large corner orbs", () => {
    const { getByTestId } = render(
      <AnimatedCircleBackground variant="minimal" />,
    );

    expect(
      getByTestId(
        "animatedCircle-minimal-top",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-minimal-bottom",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();
  });

  it("renders the hero spotlight variant", () => {
    const { getByTestId } = render(
      <AnimatedCircleBackground variant="hero" />,
    );

    expect(
      getByTestId(
        "animatedCircle-hero-orb-main",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();

    expect(
      getByTestId(
        "animatedCircle-hero-particle",
        hiddenElementsOptions,
      ),
    ).toBeTruthy();
  });

  it("is hidden from the accessibility tree", () => {
    const { getByTestId } = render(
      <AnimatedCircleBackground />,
    );

    const background = getByTestId(
      "animatedCircleBackground",
      {
        includeHiddenElements: true,
      },
    );

    expect(
      background.props.accessibilityElementsHidden,
    ).toBe(true);

    expect(background.props.importantForAccessibility).toBe(
      "no-hide-descendants",
    );
  });
});
