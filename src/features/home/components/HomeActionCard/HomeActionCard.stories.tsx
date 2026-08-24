import {
  PackageCheck,
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

  render: (args) => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <HomeActionCard {...args} />
    </View>
  ),

  args: {
    testID: "homeActionCard",
    title: "Scan package",
    description:
      "Scan a barcode or QR Code to add a package.",
    actionLabel: "Start scanning",
    icon: ScanLine,
    variant: "secondary",
    onPress: () => {},
  },

  argTypes: {
    title: {
      control: "text",
    },

    description: {
      control: "text",
    },

    actionLabel: {
      control: "text",
    },

    variant: {
      control: "select",
      options: ["hero", "secondary"],
    },

    onPress: {
      action: "pressed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hero: Story = {
  args: {
    testID: "heroScanCard",
    title: "Scan package",
    description:
      "Point your camera at a barcode or QR Code to register a package.",
    actionLabel: "Start scanning",
    icon: ScanLine,
    variant: "hero",
  },
};

export const Secondary: Story = {
  args: {
    testID: "packagesCard",
    title: "Package list",
    description: "View and manage all scanned packages.",
    icon: PackageSearch,
    variant: "secondary",
  },
};

export const HeroWithoutAction: Story = {
  args: {
    testID: "heroWithoutActionCard",
    title: "Scan package",
    description:
      "Point your camera at a barcode or QR Code to register a package.",
    actionLabel: undefined,
    icon: ScanLine,
    variant: "hero",
  },
};

export const Packages: Story = {
  args: {
    testID: "packagesCard",
    title: "Packages",
    description:
      "Review package status and synchronization details.",
    icon: PackageSearch,
    variant: "secondary",
  },
};

export const DeliveredPackages: Story = {
  args: {
    testID: "deliveredPackagesCard",
    title: "Delivered packages",
    description:
      "Review packages that have already been delivered.",
    icon: PackageCheck,
    variant: "secondary",
  },
};

export const PortugueseHero: Story = {
  args: {
    testID: "scanCardPtBr",
    title: "Escanear pacote",
    description:
      "Aponte a câmera para o código de barras ou QR Code do pacote.",
    actionLabel: "Iniciar escaneamento",
    icon: ScanLine,
    variant: "hero",
  },
};

export const PortugueseSecondary: Story = {
  args: {
    testID: "packagesCardPtBr",
    title: "Lista de pacotes",
    description:
      "Consulte e gerencie os pacotes escaneados.",
    icon: PackageSearch,
    variant: "secondary",
  },
};

export const LongContentHero: Story = {
  args: {
    testID: "longHeroCard",
    title: "Scan a new package using the device camera",
    description:
      "Use the camera to identify supported barcode and QR Code formats and register the package in the current session.",
    actionLabel: "Open package scanner",
    icon: ScanLine,
    variant: "hero",
  },
};

export const LongContentSecondary: Story = {
  args: {
    testID: "longSecondaryCard",
    title: "View and manage all scanned packages",
    description:
      "Review package details, delivery status, synchronization information and the latest changes made to each package.",
    icon: PackageSearch,
    variant: "secondary",
  },
};

export const CompactWidth: Story = {
  render: (args) => (
    <View
      style={{
        width: 300,
        padding: Theme.spacing.md,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <HomeActionCard {...args} />
    </View>
  ),

  args: {
    testID: "compactCard",
    title: "Package list",
    description: "View and manage all scanned packages.",
    icon: PackageSearch,
    variant: "secondary",
  },
};

export const AllVariants: Story = {
  render: () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        gap: Theme.spacing.lg,
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <HomeActionCard
        testID="heroCard"
        title="Scan package"
        description="Scan a barcode or QR Code to register a package."
        actionLabel="Start scanning"
        icon={ScanLine}
        variant="hero"
        onPress={() => {}}
      />

      <HomeActionCard
        testID="secondaryCard"
        title="Package list"
        description="View and manage scanned packages."
        icon={PackageSearch}
        variant="secondary"
        onPress={() => {}}
      />
    </View>
  ),
};
