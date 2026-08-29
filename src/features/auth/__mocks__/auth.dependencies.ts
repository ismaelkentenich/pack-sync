export const authService = {
  login: jest.fn().mockResolvedValue({
    id: "1",
    email: "test@example.com",
    displayName: null,
  }),
  signup: jest.fn().mockResolvedValue({
    id: "1",
    email: "test@example.com",
    displayName: null,
  }),
  logout: jest.fn().mockResolvedValue(undefined),
  getCurrentUser: jest.fn().mockResolvedValue(null),
  observeAuthState: jest.fn().mockReturnValue(() => {}),
};
