import { AppState, AppStateStatus } from "react-native";

export const mockAppStateRemove = jest.fn();

let appStateListener:
  ((state: AppStateStatus) => void) | undefined;

export function mockAppState() {
  jest
    .spyOn(AppState, "addEventListener")
    .mockImplementation((_event, listener) => {
      appStateListener = listener;

      return {
        remove: mockAppStateRemove,
      };
    });
}

export function emitAppState(state: AppStateStatus) {
  appStateListener?.(state);
}

export function resetAppStateMock() {
  appStateListener = undefined;

  mockAppStateRemove.mockReset();
}
