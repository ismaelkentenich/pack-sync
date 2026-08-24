import { render } from "@testing-library/react-native";
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
      />,
    );

    expect(getByTestId("homeHeader")).toBeTruthy();
  });

  it("renders the greeting", () => {
    const { getByTestId } = render(
      <HomeHeader
        greeting="Hello,"
        email="user@example.com"
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
      />,
    );

    expect(getByTestId("homeUserEmail")).toHaveTextContent(
      "user@example.com",
    );
  });

  it("renders an empty email when email is absent", () => {
    const { getByTestId } = render(
      <HomeHeader greeting="Hello," />,
    );

    expect(getByTestId("homeUserEmail")).toHaveTextContent(
      "",
    );
  });
});
