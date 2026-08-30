import { AuthUser } from "./auth.types";

export type AuthStateListener = (
  user: AuthUser | null,
) => void;

export type AuthErrorListener = (error: Error) => void;

export type AuthUnsubscribe = () => void;

export interface AuthRepository {
  signIn(
    email: string,
    password: string,
  ): Promise<AuthUser>;

  signUp(
    email: string,
    password: string,
  ): Promise<AuthUser>;

  signOut(): Promise<void>;

  getCurrentUser(): AuthUser | null;

  observeAuthState(
    listener: AuthStateListener,
    errorListener?: AuthErrorListener,
  ): AuthUnsubscribe;
}
