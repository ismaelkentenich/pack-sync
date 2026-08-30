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
    variant: "primary",
    size: "md",
  },

  argTypes: {
    label: {
      control: "text",
    },

    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "neutral",
        "success",
        "warning",
        "error",
      ],
    },

    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

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
      <Badge label="Primary" variant="primary" />
      <Badge label="Secondary" variant="secondary" />
      <Badge label="Neutral" variant="neutral" />
      <Badge label="Success" variant="success" />
      <Badge label="Warning" variant="warning" />
      <Badge label="Error" variant="error" />
    </View>
  ),
};

export const AllSizes: Story = {
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
      <Badge label="Small" variant="primary" size="sm" />

      <Badge label="Medium" variant="primary" size="md" />

      <Badge label="Large" variant="primary" size="lg" />
    </View>
  ),
};
