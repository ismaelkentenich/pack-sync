import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { Header } from "../Header";

const mockGoBack = jest.fn();
const mockLogout = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock("@features/auth/store/useAuthStore", () => ({
  useAuthStore: (
    selector: (state: {
      logout: typeof mockLogout;
    }) => unknown,
  ) =>
    selector({
      logout: mockLogout,
    }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders with the default testID", () => {
      const { getByTestId } = render(
        <Header title="Home" />,
      );

      expect(getByTestId("headerRoot")).toBeTruthy();
    });

    it("uses a custom root testID", () => {
      const { getByTestId, queryByTestId } = render(
        <Header title="Home" testID="homeHeader" />,
      );

      expect(getByTestId("homeHeader")).toBeTruthy();

      expect(queryByTestId("headerRoot")).toBeNull();
    });

    it("renders the title", () => {
      const { getByTestId } = render(
        <Header title="Packages" />,
      );

      expect(getByTestId("headerTitle")).toHaveTextContent(
        "Packages",
      );
    });

    it("renders an empty title when title is not provided", () => {
      const { getByTestId } = render(<Header />);

      expect(getByTestId("headerTitle")).toBeTruthy();
    });
  });

  describe("back button", () => {
    it("renders back button by default", () => {
      const { getByTestId } = render(
        <Header title="Packages" />,
      );

      expect(getByTestId("headerBackButton")).toBeTruthy();
    });

    it("does not render back button when disabled", () => {
      const { queryByTestId } = render(
        <Header title="Home" showBack={false} />,
      );

      expect(queryByTestId("headerBackButton")).toBeNull();
    });

    it("renders back icon when back button is visible", () => {
      const { getAllByTestId } = render(
        <Header title="Packages" />,
      );

      expect(
        getAllByTestId("headerBackIcon").length,
      ).toBeGreaterThan(0);
    });

    it("calls navigation.goBack when back button is pressed", () => {
      const { getByTestId } = render(
        <Header title="Packages" />,
      );

      fireEvent.press(getByTestId("headerBackButton"));

      expect(mockGoBack).toHaveBeenCalledTimes(1);
    });

    it("has button accessibility role", () => {
      const { getByTestId } = render(
        <Header title="Packages" />,
      );

      expect(getByTestId("headerBackButton")).toHaveProp(
        "accessibilityRole",
        "button",
      );
    });

    it("uses translated accessibility label", () => {
      const { getByTestId } = render(
        <Header title="Packages" />,
      );

      expect(getByTestId("headerBackButton")).toHaveProp(
        "accessibilityLabel",
        "accessibility.header.back",
      );
    });
  });

  describe("logout button", () => {
    it("does not render logout button by default", () => {
      const { queryByTestId } = render(
        <Header title="Home" />,
      );

      expect(
        queryByTestId("headerLogoutButton"),
      ).toBeNull();
    });

    it("renders logout button when enabled", () => {
      const { getByTestId } = render(
        <Header title="Home" showLogout />,
      );

      expect(
        getByTestId("headerLogoutButton"),
      ).toBeTruthy();
    });

    it("renders logout icon when logout button is visible", () => {
      const { getAllByTestId } = render(
        <Header title="Home" showLogout />,
      );

      expect(
        getAllByTestId("headerLogoutIcon").length,
      ).toBeGreaterThan(0);
    });

    it("calls logout when logout button is pressed", async () => {
      mockLogout.mockResolvedValue(undefined);

      const { getByTestId } = render(
        <Header title="Home" showLogout />,
      );

      fireEvent.press(getByTestId("headerLogoutButton"));

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it("has button accessibility role", () => {
      const { getByTestId } = render(
        <Header title="Home" showLogout />,
      );

      expect(getByTestId("headerLogoutButton")).toHaveProp(
        "accessibilityRole",
        "button",
      );
    });

    it("uses translated accessibility label", () => {
      const { getByTestId } = render(
        <Header title="Home" showLogout />,
      );

      expect(getByTestId("headerLogoutButton")).toHaveProp(
        "accessibilityLabel",
        "accessibility.header.logout",
      );
    });
  });

  describe("combined states", () => {
    it("renders both actions when both are enabled", () => {
      const { getByTestId } = render(
        <Header title="Packages" showBack showLogout />,
      );

      expect(getByTestId("headerBackButton")).toBeTruthy();

      expect(
        getByTestId("headerLogoutButton"),
      ).toBeTruthy();
    });

    it("renders only the title when both actions are disabled", () => {
      const { getByTestId, queryByTestId } = render(
        <Header
          title="Home"
          showBack={false}
          showLogout={false}
        />,
      );

      expect(getByTestId("headerTitle")).toBeTruthy();

      expect(queryByTestId("headerBackButton")).toBeNull();

      expect(
        queryByTestId("headerLogoutButton"),
      ).toBeNull();
    });
  });
});
