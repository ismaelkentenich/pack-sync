import { auth } from "@services/firebase/config";
import { getErrorMessage, isFirebaseAuthError } from "@utils/typeGuards";
import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { create } from "zustand";

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
    } catch (error) {
      let message = "Credenciais inválidas.";

      if (isFirebaseAuthError(error)) {
        switch (error.code) {
          case "auth/invalid-credential":
            message = "E-mail ou senha incorretos.";
            break;
          case "auth/user-not-found":
            message = "Usuário não encontrado.";
            break;
          case "auth/invalid-email":
            message = "E-mail inválido.";
            break;
          case "auth/user-disabled":
            message = "Conta desativada.";
            break;
          default:
            message = getErrorMessage(error, "Credenciais inválidas.");
        }
      } else {
        message = getErrorMessage(error, "Credenciais inválidas.");
      }

      throw new Error(message);
    }
  },

  signup: async (email, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      set({ user, isAuthenticated: true });
    } catch (error) {
      let message = "Não foi possível criar a conta.";

      if (isFirebaseAuthError(error)) {
        switch (error.code) {
          case "auth/email-already-exists":
          case "auth/email-already-in-use":
            message = "Este e-mail já está em uso.";
            break;
          case "auth/invalid-email":
            message = "E-mail inválido.";
            break;
          case "auth/operation-not-allowed":
            message = "Cadastro desativado no momento.";
            break;
          case "auth/weak-password":
            message = "Senha muito fraca. Use pelo menos 6 caracteres.";
            break;
          default:
            message = getErrorMessage(error, "Não foi possível criar a conta.");
        }
      } else {
        message = getErrorMessage(error, "Não foi possível criar a conta.");
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
