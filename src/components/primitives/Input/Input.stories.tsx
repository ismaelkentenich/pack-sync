import { View } from "react-native";
import Theme from "@theme/theme";
import { Input } from "./Input";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,

  render: (args) => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[50],
      }}
    >
      <Input {...args} />
    </View>
  ),

  args: {
    label: "Label",
    placeholder: "Type something...",
    secure: false,
    editable: true,
  },

  argTypes: {
    label: {
      control: "text",
    },

    placeholder: {
      control: "text",
    },

    error: {
      control: "text",
    },

    secure: {
      control: "boolean",
    },

    editable: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    label: "Email",
    value: "john@example.com",
  },
};

export const Error: Story = {
  args: {
    label: "Email",
    value: "invalid-email",
    error: "Enter a valid email address.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Email",
    value: "john@example.com",
    editable: false,
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    placeholder: "Enter your password",
    secure: true,
  },
};

export const PasswordFilled: Story = {
  args: {
    label: "Password",
    value: "password123",
    secure: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    placeholder: "Search...",
  },
};
