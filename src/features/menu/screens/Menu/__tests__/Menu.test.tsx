import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { Routes } from "@config/routes";
import MenuScreen from "../index";

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

jest.mock("@hooks/useMainTabNavigation", () => ({
  useMainTabNavigation: () => ({
    navigate: mockNavigate,
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
