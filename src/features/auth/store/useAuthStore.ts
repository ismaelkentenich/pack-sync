import { create } from "zustand";
import { authService } from "@features/auth/auth.dependencies";
import { AuthUser } from "@features/auth/domain/auth.types";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: user !== null,
    });
  },

  login: async (email, password) => {
    const user = await authService.login(email, password);

    set({
      user,
      isAuthenticated: true,
    });
  },

  signup: async (email, password) => {
    const user = await authService.signup(email, password);

    set({
      user,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await authService.logout();

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
