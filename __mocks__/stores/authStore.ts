let currentUserId: string | undefined = "user-1";

export function setMockCurrentUserId(
  userId: string | undefined,
) {
  currentUserId = userId;
}

export function resetAuthStoreMock() {
  currentUserId = "user-1";
}

export const mockUseAuthStore = {
  getState: () => ({
    user: currentUserId
      ? {
          id: currentUserId,
        }
      : null,
  }),
};
