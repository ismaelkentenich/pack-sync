import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import { CustomAlert } from "../CustomAlert";

describe("CustomAlert", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders with the default testID", () => {
      const { getByTestId } = render(
        <CustomAlert
          visible
          message="Something happened"
          confirmText="OK"
          onClose={jest.fn()}
        />,
      );

      expect(getByTestId("customAlertModal")).toBeTruthy();
    });

    it("uses a custom modal testID", () => {
      const { getByTestId, queryByTestId } = render(
        <CustomAlert
          visible
          message="Something happened"
          confirmText="OK"
          onClose={jest.fn()}
          testID="networkErrorAlert"
        />,
      );

      expect(getByTestId("networkErrorAlert")).toBeTruthy();

      expect(queryByTestId("customAlertModal")).toBeNull();
    });

    it("renders the message", () => {
      const { getByTestId } = render(
        <CustomAlert
          visible
          message="Package synchronized successfully"
          confirmText="OK"
          onClose={jest.fn()}
        />,
      );

      expect(
        getByTestId("customAlertMessage"),
      ).toHaveTextContent(
        "Package synchronized successfully",
      );
    });

    it("renders the title when provided", () => {
      const { getByTestId } = render(
        <CustomAlert
          visible
          title="Success"
          message="Operation completed"
          confirmText="OK"
          onClose={jest.fn()}
        />,
      );

      expect(
        getByTestId("customAlertTitle"),
      ).toHaveTextContent("Success");
    });

    it("does not render the title when absent", () => {
      const { queryByTestId } = render(
        <CustomAlert
          visible
          message="Operation completed"
          confirmText="OK"
          onClose={jest.fn()}
        />,
      );

      expect(queryByTestId("customAlertTitle")).toBeNull();
    });

    it("renders the confirm text", () => {
      const { getByTestId } = render(
        <CustomAlert
          visible
          message="Operation completed"
          confirmText="Got it"
          onClose={jest.fn()}
        />,
      );

      expect(getByTestId("buttonText")).toHaveTextContent(
        "Got it",
      );
    });

    it("renders modal content when visible is true", () => {
      const { getByTestId } = render(
        <CustomAlert
          visible
          message="Operation completed"
          confirmText="OK"
          onClose={jest.fn()}
        />,
      );

      expect(
        getByTestId("customAlertContainer"),
      ).toBeTruthy();

      expect(
        getByTestId("customAlertMessage"),
      ).toHaveTextContent("Operation completed");
    });
  });

  describe("visibility", () => {
    it("passes visible true to Modal", () => {
      const { getByTestId } = render(
        <CustomAlert
          visible
          message="Operation completed"
          confirmText="OK"
          onClose={jest.fn()}
        />,
      );

      expect(getByTestId("customAlertModal")).toHaveProp(
        "visible",
        true,
      );
    });

    it("does not render modal content when visible is false", () => {
      const { queryByTestId } = render(
        <CustomAlert
          visible={false}
          message="Operation completed"
          confirmText="OK"
          onClose={jest.fn()}
        />,
      );

      expect(
        queryByTestId("customAlertContainer"),
      ).toBeNull();

      expect(
        queryByTestId("customAlertMessage"),
      ).toBeNull();

      expect(
        queryByTestId("customAlertConfirmButton"),
      ).toBeNull();
    });
  });

  describe("interaction", () => {
    it("calls onClose when confirm button is pressed", () => {
      const onClose = jest.fn();

      const { getByTestId } = render(
        <CustomAlert
          visible
          message="Operation completed"
          confirmText="OK"
          onClose={onClose}
        />,
      );

      fireEvent.press(
        getByTestId("customAlertConfirmButton"),
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("passes onClose to Modal onRequestClose", () => {
      const onClose = jest.fn();

      const { getByTestId } = render(
        <CustomAlert
          visible
          message="Operation completed"
          confirmText="OK"
          onClose={onClose}
        />,
      );

      expect(getByTestId("customAlertModal")).toHaveProp(
        "onRequestClose",
        onClose,
      );
    });
  });

  describe("accessibility", () => {
    it("exposes the message as an alert", () => {
      const { getByTestId } = render(
        <CustomAlert
          visible
          message="Operation completed"
          confirmText="OK"
          onClose={jest.fn()}
        />,
      );

      expect(getByTestId("customAlertMessage")).toHaveProp(
        "accessibilityRole",
        "alert",
      );
    });

    it("uses header accessibility role when title exists", () => {
      const { getByTestId } = render(
        <CustomAlert
          visible
          title="Warning"
          message="Operation completed"
          confirmText="OK"
          onClose={jest.fn()}
        />,
      );

      expect(getByTestId("customAlertTitle")).toHaveProp(
        "accessibilityRole",
        "header",
      );
    });

    it("marks content as modal for accessibility", () => {
      const { getByTestId } = render(
        <CustomAlert
          visible
          message="Operation completed"
          confirmText="OK"
          onClose={jest.fn()}
        />,
      );

      expect(
        getByTestId("customAlertContainer"),
      ).toHaveProp("accessibilityViewIsModal", true);
    });
  });

  describe("custom styles", () => {
    it("applies custom container styles", () => {
      const { getByTestId } = render(
        <CustomAlert
          visible
          message="Operation completed"
          confirmText="OK"
          onClose={jest.fn()}
          containerStyle={{
            width: 300,
          }}
        />,
      );

      expect(
        getByTestId("customAlertContainer"),
      ).toHaveStyle({
        width: 300,
      });
    });
  });
});
