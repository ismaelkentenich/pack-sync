import { authService as defaultAuthService } from "@features/auth/auth.dependencies";
import { AuthService } from "@features/auth/services/AuthService";
import {
  AuthState,
  useAuthStore,
} from "@features/auth/store/useAuthStore";

export async function signup(
  email: string,
  password: string,
  dependencies: {
    authService?: Pick<AuthService, "signup">;
    store?: Pick<AuthState, "setUser">;
  } = {},
): Promise<void> {
  const service =
    dependencies.authService ?? defaultAuthService;
  const store =
    dependencies.store ?? useAuthStore.getState();

  const user = await service.signup(email, password);
  store.setUser(user);
}
