let currentUserId: string | undefined = "user-1";

export const mockAuthStore = {
  getState: () => ({
    user: currentUserId
      ? {
          id: currentUserId,
        }
      : null,
  }),
};

export function setMockCurrentUserId(
  userId: string | undefined,
) {
  currentUserId = userId;
}

export function resetAuthStoreMock() {
  currentUserId = "user-1";
}
