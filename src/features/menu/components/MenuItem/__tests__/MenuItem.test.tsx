import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { ScanLine } from "lucide-react-native";
import { MenuItem } from "../MenuItem";

describe("MenuItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title", () => {
    const { getByText } = render(
      <MenuItem
        title="Scan package"
        icon={ScanLine}
        onPress={jest.fn()}
      />,
    );

    expect(getByText("Scan package")).toBeTruthy();
  });

  it("renders description", () => {
    const { getByText } = render(
      <MenuItem
        title="Scan package"
        description="Scan barcode"
        icon={ScanLine}
        onPress={jest.fn()}
      />,
    );

    expect(getByText("Scan barcode")).toBeTruthy();
  });

  it("calls onPress", () => {
    const onPress = jest.fn();

    const { getByTestId } = render(
      <MenuItem
        testID="scanItem"
        title="Scan package"
        icon={ScanLine}
        onPress={onPress}
      />,
    );

    fireEvent.press(getByTestId("scanItem"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("exposes button accessibility role", () => {
    const { getByTestId } = render(
      <MenuItem
        testID="scanItem"
        title="Scan package"
        icon={ScanLine}
        onPress={jest.fn()}
      />,
    );

    expect(getByTestId("scanItem")).toHaveProp(
      "accessibilityRole",
      "button",
    );
  });

  it("uses custom accessibility label", () => {
    const { getByTestId } = render(
      <MenuItem
        testID="scanItem"
        title="Scan package"
        accessibilityLabel="Open scanner"
        icon={ScanLine}
        onPress={jest.fn()}
      />,
    );

    expect(getByTestId("scanItem")).toHaveProp(
      "accessibilityLabel",
      "Open scanner",
    );
  });
});
