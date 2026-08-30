import { View } from "react-native";
import Theme from "@theme/theme";
import { Header } from "./Header";
import type {
  Meta,
  StoryObj,
} from "@storybook/react-native";

const meta: Meta<typeof Header> = {
  title: "Composites/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },

  render: (args) => (
    <View
      style={{
        flex: 1,
        backgroundColor: Theme.colors.neutral[100],
      }}
    >
      <Header {...args} />
    </View>
  ),

  args: {
    title: "Header",
    showBack: true,
    showLogout: false,
    variant: "brand",
  },
  argTypes: {
    title: {
      control: "text",
    },
    showBack: {
      control: "boolean",
    },
    showLogout: {
      control: "boolean",
    },
    variant: {
      control: "select",
      options: ["brand", "neutral"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Brand: Story = {
  args: {
    title: "Pacotes",
    variant: "brand",
    showBack: true,
    showLogout: false,
  },
};

export const Neutral: Story = {
  args: {
    title: "Pacotes",
    variant: "neutral",
    showBack: true,
    showLogout: false,
  },
};

export const Home: Story = {
  args: {
    title: "Home",
    variant: "neutral",
    showBack: false,
    showLogout: true,
  },
};

export const WithBack: Story = {
  args: {
    title: "Detalhes do pacote",
    variant: "neutral",
    showBack: true,
    showLogout: false,
  },
};

export const WithLogout: Story = {
  args: {
    title: "Home",
    variant: "neutral",
    showBack: false,
    showLogout: true,
  },
};

export const WithBothActions: Story = {
  args: {
    title: "Configurações",
    variant: "neutral",
    showBack: true,
    showLogout: true,
  },
};

export const WithoutActions: Story = {
  args: {
    title: "Somente título",
    variant: "neutral",
    showBack: false,
    showLogout: false,
  },
};

export const BrandWithoutActions: Story = {
  args: {
    title: "Pack Sync",
    variant: "brand",
    showBack: false,
    showLogout: false,
  },
};

export const LongTitle: Story = {
  args: {
    title:
      "Este é um título muito longo que não deve ultrapassar os limites do header",
    variant: "neutral",
    showBack: true,
    showLogout: true,
  },
};

export const LongTitleBrand: Story = {
  args: {
    title:
      "Este é um título muito longo para validar o comportamento responsivo",
    variant: "brand",
    showBack: true,
    showLogout: true,
  },
};
