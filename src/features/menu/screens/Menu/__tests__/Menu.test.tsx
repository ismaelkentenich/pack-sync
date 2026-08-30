import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { Routes } from "@config/routes";
import MenuScreen from "../index";

const mockNavigate = jest.fn();
const mockLogout = jest.fn();
const mockSetPreference = jest.fn();
const mockChangeLanguage = jest.fn();

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
}));

jest.mock("@hooks/useMainTabNavigation", () => ({
  useMainTabNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock("@theme/useAppTheme", () => {
  const { lightTheme } = jest.requireActual(
    "../../../../../theme/appTheme",
  );
  return {
    useAppTheme: () => ({
      preference: "system",
      setPreference: mockSetPreference,
      resolvedTheme: "light",
      theme: lightTheme,
    }),
  };
});

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
    i18n: {
      language: "pt-BR",
      resolvedLanguage: "pt-BR",
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

jest.mock("@components/primitives/ScreenContainer", () => ({
  ScreenContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => children,
}));

describe("MenuScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders menu", () => {
    const { getByTestId } = render(<MenuScreen />);

    expect(getByTestId("menuScreen")).toBeTruthy();
  });

  it("renders scanner item", () => {
    const { getByTestId } = render(<MenuScreen />);

    expect(getByTestId("menuScanItem")).toBeTruthy();
  });

  it("renders packages item", () => {
    const { getByTestId } = render(<MenuScreen />);

    expect(getByTestId("menuPackagesItem")).toBeTruthy();
  });

  it("renders theme and language preference sections", () => {
    const { getByTestId } = render(<MenuScreen />);

    expect(getByTestId("menuThemePreference")).toBeTruthy();
    expect(
      getByTestId("menuLanguagePreference"),
    ).toBeTruthy();
  });

  it("changes theme preference with haptic feedback when theme option is pressed", () => {
    const { getByTestId } = render(<MenuScreen />);

    fireEvent.press(getByTestId("menuThemeDarkButton"));

    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light,
    );
    expect(mockSetPreference).toHaveBeenCalledWith("dark");
  });

  it("changes language with haptic feedback when language option is pressed", () => {
    const { getByTestId } = render(<MenuScreen />);

    fireEvent.press(getByTestId("menuLanguageEnButton"));

    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light,
    );
    expect(mockChangeLanguage).toHaveBeenCalledWith(
      "en-US",
    );
  });

  it("renders logout item", () => {
    const { getByTestId } = render(<MenuScreen />);

    expect(getByTestId("menuLogoutItem")).toBeTruthy();
  });

  it("navigates to scanner", () => {
    const { getByTestId } = render(<MenuScreen />);

    fireEvent.press(getByTestId("menuScanItem"));

    expect(mockNavigate).toHaveBeenCalledWith(Routes.Scan);
  });

  it("navigates to packages", () => {
    const { getByTestId } = render(<MenuScreen />);

    fireEvent.press(getByTestId("menuPackagesItem"));

    expect(mockNavigate).toHaveBeenCalledWith(
      Routes.Packages,
    );
  });

  it("logs out", () => {
    const { getByTestId } = render(<MenuScreen />);

    fireEvent.press(getByTestId("menuLogoutItem"));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
