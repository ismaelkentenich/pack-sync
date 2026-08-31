import { Auth } from "firebase/auth";
import { AuthTokenProvider } from "@features/auth/domain/auth.token-provider";

export class FirebaseAuthTokenProvider implements AuthTokenProvider {
  constructor(private readonly auth: Auth) {}

  async getIdToken(
    forceRefresh = false,
  ): Promise<string | null> {
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      return null;
    }

    try {
      return await currentUser.getIdToken(forceRefresh);
    } catch {
      return null;
    }
  }
}
