import { useState } from "react";
import { View } from "react-native";
import { Button } from "@components/primitives/Button";
import Theme from "@theme/theme";
import { CustomAlert } from "./CustomAlert";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

type AlertStoryProps = {
  title?: string;
  message: string;
  confirmText?: string;
};

function AlertStory({
  title,
  message,
  confirmText = "OK",
}: AlertStoryProps) {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
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
      <Button title="Show alert" onPress={handleOpen} />

      <CustomAlert
        visible={visible}
        title={title}
        message={message}
        confirmText={confirmText}
        onClose={handleClose}
      />
    </View>
  );
}

const meta: Meta<typeof CustomAlert> = {
  title: "Composites/CustomAlert",
  component: CustomAlert,

  args: {
    visible: true,
    title: "Alert title",
    message: "This is an alert message.",
    confirmText: "OK",
  },

  argTypes: {
    visible: {
      control: "boolean",
    },

    title: {
      control: "text",
    },

    message: {
      control: "text",
    },

    confirmText: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertStory
      title="Alert title"
      message="This is an alert message."
    />
  ),
};

export const WithoutTitle: Story = {
  render: () => (
    <AlertStory message="This alert does not have a title." />
  ),
};

export const SuccessMessage: Story = {
  render: () => (
    <AlertStory
      title="Success"
      message="The operation was completed successfully."
    />
  ),
};

export const ErrorMessage: Story = {
  render: () => (
    <AlertStory
      title="Something went wrong"
      message="We could not complete the requested operation."
    />
  ),
};

export const LongMessage: Story = {
  render: () => (
    <AlertStory
      title="Important information"
      message="This is a longer alert message used to validate spacing, text wrapping, readability, and visual behavior when the alert contains more content than usual."
    />
  ),
};

export const CustomConfirmText: Story = {
  render: () => (
    <AlertStory
      title="Continue?"
      message="Confirm that you want to continue with this action."
      confirmText="Got it"
    />
  ),
};
