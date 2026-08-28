jest.mock("react-native-worklets", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("react-native-worklets/src/mock");
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("react-native-reanimated").setUpTests();

afterEach(() => {
  jest.useRealTimers();
});

jest.mock("react-native-safe-area-context", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");

  return {
    SafeAreaProvider: ({
      children,
    }: {
      children: React.ReactNode;
    }) => children,
    SafeAreaConsumer: ({
      children,
    }: {
      children: (insets: {
        top: number;
        bottom: number;
        left: number;
        right: number;
      }) => React.ReactNode;
    }) =>
      children({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }),
    SafeAreaView: ({
      children,
      testID,
      ...props
    }: {
      children?: React.ReactNode;
      testID?: string;
      [key: string]: unknown;
    }) =>
      React.createElement(
        View,
        {
          testID,
          ...props,
        },
        children,
      ),
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
    useSafeAreaFrame: () => ({
      x: 0,
      y: 0,
      width: 390,
      height: 844,
    }),
  };
});
