import { create } from "zustand";
import { User, getUserByEmail, getUserById, insertUser } from "@services/database/auth/users";
import { clearSession, getSessionUserId, saveSession } from "@services/database/auth/session";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email) => {
    try {
      let user = getUserByEmail(email);
      if (!user) {
        insertUser({ email });
        user = getUserByEmail(email);
      }

      if (!user?.id) throw new Error("User creation or retrieval failed");

      saveSession(user.id);
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error("[AUTH ERROR] login:", error);
    }
  },

  logout: () => {
    try {
      clearSession();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("[AUTH ERROR] logout:", error);
    }
  },

  restoreSession: async () => {
    try {
      const userId = getSessionUserId();
      if (!userId) {
        console.log("[AUTH] No session found, skipping restore");
        return;
      }

      const user = getUserById(userId);
      if (user) {
        set({ user, isAuthenticated: true });
      } else {
        console.warn("[AUTH] Session invalid — user not found");
      }
    } catch (error) {
      console.error("[AUTH ERROR] restoreSession:", error);
    }
  },
}));
