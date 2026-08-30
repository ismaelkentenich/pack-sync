import React from "react";
import { Text, View } from "react-native";
import { Input } from "@components/primitives/Input";
import Theme from "@theme/theme";
import { ScreenContainer } from "./ScreenContainer";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

function StorySection({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <View
      style={{
        gap: Theme.spacing.sm,
        padding: Theme.spacing.md,
        borderRadius: Theme.radius.md,
        backgroundColor: Theme.colors.neutral[50],
      }}
    >
      <Text
        style={{
          color: Theme.colors.neutral[900],
          fontSize: Theme.typography.size.lg,
          lineHeight: Theme.typography.lineHeight.lg,
          fontWeight: Theme.typography.weight.semibold,
        }}
      >
        {title}
      </Text>

      {children}
    </View>
  );
}

function DefaultContent() {
  return (
    <View
      style={{
        flex: 1,

        gap: Theme.spacing.md,

        padding: Theme.spacing.md,
      }}
    >
      <StorySection title="Screen content">
        <Text
          style={{
            color: Theme.colors.neutral[600],
            fontSize: Theme.typography.size.md,
            lineHeight: Theme.typography.lineHeight.md,
          }}
        >
          This content is rendered inside ScreenContainer.
        </Text>
      </StorySection>
    </View>
  );
}

function ScrollableContent() {
  return (
    <View
      style={{
        gap: Theme.spacing.md,
        padding: Theme.spacing.md,
      }}
    >
      {Array.from(
        {
          length: 12,
        },
        (_, index) => (
          <StorySection
            key={index}
            title={`Section ${index + 1}`}
          >
            <Text
              style={{
                color: Theme.colors.neutral[600],
                fontSize: Theme.typography.size.md,
                lineHeight: Theme.typography.lineHeight.md,
              }}
            >
              Scrollable content used to validate vertical
              scrolling, safe area and responsive spacing.
            </Text>
          </StorySection>
        ),
      )}
    </View>
  );
}

function KeyboardContent() {
  return (
    <View
      style={{
        flex: 1,

        justifyContent: "center",

        gap: Theme.spacing.md,

        padding: Theme.spacing.md,
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
        Keyboard avoiding
      </Text>

      <Text
        style={{
          color: Theme.colors.neutral[600],
          fontSize: Theme.typography.size.sm,
          lineHeight: Theme.typography.lineHeight.sm,
        }}
      >
        Focus the input to validate the keyboard offset
        relative to the measured header.
      </Text>

      <Input
        testID="storybookScreenContainerInput"
        label="Package code"
        placeholder="Enter a package code"
      />
    </View>
  );
}

const meta: Meta<typeof ScreenContainer> = {
  title: "Primitives/ScreenContainer",

  component: ScreenContainer,

  parameters: {
    layout: "fullscreen",
  },

  args: {
    withHeader: true,
    headerTitle: "Screen",
    showBackButton: true,
    showLogout: false,
    headerVariant: "brand",
    scrollable: false,
    showVerticalScroll: false,
    withKeyboardAvoiding: false,
    withStatusBar: true,
    statusBarStyle: "dark-content",
    withSafeArea: true,
    safeAreaEdges: ["bottom"],
    backgroundColorVariant: "neutral50",
    withGradientBackground: false,
  },

  argTypes: {
    withHeader: {
      control: "boolean",
    },
    headerTitle: {
      control: "text",
    },
    showBackButton: {
      control: "boolean",
    },
    showLogout: {
      control: "boolean",
    },
    headerVariant: {
      control: "select",
      options: ["brand", "neutral"],
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
    statusBarColor: {
      control: "color",
    },
    withSafeArea: {
      control: "boolean",
    },
    safeAreaEdges: {
      control: "object",
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

export const Default: Story = {
  render: (args) => (
    <ScreenContainer {...args}>
      <DefaultContent />
    </ScreenContainer>
  ),
};

export const BrandHeader: Story = {
  args: {
    headerTitle: "Pacotes",
    headerVariant: "brand",
    backgroundColorVariant: "neutral100",
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <DefaultContent />
    </ScreenContainer>
  ),
};

export const NeutralHeader: Story = {
  args: {
    headerTitle: "Pacotes",
    headerVariant: "neutral",
    backgroundColorVariant: "neutral100",
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <DefaultContent />
    </ScreenContainer>
  ),
};

export const PackagesStyle: Story = {
  args: {
    headerTitle: "Pacotes",
    headerVariant: "neutral",
    showBackButton: true,
    showLogout: false,
    backgroundColorVariant: "neutral100",
    safeAreaEdges: ["bottom"],
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <View
        style={{
          flex: 1,
          gap: Theme.spacing.md,
          padding: Theme.spacing.md,
        }}
      >
        <Text
          style={{
            color: Theme.colors.neutral[900],
            fontSize: Theme.typography.size.xxl,
            lineHeight: Theme.typography.lineHeight.xxl,
            fontWeight: Theme.typography.weight.bold,
          }}
        >
          Gerencie seus pacotes
        </Text>

        <Text
          style={{
            color: Theme.colors.neutral[600],
            fontSize: Theme.typography.size.md,
            lineHeight: Theme.typography.lineHeight.md,
          }}
        >
          Pesquise, filtre e acompanhe todos os seus pacotes
          em um só lugar.
        </Text>

        <Input
          testID="storybookPackagesSearch"
          placeholder="Buscar pelo código do pacote..."
        />

        <StorySection title="Pacotes">
          <Text
            style={{
              color: Theme.colors.neutral[500],
              fontSize: Theme.typography.size.sm,
            }}
          >
            0 pacotes
          </Text>
        </StorySection>
      </View>
    </ScreenContainer>
  ),
};

export const WithoutHeader: Story = {
  args: {
    withHeader: false,
    withStatusBar: true,
    backgroundColorVariant: "neutral100",
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <DefaultContent />
    </ScreenContainer>
  ),
};

export const WithoutSafeArea: Story = {
  args: {
    withSafeArea: false,
    headerTitle: "Without safe area",
    headerVariant: "neutral",
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <DefaultContent />
    </ScreenContainer>
  ),
};

export const BottomSafeArea: Story = {
  args: {
    headerTitle: "Bottom safe area",
    headerVariant: "neutral",
    safeAreaEdges: ["bottom"],
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <DefaultContent />
    </ScreenContainer>
  ),
};

export const TopAndBottomSafeArea: Story = {
  args: {
    withHeader: false,

    safeAreaEdges: ["top", "bottom"],

    backgroundColorVariant: "neutral100",
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <DefaultContent />
    </ScreenContainer>
  ),
};

export const Scrollable: Story = {
  args: {
    headerTitle: "Scrollable",
    headerVariant: "neutral",
    scrollable: true,
    showVerticalScroll: true,
    backgroundColorVariant: "neutral100",
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <ScrollableContent />
    </ScreenContainer>
  ),
};

export const KeyboardAvoiding: Story = {
  args: {
    headerTitle: "Keyboard",
    headerVariant: "neutral",
    withKeyboardAvoiding: true,
    backgroundColorVariant: "neutral100",
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <KeyboardContent />
    </ScreenContainer>
  ),
};

export const KeyboardAvoidingWithoutHeader: Story = {
  args: {
    withHeader: false,
    withKeyboardAvoiding: true,
    backgroundColorVariant: "neutral100",
    safeAreaEdges: ["top", "bottom"],
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <KeyboardContent />
    </ScreenContainer>
  ),
};

export const Gradient: Story = {
  args: {
    headerTitle: "Gradient",
    headerVariant: "brand",
    withGradientBackground: true,
    backgroundColorVariant: "neutral50",
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <DefaultContent />
    </ScreenContainer>
  ),
};

export const Neutral100: Story = {
  args: {
    headerTitle: "Neutral background",
    headerVariant: "neutral",
    backgroundColorVariant: "neutral100",
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <DefaultContent />
    </ScreenContainer>
  ),
};

export const NoStatusBar: Story = {
  args: {
    headerTitle: "No status bar",
    headerVariant: "neutral",
    withStatusBar: false,
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <DefaultContent />
    </ScreenContainer>
  ),
};

export const LightStatusBar: Story = {
  args: {
    headerTitle: "Brand header",
    headerVariant: "brand",
    statusBarStyle: "light-content",
    statusBarColor: Theme.colors.primary[600],
  },

  render: (args) => (
    <ScreenContainer {...args}>
      <DefaultContent />
    </ScreenContainer>
  ),
};
