import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Text, View } from "react-native";
import { Button } from "@components/primitives/Button";
import { Input } from "@components/primitives/Input";
import Theme from "@theme/theme";
import {
  ModalCloseIcon,
  ModalWrapper,
} from "./ModalWrapper";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

type ModalStoryProps = {
  isBlocked?: boolean;
  isModalFixed?: boolean;
  hasInputInsideModal?: boolean;
  snapPoints?: (string | number)[];
};

function ModalStory({
  isBlocked = false,
  isModalFixed = false,
  hasInputInsideModal = false,
  snapPoints,
}: ModalStoryProps) {
  const modalRef = useRef<BottomSheetModal>(null);

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

      <ModalWrapper
        ref={modalRef}
        isBlocked={isBlocked}
        isModalFixed={isModalFixed}
        hasInputInsideModal={hasInputInsideModal}
        snapPoints={snapPoints}
      >
        <ModalCloseIcon onPress={handleClose} />

        <View
          style={{
            flex: 1,
            padding: Theme.spacing.md,
            gap: Theme.spacing.lg,
          }}
        >
          <View
            style={{
              gap: Theme.spacing.xs,
            }}
          >
            <Text
              style={{
                color: Theme.colors.neutral[900],
                fontSize: Theme.typography.size.xl,
                lineHeight: Theme.typography.lineHeight.xl,
                fontWeight:
                  Theme.typography.weight.semibold,
              }}
            >
              Modal title
            </Text>

            <Text
              style={{
                color: Theme.colors.neutral[700],
                fontSize: Theme.typography.size.md,
                lineHeight: Theme.typography.lineHeight.md,
              }}
            >
              This is example content used to preview the
              ModalWrapper component.
            </Text>
          </View>

          {hasInputInsideModal ? (
            <Input
              label="Receiver name"
              placeholder="Type a name..."
            />
          ) : null}

          <View
            style={{
              gap: Theme.spacing.xs,
              marginTop: "auto",
            }}
          >
            <Button title="Confirm" onPress={handleClose} />

            <Button
              title="Cancel"
              variant="outline"
              onPress={handleClose}
            />
          </View>
        </View>
      </ModalWrapper>
    </View>
  );
}

const meta: Meta<typeof ModalWrapper> = {
  title: "Composites/ModalWrapper",
  component: ModalWrapper,

  decorators: [
    (Story) => (
      <BottomSheetModalProvider>
        <Story />
      </BottomSheetModalProvider>
    ),
  ],

  argTypes: {
    isBlocked: {
      control: "boolean",
    },

    isModalFixed: {
      control: "boolean",
    },

    hasInputInsideModal: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ModalStory />,
};

export const WithInput: Story = {
  render: () => (
    <ModalStory
      hasInputInsideModal
      snapPoints={["60%", "85%"]}
    />
  ),
};

export const Blocked: Story = {
  render: () => (
    <ModalStory isBlocked snapPoints={["60%"]} />
  ),
};

export const Fixed: Story = {
  render: () => (
    <ModalStory isModalFixed snapPoints={["60%"]} />
  ),
};

export const BlockedAndFixed: Story = {
  render: () => (
    <ModalStory
      isBlocked
      isModalFixed
      snapPoints={["60%"]}
    />
  ),
};

export const Compact: Story = {
  render: () => <ModalStory snapPoints={["40%"]} />,
};

export const Large: Story = {
  render: () => <ModalStory snapPoints={["85%"]} />,
};
