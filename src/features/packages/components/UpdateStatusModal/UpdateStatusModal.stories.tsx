import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { Button } from "@components/primitives/Button";
import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import Theme from "@theme/theme";
import { UpdateStatusModal } from "./UpdateStatusModal";
import type { Package } from "@features/packages/domain/package.types";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const collectedPackage: Package = {
  id: "1",
  code: "PKG-001",
  clientCode: "storybook-user",
  status: PackageStatus.COLLECTED,
  deliveryStatus: DeliveryStatus.PENDING,
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
  sent_at: "2026-08-22T15:30:00.000Z",
};

const deliveredPendingPackage: Package = {
  ...deliveredPackage,
  id: "4",
  code: "PKG-004",
  deliveryStatus: DeliveryStatus.PENDING,
  sent_at: undefined,
};

type UpdateStatusModalStoryProps = {
  packageData: Package;
};

function StoryScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: Theme.spacing.xl,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      {children}
    </View>
  );
}

function resetPackageStoryState() {
  usePackageStore.setState({
    syncingPackageIds: [],
  });
}

function UpdateStatusModalStory({
  packageData,
}: UpdateStatusModalStoryProps) {
  const modalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    resetPackageStoryState();

    return () => {
      resetPackageStoryState();
    };
  }, []);

  const handleOpenModal = () => {
    modalRef.current?.present();
  };

  const handleCloseModal = () => {
    modalRef.current?.close();
  };

  return (
    <BottomSheetModalProvider>
      <StoryScreen>
        <View
          style={{
            gap: Theme.spacing.md,
          }}
        >
          <Text
            style={{
              color: Theme.colors.neutral[900],
              fontSize: Theme.typography.size.xl,
              lineHeight: Theme.typography.lineHeight.xl,
              fontWeight: Theme.typography.weight.semibold,
            }}
          >
            Update package status
          </Text>

          <View
            style={{
              gap: Theme.spacing.xxs,
            }}
          >
            <Text
              style={{
                color: Theme.colors.neutral[900],
                fontSize: Theme.typography.size.md,
                lineHeight: Theme.typography.lineHeight.md,
                fontWeight:
                  Theme.typography.weight.semibold,
              }}
            >
              {packageData.code}
            </Text>

            <Text
              style={{
                color: Theme.colors.neutral[600],
                fontSize: Theme.typography.size.sm,
                lineHeight: Theme.typography.lineHeight.sm,
              }}
            >
              Status: {packageData.status}
            </Text>

            <Text
              style={{
                color: Theme.colors.neutral[600],
                fontSize: Theme.typography.size.sm,
                lineHeight: Theme.typography.lineHeight.sm,
              }}
            >
              Delivery: {packageData.deliveryStatus}
            </Text>
          </View>

          <Button
            testID="storybookOpenUpdateStatusModal"
            title="Open status modal"
            variant="brand"
            size="lg"
            onPress={handleOpenModal}
          />
        </View>

        <UpdateStatusModal
          ref={modalRef}
          packageData={packageData}
          userId="storybook-user"
          handleCloseModal={handleCloseModal}
        />
      </StoryScreen>
    </BottomSheetModalProvider>
  );
}

function OpenedUpdateStatusModalStory({
  packageData,
}: UpdateStatusModalStoryProps) {
  const modalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    resetPackageStoryState();

    const timeout = setTimeout(() => {
      modalRef.current?.present();
    }, 100);

    return () => {
      clearTimeout(timeout);

      resetPackageStoryState();
    };
  }, []);

  return (
    <BottomSheetModalProvider>
      <StoryScreen>
        <UpdateStatusModal
          ref={modalRef}
          packageData={packageData}
          userId="storybook-user"
          handleCloseModal={() => modalRef.current?.close()}
        />
      </StoryScreen>
    </BottomSheetModalProvider>
  );
}

function SyncingUpdateStatusModalStory() {
  const modalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    usePackageStore.setState({
      syncingPackageIds: [collectedPackage.id!],
    });

    const timeout = setTimeout(() => {
      modalRef.current?.present();
    }, 100);

    return () => {
      clearTimeout(timeout);

      resetPackageStoryState();
    };
  }, []);

  return (
    <BottomSheetModalProvider>
      <StoryScreen>
        <UpdateStatusModal
          ref={modalRef}
          packageData={collectedPackage}
          userId="storybook-user"
          handleCloseModal={() => modalRef.current?.close()}
        />
      </StoryScreen>
    </BottomSheetModalProvider>
  );
}

const meta: Meta<typeof UpdateStatusModal> = {
  title: "Features/Packages/UpdateStatusModal",
  component: UpdateStatusModal,

  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Collected: Story = {
  render: () => (
    <UpdateStatusModalStory
      packageData={collectedPackage}
    />
  ),
};

export const OutForDelivery: Story = {
  render: () => (
    <UpdateStatusModalStory packageData={routePackage} />
  ),
};

export const Delivered: Story = {
  render: () => (
    <UpdateStatusModalStory
      packageData={deliveredPackage}
    />
  ),
};

export const DeliveredPendingSync: Story = {
  render: () => (
    <UpdateStatusModalStory
      packageData={deliveredPendingPackage}
    />
  ),
};

export const Opened: Story = {
  render: () => (
    <OpenedUpdateStatusModalStory
      packageData={collectedPackage}
    />
  ),
};

export const OpenedDelivered: Story = {
  render: () => (
    <OpenedUpdateStatusModalStory
      packageData={deliveredPackage}
    />
  ),
};

export const Syncing: Story = {
  render: () => <SyncingUpdateStatusModalStory />,
};
