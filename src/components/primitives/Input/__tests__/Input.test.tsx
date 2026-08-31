import {
  act,
  fireEvent,
  render,
} from "@testing-library/react-native";
import { Input } from "../Input";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Input", () => {
  describe("rendering", () => {
    it("renders with the default testID", () => {
      const { getByTestId } = render(
        <Input label="Email" />,
      );

      expect(getByTestId("inputRoot")).toBeTruthy();
    });

    it("renders with a custom testID", () => {
      const { getByTestId } = render(
        <Input testID="emailInput" label="Email" />,
      );

      expect(getByTestId("emailInput")).toBeTruthy();
    });

    it("renders the input field", () => {
      const { getByTestId } = render(
        <Input label="Email" />,
      );

      expect(getByTestId("inputField")).toBeTruthy();
    });

    it("renders the label", () => {
      const { getByTestId } = render(
        <Input label="Email" />,
      );

      expect(getByTestId("inputLabel")).toHaveTextContent(
        "Email",
      );
    });

    it("does not render the label when label is not provided", () => {
      const { queryByTestId } = render(
        <Input placeholder="Search..." />,
      );

      expect(queryByTestId("inputLabel")).toBeNull();

      expect(
        queryByTestId("inputLabelContainer"),
      ).toBeNull();
    });

    it("forwards TextInput props", () => {
      const { getByTestId } = render(
        <Input
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />,
      );

      const input = getByTestId("inputField");

      expect(input.props.keyboardType).toBe(
        "email-address",
      );

      expect(input.props.autoCapitalize).toBe("none");
    });
  });

  describe("value", () => {
    it("renders a controlled value", () => {
      const { getByDisplayValue } = render(
        <Input label="Email" value="john@example.com" />,
      );

      expect(
        getByDisplayValue("john@example.com"),
      ).toBeTruthy();
    });

    it("renders a default value", () => {
      const { getByDisplayValue } = render(
        <Input
          label="Email"
          defaultValue="john@example.com"
        />,
      );

      expect(
        getByDisplayValue("john@example.com"),
      ).toBeTruthy();
    });

    it("calls onChangeText when the value changes", () => {
      const onChangeText = jest.fn();

      const { getByTestId } = render(
        <Input label="Email" onChangeText={onChangeText} />,
      );

      fireEvent.changeText(
        getByTestId("inputField"),
        "john@example.com",
      );

      expect(onChangeText).toHaveBeenCalledTimes(1);

      expect(onChangeText).toHaveBeenCalledWith(
        "john@example.com",
      );
    });
  });

  describe("floating label", () => {
    it("renders the label container", () => {
      const { getByTestId } = render(
        <Input label="Email" />,
      );

      expect(
        getByTestId("inputLabelContainer"),
      ).toBeTruthy();
    });

    it("keeps the label rendered when the input receives focus", () => {
      const { getByTestId } = render(
        <Input label="Email" />,
      );

      fireEvent(getByTestId("inputField"), "focus");

      expect(getByTestId("inputLabel")).toHaveTextContent(
        "Email",
      );
    });

    it("keeps the label rendered when the input has a value", () => {
      const { getByTestId } = render(
        <Input label="Email" value="john@example.com" />,
      );

      expect(getByTestId("inputLabel")).toHaveTextContent(
        "Email",
      );
    });

    it("shows the provided placeholder while focused", () => {
      const { getByTestId } = render(
        <Input
          label="Email"
          placeholder="name@example.com"
        />,
      );

      const input = getByTestId("inputField");

      expect(input.props.placeholder).toBeUndefined();

      fireEvent(input, "focus");

      expect(input.props.placeholder).toBe(
        "name@example.com",
      );
    });

    it("shows the placeholder when the input already has a value", () => {
      const { getByTestId } = render(
        <Input
          label="Email"
          placeholder="name@example.com"
          value="john@example.com"
        />,
      );

      expect(
        getByTestId("inputField").props.placeholder,
      ).toBe("name@example.com");
    });
  });

  describe("focus", () => {
    it("calls onFocus", () => {
      const onFocus = jest.fn();

      const { getByTestId } = render(
        <Input label="Email" onFocus={onFocus} />,
      );

      fireEvent(getByTestId("inputField"), "focus");

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onBlur", () => {
      const onBlur = jest.fn();

      const { getByTestId } = render(
        <Input label="Email" onBlur={onBlur} />,
      );

      fireEvent(getByTestId("inputField"), "blur");

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it("removes the placeholder after blur when the input is empty", () => {
      const { getByTestId } = render(
        <Input
          label="Email"
          placeholder="name@example.com"
        />,
      );

      const input = getByTestId("inputField");

      fireEvent(input, "focus");

      expect(input.props.placeholder).toBe(
        "name@example.com",
      );

      fireEvent(input, "blur");

      expect(input.props.placeholder).toBeUndefined();
    });
  });

  describe("supporting text", () => {
    it("renders an error message", () => {
      const { getByTestId } = render(
        <Input label="Email" error="Invalid email" />,
      );

      expect(getByTestId("inputError")).toHaveTextContent(
        "Invalid email",
      );
    });

    it("renders helper text", () => {
      const { getByTestId } = render(
        <Input
          label="Password"
          helperText="Minimum 8 characters"
        />,
      );

      expect(
        getByTestId("inputHelperText"),
      ).toHaveTextContent("Minimum 8 characters");
    });

    it("prioritizes error over helper text", () => {
      const { getByTestId, queryByTestId } = render(
        <Input
          label="Email"
          error="Invalid email"
          helperText="Enter your email"
        />,
      );

      expect(getByTestId("inputError")).toHaveTextContent(
        "Invalid email",
      );

      expect(queryByTestId("inputHelperText")).toBeNull();
    });

    it("does not render supporting text when none is provided", () => {
      const { queryByTestId } = render(
        <Input label="Email" />,
      );

      expect(queryByTestId("inputError")).toBeNull();

      expect(queryByTestId("inputHelperText")).toBeNull();
    });
  });

  describe("password", () => {
    it("hides password by default", () => {
      const { getByTestId } = render(
        <Input label="Password" secure />,
      );

      expect(
        getByTestId("inputField").props.secureTextEntry,
      ).toBe(true);
    });

    it("renders the password toggle", () => {
      const { getByTestId, getAllByTestId } = render(
        <Input label="Password" secure />,
      );

      expect(
        getByTestId("inputTogglePassword"),
      ).toBeTruthy();

      expect(
        getAllByTestId("inputEyeIcon").length,
      ).toBeGreaterThan(0);
    });

    it("does not render the password toggle for regular inputs", () => {
      const { queryByTestId } = render(
        <Input label="Email" />,
      );

      expect(
        queryByTestId("inputTogglePassword"),
      ).toBeNull();
    });

    it("shows the password when toggle is pressed", () => {
      const { getByTestId, getAllByTestId } = render(
        <Input label="Password" secure />,
      );

      fireEvent.press(getByTestId("inputTogglePassword"));

      expect(
        getByTestId("inputField").props.secureTextEntry,
      ).toBe(false);

      expect(
        getAllByTestId("inputEyeOffIcon").length,
      ).toBeGreaterThan(0);
    });

    it("hides the password again when toggle is pressed twice", () => {
      const { getByTestId, getAllByTestId } = render(
        <Input label="Password" secure />,
      );

      const toggle = getByTestId("inputTogglePassword");

      fireEvent.press(toggle);
      fireEvent.press(toggle);

      expect(
        getByTestId("inputField").props.secureTextEntry,
      ).toBe(true);

      expect(
        getAllByTestId("inputEyeIcon").length,
      ).toBeGreaterThan(0);
    });

    it("uses the correct accessibility label when password is hidden", () => {
      const { getByTestId } = render(
        <Input label="Password" secure />,
      );

      expect(getByTestId("inputTogglePassword")).toHaveProp(
        "accessibilityLabel",
        "accessibility.input.showPassword",
      );
    });

    it("updates the accessibility label when password becomes visible", () => {
      const { getByTestId } = render(
        <Input label="Password" secure />,
      );

      const toggle = getByTestId("inputTogglePassword");

      fireEvent.press(toggle);

      expect(toggle).toHaveProp(
        "accessibilityLabel",
        "accessibility.input.hidePassword",
      );
    });
  });

  describe("disabled", () => {
    it("sets the TextInput as non-editable", () => {
      const { getByTestId } = render(
        <Input label="Email" editable={false} />,
      );

      expect(getByTestId("inputField").props.editable).toBe(
        false,
      );
    });

    it("sets the disabled accessibility state", () => {
      const { getByTestId } = render(
        <Input label="Email" editable={false} />,
      );

      expect(
        getByTestId("inputField").props.accessibilityState,
      ).toEqual({
        disabled: true,
      });
    });

    it("disables the password toggle", () => {
      const { getByTestId } = render(
        <Input label="Password" secure editable={false} />,
      );

      expect(
        getByTestId("inputTogglePassword").props
          .accessibilityState,
      ).toEqual({
        disabled: true,
      });
    });
  });

  describe("accessibility", () => {
    it("uses label as accessibilityLabel on TextInput by default", () => {
      const { getByTestId } = render(
        <Input label="Email Address" />,
      );

      expect(getByTestId("inputField")).toHaveProp(
        "accessibilityLabel",
        "Email Address",
      );
    });

    it("allows custom accessibilityLabel to override label", () => {
      const { getByTestId } = render(
        <Input
          label="Email"
          accessibilityLabel="Custom Email Label"
        />,
      );

      expect(getByTestId("inputField")).toHaveProp(
        "accessibilityLabel",
        "Custom Email Label",
      );
    });

    it("uses helperText as accessibilityHint on TextInput", () => {
      const { getByTestId } = render(
        <Input
          label="Password"
          helperText="Must be at least 8 characters"
        />,
      );

      expect(getByTestId("inputField")).toHaveProp(
        "accessibilityHint",
        "Must be at least 8 characters",
      );
    });

    it("allows custom accessibilityHint to override helperText", () => {
      const { getByTestId } = render(
        <Input
          label="Password"
          helperText="Helper text"
          accessibilityHint="Custom Hint"
        />,
      );

      expect(getByTestId("inputField")).toHaveProp(
        "accessibilityHint",
        "Custom Hint",
      );
    });
  });

  describe("animation", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it("keeps the label available while the floating animation runs", () => {
      const { getByTestId } = render(
        <Input label="Email" />,
      );

      fireEvent(getByTestId("inputField"), "focus");

      act(() => {
        jest.runAllTimers();
      });

      expect(
        getByTestId("inputLabelContainer"),
      ).toBeTruthy();

      expect(getByTestId("inputLabel")).toHaveTextContent(
        "Email",
      );
    });

    it("keeps the label available after blur animation", () => {
      const { getByTestId } = render(
        <Input label="Email" />,
      );

      const input = getByTestId("inputField");

      fireEvent(input, "focus");

      act(() => {
        jest.runAllTimers();
      });

      fireEvent(input, "blur");

      act(() => {
        jest.runAllTimers();
      });

      expect(getByTestId("inputLabel")).toHaveTextContent(
        "Email",
      );
    });

    it("keeps the label floating after typing in an uncontrolled input", () => {
      const { getByTestId } = render(
        <Input
          label="Email"
          placeholder="name@example.com"
        />,
      );

      const input = getByTestId("inputField");

      fireEvent(input, "focus");

      fireEvent.changeText(input, "john@example.com");

      fireEvent(input, "blur");

      expect(getByTestId("inputLabel")).toHaveTextContent(
        "Email",
      );

      expect(
        getByTestId("inputField").props.placeholder,
      ).toBe("name@example.com");
    });
  });
});
