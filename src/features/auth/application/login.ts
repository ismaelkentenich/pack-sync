import { authService as defaultAuthService } from "@features/auth/auth.dependencies";
import { AuthService } from "@features/auth/services/AuthService";
import {
  AuthState,
  useAuthStore,
} from "@features/auth/store/useAuthStore";

export async function login(
  email: string,
  password: string,
  dependencies: {
    authService?: Pick<AuthService, "login">;
    store?: Pick<AuthState, "setUser">;
  } = {},
): Promise<void> {
  const service =
    dependencies.authService ?? defaultAuthService;
  const store =
    dependencies.store ?? useAuthStore.getState();

  const user = await service.login(email, password);
  store.setUser(user);
}
