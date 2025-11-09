import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@services/firebase/config";

type AuthState = {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  signup: async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false });
  },

  restoreSession: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, isAuthenticated: !!user });
    });
  },
}));
