import { create } from "zustand";
import { User, getUserByEmail, insertUser } from "src/services/database/auth/users";

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
    let user = getUserByEmail(email);

    if (!user) {
      insertUser({ email });
      user = getUserByEmail(email);
    }

    set({ user, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    const user = getUserByEmail("teste@email.com");
    if (user) set({ user, isAuthenticated: true });
  },
}));
