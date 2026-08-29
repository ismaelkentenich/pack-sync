import { create } from "zustand";
import { authService } from "@features/auth/auth.dependencies";
import { AuthUser } from "@features/auth/domain/auth.types";

export type AuthState = {
  user: AuthUser | null;
  sessionGeneration: number;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  invalidateSession: () => void;
};

export const selectIsAuthenticated = (state: {
  user: AuthUser | null;
}) => state.user !== null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  sessionGeneration: 0,

  setUser: (user) => {
    set((state) => ({
      user,
      sessionGeneration: state.sessionGeneration + 1,
    }));
  },

  invalidateSession: () => {
    set((state) => ({
      sessionGeneration: state.sessionGeneration + 1,
    }));
  },

  login: async (email, password) => {
    const user = await authService.login(email, password);

    set((state) => ({
      user,
      sessionGeneration: state.sessionGeneration + 1,
    }));
  },

  signup: async (email, password) => {
    const user = await authService.signup(email, password);

    set((state) => ({
      user,
      sessionGeneration: state.sessionGeneration + 1,
    }));
  },

  logout: async () => {
    await authService.logout();

    set((state) => ({
      user: null,
      sessionGeneration: state.sessionGeneration + 1,
    }));
  },
}));
