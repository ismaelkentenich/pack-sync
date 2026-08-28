import { Text, View } from "react-native";
import Theme from "@theme/theme";
import { AnimatedCircleBackground } from "./AnimatedCircleBackground";
import type { AnimatedCircleConfig } from "./types";
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
      <AnimatedCircleBackground />

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
          Animated Background
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: Theme.colors.neutral[600],
            textAlign: "center",
          }}
        >
          The circles should move independently.
        </Text>
      </View>
    </View>
  ),
};

const subtleCircles: AnimatedCircleConfig[] = [
  {
    id: "subtle-primary",
    size: 280,
    top: 60,
    left: -160,
    color: Theme.colors.primary[600],
    opacity: 0.08,
    translateX: 60,
    translateY: 50,
    duration: 12000,
    scaleFrom: 1,
    scaleTo: 1.08,
  },
  {
    id: "subtle-secondary",
    size: 220,
    bottom: 60,
    right: -110,
    color: Theme.colors.secondary[400],
    opacity: 0.1,
    translateX: -50,
    translateY: -80,
    duration: 15000,
    delay: 1200,
    scaleFrom: 0.96,
    scaleTo: 1.06,
  },
];

export const Subtle: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <AnimatedCircleBackground circles={subtleCircles} />

      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: Theme.colors.neutral[900],
          }}
        >
          Subtle variation
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: Theme.colors.neutral[600],
          }}
        >
          Lower opacity and slower movement for screens with
          more content.
        </Text>
      </View>
    </View>
  ),
};

const energeticCircles: AnimatedCircleConfig[] = [
  {
    id: "energetic-large",
    size: 320,
    top: -100,
    left: -130,
    color: Theme.colors.primary[600],
    opacity: 0.22,
    translateX: 140,
    translateY: 120,
    duration: 7000,
    scaleFrom: 0.9,
    scaleTo: 1.2,
  },
  {
    id: "energetic-medium",
    size: 170,
    top: 300,
    right: -50,
    color: Theme.colors.secondary[400],
    opacity: 0.3,
    translateX: -120,
    translateY: 100,
    duration: 6500,
    delay: 600,
    scaleFrom: 0.85,
    scaleTo: 1.18,
  },
  {
    id: "energetic-small",
    size: 80,
    bottom: 130,
    left: 50,
    color: Theme.colors.primary[400],
    opacity: 0.26,
    translateX: 130,
    translateY: -100,
    duration: 5500,
    delay: 1200,
    scaleFrom: 0.8,
    scaleTo: 1.2,
  },
];

export const Energetic: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <AnimatedCircleBackground
        circles={energeticCircles}
      />

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
          More movement
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            color: Theme.colors.neutral[600],
            textAlign: "center",
          }}
        >
          Useful for validating animation amplitude and
          different durations.
        </Text>
      </View>
    </View>
  ),
};

export const BehindContent: Story = {
  render: () => (
    <View style={{ flex: 1 }}>
      <AnimatedCircleBackground />

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
            Validate how the animated background behaves
            behind real interface content.
          </Text>
        </View>
      </View>
    </View>
  ),
};
