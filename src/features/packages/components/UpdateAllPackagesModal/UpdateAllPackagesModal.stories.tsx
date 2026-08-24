import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Button } from "@components/primitives/Button";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import Theme from "@theme/theme";
import UpdateAllPackagesModal from "./index";
import type { Package as PackageType } from "@features/packages/domain/package.types";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

type StoryProps = {
  packageCount?: number;
  isSyncing?: boolean;
};

function createPackages(count: number): PackageType[] {
  return Array.from({ length: count }, (_, index) => {
    const sequence = String(index + 1).padStart(3, "0");

    return {
      id: String(index + 1),
      code: `PKG-${sequence}`,
      clientCode: `CLIENT-${sequence}`,
      userId: "storybook-user",
      status: PackageStatus.COLLECTED,
      deliveryStatus: DeliveryStatus.PENDING,
      scanned_at: new Date().toISOString(),
    };
  });
}

function UpdateAllPackagesModalStory({
  packageCount = 4,
  isSyncing = false,
}: StoryProps) {
  const modalRef = useRef<BottomSheetModal>(null);

  const [initialPackages] = useState(() =>
    createPackages(packageCount),
  );

  const [initialSyncing] = useState(isSyncing);

  usePackageStore.setState({
    currentSessionPackages: initialPackages,
    isSyncingSession: initialSyncing,
  });

  useEffect(() => {
    modalRef.current?.present();
  }, []);

  useEffect(() => {
    usePackageStore.setState({
      currentSessionPackages: createPackages(packageCount),
      isSyncingSession: isSyncing,
    });
  }, [isSyncing, packageCount]);

  const handleOpen = () => {
    modalRef.current?.present();
  };

  const handleClose = () => {
    modalRef.current?.close();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <Button title="Open modal" onPress={handleOpen} />

      <UpdateAllPackagesModal
        ref={modalRef}
        userId="storybook-user"
        handleCloseModal={handleClose}
      />
    </View>
  );
}

const meta: Meta<typeof UpdateAllPackagesModal> = {
  title: "Features/Packages/UpdateAllPackagesModal",
  component: UpdateAllPackagesModal,

  decorators: [
    (Story) => (
      <BottomSheetModalProvider>
        <Story />
      </BottomSheetModalProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <UpdateAllPackagesModalStory packageCount={4} />
  ),
};

export const SinglePackage: Story = {
  render: () => (
    <UpdateAllPackagesModalStory packageCount={1} />
  ),
};

export const ManyPackages: Story = {
  render: () => (
    <UpdateAllPackagesModalStory packageCount={24} />
  ),
};

export const EmptySession: Story = {
  render: () => (
    <UpdateAllPackagesModalStory packageCount={0} />
  ),
};

export const Syncing: Story = {
  render: () => (
    <UpdateAllPackagesModalStory
      packageCount={4}
      isSyncing
    />
  ),
};
