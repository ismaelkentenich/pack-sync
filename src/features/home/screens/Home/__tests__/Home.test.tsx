import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import HomeScreen from "../index";

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

const mockUser = {
  email: "user@example.com",
};

jest.mock("@hooks/useAppNavigation", () => ({
  useAppNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock("@features/auth/store/useAuthStore", () => ({
  useAuthStore: (
    selector: (state: {
      user: typeof mockUser;
      logout: typeof mockLogout;
    }) => unknown,
  ) =>
    selector({
      user: mockUser,
      logout: mockLogout,
    }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@components/primitives/ScreenContainer", () => {
  const React = jest.requireActual("react");

  const { View } = jest.requireActual("react-native");

  return {
    ScreenContainer: ({
      children,
      testID,
    }: {
      children: React.ReactNode;
      testID?: string;
    }) => (
      <View testID={testID ?? "screenContainerRoot"}>
        {children}
      </View>
    ),
  };
});

jest.mock("@features/home/components/HomeHeader", () => {
  const React = jest.requireActual("react");

  const { Text, TouchableOpacity, View } =
    jest.requireActual("react-native");

  return {
    HomeHeader: ({
      greeting,
      email,
      onLogout,
    }: {
      greeting: string;
      email?: string;
      onLogout: () => void;
    }) => (
      <View testID="mockHomeHeader">
        <Text testID="mockHomeGreeting">{greeting}</Text>

        <Text testID="mockHomeEmail">{email ?? ""}</Text>

        <TouchableOpacity
          testID="mockHomeLogout"
          onPress={onLogout}
        >
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    ),
  };
});

jest.mock(
  "@features/home/components/HomeActionCard",
  () => {
    const React = jest.requireActual("react");

    const { Text, TouchableOpacity } =
      jest.requireActual("react-native");

    return {
      HomeActionCard: ({
        testID,
        title,
        description,
        actionLabel,
        onPress,
      }: {
        testID: string;
        title: string;
        description: string;
        actionLabel?: string;
        onPress: () => void;
      }) => (
        <TouchableOpacity testID={testID} onPress={onPress}>
          <Text testID={`${testID}Title`}>{title}</Text>

          <Text testID={`${testID}Description`}>
            {description}
          </Text>

          {actionLabel ? (
            <Text testID={`${testID}ActionLabel`}>
              {actionLabel}
            </Text>
          ) : null}
        </TouchableOpacity>
      ),
    };
  },
);

jest.mock(
  "@features/packages/store/usePackageStore",
  () => ({
    usePackageStore: (
      selector: (state: typeof mockPackageState) => unknown,
    ) => selector(mockPackageState),
  }),
);

jest.mock("@features/home/components/HomeStats", () => {
  const React = jest.requireActual("react");

  const { Text, View } = jest.requireActual("react-native");

  return {
    HomeStats: ({
      items,
    }: {
      items: Array<{
        label: string;
        value: number;
        variant?: string;
      }>;
    }) => (
      <View testID="mockHomeStats">
        {items.map((item, index) => (
          <View
            key={item.label}
            testID={`mockHomeStat-${index}`}
          >
            <Text testID={`mockHomeStatLabel-${index}`}>
              {item.label}
            </Text>

            <Text testID={`mockHomeStatValue-${index}`}>
              {item.value}
            </Text>

            <Text testID={`mockHomeStatVariant-${index}`}>
              {item.variant}
            </Text>
          </View>
        ))}
      </View>
    ),
  };
});

const mockPackageState = {
  packages: [
    {
      id: "1",
    },
    {
      id: "2",
    },
    {
      id: "3",
    },
  ],
  pendingCount: 2,
};

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the screen", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(getByTestId("homeScreen")).toBeTruthy();
    });

    it("renders the home header", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(getByTestId("mockHomeHeader")).toBeTruthy();
    });

    it("renders the translated greeting", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(
        getByTestId("mockHomeGreeting"),
      ).toHaveTextContent("home.greeting");
    });

    it("renders user email", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(
        getByTestId("mockHomeEmail"),
      ).toHaveTextContent("user@example.com");
    });

    it("renders introduction", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(getByTestId("homeIntroduction")).toBeTruthy();

      expect(getByTestId("homeHeadline")).toHaveTextContent(
        "home.headline",
      );

      expect(
        getByTestId("homeDescription"),
      ).toHaveTextContent("home.description");
    });

    it("renders quick actions section", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(getByTestId("homeQuickActions")).toBeTruthy();

      expect(
        getByTestId("homeQuickActionsTitle"),
      ).toHaveTextContent("home.quickActions");
    });
  });

  describe("scanner", () => {
    it("renders scanner action", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(getByTestId("homeScannerCard")).toBeTruthy();

      expect(
        getByTestId("homeScannerCardTitle"),
      ).toHaveTextContent("home.scanner.title");

      expect(
        getByTestId("homeScannerCardDescription"),
      ).toHaveTextContent("home.scanner.description");

      expect(
        getByTestId("homeScannerCardActionLabel"),
      ).toHaveTextContent("home.scanner.action");
    });

    it("navigates to Scan", () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId("homeScannerCard"));

      expect(mockNavigate).toHaveBeenCalledTimes(1);

      expect(mockNavigate).toHaveBeenCalledWith("Scan");
    });
  });

  describe("packages", () => {
    it("renders packages action", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(getByTestId("homePackagesCard")).toBeTruthy();

      expect(
        getByTestId("homePackagesCardTitle"),
      ).toHaveTextContent("home.packageList.title");

      expect(
        getByTestId("homePackagesCardDescription"),
      ).toHaveTextContent("home.packageList.description");
    });

    it("navigates to PackagesList", () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId("homePackagesCard"));

      expect(mockNavigate).toHaveBeenCalledTimes(1);

      expect(mockNavigate).toHaveBeenCalledWith(
        "PackagesList",
      );
    });
  });

  describe("logout", () => {
    it("logs out when logout is pressed", () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId("mockHomeLogout"));

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe("overview", () => {
    it("renders overview section", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(getByTestId("homeOverview")).toBeTruthy();

      expect(
        getByTestId("homeOverviewTitle"),
      ).toHaveTextContent("home.overview");
    });

    it("renders package count", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(
        getByTestId("mockHomeStatLabel-0"),
      ).toHaveTextContent("home.stats.packages");

      expect(
        getByTestId("mockHomeStatValue-0"),
      ).toHaveTextContent("3");
    });

    it("renders pending count", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(
        getByTestId("mockHomeStatLabel-1"),
      ).toHaveTextContent("home.stats.pending");

      expect(
        getByTestId("mockHomeStatValue-1"),
      ).toHaveTextContent("2");
    });

    it("uses warning variant when packages are pending", () => {
      const { getByTestId } = render(<HomeScreen />);

      expect(
        getByTestId("mockHomeStatVariant-1"),
      ).toHaveTextContent("warning");
    });
  });
});
