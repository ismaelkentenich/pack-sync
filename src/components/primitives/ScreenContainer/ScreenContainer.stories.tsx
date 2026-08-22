import { Text, View } from "react-native";
import Theme from "@theme/theme";
import { ScreenContainer } from "./ScreenContainer";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta: Meta<typeof ScreenContainer> = {
  title: "Primitives/ScreenContainer",
  component: ScreenContainer,

  args: {
    withHeader: true,
    headerTitle: "Screen title",
    showBackButton: false,
    showLogout: false,

    scrollable: false,
    showVerticalScroll: false,

    withKeyboardAvoiding: false,

    withStatusBar: true,
    statusBarStyle: "dark-content",

    backgroundColorVariant: "neutral50",

    withGradientBackground: false,
  },

  argTypes: {
    withHeader: {
      control: "boolean",
    },

    showBackButton: {
      control: "boolean",
    },

    showLogout: {
      control: "boolean",
    },

    scrollable: {
      control: "boolean",
    },

    showVerticalScroll: {
      control: "boolean",
    },

    withKeyboardAvoiding: {
      control: "boolean",
    },

    withStatusBar: {
      control: "boolean",
    },

    statusBarStyle: {
      control: "select",
      options: ["default", "light-content", "dark-content"],
    },

    backgroundColorVariant: {
      control: "select",
      options: ["neutral50", "neutral100"],
    },

    withGradientBackground: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function ExampleContent() {
  return (
    <View
      style={{
        flex: 1,
        padding: Theme.spacing.xl,
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
        Screen content
      </Text>

      <Text
        style={{
          color: Theme.colors.neutral[700],
          fontSize: Theme.typography.size.md,
          lineHeight: Theme.typography.lineHeight.md,
        }}
      >
        This content is rendered inside ScreenContainer.
      </Text>
    </View>
  );
}

export const Default: Story = {
  render: (args) => (
    <ScreenContainer {...args}>
      <ExampleContent />
    </ScreenContainer>
  ),
};

export const WithoutHeader: Story = {
  args: {
    withHeader: false,
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <ExampleContent />
    </ScreenContainer>
  ),
};

export const NeutralBackground: Story = {
  args: {
    backgroundColorVariant: "neutral100",
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <ExampleContent />
    </ScreenContainer>
  ),
};

export const GradientBackground: Story = {
  args: {
    headerTitle: "Home",
    showBackButton: false,
    withGradientBackground: true,
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <ExampleContent />
    </ScreenContainer>
  ),
};

export const KeyboardAvoiding: Story = {
  args: {
    withKeyboardAvoiding: true,
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <ExampleContent />
    </ScreenContainer>
  ),
};

export const Scrollable: Story = {
  args: {
    scrollable: true,
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <View
        style={{
          padding: Theme.spacing.xl,
          gap: Theme.spacing.md,
        }}
      >
        {Array.from({ length: 20 }, (_, index) => (
          <View
            key={index}
            style={{
              padding: Theme.spacing.md,
              backgroundColor: Theme.colors.neutral[100],
              borderRadius: Theme.radius.md,
            }}
          >
            <Text
              style={{
                color: Theme.colors.neutral[900],
              }}
            >
              Content item {index + 1}
            </Text>
          </View>
        ))}
      </View>
    </ScreenContainer>
  ),
};
