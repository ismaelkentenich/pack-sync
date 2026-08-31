import { authService as defaultAuthService } from "@features/auth/auth.dependencies";
import { AuthService } from "@features/auth/services/AuthService";
import {
  AuthState,
  useAuthStore,
} from "@features/auth/store/useAuthStore";

export async function logout(
  dependencies: {
    authService?: Pick<AuthService, "logout">;
    store?: Pick<AuthState, "setUser">;
  } = {},
): Promise<void> {
  const service =
    dependencies.authService ?? defaultAuthService;
  const store =
    dependencies.store ?? useAuthStore.getState();

  await service.logout();
  store.setUser(null);
}
