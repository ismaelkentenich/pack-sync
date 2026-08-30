import {
  AuthErrorListener,
  AuthRepository,
  AuthStateListener,
  AuthUnsubscribe,
} from "../domain/auth.repository";
import { AuthUser } from "../domain/auth.types";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  login(
    email: string,
    password: string,
  ): Promise<AuthUser> {
    return this.authRepository.signIn(
      email.trim(),
      password,
    );
  }

  signup(
    email: string,
    password: string,
  ): Promise<AuthUser> {
    return this.authRepository.signUp(
      email.trim(),
      password,
    );
  }

  logout(): Promise<void> {
    return this.authRepository.signOut();
  }

  getCurrentUser(): AuthUser | null {
    return this.authRepository.getCurrentUser();
  }

  observeAuthState(
    listener: AuthStateListener,
    errorListener?: AuthErrorListener,
  ): AuthUnsubscribe {
    return this.authRepository.observeAuthState(
      listener,
      errorListener,
    );
  }
}
