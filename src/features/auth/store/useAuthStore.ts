import { create } from "zustand";
import { AuthUser } from "@features/auth/domain/auth.types";

export type AuthState = {
  user: AuthUser | null;
  sessionGeneration: number;
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
}));
