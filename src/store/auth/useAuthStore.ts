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
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      set({ user, isAuthenticated: true });
    } catch (error: any) {
      let message = "Credenciais inválidas.";
      if (error.code === "auth/invalid-credential") {
        message = "E-mail ou senha incorretos.";
      } else if (error.code === "auth/user-not-found") {
        message = "Usuário não encontrado.";
      } else if (error.code === "auth/invalid-email") {
        message = "E-mail inválido.";
      } else if (error.code === "auth/user-disabled") {
        message = "Conta desativada.";
      }
      throw new Error(message);
    }
  },

  signup: async (email, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      set({ user, isAuthenticated: true });
    } catch (error: any) {
      let message = "Não foi possível criar a conta.";
      if (error.code === "auth/email-already-exists") {
        message = "Este e-mail já está em uso.";
      } else if (error.code === "auth/invalid-email") {
        message = "E-mail inválido.";
      } else if (error.code === "auth/operation-not-allowed") {
        message = "Cadastro desativado no momento.";
      } else if (error.code === "auth/weak-password") {
        message = "Senha muito fraca. Use pelo menos 6 caracteres.";
      }
      throw new Error(message);
    }
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
