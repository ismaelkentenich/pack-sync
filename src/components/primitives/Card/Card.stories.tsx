import { Text, View } from "react-native";
import Theme from "@theme/theme";
import { Card } from "./Card";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,

  render: (args) => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <Card {...args}>
        <Text
          style={{
            color: Theme.colors.neutral[900],
            fontSize: Theme.typography.size.md,
          }}
        >
          Card content
        </Text>
      </Card>
    </View>
  ),

  args: {
    touchable: true,
    disabled: false,
  },

  argTypes: {
    touchable: {
      control: "boolean",
    },

    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pressable: Story = {
  args: {
    touchable: true,
  },
};

export const NonPressable: Story = {
  args: {
    touchable: false,
  },
};

export const Disabled: Story = {
  args: {
    touchable: true,
    disabled: true,
  },
};

export const CustomContent: Story = {
  render: () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <Card>
        <View
          style={{
            gap: Theme.spacing.xs,
          }}
        >
          <Text
            style={{
              color: Theme.colors.neutral[900],
              fontSize: Theme.typography.size.lg,
              fontWeight: Theme.typography.weight.semibold,
            }}
          >
            Package PKG-001
          </Text>

          <Text
            style={{
              color: Theme.colors.neutral[700],
              fontSize: Theme.typography.size.sm,
            }}
          >
            Example of richer card content.
          </Text>
        </View>
      </Card>
    </View>
  ),
};

export const AllStates: Story = {
  render: () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        gap: Theme.spacing.lg,
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <Card>
        <Text>Pressable card</Text>
      </Card>

      <Card touchable={false}>
        <Text>Non-pressable card</Text>
      </Card>

      <Card disabled>
        <Text>Disabled card</Text>
      </Card>
    </View>
  ),
};
