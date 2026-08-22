import { create } from "zustand";
import { authService } from "@features/auth/auth.dependencies";
import { AuthUser } from "@features/auth/domain/auth.types";
import { usePackageStore } from "@features/packages/store/usePackageStore";

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

function clearPackageStateWhenIdentityChanges(
  previousUserId: string | undefined,
  nextUserId: string | undefined,
): void {
  if (previousUserId === nextUserId) {
    return;
  }

  usePackageStore.getState().clearUserState();
}

export const useAuthStore = create<AuthState>(
  (set, get) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) => {
      const previousUserId = get().user?.id;
      const nextUserId = user?.id;

      clearPackageStateWhenIdentityChanges(
        previousUserId,
        nextUserId,
      );

      set({
        user,
        isAuthenticated: user !== null,
      });
    },

    login: async (email, password) => {
      const user = await authService.login(email, password);

      clearPackageStateWhenIdentityChanges(
        get().user?.id,
        user.id,
      );

      set({
        user,
        isAuthenticated: true,
      });
    },

    signup: async (email, password) => {
      const user = await authService.signup(
        email,
        password,
      );

      clearPackageStateWhenIdentityChanges(
        get().user?.id,
        user.id,
      );

      set({
        user,
        isAuthenticated: true,
      });
    },

    logout: async () => {
      await authService.logout();

      clearPackageStateWhenIdentityChanges(
        get().user?.id,
        undefined,
      );

      set({
        user: null,
        isAuthenticated: false,
      });
    },
  }),
);
