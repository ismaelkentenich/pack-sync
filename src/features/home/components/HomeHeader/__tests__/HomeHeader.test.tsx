import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { HomeHeader } from "../HomeHeader";

describe("HomeHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the header", () => {
    const { getByTestId } = render(
      <HomeHeader
        greeting="Hello,"
        email="user@example.com"
        logoutAccessibilityLabel="Log out"
        onLogout={jest.fn()}
      />,
    );

    expect(getByTestId("homeHeader")).toBeTruthy();
  });

  it("renders the greeting", () => {
    const { getByTestId } = render(
      <HomeHeader
        greeting="Hello,"
        email="user@example.com"
        logoutAccessibilityLabel="Log out"
        onLogout={jest.fn()}
      />,
    );

    expect(getByTestId("homeGreeting")).toHaveTextContent(
      "Hello,",
    );
  });

  it("renders the email", () => {
    const { getByTestId } = render(
      <HomeHeader
        greeting="Hello,"
        email="user@example.com"
        logoutAccessibilityLabel="Log out"
        onLogout={jest.fn()}
      />,
    );

    expect(getByTestId("homeUserEmail")).toHaveTextContent(
      "user@example.com",
    );
  });

  it("renders an empty email when email is absent", () => {
    const { getByTestId } = render(
      <HomeHeader
        greeting="Hello,"
        logoutAccessibilityLabel="Log out"
        onLogout={jest.fn()}
      />,
    );

    expect(getByTestId("homeUserEmail")).toHaveTextContent(
      "",
    );
  });

  it("calls onLogout when logout is pressed", () => {
    const onLogout = jest.fn();

    const { getByTestId } = render(
      <HomeHeader
        greeting="Hello,"
        email="user@example.com"
        logoutAccessibilityLabel="Log out"
        onLogout={onLogout}
      />,
    );

    fireEvent.press(getByTestId("homeLogoutButton"));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("exposes button accessibility role", () => {
    const { getByTestId } = render(
      <HomeHeader
        greeting="Hello,"
        email="user@example.com"
        logoutAccessibilityLabel="Log out"
        onLogout={jest.fn()}
      />,
    );

    expect(getByTestId("homeLogoutButton")).toHaveProp(
      "accessibilityRole",
      "button",
    );
  });

  it("uses the provided accessibility label", () => {
    const { getByTestId } = render(
      <HomeHeader
        greeting="Hello,"
        email="user@example.com"
        logoutAccessibilityLabel="Log out account"
        onLogout={jest.fn()}
      />,
    );

    expect(getByTestId("homeLogoutButton")).toHaveProp(
      "accessibilityLabel",
      "Log out account",
    );
  });
});
