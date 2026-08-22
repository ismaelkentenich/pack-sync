import { View } from "react-native";
import Theme from "@theme/theme";
import { Header } from "./Header";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta: Meta<typeof Header> = {
  title: "Composites/Header",
  component: Header,

  render: (args) => (
    <View
      style={{
        flex: 1,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <Header {...args} />
    </View>
  ),

  args: {
    title: "Header",
    showBack: true,
    showLogout: false,
  },

  argTypes: {
    title: {
      control: "text",
    },

    showBack: {
      control: "boolean",
    },

    showLogout: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Home: Story = {
  args: {
    title: "Home",
    showBack: false,
    showLogout: true,
  },
};

export const WithBack: Story = {
  args: {
    title: "Package details",
    showBack: true,
    showLogout: false,
  },
};

export const WithLogout: Story = {
  args: {
    title: "Home",
    showBack: false,
    showLogout: true,
  },
};

export const WithBothActions: Story = {
  args: {
    title: "Settings",
    showBack: true,
    showLogout: true,
  },
};

export const WithoutActions: Story = {
  args: {
    title: "Title only",
    showBack: false,
    showLogout: false,
  },
};

export const LongTitle: Story = {
  args: {
    title:
      "This is a very long header title that should not overflow",
    showBack: true,
    showLogout: true,
  },
};
