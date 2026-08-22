import { View } from "react-native";
import Theme from "@theme/theme";
import { Badge } from "./Badge";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,

  render: (args) => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[50],
      }}
    >
      <Badge {...args} />
    </View>
  ),

  args: {
    label: "Badge",
    variant: "status",
  },

  argTypes: {
    label: {
      control: "text",
    },

    variant: {
      control: "select",
      options: ["status", "delivery"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Status: Story = {
  args: {
    label: "Collected",
    variant: "status",
  },
};

export const Delivery: Story = {
  args: {
    label: "Pending",
    variant: "delivery",
  },
};

export const LongLabel: Story = {
  args: {
    label: "Out for delivery",
    variant: "status",
  },
};

export const AllVariants: Story = {
  render: () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        gap: Theme.spacing.md,
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[50],
      }}
    >
      <Badge label="Collected" variant="status" />

      <Badge label="Pending" variant="delivery" />
    </View>
  ),
};
