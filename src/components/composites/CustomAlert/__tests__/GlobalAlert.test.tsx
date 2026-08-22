import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { GlobalAlert } from "../GlobalAlert";

const mockHide = jest.fn();

let mockAlertState = {
  visible: true,
  message: "Global alert message",
  hide: mockHide,
};

jest.mock("@store/useAlertStore", () => ({
  useShowAlert: (
    selector: (state: typeof mockAlertState) => unknown,
  ) => selector(mockAlertState),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === "common.ok") {
        return "OK";
      }

      return key;
    },
  }),
}));

describe("GlobalAlert", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockAlertState = {
      visible: true,
      message: "Global alert message",
      hide: mockHide,
    };
  });

  it("renders the message from the alert store", () => {
    const { getByTestId } = render(<GlobalAlert />);

    expect(
      getByTestId("customAlertMessage"),
    ).toHaveTextContent("Global alert message");
  });

  it("uses translated confirm text", () => {
    const { getByTestId } = render(<GlobalAlert />);

    expect(getByTestId("buttonText")).toHaveTextContent(
      "OK",
    );
  });

  it("calls store hide when confirm button is pressed", () => {
    const { getByTestId } = render(<GlobalAlert />);

    fireEvent.press(
      getByTestId("customAlertConfirmButton"),
    );

    expect(mockHide).toHaveBeenCalledTimes(1);
  });

  it("does not render alert content when store visibility is false", () => {
    mockAlertState = {
      ...mockAlertState,
      visible: false,
    };

    const { queryByTestId } = render(<GlobalAlert />);

    expect(
      queryByTestId("customAlertContainer"),
    ).toBeNull();

    expect(queryByTestId("customAlertMessage")).toBeNull();

    expect(
      queryByTestId("customAlertConfirmButton"),
    ).toBeNull();
  });
});
