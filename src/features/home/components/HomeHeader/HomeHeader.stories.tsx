import { View } from "react-native";
import Theme from "@theme/theme";
import { HomeHeader } from "./HomeHeader";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta: Meta<typeof HomeHeader> = {
  title: "Features/Home/HomeHeader",
  component: HomeHeader,

  render: (args) => (
    <View
      style={{
        flex: 1,
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <HomeHeader {...args} />
    </View>
  ),

  args: {
    greeting: "Good morning",
    email: "user@packsync.com",
  },

  argTypes: {
    greeting: {
      control: "text",
    },

    email: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Portuguese: Story = {
  args: {
    greeting: "Bom dia",
    email: "ismael@packsync.com",
  },
};

export const Afternoon: Story = {
  args: {
    greeting: "Good afternoon",
    email: "user@packsync.com",
  },
};

export const Evening: Story = {
  args: {
    greeting: "Good evening",
    email: "user@packsync.com",
  },
};

export const WithoutEmail: Story = {
  args: {
    greeting: "Good morning",
    email: undefined,
  },
};

export const LongEmail: Story = {
  args: {
    greeting: "Good morning",
    email:
      "very.long.user.email.address@company-logistics-example.com",
  },
};

export const LongGreeting: Story = {
  args: {
    greeting: "Welcome back to Pack Sync",
    email: "user@packsync.com",
  },
};

export const LongContent: Story = {
  args: {
    greeting: "Welcome back to Pack Sync",
    email:
      "very.long.user.email.address@company-logistics-example.com",
  },
};
