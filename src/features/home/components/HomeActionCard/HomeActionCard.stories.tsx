import {
  PackageSearch,
  ScanLine,
} from "lucide-react-native";
import { View } from "react-native";
import Theme from "@theme/theme";
import { HomeActionCard } from "./HomeActionCard";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta: Meta<typeof HomeActionCard> = {
  title: "Features/Home/HomeActionCard",
  component: HomeActionCard,

  args: {
    testID: "homeActionCard",
    title: "Package list",
    description: "View and manage scanned packages.",
    actionLabel: undefined,
    icon: PackageSearch,
    variant: "default",
    size: "md",
    orientation: "horizontal",
    showArrow: true,
    showDecoration: false,
    disabled: false,
    onPress: () => {},
  },

  argTypes: {
    variant: {
      control: "select",
      options: [
        "hero",
        "default",
        "outlined",
        "soft",
        "accent",
        "danger",
      ],
    },

    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },

    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },

    title: {
      control: "text",
    },

    description: {
      control: "text",
    },

    actionLabel: {
      control: "text",
    },

    showArrow: {
      control: "boolean",
    },

    showDecoration: {
      control: "boolean",
    },

    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof HomeActionCard>;

export const Hero: Story = {
  args: {
    variant: "hero",
    size: "lg",
    actionLabel: "Start scanning",
    icon: ScanLine,
  },
};

export const Default: Story = {};

export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
};

export const Soft: Story = {
  args: {
    variant: "soft",
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    showArrow: false,
  },
};

export const WithoutIcon: Story = {
  args: {
    icon: undefined,
  },
};

export const WithoutDescription: Story = {
  args: {
    description: undefined,
  },
};

export const AllVersions: Story = {
  render: () => (
    <View
      style={{
        flex: 1,
        gap: Theme.spacing.lg,
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <HomeActionCard
        testID="allVersionsHero"
        title="Scan package"
        description="Scan a barcode or QR Code to register a package."
        actionLabel="Start scanning"
        icon={ScanLine}
        variant="hero"
        size="lg"
        onPress={() => {}}
      />

      <HomeActionCard
        testID="allVersionsOutlined"
        title="Package list"
        description="View and manage scanned packages."
        icon={PackageSearch}
        variant="outlined"
        onPress={() => {}}
      />

      <HomeActionCard
        testID="allVersionsSoft"
        title="Package list"
        description="View and manage scanned packages."
        icon={PackageSearch}
        variant="soft"
        onPress={() => {}}
      />

      <HomeActionCard
        testID="allVersionsAccent"
        title="Package list"
        description="View and manage scanned packages."
        icon={PackageSearch}
        variant="accent"
        onPress={() => {}}
      />

      <HomeActionCard
        testID="allVersionsAccent"
        title="Package list"
        description="View and manage scanned packages."
        icon={PackageSearch}
        variant="accentDark"
        onPress={() => {}}
      />

      <HomeActionCard
        testID="allVersionsDanger"
        title="Remove package"
        description="This action may permanently affect package data."
        icon={PackageSearch}
        variant="danger"
        onPress={() => {}}
      />

      <HomeActionCard
        testID="allVersionsVertical"
        title="Scan"
        description="Open the package scanner."
        icon={ScanLine}
        variant="soft"
        orientation="vertical"
        showArrow={false}
        onPress={() => {}}
      />

      <HomeActionCard
        testID="allVersionsWithoutIcon"
        title="Package summary"
        description="Review current package information."
        variant="outlined"
        onPress={() => {}}
      />

      <HomeActionCard
        testID="allVersionsWithoutDescription"
        title="Package list"
        icon={PackageSearch}
        variant="default"
        onPress={() => {}}
      />

      <HomeActionCard
        testID="allVersionsWithoutArrow"
        title="Package list"
        description="View and manage scanned packages."
        icon={PackageSearch}
        variant="default"
        showArrow={false}
        onPress={() => {}}
      />

      <HomeActionCard
        testID="allVersionsWithDecoration"
        title="Package list"
        description="View and manage scanned packages."
        icon={PackageSearch}
        variant="default"
        showDecoration
        onPress={() => {}}
      />

      <HomeActionCard
        testID="allVersionsDisabled"
        title="Unavailable action"
        description="This action is currently disabled."
        icon={PackageSearch}
        variant="default"
        disabled
        onPress={() => {}}
      />
    </View>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <View
      style={{
        flex: 1,
        gap: Theme.spacing.lg,
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <HomeActionCard
        testID="smallCard"
        title="Small"
        description="Small action card."
        icon={PackageSearch}
        size="sm"
        onPress={() => {}}
      />

      <HomeActionCard
        testID="mediumCard"
        title="Medium"
        description="Medium action card."
        icon={PackageSearch}
        size="md"
        onPress={() => {}}
      />

      <HomeActionCard
        testID="largeCard"
        title="Large"
        description="Large action card."
        icon={PackageSearch}
        size="lg"
        onPress={() => {}}
      />
    </View>
  ),
};
