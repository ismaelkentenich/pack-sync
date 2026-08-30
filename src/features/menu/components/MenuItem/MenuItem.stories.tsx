import {
  LogOut,
  PackageSearch,
  ScanLine,
} from "lucide-react-native";
import { View } from "react-native";
import Theme from "@theme/theme";
import { MenuItem } from "./MenuItem";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta: Meta<typeof MenuItem> = {
  title: "Features/Menu/MenuItem",
  component: MenuItem,

  render: (args) => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <View
        style={{
          overflow: "hidden",
          borderWidth: 1,
          borderColor: Theme.colors.neutral[200],
          borderRadius: Theme.radius.lg,
          backgroundColor: Theme.colors.neutral[50],
        }}
      >
        <MenuItem {...args} />
      </View>
    </View>
  ),

  args: {
    title: "Scan package",
    description: "Scan a package barcode or QR Code.",
    icon: ScanLine,
    onPress: () => {},
  },

  argTypes: {
    title: {
      control: "text",
    },

    description: {
      control: "text",
    },

    destructive: {
      control: "boolean",
    },

    showChevron: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scan: Story = {
  args: {
    title: "Scan package",
    description: "Scan a package barcode or QR Code.",
    icon: ScanLine,
  },
};

export const Packages: Story = {
  args: {
    title: "Package list",
    description: "View and manage scanned packages.",
    icon: PackageSearch,
  },
};

export const Logout: Story = {
  args: {
    title: "Log out",
    description: "End your Pack Sync session.",
    icon: LogOut,
    destructive: true,
    showChevron: false,
  },
};

export const WithoutDescription: Story = {
  args: {
    title: "Scan package",
    description: undefined,
    icon: ScanLine,
  },
};

export const WithoutChevron: Story = {
  args: {
    title: "Scan package",
    description: "Scan a package barcode or QR Code.",
    icon: ScanLine,
    showChevron: false,
  },
};

export const AllVariants: Story = {
  render: () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <View
        style={{
          overflow: "hidden",
          borderWidth: 1,
          borderColor: Theme.colors.neutral[200],
          borderRadius: Theme.radius.lg,
          backgroundColor: Theme.colors.neutral[50],
        }}
      >
        <MenuItem
          title="Scan package"
          description="Scan a package barcode or QR Code."
          icon={ScanLine}
          onPress={() => {}}
        />

        <View
          style={{
            height: 1,
            marginLeft: 76,
            backgroundColor: Theme.colors.neutral[200],
          }}
        />

        <MenuItem
          title="Package list"
          description="View and manage scanned packages."
          icon={PackageSearch}
          onPress={() => {}}
        />

        <View
          style={{
            height: 1,
            marginLeft: 76,
            backgroundColor: Theme.colors.neutral[200],
          }}
        />

        <MenuItem
          title="Log out"
          description="End your Pack Sync session."
          icon={LogOut}
          destructive
          showChevron={false}
          onPress={() => {}}
        />
      </View>
    </View>
  ),
};
