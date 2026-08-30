import { Text, View } from "react-native";
import Theme from "@theme/theme";
import { AnimatedCircleBackground } from "./AnimatedCircleBackground";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta = {
  title: "Primitives/AnimatedCircleBackground",
  component: AnimatedCircleBackground,
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          minHeight: 700,
          backgroundColor: Theme.colors.neutral[100],
          overflow: "hidden",
        }}
      >
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof AnimatedCircleBackground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <AnimatedCircleBackground variant="default" />

      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: Theme.colors.neutral[900],
            textAlign: "center",
          }}
        >
          Default (6 Circles)
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: Theme.colors.neutral[600],
            textAlign: "center",
          }}
        >
          Balanced distribution of primary and secondary
          orbs.
        </Text>
      </View>
    </View>
  ),
};

export const Dense: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <AnimatedCircleBackground variant="dense" />

      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: Theme.colors.neutral[900],
            textAlign: "center",
          }}
        >
          Dense Constellation (12 Circles)
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: Theme.colors.neutral[600],
            textAlign: "center",
          }}
        >
          Rich multi-layered background with large orbs,
          medium satellites, and subtle particles.
        </Text>
      </View>
    </View>
  ),
};

export const Subtle: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <AnimatedCircleBackground variant="subtle" />

      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: Theme.colors.neutral[900],
            textAlign: "center",
          }}
        >
          Subtle Ambient (4 Circles)
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: Theme.colors.neutral[600],
            textAlign: "center",
          }}
        >
          Low opacity and slow organic breathing for
          content-heavy screens.
        </Text>
      </View>
    </View>
  ),
};

export const Energetic: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <AnimatedCircleBackground variant="energetic" />

      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: Theme.colors.neutral[900],
            textAlign: "center",
          }}
        >
          Energetic Dynamic (8 Circles)
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: Theme.colors.neutral[600],
            textAlign: "center",
          }}
        >
          High amplitude motion and pulsing scales for high
          energy views.
        </Text>
      </View>
    </View>
  ),
};

export const Floating: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <AnimatedCircleBackground variant="floating" />

      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: Theme.colors.neutral[900],
            textAlign: "center",
          }}
        >
          Floating Bubbles (10 Circles)
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: Theme.colors.neutral[600],
            textAlign: "center",
          }}
        >
          Upward drifting floating bubbles with staggered
          delays.
        </Text>
      </View>
    </View>
  ),
};

export const Minimal: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <AnimatedCircleBackground variant="minimal" />

      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: Theme.colors.neutral[900],
            textAlign: "center",
          }}
        >
          Minimal Duo (2 Large Orbs)
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: Theme.colors.neutral[600],
            textAlign: "center",
          }}
        >
          Clean, modern corner accent orbs for an editorial
          look.
        </Text>
      </View>
    </View>
  ),
};

export const Hero: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <AnimatedCircleBackground variant="hero" />

      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: Theme.colors.neutral[900],
            textAlign: "center",
          }}
        >
          Hero Spotlight (5 Circles)
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: Theme.colors.neutral[600],
            textAlign: "center",
          }}
        >
          Concentrated near the top and center for landing
          and header areas.
        </Text>
      </View>
    </View>
  ),
};

export const BehindContent: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <AnimatedCircleBackground variant="dense" />

      <View
        style={{
          flex: 1,
          padding: 24,
          gap: 16,
        }}
      >
        <Text
          style={{
            marginTop: 60,
            fontSize: 32,
            fontWeight: "700",
            color: Theme.colors.neutral[900],
          }}
        >
          Your packages, synchronized.
        </Text>

        <View
          style={{
            minHeight: 180,
            padding: 24,
            borderRadius: 24,
            backgroundColor: Theme.colors.primary[600],
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: Theme.colors.neutral[50],
            }}
          >
            Scan package
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 15,
              color: Theme.colors.neutral[50],
            }}
          >
            Validate how the dense animated background
            behaves behind real interface content.
          </Text>
        </View>
      </View>
    </View>
  ),
};
