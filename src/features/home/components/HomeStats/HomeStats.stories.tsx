import { View } from "react-native";
import Theme from "@theme/theme";
import { HomeStats } from "./HomeStats";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta: Meta<typeof HomeStats> = {
  title: "Features/Home/HomeStats",
  component: HomeStats,

  render: (args) => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <HomeStats {...args} />
    </View>
  ),

  args: {
    items: [
      {
        label: "Pacotes",
        value: 12,
        variant: "neutral",
      },
      {
        label: "Pendentes",
        value: 3,
        variant: "warning",
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoPendingPackages: Story = {
  args: {
    items: [
      {
        label: "Pacotes",
        value: 12,
        variant: "neutral",
      },
      {
        label: "Pendentes",
        value: 0,
        variant: "success",
      },
    ],
  },
};

export const WithPendingPackages: Story = {
  args: {
    items: [
      {
        label: "Pacotes",
        value: 24,
        variant: "neutral",
      },
      {
        label: "Pendentes",
        value: 7,
        variant: "warning",
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    items: [
      {
        label: "Pacotes",
        value: 0,
        variant: "neutral",
      },
      {
        label: "Pendentes",
        value: 0,
        variant: "success",
      },
    ],
  },
};

export const LargeValues: Story = {
  args: {
    items: [
      {
        label: "Pacotes",
        value: 1284,
        variant: "neutral",
      },
      {
        label: "Pendentes",
        value: 148,
        variant: "warning",
      },
    ],
  },
};

export const AllVariants: Story = {
  args: {
    items: [
      {
        label: "Neutral",
        value: 12,
        variant: "neutral",
      },
      {
        label: "Success",
        value: 0,
        variant: "success",
      },
      {
        label: "Warning",
        value: 3,
        variant: "warning",
      },
    ],
  },
};
