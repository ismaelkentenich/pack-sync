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

        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <Input {...args} />
    </View>
  ),

  args: {
    label: "Email",

    placeholder: "name@example.com",

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

    helperText: {
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

export const Error: Story = {
  args: {
    label: "Email",

    value: "invalid-email",

    error: "Enter a valid email address.",
  },
};

export const HelperText: Story = {
  args: {
    label: "Password",

    secure: true,

    helperText: "Minimum 8 characters.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Email",

    value: "john@example.com",

    editable: false,
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,

    placeholder: "Search...",
  },
};

export const AllStates: Story = {
  render: () => (
    <View
      style={{
        flex: 1,

        justifyContent: "center",

        gap: Theme.spacing.xl,

        padding: Theme.spacing.xl,

        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <Input
        label="Default"
        placeholder="Type something..."
      />

      <Input label="Filled" value="john@example.com" />

      <Input
        label="Password"
        secure
        placeholder="Enter your password"
      />

      <Input
        label="Email"
        value="invalid"
        error="Invalid email address."
      />

      <Input
        label="Password"
        helperText="Minimum 8 characters."
        secure
      />

      <Input
        label="Disabled"
        value="john@example.com"
        editable={false}
      />
    </View>
  ),
};
