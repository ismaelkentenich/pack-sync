import {
  mockNetInfoFetch,
  mockNetworkUnsubscribe,
  setMockNetworkListener,
} from "../../src/test/mocks/netInfo.mock";

const NetInfo = {
  fetch: mockNetInfoFetch,

  addEventListener: jest.fn((listener) => {
    setMockNetworkListener(listener);

    return mockNetworkUnsubscribe;
  }),
};

export default NetInfo;
