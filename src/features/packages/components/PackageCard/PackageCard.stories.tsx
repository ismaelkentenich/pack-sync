import { View } from "react-native";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import Theme from "@theme/theme";
import { PackageCard } from "./PackageCard";
import type { Package } from "@features/packages/domain/package.types";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const collectedPackage: Package = {
  id: "1",
  code: "PKG-001",
  status: PackageStatus.COLLECTED,
  deliveryStatus: DeliveryStatus.PENDING,
  clientCode: "storybook-user",
  scanned_at: "2026-08-22T14:30:00.000Z",
};

const routePackage: Package = {
  ...collectedPackage,
  id: "2",
  code: "PKG-002",
  status: PackageStatus.IN_DELIVERY,
};

const deliveredPackage: Package = {
  ...collectedPackage,
  id: "3",
  code: "PKG-003",
  status: PackageStatus.DELIVERED,
  deliveryStatus: DeliveryStatus.SENT,
  receiverName: "John Doe",
};

const pendingDeliveredPackage: Package = {
  ...deliveredPackage,
  id: "4",
  code: "PKG-004",
  deliveryStatus: DeliveryStatus.PENDING,
};

const meta: Meta<typeof PackageCard> = {
  title: "Features/Packages/PackageCard",
  component: PackageCard,

  render: (args) => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <PackageCard {...args} />
    </View>
  ),

  args: {
    item: collectedPackage,
    pressable: true,
    showButtons: false,
  },

  argTypes: {
    pressable: {
      control: "boolean",
    },

    showButtons: {
      control: "boolean",
    },

    onPress: {
      action: "pressed",
    },

    onPressUpdate: {
      action: "update pressed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collected: Story = {
  args: {
    item: collectedPackage,
  },
};

export const OutForDelivery: Story = {
  args: {
    item: routePackage,
  },
};

export const Delivered: Story = {
  args: {
    item: deliveredPackage,
  },
};

export const PendingSync: Story = {
  args: {
    item: pendingDeliveredPackage,
  },
};

export const Synced: Story = {
  args: {
    item: deliveredPackage,
  },
};

export const WithActions: Story = {
  args: {
    item: routePackage,
    showButtons: true,
  },
};

export const NonPressable: Story = {
  args: {
    item: collectedPackage,
    pressable: false,
  },
};

export const LongCode: Story = {
  args: {
    item: {
      ...collectedPackage,
      code: "PKG-2026-VERY-LONG-PACKAGE-CODE-123456789",
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <View
      style={{
        flex: 1,
        padding: Theme.spacing.xl,
        gap: Theme.spacing.md,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <PackageCard
        item={collectedPackage}
        pressable={false}
      />

      <PackageCard item={routePackage} pressable={false} />

      <PackageCard
        item={pendingDeliveredPackage}
        pressable={false}
      />

      <PackageCard
        item={deliveredPackage}
        pressable={false}
      />
    </View>
  ),
};
