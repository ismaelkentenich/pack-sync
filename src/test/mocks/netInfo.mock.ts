export type MockNetworkState = {
  isConnected: boolean | null;
};

type NetworkListener = (state: MockNetworkState) => void;

export const mockNetInfoFetch = jest.fn();

export const mockNetworkUnsubscribe = jest.fn();

let networkListener: NetworkListener | undefined;

export function setMockNetworkListener(
  listener: NetworkListener,
) {
  networkListener = listener;
}

export function emitNetworkState(state: MockNetworkState) {
  networkListener?.(state);
}

export function resetNetInfoMock() {
  networkListener = undefined;

  mockNetInfoFetch.mockReset();
  mockNetworkUnsubscribe.mockReset();
}
