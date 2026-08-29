import { create } from "zustand";
import { authService } from "@features/auth/auth.dependencies";
import { AuthUser } from "@features/auth/domain/auth.types";

export type AuthState = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

export const selectIsAuthenticated = (state: {
  user: AuthUser | null;
}) => state.user !== null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => {
    set({ user });
  },

  login: async (email, password) => {
    const user = await authService.login(email, password);

    set({ user });
  },

  signup: async (email, password) => {
    const user = await authService.signup(email, password);

    set({ user });
  },

  logout: async () => {
    await authService.logout();

    set({ user: null });
  },
}));
