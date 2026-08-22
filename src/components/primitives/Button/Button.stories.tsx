import { View } from "react-native";
import Theme from "@theme/theme";
import { Button } from "./Button";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,

  render: (args) => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[50],
      }}
    >
      <Button {...args} />
    </View>
  ),

  args: {
    title: "Button",
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
  },

  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "brand",
        "accent",
        "secondary",
        "outline",
        "danger",
      ],
    },

    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },

    disabled: {
      control: "boolean",
    },

    loading: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Brand: Story = {
  args: {
    variant: "brand",
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        gap: Theme.spacing.sm,
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[50],
      }}
    >
      <Button title="Primary" variant="primary" />

      <Button title="Brand" variant="brand" />

      <Button title="Accent" variant="accent" />

      <Button title="Secondary" variant="secondary" />

      <Button title="Outline" variant="outline" />

      <Button title="Danger" variant="danger" />
    </View>
  ),
};
