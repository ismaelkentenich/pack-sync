type AuthState = {
  logout: () => Promise<void>;
};

const state: AuthState = {
  logout: async () => {},
};

export function useAuthStore<T>(
  selector: (state: AuthState) => T,
): T {
  return selector(state);
}
