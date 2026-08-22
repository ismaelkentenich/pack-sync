import {
  fireEvent,
  render,
} from "@testing-library/react-native";
import Theme from "@theme/theme";
import { Input } from "../Input";

describe("Input", () => {
  describe("rendering", () => {
    it("renders the input with the default testID", () => {
      const { getByTestId } = render(
        <Input placeholder="Type something" />,
      );

      expect(getByTestId("inputRoot")).toBeTruthy();
      expect(getByTestId("inputField")).toBeTruthy();
      expect(getByTestId("inputWrapper")).toBeTruthy();
    });

    it("uses a custom root testID when provided", () => {
      const { getByTestId, queryByTestId } = render(
        <Input placeholder="Email" testID="emailInput" />,
      );

      expect(getByTestId("emailInput")).toBeTruthy();
      expect(queryByTestId("inputRoot")).toBeNull();
    });

    it("renders the label when provided", () => {
      const { getByTestId } = render(
        <Input
          label="Email"
          placeholder="Type your email"
        />,
      );

      expect(getByTestId("inputLabel")).toHaveTextContent(
        "Email",
      );
    });

    it("does not render a label when not provided", () => {
      const { queryByTestId } = render(
        <Input placeholder="Type something" />,
      );

      expect(queryByTestId("inputLabel")).toBeNull();
    });

    it("forwards TextInput props", () => {
      const { getByTestId } = render(
        <Input
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />,
      );

      expect(getByTestId("inputField")).toHaveProp(
        "placeholder",
        "Email",
      );

      expect(getByTestId("inputField")).toHaveProp(
        "autoCapitalize",
        "none",
      );

      expect(getByTestId("inputField")).toHaveProp(
        "keyboardType",
        "email-address",
      );
    });
  });

  describe("interaction", () => {
    it("calls onChangeText when text changes", () => {
      const onChangeText = jest.fn();

      const { getByTestId } = render(
        <Input onChangeText={onChangeText} />,
      );

      fireEvent.changeText(
        getByTestId("inputField"),
        "hello@example.com",
      );

      expect(onChangeText).toHaveBeenCalledWith(
        "hello@example.com",
      );
    });

    it("calls onFocus when focused", () => {
      const onFocus = jest.fn();

      const { getByTestId } = render(
        <Input onFocus={onFocus} />,
      );

      fireEvent(getByTestId("inputField"), "focus", {});

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onBlur when blurred", () => {
      const onBlur = jest.fn();

      const { getByTestId } = render(
        <Input onBlur={onBlur} />,
      );

      fireEvent(getByTestId("inputField"), "blur", {});

      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("states", () => {
    it("uses default colors initially", () => {
      const { getByTestId } = render(
        <Input label="Name" />,
      );

      expect(getByTestId("inputWrapper")).toHaveStyle({
        backgroundColor: Theme.colors.neutral[50],
        borderColor: Theme.colors.neutral[300],
      });

      expect(getByTestId("inputField")).toHaveStyle({
        color: Theme.colors.neutral[900],
      });

      expect(getByTestId("inputLabel")).toHaveStyle({
        color: Theme.colors.neutral[700],
      });
    });

    it("uses focused colors when focused", () => {
      const { getByTestId } = render(
        <Input label="Name" />,
      );

      fireEvent(getByTestId("inputField"), "focus", {});

      expect(getByTestId("inputWrapper")).toHaveStyle({
        borderColor: Theme.colors.primary[500],
      });

      expect(getByTestId("inputLabel")).toHaveStyle({
        color: Theme.colors.neutral[800],
      });
    });

    it("returns to default colors after blur", () => {
      const { getByTestId } = render(
        <Input label="Name" />,
      );

      fireEvent(getByTestId("inputField"), "focus", {});

      fireEvent(getByTestId("inputField"), "blur", {});

      expect(getByTestId("inputWrapper")).toHaveStyle({
        borderColor: Theme.colors.neutral[300],
      });
    });

    it("prioritizes the error state over focused state", () => {
      const { getByTestId } = render(
        <Input label="Email" error="Invalid email" />,
      );

      fireEvent(getByTestId("inputField"), "focus", {});

      expect(getByTestId("inputWrapper")).toHaveStyle({
        borderColor: Theme.colors.error[500],
      });

      expect(getByTestId("inputLabel")).toHaveStyle({
        color: Theme.colors.error[500],
      });
    });

    it("prioritizes disabled state over error", () => {
      const { getByTestId } = render(
        <Input
          label="Email"
          error="Invalid email"
          editable={false}
        />,
      );

      expect(getByTestId("inputWrapper")).toHaveStyle({
        backgroundColor: Theme.colors.neutral[100],
        borderColor: Theme.colors.neutral[200],
      });

      expect(getByTestId("inputField")).toHaveStyle({
        color: Theme.colors.neutral[500],
      });

      expect(getByTestId("inputLabel")).toHaveStyle({
        color: Theme.colors.neutral[500],
      });
    });
  });

  describe("error", () => {
    it("renders the error message", () => {
      const { getByTestId } = render(
        <Input error="Invalid value" />,
      );

      expect(getByTestId("inputError")).toHaveTextContent(
        "Invalid value",
      );
    });

    it("does not render an error message when absent", () => {
      const { queryByTestId } = render(<Input />);

      expect(queryByTestId("inputError")).toBeNull();
    });

    it("exposes the error as an accessibility alert", () => {
      const { getByTestId } = render(
        <Input error="Invalid value" />,
      );

      expect(getByTestId("inputError")).toHaveProp(
        "accessibilityRole",
        "alert",
      );
    });
  });

  describe("disabled", () => {
    it("passes editable false to TextInput", () => {
      const { getByTestId } = render(
        <Input editable={false} />,
      );

      expect(getByTestId("inputField")).toHaveProp(
        "editable",
        false,
      );
    });

    it("exposes disabled accessibility state", () => {
      const { getByTestId } = render(
        <Input editable={false} />,
      );

      expect(getByTestId("inputField")).toHaveProp(
        "accessibilityState",
        {
          disabled: true,
        },
      );
    });

    it("exposes enabled accessibility state by default", () => {
      const { getByTestId } = render(<Input />);

      expect(getByTestId("inputField")).toHaveProp(
        "accessibilityState",
        {
          disabled: false,
        },
      );
    });
  });

  describe("secure input", () => {
    it("does not render password toggle when secure is false", () => {
      const { queryByTestId } = render(<Input />);

      expect(
        queryByTestId("inputTogglePassword"),
      ).toBeNull();
    });

    it("renders password toggle when secure is true", () => {
      const { getByTestId } = render(<Input secure />);

      expect(
        getByTestId("inputTogglePassword"),
      ).toBeTruthy();
    });

    it("hides password by default", () => {
      const { getByTestId, getAllByTestId, queryByTestId } =
        render(<Input secure />);

      expect(getByTestId("inputField")).toHaveProp(
        "secureTextEntry",
        true,
      );

      expect(
        getAllByTestId("inputEyeIcon").length,
      ).toBeGreaterThan(0);

      expect(queryByTestId("inputEyeOffIcon")).toBeNull();
    });

    it("shows password after pressing the toggle", () => {
      const { getByTestId, getAllByTestId, queryByTestId } =
        render(<Input secure />);

      fireEvent.press(getByTestId("inputTogglePassword"));

      expect(getByTestId("inputField")).toHaveProp(
        "secureTextEntry",
        false,
      );

      expect(
        getAllByTestId("inputEyeOffIcon").length,
      ).toBeGreaterThan(0);

      expect(queryByTestId("inputEyeIcon")).toBeNull();
    });

    it("hides password again after pressing the toggle twice", () => {
      const { getByTestId, getAllByTestId, queryByTestId } =
        render(<Input secure />);

      const toggle = getByTestId("inputTogglePassword");

      fireEvent.press(toggle);
      fireEvent.press(toggle);

      expect(getByTestId("inputField")).toHaveProp(
        "secureTextEntry",
        true,
      );

      expect(
        getAllByTestId("inputEyeIcon").length,
      ).toBeGreaterThan(0);

      expect(queryByTestId("inputEyeOffIcon")).toBeNull();
    });

    it("has button accessibility role on password toggle", () => {
      const { getByTestId } = render(<Input secure />);

      expect(getByTestId("inputTogglePassword")).toHaveProp(
        "accessibilityRole",
        "button",
      );
    });

    it("exposes disabled state on password toggle when input is disabled", () => {
      const { getByTestId } = render(
        <Input secure editable={false} />,
      );

      expect(getByTestId("inputTogglePassword")).toHaveProp(
        "accessibilityState",
        {
          disabled: true,
        },
      );
    });

    it("does not reveal the password when input is disabled", () => {
      const { getByTestId } = render(
        <Input secure editable={false} />,
      );

      fireEvent.press(getByTestId("inputTogglePassword"));

      expect(getByTestId("inputField")).toHaveProp(
        "secureTextEntry",
        true,
      );
    });
  });
  describe("custom styles", () => {
    it("applies custom container styles", () => {
      const { getByTestId } = render(
        <Input
          containerStyle={{
            marginTop: 20,
          }}
        />,
      );

      expect(getByTestId("inputRoot")).toHaveStyle({
        marginTop: 20,
      });
    });

    it("applies custom input styles", () => {
      const { getByTestId } = render(
        <Input
          inputStyle={{
            letterSpacing: 2,
          }}
        />,
      );

      expect(getByTestId("inputField")).toHaveStyle({
        letterSpacing: 2,
      });
    });
  });
});
