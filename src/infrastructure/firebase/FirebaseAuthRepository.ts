import { FirebaseError } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  AuthError,
  AuthErrorCode,
} from "@features/auth/domain/auth.errors";
import {
  AuthErrorListener,
  AuthRepository,
  AuthStateListener,
  AuthUnsubscribe,
} from "@features/auth/domain/auth.repository";
import { AuthUser } from "@features/auth/domain/auth.types";

function mapFirebaseUser(user: User): AuthUser {
  return {
    id: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
}

function mapFirebaseAuthError(error: unknown): AuthError {
  if (!(error instanceof FirebaseError)) {
    return new AuthError(AuthErrorCode.UNKNOWN);
  }

  switch (error.code) {
    case "auth/invalid-credential":
      return new AuthError(
        AuthErrorCode.INVALID_CREDENTIALS,
      );

    case "auth/user-not-found":
      return new AuthError(AuthErrorCode.USER_NOT_FOUND);

    case "auth/invalid-email":
      return new AuthError(AuthErrorCode.INVALID_EMAIL);

    case "auth/user-disabled":
      return new AuthError(AuthErrorCode.USER_DISABLED);

    case "auth/email-already-exists":
    case "auth/email-already-in-use":
      return new AuthError(
        AuthErrorCode.EMAIL_ALREADY_IN_USE,
      );

    case "auth/operation-not-allowed":
      return new AuthError(
        AuthErrorCode.OPERATION_NOT_ALLOWED,
      );

    case "auth/weak-password":
      return new AuthError(AuthErrorCode.WEAK_PASSWORD);

    default:
      return new AuthError(AuthErrorCode.UNKNOWN);
  }
}

export class FirebaseAuthRepository implements AuthRepository {
  constructor(private readonly auth: Auth) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<AuthUser> {
    try {
      const credential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      return mapFirebaseUser(credential.user);
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  }

  async signUp(
    email: string,
    password: string,
  ): Promise<AuthUser> {
    try {
      const credential =
        await createUserWithEmailAndPassword(
          this.auth,
          email,
          password,
        );

      return mapFirebaseUser(credential.user);
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  }

  getCurrentUser(): AuthUser | null {
    const user = this.auth.currentUser;

    return user ? mapFirebaseUser(user) : null;
  }

  observeAuthState(
    listener: AuthStateListener,
    errorListener?: AuthErrorListener,
  ): AuthUnsubscribe {
    return onAuthStateChanged(
      this.auth,
      (user) => {
        listener(user ? mapFirebaseUser(user) : null);
      },
      (error) => {
        errorListener?.(mapFirebaseAuthError(error));
      },
    );
  }
}
